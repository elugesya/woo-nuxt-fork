import { createResolver } from '@nuxt/kit';
import { defineNuxtConfig } from 'nuxt/config';

const { resolve } = createResolver(import.meta.url);

// Environment variables with fallbacks
const GQL_HOST = process.env.GQL_HOST || 'http://localhost:4000/graphql';
const APP_HOST = process.env.APP_HOST || 'http://localhost:3000';

export default defineNuxtConfig({
  compatibilityDate: '2025-08-10',

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      link: [{ rel: 'icon', href: '/logo.svg', type: 'image/svg+xml' }],
    },
    pageTransition: { name: 'page', mode: 'default' },
  },

  plugins: [resolve('./app/plugins/init.ts')],

  components: [{ path: resolve('./app/components'), pathPrefix: false }],

  modules: [resolve('./modules/woonuxt-bridge.ts'), 'nuxt-graphql-client', '@nuxtjs/tailwindcss', '@nuxt/icon', '@nuxt/image', '@nuxtjs/i18n'],

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
    },
  },

  alias: {
    '#constants': resolve('./app/constants'),
    '#woo': '../.nuxt/gql/default',
  },

  hooks: {
    'pages:extend'(pages) {
      const addPage = (name: string, path: string, file: string) => {
        pages.push({ name, path, file: resolve(`./app/pages/${file}`) });
      };

      addPage('product-page-pager', '/urunler/sayfa/:pageNumber', 'urunler.vue');
      addPage('product-category-page', '/urun-kategorisi/:categorySlug', 'urun-kategorisi/[slug].vue');
      addPage('product-category-page-pager', '/urun-kategorisi/:categorySlug/sayfa/:pageNumber', 'urun-kategorisi/[slug].vue');
      addPage('order-received', '/odeme/siparis-alindi/:orderId', 'siparis-ozeti.vue');
      addPage('order-summary', '/siparis-ozeti/:orderId', 'siparis-ozeti.vue');
    },
  },

  nitro: {
    routeRules: {
      '/odeme/siparis-alindi/**': { prerender: false },
      '/siparis-ozeti/**': { prerender: false },
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
