<script setup lang="ts">
const route = useRoute();
const slug = route.params.slug as string;

const { data } = await useAsyncGql('getPostsByCategory', { slug, first: 12 });
const posts = computed(() => data.value?.posts?.nodes || []);
const pageInfo = computed(() => data.value?.posts?.pageInfo);

// Get category from first post
const category = computed(() => {
  if (posts.value.length > 0) {
    return posts.value[0].categories?.nodes?.find((cat: any) => cat.slug === slug);
  }
  return null;
});

if (!posts.value.length) {
  throw createError({ statusCode: 404, statusMessage: 'Kategori bulunamadı veya bu kategoride yazı bulunmuyor' });
}

const { formatDate } = useHelpers();

useSeoMeta({
  title: `${category.value?.name || slug} - Blog Kategorisi`,
  description: category.value?.description || `${category.value?.name || slug} kategorisindeki blog yazıları`,
  ogTitle: `${category.value?.name || slug} - Blog Kategorisi`,
  ogDescription: category.value?.description || `${category.value?.name || slug} kategorisindeki blog yazıları`,
});

// Structured Data: BreadcrumbList + ItemList for category
const { frontEndUrl, stripHtml } = useHelpers();
const breadcrumbJsonLd = computed(() =>
  JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: frontEndUrl },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${frontEndUrl}/blog` },
        { '@type': 'ListItem', position: 3, name: category.value?.name || slug || 'Kategori', item: `${frontEndUrl}/blog/kategori/${slug}` },
      ],
    },
    null,
    2,
  ),
);

const itemListJsonLd = computed(() => {
  const items = (posts.value || []).slice(0, 10).map((p: any, idx: number) => ({
    '@type': 'ListItem', position: idx + 1, url: `${frontEndUrl}/blog/${p.slug}`,
    name: stripHtml(p?.title) || 'Blog Yazısı',
  }));
  return JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: `${category.value?.name || slug} Yazıları`,
      itemListElement: items,
    },
    null,
    2,
  );
});

useHead(() => ({
  script: [
    { type: 'application/ld+json', innerHTML: breadcrumbJsonLd.value },
  { type: 'application/ld+json', innerHTML: itemListJsonLd.value },
  ],
}));
</script>

<template>
  <main class="container my-8">
    <!-- Breadcrumb -->
    <nav class="mb-6 text-sm text-gray-500">
      <NuxtLink to="/" class="hover:text-primary">Ana Sayfa</NuxtLink>
      <span class="mx-2">/</span>
      <NuxtLink to="/blog" class="hover:text-primary">Blog</NuxtLink>
      <span class="mx-2">/</span>
      <span class="text-gray-900">{{ category?.name }}</span>
    </nav>

    <!-- Category Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 md:text-4xl">{{ category?.name }}</h1>
      <p v-if="category?.description" class="mt-2 text-gray-600" v-html="category.description" />
      <p v-if="category?.count" class="mt-2 text-sm text-gray-500">{{ category.count }} yazı</p>
    </div>

    <!-- Posts Grid -->
    <div v-if="posts.length" class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      <article v-for="post in posts" :key="post.id" class="overflow-hidden bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
        <NuxtLink :to="`/blog/${post.slug}`">
          <div v-if="post.featuredImage?.node" class="aspect-video overflow-hidden bg-gray-100">
            <NuxtImg
              :src="post.featuredImage.node.sourceUrl"
              :alt="post.featuredImage.node.altText || post.title"
              class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              loading="lazy"
              sizes="sm:320px md:400px lg:500px" />
          </div>
          <div v-else class="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <Icon name="ion:image-outline" size="48" class="text-primary/40" />
          </div>
        </NuxtLink>

        <div class="p-6">
          <div class="flex items-center gap-4 mb-3 text-sm text-gray-500">
            <time :datetime="post.date">{{ formatDate(post.date) }}</time>
          </div>

          <NuxtLink :to="`/blog/${post.slug}`">
            <h2 class="text-xl font-semibold text-gray-900 mb-2 hover:text-primary transition-colors line-clamp-2" v-html="post.title" />
          </NuxtLink>

          <div v-if="post.excerpt" class="text-gray-600 text-sm line-clamp-3 mb-4" v-html="post.excerpt" />

          <div v-if="post.author?.node" class="flex items-center gap-3 pt-4 border-t border-gray-100">
            <img v-if="post.author.node.avatar?.url" :src="post.author.node.avatar.url" :alt="post.author.node.name" class="w-8 h-8 rounded-full" />
            <div class="text-sm">
              <p class="font-medium text-gray-900">{{ post.author.node.name }}</p>
            </div>
          </div>
        </div>
      </article>
    </div>

    <div v-else class="py-12 text-center text-gray-500">
      <Icon name="ion:document-text-outline" size="48" class="mx-auto mb-4 opacity-40" />
      <p>Bu kategoride henüz blog yazısı bulunmuyor.</p>
    </div>
  </main>
</template>
