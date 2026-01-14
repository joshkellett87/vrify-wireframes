import { setTimeout as delay } from 'timers/promises';

const DEFAULT_TIMEOUT_MS = 20000;

class ChromeDevtoolsHttpClient {
  constructor(endpoint) {
    this.endpoint = endpoint.replace(/\/$/, '');
  }

  async call(tool, params = {}, { timeout = DEFAULT_TIMEOUT_MS } = {}) {
    const controller = new AbortController();
    const timer = delay(timeout, null, { signal: controller.signal }).catch(() => {});

    try {
      const response = await fetch(`${this.endpoint}/call-tool`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool, params }),
        signal: controller.signal
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`[mcp-client] Tool ${tool} failed (${response.status}): ${text}`);
      }

      const payload = await response.json();
      if (payload?.error) {
        throw new Error(`[mcp-client] Tool ${tool} error: ${payload.error}`);
      }

      return payload?.result ?? payload;
    } finally {
      controller.abort();
      await timer;
    }
  }
}

export function createChromeDevtoolsClient({ endpoint } = {}) {
  const resolvedEndpoint =
    endpoint ||
    process.env.MCP_HTTP_ENDPOINT ||
    process.env.MCP_ENDPOINT ||
    process.env.CHROME_DEVTOOLS_MCP_ENDPOINT ||
    null;

  if (!resolvedEndpoint) {
    return null;
  }

  return new ChromeDevtoolsHttpClient(resolvedEndpoint);
}
