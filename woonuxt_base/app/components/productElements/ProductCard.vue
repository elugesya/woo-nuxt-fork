<script setup lang="ts">
import { Card, CardContent } from '@/components/ui/card'

const route = useRoute();
const { storeSettings } = useAppConfig();
const { FALLBACK_IMG } = useHelpers();
const props = defineProps({
  node: { type: Object as PropType<Product>, required: true },
  index: { type: Number, default: 1 },
});

const imgWidth = 280;
const imgHeight = Math.round(imgWidth * 1.125);

// example: ?filter=pa_color[green,blue],pa_size[large]
const filterQuery = ref(route.query?.filter as string);
const paColor = ref(filterQuery.value?.split('pa_color[')[1]?.split(']')[0]?.split(',') || []);

// watch filterQuery
watch(
  () => route.query,
  () => {
    filterQuery.value = route.query.filter as string;
    paColor.value = filterQuery.value?.split('pa_color[')[1]?.split(']')[0]?.split(',') || [];
  },
);

const mainImage = computed<string>(() => props.node?.image?.producCardSourceUrl || props.node?.image?.sourceUrl || '/images/placeholder.jpg');
const imagetoDisplay = computed<string>(() => {
  if (paColor.value.length) {
    const activeColorImage = props.node?.variations?.nodes.filter((variation) => {
      const hasMatchingAttributes = variation.attributes?.nodes.some((attribute) => paColor.value.some((color) => attribute?.value?.includes(color)));
      const hasMatchingSlug = paColor.value.some((color) => variation.slug?.includes(color));
      return hasMatchingAttributes || hasMatchingSlug;
    });
    if (activeColorImage?.length) return activeColorImage[0]?.image?.producCardSourceUrl || activeColorImage[0]?.image?.sourceUrl || mainImage.value;
  }
  return mainImage.value;
});
const isFallback = computed(() => imagetoDisplay.value === FALLBACK_IMG);
</script>

<template>
  <Card class="group overflow-hidden transition-all duration-300 hover:shadow-lg">
    <NuxtLink v-if="node.slug" :to="`/urun/${decodeURIComponent(node.slug)}`" :title="node.name" class="block">
      <div class="relative overflow-hidden">
        <SaleBadge :node class="absolute top-2 right-2 z-10" />
        <template v-if="imagetoDisplay && !isFallback">
          <NuxtImg
            :width="imgWidth"
            :height="imgHeight"
            :src="imagetoDisplay"
            :alt="node.image?.altText || node.name || 'Product image'"
            :title="node.image?.title || node.name"
            :loading="index <= 3 ? 'eager' : 'lazy'"
            :sizes="`sm:${imgWidth / 2}px md:${imgWidth}px`"
            class="rounded-t-lg object-top object-cover w-full aspect-9/8 transition-transform duration-300 group-hover:scale-105"
            placeholder
            placeholder-class="blur-xl" />
        </template>
        <template v-else>
          <img
            :width="imgWidth"
            :height="imgHeight"
            src="/images/placeholder.jpg"
            :alt="node.name || 'Product image'"
            :title="node.name"
            :loading="index <= 3 ? 'eager' : 'lazy'"
            class="rounded-t-lg object-top object-cover w-full aspect-9/8 transition-transform duration-300 group-hover:scale-105" />
        </template>
      </div>
      <CardContent class="p-4">
        <StarRating v-if="storeSettings.showReviews" :rating="node.averageRating" :count="node.reviewCount" class="mb-2" />
        <h2 class="mb-2 font-light leading-tight transition-colors group-hover:text-primary line-clamp-2">{{ node.name }}</h2>
        <ProductPrice class="text-sm font-medium" :sale-price="node.salePrice" :regular-price="node.regularPrice" />
      </CardContent>
    </NuxtLink>
  </Card>
</template>
