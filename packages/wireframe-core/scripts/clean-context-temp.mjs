#!/usr/bin/env node
import fs from "fs/promises";
import os from "os";
import path from "path";
import { fileURLToPath } from "url";
import {
  resolveProjectPath,
  resolveWorkspaceRoot,
} from "./utils/path-helpers.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = resolveWorkspaceRoot(import.meta.url);

const CHROME_CACHE_ROOT = path.join(os.homedir(), '.cache', 'chrome-devtools-mcp');
const CLAUDE_CACHE_ROOT = path.join(os.homedir(), 'Library', 'Caches', 'claude-cli-nodejs');
const MCP_LOG_FOLDER_NAME = 'mcp-logs-chrome-devtools';

async function main() {
  const options = parseArgs(process.argv.slice(2));
  let tempRoot;
  let agentOutputRoot;

  try {
    tempRoot = resolveProjectPath(import.meta.url, 'context/temp', { project: options.project });
    agentOutputRoot = resolveProjectPath(
      import.meta.url,
      'context/temp-agent-outputs',
      { project: options.project }
    );
  } catch (error) {
    console.error(`❌ ${error.message}`);
    process.exit(1);
  }

  const results = [];

  const tempLabel = path.relative(repoRoot, tempRoot) || 'context/temp';
  const tempResult = await cleanDirectory(tempRoot, {
    dryRun: options.dryRun,
    label: tempLabel,
    keepRoot: true
  });
  results.push(tempResult);

  if (options.includeAgentOutputs) {
    const agentLabel =
      path.relative(repoRoot, agentOutputRoot) || 'context/temp-agent-outputs';
    const agentResult = await cleanDirectory(agentOutputRoot, {
      dryRun: options.dryRun,
      label: agentLabel,
      keepRoot: true
    });
    results.push(agentResult);
  }

  if (options.includeChromeMcpCache) {
    const chromeResult = await cleanDirectory(CHROME_CACHE_ROOT, {
      dryRun: options.dryRun,
      label: '~/.cache/chrome-devtools-mcp',
      keepRoot: true
    });
    results.push(chromeResult);
  }

  if (options.includeMcpLogCache) {
    const logResults = await cleanClaudeMcpLogs({
      dryRun: options.dryRun
    });
    results.push(...logResults);
  }

  const removedTotal = results.reduce((sum, r) => sum + r.removedCount, 0);
  const skippedTotal = results.reduce((sum, r) => sum + r.skippedCount, 0);

  if (options.dryRun) {
    console.log(`\nDry run complete — ${removedTotal} item(s) would be removed, ${skippedTotal} skipped.`);
  } else {
    console.log(`\nCleanup complete — removed ${removedTotal} item(s), ${skippedTotal} skipped.`);
  }
}

async function cleanDirectory(targetPath, { dryRun, label, keepRoot }) {
  const summary = {
    label,
    exists: false,
    removedCount: 0,
    skippedCount: 0
  };

  try {
    await fs.access(targetPath);
    summary.exists = true;
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log(`ℹ️  ${label} not found, nothing to clean.`);
      return summary;
    }
    throw error;
  }

  const entries = await fs.readdir(targetPath);
  if (entries.length === 0) {
    console.log(`ℹ️  ${label} already empty.`);
    return summary;
  }

  console.log(`🧹 Cleaning ${label}${dryRun ? ' (dry run)' : ''}…`);

  for (const entry of entries) {
    const entryPath = path.join(targetPath, entry);

    if (entry === '.gitkeep') {
      summary.skippedCount += 1;
      continue;
    }

    if (dryRun) {
      console.log(`  - would remove ${path.relative(repoRoot, entryPath)}`);
      summary.removedCount += 1;
      continue;
    }

    await fs.rm(entryPath, { recursive: true, force: true });
    console.log(`  - removed ${path.relative(repoRoot, entryPath)}`);
    summary.removedCount += 1;
  }

  if (!keepRoot && !dryRun) {
    await fs.rmdir(targetPath, { recursive: false });
  }

  return summary;
}

function parseArgs(argv) {
  const options = {
    dryRun: false,
    includeAgentOutputs: false,
    includeChromeMcpCache: false,
    includeMcpLogCache: false,
    project: undefined
  };

  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    switch (token) {
      case '--project':
      case '-p':
        options.project = argv[++i];
        break;
      case '--dry-run':
        options.dryRun = true;
        break;
      case '--include-agent-outputs':
        options.includeAgentOutputs = true;
        break;
      case '--include-chrome-mcp-cache':
        options.includeChromeMcpCache = true;
        break;
      case '--include-mcp-log-cache':
        options.includeMcpLogCache = true;
        break;
      case '--help':
      case '-h':
        printHelp();
        process.exit(0);
        break;
      default:
        console.warn(`Unknown option: ${token}`);
        printHelp();
        process.exit(1);
    }
  }

  return options;
}

async function cleanClaudeMcpLogs({ dryRun }) {
  const summaries = [];

  try {
    await fs.access(CLAUDE_CACHE_ROOT);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('ℹ️  Claude MCP cache not found, skipping MCP log cleanup.');
      return summaries;
    }
    throw error;
  }

  const logDirs = await resolveClaudeMcpLogDirs();
  if (logDirs.length === 0) {
    console.log('ℹ️  No MCP log directories detected under claude-cli-nodejs cache.');
    return summaries;
  }

  for (const dir of logDirs) {
    const labelPath = path.relative(os.homedir(), dir);
    const summary = await cleanDirectory(dir, {
      dryRun,
      label: labelPath.startsWith('..') ? dir : `~/${labelPath}`,
      keepRoot: true
    });
    summaries.push(summary);
  }

  return summaries;
}

async function resolveClaudeMcpLogDirs() {
  const entries = await fs.readdir(CLAUDE_CACHE_ROOT, { withFileTypes: true });
  const matches = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const candidate = path.join(CLAUDE_CACHE_ROOT, entry.name, MCP_LOG_FOLDER_NAME);
    try {
      const stats = await fs.stat(candidate);
      if (stats.isDirectory()) {
        matches.push(candidate);
      }
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
  }

  return matches;
}

function printHelp() {
  console.log(`Usage: npm run clean:context-temp -- [options]

Options:
  --project <slug>              Target project slug when multiple projects exist
  --dry-run                     List files that would be removed without deleting them
  --include-agent-outputs       Also empty project context/temp-agent-outputs (keeps directory)
  --include-chrome-mcp-cache    Also clean Chrome DevTools MCP cache (~/.cache/chrome-devtools-mcp)
  --include-mcp-log-cache       Also clean Claude MCP log cache (~/Library/Caches/claude-cli-nodejs/**/mcp-logs-chrome-devtools)
  --help, -h                    Show this message
`);
}

main().catch((error) => {
  console.error('Failed to clean temp directories');
  console.error(error);
  process.exit(1);
});
