#!/bin/bash

# Cloudflare Cache Purge Script
# This script runs after deployment to clear Cloudflare cache

set -e

echo "🔄 Starting Cloudflare cache purge..."

# Check if required environment variables are set
if [ -z "$CLOUDFLARE_ZONE_ID" ] || [ -z "$CLOUDFLARE_API_TOKEN" ]; then
    echo "⚠️  Warning: CLOUDFLARE_ZONE_ID or CLOUDFLARE_API_TOKEN not set"
    echo "ℹ️  Skipping cache purge. Set these variables in Coolify to enable automatic purging."
    exit 0
fi

# Check if purge is enabled
if [ "$CLOUDFLARE_PURGE_ON_DEPLOY" != "true" ]; then
    echo "ℹ️  Cache purge disabled (CLOUDFLARE_PURGE_ON_DEPLOY is not 'true')"
    exit 0
fi

# Purge entire cache
echo "🧹 Purging Cloudflare cache for zone: $CLOUDFLARE_ZONE_ID"

RESPONSE=$(curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/purge_cache" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything":true}')

# Check if purge was successful
SUCCESS=$(echo $RESPONSE | grep -o '"success":true' || true)

if [ -n "$SUCCESS" ]; then
    echo "✅ Cloudflare cache purged successfully!"
    echo "📊 Response: $RESPONSE"
else
    echo "❌ Failed to purge Cloudflare cache"
    echo "📊 Response: $RESPONSE"
    exit 1
fi

echo "🎉 Cache purge complete!"
