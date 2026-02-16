<script setup>
const { isFiltersActive } = await useFiltering();
const emit = defineEmits(['toggle-filters']);
</script>

<template>
  <div class="relative inline-flex -space-x-px shadow-sm rounded-m isolate">
    <button
      class="relative inline-flex items-center p-2 text-sm text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:z-20"
      aria-label="Show filters"
      @click.prevent="emit('toggle-filters')"
      title="Show filters">
      <Icon name="ion:funnel-outline" size="18" class="transition-transform transform transform-origin-center" />
    </button>
    <span class="absolute z-20 w-2.5 h-2.5 rounded-full bg-primary -top-1 -right-1" v-if="isFiltersActive" />
  </div>
</template>
