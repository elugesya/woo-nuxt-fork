<script setup lang="ts">
/**
 * 🌊 Categories Page - Marine Themed
 *
 * All categories page with ocean-inspired design matching the homepage.
 */
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-vue-next';

const { data } = await useAsyncGql('getProductCategories');

interface CategoryItem {
  databaseId?: number;
  id: string;
  name: string;
  slug: string;
  image?: { sourceUrl?: string };
  count?: number;
  description?: string;
}

const productCategories = computed(() => {
  const nodes = (data.value?.productCategories?.nodes as ProductCategory[]) || [];
  return nodes.map((cat: any) => ({
    id: cat.databaseId?.toString() || cat.id,
    name: cat.name,
    slug: cat.slug,
    image: cat.image?.sourceUrl,
    productCount: cat.count,
  }));
});

// SEO
useSeoMeta({
  title: 'Kategoriler',
  description: 'Tüm ürün kategorilerimizi keşfedin. Dıştan takma motorlar, şişme botlar ve denizcilik ekipmanları.',
});

// Column classes for responsive grid
const columnClasses = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
</script>

<template>
  <main class="min-h-screen py-12 md:py-16">
    <div class="container-ocean">
      <!-- 📋 Page Header -->
      <div class="text-center mb-10">
        <span class="text-secondary text-sm font-semibold uppercase tracking-widest mb-2 block">
          Kategoriler
        </span>
        <h1 class="text-3xl md:text-4xl font-bold text-primary dark:text-white mb-3">
          Ürün Kategorileri
        </h1>
        <p class="text-muted-foreground max-w-2xl mx-auto">
          İhtiyacınız olan her şeyi kolayca bulun
        </p>
      </div>

      <!-- 🏷️ Categories Grid -->
      <div
        v-if="productCategories.length > 0"
        :class="cn(
          'grid gap-4 md:gap-6',
          columnClasses
        )"
      >
        <NuxtLink
          v-for="(category, index) in productCategories"
          :key="category.id"
          :to="`/urun-kategorisi/${category.slug}`"
          :class="cn(
            'group relative overflow-hidden rounded-xl aspect-[4/3]',
            'bg-gradient-ocean transition-all duration-300',
            'hover:shadow-ocean-lg hover:-translate-y-1'
          )"
          :style="{ animationDelay: `${index * 0.05}s` }"
        >
          <!-- Background Image -->
          <NuxtImg
            v-if="category.image"
            :src="category.image"
            :alt="category.name"
            class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            width="400"
            height="300"
            loading="lazy"
          />
          <div
            v-else
            class="absolute inset-0 w-full h-full bg-gradient-to-br from-secondary/20 to-primary/20 flex items-center justify-center"
          >
            <svg class="w-16 h-16 text-secondary/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>

          <!-- Overlay -->
          <div class="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent" />

          <!-- Content -->
          <div class="absolute inset-0 flex flex-col justify-end p-4 md:p-6">
            <h3 class="text-lg md:text-xl font-bold text-white mb-1 group-hover:text-secondary transition-colors">
              {{ category.name }}
            </h3>

            <p
              v-if="category.productCount"
              class="text-sm text-white/70"
            >
              {{ category.productCount }} Ürün
            </p>

            <!-- Arrow indicator -->
            <div class="mt-3 flex items-center gap-2 text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
              <span class="text-sm font-medium">Keşfet</span>
              <ArrowRight class="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </NuxtLink>
      </div>

      <!-- Empty State -->
      <div
        v-else
        class="text-center py-16"
      >
        <svg class="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        <p class="text-muted-foreground">
          Henüz kategori bulunmuyor.
        </p>
      </div>
    </div>
  </main>
</template>
