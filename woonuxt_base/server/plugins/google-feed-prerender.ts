/**
 * Prerender Google Merchant Feed after build
 * This hook generates the google-feed.xml file during static build
 */

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:response', async (response, { event }) => {
    // Only run during build/generate, not in dev
    if (process.env.NUXT_ENV === 'development') return

    const url = event.node.req.url || event.path
    if (url === '/google-feed.xml') {
      // Ensure XML content type is set
      response.headers['content-type'] = 'application/xml; charset=utf-8'
    }
  })
})
