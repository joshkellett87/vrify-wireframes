#!/usr/bin/env node
import { mkdir, readdir, rm, writeFile, readFile } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';
import { loadPrompt, assertFields, coerceArray } from './lib/prompts.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, '../../../');
const PROMPTS_DIR = resolve(ROOT, 'context/prompts');
const CLAUDE_COMMANDS_DIR = resolve(ROOT, '.claude/commands');
const CLAUDE_FILE_PREFIX = 'wireframe-';
const CODEX_MANIFEST_PATH = resolve(ROOT, 'codex-cli.json');
const CODEX_BASE_DIR = 'context/prompts';
const SKIP_STATUSES = new Set(['deprecated']);
const REQUIRED_PROMPT_FIELDS = ['id', 'handle', 'phase', 'description'];

async function main() {
  try {
    const prompts = await loadPromptSet(PROMPTS_DIR);

    await syncClaudeCommands(prompts);
    await syncCodexManifest(prompts);

    console.log(
      `wf-setup: synced ${prompts.length} prompt(s) to Claude commands and Codex manifest.`,
    );
  } catch (error) {
    console.error(`wf-setup failed: ${error.message}`);
    process.exitCode = 1;
  }
}

async function loadPromptSet(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const prompts = [];

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith('.prompt.md')) continue;
    const absolutePath = join(dir, entry.name);
    const prompt = await loadPrompt(absolutePath);
    prompt.relativePath = relative(ROOT, absolutePath);

    const status = prompt.frontMatter.status;
    if (status && SKIP_STATUSES.has(status)) continue;

    assertFields(prompt.frontMatter, REQUIRED_PROMPT_FIELDS, prompt.relativePath);
    prompts.push(prompt);
  }

  prompts.sort((a, b) => a.frontMatter.id.localeCompare(b.frontMatter.id));
  return prompts;
}

async function syncClaudeCommands(prompts) {
  await ensureDir(CLAUDE_COMMANDS_DIR);
  const expectedFiles = new Set();

  for (const prompt of prompts) {
    const commandDocument = buildClaudeCommandDocument(prompt);
    const fileName = `${CLAUDE_FILE_PREFIX}${prompt.frontMatter.id}.md`;
    expectedFiles.add(fileName);
    await writeFileIfChanged(join(CLAUDE_COMMANDS_DIR, fileName), commandDocument);
  }

  const entries = await readdir(CLAUDE_COMMANDS_DIR, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isFile()) continue;
    if (!entry.name.startsWith(CLAUDE_FILE_PREFIX)) continue;
    if (expectedFiles.has(entry.name)) continue;
    await rm(join(CLAUDE_COMMANDS_DIR, entry.name));
  }
}

function buildClaudeCommandDocument(prompt) {
  const { frontMatter, body, relativePath } = prompt;
  const inputs = formatInputs(coerceArray(frontMatter.inputs));
  const outputs = formatOutputs(coerceArray(frontMatter.outputs));
  const defaults = formatDefaults(frontMatter.defaults ?? {});
  const references = formatReferences(coerceArray(frontMatter.references));

  const metadata = YAML.stringify({
    description: frontMatter.description,
    source: relativePath,
    handle: frontMatter.handle,
    phase: frontMatter.phase,
  }).trimEnd();

  const lines = [
    'The user input to you can be provided directly by the agent or as a command argument - you **MUST** consider it before proceeding with the prompt (if not empty).',
    '',
  ];

  if (inputs.length) {
    lines.push('Supported flags:');
    lines.push(...inputs);
    lines.push('');
  }

  if (outputs.length) {
    lines.push('Expected outputs:');
    lines.push(...outputs);
    lines.push('');
  }

  if (defaults.length) {
    lines.push('Default assumptions:');
    lines.push(...defaults);
    lines.push('');
  }

  if (references.length) {
    lines.push('Reference material:');
    lines.push(...references);
    lines.push('');
  }

  lines.push('User input:');
  lines.push('');
  lines.push('$ARGUMENTS');
  lines.push('');
  lines.push(`Prompt source: ${relativePath}`);
  lines.push('');
  lines.push('--- Prompt Template ---');
  lines.push('');
  lines.push(normalizePromptBody(body));
  lines.push('');

  return `---\n${metadata}\n---\n\n${lines.join('\n')}`.trimEnd() + '\n';
}

async function ensureDir(dir) {
  await mkdir(dir, { recursive: true });
}

async function writeFileIfChanged(filePath, nextContent) {
  try {
    const existing = await readFile(filePath, 'utf8');
    if (existing === nextContent) return;
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }

  await writeFile(filePath, nextContent, 'utf8');
}

function formatInputs(inputs) {
  return inputs.map((entry) => `- ${wrapCode(stringifyInputEntry(entry))}`);
}

function formatOutputs(outputs) {
  return outputs.map((entry) => `- ${wrapCode(entry)}`);
}

function formatDefaults(defaults) {
  return Object.entries(defaults).map(
    ([key, value]) => `- ${wrapCode(key)}: ${formatDefaultValue(value)}`,
  );
}

function formatReferences(references) {
  return references.map((reference) => `- ${normalizeReference(reference)}`);
}

function wrapCode(value) {
  const trimmed = String(value).trim();
  if (!trimmed) return trimmed;
  if (trimmed.startsWith('`') && trimmed.endsWith('`')) return trimmed;
  return `\`${trimmed}\``;
}

function formatDefaultValue(value) {
  if (Array.isArray(value)) {
    return `[${value.map((item) => wrapCode(item)).join(', ')}]`;
  }
  if (value && typeof value === 'object') {
    return wrapCode(JSON.stringify(value));
  }
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  return wrapCode(value);
}

// The prompt sources live under context/prompts/* while generated artifacts
// (.claude/commands and codex-cli.json) sit closer to the repo root. We normalize
// deep relative references (../../../) to a shallower ../ form so links remain
// readable and valid in generated outputs regardless of nesting depth.
function normalizeReference(reference) {
  if (typeof reference !== 'string') return String(reference);
  return reference.replaceAll('../../../', '../');
}

// Normalize Windows newlines and trim; also collapse deep relative references
// for the same rationale as normalizeReference() above.
function normalizePromptBody(content) {
  return content.replaceAll('\r\n', '\n').replaceAll('../../../', '../').trim();
}

async function syncCodexManifest(prompts) {
  const existing = await readJson(CODEX_MANIFEST_PATH);
  const manifest = {
    name: existing?.name ?? 'wireframe-platform',
    version: existing?.version ?? '1.0.0',
    description:
      existing?.description ??
      'Codex CLI prompt manifest for core wireframe platform slash commands (Option B).',
    baseDir: CODEX_BASE_DIR,
    prompts: {},
  };

  for (const prompt of prompts) {
    const { frontMatter, path, relativePath } = prompt;
    const variables = extractVariables(coerceArray(frontMatter.inputs));
    const pathRelativeToBase = relative(resolve(ROOT, CODEX_BASE_DIR), path);

    manifest.prompts[frontMatter.id] = {
      path: pathRelativeToBase || relativePath,
      description: frontMatter.description,
      aliases: Array.from(new Set([frontMatter.handle].filter(Boolean))),
      phase: frontMatter.phase,
      variables,
    };
  }

  await writeJsonIfChanged(CODEX_MANIFEST_PATH, manifest);
}

async function readJson(filePath) {
  try {
    const raw = await readFile(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
}

async function writeJsonIfChanged(filePath, data) {
  const nextContent = `${JSON.stringify(data, null, 2)}\n`;
  await writeFileIfChanged(filePath, nextContent);
}

function extractVariables(inputs) {
  const flags = new Set();
  const flagPattern = /--([a-z0-9-]+)/gi;

  for (const entry of inputs) {
    const searchTarget = stringifyInputEntry(entry);
    for (const match of searchTarget.matchAll(flagPattern)) {
      flags.add(match[1].replace(/-/g, '_'));
    }
  }

  return Array.from(flags);
}

function stringifyInputEntry(entry) {
  if (entry && typeof entry === 'object' && !Array.isArray(entry)) {
    return Object.entries(entry)
      .map(([key, value]) => `${key}: ${value}`)
      .join(' | ');
  }
  return String(entry ?? '');
}

main();
