const GQL_HOST = process.env.GQL_HOST || 'http://localhost:4000/graphql';
const APP_HOST = process.env.APP_HOST || 'http://localhost:3000';

const PRODUCTS_Q = `
  query AllProductSlugs($first: Int = 100, $after: String) {
    products(first: $first, after: $after, where: { status: \"publish\", visibility: VISIBLE }) {
      pageInfo { hasNextPage endCursor }
      nodes { slug }
    }
  }
`;
const CATEGORIES_Q = `
  query AllCategorySlugs($first: Int = 100, $after: String) {
    productCategories(first: $first, after: $after, where: { hideEmpty: false }) {
      pageInfo { hasNextPage endCursor }
      nodes { slug }
    }
  }
`;
const BLOG_POSTS_Q = `
  query AllBlogPostSlugs($first: Int = 100, $after: String) {
    posts(first: $first, after: $after, where: { status: PUBLISH }) {
      pageInfo { hasNextPage endCursor }
      nodes { slug }
    }
  }
`;
const BLOG_CATEGORIES_Q = `
  query AllBlogCategorySlugs($first: Int = 100, $after: String) {
    categories(first: $first, after: $after) {
      pageInfo { hasNextPage endCursor }
      nodes { slug }
    }
  }
`;

async function fetchAllProductSlugs() {
  const slugs: string[] = [];
  let after: string | null = null;
  for (let i = 0; i < 50; i++) {
    const res: any = await fetch(GQL_HOST, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json', Origin: APP_HOST },
      body: JSON.stringify({ query: PRODUCTS_Q, variables: { first: 100, after } }),
    }).then((r) => r.json()).catch(() => null);
    if (!res || res.errors) break;
    const root = res?.data?.products;
    const nodes = root?.nodes || [];
    slugs.push(...nodes.map((n: any) => n?.slug).filter(Boolean));
    if (!root?.pageInfo?.hasNextPage || !root?.pageInfo?.endCursor) break;
    after = root.pageInfo.endCursor;
  }
  return Array.from(new Set(slugs));
}

async function fetchAllCategorySlugs() {
  const slugs: string[] = [];
  let after: string | null = null;
  for (let i = 0; i < 50; i++) {
    const res: any = await fetch(GQL_HOST, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json', Origin: APP_HOST },
      body: JSON.stringify({ query: CATEGORIES_Q, variables: { first: 100, after } }),
    }).then((r) => r.json()).catch(() => null);
    if (!res || res.errors) break;
    const root = res?.data?.productCategories;
    const nodes = root?.nodes || [];
    slugs.push(...nodes.map((n: any) => n?.slug).filter(Boolean));
    if (!root?.pageInfo?.hasNextPage || !root?.pageInfo?.endCursor) break;
    after = root.pageInfo.endCursor;
  }
  return Array.from(new Set(slugs));
}

async function fetchAllBlogPostSlugs() {
  const slugs: string[] = [];
  let after: string | null = null;
  for (let i = 0; i < 50; i++) {
    const res: any = await fetch(GQL_HOST, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json', Origin: APP_HOST },
      body: JSON.stringify({ query: BLOG_POSTS_Q, variables: { first: 100, after } }),
    }).then((r) => r.json()).catch(() => null);
    if (!res || res.errors) break;
    const root = res?.data?.posts;
    const nodes = root?.nodes || [];
    slugs.push(...nodes.map((n: any) => n?.slug).filter(Boolean));
    if (!root?.pageInfo?.hasNextPage || !root?.pageInfo?.endCursor) break;
    after = root.pageInfo.endCursor;
  }
  return Array.from(new Set(slugs));
}

async function fetchAllBlogCategorySlugs() {
  const slugs: string[] = [];
  let after: string | null = null;
  for (let i = 0; i < 50; i++) {
    const res: any = await fetch(GQL_HOST, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json', Origin: APP_HOST },
      body: JSON.stringify({ query: BLOG_CATEGORIES_Q, variables: { first: 100, after } }),
    }).then((r) => r.json()).catch(() => null);
    if (!res || res.errors) break;
    const root = res?.data?.categories;
    const nodes = root?.nodes || [];
    slugs.push(...nodes.map((n: any) => n?.slug).filter(Boolean));
    if (!root?.pageInfo?.hasNextPage || !root?.pageInfo?.endCursor) break;
    after = root.pageInfo.endCursor;
  }
  return Array.from(new Set(slugs));
}

// Build-time guard: warn if FRONT_END_URL is not properly set in production
if (process.env.NODE_ENV === 'production') {
  const FE = process.env.NUXT_PUBLIC_FRONT_END_URL || '';
  if (!FE || /localhost|127\.0\.0\.1/i.test(FE)) {
    // eslint-disable-next-line no-console
    console.warn('[WARN] NUXT_PUBLIC_FRONT_END_URL is not set to a public domain in production. Current:', FE);
  }
}

const productSlugs = await fetchAllProductSlugs().catch(() => [] as string[]);
const categorySlugs = await fetchAllCategorySlugs().catch(() => [] as string[]);
const blogPostSlugs = await fetchAllBlogPostSlugs().catch(() => [] as string[]);
const blogCategorySlugs = await fetchAllBlogCategorySlugs().catch(() => [] as string[]);

const dynamicRoutes = [
  '/',
  '/urunler',
  ...productSlugs.map((s) => `/urun/${decodeURIComponent(s)}`),
  ...categorySlugs.map((s) => `/urun-kategorisi/${decodeURIComponent(s)}`),
  '/blog',
  ...blogPostSlugs.map((s) => `/blog/${decodeURIComponent(s)}`),
  ...blogCategorySlugs.map((s) => `/blog/kategori/${decodeURIComponent(s)}`),
  '/sitemap.xml',
  '/robots.txt',
];

export default defineNuxtConfig({

  // Get all the pages, components, composables and plugins from the parent theme
  extends: ['./woonuxt_base'],

  components: [{ path: './components', pathPrefix: false }],

  modules: [
    'nuxt-gtag',
  ],

  // Google Analytics 4 & Tag Manager Configuration
  gtag: {
    id: process.env.NUXT_PUBLIC_GOOGLE_ANALYTICS_ID || '',
    enabled: !!process.env.NUXT_PUBLIC_GOOGLE_ANALYTICS_ID,
    config: {
      send_page_view: true,
      cookie_flags: 'SameSite=None;Secure',
    },
    tags: process.env.NUXT_PUBLIC_GTM_ID ? [process.env.NUXT_PUBLIC_GTM_ID] : [],
  },

  app: {
    baseURL: '/',
    buildAssetsDir: '/_nuxt/',
  },

  /**
   * Depending on your servers capabilities, you may need to adjust the following settings.
   * It will affect the build time but also increase the reliability of the build process.
   * If you have a server with a lot of memory and CPU, you can remove the following settings.
   * @property {number} concurrency - How many pages to prerender at once
   * @property {number} interval - How long to wait between prerendering pages
   * @property {boolean} failOnError - This stops the build from failing but the page will not be statically generated
   */
  nitro: {
    routeRules: {
      '/sitemap.xml': { prerender: true },
      '/robots.txt': { prerender: true },
      '/google-feed.xml': { isr: 3600 }, // Cache for 1 hour, regenerate on demand
    },
    prerender: {
      routes: [
        ...dynamicRoutes,
        // google-feed.xml is generated dynamically (not prerendered due to API rate limits)
      ],
      concurrency: 10,
      interval: 1000,
      failOnError: false,
    },
    minify: true
  },
});
