<script setup lang="ts">
/**
 * 🌊 PriceFormatBasic - StackZero Component (Marine Themed)
 *
 * Formats and displays price values with currency prefix.
 * Source: StackZero MCP - price-format-basic
 */
import { cn } from '@/lib/utils';
import { useRuntimeConfig } from '#imports';

interface PriceFormatBasicProps {
  value: number;
  prefix?: string;
  thousandSeparator?: string;
  decimalSeparator?: string;
  decimalScale?: number;
  class?: string;
}

const props = withDefaults(defineProps<PriceFormatBasicProps>(), {
  prefix: '₺', // Turkish Lira default
  thousandSeparator: '.',
  decimalSeparator: ',',
  decimalScale: 2,
});

const config = useRuntimeConfig();
const currency = config.public.CURRENCY_CODE || 'TRY';

// Format the price
const formattedPrice = computed(() => {
  const { value, prefix, thousandSeparator, decimalSeparator, decimalScale } = props;

  // Handle negative values
  const isNegative = value < 0;
  const absValue = Math.abs(value);

  // Split into integer and decimal parts
  const parts = absValue.toFixed(decimalScale).split('.');
  const integerPart = parts[0];
  const decimalPart = parts[1];

  // Add thousand separators
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);

  // Combine parts
  const formatted = decimalScale > 0
    ? `${formattedInteger}${decimalSeparator}${decimalPart}`
    : formattedInteger;

  return `${isNegative ? '-' : ''}${prefix}${formatted}`;
});
</script>

<template>
  <span :class="cn('text-lg font-semibold text-primary', props.class)">
    {{ formattedPrice }}
  </span>
</template>
