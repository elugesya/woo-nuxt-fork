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

// Extract product info tabs content from metaData
const productInfoTabs = computed(() => {
  if (!product?.metaData || !Array.isArray(product.metaData)) return null;

  const getMetaValue = (key: string): string | null => {
    const meta = product.metaData.find((m: any) => m.key === key);
    return meta?.value || null;
  };

  return {
    usageMaintenance: getMetaValue('_usage_maintenance_content'),
    repairInstructions: getMetaValue('_repair_instructions_content'),
    warrantyConditions: getMetaValue('_warranty_conditions_content'),
  };
});

const hasProductInfoTabs = computed(() => {
  return !!(productInfoTabs.value?.usageMaintenance || productInfoTabs.value?.repairInstructions || productInfoTabs.value?.warrantyConditions);
});

// Build all available tabs with their indices
const allTabs = computed(() => {
  const tabs: Array<{ key: string; label: string; index: number }> = [];
  let currentIndex = 0;

  // Description tab
  if (product.description) {
    tabs.push({ key: 'description', label: 'Product Description', index: currentIndex++ });
  }

  // Product Info tabs (always shown if any content exists)
  if (productInfoTabs.value?.usageMaintenance) {
    tabs.push({ key: 'usage-maintenance', label: 'Usage & Maintenance', index: currentIndex++ });
  }
  if (productInfoTabs.value?.repairInstructions) {
    tabs.push({ key: 'repair-instructions', label: 'Repair Instructions', index: currentIndex++ });
  }
  if (productInfoTabs.value?.warrantyConditions) {
    tabs.push({ key: 'warranty-conditions', label: 'Warranty Conditions', index: currentIndex++ });
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
    <nav class="border-b tabs-wrapper">
      <div class="tabs flex">
        <button v-if="product.description" type="button" :class="show === getTabIndex('description') ? 'active' : ''" @click.prevent="show = getTabIndex('description')" class="tab-button">
          {{ $t('shop.productDescription') }}
        </button>
        <button v-if="productInfoTabs?.usageMaintenance" type="button" :class="show === getTabIndex('usage-maintenance') ? 'active' : ''" @click.prevent="show = getTabIndex('usage-maintenance')" class="tab-button">
          {{ $t('shop.usageMaintenance') }}
        </button>
        <button v-if="productInfoTabs?.repairInstructions" type="button" :class="show === getTabIndex('repair-instructions') ? 'active' : ''" @click.prevent="show = getTabIndex('repair-instructions')" class="tab-button">
          {{ $t('shop.repairInstructions') }}
        </button>
        <button v-if="productInfoTabs?.warrantyConditions" type="button" :class="show === getTabIndex('warranty-conditions') ? 'active' : ''" @click.prevent="show = getTabIndex('warranty-conditions')" class="tab-button">
          {{ $t('shop.warrantyConditions') }}
        </button>
        <button
          v-for="(tab, index) in customTabs"
          :key="`custom-${index}`"
          type="button"
          :class="show === getTabIndex(`custom-${index}`) ? 'active' : ''"
          @click.prevent="show = getTabIndex(`custom-${index}`)"
          class="tab-button">
          {{ tab.title }}
        </button>
        <button v-if="storeSettings.showReviews" type="button" :class="show === getTabIndex('reviews') ? 'active' : ''" @click.prevent="show = getTabIndex('reviews')" class="tab-button">
          {{ $t('shop.reviews') }} ({{ product.reviewCount }})
        </button>
      </div>
    </nav>
    <div class="tab-contents">
      <div v-if="show === getTabIndex('description') && product.description" class="font-light mt-8 prose" v-html="product.description" />
      <div v-if="show === getTabIndex('usage-maintenance') && productInfoTabs?.usageMaintenance" class="font-light mt-8 prose" v-html="productInfoTabs.usageMaintenance" />
      <div v-if="show === getTabIndex('repair-instructions') && productInfoTabs?.repairInstructions" class="font-light mt-8 prose" v-html="productInfoTabs.repairInstructions" />
      <div v-if="show === getTabIndex('warranty-conditions') && productInfoTabs?.warrantyConditions" class="font-light mt-8 prose" v-html="productInfoTabs.warrantyConditions" />
      <template v-for="(tab, index) in customTabs" :key="`custom-content-${index}`">
        <div v-if="show === getTabIndex(`custom-${index}`)" class="font-light mt-8 prose" v-html="tab.content" />
      </template>
      <ProductReviews v-if="show === getTabIndex('reviews')" :product="product" />
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.tabs-wrapper {
  @apply overflow-x-auto overflow-y-hidden;
  scrollbar-width: thin;
  -webkit-overflow-scrolling: touch;
}

.tabs-wrapper::-webkit-scrollbar {
  height: 4px;
}

.tabs-wrapper::-webkit-scrollbar-track {
  @apply bg-secondary/30;
}

.tabs-wrapper::-webkit-scrollbar-thumb {
  @apply bg-muted-foreground/30 rounded-full;
}

.tabs {
  @apply gap-4 md:gap-8 min-w-max;
}

.tab-button {
  @apply border-transparent border-b-2 text-base md:text-lg pb-4 md:pb-8 whitespace-nowrap;
  margin-bottom: -1px;
  transition: color 150ms ease, border-color 150ms ease;
}

.tab-button.active {
  @apply border-primary text-primary;
}

.tab-button:hover:not(.active) {
  @apply text-foreground/80;
}
</style>
