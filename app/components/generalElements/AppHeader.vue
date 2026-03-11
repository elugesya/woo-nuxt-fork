<script setup lang="ts">
/**
 * 🌊 AppHeader - Marine Themed
 *
 * Premium header with ocean-inspired styling.
 * Sticky header with wave accent and ocean gradient on scroll.
 */
import { cn } from '@/lib/utils';
import { Anchor, Search, ShoppingCart, User, Menu, Heart, Waves } from 'lucide-vue-next';

const { isShowingSearch } = useSearching();
const { isShowingCart, cart } = useCart();
const { wishlistLink, navigateToLogin } = useAuth();
const { toggleMobileMenu } = useHelpers();
const route = useRoute();
const runtimeConfig = useRuntimeConfig();
const isScrolled = ref(false);

// Get phone from runtime config (.env)
const orgPhone = runtimeConfig.public.ORGANIZATION_PHONE || '+90 533 6045002';

// Track scroll for header background change
onMounted(() => {
  const handleScroll = () => {
    isScrolled.value = window.scrollY > 20;
  };
  window.addEventListener('scroll', handleScroll);
  onUnmounted(() => window.removeEventListener('scroll', handleScroll));
});

const navLinks = [
  { to: '/', label: 'Ana Sayfa' },
  { to: '/urunler', label: 'Ürünler' },
  { to: '/kategoriler', label: 'Kategoriler' },
  { to: '/blog', label: 'Blog' },
  { to: '/iletisim', label: 'İletişim' },
];

const isActive = (path: string) => route.path === path;
</script>

<template>
  <header
    :class="cn(
      'sticky top-0 z-40 transition-all duration-300',
      isScrolled
        ? 'bg-white/95 backdrop-blur-md shadow-ocean'
        : 'bg-white border-b border-seafoam'
    )"
  >
    <!-- Top Bar - Marine Accent -->
    <div class="bg-gradient-ocean text-white py-2 text-sm hidden md:block">
      <div class="container-ocean flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <Waves class="w-4 h-4" />
            <span>Ücretsiz Kargo - 500₺ Üzeri</span>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <a :href="`tel:${orgPhone.replace(/\s/g, '')}`" class="hover:text-secondary transition-colors">
            📞 {{ orgPhone }}
          </a>
        </div>
      </div>
    </div>

    <!-- Main Header -->
    <div class="container-ocean">
      <div class="flex items-center justify-between py-4 gap-4">
        <!-- Mobile Menu Trigger -->
        <button
          type="button"
          class="lg:hidden p-2 text-primary hover:text-secondary transition-colors"
          @click="toggleMobileMenu(true)"
          aria-label="Menüyü aç"
        >
          <Menu class="w-6 h-6" />
        </button>

        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-2 group">
          <div class="relative">
            <Anchor class="w-8 h-8 text-secondary group-hover:rotate-12 transition-transform duration-300" />
            <div class="absolute -bottom-1 -right-1 w-3 h-3 bg-accent rounded-full" />
          </div>
          <div class="hidden sm:block">
            <span class="text-xl font-bold text-primary">Neta</span>
            <span class="text-xl font-bold text-secondary">Marine</span>
          </div>
        </NuxtLink>

        <!-- Desktop Navigation -->
        <nav class="hidden lg:flex items-center gap-1">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            :class="cn(
              'px-4 py-2 rounded-lg font-medium transition-all duration-200',
              isActive(link.to)
                ? 'text-secondary bg-secondary/10'
                : 'text-muted-foreground hover:text-secondary hover:bg-secondary/5'
            )"
          >
            {{ link.label }}
          </NuxtLink>
        </nav>

        <!-- Right Actions -->
        <div class="flex items-center gap-2 md:gap-4">
          <!-- Search (Desktop) -->
          <div class="hidden md:block">
            <ProductSearch class="w-64" />
          </div>

          <!-- Search Toggle (Mobile) -->
          <button
            type="button"
            class="md:hidden p-2 text-primary hover:text-secondary transition-colors"
            aria-label="Ara"
          >
            <Search class="w-5 h-5" />
          </button>

          <!-- Wishlist (Desktop) -->
          <NuxtLink
            :to="wishlistLink"
            class="hidden lg:flex p-2 text-primary hover:text-secondary transition-colors"
            aria-label="Favoriler"
          >
            <Heart class="w-5 h-5" />
          </NuxtLink>

          <!-- Account -->
          <button
            type="button"
            class="hidden sm:flex p-2 text-primary hover:text-secondary transition-colors"
            @click="navigateToLogin(route.fullPath)"
            aria-label="Hesabım"
          >
            <User class="w-5 h-5" />
          </button>

          <!-- Cart -->
          <button
            type="button"
            :class="cn(
              'relative p-2 rounded-lg transition-all duration-200',
              'text-primary hover:text-secondary hover:bg-secondary/5'
            )"
            @click="isShowingCart = !isShowingCart"
            aria-label="Sepet"
          >
            <ShoppingCart class="w-5 h-5" />
            <ClientOnly>
              <Transition name="popIn" mode="out-in">
                <span
                  v-if="cart?.contents?.itemCount > 0"
                  :class="cn(
                    'absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1',
                    'bg-gradient-to-r from-accent to-coral-light',
                    'text-white text-[10px] font-bold',
                    'rounded-full flex items-center justify-center'
                  )"
                >
                  {{ cart?.contents?.itemCount }}
                </span>
              </Transition>
            </ClientOnly>
          </button>
        </div>
      </div>

      <!-- Mobile Search (collapsible) -->
      <Transition name="scale-y" mode="out-in">
        <div v-if="isShowingSearch" class="pb-4 md:hidden">
          <ProductSearch class="w-full" />
        </div>
      </Transition>
    </div>

    <!-- Wave Bottom Border -->
    <div class="h-1 bg-gradient-ocean opacity-50" />
  </header>
</template>

<style lang="postcss">
/* popIn animation for cart badge */
.popIn-enter-active,
.popIn-leave-active {
  transition: all 200ms cubic-bezier(0, 0, 0.57, 1.61);
}

.popIn-enter-from,
.popIn-leave-to {
  transform: scale(0);
}
</style>
