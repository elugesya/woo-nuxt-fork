<script setup lang="ts">
import Input from '@/components/ui/input/Input.vue';
import Button from '@/components/ui/button/Button.vue';
const { cart, isUpdatingCoupon, applyCoupon, removeCoupon } = useCart();
const couponCode = ref<string>('');
const errorMessage = ref<string>('');

async function submitCoupon(): Promise<void> {
  const response = await applyCoupon(couponCode.value);
  if (!response.success && response.error) {
    errorMessage.value = response.error;
  } else {
    couponCode.value = '';
    errorMessage.value = '';
  }
}
</script>

<template>
  <div>
    <form class="flex gap-1" @submit.prevent="submitCoupon">
      <Input
        id="couponCode"
        v-model="couponCode"
        type="text"
        :placeholder="$t('shop.couponCode')"
        class="w-full"
        required />
      <Button
        type="submit"
        class="min-w-20 flex items-center justify-center"
        :disabled="isUpdatingCoupon">
        <LoadingIcon v-if="isUpdatingCoupon" color="currentColor" size="16" />
        <span v-else>{{ $t('general.apply') }}</span>
      </Button>
    </form>
    <Transition name="scale-y" mode="out-in">
      <div v-if="errorMessage" class="mt-2 text-xs text-red-600" v-html="errorMessage"></div>
    </Transition>
    <Transition name="scale-y" mode="out-in">
      <div v-if="cart && cart.appliedCoupons" class="text-xs font-semibold uppercase flex flex-wrap gap-2">
        <div v-for="(coupon, index) in cart.appliedCoupons" :key="coupon?.code || index" class="flex flex-wrap mt-2 flex-2">
          <div
            v-if="coupon?.code"
            class="bg-primary border-primary border rounded-md flex bg-opacity-5 border-opacity-10 text-primary leading-none p-1.5 gap-1 items-center">
            <span v-html="coupon.code" />
            <Icon name="ion:close" class="rounded-full cursor-pointer hover:bg-primary hover:text-white" @click="removeCoupon(coupon.code)" />
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
