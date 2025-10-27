<script setup>
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ChevronDown } from 'lucide-vue-next'

const { getFilter, setFilter, isFiltersActive } = useFiltering();
const runtimeConfig = useRuntimeConfig();
const maxPrice = runtimeConfig?.public?.MAX_PRICE || 1000;
const currencySymbol = runtimeConfig?.public?.CURRENCY_SYMBOL || '$';

const activeFilters = ref(getFilter('price'));
const price = activeFilters.value.length ? ref(activeFilters.value) : ref([0, maxPrice]);
const isOpen = ref(true);

const resetSlider = () => {
  price.value = [0, maxPrice];
};

const applyPrice = () => {
  setFilter('price', price.value);
};

watch(isFiltersActive, () => {
  if (!isFiltersActive.value) resetSlider();
});
</script>

<template>
  <div>
    <button 
      class="flex w-full cursor-pointer items-center justify-between py-4 font-medium transition-all hover:text-primary"
      @click="isOpen = !isOpen">
      <span>{{ $t('shop.price') }}</span>
      <ChevronDown class="h-4 w-4 shrink-0 transition-transform duration-200" :class="isOpen ? 'rotate-180' : ''" />
    </button>
    <div v-show="isOpen" class="pb-4 space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-2">
          <Label for="price-from" class="text-sm">{{ $t('shop.from') }}</Label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" v-html="currencySymbol" />
            <Input
              id="price-from"
              v-model="price[0]"
              type="number"
              class="pl-7"
              :placeholder="$t('shop.from')"
              min="0"
              @change="applyPrice" />
          </div>
        </div>
        <div class="space-y-2">
          <Label for="price-to" class="text-sm">{{ $t('shop.to') }}</Label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" v-html="currencySymbol" />
            <Input
              id="price-to"
              v-model="price[1]"
              type="number"
              class="pl-7"
              :placeholder="$t('shop.to')"
              :min="price[0]"
              @change="applyPrice" />
          </div>
        </div>
      </div>
      <div class="px-2 pt-2">
        <Slider 
          v-model="price" 
          :min="0" 
          :max="maxPrice" 
          :step="10"
          @update:model-value="applyPrice" />
      </div>
    </div>
  </div>
</template>
