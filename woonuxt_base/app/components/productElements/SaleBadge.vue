<script setup lang="ts">
import { Badge } from '@/components/ui/badge'

const { t } = useI18n()
const { node } = defineProps({
  node: { type: Object, required: true },
})

const { storeSettings } = useAppConfig()

const salePercentage = computed((): string => {
  if (!node?.rawSalePrice || !node?.rawRegularPrice) return ''
  const salePrice = parseFloat(node?.rawSalePrice)
  const regularPrice = parseFloat(node?.rawRegularPrice)
  return Math.round(((salePrice - regularPrice) / regularPrice) * 100) + ` %`
})

const showSaleBadge = computed(() => node.rawSalePrice && storeSettings.saleBadge !== 'hidden')

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
