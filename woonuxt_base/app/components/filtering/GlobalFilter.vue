<script setup lang="ts">
import { Checkbox } from '@/components/ui/checkbox'
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
  <div class="cursor-pointer flex font-semibold mt-8 leading-none justify-between items-center text-foreground" @click="isOpen = !isOpen">
    <span>{{ filterTitle }}</span>
    <Icon name="ion:chevron-down-outline" class="transform" :class="isOpen ? 'rotate-180' : ''" />
  </div>
  <div v-show="isOpen" class="mt-3 mr-1 max-h-[240px] grid gap-1 overflow-auto custom-scrollbar">
    <div v-for="term in attribute.terms" :key="term.slug" class="flex gap-2 items-center">
      <Checkbox :id="term.slug" v-model:checked="selectedTerms" :value="term.slug" @update:checked="checkboxChanged" />
      <label :for="term.slug" class="cursor-pointer m-0 text-sm flex items-center flex-wrap">
        <span v-html="term.name" />
        <small v-if="attribute.showCount" class="ml-1 text-muted-foreground tabular-nums" aria-hidden="true">({{ term.count || 0 }})</small>
      </label>
    </div>
  </div>
</template>
