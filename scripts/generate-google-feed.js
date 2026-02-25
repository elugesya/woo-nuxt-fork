/**
 * Generate Google Merchant Feed XML using WooCommerce REST API
 * Run this script after static site generation
 */

const fs = require('fs')
const path = require('path')

const WP_SITE_URL = process.env.WORDPRESS_SITE_URL || 'https://backend.ntmc.com.tr'
const WP_USERNAME = process.env.WORDPRESS_USERNAME || 'neta'
// App password with spaces needs to be read carefully
const WP_APP_PASSWORD = (process.env.WORDPRESS_APP_PASSWORD || '').trim()

const OUTPUT_DIR = path.join(__dirname, '../.output/public')
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'google-feed.xml')

const SITE_URL = process.env.NUXT_PUBLIC_FRONT_END_URL || 'https://ntmc.com.tr'
const SHOP_NAME = process.env.NUXT_PUBLIC_GOOGLE_MERCHANT_SHOP_NAME || 'Neta Marine'
const DEFAULT_BRAND = process.env.NUXT_PUBLIC_GOOGLE_MERCHANT_BRAND || 'Neta Marine'
const CURRENCY_CODE = process.env.NUXT_PUBLIC_CURRENCY_CODE || 'TRY'

async function fetchAllProducts() {
  const allProducts = []
  let page = 1
  let perPage = 100
  let hasMore = true

  // Create Basic Auth header
  const auth = Buffer.from(`${WP_USERNAME}:${WP_APP_PASSWORD}`).toString('base64')

  while (hasMore) {
    try {
      const url = `${WP_SITE_URL}/wp-json/wc/v3/products?page=${page}&per_page=${perPage}&status=publish`

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        console.error(`WooCommerce API fetch failed: ${response.status} ${response.statusText}`)
        break
      }

      const products = await response.json()

      if (!Array.isArray(products) || products.length === 0) {
        hasMore = false
        break
      }

      allProducts.push(...products)
      console.log(`Fetched ${products.length} products from page ${page}, total: ${allProducts.length}`)

      // If we got less than per_page, we've reached the end
      if (products.length < perPage) {
        hasMore = false
      } else {
        page++
      }
    } catch (error) {
      console.error('Error fetching products:', error.message)
      break
    }
  }

  return allProducts
}

function escapeXml(unsafe) {
  if (!unsafe) return ''
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function stripHtml(html) {
  if (!html) return ''
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function getAvailability(stockStatus) {
  switch (stockStatus) {
    case 'instock':
      return 'in_stock'
    case 'outofstock':
      return 'out_of_stock'
    case 'onbackorder':
      return 'backorder'
    default:
      return 'in_stock'
  }
}

function getGoogleCategory(categoryName) {
  const categoryMap = {
    'Dıştan Takma Motorlar': '3212',
    'Distan Takma Motorlar': '3212',
    '4 Zamanlı Dıştan Takma Motorlar': '3212',
    'Elektrikli Dıştan Takma Motorlar': '3212',
    'Şişme Deniz Botları': '3214',
    'Sisme Deniz Botlari': '3214',
    'SUP Boardlar': '499811',
    'Sup Boardlar': '499811',
    'Foil Board': '499972',
    'Denizcilik Ekipmanları': '3441',
    'Denizcilik Ekipmanlari': '3441',
    'Diğer': '3441',
    'Diger': '3441',
    'Genel': '3441',
  }

  if (categoryMap[categoryName]) {
    return categoryMap[categoryName]
  }

  return '3441'
}

function generateProductFeedXML(products) {
  const items = products
    .map((product) => {
      if (!product.name || !product.slug) return ''

      const productUrl = `${SITE_URL}/urun/${product.slug}`
      const imageUrl = product.images?.[0]?.src || ''
      const title = escapeXml(product.name.substring(0, 150))
      const description = escapeXml(stripHtml(product.short_description || product.description || '').substring(0, 5000))

      const price = parseFloat(product.regular_price || product.price || '0')
      const salePrice = product.sale_price ? parseFloat(product.sale_price) : null

      const availability = getAvailability(product.stock_status)

      const category = product.categories?.[0]?.name || 'Genel'
      const googleCategory = getGoogleCategory(category)

      const brand = escapeXml(product.brand?.name || DEFAULT_BRAND)

      const additionalImages = (product.images || [])
        .slice(1, 11) // Skip first image, max 10 additional
        .filter(img => img.src)
        .map((img) => `      <g:additional_image_link>${escapeXml(img.src)}</g:additional_image_link>`)
        .join('\n')

      const condition = 'new'

      const weight = product.weight ? parseFloat(product.weight) : null

      const dimensions = product.dimensions || {}
      const length = dimensions.length ? parseFloat(dimensions.length) : null
      const width = dimensions.width ? parseFloat(dimensions.width) : null
      const height = dimensions.height ? parseFloat(dimensions.height) : null

      let additionalFields = ''

      if (!product.barcode && !product.gtin) {
        additionalFields += '      <g:identifier_exists>no</g:identifier_exists>\n'
      }

      additionalFields += '      <g:adult>no</g:adult>\n'

      if (weight && weight > 0) {
        additionalFields += `      <g:shipping_weight>${weight.toFixed(2)} kg</g:shipping_weight>\n`
      }

      if (length && length > 0) {
        additionalFields += `      <g:product_length>${length.toFixed(0)} cm</g:product_length>\n`
      }
      if (width && width > 0) {
        additionalFields += `      <g:product_width>${width.toFixed(0)} cm</g:product_width>\n`
      }
      if (height && height > 0) {
        additionalFields += `      <g:product_height>${height.toFixed(0)} cm</g:product_height>\n`
      }

      return `    <item>
      <g:id>${product.id}</g:id>
      <g:title>${title}</g:title>
      <g:description>${description}</g:description>
      <g:link>${escapeXml(productUrl)}</g:link>
      ${imageUrl ? `<g:image_link>${escapeXml(imageUrl)}</g:image_link>` : ''}
${additionalImages}
      <g:condition>${condition}</g:condition>
      <g:availability>${availability}</g:availability>
      <g:price>${price.toFixed(2)} ${CURRENCY_CODE}</g:price>
      ${salePrice && salePrice < price ? `<g:sale_price>${salePrice.toFixed(2)} ${CURRENCY_CODE}</g:sale_price>` : ''}
      <g:brand>${brand}</g:brand>
      ${product.barcode ? `<g:gtin>${escapeXml(product.barcode)}</g:gtin>` : ''}
      ${product.sku ? `<g:mpn>${escapeXml(product.sku)}</g:mpn>` : ''}
      <g:product_type>${escapeXml(category)}</g:product_type>
      <g:google_product_category>${googleCategory}</g:google_product_category>
${additionalFields}
      <g:shipping>
        <g:country>TR</g:country>
        <g:service>Standart</g:service>
        <g:price>0 ${CURRENCY_CODE}</g:price>
      </g:shipping>
    </item>`
    })
    .filter(Boolean)
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>${escapeXml(SHOP_NAME)}</title>
    <link>${escapeXml(SITE_URL)}</link>
    <description>${escapeXml(SHOP_NAME)} - Ürün Kataloğu</description>
${items}
  </channel>
</rss>`
}

async function main() {
  console.log('Generating Google Merchant Feed using WooCommerce REST API...')
  console.log(`SITE_URL: ${SITE_URL}`)

  try {
    const products = await fetchAllProducts()

    if (!products || products.length === 0) {
      console.error('No products found!')
      process.exit(1)
    }

    console.log(`Total products: ${products.length}`)

    const xml = generateProductFeedXML(products)

    // Ensure output directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true })
    }

    // Write XML file
    fs.writeFileSync(OUTPUT_FILE, xml, 'utf8')

    console.log(`✓ Generated: ${OUTPUT_FILE}`)
    console.log(`✓ File size: ${(xml.length / 1024).toFixed(2)} KB`)
    console.log(`✓ Feed URL: ${SITE_URL}/google-feed.xml`)
  } catch (error) {
    console.error('Error generating feed:', error)
    process.exit(1)
  }
}

main()
