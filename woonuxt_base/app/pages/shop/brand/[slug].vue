<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const { setProducts, updateProductList } = useProducts()
const { isQueryEmpty, frontEndUrl, stripHtml } = useHelpers()
const { storeSettings } = useAppConfig()
const { setFilter } = useFiltering()

const brandSlug = (route.params.slug as string) || ''

// Fetch all products - we'll filter by brand on the client side
const { data } = await useAsyncGql('getProducts')
const allProducts = (data.value?.products?.nodes || []) as Product[]

// Filter products by product_brand taxonomy
const productsInBrand = allProducts.filter(product => 
  product.terms?.nodes?.some((term: any) => 
    term.taxonomyName === 'product_brand' && term.slug === brandSlug
  )
)

setProducts(productsInBrand)

// Automatically select the brand filter in the sidebar
onMounted(() => {
  // Set the brand filter if not already set
  if (!route.query.filter || !route.query.filter.toString().includes('product_brand')) {
    setFilter('product_brand', [brandSlug])
  }
})

// Get brand name from first product or fallback to slug
const brandName = computed(() => {
  if (productsInBrand.length > 0) {
    const brandTerm = productsInBrand[0].terms?.nodes?.find((term: any) => 
      term.taxonomyName === 'product_brand' && term.slug === brandSlug
    )
    if (brandTerm?.name) return brandTerm.name
  }
  return brandSlug.replace(/[-_]/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase())
})

const canonical = computed(() => `${frontEndUrl}/shop/brand/${brandSlug}`)

// SEO
useSeoMeta({
  title: `${brandName.value} Ürünleri`,
  description: stripHtml(`${brandName.value} markasına ait ürünleri inceleyin.`),
})

useHead(() => ({
  link: [
    { rel: 'canonical', href: canonical.value },
  ],
}))

watch(
  () => route.query,
  () => {
    if (route.name !== 'shop-brand-slug') return
    updateProductList()
  },
)
</script>

<template>
  <main>
    <div class="container flex items-start gap-16" v-if="productsInBrand.length">
      <Filters v-if="storeSettings.showFilters" :hide-categories="true" />

      <div class="w-full">
        <div class="flex items-center justify-between w-full gap-4 mt-8 md:gap-8">
          <ProductResultCount />
          <OrderByDropdown class="hidden md:inline-flex" v-if="storeSettings.showOrderByDropdown" />
          <ShowFilterTrigger v-if="storeSettings.showFilters" class="md:hidden" />
        </div>
        <ProductGrid />
      </div>
    </div>
    <div v-else class="container my-8 text-center">
      <p class="text-gray-500">Bu marka için ürün bulunamadı.</p>
    </div>
  </main>
</template>
