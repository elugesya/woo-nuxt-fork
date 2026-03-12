# SavaBoards Product Import Workflow

This document describes the workflow for importing SavaBoards products from savaboards.com.tr to WooCommerce.

## Overview

SavaBoards products require:
1. Full HTML-formatted product descriptions (NOT Markdown)
2. Regular price and sale price (when applicable)
3. Multiple product images (12-15 images per product)
4. Custom tabs for "Kullanım ve Bakım" (Usage & Care) and "Onarım Talimatları" (Repair Instructions)

## Prerequisites

### Environment Variables
Set in `.env`:
```bash
WORDPRESS_SITE_URL="https://backend.ntmc.com.tr"
WORDPRESS_USERNAME="neta"
WORDPRESS_APP_PASSWORD="7b4X 1Bsu xzxQ 8dwe bHNi RU8e"
```

### MCP Tools
- `mcp__woocommerce_ntmc__woocommerce-products-create` - Create product
- `mcp__woocommerce_ntmc__woocommerce-products-update` - Update product
- `mcp__woocommerce_ntmc__woocommerce-products-get` - Get product details

### REST API
- WordPress Media API for image uploads

## Product Data Structure

### Required Fields
```typescript
{
  name: string,                    // Product name
  regular_price: string,           // Original price (e.g., "22093")
  sale_price?: string,             // Sale price if applicable (e.g., "20085")
  description: string,             // FULL HTML description
  short_description: string,       // Short HTML description
  sku: string,                     // Unique SKU
  stock_status: "instock" | "outofstock",
  manage_stock: true,
  stock_quantity: number
}
```

### Category
```typescript
categories: [{ id: 488 }]  // Sup Boardlar category
```

## Step-by-Step Workflow

### Step 1: Fetch Product Data from Source

Use webReader to fetch product details:
```typescript
mcp__web_reader__webReader({
  url: "https://savaboards.com.tr/...",
  return_format: "markdown"
})
```

Extract:
- Product name
- Description/Features
- Technical specifications
- Box contents
- Usage instructions
- Warranty information
- Regular price and sale price
- SKU
- Images

### Step 2: Convert Content to HTML

**IMPORTANT**: WooCommerce requires HTML, NOT Markdown.

#### HTML Conversion Rules

| Markdown | HTML |
|----------|------|
| `# Heading` | `<h2>Heading</h2>` (use h2 for main title) |
| `## Subheading` | `<h3>Subheading</h3>` |
| `### Sub-subheading` | `<h4>Sub-subheading</h4>` |
| `**bold**` | `<strong>bold</strong>` |
| `*italic*` | `<em>italic</em>` |
| `- List item` | `<ul><li>List item</li></ul>` |
| `1. Item` | `<ol><li>Item</li></ol>` |
| `[text](url)` | `<a href="url">text</a>` |
| `![alt](url)` | `<img src="url" alt="alt">` |

#### Tables
```html
<table>
<tr><th>Header 1</th><th>Header 2</th></tr>
<tr><td>Data 1</td><td>Data 2</td></tr>
</table>
```

#### Example HTML Description
```html
<h2>SavaBoards Aqua Harmony 11' Paddle Board</h2>
<p>SavaBoards Aqua Harmony Paddle Board ile suyun üzerinde özgürce süzülmeye hazır olun!</p>

<h3>Özellikler</h3>
<h4>Yüksek Yoğunluklu Woven Drop Stitch Gövde</h4>
<p>SavaBoards serisine özel geliştirilen yüksek yoğunluklu iç lif yapısı...</p>

<h3>Teknik Özellikler</h3>
<table>
<tr><th>Özellik</th><th>Değer</th></tr>
<tr><td>Boyutlar</td><td>335 x 86 x 15 cm</td></tr>
<tr><td>Malzeme</td><td>PVC + EVA</td></tr>
</table>
```

### Step 3: Create Product via MCP

```typescript
mcp__woocommerce_ntmc__woocommerce-products-create({
  name: "SavaBoards Product Name",
  regular_price: "22093",
  sale_price: "20085",
  description: "<h2>Product Name</h2><p>Full HTML description...</p>",
  short_description: "<p>Short HTML description...</p>",
  sku: "SKU-12345",
  stock_status: "instock",
  manage_stock: true,
  stock_quantity: 10,
  categories: [{ id: 488 }],
  type: "simple",
  status: "publish"
})
```

Response includes product ID (e.g., `7478`)

### Step 4: Download and Upload Images

```bash
# Create temp directory
mkdir -p /tmp/savaproduct

# Download images (high-res versions)
cd /tmp/savaproduct
curl -o "01-main.jpg" "https://savaboards.com.tr/image/...-1200x1200.jpg"
curl -o "02-angle.jpg" "https://savaboards.com.tr/image/...-1200x1200.jpg"
# ... etc for all images
```

```bash
# Upload to WordPress via REST API
source /path/to/.env

for img in *.jpg *.png; do
  response=$(curl -s -X POST \
    "${WORDPRESS_SITE_URL}/wp-json/wp/v2/media" \
    -u "${WORDPRESS_USERNAME}:${WORDPRESS_APP_PASSWORD}" \
    -F "file=@$img" \
    -F "caption=SavaBoards Product" \
    -F "alt_text=Product image")
  id=$(echo "$response" | jq -r '.id')
  echo "$img -> ID: $id"
done
```

### Step 5: Attach Images to Product

```typescript
mcp__woocommerce_ntmc__woocommerce-products-update({
  id: 7478,
  images: [
    { id: 7479 },
    { id: 7480 },
    { id: 7481 }
    // ... all image IDs
  ]
})
```

### Step 6: Add Custom Tabs (Optional)

For "Kullanım ve Bakım" and "Onarım Talimatları" tabs, use one of these methods:

#### Method A: Using WooCommerce Custom Product Tabs Plugin (WORKING)

The working meta keys on this site use underscore prefix:

```typescript
mcp__woocommerce_ntmc__woocommerce-products-update({
  id: 7478,
  meta_data: [
    {
      key: "_custom_tab_1_title",
      value: "Kullanım ve Bakım"
    },
    {
      key: "_custom_tab_1_content",
      value: "<h3>Kullanım İpuçları</h3><ul><li>Her kullanımdan sonra tatlı suyla durulayın...</li></ul>"
    },
    {
      key: "_custom_tab_2_title",
      value: "Onarım Talimatları"
    },
    {
      key: "_custom_tab_2_content",
      value: "<h3>Onarım Rehberi</h3><p>Onarım için gerekli malzemeler...</p>"
    }
  ]
})
```

**NOTE**: Use `_custom_tab_*` (with underscore prefix) - this is confirmed working on backend.ntmc.com.tr

#### Method B: Using YITH WooCommerce Product Tabs

```typescript
meta_data: [
  {
    key: "yith_wc_tabs_0_title",
    value: "Kullanım ve Bakım"
  },
  {
    key: "yith_wc_tabs_0_content",
    value: "<h3>Kullanım İpuçları</h3>..."
  }
]
```

#### Method C: Custom Shortcodes in Description

Add tab shortcodes to the description:
```html
[tabs]
[tab title="Kullanım ve Bakım"]
<h3>Kullanım İpuçları</h3>
<ul><li>Her kullanımdan sonra...</li></ul>
[/tab]
[tab title="Onarım Talimatları"]
<h3>Onarım Rehberi</h3>
<p>Onarım için...</p>
[/tab]
[/tabs]
```

## Tab Content Templates

### Kullanım ve Bakım (Usage & Care)

```html
<h3>Kullanım İpuçları</h3>
<ul>
<li>Her kullanımdan sonra tatlı suyla durulayın ve hafif sabunlu suyla temizleyin</li>
<li>Tamamen kuruduktan sonra serin ve kuru bir yerde muhafaza edin</li>
<li>Isı kaynaklarından (kamp ocakları, kalorifer, doğrudan güneş) uzak tutun</li>
</ul>

<h3>Şişirme Talimatları</h3>
<ul>
<li>Önerilen basınç: 12-15 PSI</li>
<li>Asla maksimum değere kadar şişirmeyin</li>
<li>Güneş altında basınç artışı olacağı için sıcak havalarda biraz hava indirin</li>
</ul>

<h3>Depolama Önerileri</h3>
<ul>
<li>Uzun süre katlı bırakmayın (her 6 ayda bir yeniden katlayın)</li>
<li>Kuru, serin ve havalandırılan alanda saklayın (0-45°C aralığı)</li>
<li>Uzun süreli depolama için basıncı 5 PSI seviyesine düşürün</li>
</ul>
```

### Onarım Talimatları (Repair Instructions)

```html
<h3>Onarım Rehberi</h3>
<p>SavaBoards ürünlerinde oluşabilecek küçük hasarlar için aşağıdaki adımları izleyin:</p>

<h4>Gerekli Malzemeler</h4>
<ul>
<li>PVC tamir kiti (dahilde)</li>
<li>Temiz bez</li>
<li>Alkol veya tiner</li>
</ul>

<h4>Küçük Çizikler ve Yırtıklar</h4>
<ol>
<li>Hasarlı alanı alkolle temizleyin ve kurutun</li>
<li>Tamir yamasını hasarlı bölgeden 2-3 cm büyük kesin</li>
<li>Yamayı ve hasarlı bölgeyi ısıtın (saç kurutma makinesi ile)</li>
<li>Yamayı sıkıca bastırarak yapıştırın</li>
<li>4 saat basınç altında bırakın</li>
</ol>

<h4>Valve Sorunları</h4>
<p>Valf sızıntısı için valf anahtarı ile valfi sıkın. Sorun devam ederse yetkili servise başvurun.</p>
```

## Price Format

SavaBoards products typically have:
- **Regular price**: Full price (e.g., 22093)
- **Sale price**: Discounted price (e.g., 20085)

```typescript
{
  regular_price: "22093",  // Use string, not number
  sale_price: "20085"      // Optional, only if on sale
}
```

## Image Upload Workflow

1. Extract image URLs from source page (high-res 1200x1200 versions)
2. Download to temp directory
3. Upload to WordPress REST API (`/wp-json/wp/v2/media`)
4. Get attachment IDs from response
5. Attach to product via MCP update

## Verification

After product creation, verify:
```bash
curl -s "${WORDPRESS_SITE_URL}/wp-json/wc/v3/products/{ID}" \
  -u "${WORDPRESS_USERNAME}:${WORDPRESS_APP_PASSWORD}" | jq '.'
```

## Frontend Tab Display Limitation

**IMPORTANT**: The frontend at `ntmc.com.tr` is a **static Nuxt site** (WooNuxt), which means:

1. **Tab meta_data is saved correctly on WordPress backend** - Product 7478 has the `_custom_tab_*` meta fields stored properly
2. **Static Nuxt frontend doesn't support custom tab meta fields** - WooNuxt doesn't dynamically fetch custom tab meta_data
3. **Tabs will NOT display on ntmc.com.tr** - The static site is pre-generated without tab support

### Options for Displaying Tabs on Frontend

#### Option 1: Include Tab Content in Main Description (Recommended for Static Site)

Add the tab content directly to the product description HTML:

```html
<h2>SavaBoards Aqua Harmony 11' Paddle Board</h2>
<p>Main description here...</p>

<hr class="my-6">

<h3>Kullanım ve Bakım</h3>
<h4>Kullanım İpuçları</h4>
<ul><li>Her kullanımdan sonra tatlı suyla durulayın...</li></ul>

<h4>Şişirme Talimatları</h4>
<ul><li>Önerilen basınç: 12-15 PSI...</li></ul>

<hr class="my-6">

<h3>Onarım Talimatları</h3>
<h4>Onarım Rehberi</h4>
<p>Onarım için gerekli malzemeler...</p>
```

#### Option 2: Extend WooNuxt to Support Custom Tabs

Modify the WooNuxt product page component to:
1. Fetch custom tab meta_data via GraphQL
2. Display tabs using a tab component (e.g., Radix Vue Tabs)

This requires:
- Adding custom tab fields to WPGraphQL schema
- Modifying `ProductPage.vue` in WooNuxt
- Adding a Tabs component to the product template

#### Option 3: Use WordPress Backend for Products with Tabs

Link directly to the WordPress backend product page for products that need tabs:
```
https://backend.ntmc.com.tr/urun/sava-boards-aqua-harmony-11-paddle-board-sisilmeli-sup/
```

This will display tabs if a tab plugin is installed and active.

### Verifying Tab Meta Data on Backend

To verify tabs are stored correctly:

```typescript
// Get product via MCP
mcp__woocommerce_ntmc__woocommerce-products-get({ id: 7478 })

// Check meta_data array for:
// - _custom_tab_1_title: "Kullanım ve Bakım"
// - _custom_tab_1_content: [HTML content]
// - _custom_tab_2_title: "Onarım Talimatları"
// - _custom_tab_2_content: [HTML content]
```

## Common Issues

| Issue | Solution |
|-------|----------|
| Markdown not displaying | Convert to HTML using h2/h3/h4 tags |
| Images not showing | Check REST API upload response for attachment IDs |
| Wrong category | Update with categories: [{id: 488}] |
| Sale price not showing | Ensure both regular_price and sale_price are set |
| Tabs not displaying on ntmc.com.tr | Static Nuxt site doesn't support custom tab meta - use Option 1, 2, or 3 above |
| Tabs not displaying on backend.ntmc.com.tr | Check if WooCommerce Custom Product Tabs plugin is installed |

## Quick Reference: HTML Tags

```html
<!-- Headings -->
<h2>Main Section</h2>
<h3>Subsection</h3>
<h4>Detail</h4>

<!-- Text formatting -->
<p>Paragraph</p>
<strong>Bold</strong>
<em>Italic</em>

<!-- Lists -->
<ul>
  <li>Bullet item</li>
</ul>
<ol>
  <li>Numbered item</li>
</ol>

<!-- Tables -->
<table>
<tr><th>Header</th></tr>
<tr><td>Data</td></tr>
</table>
```
