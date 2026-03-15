<script setup lang="ts">
const { frontEndUrl, wooNuxtSEO, stripHtml } = useHelpers();
const { path } = useRoute();
const { info } = defineProps({ info: { type: Object as PropType<Product>, required: true } });

const runtimeConfig = useRuntimeConfig();
const siteName = runtimeConfig.public?.SITE_NAME || 'WooNuxt';
const title = computed(() => (info.name ? `${info.name} | ${siteName}` : siteName));
const canonical = `${frontEndUrl}${path}`;

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

/**
 * Clean and format price for Google Schema
 * Converts Turkish format (1.234,56) to standard format (1234.56)
 * Removes currency symbols, thousand separators, and ensures period as decimal
 */
const cleanPrice = (priceValue: string | number | null | undefined): string | null => {
  if (priceValue === null || priceValue === undefined) return null;

  // Convert to string if not already
  let priceStr = String(priceValue);

  // Remove any currency symbols and whitespace
  priceStr = priceStr.replace(/[^\d.,-]/g, '');

  // Check if using comma as decimal separator (Turkish format)
  // If comma is present and there's a period, the period is likely thousand separator
  if (priceStr.includes(',') && priceStr.includes('.')) {
    // Turkish format: 1.234,56 -> remove thousand separators (periods), replace comma with period
    priceStr = priceStr.replace(/\./g, '').replace(',', '.');
  } else if (priceStr.includes(',')) {
    // Only comma present, likely decimal separator: 1234,56 -> 1234.56
    priceStr = priceStr.replace(',', '.');
  } else if (priceStr.includes('.')) {
    // Period present, check if it's a valid decimal or thousand separator
    // If there are multiple periods, remove all but the last one
    const parts = priceStr.split('.');
    if (parts.length > 2) {
      // Multiple periods - thousand separators: 1.234.56 -> 1234.56
      priceStr = parts.slice(0, -1).join('') + '.' + parts[parts.length - 1];
    }
    // If only one period, it's already correct format (e.g., 1234.56)
  }

  // Parse as number and validate
  const num = parseFloat(priceStr);
  if (isNaN(num)) return null;

  // Return as string with proper decimal format
  return num.toFixed(2);
};

const price = computed(() => {
  const rawPrice = (info as any)?.rawSalePrice || (info as any)?.rawPrice || (info as any)?.rawRegularPrice || null;
  return cleanPrice(rawPrice);
});
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

// Validate SKU - only include if it's a non-empty string
const validSku = computed(() => {
  const sku = (info as any)?.sku;
  return sku && typeof sku === 'string' && sku.trim().length > 0 ? sku.trim() : undefined;
});

// Aggregate Rating Logic
const avgRating = computed(() => {
  const rating = (info as any)?.averageRating || (info as any)?.reviews?.averageRating || 0;
  return Number(rating);
});
const reviewCount = computed(() => {
  const count = (info as any)?.reviewCount || (info as any)?.reviews?.edges?.length || 0;
  return Number(count);
});

const aggregateRatingSchema = computed(() => {
  if (reviewCount.value > 0) {
    return {
      '@type': 'AggregateRating',
      ratingValue: avgRating.value || 5,
      reviewCount: reviewCount.value,
      bestRating: 5,
      worstRating: 1,
    };
  }
  return undefined;
});

// FAQ Schema from product meta data
const productFAQs = computed(() => {
  const metaData = (info as any)?.metaData || [];
  const faqData = metaData.find((m: any) => m.key === 'product_faq');
  if (faqData?.value) {
    try {
      return JSON.parse(faqData.value);
    } catch {
      return [];
    }
  }
  return [];
});

const faqSchema = computed(() => {
  if (!productFAQs.value || productFAQs.value.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: productFAQs.value.map((faq: any) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
});

// Enhanced description with additional properties
const enhancedDescription = computed(() => {
  const metaData = (info as any)?.metaData || [];
  const descData = metaData.find((m: any) => m.key === 'enhanced_description');
  if (descData?.value) {
    try {
      return JSON.parse(descData.value);
    } catch {
      return null;
    }
  }
  return null;
});

const additionalProperties = computed(() => {
  const props: any[] = [];

  // Add features as properties
  if (enhancedDescription.value?.features && Array.isArray(enhancedDescription.value.features)) {
    enhancedDescription.value.features.forEach((feature: string) => {
      props.push({
        '@type': 'PropertyValue',
        name: 'Özellik',
        value: feature,
      });
    });
  }

  // Add specifications as properties
  if (enhancedDescription.value?.specifications) {
    Object.entries(enhancedDescription.value.specifications).forEach(([key, value]) => {
      props.push({
        '@type': 'PropertyValue',
        name: key,
        value: String(value),
      });
    });
  }

  return props.length > 0 ? props : undefined;
});

// Breadcrumb Schema
const breadcrumbSchema = computed(() => {
  const categories = (info as any)?.productCategories?.nodes || [];
  const items = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Ana Sayfa',
      item: frontEndUrl,
    },
  ];

  // Add categories
  categories.forEach((cat: any, index: number) => {
    items.push({
      '@type': 'ListItem',
      position: index + 2,
      name: cat.name,
      item: `${frontEndUrl}/product-category/${cat.slug}`,
    });
  });

  // Add current product
  items.push({
    '@type': 'ListItem',
    position: items.length + 1,
    name: info.name,
    item: canonical,
  });

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  };
});

const jsonLd = computed(() =>
  JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: info?.name,
      image: images.value.length ? images.value : [defaultImage.value],
      description: description.value,
      sku: validSku.value,
      brand: brandName.value
        ? {
            '@type': 'Brand',
            name: brandName.value,
          }
        : undefined,
      aggregateRating: aggregateRatingSchema.value,
      review: reviewSchemas.value.length ? reviewSchemas.value : undefined,
      additionalProperty: additionalProperties.value,
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
                  handlingTime: {
                    '@type': 'QuantitativeValue',
                    minValue: 0,
                    maxValue: 1,
                    unitCode: 'DAY',
                  },
                  transitTime: {
                    '@type': 'QuantitativeValue',
                    minValue: 1,
                    maxValue: 3,
                    unitCode: 'DAY',
                  },
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
// Note: Product JSON-LD is now injected at page level for proper static generation
// This component only injects FAQ schema (if available) to avoid duplicates
useHead(() => {
  const scripts: any[] = [];

  // Add FAQ schema if available
  if (faqSchema.value) {
    scripts.push({
      key: 'product-faq-jsonld',
      type: 'application/ld+json',
      innerHTML: JSON.stringify(faqSchema.value),
    });
  }

  return { script: scripts };
});
</script>

<template>
  <Head>
    <Title>{{ title }}</Title>
    <Meta v-if="description" name="description" hid="description" :content="description" />
    <Meta name="image" hid="image" :content="defaultImage" />
    <Meta property="og:site_name" hid="og:site_name" :content="siteName" />
    <Meta property="og:type" hid="og:type" content="product" />
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
    <!-- Product-specific Open Graph tags for Google Shopping -->
    <Meta v-if="price" property="product:price:amount" hid="product:price:amount" :content="String(price)" />
    <Meta v-if="price" property="product:price:currency" hid="product:price:currency" :content="currency" />
    <Meta property="product:availability" hid="product:availability" :content="(info as any)?.stockStatus || 'IN_STOCK'" />
    <Link rel="canonical" hid="canonical" :href="canonical" />
  </Head>
</template>
