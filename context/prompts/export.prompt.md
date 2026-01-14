---
id: export
handle: /export
phase: export
description: Package agent outputs and optionally generate the Lovable export prompt.
inputs:
  - --project <slug>
  - --lovable (optional; gated)
outputs:
  - context/temp-agent-outputs/final-prompt.md (only if --lovable and explicit confirmation provided)
defaults:
  loremCopy: true
  variants: [A, B, C]
  metaSchemaVersion: "2.0"
references:
  - ../../../AGENT-WORKFLOWS.md#agent-3-prompt-generator
  - ../../../AGENT-WORKFLOWS.md#guardrails
  - ../../../CLAUDE.md#metadata-schema-v2-0
---

Guardrails

- See consolidated guardrails in ../../../AGENT-WORKFLOWS.md#guardrails
- Lovable prompt generation requires explicit confirmation: the operator must type exactly “I confirm Lovable export”. Without this, do not generate final-prompt.md.
- Design experiments: Summarize optional design-system tweaks in the exported notes so downstream contributors know they exist.
- Storage: Write outputs to context/temp-agent-outputs/ only.

Preconditions

- --project <slug> must be provided
- If --lovable is set: require exact confirmation phrase

Instructions

1) If --lovable is provided:
   - Require the exact phrase “I confirm Lovable export”. If not provided, exit with a friendly reminder.
   - On confirmation, generate context/temp-agent-outputs/final-prompt.md from the latest strategy and analysis.
2) Otherwise, export any requested artifacts and provide next-step guidance.
3) Ensure the export summary calls out any design-system experiments flagged during the workflow.
4) Shape the operator response with the format below so handoff status and future actions are unmistakable.

Response Format

- **Recap**: Confirm whether the export ran, what artifacts were produced, and any confirmations received.
- **Current Signals**: Note outstanding loose ends (e.g., pending validations, design experiments to file) or blockers preventing final handoff.
- **Next Options**: Provide a numbered list of post-export choices (e.g., share artifacts, run `/validate`, resume build), each with rationale and any prerequisites.
- **Reference Reminder** (optional): Mention documentation only if necessary for handoff or follow-up.

Next steps

- Suggest returning to /wf or /validate if additional work remains.
