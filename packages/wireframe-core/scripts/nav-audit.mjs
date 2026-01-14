#!/usr/bin/env node
import puppeteer from 'puppeteer';

function uniqueUrls(urls) {
  const seen = new Set();
  const out = [];
  for (const u of urls) {
    const norm = u.replace(/#.*$/, '').replace(/\/$/, '');
    if (!seen.has(norm)) { seen.add(norm); out.push(norm); }
  }
  return out;
}

function normalizeHref(base, href) {
  try {
    return new URL(href, base).toString();
  } catch {
    return null;
  }
}

async function extractPageInfo(page) {
  const h1 = (await page.$eval('h1', el => el?.textContent).catch(() => '') || '').trim();
  const h2s = await page.$$eval('h2', els => els.map(el => el.textContent)).catch(() => []);
  const h3s = await page.$$eval('h3', els => els.map(el => el.textContent)).catch(() => []);
  const sections = [...h2s, ...h3s].map(s => s.trim()).filter(Boolean).slice(0, 20);
  const ctas = await page.evaluate(() => {
    const els = Array.from(document.querySelectorAll('a, button'));
    return els
      .filter(el => /demo|contact|book|start|learn|get/i.test(el.textContent))
      .map(el => el.textContent);
  }).catch(() => []);
  return { h1, sections, ctas: ctas.map(s => s.trim()).filter(Boolean).slice(0, 10) };
}

async function main() {
  const base = 'https://example.com/';
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(base, { waitUntil: 'load' });

  const hrefs = await page.evaluate(() => {
    const anchors = Array.from(document.querySelectorAll('a[href]'));
    return anchors
      .map(a => ({ href: a.getAttribute('href') || '', text: (a.textContent || '').trim() }))
      .filter(a => a.text && a.href && !a.href.startsWith('mailto:') && !a.href.startsWith('tel:'))
      .map(a => a.href);
  });

  const internal = uniqueUrls(
    hrefs
      .map(h => normalizeHref(base, h))
      .filter(Boolean)
      .filter(u => u.startsWith('https://example.com'))
  );

  // Pick 4–5 key links likely from main nav: prioritize paths like /platform, /resources, /help, /case-studies
  const priority = ['platform', 'resources', 'help', 'help-centre', 'case', 'customers', 'stories'];
  const scored = internal.map(u => ({ u, score: priority.reduce((acc, p) => acc + (u.includes(`/${p}`) ? 1 : 0), 0) }));
  scored.sort((a, b) => b.score - a.score);
  const chosen = uniqueUrls([base.replace(/\/$/, '')].concat(scored.slice(0, 6).map(s => s.u))).slice(0, 6);

  const result = {};
  for (const url of chosen) {
    try {
      await page.goto(url, { waitUntil: 'load' });
      result[url] = await extractPageInfo(page);
    } catch (e) {
      result[url] = { error: String(e) };
    }
  }

  console.log(JSON.stringify({ chosen, pages: result }, null, 2));
  await browser.close();
}

main().catch(e => { console.error(e); process.exit(1); });
