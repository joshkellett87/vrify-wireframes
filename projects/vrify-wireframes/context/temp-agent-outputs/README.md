# Agent Outputs

This directory stores intermediate outputs from the agent workflow system.

## Structure

- `workflow-state.json` - Current workflow orchestration state
- `business-context.json` - Cached business context (if needed in JSON format)
- `brief-analysis.json` - Output from brief-analyzer agent
- `visual-guidance.json` - Output from visual-ux-advisor agent
- `variant-strategy.json` - Output from variant-differentiator agent
- `wireframe-strategy.json` - Output from wireframe-strategist agent
- `final-prompt.md` - Output from prompt-generator agent

## Lifecycle

Files in this directory are:

- Created during agent workflow execution
- Used for agent-to-agent communication
- Debuggable for troubleshooting
- Resumable for crash recovery
- Cleaned up after workflow completion (or manually)

`workflow-state.json` is managed automatically when you run `npm run orchestrate`. Inspect it with `node packages/wireframe-core/scripts/orchestrator.mjs --status` if you need to resume or debug Codex/Claude orchestration.

## .gitignore

This directory is tracked in git (with .gitkeep) but contents are ignored.
