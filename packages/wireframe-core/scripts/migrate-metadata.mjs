#!/usr/bin/env node

import { readFileSync, writeFileSync, readdirSync, existsSync, copyFileSync } from 'fs';
import { join, relative } from 'path';
import { execSync } from 'child_process';
import {
  resolveProjectPath,
  resolveProjectRoot,
  resolveProjectSlug
} from './utils/path-helpers.mjs';

const args = process.argv.slice(2);
const projectArgIndex = args.findIndex(arg => arg === '--project' || arg.startsWith('--project='));
let projectOverride = null;
if (projectArgIndex !== -1) {
  const token = args[projectArgIndex];
  if (token === '--project') {
    projectOverride = args[projectArgIndex + 1];
    args.splice(projectArgIndex, 2);
  } else {
    projectOverride = token.split('=')[1];
    args.splice(projectArgIndex, 1);
  }
}

const projectSlug = resolveProjectSlug(import.meta.url, { project: projectOverride });
const projectRoot = resolveProjectRoot(import.meta.url, { project: projectSlug });
const wireframesDir = resolveProjectPath(import.meta.url, 'src/wireframes', { project: projectSlug });
const isDryRun = args.includes('--dry-run');
const isInteractive = args.includes('--interactive');

console.log('🔄 Migrating metadata files to v2.0...\n');
console.log(`📁 Project: ${projectSlug}\n`);

if (isDryRun) {
  console.log('🔍 DRY RUN MODE - No files will be modified\n');
}

// Import migration functions
const { migrateToV2, isSchemaV2 } = await import('../src/shared/lib/metadata-schema.mjs');

// Check for uncommitted changes
if (!isDryRun) {
  try {
    const gitStatus = execSync('git status --porcelain', { encoding: 'utf-8' });
    if (gitStatus.trim()) {
      console.error('❌ Uncommitted changes detected. Please commit or stash before migrating.\n');
      console.error('Run: git status\n');
      process.exit(1);
    }
  } catch (error) {
    console.warn('⚠️  Could not check git status. Continuing anyway...\n');
  }
}

const projects = readdirSync(wireframesDir)
  .filter(name => !name.startsWith('.'))
  .filter(name => {
    try {
      return readdirSync(join(wireframesDir, name)).includes('metadata.json');
    } catch {
      return false;
    }
  });

let migrated = 0;
let skipped = 0;
let failed = 0;

for (const project of projects) {
  const metadataPath = join(wireframesDir, project, 'metadata.json');
  const backupPath = metadataPath + '.v1.backup';

  console.log(`📋 ${project}`);

  try {
    const rawMetadata = readFileSync(metadataPath, 'utf-8');
    const metadata = JSON.parse(rawMetadata);

    if (isSchemaV2(metadata)) {
      console.log('  ⏭️  Already v2.0, skipping\n');
      skipped++;
      continue;
    }

    const v2Metadata = migrateToV2(metadata);
    const v2JSON = JSON.stringify(v2Metadata, null, 2) + '\n';

    if (isDryRun) {
      console.log('  📄 Would migrate to:');
      const preview = v2JSON.split('\n').slice(0, 8).join('\n     ');
      console.log('     ' + preview);
      console.log('     ...\n');
      migrated++;
      continue;
    }

    if (isInteractive) {
      console.log('\n  Preview (first 15 lines):');
      const preview = v2JSON.split('\n').slice(0, 15).join('\n  ');
      console.log('  ' + preview);
      console.log('  ...\n');

      // Note: Real interactive mode would use readline here
      // For now, just show preview and auto-proceed
      console.log('  ℹ️  Use --dry-run to preview without changes\n');
    }

    // Create backup
    if (!existsSync(backupPath)) {
      copyFileSync(metadataPath, backupPath);
      console.log(`  💾 Backup: ${backupPath}`);
    }

    // Write migrated metadata
    writeFileSync(metadataPath, v2JSON, 'utf-8');

    console.log('  ✅ Migrated to v2.0\n');
    migrated++;

  } catch (error) {
    failed++;
    console.log(`  ❌ Migration failed: ${error.message}\n`);
  }
}

console.log('📊 Summary:');
console.log(`   Total:    ${projects.length}`);
console.log(`   Migrated: ${migrated}`);
console.log(`   Skipped:  ${skipped}`);
console.log(`   Failed:   ${failed}`);

if (!isDryRun && migrated > 0) {
  console.log(`\n💾 Backups saved with .v1.backup extension`);
  console.log(`\n✅ Next steps:`);
  console.log(
    `   1. Review changes: git diff ${relative(
      process.cwd(),
      join(projectRoot, 'src', 'wireframes')
    )}/*/metadata.json`
  );
  console.log(`   2. Validate: npm run validate:metadata --workspace projects/${projectSlug}`);
  console.log(
    `   3. Commit: git add ${relative(
      process.cwd(),
      join(projectRoot, 'src', 'wireframes')
    )}/*/metadata.json`
  );
  console.log(`   4. Commit: git commit -m "chore: migrate metadata to schema v2.0"`);
  console.log(`\n⚠️  To rollback:`);
  console.log(
    `   git checkout -- ${relative(
      process.cwd(),
      join(projectRoot, 'src', 'wireframes')
    )}/*/metadata.json`
  );
}

if (isDryRun) {
  console.log(`\n✅ Dry run complete. Run without --dry-run to apply changes.\n`);
}

console.log('');

if (failed > 0) {
  process.exit(1);
}
