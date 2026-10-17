#!/usr/bin/env bash
# ==============================================================================
# run-seo.sh — Universal SEO Audit Runner
# Usage:
#   ./run-seo.sh audit <URL>
#   ./run-seo.sh doctor
#   ./run-seo.sh technical <URL>
#   ./run-seo.sh schema <URL>
# ==============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SEO_PY="$SCRIPT_DIR/seo-toolkit/seo.py"

if [ ! -f "$SEO_PY" ]; then
  echo "Error: seo.py not found at $SEO_PY"
  exit 1
fi

export PYTHONIOENCODING="utf-8"

if [ $# -eq 0 ]; then
  echo "Usage: ./run-seo.sh [doctor|audit|technical|page|schema|local] [URL]"
  echo "Example: ./run-seo.sh audit https://blabr.xyz"
  exit 1
fi

python3 "$SEO_PY" "$@"
