<template>
  <Card v-if="cart" class="mb-8 w-full min-h-[280px] max-h-[calc(100vh-150px)] md:max-h-[calc(100vh-180px)] overflow-y-auto relative md:max-w-md md:top-32 md:sticky border-none shadow-lg">
    <CardHeader>
      <CardTitle>{{ $t('shop.orderSummary') }}</CardTitle>
    </CardHeader>
    <CardContent>
      <ul class="flex flex-col gap-4 pr-2">
        <CartCard v-for="item in cart.contents.nodes" :key="item.key" :item />
      </ul>

      <AddCoupon class="my-6" />

      <div class="grid gap-3 text-sm">
        <div class="flex justify-between text-muted-foreground">
          <span>{{ $t('shop.subtotal') }}</span>
          <span class="text-foreground tabular-nums font-medium" v-html="cart.subtotal" />
        </div>
        <div class="flex justify-between text-muted-foreground">
          <span>{{ $t('general.shipping') }}</span>
          <span class="text-foreground tabular-nums font-medium"> {{ parseFloat(cart.shippingTotal) > 0 ? '+' : '' }} <span v-html="cart.shippingTotal"></span> </span>
        </div>
        <Transition name="scale-y" mode="out-in">
          <div v-if="cart && cart.appliedCoupons" class="flex justify-between text-muted-foreground">
            <span>{{ $t('shop.discount') }}</span>
            <span class="text-primary tabular-nums font-medium">- <span v-html="cart.discountTotal" /></span>
          </div>
        </Transition>
        
        <Separator class="my-2" />
        
        <div class="flex justify-between items-center">
          <span class="font-semibold text-base">{{ $t('shop.total') }}</span>
          <span class="text-xl font-bold text-primary tabular-nums" v-html="cart.total" />
        </div>
      </div>

      <slot></slot>

      <div v-if="isUpdatingCart" class="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-[1px] z-10">
        <LoadingIcon />
      </div>
    </CardContent>
  </Card>
</template>

<script setup>
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const { cart, isUpdatingCart } = useCart();
</script>
