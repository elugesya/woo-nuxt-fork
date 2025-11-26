<script setup lang="ts">
const emit = defineEmits(['open-filters', 'open-sort']);
</script>

<template>
  <div class="fixed bottom-0 left-0 z-50 w-full bg-background/80 backdrop-blur-md border-t border-border md:hidden safe-area-pb">
    <div class="grid grid-cols-2 divide-x divide-border">
      <button
        @click="emit('open-sort')"
        class="flex items-center justify-center gap-2 py-4 text-sm font-medium transition-colors hover:bg-muted/50 active:bg-muted">
        <Icon name="lucide:arrow-up-down" class="w-4 h-4" />
        {{ $t('general.sortBy') }}
      </button>
      <button
        @click="emit('open-filters')"
        class="flex items-center justify-center gap-2 py-4 text-sm font-medium transition-colors hover:bg-muted/50 active:bg-muted">
        <Icon name="lucide:sliders-horizontal" class="w-4 h-4" />
        {{ $t('general.filters') }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.safe-area-pb {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
