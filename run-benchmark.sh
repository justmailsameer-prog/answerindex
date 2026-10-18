#!/usr/bin/env bash
# ==============================================================================
# run-benchmark.sh — Multi-Model AI Citation & Entity Perception Benchmark
# Usage:
#   ./run-benchmark.sh
# ==============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BENCHMARK_JS="$SCRIPT_DIR/test-aeo-models.mjs"

if [ ! -f "$BENCHMARK_JS" ]; then
  echo "Error: test-aeo-models.mjs not found at $BENCHMARK_JS"
  exit 1
fi

cd "$SCRIPT_DIR"
node --env-file=.env "$BENCHMARK_JS" "$@"

