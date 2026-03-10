<script setup lang="ts">
/**
 * 🌊 FeaturedCategories - Marine Themed
 *
 * Category showcase with hover effects and ocean styling.
 */
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-vue-next';

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  image?: string;
  productCount?: number;
  description?: string;
}

interface FeaturedCategoriesProps {
  categories: CategoryItem[];
  title?: string;
  subtitle?: string;
  columns?: 2 | 3 | 4 | 5;
  class?: string;
}

const props = withDefaults(defineProps<FeaturedCategoriesProps>(), {
  title: 'Kategoriler',
  subtitle: 'En çok satan kategorilerimizi keşfedin',
  columns: 4,
});
</script>

<template>
  <section :class="cn('py-12 md:py-16', props.class)">
    <div class="container-ocean">
      <!-- Section Header -->
      <div class="text-center mb-10">
        <h2 class="text-3xl md:text-4xl font-bold text-primary dark:text-white mb-3">
          {{ title }}
        </h2>
        <p class="text-muted-foreground max-w-2xl mx-auto">
          {{ subtitle }}
        </p>
      </div>

      <!-- Categories Grid -->
      <div
        :class="cn(
          'grid gap-4 md:gap-6',
          columns === 2 && 'grid-cols-1 sm:grid-cols-2',
          columns === 3 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
          columns === 4 && 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-4',
          columns === 5 && 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5'
        )"
      >
        <NuxtLink
          v-for="(category, index) in categories"
          :key="category.id"
          :to="`/urun-kategorisi/${category.slug}`"
          :class="cn(
            'group relative overflow-hidden rounded-xl aspect-[4/3]',
            'bg-gradient-ocean transition-all duration-300',
            'hover:shadow-ocean-lg hover:-translate-y-1'
          )"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <!-- Background Image -->
          <NuxtImg
            v-if="category.image"
            :src="category.image"
            :alt="category.name"
            class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            preset="thumbnail"
            loading="lazy"
          />

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
    </div>
  </section>
</template>
