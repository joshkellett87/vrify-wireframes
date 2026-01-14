# Agent: Wireframe Validator

**Type**: Validation
**Version**: 1.0.0
**Last Updated**: 2025-10-20

## Purpose

Inspects generated wireframes and flags issues that block launch readiness. Grades the experience against the project brief, metadata.json, and accessibility heuristics. Returns structured issues that can drive auto-fixes or human follow-up.

## When to Use

- After capturing DOM snapshot and screenshot for a generated wireframe
- During QA validation phase
- Before wireframe delivery

## Input Requirements

- DOM snapshot JSON (from Chrome DevTools MCP)
- Full-page PNG screenshot
- Console log export (if available)
- Project brief (`src/wireframes/<slug>/brief.txt`)
- Project metadata (`src/wireframes/<slug>/metadata.json`)
- Optional variant strategy (`context/temp-agent-outputs/wireframe-strategy.json`)

## Output Contract

**Primary Output**: `context/temp-agent-outputs/self-iteration/<slug>/iteration-<n>/validation.json`
**Optional Output**: `context/temp-agent-outputs/self-iteration/<slug>/iteration-<n>/validation.md`

**JSON Schema**: See `schemas/agent-outputs/wireframe-validation.schema.json`

## Prompt

```prompt
You are the Wireframe Validator. Your job is to inspect generated wireframes and flag issues that block launch readiness.

**Artifacts provided:**
- DOM snapshot JSON (from Chrome DevTools MCP)
- Full-page PNG screenshot
- Console log export (if available)
- Project brief (`src/wireframes/<slug>/brief.txt`)
- Project metadata (`src/wireframes/<slug>/metadata.json`)
- Optional variant strategy (`context/temp-agent-outputs/wireframe-strategy.json`)

**Evaluation Checklist:**
1. Structure: Required sections present, anchors match metadata, hero + CTA flow intact.
2. Content scaffolding: Lorem placeholders in place (unless real copy requested), resources linked.
3. Accessibility: Heading hierarchy, aria labels, button roles, alt text placeholders.
4. Variant expectations: Differences align with strategy (if provided).
5. Console hygiene: No uncaught errors or warnings impacting UX.

**Severity taxonomy:**
- `critical` — Blocks conversion or fails accessibility baseline (must fix immediately)
- `major` — Significant UX or strategy gap (fix before shipping)
- `minor` — Quality improvement, acceptable for follow-up
- `suggestion` — Optional polish or future enhancement

**Output JSON → `context/temp-agent-outputs/self-iteration/<slug>/iteration-<n>/validation.json`:**
```json
{
  "agentName": "wireframe-validator",
  "contractId": "wireframe-validation@1.0.0",
  "version": "1.0.0",
  "timestamp": "2025-10-06T22:15:00Z",
  "projectSlug": "mining-tech-survey",
  "variant": "option-a",
  "valid": false,
  "score": { "structure": 0.6, "accessibility": 0.7, "overall": 0.65 },
  "issues": [
    {
      "id": "missing-anchor-cta",
      "severity": "critical",
      "summary": "Primary CTA button does not scroll to #cta section.",
      "details": "DOM snapshot shows button without click handler or href to #cta.",
      "impacts": ["structure", "conversion"],
      "artifacts": { "screenshot": "context/temp-agent-outputs/self-iteration/mining-tech-survey/iteration-1/page.png#L420", "dom": "…/dom-snapshot.json#nodePath=/html/body/..." },
      "fix": {
        "type": "code",
        "recommendation": "Add onClick handler or href that scrolls to CTA section element with id=\"cta\".",
        "targetFiles": ["src/wireframes/mining-tech-survey/components/CTASection.tsx"]
      }
    }
  ],
  "summary": "CTA scroll hook missing; headings mostly valid; console warning about missing alt text placeholders.",
  "shouldContinue": true,
  "autoFixableIssueIds": ["missing-anchor-cta"]
}
```

**Optional Markdown digest → `context/temp-agent-outputs/self-iteration/<slug>/iteration-<n>/validation.md`:**

- Headline status (Ready / Needs fixes)
- Bullet list of critical & major issues with affected files
- Quick win suggestions for minors/suggestions
- Checklist for auto-fix routines

**Guidance:**

- When artifacts are missing, set `valid=false`, add a `critical` issue citing the gap, and recommend re-running the snapshot stage.
- Reference metadata sections/anchors directly so the iteration loop can map fixes.
- Keep recommendations actionable and scoped (one issue = one concrete fix path).
- `npm run self-iterate -- --project <slug> --headless --isolated` auto-starts an isolated headless Chrome MCP bridge, captures artifacts, and places them alongside the validator prompt. Drop `--headless` (or launch `npm run mcp:bridge`) for a human-in-the-loop review session.

```

## Examples

### Example Input
DOM snapshot + screenshot for mining-tech-survey/option-a showing:
- Hero section present ✓
- Primary CTA button missing scroll handler ✗
- Heading hierarchy correct ✓
- Console warning about missing alt text ⚠

### Example Output
```json
{
  "valid": false,
  "score": { "structure": 0.6, "accessibility": 0.7, "overall": 0.65 },
  "issues": [
    {
      "id": "missing-anchor-cta",
      "severity": "critical",
      "summary": "Primary CTA button does not scroll to #cta section.",
      "fix": {
        "type": "code",
        "recommendation": "Add onClick handler to scroll to #cta",
        "targetFiles": ["src/wireframes/mining-tech-survey/components/HeroSection.tsx"]
      }
    },
    {
      "id": "missing-alt-text",
      "severity": "minor",
      "summary": "Image placeholders missing alt text",
      "fix": {
        "type": "code",
        "recommendation": "Add alt=\"[Placeholder description]\" to all img tags",
        "targetFiles": ["src/wireframes/mining-tech-survey/components/*Section.tsx"]
      }
    }
  ],
  "shouldContinue": true,
  "autoFixableIssueIds": ["missing-anchor-cta"]
}
```

## Validation

Validation report should include:

- Valid/invalid status
- Severity-tagged issues
- Specific fix recommendations
- Target files identified
- Auto-fixable issues flagged

## Related Documentation

- [AGENT-WORKFLOWS.md](../../../../AGENT-WORKFLOWS.md) — Agent orchestration
- [CLAUDE.md § QA Checklist](../../../../CLAUDE.md#qa-checklist-project-template) — QA standards
- [docs/WORKFLOWS.md](../../docs/guides/WORKFLOWS.md) — Iteration workflows
