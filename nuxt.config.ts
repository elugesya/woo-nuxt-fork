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

const dynamicRoutes = [
  '/',
  '/urunler',
  ...productSlugs.map((s) => `/urun/${decodeURIComponent(s)}`),
  ...categorySlugs.map((s) => `/urun-kategorisi/${decodeURIComponent(s)}`),
  '/sitemap.xml',
  '/robots.txt',
];

export default defineNuxtConfig({

  // Get all the pages, components, composables and plugins from the parent theme
  extends: ['./woonuxt_base'],

  components: [{ path: './components', pathPrefix: false }],

  image: {
    provider: 'cloudinary',
    cloudinary: {
      cloudName: process.env.CLOUDINARY_API_KEY,
      apiKey: process.env.CLOUDINARY_API_KEY,
      apiSecret: process.env.CLOUDINARY_API_SECRET
    }
  },
  nitro: {
    routeRules: {
      '/sitemap.xml': { prerender: true },
      '/robots.txt': { prerender: true },
    },
    prerender: {
      routes: dynamicRoutes,
      concurrency: 10,
      interval: 1000,
      failOnError: false,
    },
    minify: true
  },

  modules: ['@nuxt/image-edge']
});
