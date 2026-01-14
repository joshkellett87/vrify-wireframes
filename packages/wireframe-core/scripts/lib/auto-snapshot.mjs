import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { resolveProjectPath, resolveWorkspaceRoot } from '../utils/path-helpers.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = resolveWorkspaceRoot(import.meta.url);

const MAX_SNAPSHOT_AGE_DAYS = 7;
const MIN_SNAPSHOTS_TO_KEEP = 3;

/**
 * Creates an automatic snapshot for a wireframe project.
 * Used by scripts to auto-snapshot before making changes.
 *
 * @param {string} projectSlug - The wireframe project slug
 * @param {string} [description] - Optional description for the snapshot
 * @param {boolean} [silent] - If true, suppresses console output
 * @returns {Promise<string>} The snapshot timestamp
 */
export async function createAutoSnapshot(projectSlug, description = 'Auto-snapshot', silent = false) {
  const projectPath = resolveProjectPath(
    import.meta.url,
    `src/wireframes/${projectSlug}`,
    { project: projectSlug }
  );
  const snapshotsRoot = resolveProjectPath(
    import.meta.url,
    'context/temp/snapshots',
    { project: projectSlug }
  );
  const businessContextPath = resolveProjectPath(
    import.meta.url,
    'context/BUSINESS-CONTEXT.md',
    { project: projectSlug }
  );
  const businessContextJsonPath = resolveProjectPath(
    import.meta.url,
    'context/temp-agent-outputs/business-context.json',
    { project: projectSlug }
  );

  try {
    await fs.access(projectPath);
  } catch (error) {
    if (!silent) {
      console.warn(`⚠️  Project not found: ${projectSlug}, skipping snapshot`);
    }
    return null;
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T').join('_').slice(0, -5);
  const snapshotDir = path.join(snapshotsRoot, projectSlug, timestamp);

  if (!silent) {
    console.log(`📸 Auto-snapshot: ${projectSlug} @ ${timestamp}`);
  }

  await fs.mkdir(snapshotDir, { recursive: true });

  // Copy wireframe project
  const projectCopyPath = path.join(snapshotDir, 'wireframe-project');
  await copyDirectory(projectPath, projectCopyPath);

  // Copy business context if it exists
  try {
    await fs.access(businessContextPath);
    await fs.copyFile(businessContextPath, path.join(snapshotDir, 'BUSINESS-CONTEXT.md'));
  } catch (error) {
    // Skip if not found
  }

  // Copy business context JSON if it exists
  try {
    await fs.access(businessContextJsonPath);
    await fs.copyFile(
      businessContextJsonPath,
      path.join(snapshotDir, 'business-context.json')
    );
  } catch (error) {
    // Skip if not found
  }

  // Create snapshot metadata
  const metadata = {
    timestamp,
    project: projectSlug,
    description,
    created: new Date().toISOString(),
    files: await countFiles(snapshotDir)
  };
  await fs.writeFile(
    path.join(snapshotDir, 'snapshot.json'),
    JSON.stringify(metadata, null, 2),
    'utf8'
  );

  // Auto-cleanup old snapshots
  await cleanupOldSnapshots(projectSlug, silent);

  return timestamp;
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

async function cleanupOldSnapshots(projectSlug, silent = false) {
  const snapshotsRoot = resolveProjectPath(
    import.meta.url,
    'context/temp/snapshots',
    { project: projectSlug }
  );
  const projectSnapshotsDir = path.join(snapshotsRoot, projectSlug);

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
      if (!silent) {
        console.log(`  🧹 Cleaned up old snapshot: ${snapshots[i].timestamp}`);
      }
      removed++;
    }
  }

  if (removed > 0 && !silent) {
    console.log(`  ✓ Removed ${removed} old snapshot(s)`);
  }
}
