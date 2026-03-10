<script setup lang="ts">
/**
 * 🌊 VariantColorSelectorBasic - StackZero Component (Marine Themed)
 *
 * Color picker style variant selector for product colors.
 * Source: StackZero MCP - variant-color-selector-basic
 */
import { cn } from '@/lib/utils';
import { Check } from 'lucide-vue-next';

export interface ColorVariantItem {
  id: string;
  value: string;
  color: string;
  label: string;
}

interface VariantColorSelectorBasicProps {
  modelValue: string;
  variants: ColorVariantItem[];
  label?: string;
  class?: string;
}

const props = defineProps<VariantColorSelectorBasicProps>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const handleSelect = (value: string) => {
  emit('update:modelValue', value);
};

// Calculate contrast color for check icon
const getContrastColor = (hexColor: string): string => {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? '#000000' : '#FFFFFF';
};
</script>

<template>
  <div :class="cn('space-y-2', props.class)">
    <label v-if="label" class="text-sm font-medium text-foreground">
      {{ label }}
    </label>

    <div class="flex flex-wrap gap-3">
      <button
        v-for="variant in variants"
        :key="variant.id"
        type="button"
        :class="cn(
          'relative flex flex-col items-center gap-1.5 group'
        )"
        @click="handleSelect(variant.value)"
      >
        <!-- Color Circle -->
        <div
          :class="cn(
            'w-8 h-8 rounded-full border-2 transition-all',
            'hover:scale-110',
            modelValue === variant.value
              ? 'ring-2 ring-offset-2 ring-secondary'
              : 'border-gray-300 dark:border-gray-600'
          )"
          :style="{ backgroundColor: variant.color }"
        >
          <div
            v-if="modelValue === variant.value"
            class="w-full h-full flex items-center justify-center"
          >
            <Check
              class="w-4 h-4"
              :style="{ color: getContrastColor(variant.color) }"
            />
          </div>
        </div>

        <!-- Label -->
        <span class="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
          {{ variant.label }}
        </span>
      </button>
    </div>
  </div>
</template>
