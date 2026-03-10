#!/bin/bash

# 🌊 SeaShop E2E Test Runner
# This script runs the Playwright tests for the SeaShop e-commerce webshop

echo "🌊 SeaShop E2E Test Runner"
echo "=========================="
echo ""

# Check if dev server is running
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Dev server is running at http://localhost:3000"
else
    echo "⚠️  Dev server is NOT running!"
    echo ""
    echo "Please start the dev server first:"
    echo "  pnpm run dev"
    echo ""
    echo "Or run tests with auto-start (may be slower):"
    echo "  pnpm test"
    echo ""
    exit 1
fi

echo ""
echo "Running tests..."
echo ""

# Run the tests
pnpm exec playwright test "$@"

# Capture exit code
exit_code=$?

echo ""
if [ $exit_code -eq 0 ]; then
    echo "✅ All tests passed!"
else
    echo "❌ Some tests failed. Check the report at tests/report/index.html"
fi

exit $exit_code
