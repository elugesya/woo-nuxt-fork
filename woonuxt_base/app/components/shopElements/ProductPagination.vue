<script setup lang="ts">
const route = useRoute();
const { productsPerPage } = useHelpers();
const { products } = useProducts();

// Determine the base path based on current route
const getBasePath = computed(() => {
  const path = route.path;
  // Handle different route patterns
  if (path.includes('/urun-kategorisi/')) {
    const slug = route.params.slug || route.params.categorySlug;
    return `/urun-kategorisi/${slug}/sayfa`;
  }
  if (path.includes('/product-category/')) {
    const slug = route.params.slug || route.params.categorySlug;
    return `/product-category/${slug}/page`;
  }
  if (path.includes('/shop/brand/')) {
    const slug = route.params.slug;
    return `/shop/brand/${slug}/page`;
  }
  // Default products listing
  return '/urunler/sayfa';
});

const currentQuery = computed(() => {
  const query = route.query;
  const queryKeys = Object.keys(query);
  let queryString = '';
  if (queryKeys.length > 0) {
    queryKeys.forEach((key, index) => {
      queryString += index === 0 ? `${key}=${query[key]}` : `&${key}=${query[key]}`;
    });
  }
  return decodeURIComponent(queryString);
});

const page = ref(route.params.pageNumber ? parseInt(route.params.pageNumber as string) : 1);
const numberOfPages = computed<number>(() => Math.ceil(products.value.length / productsPerPage || 1));

const buildUrl = (pageNumber: number) => {
  const querySuffix = currentQuery.value ? `?${currentQuery.value}` : '';
  if (pageNumber === 1) {
    // First page goes to base route without page number
    const basePath = getBasePath.value.replace(/\/sayfa$|\/page$/, '');
    return `${basePath}${querySuffix}`;
  }
  return `${getBasePath.value}/${pageNumber}${querySuffix}`;
};

const prevSrc = (pageNumber: number) => {
  return buildUrl(pageNumber > 1 ? pageNumber - 1 : 1);
};

const nextSrc = (pageNumber: number) => {
  return buildUrl(pageNumber < numberOfPages.value ? pageNumber + 1 : numberOfPages.value);
};

const numberSrc = (pageNumber: number) => {
  return buildUrl(pageNumber);
};

// Generate page numbers to show (limited display for many pages)
const visiblePages = computed(() => {
  const total = numberOfPages.value;
  const current = page.value;
  const pages: (number | string)[] = [];

  if (total <= 7) {
    // Show all pages if 7 or fewer
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    // Always show first page
    pages.push(1);

    if (current > 3) pages.push('...');

    // Show pages around current
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    for (let i = start; i <= end; i++) pages.push(i);

    if (current < total - 2) pages.push('...');

    // Always show last page
    pages.push(total);
  }

  return pages;
});
</script>

<template>
  <div class="flex justify-center mt-8 mb-16 col-span-full tabular-nums">
    <!-- Pagination -->
    <nav v-if="numberOfPages && numberOfPages > 1" class="inline-flex self-end -space-x-px rounded-md shadow-sm isolate" aria-label="Pagination">
      <!-- PREV -->
      <NuxtLink
        :to="prevSrc(page)"
        class="prev"
        :class="{ 'cursor-not-allowed pointer-events-none': page == 1 }"
        :aria-disabled="page == 1"
        aria-label="Önceki">
        <Icon name="ion:chevron-back-outline" size="20" class="w-5 h-5" />
      </NuxtLink>

      <!-- NUMBERS -->
      <template v-for="(item, index) in visiblePages" :key="index">
        <span v-if="item === '...'" class="ellipsis">
          ...
        </span>
        <NuxtLink
          v-else
          :to="numberSrc(item as number)"
          :aria-current="(item as number) === page ? 'page' : undefined"
          class="page-number">
          {{ item }}
        </NuxtLink>
      </template>

      <!-- NEXT -->
      <NuxtLink
        :to="nextSrc(page)"
        class="next"
        :class="{ 'cursor-not-allowed pointer-events-none': page === numberOfPages }"
        :aria-disabled="page === numberOfPages"
        aria-label="Sonraki">
        <Icon name="ion:chevron-forward-outline" size="20" class="w-5 h-5" />
      </NuxtLink>
    </nav>
  </div>
</template>

<style scoped>
.prev,
.next,
.page-number,
.ellipsis {
  @apply bg-white dark:bg-gray-800 border font-medium border-gray-300 dark:border-gray-600 text-sm p-2 text-gray-500 dark:text-gray-400 relative inline-flex items-center hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-10;
}

.prev {
  @apply rounded-l-md;
}

.next {
  @apply rounded-r-md;
}

.page-number {
  @apply px-3;
}

.ellipsis {
  @apply px-3 cursor-default hover:bg-white dark:hover:bg-gray-800;
}

.page-number[aria-current='page'] {
  @apply bg-primary/10 dark:bg-primary/20 border-primary dark:border-primary border text-primary dark:text-primary z-10;
}
</style>
