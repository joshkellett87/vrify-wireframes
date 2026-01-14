#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import { resolveProjectSlug } from '../packages/wireframe-core/scripts/utils/path-helpers.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function parseArgs(argv) {
  const [command, ...rest] = argv;
  if (!command) {
    console.error('[run-with-project] Missing script name. Usage: node scripts/run-with-project.mjs <script> [--project <slug>] [-- ...args]');
    process.exit(1);
  }

  let explicitProject = null;
  const forwarded = [];

  for (let i = 0; i < rest.length; i += 1) {
    const token = rest[i];
    if (token === '--project') {
      explicitProject = rest[i + 1];
      i += 1;
      continue;
    }
    if (token?.startsWith('--project=')) {
      explicitProject = token.split('=')[1];
      continue;
    }
    forwarded.push(token);
  }

  return { command, forwarded, explicitProject };
}

function resolveProject(explicitProject) {
  try {
    const slug = resolveProjectSlug(import.meta.url, explicitProject ? { project: explicitProject } : {});
    if (!slug) {
      console.error('[run-with-project] No project workspace detected.');
      console.error('Tip: scaffold a project with `npm run scaffold -- --project <slug>` or pass --project <slug>.');
      process.exit(1);
    }
    return slug;
  } catch (error) {
    console.error(`[run-with-project] ${error.message}`);
    console.error('Tip: create a project with `npm run scaffold -- --project <slug>` or pass --project <slug>.');
    process.exit(1);
  }
}

function run(command, workspace, args) {
  const child = spawn(
    'npm',
    ['run', command, '--workspace', workspace, '--', ...args],
    {
      stdio: 'inherit',
      cwd: path.resolve(__dirname, '..'),
    }
  );

  child.on('close', (code) => {
    process.exit(code ?? 0);
  });

  child.on('error', (error) => {
    console.error(`[run-with-project] Failed to execute npm: ${error.message}`);
    process.exit(1);
  });
}

const { command, forwarded, explicitProject } = parseArgs(process.argv.slice(2));
const projectSlug = resolveProject(explicitProject);
const workspaceSpecifier = `projects/${projectSlug}`;

run(command, workspaceSpecifier, forwarded);
