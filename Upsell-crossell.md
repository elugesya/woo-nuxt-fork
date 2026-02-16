# Upsell and Cross-sell Implementation Plan

## Objective
Enhance the e-commerce experience by suggesting related products:
- **Upsells**: Recommend higher-end alternatives or relevant add-ons on the **Product Page**.
- **Cross-sells**: Recommend complementary items (e.g., accessories) on the **Cart/Checkout** flow.

## 1. GraphQL Schema Updates

We need to fetch `upsell` and `crossSell` data when querying products.

### Files to Modify
- `app/queries/fragments/SimpleProduct.gql`
- `app/queries/fragments/VariableProduct.gql`

### Changes
Add the following fields to both fragments:

```graphql
upsell(first: 5) {
  nodes {
    ...SimpleProduct
    ...VariableProduct
  }
}
crossSell(first: 5) {
  nodes {
    ...SimpleProduct
    ...VariableProduct
  }
}
```
*Note: We might need a lighter fragment (e.g., `ProductSummary`) to avoid deep nesting and performance issues, rather than reusing the full `SimpleProduct`/`VariableProduct` fragments.*

## 2. UI Components

### New Components
1.  **`components/product/ProductUpsell.vue`**
    -   **Props**: `products` (Array of products)
    -   **Usage**: Displayed on `pages/urun/[slug].vue` (Product Detail Page).
    -   **Layout**: A carousel or grid of product cards.

2.  **`components/cart/CartCrossSell.vue`**
    -   **Props**: `products` (Array of products)
    -   **Usage**: Displayed in the Cart Drawer or Cart Page.
    -   **Layout**: Compact list or small carousel.

## 3. Integration

### Product Page (`pages/urun/[slug].vue`)
-   Update the query to ensure `upsell` data is retrieved.
-   Import and place `<ProductUpsell />` component below the main product details or description.
-   Pass `product.upsell.nodes` to the component.

### Cart / Checkout
-   **Strategy**:
    -   For **Cross-sells**, we usually want to show items related to what's currently in the cart.
    -   Since the Cart query (`getCart.gql`) might not return cross-sells for every item automatically, we might need to:
        -   Fetch cross-sells for items in the cart.
        -   OR, if we focus on the Product Page cross-sells (sometimes used interchangeably), we can show them there too.
    -   *Recommendation*: Start with **Upsells on Product Page** as it's the most direct impact. For Cross-sells, we can implement them in the Cart Drawer if the data is available.

## 4. Implementation Steps

1.  **Modify GraphQL Fragments**: Add `upsell` and `crossSell` fields.
2.  **Regenerate Types** (if applicable/automated).
3.  **Create Components**: Build the UI for displaying these product lists.
4.  **Integrate**: Add to Product Page and verify data loading.
5.  **Test**: Ensure products with linked upsells/cross-sells display correctly.