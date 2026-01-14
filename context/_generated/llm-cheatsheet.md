# LLM Cheatsheet — Wireframe Platform Core

Use this quick reference to prompt Codex/Claude without re-reading the full playbook.

## Core Defaults

- Metadata schema: `"2.0"` with `slug` in kebab-case, `projectType` `"single-variant"` when no variants.
- Routes: always ship index (`/${slug}`) plus derived variant routes; only set `routes.index` and optional `routes.resources`.
- Variants: default to three (`Variant A/B/C`) with strategic differences (segment, flow, emphasis) rather than cosmetics.
- Copy policy: default to lorem ipsum unless requester explicitly opts in to real copy.
- Business context: maintain `context/BUSINESS-CONTEXT.md`; export JSON via `npm run export:business-context` before validation.

## Workflow At-a-Glance

1. **Intake** — `/start` → `/analyze --project <slug> (--brief|--url|--screenshot)`  
   Outputs `brief-analysis.json|.md`. Flag if business context export missing.
2. **Strategy** — `/strategize --project <slug> [--variants]` (call `variant-differentiator` if gaps)  
   Outputs `wireframe-strategy.json|.md` with persona/goal mapping notes.
3. **Build** — Implement pages/components per strategy. Keep metadata/schema v2.0 rules in view.
4. **Validate** — `/validate --project <slug> --metadata --context [--ui --dom <path> --screenshot <path>]`  
   Dependencies: latest `business-context.json`, updated metadata files, DOM/screenshot for UI pass.
5. **Export/Handoff** — `/export --project <slug> [--lovable]` (requires “I confirm Lovable export”).

## CLI Helpers

- `/start` — Orientation; inspects `workflow-state.json` and artifacts; lists next commands.
- `/wf` — Runs orchestrator; enables `--brief|--url|--screenshot` for intake.
- `npm run orchestrate --status` — Enhanced snapshot (artifacts, open tasks, next options).
- `npm run orchestrate --guide` — Prints workflow blueprint extracted from `context/cli-experience-blueprint.md`.
- `npm run export:business-context` — Syncs Markdown → JSON for validators.
- `npm run validate:metadata` — Enforces metadata schema v2.0 (run after edits).

## Guardrails & Reminders

- Anchor IDs must match `metadata.json.sections[].anchor`; smooth-scroll to sections.
- Sticky CTAs hide when conversion form in view, reappear after (~320px) unless brief overrides.
- Primary CTA scrolls to conversion section; ensure required fields + success toast match brief.
- Cross-link index and variants; top nav defaults to index + each variant (+ resources if provided).
- Document optional design experiments (shadows, radii, gradients) as “optional” within summaries.

## Artifact Paths

- `context/temp-agent-outputs/brief-analysis.json` — Structured intake summary.
- `context/temp-agent-outputs/wireframe-strategy.json` — Variant hypotheses + routing notes.
- `context/temp-agent-outputs/business-context.json` — Structured export (source: `context/BUSINESS-CONTEXT.md`).
- `context/temp-agent-outputs/business-context-validation.json` — Metadata/context validation results.
- `context/temp-agent-outputs/self-iteration/<slug>/iteration-*/validation.json` — UI validation runs.

Keep this file lightweight and regenerate if guardrails change in CLAUDE.md or AGENT-WORKFLOWS.md.
