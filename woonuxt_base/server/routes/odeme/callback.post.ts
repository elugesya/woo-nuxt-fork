import { defineEventHandler, getQuery, readBody, sendRedirect } from 'h3'

// Handle Tosla/Bank POST callbacks to the frontend route and convert them to a GET redirect
export default defineEventHandler(async (event) => {
  const q = getQuery(event)
  let orderId = (q.order_id as string) || (q.orderId as string) || ''
  let orderKey = (q.key as string) || (q.orderKey as string) || ''

  // If missing in query, try to read from POST body (form-encoded or JSON)
  if (!orderId || !orderKey) {
    try {
      const body: any = await readBody(event)
      if (body && typeof body === 'object') {
        orderId = (orderId || body.order_id || body.orderId || body.OrderId || body.MerchantOrderId || '').toString()
        orderKey = (orderKey || body.key || body.orderKey || body.OrderKey || '').toString()
      }
    } catch {
      // ignore body parse errors; we'll still redirect without params
    }
  }

  const qs = orderId && orderKey
    ? `?order_id=${encodeURIComponent(orderId)}&key=${encodeURIComponent(orderKey)}`
    : ''

  // 303 See Other ensures browser switches to GET on the redirected URL
  return sendRedirect(event, `/odeme/callback${qs}`, 303)
})
