<script setup lang="ts">
const { frontEndUrl, wooNuxtSEO, stripHtml } = useHelpers();
const { path } = useRoute();
const { info } = defineProps({ info: { type: Object as PropType<Product>, required: true } });

const title = info.name;
const canonical = `${frontEndUrl}${path}`;
const siteName = process.env.SITE_TITLE ?? 'WooNuxt';

const img = useImage();
const imageURL = info.image?.sourceUrl ?? '/images/placeholder.jpg';
const defaultImageSrc = img.getSizes(imageURL, { width: 1200, height: 630 }).src;
const twitterImageSrc = img.getSizes(imageURL, { width: 1600, height: 900 }).src;

const getFullImageURL = (url?: string) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${frontEndUrl}${url}`;
};

const defaultImage = getFullImageURL(defaultImageSrc);
const twitterImage = getFullImageURL(twitterImageSrc);
const description = info.shortDescription || info.description ? stripHtml(info.shortDescription || '') : stripHtml(info.description || '');

const facebook = wooNuxtSEO?.find((item) => item?.provider === 'facebook') ?? null;
const twitter = wooNuxtSEO?.find((item) => item?.provider === 'twitter') ?? null;

// JSON-LD Product structured data
const runtimeConfig = useRuntimeConfig();
const currency = runtimeConfig.public?.CURRENCY_CODE || 'TRY';
const availabilityMap: Record<string, string> = {
  IN_STOCK: 'https://schema.org/InStock',
  OUT_OF_STOCK: 'https://schema.org/OutOfStock',
  ON_BACKORDER: 'https://schema.org/PreOrder',
};
const price = (info as any)?.rawSalePrice || (info as any)?.rawPrice || (info as any)?.rawRegularPrice || null;
const images: string[] = [];
if (info?.image?.sourceUrl) images.push(getFullImageURL(info.image.sourceUrl));
if (Array.isArray((info as any)?.galleryImages?.nodes)) {
  for (const g of (info as any).galleryImages.nodes) {
    if (g?.sourceUrl) images.push(getFullImageURL(g.sourceUrl));
  }
}

// Individual Review schema if reviews exist
const reviews = (info as any)?.reviews?.edges || [];
const reviewSchemas = reviews
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
  }));

const jsonLd = JSON.stringify(
  {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: info?.name,
    image: images.length ? images : [defaultImage],
    description,
    sku: (info as any)?.sku || undefined,
    brand: {
      '@type': 'Brand',
      name: siteName,
    },
    aggregateRating:
      info?.averageRating && info?.reviewCount
        ? {
            '@type': 'AggregateRating',
            ratingValue: Number(info.averageRating),
            reviewCount: Number(info.reviewCount),
          }
        : undefined,
    review: reviewSchemas.length ? reviewSchemas : undefined,
    offers:
      price
        ? {
            '@type': 'Offer',
            url: canonical,
            priceCurrency: currency,
            price: String(price),
            availability: availabilityMap[(info as any)?.stockStatus || 'IN_STOCK'] || 'https://schema.org/InStock',
          }
        : undefined,
  },
  null,
  2,
);

// Inject JSON-LD via head manager instead of using a <Script> component
useHead({
  script: [
    {
      type: 'application/ld+json',
      children: jsonLd,
    },
  ],
});
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
