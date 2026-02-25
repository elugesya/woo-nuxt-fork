/**
 * Google Merchant Center Product Feed
 * 
 * This endpoint generates an XML feed for Google Shopping
 * according to Google Merchant Center specifications.
 * 
 * @see https://support.google.com/merchants/answer/7052112
 */

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const siteUrl = config.public.FRONT_END_URL || 'http://localhost:3000'
  const shopName = config.public.GOOGLE_MERCHANT_SHOP_NAME || 'WooNuxt Shop'
  const defaultBrand = config.public.GOOGLE_MERCHANT_BRAND || 'WooNuxt'
  const currencyCode = config.public.CURRENCY_CODE || 'TRY'

  try {
    // Fetch all products using GraphQL
    const products = await fetchAllProducts()

    if (!products || products.length === 0) {
      throw createError({
        statusCode: 500,
        statusMessage: 'No products found',
      })
    }

    // Generate XML feed
    const xml = generateProductFeedXML(products, {
      siteUrl,
      shopName,
      defaultBrand,
      currencyCode,
    })

    // Set response headers
    setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
    setHeader(event, 'Cache-Control', 'public, max-age=3600') // Cache for 1 hour

    return xml
  } catch (error: any) {
    console.error('Error generating product feed:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to generate product feed',
    })
  }
})

/**
 * Fetch all products from GraphQL with pagination
 */
async function fetchAllProducts() {
  const config = useRuntimeConfig()
  const GQL_HOST = (config as any).GQL_HOST || process.env.GQL_HOST || 'https://backend.ntmc.com.tr/graphql'
  
  const allProducts: any[] = []
  let hasNextPage = true
  let afterCursor: string | null = null

  const query = `
    query getAllProductsForFeed($first: Int = 100, $after: String) {
      products(first: $first, after: $after, where: { status: "publish" }) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          databaseId
          name
          slug
          type
          description
          shortDescription
          sku
          gtIN
          globalUniqueId
          image {
            sourceUrl
            altText
          }
          galleryImages {
            nodes {
              sourceUrl
              altText
            }
          }
          ... on SimpleProduct {
            price
            regularPrice
            salePrice
            stockStatus
            stockQuantity
          }
          ... on VariableProduct {
            price
            regularPrice
            salePrice
            stockStatus
          }
          productCategories {
            nodes {
              name
              slug
              databaseId
            }
          }
          productTags {
            nodes {
              name
            }
          }
          ... on SimpleProduct {
            weight
            length
            width
            height
            dimensions {
              length
              width
              height
            }
          }
        }
      }
    }
  `

  while (hasNextPage) {
    try {
      const response = await $fetch(GQL_HOST, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables: {
            first: 100,
            after: afterCursor,
          },
        }),
      })

      const result: any = response
      const products = result?.data?.products

      if (products?.nodes) {
        allProducts.push(...products.nodes)
      }

      hasNextPage = products?.pageInfo?.hasNextPage || false
      afterCursor = products?.pageInfo?.endCursor || null
    } catch (error) {
      console.error('Error fetching products:', error)
      break
    }
  }

  return allProducts
}

/**
 * Generate XML feed from products
 */
function generateProductFeedXML(
  products: any[],
  options: {
    siteUrl: string
    shopName: string
    defaultBrand: string
    currencyCode: string
  }
) {
  const { siteUrl, shopName, defaultBrand, currencyCode } = options

  const items = products
    .map((product) => {
      // Skip products without essential data
      if (!product.name || !product.slug) return ''

      const productUrl = `${siteUrl}/urun/${product.slug}`
      const imageUrl = product.image?.sourceUrl || ''
      const title = escapeXml(product.name.substring(0, 150)) // Max 150 chars
      const description = escapeXml(stripHtml(product.shortDescription || product.description || '').substring(0, 5000))
      
      // Price handling
      const price = parseFloat(product.price?.replace(/[^0-9.-]/g, '') || product.regularPrice?.replace(/[^0-9.-]/g, '') || '0')
      const salePrice = product.salePrice ? parseFloat(product.salePrice.replace(/[^0-9.-]/g, '') || '0') : null
      
      // Stock status
      const availability = getAvailability(product.stockStatus)
      
      // Category
      const category = product.productCategories?.nodes?.[0]
      const categoryName = category?.name || 'Genel'
      const googleCategory = getGoogleCategory(categoryName)
      
      // Brand
      const brand = escapeXml(defaultBrand)
      
      // Additional images
      const additionalImages = (product.galleryImages?.nodes || [])
        .slice(0, 10) // Max 10 additional images
        .map((img: any) => `      <g:additional_image_link>${escapeXml(img.sourceUrl)}</g:additional_image_link>`)
        .join('\n')

      // Condition (always new for e-commerce)
      const condition = 'new'

      // Product weight for shipping
      const weight = product.weight ? parseFloat(product.weight.replace(/[^0-9.]/g, '') || '0') : null

      // Product dimensions
      const dimensions = product.dimensions || {}
      const length = dimensions.length ? parseFloat(String(dimensions.length).replace(/[^0-9.]/g, '')) : null
      const width = dimensions.width ? parseFloat(String(dimensions.width).replace(/[^0-9.]/g, '')) : null
      const height = dimensions.height ? parseFloat(String(dimensions.height).replace(/[^0-9.]/g, '')) : null

      // Build additional Google Merchant fields
      let additionalFields = ''

      // identifier_exists: set to 'no' if product has no GTIN (required for custom products)
      if (!product.gtIN && !product.globalUniqueId) {
        additionalFields += '      <g:identifier_exists>no</g:identifier_exists>\n'
      }

      // adult: always no for regular products
      additionalFields += '      <g:adult>no</g:adult>\n'

      // shipping_weight
      if (weight && weight > 0) {
        additionalFields += `      <g:shipping_weight>${weight.toFixed(2)} kg</g:shipping_weight>\n`
      }

      // product dimensions
      if (length && length > 0) {
        additionalFields += `      <g:product_length>${length.toFixed(0)} cm</g:product_length>\n`
      }
      if (width && width > 0) {
        additionalFields += `      <g:product_width>${width.toFixed(0)} cm</g:product_width>\n`
      }
      if (height && height > 0) {
        additionalFields += `      <g:product_height>${height.toFixed(0)} cm</g:product_height>\n`
      }

      // Generate item XML
      return `    <item>
      <g:id>${product.databaseId || product.sku}</g:id>
      <g:title>${title}</g:title>
      <g:description>${description}</g:description>
      <g:link>${escapeXml(productUrl)}</g:link>
      ${imageUrl ? `<g:image_link>${escapeXml(imageUrl)}</g:image_link>` : ''}
${additionalImages}
      <g:condition>${condition}</g:condition>
      <g:availability>${availability}</g:availability>
      <g:price>${price.toFixed(2)} ${currencyCode}</g:price>
      ${salePrice && salePrice < price ? `<g:sale_price>${salePrice.toFixed(2)} ${currencyCode}</g:sale_price>` : ''}
      <g:brand>${brand}</g:brand>
      ${product.gtIN ? `<g:gtin>${escapeXml(product.gtIN)}</g:gtin>` : ''}
      ${product.globalUniqueId ? `<g:gtin>${escapeXml(product.globalUniqueId)}</g:gtin>` : ''}
      ${product.sku ? `<g:mpn>${escapeXml(product.sku)}</g:mpn>` : ''}
      <g:product_type>${escapeXml(categoryName)}</g:product_type>
      <g:google_product_category>${googleCategory}</g:google_product_category>
${additionalFields}
      <g:shipping>
        <g:country>TR</g:country>
        <g:service>Standart</g:service>
        <g:price>0 ${currencyCode}</g:price>
      </g:shipping>
    </item>`
    })
    .filter(Boolean)
    .join('\n')

  // Generate complete XML
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>${escapeXml(shopName)}</title>
    <link>${escapeXml(siteUrl)}</link>
    <description>${escapeXml(shopName)} - Ürün Kataloğu</description>
${items}
  </channel>
</rss>`
}

/**
 * Get Google availability status
 */
function getAvailability(stockStatus: string): string {
  switch (stockStatus) {
    case 'IN_STOCK':
      return 'in_stock'
    case 'OUT_OF_STOCK':
      return 'out_of_stock'
    case 'ON_BACKORDER':
      return 'backorder'
    default:
      return 'out_of_stock'
  }
}

/**
 * Map product categories to Google Product Categories
 * @see https://www.google.com/basepages/producttype/taxonomy-with-ids.en-US.txt
 */
function getGoogleCategory(categoryName: string): string {
  const categoryMap: Record<string, string> = {
    // Tekne Motorları ve Denizcilik
    'Dıştan Takma Motorlar': '3212', // Sporting Goods > Outdoor Recreation > Boating & Water Sports > Watercraft Parts & Accessories
    'Distan Takma Motorlar': '3212',
    '4 Zamanlı Dıştan Takma Motorlar': '3212',
    '4 Zamanli Distan Takma Motorlar': '3212',
    'Elektrikli Dıştan Takma Motorlar': '3212',
    'Elektrikli Distan Takma Motorlar': '3212',
    
    // Botlar
    'Şişme Deniz Botları': '3214', // Sporting Goods > Outdoor Recreation > Boating & Water Sports > Watercraft > Boats
    'Sisme Deniz Botlari': '3214',
    
    // SUP Boards
    'SUP Boardlar': '499811', // Sporting Goods > Water Sports > Stand-Up Paddleboards
    'Sup Boardlar': '499811',
    
    // Genel kategoriler
    'Denizcilik Ekipmanları': '3441', // Sporting Goods > Outdoor Recreation > Boating & Water Sports
    'Denizcilik Ekipmanlari': '3441',
    'Diğer': '3441',
    'Diger': '3441',
    'Genel': '3441',
  }

  // Normalize category name (remove Turkish chars and lowercase)
  const normalizedCategory = categoryName
    .replace(/ı/g, 'i')
    .replace(/İ/g, 'I')
    .replace(/ş/g, 's')
    .replace(/Ş/g, 'S')
    .replace(/ğ/g, 'g')
    .replace(/Ğ/g, 'G')
    .replace(/ü/g, 'u')
    .replace(/Ü/g, 'U')
    .replace(/ö/g, 'o')
    .replace(/Ö/g, 'O')
    .replace(/ç/g, 'c')
    .replace(/Ç/g, 'C')

  // Try exact match first
  if (categoryMap[categoryName]) {
    return categoryMap[categoryName]
  }

  // Try normalized match
  for (const [key, value] of Object.entries(categoryMap)) {
    const normalizedKey = key
      .replace(/ı/g, 'i')
      .replace(/İ/g, 'I')
      .replace(/ş/g, 's')
      .replace(/Ş/g, 'S')
      .replace(/ğ/g, 'g')
      .replace(/Ğ/g, 'G')
      .replace(/ü/g, 'u')
      .replace(/Ü/g, 'U')
      .replace(/ö/g, 'o')
      .replace(/Ö/g, 'O')
      .replace(/ç/g, 'c')
      .replace(/Ç/g, 'C')
    
    if (normalizedKey.toLowerCase() === normalizedCategory.toLowerCase()) {
      return value
    }
  }

  // Default to general boating category
  return '3441'
}

/**
 * Escape XML special characters
 */
function escapeXml(unsafe: string): string {
  if (!unsafe) return ''
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/**
 * Strip HTML tags from string
 */
function stripHtml(html: string): string {
  if (!html) return ''
  return html
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/\s+/g, ' ') // Collapse whitespace
    .trim()
}
