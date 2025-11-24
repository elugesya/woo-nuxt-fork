<script setup lang="ts">
import { Label } from '@/components/ui/label';

const props = defineProps<{
  modelValue: string | object;
  paymentGateways: PaymentGateways;
}>();

const emits = defineEmits(['update:modelValue']);

const activeId = computed(() => {
  if (typeof props.modelValue === 'object' && props.modelValue !== null && 'id' in props.modelValue) {
    return (props.modelValue as any).id;
  }
  return props.modelValue;
});

const updatePaymentMethod = (value: any) => {
  emits('update:modelValue', value);
};

onMounted(() => {
  // Emit first payment method
  if (props.paymentGateways?.nodes.length) updatePaymentMethod(props.paymentGateways?.nodes[0]);
});
</script>

<template>
  <div class="grid gap-4">
    <div v-for="gateway in paymentGateways?.nodes" :key="gateway.id">
      <Label
        :for="gateway.id"
        class="relative flex flex-col gap-2 rounded-lg border p-4 shadow-sm cursor-pointer hover:bg-accent transition-all"
        :class="{ 'border-primary ring-1 ring-primary bg-primary/5': activeId === gateway.id }"
        @click="updatePaymentMethod(gateway)"
      >
        <div class="flex justify-between items-center w-full">
          <div class="flex items-center gap-3">
            <div class="flex items-center justify-center w-10 h-10 rounded-full bg-background border shadow-sm text-muted-foreground">
              <icon v-if="gateway.id === 'stripe'" name="ion:card-outline" size="20" />
              <icon v-else-if="gateway.id === 'paypal'" name="ion:logo-paypal" size="20" />
              <icon v-else-if="gateway.id === 'wc_alttantire'" name="ion:card-outline" size="20" />
              <icon v-else name="ion:cash-outline" size="20" />
            </div>
            <span class="font-semibold text-base" v-html="gateway.title" />
          </div>
          
          <div class="h-4 w-4 rounded-full border border-primary flex items-center justify-center">
            <div v-if="activeId === gateway.id" class="h-2.5 w-2.5 rounded-full bg-primary" />
          </div>
        </div>
        
        <div v-if="activeId === gateway.id && gateway.description" class="mt-2 pl-[3.25rem] text-sm text-muted-foreground">
           <p v-html="gateway.description" />
        </div>
      </Label>
    </div>
  </div>
</template>
