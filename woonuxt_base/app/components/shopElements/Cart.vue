<script setup lang="ts">
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'

const { cart, isUpdatingCart, isShowingCart } = useCart();
</script>

<template>
  <Sheet v-model:open="isShowingCart">
    <SheetContent side="right" class="w-11/12 max-w-lg p-0 flex flex-col">
      <SheetHeader class="px-6 py-4 border-b">
        <div class="flex items-center justify-between">
          <div>
            <SheetTitle>
              {{ $t('shop.cart') }}
              <span v-if="cart?.contents?.productCount" class="text-muted-foreground"> ({{ cart?.contents?.productCount }}) </span>
            </SheetTitle>
            <SheetDescription class="sr-only">
              Your shopping cart items
            </SheetDescription>
          </div>
          <EmptyCart v-if="cart && !cart.isEmpty" class="rounded-lg shadow-sm p-1.5 hover:bg-destructive hover:text-destructive-foreground transition-colors" />
        </div>
      </SheetHeader>

      <ClientOnly>
        <template v-if="cart && !cart.isEmpty">
          <ul class="flex flex-col flex-1 gap-4 p-6 overflow-y-auto">
            <CartCard v-for="item in cart.contents?.nodes" :key="item.key" :item />
          </ul>
          <div class="px-6 pb-6 border-t pt-4">
            <NuxtLink
              to="/odeme"
              @click="isShowingCart = false">
              <Button class="w-full text-lg" size="lg">
                <span class="mx-2">{{ $t('shop.checkout') }}</span>
                <span v-html="cart.total" />
              </Button>
            </NuxtLink>
          </div>
        </template>
        <!-- Empty Cart Message -->
        <EmptyCartMessage v-else-if="cart && cart.isEmpty" />
        <!-- Cart Loading -->
        <div v-else class="flex flex-col items-center justify-center flex-1">
          <LoadingIcon />
        </div>
      </ClientOnly>
      <!-- Cart Loading Overlay -->
      <div v-if="isUpdatingCart" class="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <LoadingIcon />
      </div>
    </SheetContent>
  </Sheet>
</template>
