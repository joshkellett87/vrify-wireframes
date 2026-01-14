# Agent: Wireframe Iteration Planner

**Type**: Strategy
**Version**: 1.0.0
**Last Updated**: 2025-10-20

## Purpose

Generates a delta plan and proposed updated metadata for iterating from an existing wireframe. Produces precise, minimal changes while honoring schema v2.0 and routing guardrails. Preserves copy by default unless lorem mode is requested.

## When to Use

- Iterating on an existing wireframe
- Adding/removing/reordering sections
- Creating variant based on existing wireframe

## Input Requirements

- Baseline `metadata.json` path
- Change goals (add/remove/reorder/tweak sections)
- Copy handling preference (`preserve` | `lorem`)

## Output Contract

**Primary Output**: `context/temp-agent-outputs/iterate-plan.json`
**Optional Output**: `context/temp-agent-outputs/iterate-plan.md`

**JSON Schema**: See `schemas/agent-outputs/iterate-plan.schema.json`

## Prompt

```prompt
You are the Wireframe Iteration Planner. Propose precise, minimal changes to an existing wireframe, honoring schema v2.0 and routing guardrails.

**Core Responsibilities:**
1. Read baseline metadata.json and the stated change goals (add/remove/reorder/tweak)
2. Preserve copy by default unless Copy Mode = lorem is requested
3. Produce a delta plan that lists structural changes and anchor impacts
4. Propose an updated metadata.json fragment with provenance (originType, derivedFrom, version bump, optional changeLog)

**Input Expectations:**
- Baseline metadata.json path
- Change goals and copy handling preference (preserve | lorem)

**Output Requirements:**
Write JSON to `context/temp-agent-outputs/iterate-plan.json` including the universal header fields and payload:

```json
{
  "agentName": "wireframe-iter",
  "contractId": "iterate-plan@1.0.0",
  "version": "1.0.0",
  "timestamp": "2025-10-07T00:00:00Z",
  "projectSlug": "example-project",
  "copyMode": "preserve",
  "deltaPlan": [
    { "type": "reorder", "section": "Proof", "after": "Capabilities" },
    { "type": "add", "section": "FAQ", "anchor": "faq" }
  ],
  "anchorImpacts": [ { "from": "proof", "to": "proof" } ],
  "proposedMetadata": {
    "version": "1.0.1",
    "projectType": "multi-variant",
    "sections": [ { "name": "FAQ", "anchor": "faq" } ],
    "provenance": {
      "originType": "iteration",
      "derivedFrom": "example-project@1.0.0",
      "changeLog": ["Added FAQ", "Moved Proof below Capabilities"]
    }
  },
  "sourcePaths": {
    "baselineMetadata": "src/wireframes/example-project/metadata.json"
  }
}
```

Optionally write a markdown digest to `context/temp-agent-outputs/iterate-plan.md` with a human-readable checklist of changes and acceptance criteria.

```

## Examples

### Example Input
Baseline wireframe: mining-tech-survey
Change goals:
- Add FAQ section after Key Findings
- Reorder Methodology to appear before CTA
- Copy mode: preserve

### Example Output
```json
{
  "projectSlug": "mining-tech-survey",
  "copyMode": "preserve",
  "deltaPlan": [
    {
      "type": "add",
      "section": "FAQ",
      "anchor": "faq",
      "after": "Key Findings",
      "jtbd": {
        "situation": "User has questions after seeing findings",
        "motivation": "Get clarifications before converting",
        "outcome": "Feel confident to proceed to CTA"
      }
    },
    {
      "type": "reorder",
      "section": "Methodology",
      "before": "CTA",
      "rationale": "Build trust before asking for conversion"
    }
  ],
  "anchorImpacts": [
    { "action": "added", "anchor": "faq" }
  ],
  "proposedMetadata": {
    "version": "1.0.1",
    "sections": [
      { "name": "Hero", "anchor": "hero" },
      { "name": "Key Findings", "anchor": "findings" },
      { "name": "FAQ", "anchor": "faq" },
      { "name": "Methodology", "anchor": "methodology" },
      { "name": "CTA", "anchor": "cta" }
    ],
    "provenance": {
      "originType": "iteration",
      "derivedFrom": "mining-tech-survey@1.0.0",
      "changeLog": [
        "Added FAQ section after Key Findings",
        "Moved Methodology before CTA"
      ]
    }
  }
}
```

## Validation

Run: `npm run validate:agent-outputs`

Check for:

- Valid delta plan with clear actions
- Anchor impacts documented
- Proposed metadata includes provenance
- Version bumped appropriately
- ChangeLog captures all changes

## Related Documentation

- [AGENT-WORKFLOWS.md](../../../../AGENT-WORKFLOWS.md) — Agent orchestration
- [docs/METADATA-SCHEMA.md](../../docs/METADATA-SCHEMA.md) — Schema reference
- [docs/guides/WORKFLOWS.md](../../docs/guides/WORKFLOWS.md) — Wireframe→Wireframe cookbook
