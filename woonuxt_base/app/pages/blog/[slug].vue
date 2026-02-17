<script setup lang="ts">
const route = useRoute();
const slug = route.params.slug as string;

const { data } = await useAsyncGql('getPost', { slug });
const post = computed(() => data.value?.post);

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: 'Blog yazısı bulunamadı' });
}

const { formatDate, stripHtml } = useHelpers();

// Generate SEO-friendly alt text for featured image if not set
const featuredImageAlt = computed(() => {
  const altText = post.value?.featuredImage?.node?.altText;
  if (altText) return altText;
  // Fallback: generate alt text from post title
  const title = stripHtml(post.value?.title || '');
  return `${title} - Öne Çıkan Görsel`;
});

// Process blog content to add internal links for products and categories
const processedContent = computed(() => {
  if (!post.value?.content) return '';

  let content = post.value.content;

  // Define products and their URLs
  const products = [
    { name: 'AeroWave e-Foil SurfBoard', url: '/urun/aerowave-e-foil-surfboard' },
    { name: 'Zaphira Elektrikli Surf Board', url: '/urun/zaphira-elektirkli-surf-board' },
    { name: 'AeroWave e-Foil', url: '/urun/aerowave-e-foil-surfboard' },
    { name: 'Zaphira', url: '/urun/zaphira-elektirkli-surf-board' },
  ];

  // Define categories and their URLs
  const categories = [
    { name: 'Şişme Deniz Botları', url: '/urun-kategorisi/sisme-deniz-botlari' },
    { name: 'Dıştan Takma Motorlar', url: '/urun-kategorisi/distan-takma-motorlar' },
    { name: 'Sabit Tabanlı RIB Botlar', url: '/urun-kategorisi/sabit-tabanli-rib-botlar' },
    { name: 'Surf Board', url: '/urun-kategorisi/surf-board' },
    { name: 'Elektrikli Surf Board', url: '/urun-kategorisi/surf-board' },
    { name: 'e-Foil', url: '/urun-kategorisi/surf-board' },
  ];

  // Only link plain text mentions (not already in links)
  const allItems = [...products, ...categories];

  for (const item of allItems) {
    // Pattern to find the product name NOT inside an HTML tag or already linked
    // This regex looks for the product name that's not already inside <a> tags
    const regex = new RegExp(`(?<!<a[^>]*>)(?<!<a[^>]*href[^=]*=[^"'\\s]*[\'"])(${item.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})(?![^<]*</a>)(?![^<]*>)`, 'gi');

    content = content.replace(regex, (match) => {
      return `<a href="${item.url}" class="text-primary hover:underline font-medium" title="${match}">${match}</a>`;
    });
  }

  return content;
});

// SEO
const seoTitle = post.value?.seo?.title || post.value?.title;
const seoDescription = post.value?.seo?.metaDesc || post.value?.excerpt;
const seoImage = post.value?.seo?.opengraphImage?.sourceUrl || post.value?.featuredImage?.node?.sourceUrl;

useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  ogTitle: seoTitle,
  ogDescription: seoDescription,
  ogImage: seoImage,
  ogType: 'article',
  articlePublishedTime: post.value?.date,
  articleModifiedTime: post.value?.modified,
  articleAuthor: post.value?.author?.node?.name,
});

// Structured Data: Article + BreadcrumbList
const { frontEndUrl } = useHelpers();
const runtimeConfig = useRuntimeConfig();
const siteName = runtimeConfig.public.SITE_NAME || 'Site';
// Sanitize potential misconfigured env values (quotes, inline comments) for logo
const rawLogoPath = runtimeConfig.public.ORGANIZATION_LOGO || '/logo.svg';
const cleanedLogoPath = String(rawLogoPath).replace(/^['"]|['"]$/g, '').split('#')[0].trim();
const logoPath = cleanedLogoPath || '/logo.svg';
const logoUrl = logoPath.startsWith('http') ? logoPath : `${frontEndUrl}${logoPath.startsWith('/') ? '' : '/'}${logoPath}`;
const canonical = computed(() => `${frontEndUrl}${route.path}`);

const breadcrumbJsonLd = computed(() =>
  JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: frontEndUrl },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${frontEndUrl}/blog` },
        post.value?.categories?.nodes?.[0]
          ? { '@type': 'ListItem', position: 3, name: post.value.categories.nodes[0].name || 'Kategori', item: `${frontEndUrl}/blog/kategori/${post.value.categories.nodes[0].slug}` }
          : undefined,
        { '@type': 'ListItem', position: post.value?.categories?.nodes?.[0] ? 4 : 3, name: stripHtml(post.value?.title) || 'Blog Yazısı', item: canonical.value },
      ].filter(Boolean),
    },
    null,
    2,
  ),
);

const articleJsonLd = computed(() =>
  JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      mainEntityOfPage: canonical.value,
      headline: stripHtml(post.value?.title || ''),
      description: stripHtml(post.value?.seo?.metaDesc || post.value?.excerpt || ''),
      image: seoImage ? [seoImage] : undefined,
      datePublished: post.value?.date,
      dateModified: post.value?.modified || post.value?.date,
      author: post.value?.author?.node
        ? { '@type': 'Person', name: post.value.author.node.name }
        : undefined,
      publisher: {
        '@type': 'Organization',
        name: siteName,
        logo: { '@type': 'ImageObject', url: logoUrl },
      },
      keywords: post.value?.tags?.nodes?.map((tag: any) => tag.name).join(', ') || '',
      inLanguage: 'tr-TR',
    },
    (key, value) => (value === undefined ? null : value),
    2,
  ),
);

useHead(() => ({
  script: [
    { type: 'application/ld+json', innerHTML: breadcrumbJsonLd.value },
    { type: 'application/ld+json', innerHTML: articleJsonLd.value },
  ],
}));
</script>

<template>
  <main class="container my-8">
    <article v-if="post" class="max-w-4xl mx-auto">
      <!-- Breadcrumb -->
      <nav class="mb-6 text-sm text-gray-500">
        <NuxtLink to="/" class="hover:text-primary">Ana Sayfa</NuxtLink>
        <span class="mx-2">/</span>
        <NuxtLink to="/blog" class="hover:text-primary">Blog</NuxtLink>
        <span v-if="post.categories?.nodes?.length" class="mx-2">/</span>
        <NuxtLink v-if="post.categories?.nodes?.length" :to="`/blog/kategori/${post.categories.nodes[0].slug}`" class="hover:text-primary">
          {{ post.categories.nodes[0].name }}
        </NuxtLink>
      </nav>

      <!-- Header -->
      <header class="mb-8">
        <div class="flex flex-wrap gap-2 mb-4">
          <NuxtLink
            v-for="category in post.categories?.nodes"
            :key="category.id"
            :to="`/blog/kategori/${category.slug}`"
            class="inline-flex items-center px-3 py-1 text-sm font-medium text-primary bg-primary/10 rounded-full hover:bg-primary/20 transition-colors">
            {{ category.name }}
          </NuxtLink>
        </div>

        <h1 class="text-3xl font-bold text-gray-900 mb-4 md:text-4xl lg:text-5xl" v-html="post.title" />

        <div class="flex items-center gap-6 text-sm text-gray-600">
          <div v-if="post.author?.node" class="flex items-center gap-3">
            <img v-if="post.author.node.avatar?.url" :src="post.author.node.avatar.url" :alt="post.author.node.name" class="w-10 h-10 rounded-full" />
            <div>
              <p class="font-medium text-gray-900">{{ post.author.node.name }}</p>
              <time :datetime="post.date" class="text-sm text-gray-500">{{ formatDate(post.date) }}</time>
            </div>
          </div>
          <div v-if="post.modified && post.modified !== post.date" class="text-gray-500">
            <span>Güncelleme: {{ formatDate(post.modified) }}</span>
          </div>
        </div>
      </header>

      <!-- Featured Image -->
      <div v-if="post.featuredImage?.node" class="mb-8 rounded-lg overflow-hidden">
        <NuxtImg
          :src="post.featuredImage.node.sourceUrl"
          :alt="featuredImageAlt"
          :width="post.featuredImage.node.mediaDetails?.width"
          :height="post.featuredImage.node.mediaDetails?.height"
          class="w-full h-auto"
          loading="eager"
          sizes="sm:640px md:768px lg:1024px" />
      </div>

      <!-- Content -->
      <div class="prose prose-lg max-w-none mb-12" v-html="processedContent" />

      <!-- Tags -->
      <div v-if="post.tags?.nodes?.length" class="py-8 border-t border-gray-200">
        <h3 class="text-sm font-semibold text-gray-900 mb-3">Etiketler:</h3>
        <div class="flex flex-wrap gap-2">
          <span v-for="tag in post.tags.nodes" :key="tag.id" class="inline-flex items-center px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded-full">
            <Icon name="ion:pricetag-outline" size="14" class="mr-1" />
            {{ tag.name }}
          </span>
        </div>
      </div>

      <!-- Author Bio -->
      <div v-if="post.author?.node?.description" class="p-6 bg-gray-50 rounded-lg border border-gray-200 mt-8">
        <div class="flex items-start gap-4">
          <img v-if="post.author.node.avatar?.url" :src="post.author.node.avatar.url" :alt="post.author.node.name" class="w-16 h-16 rounded-full" />
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ post.author.node.name }}</h3>
            <div class="text-gray-600 text-sm" v-html="post.author.node.description" />
          </div>
        </div>
      </div>
    </article>
  </main>
</template>

<style scoped>

.prose :deep(img) {
  @apply rounded-lg;
}

.prose :deep(a) {
  @apply text-primary hover:underline;
}

.prose :deep(h2) {
  @apply text-2xl font-bold mt-8 mb-4;
}

.prose :deep(h3) {
  @apply text-xl font-bold mt-6 mb-3;
}

.prose :deep(p) {
  @apply mb-4 leading-relaxed;
}

.prose :deep(ul),
.prose :deep(ol) {
  @apply mb-4 ml-6;
}

.prose :deep(li) {
  @apply mb-2;
}

.prose :deep(blockquote) {
  @apply border-l-4 border-primary pl-4 italic my-4;
}

.prose :deep(code) {
  @apply bg-gray-100 px-2 py-1 rounded text-sm;
}

.prose :deep(a[href*="/urun/"]) {
  @apply text-primary font-semibold hover:text-primary/80 underline decoration-2 underline-offset-2;
}

.prose :deep(a[href*="/urun-kategorisi/"]) {
  @apply text-primary hover:text-primary/80 underline decoration-2 underline-offset-2;
}

.prose :deep(pre) {
  @apply bg-gray-900 text-white p-4 rounded-lg overflow-x-auto my-4;
}

.prose :deep(pre code) {
  @apply bg-transparent p-0;
}
</style>
