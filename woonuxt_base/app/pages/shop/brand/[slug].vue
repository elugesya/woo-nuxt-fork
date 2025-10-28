<script setup lang="ts">
const route = useRoute()
const { setProducts, updateProductList } = useProducts()
const { isQueryEmpty, frontEndUrl, stripHtml } = useHelpers()
const { storeSettings } = useAppConfig()

const brandSlug = (route.params.slug as string) || ''


// Fetch only products for the current brand using GraphQL filter
const { data } = await useAsyncGql('getProducts', { filter: `brand[${brandSlug}]` })
const productsInBrand = ((data.value?.products?.nodes || []) as Product[]).filter(product =>
  product.brands?.nodes?.some(brand => brand.slug === brandSlug)
)
setProducts(productsInBrand)

// Get brand name from first product or fallback to slug
const brandName = computed(() => {
  if (productsInBrand.length > 0) {
    const brands = (productsInBrand[0] as any)?.brands?.nodes || []
    const brand = brands.find((b: any) => b?.slug === brandSlug)
    if (brand?.name) return brand.name
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

onMounted(() => {
  if (!isQueryEmpty.value) updateProductList()
})

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
