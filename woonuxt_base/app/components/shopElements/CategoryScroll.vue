<script setup lang="ts">
const { data } = await useAsyncGql('getProductCategories', { first: 20 });
const categories = computed(() => data.value?.productCategories?.nodes || []);
</script>

<template>
  <div class="w-full overflow-x-auto no-scrollbar py-2 mb-4">
    <div class="flex gap-3 px-4 min-w-max">
      <NuxtLink
        to="/urunler"
        class="px-4 py-2 text-sm font-medium rounded-full bg-muted/50 border border-transparent hover:bg-primary hover:text-primary-foreground transition-colors"
        active-class="!bg-primary !text-primary-foreground">
        {{ $t('general.all') }}
      </NuxtLink>
      <NuxtLink
        v-for="category in categories"
        :key="category.databaseId"
        :to="`/urun-kategorisi/${category.slug}`"
        class="px-4 py-2 text-sm font-medium rounded-full bg-muted/50 border border-transparent hover:bg-primary hover:text-primary-foreground transition-colors"
        active-class="!bg-primary !text-primary-foreground">
        {{ category.name }}
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
