---
id: wf
handle: /wf
phase: orchestrate
description: Run the end-to-end wireframe orchestrator workflow for wireframe platform projects.
inputs:
  - --project <slug>
  - --brief <path> | --url <url> | --screenshot <path>
  - --refresh-context
outputs:
  - context/temp-agent-outputs/brief-analysis.json
  - context/temp-agent-outputs/brief-analysis-summary.md
  - context/temp-agent-outputs/wireframe-strategy.json
  - context/temp-agent-outputs/wireframe-strategy-summary.md
  - context/temp-agent-outputs/business-context-validation.json (if validated)
  - context/temp-agent-outputs/self-iteration/<slug>/iteration-*/validation.json (if UI validated)
defaults:
  loremCopy: true
  variants: [A, B, C]
  metaSchemaVersion: "2.0"
references:
  - ../../../AGENT-WORKFLOWS.md#agent-1-brief-analyzer
  - ../../../AGENT-WORKFLOWS.md#agent-2-wireframe-strategist
  - ../../../AGENT-WORKFLOWS.md#agent-6-business-context-validator
  - ../../../AGENT-WORKFLOWS.md#guardrails
  - ../../../CLAUDE.md#metadata-schema-v2-0
---

Guardrails

- See consolidated guardrails in ../../../AGENT-WORKFLOWS.md#guardrails
- Copy policy: For brief-derived wireframes, default to lorem ipsum unless explicitly requested otherwise.
- Variant policy: Assume 3 variants (A/B/C) unless overridden; differences must be strategic (order/emphasis/flow), not cosmetic only.
- Design experiments: Encourage subtle visual explorations (shadows, gradients, radii) when helpful and clearly label them as optional.
- Schema alignment: Enforce metadata schema v2.0; id, slug (kebab-case), title, description, version, lastUpdated; only set routes.index and optional routes.resources; derive variant routes from variants keys; link business context via businessContext and businessContextRef goalIds/personaIds.
- Validation reminder: Before metadata/context validation, export business context JSON from context/BUSINESS-CONTEXT.md using: npm run export:business-context
- Storage: Persist artifacts under context/temp-agent-outputs/; do not commit generated artifacts.

Preconditions

- --project <slug> must be provided
- Provide exactly one intake source: --brief | --url | --screenshot
- If a business context exists or --refresh-context is provided, run npm run export:business-context before downstream validation

Instructions

1) If --refresh-context is provided or a business context exists, remind the operator to run:
   - npm run export:business-context
2) Run the orchestrator with any intake flags provided (brief/url/screenshot):
   - npm run orchestrate -- --project <slug> [--brief <path> | --url <url> | --screenshot <path>]
3) Monitor orchestrator output paths under context/temp-agent-outputs/.
4) Capture any design-system experiments surfaced (e.g., preferred radii, elevations) and note whether they should stay project-specific or be considered for reuse.
5) Interpret orchestrator output to detect which artifacts now exist and what work remains.
6) Respond using the format below so the operator understands progress and can choose the best next step confidently.

Response Format

- **Recap**: Summarize which orchestrator phases ran, key artifacts created/updated, and any immediate warnings.
- **Current Signals**: Call out remaining gaps (e.g., missing brief analysis, strategy, validation) and any prerequisite reminders (business context export, variant naming decisions).
- **Next Options**: Provide a numbered list generated from the logic below, including short rationales and prerequisites.
- **Reference Reminder** (optional): Point to cheatsheet/doc snippet only if the operator must review it before proceeding.

Next steps logic (echo to operator)

- If brief-analysis.json is missing → suggest: /analyze --project <slug> {--brief|--url|--screenshot}
- Else if wireframe-strategy.json is missing → suggest: /strategize --project <slug>
- Else → suggest: /validate --project <slug> --metadata --context (and optionally --ui) or /export --project <slug>
