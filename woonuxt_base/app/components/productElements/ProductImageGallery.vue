<script setup lang="ts">
const { FALLBACK_IMG } = useHelpers();

const props = defineProps({
  mainImage: { type: Object, required: true },
  gallery: { type: Object, required: true },
  node: { type: Object as PropType<Product | Variation>, required: true },
  activeVariation: { type: Object, required: false },
});

const primaryImage = computed(() => ({
  sourceUrl: props.mainImage.sourceUrl || FALLBACK_IMG,
  title: props.mainImage.title,
  altText: props.mainImage.altText,
  databaseId: props.mainImage.databaseId,
}));

const imageToShow = ref(primaryImage.value);
const selectedImageId = ref(props.mainImage.databaseId);

const galleryImages = computed(() => {
  // Add the primary image to the start of the gallery and remove duplicates
  return [primaryImage.value, ...props.gallery.nodes].filter((img, index, self) => index === self.findIndex((t) => t?.databaseId === img?.databaseId));
});

// Progressive loading: Initially show only first 4 thumbnails, load more on scroll
const INITIAL_VISIBLE_COUNT = 4;
const visibleThumbnailCount = ref(INITIAL_VISIBLE_COUNT);
const galleryContainer = ref<HTMLElement | null>(null);

const visibleGalleryImages = computed(() => {
  return galleryImages.value.slice(0, visibleThumbnailCount.value);
});

const hasMoreImages = computed(() => {
  return visibleThumbnailCount.value < galleryImages.value.length;
});

const loadMoreImages = () => {
  if (hasMoreImages.value) {
    // Load 4 more images at a time
    visibleThumbnailCount.value = Math.min(
      visibleThumbnailCount.value + 4,
      galleryImages.value.length
    );
  }
};

// Watch for scroll events to load more images
onMounted(() => {
  if (galleryContainer.value) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && hasMoreImages.value) {
            loadMoreImages();
          }
        });
      },
      { threshold: 0.5 }
    );

    // Observe the last thumbnail to trigger loading
    const observeLastThumbnail = () => {
      const thumbnails = galleryContainer.value?.querySelectorAll('img');
      if (thumbnails && thumbnails.length > 0) {
        const lastThumbnail = thumbnails[thumbnails.length - 1];
        observer.observe(lastThumbnail);
      }
    };

    // Initial observation
    nextTick(() => {
      observeLastThumbnail();
    });

    // Re-observe when more images are loaded
    watch(visibleThumbnailCount, () => {
      nextTick(() => {
        observeLastThumbnail();
      });
    });

    onUnmounted(() => {
      observer.disconnect();
    });
  }
});

const changeImage = (image: any) => {
  if (image) {
    imageToShow.value = image;
    selectedImageId.value = image.databaseId;
  }
};

const isSelected = (image: any) => {
  return selectedImageId.value === image.databaseId;
};

watch(
  () => props.activeVariation,
  (newVal) => {
    if (newVal?.image) {
      const foundImage = galleryImages.value.find((img) => img.databaseId === newVal.image?.databaseId);
      if (foundImage) imageToShow.value = foundImage;
    }
  },
);

// Main product image - responsive sizing based on actual display dimensions
// Display size varies: ~380px on mobile, up to 600px on desktop
// Use WordPress srcSet for static builds (IPX doesn't work for remote images)
const mainImageSrcSet = computed(() => imageToShow.value?.srcSet || '');
const mainImageSizes = '(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 600px';
</script>

<template>
  <div>
    <SaleBadge :node class="absolute text-base top-4 right-4" />
    <img
      :key="imageToShow.sourceUrl"
      class="rounded-xl object-contain w-full h-auto max-w-full"
      :src="imageToShow.sourceUrl || FALLBACK_IMG"
      :srcset="mainImageSrcSet"
      :sizes="mainImageSizes"
      :alt="imageToShow.altText || node.name"
      :title="imageToShow.title || node.name"
      fetchpriority="high"
      loading="eager"
    />
    <div v-if="gallery.nodes.length" ref="galleryContainer" class="my-4 gallery-images">
      <button
        v-for="(galleryImg, index) in visibleGalleryImages"
        :key="galleryImg.databaseId"
        type="button"
        :class="[
          'cursor-pointer rounded-xl transition-all duration-200 overflow-hidden p-0 border-0 bg-transparent flex-shrink-0',
          isSelected(galleryImg) ? 'ring-2 ring-secondary ring-offset-2' : 'opacity-70 hover:opacity-100'
        ]"
        style="width: 72px; aspect-ratio: 5/6;"
        @click.prevent="changeImage(galleryImg)"
        :aria-label="`Show image ${index + 1}`"
      >
        <img
          :src="galleryImg.sourceUrl"
          :srcset="galleryImg.srcSet"
          :sizes="galleryImg.sizes || '86px'"
          :alt="galleryImg.altText || node.name"
          :title="galleryImg.title || node.name"
          :loading="index < 3 ? 'eager' : 'lazy'"
          class="w-full h-full object-cover pointer-events-none"
        />
      </button>
      <!-- Loading indicator for remaining images -->
      <div
        v-if="hasMoreImages"
        class="flex items-center justify-center rounded-xl bg-muted text-muted-foreground text-xs flex-shrink-0"
        style="width: 72px; aspect-ratio: 5/6;"
      >
        +{{ galleryImages.length - visibleThumbnailCount }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.gallery-images {
  display: flex;
  overflow: auto;
  gap: 1rem;

  &::-webkit-scrollbar {
    display: none;
  }
}

.gallery-images img {
  width: 72px;
  aspect-ratio: 5/6;
  object-fit: cover;
}

@media (min-width: 768px) {
  .gallery-images {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(72px, 1fr));

    img {
      width: 100%;
    }
  }
}
</style>
