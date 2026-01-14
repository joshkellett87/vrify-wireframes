# Quick Start Guide

Get up and running with the Multi-Wireframe Platform in 5 minutes.

## Prerequisites

- Node.js 18+ installed
- npm 9+ installed
- Git (for version control)

## Installation

```bash
# Clone or navigate to project
cd <your-workspace>

# Install dependencies
npm install

# Verify installation
npm run dev
```

Visit <http://localhost:8080> to confirm the platform is running.

## Your First Wireframe

### Step 1: Gather Business Context (New Projects Only)

For new projects, capture strategic business intelligence:

```
Ask Claude Code or Codex:
"Let's gather business context for this wireframe project"

(Agent will ask questions about industry, goals, personas, competitors)
```

**Output**: `context/BUSINESS-CONTEXT.md`

### Step 2: Provide Design Brief

Share your project requirements:

```
"Here's the design brief for a product launch page:
- Project: Mining technology survey report
- Goal: Generate qualified demo requests
- Audience: Operations executives, technical evaluators
- Sections: Hero, Key Findings, Methodology, CTA"
```

### Step 3: Run Agent Workflow

Agents analyze and create strategy:

```
"Run the wireframe workflow to create strategy"
```

**Agents Run**:

1. `brief-analyzer` — Extracts structure and requirements
2. `wireframe-strategist` — Designs 2-3 differentiated variants
3. `business-context-validator` — Confirms alignment

**Output**: Variant strategy with routing and implementation guidance

### Step 4: Implement

**Default: Direct Implementation**

```
"Let's implement the first variant directly in Claude Code"
```

Claude Code builds components and pages based on strategy.

**Optional: Lovable Export**

```
"I confirm Lovable export"
```

Generates complete prompt for external tool.

### Step 5: Preview & Iterate

```bash
# Start dev server
npm run dev
```

Use Chrome DevTools MCP for visual validation:

```bash
mcp__chrome-devtools__navigate_page → http://localhost:8080/your-project
mcp__chrome-devtools__take_snapshot → Validate structure
```

## Project Structure

```
src/wireframes/your-project/
├── metadata.json          # Project config
├── brief.txt             # Original brief
├── components/           # Section components
│   ├── HeroSection.tsx
│   ├── FindingsSection.tsx
│   └── CTASection.tsx
└── pages/                # Routes
    ├── Index.tsx        # Project intro
    ├── VariantA.tsx     # Variant page
    └── VariantB.tsx     # Variant page
```

## Key Commands

```bash
# Development
npm run dev                     # Start dev server (port 8080)
npm run build                   # Production build
npm run build:dev               # Development build

# Validation
npm run validate:metadata       # Validate all metadata files
npm run lint                    # Lint TypeScript/TSX

# Workflows
npm run orchestrate -- --project <slug>    # Run agent workflow
npm run iterate -- --from=<old> --new=<new>  # Iterate variant

# Cleanup
npm run cleanup:selective       # Preview cleanup
npm run cleanup:selective:execute  # Execute cleanup
```

## Common Workflows

### Add a New Variant

1. Edit `metadata.json`:

   ```json
   {
     "variants": {
       "new-variant": {
         "name": "New Variant",
         "description": "What makes this unique",
         "businessContextRef": {
           "goalIds": ["goal-id"],
           "personaIds": ["persona-id"]
         }
       }
     }
   }
   ```

2. Create page file: `pages/NewVariant.tsx`

3. Validate:

   ```bash
   npm run validate:metadata
   npm run dev
   ```

### Update Business Context

1. Edit `context/BUSINESS-CONTEXT.md`
2. Export JSON: `npm run export:business-context`
3. Update `metadata.json` with goal/persona IDs
4. Validate: `npm run validate:metadata`

### Create Snapshot Before Changes

```bash
npm run snapshot -- --project=your-project --description="Before redesign"
```

### Restore Previous Version

```bash
# List snapshots
npm run snapshot:list -- --project=your-project

# Restore specific snapshot
npm run snapshot:restore -- --project=your-project --timestamp=TIMESTAMP
```

## Troubleshooting

### Dev Server Won't Start

**Check port**:

```bash
lsof -i :8080
```

**Kill conflicting process**:

```bash
kill -9 <PID>
npm run dev
```

### Validation Fails

**Common fixes**:

```bash
# Check metadata schema
npm run validate:metadata

# Migrate v1 to v2
npm run migrate:metadata

# Export business context
npm run export:business-context
```

### Route Not Found

**Verify**:

1. Variant key exists in `metadata.json`
2. Page file name matches PascalCase conversion
3. No `routes.variants` in metadata (auto-derived)
4. Dev server restarted

## Next Steps

- Review [CLAUDE.md](../../../../CLAUDE.md) for full development guide
- Check [Agent Workflows](../../../../AGENT-WORKFLOWS.md) for agent system
- Read [METADATA-SCHEMA.md](../METADATA-SCHEMA.md) for schema details
- Explore [WORKFLOWS.md](./WORKFLOWS.md) for iteration guides

## Getting Help

- Documentation index: [docs/README.md](../README.md)
- Agent reference: [templates/agents/README.md](../../templates/agents/README.md)
- Troubleshooting: Check specific doc files for detailed guides

---

**Time to First Wireframe**: ~5-10 minutes (with business context)
**Time to Add Variant**: ~2-3 minutes

**Last Updated**: 2025-10-20
