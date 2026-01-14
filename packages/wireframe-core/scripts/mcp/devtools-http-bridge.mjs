#!/usr/bin/env node
import http from 'http';
import { fileURLToPath } from 'url';

import puppeteer from 'puppeteer';

const __filename = fileURLToPath(import.meta.url);

const DEFAULT_HOST = '127.0.0.1';
const DEFAULT_PORT = 8974;

export async function startDevtoolsBridge({
  port = DEFAULT_PORT,
  host = DEFAULT_HOST,
  headless = true,
  keepConsoleBuffer = 200
} = {}) {
  // Security: Only allow localhost binding
  if (host !== '127.0.0.1' && host !== 'localhost') {
    throw new Error(
      `[mcp-bridge] Security: Bridge can only bind to localhost (127.0.0.1), got: ${host}`
    );
  }

  const browser = await puppeteer.launch({
    headless,
    args: ['--remote-allow-origins=*']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const consoleBuffer = [];
  page.on('console', (message) => {
    consoleBuffer.push({
      type: message.type(),
      text: message.text(),
      timestamp: new Date().toISOString()
    });
    if (consoleBuffer.length > keepConsoleBuffer) {
      consoleBuffer.shift();
    }
  });

  const handlers = {
    'chrome-devtools__navigate_page': async ({ url, timeout = 15000, waitUntil = 'load' } = {}) => {
      if (!url) throw new Error('Missing required parameter: url');
      await page.goto(url, { waitUntil, timeout });
      return { url };
    },
    'chrome-devtools__take_snapshot': async () => ({
      html: await page.content(),
      timestamp: new Date().toISOString()
    }),
    'chrome-devtools__take_screenshot': async ({ fullPage = true, format = 'png' } = {}) => {
      const buffer = await page.screenshot({ fullPage, type: format });
      return {
        data: buffer.toString('base64'),
        format
      };
    },
    'chrome-devtools__list_console_messages': async () => consoleBuffer.slice(-keepConsoleBuffer)
  };

  const server = http.createServer((req, res) => {
    if (req.method !== 'POST' || req.url !== '/call-tool') {
      res.writeHead(req.method !== 'POST' ? 405 : 404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: req.method !== 'POST' ? 'Method Not Allowed' : 'Not Found' }));
      return;
    }

    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        const { tool, params } = payload;
        if (!tool) throw new Error('Missing required field: tool');
        const handler = handlers[tool];
        if (!handler) throw new Error(`Unsupported tool: ${tool}`);
        const result = await handler(params || {});
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ result }));
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
      }
    });
  });

  await new Promise((resolve, reject) => {
    server.listen(port, host, resolve);
    server.on('error', reject);
  });

  const endpoint = `http://${host}:${port}`;

  let stopped = false;
  async function stop() {
    if (stopped) return;
    stopped = true;
    await new Promise((resolve) => server.close(resolve));
    await page.close();
    await browser.close();
  }

  return { endpoint, stop, port, host };
}

function parseArgs(argv) {
  const args = { port: DEFAULT_PORT, headless: true };
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    if (token === '--port') {
      const value = parseInt(argv[++i], 10);
      if (!Number.isNaN(value)) args.port = value;
    } else if (token.startsWith('--port=')) {
      const value = parseInt(token.split('=')[1], 10);
      if (!Number.isNaN(value)) args.port = value;
    } else if (token === '--host') {
      args.host = argv[++i];
    } else if (token.startsWith('--host=')) {
      args.host = token.split('=')[1];
    } else if (token === '--no-headless') {
      args.headless = false;
    }
  }
  return args;
}

if (import.meta.url === `file://${__filename}`) {
  const args = parseArgs(process.argv.slice(2));
  startDevtoolsBridge(args)
    .then((bridge) => {
      const base = `${bridge.endpoint}/call-tool`;
      console.log(`[devtools-http-bridge] Listening at ${base}`);
      console.log(`[devtools-http-bridge] export MCP_HTTP_ENDPOINT=${bridge.endpoint}`);

      const handleSignal = async () => {
        console.log('\n[devtools-http-bridge] Shutting down…');
        await bridge.stop();
        process.exit(0);
      };

      process.on('SIGINT', handleSignal);
      process.on('SIGTERM', handleSignal);
    })
    .catch((error) => {
      console.error('[devtools-http-bridge] Failed to start bridge:', error);
      process.exit(1);
    });
}
