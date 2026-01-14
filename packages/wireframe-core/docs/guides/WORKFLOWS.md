# Wireframe Iteration Workflows

Complete guides for common wireframe workflows: converting existing pages to wireframes and iterating on existing wireframes.

## Overview

Two primary workflows for creating and iterating wireframes:

1. **Page → Wireframe**: Convert existing web page to wireframe specification
2. **Wireframe → Wireframe**: Iterate on existing wireframe to create variants

## Page → Wireframe Cookbook

Convert an existing web page (URL or screenshot) into a wireframe specification.

### When to Use

- Converting existing marketing pages to wireframe format
- Starting from competitor pages as inspiration
- Documenting existing designs before redesign
- Creating wireframe from design mockups

### Workflow Steps

#### 1. Capture

Capture the source page using the transcribe script:

**From URL**:

```bash
npm run transcribe -- --url=https://example.com --slug=example-project
```

**From Screenshot**:

```bash
npm run transcribe -- --screenshot=path/to/screenshot.png --slug=example-project
```

**Copy Mode Prompt**:
When prompted, choose copy handling:

- **lorem** (default): Replace all copy with lorem ipsum placeholders
- **real**: Preserve headlines and CTAs only, lorem for body content

**Output**:

- `context/temp-transcribe/example-project/transcribe-input.md` — Captured page structure
- Screenshots saved to `context/temp/screenshots/`

#### 2. Transcribe

Feed the captured input to the wireframe-transcriber agent:

**Agent Input**: `context/temp-transcribe/example-project/transcribe-input.md`

**Agent Task**:

- Extract section list with proposed anchors
- Define JTBD for each section
- Generate metadata.json suggestions
- Flag assumptions and gaps

**Agent Output**:

- `context/temp-agent-outputs/transcribe.json` — Structured section map
- `context/temp-agent-outputs/transcribe-summary.md` — Human-readable summary

**Example Agent Invocation**:

```
Run the wireframe-transcriber agent with the transcribe input to produce a section map and metadata suggestions.
```

#### 3. Generate Strategy

Run strategist and optionally prompt-generator with transcriber output:

**Sequence**:

1. **wireframe-strategist** — Design differentiated variants
2. **prompt-generator** (optional) — Create Lovable-ready prompt

**Input**: Transcribe output + business context (if available)

**Output**: Variant strategy with routing recommendations

#### 4. Implement

Scaffold components and pages based on strategy:

**Manual Implementation** (default):

```bash
# Create project structure
mkdir -p src/wireframes/example-project/{components,pages}

# Create metadata.json from suggestions
# Implement components
# Wire routes
```

**Apply Routes** (if branch should be live):

```bash
npm run transcribe -- --url=https://example.com --slug=example --apply-routes=root
# or
npm run transcribe -- --url=https://example.com --slug=example --apply-routes=namespace
```

**Route Options**:

- `root`: Project takes over `/` (root route)
- `namespace`: Project uses `/${slug}` (default, recommended)

#### 5. Validate

Test the wireframe:

```bash
# Start dev server
npm run dev

# Validate metadata
npm run validate:metadata

# Use Chrome DevTools MCP for visual validation
```

### Complete Example

```bash
# 1. Capture competitor page
npm run transcribe -- --url=https://competitor.com/pricing --slug=pricing-analysis

# 2. When prompted, choose copy mode: lorem

# 3. Run transcriber agent
# (Agent analyzes structure and generates metadata suggestions)

# 4. Run strategist agent
# (Agent creates 3 differentiated variants)

# 5. Implement directly in codebase
# Create components, pages, metadata.json

# 6. Validate
npm run validate:metadata
npm run dev
```

### Tips

- Use `lorem` copy mode by default to avoid copyright issues
- Keep only succinct headlines/CTAs when using real copy
- Review transcriber output before implementing
- Adjust metadata suggestions to match business goals

---

## Wireframe → Wireframe Cookbook

Iterate on an existing wireframe to create a new variant or modified version.

### When to Use

- Creating additional variants from baseline
- Adding/removing/reordering sections
- Experimenting with layout changes
- A/B testing different approaches

### Workflow Steps

#### 1. Iterate

Use the iterate script to prepare for changes:

```bash
npm run iterate -- --from=baseline-slug --new=new-variant-slug
```

**Copy Mode Prompt**:
When prompted, choose copy handling:

- **preserve** (default): Keep existing copy from baseline
- **lorem**: Convert all copy to lorem ipsum

**Optional Routes Flag**:

```bash
npm run iterate -- --from=baseline --new=variant --apply-routes=root
```

**Automatic Actions**:

- Creates snapshot of baseline (automatic backup)
- Copies baseline project to new location
- Prepares for modifications

#### 2. Plan

Run wireframe-iter agent to validate delta and metadata updates:

**Agent Input**:

- Baseline `metadata.json`
- Change goals (what you want to add/remove/reorder)
- Copy handling preference

**Agent Task**:

- Analyze baseline metadata
- Generate delta plan (structural changes)
- Propose updated metadata with provenance
- List anchor impacts
- Bump version appropriately

**Agent Output**:

- `context/temp-agent-outputs/iterate-plan.json` — Delta plan
- `context/temp-agent-outputs/iterate-plan.md` — Human-readable checklist

**Example Agent Invocation**:

```
Run wireframe-iter agent to plan iteration from baseline-variant to new-variant.
Changes: Add FAQ section after Key Findings, move Methodology before CTA.
Copy mode: preserve
```

#### 3. Implement

Apply the planned changes:

**Update Metadata**:

- Update `metadata.json` with new sections
- Bump `version` field
- Add `changeLog` entry to provenance
- Update `lastUpdated` timestamp

**Modify Components**:

- Add new section components if needed
- Reorder sections in page files
- Update navigation if required

**Example**:

```json
{
  "version": "1.0.1",
  "lastUpdated": "2025-10-20",
  "provenance": {
    "originType": "iteration",
    "derivedFrom": "baseline-variant@1.0.0",
    "changeLog": [
      "Added FAQ section after Key Findings",
      "Moved Methodology before CTA"
    ]
  }
}
```

#### 4. Validate

Test changes using Chrome DevTools MCP:

**Visual Validation** (preferred):

```bash
# Start dev server
npm run dev

# Use Chrome DevTools MCP
mcp__chrome-devtools__navigate_page → http://localhost:8080/project/variant
mcp__chrome-devtools__take_snapshot → Capture page structure (no size limits)
```

**Viewport Screenshots** (when needed):

```bash
mcp__chrome-devtools__take_screenshot → Viewport capture
```

**Screenshot Best Practices**:

- ✅ Use `take_snapshot` (preferred - no size limits)
- ✅ Use viewport screenshots (omit `fullPage` or set to `false`)
- ❌ **Never** use `fullPage: true` - Claude rejects images over 8000px

**Metadata Validation**:

```bash
npm run validate:metadata
```

### Complete Example

```bash
# 1. Iterate from existing variant
npm run iterate -- --from=conversion-first --new=trust-forward

# 2. Choose copy mode: preserve

# 3. Run iter agent to plan changes
# Agent generates delta plan and metadata updates

# 4. Implement changes
# - Update metadata.json with new sections and provenance
# - Reorder sections in components
# - Add FAQ component

# 5. Validate with Chrome DevTools MCP
npm run dev
# Use take_snapshot for full validation
# Use viewport screenshots for specific areas

# 6. Validate metadata
npm run validate:metadata
```

### Tips

- Default to `preserve` copy mode for iterations
- Always create snapshot before major changes
- Use `take_snapshot` for comprehensive validation (no size limits)
- Bump version appropriately (patch for minor changes, minor for new features)
- Document changes in `changeLog` array

---

## Screenshot Best Practices

### Recommended: Use take_snapshot

**Why**: No size limits, captures full page structure and accessibility tree

```bash
mcp__chrome-devtools__take_snapshot
```

**Benefits**:

- No 8000px dimension limit
- Captures semantic structure
- Includes accessibility info
- Perfect for validation

### When to Use Screenshots

**Viewport screenshots** (for visual preview of specific areas):

```bash
mcp__chrome-devtools__take_screenshot
```

**Critical Rules**:

- ✅ Omit `fullPage` parameter (defaults to viewport)
- ✅ Set `fullPage: false` explicitly if needed
- ❌ **Never use `fullPage: true`** - causes errors

**Why the restriction**: Claude rejects images over 8000px in any dimension. Long pages with `fullPage: true` exceed this limit.

### For Long Pages

**Option 1**: Use take_snapshot (recommended)

```bash
mcp__chrome-devtools__take_snapshot
```

**Option 2**: Multiple viewport screenshots

```bash
# Scroll and capture multiple sections
mcp__chrome-devtools__take_screenshot  # Section 1
# Scroll down
mcp__chrome-devtools__take_screenshot  # Section 2
# Scroll down
mcp__chrome-devtools__take_screenshot  # Section 3
```

**Option 3**: Resize page before screenshot

```bash
mcp__chrome-devtools__resize_page --width=1280 --height=7000
mcp__chrome-devtools__take_screenshot --fullPage=false
```

---

## Workflow Comparison

| Aspect | Page → Wireframe | Wireframe → Wireframe |
|--------|------------------|----------------------|
| **Source** | Existing web page or screenshot | Existing wireframe in codebase |
| **Copy Handling** | Default: lorem | Default: preserve |
| **Agent** | wireframe-transcriber | wireframe-iter |
| **Use Case** | New wireframe from scratch | Variant or iteration |
| **Snapshot** | Manual (if needed) | Automatic |
| **Provenance** | New project | Tracks derivation |

---

## Common Issues

### Issue: Transcribe Can't Access URL

**Symptom**: URL fetch fails or returns error

**Solutions**:

- Check URL is publicly accessible
- Try with screenshot instead: `--screenshot=path/to/file.png`
- Ensure no authentication required

### Issue: Iteration Doesn't Preserve Copy

**Symptom**: Copy converted to lorem when you wanted to preserve

**Solution**:

- When prompted, explicitly choose `preserve`
- Check `--copy-mode=preserve` flag if using programmatically

### Issue: Screenshot Fails with "dimensions exceed max"

**Symptom**: Error about 8000px limit

**Solution**:

- ✅ Use `take_snapshot` instead (no limits)
- ✅ Use viewport screenshot (omit `fullPage`)
- ❌ Don't use `fullPage: true`

### Issue: Routes Not Applying

**Symptom**: Routes from iteration not active

**Solution**:

- Use `--apply-routes=root` or `--apply-routes=namespace` flag
- Restart dev server after changes
- Validate metadata: `npm run validate:metadata`

---

## Related Documentation

- [Snapshot System](../SNAPSHOT-SYSTEM.md) — Version control for wireframes
- [Metadata Schema](../METADATA-SCHEMA.md) — Schema reference
- [Agent Prompts](../../templates/agents/) — Agent template details
- [CLAUDE.md § Iteration Loop](../../../../CLAUDE.md#iteration-loop-claude-code--chrome-devtools-mcp) — Visual iteration workflow

---

**Last Updated**: 2025-10-20
**Version**: 1.0
