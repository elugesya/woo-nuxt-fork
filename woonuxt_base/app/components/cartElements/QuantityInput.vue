<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const { updateItemQuantity, isUpdatingCart, cart } = useCart()
const { debounce } = useHelpers()

const { item } = defineProps({ item: { type: Object, required: true } })

const productType = computed(() => (item.variation ? item.variation?.node : item.product?.node))
const quantity = ref(item.quantity)
const hasNoMoreStock = computed(() => (productType.value.stockQuantity ? productType.value.stockQuantity <= quantity.value : false))

const incrementQuantity = () => quantity.value++
const decrementQuantity = () => quantity.value--

watch(
  quantity,
  debounce(() => {
    if (quantity.value !== '') {
      updateItemQuantity(item.key, quantity.value)
    }
  }, 250),
)

const onFocusOut = () => {
  if (quantity.value === '') {
    // If the quantity is empty, set it to the cart item quantity
    const cartItem = cart.value?.contents?.nodes?.find((node) => node.key === item.key)
    if (cartItem) {
      quantity.value = cartItem.quantity
    }
  }
}
</script>

<template>
  <div class="flex items-center gap-0.5">
    <Button
      size="sm"
      variant="outline"
      title="Decrease Quantity"
      aria-label="Decrease Quantity"
      @click="decrementQuantity"
      type="button"
      class="h-8 w-8 rounded-r-none p-0"
      :disabled="isUpdatingCart || quantity <= 0"
    >
      <Icon icon="lucide:minus" class="h-3.5 w-3.5" />
    </Button>
    
    <Input
      v-model.number="quantity"
      type="number"
      min="0"
      :max="productType.stockQuantity"
      aria-label="Quantity"
      @focusout="onFocusOut"
      class="h-8 w-12 rounded-none border-x-0 text-center px-1 text-sm [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
    />
    
    <Button
      size="sm"
      variant="outline"
      title="Increase Quantity"
      aria-label="Increase Quantity"
      @click="incrementQuantity"
      type="button"
      class="h-8 w-8 rounded-l-none p-0"
      :disabled="isUpdatingCart || hasNoMoreStock"
    >
      <Icon icon="lucide:plus" class="h-3.5 w-3.5" />
    </Button>
  </div>
</template>
