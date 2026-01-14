#!/bin/bash
set -e

DRY_RUN=true
if [ "$1" == "--execute" ]; then
  DRY_RUN=false
fi

removed_count=0

log_action() {
  local file=$1
  local size=$(du -sh "$file" 2>/dev/null | awk '{print $1}')
  
  if [ "$DRY_RUN" = true ]; then
    echo "  [DRY-RUN] Would remove: $file ($size)"
  else
    echo "  ✓ Removed: $file ($size)"
    rm -rf "$file"
    removed_count=$((removed_count + 1))
  fi
}

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║          Selective Temp File Cleanup                      ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

if [ "$DRY_RUN" = true ]; then
  echo "🔍 DRY RUN MODE - No files will be deleted"
  echo "   Run with --execute to perform actual cleanup"
else
  echo "⚠️  EXECUTE MODE - Files will be permanently deleted"
  echo "   Press Ctrl+C within 5 seconds to cancel..."
  sleep 5
fi

echo ""
echo "════════════════════════════════════════════════════════════"
echo "1️⃣  Removing temp-prefixed screenshots (Old iteration artifacts)"
echo "════════════════════════════════════════════════════════════"
find context/temp/screenshots -name "temp-*.png" 2>/dev/null | while read file; do
  log_action "$file"
done

echo ""
echo "════════════════════════════════════════════════════════════"
echo "2️⃣  Removing old manual snapshots (Keep latest 3)"
echo "════════════════════════════════════════════════════════════"
# Get all snapshot directories, sort by date, remove all except last 3
find context/temp-agent-outputs/manual-snapshots -type d -name "2025-*" 2>/dev/null | sort | {
  mapfile -t dirs
  total=${#dirs[@]}
  keep=3
  remove=$((total - keep))
  
  if [ $remove -gt 0 ]; then
    for ((i=0; i<$remove; i++)); do
      log_action "${dirs[$i]}"
    done
  else
    echo "  ℹ️  All snapshots are recent (${total} <= ${keep}), keeping all"
  fi
}

echo ""
echo "════════════════════════════════════════════════════════════"
echo "3️⃣  Removing old brand audit runs (Keep latest)"
echo "════════════════════════════════════════════════════════════"

echo "Desktop audits:"
find context/temp-agent-outputs/brand-audit/platform/desktop -type d -name "2025-*" 2>/dev/null | sort | {
  mapfile -t dirs
  total=${#dirs[@]}
  if [ $total -gt 1 ]; then
    for ((i=0; i<$total-1; i++)); do
      log_action "${dirs[$i]}"
    done
  else
    echo "  ℹ️  Only latest run exists, keeping it"
  fi
}

echo "Mobile audits:"
find context/temp-agent-outputs/brand-audit/platform/mobile -type d -name "2025-*" 2>/dev/null | sort | {
  mapfile -t dirs
  total=${#dirs[@]}
  if [ $total -gt 1 ]; then
    for ((i=0; i<$total-1; i++)); do
      log_action "${dirs[$i]}"
    done
  else
    echo "  ℹ️  Only latest run exists, keeping it"
  fi
}

echo "Metrics runs (keep latest):"
find context/temp-agent-outputs/brand-audit/platform/metrics -type d -name "2025-*" 2>/dev/null | sort | {
  mapfile -t dirs
  total=${#dirs[@]}
  if [ $total -gt 1 ]; then
    for ((i=0; i<$total-1; i++)); do
      log_action "${dirs[$i]}"
    done
  else
    echo "  ℹ️  Only latest run exists, keeping it"
  fi
}

echo ""
echo "════════════════════════════════════════════════════════════"
echo "✅ Files Preserved (Valuable Artifacts)"
echo "════════════════════════════════════════════════════════════"
echo "  ✓ Mining-tech-survey snapshots (520KB)"
echo "  ✓ DORA platform snapshot (2.9MB)"
echo "  ✓ Review screenshots (2.9MB)"
echo "  ✓ Business context (29KB)"
echo "  ✓ Latest brand audit runs"
echo "  ✓ Latest 3 manual snapshots"
echo ""

if [ "$DRY_RUN" = true ]; then
  echo "════════════════════════════════════════════════════════════"
  echo "🔍 Dry run complete - no files were deleted"
  echo "   Run with --execute to perform actual cleanup"
  echo "════════════════════════════════════════════════════════════"
else
  echo "════════════════════════════════════════════════════════════"
  echo "✅ Cleanup complete!"
  echo "   Removed: $removed_count items"
  echo "════════════════════════════════════════════════════════════"
fi
