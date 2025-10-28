<script setup lang="ts">
const { frontEndUrl, wooNuxtSEO, stripHtml } = useHelpers();
const { path } = useRoute();
const { info } = defineProps({ info: { type: Object as PropType<Product>, required: true } });

const title = info.name;
const canonical = `${frontEndUrl}${path}`;
const runtimeConfig = useRuntimeConfig();
const siteName = runtimeConfig.public?.SITE_NAME || 'WooNuxt';

const img = useImage();
const imageURL = computed(() => info.image?.sourceUrl ?? '/images/placeholder.jpg');
const isLocalImage = computed(() => imageURL.value.startsWith('/'));
// Avoid generating IPX URLs for local placeholder; use original path instead
const defaultImageSrc = computed(() => (isLocalImage.value ? imageURL.value : img.getSizes(imageURL.value, { width: 1200, height: 630 }).src));
const twitterImageSrc = computed(() => (isLocalImage.value ? imageURL.value : img.getSizes(imageURL.value, { width: 1600, height: 900 }).src));

const getFullImageURL = (url?: string) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${frontEndUrl}${url}`;
};

const defaultImage = computed(() => getFullImageURL(defaultImageSrc.value));
const twitterImage = computed(() => getFullImageURL(twitterImageSrc.value));
const description = computed(() => (info.shortDescription || info.description ? stripHtml(info.shortDescription || '') : stripHtml(info.description || '')));

const facebook = wooNuxtSEO?.find((item) => item?.provider === 'facebook') ?? null;
const twitter = wooNuxtSEO?.find((item) => item?.provider === 'twitter') ?? null;

// JSON-LD Product structured data
const currency = computed(() => runtimeConfig.public?.CURRENCY_CODE || 'TRY');
const availabilityMap: Record<string, string> = {
  IN_STOCK: 'https://schema.org/InStock',
  OUT_OF_STOCK: 'https://schema.org/OutOfStock',
  ON_BACKORDER: 'https://schema.org/PreOrder',
};
const price = computed(() => (info as any)?.rawSalePrice || (info as any)?.rawPrice || (info as any)?.rawRegularPrice || null);
// Build unique image list (main + gallery) with absolute URLs
const images = computed(() => {
  const set = new Set<string>();
  if (info?.image?.sourceUrl) set.add(getFullImageURL(info.image.sourceUrl));
  if (Array.isArray((info as any)?.galleryImages?.nodes)) {
    for (const g of (info as any).galleryImages.nodes) {
      if (g?.sourceUrl) set.add(getFullImageURL(g.sourceUrl));
    }
  }
  return Array.from(set);
});

// Individual Review schema if reviews exist
const reviews = computed(() => (info as any)?.reviews?.edges || []);
const reviewSchemas = computed(() =>
  reviews.value
  .filter((edge: any) => edge.node?.content && edge.node?.author?.node?.name)
  .map((edge: any) => ({
    '@type': 'Review',
    author: {
      '@type': 'Person',
      name: edge.node.author.node.name,
    },
    datePublished: edge.node.date,
    reviewBody: stripHtml(edge.node.content || ''),
    reviewRating: edge.rating
      ? {
          '@type': 'Rating',
          ratingValue: Number(edge.rating),
          bestRating: 5,
        }
      : undefined,
  }))
);

// Resolve brand from product-specific data (brands taxonomy or global attribute terms)
const brandTaxonomies = computed(() =>
  String(runtimeConfig.public?.BRAND_TAXONOMIES || '')
    .split(',')
    .map((s: string) => s.trim().toLowerCase())
    .filter(Boolean),
);
const brandName = computed(() => {
  const termsNodes = (info as any)?.terms?.nodes || [];
  const brandFromTerms = (termsNodes.find((t: any) => brandTaxonomies.value.includes(String(t?.taxonomyName || '').toLowerCase())) || {})?.name || '';
  if (brandFromTerms) return brandFromTerms;
  const brandsNodes = (info as any)?.brands?.nodes || [];
  const brandFromBrands = brandsNodes?.[0]?.name || '';
  return brandFromBrands || '';
});

// Calculate price validity (48 hours from now)
const priceValidUntil = computed(() => {
  const date = new Date();
  date.setHours(date.getHours() + 48);
  return date.toISOString();
});

const jsonLd = computed(() =>
  JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: info?.name,
      image: images.value.length ? images.value : [defaultImage.value],
      description: description.value,
      sku: (info as any)?.sku || undefined,
      brand: brandName.value
        ? {
            '@type': 'Brand',
            name: brandName.value,
          }
        : undefined,
      aggregateRating:
        info?.averageRating && info?.reviewCount
          ? {
              '@type': 'AggregateRating',
              ratingValue: Number(info.averageRating),
              reviewCount: Number(info.reviewCount),
            }
          : undefined,
      review: reviewSchemas.value.length ? reviewSchemas.value : undefined,
      offers:
        price.value
          ? {
              '@type': 'Offer',
              url: canonical,
              priceCurrency: currency.value,
              price: String(price.value),
              priceValidUntil: priceValidUntil.value,
              availability: availabilityMap[(info as any)?.stockStatus || 'IN_STOCK'] || 'https://schema.org/InStock',
              shippingDetails: {
                '@type': 'OfferShippingDetails',
                shippingDestination: {
                  '@type': 'DefinedRegion',
                  addressCountry: 'TR',
                },
                deliveryTime: {
                  '@type': 'ShippingDeliveryTime',
                  handlingTime: 'P0D',
                  transitTime: 'P3D',
                },
                shippingRate: {
                  '@type': 'MonetaryAmount',
                  value: 0,
                  currency: currency.value,
                  name: 'Ücretsiz Kargo',
                },
              },
              hasMerchantReturnPolicy: {
                '@type': 'MerchantReturnPolicy',
                applicableCountry: 'TR',
                returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
                merchantReturnDays: 14,
                returnMethod: 'https://schema.org/ReturnByMail',
                returnFees: 'https://schema.org/FreeReturn',
              },
            }
          : undefined,
    },
    null,
    2,
  )
);

// Inject JSON-LD via head manager with innerHTML for proper rendering
useHead(() => ({
  script: [
    {
      key: 'product-jsonld',
      type: 'application/ld+json',
      innerHTML: jsonLd.value,
    },
  ],
}));
</script>

<template>
  <Head>
    <Title>{{ title }}</Title>
    <Meta v-if="description" name="description" hid="description" :content="description" />
    <Meta name="image" hid="image" :content="defaultImage" />
    <Meta property="og:site_name" hid="og:site_name" :content="siteName" />
    <Meta property="og:url" hid="og:url" :content="canonical" />
    <Meta v-if="info.name" property="og:title" hid="og:title" :content="info.name" />
    <Meta v-if="description" property="og:description" hid="og:description" :content="description" />
    <Meta property="og:image" hid="og:image" :content="defaultImage" />
    <Meta v-if="facebook?.url" property="article:publisher" hid="article:publisher" :content="facebook.url" />
    <Meta name="twitter:card" hid="twitter:card" content="summary_large_image" />
    <Meta v-if="twitter?.handle" name="twitter:site" hid="twitter:site" :content="twitter.handle" />
    <Meta v-if="info.name" name="twitter:title" hid="twitter:title" :content="info.name" />
    <Meta v-if="description" name="twitter:description" hid="twitter:description" :content="description" />
    <Meta name="twitter:image" hid="twitter:image" :content="twitterImage" />
    <Meta name="twitter:url" hid="twitter:url" :content="canonical" />
    <Link rel="canonical" hid="canonical" :href="canonical" />
  </Head>
</template>
