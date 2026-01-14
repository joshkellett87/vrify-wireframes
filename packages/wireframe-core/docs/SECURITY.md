# Security Guidelines

## Chrome DevTools MCP Bridge

### Network Binding

**Default:** The bridge binds to `127.0.0.1:8974` (localhost only)

**Risk:** The bridge provides HTTP access to a headless Chrome instance. Network exposure could allow unauthorized page navigation, screenshot capture, or code execution.

**Mitigation:**

- Bridge defaults to localhost-only binding
- No external network access by default
- Port can be changed via `--port` flag, but host remains localhost

**Never expose the bridge to external networks:**

```bash
# ✅ Safe - localhost only (default)
npm run mcp:bridge

# ❌ Unsafe - DO NOT bind to all interfaces
npm run mcp:bridge -- --host 0.0.0.0
```

### Process Isolation

- Bridge runs as a separate Node.js process
- Automatically terminates with parent script (self-iterate, orchestrator)
- Can be manually stopped with Ctrl+C or process termination

### Browser Permissions

Puppeteer launches Chrome with minimal permissions:

- No access to user's Chrome profile or saved passwords
- Isolated browser context (no cookies, history, or extensions)
- Runs in headless mode by default

### Rate Limiting

**Current Status:** No rate limiting implemented

**Recommendation:** If running bridge in a shared environment, consider adding request throttling at the HTTP server level.

## File System Access

### Context Directory

`context/BUSINESS-CONTEXT.md` is git-ignored and may contain sensitive business intelligence:

- Strategic goals and KPIs
- Competitor analysis
- Internal metrics

**Best Practice:** Keep this file restricted to authorized team members.

### Temp Artifacts

`context/temp/` may contain screenshots or HTML snapshots of internal tools:

- Clear regularly with `npm run clean:context-temp`
- Avoid committing temp directories
- Review `.gitignore` ensures proper exclusions

## Dependency Security

### Puppeteer

- Downloads Chromium automatically during install
- Binary stored in `node_modules/puppeteer/.local-chromium`
- Verify Puppeteer version is up-to-date: `npm outdated puppeteer`

### MCP Servers

Chrome DevTools MCP connects to external MCP servers if configured:

- Review MCP server trust before connecting
- Limit MCP endpoints to trusted sources only
- Monitor MCP traffic if running in production

## CI/CD Security

### GitHub Actions

Workflows run with limited permissions:

- Read-only access to repository
- No access to secrets unless explicitly granted
- Business context is missing (git-ignored) - validation runs with reduced checks

### Recommendations

- Review workflow permissions in `.github/workflows/*.yml`
- Audit third-party actions before use
- Keep Actions runner images up-to-date

## Reporting Security Issues

If you discover a security vulnerability:

1. Do **not** create a public GitHub issue
2. Contact the repository maintainers directly
3. Provide detailed reproduction steps
4. Allow time for assessment and patching before public disclosure

---

**Last Updated:** 2025-10-06
