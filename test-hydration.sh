#!/bin/bash

# Hydration Test Script
# This script helps test hydration fixes in development

echo "🧪 Testing Hydration Fixes"
echo "=========================="

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local file not found"
    echo "Creating .env.local with hydration suppression..."
    echo "NEXT_PUBLIC_SUPPRESS_HYDRATION_WARNING=true" > .env.local
    echo "NODE_ENV=development" >> .env.local
    echo "✅ Created .env.local"
else
    echo "✅ .env.local exists"
fi

# Check if hydration utilities exist
if [ -f "src/lib/hydration-utils.ts" ]; then
    echo "✅ Hydration utilities found"
else
    echo "❌ Hydration utilities not found"
fi

# Check if HydrationBoundary exists
if [ -f "src/components/HydrationBoundary.tsx" ]; then
    echo "✅ HydrationBoundary component found"
else
    echo "❌ HydrationBoundary component not found"
fi

# Check if ExtensionCleanup exists
if [ -f "src/components/ExtensionCleanup.tsx" ]; then
    echo "✅ ExtensionCleanup component found"
else
    echo "❌ ExtensionCleanup component not found"
fi

echo ""
echo "🚀 Starting development server with hydration fixes..."
echo "   - Extension attributes will be cleaned automatically"
echo "   - Hydration warnings from extensions will be suppressed"
echo "   - Debug information will be logged in browser console"
echo ""

# Start the development server
yarn dev