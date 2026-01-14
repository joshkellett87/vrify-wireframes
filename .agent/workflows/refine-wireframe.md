---
description: Refine an existing wireframe using the self-iteration loop
---

# Refine Wireframe Workflow

Before running the self-iteration loop, gather user preferences for the QA process.

## Pre-flight Questions

Ask the user these configuration questions before starting:

1. **Auto-fix mode**: "Should I automatically apply fixes when issues are found, or pause for your review after each iteration?"
   - Default: no (pause for review)
   - Maps to: `--auto-fix` or `--no-auto-fix`

2. **Passing grade threshold**: "What grade threshold should the wireframe meet to pass? (0-100)"
   - Default: 80
   - Maps to: `--grade-threshold <n>`

3. **Max iterations** (optional): "How many iteration cycles should I run before stopping?"
   - Default: 2, range: 1-10
   - Maps to: `--max-iterations <n>`

## Execution

After collecting answers, run the self-iterate command with the appropriate flags:

```bash
# Example with all options
npm run self-iterate -- --project <slug> \
  --auto-fix \
  --grade-threshold 75 \
  --max-iterations 3 \
  --headless --isolated
```

// turbo

```bash
# Minimal example (uses interactive prompts or defaults)
npm run self-iterate -- --project <slug> --headless --isolated
```

## What the Loop Does

1. Captures DOM snapshot and screenshot via Chrome DevTools MCP
2. Runs UX Review agent (grades across 4 criteria: goal alignment, interaction/accessibility, visual hierarchy, change coverage)
3. Runs Wireframe Validator for structural/accessibility issues
4. If grade >= threshold AND validation passes → Done
5. If auto-fix enabled → Applies fixes, increments iteration, continues
6. Otherwise → Outputs recommendations and exits

## After Completion

Review the outputs in:

- `context/temp-agent-outputs/self-iteration/<project>/iteration-<n>/`
- UX review results: `ux-review.json` and `ux-review.md`
- Validation results: `validation.json` and `validation.md`
