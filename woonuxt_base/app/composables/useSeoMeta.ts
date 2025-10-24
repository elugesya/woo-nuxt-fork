import { useHead } from '#imports'

type SeoInput = {
  title: string
  description: string
  image?: string
  type?: string
}

export const useSeoMeta = (data: SeoInput) => {
  const config = useRuntimeConfig()
  const route = useRoute()
  const siteUrl = config.public.FRONT_END_URL || 'http://localhost:3000'
  const canonicalUrl = `${siteUrl}${route.path}`

  useHead({
    title: `${data.title} | ${config.public.SITE_NAME || 'WooNuxt'}`,
    meta: [
      { name: 'description', content: data.description },
      { property: 'og:title', content: data.title },
      { property: 'og:description', content: data.description },
      { property: 'og:image', content: data.image || `${siteUrl}/og-default.jpg` },
      { property: 'og:url', content: canonicalUrl },
      { property: 'og:type', content: data.type || 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: data.title },
      { name: 'twitter:description', content: data.description },
      { name: 'twitter:image', content: data.image || `${siteUrl}/og-default.jpg` },
    ],
    link: [{ rel: 'canonical', href: canonicalUrl }],
  })
}
