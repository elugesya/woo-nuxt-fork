# Deployment guide: Static generation + scheduled deploys on Coolify

This guide explains how to deploy this project as a fully static site (SSG) and keep it fresh by automatically rebuilding twice per day using GitHub Actions and a Coolify Deploy Hook.

The repository already includes all necessary wiring:
- Build-time slug discovery in `nuxt.config.ts` to prerender all product and category pages
- A scheduled GitHub Actions workflow at `.github/workflows/scheduled-build.yml`

> Summary: At build time, we query WooGraphQL for all product and category slugs, add them to Nitro's `prerender.routes`, and generate static HTML under `.output/public`. A scheduled workflow calls your Coolify Deploy Hook twice per day to rebuild and redeploy.

---

## 1) Prerequisites

- WordPress + WooCommerce + WPGraphQL + WooGraphQL up and running
- The GraphQL endpoint reachable from your build server
- A Coolify instance (self-hosted) with access to your GitHub repository
- This repo hosted on GitHub (for GitHub Actions)

---

## 2) Environment variables (.env)

Set these at least on your Coolify service (and optionally locally for dev):

Required
- `GQL_HOST` e.g. `https://ntmc.com.tr/graphql` (must end with `/graphql`)
- `NUXT_IMAGE_DOMAINS` e.g. `ntmc.com.tr` (hostnames only)

Recommended (SEO / structured data)
- `NUXT_PUBLIC_FRONT_END_URL` e.g. `https://ntmc.com.tr`
- `NUXT_PUBLIC_SITE_NAME`, `NUXT_PUBLIC_SITE_DESCRIPTION`
- `NUXT_PUBLIC_ORGANIZATION_LOGO`
- `NUXT_PUBLIC_ORGANIZATION_CONTACT_EMAIL`, `NUXT_PUBLIC_ORGANIZATION_PHONE`, `NUXT_PUBLIC_ORGANIZATION_ADDRESS`
- `NUXT_PUBLIC_ORGANIZATION_SOCIAL_FACEBOOK|TWITTER|INSTAGRAM`
- `NUXT_PUBLIC_GOOGLE_MAPS_EMBED` (optional contact page map)
- `NUXT_PUBLIC_CURRENCY_CODE` (defaults to TRY)

The repo contains `.env.example` listing these variables.

---

## 3) Static generation (already configured)

During build, `nuxt.config.ts` fetches all product and category slugs and populates Nitro `prerender.routes`:
- `/`, `/urunler`
- `/urun/<slug>`
- `/urun-kategorisi/<slug>`
- `/sitemap.xml`, `/robots.txt`

SSR-only pages (e.g., checkout) remain server-rendered in the base layer. For this project, the above routes are fully static and deployed to a CDN.

---

## 4) Coolify service configuration

Set up an app in Coolify pointing to this GitHub repo.

- Runtime: Node 20+ (or latest LTS)
- Build command:
  - `npm ci && npm run generate`
- Publish directory / Output:
  - `.output/public`
- Service type:
  - Prefer "Static Site" if available (serve `.output/public` directly)
  - Or use a Node service that runs: `npx serve .output/public -l 3000`
- Port:
  - `3000` (if serving via Node)

> On each deploy, Coolify will run the build, create `.output/public`, and publish static assets.

---

## 5) Create a Coolify Deploy Hook

In your Coolify app:
1. Open the application settings
2. Create a "Deploy Hook" (a unique URL to trigger a new deploy)
3. Copy this URL

In your GitHub repository:
1. Open Settings → Secrets and variables → Actions → New repository secret
2. Name: `COOLIFY_DEPLOY_HOOK`
3. Value: paste the Deploy Hook URL

---

## 6) Scheduled builds (GitHub Actions)

The workflow file `.github/workflows/scheduled-build.yml` is already added. It will:
- Run on a schedule (cron): `0 0,12 * * *` (every day 00:00 and 12:00 UTC)
- Trigger your `COOLIFY_DEPLOY_HOOK`

To adjust schedule (examples):
- Every day at 03:00 and 15:00 Türkiye time (UTC+3) → `0 0,12 * * *` (already matches 03:00, 15:00 TR)
- Every 6 hours → `0 */6 * * *`

Manual deploy:
- Open GitHub → Actions → Scheduled Build (Deploy Hook) → Run workflow

Fallback:
- The workflow supports a `NETLIFY_BUILD_HOOK` secret as a fallback if you migrate in the future.

---

## 7) Validation checklist

- First deploy
  - Visit `/`, `/urunler`, a few product and category URLs
  - Check View Source for meta and structured data (JSON-LD)
- Images
  - Ensure `NUXT_IMAGE_DOMAINS` contains your WordPress host
- Sitemap/robots
  - `https://<site>/sitemap.xml` and `/robots.txt` should load
- Performance
  - Pages should be served as static files from Coolify (or the Node process serving static)

---

## 8) Troubleshooting

- GraphQL validation errors during build
  - Ensure `GQL_HOST` is reachable from the build runner (no firewall/VPN restrictions)
- Missing slugs / empty pages
  - Confirm products/categories are published and visible in WooCommerce
- Images return 500 during dev
  - Ensure `sharp/libvips` available on the build host; verify `@nuxt/image` config and domains
- Wrong canonical/URLs
  - Set `NUXT_PUBLIC_FRONT_END_URL` for production

---

## 9) Optional enhancements

- On-demand deploys for urgent product updates
  - Trigger the Coolify Deploy Hook manually after a critical change
- WooCommerce webhooks → GitHub Actions (advanced)
  - On product update, call the GitHub workflow_dispatch API to trigger a deploy
- Pagination prerender (if list grows)
  - Add `/urunler/sayfa/2`, `/urun-kategorisi/<slug>/sayfa/2` etc. to the prerender list

---

## 10) Commands (local)

- Dev: `npm run dev`
- Static build: `npm run generate`
- Preview: `npm run preview`

> Production deploys on Coolify will run `npm ci && npm run generate` and publish `.output/public`.
