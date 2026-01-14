import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { ensureDir } from '../agents/fs-utils.mjs';
import { resolveProjectPath, resolveWorkspaceRoot } from '../utils/path-helpers.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = resolveWorkspaceRoot(import.meta.url);

const SNAPSHOT_FILENAME = 'dom-snapshot.json';
const SCREENSHOT_FILENAME = 'page.png';
const CONSOLE_FILENAME = 'console.json';
const META_FILENAME = 'artifact.json';

export function resolveIterationOutputDir({ slug, iteration, baseDir, projectSlug }) {
  const targetProject = projectSlug || slug;
  let rootDir = null;

  if (baseDir) {
    rootDir = path.isAbsolute(baseDir)
      ? baseDir
      : resolveProjectPath(import.meta.url, baseDir, { project: targetProject });
  } else {
    rootDir = resolveProjectPath(
      import.meta.url,
      'context/temp-agent-outputs/self-iteration',
      { project: targetProject }
    );
  }

  return path.resolve(rootDir, slug, `iteration-${iteration}`);
}

export async function prepareIterationOutputDir({ slug, iteration, baseDir, projectSlug }) {
  const dir = resolveIterationOutputDir({ slug, iteration, baseDir, projectSlug });
  ensureDir(dir);
  return dir;
}

export async function captureSnapshotArtifacts({
  client,
  slug,
  iteration,
  url,
  baseDir,
  delayMs = 0,
  captureConsole = true
}) {
  if (!client || typeof client.call !== 'function') {
    throw new Error('[snapshot] Missing MCP client with call(method, payload) signature.');
  }

  if (!slug) {
    throw new Error('[snapshot] Missing required slug.');
  }

  if (typeof iteration !== 'number' || Number.isNaN(iteration)) {
    throw new Error('[snapshot] Iteration must be a number.');
  }

  const outputDir = await prepareIterationOutputDir({
    slug,
    iteration,
    baseDir,
    projectSlug: slug,
  });

  if (url) {
    await client.call('chrome-devtools__navigate_page', { url, timeout: 15000 });
  }

  if (delayMs > 0) {
    await new Promise(resolve => setTimeout(resolve, delayMs));
  }

  const [domSnapshot, screenshot, consoleMessages] = await Promise.all([
    client.call('chrome-devtools__take_snapshot', {}),
    client.call('chrome-devtools__take_screenshot', { fullPage: true }),
    captureConsole ? client.call('chrome-devtools__list_console_messages', {}) : null
  ]);

  const snapshotPath = path.join(outputDir, SNAPSHOT_FILENAME);
  const screenshotPath = path.join(outputDir, SCREENSHOT_FILENAME);
  const consolePath = captureConsole ? path.join(outputDir, CONSOLE_FILENAME) : null;
  const metaPath = path.join(outputDir, META_FILENAME);

  fs.writeFileSync(snapshotPath, JSON.stringify(domSnapshot, null, 2), 'utf8');

  if (screenshot?.data) {
    const buffer = Buffer.from(screenshot.data, 'base64');
    fs.writeFileSync(screenshotPath, buffer);
  } else if (screenshot?.path) {
    const srcPath = path.isAbsolute(screenshot.path)
      ? screenshot.path
      : path.resolve(repoRoot, screenshot.path);
    fs.copyFileSync(srcPath, screenshotPath);
  } else {
    fs.writeFileSync(
      screenshotPath.replace(/\.png$/, '.json'),
      JSON.stringify(screenshot, null, 2),
      'utf8'
    );
  }

  if (captureConsole && consolePath) {
    fs.writeFileSync(consolePath, JSON.stringify(consoleMessages || [], null, 2), 'utf8');
  }

  const artifactSummary = {
    version: 1,
    slug,
    iteration,
    url,
    capturedAt: new Date().toISOString(),
    files: {
      domSnapshot: path.relative(repoRoot, snapshotPath),
      screenshot: path.relative(repoRoot, screenshotPath),
      console: captureConsole && consoleMessages ? path.relative(repoRoot, consolePath) : null
    },
    metadata: {
      screenshotBytes: screenshot?.data ? Buffer.byteLength(screenshot.data, 'base64') : null,
      snapshotNodeCount: Array.isArray(domSnapshot?.nodes) ? domSnapshot.nodes.length : null
    }
  };

  fs.writeFileSync(metaPath, JSON.stringify(artifactSummary, null, 2), 'utf8');

  return {
    outputDir,
    snapshotPath,
    screenshotPath,
    consolePath,
    metaPath,
    domSnapshot,
    screenshot,
    consoleMessages
  };
}
