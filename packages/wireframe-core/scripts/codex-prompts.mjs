#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, '../../../');

async function main() {
  const manifestPath = resolve(ROOT, 'codex-cli.json');
  let manifest;

  try {
    const raw = await readFile(manifestPath, 'utf8');
    manifest = JSON.parse(raw);
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(
        'codex-cli.json was not found. Run `npm run wf:setup` to generate the manifest first.',
      );
    }
    throw error;
  }

  if (!manifest?.prompts || Object.keys(manifest.prompts).length === 0) {
    console.warn('No prompts registered in codex-cli.json.');
    return;
  }

  console.log('Codex CLI prompt handles (generated from codex-cli.json):\n');
  const entries = Object.entries(manifest.prompts).sort(([a], [b]) => a.localeCompare(b));

  for (const [id, config] of entries) {
    const alias = Array.isArray(config.aliases) && config.aliases.length > 0
      ? config.aliases[0]
      : `/${id}`;
    const variables = Array.isArray(config.variables) ? config.variables : [];
    const varExample =
      variables.length > 0
        ? variables.map((variable) => `--var ${variable}=…`).join(' ')
        : '';
    const hint = varExample ? ` ${varExample}` : '';
    console.log(`- ${alias} → codex prompt run ${id}${hint}`);
  }

  console.log(
    '\nRun `codex prompt list` to inspect imported prompts inside the Codex CLI after syncing.',
  );
}

main().catch((error) => {
  console.error(`codex-prompts failed: ${error.message}`);
  process.exitCode = 1;
});
