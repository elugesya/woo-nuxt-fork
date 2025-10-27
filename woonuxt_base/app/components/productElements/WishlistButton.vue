<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Icon } from '@iconify/vue'

const { addToWishlist, removeFromWishlist, isInList } = useWishlist()

const { product } = defineProps<{ product: Product }>()

const isWishlisted = computed(() => (product.databaseId ? isInList(product.databaseId) : false))

const toggleWishlist = () => (isWishlisted.value && product.databaseId ? removeFromWishlist(product.databaseId) : addToWishlist(product))
</script>

<template>
  <Button 
    type="button" 
    variant="ghost" 
    size="sm"
    class="mt-4 gap-2" 
    @click="toggleWishlist"
  >
    <Icon v-if="isWishlisted" icon="lucide:heart" class="h-4 w-4 fill-red-500 text-red-500" />
    <Icon v-else icon="lucide:heart" class="h-4 w-4" />
    <span>{{ isWishlisted ? $t('shop.wishlistRemove') : $t('shop.wishlistAdd') }}</span>
  </Button>
</template>
