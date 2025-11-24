<script lang="ts" setup>
import { ProductsOrderByEnum } from '#woo';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const siteName = process.env.NUXT_PUBLIC_GOOGLE_MERCHANT_SHOP_NAME || '';
const { description, shortDescription, siteImage } = useAppConfig();

const { data } = await useAsyncGql('getProductCategories', { first: 6 });
const productCategories = data.value?.productCategories?.nodes || [];

const { data: productData } = await useAsyncGql('getProducts', { first: 5, orderby: ProductsOrderByEnum.POPULARITY });
const popularProducts = productData.value.products?.nodes || [];

useSeoMeta({
  title: `${siteName} – AnaSayfa`,
  ogTitle: siteName,
  description: description,
  ogDescription: shortDescription,
  ogImage: siteImage,
  twitterCard: `summary_large_image`,
});

const trustBadges = [
  {
    title: 'Ücretsiz Kargo',
    description: 'Tüm Siparişlerinizde Ücretsiz Kargo',
    icon: '/icons/box.svg',
  },
  {
    title: '2 Yıl Garanti',
    description: '2 Yıl Garantili Ürünler',
    icon: '/icons/moneyback.svg',
  },
  {
    title: '100% Güvenli Ödeme',
    description: 'Ödemeleriniz bizimle güvende.',
    icon: '/icons/secure.svg',
  },
  {
    title: 'Destek 24/7',
    description: '24/7 Online Destek',
    icon: '/icons/support.svg',
  },
  {
    title: 'Destek 24/7',
    description: '24/7 Online Destek',
    icon: '/icons/support.svg',
  },
];

// Handle redirect from payment gateway to homepage
const route = useRoute();
const router = useRouter();
const lastOrderCookie = useCookie('woonuxt_last_order');

onMounted(() => {
  const { key } = route.query;
  if (key && typeof key === 'string' && key.startsWith('wc_order')) {
    // Check if we have a stored order ID for this key
    const storedOrder = lastOrderCookie.value as any;
    if (storedOrder && storedOrder.orderKey === key && storedOrder.orderId) {
      router.push(`/odeme/siparis-alindi/${storedOrder.orderId}?key=${key}`);
    }
  }
});
</script>

<template>
  <main class="bg-background min-h-screen">
    <HeroBanner />

    <!-- Brand Logos Section -->
    <div class="container py-12">
      <div class="flex flex-wrap items-center justify-center gap-8 md:justify-between opacity-80 grayscale hover:grayscale-0 transition-all duration-500">
        <img src="/images/netamarine-logo.svg" alt="Netamarine" class="h-12 md:h-16 object-contain" />
        <NuxtLink to="/shop/brand/parsun" class="hover:scale-105 transition-transform">
          <img src="/images/parsun-logo.svg" alt="Parsun" class="h-12 md:h-16 object-contain" />
        </NuxtLink>
        <img src="/images/makoshark-logo.svg" alt="Mako Shark" class="h-12 md:h-16 object-contain" />
        <img src="/images/nxt-logo.svg" alt="NXT" class="h-10 md:h-14 object-contain" />
        <NuxtLink to="/shop/brand/btm" class="hover:scale-105 transition-transform">
          <img src="/images/btm-logo.svg" alt="BTM" class="h-10 md:h-14 object-contain" />
        </NuxtLink>
      </div>
    </div>

    <!-- Shop by Category Section -->
    <section class="container py-16">
      <div class="flex items-end justify-between mb-8">
        <div>
          <h2 class="text-3xl font-bold text-primary-dark tracking-tight">{{ $t('shop.shopByCategory') }}</h2>
          <p class="text-muted-foreground mt-2">İhtiyacınız olan her şey burada.</p>
        </div>
        <NuxtLink class="text-primary font-semibold hover:underline flex items-center gap-1" to="/kategoriler">
          {{ $t('general.viewAll') }}
          <span class="text-xl">→</span>
        </NuxtLink>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        <CategoryCard v-for="(category, i) in productCategories" :key="i" class="w-full" :node="category" />
      </div>
    </section>

    <!-- Trust Badges Section -->
    <section class="container py-16 bg-secondary/30 rounded-3xl my-12">
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card v-for="(badge, index) in trustBadges" :key="index" class="border-none shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
          <CardHeader class="flex flex-row items-center gap-4 pb-2">
            <div class="p-3 bg-primary/10 rounded-full">
              <img :src="badge.icon" width="40" height="40" :alt="badge.title" loading="lazy" class="w-10 h-10" />
            </div>
          </CardHeader>
          <CardContent>
            <CardTitle class="text-lg font-bold text-primary-dark mb-2">{{ badge.title }}</CardTitle>
            <CardDescription class="text-sm text-muted-foreground">{{ badge.description }}</CardDescription>
          </CardContent>
        </Card>
      </div>
    </section>

    <!-- Popular Products Section -->
    <section class="container py-16" v-if="popularProducts">
      <div class="flex items-end justify-between mb-8">
        <div>
          <h2 class="text-3xl font-bold text-primary-dark tracking-tight">{{ $t('shop.popularProducts') }}</h2>
          <p class="text-muted-foreground mt-2">En çok tercih edilen ürünlerimiz.</p>
        </div>
        <NuxtLink class="text-primary font-semibold hover:underline flex items-center gap-1" to="/urunler">
          {{ $t('general.viewAll') }}
          <span class="text-xl">→</span>
        </NuxtLink>
      </div>
      <ProductRow :products="popularProducts" class="grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6" />
    </section>
  </main>
</template>

<style scoped>
/* Custom styles if needed */
</style>
