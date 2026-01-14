#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { setTimeout as delay } from 'timers/promises';
import readline from 'readline/promises';
import {
  resolveProjectPath,
  resolveProjectRoot,
  resolveWorkspaceRoot
} from './utils/path-helpers.mjs';

import {
  ensureDir,
  pathExists,
  readJson
} from './agents/fs-utils.mjs';
import { getAgentPrompt } from './agents/prompt.mjs';
import { applyFixes } from './agents/apply-fixes.mjs';
import {
  resolveSelfIterationOptions,
  resolveConfigPath as resolveConfigFilePath
} from '../src/shared/lib/wireframe-config.mjs';
import {
  captureSnapshotArtifacts,
  resolveIterationOutputDir
} from './mcp/snapshot.mjs';
import { createChromeDevtoolsClient } from './mcp/client.mjs';
import { startDevtoolsBridge } from './mcp/devtools-http-bridge.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = resolveWorkspaceRoot(import.meta.url);

const DEFAULT_WAIT_VALIDATION_MS = 0;
const VALIDATION_CHECK_INTERVAL_MS = 2000;

function resolveHistoryRoot(historyDir, projectSlug) {
  if (!historyDir) {
    return resolveProjectPath(
      import.meta.url,
      'context/temp-agent-outputs/self-iteration',
      { project: projectSlug }
    );
  }

  if (path.isAbsolute(historyDir)) {
    return historyDir;
  }

  if (historyDir.startsWith('projects/')) {
    return path.resolve(repoRoot, historyDir);
  }

  return resolveProjectPath(import.meta.url, historyDir, { project: projectSlug });
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    printUsage();
    process.exit(0);
  }

  if (!args.project) {
    console.error('! Missing required flag: --project <slug>');
    printUsage();
    process.exit(1);
  }

  try {
    resolveProjectRoot(import.meta.url, { project: args.project });
  } catch (error) {
    console.error(`! ${error.message}`);
    process.exit(1);
  }

  const overrides = {};
  if (Number.isFinite(args.maxIterations)) overrides.maxIterations = args.maxIterations;
  if (args.autoFix === true) overrides.autoFix = true;
  if (args.autoFix === false) overrides.autoFix = false;
  if (Number.isFinite(args.snapshotDelayMs)) overrides.snapshotDelayMs = args.snapshotDelayMs;
  if (args.historyDir) overrides.historyDir = args.historyDir;
  if (Number.isFinite(args.devServerPort)) overrides.devServerPort = args.devServerPort;
  if (Number.isFinite(args.gradeThreshold)) overrides.gradeThreshold = args.gradeThreshold;

  const resolvedOptions = resolveSelfIterationOptions({ overrides });
  const historyRoot = resolveHistoryRoot(resolvedOptions.historyDir, args.project);
  ensureDir(historyRoot);

  const projectSlug = args.project;
  const projectDir = resolveProjectPath(
    import.meta.url,
    `src/wireframes/${projectSlug}`,
    { project: projectSlug }
  );
  if (!pathExists(projectDir)) {
    console.error(`! Project directory not found: ${path.relative(repoRoot, projectDir)}`);
    process.exit(1);
  }

  const metadataPath = path.join(projectDir, 'metadata.json');
  if (!pathExists(metadataPath)) {
    console.error(`! metadata.json missing for project ${projectSlug}`);
    process.exit(1);
  }

  const briefPath = path.join(projectDir, 'brief.txt');
  if (!pathExists(briefPath)) {
    console.warn(`⚠ brief.txt missing for ${projectSlug}. Validator will run without brief context.`);
  }

  const metadata = await readJson(metadataPath);
  const targetPath = normalizeRoute(args.targetPath || metadata?.routes?.index || `/${projectSlug}`);
  const port = resolvedOptions.devServerPort;
  const baseUrl = `http://127.0.0.1:${port}`;
  const targetUrl = `${baseUrl}${targetPath}`;
  const variantKey = sanitizeVariantKey(
    args.variant || inferVariantFromPath(metadata, targetPath) || 'index'
  );

  // Interactive prompts for missing configuration (only in TTY mode)
  if (process.stdin.isTTY && !args.nonInteractive) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    try {
      if (args.autoFix === undefined) {
        const answer = await rl.question('Enable auto-fix for issues? (yes/no) [no]: ');
        args.autoFix = answer.trim().toLowerCase() === 'yes';
        if (args.autoFix) overrides.autoFix = true;
      }
      if (!Number.isFinite(args.gradeThreshold)) {
        const answer = await rl.question(`Passing grade threshold? (0-100) [${resolvedOptions.gradeThreshold}]: `);
        const parsed = parseInt(answer.trim(), 10);
        if (Number.isFinite(parsed) && parsed >= 0 && parsed <= 100) {
          args.gradeThreshold = parsed;
          overrides.gradeThreshold = parsed;
        }
      }
    } finally {
      rl.close();
    }
    // Re-resolve options with any new overrides
    Object.assign(resolvedOptions, resolveSelfIterationOptions({ overrides }));
  }

  const uxReviewOutputDir = path.resolve(
    repoRoot,
    'context',
    'temp-agent-outputs',
    'ux-review',
    projectSlug
  );
  ensureDir(uxReviewOutputDir);

  const uxLogDir = path.resolve(
    repoRoot,
    'context',
    'temp-agent-outputs',
    projectSlug,
    'ux-review'
  );
  ensureDir(uxLogDir);
  const changeLogPath = path.join(uxLogDir, `${variantKey}-log.md`);
  ensureChangeLogFile(changeLogPath, { projectSlug, variantKey });

  const businessContextPath = path.resolve(
    repoRoot,
    'context',
    'temp-agent-outputs',
    'business-context.json'
  );
  const hasBusinessContext = pathExists(businessContextPath);

  const devServer = await ensureDevServer({
    port,
    reuseExisting: Boolean(args.reuseDevServer),
    slug: projectSlug
  });

  const cleanupTasks = [];
  if (devServer?.stop) {
    cleanupTasks.push(devServer.stop);
  }

  const existingEndpoint =
    process.env.MCP_HTTP_ENDPOINT ||
    process.env.MCP_ENDPOINT ||
    process.env.CHROME_DEVTOOLS_MCP_ENDPOINT ||
    null;

  let bridge = null;
  let effectiveEndpoint = existingEndpoint;
  if (!existingEndpoint && !args.noBridge) {
    console.log('- Starting local Chrome DevTools MCP bridge…');
    bridge = await startDevtoolsBridge({
      headless: !args.showBrowserBridge
    });
    cleanupTasks.push(() => bridge.stop());
    effectiveEndpoint = bridge.endpoint;
    process.env.MCP_HTTP_ENDPOINT = effectiveEndpoint;
    console.log(`- Chrome bridge ready at ${effectiveEndpoint}`);
  }

  const mcpClient = createChromeDevtoolsClient({ endpoint: effectiveEndpoint });
  if (!mcpClient) {
    await runCleanups(cleanupTasks);
    console.error(
      '! No MCP HTTP endpoint detected. Set MCP_HTTP_ENDPOINT or rerun without --no-auto-bridge.'
    );
    process.exit(1);
  }

  const projectHistoryDir = path.join(historyRoot, projectSlug);
  ensureDir(projectHistoryDir);

  const iterationPlan = determineInitialIteration(projectHistoryDir, {
    forceNew: Boolean(args.forceNewIteration)
  });

  let iterationNumber = iterationPlan.iteration;
  let remainingIterations = resolvedOptions.maxIterations;
  let reuseExistingArtifacts = iterationPlan.reuseExisting;

  const historyLogPath = path.join(historyRoot, 'history.jsonl');
  const configPath = resolveConfigFilePath();
  const waitForValidationMs = args.waitForValidation
    ? args.validationTimeoutMs ?? DEFAULT_WAIT_VALIDATION_MS
    : 0;

  let summaryPrinted = false;
  try {
    while (remainingIterations > 0) {
      const iterationDir = resolveIterationOutputDir({
        slug: projectSlug,
        iteration: iterationNumber,
        baseDir: resolvedOptions.historyDir,
        projectSlug
      });
      ensureDir(iterationDir);

      const artifactsReady = reuseExistingArtifacts && hasSnapshotArtifacts(iterationDir);
      let artifacts = null;

      const iterationStart = new Date().toISOString();
      if (!artifactsReady || args.refreshArtifacts) {
        artifacts = await captureSnapshotArtifacts({
          client: mcpClient,
          slug: projectSlug,
          iteration: iterationNumber,
          url: targetUrl,
          baseDir: resolvedOptions.historyDir,
          delayMs: resolvedOptions.snapshotDelayMs,
          captureConsole: true
        });
      } else {
        artifacts = loadExistingArtifacts(iterationDir);
      }

      const uxReviewResult = await runUxReview({
        iterationDir,
        projectSlug,
        variant: variantKey,
        iterationNumber,
        metadataPath,
        briefPath: pathExists(briefPath) ? briefPath : null,
        businessContextPath: hasBusinessContext ? businessContextPath : null,
        changeLogPath,
        artifacts,
        targetUrl,
        waitForReviewMs: waitForValidationMs
      });

      if (uxReviewResult.status === 'pending') {
        printUxReviewPendingInstructions(uxReviewResult);
        await appendHistoryEntry(historyLogPath, {
          project: projectSlug,
          iteration: iterationNumber,
          status: 'pending-ux-review',
          startedAt: iterationStart,
          artifacts: toRelativeArtifactSummary(artifacts)
        });
        summaryPrinted = true;
        break;
      }

      const uxReport = uxReviewResult.report;
      const reviewGrade = Number(uxReport?.grade?.overall);
      const gradeThreshold = resolvedOptions.gradeThreshold ?? 80;
      const reviewPass = uxReport?.passes === true || (typeof reviewGrade === 'number' && !Number.isNaN(reviewGrade) && reviewGrade >= gradeThreshold);

      await syncUxReviewOutputs({
        projectSlug,
        variant: variantKey,
        reportPath: uxReviewResult.reviewPath,
        summaryPath: uxReviewResult.summaryPath
      });

      appendChangeLogEntry(changeLogPath, {
        iteration: iterationNumber,
        report: uxReport
      });
      writeUxFollowUp({
        iterationDir,
        iteration: iterationNumber,
        report: uxReport
      });

      const validationResult = await runValidator({
        iterationDir,
        projectSlug,
        iterationNumber,
        metadataPath,
        briefPath: pathExists(briefPath) ? briefPath : null,
        artifacts,
        waitForValidationMs,
        targetUrl
      });

      if (validationResult.status === 'pending') {
        printPendingInstructions(validationResult);
        await appendHistoryEntry(historyLogPath, {
          project: projectSlug,
          iteration: iterationNumber,
          status: 'pending-validation',
          startedAt: iterationStart,
          artifacts: toRelativeArtifactSummary(artifacts),
          configPath: path.relative(repoRoot, configPath)
        });
        summaryPrinted = true;
        break;
      }

      const { report, validationPath, summaryPath } = validationResult;
      const issueStats = computeIssueStats(report.issues || []);

      await writeIterationSummary(iterationDir, {
        iteration: iterationNumber,
        project: projectSlug,
        startedAt: iterationStart,
        completedAt: new Date().toISOString(),
        report,
        uxReview: uxReport,
        artifacts: toRelativeArtifactSummary(artifacts),
        validationPath: validationPath ? path.relative(repoRoot, validationPath) : null,
        validationSummaryPath: summaryPath ? path.relative(repoRoot, summaryPath) : null
      });

      await appendHistoryEntry(historyLogPath, {
        project: projectSlug,
        iteration: iterationNumber,
        status: report.valid ? 'valid' : 'issues-found',
        startedAt: iterationStart,
        completedAt: new Date().toISOString(),
        issues: issueStats,
        configPath: path.relative(repoRoot, configPath),
        validationPath: validationPath ? path.relative(repoRoot, validationPath) : null,
        uxReview: uxReport
      });

      printIterationSummary({
        iteration: iterationNumber,
        report,
        issueStats,
        autoFixEnabled: resolvedOptions.autoFix,
        uxReview: uxReport
      });
      summaryPrinted = true;

      if (!reviewPass) {
        console.log('- UX review grade below threshold (<80). Apply recommendations before rerunning self-iterate.');
        break;
      }

      if (report.valid || !report.shouldContinue) {
        break;
      }

      if (!resolvedOptions.autoFix) {
        console.log(
          `- Auto-fix disabled. Resolve issues listed above and rerun self-iterate when ready.`
        );
        break;
      }

      const fixResult = await applyFixes({
        issues: report.issues,
        projectSlug,
        dryRun: Boolean(args.dryRun),
        outputDir: path.relative(repoRoot, projectHistoryDir)
      });

      printFixSummary(fixResult, { dryRun: Boolean(args.dryRun) });

      if (!fixResult.applied?.length) {
        console.log('- No fixes applied automatically; iteration loop will stop.');
        break;
      }

      reuseExistingArtifacts = false;
      iterationNumber += 1;
      remainingIterations -= 1;
    }
  } finally {
    await runCleanups(cleanupTasks);
  }

  if (!summaryPrinted) {
    console.log('- Self-iteration completed.');
  }
}

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    switch (token) {
      case '--project':
        args.project = argv[++i];
        break;
      case '--max-iterations':
        args.maxIterations = parseInt(argv[++i], 10);
        break;
      case '--auto-fix':
        args.autoFix = true;
        break;
      case '--no-auto-fix':
        args.autoFix = false;
        break;
      case '--dry-run':
        args.dryRun = true;
        break;
      case '--dev-server-port':
        args.devServerPort = parseInt(argv[++i], 10);
        break;
      case '--reuse-dev-server':
        args.reuseDevServer = true;
        break;
      case '--force-new-iteration':
        args.forceNewIteration = true;
        break;
      case '--wait-for-validation':
        args.waitForValidation = true;
        break;
      case '--validation-timeout-ms':
        args.validationTimeoutMs = parseInt(argv[++i], 10);
        break;
      case '--target-path':
        args.targetPath = argv[++i];
        break;
      case '--variant':
        args.variant = argv[++i];
        break;
      case '--snapshot-delay-ms':
        args.snapshotDelayMs = parseInt(argv[++i], 10);
        break;
      case '--history-dir':
        args.historyDir = argv[++i];
        break;
      case '--refresh-artifacts':
        args.refreshArtifacts = true;
        break;
      case '--no-auto-bridge':
        args.noBridge = true;
        break;
      case '--show-browser-bridge':
        args.showBrowserBridge = true;
        break;
      case '--grade-threshold':
        args.gradeThreshold = parseInt(argv[++i], 10);
        break;
      case '--non-interactive':
        args.nonInteractive = true;
        break;
      case '--help':
      case '-h':
        args.help = true;
        break;
      default:
        if (token.startsWith('--max-iterations=')) {
          args.maxIterations = parseInt(token.split('=')[1], 10);
        } else if (token.startsWith('--dev-server-port=')) {
          args.devServerPort = parseInt(token.split('=')[1], 10);
        } else if (token.startsWith('--validation-timeout-ms=')) {
          args.validationTimeoutMs = parseInt(token.split('=')[1], 10);
        } else if (token.startsWith('--snapshot-delay-ms=')) {
          args.snapshotDelayMs = parseInt(token.split('=')[1], 10);
        } else if (token.startsWith('--variant=')) {
          args.variant = token.split('=')[1];
        } else if (token === '--no-auto-bridge') {
          args.noBridge = true;
        } else if (token === '--show-browser-bridge') {
          args.showBrowserBridge = true;
        } else if (token.startsWith('--grade-threshold=')) {
          args.gradeThreshold = parseInt(token.split('=')[1], 10);
        } else if (token === '--non-interactive') {
          args.nonInteractive = true;
        }
        break;
    }
  }
  return args;
}

function printUsage() {
  console.log(`Self-Iteration Loop

Usage:
  npm run self-iterate -- --project <slug> --headless --isolated [options]

Recommended defaults:
  --headless --isolated    Run the Chrome bridge in a sandboxed headless session (drop --headless for human-in-the-loop reviews)

Options:
  --project <slug>            Target wireframe project (required)
  --max-iterations <n>        Override max iteration count (default from config)
  --auto-fix                  Enable automatic fix attempts (default from config)
  --no-auto-fix               Disable automatic fixes
  --dry-run                   Plan fixes without applying patches
  --dev-server-port <n>       Override dev server port (default from config)
  --reuse-dev-server          Assume dev server already running; fail if unreachable
  --force-new-iteration       Always create a new iteration directory
  --refresh-artifacts         Re-capture snapshot even if previous iteration is incomplete
  --wait-for-validation       Wait for validation.json to appear before exiting
  --validation-timeout-ms <n> Max wait duration when --wait-for-validation is set
  --target-path <path>        Override navigation path (defaults to metadata.routes.index)
  --variant <key>             Variant key for logging UX review outputs (default: index)
  --snapshot-delay-ms <n>     Delay after navigation before capturing snapshot
  --history-dir <relative>    Override history output directory (relative to repo root)
  --no-auto-bridge            Skip automatic Chrome bridge startup (requires MCP_HTTP_ENDPOINT)
  --show-browser-bridge       Launch bridge with visible Chromium window
  --grade-threshold <n>       Override passing grade threshold (0-100, default: 80)
  --non-interactive           Skip interactive prompts (use defaults or flags only)
  --help                      Show this message
`);
}

async function ensureDevServer({ port, reuseExisting, slug }) {
  const baseUrl = `http://127.0.0.1:${port}`;
  const reachable = await isServerReachable(baseUrl, 1000);
  if (reachable) {
    return { started: false, stop: null };
  }

  if (reuseExisting) {
    throw new Error(
      `Dev server not reachable at ${baseUrl}. Start it manually (npm run dev -- --port ${port}) or rerun without --reuse-dev-server.`
    );
  }

  console.log(`- Starting dev server for self-iteration (${baseUrl})…`);
  const command = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  const child = spawn(command, ['run', 'dev', '--', '--port', String(port), '--host', '127.0.0.1'], {
    cwd: repoRoot,
    stdio: 'pipe',
    env: process.env
  });

  child.stdout?.on('data', (data) => {
    const text = data.toString();
    if (text.toLowerCase().includes('error')) {
      console.log(`[dev] ${text.trim()}`);
    }
  });
  child.stderr?.on('data', (data) => {
    console.log(`[dev:err] ${data}`.trim());
  });

  const ready = await waitForServer(baseUrl, 45000);
  if (!ready) {
    child.kill('SIGTERM');
    throw new Error('Dev server did not become ready within 45 seconds.');
  }

  console.log('- Dev server ready.');
  return {
    started: true,
    stop: () =>
      new Promise((resolve) => {
        if (child.killed) return resolve();
        child.once('exit', resolve);
        child.kill('SIGTERM');
        setTimeout(() => {
          if (!child.killed) child.kill('SIGKILL');
        }, 3000);
      })
  };
}

async function isServerReachable(baseUrl, timeoutMs = 1000) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    const response = await fetch(baseUrl, { signal: controller.signal, redirect: 'manual' });
    clearTimeout(timeout);
    return response.ok || response.status === 404;
  } catch (error) {
    return false;
  }
}

async function waitForServer(baseUrl, timeoutMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (await isServerReachable(baseUrl, 1000)) {
      return true;
    }
    await delay(1000);
  }
  return false;
}

function normalizeRoute(route) {
  if (!route) return '/';
  if (!route.startsWith('/')) return `/${route}`;
  return route;
}

function determineInitialIteration(projectHistoryDir, { forceNew }) {
  const entries = pathExists(projectHistoryDir)
    ? fs.readdirSync(projectHistoryDir, { withFileTypes: true })
    : [];

  const numbers = entries
    .filter((entry) => entry.isDirectory() && /^iteration-(\d+)$/.test(entry.name))
    .map((entry) => parseInt(entry.name.replace('iteration-', ''), 10))
    .filter((value) => Number.isFinite(value))
    .sort((a, b) => a - b);

  if (!numbers.length) {
    return { iteration: 1, reuseExisting: false };
  }

  const latest = numbers[numbers.length - 1];
  if (forceNew) {
    return { iteration: latest + 1, reuseExisting: false };
  }

  const latestDir = path.join(projectHistoryDir, `iteration-${latest}`);
  const validationPath = path.join(latestDir, 'validation.json');
  if (!pathExists(validationPath)) {
    return { iteration: latest, reuseExisting: true };
  }

  return { iteration: latest + 1, reuseExisting: false };
}

function hasSnapshotArtifacts(iterationDir) {
  const snapshotPath = path.join(iterationDir, 'dom-snapshot.json');
  const screenshotPath = path.join(iterationDir, 'page.png');
  return pathExists(snapshotPath) && pathExists(screenshotPath);
}

function loadExistingArtifacts(iterationDir) {
  const snapshotPath = path.join(iterationDir, 'dom-snapshot.json');
  const screenshotPath = path.join(iterationDir, 'page.png');
  const consolePath = path.join(iterationDir, 'console.json');
  const metaPath = path.join(iterationDir, 'artifact.json');

  const domSnapshot = pathExists(snapshotPath) ? JSON.parse(fs.readFileSync(snapshotPath, 'utf8')) : null;
  const screenshot = pathExists(screenshotPath) ? { path: screenshotPath } : null;
  const consoleMessages = pathExists(consolePath)
    ? JSON.parse(fs.readFileSync(consolePath, 'utf8'))
    : null;

  return {
    outputDir: iterationDir,
    snapshotPath,
    screenshotPath,
    consolePath: pathExists(consolePath) ? consolePath : null,
    metaPath: pathExists(metaPath) ? metaPath : null,
    domSnapshot,
    screenshot,
    consoleMessages
  };
}

async function runValidator({
  iterationDir,
  projectSlug,
  iterationNumber,
  metadataPath,
  briefPath,
  artifacts,
  waitForValidationMs,
  targetUrl
}) {
  const validationPath = path.join(iterationDir, 'validation.json');
  const summaryPath = path.join(iterationDir, 'validation.md');

  if (pathExists(validationPath)) {
    const report = await readJson(validationPath);
    return {
      status: 'ok',
      report,
      validationPath,
      summaryPath: pathExists(summaryPath) ? summaryPath : null
    };
  }

  const promptInfo = getAgentPrompt('wireframe-validator');
  const promptPath = path.join(iterationDir, 'validator-prompt.md');
  const promptContents = buildValidatorPrompt({
    promptInfo,
    projectSlug,
    iterationNumber,
    metadataPath,
    briefPath,
    artifacts,
    targetUrl
  });
  fs.writeFileSync(promptPath, promptContents, 'utf8');

  const contextPath = path.join(iterationDir, 'validator-context.json');
  fs.writeFileSync(
    contextPath,
    JSON.stringify(
      {
        projectSlug,
        iteration: iterationNumber,
        metadataPath: path.relative(repoRoot, metadataPath),
        briefPath: briefPath ? path.relative(repoRoot, briefPath) : null,
        artifacts: toRelativeArtifactSummary(artifacts),
        targetUrl
      },
      null,
      2
    ),
    'utf8'
  );

  if (waitForValidationMs > 0) {
    const fileReady = await waitForFile(validationPath, waitForValidationMs);
    if (fileReady) {
      const report = await readJson(validationPath);
      return {
        status: 'ok',
        report,
        validationPath,
        summaryPath: pathExists(summaryPath) ? summaryPath : null
      };
    }
  }

  return {
    status: 'pending',
    promptPath,
    validationPath,
    instructions: [
      `Run the wireframe-validator agent using ${path.relative(repoRoot, promptPath)}.`,
      `Store JSON output at ${path.relative(repoRoot, validationPath)}.`,
      summaryPath
        ? `Optional: write markdown summary to ${path.relative(repoRoot, summaryPath)}.`
        : 'Optional: add markdown summary named validation.md in the iteration directory.'
    ]
  };
}

function buildValidatorPrompt({
  promptInfo,
  projectSlug,
  iterationNumber,
  metadataPath,
  briefPath,
  artifacts,
  targetUrl
}) {
  const lines = [];
  lines.push(`# Wireframe Validator Prompt — Iteration ${iterationNumber}`);
  lines.push('');
  lines.push('```prompt');
  lines.push(promptInfo.prompt);
  lines.push('```');
  lines.push('');
  lines.push('## Context Summary');
  lines.push(`- Project slug: ${projectSlug}`);
  lines.push(`- Iteration: ${iterationNumber}`);
  lines.push(`- Target URL: ${targetUrl}`);
  lines.push(`- Metadata: ${path.relative(repoRoot, metadataPath)}`);
  if (briefPath) {
    lines.push(`- Brief: ${path.relative(repoRoot, briefPath)}`);
  } else {
    lines.push('- Brief: _not available_');
  }
  const relArtifacts = toRelativeArtifactSummary(artifacts);
  if (relArtifacts.snapshotPath) lines.push(`- DOM snapshot: ${relArtifacts.snapshotPath}`);
  if (relArtifacts.screenshotPath) lines.push(`- Screenshot: ${relArtifacts.screenshotPath}`);
  if (relArtifacts.consolePath) lines.push(`- Console log: ${relArtifacts.consolePath}`);
  if (relArtifacts.metaPath) lines.push(`- Artifact summary: ${relArtifacts.metaPath}`);
  lines.push('');
  lines.push('Provide the JSON response at the required path listed above.');
  return `${lines.join('\n')}\n`;
}

async function runUxReview({
  iterationDir,
  projectSlug,
  variant,
  iterationNumber,
  metadataPath,
  briefPath,
  businessContextPath,
  changeLogPath,
  artifacts,
  waitForReviewMs,
  targetUrl
}) {
  const reviewPath = path.join(iterationDir, 'ux-review.json');
  const summaryPath = path.join(iterationDir, 'ux-review.md');

  if (pathExists(reviewPath)) {
    const report = await readJson(reviewPath);
    return {
      status: 'ok',
      report,
      reviewPath,
      summaryPath: pathExists(summaryPath) ? summaryPath : null,
      variant
    };
  }

  const promptInfo = getAgentPrompt('ux-review');
  const promptPath = path.join(iterationDir, 'ux-review.prompt.md');
  const promptContents = buildUxReviewPrompt({
    promptInfo,
    projectSlug,
    variant,
    iterationNumber,
    metadataPath,
    briefPath,
    businessContextPath,
    changeLogPath,
    artifacts,
    targetUrl,
    reviewPath,
    summaryPath
  });
  fs.writeFileSync(promptPath, promptContents, 'utf8');

  const contextPath = path.join(iterationDir, 'ux-review-context.json');
  const relArtifacts = toRelativeArtifactSummary(artifacts);
  fs.writeFileSync(
    contextPath,
    JSON.stringify(
      {
        projectSlug,
        variant,
        iteration: iterationNumber,
        metadataPath: path.relative(repoRoot, metadataPath),
        briefPath: briefPath ? path.relative(repoRoot, briefPath) : null,
        businessContextPath: businessContextPath ? path.relative(repoRoot, businessContextPath) : null,
        changeLogPath: path.relative(repoRoot, changeLogPath),
        artifacts: relArtifacts,
        targetUrl
      },
      null,
      2
    ),
    'utf8'
  );

  if (waitForReviewMs > 0) {
    const fileReady = await waitForFile(reviewPath, waitForReviewMs);
    if (fileReady) {
      const report = await readJson(reviewPath);
      return {
        status: 'ok',
        report,
        reviewPath,
        summaryPath: pathExists(summaryPath) ? summaryPath : null,
        variant
      };
    }
  }

  return {
    status: 'pending',
    promptPath,
    reviewPath,
    variant,
    instructions: [
      `Run the ux-review agent using ${path.relative(repoRoot, promptPath)}.`,
      `Store JSON output at ${path.relative(repoRoot, reviewPath)}.`,
      summaryPath
        ? `Optional: write markdown summary to ${path.relative(repoRoot, summaryPath)}.`
        : 'Optional: add markdown summary named ux-review.md in the iteration directory.',
      `Record findings in the change log at ${path.relative(repoRoot, changeLogPath)}.`
    ]
  };
}

function buildUxReviewPrompt({
  promptInfo,
  projectSlug,
  variant,
  iterationNumber,
  metadataPath,
  briefPath,
  businessContextPath,
  changeLogPath,
  artifacts,
  targetUrl,
  reviewPath,
  summaryPath
}) {
  const lines = [];
  lines.push(`# UX Review Prompt — Iteration ${iterationNumber}`);
  lines.push('');
  lines.push('```prompt');
  lines.push(promptInfo.prompt);
  lines.push('```');
  lines.push('');
  lines.push('## Context Summary');
  lines.push(`- Project slug: ${projectSlug}`);
  lines.push(`- Variant key: ${variant}`);
  lines.push(`- Iteration: ${iterationNumber}`);
  lines.push(`- Target URL: ${targetUrl}`);
  lines.push(`- Metadata: ${path.relative(repoRoot, metadataPath)}`);
  lines.push(`- Brief: ${briefPath ? path.relative(repoRoot, briefPath) : '_not available_'}`);
  lines.push(
    `- Business context: ${businessContextPath ? path.relative(repoRoot, businessContextPath) : '_not provided_'}`
  );
  lines.push(`- Change log: ${path.relative(repoRoot, changeLogPath)}`);
  const relArtifacts = toRelativeArtifactSummary(artifacts);
  if (relArtifacts?.snapshotPath) {
    lines.push(`- DOM snapshot: ${relArtifacts.snapshotPath}`);
  }
  if (relArtifacts?.screenshotPath) {
    lines.push(`- Screenshot: ${relArtifacts.screenshotPath}`);
  }
  if (relArtifacts?.consolePath) {
    lines.push(`- Console log: ${relArtifacts.consolePath}`);
  }
  lines.push('');
  lines.push('Deliverables:');
  lines.push(`- Write JSON review to ${path.relative(repoRoot, reviewPath)}`);
  const summaryRelative = summaryPath
    ? path.relative(repoRoot, summaryPath)
    : path.relative(repoRoot, path.join(path.dirname(reviewPath), 'ux-review.md'));
  lines.push(`- Append Markdown summary to ${summaryRelative}`);
  lines.push(`- Update change log at ${path.relative(repoRoot, changeLogPath)}`);
  return `${lines.join('\n')}\n`;
}

async function waitForFile(filePath, timeoutMs) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (pathExists(filePath)) {
      return true;
    }
    await delay(VALIDATION_CHECK_INTERVAL_MS);
  }
  return false;
}

async function appendHistoryEntry(historyPath, entry) {
  const line = `${JSON.stringify(entry)}\n`;
  await fs.promises.appendFile(historyPath, line, 'utf8');
}

async function writeIterationSummary(iterationDir, summary) {
  const summaryPath = path.join(iterationDir, 'summary.json');
  await fs.promises.writeFile(summaryPath, JSON.stringify(summary, null, 2), 'utf8');
}

function toRelativeArtifactSummary(artifacts) {
  if (!artifacts) return null;
  return {
    snapshotPath: artifacts.snapshotPath ? path.relative(repoRoot, artifacts.snapshotPath) : null,
    screenshotPath: artifacts.screenshotPath ? path.relative(repoRoot, artifacts.screenshotPath) : null,
    consolePath: artifacts.consolePath ? path.relative(repoRoot, artifacts.consolePath) : null,
    metaPath: artifacts.metaPath ? path.relative(repoRoot, artifacts.metaPath) : null
  };
}

function computeIssueStats(issues) {
  const stats = {
    total: issues.length || 0,
    critical: 0,
    major: 0,
    minor: 0,
    suggestion: 0
  };
  for (const issue of issues || []) {
    const severity = (issue.severity || '').toLowerCase();
    if (severity in stats) {
      stats[severity] += 1;
    }
  }
  return stats;
}

function printIterationSummary({ iteration, report, issueStats, autoFixEnabled, uxReview }) {
  console.log(`\n=== Iteration ${iteration} ===`);
  console.log(`Status: ${report.valid ? '✅ Ready' : '⚠ Needs fixes'}`);
  if (report.summary) {
    console.log(`Summary: ${report.summary}`);
  }
  if (uxReview) {
    const grade = Number(uxReview?.grade?.overall);
    const passes =
      uxReview?.passes === true || (typeof grade === 'number' && !Number.isNaN(grade) && grade >= 80);
    const gradeText = Number.isFinite(grade) ? grade.toFixed(1) : 'n/a';
    console.log(`UX Review: ${gradeText} (${passes ? 'passes' : 'needs follow-up'})`);
  }
  console.log(
    `Issues — critical: ${issueStats.critical}, major: ${issueStats.major}, minor: ${issueStats.minor}, suggestions: ${issueStats.suggestion}`
  );
  if (!report.valid) {
    console.log(`shouldContinue: ${report.shouldContinue ? 'yes' : 'no'}`);
    console.log(`Auto-fix: ${autoFixEnabled ? 'enabled' : 'disabled'}`);
  }
}

function printFixSummary(result, { dryRun }) {
  if (!result) return;
  if (dryRun) {
    console.log('- Auto-fix dry run complete. Review plan below:');
  } else {
    console.log('- Auto-fix attempt complete.');
  }

  if (result.applied?.length) {
    console.log(`  Applied fixes: ${result.applied.length}`);
    result.applied.forEach((entry) => {
      console.log(`    • ${entry.id} → ${entry.files?.join(', ') || 'unknown files'}`);
    });
  }

  if (result.skipped?.length) {
    console.log(`  Skipped fixes: ${result.skipped.length}`);
    result.skipped.forEach((entry) => {
      console.log(`    • ${entry.id}: ${entry.reason}`);
    });
  }

  if (result.note) {
    console.log(`  Note: ${result.note}`);
  }
}

function printPendingInstructions(result) {
  console.log('\n=== Validation Pending ===');
  result.instructions.forEach((instruction) => {
    console.log(`- ${instruction}`);
  });
  console.log(
    '\nRe-run `npm run self-iterate -- --project <slug> --headless --isolated` after the validation.json file is generated.'
  );
}

function printUxReviewPendingInstructions(result) {
  console.log('\n=== UX Review Pending ===');
  if (result.variant) {
    console.log(`Variant: ${result.variant}`);
  }
  result.instructions.forEach((instruction) => {
    console.log(`- ${instruction}`);
  });
  console.log(
    '\nRe-run `npm run self-iterate -- --project <slug>` once ux-review.json is generated.'
  );
}

function syncUxReviewOutputs({ projectSlug, variant, reportPath, summaryPath }) {
  if (!projectSlug || !variant || !reportPath || !pathExists(reportPath)) {
    return;
  }

  const destinationDir = path.resolve(
    repoRoot,
    'context',
    'temp-agent-outputs',
    'ux-review',
    projectSlug
  );
  ensureDir(destinationDir);
  const destinationJson = path.join(destinationDir, `${variant}.json`);
  fs.copyFileSync(reportPath, destinationJson);

  if (summaryPath && pathExists(summaryPath)) {
    const destinationMarkdown = path.join(destinationDir, `${variant}.md`);
    fs.copyFileSync(summaryPath, destinationMarkdown);
  }
}

function writeUxFollowUp({ iterationDir, iteration, report }) {
  if (!report || !Array.isArray(report.nextActions) || !report.nextActions.length) {
    return;
  }

  const followUpPath = path.join(iterationDir, 'ux-review-follow-up.md');
  const grade = Number(report?.grade?.overall);
  const passes =
    report?.passes === true || (typeof grade === 'number' && !Number.isNaN(grade) && grade >= 80);
  const lines = [];
  lines.push(`# UX Review Follow-up — Iteration ${iteration}`);
  lines.push('');
  lines.push(`Grade: ${Number.isFinite(grade) ? grade.toFixed(1) : 'n/a'} (${passes ? 'passes' : 'needs follow-up'})`);
  lines.push('');
  lines.push('## Next Actions');
  report.nextActions.forEach((action) => {
    lines.push(`- ${action}`);
  });
  fs.writeFileSync(followUpPath, `${lines.join('\n')}\n`, 'utf8');
}

function ensureChangeLogFile(changeLogPath, { projectSlug, variantKey }) {
  if (!changeLogPath) return;
  const dir = path.dirname(changeLogPath);
  ensureDir(dir);
  if (!pathExists(changeLogPath)) {
    const header = `# UX Review Change Log — ${projectSlug} (${variantKey})\n\n`;
    fs.writeFileSync(changeLogPath, header, 'utf8');
  }
}

function appendChangeLogEntry(changeLogPath, { iteration, report }) {
  if (!changeLogPath || !pathExists(changeLogPath) || !report) {
    return;
  }

  const existing = fs.readFileSync(changeLogPath, 'utf8');
  const heading = `## Iteration ${iteration}`;
  if (existing.includes(heading)) {
    return;
  }

  const timestamp = new Date().toISOString();
  const grade = Number(report?.grade?.overall);
  const passes =
    report?.passes === true || (typeof grade === 'number' && !Number.isNaN(grade) && grade >= 80);
  const lines = [];
  lines.push('');
  lines.push(`${heading} — ${timestamp}`);
  lines.push(`- Grade: ${Number.isFinite(grade) ? grade.toFixed(1) : 'n/a'} (${passes ? 'passes' : 'needs follow-up'})`);
  if (Array.isArray(report.nextActions) && report.nextActions.length) {
    lines.push('- Next actions:');
    report.nextActions.forEach((action) => {
      lines.push(`  - ${action}`);
    });
  }
  fs.appendFileSync(changeLogPath, `${lines.join('\n')}\n`, 'utf8');
}

function sanitizeVariantKey(value) {
  if (!value) return 'index';
  return value.trim().replace(/^\/+/, '') || 'index';
}

function inferVariantFromPath(metadata, targetPath) {
  if (!metadata?.variants || !targetPath) return null;
  const normalized = targetPath.replace(/\/+$/, '');
  const keys = Object.keys(metadata.variants || {});
  for (const key of keys) {
    if (normalized.endsWith(`/${key}`)) {
      return key;
    }
  }
  return null;
}

async function runCleanups(cleanupTasks) {
  for (const task of cleanupTasks.reverse()) {
    try {
      await task();
    } catch (error) {
      console.warn(`! Cleanup task failed: ${error.message}`);
    }
  }
}

main().catch((error) => {
  console.error('! Self-iteration failed:', error.message);
  process.exit(1);
});
