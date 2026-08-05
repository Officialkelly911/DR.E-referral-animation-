#!/usr/bin/env bash
# ══════════════════════════════════════════════════════════════════════════════
# Dream Planet — Git pre-push hook installer
#
# Installs (or removes) a git pre-push hook that runs validate_master.sh
# in quick mode before every push, blocking the push on validation failure.
#
# Usage:
#   ./install_hooks.sh            # install the pre-push hook
#   ./install_hooks.sh --remove   # remove the pre-push hook
#   ./install_hooks.sh --status   # show current hook status
# ══════════════════════════════════════════════════════════════════════════════
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../../../../../.." && pwd)"
HOOKS_DIR="$REPO_ROOT/.git/hooks"
HOOK_FILE="$HOOKS_DIR/pre-push"
VALIDATOR="$SCRIPT_DIR/validate_master.sh"
MARKER="# dream-planet-validate-master"

if [[ ! -d "$HOOKS_DIR" ]]; then
  echo "ERROR: .git/hooks not found at $HOOKS_DIR" >&2
  echo "       Run this script from inside the git repository." >&2
  exit 1
fi

if [[ ! -f "$VALIDATOR" ]]; then
  echo "ERROR: validate_master.sh not found at $VALIDATOR" >&2
  exit 1
fi

ACTION="${1:-install}"

case "$ACTION" in

  --status)
    if [[ -f "$HOOK_FILE" ]] && grep -q "$MARKER" "$HOOK_FILE" 2>/dev/null; then
      echo "Status: pre-push hook is INSTALLED"
      echo "Hook:   $HOOK_FILE"
    else
      echo "Status: pre-push hook is NOT installed"
    fi
    exit 0
    ;;

  --remove)
    if [[ ! -f "$HOOK_FILE" ]]; then
      echo "No pre-push hook found at $HOOK_FILE — nothing to remove."
      exit 0
    fi
    if grep -q "$MARKER" "$HOOK_FILE" 2>/dev/null; then
      # Remove only the block we added (between MARKER lines)
      tmpfile="$(mktemp)"
      awk "/^${MARKER}$/,/^${MARKER} end$/{next} {print}" "$HOOK_FILE" > "$tmpfile"
      mv "$tmpfile" "$HOOK_FILE"
      chmod +x "$HOOK_FILE"
      # If the hook is now empty (only the shebang), remove it entirely
      if [[ "$(grep -c . "$HOOK_FILE" || true)" -le 1 ]]; then
        rm -f "$HOOK_FILE"
        echo "Removed: pre-push hook deleted (it was empty after removal)"
      else
        echo "Removed: Dream Planet validation block removed from $HOOK_FILE"
      fi
    else
      echo "No Dream Planet validation block found in $HOOK_FILE — nothing to remove."
    fi
    exit 0
    ;;

  install|"")
    ;;

  *)
    echo "Usage: $(basename "$0") [--install|--remove|--status]" >&2
    exit 2
    ;;
esac

# ── Install ───────────────────────────────────────────────────────────────────

# Build the block to inject
HOOK_BLOCK="${MARKER}
# Automatically added by install_hooks.sh — do not edit this block manually.
# To remove: run ./install_hooks.sh --remove
echo \"[pre-push] Running Dream Planet master validation (quick mode)...\"
if ! bash \"${VALIDATOR}\" --quick; then
  echo \"\"
  echo \"[pre-push] Validation FAILED — push blocked.\"
  echo \"           Fix the issues above or run './validate_master.sh --full' for details.\"
  exit 1
fi
echo \"[pre-push] Validation passed.\"
${MARKER} end"

if [[ -f "$HOOK_FILE" ]] && grep -q "$MARKER" "$HOOK_FILE" 2>/dev/null; then
  echo "pre-push hook already contains Dream Planet validation — skipping."
  echo "Run $(basename "$0") --status to confirm."
  exit 0
fi

if [[ -f "$HOOK_FILE" ]]; then
  # Append to existing hook
  printf "\n%s\n" "$HOOK_BLOCK" >> "$HOOK_FILE"
  echo "Updated: appended Dream Planet validation to existing $HOOK_FILE"
else
  # Create a new hook
  cat > "$HOOK_FILE" <<HOOKEOF
#!/usr/bin/env bash
${HOOK_BLOCK}
HOOKEOF
  echo "Created: $HOOK_FILE"
fi

chmod +x "$HOOK_FILE"
echo ""
echo "Done. Every 'git push' will now run validate_master.sh --quick first."
echo ""
echo "To test the hook manually:"
echo "  bash $HOOK_FILE"
echo ""
echo "To remove the hook:"
echo "  ./install_hooks.sh --remove"
