<script setup lang="ts">
import Card from '@/components/ui/card/Card.vue';
import CardContent from '@/components/ui/card/CardContent.vue';

const { FALLBACK_IMG } = useHelpers();
const props = defineProps({
  node: { type: Object, required: true },
  imageLoading: { type: String as PropType<'lazy' | 'eager'>, default: 'lazy' },
});
</script>

<template>
  <NuxtLink
    v-if="node"
    :to="`/urun-kategorisi/${decodeURIComponent(node.slug)}`"
    class="block group h-full"
  >
    <Card class="h-full overflow-hidden transition-all duration-300 border-none shadow-sm hover:shadow-lg hover:-translate-y-1 bg-card flex flex-col">
      <div class="relative aspect-[4/3] overflow-hidden">
        <img
          v-if="node.image?.sourceUrl"
          :src="node.image?.sourceUrl"
          :alt="node.image?.altText || node.name"
          :title="node.image?.title || node.name"
          :loading="imageLoading"
          class="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
        />
        <img
          v-else
          :src="FALLBACK_IMG"
          :alt="node.name"
          :title="node.name"
          :loading="imageLoading"
          class="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
        />
        <!-- Overlay on hover -->
        <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
      </div>
      
      <CardContent class="p-4 flex flex-col items-center justify-center flex-1 text-center bg-white">
        <h3 class="text-base font-bold text-foreground tracking-tight uppercase group-hover:text-primary transition-colors line-clamp-2">
          {{ node.name }}
        </h3>
        <span class="text-xs text-muted-foreground mt-1 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
          Ürünleri Gör
        </span>
      </CardContent>
    </Card>
  </NuxtLink>
</template>
