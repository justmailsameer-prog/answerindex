#!/usr/bin/env bash
# ==============================================================================
# run-aeo.sh — Universal Answer Engine Optimization (AEO) Runner
# Usage:
#   ./run-aeo.sh init --brand="BrandName" --domain="example.com"
#   ./run-aeo.sh run
#   ./run-aeo.sh report
# ==============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
AEO_BIN="$SCRIPT_DIR/node_modules/aeo-platform/bin/aeo-tracker.js"

if [ ! -f "$AEO_BIN" ]; then
  echo "Error: aeo-tracker not found at $AEO_BIN"
  echo "Run: npm install in $SCRIPT_DIR first"
  exit 1
fi

cd "$SCRIPT_DIR"
node --env-file=.env "$AEO_BIN" "$@"
