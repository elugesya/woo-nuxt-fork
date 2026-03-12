<script setup lang="ts">
const { product } = defineProps({
  product: { type: Object as PropType<Product>, required: true },
});
const { storeSettings } = useAppConfig();

// Extract custom tabs from metaData
const customTabs = computed(() => {
  if (!product?.metaData || !Array.isArray(product.metaData)) return [];

  const tabs: Array<{ title: string; content: string }> = [];
  const maxTabs = 5;

  for (let i = 1; i <= maxTabs; i++) {
    const titleKey = `_custom_tab_${i}_title`;
    const contentKey = `_custom_tab_${i}_content`;

    const titleMeta = product.metaData.find((meta: any) => meta.key === titleKey);
    const contentMeta = product.metaData.find((meta: any) => meta.key === contentKey);

    if (titleMeta?.value && contentMeta?.value) {
      tabs.push({
        title: titleMeta.value,
        content: contentMeta.value
      });
    }
  }

  return tabs;
});

const hasCustomTabs = computed(() => customTabs.value.length > 0);

// Build all available tabs with their indices
const allTabs = computed(() => {
  const tabs: Array<{ key: string; label: string; index: number }> = [];
  let currentIndex = 0;

  // Description tab
  if (product.description) {
    tabs.push({ key: 'description', label: 'Product Description', index: currentIndex++ });
  }

  // Custom tabs
  customTabs.value.forEach((tab, i) => {
    tabs.push({ key: `custom-${i}`, label: tab.title, index: currentIndex++ });
  });

  // Reviews tab
  if (storeSettings.showReviews) {
    tabs.push({ key: 'reviews', label: 'Reviews', index: currentIndex });
  }

  return tabs;
});

const initialTab = allTabs.value[0]?.index ?? 0;
const show = ref(initialTab);

// Get tab index by key
const getTabIndex = (key: string): number => {
  return allTabs.value.find(t => t.key === key)?.index ?? -1;
};
</script>

<template>
  <div>
    <nav class="border-b flex gap-8 tabs">
      <button v-if="product.description" type="button" :class="show === getTabIndex('description') ? 'active' : ''" @click.prevent="show = getTabIndex('description')">
        {{ $t('shop.productDescription') }}
      </button>
      <button
        v-for="(tab, index) in customTabs"
        :key="`custom-${index}`"
        type="button"
        :class="show === getTabIndex(`custom-${index}`) ? 'active' : ''"
        @click.prevent="show = getTabIndex(`custom-${index}`)">
        {{ tab.title }}
      </button>
      <button v-if="storeSettings.showReviews" type="button" :class="show === getTabIndex('reviews') ? 'active' : ''" @click.prevent="show = getTabIndex('reviews')">
        {{ $t('shop.reviews') }} ({{ product.reviewCount }})
      </button>
    </nav>
    <div class="tab-contents">
      <div v-if="show === getTabIndex('description') && product.description" class="font-light mt-8 prose" v-html="product.description" />
      <template v-for="(tab, index) in customTabs" :key="`custom-content-${index}`">
        <div v-if="show === getTabIndex(`custom-${index}`)" class="font-light mt-8 prose" v-html="tab.content" />
      </template>
      <ProductReviews v-if="show === getTabIndex('reviews')" :product="product" />
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.tabs button {
  @apply border-transparent border-b-2 text-lg pb-8;
  margin-bottom: -1px;
}

.tabs button.active {
  @apply border-primary text-primary;
}
</style>
