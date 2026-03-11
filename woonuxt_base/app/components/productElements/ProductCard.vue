<script setup lang="ts">
/**
 * 🌊 ProductCard - Marine Themed
 *
 * Single product card component used across all pages.
 * Features: Sale badge, wishlist, add to cart, hover effects
 */
import { cn } from '@/lib/utils';
import { Heart, ShoppingCart, Star } from 'lucide-vue-next';

const route = useRoute();
const { storeSettings } = useAppConfig();
const { FALLBACK_IMG } = useHelpers();
const props = defineProps({
  node: { type: Object as PropType<Product>, required: true },
  index: { type: Number, default: 1 },
});

const imgWidth = 280;
const imgHeight = Math.round(imgWidth * 1.125);

// Unique ID for keys (handles products without databaseId)
const uniqueId = computed(() => props.node?.databaseId || props.node?.id || props.node?.slug || `product-${props.index}`);
const filterQuery = ref(route.query?.filter as string);
const paColor = ref(filterQuery.value?.split('pa_color[')[1]?.split(']')[0]?.split(',') || []);

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
const hoverImage = computed<string | undefined>(() => {
  const gallery = props.node?.galleryImages?.nodes;

  // Debug: log gallery data for similar products
  if (import.meta.client && props.index >= 0 && props.index < 5) {
    console.log(`[ProductCard ${props.index}] ${props.node.name}:`, {
      uniqueId: uniqueId.value,
      databaseId: props.node.databaseId,
      galleryImagesCount: gallery?.length || 0,
      galleryImages: gallery?.map(g => ({ sourceUrl: g.sourceUrl, altText: g.altText })) || [],
      hoverImage: gallery?.[1]?.sourceUrl,
      mainImage: mainImage.value
    });
  }

  if (!gallery || gallery.length < 2) return undefined;

  const hoverImg = gallery[1]?.sourceUrl;
  // Only return hover image if it's different from the main image
  if (hoverImg && hoverImg !== mainImage.value && hoverImg !== imagetoDisplay.value) {
    return hoverImg;
  }
  return undefined;
});

// Derived data
const isOnSale = computed(() => props.node?.onSale);
const inStock = computed(() => props.node?.stockStatus === 'IN_STOCK');
const categoryName = computed(() => props.node?.productCategories?.nodes?.[0]?.name);

// Parse Turkish price format (e.g., "1.299,00" or "1299,00" -> 1299.00)
// Also handles price ranges by taking the first price
const parseTurkishPrice = (priceStr: string | undefined | null | number): number => {
  if (!priceStr) return 0;

  // If it's already a number, return it
  if (typeof priceStr === 'number') return priceStr;

  // Handle price ranges like "18.900,00 - 21.499,00" - take the first price
  const pricePart = priceStr.split('-')[0].trim();

  // Remove thousand separators (dots) and replace comma with dot
  const normalized = pricePart.replace(/\./g, '').replace(',', '.');
  const parsed = parseFloat(normalized);
  return isNaN(parsed) ? 0 : parsed;
};

const regularPrice = computed(() => {
  // Try rawPrice first (numeric), then regularPrice, then price
  const rawPrice = (props.node as any)?.rawPrice;
  if (rawPrice && !isNaN(parseFloat(rawPrice))) {
    return parseFloat(rawPrice);
  }
  return parseTurkishPrice(props.node?.regularPrice || props.node?.price);
});

const salePrice = computed(() => {
  // Try rawSalePrice first (numeric), then salePrice
  const rawSalePrice = (props.node as any)?.rawSalePrice;
  if (rawSalePrice && !isNaN(parseFloat(rawSalePrice))) {
    return parseFloat(rawSalePrice);
  }
  const sale = parseTurkishPrice(props.node?.salePrice);
  return sale > 0 ? sale : undefined;
});
const savePercentage = computed(() => {
  if (!isOnSale.value || !salePrice.value || regularPrice.value <= 0) return 0;
  return Math.round(((regularPrice.value - salePrice.value) / regularPrice.value) * 100);
});

// Cart & Wishlist
const { addToCart } = useCart();
const { addToWishlist, removeFromWishlist, isInList } = useWishlist();

const isHovered = ref(false);
const isAddingToCart = ref(false);
const isWishlisted = computed(() => isInList(props.node?.databaseId));

const handleAddToCart = async (e: Event) => {
  e.preventDefault();
  e.stopPropagation();
  if (!inStock.value) return;

  isAddingToCart.value = true;
  await addToCart({ productId: props.node.databaseId!, quantity: 1 });
  setTimeout(() => { isAddingToCart.value = false; }, 500);
};

const handleWishlist = (e: Event) => {
  e.preventDefault();
  e.stopPropagation();
  const productId = props.node?.databaseId;
  if (!productId) return;

  if (isWishlisted.value) {
    removeFromWishlist(productId);
  } else {
    addToWishlist({
      databaseId: productId,
      name: props.node.name,
      slug: props.node.slug,
      image: { sourceUrl: imagetoDisplay.value },
      price: props.node.price,
      regularPrice: props.node.regularPrice,
    } as Product);
  }
};

// Format price
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};
</script>

<template>
  <article
    :class="cn(
      'group relative flex flex-col overflow-hidden rounded-xl bg-white',
      'shadow-card hover:shadow-card-hover transition-all duration-300',
      'hover:-translate-y-1',
      'dark:bg-gray-900 dark:border dark:border-gray-800',
      'max-w-[320px] mx-auto w-full'
    )"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <NuxtLink v-if="node.slug" :to="`/urun/${decodeURIComponent(node.slug)}`" :title="node.name" class="block">
      <!-- Product Image Container -->
      <div :key="`product-card-${uniqueId}-${index}`" class="relative aspect-square overflow-hidden bg-seafoam">
        <!-- Main Image -->
        <template v-if="imagetoDisplay && !isFallback">
          <NuxtImg
            :id="`main-img-${uniqueId}-${index}`"
            :key="`main-${uniqueId}-${index}-${imagetoDisplay}`"
            :width="imgWidth"
            :height="imgHeight"
            :src="imagetoDisplay"
            :alt="node.image?.altText || node.name || 'Product image'"
            :title="node.image?.title || node.name"
            :loading="index <= 3 ? 'eager' : 'lazy'"
            :sizes="`sm:${imgWidth / 2}px md:${imgWidth}px`"
            :class="cn(
              'h-full w-full object-cover transition-all duration-500',
              isHovered && hoverImage ? 'opacity-0' : 'opacity-100'
            )"
          />
          <!-- Hover Image -->
          <NuxtImg
            v-if="hoverImage"
            :id="`hover-img-${uniqueId}-${index}`"
            :key="`hover-${uniqueId}-${index}-${hoverImage}`"
            :width="imgWidth"
            :height="imgHeight"
            :src="hoverImage"
            :alt="`${node.name} - Hover`"
            class="absolute inset-0 h-full w-full object-cover opacity-0 transition-all duration-500 group-hover:opacity-100"
            loading="lazy"
          />
        </template>
        <template v-else>
          <img
            :width="imgWidth"
            :height="imgHeight"
            src="/images/placeholder.jpg"
            :alt="node.name || 'Product image'"
            :title="node.name"
            :loading="index <= 3 ? 'eager' : 'lazy'"
            class="h-full w-full object-cover"
          />
        </template>

        <!-- Sale Badge -->
        <span
          v-if="isOnSale"
          :class="cn(
            'absolute top-3 left-3 z-10 px-3 py-1 text-xs font-bold uppercase tracking-wide rounded-full',
            'bg-gradient-to-r from-accent to-coral-light text-white'
          )"
        >
          %{{ savePercentage }} İndirim
        </span>

        <!-- Out of Stock Overlay -->
        <div
          v-if="!inStock"
          class="absolute inset-0 flex items-center justify-center bg-black/40"
        >
          <span class="px-4 py-2 text-sm font-bold text-white bg-gray-900/80 rounded-lg">
            Stokta Yok
          </span>
        </div>

        <!-- Action Buttons (appear on hover) -->
        <div
          :class="cn(
            'absolute right-3 top-3 flex flex-col gap-2 transition-all duration-300',
            isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
          )"
        >
          <!-- Wishlist Button -->
          <button
            type="button"
            :class="cn(
              'flex h-10 w-10 items-center justify-center rounded-full',
              'bg-white/90 backdrop-blur-sm shadow-md',
              'transition-all duration-200 hover:scale-110',
              'dark:bg-gray-800',
              isWishlisted ? 'text-accent' : 'text-muted-foreground hover:text-accent'
            )"
            @click="handleWishlist"
            :aria-label="isWishlisted ? 'Favorilerden çıkar' : 'Favorilere ekle'"
          >
            <Heart :class="cn('w-5 h-5', isWishlisted && 'fill-current')" />
          </button>
        </div>

        <!-- Add to Cart Button (appears on hover) -->
        <div
          :class="cn(
            'absolute bottom-0 left-0 right-0 p-3 transition-all duration-300',
            isHovered && inStock ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
          )"
        >
          <button
            type="button"
            :disabled="isAddingToCart || !inStock"
            :class="cn(
              'flex w-full items-center justify-center gap-2 rounded-lg',
              'bg-gradient-to-r from-secondary to-secondary-light',
              'px-4 py-3 text-sm font-semibold text-white',
              'transition-all duration-200 hover:shadow-ocean',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )"
            @click="handleAddToCart"
          >
            <ShoppingCart :class="cn('w-5 h-5', isAddingToCart && 'animate-bounce')" />
            {{ isAddingToCart ? 'Ekleniyor...' : 'Sepete Ekle' }}
          </button>
        </div>
      </div>

      <!-- Product Info -->
      <div class="flex flex-col p-4">
        <!-- Category -->
        <span
          v-if="categoryName"
          class="text-xs font-medium uppercase tracking-wide text-secondary mb-1"
        >
          {{ categoryName }}
        </span>

        <!-- Product Name -->
        <h2 class="font-semibold text-foreground line-clamp-2 group-hover:text-secondary transition-colors">
          {{ node.name }}
        </h2>

        <!-- Rating -->
        <div
          v-if="storeSettings.showReviews && node.averageRating"
          class="flex items-center gap-1 mt-2"
        >
          <div class="flex items-center">
            <Star
              v-for="i in 5"
              :key="i"
              :class="cn(
                'w-4 h-4',
                i <= Math.floor(node.averageRating || 0)
                  ? 'text-amber-400 fill-amber-400'
                  : 'text-gray-300'
              )"
            />
          </div>
          <span class="text-xs text-muted-foreground">
            ({{ node.reviewCount || 0 }})
          </span>
        </div>

        <!-- Price -->
        <div class="mt-3">
          <!-- Sale Price Display -->
          <template v-if="isOnSale && salePrice">
            <div class="flex flex-wrap items-center gap-2">
              <span class="text-sm text-muted-foreground line-through">
                ₺{{ formatPrice(regularPrice) }}
              </span>
              <span class="text-lg font-bold text-accent">
                ₺{{ formatPrice(salePrice) }}
              </span>
            </div>
          </template>
          <!-- Regular Price Display -->
          <template v-else>
            <span class="text-lg font-bold text-primary">
              ₺{{ formatPrice(regularPrice) }}
            </span>
          </template>
        </div>
      </div>
    </NuxtLink>
  </article>
</template>
