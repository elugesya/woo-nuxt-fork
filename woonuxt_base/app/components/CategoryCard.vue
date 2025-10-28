<script setup lang="ts">
import Card from '@/components/ui/card/Card.vue';
import CardContent from '@/components/ui/card/CardContent.vue';
import CardTitle from '@/components/ui/card/CardTitle.vue';
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
    class="block item snap-mandatory snap-x">
    <Card class="flex flex-col h-[240px] md:h-[260px] lg:h-[280px] overflow-hidden transition-shadow hover:shadow-lg">
      <CardContent class="flex flex-col items-center justify-center p-0 h-[160px] md:h-[180px] lg:h-[200px]">
        <img
          v-if="node.image?.sourceUrl"
          :src="node.image?.sourceUrl"
          :alt="node.image?.altText || node.name"
          :title="node.image?.title || node.name"
          :loading="imageLoading"
          class="object-cover w-full h-full rounded-t-xl" />
        <img
          v-else
          :src="FALLBACK_IMG"
          :alt="node.name"
          :title="node.name"
          :loading="imageLoading"
          class="object-cover w-full h-full rounded-t-xl" />
      </CardContent>
      <div class="flex-1 flex items-end justify-center">
        <CardTitle class="w-full text-center text-base md:text-lg font-bold text-foreground bg-background/80 py-2 px-2 rounded-b-xl capitalize line-clamp-2 shadow">
          {{ node.name }}
        </CardTitle>
      </div>
    </Card>
  </NuxtLink>
</template>

<style lang="postcss" scoped>
.item {
  scroll-snap-align: start;
  scroll-snap-stop: always;
  aspect-ratio: 4 / 5;
}
</style>
