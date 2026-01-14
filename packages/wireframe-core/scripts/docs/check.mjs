#!/usr/bin/env node
import { lstat, readlink } from 'node:fs/promises';
import { resolve } from 'node:path';

const packageRoot = resolve(process.cwd());
const repoRoot = resolve(packageRoot, '..', '..');
const CLAUDE = resolve(repoRoot, 'CLAUDE.md');
const AGENTS = resolve(repoRoot, 'AGENTS.md');

async function main() {
  try {
    // Check if CLAUDE.md exists and is a symlink
    const stats = await lstat(CLAUDE);

    if (!stats.isSymbolicLink()) {
      console.error('Error: CLAUDE.md is not a symlink to AGENTS.md');
      console.error('Expected: CLAUDE.md -> AGENTS.md');
      console.error('Run: ln -s AGENTS.md CLAUDE.md');
      process.exit(1);
    }

    // Verify it points to AGENTS.md
    const target = await readlink(CLAUDE);
    if (target !== 'AGENTS.md') {
      console.error(`Error: CLAUDE.md symlink points to "${target}" instead of "AGENTS.md"`);
      console.error('Run: ln -sf AGENTS.md CLAUDE.md');
      process.exit(1);
    }

    console.log('✓ Docs check passed: CLAUDE.md correctly symlinked to AGENTS.md');
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.error('Error: CLAUDE.md not found');
      console.error('Run: ln -s AGENTS.md CLAUDE.md');
      process.exit(1);
    }
    throw err;
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
