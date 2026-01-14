---
id: start
handle: /start
phase: orientation
description: Summarize current workflow state, surfaced artifacts, and recommended next actions.
inputs:
  - --project <slug> (optional)
outputs:
  - orientation only (no files written)
defaults:
  loremCopy: true
  variants: [A, B, C]
  metaSchemaVersion: "2.0"
references:
  - ../../../context/cli-experience-blueprint.md
  - ../../../AGENT-WORKFLOWS.md#guardrails
  - ../../../CLAUDE.md#metadata-schema-v2-0
---

Guardrails

- Do not mutate files or run build/orchestrator commands—surface context only.
- Pull facts from existing artifacts (`context/temp-agent-outputs/…`) and the workflow state JSON; clearly label when data is missing.
- Reinforce copy, variant, and metadata guardrails only when relevant to the detected next step.

Preconditions

- None; operate gracefully even if no workflow state exists yet.

Instructions

1) Determine the active project slug:
   - Prefer the `--project` input when provided.
   - Otherwise, read `context/temp-agent-outputs/workflow-state.json` and use `projectSlug` if present.
2) Load workflow context:
   - Check for `workflow-state.json`; extract `currentPhase`, `status`, pending/completed agents, and known context files.
   - Detect presence of key artifacts (e.g., `brief-analysis.json`, `wireframe-strategy.json`, `business-context-validation.json`, `self-iteration/<slug>/…/validation.json`) and note timestamps when available.
3) Capture prerequisite signals:
   - Flag if business context export is required (state references a context file but JSON missing or stale).
   - Identify missing intake source, strategy, or validation outputs.
4) Construct the orientation response using the required format below; tailor recommendations to the detected gaps and remind about guardrails only when actionable.

Response Format

- **Current Snapshot**: Project slug (or “not detected”), workflow phase/status, and any pending agents if present.
- **Artifacts**: Bullet list of discovered artifacts with status (Ready / Missing / Stale) and relevant paths.
- **Open Tasks**: Highlight blockers or prerequisites (e.g., “Business context JSON not exported”, “Strategy not generated”).
- **Next Options**: Provide a numbered list of 2–3 suggested commands/actions (e.g., `/analyze`, `/strategize`, `/validate`, `/export`, `npm run orchestrate --status`), each with a short rationale and prerequisites.
- **Reference Reminder** (optional): Point to the cheatsheet or guardrails only if the operator must review before proceeding.
