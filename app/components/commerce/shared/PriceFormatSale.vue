<script setup lang="ts">
/**
 * 🌊 PriceFormatSale - StackZero Component (Marine Themed)
 *
 * Displays original price with sale price and optional save percentage.
 * Source: StackZero MCP - price-format-sale
 */
import { cn } from '@/lib/utils';
import PriceFormatBasic from './PriceFormatBasic.vue';

interface PriceFormatSaleProps {
  originalPrice: number;
  salePrice?: number;
  prefix?: string;
  showSavePercentage?: boolean;
  class?: string;
  classOriginalPrice?: string;
  classSalePrice?: string;
  classSavePercentage?: string;
}

const props = withDefaults(defineProps<PriceFormatSaleProps>(), {
  prefix: '₺',
  showSavePercentage: true,
});

const isSale = computed(() => {
  return props.salePrice !== undefined && props.salePrice < props.originalPrice;
});

const savePercentage = computed(() => {
  if (!isSale.value || !props.salePrice) return 0;
  return Math.round(((props.originalPrice - props.salePrice) / props.originalPrice) * 100);
});
</script>

<template>
  <div :class="cn('flex flex-wrap items-center gap-2', props.class)">
    <!-- Sale Price Display -->
    <template v-if="isSale">
      <!-- Original Price (strikethrough) -->
      <PriceFormatBasic
        :value="originalPrice"
        :prefix="prefix"
        :class="cn('text-sm text-muted-foreground line-through', classOriginalPrice)"
      />

      <!-- Sale Price (highlighted) -->
      <PriceFormatBasic
        :value="salePrice!"
        :prefix="prefix"
        :class="cn('text-lg font-bold text-accent', classSalePrice)"
      />

      <!-- Save Percentage Badge -->
      <span
        v-if="showSavePercentage && savePercentage > 0"
        :class="cn(
          'px-2 py-0.5 text-xs font-bold uppercase tracking-wide rounded-full',
          'bg-gradient-to-r from-accent to-coral-light text-white',
          classSavePercentage
        )"
      >
        %{{ savePercentage }} İndirim
      </span>
    </template>

    <!-- Regular Price Display -->
    <template v-else>
      <PriceFormatBasic
        :value="originalPrice"
        :prefix="prefix"
        :class="cn('text-lg font-bold text-primary', classSalePrice)"
      />
    </template>
  </div>
</template>
