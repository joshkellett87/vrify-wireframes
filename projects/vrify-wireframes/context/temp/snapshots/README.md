# Wireframe Snapshot System

This directory contains version-controlled snapshots of wireframe projects, including git-ignored files that Git cannot track.

## Purpose

The snapshot system provides rollback capability for:

- Wireframe source code (`src/wireframes/[project-slug]/`)
- Business context files (`context/BUSINESS-CONTEXT.md`)
- Exported business context JSON (`context/temp/business-context.json`)
- All project-specific files regardless of `.gitignore` status

This allows you to experiment with design changes and easily revert if needed.

## Directory Structure

```
context/temp/snapshots/
├── [project-slug-1]/
│   ├── [timestamp-1]/
│   │   ├── snapshot.json              # Metadata
│   │   ├── wireframe-project/         # Full project copy
│   │   ├── BUSINESS-CONTEXT.md        # Business context (if exists)
│   │   └── business-context.json      # Exported JSON (if exists)
│   ├── [timestamp-2]/
│   └── backup-[timestamp]/            # Auto-created before restore
├── [project-slug-2]/
└── README.md                          # This file
```

## Automatic Snapshots

Snapshots are **automatically created** before:

- `npm run iterate` — Before creating new wireframe variant
- `npm run orchestrate` — Before first agent workflow run

No manual intervention required.

## Manual Commands

### Create Snapshot

```bash
npm run snapshot -- --project=PROJECT_SLUG [--description="Optional description"]
```

### List Snapshots

```bash
npm run snapshot:list -- --project=PROJECT_SLUG
```

### Restore Snapshot

```bash
# Preview first (recommended)
npm run snapshot:restore -- --project=PROJECT_SLUG --timestamp=TIMESTAMP --dry-run

# Actually restore (auto-creates backup first)
npm run snapshot:restore -- --project=PROJECT_SLUG --timestamp=TIMESTAMP
```

## Auto-Cleanup

- Snapshots older than **7 days** are automatically deleted
- Always keeps the **3 most recent** snapshots regardless of age
- Cleanup runs automatically on every snapshot creation
- Backup snapshots (created during restore) are excluded from auto-cleanup

## For AI Assistants

When working with wireframe projects:

1. **Before significant design changes**, create a snapshot:

   ```bash
   npm run snapshot -- --project=PROJECT_SLUG --description="Before [change description]"
   ```

2. **If user doesn't like changes**, offer to restore:
   - List available snapshots with `npm run snapshot:list`
   - Let user choose which snapshot to restore
   - Restore with `npm run snapshot:restore`

3. **Use Bash tool** to execute these commands in your workflow

## Implementation Details

- **Location**: `scripts/snapshot.mjs` (main script)
- **Helper**: `scripts/lib/auto-snapshot.mjs` (reusable function)
- **Storage**: This directory (`context/temp/snapshots/`)
- **Git status**: Ignored (not committed to version control)

## Troubleshooting

**Snapshot not created?**

- Verify project exists: `ls src/wireframes/PROJECT_SLUG`
- Check permissions on `context/temp/` directory

**Restore failed?**

- Verify timestamp exists: `npm run snapshot:list -- --project=PROJECT_SLUG`
- Check for typos in timestamp format (should be `YYYY-MM-DD_HH-MM-SS`)

**Auto-cleanup too aggressive?**

- Edit `scripts/snapshot.mjs` constants:
  - `MAX_SNAPSHOT_AGE_DAYS` (default: 7)
  - `MIN_SNAPSHOTS_TO_KEEP` (default: 3)

## See Also

- Full documentation: `CLAUDE.md` → "Snapshot System" section
- Script source: `scripts/snapshot.mjs`
- Auto-snapshot helper: `scripts/lib/auto-snapshot.mjs`
