# Agent Prompt Templates

This directory contains the full prompts for each agent in the wireframe generation system.

## Agent Registry

### Agent 0: Business Context Gatherer

**File**: [business-context-gatherer.md](./business-context-gatherer.md)
**Purpose**: Capture strategic business intelligence
**When**: New projects or business context updates
**Output**: `context/BUSINESS-CONTEXT.md`, `context/temp-agent-outputs/business-context.json`

### Agent 1: Brief Analyzer

**File**: [brief-analyzer.md](./brief-analyzer.md)
**Purpose**: Extract structure and requirements from design briefs
**When**: Starting any new wireframe project
**Output**: `context/temp-agent-outputs/brief-analysis.json`

### Agent 2: Wireframe Strategist

**File**: [wireframe-strategist.md](./wireframe-strategist.md)
**Purpose**: Design differentiated layout variants with routing guidance
**When**: After brief analysis, before implementation
**Output**: `context/temp-agent-outputs/variant-strategy.json`

### Agent 3: Prompt Generator

**File**: [prompt-generator.md](./prompt-generator.md)
**Purpose**: Create LLM-ready prompts for Lovable or Claude Code
**When**: Optional - only when user requests Lovable export
**Output**: `context/temp-agent-outputs/generated-prompt.md`

### Agent 4: Visual UX Advisor

**File**: [visual-ux-advisor.md](./visual-ux-advisor.md)
**Purpose**: Provide visual design and UX guidance
**When**: During implementation for design decisions
**Output**: Inline recommendations

### Agent 5: Variant Differentiator

**File**: [variant-differentiator.md](./variant-differentiator.md)
**Purpose**: Generate hypotheses and differentiation strategies
**When**: During variant design phase
**Output**: `context/temp-agent-outputs/variant-differentiation.json`

### Agent 6: Business Context Validator

**File**: [business-context-validator.md](./business-context-validator.md)
**Purpose**: Validate metadata business context alignment
**When**: After metadata creation, before implementation
**Output**: Validation report

### Agent 7: Wireframe Validator

**File**: [wireframe-validator.md](./wireframe-validator.md)
**Purpose**: QA validation of completed wireframes
**When**: After implementation, before delivery
**Output**: QA report with findings

---

## Specialized Agents

### Wireframe Transcriber

**File**: [wireframe-transcriber.md](./wireframe-transcriber.md)
**Purpose**: Normalize existing pages into wireframe section maps
**When**: Converting web pages or screenshots to wireframe specs
**Output**: `context/temp-agent-outputs/transcribe.json`, `context/temp-agent-outputs/transcribe-summary.md`

### Wireframe Iteration Planner

**File**: [wireframe-iter.md](./wireframe-iter.md)
**Purpose**: Generate delta plans for iterating on existing wireframes
**When**: Adding/removing/reordering sections in existing wireframes
**Output**: `context/temp-agent-outputs/iterate-plan.json`, `context/temp-agent-outputs/iterate-plan.md`

### Wireframe Orchestrator

**File**: [wireframe-orchestrator.md](./wireframe-orchestrator.md)
**Purpose**: Master orchestration agent managing complete workflows
**When**: Automating multi-agent sequences via CLI (`npm run orchestrate`)
**Output**: `context/temp-agent-outputs/workflow-state.json`, final strategy or prompt

---

## Usage

Each agent prompt file follows this template:

- **Purpose**: What the agent does
- **When to Use**: Trigger conditions
- **Input Requirements**: What the agent needs
- **Output Contract**: What the agent produces
- **Prompt**: The full agent prompt
- **Examples**: Input/output examples
- **Validation**: How to validate outputs

## Related Documentation

- [AGENT-WORKFLOWS.md](../../../../AGENT-WORKFLOWS.md) — Workflow orchestration and platform detection
- [CLAUDE.md](../../../../CLAUDE.md) — Development guide
- [docs/](../../docs/) — Technical reference documentation

---

**Last Updated**: 2025-10-20
**Version**: 3.0.0
