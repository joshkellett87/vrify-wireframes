#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import Ajv from 'ajv';
import { resolveFrameworkRoot, resolveWorkspaceRoot } from '../utils/path-helpers.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frameworkRoot = resolveFrameworkRoot(import.meta.url);
const repoRoot = resolveWorkspaceRoot(import.meta.url);
const outputsDir = path.resolve(repoRoot, 'context', 'temp-agent-outputs');
const schemasDir = path.resolve(frameworkRoot, 'schemas', 'agent-outputs');

const schemaFiles = [
  'universal-header.schema.json',
  'brief-analysis.schema.json',
  'visual-guidance.schema.json',
  'variant-strategy.schema.json',
  'wireframe-strategy.schema.json',
  'business-context-validation.schema.json',
  'wireframe-validation.schema.json',
  'transcribe.schema.json',
  'iterate-plan.schema.json'
];

async function loadSchemas(ajv) {
  // Load universal header first for $ref
  const universalPath = path.join(schemasDir, 'universal-header.schema.json');
  const universal = JSON.parse(await fs.readFile(universalPath, 'utf-8'));
  ajv.addSchema(universal, 'universal-header.schema.json');

  for (const file of schemaFiles) {
    if (file === 'universal-header.schema.json') continue;
    const full = path.join(schemasDir, file);
    const schema = JSON.parse(await fs.readFile(full, 'utf-8'));
    ajv.addSchema(schema, schema.$id || file);
  }
}

async function* walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const res = path.resolve(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(res);
    } else {
      yield res;
    }
  }
}

function pickSchemaIdForFile(filePath) {
  const base = path.basename(filePath);
  if (base === 'brief-analysis.json') return 'schemas/agent-outputs/brief-analysis.schema.json';
  if (base === 'visual-guidance.json') return 'schemas/agent-outputs/visual-guidance.schema.json';
  if (base === 'variant-strategy.json') return 'schemas/agent-outputs/variant-strategy.schema.json';
  if (base === 'wireframe-strategy.json') return 'schemas/agent-outputs/wireframe-strategy.schema.json';
  if (base === 'business-context-validation.json') return 'schemas/agent-outputs/business-context-validation.schema.json';
  if (base === 'validation.json') return 'schemas/agent-outputs/wireframe-validation.schema.json';
  if (base === 'transcribe.json') return 'schemas/agent-outputs/transcribe.schema.json';
  if (base === 'iterate-plan.json') return 'schemas/agent-outputs/iterate-plan.schema.json';
  return null;
}

async function main() {
  const ajv = new Ajv({ allErrors: true, strict: false });
  await loadSchemas(ajv);

  let checked = 0;
  let failures = 0;
  try {
    await fs.access(outputsDir);
  } catch {
    console.log('[validate-outputs] No agent outputs directory found; nothing to validate.');
    process.exit(0);
  }

  const advisoryMissingHeader = new Set();
  for await (const file of walk(outputsDir)) {
    if (!file.endsWith('.json')) continue;
    const schemaId = pickSchemaIdForFile(file);
    if (!schemaId) continue; // skip unknown JSON files
    const data = JSON.parse(await fs.readFile(file, 'utf-8'));
    const validate = ajv.getSchema(schemaId);
    if (!validate) {
      console.warn(`[validate-outputs] No schema loaded for ${schemaId}`);
      continue;
    }
    checked++;
    const valid = validate(data);
    if (!valid) {
      const text = ajv.errorsText(validate.errors, { separator: '\n  - ' });
      const missingHeader = /required property 'agentName'|required property 'contractId'|required property 'version'|required property 'timestamp'|required property 'projectSlug'/.test(text);
      if (missingHeader) {
        advisoryMissingHeader.add(path.relative(repoRoot, file));
        console.warn(`⚠️  Advisory: ${path.relative(repoRoot, file)} is missing universal header fields. Skipping failure to accommodate legacy artifacts.`);
        continue;
      }
      failures++;
      console.error(`❌ ${path.relative(repoRoot, file)} failed ${schemaId}`);
      console.error(text);
    }
  }

  if (checked === 0) {
    console.log('[validate-outputs] No matching agent outputs found to validate.');
    process.exit(0);
  }

  if (advisoryMissingHeader.size > 0) {
    console.warn(`\n[validate-outputs] Advisory only: ${advisoryMissingHeader.size} file(s) lacked universal headers. New artifacts should include them.`);
  }

  if (failures > 0) {
    console.error(`\n[validate-outputs] ${failures}/${checked} files failed schema validation.`);
    process.exit(2);
  }

  console.log(`[validate-outputs] All ${checked} files passed schema validation.`);
}

main().catch(err => {
  console.error('[validate-outputs] Unhandled error:', err);
  process.exit(1);
});
