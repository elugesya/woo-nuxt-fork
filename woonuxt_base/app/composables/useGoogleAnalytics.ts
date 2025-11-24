/**
 * Google Analytics 4 E-commerce Event Tracking
 * 
 * This composable provides methods to track e-commerce events
 * according to Google Analytics 4 measurement protocol.
 * 
 * @see https://developers.google.com/analytics/devguides/collection/ga4/ecommerce
 */

interface GAItem {
  item_id: string
  item_name: string
  price: number
  quantity: number
  item_brand?: string
  item_category?: string
  item_category2?: string
  item_category3?: string
  item_variant?: string
}

interface GAProduct {
  databaseId?: number
  sku?: string
  name?: string
  price?: string | number
  salePrice?: string | number
  regularPrice?: string | number
  type?: string
  productCategories?: {
    nodes?: Array<{ name?: string }>
  }
  terms?: {
    nodes?: Array<{ name?: string; taxonomyName?: string }>
  }
  attributes?: {
    nodes?: Array<{
      name?: string
      options?: string[]
    }>
  }
}

export const useGoogleAnalytics = () => {
  const config = useRuntimeConfig()
  const isEnabled = config.public.GOOGLE_ANALYTICS_ID && typeof window !== 'undefined'

  /**
   * Convert product to GA4 item format
   */
  const formatItem = (product: GAProduct, quantity = 1): GAItem => {
    const price = parseFloat(String(product.salePrice || product.price || product.regularPrice || 0))
    const categories = product.productCategories?.nodes || product.terms?.nodes?.filter((t) => t.taxonomyName === 'PRODUCTCATEGORY') || []

    // Derive brand from product-specific data, fallback to configured merchant brand
    const brandTaxonomies = String(config.public.BRAND_TAXONOMIES || '')
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean)

    // @ts-ignore - tolerate unknown brands shape if present on product
    const brandsNodes: Array<{ name?: string }> = (product as any)?.brands?.nodes || []
    const brandFromBrands = brandsNodes?.[0]?.name || ''
    const termsNodes: Array<{ name?: string; taxonomyName?: string }> = product.terms?.nodes || []
    const brandFromTerms = (termsNodes.find((t) => brandTaxonomies.includes(String(t?.taxonomyName || '').toLowerCase())) || {})?.name || ''
    const derivedBrand = brandFromTerms || brandFromBrands || config.public.GOOGLE_MERCHANT_BRAND || undefined

    return {
      item_id: product.sku || String(product.databaseId),
      item_name: product.name || 'Unknown Product',
      price,
      quantity,
      item_brand: derivedBrand,
      item_category: categories[0]?.name || 'Uncategorized',
      item_category2: categories[1]?.name,
      item_category3: categories[2]?.name,
      item_variant: product.attributes?.nodes?.[0]?.options?.[0],
    }
  }

  /**
   * Track when user views a list of products
   */
  const trackViewItemList = (products: GAProduct[], listName = 'Product List') => {
    if (!isEnabled) return

    const items = products.map((product, index) => ({
      ...formatItem(product),
      index,
    }))

    window.gtag?.('event', 'view_item_list', {
      item_list_name: listName,
      items,
    })
  }

  /**
   * Track when user views a product detail
   */
  const trackViewItem = (product: GAProduct) => {
    if (!isEnabled) return

    const item = formatItem(product)

    window.gtag?.('event', 'view_item', {
      currency: config.public.CURRENCY_CODE || 'TRY',
      value: item.price,
      items: [item],
    })
  }

  /**
   * Track when user adds product to cart
   */
  const trackAddToCart = (product: GAProduct, quantity = 1) => {
    if (!isEnabled) return

    const item = formatItem(product, quantity)

    window.gtag?.('event', 'add_to_cart', {
      currency: config.public.CURRENCY_CODE || 'TRY',
      value: item.price * quantity,
      items: [item],
    })
  }

  /**
   * Track when user removes product from cart
   */
  const trackRemoveFromCart = (product: GAProduct, quantity = 1) => {
    if (!isEnabled) return

    const item = formatItem(product, quantity)

    window.gtag?.('event', 'remove_from_cart', {
      currency: config.public.CURRENCY_CODE || 'TRY',
      value: item.price * quantity,
      items: [item],
    })
  }

  /**
   * Track when user views cart
   */
  const trackViewCart = (cart: { contents?: { nodes?: any[] }; total?: string }) => {
    if (!isEnabled) return

    const items = (cart.contents?.nodes || []).map((item: any) => formatItem(item.product?.node || item.product, item.quantity))

    window.gtag?.('event', 'view_cart', {
      currency: config.public.CURRENCY_CODE || 'TRY',
      value: parseFloat(cart.total || '0'),
      items,
    })
  }

  /**
   * Track when user begins checkout
   */
  const trackBeginCheckout = (cart: { contents?: { nodes?: any[] }; total?: string }) => {
    if (!isEnabled) return

    const items = (cart.contents?.nodes || []).map((item: any) => formatItem(item.product?.node || item.product, item.quantity))

    window.gtag?.('event', 'begin_checkout', {
      currency: config.public.CURRENCY_CODE || 'TRY',
      value: parseFloat(cart.total || '0'),
      items,
    })
  }

  /**
   * Track when user adds shipping info
   */
  const trackAddShippingInfo = (cart: { contents?: { nodes?: any[] }; total?: string; chosenShippingMethods?: string[] }) => {
    if (!isEnabled) return

    const items = (cart.contents?.nodes || []).map((item: any) => formatItem(item.product?.node || item.product, item.quantity))

    window.gtag?.('event', 'add_shipping_info', {
      currency: config.public.CURRENCY_CODE || 'TRY',
      value: parseFloat(cart.total || '0'),
      shipping_tier: cart.chosenShippingMethods?.[0] || 'standard',
      items,
    })
  }

  /**
   * Track when user adds payment info
   */
  const trackAddPaymentInfo = (cart: { contents?: { nodes?: any[] }; total?: string }, paymentType: string) => {
    if (!isEnabled) return

    const items = (cart.contents?.nodes || []).map((item: any) => formatItem(item.product?.node || item.product, item.quantity))

    window.gtag?.('event', 'add_payment_info', {
      currency: config.public.CURRENCY_CODE || 'TRY',
      value: parseFloat(cart.total || '0'),
      payment_type: paymentType,
      items,
    })
  }

  /**
   * Track successful purchase
   */
  const trackPurchase = (order: {
    databaseId?: number
    orderNumber?: string
    total?: string
    rawTotal?: string
    totalTax?: string
    shippingTotal?: string
    lineItems?: { nodes?: any[] }
    paymentMethodTitle?: string
  }) => {
    if (!isEnabled) return

    const items = (order.lineItems?.nodes || []).map((item: any) => formatItem(item.product?.node || item.product, item.quantity))

    window.gtag?.('event', 'purchase', {
      transaction_id: order.orderNumber || String(order.databaseId),
      value: order.rawTotal ? parseFloat(order.rawTotal) : parseFloat(order.total || '0'),
      tax: parseFloat(order.totalTax || '0'),
      shipping: parseFloat(order.shippingTotal || '0'),
      currency: config.public.CURRENCY_CODE || 'TRY',
      items,
      payment_type: order.paymentMethodTitle,
    })
  }

  /**
   * Track search events
   */
  const trackSearch = (searchTerm: string) => {
    if (!isEnabled) return

    window.gtag?.('event', 'search', {
      search_term: searchTerm,
    })
  }

  /**
   * Track when user selects a product from list
   */
  const trackSelectItem = (product: GAProduct, listName = 'Product List', index = 0) => {
    if (!isEnabled) return

    const item = formatItem(product)

    window.gtag?.('event', 'select_item', {
      item_list_name: listName,
      items: [{ ...item, index }],
    })
  }

  return {
    trackViewItemList,
    trackViewItem,
    trackAddToCart,
    trackRemoveFromCart,
    trackViewCart,
    trackBeginCheckout,
    trackAddShippingInfo,
    trackAddPaymentInfo,
    trackPurchase,
    trackSearch,
    trackSelectItem,
    formatItem,
  }
}

// Type declaration for gtag
declare global {
  interface Window {
    gtag?: (command: string, eventName: string, params?: Record<string, any>) => void
    dataLayer?: any[]
  }
}
