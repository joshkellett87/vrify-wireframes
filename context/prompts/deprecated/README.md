# Deprecated Prompts Directory

This directory previously contained legacy prompt files that have been **permanently removed** from the repository.

## Removed from repository (2025-10-08)

The following deprecated prompts were deleted and replaced by Option B slash commands:

- `bc-gather.prompt.md` → Use `/wf` with business context gathering phase
- `brief-analyze.prompt.md` → Use `/analyze`
- `wf-setup.prompt.md` → Use `/wf`
- `wf-strategize.prompt.md` → Use `/strategize`

## Active Prompts (Use These)

Use the seven Option B slash prompts instead:

- **Claude**: `context/prompts/` — start, wf, analyze, strategize, validate, export, ux-review
- **Codex**: `context/prompts/codex/` — mirrors the same seven prompts

Manifest mapping for Codex is defined in `codex-cli.json`.
