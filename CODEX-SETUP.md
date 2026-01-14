# Codex/Warp Integration Setup (Chrome DevTools MCP)

This document describes the current setup for running this project via Codex CLI or Warp with Chrome DevTools MCP for preview and visual validation. Playwright is no longer required.

## Quick Start

- Install deps: `npm install`
- Start dev server: `npm run dev` (<http://localhost:8080>)
- Build (dev profile): `npm run build:dev`
- Preview built app: `npm run preview`
- Lint: `npm run lint`

## Orchestrating Agent Workflows

Use the built-in orchestrator and helper scripts:

- `npm run wf:setup` regenerates `.claude/commands/wireframe-*.md` and `codex-cli.json` so Claude and Codex stay in sync.
- `npm run codex:prompts` → runs the setup script and prints ready-to-run `codex prompt run …` samples.
- `npm run design:tokens -- --project <slug>` → inspect merged design tokens (base + overrides) before iterating on visuals.
- `npm run orchestrate -- --project <slug>`
  - Add `--prepare-prompts`, `--status`, or `--agent-help <name>` as needed
- `node packages/wireframe-core/scripts/agents/run-agent.mjs --agent <name> --project <slug> --write`
- See AGENTS.md → "CLI Orchestration (Codex & Claude)" for details

## Chrome DevTools MCP Toolkit

Use the Chrome DevTools MCP tools to validate UI and behavior during development:

- Navigation: `mcp__chrome-devtools__navigate_page`, `mcp__chrome-devtools__navigate_page_history`
- Inspection: `mcp__chrome-devtools__take_snapshot` (preferred - no size limits), `mcp__chrome-devtools__take_screenshot` (viewport only, never full-page), `mcp__chrome-devtools__list_console_messages`
- Interaction: `mcp__chrome-devtools__click`, `mcp__chrome-devtools__fill`, `mcp__chrome-devtools__hover`, `mcp__chrome-devtools__wait_for`
- Performance: `mcp__chrome-devtools__performance_start_trace`, `mcp__chrome-devtools__performance_stop_trace`

**Screenshot Best Practices**:

- Never use `fullPage: true` - Claude rejects images over 8000px in any dimension
- Use viewport screenshots (omit `fullPage` parameter or set to `false`)
- For long pages: take multiple viewport screenshots by scrolling, or rely on `take_snapshot` (no size limits)

**IMPORTANT**: Never use `fullPage: true` - Claude rejects images over 8000px in any dimension

Reference: AGENTS.md → "Chrome DevTools MCP Toolkit".

**Automation tips**

- `npm run self-iterate -- --project <slug> --headless --isolated` automatically launches an isolated headless Chrome MCP bridge when `MCP_HTTP_ENDPOINT` is unset, captures snapshots, and runs the validator loop. Drop `--headless` when you need a human-in-the-loop review.
- `npm run mcp:bridge` starts the same Puppeteer-powered bridge manually (useful if you want to keep a dedicated browser session running between scripts).

## Metadata Schema v2.0

- All projects use `schema_version: "2.0"`
- Variant routes are auto-derived from `variants` keys (no `routePath` or `routes.variants` in metadata)
- Keep `routes` to `index` and optional `resources`
- Before editing legacy projects, run: `npm run migrate:metadata`
- After any metadata change, run: `npm run validate:metadata`

## Troubleshooting

- Dev server unreachable: confirm `npm run dev` is running on port 8080
- Browser automation failing: ensure Chrome is installed and Chrome DevTools MCP is enabled in your environment
- Metadata errors: fix fields flagged by `npm run validate:metadata`

### Troubleshooting Screenshot Errors

- **Error: "image dimensions exceed max allowed size: 8000 pixels"**
  - Cause: Used `fullPage: true` on a long page
  - Fix: Use viewport screenshots instead, or resize page before screenshot
  - Prevention: Never use `fullPage: true` - rely on snapshots for full-page validation

## CI/CD Notes

- No special browser binary setup is required
- Consider adding a CI step for `npm run validate:metadata`

---

This setup reflects the current workflow with Chrome DevTools MCP and the v2.0 metadata schema. For deeper guidance, see AGENTS.md and DOCUMENTATION.md.
