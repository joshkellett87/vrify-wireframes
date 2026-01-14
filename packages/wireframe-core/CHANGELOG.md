# Changelog

All notable changes to @wireframe/core will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.0.1] - 2025-10-20

### Added

- ProgressIndicator component for displaying completion status
- Example usage in ComponentsPreview page

### Testing

- Validated framework update workflow (patch version increment)
- Confirmed projects can update seamlessly via npm update
- Verified no breaking changes introduced

## [2.0.0] - 2025-10-20

### Added

- Initial framework extraction from monolithic project
- Public API with component exports (WireframeHeader, ErrorBoundary, UI primitives)
- Base configurations (Vite, Tailwind, TypeScript)
- Dynamic routing system with automatic route generation
- Metadata validation (schema v2.0)
- Agent workflow system with template-based prompts
- CLI tools for scaffolding, validation, and orchestration
- Comprehensive documentation structure (docs/, templates/, schemas/)

### Changed

- Restructured as monorepo with framework package
- Documentation condensed and modularized (Phase 1)
- Agent prompts extracted to template files
- Metadata schema upgraded to v2.0 with business context linking
- Import paths migrated to @wireframe/core

### Migration Guide

See [docs/MIGRATION-GUIDE.md](./docs/MIGRATION-GUIDE.md) for upgrading from v1.x.

## [1.0.0] - Previous Version

Legacy monolithic structure (pre-framework extraction).

---

## Version Scheme

- **Major (x.0.0)**: Breaking changes that require project code updates
- **Minor (2.x.0)**: New features that are backwards compatible
- **Patch (2.0.x)**: Bug fixes and internal improvements (backwards compatible)

## Links

- [Migration Guide](./docs/MIGRATION-GUIDE.md)
- [API Documentation](./docs/API.md)
- [Contributing Guidelines](../../CLAUDE.md)
