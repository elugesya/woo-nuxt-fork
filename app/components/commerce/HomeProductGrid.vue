<script setup lang="ts">
/**
 * 🌊 HomeProductGrid - Marine Themed
 *
 * Responsive grid layout for product cards.
 * Uses the same ProductCard component as all other pages.
 */
import { cn } from '@/lib/utils';

interface HomeProductGridProps {
  products: Product[];
  columns?: 2 | 3 | 4 | 5;
  class?: string;
}

const props = withDefaults(defineProps<HomeProductGridProps>(), {
  columns: 4,
});

// Column classes for responsive grid
const columnClasses: Record<number, string> = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
};
</script>

<template>
  <div
    :class="cn(
      'grid gap-4 md:gap-6',
      columnClasses[columns],
      props.class
    )"
  >
    <ProductCard
      v-for="(product, index) in products"
      :key="product.databaseId || product.id"
      :node="product"
      :index="index"
    />
  </div>
</template>
