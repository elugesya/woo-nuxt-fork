<script setup>
import { Button } from '@/components/ui/button'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'
const { getOrderQuery, setOrderQuery } = await useSorting();
const { storeSettings } = useAppConfig();
const selectedOrder = ref(getOrderQuery());
const orderby = ref(selectedOrder.value.orderBy || 'date');
const order = ref(selectedOrder.value.order);

// Update the URL when the checkbox is changed
watch([orderby, order], () => {
  setOrderQuery(orderby.value, order.value);
});
</script>

<template>
  <div class="inline-flex ml-auto -space-x-px shadow-sm rounded-m isolate">
    <Button
      variant="outline"
      class="rounded-l-md"
      aria-label="Sort"
      @click="order = order === 'ASC' ? 'DESC' : 'ASC'">
      <Icon name="ion:filter-outline" size="18" :class="order === 'ASC' ? 'rotate-180' : ''" class="transition-transform transform transform-origin-center" />
    </Button>
    <Select v-model="orderby">
      <SelectTrigger class="rounded-l-none min-w-[120px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="date">{{ $t('general.latest') }}</SelectItem>
        <SelectItem value="alphabetically">{{ $t('general.alphabetically') }}</SelectItem>
        <SelectItem value="price">{{ $t('shop.price') }}</SelectItem>
        <SelectItem v-if="storeSettings.showReviews" value="rating">{{ $t('shop.rating') }}</SelectItem>
        <SelectItem value="discount">{{ $t('shop.discount') }}</SelectItem>
      </SelectContent>
    </Select>
  </div>
</template>
