<script setup>
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ChevronDown } from 'lucide-vue-next'

const { getFilter, setFilter, isFiltersActive } = useFiltering();

const { min = 0, max = 500 } = defineProps({
  min: { type: Number, default: 0 },
  max: { type: Number, default: 500 },
});

const activeFilters = ref(getFilter('pa_guc'));
const power = activeFilters.value.length ? ref(activeFilters.value.map(v => Number(v))) : ref([min, max]);
const isOpen = ref(true);

const resetSlider = () => {
  power.value = [min, max];
};

const applyPower = () => {
  setFilter('pa_guc', power.value.map(v => String(v)));
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
      <span>Güç (HP)</span>
      <ChevronDown class="h-4 w-4 shrink-0 transition-transform duration-200" :class="isOpen ? 'rotate-180' : ''" />
    </button>
    <div v-show="isOpen" class="pb-4 space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-2">
          <Label for="power-from" class="text-sm">Min</Label>
          <Input
            id="power-from"
            v-model="power[0]"
            type="number"
            placeholder="Min"
            :min="min"
            @change="applyPower" />
        </div>
        <div class="space-y-2">
          <Label for="power-to" class="text-sm">Max</Label>
          <Input
            id="power-to"
            v-model="power[1]"
            type="number"
            placeholder="Max"
            :min="power[0]"
            :max="max"
            @change="applyPower" />
        </div>
      </div>
      <div class="px-2 pt-2">
        <Slider 
          v-model="power" 
          :min="min" 
          :max="max" 
          :step="5"
          @update:model-value="applyPower" />
      </div>
    </div>
  </div>
</template>
