# Metadata Schema v2.0

Complete specification for wireframe project metadata files.

## Overview

Every wireframe project requires a `metadata.json` file in its root directory (`src/wireframes/[project-slug]/metadata.json`). This file defines the project's structure, routing, variants, and business context alignment.

## Schema Version

**Current Version**: `2.0`

All metadata files MUST include:

```json
{
  "schema_version": "2.0"
}
```

## Required Fields

### Core Project Information

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `schema_version` | string | Schema version (must be "2.0") | `"2.0"` |
| `id` | string | Unique project identifier (kebab-case) | `"mining-tech-survey"` |
| `slug` | string | URL-safe project slug (kebab-case) | `"mining-tech-survey"` |
| `title` | string | Human-readable project title | `"Mining Tech Survey"` |
| `description` | string | One-line project summary | `"Industry survey on digital transformation"` |
| `version` | string | Project version (semver) | `"1.0.0"` |
| `lastUpdated` | string | ISO date of last update | `"2025-10-20"` |

### Naming Conventions

**Slugs**: Always use lowercase kebab-case

- ✅ `mining-tech-survey`
- ✅ `conversion-first`
- ❌ `Mining_Tech_Survey`
- ❌ `conversionFirst`

**IDs**: Lowercase kebab-case with optional prefixes

- Goals: `goal-*` (optional)
- Personas: No prefix (derive from persona names)
- KPIs: `kpi-*` (optional)

## Business Context Linkage

Link metadata to strategic business intelligence captured in `context/BUSINESS-CONTEXT.md`.

### Project-Level Business Context

```json
{
  "businessContext": {
    "primaryGoal": "success-drive-qualified-demo-requests",
    "goals": [
      "success-drive-qualified-demo-requests"
    ],
    "personas": [
      "operations-executive-sponsor",
      "digital-workflows-evaluator"
    ],
    "kpis": [
      "kpi-qualified-demo-volume"
    ]
  }
}
```

**Fields**:

- `primaryGoal`: Single most important business goal (ID from business context)
- `goals`: Array of goal IDs this project supports
- `personas`: Array of persona IDs this project targets
- `kpis`: Array of KPI IDs used to measure success

### Variant-Level Business Context

Each variant can reference specific goals and personas:

```json
{
  "variants": {
    "conversion-first": {
      "businessContextRef": {
        "goalIds": ["success-drive-qualified-demo-requests"],
        "personaIds": ["operations-executive-sponsor"]
      }
    }
  }
}
```

**Workflow**:

1. Update `context/BUSINESS-CONTEXT.md` with goals/personas
2. Run `npm run export:business-context` to generate JSON
3. Reference IDs in `metadata.json`
4. Run `npm run validate:metadata` to verify linkage

## Variants

Define layout variations that test different hypotheses.

### Multi-Variant Projects

```json
{
  "projectType": "multi-variant",
  "variants": {
    "conversion-first": {
      "name": "Conversion First",
      "description": "Hero form above the fold",
      "emphasis": "Keeps the CTA visible for warm audiences",
      "when": "Use for nurture and remarketing traffic",
      "hypothesis": "Reducing friction boosts qualified conversions",
      "businessContextRef": {
        "goalIds": ["success-drive-qualified-demo-requests"],
        "personaIds": ["operations-executive-sponsor"]
      }
    },
    "trust-forward": {
      "name": "Trust Forward",
      "description": "Methodology before CTA",
      "emphasis": "Show proof and rigor for colder audiences",
      "when": "Use for net-new evaluators",
      "businessContextRef": {
        "goalIds": ["success-drive-qualified-demo-requests"],
        "personaIds": ["operations-executive-sponsor", "digital-workflows-evaluator"]
      }
    }
  }
}
```

**Variant Fields**:

- `name`: Display name for the variant
- `description`: Brief description of approach
- `emphasis`: What this variant prioritizes
- `when`: User scenario for this variant
- `hypothesis`: What behavioral bet this tests
- `businessContextRef`: Goals and personas this variant targets
- `component` (optional): Custom component name override

**Key Rules**:

- Variant keys become URL segments (e.g., `conversion-first` → `/project-slug/conversion-first`)
- **Never** add `path` fields or `routes.variants` - routes are derived automatically
- Use kebab-case for variant keys
- Create corresponding page files using PascalCase (e.g., `ConversionFirst.tsx`)

### Single-Variant Projects

For single-screen experiences:

```json
{
  "projectType": "single-variant",
  "variants": {}
}
```

**Important**: Both `projectType: "single-variant"` AND empty `variants: {}` are required.

## Sections

Define page sections with JTBD (Jobs-To-Be-Done) context.

```json
{
  "sections": [
    {
      "name": "Hero",
      "anchor": "hero",
      "whyNow": "Orient the visitor and surface the CTA",
      "jtbd": {
        "situation": "Visitor lands via campaign link",
        "motivation": "Confirm value quickly",
        "outcome": "Decide to explore or convert"
      }
    },
    {
      "name": "Key Findings",
      "anchor": "findings"
    }
  ]
}
```

**Section Fields**:

- `name`: Human-readable section name
- `anchor`: URL anchor for smooth scrolling (kebab-case)
- `whyNow` (optional): Why this section appears at this point
- `jtbd` (optional): Job-To-Be-Done context
  - `situation`: User state when reaching section
  - `motivation`: What user wants to accomplish
  - `outcome`: Desired result after section

**Anchor Requirements**:

- Must be unique within project
- Use kebab-case
- Match anchor IDs in component implementations
- Enable smooth scroll navigation

## Routes

Define project routing structure.

```json
{
  "routes": {
    "index": "/project-slug",
    "resources": [
      "/project-slug/resources",
      "/project-slug/resources/playbook"
    ]
  }
}
```

**Routing Rules**:

- **Always set** `routes.index` - required for every project
- **Never set** `routes.variants` - automatically derived from `variants` keys
- Default base route: `/${slug}` unless explicitly overriding to `/`
- Only take over root `/` when brief explicitly requires it
- Additional resource routes are optional

**Route Derivation**:

- Index: Defined in `routes.index`
- Variants: Auto-generated as `${routes.index}/${variantKey}`
- Resources: Defined in `routes.resources` array (optional)

## Target Audience

Optional array of audience segments:

```json
{
  "targetAudience": [
    "Revenue leadership",
    "Exploration managers"
  ]
}
```

Used for documentation and context, not routing.

## Project Types

Specify project structure type:

```json
{
  "projectType": "multi-variant" | "single-variant"
}
```

- `multi-variant`: Multiple layout variants (default)
- `single-variant`: Single-screen experience

## Complete Example

See [docs/examples/metadata-example.json](./examples/metadata-example.json) for a fully-commented example with all fields.

## Validation

### Required Validation

After editing metadata, always run:

```bash
npm run validate:metadata
```

Validation checks:

- Schema version is "2.0"
- Required fields present
- Valid JSON structure
- Business context IDs exist
- Route uniqueness
- Variant key formats

### Migration from v1.x

For legacy v1 files:

```bash
npm run migrate:metadata
```

This safely upgrades schema format while preserving data.

## Common Patterns

### Adding a New Variant

1. Add variant to `variants` object with unique key
2. Set business context references
3. Create page file: `pages/[VariantName].tsx`
4. Run `npm run validate:metadata`
5. Start dev server to test route

### Linking Business Context

1. Edit `context/BUSINESS-CONTEXT.md`
2. Run `npm run export:business-context`
3. Update `metadata.json` with goal/persona IDs
4. Run `npm run validate:metadata`

### Updating Routes

1. Update `routes.index` if changing base path
2. Add/remove `routes.resources` entries
3. **Never** manually set variant routes
4. Run `npm run validate:metadata`
5. Restart dev server

## Troubleshooting

### Validation Errors

**"Schema version must be 2.0"**

- Update `schema_version` field to `"2.0"`
- Run `npm run migrate:metadata` if upgrading from v1

**"Business context ID not found"**

- Run `npm run export:business-context` to refresh IDs
- Check IDs match `context/temp-agent-outputs/business-context.json`

**"Route conflicts detected"**

- Ensure unique slugs across projects
- Check variant keys don't conflict
- Verify no duplicate resource routes

**"Invalid variant key format"**

- Use kebab-case for all variant keys
- No spaces, underscores, or capitals
- Must be valid URL segments

## Related Documentation

- [Routing System](./ROUTING.md) — Dynamic routing implementation
- [Business Context Guide](../../../CLAUDE.md#step-0-business-context-new-projects-only) — Strategic alignment
- [Example Metadata](./examples/metadata-example.json) — Complete annotated example
- [CLAUDE.md](../../../CLAUDE.md) — Development guide

---

**Last Updated**: 2025-10-20
**Schema Version**: 2.0
