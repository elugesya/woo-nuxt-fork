<script setup>
const { getFilter, setFilter, isFiltersActive } = useFiltering();
const checked = ref(false);

onMounted(() => {
  // Varsayılan olarak seçili
  checked.value = true;
  setFilter('stock', ['IN_STOCK']);
});

const isOpen = ref(true);

watch(isFiltersActive, () => {
  if (!isFiltersActive.value) checked.value = false;
});

const checkboxClicked = (e) => {
  checked.value = e.target.checked;
  if (checked.value) {
    setFilter('stock', ['IN_STOCK']);
  } else {
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
        <input id="stock-instock" v-model="checked" type="checkbox" aria-label="Sadece Stoktakiler" @change="checkboxClicked" />
      </div>
    </div>
  </div>
</template>
