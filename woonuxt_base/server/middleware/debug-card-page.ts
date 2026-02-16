import { defineEventHandler, getQuery } from 'h3'

export default defineEventHandler((event) => {
  const url = event.path || event.node.req.url || ''
  if (url.startsWith('/odeme')) {
    try {
      const q = getQuery(event)
      // eslint-disable-next-line no-console
      console.log('[ROUTE]', url, JSON.stringify(q))
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('[ROUTE]', url)
    }
  }
})