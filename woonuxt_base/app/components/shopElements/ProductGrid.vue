<script setup lang="ts">
const route = useRoute();
const { productsPerPage } = useHelpers();
const { products } = useProducts();
const page = ref(parseInt(route.params.pageNumber as string) || 1);
const productsToShow = computed(() => products.value.slice((page.value - 1) * productsPerPage, page.value * productsPerPage));

const props = defineProps({
  gridClass: {
    type: String,
    default: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  },
});
</script>

<template>
  <Transition name="fade" mode="out-in">
    <section v-if="!!products.length" class="relative w-full">
      <TransitionGroup name="shrink" tag="div" mode="in-out" class="product-grid" :class="gridClass">
        <ProductCard v-for="(node, i) in productsToShow" :key="node.id || i" :node :index="i" />
      </TransitionGroup>
      <ProductPagination />
    </section>
    <NoProductsFound v-else />
  </Transition>
</template>

<style lang="postcss" scoped>
.product-grid {
  @apply my-4 min-h-[600px] grid transition-all gap-4 md:gap-8 lg:my-8;
}
.product-grid:empty {
  display: none;
}

.shrink-move {
  transition: all 400ms;
}

.shrink-leave-active {
  transition: transform 300ms;
  position: absolute;
  opacity: 0;
}

.shrink-enter-active {
  transition:
    opacity 400ms ease-out 200ms,
    transform 400ms ease-out;
  will-change: opacity, transform;
}

.shrink-enter,
.shrink-leave-to,
.shrink-enter-from {
  opacity: 0;
  transform: scale(0.75) translateY(25%);
}
</style>
