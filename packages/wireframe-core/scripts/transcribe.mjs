#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline/promises';
import puppeteer from 'puppeteer';
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
function writeFile(p, c) { ensureDir(path.dirname(p)); fs.writeFileSync(p, c, 'utf8'); }
function copyFile(src, dest) { ensureDir(path.dirname(dest)); fs.copyFileSync(src, dest); }

function parseArgs() {
  const args = process.argv.slice(2);
  const out = { url: null, screenshot: null, slug: null, copy: null, project: null };
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a.startsWith('--url=')) out.url = a.split('=')[1];
    else if (a.startsWith('--screenshot=')) out.screenshot = a.split('=')[1];
    else if (a.startsWith('--slug=')) out.slug = a.split('=')[1];
    else if (a.startsWith('--copy=')) out.copy = a.split('=')[1];
    else if (a === '--project') out.project = args[++i];
    else if (a.startsWith('--project=')) out.project = a.split('=')[1];
  }
  return out;
}

const viewports = [
  { name: 'desktop', width: 1400, height: 900 },
  { name: 'laptop', width: 1024, height: 768 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 375, height: 667 }
];

function markdownTemplate({ url, slug, copyMode, screenshots, extracted }) {
  const shots = screenshots.map(s => `  - ${s}`).join('\n');
  const extractedBlock = copyMode === 'real' && extracted ? `\n## Extracted Copy (headlines/CTAs)\n${extracted}\n` : '';
  return `# Transcribe Input\n- Slug: ${slug}\n- URL: ${url ?? 'N/A'}\n- Copy Mode: ${copyMode}\n- Screenshots:\n${shots}\n${extractedBlock}\n## Proposed Sections (fill in)\n1. Hero — Why Now | JTBD (Situation, Motivation, Outcome)\n2. How It Works — …\n3. Platform/Capabilities — …\n4. Solutions/Use Cases — …\n5. Proof & Results — …\n6. Resources — …\n7. CTA Block — …\n\n## Anchors (suggested)\n#how-it-works, #capabilities, #solutions, #proof, #resources, #cta\n\n## Suggested metadata\n- id: ${slug}\n- title: <Page Title>\n- routes:\n  - index: /\n  - variants: ["/option-a", "/option-b", "/option-c"]\n`;
}

async function captureScreenshots(url, outDir, copyMode) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const screenshots = [];
  let extracted = '';
  try {
    await page.goto(url, { waitUntil: 'load' });
    for (const vp of viewports) {
      await page.setViewport({ width: vp.width, height: vp.height });
      const outPath = path.join(outDir, `screenshot-${vp.name}-${vp.width}x${vp.height}.png`);
      await page.screenshot({ path: outPath, fullPage: true });
      screenshots.push(outPath);
    }
    if (copyMode === 'real') {
      const h1 = await page.$eval('h1', el => el?.textContent).catch(() => '');
      const h2 = await page.$eval('h2', el => el?.textContent).catch(() => '');
      const cta = await page.evaluate(() => {
        const els = Array.from(document.querySelectorAll('a, button'));
        const match = els.find(el => /demo|contact|book|start|learn|get/i.test(el.textContent));
        return match?.textContent || '';
      }).catch(() => '');
      extracted = ['# Headline (h1):', h1?.trim() || '', '\n## Subheadline (h2):', h2?.trim() || '', '\n## CTA (first match):', cta?.trim() || ''].join('\n');
    }
  } finally {
    await browser.close();
  }
  return { screenshots, extracted };
}

async function main() {
  const args = parseArgs();
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  try {
    if (!args.slug) throw new Error('--slug is required');
    if (!args.url && !args.screenshot) throw new Error('Provide --url or --screenshot');

    let copyMode = args.copy;
    if (!copyMode) {
      const ans = (await rl.question('Use existing page copy or lorem ipsum? (real/lorem) [lorem]: ')).trim().toLowerCase();
      copyMode = (ans === 'real' || ans === 'lorem') ? ans : 'lorem';
    }

    const projectSlug = resolveProjectSlug(import.meta.url, { project: args.project });
    const projectRoot = resolveProjectRoot(import.meta.url, { project: projectSlug });

    const baseDir = resolveProjectPath(
      import.meta.url,
      `context/temp-transcribe/${args.slug}`,
      { project: projectSlug }
    );
    const shotsDir = path.join(baseDir, 'screenshots');
    ensureDir(shotsDir);

    let screenshots = [];
    let extracted = '';

    if (args.url) {
      const res = await captureScreenshots(args.url, shotsDir, copyMode);
      screenshots = res.screenshots;
      extracted = res.extracted;
    } else if (args.screenshot) {
      const dest = path.join(shotsDir, path.basename(args.screenshot));
      copyFile(args.screenshot, dest);
      screenshots = [dest];
      if (copyMode === 'real') {
        const headline = (await rl.question('Paste key headline text (or leave blank): ')).trim();
        const cta = (await rl.question('Paste primary CTA label (or leave blank): ')).trim();
        extracted = ['# Headline:', headline, '\n## CTA:', cta].join('\n');
      }
    }

    const md = markdownTemplate({
      url: args.url,
      slug: args.slug,
      copyMode,
      screenshots: screenshots.map((p) => path.relative(projectRoot, p)),
      extracted
    });
    writeFile(path.join(baseDir, 'transcribe-input.md'), md);

    console.log(
      `\n✓ Transcription input created: ${path.relative(projectRoot, path.join(baseDir, 'transcribe-input.md'))}`
    );
    console.log('Next: feed this file to the wireframe-transcriber agent to produce a section map + metadata suggestions.');
  } catch (err) {
    console.error(`✗ ${err.message}`);
    process.exitCode = 1;
  } finally {
    rl?.close();
  }
}

main();
