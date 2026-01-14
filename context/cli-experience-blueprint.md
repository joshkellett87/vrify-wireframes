# CLI Experience Blueprint — Draft Outline

## 1. Session Overview Layer

- **Purpose**: Give operators immediate orientation at the start of every session.
- **Key Elements**:
  - Current project slug (if detected) and workflow phase.
  - Checklist of required artifacts (brief, business context, variant strategy, metadata validation).
  - Next-command recommendations with short rationale.
- **Implementation Hooks**:
  - `/start` (new prompt) or enhanced `/wf` intro.
  - `npm run orchestrate --status` enriched output for CLI parity.

## 2. Phase-by-Phase Blueprint

### Intake Phase

- **Entry Criteria**: Project slug chosen, intake source identified (brief/url/screenshot).
- **Primary Actions**: `/analyze` prompt or orchestrator intake pass.
- **Artifacts**: `context/temp-agent-outputs/brief-analysis.json|.md`.
- **Next Step Logic**: If analysis complete → recommend `/strategize`; if missing business context → suggest `npm run export:business-context`.
- **Operator Signals**: Highlight schema guardrails, copy policy (default lorem), and option to run `bc-gather`.

### Strategy Phase

- **Entry Criteria**: Brief analysis present, variants still undefined or pending confirmation.
- **Primary Actions**: `/strategize`, optional `variant-differentiator`.
- **Artifacts**: `wireframe-strategy.json|.md`, variant differentiation notes.
- **Next Step Logic**: If strategy present → recommend build guidance (open pages, scaffolding); missing differentiation → re-run helper agent.
- **Operator Signals**: List variant naming defaults, remind to capture persona/goal alignment.

### Build Phase

- **Entry Criteria**: Strategy artifacts exist; metadata/routes not yet implemented.
- **Primary Actions**: Manual coding, optional prompts for component scaffolding.
- **Artifacts**: Source files under `src/wireframes/<slug>/`, metadata drafts.
- **Next Step Logic**: Suggest `/validate` prerequisites, link to schema highlights.
- **Operator Signals**: Remind about routing defaults, navigation expectations, lorem policy.

### Validation Phase

- **Entry Criteria**: Build updates committed to repo; metadata and business context ready.
- **Primary Actions**: `/validate`, `npm run validate:metadata`, optional UI validation via self-iteration.
- **Artifacts**: Validation JSON outputs, console logs, screenshots.
- **Next Step Logic**: If metadata passes → propose `/export`; if fails → surface actionable fix summary.
- **Operator Signals**: Outline QA checklist headline items, console error triage.

### Export/Handoff Phase

- **Entry Criteria**: Validation artifacts complete; ready for packaging.
- **Primary Actions**: `/export`, optional Lovable prompt generation.
- **Artifacts**: Export bundles, Lovable prompt (if requested).
- **Next Step Logic**: Summarize completion checklist, link to change log or narrative summary template.
- **Operator Signals**: Confirm copy policy adherence, highlight optional design experiments.

## 3. CLI Option Catalog Structure

| Command / Flag | Contextual Placement | Prerequisites | Outputs | Next Recommendations |
| --- | --- | --- | --- | --- |
| `/start` *(new)* | Session Overview | None | Orientation summary | `/analyze`, `/strategize`, `/validate` depending on state |
| `/wf --project <slug> [--brief\|--url\|--screenshot]` | Intake → Orchestrate | Project slug, one intake source | Full workflow artifacts | `/strategize` or `/validate` based on gaps |
| `/analyze --project <slug> [--brief\|--url\|--screenshot]` | Intake | Project slug, intake source | Brief analysis JSON/summary | `/strategize` |
| `/strategize --project <slug> [--variants]` | Strategy | Brief analysis | Strategy JSON/summary | Build guidance, `/validate` prep |
| `/validate --project <slug> [--metadata --context --ui --dom --console]` | Validation | Build complete, exported context JSON | Validation artifacts | `/export` or rework instructions |
| `/export --project <slug> [--lovable]` | Export | Validation complete | Export package, optional Lovable prompt | Completion checklist, handoff notes |
| `npm run orchestrate --status` *(enriched)* | Any | Initialized workflow | Status + next steps | Command suggestions mirroring prompts |
| `node packages/wireframe-core/scripts/agents/run-agent.mjs --agent <name>` | Advanced / targeted | Project slug, relevant inputs | Agent-specific outputs | Depending on agent, guide back to main flow |

> Expand each row into detailed cue cards after stakeholder feedback. This table acts as the master catalog feeding both prompt copy and CLI status output.

## 4. Information Delivery Guidelines

- Always recap “You just…” and “Next you can…” in prompt responses.
- Embed guardrail reminders inline (metadata schema, copy policy, variant defaults).
- Surface missing prerequisites proactively instead of waiting for failures.
- Keep references scoped to short doc snippets (cheatsheet) to avoid context switching.

## 5. Open Questions / Validation Needs

- Confirm ownership of the `/start` prompt (Codex vs Claude parity).
- Decide whether orchestrator enhancements should block prompt updates or ship in parallel.
- Identify 2–3 pilot operators and gather baseline completion times for comparison.

## 6. Implementation Priorities

1. **Prompt Layer Enhancements (Immediate)**  
   - Update `/wf`, `/analyze`, `/strategize`, `/validate`, `/export` prompts to follow the recap + next-actions pattern.  
   - Introduce the `/start` orientation prompt leveraging existing workflow state where available.  
   - Reasoning: Prompt edits deliver user-facing gains fastest and require no CLI code changes.
2. **Orchestrator Output Upgrades (Next)**  
   - Expand `npm run orchestrate --status` to emit human-readable phase summaries and recommended commands.  
   - Add optional `--guide` flag to preview the phase blueprint.  
   - Reasoning: Dependent on finalized blueprint copy so CLI mirrors chat guidance exactly.
3. **Supplemental Docs & Cheatsheet (Parallel)**  
   - Generate `context/_generated/llm-cheatsheet.md` from key doc excerpts to keep prompts lightweight.  
   - Update AGENTS.md “CLI Orchestration” with the new flow once prompts and status output land.  
   - Reasoning: Documentation refresh reinforces the new mental model and supports onboarding.

## 7. Operator Testing Plan

- **Pilot Participants**: Target 3 operators (one power user, one occasional user, one new hire) to capture a range of comfort levels.
- **Scenario Script**:
  - Run the `/start` prompt, complete intake via `/analyze`, proceed through `/strategize`, update code stubs (simulated), and finish with `/validate` then `/export`.
  - Include one branch where business context export is intentionally skipped to confirm guidance catches it.
- **Success Metrics**:
  - Time to identify the correct next command after each phase (target ≤30 seconds).
  - Number of clarification questions asked in chat (target reduction vs. baseline transcripts).
  - Error rate: count of incorrect commands run or missing prerequisites (target zero).
  - Subjective confidence rating (1–5) captured post-session.
- **Instrumentation**:
  - Capture CLI transcripts plus brief post-run survey.
  - For orchestrator status enhancements, log when `--status` or `--guide` commands are executed.
- **Timeline**:
  - Week 1: Implement prompt layer + cheatsheet; dry-run with internal QA.
  - Week 2: Schedule pilot sessions (one per operator) and compile findings.
  - Week 3: Fold feedback into prompt copy and CLI output; update AGENTS.md and record walkthrough.

## 8. Orchestrator Status & `--guide` Design

- **Goals**:
  - Mirror the `/start` orientation output directly in CLI so operators get consistent guidance whether they stay in chat or terminal.
  - Provide an opt-in `--guide` mode that previews each workflow phase (intake → strategy → build → validate → export) with required inputs and expected artifacts.
- **Data Sources**:
  - `context/temp-agent-outputs/workflow-state.json` (phase, status, pending/completed agents, context file paths).
  - Presence checks for canonical artifacts (brief analysis, strategy, validation, self-iteration outputs).
  - File timestamps to determine freshness vs. workflow start time.
  - Optional comparison of `context/temp-agent-outputs/business-context.json` vs. source markdown modified time to flag export needs.
- **Status Output Enhancements** (`npm run orchestrate --status`):
  - Render human-readable sections matching `/start`: current snapshot, artifact inventory, open tasks, next options.
  - When no workflow state exists, fall back to onboarding instructions (e.g., run `/start --project <slug>` or `npm run orchestrate -- --project …` with intake flag).
  - Include guardrail reminders inline only when prerequisites unmet (e.g., missing business context export before validation).
- **`--guide` Flag Behavior**:
  - `npm run orchestrate -- --project <slug> --guide` prints the phase blueprint, including entry criteria, required inputs, produced artifacts, and recommended next command for each phase.
  - Allow `--guide` to pair with `--status` to show both real-time status and the blueprint.
  - Source the blueprint copy from a single helper (e.g., JSON or Markdown parser that reads `context/cli-experience-blueprint.md`) to avoid drift.
- **Implementation Notes**:
  - Centralize artifact detection in a utility so `/start`, `--status`, and future UX layers stay consistent.
  - Emit machine-readable status JSON behind a flag (future-proofing) if we plan to integrate dashboards.
  - Update `scripts/orchestrator.mjs` usage text to advertise `--status` and `--guide` additions.
