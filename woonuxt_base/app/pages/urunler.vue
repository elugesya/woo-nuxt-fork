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
    trackViewItemList(allProducts as any, 'All Products');
  }
});

watch(
  () => route.query,
  () => {
    // Ensure we only react on the product list route
    if (route.name !== 'urunler') return;
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

// Structured Data: BreadcrumbList + ItemList for all products page
const breadcrumbJsonLd = computed(() =>
  JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: frontEndUrl },
        { '@type': 'ListItem', position: 2, name: 'Ürünler', item: `${frontEndUrl}/urunler` },
      ],
    },
    null,
    2,
  ),
);

const itemListJsonLd = computed(() => {
  const items = (allProducts || []).slice(0, 10).map((p: any, idx: number) => ({
    '@type': 'ListItem',
    position: idx + 1,
    url: `${frontEndUrl}/urun/${p.slug}`,
    name: p.name,
  }));
  return JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Tüm Ürünler',
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
    { type: 'application/ld+json', innerHTML: itemListJsonLd.value },
  ],
}));

const isFilterOpen = ref(false);
const isSortOpen = ref(false);
const gridCols = ref(2);

const gridClass = computed(() => {
  if (gridCols.value === 1) return 'grid-cols-1';
  return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
});
</script>

<template>
  <div class="container pb-20">
    <CategoryScroll />
    
    <div class="flex items-start gap-16" v-if="hasProducts">
      <!-- Desktop Sidebar Filters -->
      <Filters v-if="storeSettings.showFilters" class="hidden lg:block sticky top-24 min-w-[280px]" />

      <div class="w-full">
        <div class="flex items-center justify-between w-full gap-4 mt-4 mb-6 md:gap-8">
          <ProductResultCount />
          <div class="flex items-center gap-2">
            <OrderByDropdown class="hidden md:inline-flex" v-if="storeSettings.showOrderByDropdown" />
            <div class="flex gap-2 border rounded-md p-1 bg-muted/20">
              <button 
                @click="gridCols = 1" 
                class="p-1.5 rounded transition-colors"
                :class="gridCols === 1 ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'">
                <Icon name="lucide:layout-list" class="w-4 h-4" />
              </button>
              <button 
                @click="gridCols = 2" 
                class="p-1.5 rounded transition-colors"
                :class="gridCols === 2 ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'">
                <Icon name="lucide:layout-grid" class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        
        <ProductGrid :grid-class="gridClass" />
      </div>
    </div>
    <NoProductsFound v-else>No products found. Please try adjusting your filters or check back later.</NoProductsFound>

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
            <SheetClose class="p-2 -mr-2 rounded-full hover:bg-muted">
              <Icon name="lucide:x" class="w-5 h-5" />
            </SheetClose>
          </div>
          <div class="flex-1 overflow-y-auto p-4">
            <Filters />
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
            <SheetClose>
              <Icon name="lucide:x" class="w-5 h-5" />
            </SheetClose>
          </div>
          <OrderByDropdown :is-mobile="true" @close="isSortOpen = false" />
        </div>
      </SheetContent>
    </Sheet>
  </div>
</template>
