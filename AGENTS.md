# Multi-Wireframe Platform — Development Guide

> **Quick Navigation**: [AGENT-WORKFLOWS.md](./AGENT-WORKFLOWS.md) for agent prompts | [DOCUMENTATION.md](./DOCUMENTATION.md) for doc index | [docs/](./packages/wireframe-core/docs/) for detailed references

## Content Boundaries (Source of Truth)

This file (`AGENTS.md`) is the **canonical development guide** for the wireframe platform. It provides architecture overview, workflows, standards, and quick-start content.

- **AGENTS.md** (this file): Unified guide for all LLM agents and IDE integrations
- **CLAUDE.md**: Symlink → `AGENTS.md` (backward compatibility)
- **AGENT-WORKFLOWS.md**: Agent prompts, workflow definitions, and orchestration
- **docs/** directory: Detailed reference documentation:
  - **docs/METADATA-SCHEMA.md** — Complete schema v2.0 specification
  - **docs/ROUTING.md** — Dynamic routing system technical reference
  - **docs/SNAPSHOT-SYSTEM.md** — Version control for git-ignored files
  - **docs/MAINTENANCE.md** — Temp file management and cleanup
  - **docs/guides/WORKFLOWS.md** — Page→Wireframe and Wireframe→Wireframe cookbooks
  - **docs/guides/QUICK-START.md** — 5-minute getting started guide
- **packages/wireframe-core/templates/agents/** — Individual agent prompt files

**Edit rules:**

- Update normative rules in the appropriate reference docs; avoid duplicating content.
- Keep anchors stable (e.g., `#metadata-schema-v2-0`, `#intelligent-routing-workflow`) to support deep links.

## Excluded from Agent Context

The following paths are **not relevant** to wireframe creation and should be ignored:

- `tests/` — E2E test specs (CI-only)
- `packages/wireframe-core/scripts/tests/` — Unit tests (CI-only)
- `*.test.*`, `*.spec.*` — Test file patterns
- `vitest.config.ts`, `playwright.config.ts` — Test configuration
- `.github/workflows/test.yml`, `.github/workflows/security.yml` — CI workflows
- `playwright-report/`, `test-results/`, `coverage/` — Test output artifacts

---

## Platform Overview

**Reusable wireframe generation platform** supporting multiple wireframe projects with shared components and agent-assisted workflows.

> **Default stance**: When a request does not name an existing project, assume the user wants a brand-new wireframe set (index + variants) with fresh routing. Touch legacy implementations only when explicitly called out.

### Core Philosophy

This project is a **wireframe development platform**, not a single-purpose app. It provides:

- **Shared foundation**: Reusable components, design system, and utilities
- **Project isolation**: Each wireframe lives independently in `src/wireframes/[project-slug]/`
- **Agent workflows**: Subagents transform design briefs into LLM-ready prompts for rapid generation
- **Lightweight & extensible**: Claude Code and MCPs do the heavy lifting; structure stays minimal

### Tech Stack

- **Framework**: Vite + React 18 + TypeScript
- **Styling**: Tailwind CSS (8px baseline rhythm)
- **Components**: shadcn-ui (Radix UI primitives)
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Testing**: Chrome DevTools MCP integration

---

## Project Context Confirmation

**Before beginning any wireframe task, agents MUST confirm the project context:**

1. **Ask which project**: If the user's request doesn't specify a project, ask:
   > "Which project are you working on? (e.g., the folder name under `projects/`)"

2. **Verify the working directory**: Confirm the project exists at `projects/[project-name]/`

3. **Check for active state**: Look for `context/temp-agent-outputs/workflow-state.json` in the project folder to understand any in-progress work

4. **Document the context**: When starting work, state clearly:
   > "Working on project: [project-name] at projects/[project-name]/"

**Why this matters**: This framework supports multiple independent projects. Confirming context prevents:

- Mixing files between projects
- Running commands in wrong directories
- Modifying framework files when project files were intended

---

## Monorepo Structure

This repository is a **monorepo** that separates the generic wireframe framework from project-specific implementations:

```
wireframe-platform/                    # Repository root
├── packages/
│   └── wireframe-core/                # Generic wireframe framework
│       ├── src/shared/                # Reusable UI components, hooks, utilities
│       ├── scripts/                   # CLI tools (scaffold, validate, orchestrate)
│       ├── templates/                 # Agent prompt templates
│       └── docs/                      # Framework documentation
│
├── projects/
│   └── [project-name]/                # Project-specific implementations (git-ignored)
│       ├── src/
│       │   ├── wireframes/            # Wireframe implementations
│       │   └── shared/                # Project-specific shared components
│       └── context/                   # Project-specific context files
│
├── AGENTS.md                          # This file (framework guide)
└── CLAUDE.md                          # Symlink to AGENTS.md
```

### Key Principles

1. **Framework vs Projects**: The `packages/wireframe-core/` contains reusable framework code. Project-specific wireframes live in `projects/[project-name]/` and are **git-ignored** by default.

2. **Project Isolation**: Each project in `projects/` is independent and untracked. This allows different clients/teams to use the same framework without sharing implementation details.

3. **New Projects**: To create wireframes for a new project:
   - Create a new directory: `projects/[project-slug]/`
   - Copy structure from an existing project template
   - Configure `package.json` to reference `@wireframe/core`
   - Add wireframes to `src/wireframes/[wireframe-slug]/`

4. **Working Directory**: When working on a project, run commands from the project directory:

   ```bash
   cd projects/[project-name]
   npm run dev
   npm run validate:metadata
   npm run orchestrate -- --project <wireframe-slug>
   ```

---

## Core Development Workflow

### Primary Workflow: Direct Implementation in Claude Code/Codex

Most wireframes are built directly in the codebase:

1. **Gather Requirements** — Use agent system for strategic guidance:
   - `business-context-gatherer` (new projects only)
   - `brief-analyzer` — Extract structure and requirements
   - `wireframe-strategist` — Design 2-3 differentiated variants
2. **Implement Directly** — Build components and pages in the codebase
3. **Iterate with Chrome DevTools MCP** — Preview and refine until complete

### Optional Workflow: Export to Lovable

Only when specifically requested by the user:

1. Run `prompt-generator` agent to create Lovable-ready prompt
2. User pastes prompt into Lovable for external generation
3. Import results back to codebase if needed

**Default assumption**: Build directly in Claude Code unless user explicitly asks for Lovable export.

### Iteration Loop (Claude Code + Chrome DevTools MCP)

For any UI/design task, follow this iterative cycle:

1. **Analyze Request:** Review the user's design request and current implementation.
2. **Implement Change:** Modify React components and styles.
3. **Visual Verification:** Use Chrome DevTools MCP browser tools to preview changes:
    - `mcp__chrome-devtools__navigate_page` to load the dev server
    - `mcp__chrome-devtools__take_snapshot` (preferred - no size limits)
    - `mcp__chrome-devtools__take_screenshot` (viewport only, never full-page)

    **Screenshot Best Practices**:
    - Never use `fullPage: true` - Claude rejects images over 8000px in any dimension
    - Use viewport screenshots (omit `fullPage` parameter or set to `false`)
    - For long pages: take multiple viewport screenshots by scrolling, or rely on `take_snapshot`
4. **Self-Correct:** Compare output against requirements, repeat until complete.

---

## Request Intake

### Step 0: Business Context (New Projects Only)

**For new wireframe projects**, start by capturing business context using the `business-context-gatherer` agent (see `AGENT-WORKFLOWS.md`). This gathers:

- Industry, market position, competitive landscape
- Business model, value proposition, strategic goals
- Target personas, pain points, decision-makers
- Success metrics and KPIs
- Regulatory/technical constraints

Output stored in `context/BUSINESS-CONTEXT.md` (git-ignored, project-specific)

- Maintain the `## Revision History` table; log a new row whenever context shifts.
- After edits, run `npm run export:business-context` so downstream agents consume the latest JSON snapshot.

### Step 1: Brief Requirements

Collect these fields (ask for missing items) before committing to implementation:

| Category | Required Fields |
| --- | --- |
| Project Identity | Project name (slug auto-derives), target audience(s), primary goal/conversion |
| Routing Preferences | Base route defaults to the derived slug, variants default to three (A-C) unless specified |
| Content Priorities | Mandatory sections, hero narrative, data highlights, CTAs, form requirements |
| Visual & Interaction Notes | Layout inspiration, animation/sticky behavior, device emphasis, accessibility |
| Differentiation Signals | How variants should differ (hypotheses, user segments, campaign focus) |
| Assets & References | Documents, charts, logos, external URLs |
| Constraints | Timeline, legal, or tech blockers (optional at intake) |

**Quick start: generate a new wireframe project**

- `npm run scaffold` — prompts for project name/slug; creates components/pages/metadata/brief
- `npm run scaffold -- --apply-routes=root` — auto-wires to serve at `/`
- `npm run scaffold -- --apply-routes=namespace` — auto-wires under `/<slug>`

### ID Naming Conventions (Goals/Personas/KPIs)

- Use lowercase kebab-case for all IDs.
- Recommended prefixes: `goal-*`, `kpi-*` (optional); persona IDs derive from persona names
- Business context exporter auto-generates IDs by slugifying labels/names.
- When setting `metadata.businessContext` or `variants[*].businessContextRef`, reference these IDs exactly.

### Intake Paths and Copy Policy

- **Brief → Wireframe** (default): Always default to lorem ipsum. Do NOT prompt for real copy unless explicitly requested.
- **Page → Wireframe** (URL or screenshot): Prompt whether to use existing copy or lorem (default lorem).
- **Wireframe → Wireframe**: Default to preserve existing copy.

### Intake Helper Agents

- **Visual Guidance Agent**: If visual notes missing, engage `visual-ux-advisor` subagent
- **Variant Differentiator Agent**: When differentiation unspecified, invoke `variant-differentiator`
- **Business Context Validator Agent**: After strategist runs, execute `business-context-validator`
- **UX Review Agent**: After implementation, run `ux-review` per variant

---

## Project Architecture

### Directory Structure

```
src/
├── App.tsx                           # Main routing (all wireframe projects)
├── main.tsx                          # Application entry point
│
├── shared/                           # Reusable across ALL wireframes
│   ├── components/                  # Shared wireframe patterns
│   │   ├── WireframeHeader.tsx      # Standard header component
│   │   ├── WireframeFooter.tsx      # Standard footer component
│   │   └── WireframeCard.tsx        # Variant preview card
│   ├── ui/                          # shadcn-ui primitives (Radix UI)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── ... (50+ components)
│   ├── hooks/                       # Custom React hooks
│   │   └── use-toast.ts
│   ├── lib/                         # Utilities
│   │   └── utils.ts
│   └── styles/                      # Global CSS
│       ├── index.css                # Tailwind imports + global styles
│       └── App.css                  # Legacy app styles
│
├── wireframes/                       # Multi-project wireframes
│   ├── [project-slug]/              # e.g., "product-launch"
│   │   ├── components/              # Project-specific sections
│   │   │   ├── HeroSection.tsx
│   │   │   └── ...
│   │   ├── pages/                   # Project routes (index + variants + resources)
│   │   │   ├── Index.tsx
│   │   │   ├── [VariantName].tsx
│   │   │   └── resources/
│   │   ├── brief.txt                # Original design brief
│   │   └── metadata.json            # Project config (routes, variants, JTBD)
│   │
│   └── mining-tech-survey/          # Legacy example project (read-only unless requested)
│
└── vite-env.d.ts
```

### Import Path Conventions

- **Shared code**: Use `@/shared/` alias
  - `import { Button } from "@/shared/ui/button";`
  - `import { WireframeHeader } from "@/shared/components/WireframeHeader";`
- **Project-specific code**: Use relative paths
  - `import { HeroSection } from "../components/HeroSection";`
- **Cross-project**: Always use absolute `@/wireframes/[project]/` paths (rare)

### Configuration Files

- `tailwind.config.ts` — Design tokens and utility extensions
- `vite.config.ts` — Dev server (port 8080) and build config
- `context/WIREFRAME-FUNDAMENTALS.md` — Design principles for all wireframes
- `context/` — See Context File Management below

### Context File Management

- Store long-lived project reference docs in `context/` (e.g., `context/WIREFRAME-FUNDAMENTALS.md`).
- **Business context**: `context/BUSINESS-CONTEXT.md` captures strategic business intelligence. This file is:
  - **Git-ignored** (project-specific, not shared across teams)
  - **Permanent** for the lifetime of the project
  - **Referenced by all agents** to align wireframes with business objectives
  - **Revision-tracked in-file**: Keep the `## Revision History` table current.
- Place ephemeral artifacts under `context/temp/`:
  - Screenshots → `context/temp/screenshots/`
  - Project-specific dumps → `context/temp/projects/<slug>/`
  - Clear them with `npm run clean:context-temp`
- Agent pipelines rely on `context/temp-agent-outputs/` for structured JSON/markdown.

---

## Metadata Schema v2.0

**Complete specification**: See **[docs/METADATA-SCHEMA.md](./packages/wireframe-core/docs/METADATA-SCHEMA.md)**

### Quick Reference

- Schema version must be `"2.0"`
- Required fields: `id`, `slug`, `title`, `description`, `version`, `lastUpdated`
- Slugs are lowercase kebab-case. Variant keys in `variants{}` become URL segments.
- Only set `routes.index` and optional `routes.resources` in metadata. Variant routes are derived automatically.
- Link business context: set `businessContext` (primaryGoal/goals/personas/kpis) and per-variant `businessContextRef.goalIds/personaIds`.
- Single-variant projects: empty `variants{}` + `"projectType": "single-variant"`
- Always run `npm run validate:metadata` after edits; export business context JSON before validation when updated.

**Example**: See **[docs/examples/metadata-example.json](./packages/wireframe-core/docs/examples/metadata-example.json)**

---

## Intelligent Routing Workflow

**Complete reference**: See **[docs/ROUTING.md](./packages/wireframe-core/docs/ROUTING.md)**

Routes automatically generate from schema v2.0 metadata — **no manual `App.tsx` editing required**.

### Key Steps

1. **Derive Project Slug**: Kebab-case the project title unless the brief supplies an alternative.
2. **Establish Base Route**: Default to `/${slug}`. Only take over `/` if explicitly demanded.
3. **Index First**: Generate `pages/Index.tsx` for every project with links/cards to each variant.
4. **Variant Routes**: Slugify variant names (`Conversion First` → `conversion-first`). Set these as `variants` object keys.
5. **Nav Defaults**: Top navigation includes: index + each variant (+ resources when present).
6. **Preference Overrides**: Respect directive flags like "wizard", "no index", or "resources-only".
7. **Cross-Linking**: Encourage variant-to-variant and variant-to-index links where helpful.

### Validation

- `npm run validate:metadata` then `npm run dev`
- Naming: kebab-case path → PascalCase filename (`conversion-first` → `ConversionFirst.tsx`)

---

## Working Ritual & Developer Utilities

### Daily Workflow

1. Install dependencies with `npm i` the first time or after package updates.
2. Use `npm run dev` for daily work; `npm run build` for production validation.
3. Run `npm run lint` once TypeScript/TSX changes stabilize.
4. Validate metadata after edits: `npm run validate:metadata`
5. Periodically clean temp artifacts: `npm run cleanup:selective:execute`

### Developer Utilities

| Command | Purpose |
| --- | --- |
| `npm run list` | Overview of all wireframe projects and variants |
| `npm run doctor` | Health check (Node, dependencies, metadata, routes, Git status) |
| `npm run create` | Alias for `npm run init` (create new project) |
| `npm run validate:all` | Run all validations (metadata, routes, business context, TypeScript) |
| `npm run clean:all` | Nuclear cleanup with confirmation (temp files, build artifacts, MCP caches) |

### CLI Orchestration (Codex & Claude)

- Kick off each session with `/start --project <slug>` to surface workflow state.
- Use `npm run orchestrate -- --project <slug>` to manage the agent workflow.
- Outputs live in `context/temp-agent-outputs/`; rerun the orchestrator after each agent response.
- Optional flags: `--brief <path>`, `--skip-business-context`, `--force-visual`, `--skip-variant`, etc.
- Add `--prepare-prompts` to generate agent prompt templates.
- Use `node packages/wireframe-core/scripts/agents/run-agent.mjs --agent <name> --project <slug> --write` for specific agent prompts.
- `npm run self-iterate -- --project <slug> --headless --isolated` captures Chrome DevTools artifacts and runs validation.
- Additional self-iterate flags: `--grade-threshold <n>` (passing grade 0-100), `--non-interactive` (skip prompts), `--auto-fix` (enable auto-fixing).

### Slash Command Map

| Command | Purpose |
| --- | --- |
| `/wf` | Orchestrate end-to-end (smart resume) |
| `/analyze` | Intake analysis |
| `/strategize` | Variant strategy |
| `/validate` | Metadata/context/UI validation |
| `/export` | Artifacts + gated Lovable export |
| `/ux-review` | Post-build UX grading per variant |

See `context/prompts/README.md` for the prompt library overview.

---

## Implementation Standards

### Code Style

- Compose small React function components with clear TypeScript types at boundaries.
- Keep 2-space indentation and Tailwind-first styling.
- Extend Tailwind tokens in `tailwind.config.ts` rather than scattering magic values.
- Add comments only when control flow or intent would otherwise be unclear.

### Wireframe Design Principles (See `context/WIREFRAME-FUNDAMENTALS.md`)

- **Grayscale-first palette**: Use neutral grays for 90% of elements
- **Visual latitude**: Subtle shadows, gradients, and rounded accents welcome when they reinforce hierarchy
- **8px baseline rhythm**: All spacing multiples of 8px
- **12-column grid system**: Max width 1280px, 24px gutters
- **WCAG 2.1 AA compliant**: Color contrast, keyboard nav, semantic HTML
- **2-3 variants per project**: Each testing a distinct hypothesis
- **Mobile-responsive**: Test all breakpoints (sm: 640px, md: 768px, lg: 1024px, xl: 1280px)
- **Design tokens over magic values**: Pull radii, shadows, gradients via `getDesignToken()`

### Component Organization

- **Shared components**: Reusable patterns in `src/shared/components/`
- **Project-specific components**: Wireframe-specific in `src/wireframes/[project]/components/`
- **UI primitives**: shadcn-ui components in `src/shared/ui/`

---

## QA Checklist (Project Template)

- Anchor navigation must smooth-scroll to anchors declared in `metadata.json.sections[].anchor`.
- Sticky CTAs should respect project preferences—commonly hiding while the conversion section is visible.
- Primary CTAs should scroll to the designated conversion section; validate required fields and success toasts.
- Confirm secondary/resource links resolve correctly before and after form submission.
- Call out any design-token or visual experiments that should be reviewed for reuse.
- Use Chrome DevTools MCP or manual browser inspection after `npm run build:dev` to validate UX changes.

---

## Snapshot System & Maintenance

### Snapshot System (Version Control for Git-Ignored Files)

**Complete reference**: See **[docs/SNAPSHOT-SYSTEM.md](./packages/wireframe-core/docs/SNAPSHOT-SYSTEM.md)**

**Purpose**: Roll back wireframe changes including git-ignored files that Git cannot track.

**Commands**:

```bash
# Create snapshot
npm run snapshot -- --project=SLUG [--description="..."]

# List snapshots
npm run snapshot:list -- --project=SLUG

# Restore snapshot (auto-creates backup first)
npm run snapshot:restore -- --project=SLUG --timestamp=TIMESTAMP
```

### Temp File Management & Cleanup

**Complete reference**: See **[docs/MAINTENANCE.md](./packages/wireframe-core/docs/MAINTENANCE.md)**

```bash
# Selective cleanup (recommended) - preview what will be deleted
npm run cleanup:selective

# Execute selective cleanup
npm run cleanup:selective:execute

# Nuclear cleanup (use with caution)
npm run clean:context-temp
```

**Retention policies**: Temp screenshots (7 days), manual snapshots (keep latest 3), project snapshots (keep all).

---

## Chrome DevTools MCP Integration

Chrome DevTools MCP is used for visual validation and iteration:

- Browser tools connect to Chrome for headless and interactive testing
- Snapshots capture accessibility tree and page state
- Screenshots provide visual confirmation
- The self-iteration loop auto-starts a headless Chrome bridge when none is configured
- Run `npm run mcp:bridge` manually for a persistent session

### Validation Workflow

After making any UI change:

1. **Preview**: Navigate to the changed page using Chrome DevTools MCP
2. **Snapshot**: Capture accessibility tree with `take_snapshot`
3. **Visual Check**: Capture viewport screenshot (never full-page)
4. **Validate**: Compare against requirements
5. **Iterate**: If issues found, adjust code and repeat

**Troubleshooting**: See [docs/TROUBLESHOOTING-CHROME-BRIDGE.md](./packages/wireframe-core/docs/TROUBLESHOOTING-CHROME-BRIDGE.md)

---

## Git & Collaboration

- Develop on feature branches; keep commits tight with Conventional Commit prefixes (`feat:`, `fix:`, `chore:`, `refactor:`).
- Before pushing, confirm `npm run build:dev` succeeds and lint warnings are fixed or documented.
- Pull requests should outline the change, list affected routes/screens, attach before/after captures, and link the relevant task/issue.

---

## Wireframe Iteration Workflows

**Complete guides**: See **[docs/guides/WORKFLOWS.md](./packages/wireframe-core/docs/guides/WORKFLOWS.md)**

### Page → Wireframe (URL/Screenshot to Wireframe)

1. Capture: `npm run transcribe -- --url=URL --slug=SLUG`
2. Run `wireframe-transcriber` agent
3. Run `wireframe-strategist` agent
4. Implement components and pages

### Wireframe → Wireframe (Iterate Existing)

1. Iterate: `npm run iterate -- --from=BASELINE --new=NEW`
2. Run `wireframe-iter` agent
3. Apply changes, update metadata, record changeLog
4. Validate with Chrome DevTools MCP

---

## Related Documentation

- **[AGENT-WORKFLOWS.md](./AGENT-WORKFLOWS.md)** — Agent prompts and workflow definitions
- **[DOCUMENTATION.md](./DOCUMENTATION.md)** — Complete documentation index
- **[context/WIREFRAME-FUNDAMENTALS.md](./context/WIREFRAME-FUNDAMENTALS.md)** — Design principles and standards
- **[context/WIREFRAME-PATTERNS.md](./context/WIREFRAME-PATTERNS.md)** — Platform-specific design patterns

---

Keep this guide current as the project evolves.
