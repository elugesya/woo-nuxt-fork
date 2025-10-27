<script setup>
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

const { cart } = useCart()
const props = defineProps({
  disabled: { type: Boolean, default: false },
})
const isLoading = ref(false)
const { t } = useI18n()
const addToCartButtonText = computed(() => (isLoading.value ? t('shop.adding') : t('shop.addToCart')))

// stop loading when cart is updated
watch(cart, (val) => {
  isLoading.value = false
})
</script>

<template>
  <Button
    type="submit"
    :disabled="props.disabled || isLoading"
    @click="isLoading = true"
    class="min-w-[150px]"
  >
    <Spinner v-if="isLoading" size="sm" class="mr-2" />
    <span>{{ addToCartButtonText }}</span>
  </Button>
</template>
