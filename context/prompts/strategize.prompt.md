---
id: strategize
handle: /strategize
phase: strategize
description: Generate differentiated wireframe layout variants and routing guidance.
inputs:
  - --project <slug>
  - --variants 2|3 (optional; default 3)
outputs:
  - context/temp-agent-outputs/wireframe-strategy.json
  - context/temp-agent-outputs/wireframe-strategy-summary.md
defaults:
  loremCopy: true
  variants: [A, B, C]
  metaSchemaVersion: "2.0"
references:
  - ../../../AGENT-WORKFLOWS.md#agent-2-wireframe-strategist
  - ../../../AGENT-WORKFLOWS.md#agent-5-variant-differentiator
  - ../../../AGENT-WORKFLOWS.md#guardrails
  - ../../../CLAUDE.md#metadata-schema-v2-0
---

Guardrails

- See consolidated guardrails in ../../../AGENT-WORKFLOWS.md#guardrails
- Differences must be strategic (segment, hypothesis, flow/order/emphasis), not cosmetic only.
- 2–3 variants allowed; cap at 3 and explain if a higher number is requested.
- Design experiments: If recommending visual/system tweaks (shadows, radii, gradients), label them optional and indicate whether they’re candidate tokens or variant-specific.
- Schema v2.0 alignment for all downstream metadata notes; link business context via businessContext and per-variant businessContextRef.
- Storage: Write outputs to context/temp-agent-outputs/ only.

Preconditions

- --project <slug> must be provided
- Variants count must be 2 or 3 (default 3)

Instructions

1) Read latest:
   - context/temp-agent-outputs/brief-analysis.json
   - context/temp-agent-outputs/business-context.json (if available)
2) Produce 2–3 variant plans with:
   - target segment, hypothesis, value prop, CTA, section emphasis
   - notes to inform metadata.json variants[] and index/variant cross-links
3) Save outputs:
   - wireframe-strategy.json and wireframe-strategy-summary.md
4) Highlight any recurring design-system experiments so future projects can decide whether to promote them.
5) Respond using the structured format below so the operator understands the completed work, uncovered insights, and next decisions.

Response Format

- **Recap**: State which inputs were read and confirm strategy artifacts written.
- **Current Signals**: Summarize key hypotheses, required follow-ups (e.g., variant differentiator gaps), and risks blocking build work.
- **Next Options**: Provide a numbered list with at least two recommended commands or actions (e.g., coding tasks, `/validate` prep), including prerequisites and rationale.
- **Reference Reminder** (optional): Link to cheatsheet or guardrails only when extra reading is essential.

Next steps

- Suggest validation: /validate --project <slug> --metadata --context
