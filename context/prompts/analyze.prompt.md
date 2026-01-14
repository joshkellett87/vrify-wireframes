---
id: analyze
handle: /analyze
phase: analyze
description: Analyze intake material to produce structured wireframe brief outputs.
inputs:
  - --project <slug>
  - one of: --brief <path> | --url <url> | --screenshot <path>
  - --refresh-context (optional)
outputs:
  - context/temp-agent-outputs/brief-analysis.json
  - context/temp-agent-outputs/brief-analysis-summary.md
defaults:
  loremCopy: true
  variants: [A, B, C]
  metaSchemaVersion: "2.0"
references:
  - ../../../AGENT-WORKFLOWS.md#agent-1-brief-analyzer
  - ../../../AGENT-WORKFLOWS.md#guardrails
  - ../../../CLAUDE.md#metadata-schema-v2-0
---

Guardrails

- See consolidated guardrails in ../../../AGENT-WORKFLOWS.md#guardrails
- Copy policy: For brief-derived wireframes, default to lorem ipsum unless explicitly requested otherwise.
- Variant policy: Assume 3 variants (A/B/C) unless overridden; differences must be strategic, not cosmetic only.
- Design experiments: Surface optional visual or token experiments (e.g., radii, shadows) when the brief hints at them and mark them as exploratory.
- Schema alignment: Enforce metadata schema v2.0; keep routes.index only (plus optional routes.resources); derive variant routes from variant keys; link business context via businessContext and per-variant businessContextRef.
- Validation reminder: Before metadata/context validation later, export business context JSON using: npm run export:business-context
- Storage: Write outputs to context/temp-agent-outputs/ only.

Preconditions

- --project <slug> must be provided
- Provide exactly one intake source: --brief | --url | --screenshot
- If --refresh-context is provided or a business context exists, run npm run export:business-context first

Instructions

1) Require exactly one intake source: --brief OR --url OR --screenshot.
2) If --refresh-context is provided or context exists, remind the operator to export first:
   - npm run export:business-context
3) Parse the brief/page into:
   - context/temp-agent-outputs/brief-analysis.json
   - context/temp-agent-outputs/brief-analysis-summary.md
   Aligned with AGENT-WORKFLOWS schema (routingInputs, sectionStructure, constraints, etc.).
4) Call out any design-system opportunities uncovered (preferred radii, depth, typography shifts) so downstream agents can evaluate them deliberately.
5) Craft the response using the format below so the operator knows what completed, what’s missing, and the smartest next actions.

Response Format

- **Recap**: Confirm the intake processed and artifacts written (or why they were skipped).
- **Current Signals**: Highlight critical findings, risks, and outstanding prerequisites (e.g., missing business context export).
- **Next Options**: Provide a numbered list of 2–3 recommended commands, each with a short rationale and prerequisites.
- **Reference Reminder** (optional): Point to the cheatsheet or guardrails only if the finding requires deeper reading.

Next steps

- Suggest: /strategize --project <slug>
