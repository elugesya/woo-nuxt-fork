<script setup lang="ts">
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { ChevronDown } from 'lucide-vue-next'

const { getFilter, setFilter, isFiltersActive } = useFiltering();

const { attribute } = defineProps({
  attribute: { type: Object, required: true },
});

const selectedTerms = ref(getFilter(attribute.slug) || []);
const filterTitle = ref(attribute.label || attribute.slug);
const isOpen = ref(attribute.openByDefault);

watch(isFiltersActive, () => {
  // uncheck all checkboxes when filters are cleared
  if (!isFiltersActive.value) selectedTerms.value = [];
});

// Update the URL when the checkbox is changed
const checkboxChanged = () => {
  setFilter(attribute.slug, selectedTerms.value);
};
</script>

<template>
  <div>
    <button 
      class="flex w-full cursor-pointer items-center justify-between py-4 font-medium transition-all hover:text-primary"
      @click="isOpen = !isOpen">
      <span>{{ filterTitle }}</span>
      <ChevronDown class="h-4 w-4 shrink-0 transition-transform duration-200" :class="isOpen ? 'rotate-180' : ''" />
    </button>
    <div v-show="isOpen" class="mt-2 pb-4">
      <div class="grid grid-cols-6 gap-2 max-h-[240px] overflow-auto">
        <div v-for="color in attribute.terms" :key="color.slug" :title="color.name">
          <input 
            :id="color.slug" 
            v-model="selectedTerms" 
            class="peer sr-only" 
            type="checkbox" 
            :value="color.slug" 
            @change="checkboxChanged" />
          <label 
            :for="color.slug" 
            class="flex aspect-square cursor-pointer items-center justify-center rounded-md border-2 transition-all hover:scale-110 peer-checked:ring-2 peer-checked:ring-primary peer-checked:ring-offset-2"
            :style="{
              backgroundColor: color.slug,
              borderColor: selectedTerms.includes(color.slug) ? '#6366f1' : '#e5e7eb',
            }">
            <span v-if="selectedTerms.includes(color.slug)" :class="color.slug === 'white' ? 'text-foreground text-xl' : 'text-white text-xl'">✓</span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Renk swatchları için özel stil yok, hepsi inline style ile ayarlanıyor. */
</style>
