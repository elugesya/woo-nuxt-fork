import { defineEventHandler, setHeader } from 'h3'

export default defineEventHandler((event) => {
  const config = useRuntimeConfig()
  let SITE_URL = (config.public as any).FRONT_END_URL as string | undefined
  if (!SITE_URL) {
    const headers = event.node.req.headers as Record<string, string | string[] | undefined>
    const proto = (headers['x-forwarded-proto'] as string) || 'http'
    const host = (headers['x-forwarded-host'] as string) || (headers['host'] as string) || 'localhost:3000'
    SITE_URL = `${proto}://${host}`
  }

  // Always allow indexing - no conditions
  const rules = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /odeme/',
    'Disallow: /siparis-ozeti/',
    'Disallow: /hesabim/',
    'Disallow: /oauth/',
    '',
    `Sitemap: ${SITE_URL}/sitemap.xml`,
  ]

  const body = rules.join('\n')
  setHeader(event, 'Content-Type', 'text/plain; charset=UTF-8')
  return body
})
