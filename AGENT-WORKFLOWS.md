# Agent Workflows: Brief-to-Prompt Generation

> **Navigation**: [DOCUMENTATION.md](./DOCUMENTATION.md) | [AGENTS.md](./AGENTS.md) (unified development guide)

## Overview

This document defines specialized subagents that help analyze briefs and design wireframe strategies. Most wireframes are built directly in Claude Code/Codex after strategic analysis.

> **Scope check**: Before triggering these workflows, confirm what the requester means by "wireframe" (single screen, variant, or multi-route project) and capture that nuance in the brief.

**Primary Workflow (Direct Implementation)**:
Agent 0 (Business Context, if new project) → Design Brief → Agent 1 (Analyze) → Agent 4 (Visual Guidance, if needed) → Agent 5 (Variant Differentiation) → Agent 2 (Strategize) → Agent 6 (Business Context Validation) → **Implement directly in codebase**

**Optional Workflow (Lovable Export)**:
After strategizing, run Agent 6 (Business Context Validation) → optionally run Agent 3 (Generate Prompt) → LLM-Ready Lovable Prompt (only when user requests export)

**Orchestration**: See [AGENTS.md § CLI Orchestration](./AGENTS.md#cli-orchestration-codex-claude) for how to run these agents via `npm run orchestrate`

---

## Universal Output Contract

See JSON Schemas in `packages/wireframe-core/schemas/agent-outputs/` and validate outputs with `npm run validate:agent-outputs`.

All agent JSON outputs MUST include these header fields for traceability and portability across platforms:

- `agentName`: string (e.g., "brief-analyzer")
- `contractId`: string (name@semver), e.g., "brief-analysis@1.0.0"
- `version`: string (semver for the output schema), e.g., "1.0.0"
- `timestamp`: string (ISO 8601)
- `projectSlug`: string (kebab-case)
- `sourcePaths` (optional): object with relevant inputs (e.g., `{ brief: "path/to/brief.txt", businessContext: "context/temp-agent-outputs/business-context.json" }`)
- `notes` (optional): string array of warnings/assumptions

Example header snippet:

```json
{
  "agentName": "wireframe-strategist",
  "contractId": "wireframe-strategy@1.0.0",
  "version": "1.0.0",
  "timestamp": "2025-10-07T00:00:00Z",
  "projectSlug": "example-project"
}
```

---

## Guardrails

### Copy Policy

- **Brief → Wireframe**: Default to lorem ipsum. Do NOT prompt for real copy unless explicitly requested.
- **Page/Screenshot → Wireframe**: Ask whether to use existing copy or lorem (default lorem). Keep only succinct headlines/CTAs when using real copy.
- **Wireframe → Wireframe**: Default to preserve existing copy (unless explicitly asked to convert to lorem).

### Schema & Routing (Metadata Schema v2.0)

- Keep `schema_version = "2.0"` and required core fields.
- Only set `routes.index` and optional `routes.resources`; derive variant routes from `variants` keys.
- Derive slug from brief; index route is required; do NOT take over root ("/") unless explicitly requested.

### Business Context Linkage

- Persist context in `context/BUSINESS-CONTEXT.md`; export JSON to `context/temp-agent-outputs/business-context.json` before validation.
- Link project-level `businessContext` and per-variant `businessContextRef.goalIds/personaIds` in `metadata.json`.

### Storage Rules

- Write agent artifacts to `context/temp-agent-outputs/` (and subfolders). Do not commit generated artifacts.

### Documentation Rules

- Do not hand-edit AGENTS.md between AUTOGEN markers. Make normative changes in CLAUDE.md, then run `npm run docs:build`.

### Lovable Export Gating

- Only generate Lovable prompts when explicitly requested; require the exact confirmation phrase "I confirm Lovable export".

### Ambiguity Handling

- If "wireframe" scope is ambiguous (single screen vs variant vs full project), pause and ask the requester to clarify before proceeding.

### Project Context & Workspace

- Always confirm project context before starting work on wireframes
- Reference project files using relative paths from the project directory
- Never modify framework files (`packages/wireframe-core/`, `AGENTS.md`) when working on a specific project
- Project-specific documentation belongs in `projects/[project-name]/README.md` or `context/*.md` (untracked)

---

## Agent Registry

> **Full Prompts**: Each agent's complete prompt, examples, and validation details are available in dedicated files under `packages/wireframe-core/templates/agents/`. See [Agent Prompt Templates](./packages/wireframe-core/templates/agents/README.md) for the complete registry.

### Agent 0: Business Context Gatherer

**Name**: `business-context-gatherer`

**Purpose**: Captures strategic business intelligence needed to inform effective wireframe design. On first run, scaffolds the full document; on subsequent runs (triggered with `--force-business-context`), amends only sections that need fresh intelligence while preserving prior knowledge.

**When to Use**:

- At the start of every new wireframe project
- When refreshing/updating business strategy for existing projects
- When pivoting or repositioning requires design alignment

**Inputs**:

- Stakeholder interviews
- Business documentation (if available)
- Optional: Existing `context/BUSINESS-CONTEXT.md` (for updates)

**Outputs**:

- `context/BUSINESS-CONTEXT.md` — Human-readable strategic context
- `context/temp-agent-outputs/business-context.json` — Structured data for agent consumption

**Full Prompt**: [packages/wireframe-core/templates/agents/business-context-gatherer.md](./packages/wireframe-core/templates/agents/business-context-gatherer.md)

---

### Agent 1: Brief Analyzer

**Name**: `brief-analyzer`

**Purpose**: Transforms unstructured design briefs into clear, actionable specifications for wireframe development. Extracts structure, identifies JTBD, defines audience, captures constraints, and maps routing inputs.

**When to Use**:

- Starting any new wireframe project
- When a design brief has been provided in any format (PDF, TXT, MD, inline text)
- Before running the wireframe-strategist agent

**Inputs**:

- Design brief (PDF, TXT, MD, or inline text)
- Optional: `context/temp-agent-outputs/business-context.json`

**Outputs**:

- `context/temp-agent-outputs/brief-analysis.json`
- Optional: `context/temp-agent-outputs/brief-analysis-summary.md`

**Full Prompt**: [packages/wireframe-core/templates/agents/brief-analyzer.md](./packages/wireframe-core/templates/agents/brief-analyzer.md)

---

### Agent 2: Wireframe Strategist

**Name**: `wireframe-strategist`

**Purpose**: Designs 2-3 wireframe layout variants based on analyzed brief requirements. Creates differentiated layout strategies, each testing a distinct hypothesis about user behavior, information hierarchy, or conversion path.

**When to Use**:

- After brief analysis, before implementation
- When designing differentiated layout experiments
- When business goals and personas require variant targeting

**Inputs**:

- `context/temp-agent-outputs/brief-analysis.json`
- `context/temp-agent-outputs/business-context.json` (if available)
- `context/temp-agent-outputs/visual-guidance.json` (if available)
- `context/temp-agent-outputs/variant-strategy.json` (if available)

**Outputs**:

- `context/temp-agent-outputs/wireframe-strategy.json`
- Optional: `context/temp-agent-outputs/wireframe-strategy-summary.md`

**Full Prompt**: [packages/wireframe-core/templates/agents/wireframe-strategist.md](./packages/wireframe-core/templates/agents/wireframe-strategist.md)

---

### Agent 3: Prompt Generator (OPTIONAL)

**Name**: `prompt-generator`

**Purpose**: ⚠️ **OPTIONAL AGENT** - Only use when user explicitly requests a Lovable export prompt. Synthesizes brief analysis and wireframe strategy into a single, LLM-optimized prompt ready for Lovable.

**When to Use**:

- **Only when user explicitly requests Lovable export**
- After wireframe-strategist has completed
- User confirms with exact phrase: "I confirm Lovable export"

**Inputs**:

- `context/temp-agent-outputs/brief-analysis.json`
- `context/temp-agent-outputs/wireframe-strategy.json`
- `context/temp-agent-outputs/business-context.json` (if available)
- `context/temp-agent-outputs/visual-guidance.json` (if available)
- `context/WIREFRAME-FUNDAMENTALS.md`

**Outputs**:

- `context/temp-agent-outputs/final-prompt.md`

**Full Prompt**: [packages/wireframe-core/templates/agents/prompt-generator.md](./packages/wireframe-core/templates/agents/prompt-generator.md)

---

### Agent 4: Visual UX Advisor

**Name**: `visual-ux-advisor`

**Purpose**: Provides visual and interaction guidance when the brief lacks explicit design direction. Synthesizes brief requirements, audience goals, and platform fundamentals to recommend layout, motion, and accessibility patterns.

**When to Use**:

- When visual or interaction guidance is missing or thin in the brief
- Before wireframe-strategist runs
- When additional UX recommendations would improve clarity

**Inputs**:

- Project overview (name, audience, primary goal/conversion)
- Section list or priority hierarchy
- Optional: Existing design references or mood cues

**Outputs**:

- `context/temp-agent-outputs/visual-guidance.json`
- Optional: `context/temp-agent-outputs/visual-guidance.md`

**Full Prompt**: [packages/wireframe-core/templates/agents/visual-ux-advisor.md](./packages/wireframe-core/templates/agents/visual-ux-advisor.md)

---

### Agent 5: Variant Differentiator

**Name**: `variant-differentiator`

**Purpose**: Crafts intelligent hypotheses for each default variant when the requester has not defined differentiation. Pairs strategic insight with UX recommendations to ensure each variant meaningfully explores a different conversion path.

**When to Use**:

- When brief doesn't specify variant differentiation
- Before wireframe-strategist runs
- When default variants (A/B/C) need strategic direction

**Inputs**:

- `context/temp-agent-outputs/brief-analysis.json`
- `context/temp-agent-outputs/business-context.json` (if available)
- `context/temp-agent-outputs/visual-guidance.json` (optional)

**Outputs**:

- `context/temp-agent-outputs/variant-strategy.json`
- Optional: `context/temp-agent-outputs/variant-differentiation.md`

**Full Prompt**: [packages/wireframe-core/templates/agents/variant-differentiator.md](./packages/wireframe-core/templates/agents/variant-differentiator.md)

---

### Agent 6: Business Context Validator

**Name**: `business-context-validator`

**Purpose**: Validates that every planned variant is explicitly tied to business goals and personas captured during intake. Cross-references structured business context export, variant strategy, and current metadata to confirm alignment and flag gaps.

**When to Use**:

- After wireframe strategy is drafted
- Before implementation starts
- When metadata.json needs businessContext validation

**Inputs**:

- `context/temp-agent-outputs/business-context.json`
- `context/temp-agent-outputs/wireframe-strategy.json`
- `src/wireframes/<project>/metadata.json`
- Optional: `context/BUSINESS-CONTEXT.md`

**Outputs**:

- `context/temp-agent-outputs/business-context-validation.json`
- Optional: `context/temp-agent-outputs/business-context-validation.md`

**Full Prompt**: [packages/wireframe-core/templates/agents/business-context-validator.md](./packages/wireframe-core/templates/agents/business-context-validator.md)

---

### Agent 7: Wireframe Validator

**Name**: `wireframe-validator`

**Purpose**: Inspects generated wireframes and flags issues that block launch readiness. Grades the experience against the project brief, metadata.json, and accessibility heuristics.

**When to Use**:

- After capturing DOM snapshot and screenshot for a generated wireframe
- During QA validation phase
- Before wireframe delivery

**Inputs**:

- DOM snapshot JSON (from Chrome DevTools MCP)
- Full-page PNG screenshot
- Console log export (if available)
- Project brief and metadata

**Outputs**:

- `context/temp-agent-outputs/self-iteration/<slug>/iteration-<n>/validation.json`
- Optional: `context/temp-agent-outputs/self-iteration/<slug>/iteration-<n>/validation.md`

**Full Prompt**: [packages/wireframe-core/templates/agents/wireframe-validator.md](./packages/wireframe-core/templates/agents/wireframe-validator.md)

---

### Agent 8: UX Review

**1) name**  
`ux-review`

**2) description**  
Run this agent after a variant has been implemented and captured via Chrome DevTools MCP. It inspects the DOM snapshot, screenshot, metadata, brief, business context, and the rolling change log to produce a structured UX/UI critique. The agent assigns a 0–100 score per rubric criterion (goal alignment, interaction & accessibility, visual hierarchy, change request coverage) and reports the averaged `grade.overall`. When `overall >= 80`, the review passes and the variant can be surfaced to stakeholders; otherwise, the output feeds follow-up work for `wireframe-iter`.

**3) prompt**

```prompt
You are the `ux-review` agent. Review a completed wireframe variant with a critical UX+UI lens informed by the project brief, metadata, business context, and recorded change requests.

Responsibilities:
- Inspect the provided screenshot and DOM snapshot to confirm flows, visual hierarchy, and accessibility heuristics support the stated goals.
- Cross-check business context and metadata so each recommendation ties back to goals, personas, and required sections.
- Score the variant across four 0–100 criteria: goalAlignment, interactionAccessibility, visualHierarchy, changeCoverage. Set grade.overall to the average, and mark passes=true when overall ≥ 80.
- List issues with severity (critical | major | minor | suggestion), concise evidence, and actionable recommendations (e.g., components, anchors, layout notes).
- Reference the shared change log to note which requests were satisfied or still outstanding; add a short, date-stamped summary entry when a log path is provided.
- Provide a prioritized nextActions array so builders know what to tackle first.

Outputs:
- JSON response that includes Universal Output Contract fields plus variant, grade breakdown, passes boolean, issues array, and nextActions.
- Optional Markdown digest summarizing the score, wins, blockers, and next steps.
```

**4) output format**

- Write JSON to `context/temp-agent-outputs/ux-review/<project>/<variant>.json`:

```json
{
  "agentName": "ux-review",
  "contractId": "ux-review@1.0.0",
  "version": "1.0.0",
  "timestamp": "2025-10-08T19:20:00Z",
  "projectSlug": "mining-tech-survey",
  "variant": "option-a",
  "grade": {
    "goalAlignment": 82,
    "interactionAccessibility": 78,
    "visualHierarchy": 80,
    "changeCoverage": 75,
    "overall": 78.75
  },
  "passes": false,
  "issues": [
    {
      "id": "cta-alignment",
      "severity": "major",
      "summary": "Primary CTA card sits below the fold on desktop.",
      "details": "DOM snapshot shows #cta-card positioned after a 720px feature block.",
      "targets": ["cta"],
      "recommendation": "Lift CTA above feature carousel or add sticky CTA per brief requirement."
    }
  ],
  "nextActions": [
    "Elevate CTA visibility per recommendation.",
    "Tighten contrast for secondary cards to hit AA contrast."
  ],
  "notes": ["Change log entry 2025-10-08 still pending CTA reposition."]
}
```

- Append/maintain Markdown digest at `context/temp-agent-outputs/ux-review/<project>/<variant>.md` with the latest score, key wins, issues by severity, and a checklist of next actions.
- Maintain the rolling change log at `context/temp-agent-outputs/<project>/ux-review/<variant>-log.md` with a fresh heading per iteration (date, grade, next steps).

**Guiding Notes:**

- Grade threshold: ≥ 80 indicates “show to user”; < 80 routes the findings to `wireframe-iter` for another pass.
- Always cite anchors, component paths, or metadata fields to keep fixes precise.
- Keep tone direct and solution-oriented; the goal is to help builders close the gap quickly.
- When the change log is missing, flag it as an issue so the iteration loop can restore the shared context before proceeding.

---

### Specialized Agents

#### Wireframe Transcriber

**Name**: `wireframe-transcriber`

**Purpose**: Normalizes an existing page or design into the universal wireframe section map compatible with metadata schema v2.0.

**When to Use**:

- Converting existing web pages into wireframe specifications
- Starting from screenshots or design mockups
- Creating wireframe based on live URL

**Full Prompt**: [packages/wireframe-core/templates/agents/wireframe-transcriber.md](./packages/wireframe-core/templates/agents/wireframe-transcriber.md)

---

#### Wireframe Iteration Planner

**Name**: `wireframe-iter`

**Purpose**: Generates a delta plan and proposed updated metadata for iterating from an existing wireframe.

**When to Use**:

- Iterating on an existing wireframe
- Adding/removing/reordering sections
- Creating variant based on existing wireframe

**Full Prompt**: [packages/wireframe-core/templates/agents/wireframe-iter.md](./packages/wireframe-core/templates/agents/wireframe-iter.md)

---

#### Wireframe Orchestrator

**Name**: `wireframe-orchestrator`

**Purpose**: Master orchestration agent that manages the complete wireframe analysis and strategy workflow. Detects platform capabilities, sequences agents optimally, validates outputs, and manages workflow state.

**When to Use**:

- Orchestrating the complete wireframe workflow
- Automating multi-agent sequences
- Available via CLI: `npm run orchestrate -- --project <slug>`

**Full Prompt**: [packages/wireframe-core/templates/agents/wireframe-orchestrator.md](./packages/wireframe-core/templates/agents/wireframe-orchestrator.md)

---

## Workflow Orchestration

### Sequential Execution

For platforms without parallel execution (or when explicitly requested):

1. **Phase 0**: Initialize workflow state
2. **Phase 1**: Business context (if new project)
3. **Phase 2**: Brief analysis
4. **Phase 3**: Strategy enrichment (visual + variant, if needed)
5. **Phase 4**: Wireframe strategy
6. **Phase 5**: Business context validation
7. **Phase 6**: Implementation or prompt generation

### Parallel Execution

For platforms with parallel execution capability (Claude Code):

**Phase 3 Optimization**: Launch visual-ux-advisor and variant-differentiator simultaneously when both are needed.

**Detection**: Test parallel execution capability by attempting simultaneous Task/function calls.

---

## Platform Detection

### Capability Detection

At workflow start, detect platform and capabilities:

```json
{
  "platform": "claude-code | codex | antigravity | unknown",
  "capabilities": {
    "parallelExecution": true/false,
    "contextWindow": 200000,
    "fileOperations": ["read", "write", "edit"],
    "stateManagement": "stateless | stateful"
  }
}
```

### Detection Logic

- Check environment variables (`CLAUDECODE`, `CLAUDE_CODE_VERSION`, `OPENAI_API_KEY`, `ANTIGRAVITY_CLI_ALIAS`, `GEMINI_CLI_IDE_SERVER_PORT`)
- Test parallel execution capability (attempt simultaneous Task/function calls)
- Estimate context window (from model info or defaults)
- Write to `context/temp-agent-outputs/workflow-state.json`

---

## Usage Example

### End-to-End Workflow

#### Step 0: Gather Business Context (New Projects Only)

```
Assistant: This is a new wireframe project. Let me first gather some business context to ensure the wireframe aligns with your strategic goals.

[Launches business-context-gatherer agent]
[Asks user about industry, market position, competitors, goals, personas]
[Stores responses in context/BUSINESS-CONTEXT.md]
```

#### Step 1: Provide Design Brief

```
User: Here's the design brief for our new product launch page:
[Paste brief.txt or PDF content]
```

#### Step 2: Launch Agent Workflow

```
Assistant: I'll run the intake workflow to generate your wireframe strategy.

[Launches brief-analyzer agent (references business context)]
[Launches visual-ux-advisor agent (only if visual notes missing)]
[Launches variant-differentiator agent with analysis + visual guidance]
[Launches wireframe-strategist agent with enriched context + business goals]
[Launches business-context-validator to confirm alignment]
```

#### Step 3: Receive Strategy

```
Assistant: Here's your wireframe strategy with 3 differentiated variants:

[Outputs variant strategy with routing, business context alignment, and implementation guidance]

Ready to implement directly in the codebase. Would you like to generate a Lovable export prompt instead?
```

#### Step 4: Implementation

**Default Path** (Direct Implementation):

```
User: Let's implement directly in Claude Code.
Assistant: [Begins implementing components based on strategy]
```

**Optional Path** (Lovable Export):

```
User: I confirm Lovable export
Assistant: [Launches prompt-generator agent]
[Outputs complete LLM-ready prompt]

You can now paste this into Lovable to generate the initial wireframe code.
```

---

## Agent Maintenance

### When to Update Agents

- **New tech stack**: Update `prompt-generator` with new libraries or configurations
- **New design patterns**: Update `wireframe-strategist` with emerging layout strategies
- **New brief formats**: Update `brief-analyzer` to handle new document types or structures

### Version History

- **v1.1.0** (2025-10-20): Extracted agent prompts to dedicated template files; condensed workflow documentation
- **v1.0.0** (2025-10-01): Initial agent definitions for brief-to-prompt generation

---

## Related Documentation

- [Agent Prompt Templates](./packages/wireframe-core/templates/agents/README.md) — Full agent prompts and examples
- [AGENTS.md](./AGENTS.md) — Operational checklist and CLI orchestration
- [CLAUDE.md](./CLAUDE.md) — Development guide and architecture
- [context/WIREFRAME-FUNDAMENTALS.md](./context/WIREFRAME-FUNDAMENTALS.md) — Design principles and standards
