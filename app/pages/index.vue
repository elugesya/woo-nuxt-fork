<script setup lang="ts">
/**
 * 🌊 Homepage - Sea Toys & Marine Web Shop
 *
 * Premium marine-themed homepage with:
 * - Hero Banner (StackZero style)
 * - Featured Categories (ShadCN cards)
 * - Bestsellers Grid (using same ProductCard as all pages)
 * - Promo Banner (StackZero banner)
 * - Newsletter (ShadCN form)
 */

// Explicitly import custom components to avoid auto-import issues
import HeroBanner from '~/components/home/HeroBanner.vue';
import FeaturedCategories from '~/components/home/FeaturedCategories.vue';
import HomeProductGrid from '~/components/commerce/HomeProductGrid.vue';
import PromoBanner from '~/components/home/PromoBanner.vue';
import Newsletter from '~/components/home/Newsletter.vue';

// Fetch products using existing GQL query
const { data: productsData } = await useAsyncGql('getProducts', { first: 8 });

// Fetch categories
const { data: categoriesData } = await useAsyncGql('getProductCategories', { first: 4 });

// Products are passed directly to HomeProductGrid (no transformation needed)
const bestsellers = computed(() => productsData.value?.products?.nodes || []);

// Transform categories
const featuredCategories = computed(() => {
  const nodes = categoriesData.value?.productCategories?.nodes;
  if (!nodes) return [];

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
  title: 'Deniz Tutkusu - Premium Deniz Malzemeleri',
  description: 'Deniz sporları ve eğlence için en kaliteli ürünler. Güvenli alışveriş, hızlı kargo.',
});

// Structured Data: CollectionPage for featured products + WebSite schema
const { frontEndUrl } = useHelpers();
const runtimeConfig = useRuntimeConfig();
const siteName = runtimeConfig.public.SITE_NAME || 'Deniz Tutkusu';

// Featured products for CollectionPage schema
const featuredProductsJsonLd = computed(() => {
  const items = bestsellers.value.slice(0, 8).map((p: any, idx: number) => ({
    '@type': 'ListItem',
    position: idx + 1,
    url: `${frontEndUrl}/urun/${p.slug}`,
    name: p.name,
    image: p.image?.sourceUrl,
    price: p.rawPrice || p.price,
  }));
  return JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Deniz Tutkusu - Ana Sayfa',
      description: 'Deniz sporları ve eğlence için en kaliteli ürünler. Güvenli alışveriş, hızlı kargo.',
      url: frontEndUrl,
      mainEntity: {
        '@type': 'ItemList',
        name: 'Çok Satanlar',
        itemListOrder: 'http://schema.org/ItemListOrderDescending',
        itemListElement: items,
      },
    },
    null,
    2,
  );
});

useHead(() => ({
  script: [
    { type: 'application/ld+json', innerHTML: featuredProductsJsonLd.value },
  ],
}));
</script>

<template>
  <div class="min-h-screen">
    <!-- 🌊 Hero Section -->
    <HeroBanner
      title="Kampanya Botu"
      description="Sana özel fırsatları keşfet!"
      button-text="İncele"
      button-link="/urunler?filter=on-sale"
    />

    <!-- 🏷️ Featured Categories -->
    <FeaturedCategories
      v-if="featuredCategories.length > 0"
      title="Popüler Kategoriler"
      subtitle="En çok tercih edilen kategorilerimizi keşfedin"
      :categories="featuredCategories"
      :columns="4"
      class="bg-white dark:bg-gray-900"
    />

    <!-- ⭐ Bestsellers Section -->
    <section class="py-12 md:py-16 section-seafoam">
      <div class="container-ocean">
        <!-- Section Header -->
        <div class="text-center mb-10">
          <span class="text-secondary text-sm font-semibold uppercase tracking-widest mb-2 block">
            Çok Satanlar
          </span>
          <h2 class="text-3xl md:text-4xl font-bold text-primary dark:text-white mb-3">
            En Beğenilen Ürünler
          </h2>
          <p class="text-muted-foreground max-w-2xl mx-auto">
            Müşterilerimizin en çok tercih ettiği ürünler
          </p>
        </div>

        <!-- Products Grid -->
        <HomeProductGrid
          v-if="bestsellers.length > 0"
          :products="bestsellers"
          :columns="4"
        />

        <!-- Empty State -->
        <div
          v-else
          class="text-center py-12"
        >
          <p class="text-muted-foreground">
            Henüz ürün bulunmuyor.
          </p>
        </div>

        <!-- View All Button -->
        <div class="text-center mt-10">
          <NuxtLink
            to="/urunler"
            class="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all
                   bg-primary text-white hover:bg-primary/90 hover:shadow-ocean"
          >
            Tüm Ürünleri Gör
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- 🎁 Promo Banner -->
    <PromoBanner
      title="İkinci Siparişe Özel %5 İndirim!"
      description="Yeni üyelerimize özel indirim ve ücretsiz kargo fırsatını kaçırmayın"
      cta-text="Fırsatı Yakala"
      cta-href="/urunler?filter=on-sale"
      variant="coral"
    />

    <!-- 🌟 Features Section -->
    <section class="py-12 md:py-16 bg-white dark:bg-gray-900">
      <div class="container-ocean">
        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Free Shipping -->
          <div class="flex items-start gap-4 p-6 rounded-xl bg-seafoam dark:bg-gray-800">
            <div class="flex-shrink-0 w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
              <svg class="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-primary dark:text-white mb-1">Ücretsiz Kargo</h3>
              <p class="text-sm text-muted-foreground">5000₺ üzeri siparişlerde</p>
            </div>
          </div>

          <!-- Secure Payment -->
          <div class="flex items-start gap-4 p-6 rounded-xl bg-seafoam dark:bg-gray-800">
            <div class="flex-shrink-0 w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
              <svg class="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-primary dark:text-white mb-1">Güvenli Ödeme</h3>
              <p class="text-sm text-muted-foreground">256-bit SSL şifreleme</p>
            </div>
          </div>

          <!-- Easy Returns -->
          <div class="flex items-start gap-4 p-6 rounded-xl bg-seafoam dark:bg-gray-800">
            <div class="flex-shrink-0 w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
              <svg class="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-primary dark:text-white mb-1">Kolay İade</h3>
              <p class="text-sm text-muted-foreground">14 gün içinde ücretsiz iade</p>
            </div>
          </div>

          <!-- Support -->
          <div class="flex items-start gap-4 p-6 rounded-xl bg-seafoam dark:bg-gray-800">
            <div class="flex-shrink-0 w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
              <svg class="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-primary dark:text-white mb-1">7/24 Destek</h3>
              <p class="text-sm text-muted-foreground">Her zaman yanınızdayız</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 📧 Newsletter -->
    <Newsletter
      title="Bültenimize Abone Olun"
      description="Yeni ürünler, kampanyalar ve deniz haberleri için bültenimize abone olun."
      placeholder="E-posta adresiniz"
      button-text="Abone Ol"
    />
  </div>
</template>
