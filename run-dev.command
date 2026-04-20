#!/bin/bash
cd "$(dirname "$0")"
echo "🚀 Starting Fini dev server..."

# Try pnpm first
if command -v pnpm &> /dev/null; then
    pnpm web
else
    # Fallback to npm/npx
    cd apps/web && npx next dev
fi
