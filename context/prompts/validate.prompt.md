---
id: validate
handle: /validate
phase: validate
description: Validate metadata, business context alignment, and optional UI artifacts.
inputs:
  - --project <slug>
  - --metadata (optional)
  - --context (optional)
  - --ui (optional)
  - if --ui: --dom <path> --screenshot <path> [--console <path>]
outputs:
  - context/temp-agent-outputs/business-context-validation.json (for metadata/context)
  - context/temp-agent-outputs/business-context-validation.md (optional summary)
  - context/temp-agent-outputs/self-iteration/<slug>/iteration-*/validation.json (for UI)
  - context/temp-agent-outputs/self-iteration/<slug>/iteration-*/validation.md (optional summary)
defaults:
  loremCopy: true
  variants: [A, B, C]
  metaSchemaVersion: "2.0"
references:
  - ../../../AGENT-WORKFLOWS.md#agent-6-business-context-validator
  - ../../../AGENT-WORKFLOWS.md#agent-7-wireframe-validator
  - ../../../AGENT-WORKFLOWS.md#guardrails
  - ../../../CLAUDE.md#metadata-schema-v2-0
---

Guardrails

- See consolidated guardrails in ../../../AGENT-WORKFLOWS.md#guardrails
- Reminder (metadata/context): Run npm run export:business-context before validation to ensure JSON is up to date.
- UI validation requires DOM and screenshot paths; console log is optional.
- Design experiments: Flag any repeated overrides or visual tweaks so maintainers can consider promotion to the shared design system.
- Storage: Write all artifacts under context/temp-agent-outputs/ (and self-iteration paths for UI).

Preconditions

- --project <slug> must be provided
- If --metadata or --context: export business context JSON first
- If --ui: --dom and --screenshot are required (console log optional)

Instructions

- If --metadata or --context:
  1) Remind: npm run export:business-context
  2) Run checks and write business-context-validation.json(.md)
  3) Document any design-system findings (e.g., recurring radii/shadow overrides) in the validation summary.
- If --ui:
  1) Require: --dom and --screenshot
  2) Produce validation.json(.md) under self-iteration/<slug>/iteration-*/
- Craft the operator response using the format below so outcomes and next moves stay obvious.

Response Format

- **Recap**: State which validations ran and where artifacts were written (or why they were skipped).
- **Current Signals**: List pass/fail highlights, blocking issues, and outstanding prerequisites (e.g., missing business context export).
- **Next Options**: Provide a numbered set of follow-up commands/actions (e.g., re-run `/strategize`, fix metadata files, run `/export`), each with a short rationale and prerequisite note.
- **Reference Reminder** (optional): Point to the cheatsheet or relevant doc snippet only when necessary for remediation.

Next steps

- If gaps found: suggest /strategize (or edits) to address issues.
- If clean: suggest /export --project <slug>.
