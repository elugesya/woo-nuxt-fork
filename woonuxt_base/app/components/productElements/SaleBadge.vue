<script setup lang="ts">
import { Badge } from '@/components/ui/badge'

const { t } = useI18n()
const { node } = defineProps({
  node: { type: Object, required: true },
})

const { storeSettings } = useAppConfig()

// Parse Turkish price format (e.g., "1.299,00" or "1299,00" -> 1299.00)
const parseTurkishPrice = (priceStr: string | undefined | null | number): number => {
  if (!priceStr) return 0
  if (typeof priceStr === 'number') return priceStr
  const normalized = priceStr.replace(/\./g, '').replace(',', '.')
  return parseFloat(normalized)
}

const salePercentage = computed((): string => {
  // Try raw prices first
  let salePrice = node?.rawSalePrice ? parseFloat(node.rawSalePrice) : 0
  let regularPrice = node?.rawRegularPrice ? parseFloat(node.rawRegularPrice) : 0

  // Fall back to parsing string prices
  if (!salePrice) salePrice = parseTurkishPrice(node?.salePrice)
  if (!regularPrice) regularPrice = parseTurkishPrice(node?.regularPrice || node?.price)

  if (!salePrice || !regularPrice || regularPrice <= 0) return ''

  return Math.round(((regularPrice - salePrice) / regularPrice) * 100) + ` %`
})

const showSaleBadge = computed(() => {
  const hasSalePrice = node?.rawSalePrice || node?.salePrice
  return hasSalePrice && storeSettings.saleBadge !== 'hidden'
})

const textToDisplay = computed(() => {
  if (storeSettings?.saleBadge === 'percent') return salePercentage.value
  return t('shop.onSale') ? t('shop.onSale') : 'Sale'
})
</script>

<template>
  <Badge v-if="showSaleBadge" variant="destructive" class="z-10">
    {{ textToDisplay }}
  </Badge>
</template>
