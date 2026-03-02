# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

WooNuxt is a static site generator for WooCommerce stores built on Nuxt 3. It provides a headless frontend for WordPress/WooCommerce using GraphQL, with multi-language support and SEO optimization.

**Key Technologies:** Nuxt 3, TypeScript, Vue 3 Composition API, Tailwind CSS, ShadCN UI, WPGraphQL

## Development Commands

```bash
# Install dependencies
pnpm install

# Development (with --host flag for network access)
pnpm run dev          # Start on localhost:3000
pnpm run dev:ssl      # Start with SSL (requires localhost.pem and localhost-key.pem)

# Production builds
pnpm run build        # Build for production (SSR)
pnpm run generate     # Generate static site + Google Merchant feed
pnpm run preview      # Preview production build
pnpm run serve        # Serve static files on port 8080

# Post-deployment
pnpm run postdeploy   # Purge Cloudflare cache
```

**Required:** Node.js v22.12.0, pnpm 10.18.3

## Architecture

### Nuxt Layers (Theme System)

This project uses Nuxt layers to enable theme customization:

- **`woonuxt_base/`** - Parent/base theme containing all core functionality
- **Root `/app`** - Child theme (customizations that override the base)

To override any component, composable, or page from the base theme, create a file with the same path in the root `/app` directory.

### Key Directories

- **`woonuxt_base/app/components`** - UI components (ShadCN UI + custom components)
- **`woonuxt_base/app/composables`** - Business logic composables
- **`woonuxt_base/app/pages`** - Page components
- **`woonuxt_base/app/queries`** - GraphQL queries (centralized)
- **`woonuxt_base/app/plugins`** - Nuxt plugins
- **`woonuxt_base/i18n`** - Internationalization files
- **`scripts/`** - Build scripts (Google Merchant feed, cache purging)

### Core Composables

The application uses Vue 3 Composition API with these key composables:

- **`useCheckout.ts`** - Checkout flow management
- **`useCart.ts`** - Shopping cart state and operations
- **`useAuth.ts`** - Authentication (login/register/logout)
- **`useSearch.ts`** - Product search functionality
- **`useFiltering.ts`** - Product filtering
- **`useWishlist.ts`** - Wishlist management
- **`useProductSeo.ts`** - Product SEO meta tags and structured data
- **`useSeoMeta.ts`** - General SEO meta tags
- **`useGoogleAnalytics.ts`** - GA4 tracking

### GraphQL Data Fetching

- Uses `nuxt-graphql-client` for type-safe GraphQL operations
- All queries are in `woonuxt_base/app/queries/`
- Use `useAsyncGql()` composable for queries
- GraphQL endpoint configured via `GQL_HOST` environment variable

### Static Site Generation

The root `nuxt.config.ts` handles build-time slug fetching and route generation:

- Fetches all product, category, and blog post slugs at build time
- Generates static pages for all routes
- Supports pagination for products and categories
- ISR (Incremental Static Regeneration) for dynamic content

**Turkish Route Structure:**
- `/urun/{slug}` - Product pages
- `/urunler` - Products listing
- `/urun-kategorisi/{slug}` - Category pages
- `/blog/{slug}` - Blog posts

### Environment Variables

```bash
# Required
GQL_HOST="https://wp.example.com/graphql"          # WPGraphQL endpoint
NUXT_IMAGE_DOMAINS="wp.example.com"                # For image optimization

# Optional (but recommended for production)
NUXT_PUBLIC_FRONT_END_URL="https://example.com"    # Production URL
NUXT_PUBLIC_GOOGLE_ANALYTICS_ID="G-XXXXXXXXXX"     # GA4 ID
NUXT_PUBLIC_GTM_ID="GTM-XXXXXXX"                   # GTM ID
NUXT_PUBLIC_CURRENCY_CODE="TRY"                    # Default currency

# Organization Schema
NUXT_PUBLIC_ORGANIZATION_LOGO="/logo.svg"
NUXT_PUBLIC_ORGANIZATION_CONTACT_EMAIL="info@example.com"
NUXT_PUBLIC_ORGANIZATION_PHONE="+90..."
NUXT_PUBLIC_WHATSAPP_PHONE="+90..."

# SEO Verification
GOOGLE_SITE_VERIFICATION="..."
BING_SITE_VERIFICATION="..."

# Google Merchant Feed
NUXT_PUBLIC_GOOGLE_MERCHANT_SHOP_NAME="Shop Name"
NUXT_PUBLIC_GOOGLE_MERCHANT_BRAND="Brand Name"
```

### SEO Features

- Dynamic meta tags via `useSeoMeta()`
- Structured data (Product, Organization schemas)
- Sitemap.xml and robots.txt generation
- Google Merchant feed generation (`scripts/generate-google-feed.js`)
- Multi-language SEO with `@nuxtjs/i18n`
- Yoast SEO integration via `useYoastHead()`

### Image Optimization

Uses `@nuxt/image` with IPX:
- Formats: WebP, AVIF, JPG
- Presets: `product` (800x800), `thumbnail` (300x300)
- Images served from `woonuxt_base/public/`

## Component Patterns

- Use `<script setup>` with TypeScript
- ShadCN UI components in `components/ui/`
- Components auto-imported (no explicit imports needed)
- Use `class-variance-authority` and `tailwind-merge` for conditional classes

## Payment Gateways

- Stripe
- PayPal Standard
- Cash on Delivery
- Custom gateway in `wc-alttantire-gateway/`

## Working with Routes

Dynamic routes are defined in `nuxt.config.ts` via `hooks.pages.extend`. This includes:
- Pagination routes for products and categories
- Order received/summary pages
- Brand pages

## Build Considerations

The `nitro.prerender` config controls static generation:
- `concurrency: 10` - Pages generated in parallel
- `interval: 1000` - Delay between batches (adjust for API limits)
- `failOnError: false` - Build continues if a page fails
