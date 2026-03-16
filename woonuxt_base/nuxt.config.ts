import { createResolver } from '@nuxt/kit';
import { defineNuxtConfig } from 'nuxt/config';

const { resolve } = createResolver(import.meta.url);

// Environment variables with fallbacks
const GQL_HOST = process.env.GQL_HOST || 'http://localhost:4000/graphql';
const APP_HOST = process.env.APP_HOST || 'http://localhost:3000';
// Derive GQL origin for resource hints
let GQL_ORIGIN = '';
try {
  const u = new URL(GQL_HOST);
  GQL_ORIGIN = `${u.protocol}//${u.host}`;
} catch { }

export default defineNuxtConfig({
  compatibilityDate: '2025-08-10',

  app: {
    head: {
      htmlAttrs: { lang: 'tr' },
      link: [
        { rel: 'icon', href: '/images/favicon.ico', type: 'image/x-icon' },
        { rel: 'icon', href: '/images/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
        // Resource hints
        ...(GQL_ORIGIN ? [{ rel: 'preconnect', href: GQL_ORIGIN }] : []),
        ...(GQL_ORIGIN ? [{ rel: 'dns-prefetch', href: GQL_ORIGIN }] : []),
      ],
      meta: [
        // Build version for cache busting debugging
        { name: 'build-version', content: process.env.BUILD_VERSION || Date.now().toString() },
        { name: 'build-timestamp', content: new Date().toISOString() },
        // Google Search Console Verification
        ...(process.env.GOOGLE_SITE_VERIFICATION
          ? [{ name: 'google-site-verification', content: process.env.GOOGLE_SITE_VERIFICATION }]
          : []),
        // Bing Webmaster Tools Verification
        ...(process.env.BING_SITE_VERIFICATION ? [{ name: 'msvalidate.01', content: process.env.BING_SITE_VERIFICATION }] : []),
      ],
    },
    pageTransition: { name: 'page', mode: 'default' },
  },

  plugins: [resolve('./app/plugins/init.ts')],

  components: [{ path: resolve('./app/components'), pathPrefix: false, extensions: ['.vue'] }],

  modules: [
    resolve('./modules/woonuxt-bridge.ts'),
    'nuxt-graphql-client',
    '@nuxtjs/tailwindcss',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxtjs/i18n',
    'nuxt-gtag',
    'shadcn-nuxt',
    '@nuxtjs/color-mode',
  ],



  image: {
    quality: 80,
    formats: ['webp', 'avif', 'jpg'],
    screens: { xs: 320, sm: 640, md: 768, lg: 1024, xl: 1280, xxl: 1536 },
    presets: {
      product: { modifiers: { format: 'webp', quality: 80, width: 800, height: 800, fit: 'contain' } },
      thumbnail: { modifiers: { format: 'webp', quality: 70, width: 300, height: 300, fit: 'cover' } },
    },
    // For static generation, use WPGraphQL's srcSet instead of IPX processing
    // IPX doesn't work for remote images in static builds
    ipx: {
      dir: resolve('./public'),
    },
  },

  runtimeConfig: {
    public: {
      'graphql-client': {
        clients: {
          default: {
            host: GQL_HOST,
            headers: { Origin: APP_HOST },
            fetchOptions: {
              mode: 'cors',
              credentials: 'include',
            },
          },
        },
      },
      wpUrl: GQL_ORIGIN, // WordPress backend URL (for REST API calls)
      SITE_NAME: process.env.NUXT_PUBLIC_SITE_NAME || 'WooNuxt',
      SITE_DESCRIPTION: process.env.NUXT_PUBLIC_SITE_DESCRIPTION || 'Modern, fast, and SEO friendly ecommerce store',
      CURRENCY_CODE: process.env.NUXT_PUBLIC_CURRENCY_CODE || 'TRY',
      FRONT_END_URL: process.env.NUXT_PUBLIC_FRONT_END_URL || 'http://localhost:3000',
      ORGANIZATION_LOGO: process.env.NUXT_PUBLIC_ORGANIZATION_LOGO || '/logo.svg',
      ORGANIZATION_CONTACT_EMAIL: process.env.NUXT_PUBLIC_ORGANIZATION_CONTACT_EMAIL || '',
      ORGANIZATION_PHONE: process.env.NUXT_PUBLIC_ORGANIZATION_PHONE || '',
      ORGANIZATION_ADDRESS: process.env.NUXT_PUBLIC_ORGANIZATION_ADDRESS || '',
      ORGANIZATION_SOCIAL_FACEBOOK: process.env.NUXT_PUBLIC_ORGANIZATION_SOCIAL_FACEBOOK || '',
      ORGANIZATION_SOCIAL_TWITTER: process.env.NUXT_PUBLIC_ORGANIZATION_SOCIAL_TWITTER || '',
      ORGANIZATION_SOCIAL_INSTAGRAM: process.env.NUXT_PUBLIC_ORGANIZATION_SOCIAL_INSTAGRAM || '',
      GOOGLE_MAPS_EMBED: process.env.NUXT_PUBLIC_GOOGLE_MAPS_EMBED || '',
      // Google Integration
      GOOGLE_ANALYTICS_ID: process.env.NUXT_PUBLIC_GOOGLE_ANALYTICS_ID || '',
      GTM_ID: process.env.NUXT_PUBLIC_GTM_ID || '',
      GOOGLE_SITE_VERIFICATION: process.env.GOOGLE_SITE_VERIFICATION || '',
      BING_SITE_VERIFICATION: process.env.BING_SITE_VERIFICATION || '',
      GOOGLE_MERCHANT_SHOP_NAME: process.env.NUXT_PUBLIC_GOOGLE_MERCHANT_SHOP_NAME || '',
      GOOGLE_MERCHANT_BRAND: process.env.NUXT_PUBLIC_GOOGLE_MERCHANT_BRAND || '',
      // Comma-separated list of taxonomy slugs to treat as brand (lowercase), e.g.: "product_brand,pa_brand,brand"
      BRAND_TAXONOMIES: process.env.NUXT_PUBLIC_BRAND_TAXONOMIES || 'product_brand,pa_brand,brand',
      ANALYTICS_DEBUG: process.env.NUXT_PUBLIC_ANALYTICS_DEBUG === 'true',
      WHATSAPP_PHONE: process.env.NUXT_PUBLIC_WHATSAPP_PHONE || '',
      // Shipping and Return Policy URLs for Product schema
      SHIPPING_DETAILS_URL: process.env.NUXT_PUBLIC_SHIPPING_DETAILS_URL || '/kargo-ve-teslimat',
      RETURN_POLICY_URL: process.env.NUXT_PUBLIC_RETURN_POLICY_URL || '/iade-ve-degisim',
      ORGANIZATION_RATING_VALUE: process.env.NUXT_PUBLIC_ORGANIZATION_RATING_VALUE || '',
      ORGANIZATION_REVIEW_COUNT: process.env.NUXT_PUBLIC_ORGANIZATION_REVIEW_COUNT || '',
    },
  },

  // Google Analytics 4 & Tag Manager Configuration

  alias: {
    '#constants': resolve('./app/constants'),
  },

  hooks: {
    'pages:extend'(pages: any[]) {
      const addPage = (name: string, path: string, file: string) => {
        pages.push({ name, path, file: resolve(`./app/pages/${file}`) });
      };

      // Products page pagination
      addPage('product-page-pager', '/urunler/sayfa/:pageNumber', 'urunler.vue');
      // Category pages
      addPage('product-category-page', '/urun-kategorisi/:categorySlug', 'urun-kategorisi/[slug].vue');
      addPage('product-category-page-pager', '/urun-kategorisi/:categorySlug/sayfa/:pageNumber', 'urun-kategorisi/[slug].vue');
      addPage('product-category-page-en', '/product-category/:categorySlug', 'urun-kategorisi/[slug].vue');
      addPage('product-category-page-pager-en', '/product-category/:categorySlug/page/:pageNumber', 'urun-kategorisi/[slug].vue');
      // Brand pages
      addPage('brand-page-pager', '/shop/brand/:slug/page/:pageNumber', 'shop/brand/[slug].vue');
      // Order pages
      addPage('order-received', '/odeme/siparis-alindi/:orderId', 'siparis-ozeti.vue');
      addPage('order-summary', '/siparis-ozeti/:orderId', 'siparis-ozeti.vue');
      // Checkout pages
      addPage('card-details', '/odeme/kart-bilgileri', 'odeme/kart-bilgileri.vue');
    },
  },

  nitro: {
    prerender: {
      crawlLinks: true,
      failOnError: false,
    },
    routeRules: {
      '/odeme/siparis-alindi/**': { prerender: false },
      '/siparis-ozeti/**': { prerender: false },
      // Cache control headers for different content types
      '/**': {
        headers: {
          'Cache-Control': 'public, max-age=0, must-revalidate',
          'X-Content-Type-Options': 'nosniff',
        }
      },
      '/_nuxt/**': {
        headers: {
          'Cache-Control': 'public, max-age=31536000, immutable',
        }
      },
      '/images/**': {
        headers: {
          'Cache-Control': 'public, max-age=31536000, immutable',
        }
      },
      '/icons/**': {
        headers: {
          'Cache-Control': 'public, max-age=31536000, immutable',
        }
      },
    },
  },

  // Multilingual support
  // @ts-ignore - i18n types not recognized
  i18n: {
    locales: [
      { code: 'en_US', file: 'en-US.json', name: 'English 🇺🇸' },
      { code: 'tr_TR', file: 'tr-TR.json', name: 'Türkçe 🇹🇷' },
      { code: 'de_DE', file: 'de-DE.json', name: 'Deutsch 🇩🇪' },
      { code: 'es_ES', file: 'es-ES.json', name: 'Español 🇪🇸' },
      { code: 'fr_FR', file: 'fr-FR.json', name: 'Français 🇫🇷' },
      { code: 'it_IT', file: 'it-IT.json', name: 'Italiano 🇮🇹' },
      { code: 'pt_BR', file: 'pt-BR.json', name: 'Português 🇧🇷' },
    ],
    langDir: 'locales',
    defaultLocale: 'tr_TR',
    strategy: 'no_prefix',
  },
});
