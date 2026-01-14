# Documentation Index

This project maintains multiple documentation files for different audiences and purposes. Start here to find what you need.

---

## For LLMs (Claude Code, Codex, etc.)

### Primary Guide

**[AGENTS.md](./AGENTS.md)** - Unified development guide for all LLM agents

- Platform overview and architecture
- Request intake and routing workflow
- Metadata schema v2.0 and validation
- Working rituals and developer utilities
- Implementation standards and QA checklist
- Git collaboration guidelines
- **Start here** for all tasks

> **Note**: `CLAUDE.md` is a symlink to `AGENTS.md` for backward compatibility with tools that look for that filename.

### Agent Workflows

**[AGENT-WORKFLOWS.md](./AGENT-WORKFLOWS.md)** - Wireframe analysis and strategy agents

- 7 specialized subagent prompts
- Business context gatherer
- Brief analyzer
- Visual guidance advisor
- Variant differentiator
- Wireframe strategist
- Business context validator
- Wireframe validator (self-iteration loop)
- Prompt generator (optional, for Lovable export only)
- Guardrails (consolidated) and Universal Output Contract for JSON artifacts
  - Schemas for agent outputs live in `packages/wireframe-core/schemas/agent-outputs/`
  - Validate generated outputs with: `npm run validate:agent-outputs`
  - See: [Guardrails](./AGENT-WORKFLOWS.md#guardrails)
  - See: [Universal Output Contract](./AGENT-WORKFLOWS.md#universal-output-contract-applies-to-all-json-outputs)
- **Use this** to understand agent orchestration
- **Note**: Default workflow builds directly in Claude Code; Lovable export is optional

### Browser Integration

Chrome DevTools MCP is used for visual validation and iteration:

- Browser tools connect to Chrome for testing
- Snapshots capture page state and accessibility tree
- Screenshots provide visual confirmation

### Design System

**[context/WIREFRAME-FUNDAMENTALS.md](./context/WIREFRAME-FUNDAMENTALS.md)** - Design standards for all wireframes

- Grayscale-first palette
- 8px baseline rhythm
- 12-column grid system
- WCAG 2.1 AA accessibility requirements
- Typography and spacing standards
- Wireframe anatomy (index + variants)
- **Reference this** when generating or reviewing wireframe designs

### Pattern Library

**[context/WIREFRAME-PATTERNS.md](./context/WIREFRAME-PATTERNS.md)** - Platform-specific design patterns

- Component heuristics
- Section templates
- Navigation patterns
- Form structures
- Resource page layouts
- **Use this** when you need applied pattern guidance

---

## For Humans

### Project Overview

**[README.md](./README.md)** - High-level project introduction

- What this platform does
- Quick start guide
- Key features
- Tech stack overview

### Development Setup

- **Installation**: `npm install`
- **Dev server**: `npm run dev` (<http://localhost:8080>)
- **Build**: `npm run build`
- **Preview**: `npm run preview`
- **Lint**: `npm run lint`

### Automation Scripts

- **Scaffold new project**: `npm run scaffold`
- **Transcribe page → wireframe**: `npm run transcribe`
- **Iterate wireframe → wireframe**: `npm run iterate`
- **Orchestrate agent workflow**: `npm run orchestrate`
- **Self-iteration loop (snapshot + validation)**: `npm run self-iterate -- --project <slug> --headless --isolated` (auto-starts the Chrome MCP bridge in isolated headless mode; drop `--headless` for human-in-the-loop reviews)
- **Manual Chrome DevTools bridge**: `npm run mcp:bridge` (optional helper if you want to keep the browser session alive outside the loop)
- **Regenerate business context JSON**: `npm run export:business-context`
- **Clean temp artifacts**: `npm run clean:context-temp` (add flags as needed)
  - `-- --dry-run` — preview deletions
  - `-- --include-agent-outputs` — clear orchestrator artifacts
  - `-- --include-chrome-mcp-cache` — remove Chrome DevTools MCP profile cache (~/.cache/chrome-devtools-mcp)
  - `-- --include-mcp-log-cache` — remove Claude MCP log cache (~/Library/Caches/claude-cli-nodejs/**/mcp-logs-chrome-devtools)
  - Shortcut aliases: `npm run clean:chrome-cache`, `npm run clean:mcp-logs`, `npm run clean:all-mcp`

### Configuration

- **Self-iteration defaults** live in [`wireframe.config.sample.json`](./context/examples/wireframe.config.sample.json) — copy this to the repo root as `wireframe.config.json` for your workspace
  - Override via CLI flags (`--auto-fix`, `--no-auto-fix`, `--max-iterations=<n>`)
  - Environment variables supported: `WIREFRAME_SELF_ITERATION`, `WIREFRAME_SELF_ITERATION_AUTO_FIX`, `WIREFRAME_SELF_ITERATION_MAX_ITERATIONS`, `WIREFRAME_SELF_ITERATION_HISTORY_DIR`, `WIREFRAME_SELF_ITERATION_DEV_SERVER_PORT`
  - MCP bridge settings auto-resolve; the loop launches `scripts/mcp/devtools-http-bridge.mjs` unless `MCP_HTTP_ENDPOINT` (or compatible env) is already set

### Testing

- **Visual validation**: Use Chrome DevTools MCP tools with dev server
- **Legacy E2E tests**: Archived in `tests/archive/` for reference

---

## Architecture Quick Reference

### Project Structure

```
src/
├── App.tsx                    # Dynamic routing (metadata-driven)
├── main.tsx                   # Application entry
│
├── shared/                    # Reusable across ALL wireframes
│   ├── components/            # Wireframe patterns & header primitives
│   ├── ui/                    # shadcn-ui components (50+)
│   ├── lib/                   # Utilities (routing, utils)
│   ├── themes/                # CSS theme variants (dark, print, annotated)
│   └── styles/                # Global CSS & design tokens
│
└── wireframes/                # Multi-project wireframes
    └── [project-slug]/
        ├── brief.txt          # Original design brief
        ├── metadata.json      # Routes, variants, sections
        ├── components/        # Project-specific sections
        └── pages/             # Index + variants + resources
```

### Shared Components Library

**Header Primitives:**

- `HeaderShell` - Sticky container with responsive layout
- `NavList` - Accessible navigation list
- `MobileBurger` - Hamburger menu toggle

**Wireframe Patterns:**

- `MetricCard` - Stats/KPI displays
- `FeatureGrid` - 3-column capability showcases
- `TestimonialCard` - Customer testimonials
- `ProcessStep` - Step-by-step workflows
- `ComparisonTable` - Plan/feature matrices

**UI Components:** 50+ shadcn-ui components in `src/shared/ui/`

**Icon Libraries:**

- Lucide React (default, minimal style)
- @iconify/react (200k+ icons, on-demand)
- react-icons (popular icon sets)

### Theme Variants

**Apply themes** by adding class to `<html>` or `<body>`:

- `wireframe-dark` - Dark mode presentations
- Print theme - Automatic via `@media print`
- `wireframe-annotated` - Design redlines/measurements

---

## Common Tasks

### Adding a New Wireframe Project

1. Create feature branch: `git checkout -b wireframe/[project-slug]`
2. Run scaffold: `npm run scaffold` (or with `--apply-routes=root|namespace`)
3. Update `metadata.json` with routes/variants
4. Build pages and components
5. **Routes auto-generate** from metadata - no manual `App.tsx` edits needed

### Using Shared Components

```tsx
import { HeaderShell, NavList, MetricCard } from "@/shared/components";
import { Button, Card } from "@/shared/ui/button";
import { Icon } from "@iconify/react";
```

### Applying Themes

```tsx
// Dark mode
<html className="wireframe-dark">

// Annotated mode
<html className="wireframe-annotated">

// Print - automatic via CSS
```

---

## Need Help?

### Technical Issues

- Check relevant doc: AGENTS.md → AGENT-WORKFLOWS.md
- Search codebase: Use Glob/Grep tools
- Review existing wireframes: `src/wireframes/mining-tech-survey/` or `src/wireframes/dora-data-fusion-models/`

### Design Questions

- Review: `context/WIREFRAME-FUNDAMENTALS.md`
- Pattern references: `context/WIREFRAME-PATTERNS.md`

### Workflow Questions

- Agent orchestration: `AGENT-WORKFLOWS.md`
- CLI tools: Run scripts with `--help` flag

---

## Contributing

- **Commit style**: Conventional Commits (`feat:`, `fix:`, `chore:`, etc.)
- **Branch naming**: `wireframe/[project-slug]` or `feat/[feature-name]`
- **Before PR**: Run `npm run build` and `npm run lint`
- **PR requirements**: Describe changes; attach screenshots; include Chrome DevTools MCP snapshots, screenshots, or console logs when applicable

---

*Last updated: 2025-10-06*

## Agent Commands Quickstart (Option B)

Location

- Claude prompts: context/prompts/*.prompt.md
- Codex prompts: context/prompts/codex/*.prompt.md
- Codex manifest: codex-cli.json

Commands

- /wf — orchestrate end-to-end (smart resume)
- /analyze — intake analysis → brief-analysis.json
- /strategize — variant strategy → wireframe-strategy.json
- /validate — metadata/context/UI validation
- /export — artifacts and gated Lovable prompt
- /ux-review — post-build UX grading and change-log sync per variant

Examples

- New project: /wf --project new-slug --brief projects/<workspace>/src/wireframes/new-slug/brief.txt
- Existing mining-tech-survey flow: /analyze → /strategize → /validate → /export

Troubleshooting

- Before metadata/context validation, run: npm run export:business-context
- UI validation requires: --dom <path> and --screenshot <path> (console optional)

See also: `context/prompts/README.md` for a quick overview of the prompt library.
