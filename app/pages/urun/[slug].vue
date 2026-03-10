<script lang="ts" setup>
/**
 * 🌊 Product Detail Page - Marine Themed
 *
 * Premium product detail page with ocean-inspired styling.
 * Uses existing WooNuxt composables for backend logic.
 */
import { StockStatusEnum, ProductTypesEnum, type AddToCartInput } from '#gql/default';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Heart, Share2, ShoppingCart, ShieldCheck, Truck, RotateCcw, ChevronRight, Anchor, Waves } from 'lucide-vue-next';

const route = useRoute();
const { storeSettings, siteName } = useAppConfig();
const { arraysEqual, formatArray, checkForVariationTypeOfAny, frontEndUrl } = useHelpers();
const { addToCart, isUpdatingCart } = useCart();
const { t } = useI18n();
const { trackViewItem, trackAddToCart } = useGoogleAnalytics();
const { trackViewContent } = useTikTokPixel();
const slug = route.params.slug as string;

const { data } = await useAsyncGql('getProduct', { slug });
if (!data.value?.product) {
  throw showError({ statusCode: 404, statusMessage: t('shop.productNotFound') });
}

const product = ref<Product>(data?.value?.product);
const quantity = ref<number>(1);
const activeVariation = ref<Variation | null>(null);
const variation = ref<VariationAttribute[]>([]);
const variationId = ref<number | null>(null);
const variationAttributes = ref<any[] | null>(null);
const indexOfTypeAny = computed<number[]>(() => checkForVariationTypeOfAny(product.value));
const attrValues = ref();
const isSimpleProduct = computed<boolean>(() => product.value?.type === ProductTypesEnum.SIMPLE);
const isVariableProduct = computed<boolean>(() => product.value?.type === ProductTypesEnum.VARIABLE);
const isExternalProduct = computed<boolean>(() => product.value?.type === ProductTypesEnum.EXTERNAL);

const type = computed(() => activeVariation.value || product.value);
const selectProductInput = computed<AddToCartInput>(() => ({
  productId: type.value?.databaseId ?? 0,
  quantity: quantity.value,
  variationId: variationId.value,
  variation: variationAttributes.value
}));

const mergeLiveStockStatus = (payload: Product): void => {
  product.value.stockStatus = payload.stockStatus ?? product.value?.stockStatus;
  payload.variations?.nodes?.forEach((variation: Variation, index: number) => {
    if (product.value?.variations?.nodes[index]) {
      product.value.variations.nodes[index].stockStatus = variation.stockStatus;
    }
  });
};

onMounted(async () => {
  try {
    const { data } = await useAsyncGql('getStockStatus', { slug });
    if (data.value?.product) mergeLiveStockStatus(data.value.product as Product);
  } catch (error: any) {
    const errorMessage = error?.gqlErrors?.[0].message;
    if (errorMessage) console.error(errorMessage);
  }

  if (product.value) {
    trackViewItem(product.value);
    trackViewContent(product.value);
  }
});

const updateSelectedVariations = (variations: VariationAttribute[]): void => {
  if (!product.value.variations) return;

  attrValues.value = variations.map((el) => ({ attributeName: el.name, attributeValue: el.value }));
  const clonedVariations = JSON.parse(JSON.stringify(variations));
  const getActiveVariation = product.value.variations?.nodes.filter((variation: any) => {
    if (variation.attributes) {
      indexOfTypeAny.value.forEach((index) => (clonedVariations[index].value = ''));
      return arraysEqual(formatArray(variation.attributes.nodes), formatArray(clonedVariations));
    }
  });

  activeVariation.value = getActiveVariation?.[0] || null;
  variationId.value = activeVariation.value?.databaseId ?? null;
  variationAttributes.value = activeVariation.value ? attrValues.value : null;
  variation.value = variations;
};

const stockStatus = computed(() => {
  if (isVariableProduct.value) {
    return activeVariation.value?.stockStatus ?? type.value?.stockStatus ?? StockStatusEnum.OUT_OF_STOCK;
  }
  return type.value?.stockStatus ?? StockStatusEnum.OUT_OF_STOCK;
});

const disabledAddToCart = computed(() => {
  const isOutOfStock = stockStatus.value === StockStatusEnum.OUT_OF_STOCK;
  const isInvalidType = !type.value;
  const isCartUpdating = isUpdatingCart.value;
  const isValidActiveVariation = isVariableProduct.value ? !!activeVariation.value : true;
  return isInvalidType || isOutOfStock || isCartUpdating || !isValidActiveVariation;
});

const handleAddToCart = async () => {
  try {
    await addToCart(selectProductInput.value);
    trackAddToCart(type.value, quantity.value);
  } catch (error) {
    console.error('Error adding to cart:', error);
  }
};

// Product images for gallery
const productImages = computed(() => {
  const images: { url: string; alt?: string }[] = [];
  const main = (product.value as any)?.image?.sourceUrl || (product.value as any)?.image?.mediaItemUrl;
  if (main) images.push({ url: main, alt: product.value?.name });
  const gallery = (product.value as any)?.galleryImages?.nodes || [];
  for (const g of gallery) {
    const url = g?.sourceUrl || g?.mediaItemUrl;
    if (url) images.push({ url, alt: product.value?.name });
  }
  return images;
});

// Reviews for display
const productReviews = computed(() => {
  const reviewsData = (product.value as any)?.reviews?.edges || [];
  return reviewsData.map((edge: any) => ({
    id: edge.node?.id || Math.random().toString(),
    author: edge.node?.author?.node?.name || 'Anonim',
    rating: edge.rating || 5,
    date: edge.node?.date || new Date().toISOString(),
    content: edge.node?.content || '',
    verified: true,
  }));
});

// JSON-LD
const { stripHtml } = useHelpers();
const currencyCode = useRuntimeConfig().public?.CURRENCY_CODE || 'TRY';

const mapAvailability = (status?: StockStatusEnum | string) => {
  switch (status) {
    case StockStatusEnum.IN_STOCK: return 'https://schema.org/InStock';
    case StockStatusEnum.ON_BACKORDER: return 'https://schema.org/PreOrder';
    default: return 'https://schema.org/OutOfStock';
  }
};

const primaryCategory = computed(() => product.value?.productCategories?.nodes?.[0] || null);
const productUrl = computed(() => `${frontEndUrl}/urun/${product.value?.slug}`);
const categoryUrl = computed(() => (primaryCategory.value ? `${frontEndUrl}/urun-kategorisi/${primaryCategory.value.slug}` : `${frontEndUrl}/urunler`));

const breadcrumbJsonLd = computed(() =>
  JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: frontEndUrl },
      { '@type': 'ListItem', position: 2, name: primaryCategory.value?.name || 'Ürünler', item: categoryUrl.value },
      { '@type': 'ListItem', position: 3, name: product.value?.name, item: productUrl.value },
    ],
  }, null, 2)
);

const productJsonLd = computed(() =>
  JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.value?.name,
    description: stripHtml(product.value?.shortDescription || product.value?.description || ''),
    image: productImages.value.map(i => i.url),
    sku: product.value?.sku || undefined,
    brand: { '@type': 'Brand', name: siteName || undefined },
    offers: {
      '@type': 'Offer',
      url: productUrl.value,
      priceCurrency: currencyCode,
      price: (type.value?.salePrice || type.value?.regularPrice || '0').toString().replace(/[^0-9.]/g, ''),
      availability: mapAvailability(stockStatus.value as any),
    },
    aggregateRating: product.value?.reviewCount ? {
      '@type': 'AggregateRating',
      ratingValue: product.value.averageRating || 0,
      reviewCount: product.value.reviewCount,
    } : undefined,
  }, null, 2)
);

useHead(() => ({
  title: `${product.value?.name} - ${siteName}`,
  meta: [
    { name: 'description', content: stripHtml(product.value?.shortDescription || product.value?.description || '') },
  ],
  script: [
    { type: 'application/ld+json', innerHTML: breadcrumbJsonLd.value },
    { type: 'application/ld+json', innerHTML: productJsonLd.value },
  ],
}));

// Active tab state
const activeTab = ref<'description' | 'reviews' | 'specs'>('description');
</script>

<template>
  <main class="min-h-screen pb-32 md:pb-16">
    <SEOHead v-if="product" :info="product" />

    <!-- 🍞 Breadcrumb -->
    <div class="container-ocean py-4">
      <nav class="flex items-center gap-2 text-sm text-muted-foreground">
        <NuxtLink to="/" class="hover:text-secondary transition-colors">
          <Anchor class="w-4 h-4" />
        </NuxtLink>
        <ChevronRight class="w-4 h-4" />
        <NuxtLink to="/urunler" class="hover:text-secondary transition-colors">
          Ürünler
        </NuxtLink>
        <template v-if="primaryCategory">
          <ChevronRight class="w-4 h-4" />
          <NuxtLink
            :to="`/urun-kategorisi/${primaryCategory.slug}`"
            class="hover:text-secondary transition-colors"
          >
            {{ primaryCategory.name }}
          </NuxtLink>
        </template>
        <ChevronRight class="w-4 h-4" />
        <span class="text-foreground font-medium truncate max-w-[200px]">
          {{ product?.name }}
        </span>
      </nav>
    </div>

    <div v-if="product" class="container-ocean">
      <!-- 🖼️ Product Hero Section -->
      <div class="grid lg:grid-cols-2 gap-8 lg:gap-12 py-6">
        <!-- Product Gallery -->
        <div class="relative">
          <CommerceProductProductGallery
            v-if="productImages.length > 0"
            :images="productImages"
            :product-title="product.name"
            aspect-ratio="square"
            :show-thumbnails="true"
            thumbnail-position="bottom"
          />
          <div
            v-else
            class="aspect-square rounded-xl bg-seafoam flex items-center justify-center"
          >
            <Waves class="w-24 h-24 text-secondary/30" />
          </div>

          <!-- Badges -->
          <div class="absolute top-4 left-4 z-10 flex flex-col gap-2">
            <span
              v-if="product.onSale"
              class="px-3 py-1 text-xs font-bold uppercase rounded-full bg-gradient-to-r from-accent to-coral-light text-white"
            >
              İndirim
            </span>
            <span
              v-if="stockStatus === 'IN_STOCK'"
              class="px-3 py-1 text-xs font-bold uppercase rounded-full bg-gradient-to-r from-secondary to-secondary-light text-white"
            >
              Stokta
            </span>
          </div>
        </div>

        <!-- Product Info -->
        <div class="flex flex-col">
          <!-- Category Tag -->
          <span
            v-if="primaryCategory"
            class="text-secondary text-sm font-semibold uppercase tracking-widest mb-2"
          >
            {{ primaryCategory.name }}
          </span>

          <!-- Product Title -->
          <h1 class="text-3xl md:text-4xl font-bold text-primary dark:text-white mb-4">
            {{ type.name }}
          </h1>

          <!-- Rating & Reviews -->
          <div
            v-if="storeSettings.showReviews && product.reviewCount"
            class="flex items-center gap-4 mb-6"
          >
            <CommerceSharedStarRatingBasic
              :value="product.averageRating || 0"
              :read-only="true"
            />
            <span class="text-muted-foreground">
              ({{ product.reviewCount }} değerlendirme)
            </span>
          </div>

          <!-- Price -->
          <div class="mb-6">
            <CommerceSharedPriceFormatSale
              :original-price="parseFloat(type.regularPrice || '0')"
              :sale-price="type.salePrice ? parseFloat(type.salePrice) : undefined"
              :show-save-percentage="true"
              class="text-3xl"
              class-sale-price="text-3xl font-bold text-accent"
            />
          </div>

          <!-- Short Description -->
          <div
            v-if="product.shortDescription"
            class="prose prose-sm text-muted-foreground mb-6"
            v-html="product.shortDescription"
          />

          <!-- Variations -->
          <div
            v-if="isVariableProduct && product.attributes && product.variations"
            class="mb-6"
          >
            <AttributeSelections
              :attributes="product.attributes.nodes"
              :default-attributes="product.defaultAttributes"
              :variations="product.variations.nodes"
              @attrs-changed="updateSelectedVariations"
            />
          </div>

          <!-- Stock Status -->
          <div
            v-if="!isExternalProduct"
            :class="cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg mb-6',
              stockStatus === 'IN_STOCK'
                ? 'bg-secondary/10 text-secondary'
                : 'bg-accent/10 text-accent'
            )"
          >
            <span class="font-medium">
              {{ stockStatus === 'IN_STOCK' ? 'Stokta Mevcut' : 'Stokta Yok' }}
            </span>
          </div>

          <!-- Add to Cart Section -->
          <form
            v-if="isVariableProduct || isSimpleProduct"
            @submit.prevent="handleAddToCart"
            class="space-y-4 mb-6"
          >
            <!-- Quantity & Add to Cart -->
            <div class="flex items-center gap-4">
              <CommerceSharedQuantityInputBasic
                v-model:quantity="quantity"
                :min="1"
                :max="100"
              />
              <Button
                type="submit"
                :disabled="disabledAddToCart"
                :class="cn(
                  'flex-1 h-12 text-lg font-semibold rounded-xl',
                  'bg-gradient-ocean text-white',
                  'hover:shadow-ocean transition-all duration-300',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )"
              >
                <ShoppingCart class="w-5 h-5 mr-2" />
                {{ isUpdatingCart ? 'Ekleniyor...' : 'Sepete Ekle' }}
              </Button>
            </div>
          </form>

          <!-- External Product -->
          <a
            v-if="isExternalProduct && product.externalUrl"
            :href="product.externalUrl"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              :class="cn(
                'w-full h-12 text-lg font-semibold rounded-xl',
                'bg-gradient-coral text-white',
                'hover:shadow-lg transition-all duration-300'
              )"
            >
              {{ product?.buttonText || 'Ürünü Görüntüle' }}
            </Button>
          </a>

          <!-- Action Buttons -->
          <div class="flex items-center gap-4 mb-8">
            <WishlistButton
              v-if="storeSettings.showWishlist"
              :product="product"
            />
            <ShareButton
              v-if="storeSettings.showShare"
              :product="product"
            />
          </div>

          <!-- Trust Badges -->
          <div class="grid grid-cols-3 gap-4 p-4 bg-seafoam rounded-xl">
            <div class="flex flex-col items-center text-center">
              <Truck class="w-6 h-6 text-secondary mb-2" />
              <span class="text-xs font-medium">Ücretsiz Kargo</span>
            </div>
            <div class="flex flex-col items-center text-center">
              <ShieldCheck class="w-6 h-6 text-secondary mb-2" />
              <span class="text-xs font-medium">Güvenli Ödeme</span>
            </div>
            <div class="flex flex-col items-center text-center">
              <RotateCcw class="w-6 h-6 text-secondary mb-2" />
              <span class="text-xs font-medium">Kolay İade</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 📋 Product Tabs -->
      <div
        v-if="product.description || productReviews.length"
        class="py-12 border-t border-border"
      >
        <!-- Tab Navigation -->
        <div class="flex gap-1 p-1 bg-seafoam rounded-xl mb-8">
          <button
            type="button"
            :class="cn(
              'flex-1 py-3 px-4 rounded-lg font-medium transition-all',
              activeTab === 'description'
                ? 'bg-white text-primary shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )"
            @click="activeTab = 'description'"
          >
            Açıklama
          </button>
          <button
            v-if="productReviews.length"
            type="button"
            :class="cn(
              'flex-1 py-3 px-4 rounded-lg font-medium transition-all',
              activeTab === 'reviews'
                ? 'bg-white text-primary shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )"
            @click="activeTab = 'reviews'"
          >
            Değerlendirmeler ({{ product.reviewCount }})
          </button>
          <button
            type="button"
            :class="cn(
              'flex-1 py-3 px-4 rounded-lg font-medium transition-all',
              activeTab === 'specs'
                ? 'bg-white text-primary shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )"
            @click="activeTab = 'specs'"
          >
            Özellikler
          </button>
        </div>

        <!-- Tab Content -->
        <div class="prose prose-lg max-w-none">
          <!-- Description Tab -->
          <div v-show="activeTab === 'description'" v-html="product.description" />

          <!-- Reviews Tab -->
          <div v-show="activeTab === 'reviews'">
            <CommerceProductProductReviews
              v-if="productReviews.length"
              :reviews="productReviews"
              :average-rating="product.averageRating || 0"
              :total-reviews="product.reviewCount || 0"
            />
            <div v-else class="text-center py-12 text-muted-foreground">
              Henüz değerlendirme yok.
            </div>
          </div>

          <!-- Specs Tab -->
          <div v-show="activeTab === 'specs'">
            <div
              v-if="product.attributes?.nodes?.length"
              class="grid sm:grid-cols-2 gap-4"
            >
              <div
                v-for="attr in product.attributes.nodes"
                :key="attr.id"
                class="flex justify-between p-4 bg-seafoam rounded-lg"
              >
                <span class="font-medium text-muted-foreground">
                  {{ attr.label || attr.name }}
                </span>
                <span class="font-semibold">
                  <template v-if="attr.terms?.nodes?.length">
                    {{ attr.terms.nodes.map((t: any) => t.name).join(', ') }}
                  </template>
                  <template v-else-if="attr.options?.length">
                    {{ attr.options.join(', ') }}
                  </template>
                </span>
              </div>
            </div>
            <div v-else class="text-center py-12 text-muted-foreground">
              Özellik bilgisi mevcut değil.
            </div>
          </div>
        </div>
      </div>

      <!-- 🔗 Related Products -->
      <div
        v-if="product.related?.nodes?.length && storeSettings.showRelatedProducts"
        class="py-12 border-t border-border"
      >
        <h2 class="text-2xl font-bold text-primary dark:text-white mb-8">
          Benzer Ürünler
        </h2>
        <LazyProductRow
          :products="product.related.nodes"
          class="grid-cols-2 md:grid-cols-4 lg:grid-cols-5"
        />
      </div>
    </div>

    <!-- Mobile Sticky Add to Cart -->
    <div
      v-if="(isVariableProduct || isSimpleProduct) && !disabledAddToCart"
      class="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white/95 backdrop-blur-md border-t border-border md:hidden"
    >
      <div class="flex items-center gap-3">
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-primary truncate">
            {{ product.name }}
          </p>
          <CommerceSharedPriceFormatBasic
            :value="parseFloat(type.salePrice || type.regularPrice || '0')"
            class="text-lg"
          />
        </div>
        <Button
          type="button"
          :disabled="disabledAddToCart"
          class="bg-gradient-ocean text-white px-6 py-6 rounded-xl"
          @click="handleAddToCart"
        >
          <ShoppingCart class="w-5 h-5 mr-2" />
          Sepete Ekle
        </Button>
      </div>
    </div>
  </main>
</template>
