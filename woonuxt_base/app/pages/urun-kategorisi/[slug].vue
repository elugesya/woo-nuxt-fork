<script setup lang="ts">
const { setProducts, updateProductList } = useProducts();
const { isQueryEmpty, frontEndUrl, stripHtml } = useHelpers();
const { storeSettings } = useAppConfig();
const { trackViewItemList } = useGoogleAnalytics();
const route = useRoute();

const categorySlug = (route.params.categorySlug || route.params.slug) as string;

const { data } = await useAsyncGql('getProductsByCategory', { categorySlug });
// Fetch category meta for SEO
const { data: catData } = await useAsyncGql('getProductCategory', { slug: categorySlug });

const productsInCategory = (data.value?.products?.nodes || []) as Product[];
const pageInfo = data.value?.products?.pageInfo;
setProducts(productsInCategory);

onMounted(() => {
  if (!isQueryEmpty.value) updateProductList();
  
  // Track category product list view
  if (productsInCategory && productsInCategory.length > 0) {
    const categoryName = catData.value?.productCategory?.name || 'Category';
    trackViewItemList(productsInCategory as any, categoryName);
  }
});

watch(
  () => route.query,
  () => {
    if (route.name !== 'product-category-page' && route.name !== 'product-category-page-pager') return;
    updateProductList();
  },
);

const category = computed(() => (catData.value?.productCategory ? catData.value.productCategory : null));
const categoryName = computed(() => category.value?.name || 'Ürünler');
const categoryDesc = computed(() => stripHtml(category.value?.description || ''));
const canonical = computed(() => `${frontEndUrl}${route.path}`);

// SEO
useSeoMeta({
  title: categoryName.value,
  description: categoryDesc.value || `${categoryName.value} kategorisindeki ürünleri inceleyin.`,
});

// Pagination prev/next links (if route has pageNumber param)
const currentPage = computed(() => {
  const pageNum = Number(route.params.pageNumber);
  return pageNum > 0 ? pageNum : 1;
});
const hasNextPage = computed(() => pageInfo?.hasNextPage || false);
const prevUrl = computed(() => {
  if (currentPage.value <= 1) return null;
  if (currentPage.value === 2) return `${frontEndUrl}/urun-kategorisi/${categorySlug}`;
  return `${frontEndUrl}/urun-kategorisi/${categorySlug}/sayfa/${currentPage.value - 1}`;
});
const nextUrl = computed(() => {
  if (!hasNextPage.value) return null;
  return `${frontEndUrl}/urun-kategorisi/${categorySlug}/sayfa/${currentPage.value + 1}`;
});

useHead(() => ({
  link: [
    prevUrl.value ? { rel: 'prev', href: prevUrl.value } : undefined,
    nextUrl.value ? { rel: 'next', href: nextUrl.value } : undefined,
  ].filter(Boolean) as any,
}));

// Structured data: BreadcrumbList and ItemList for category page
const breadcrumbJsonLd = computed(() =>
  JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: frontEndUrl },
        { '@type': 'ListItem', position: 2, name: categoryName.value, item: canonical.value },
      ],
    },
    null,
    2,
  ),
);

const itemListJsonLd = computed(() => {
  const items = (productsInCategory as Product[]).slice(0, 10).map((p: any, idx: number) => ({
    '@type': 'ListItem',
    position: idx + 1,
    url: `${frontEndUrl}/urun/${p.slug}`,
    name: p.name,
  }));
  return JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: `${categoryName.value} Ürün Listesi`,
      itemListOrder: 'http://schema.org/ItemListOrderDescending',
      itemListElement: items,
    },
    null,
    2,
  );
});

useHead(() => ({
  script: [
    { type: 'application/ld+json', innerHTML: breadcrumbJsonLd.value },
  ],
}));

const isFilterOpen = ref(false);
const isSortOpen = ref(false);
</script>

<template>
  <main>
    <div class="container flex items-start gap-16" v-if="productsInCategory.length">
      <Filters v-if="storeSettings.showFilters" :hide-categories="true" class="hidden lg:block sticky top-24 min-w-[280px]" />

      <div class="w-full">
        <!-- Category Hero Banner -->
        <CategoryHeroBanner :category="categorySlug" />
        
        <div class="flex items-center justify-between w-full gap-4 mt-8 md:gap-8">
          <ProductResultCount />
          <OrderByDropdown class="hidden md:inline-flex" v-if="storeSettings.showOrderByDropdown" />
          <ShowFilterTrigger v-if="storeSettings.showFilters" class="md:hidden" @toggle-filters="isFilterOpen = true" />
        </div>
        <ProductGrid />
      </div>
    </div>
    <div v-else class="container my-8 text-center">
      <p class="text-gray-500">Bu kategoride ürün bulunamadı.</p>
    </div>

    <!-- Mobile Sticky Filter Bar -->
    <MobileFilterBar 
      @open-filters="isFilterOpen = true" 
      @open-sort="isSortOpen = true" 
    />

    <!-- Mobile Filter Drawer -->
    <Sheet :open="isFilterOpen" @update:open="isFilterOpen = $event">
      <SheetContent side="bottom" class="h-[90vh] rounded-t-xl p-0">
        <div class="flex flex-col h-full">
          <div class="flex items-center justify-between p-4 border-b">
            <h2 class="text-lg font-semibold">{{ $t('general.filters') }}</h2>
            <button @click="isFilterOpen = false" class="p-2 -mr-2 rounded-full hover:bg-muted">
              <Icon name="lucide:x" class="w-5 h-5" />
            </button>
          </div>
          <div class="flex-1 overflow-y-auto p-4">
            <Filters :hide-categories="true" />
          </div>
          <div class="p-4 border-t bg-background">
            <Button class="w-full" @click="isFilterOpen = false">{{ $t('general.showResults') }}</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>

    <!-- Mobile Sort Drawer -->
    <Sheet :open="isSortOpen" @update:open="isSortOpen = $event">
      <SheetContent side="bottom" class="rounded-t-xl">
        <div class="flex flex-col gap-4 pb-8">
          <div class="flex items-center justify-between pb-4 border-b">
            <h2 class="text-lg font-semibold">{{ $t('general.sortBy') }}</h2>
            <button @click="isSortOpen = false" class="p-2 -mr-2 rounded-full hover:bg-muted">
              <Icon name="lucide:x" class="w-5 h-5" />
            </button>
          </div>
          <OrderByDropdown :is-mobile="true" @close="isSortOpen = false" />
        </div>
      </SheetContent>
    </Sheet>
  </main>
</template>
