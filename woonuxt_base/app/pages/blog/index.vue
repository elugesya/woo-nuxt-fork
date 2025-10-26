<script setup lang="ts">
const { data } = await useAsyncGql('getPosts', { first: 12 });
const posts = computed(() => data.value?.posts?.nodes || []);
const pageInfo = computed(() => data.value?.posts?.pageInfo);

const { formatDate } = useHelpers();

useSeoMeta({
  title: 'Blog',
  description: 'En son haberler, ipuçları ve rehberler',
  ogTitle: 'Blog',
  ogDescription: 'En son haberler, ipuçları ve rehberler',
});

// Structured Data: BreadcrumbList + Blog + ItemList of posts
const { frontEndUrl } = useHelpers();
const breadcrumbJsonLd = computed(() =>
  JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: frontEndUrl },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${frontEndUrl}/blog` },
      ],
    },
    null,
    2,
  ),
);

const blogJsonLd = computed(() =>
  JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: 'Blog',
      url: `${frontEndUrl}/blog`,
    },
    null,
    2,
  ),
);

const itemListJsonLd = computed(() => {
  const items = (posts.value || []).slice(0, 10).map((p: any, idx: number) => ({
    '@type': 'ListItem', position: idx + 1, url: `${frontEndUrl}/blog/${p.slug}`, name: p.title,
  }));
  return JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Blog Yazıları',
      itemListElement: items,
    },
    null,
    2,
  );
});

useHead(() => ({
  script: [
    { type: 'application/ld+json', innerHTML: breadcrumbJsonLd.value },
    { type: 'application/ld+json', innerHTML: blogJsonLd.value },
    { type: 'application/ld+json', innerHTML: blogPostListJsonLd.value },
  ],
}));
</script>

<template>
  <main class="container my-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 md:text-4xl">Blog</h1>
      <p class="mt-2 text-gray-600">En son haberler, ipuçları ve rehberler</p>
    </div>

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
            <span v-if="post.categories?.nodes?.length" class="flex items-center gap-1">
              <Icon name="ion:folder-outline" size="16" />
              <NuxtLink :to="`/blog/kategori/${post.categories.nodes[0].slug}`" class="hover:text-primary">
                {{ post.categories.nodes[0].name }}
              </NuxtLink>
            </span>
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
      <p>Henüz blog yazısı bulunmuyor.</p>
    </div>
  </main>
</template>
