<script setup lang="ts">
const { wishlistLink, navigateToLogin } = useAuth();
const route = useRoute();
</script>

<template>
  <nav>
    <NuxtLink to="/">{{ $t('general.home') }}</NuxtLink>
    <NuxtLink to="/urunler">{{ $t('general.products') }}</NuxtLink>
    <NuxtLink to="/kategoriler">{{ $t('shop.category', 2) }}</NuxtLink>
    <NuxtLink to="/iletisim">{{ $t('general.contact') }}</NuxtLink>
    <NuxtLink class="lg:hidden" :to="wishlistLink" :prefetch="false">Wishlist</NuxtLink>
    <NuxtLink class="lg:hidden" to="/hesabim" @click="navigateToLogin(route.fullPath)" :prefetch="false">My Account</NuxtLink>
  </nav>
</template>
