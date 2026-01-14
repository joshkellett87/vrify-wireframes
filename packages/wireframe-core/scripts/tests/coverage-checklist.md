# Test Coverage Checklist

Purpose

- Track high-value test cases for the new prompt tooling and design token system. Use this checklist to guide incremental test additions.

Scripts: prompts (scripts/lib/prompts.mjs)

- [ ] YAML parsing: valid front matter is parsed
- [ ] YAML parsing: invalid/missing required fields throws with file path context
- [ ] Required fields: id/handle/phase/description present
- [ ] Status filter: files with `status: deprecated` are skipped
- [ ] Reference normalization: '../../../' → '../' in generated outputs
- [ ] Newline normalization: Windows (CRLF) → LF in generated outputs
- [ ] Inputs parsing: flags extracted from `inputs:` via `--flag` syntax

Scripts: design tokens (scripts/design-tokens.mjs)

- [ ] Deep merge: nested objects merged recursively (e.g., color.background.surface)
- [ ] Replace semantics: primitives/arrays replaced rather than merged
- [ ] Missing file: no overrides for project prints warning and continues
- [ ] CLI: `--project <slug>` prints merged tokens with '*' markers for overrides

Shared tokens (src/shared/design-system/tokens.ts)

- [ ] Getter: top-level token returns value (e.g., 'radius')
- [ ] Getter: group.token returns value (e.g., 'radius.lg')
- [ ] Getter: unknown key returns fallback
- [ ] Merge: override passed to `createDesignTokenGetter(override)` is applied

How to run (manual for now)

- Prompts setup: `npm run wf:setup` then inspect `.claude/commands/` and `codex-cli.json`
- Tokens view: `npm run design:tokens -- --project platform-pricing`

Future work

- Add smoke tests under `scripts/tests/` that assert CLI output contains expected lines
- Consider a lightweight test runner (e.g., node test scripts) without adding a full test framework
