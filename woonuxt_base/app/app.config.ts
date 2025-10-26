/**
 * App configuration.
 * This file is used to configure the app settings.
 * Below are the default values.
 */
export default defineAppConfig({
  siteName: process.env.NUXT_PUBLIC_SITE_NAME ,
  shortDescription: process.env.NUXT_PUBLIC_SITE_SHORT_DESCRIPTION ,
  description: process.env.NUXT_PUBLIC_SITE_DESCRIPTION ,
  baseUrl: process.env.NUXT_PUBLIC_FRONT_END_URL ,
  siteImage: process.env.NUXT_PUBLIC_SITE_IMAGE ,
  stripePaymentMethod: 'payment', // 'card' or 'payment'
  // Stripe Payment Method Options:
  // - 'card': Traditional single card input field (legacy but still supported)
  // - 'payment': Modern Payment Element with tabs for multiple payment methods (recommended)
  storeSettings: {
    autoOpenCart: true,
    showReviews: true,
    showFilters: true,
    showOrderByDropdown: true,
    showSKU: true,
    showRelatedProducts: true,
    showProductCategoriesOnSingleProduct: true,
    showBreadcrumbOnSingleProduct: true,
    showMoveToWishlist: true,
    hideBillingAddressForVirtualProducts: false,
    initStoreOnUserActionToReduceServerLoad: true,
    saleBadge: 'percent', // 'percent', 'onSale' or 'hidden'
    socialLoginsDisplay: 'buttons', // 'buttons' or 'icons'
  },
});
