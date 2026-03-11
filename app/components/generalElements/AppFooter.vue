<script setup lang="ts">
/**
 * 🌊 AppFooter - Marine Themed
 *
 * Premium footer with ocean-inspired styling.
 * Features newsletter signup, navigation links, and wave decoration.
 */
import { cn } from '@/lib/utils';
import { Anchor, Waves, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube, Send } from 'lucide-vue-next';

const { wooNuxtVersionInfo } = useHelpers();
const { wishlistLink } = useAuth();
const runtimeConfig = useRuntimeConfig();
const email = ref('');
const isSubscribing = ref(false);

// Get contact info from runtime config (.env)
const orgPhone = runtimeConfig.public.ORGANIZATION_PHONE || '+90 533 6045002';
const orgEmail = runtimeConfig.public.ORGANIZATION_CONTACT_EMAIL || 'info@ntmc.com.tr';
const orgAddress = runtimeConfig.public.ORGANIZATION_ADDRESS || 'İstanbul, Türkiye';
const orgFacebook = runtimeConfig.public.ORGANIZATION_SOCIAL_FACEBOOK || '#';
const orgTwitter = runtimeConfig.public.ORGANIZATION_SOCIAL_TWITTER || '#';
const orgInstagram = runtimeConfig.public.ORGANIZATION_SOCIAL_INSTAGRAM || '#';

const handleSubscribe = async () => {
  if (!email.value) return;
  isSubscribing.value = true;
  // Simulate subscription
  await new Promise(resolve => setTimeout(resolve, 1000));
  email.value = '';
  isSubscribing.value = false;
};

const footerLinks = {
  information: {
    title: 'Bilgilendirme',
    links: [
      { to: '/hakkimizda', label: 'Hakkımızda' },
      { to: '/iletisim', label: 'İletişim' },
      { to: '/sss', label: 'SSS' },
      { to: '/blog', label: 'Blog' },
    ],
  },
  products: {
    title: 'Ürünler',
    links: [
      { to: '/urunler', label: 'Yeni Ürünler' },
      { to: '/urunler?filter=sale[true]', label: 'İndirimli Ürünler' },
      { to: '/urunler?orderby=popularity', label: 'Popüler Ürünler' },
      { to: '/urunler?orderby=rating', label: 'En Çok Beğenilenler' },
    ],
  },
  customerService: {
    title: 'Müşteri Hizmetleri',
    links: [
      { to: '/kargo-ve-teslimat', label: 'Kargo ve Teslimat' },
      { to: '/iade-ve-degisim', label: 'İade ve Değişim' },
      { to: '/gizlilik-politikasi', label: 'Gizlilik Politikası' },
      { to: '/kullanim-kosullari', label: 'Kullanım Koşulları' },
    ],
  },
  account: {
    title: 'Hesabım',
    links: [
      { to: '/hesabim/', label: 'Hesabım' },
      { to: '/hesabim/?tab=orders', label: 'Siparişlerim' },
      { to: wishlistLink.value, label: 'Favorilerim' },
      { to: '/hesabim/?tab=details', label: 'Adreslerim' },
    ],
  },
};
</script>

<template>
  <footer class="bg-primary text-white relative overflow-hidden">
    <!-- Wave Top Decoration -->
    <div class="absolute top-0 left-0 right-0 h-16 overflow-hidden">
      <svg
        class="absolute bottom-0 w-full h-16 text-white"
        viewBox="0 0 1440 48"
        preserveAspectRatio="none"
      >
        <path
          fill="currentColor"
          d="M0,24L60,26.7C120,29,240,35,360,34.7C480,35,600,29,720,26.7C840,24,960,24,1080,26.7C1200,29,1320,35,1380,37.3L1440,40L1440,48L1380,48C1320,48,1200,48,1080,48C960,48,840,48,720,48C600,48,480,48,360,48C240,48,120,48,60,48L0,48Z"
        />
      </svg>
    </div>

    <!-- Newsletter Section -->
    <div class="relative bg-gradient-ocean py-12 mt-16">
      <div class="container-ocean">
        <div class="flex flex-col md:flex-row items-center justify-between gap-6">
          <div class="text-center md:text-left">
            <h3 class="text-xl font-bold mb-2 flex items-center justify-center md:justify-start gap-2">
              <Mail class="w-5 h-5" />
              Bültenimize Abone Olun
            </h3>
            <p class="text-white/80 text-sm">
              Yeni ürünler ve özel indirimlerden ilk siz haberdar olun.
            </p>
          </div>
          <form @submit.prevent="handleSubscribe" class="flex w-full md:w-auto gap-2">
            <input
              v-model="email"
              type="email"
              placeholder="E-posta adresiniz"
              class="flex-1 md:w-72 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-secondary"
            />
            <button
              type="submit"
              :disabled="isSubscribing"
              class="px-6 py-3 bg-accent hover:bg-coral-light text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
            >
              <Send v-if="!isSubscribing" class="w-5 h-5" />
              <span v-else class="animate-spin">⏳</span>
            </button>
          </form>
        </div>
      </div>
    </div>

    <!-- Main Footer Content -->
    <div class="container-ocean py-12">
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-12">
        <!-- Brand Column -->
        <div class="col-span-2 md:col-span-3 lg:col-span-1">
          <NuxtLink to="/" class="inline-flex items-center gap-2 mb-4">
            <Anchor class="w-8 h-8 text-secondary" />
            <div>
              <span class="text-xl font-bold">Neta</span>
              <span class="text-xl font-bold text-secondary">Marine</span>
            </div>
          </NuxtLink>
          <p class="text-white/70 text-sm mb-6">
            Deniz tutkunları için en kaliteli deniz malzemeleri ve aksesuarları.
            Güvenli alışveriş, hızlı kargo.
          </p>
          <!-- Contact Info -->
          <div class="space-y-3 text-sm">
            <a :href="`tel:${orgPhone.replace(/\s/g, '')}`" class="flex items-center gap-2 text-white/70 hover:text-secondary transition-colors">
              <Phone class="w-4 h-4" />
              {{ orgPhone }}
            </a>
            <a :href="`mailto:${orgEmail}`" class="flex items-center gap-2 text-white/70 hover:text-secondary transition-colors">
              <Mail class="w-4 h-4" />
              {{ orgEmail }}
            </a>
            <div class="flex items-center gap-2 text-white/70">
              <MapPin class="w-4 h-4" />
              {{ orgAddress }}
            </div>
          </div>
        </div>

        <!-- Link Columns -->
        <div v-for="(section, key) in footerLinks" :key="key">
          <h4 class="font-semibold mb-4 text-secondary">
            {{ section.title }}
          </h4>
          <ul class="space-y-2">
            <li v-for="link in section.links" :key="link.to">
              <NuxtLink
                :to="link.to"
                class="text-sm text-white/70 hover:text-secondary transition-colors"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="border-t border-white/10">
      <div class="container-ocean py-6">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <!-- Copyright -->
          <div class="text-sm text-white/50 text-center md:text-left">
            © {{ new Date().getFullYear() }} NetaMarine. Tüm hakları saklıdır.
            <span class="mx-2">|</span>
            <a href="https://netasolutions.com" class="hover:text-secondary">
              NetaCommerce v{{ wooNuxtVersionInfo }}
            </a>
          </div>

          <!-- Social Icons -->
          <div class="flex items-center gap-4">
            <a :href="orgFacebook" target="_blank" rel="noopener noreferrer" class="text-white/50 hover:text-secondary transition-colors" aria-label="Facebook">
              <Facebook class="w-5 h-5" />
            </a>
            <a :href="orgTwitter" target="_blank" rel="noopener noreferrer" class="text-white/50 hover:text-secondary transition-colors" aria-label="Twitter">
              <Twitter class="w-5 h-5" />
            </a>
            <a :href="orgInstagram" target="_blank" rel="noopener noreferrer" class="text-white/50 hover:text-secondary transition-colors" aria-label="Instagram">
              <Instagram class="w-5 h-5" />
            </a>
            <a href="#" class="text-white/50 hover:text-secondary transition-colors" aria-label="Youtube">
              <Youtube class="w-5 h-5" />
            </a>
          </div>

          <!-- Payment Methods -->
          <div class="flex items-center gap-2 text-white/50 text-xs">
            <span>Güvenli Ödeme:</span>
            <div class="flex gap-2">
              <span class="px-2 py-1 bg-white/10 rounded">Visa</span>
              <span class="px-2 py-1 bg-white/10 rounded">Master</span>
              <span class="px-2 py-1 bg-white/10 rounded">Troy</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Decorative Wave Background -->
    <div class="absolute bottom-0 left-0 right-0 h-32 opacity-5 pointer-events-none">
      <Waves class="w-full h-full" />
    </div>
  </footer>
</template>
