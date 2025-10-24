<script setup lang="ts">
const { setProducts, updateProductList } = useProducts();
const route = useRoute();
const { storeSettings } = useAppConfig();
const { isQueryEmpty, frontEndUrl } = useHelpers();
const { trackViewItemList } = useGoogleAnalytics();

const { data } = await useAsyncGql('getProducts');
const allProducts = data.value?.products?.nodes as Product[];
const pageInfo = data.value?.products?.pageInfo;
setProducts(allProducts);

const hasProducts = computed<boolean>(() => Array.isArray(allProducts) && allProducts.length > 0);

// SEO
useSeoMeta({
  title: 'Ürünler',
  description: 'Tüm ürünlerimizi keşfedin. Dıştan takma motorlar, şişme botlar ve denizcilik ekipmanları.',
})

onMounted(() => {
  if (!isQueryEmpty.value) updateProductList();
  
  // Track product list view
  if (allProducts && allProducts.length > 0) {
    trackViewItemList(allProducts, 'All Products');
  }
});

watch(
  () => route.query,
  () => {
    if (route.name !== 'products') return;
    updateProductList();
  },
);

// Pagination prev/next links (if route has pageNumber param)
const currentPage = computed(() => {
  const pageNum = Number(route.params.pageNumber);
  return pageNum > 0 ? pageNum : 1;
});
const hasNextPage = computed(() => pageInfo?.hasNextPage || false);
const prevUrl = computed(() => {
  if (currentPage.value <= 1) return null;
  if (currentPage.value === 2) return `${frontEndUrl}/urunler`;
  return `${frontEndUrl}/urunler/sayfa/${currentPage.value - 1}`;
});
const nextUrl = computed(() => {
  if (!hasNextPage.value) return null;
  return `${frontEndUrl}/urunler/sayfa/${currentPage.value + 1}`;
});

useHead(() => ({
  link: [
    prevUrl.value ? { rel: 'prev', href: prevUrl.value } : undefined,
    nextUrl.value ? { rel: 'next', href: nextUrl.value } : undefined,
  ].filter(Boolean) as any,
}));
</script>

<template>
  <div class="container flex items-start gap-16" v-if="hasProducts">
    <Filters v-if="storeSettings.showFilters" />

    <div class="w-full">
      <div class="flex items-center justify-between w-full gap-4 mt-8 md:gap-8">
        <ProductResultCount />
        <OrderByDropdown class="hidden md:inline-flex" v-if="storeSettings.showOrderByDropdown" />
        <ShowFilterTrigger v-if="storeSettings.showFilters" class="md:hidden" />
      </div>
      <ProductGrid />
    </div>
  </div>
  <NoProductsFound v-else>No products found. Please try adjusting your filters or check back later.</NoProductsFound>
</template>
