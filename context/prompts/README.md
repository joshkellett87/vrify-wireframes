# Slash Prompt Library (Option B)

Purpose

- Small, durable command surface for orchestrating the workflow via seven reusable prompts.
- Prompts are self-describing with uniform YAML front matter and inline guardrails.
- No changes to orchestrator logic; these files help humans/LLMs run the correct steps and save artifacts in the right paths.
- Single source of truth: one set of prompts generates both Claude Code and Codex CLI outputs.

Locations

- Source prompts: context/prompts/
  - /wf → wf.prompt.md
  - /start → start.prompt.md
  - /analyze → analyze.prompt.md
  - /strategize → strategize.prompt.md
  - /validate → validate.prompt.md
  - /export → export.prompt.md
  - /ux-review → ux-review.prompt.md
- Codex prompts: context/prompts/codex/
  - Mirrors the seven Claude prompts
- Generated outputs:
  - Claude Code: .claude/commands/wireframe-*.md
  - Codex CLI: codex-cli.json (maps handles to prompt paths and variables)

Front matter schema (every .prompt.md)

- id: wf | analyze | strategize | validate | export | ux-review
- handle: /wf | /analyze | /strategize | /validate | /export | /ux-review
- phase: orchestrate | analyze | strategize | validate | export
- inputs: accepted flags
- outputs: expected artifacts under context/temp-agent-outputs/
- defaults: { loremCopy: true, variants: [A, B, C], metaSchemaVersion: "2.0" }
- references: links to AGENT-WORKFLOWS.md and CLAUDE.md

Inline guardrails (embedded at top of each prompt)

- Copy policy: Brief → Wireframe defaults to lorem ipsum unless explicitly requested otherwise.
- Variant policy: Assume 3 variants (A/B/C); enforce strategic (not cosmetic) differences. Cap to 3.
- Schema alignment: metadata schema v2.0; only set routes.index and optional routes.resources; derive variant routes from variant keys; link business context via businessContext and per-variant businessContextRef.
- Validation reminder: run `npm run export:business-context` before metadata/context validation.
- Storage: write artifacts to context/temp-agent-outputs/; do not commit generated artifacts.

Deprecation policy (legacy placeholders)

- Legacy prompt files are located in `context/prompts/deprecated/`
- These are marked with `status: deprecated` and are automatically skipped by wf-setup.mjs
- Use the seven current prompts instead (see Locations above)
- See also: context/prompts/deprecated/README.md for policy details

Usage examples

- Claude Code: Use slash commands directly (e.g., `/wf --project my-project`)
- Codex CLI: Use codex-cli.json with your CLI. Examples:
  - `codex prompt run wf --var project=my-project --var brief=@path/to/brief.txt`
  - `codex prompt run strategize --var project=my-project --var variants=3`

Setup & sync

- **Edit source prompts**: Modify files in `context/prompts/*.prompt.md`
- **Regenerate outputs**: `npm run wf:setup -w @wireframe/core`
  - Generates `.claude/commands/wireframe-*.md` for Claude Code
  - Updates `codex-cli.json` for Codex CLI
  - Both outputs stay in sync automatically
- **View Codex examples**: `npm run codex:prompts -w @wireframe/core` prints ready-to-run commands
- **No drift possible**: Single source of truth ensures Claude and Codex always match

How outputs are generated

- Source: `packages/wireframe-core/scripts/wf-setup.mjs`
- Input: `context/prompts/*.prompt.md` (single source)
- Outputs:
  - `.claude/commands/wireframe-<id>.md` (7 files for Claude Code)
  - `codex-cli.json` (manifest for Codex CLI)
- Path normalization: deep relatives like `../../../` are collapsed to `../` so links remain readable
- Variable extraction: CLI flags are parsed from `inputs:` using `String.matchAll(/--([a-z0-9-]+)/gi)`
- Safe writes: files are only updated when content changes (idempotent)

Notes

- Orchestrator and scripts are unchanged; prompts are additive.
- Rebuild doc highlights with `npm run docs:build` when updating canonical docs.
- Artifacts live under context/temp-agent-outputs/ and are git-ignored by default.
