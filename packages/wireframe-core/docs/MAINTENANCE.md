# Temp File Management & Cleanup

Guide to temporary artifact management, retention policies, and cleanup procedures.

## Overview

The platform generates temporary artifacts during development (screenshots, snapshots, brand audits). This document outlines retention policies and cleanup procedures to prevent disk bloat while preserving valuable artifacts.

## Directory Structure

```
context/
├── temp/                              # Development artifacts
│   ├── screenshots/                   # Wireframe iteration screenshots
│   ├── snapshots/                     # Project snapshots (versioned)
│   └── projects/                      # Project-specific temp data
├── temp-agent-outputs/                # Agent workflow artifacts
│   ├── brand-audit/                   # Brand audit snapshots
│   ├── manual-snapshots/              # Manual validation snapshots
│   └── prompts/                       # Generated prompts
└── reviews/                           # QA validation artifacts
```

## Retention Policies

| Category | Retention | Reason |
|----------|-----------|---------|
| **Temp screenshots (temp-* prefix)** | 7 days | Iteration artifacts, superseded by reviews |
| **Manual snapshots** | Keep latest 3 | Debugging/validation history |
| **Brand audit runs** | Keep latest 1 | Reference data, older runs obsolete |
| **Project snapshots** | Keep all | Development history |
| **Review screenshots** | Keep all | QA validation artifacts |
| **Business context** | Keep all | Core documentation |

## Cleanup Commands

### Selective Cleanup (Recommended)

Smart cleanup that preserves valuable artifacts while removing outdated temp files.

#### Dry Run (Preview)

Preview what will be deleted without making changes:

```bash
npm run cleanup:selective
```

Shows:

- Files that will be removed
- Files that will be kept
- Reasons for each decision
- Total space that will be freed

#### Execute Cleanup

Perform the cleanup:

```bash
npm run cleanup:selective:execute
```

**What gets removed**:

- Temp-prefixed screenshots older than 7 days
- Old manual snapshots (keeps latest 3)
- Old brand audit runs (keeps latest)

**What gets preserved**:

- Mining-tech-survey snapshots
- DORA platform snapshots
- Review screenshots
- Business context
- Latest brand audit data
- All project snapshots

### Nuclear Cleanup (Use with Caution)

Removes ALL temp files. Use only when you're certain you don't need any temp artifacts.

#### Preview Nuclear Cleanup

```bash
npm run clean:context-temp -- --dry-run
```

#### Execute Nuclear Cleanup

**Remove context/temp entirely**:

```bash
npm run clean:context-temp
```

**Remove context/temp + agent outputs**:

```bash
npm run clean:context-temp -- --include-agent-outputs
```

**Remove all MCP system caches**:

```bash
npm run clean:all-mcp
```

**⚠️ Warning**: Nuclear cleanup removes everything, including:

- All screenshots
- All snapshots
- All agent outputs
- All temp artifacts
- MCP caches (if specified)

## Recommended Workflows

### Weekly Cleanup

Run selective cleanup every Monday to maintain disk space:

```bash
# Monday morning routine
npm run cleanup:selective:execute
```

### Before Committing

Review and clean temp files before commits:

```bash
# 1. Review what would be cleaned
npm run cleanup:selective

# 2. Clean if appropriate
npm run cleanup:selective:execute

# 3. Commit cleanup results
git add -A
git commit -m "chore: cleanup old temp artifacts"
```

### Before Major Milestones

Archive valuable screenshots before cleanup:

```bash
# 1. Archive important screenshots
cp context/temp/screenshots/important-*.png review-screenshots/project-name/

# 2. Then clean
npm run cleanup:selective:execute

# 3. Commit archives
git add review-screenshots/
git commit -m "docs: archive project-name screenshots"
```

## Archiving Valuable Artifacts

Before cleanup, move important files to permanent storage.

### Archive Screenshots

```bash
# Create archive directory
mkdir -p review-screenshots/project-name

# Copy important screenshots
cp context/temp/screenshots/final-*.png review-screenshots/project-name/

# Commit to git
git add review-screenshots/
git commit -m "docs: archive project-name final screenshots"
```

### Archive Snapshots

```bash
# Create archive directory
mkdir -p context/archive/snapshots/project-name

# Copy snapshot directory
cp -r context/temp/snapshots/project-name context/archive/snapshots/

# Commit to git
git add context/archive/
git commit -m "docs: archive project-name snapshots"
```

### Archive Agent Outputs

```bash
# Create archive directory
mkdir -p context/archive/agent-outputs/project-name

# Copy agent outputs
cp -r context/temp-agent-outputs/project-name context/archive/agent-outputs/

# Commit to git
git add context/archive/
git commit -m "docs: archive project-name agent outputs"
```

## Cleanup Targets

### Chrome DevTools MCP Artifacts

Clean Chrome profile cache and MCP logs:

```bash
# Chrome profile cache only
npm run clean:chrome-cache

# MCP logs only
npm run clean:mcp-logs

# Both Chrome and MCP logs
npm run clean:all-mcp
```

**What gets removed**:

- Chrome DevTools MCP profile cache
- Claude MCP log files
- Browser automation temp files

### Agent Output Artifacts

Clean agent workflow outputs:

```bash
npm run clean:context-temp -- --include-agent-outputs
```

**What gets removed**:

- `context/temp-agent-outputs/`
- All agent-generated JSON/MD files
- Workflow state files

### System Caches

Clean all system-level caches:

```bash
npm run clean:all-mcp
```

**What gets removed**:

- Chrome MCP cache
- MCP log files
- Browser profiles
- Automation artifacts

## Troubleshooting

### Cleanup Accidentally Removed Important Files

If files were previously committed to git:

```bash
# Find file in git history
git log --all --full-history -- "context/temp/screenshots/important.png"

# Restore from specific commit
git checkout <commit-hash> -- "context/temp/screenshots/important.png"
```

### Recover from Backup Branch

```bash
git checkout backup-before-split -- context/temp/
```

### Disk Space Still High After Cleanup

Check other sources of disk usage:

```bash
# Check system-level caches
npm run clean:all-mcp

# Check node_modules size
du -sh node_modules

# Rebuild if needed
rm -rf node_modules && npm install

# Check git object size
git count-objects -vH
```

### Permission Errors During Cleanup

```bash
# Fix permissions
chmod -R u+w context/temp/

# Then retry cleanup
npm run cleanup:selective:execute
```

## Best Practices

### What to Archive

✅ **Do archive**:

- Final review screenshots
- Important milestone snapshots
- Agent outputs used in documentation
- Screenshots showing bugs/issues
- QA validation artifacts

❌ **Don't archive**:

- Experimental screenshots
- Duplicate snapshots
- Intermediate iteration artifacts
- Temporary test outputs

### When to Clean

**Good times to clean**:

- Weekly (Monday morning)
- Before major milestones
- Before committing large changes
- When disk space is low
- After completing a project

**Bad times to clean**:

- In the middle of active development
- Before reviewing recent changes
- When snapshots haven't been tested
- Before QA validation

### Cleanup Frequency

| Cleanup Type | Frequency |
|--------------|-----------|
| Selective cleanup | Weekly |
| Chrome cache | Monthly |
| MCP logs | Monthly |
| Nuclear cleanup | Quarterly (with caution) |

## Automation

### Pre-Commit Hook

Auto-clean before commits:

```bash
# Create pre-commit hook
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/sh
# Auto-cleanup old temp files
npm run cleanup:selective:execute --silent
EOF

chmod +x .git/hooks/pre-commit
```

### Scheduled Cleanup (macOS/Linux)

Add to crontab for weekly cleanup:

```bash
# Edit crontab
crontab -e

# Add line (runs Monday 9AM)
0 9 * * 1 cd /path/to/project && npm run cleanup:selective:execute
```

## Cleanup Decision Tree

```
Need to clean temp files?
├─ Just want to free space safely?
│  └─ Use: npm run cleanup:selective:execute
│
├─ Want to preview first?
│  └─ Use: npm run cleanup:selective
│
├─ Need to remove everything?
│  ├─ Have you archived important files?
│  │  ├─ Yes → Use: npm run clean:context-temp
│  │  └─ No → Archive first, then clean
│  └─ Are you absolutely sure?
│     ├─ Yes → Proceed
│     └─ No → Use selective cleanup instead
│
└─ MCP/Chrome issues?
   └─ Use: npm run clean:all-mcp
```

## Related Documentation

- [Snapshot System](./SNAPSHOT-SYSTEM.md) — Version control for git-ignored files
- [CLAUDE.md § Working Ritual](../../../CLAUDE.md#working-ritual) — Daily development workflow
- [Context File Management](../../../CLAUDE.md#context-file-management) — Context directory structure

---

**Last Updated**: 2025-10-20
**Version**: 1.0
