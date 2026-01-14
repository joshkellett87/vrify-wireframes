# Dynamic Routing System

Complete technical reference for the wireframe platform's automatic routing system.

## Overview

Routes automatically generate from schema v2.0 metadata — **no manual `App.tsx` editing required**.

**Key Principle**: Define routes in `metadata.json`, create corresponding page files, and the system handles the rest.

## System Components

**Location**:

- `src/shared/lib/metadata-schema.mjs` — Schema validation and route derivation
- `src/shared/lib/routing.ts` — Route generation utilities
- `src/App.tsx` — Dynamic route registration

## How It Works

### Step 1: Define Metadata

Create `metadata.json` with variant keys and base routes:

```json
{
  "schema_version": "2.0",
  "id": "product-launch",
  "slug": "product-launch",
  "variants": {
    "conversion-first": { "name": "Conversion First" },
    "trust-forward": { "name": "Trust Forward" }
  },
  "routes": {
    "index": "/product-launch",
    "resources": ["/product-launch/resources"]
  }
}
```

The routing utilities call `deriveVariantRoutes()` so variant paths are automatically generated:

- `/product-launch/conversion-first`
- `/product-launch/trust-forward`

**Critical Rules**:

- ✅ Set `routes.index` - required
- ✅ Set `routes.resources` - optional array
- ❌ **Never** set `routes.variants` - auto-derived from `variants` keys
- ❌ **Never** add `path` fields to variant definitions

### Step 2: Create Page Files

Follow naming conventions to map routes to components:

| Route | File Path | Component Name |
|-------|-----------|----------------|
| `/product-launch` | `src/wireframes/product-launch/pages/Index.tsx` | `Index` |
| `/product-launch/conversion-first` | `src/wireframes/product-launch/pages/ConversionFirst.tsx` | `ConversionFirst` |
| `/product-launch/trust-forward` | `src/wireframes/product-launch/pages/TrustForward.tsx` | `TrustForward` |
| `/product-launch/resources` | `src/wireframes/product-launch/pages/Resources.tsx` | `Resources` |
| `/product-launch/resources/playbook` | `src/wireframes/product-launch/pages/resources/Playbook.tsx` | `Playbook` |

**Pattern**: kebab-case path → PascalCase filename (nested paths map to directories)

### Step 3: Auto-Registration

On dev server start or build:

- System scans all `metadata.json` files
- Derives routes from metadata
- Lazy-loads corresponding page components
- No imports needed in `App.tsx`

## Naming Conventions

### Path to Component Conversion

The routing system automatically converts:

```
/product-launch                    → Index.tsx
/product-launch/conversion-first   → ConversionFirst.tsx
/product-launch/trust-forward      → TrustForward.tsx
/product-launch/resources/playbook → resources/Playbook.tsx
```

**Rules**:

1. Kebab-case in URL → PascalCase in filename
2. Root index → `Index.tsx`
3. Nested paths → directory structure
4. Hyphens removed and next character capitalized

### Slug Requirements

**Valid slugs**:

- ✅ `product-launch`
- ✅ `mining-tech-survey`
- ✅ `conversion-first`

**Invalid slugs**:

- ❌ `ProductLaunch` (capitals)
- ❌ `product_launch` (underscores)
- ❌ `product launch` (spaces)
- ❌ `product.launch` (periods)

## Intelligent Routing Workflow

Default routing strategy for new projects:

### 1. Derive Project Slug

**From Brief**: Extract project name and convert to kebab-case

- "Product Launch Campaign" → `product-launch`
- "Mining Tech Survey" → `mining-tech-survey`

**User Override**: Accept explicit slug from brief if provided

### 2. Establish Base Route

**Default**: `/${slug}`

- Most projects get their own namespace
- Examples: `/product-launch`, `/mining-tech-survey`

**Root Override**: `/` only when explicitly required

- Single-purpose site
- Brief explicitly states "take over root"
- No other wireframes on this deployment

### 3. Index Route (Required)

Every project MUST have an index route:

- Introduces the project
- Links to all variants
- Provides navigation context
- Surfaces primary CTA

**Implementation**: `pages/Index.tsx`

### 4. Variant Routes (Auto-Derived)

Variant keys become URL segments:

```json
{
  "variants": {
    "conversion-first": {},  // → /product-launch/conversion-first
    "trust-forward": {},     // → /product-launch/trust-forward
    "data-deep-dive": {}     // → /product-launch/data-deep-dive
  }
}
```

**Page Files**:

- `pages/ConversionFirst.tsx`
- `pages/TrustForward.tsx`
- `pages/DataDeepDive.tsx`

### 5. Navigation Defaults

Top navigation typically includes:

- Project title (links to index)
- Each variant
- Resource pages (if defined)

**Implementation**:

```typescript
import { getFullRoutes } from '@/shared/lib/metadata-schema.mjs';

const routes = getFullRoutes(metadata);
// Use routes in WireframeHeader or custom nav
```

### 6. Preference Overrides

Respect special routing modes from brief:

**Wizard Flow**: Sequential variant progression

- Add `preferenceFlags: ["wizard"]` to metadata
- Implement next/prev navigation between variants

**No Index**: Skip index page

- Rare, only when variants are completely independent
- Add `preferenceFlags: ["no-index"]`

**Resources Only**: Documentation site

- No variants, just resource hierarchy
- Set `projectType: "resources-only"`

## Route Generation API

### `deriveVariantRoutes(metadata)`

Generates variant routes from metadata:

```typescript
import { deriveVariantRoutes } from '@/shared/lib/metadata-schema.mjs';

const routes = deriveVariantRoutes(metadata);
// Returns: { "conversion-first": "/product-launch/conversion-first", ... }
```

### `getFullRoutes(metadata)`

Returns complete routing object:

```typescript
const routes = getFullRoutes(metadata);
// {
//   index: "/product-launch",
//   variants: {
//     "conversion-first": "/product-launch/conversion-first",
//     "trust-forward": "/product-launch/trust-forward"
//   },
//   resources: ["/product-launch/resources"]
// }
```

### `generateAllWireframeRoutes()`

Discovers all projects and generates complete route table:

```typescript
import { generateAllWireframeRoutes } from '@/shared/lib/routing';

const allRoutes = generateAllWireframeRoutes();
// Used by App.tsx to register all routes
```

## Validation

### After Metadata Changes

Always run validation:

```bash
npm run validate:metadata
```

Checks:

- Route uniqueness across projects
- Valid slug formats
- Corresponding page files exist
- No conflicting paths

### After Creating Pages

Start dev server and verify routes resolve:

```bash
npm run dev
```

Visit routes to confirm:

- <http://localhost:8080/product-launch>
- <http://localhost:8080/product-launch/conversion-first>
- <http://localhost:8080/product-launch/resources>

## Troubleshooting

### Issue: Module Not Found

**Symptom**: `Error: Cannot find module './pages/ConversionFirst'`

**Cause**: Page file doesn't exist or has wrong name

**Fix**:

1. Check variant key in metadata: `"conversion-first"`
2. Convert to PascalCase: `ConversionFirst`
3. Create file: `pages/ConversionFirst.tsx`
4. Restart dev server

### Issue: Route Returns 404

**Symptom**: Navigating to route shows "Not Found"

**Cause**: Route not registered in metadata

**Fix**:

1. Verify variant key exists in `metadata.json`
2. Ensure no `routes.variants` field (should be auto-derived)
3. Run `npm run validate:metadata`
4. Restart dev server

### Issue: Schema Validation Fails

**Symptom**: Validation error when running `npm run validate:metadata`

**Cause**: Invalid metadata structure

**Fix**:

1. Check error message for specific issue
2. Review [METADATA-SCHEMA.md](./METADATA-SCHEMA.md)
3. Common fixes:
   - Add missing required fields
   - Remove `routes.variants` (auto-derived)
   - Fix slug format (kebab-case)
4. For v1 files: `npm run migrate:metadata`

### Issue: Route Conflicts

**Symptom**: Two projects claiming same route

**Cause**: Duplicate slugs or overlapping paths

**Fix**:

1. Review validation output
2. Change one project's slug
3. Update all variant references
4. Re-run validation

## Cross-Linking

### Variant to Variant

Link between variants within same project:

```typescript
import { getFullRoutes } from '@/shared/lib/metadata-schema.mjs';

const routes = getFullRoutes(metadata);

<Link to={routes.variants['trust-forward']}>
  See Trust-Forward variant
</Link>
```

### Variant to Index

Return to project home:

```typescript
<Link to={routes.index}>
  Back to Overview
</Link>
```

### Between Projects

Reference other projects by their known routes:

```typescript
<Link to="/mining-tech-survey">
  View Mining Tech Survey
</Link>
```

## Advanced Patterns

### Conditional Routing

Redirect based on user state or preferences:

```typescript
useEffect(() => {
  if (userPrefersTrust) {
    navigate(routes.variants['trust-forward']);
  }
}, [userPrefersTrust]);
```

### Dynamic Navigation

Build nav from metadata:

```typescript
const nav Items = Object.entries(metadata.variants).map(([key, variant]) => ({
  path: routes.variants[key],
  label: variant.name
}));
```

### Nested Resources

Organize resources hierarchically:

```json
{
  "routes": {
    "resources": [
      "/product-launch/resources",
      "/product-launch/resources/playbook",
      "/product-launch/resources/case-studies"
    ]
  }
}
```

Page structure:

```
pages/
└── resources/
    ├── Index.tsx      # /product-launch/resources
    ├── Playbook.tsx   # /product-launch/resources/playbook
    └── CaseStudies.tsx # /product-launch/resources/case-studies
```

## Related Documentation

- [Metadata Schema](./METADATA-SCHEMA.md) — Complete schema reference
- [CLAUDE.md § Intelligent Routing](../../../CLAUDE.md#intelligent-routing-workflow) — Routing strategy
- [Example Metadata](./examples/metadata-example.json) — Reference implementation

---

**Last Updated**: 2025-10-20
**Version**: 2.0
