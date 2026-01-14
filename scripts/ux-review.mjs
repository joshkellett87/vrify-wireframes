#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { ensureDir, pathExists } from '../packages/wireframe-core/scripts/agents/fs-utils.mjs';
import { getAgentPrompt, prepareAgentPromptFile } from '../packages/wireframe-core/scripts/agents/prompt.mjs';
import { resolveProjectSlug } from '../packages/wireframe-core/scripts/utils/path-helpers.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    switch (token) {
      case '--project':
        args.project = argv[++i];
        break;
      case '--variant':
        args.variant = argv[++i];
        break;
      case '--dom':
        args.dom = argv[++i];
        break;
      case '--screenshot':
        args.screenshot = argv[++i];
        break;
      case '--change-log':
        args.changeLog = argv[++i];
        break;
      case '--help':
      case '-h':
        args.help = true;
        break;
      default:
        if (!token.startsWith('--')) {
          args._ = args._ || [];
          args._.push(token);
        }
        break;
    }
  }
  return args;
}

function printUsage() {
  console.log(`UX Review prompt helper

Usage:
  npm run ux:review -- --project <slug> --variant <key> [--dom <path>] [--screenshot <path>] [--change-log <path>]

Outputs:
  - JSON review → context/temp-agent-outputs/ux-review/<project>/<variant>.json
  - Markdown log → context/temp-agent-outputs/ux-review/<project>/<variant>.md
  - Prompt file  → context/temp-agent-outputs/prompts/<project>-<variant>-ux-review.prompt.md
`);
}

function resolvePath(basePath) {
  if (!basePath) return null;
  if (path.isAbsolute(basePath)) return basePath;
  return path.resolve(repoRoot, basePath);
}

function defaultChangeLogPath(project, variant) {
  return path.resolve(
    repoRoot,
    'context',
    'temp-agent-outputs',
    project,
    'ux-review',
    `${variant}-log.md`
  );
}

function ensureChangeLog(pathToLog, project, variant) {
  if (!pathExists(pathToLog)) {
    const header = `# UX Review Log — ${project} (${variant})\n\n`;
    fs.writeFileSync(pathToLog, header, 'utf8');
  }
}

function buildPromptContents({ prompt, project, variant, dom, screenshot, jsonPath, markdownPath, changeLogPath }) {
  const lines = [];
  lines.push(`# UX Review Prompt — ${project}/${variant}`);
  lines.push('');
  lines.push('```prompt');
  lines.push(prompt);
  lines.push('```');
  lines.push('');
  lines.push('## Context Summary');
  lines.push(`- Project slug: ${project}`);
  lines.push(`- Variant key: ${variant}`);
  lines.push(
    `- DOM snapshot: ${dom ? path.relative(repoRoot, dom) : '_not provided_'}`);
  lines.push(
    `- Screenshot: ${screenshot ? path.relative(repoRoot, screenshot) : '_not provided_'}`);
  lines.push(`- JSON output: ${path.relative(repoRoot, jsonPath)}`);
  lines.push(`- Markdown summary/log: ${path.relative(repoRoot, markdownPath)}`);
  lines.push(`- Change log: ${path.relative(repoRoot, changeLogPath)}`);
  lines.push('');
  lines.push('Deliverables:');
  lines.push(`- Write JSON review to ${path.relative(repoRoot, jsonPath)}`);
  lines.push(`- Append Markdown digest to ${path.relative(repoRoot, markdownPath)}`);
  lines.push(
    `- Update the shared change log with next steps at ${path.relative(repoRoot, changeLogPath)}`
  );
  return `${lines.join('\n')}\n`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printUsage();
    return;
  }

  let project = args.project;
  const variant = args.variant;

  if (!project) {
    try {
      project = resolveProjectSlug(import.meta.url);
    } catch {
      project = null;
    }
  }

  if (!project || !variant) {
    printUsage();
    process.exit(1);
  }

  const promptData = getAgentPrompt('ux-review');

  const reviewDir = path.resolve(
    repoRoot,
    'context',
    'temp-agent-outputs',
    'ux-review',
    project
  );
  ensureDir(reviewDir);

  const jsonPath = path.join(reviewDir, `${variant}.json`);
  const markdownPath = path.join(reviewDir, `${variant}.md`);

  const changeLogExplicit = resolvePath(args.changeLog);
  const changeLogPath = changeLogExplicit || defaultChangeLogPath(project, variant);
  ensureDir(path.dirname(changeLogPath));
  ensureChangeLog(changeLogPath, project, variant);

  const domPath = resolvePath(args.dom);
  const screenshotPath = resolvePath(args.screenshot);

  const promptsDir = path.resolve(
    repoRoot,
    'context',
    'temp-agent-outputs',
    'prompts'
  );
  ensureDir(promptsDir);
  const promptPath = prepareAgentPromptFile({
    agentName: 'ux-review',
    projectSlug: `${project}-${variant}`
  });

  const customPromptPath = path.join(
    promptsDir,
    `${project}-${variant}-ux-review.prompt.md`
  );
  const contents = buildPromptContents({
    prompt: promptData.prompt,
    project,
    variant,
    dom: domPath,
    screenshot: screenshotPath,
    jsonPath,
    markdownPath,
    changeLogPath
  });
  fs.writeFileSync(customPromptPath, contents, 'utf8');

  console.log(`UX Review setup complete for ${project}/${variant}\n`);
  console.log('Outputs to generate:');
  console.log(`- JSON: ${path.relative(repoRoot, jsonPath)}`);
  console.log(`- Markdown: ${path.relative(repoRoot, markdownPath)}`);
  console.log(`- Change log: ${path.relative(repoRoot, changeLogPath)}`);
  console.log('');
  console.log('Prompt files:');
  console.log(`- Base prompt copied to ${path.relative(repoRoot, promptPath)}`);
  console.log(`- Context prompt written to ${path.relative(repoRoot, customPromptPath)}`);
  console.log('');
  console.log('Next steps:');
  console.log(`1. Run the ux-review agent using ${path.relative(repoRoot, customPromptPath)} as context.`);
  console.log(`2. Save JSON + Markdown outputs to the paths above.`);
  console.log('3. Append outcome notes to the change log.');
}

main().catch((error) => {
  console.error('Unhandled error in ux-review helper:', error);
  process.exit(1);
});
