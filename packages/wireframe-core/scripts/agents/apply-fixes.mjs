#!/usr/bin/env node
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import { ensureDir } from './fs-utils.mjs';
import { resolveWorkspaceRoot } from '../utils/path-helpers.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = resolveWorkspaceRoot(import.meta.url);

export function filterAutoFixableIssues(issues = []) {
  return (issues || []).filter((issue) => {
    const fix = issue?.fix;
    return (
      fix &&
      typeof fix === 'object' &&
      typeof fix.recommendation === 'string' &&
      Array.isArray(fix.targetFiles) &&
      fix.targetFiles.length > 0
    );
  });
}

export async function applyFixes({
  issues = [],
  projectSlug,
  dryRun = false,
  outputDir,
  maxFilesTouched = 3
} = {}) {
  const autoFixable = filterAutoFixableIssues(issues);
  const skipped = [];

  if (!autoFixable.length) {
    return {
      applied: [],
      skipped: issues.map((issue) => ({
        id: issue.id,
        reason: 'not-auto-fixable',
        message: 'Issue does not include actionable fix metadata.'
      })),
      dryRun
    };
  }

  if (autoFixable.length > maxFilesTouched) {
    return {
      applied: [],
      skipped: autoFixable.map((issue) => ({
        id: issue.id,
        reason: 'exceeds-max-files',
        message: `More than ${maxFilesTouched} issues provided; refusing to auto-fix to stay safe.`
      })),
      dryRun
    };
  }

  const logEntries = autoFixable.map((issue) => ({
    id: issue.id,
    status: 'skipped',
    reason: 'auto-fix-engine-not-implemented',
    recommendation: issue.fix.recommendation,
    targetFiles: issue.fix.targetFiles
  }));

  if (outputDir) {
    const targetDir = path.resolve(
      repoRoot,
      outputDir,
      projectSlug ? projectSlug : ''
    );
    ensureDir(targetDir);
    const logPath = path.join(
      targetDir,
      `auto-fix-plan-${Date.now()}.json`
    );
    fs.writeFileSync(logPath, JSON.stringify(logEntries, null, 2), 'utf8');
  }

  return {
    applied: [],
    skipped: logEntries,
    dryRun,
    note:
      'Auto-fix engine scaffolded; integrate Codex/Claude patch application to enable automatic fixes.'
  };
}
