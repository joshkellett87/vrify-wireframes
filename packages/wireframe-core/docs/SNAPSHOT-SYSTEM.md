# Snapshot System

Version control for git-ignored files including business context and temp artifacts.

## Overview

The snapshot system provides rollback capability for wireframe changes that include git-ignored files (business context, temp artifacts) that Git cannot track.

**Purpose**: Safely experiment with design changes knowing you can restore previous states.

## Automatic Snapshots

The system **automatically creates snapshots** before potentially destructive operations:

### When Automatic Snapshots Occur

- **Before `npm run iterate`** — Snapshots baseline project before creating new variant
- **Before `npm run orchestrate`** — Snapshots project before first agent workflow run

**No user action required** — rollback protection is built-in.

## Manual Snapshot Commands

### Create Snapshot

Create a snapshot before making experimental changes:

```bash
npm run snapshot -- --project=PROJECT_SLUG [--description="Optional description"]
```

**Examples**:

```bash
# Before major redesign
npm run snapshot -- --project=mining-tech-survey --description="Before hero redesign"

# Before variant changes
npm run snapshot -- --project=platform-pricing --description="Before adding FAQ section"
```

### List Snapshots

View all available snapshots for a project:

```bash
npm run snapshot:list -- --project=PROJECT_SLUG
```

**Example Output**:

```
Available snapshots for mining-tech-survey:

1. 2025-10-20T14:30:00Z - "Before hero redesign" (2.3 MB)
2. 2025-10-19T09:15:00Z - "Before FAQ addition" (2.1 MB)
3. 2025-10-18T16:45:00Z - "Automatic snapshot from iterate" (2.2 MB)

Total: 3 snapshots
Storage: context/temp/snapshots/mining-tech-survey/
```

### Restore Snapshot

Restore a previous snapshot (automatically creates backup first):

```bash
npm run snapshot:restore -- --project=PROJECT_SLUG --timestamp=TIMESTAMP
```

**Example**:

```bash
npm run snapshot:restore -- --project=mining-tech-survey --timestamp=2025-10-20T14:30:00Z
```

**Safety Features**:

- Automatically creates backup of current state before restoring
- Backup stored with prefix `backup-before-restore-`
- Can undo restore by restoring the backup

### Dry Run (Preview)

Preview what will be restored without making changes:

```bash
npm run snapshot:restore -- --project=PROJECT_SLUG --timestamp=TIMESTAMP --dry-run
```

Shows:

- Files that will be added
- Files that will be modified
- Files that will be deleted
- No actual changes made

## AI Assistant Usage

**IMPORTANT for Claude Code and other AI assistants:**

### Before Significant Changes

Create a snapshot before making design changes:

```bash
npm run snapshot -- --project=PROJECT_SLUG --description="Before [change description]"
```

### After Unwanted Changes

If user doesn't like the changes:

1. **List available snapshots**:

   ```bash
   npm run snapshot:list -- --project=PROJECT_SLUG
   ```

2. **Show user** the list with timestamps and descriptions

3. **Ask which snapshot to restore**

4. **Restore chosen snapshot**:

   ```bash
   npm run snapshot:restore -- --project=PROJECT_SLUG --timestamp=TIMESTAMP
   ```

### Bash Tool Integration

Use the Bash tool to run these commands — they work seamlessly in AI workflows.

## What Gets Snapshotted

The snapshot system captures:

| Category | Path | Git Ignored? |
|----------|------|--------------|
| **Wireframe project** | `src/wireframes/[project-slug]/` | No |
| **Business context** | `context/BUSINESS-CONTEXT.md` | Yes |
| **Business context JSON** | `context/temp/business-context.json` | Yes |
| **Project-specific files** | All files in project directory | Mixed |

**Key Point**: All project-specific files are included, regardless of `.gitignore` status.

## Auto-Cleanup Policy

Snapshots are automatically managed to prevent disk bloat:

### Retention Rules

- **Age-based deletion**: Snapshots older than 7 days are automatically deleted
- **Count-based retention**: Always keeps the 3 most recent snapshots regardless of age
- **Automatic cleanup**: Runs on every snapshot creation
- **No manual cleanup required**

### Example Scenario

You have 5 snapshots:

1. 10 days old - **Deleted** (older than 7 days, not in recent 3)
2. 8 days old - **Deleted** (older than 7 days, not in recent 3)
3. 6 days old - **Kept** (within 7 days)
4. 2 days old - **Kept** (recent 3)
5. 1 day old - **Kept** (recent 3)

Result: 3 snapshots kept

## Storage Location

All snapshots stored in:

```
context/temp/snapshots/[project-slug]/[timestamp]/
```

**Example**:

```
context/temp/snapshots/
├── mining-tech-survey/
│   ├── 2025-10-20T14-30-00Z/
│   ├── 2025-10-19T09-15-00Z/
│   └── 2025-10-18T16-45-00Z/
└── platform-pricing/
    ├── 2025-10-20T10-00-00Z/
    └── 2025-10-19T15-30-00Z/
```

**Git Status**: This directory is git-ignored and managed automatically.

## Workflow Examples

### Experimental Design Changes

```bash
# 1. Create snapshot before changes
npm run snapshot -- --project=product-launch --description="Before CTA repositioning"

# 2. Make changes
# ... edit components ...

# 3. Preview changes
npm run dev

# 4a. If user likes changes: keep them
# Nothing to do - changes are already in place

# 4b. If user dislikes changes: restore
npm run snapshot:list -- --project=product-launch
npm run snapshot:restore -- --project=product-launch --timestamp=2025-10-20T14:30:00Z
```

### Variant Iteration

```bash
# Automatic snapshot created by iterate command
npm run iterate -- --from=baseline-variant --new=experimental-variant

# If experimental variant doesn't work out:
npm run snapshot:list -- --project=product-launch
npm run snapshot:restore -- --project=product-launch --timestamp=[before-iterate]
```

### Business Context Updates

```bash
# 1. Snapshot before business context changes
npm run snapshot -- --project=mining-tech-survey --description="Before persona updates"

# 2. Update business context
# ... edit context/BUSINESS-CONTEXT.md ...

# 3. Export and validate
npm run export:business-context
npm run validate:metadata

# 4. If issues arise, restore
npm run snapshot:restore -- --project=mining-tech-survey --timestamp=TIMESTAMP
```

## Troubleshooting

### Cannot Find Snapshot

**Issue**: Snapshot timestamp not found

**Solution**:

1. List available snapshots: `npm run snapshot:list -- --project=PROJECT_SLUG`
2. Copy exact timestamp from list
3. Use exact timestamp in restore command

### Restore Fails

**Issue**: Error during restore operation

**Solutions**:

- Check project slug is correct
- Verify timestamp format (ISO 8601)
- Ensure snapshot directory exists
- Check file permissions

### Want to Keep Snapshot Longer

**Issue**: Important snapshot will be auto-deleted after 7 days

**Solution**: Archive it manually:

```bash
# Copy to permanent location
mkdir -p context/archive/snapshots/project-name
cp -r context/temp/snapshots/project-name/TIMESTAMP context/archive/snapshots/project-name/

# Commit to git
git add context/archive/
git commit -m "docs: archive important snapshot"
```

### Accidental Restore

**Issue**: Restored wrong snapshot

**Solution**: Restore the backup snapshot:

```bash
# List snapshots (backup will have "backup-before-restore" prefix)
npm run snapshot:list -- --project=PROJECT_SLUG

# Restore the backup
npm run snapshot:restore -- --project=PROJECT_SLUG --timestamp=backup-before-restore-TIMESTAMP
```

## Best Practices

### When to Create Manual Snapshots

✅ **Do create snapshots**:

- Before major design changes
- Before experimenting with new approaches
- Before business context updates
- Before refactoring components

❌ **Don't create snapshots**:

- For minor text changes
- When automatic snapshots already triggered
- For every small edit (creates clutter)

### Naming Descriptions

**Good descriptions**:

- "Before hero section redesign"
- "Before adding FAQ variant"
- "Before business context persona updates"

**Poor descriptions**:

- "Backup"
- "Test"
- "Changes"

### Cleanup Habits

- Let automatic cleanup handle old snapshots
- Archive truly important snapshots to git
- Review snapshot list monthly
- Delete unnecessary archived snapshots

## Related Documentation

- [MAINTENANCE.md](./MAINTENANCE.md) — Temp file cleanup procedures
- [CLAUDE.md § Working Ritual](../../../CLAUDE.md#working-ritual) — Daily development workflow
- [docs/guides/WORKFLOWS.md](./guides/WORKFLOWS.md) — Iteration workflows

---

**Last Updated**: 2025-10-20
**Version**: 1.0
