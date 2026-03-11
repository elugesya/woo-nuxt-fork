<script setup lang="ts">
const props = defineProps({
  products: { type: Array, default: null },
});

// Filter out out-of-stock products
const inStockProducts = computed(() => {
  if (!props.products) return [];
  return props.products.filter((node: Product) => node?.stockStatus === 'IN_STOCK');
});
</script>

<template>
  <div v-if="inStockProducts.length" class="grid gap-8">
    <ProductCard
      v-for="(node, i) in inStockProducts"
      :key="node.databaseId || node.id || node.slug || `product-${i}`"
      class="w-full"
      :node="node"
      :index="i"
      :class="{
        hidden: i === inStockProducts.length - 1,
        'lg:block': i === inStockProducts.length - 1,
      }" />
  </div>
</template>
