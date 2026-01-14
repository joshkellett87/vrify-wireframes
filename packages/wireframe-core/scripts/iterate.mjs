#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline/promises';
import { createAutoSnapshot } from './lib/auto-snapshot.mjs';
import {
  resolveProjectPath,
  resolveProjectRoot,
  resolveProjectSlug,
  resolveWorkspaceRoot
} from './utils/path-helpers.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = resolveWorkspaceRoot(import.meta.url);

function ensureDir(p) { fs.mkdirSync(p, { recursive: true }); }
function copyDir(src, dest) {
  if (!fs.existsSync(src)) throw new Error(`Source not found: ${src}`);
  ensureDir(dest);
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

function readJson(p) { return JSON.parse(fs.readFileSync(p, 'utf8')); }
function writeJson(p, obj) { fs.writeFileSync(p, JSON.stringify(obj, null, 2), 'utf8'); }

function parseArgs() {
  const args = process.argv.slice(2);
  const out = { from: null, to: null, applyRoutes: null, copy: null, changeLog: null, project: null };
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a.startsWith('--from=')) out.from = a.split('=')[1];
    else if (a.startsWith('--new=')) out.to = a.split('=')[1];
    else if (a.startsWith('--apply-routes=')) out.applyRoutes = a.split('=')[1];
    else if (a.startsWith('--copy=')) out.copy = a.split('=')[1];
    else if (a.startsWith('--change-log=')) out.changeLog = a.split('=')[1];
    else if (a === '--project') out.project = args[++i];
    else if (a.startsWith('--project=')) out.project = a.split('=')[1];
  }
  return out;
}

function bumpVersion(v) {
  if (!v) return '2.0.0';
  const m = v.match(/^(\d+)\.(\d+)\.(\d+)/);
  if (!m) return '2.0.0';
  return `${m[1]}.${m[2]}.${parseInt(m[3] || '0', 10) + 1}`;
}

function pascalCase(s) { return s.split(/[-_\s]+/).map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(''); }

function updateAppTsx({ slug, mode, projectRoot }) {
  const appPath = path.join(projectRoot, 'src', 'App.tsx');
  if (!fs.existsSync(appPath)) { console.warn('! Skipping App.tsx update: not found'); return; }
  const backup = appPath + '.bak.' + Date.now();
  const content = fs.readFileSync(appPath, 'utf8');
  const importPrefix = pascalCase(slug);
  const importBlock = [
    `import ${importPrefix}Index from "./wireframes/${slug}/pages/Index";`,
    `import ${importPrefix}OptionA from "./wireframes/${slug}/pages/OptionA";`,
    `import ${importPrefix}OptionB from "./wireframes/${slug}/pages/OptionB";`,
    `import ${importPrefix}OptionC from "./wireframes/${slug}/pages/OptionC";`,
    `import ${importPrefix}Resources from "./wireframes/${slug}/pages/Resources";`
  ];
  let updated = content;
  if (!updated.includes(`./wireframes/${slug}/pages/Index`)) {
    const lines = updated.split('\n');
    let lastImportIdx = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('import ')) lastImportIdx = i;
      if (lines[i].startsWith('const queryClient')) break;
    }
    if (lastImportIdx >= 0) {
      lines.splice(lastImportIdx + 1, 0, ...importBlock);
      updated = lines.join('\n');
    }
  }
  const ns = mode === 'namespace';
  const base = ns ? `/${slug}` : '';
  const routeBlock = [
    `          <Route path="${base || '/'}" element={<${importPrefix}Index />} />`,
    `          <Route path="${base}/option-a" element={<${importPrefix}OptionA />} />`,
    `          <Route path="${base}/option-b" element={<${importPrefix}OptionB />} />`,
    `          <Route path="${base}/option-c" element={<${importPrefix}OptionC />} />`,
    `          <Route path="${base}/resources" element={<${importPrefix}Resources />} />`
  ].join('\n');
  if (!updated.includes(`<Route path="${base || '/'}" element={<${importPrefix}Index />}`)) {
    const lines = updated.split('\n');
    let catchAllIdx = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('path="*"') && lines[i].includes('NotFound')) { catchAllIdx = i; break; }
    }
    if (catchAllIdx !== -1) {
      lines.splice(catchAllIdx, 0, routeBlock);
      updated = lines.join('\n');
    }
  }
  if (updated !== content) {
    fs.copyFileSync(appPath, backup);
    fs.writeFileSync(appPath, updated, 'utf8');
    console.log(`✓ App.tsx updated (${mode}) — backup: ${path.basename(backup)}`);
  } else {
    console.log('• App.tsx already contained routes or update not needed.');
  }
}

async function main() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  try {
    const args = parseArgs();
    if (!args.from || !args.to) throw new Error('--from and --new are required');

    const projectSlug = resolveProjectSlug(import.meta.url, { project: args.project });
    const projectRoot = resolveProjectRoot(import.meta.url, { project: projectSlug });

    let copyMode = args.copy;
    if (!copyMode) {
      const ans = (await rl.question('Preserve existing copy or convert to lorem? (preserve/lorem) [preserve]: ')).trim().toLowerCase();
      copyMode = (ans === 'lorem' || ans === 'preserve') ? ans : 'preserve';
    }

    const fromDir = resolveProjectPath(
      import.meta.url,
      `src/wireframes/${args.from}`,
      { project: projectSlug }
    );
    const toDir = resolveProjectPath(
      import.meta.url,
      `src/wireframes/${args.to}`,
      { project: projectSlug }
    );
    if (fs.existsSync(toDir)) throw new Error(`Destination exists: ${toDir}`);

    // Auto-snapshot baseline project before iteration
    await createAutoSnapshot(args.from, `Before iteration to ${args.to}`);

    copyDir(fromDir, toDir);

    const metaPath = path.join(toDir, 'metadata.json');
    if (fs.existsSync(metaPath)) {
      const meta = readJson(metaPath);
      const prevVersion = meta.version || '1.0.0';
      meta.originType = 'wireframe';
      meta.derivedFrom = `${args.from}@${prevVersion}`;
      meta.version = bumpVersion(prevVersion);
      meta.lastUpdated = new Date().toISOString().slice(0,10);
      if (args.changeLog) {
        meta.changeLog = meta.changeLog || [];
        meta.changeLog.push({ date: meta.lastUpdated, author: '', summary: args.changeLog, sectionsChanged: [] });
      }
      writeJson(metaPath, meta);
    }

    if (copyMode === 'lorem') {
      console.log('• Copy mode set to lorem — leaving content placeholderization to iteration steps (no destructive sweep applied).');
    }

    if (args.applyRoutes === 'root' || args.applyRoutes === 'namespace') {
      updateAppTsx({ slug: args.to, mode: args.applyRoutes, projectRoot });
    }

    console.log(`\n✓ Iteration scaffolded: ${path.relative(projectRoot, toDir)}`);
  } catch (err) {
    console.error(`✗ ${err.message}`);
    process.exitCode = 1;
  }
}

main();
