#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { resolveWorkspaceRoot } from './utils/path-helpers.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = resolveWorkspaceRoot(import.meta.url);

const SNAPSHOTS_ROOT = path.resolve(repoRoot, 'context', 'temp', 'snapshots');
const WIREFRAMES_ROOT = path.resolve(repoRoot, 'src', 'wireframes');
const BUSINESS_CONTEXT_PATH = path.resolve(repoRoot, 'context', 'BUSINESS-CONTEXT.md');
const BUSINESS_CONTEXT_JSON_PATH = path.resolve(repoRoot, 'context', 'temp', 'business-context.json');

const MAX_SNAPSHOT_AGE_DAYS = 7;
const MIN_SNAPSHOTS_TO_KEEP = 3;

async function main() {
  const options = parseArgs(process.argv.slice(2));

  if (options.help) {
    printHelp();
    process.exit(0);
  }

  if (options.list) {
    await listSnapshots(options);
  } else if (options.restore) {
    await restoreSnapshot(options);
  } else {
    await createSnapshot(options);
  }
}

function parseArgs(argv) {
  const options = {
    project: null,
    timestamp: null,
    description: null,
    list: false,
    restore: false,
    dryRun: false,
    help: false
  };

  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    if (token.startsWith('--project=')) {
      options.project = token.split('=')[1];
    } else if (token.startsWith('--timestamp=')) {
      options.timestamp = token.split('=')[1];
    } else if (token.startsWith('--description=')) {
      options.description = token.split('=')[1];
    } else if (token === '--list') {
      options.list = true;
    } else if (token === '--restore') {
      options.restore = true;
    } else if (token === '--dry-run') {
      options.dryRun = true;
    } else if (token === '--help' || token === '-h') {
      options.help = true;
    } else {
      console.warn(`Unknown option: ${token}`);
      printHelp();
      process.exit(1);
    }
  }

  return options;
}

async function createSnapshot(options) {
  if (!options.project) {
    console.error('Error: --project is required for snapshot creation');
    printHelp();
    process.exit(1);
  }

  const projectPath = path.join(WIREFRAMES_ROOT, options.project);
  try {
    await fs.access(projectPath);
  } catch (error) {
    console.error(`Error: Project not found: ${options.project}`);
    process.exit(1);
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T').join('_').slice(0, -5);
  const snapshotDir = path.join(SNAPSHOTS_ROOT, options.project, timestamp);

  console.log(`📸 Creating snapshot: ${options.project} @ ${timestamp}`);

  await fs.mkdir(snapshotDir, { recursive: true });

  // Copy wireframe project
  const projectCopyPath = path.join(snapshotDir, 'wireframe-project');
  await copyDirectory(projectPath, projectCopyPath);
  console.log(`  ✓ Wireframe project copied`);

  // Copy business context if it exists
  try {
    await fs.access(BUSINESS_CONTEXT_PATH);
    await fs.copyFile(BUSINESS_CONTEXT_PATH, path.join(snapshotDir, 'BUSINESS-CONTEXT.md'));
    console.log(`  ✓ Business context copied`);
  } catch (error) {
    console.log(`  ℹ️  Business context not found, skipped`);
  }

  // Copy business context JSON if it exists
  try {
    await fs.access(BUSINESS_CONTEXT_JSON_PATH);
    await fs.copyFile(BUSINESS_CONTEXT_JSON_PATH, path.join(snapshotDir, 'business-context.json'));
    console.log(`  ✓ Business context JSON copied`);
  } catch (error) {
    console.log(`  ℹ️  Business context JSON not found, skipped`);
  }

  // Create snapshot metadata
  const metadata = {
    timestamp,
    project: options.project,
    description: options.description || 'Manual snapshot',
    created: new Date().toISOString(),
    files: await countFiles(snapshotDir)
  };
  await fs.writeFile(
    path.join(snapshotDir, 'snapshot.json'),
    JSON.stringify(metadata, null, 2),
    'utf8'
  );

  console.log(`✅ Snapshot created: ${timestamp}`);

  // Auto-cleanup old snapshots
  await cleanupOldSnapshots(options.project);
}

async function listSnapshots(options) {
  if (!options.project) {
    console.error('Error: --project is required for listing snapshots');
    printHelp();
    process.exit(1);
  }

  const projectSnapshotsDir = path.join(SNAPSHOTS_ROOT, options.project);

  try {
    await fs.access(projectSnapshotsDir);
  } catch (error) {
    console.log(`No snapshots found for project: ${options.project}`);
    return;
  }

  const entries = await fs.readdir(projectSnapshotsDir);
  if (entries.length === 0) {
    console.log(`No snapshots found for project: ${options.project}`);
    return;
  }

  console.log(`\nSnapshots for ${options.project}:\n`);

  const snapshots = [];
  for (const entry of entries) {
    const snapshotPath = path.join(projectSnapshotsDir, entry);
    const metadataPath = path.join(snapshotPath, 'snapshot.json');

    try {
      const stats = await fs.stat(snapshotPath);
      if (stats.isDirectory()) {
        const metadata = JSON.parse(await fs.readFile(metadataPath, 'utf8'));
        snapshots.push({ ...metadata, timestamp: entry });
      }
    } catch (error) {
      // Skip invalid snapshots
    }
  }

  snapshots.sort((a, b) => new Date(b.created) - new Date(a.created));

  for (const snapshot of snapshots) {
    const age = getSnapshotAge(snapshot.created);
    console.log(`  ${snapshot.timestamp}`);
    console.log(`    Created: ${new Date(snapshot.created).toLocaleString()}`);
    console.log(`    Age: ${age}`);
    console.log(`    Description: ${snapshot.description}`);
    console.log(`    Files: ${snapshot.files}`);
    console.log();
  }
}

async function restoreSnapshot(options) {
  if (!options.project || !options.timestamp) {
    console.error('Error: --project and --timestamp are required for restore');
    printHelp();
    process.exit(1);
  }

  const snapshotDir = path.join(SNAPSHOTS_ROOT, options.project, options.timestamp);

  try {
    await fs.access(snapshotDir);
  } catch (error) {
    console.error(`Error: Snapshot not found: ${options.project} @ ${options.timestamp}`);
    process.exit(1);
  }

  console.log(`🔄 Restoring snapshot: ${options.project} @ ${options.timestamp}`);

  // Create backup of current state first
  const backupTimestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T').join('_').slice(0, -5);
  const backupDir = path.join(SNAPSHOTS_ROOT, options.project, `backup-${backupTimestamp}`);

  const projectPath = path.join(WIREFRAMES_ROOT, options.project);

  try {
    await fs.access(projectPath);
    if (!options.dryRun) {
      await fs.mkdir(backupDir, { recursive: true });
      await copyDirectory(projectPath, path.join(backupDir, 'wireframe-project'));

      // Backup business context if it exists
      try {
        await fs.access(BUSINESS_CONTEXT_PATH);
        await fs.copyFile(BUSINESS_CONTEXT_PATH, path.join(backupDir, 'BUSINESS-CONTEXT.md'));
      } catch (error) {
        // Skip if not found
      }

      const backupMetadata = {
        timestamp: backupTimestamp,
        project: options.project,
        description: `Auto-backup before restore to ${options.timestamp}`,
        created: new Date().toISOString()
      };
      await fs.writeFile(
        path.join(backupDir, 'snapshot.json'),
        JSON.stringify(backupMetadata, null, 2),
        'utf8'
      );
      console.log(`  ✓ Current state backed up to: backup-${backupTimestamp}`);
    } else {
      console.log(`  [DRY RUN] Would backup current state to: backup-${backupTimestamp}`);
    }
  } catch (error) {
    console.log(`  ℹ️  No existing project to backup`);
  }

  if (options.dryRun) {
    console.log(`\n[DRY RUN] Would restore:`);
    console.log(`  - Wireframe project to: ${projectPath}`);
    console.log(`  - Business context to: ${BUSINESS_CONTEXT_PATH}`);
    return;
  }

  // Restore wireframe project
  await fs.rm(projectPath, { recursive: true, force: true });
  await copyDirectory(path.join(snapshotDir, 'wireframe-project'), projectPath);
  console.log(`  ✓ Wireframe project restored`);

  // Restore business context if it exists in snapshot
  const snapshotBusinessContext = path.join(snapshotDir, 'BUSINESS-CONTEXT.md');
  try {
    await fs.access(snapshotBusinessContext);
    await fs.copyFile(snapshotBusinessContext, BUSINESS_CONTEXT_PATH);
    console.log(`  ✓ Business context restored`);
  } catch (error) {
    console.log(`  ℹ️  No business context in snapshot, skipped`);
  }

  // Restore business context JSON if it exists in snapshot
  const snapshotBusinessContextJson = path.join(snapshotDir, 'business-context.json');
  try {
    await fs.access(snapshotBusinessContextJson);
    await fs.mkdir(path.dirname(BUSINESS_CONTEXT_JSON_PATH), { recursive: true });
    await fs.copyFile(snapshotBusinessContextJson, BUSINESS_CONTEXT_JSON_PATH);
    console.log(`  ✓ Business context JSON restored`);
  } catch (error) {
    console.log(`  ℹ️  No business context JSON in snapshot, skipped`);
  }

  console.log(`✅ Snapshot restored successfully`);
}

async function cleanupOldSnapshots(projectSlug) {
  const projectSnapshotsDir = path.join(SNAPSHOTS_ROOT, projectSlug);

  try {
    await fs.access(projectSnapshotsDir);
  } catch (error) {
    return; // No snapshots to clean
  }

  const entries = await fs.readdir(projectSnapshotsDir);
  const snapshots = [];

  for (const entry of entries) {
    // Skip backup snapshots
    if (entry.startsWith('backup-')) continue;

    const snapshotPath = path.join(projectSnapshotsDir, entry);
    const metadataPath = path.join(snapshotPath, 'snapshot.json');

    try {
      const stats = await fs.stat(snapshotPath);
      if (stats.isDirectory()) {
        const metadata = JSON.parse(await fs.readFile(metadataPath, 'utf8'));
        snapshots.push({
          timestamp: entry,
          created: new Date(metadata.created),
          path: snapshotPath
        });
      }
    } catch (error) {
      // Skip invalid snapshots
    }
  }

  if (snapshots.length <= MIN_SNAPSHOTS_TO_KEEP) {
    return; // Keep all if at or below minimum
  }

  // Sort by creation date (newest first)
  snapshots.sort((a, b) => b.created - a.created);

  const now = new Date();
  const maxAgeMs = MAX_SNAPSHOT_AGE_DAYS * 24 * 60 * 60 * 1000;
  let removed = 0;

  for (let i = MIN_SNAPSHOTS_TO_KEEP; i < snapshots.length; i++) {
    const age = now - snapshots[i].created;
    if (age > maxAgeMs) {
      await fs.rm(snapshots[i].path, { recursive: true, force: true });
      console.log(`  🧹 Cleaned up old snapshot: ${snapshots[i].timestamp}`);
      removed++;
    }
  }

  if (removed > 0) {
    console.log(`  ✓ Removed ${removed} old snapshot(s)`);
  }
}

async function copyDirectory(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

async function countFiles(dir) {
  let count = 0;
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      count += await countFiles(path.join(dir, entry.name));
    } else {
      count++;
    }
  }

  return count;
}

function getSnapshotAge(created) {
  const now = new Date();
  const createdDate = new Date(created);
  const ageMs = now - createdDate;

  const days = Math.floor(ageMs / (24 * 60 * 60 * 1000));
  const hours = Math.floor((ageMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));

  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''}, ${hours} hour${hours > 1 ? 's' : ''}`;
  } else {
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  }
}

function printHelp() {
  console.log(`Usage: npm run snapshot -- [options]

Operations:
  Create snapshot (default):
    npm run snapshot -- --project=PROJECT_SLUG [--description="Description"]

  List snapshots:
    npm run snapshot:list -- --project=PROJECT_SLUG

  Restore snapshot:
    npm run snapshot:restore -- --project=PROJECT_SLUG --timestamp=TIMESTAMP [--dry-run]

Options:
  --project=SLUG         Project slug (required)
  --timestamp=TS         Snapshot timestamp (required for restore)
  --description=DESC     Optional description for snapshot
  --list                 List all snapshots for project
  --restore              Restore a snapshot
  --dry-run              Preview restore without making changes
  --help, -h             Show this message

Auto-cleanup:
  - Runs on every snapshot create
  - Deletes snapshots older than ${MAX_SNAPSHOT_AGE_DAYS} days
  - Always keeps ${MIN_SNAPSHOTS_TO_KEEP} most recent snapshots

Examples:
  npm run snapshot -- --project=mining-tech-survey
  npm run snapshot:list -- --project=mining-tech-survey
  npm run snapshot:restore -- --project=mining-tech-survey --timestamp=2025-10-07_14-30-00
`);
}

main().catch((error) => {
  console.error('Snapshot operation failed');
  console.error(error);
  process.exit(1);
});
