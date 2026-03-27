<script lang="ts" setup>
/**
 * 🌊 Product Detail Page - Marine Themed
 *
 * Premium product detail page with ocean-inspired styling.
 * Uses existing WooNuxt composables for backend logic.
 */
import { StockStatusEnum, ProductTypesEnum, type AddToCartInput } from '#gql/default';
import type { Variation, VariationAttribute } from '#types/gql';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Heart, Share2, ShoppingCart, ShieldCheck, Truck, RotateCcw, ChevronRight, Anchor, Waves } from 'lucide-vue-next';

const route = useRoute();
const { storeSettings, siteName } = useAppConfig();
const { arraysEqual, formatArray, checkForVariationTypeOfAny, frontEndUrl } = useHelpers();
const { addToCart, isUpdatingCart, toggleCart, isShowingCart } = useCart();
const { t } = useI18n();
const { trackViewItem, trackAddToCart } = useGoogleAnalytics();
const slug = route.params.slug as string;

const { data } = await useAsyncGql('getProduct', { slug });
if (!data.value?.product) {
  throw showError({ statusCode: 404, statusMessage: t('shop.productNotFound') });
}

const product = ref<Product>(data?.value?.product);
const quantity = ref<number>(1);
const activeVariation = ref<Variation | null>(null);
const variation = ref<VariationAttribute[]>([]);
const attrValues = ref();
const isSimpleProduct = computed<boolean>(() => product.value?.type === ProductTypesEnum.SIMPLE);
const isVariableProduct = computed<boolean>(() => product.value?.type === ProductTypesEnum.VARIABLE);
const isExternalProduct = computed<boolean>(() => product.value?.type === ProductTypesEnum.EXTERNAL);

const displayProduct = computed(() => activeVariation.value || product.value);
const priceTarget = computed(() => activeVariation.value || product.value);
const productImage = computed(() => product.value?.image || null);
const productGallery = computed(() => ({ nodes: product.value?.galleryImages?.nodes ?? [] }));

const selectProductInput = computed<any>(() => ({ productId: displayProduct.value?.databaseId, quantity: quantity.value })) as ComputedRef<AddToCartInput>;

const mergeLiveStockStatus = (payload: Product): void => {
  product.value.stockStatus = payload.stockStatus ?? product.value?.stockStatus;
  payload.variations?.nodes?.forEach((variation: Variation, index: number) => {
    if (product.value?.variations?.nodes[index]) {
      product.value.variations.nodes[index].stockStatus = variation.stockStatus;
    }
  });
};

const shouldSkipStockRefresh = computed<boolean>(() => isExternalProduct.value);

const refreshStockStatus = async (): Promise<void> => {
  try {
    const { product: liveProduct } = await GqlGetStockStatus({ slug });
    if (liveProduct) mergeLiveStockStatus(liveProduct as Product);
  } catch (error: any) {
    const errorMessage = error?.gqlErrors?.[0]?.message;
    if (errorMessage) console.error(errorMessage);
  }
};

type IdleCallback = (deadline: { didTimeout: boolean; timeRemaining: () => number }) => void;
type IdleCallbackWindow = Window & {
  requestIdleCallback?: (callback: IdleCallback, options?: { timeout: number }) => number;
  cancelIdleCallback?: (handle: number) => void;
};

let stockRefreshHandle: number | null = null;
let stockRefreshHandleType: 'idle' | 'timeout' | null = null;

const scheduleStockRefresh = (): void => {
  if (!import.meta.client || shouldSkipStockRefresh.value) return;

  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (connection?.saveData) return;

  if (stockRefreshHandle !== null) return;

  const run = () => {
    stockRefreshHandle = null;
    stockRefreshHandleType = null;
    void refreshStockStatus();
  };

  const idleWindow = window as IdleCallbackWindow;
  if (idleWindow.requestIdleCallback) {
    stockRefreshHandleType = 'idle';
    stockRefreshHandle = idleWindow.requestIdleCallback(() => run(), { timeout: 2000 });
  } else {
    stockRefreshHandleType = 'timeout';
    stockRefreshHandle = window.setTimeout(run, 900);
  }
};

onMounted(() => {
  scheduleStockRefresh();
  if (product.value) {
    trackViewItem(product.value);
  }
});

onBeforeUnmount(() => {
  if (!import.meta.client || stockRefreshHandle === null) return;
  const idleWindow = window as IdleCallbackWindow;
  if (stockRefreshHandleType === 'idle' && idleWindow.cancelIdleCallback) {
    idleWindow.cancelIdleCallback(stockRefreshHandle);
  } else {
    clearTimeout(stockRefreshHandle);
  }
  stockRefreshHandle = null;
  stockRefreshHandleType = null;
});

const updateSelectedVariations = (variations: VariationAttribute[]): void => {
  if (!product.value?.variations) return;

  attrValues.value = variations.map((el) => ({ attributeName: el.name, attributeValue: el.value }));
  activeVariation.value = findMatchingVariation(variations);

  selectProductInput.value.variationId = activeVariation.value?.databaseId ?? null;
  selectProductInput.value.variation = activeVariation.value ? attrValues.value : null;
  variation.value = variations;
};

// Helper function to find matching variation
const findMatchingVariation = (selected: VariationAttribute[]): Variation | null => {
  if (!selected?.length) return null;

  const selectedMap: Record<string, string> = {};
  selected.forEach((attr) => {
    const key = toSelectionName(attr.name);
    if (!key) return;
    const value = normalizeMatchValue(attr.value);
    if (!value) return;
    selectedMap[key] = value;
  });

  if (Object.keys(selectedMap).length === 0) return null;

  const nodes = product.value?.variations?.nodes ?? [];
  for (const node of nodes) {
    const attrs: Record<string, string> = {};
    node.attributes?.nodes?.forEach((attr) => {
      const key = toSelectionName(attr.name);
      if (!key) return;
      const value = normalizeMatchValue(attr.value);
      if (!value) return;
      attrs[key] = value;
    });

    let matches = true;
    for (const [key, value] of Object.entries(selectedMap)) {
      if (attrs[key] !== value) {
        matches = false;
        break;
      }
    }

    if (matches) return node;
  }

  return null;
};

// Helper functions
const toSelectionName = (name?: string | null): string => {
  if (!name) return '';
  return name.charAt(0).toLowerCase() + name.slice(1);
};

const normalizeMatchValue = (value?: string | null): string => {
  return (value ?? '').toString().trim().toLowerCase().replace(/[\s-_]+/g, '');
};

// Pre-select variation based on URL query params or default attributes
const queryParams = route.query;

const findVariationById = (value?: string | number | null): Variation | null => {
  if (!value || !product.value?.variations?.nodes?.length) return null;
  const parsed = typeof value === 'string' ? Number.parseInt(value, 10) : value;
  if (!parsed || Number.isNaN(parsed)) return null;
  return product.value?.variations?.nodes?.find((node: Variation) => node.databaseId === parsed) ?? null;
};

const buildQuerySelections = (): VariationAttribute[] => {
  if (!product.value?.attributes?.nodes?.length) return [];

  const selections: VariationAttribute[] = [];
  for (const attr of product.value.attributes.nodes) {
    const key = toSelectionName(attr?.name);
    if (!key) continue;

    const rawQueryValue = queryParams[key];
    if (!rawQueryValue) continue;

    const value = Array.isArray(rawQueryValue) ? rawQueryValue[0] : rawQueryValue;
    const normalizedValue = normalizeMatchValue(value);
    if (!normalizedValue) continue;

    const isValidValue =
      attr.scope === 'LOCAL'
        ? (attr.options ?? []).some((option: string | null) => normalizeMatchValue(option ?? '') === normalizedValue)
        : 'terms' in attr && (attr.terms?.nodes ?? []).some((term) => normalizeMatchValue(term?.slug ?? '') === normalizedValue);

    if (!isValidValue) continue;

    selections.push({ name: key, value: String(value) });
  }

  return selections;
};

const queryVariationId = queryParams.variationId ?? queryParams.variation;
const variationFromQuery = findVariationById(Array.isArray(queryVariationId) ? queryVariationId[0] : queryVariationId);

if (variationFromQuery?.attributes?.nodes?.length) {
  variation.value = variationFromQuery.attributes.nodes.map((attr: VariationAttribute) => ({
    name: attr.name || '',
    value: attr.value || '',
  }));
  activeVariation.value = variationFromQuery;
} else {
  const initialSelections = buildQuerySelections();
  if (initialSelections.length > 0) {
    const matched = findMatchingVariation(initialSelections);
    if (matched?.attributes?.nodes?.length) {
      variation.value = matched.attributes.nodes.map((attr: VariationAttribute) => ({
        name: attr.name || '',
        value: attr.value || '',
      }));
      activeVariation.value = matched;
    } else {
      variation.value = initialSelections;
    }
  }
}

const defaultAttributes = computed<{ nodes: VariationAttribute[] } | null>(() => {
  if (variation.value.length > 0) {
    return { nodes: variation.value };
  }
  return product.value?.defaultAttributes ? { nodes: product.value.defaultAttributes.nodes ?? [] } : null;
});

const stockStatus = computed(() => {
  if (isVariableProduct.value) {
    // For variable products, show variation stock if selected, otherwise show parent stock
    return activeVariation.value?.stockStatus || (product.value as VariableProduct)?.stockStatus || StockStatusEnum.OUT_OF_STOCK;
  }
  return (product.value as SimpleProduct | VariableProduct)?.stockStatus || StockStatusEnum.OUT_OF_STOCK;
});

const disabledAddToCart = computed(() => {
  const isOutOfStock = stockStatus.value === StockStatusEnum.OUT_OF_STOCK;
  const isInvalidType = !displayProduct.value;
  const isCartUpdating = isUpdatingCart.value;
  const isValidActiveVariation = isVariableProduct.value ? !!activeVariation.value : true;
  return isInvalidType || isOutOfStock || isCartUpdating || !isValidActiveVariation;
});

const handleAddToCart = async () => {
  if (!product.value) return;
  try {
    await addToCart(selectProductInput.value, { product: product.value, variation: activeVariation.value });
    trackAddToCart(displayProduct.value, quantity.value);

    // Open cart after a short delay to show the product was added
    setTimeout(() => {
      isShowingCart.value = true;
    }, 300);
  } catch (error) {
    console.error('Error adding to cart:', error);
  }
};

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

// Primary category for display purposes (SEO handled by SEOHead component)
const primaryCategory = computed(() => product.value?.productCategories?.nodes?.[0] || null);

// Active tab state
const activeTab = ref<'description' | 'reviews' | 'specs'>('description');
</script>

<template>
  <main class="min-h-screen pb-32 md:pb-16">
    <SEOHead v-if="product" :info="product" />

    <!-- 🍞 Breadcrumb -->
    <div class="container-ocean py-4">
      <ProductBreadcrumb :product="product" class="mb-6" v-if="storeSettings.showBreadcrumbOnSingleProduct" />
    </div>

    <div v-if="product" class="container-ocean">
      <!-- 🖼️ Product Hero Section -->
      <div class="grid lg:grid-cols-2 gap-8 lg:gap-12 py-6">
        <!-- Product Gallery -->
        <div class="relative w-full overflow-hidden">
          <ProductImageGallery
            v-if="product.image"
            class="w-full"
            :main-image="product.image"
            :gallery="productGallery"
            :node="displayProduct"
            :activeVariation="activeVariation || {}"
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
            {{ displayProduct.name }}
          </h1>

          <!-- Rating & Reviews -->
          <div
            v-if="storeSettings.showReviews && product.reviewCount"
            class="flex items-center gap-4 mb-6"
          >
            <StarRating
              :rating="product.averageRating || 0"
              :count="product.reviewCount"
            />
          </div>

          <!-- Price -->
          <div class="mb-6">
            <ProductPrice
              class="text-xl"
              :sale-price="priceTarget?.salePrice"
              :regular-price="priceTarget?.regularPrice"
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
              :default-attributes="defaultAttributes"
              :variations="product.variations.nodes"
              @attrs-changed="updateSelectedVariations"
            />
          </div>

          <!-- Stock Status -->
          <div
            v-if="!isExternalProduct"
            class="flex items-center gap-2 px-4 py-2 rounded-lg mb-6"
          >
            <StockStatus :stockStatus @updated="mergeLiveStockStatus" />
          </div>

          <!-- Add to Cart Section -->
          <form
            v-if="isVariableProduct || isSimpleProduct"
            @submit.prevent="handleAddToCart"
            class="space-y-4 mb-6"
          >
            <!-- Quantity & Add to Cart -->
            <div class="flex items-center gap-4">
              <input
                v-model="quantity"
                type="number"
                min="1"
                max="100"
                aria-label="Quantity"
                class="flex items-center justify-center w-20 gap-4 p-2 text-left bg-white border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:outline-none dark:text-white"
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

          <!-- WhatsApp Order Button -->
          <WhatsAppOrderButton v-if="product" :product="product" class="mb-6" />

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
      <div v-if="product.description || product.reviews" class="my-32">
        <ProductTabs :product="product" />
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
          <ProductPrice
            :sale-price="priceTarget?.salePrice"
            :regular-price="priceTarget?.regularPrice"
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
