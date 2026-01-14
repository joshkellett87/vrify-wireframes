# Vrify Wireframes

Multi-variant wireframe project built with [@wireframe/core](../../packages/wireframe-core).

## Quick Start

```bash
# Install dependencies from the workspace root
npm install

# Start the dev server
npm run dev --workspace projects/vrify-wireframes

# Build for production
npm run build --workspace projects/vrify-wireframes
```

## Project Structure

```
src/
├── wireframes/          # Project wireframes
│   ├── mining-tech-survey/
│   ├── dora-data-fusion-models/
│   └── platform-pricing/
├── App.tsx              # Main app component
└── main.tsx             # Entry point

context/
├── BUSINESS-CONTEXT.md  # Business intelligence
└── temp/                # Temporary artifacts
```

## Framework

This project uses [@wireframe/core](../../packages/wireframe-core) v2.0.0.

**Framework provides**

- Shared components and UI primitives
- Dynamic routing system
- Metadata validation
- Agent workflows
- CLI tools

**Project contains**

- Wireframe-specific components
- Business context
- Project configuration overrides

## Upgrading Framework

```bash
# Update to latest minor version
npm update --workspace projects/vrify-wireframes @wireframe/core

# Validate compatibility
npm run validate:metadata --workspace projects/vrify-wireframes

# Test build
npm run build --workspace projects/vrify-wireframes
```

See [Framework Changelog](../../packages/wireframe-core/CHANGELOG.md) for breaking changes.

## Documentation

- Framework docs: [Documentation Index](../../packages/wireframe-core/docs/README.md)
- Quick start: [Quick Start Guide](../../packages/wireframe-core/docs/guides/QUICK-START.md)
- Full guide: [Architecture Playbook](../../CLAUDE.md)
