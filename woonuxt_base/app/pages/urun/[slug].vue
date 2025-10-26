<script lang="ts" setup>
import { StockStatusEnum, ProductTypesEnum, type AddToCartInput } from '#woo';

const route = useRoute();
const { storeSettings, siteName } = useAppConfig();
const { arraysEqual, formatArray, checkForVariationTypeOfAny, frontEndUrl } = useHelpers();
const { addToCart, isUpdatingCart } = useCart();
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
const indexOfTypeAny = computed<number[]>(() => checkForVariationTypeOfAny(product.value));
const attrValues = ref();
const isSimpleProduct = computed<boolean>(() => product.value?.type === ProductTypesEnum.SIMPLE);
const isVariableProduct = computed<boolean>(() => product.value?.type === ProductTypesEnum.VARIABLE);
const isExternalProduct = computed<boolean>(() => product.value?.type === ProductTypesEnum.EXTERNAL);

const type = computed(() => activeVariation.value || product.value);
const selectProductInput = computed<any>(() => ({ productId: type.value?.databaseId, quantity: quantity.value })) as ComputedRef<AddToCartInput>;

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
    const { product } = await GqlGetStockStatus({ slug });
    if (product) mergeLiveStockStatus(product as Product);
  } catch (error: any) {
    const errorMessage = error?.gqlErrors?.[0].message;
    if (errorMessage) console.error(errorMessage);
  }

  // Track product view
  trackViewItem(product.value);
});

const updateSelectedVariations = (variations: VariationAttribute[]): void => {
  if (!product.value.variations) return;

  attrValues.value = variations.map((el) => ({ attributeName: el.name, attributeValue: el.value }));
  const clonedVariations = JSON.parse(JSON.stringify(variations));
  const getActiveVariation = product.value.variations?.nodes.filter((variation: any) => {
    // If there is any variation of type ANY set the value to ''
    if (variation.attributes) {
      // Set the value of the variation of type ANY to ''
      indexOfTypeAny.value.forEach((index) => (clonedVariations[index].value = ''));

      return arraysEqual(formatArray(variation.attributes.nodes), formatArray(clonedVariations));
    }
  });

  // Set variation to the selected variation if it exists
  activeVariation.value = getActiveVariation?.[0] || null;

  selectProductInput.value.variationId = activeVariation.value?.databaseId ?? null;
  selectProductInput.value.variation = activeVariation.value ? attrValues.value : null;
  variation.value = variations;
};

const stockStatus = computed(() => {
  if (isVariableProduct.value) {
    return activeVariation.value?.stockStatus || StockStatusEnum.OUT_OF_STOCK;
  }
  return type.value?.stockStatus || StockStatusEnum.OUT_OF_STOCK;
});

const disabledAddToCart = computed(() => {
  const isOutOfStock = stockStatus.value === StockStatusEnum.OUT_OF_STOCK;
  const isInvalidType = !type.value;
  const isCartUpdating = isUpdatingCart.value;
  const isValidActiveVariation = isVariableProduct.value ? !!activeVariation.value : true;
  return isInvalidType || isOutOfStock || isCartUpdating || !isValidActiveVariation;
});

// Product JSON-LD
const mapAvailability = (status?: StockStatusEnum | string) => {
  switch (status) {
    case StockStatusEnum.IN_STOCK:
      return 'https://schema.org/InStock';
    case StockStatusEnum.ON_BACKORDER:
      return 'https://schema.org/PreOrder';
    case StockStatusEnum.OUT_OF_STOCK:
    default:
      return 'https://schema.org/OutOfStock';
  }
};

const currencyCode = useRuntimeConfig().public?.CURRENCY_CODE || 'TRY';
const productImages = computed<string[]>(() => {
  const images: string[] = [];
  const main = (product.value as any)?.image?.sourceUrl || (product.value as any)?.image?.mediaItemUrl;
  if (main) images.push(main);
  const gallery = (product.value as any)?.galleryImages?.nodes || [];
  for (const g of gallery) {
    const url = g?.sourceUrl || g?.mediaItemUrl;
    if (url) images.push(url);
  }
  return Array.from(new Set(images));
});

const { stripHtml } = useHelpers();

const offers = computed(() => ({
  '@type': 'Offer',
  url: `${frontEndUrl}/urun/${product.value?.slug}`,
  priceCurrency: currencyCode,
  price: (type.value?.salePrice || type.value?.regularPrice || '0').toString().replace(/[^0-9.]/g, ''),
  availability: mapAvailability(stockStatus.value as any),
}));

const aggregateRating = computed(() => {
  const rating = parseFloat((product.value?.averageRating as any) || '0');
  const count = Number(product.value?.reviewCount || 0);
  if (!rating || !count) return undefined;
  return {
    '@type': 'AggregateRating',
    ratingValue: rating,
    reviewCount: count,
    bestRating: 5,
    worstRating: 1,
  } as Record<string, any>;
});

const productJsonLd = computed(() =>
  JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.value?.name,
      description: stripHtml(product.value?.shortDescription || product.value?.description || ''),
      image: productImages.value,
      sku: product.value?.sku || undefined,
      category: primaryCategory.value?.name || undefined,
      brand: siteName || undefined,
      offers: offers.value,
      aggregateRating: aggregateRating.value,
    },
    null,
    2,
  ),
);

// BreadcrumbList JSON-LD for product page
const primaryCategory = computed(() => product.value?.productCategories?.nodes?.[0] || null);
const productUrl = computed(() => `${frontEndUrl}/urun/${product.value?.slug}`);
const categoryUrl = computed(() => (primaryCategory.value ? `${frontEndUrl}/urun-kategorisi/${primaryCategory.value.slug}` : `${frontEndUrl}/urunler`));
const breadcrumbJsonLd = computed(() =>
  JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Ana Sayfa',
          item: frontEndUrl,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: primaryCategory.value?.name || 'Ürünler',
          item: categoryUrl.value,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: product.value?.name,
          item: productUrl.value,
        },
      ],
    },
    null,
    2,
  ),
);
useHead(() => ({
  script: [
    // Breadcrumbs for the product page (Product JSON-LD is injected by SEOHead to avoid duplicates)
    { type: 'application/ld+json', children: breadcrumbJsonLd.value },
  ],
}));
</script>

<template>
  <main class="container relative py-6 xl:max-w-7xl">
    <div v-if="product">
      <SEOHead :info="product" />
      <Breadcrumb :product class="mb-6" v-if="storeSettings.showBreadcrumbOnSingleProduct" />

      <div class="flex flex-col gap-10 md:flex-row md:justify-between lg:gap-24">
        <ProductImageGallery
          v-if="product.image"
          class="relative flex-1"
          :main-image="product.image"
          :gallery="product.galleryImages!"
          :node="type"
          :activeVariation="activeVariation || {}" />
        <img v-else class="relative flex-1 skeleton" src="/images/placeholder.jpg" :alt="product?.name || 'Product'" loading="lazy" decoding="async" />

        <div class="lg:max-w-md xl:max-w-lg md:py-2 w-full">
          <div class="flex justify-between mb-4">
            <div class="flex-1">
              <h1 class="flex flex-wrap items-center gap-2 mb-2 text-2xl font-sesmibold">
                {{ type.name }}
                <LazyWPAdminLink :link="`/wp-admin/post.php?post=${product.databaseId}&action=edit`">Edit</LazyWPAdminLink>
              </h1>
              <StarRating :rating="product.averageRating || 0" :count="product.reviewCount || 0" v-if="storeSettings.showReviews" />
            </div>
            <ProductPrice class="text-xl" :sale-price="type.salePrice" :regular-price="type.regularPrice" />
          </div>

          <div class="grid gap-2 my-8 text-sm empty:hidden">
            <div v-if="!isExternalProduct" class="flex items-center gap-2">
              <span class="text-gray-400">{{ $t('shop.availability') }}: </span>
              <StockStatus :stockStatus @updated="mergeLiveStockStatus" />
            </div>
            <div class="flex items-center gap-2" v-if="storeSettings.showSKU && product.sku">
              <span class="text-gray-400">{{ $t('shop.sku') }}: </span>
              <span>{{ product.sku || 'N/A' }}</span>
            </div>
          </div>

          <div class="mb-8 font-light prose" v-html="product.shortDescription || product.description" />

          <hr />

          <form
            @submit.prevent="
              () => {
                addToCart(selectProductInput);
                trackAddToCart(type, quantity);
              }
            ">
            <AttributeSelections
              v-if="isVariableProduct && product.attributes && product.variations"
              class="mt-4 mb-8"
              :attributes="product.attributes.nodes"
              :defaultAttributes="product.defaultAttributes"
              :variations="product.variations.nodes"
              @attrs-changed="updateSelectedVariations" />
            
            <!-- Desktop WhatsApp Order Button -->
            <div v-if="isVariableProduct || isSimpleProduct" class="hidden md:block mb-4">
              <WhatsAppOrderButton :product="product" />
            </div>

            <!-- Desktop Add to Cart -->
            <div
              v-if="isVariableProduct || isSimpleProduct"
              class="hidden md:flex items-center w-full gap-4 mt-4">
              <input
                v-model="quantity"
                type="number"
                min="1"
                aria-label="Quantity"
                class="bg-white border rounded-lg flex text-left p-2.5 w-20 gap-4 items-center justify-center focus:outline-none" />
              <AddToCartButton class="flex-1 w-full md:max-w-xs" :disabled="disabledAddToCart" :class="{ loading: isUpdatingCart }" />
            </div>

            <!-- Mobile Sticky Actions: WhatsApp + Add to Cart -->
            <div
              v-if="isVariableProduct || isSimpleProduct"
              class="fixed bottom-0 left-0 z-10 w-full p-4 bg-white md:hidden bg-opacity-90">
              <WhatsAppOrderButton :product="product" class="w-full" />
              <div class="mt-3">
                <AddToCartButton class="w-full" :disabled="disabledAddToCart" :class="{ loading: isUpdatingCart }" />
              </div>
            </div>
            <a
              v-if="isExternalProduct && product.externalUrl"
              :href="product.externalUrl"
              target="_blank"
              class="rounded-lg flex font-bold bg-gray-800 text-white text-center min-w-[150px] p-2.5 gap-4 items-center justify-center focus:outline-none">
              {{ product?.buttonText || 'View product' }}
            </a>
          </form>

          <div v-if="storeSettings.showProductCategoriesOnSingleProduct && product.productCategories">
            <div class="grid gap-2 my-8 text-sm">
              <div class="flex items-center gap-2">
                <span class="text-gray-400">{{ $t('shop.category', 2) }}:</span>
                <div class="product-categories">
                  <NuxtLink
                    v-for="category in product.productCategories.nodes"
                    :key="category.databaseId"
                    :to="`/urun-kategorisi/${decodeURIComponent(category?.slug || '')}`"
                    class="hover:text-primary"
                    :title="category.name"
                    >{{ category.name }}<span class="comma">, </span>
                  </NuxtLink>
                </div>
              </div>
            </div>
            <hr />
          </div>

          <div class="flex flex-wrap gap-4">
            <WishlistButton :product />
            <ShareButton :product />
          </div>
        </div>
      </div>
      <div v-if="product.description || product.reviews" class="my-32">
        <ProductTabs :product />
      </div>
      <div class="my-32" v-if="product.related && storeSettings.showRelatedProducts">
        <div class="mb-4 text-xl font-semibold">{{ $t('shop.youMayLike') }}</div>
        <LazyProductRow :products="product.related.nodes" class="grid-cols-2 md:grid-cols-4 lg:grid-cols-5" />
      </div>
    </div>
  </main>
</template>

<style scoped>
.product-categories > a:last-child .comma {
  display: none;
}

input[type='number']::-webkit-inner-spin-button {
  opacity: 1;
}
</style>
