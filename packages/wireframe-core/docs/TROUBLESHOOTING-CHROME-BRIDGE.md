# Chrome DevTools Bridge Troubleshooting

The self-iteration system auto-starts a headless Chrome bridge for validation. This guide covers common issues and solutions.

## Quick Diagnostics

```bash
# Test the bridge manually
npm run mcp:bridge

# Expected output:
# 🚀 Chrome DevTools bridge listening at http://127.0.0.1:8974
# Press Ctrl+C to stop
```

---

## Common Issues

### 1. Chrome/Chromium Not Found

**Error:**

```
Could not find Chrome or Chromium
Failed to launch browser
```

**Solutions:**

**macOS:**

```bash
# Puppeteer should auto-install Chrome
npm install

# If still failing, install Chromium manually
brew install --cask chromium
```

**Linux:**

```bash
# Ubuntu/Debian
sudo apt-get install chromium-browser

# Fedora
sudo dnf install chromium

# Or let Puppeteer download Chrome
npx puppeteer browsers install chrome
```

**CI/Docker:**

```dockerfile
# Add to Dockerfile
RUN apt-get update && apt-get install -y \
    chromium \
    ca-certificates \
    fonts-liberation \
    --no-install-recommends
```

---

### 2. Port Already in Use

**Error:**

```
Error: listen EADDRINUSE: address already in use 127.0.0.1:8974
```

**Solutions:**

**Find and kill the process:**

```bash
# macOS/Linux
lsof -ti:8974 | xargs kill -9

# Or use a different port
WIREFRAME_MCP_PORT=8975 npm run self-iterate -- --project <slug> --headless --isolated
```

**In scripts:**

```bash
# Add to package.json or script
export WIREFRAME_MCP_PORT=8975
npm run self-iterate -- --project mining-tech-survey --headless --isolated
```

---

### 3. Permission Errors

**Error:**

```
EACCES: permission denied
```

**Solutions:**

```bash
# Ensure Puppeteer cache is accessible
chmod -R 755 node_modules/puppeteer/.local-chromium

# Or reinstall with proper permissions
rm -rf node_modules/puppeteer
npm install puppeteer
```

---

### 4. Memory/Resource Limits

**Error:**

```
Navigation timeout
Protocol error
```

**Solutions:**

**Increase timeouts:**

```bash
# In wireframe.config.json
{
  "selfIteration": {
    "navigationTimeout": 30000,  // 30 seconds
    "maxIterations": 3
  }
}
```

**Reduce memory usage:**

```bash
# Run with smaller viewport (automation)
node packages/wireframe-core/scripts/self-iterate.mjs --project <slug> --headless --isolated
```

---

### 5. WSL/Linux Graphics Issues

**Error:**

```
Failed to launch the browser process
No usable sandbox
```

**Solutions:**

```bash
# Disable sandbox in WSL
export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=false
npm install

# Or pass --no-sandbox flag (modify bridge script if needed)
# Note: Only use in trusted environments
```

---

## Manual Bridge Mode

Disable auto-start for full control:

```bash
# Terminal 1: Start bridge manually
npm run mcp:bridge

# Terminal 2: Run validation (reuses existing bridge; keep the browser visible)
npm run self-iterate -- --project <slug> --isolated
```

If sessions start behaving inconsistently (stale auth, bloated cache, or repeated log spam), clear Chrome DevTools MCP artifacts:

```bash
# Preview what would be removed
npm run clean:context-temp -- --dry-run --include-chrome-mcp-cache --include-mcp-log-cache

# Remove Chrome cache only
npm run clean:chrome-cache

# Remove Claude MCP logs only
npm run clean:mcp-logs

# Wipe temp, agent outputs, Chrome cache, and logs in one go
npm run clean:all-mcp
```

**Benefits:**

- Faster iterations (no startup overhead)
- Better debugging visibility
- Control over Chrome lifecycle

---

## Disable Self-Iteration

If the bridge continues to fail:

```bash
# Disable in config
# wireframe.config.json
{
  "selfIteration": {
    "enabled": false
  }
}

# Or via environment variable
export WIREFRAME_SELF_ITERATION_ENABLED=false
npm run build
```

---

## Debug Mode

Enable verbose logging:

```bash
# Environment variable
export DEBUG=puppeteer:*
npm run mcp:bridge

# Or modify script temporarily
# scripts/mcp/devtools-http-bridge.mjs
const browser = await puppeteer.launch({
  headless: false,  // Show browser window
  devtools: true    // Auto-open DevTools
});
```

---

## Platform-Specific Notes

### CI Environments (GitHub Actions, GitLab CI)

- Use `--headless` mode (default)
- Add Chrome dependencies to workflow
- Consider disabling self-iteration in CI (run manually for PRs)

### Docker

- Install Chrome dependencies in base image
- Map port if running bridge in container
- Consider increasing memory limits

### macOS ARM (M1/M2)

- Puppeteer downloads ARM-compatible Chrome automatically
- If issues persist, try Rosetta: `arch -x86_64 npm install`

---

## Getting Help

If issues persist:

1. **Check logs:** Look for error details in terminal output
2. **Test manually:** Run `npm run mcp:bridge` in isolation
3. **Verify environment:** Ensure Node.js 18+ and npm dependencies installed
4. **File issue:** Include platform, Node version, and error logs

**Reference:**

- Puppeteer docs: <https://pptr.dev/troubleshooting>
- Chrome DevTools Protocol: <https://chromedevtools.github.io/devtools-protocol/>
