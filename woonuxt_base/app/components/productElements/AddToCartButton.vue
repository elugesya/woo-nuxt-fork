<script setup>
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

const { cart, isUpdatingCart } = useCart()
const props = defineProps({
  disabled: { type: Boolean, default: false },
})
const { t } = useI18n()
const addToCartButtonText = computed(() => (isUpdatingCart.value ? t('shop.adding') : t('shop.addToCart')))
</script>

<template>
  <Button
    type="submit"
    :disabled="props.disabled || isUpdatingCart"
    class="min-w-[150px] text-white"
  >
    <Spinner v-if="isUpdatingCart" size="sm" class="mr-2" />
    <span>{{ addToCartButtonText }}</span>
  </Button>
</template>
