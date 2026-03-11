<script setup lang="ts">
/**
 * 🌊 MobileMenu - Marine Themed
 *
 * Slide-in mobile navigation with ocean-inspired styling.
 */
import { cn } from '@/lib/utils';
import { Anchor, Waves, X, Home, Package, Grid, BookOpen, Mail, Heart, User, ChevronRight } from 'lucide-vue-next';

const { toggleMobileMenu, wooNuxtVersionInfo } = useHelpers();
const { wishlistLink, navigateToLogin } = useAuth();
const route = useRoute();
const runtimeConfig = useRuntimeConfig();

// Get contact info from runtime config (.env)
const orgPhone = runtimeConfig.public.ORGANIZATION_PHONE || '+90 533 6045002';
const orgEmail = runtimeConfig.public.ORGANIZATION_CONTACT_EMAIL || 'info@ntmc.com.tr';

const navItems = [
  { to: '/', label: 'Ana Sayfa', icon: Home },
  { to: '/urunler', label: 'Ürünler', icon: Package },
  { to: '/kategoriler', label: 'Kategoriler', icon: Grid },
  { to: '/blog', label: 'Blog', icon: BookOpen },
  { to: '/iletisim', label: 'İletişim', icon: Mail },
];

const accountItems = [
  { to: wishlistLink.value, label: 'Favorilerim', icon: Heart },
  { to: '/hesabim', label: 'Hesabım', icon: User },
];

const isActive = (path: string) => route.path === path;

const handleNavClick = (path: string) => {
  if (path === '/hesabim') {
    navigateToLogin(route.fullPath);
  }
  toggleMobileMenu(false);
};
</script>

<template>
  <div
    :class="cn(
      'flex flex-col max-w-sm w-11/12 fixed top-0 bottom-0 left-0 z-50',
      'bg-white shadow-2xl overflow-x-hidden'
    )"
  >
    <!-- Header with Wave Background -->
    <div class="relative bg-gradient-ocean text-white p-6">
      <!-- Wave Pattern -->
      <div class="absolute inset-0 opacity-10">
        <svg class="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path
            fill="white"
            d="M0,50 Q25,30 50,50 T100,50 V100 H0 Z"
          />
        </svg>
      </div>

      <!-- Close Button -->
      <button
        type="button"
        :class="cn(
          'absolute top-4 right-4 p-2 rounded-full',
          'bg-white/20 hover:bg-white/30 backdrop-blur-sm',
          'transition-colors cursor-pointer z-50'
        )"
        @click.prevent.stop="toggleMobileMenu(false)"
        aria-label="Menüyü kapat"
      >
        <X class="w-5 h-5" />
      </button>

      <!-- Logo -->
      <div class="relative flex items-center gap-3">
        <div class="relative">
          <Anchor class="w-10 h-10" />
          <div class="absolute -bottom-1 -right-1 w-3 h-3 bg-accent rounded-full" />
        </div>
        <div>
          <span class="text-2xl font-bold">Neta</span>
          <span class="text-2xl font-bold text-secondary-light">Marine</span>
        </div>
      </div>

      <!-- Tagline -->
      <p class="relative mt-2 text-sm text-white/80 flex items-center gap-2">
        <Waves class="w-4 h-4" />
        Deniz Tutkusu
      </p>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto py-6 px-4">
      <!-- Main Navigation -->
      <div class="mb-6">
        <h3 class="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-4">
          Menü
        </h3>
        <ul class="space-y-1">
          <li v-for="item in navItems" :key="item.to">
            <NuxtLink
              :to="item.to"
              :class="cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                isActive(item.to)
                  ? 'bg-secondary/10 text-secondary font-medium'
                  : 'text-foreground hover:bg-seafoam hover:text-secondary'
              )"
              @click="toggleMobileMenu(false)"
            >
              <component :is="item.icon" class="w-5 h-5" />
              <span class="flex-1">{{ item.label }}</span>
              <ChevronRight :class="cn('w-4 h-4', isActive(item.to) ? 'opacity-100' : 'opacity-0')" />
            </NuxtLink>
          </li>
        </ul>
      </div>

      <!-- Account Links -->
      <div class="mb-6">
        <h3 class="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-4">
          Hesabım
        </h3>
        <ul class="space-y-1">
          <li v-for="item in accountItems" :key="item.to">
            <NuxtLink
              :to="item.to"
              :class="cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                'text-foreground hover:bg-seafoam hover:text-secondary'
              )"
              @click="handleNavClick(item.to)"
            >
              <component :is="item.icon" class="w-5 h-5" />
              <span class="flex-1">{{ item.label }}</span>
              <ChevronRight class="w-4 h-4 opacity-0" />
            </NuxtLink>
          </li>
        </ul>
      </div>

      <!-- Promo Banner -->
      <div class="mx-4 p-4 bg-gradient-ocean rounded-xl text-white">
        <p class="font-semibold mb-1">Ücretsiz Kargo!</p>
        <p class="text-sm text-white/80">5000₺ üzeri siparişlerde</p>
      </div>
    </nav>

    <!-- Footer -->
    <div class="border-t border-border p-4">
      <!-- Contact Info -->
      <div class="text-center text-sm text-muted-foreground mb-4">
        <p class="mb-1">📞 {{ orgPhone }}</p>
        <p>📧 {{ orgEmail }}</p>
      </div>

      <!-- Version Info -->
      <div class="text-center text-xs text-muted-foreground">
        <a href="/" :title="wooNuxtVersionInfo">
          NetaCommerce v{{ wooNuxtVersionInfo }}
        </a>
      </div>
    </div>
  </div>
</template>
