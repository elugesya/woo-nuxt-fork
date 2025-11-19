<script setup lang="ts">
// Fetch all products
const { data: productsData } = await useAsyncGql('getProducts')
const allProducts = (productsData.value?.products?.nodes || []) as Product[]

// Extract unique brands from all products using product_brand taxonomy
const brandMap = new Map<string, any>()

allProducts.forEach((product: Product) => {
  const brandTerms = product.terms?.nodes?.filter((term: any) => term.taxonomyName === 'product_brand') || []
  brandTerms.forEach((term: any) => {
    if (term?.slug) {
      if (!brandMap.has(term.slug)) {
        brandMap.set(term.slug, {
          id: term.databaseId || term.slug,
          name: term.name,
          slug: term.slug,
          description: term.description || '',
          count: 1,
        })
      } else {
        const existing = brandMap.get(term.slug)
        existing.count++
      }
    }
  })
})

const brands = Array.from(brandMap.values()).sort((a, b) => a.name.localeCompare(b.name))
</script>

<template>
  <div class="container mx-auto py-8">
    <h1 class="text-2xl font-bold mb-6">Markalar</h1>
    <div v-if="brands?.length" class="grid grid-cols-2 md:grid-cols-4 gap-6">
      <NuxtLink
        v-for="(brand, i) in brands"
        :key="brand.id || i"
        :to="`/shop/brand/${brand.slug}`"
        class="border rounded-lg p-6 hover:shadow-lg transition-shadow text-center">
        <h3 class="font-bold text-lg">{{ brand.name }}</h3>
        <p v-if="brand.count" class="text-sm text-gray-500 mt-2">{{ brand.count }} ürün</p>
      </NuxtLink>
    </div>
    <div v-else class="my-6 text-center text-gray-500">Marka bulunamadı.</div>
  </div>
</template>
