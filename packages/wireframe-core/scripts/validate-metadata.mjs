#!/usr/bin/env node

import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import { resolveProjectPath } from "./utils/path-helpers.mjs";

const WIREFRAMES_DIR = "src/wireframes";
const BUSINESS_CONTEXT_EXPORT = "context/temp-agent-outputs/business-context.json";

function parseArgs(argv) {
  const result = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if ((arg === "--project" || arg === "-p") && argv[i + 1]) {
      result.project = argv[i + 1];
      i += 1;
    } else if (arg === "--help" || arg === "-h") {
      result.help = true;
    }
  }
  return result;
}

function printHelp() {
  console.log(`Wireframe Metadata Validator

Usage:
  npm run validate:metadata -- [-p|--project <slug>]

Options:
  --project, -p   Specify project slug when multiple projects exist
  --help, -h      Show this help message
`);
}

const args = parseArgs(process.argv.slice(2));

if (args.help) {
  printHelp();
  process.exit(0);
}

let wireframesDir;
let businessContextPath;

try {
  wireframesDir = resolveProjectPath(import.meta.url, WIREFRAMES_DIR, { project: args.project });
  businessContextPath = resolveProjectPath(import.meta.url, BUSINESS_CONTEXT_EXPORT, { project: args.project });
} catch (error) {
  console.error(`❌ ${error.message}`);
  process.exit(1);
}

console.log('🔍 Validating wireframe metadata...\n');

// Import validator
const { validateMetadata, getValidationReport } = await import('../src/shared/lib/metadata-validator.mjs');

let businessContextExport = null;
try {
  businessContextExport = JSON.parse(readFileSync(businessContextPath, 'utf-8'));
  console.log(`📦 Loaded business context export (${BUSINESS_CONTEXT_EXPORT})`);
} catch (error) {
  if (error.code === 'ENOENT') {
    console.log('ℹ️  No business context export found. Run `npm run export:business-context` to enable cross-checks.\n');
  } else {
    console.log(`⚠️  Failed to load business context export: ${error.message}\n`);
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

let hasErrors = false;
let totalErrors = 0;
let totalWarnings = 0;

projects.forEach(project => {
  const metadataPath = join(wireframesDir, project, 'metadata.json');
  console.log(`📋 ${project}`);

  try {
    const metadata = JSON.parse(readFileSync(metadataPath, 'utf-8'));
    const result = validateMetadata(metadata, {
      businessContext: businessContextExport
    });

    if (result.errors.length > 0) {
      hasErrors = true;
      totalErrors += result.errors.length;
      console.log('  ❌ Errors:');
      result.errors.forEach(err => {
        console.log(`     - ${err.field}: ${err.message}`);
      });
    }

    if (result.warnings.length > 0) {
      totalWarnings += result.warnings.length;
      console.log('  ⚠️  Warnings:');
      result.warnings.forEach(warn => {
        console.log(`     - ${warn.field}: ${warn.message}`);
      });
    }

    if (result.valid && result.warnings.length === 0) {
      console.log('  ✅ Valid');
    } else if (result.valid) {
      console.log('  ✅ Valid (with warnings)');
    }

  } catch (error) {
    hasErrors = true;
    totalErrors++;
    console.log(`  ❌ Failed to read/parse: ${error.message}`);
  }

  console.log('');
});

console.log('📊 Summary:');
console.log(`   Projects: ${projects.length}`);
console.log(`   Errors:   ${totalErrors}`);
console.log(`   Warnings: ${totalWarnings}`);
console.log('');

if (hasErrors) {
  console.log('❌ Validation failed. Please fix errors above.\n');
  process.exit(1);
} else {
  console.log('✅ All metadata files valid!\n');
  process.exit(0);
}
