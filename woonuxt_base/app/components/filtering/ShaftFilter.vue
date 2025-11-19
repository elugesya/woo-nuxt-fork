<script setup lang="ts">
import { Checkbox } from '@/components/ui/checkbox'

const { getFilter, setFilter, isFiltersActive } = useFiltering();

const { terms } = defineProps({
  terms: { type: Array, default: () => [] },
});

const selectedTerms = ref(getFilter('pa_saft') || []);
const filterTitle = ref('Şaft');
const isOpen = ref(true);

watch(isFiltersActive, () => {
  // uncheck all checkboxes when filters are cleared
  if (!isFiltersActive.value) selectedTerms.value = [];
});

// Update the URL when the checkbox is changed
const checkboxChanged = () => {
  setFilter('pa_saft', selectedTerms.value);
};
</script>

<template>
  <div v-if="terms && terms.length">
    <div class="cursor-pointer flex font-semibold mt-8 leading-none justify-between items-center text-foreground" @click="isOpen = !isOpen">
      <span>{{ filterTitle }}</span>
      <Icon name="ion:chevron-down-outline" class="transform" :class="isOpen ? 'rotate-180' : ''" />
    </div>
    <div v-show="isOpen" class="mt-3 mr-1 max-h-[240px] grid gap-1.5 overflow-auto custom-scrollbar">
      <div v-for="term in terms" :key="term.slug" class="flex gap-2 items-start">
        <Checkbox
          :id="term.slug"
          :checked="selectedTerms.includes(term.slug)"
          @update:checked="val => {
            if (val) {
              if (!selectedTerms.includes(term.slug)) selectedTerms.push(term.slug)
            } else {
              selectedTerms = selectedTerms.filter(s => s !== term.slug)
            }
            checkboxChanged()
          }"
        />
        <label :for="term.slug" class="cursor-pointer m-0 text-sm flex-1 leading-tight">
          <span v-html="term.name" />
          <small class="ml-1 text-muted-foreground tabular-nums" aria-hidden="true">({{ term.count || 0 }})</small>
        </label>
      </div>
    </div>
  </div>
</template>
