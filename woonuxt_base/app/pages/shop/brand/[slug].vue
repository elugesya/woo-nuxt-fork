<script setup lang="ts">
const route = useRoute()
const { setProducts, updateProductList } = useProducts()
const { isQueryEmpty, frontEndUrl, stripHtml } = useHelpers()
const { storeSettings } = useAppConfig()

// Runtime-configured brand taxonomies (comma-separated, lowercase)
const config = useRuntimeConfig()
const brandTaxonomies = ((config.public as any).BRAND_TAXONOMIES as string || 'product_brand,pa_brand,brand')
  .split(',')
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean)

const brandSlug = (route.params.slug as string) || ''

// Fetch all products and filter by brand taxonomy terms
const { data } = await useAsyncGql('getProducts')
const allProducts = (data.value?.products?.nodes || []) as Product[]

function productHasBrand(product: Product, slug: string): boolean {
  const terms = (product as any)?.terms?.nodes || []
  return terms.some((t: any) => brandTaxonomies.includes(String(t?.taxonomyName || '').toLowerCase()) && t?.slug === slug)
}

const productsInBrand = allProducts.filter((p: Product) => productHasBrand(p, brandSlug))
setProducts(productsInBrand)

const brandName = computed(() => brandSlug.replace(/[-_]/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase()))
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
