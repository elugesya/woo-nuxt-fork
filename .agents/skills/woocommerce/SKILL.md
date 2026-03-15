---
name: woocommerce
description: WooCommerce product management via MCP and REST API. Create, read, update, delete products with image upload capabilities. Use when user mentions products, catalog, inventory, or WooCommerce operations.
user-invocable: true
---

# WooCommerce Product Management

Manages WooCommerce products through a two-stage workflow:
1. **MCP Tools**: Create/update product data
2. **REST API**: Upload and attach product images

## Environment Credentials

WordPress REST API credentials are in `.env`:
```bash
WORDPRESS_SITE_URL="https://backend.ntmc.com.tr"
WORDPRESS_USERNAME="neta"
WORDPRESS_APP_PASSWORD="7b4X 1Bsu xzxQ 8dwe bHNi RU8e"
```

## MCP Tools (Product Data)

| Tool | Purpose |
|------|---------|
| `mcp__woocommerce_ntmc__woocommerce-products-create` | Create new product |
| `mcp__woocommerce_ntmc__woocommerce-products-get` | Get single product by ID |
| `mcp__woocommerce_ntmc__woocommerce-products-list` | List products with filters |
| `mcp__woocommerce_ntmc__woocommerce-products-update` | Update existing product |
| `mcp__woocommerce_ntmc__woocommerce-products-delete` | Delete product |

## REST API (Image Upload)

**Endpoint:** `{WORDPRESS_SITE_URL}/wp-json/wp/v2/media`
**Auth:** Basic Auth (username + app password)

```bash
curl -X POST \
  "${WORDPRESS_SITE_URL}/wp-json/wp/v2/media" \
  -u "${WORDPRESS_USERNAME}:${WORDPRESS_APP_PASSWORD}" \
  -F "file=@/path/to/image.jpg" \
  -F "caption=Product image" \
  -F "alt_text=Alt text for image"
```

## Product Creation Workflow

### Stage 1: Create Product via MCP

```typescript
// Create product first
mcp__woocommerce_ntmc__woocommerce-products-create({
  name: "Product Name",
  regular_price: "100.00",
  description: "Full description",
  short_description: "Short description",
  sku: "SKU-123",
  stock_status: "instock",
  status: "publish",
  // categories: [{ id: 123 }],
  // images: [] // Empty initially
})
```

**Response includes:** Product ID (e.g., `1234`)

### Stage 2: Upload Images via REST API

```bash
# Upload each image
IMAGE_ID=$(curl -s -X POST \
  "${WORDPRESS_SITE_URL}/wp-json/wp/v2/media" \
  -u "${WORDPRESS_USERNAME}:${WORDPRESS_APP_PASSWORD}" \
  -F "file=@/path/to/image.jpg" \
  | jq -r '.id')
```

**Response includes:** Attachment ID (e.g., `5678`)

### Stage 3: Attach Images to Product via MCP

```typescript
// Update product with image IDs
mcp__woocommerce_ntmc__woocommerce-products-update({
  id: 1234, // Product ID from Stage 1
  images: [
    { id: 5678 }, // Attachment ID from Stage 2
    { id: 5679 }
  ]
})
```

## Complete Product Schema

### Required Fields
- `name`: Product name
- `regular_price`: Price string (e.g., "99.99")

### Common Optional Fields
```typescript
{
  type: "simple" | "grouped" | "external" | "variable",
  status: "publish" | "draft" | "pending",
  description: string,
  short_description: string,
  sku: string,
  regular_price: string,
  sale_price: string,
  stock_status: "instock" | "outofstock" | "onbackorder",
  manage_stock: boolean,
  stock_quantity: number,
  categories: [{ id: number, name: string }],
  tags: [{ id: number, name: string }],
  images: [{ id: number, src: string, alt: string }],
  dimensions: { length: string, width: string, height: string },
  weight: string
}
```

## Quick Reference Commands

### List Products
```typescript
// All products
mcp__woocommerce_ntmc__woocommerce-products-list()

// With filters
mcp__woocommerce_ntmc__woocommerce-products-list({
  search: "keyword",
  status: "publish",
  per_page: 100
})
```

### Get Product
```typescript
mcp__woocommerce_ntmc__woocommerce-products-get({ id: 123 })
```

### Delete Product
```typescript
mcp__woocommerce_ntmc__woocommerce-products-delete({ id: 123 })
```

## Error Handling

- **401**: Check credentials in `.env`
- **404**: Product or endpoint doesn't exist
- **400**: Invalid request body (check field types)
- **415**: Unsupported media type for image upload
