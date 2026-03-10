<script setup lang="ts">
/**
 * 🌊 VariantSelectorBasic - StackZero Component (Marine Themed)
 *
 * Radio group style variant selector for product options.
 * Source: StackZero MCP - variant-selector-basic
 */
import { cn } from '@/lib/utils';

export interface VariantItem {
  id: string;
  value: string;
  label: string;
  disabled?: boolean;
}

interface VariantSelectorBasicProps {
  modelValue: string;
  variants: VariantItem[];
  label?: string;
  class?: string;
  itemClass?: string;
}

const props = defineProps<VariantSelectorBasicProps>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const handleSelect = (value: string) => {
  emit('update:modelValue', value);
};
</script>

<template>
  <div :class="cn('space-y-2', props.class)">
    <label v-if="label" class="text-sm font-medium text-foreground">
      {{ label }}
    </label>

    <div class="flex flex-wrap gap-2">
      <button
        v-for="variant in variants"
        :key="variant.id"
        type="button"
        :disabled="variant.disabled"
        :class="cn(
          'min-w-[80px] px-4 py-2 rounded-lg border text-sm font-medium transition-all',
          'hover:border-secondary hover:bg-seafoam',
          'dark:border-gray-600 dark:hover:bg-gray-700',
          modelValue === variant.value
            ? 'border-secondary bg-secondary/10 text-secondary ring-2 ring-secondary/20'
            : 'border-border bg-white text-foreground dark:bg-gray-800',
          variant.disabled && 'opacity-50 cursor-not-allowed'
        )"
        @click="handleSelect(variant.value)"
      >
        {{ variant.label }}
      </button>
    </div>
  </div>
</template>
