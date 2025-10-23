import { defineEventHandler, setHeader } from 'h3'

export default defineEventHandler((event) => {
  const isProd = process.env.NODE_ENV === 'production'
  const SITE_URL = isProd ? 'https://ntmc.com.tr' : 'http://localhost:3000'

  const common = [
    'User-agent: *',
  ]

  let rules: string[] = []
  if (isProd) {
    rules = [
      ...common,
      'Allow: /',
      'Disallow: /odeme/',
      'Disallow: /siparis-ozeti/',
      'Disallow: /hesabim/',
      'Disallow: /oauth/',
      '',
      `Sitemap: ${SITE_URL}/sitemap.xml`,
    ]
  } else {
    // Prevent indexing in development
    rules = [
      ...common,
      'Disallow: /',
      '',
      `Sitemap: ${SITE_URL}/sitemap.xml`,
    ]
  }

  const body = rules.join('\n')
  setHeader(event, 'Content-Type', 'text/plain; charset=UTF-8')
  return body
})
