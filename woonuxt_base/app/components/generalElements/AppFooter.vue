<script setup lang="ts">
const { wooNuxtVersionInfo } = useHelpers();
const { wishlistLink } = useAuth();
</script>

<template>
  <footer class="bg-white order-last">
    <div class="container flex flex-wrap justify-between gap-12 my-24 md:gap-24">
      <div class="mr-auto">
        <Logo />
        <WebsiteShortDescription />
      </div>
      <div class="w-3/7 lg:w-auto">
        <div class="mb-1 font-semibold">{{ $t('general.information') }}</div>
        <div class="text-sm">
          <ClientOnly>
            <NuxtLink to="/hakkimizda" class="py-1.5 block">{{ $t('general.about') }}</NuxtLink>
            <template #fallback>
              <a href="/hakkimizda" class="py-1.5 block">{{ $t('general.about') }}</a>
            </template>
          </ClientOnly>
          <ClientOnly>
            <NuxtLink to="/iletisim" class="py-1.5 block">{{ $t('general.contact') }}</NuxtLink>
            <template #fallback>
              <a href="/iletisim" class="py-1.5 block">{{ $t('general.contact') }}</a>
            </template>
          </ClientOnly>
          <ClientOnly>
            <NuxtLink to="/sss" class="py-1.5 block">SSS</NuxtLink>
            <template #fallback>
              <a href="/sss" class="py-1.5 block">SSS</a>
            </template>
          </ClientOnly>
        </div>
      </div>
      <div class="w-3/7 lg:w-auto">
        <div class="mb-1 font-semibold">{{ $t('general.products') }}</div>
        <div class="text-sm">
          <ClientOnly>
            <NuxtLink to="/urunler" class="py-1.5 block">{{ $t('shop.newArrivals') }}</NuxtLink>
            <template #fallback>
              <a href="/urunler" class="py-1.5 block">{{ $t('shop.newArrivals') }}</a>
            </template>
          </ClientOnly>
          <ClientOnly>
            <NuxtLink to="/urunler?filter=sale[true]" class="py-1.5 block">{{ $t('shop.onSale') }}</NuxtLink>
            <template #fallback>
              <a href="/urunler?filter=sale[true]" class="py-1.5 block">{{ $t('shop.onSale') }}</a>
            </template>
          </ClientOnly>
          <ClientOnly>
            <NuxtLink to="/urunler?orderby=rating&order=ASC&filter=rating[1]" class="py-1.5 block">{{ $t('shop.topRated') }}</NuxtLink>
            <template #fallback>
              <a href="/urunler?orderby=rating&order=ASC&filter=rating[1]" class="py-1.5 block">{{ $t('shop.topRated') }}</a>
            </template>
          </ClientOnly>
          <a href="/" class="py-1.5 block">{{ $t('shop.giftCards') }}</a>
        </div>
      </div>
      <div class="w-3/7 lg:w-auto">
        <div class="mb-1 font-semibold">{{ $t('general.customerService') }}</div>
        <div class="text-sm">
          <ClientOnly>
            <NuxtLink to="/iletisim" class="py-1.5 block">{{ $t('general.contactUs') }}</NuxtLink>
            <template #fallback>
              <a href="/iletisim" class="py-1.5 block">{{ $t('general.contactUs') }}</a>
            </template>
          </ClientOnly>
          <ClientOnly>
            <NuxtLink to="/kargo-ve-teslimat" class="py-1.5 block">Kargo ve Teslimat</NuxtLink>
            <template #fallback>
              <a href="/kargo-ve-teslimat" class="py-1.5 block">Kargo ve Teslimat</a>
            </template>
          </ClientOnly>
          <ClientOnly>
            <NuxtLink to="/iade-ve-degisim" class="py-1.5 block">İade ve Değişim</NuxtLink>
            <template #fallback>
              <a href="/iade-ve-degisim" class="py-1.5 block">İade ve Değişim</a>
            </template>
          </ClientOnly>
          <ClientOnly>
            <NuxtLink to="/teslimat-bilgileri" class="py-1.5 block">Teslimat Bilgileri</NuxtLink>
            <template #fallback>
              <a href="/teslimat-bilgileri" class="py-1.5 block">Teslimat Bilgileri</a>
            </template>
          </ClientOnly>
          <ClientOnly>
            <NuxtLink to="/gizlilik-politikasi" class="py-1.5 block">{{ $t('general.privacyPolicy') }}</NuxtLink>
            <template #fallback>
              <a href="/gizlilik-politikasi" class="py-1.5 block">{{ $t('general.privacyPolicy') }}</a>
            </template>
          </ClientOnly>
        </div>
      </div>
      <div class="w-3/7 lg:w-auto">
        <div class="mb-1 font-semibold">{{ $t('account.myAccount') }}</div>
        <div class="text-sm">
          <ClientOnly>
            <NuxtLink to="/hesabim/" class="py-1.5 block">{{ $t('account.myAccount') }}</NuxtLink>
            <template #fallback>
              <a href="/hesabim/" class="py-1.5 block">{{ $t('account.myAccount') }}</a>
            </template>
          </ClientOnly>
          <ClientOnly>
            <NuxtLink to="/hesabim/?tab=orders" class="py-1.5 block">{{ $t('shop.orderHistory') }}</NuxtLink>
            <template #fallback>
              <a href="/hesabim/?tab=orders" class="py-1.5 block">{{ $t('shop.orderHistory') }}</a>
            </template>
          </ClientOnly>
          <ClientOnly>
            <NuxtLink :to="wishlistLink" class="py-1.5 block">{{ $t('shop.wishlist') }}</NuxtLink>
            <template #fallback>
              <a href="/istek-listesi" class="py-1.5 block">{{ $t('shop.wishlist') }}</a>
            </template>
          </ClientOnly>
          <a href="/" class="py-1.5 block">{{ $t('general.newsletter') }}</a>
        </div>
      </div>
    </div>
    <div class="container border-t flex items-center justify-center mb-4">
      <div class="copywrite">
        <p class="py-4 text-xs text-center">
          <a href="https://netasolutions.com" :title="`NetaCommerce v${wooNuxtVersionInfo}`">{{ `NetaCommerce v${wooNuxtVersionInfo}` }}</a> - by
          
        </p>
      </div>
      <SocialIcons class="ml-auto" />
    </div>
  </footer>
</template>

<style scoped lang="postcss">
a {
  @apply hover:underline;
}
</style>
