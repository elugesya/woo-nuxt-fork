<script setup>
const { getFilter, setFilter, isFiltersActive } = useFiltering();
const selectedTerms = ref(getFilter('stock')?.length ? getFilter('stock') : ['IN_STOCK']);

// Varsayılan olarak filtreyi aktif et
onMounted(() => {
  if (!getFilter('stock')?.length) {
    setFilter('stock', ['IN_STOCK']);
  }
});

const isOpen = ref(true);

watch(isFiltersActive, () => {
  // uncheck all radio boxes when filters are cleared
  if (!isFiltersActive.value) selectedTerms.value = [];
});

const checkboxClicked = (e) => {
  if (selectedTerms.value.length === 0) {
    selectedTerms.value = [e.target.value];
    setFilter('stock', [e.target.value]);
  } else {
    selectedTerms.value = [];
    setFilter('stock', []);
  }
};
</script>

<template>
  <div>
    <div class="cursor-pointer flex font-semibold mt-8 leading-none justify-between items-center text-foreground" @click="isOpen = !isOpen">
      <span>Sadece Stoktakiler</span>
      <Icon name="ion:chevron-down-outline" class="transform" :class="isOpen ? 'rotate-180' : ''" />
    </div>
    <div v-if="isOpen" class="mt-3 mr-1 max-h-[240px] grid gap-1 overflow-auto custom-scrollbar">
      <div class="flex gap-2 items-center">
        <label for="stock-instock" class="cursor-pointer m-0 text-sm sr-only" aria-label="Sadece stoktakiler"> Sadece stoktakiler</label>
        <input id="stock-instock" v-model="selectedTerms" type="checkbox" :value="'IN_STOCK'" aria-label="Sadece Stoktakiler" @click="checkboxClicked" />
      </div>
    </div>
  </div>
</template>
