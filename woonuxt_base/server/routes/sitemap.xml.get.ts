import { defineEventHandler, setHeader } from 'h3'

// Helper to fetch GraphQL on the server
async function fetchGraphQL<T = any>(query: string, variables: Record<string, any> = {}) {
  const GQL_HOST = process.env.GQL_HOST || 'http://localhost:4000/graphql'
  const APP_HOST = process.env.APP_HOST || 'http://localhost:3000'

  const res = await $fetch<{ data?: T; errors?: any }>(GQL_HOST, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: APP_HOST,
    },
    body: { query, variables },
  })
  if ((res as any).errors) {
    // eslint-disable-next-line no-console
    console.error('Sitemap GraphQL errors:', (res as any).errors)
  }
  return (res as any).data as T
}

async function getAllProductSlugs(): Promise<Array<{ slug: string; modified?: string }>> {
  const query = /* GraphQL */ `
    query getAllProducts($first: Int = 100, $after: String) {
      products(first: $first, after: $after, where: { status: "publish", visibility: VISIBLE }) {
        pageInfo { hasNextPage endCursor }
        nodes { slug modifiedGmt }
      }
    }
  `
  const results: Array<{ slug: string; modified?: string }> = []
  let after: string | null = null
  let guard = 0
  while (guard++ < 20) {
    const data: { products: { pageInfo: { hasNextPage: boolean; endCursor: string | null }; nodes: Array<{ slug: string; modifiedGmt?: string }> } } =
      await fetchGraphQL(
        query,
        { after },
      )
    const nodes = data?.products?.nodes || []
    for (const n of nodes) results.push({ slug: n.slug, modified: n.modifiedGmt || undefined })
    if (data?.products?.pageInfo?.hasNextPage) after = data.products.pageInfo.endCursor
    else break
  }
  return results
}

async function getAllCategorySlugs(): Promise<Array<{ slug: string; modified?: string }>> {
  const query = /* GraphQL */ `
    query getAllProductCategories($first: Int = 100, $after: String) {
      productCategories(first: $first, after: $after, where: { hideEmpty: true }) {
        pageInfo { hasNextPage endCursor }
        nodes { slug }
      }
    }
  `
  const results: Array<{ slug: string; modified?: string }> = []
  let after: string | null = null
  let guard = 0
  while (guard++ < 20) {
    const data: { productCategories: { pageInfo: { hasNextPage: boolean; endCursor: string | null }; nodes: Array<{ slug: string }> } } =
      await fetchGraphQL(
        query,
        { after },
      )
    const nodes = data?.productCategories?.nodes || []
    for (const n of nodes) results.push({ slug: n.slug })
    if (data?.productCategories?.pageInfo?.hasNextPage) after = data.productCategories.pageInfo.endCursor
    else break
  }
  return results
}

export default defineEventHandler(async (event) => {
  // Prefer configured public FRONT_END_URL for absolute links
  const config = useRuntimeConfig()
  let SITE_URL = (config.public as any).FRONT_END_URL as string | undefined
  if (!SITE_URL) {
    // Fallback to request host if available (useful in non-prerendered contexts)
    const headers = event.node.req.headers as Record<string, string | string[] | undefined>
    const proto = (headers['x-forwarded-proto'] as string) || 'http'
    const host = (headers['x-forwarded-host'] as string) || (headers['host'] as string) || 'localhost:3000'
    SITE_URL = `${proto}://${host}`
  }

  // Build static routes
  const staticPaths = ['/', '/urunler', '/kategoriler', '/iletisim']

  // Fetch dynamic routes (products, categories)
  const [products, categories] = await Promise.all([getAllProductSlugs(), getAllCategorySlugs()])

  const urls: Array<{ loc: string; lastmod?: string; priority?: number; changefreq?: string }> = []

  for (const p of staticPaths) urls.push({ loc: `${SITE_URL}${p}`, priority: p === '/' ? 1.0 : 0.7 })
  for (const c of categories) urls.push({ loc: `${SITE_URL}/urun-kategorisi/${encodeURIComponent(c.slug)}`, priority: 0.7 })
  for (const pr of products) urls.push({ loc: `${SITE_URL}/urun/${encodeURIComponent(pr.slug)}`, lastmod: pr.modified || undefined, priority: 0.8 })

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map((u) => {
    return `  <url>\n    <loc>${u.loc}</loc>\n${u.lastmod ? `    <lastmod>${new Date(u.lastmod).toISOString()}</lastmod>\n` : ''}${
      u.changefreq ? `    <changefreq>${u.changefreq}</changefreq>\n` : ''
    }${u.priority ? `    <priority>${u.priority.toFixed(1)}</priority>\n` : ''}  </url>`
  })
  .join('\n')}
</urlset>`

  setHeader(event, 'Content-Type', 'application/xml; charset=UTF-8')
  return xml
})
