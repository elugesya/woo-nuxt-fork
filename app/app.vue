<script setup lang="ts">
/**
 * 🌊 Sea Toys & Marine Web Shop - App Entry
 *
 * This app.vue extends the base theme and adds marine styling.
 */
const route = useRoute();
const { isShowingCart } = useCart();
const { isShowingMobileMenu, toggleMobileMenu, addBodyClass, removeBodyClass } = useHelpers();
const runtimeConfig = useRuntimeConfig();
import AppHeader from './components/generalElements/AppHeader.vue';
import AppFooter from './components/generalElements/AppFooter.vue';
import Cart from './components/shopElements/Cart.vue';
import MobileMenu from './components/generalElements/MobileMenu.vue';
// FloatingWhatsAppButton is auto-imported from base theme

const siteName = runtimeConfig.public.SITE_NAME || 'Deniz Tutkusu';
const frontEndUrl = runtimeConfig.public.FRONT_END_URL || 'http://localhost:3000';

const { init: initTikTok } = useTikTokPixel();

onMounted(() => {
  initTikTok();
});

const closeMobileMenu = () => {
  toggleMobileMenu(false);
};

// Sheet handles its own body scroll lock for cart
// Only manage mobile menu scroll lock
watch(isShowingMobileMenu, () => {
  isShowingMobileMenu.value ? addBodyClass('overflow-hidden') : removeBodyClass('overflow-hidden');
});

watch(
  () => route.path,
  () => {
    isShowingCart.value = false;
    closeMobileMenu();
  },
);

useHead({
  titleTemplate: `%s - ${siteName}`,
});

// Organization + WebSite JSON-LD site-wide (dynamic from env)
const rawLogoPath = runtimeConfig.public.ORGANIZATION_LOGO || '/logo.svg';
const cleanedLogoPath = String(rawLogoPath)
  .replace(/^['"]|['"]$/g, '')
  .split('#')[0]
  .trim();
const logoPath = cleanedLogoPath || '/logo.svg';
const logoUrl = logoPath.startsWith('http')
  ? logoPath
  : `${frontEndUrl}${logoPath.startsWith('/') ? '' : '/'}${logoPath}`;
const contactEmail = runtimeConfig.public.ORGANIZATION_CONTACT_EMAIL;
const contactPhone = runtimeConfig.public.ORGANIZATION_PHONE;
const socialFacebook = runtimeConfig.public.ORGANIZATION_SOCIAL_FACEBOOK;
const socialTwitter = runtimeConfig.public.ORGANIZATION_SOCIAL_TWITTER;
const socialInstagram = runtimeConfig.public.ORGANIZATION_SOCIAL_INSTAGRAM;

const organizationJsonLd = JSON.stringify(
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    url: frontEndUrl,
    logo: logoUrl,
    contactPoint: contactEmail || contactPhone ? {
      '@type': 'ContactPoint',
      email: contactEmail || undefined,
      telephone: contactPhone || undefined,
      contactType: 'customer service',
    } : undefined,
    sameAs: [socialFacebook, socialTwitter, socialInstagram].filter(Boolean),
    aggregateRating: runtimeConfig.public.ORGANIZATION_RATING_VALUE && runtimeConfig.public.ORGANIZATION_REVIEW_COUNT ? {
      '@type': 'AggregateRating',
      ratingValue: runtimeConfig.public.ORGANIZATION_RATING_VALUE,
      reviewCount: runtimeConfig.public.ORGANIZATION_REVIEW_COUNT,
    } : undefined,
  },
  null,
  2,
);

const websiteJsonLd = JSON.stringify(
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: frontEndUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${frontEndUrl}/urunler?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  },
  null,
  2,
);

useHead({
  script: [
    { type: 'application/ld+json', innerHTML: organizationJsonLd },
    { type: 'application/ld+json', innerHTML: websiteJsonLd },
  ],
});
</script>

<template>
  <NuxtLoadingIndicator color="#00B4D8" :height="3" />
  <div class="flex flex-col min-h-screen">
    <AppHeader />

    <Cart />

    <ClientOnly>
      <Transition name="slide-from-left">
        <MobileMenu v-if="isShowingMobileMenu" />
      </Transition>
    </ClientOnly>

    <NuxtPage />

    <Transition name="fade">
      <div v-if="isShowingMobileMenu" class="bg-black opacity-25 inset-0 z-40 fixed" @click="closeMobileMenu" />
    </Transition>

    <FloatingWhatsAppButton />
    <AppFooter />
  </div>
</template>

<style lang="postcss">
/* Import base styles */
@import "../woonuxt_base/app/assets/css/main.css";

/* 🌊 Import Marine Theme */
@import "./assets/css/marine-theme.css";

/* Marine Theme CSS Variables */
@layer base {
  :root {
    /* Ocean Navy Primary */
    --primary: 199 97% 12%; /* #0A2540 */
    --primary-foreground: 0 0% 100%;

    /* Turquoise Secondary */
    --secondary: 190 100% 42%; /* #00B4D8 */
    --secondary-foreground: 199 97% 12%;

    /* Coral Accent */
    --accent: 0 100% 71%; /* #FF6B6B */
    --accent-foreground: 0 0% 100%;

    /* Background & Foreground */
    --background: 210 33% 98%; /* #F8F9FA */
    --foreground: 199 97% 12%;

    /* Card */
    --card: 0 0% 100%;
    --card-foreground: 199 97% 12%;

    /* Popover */
    --popover: 0 0% 100%;
    --popover-foreground: 199 97% 12%;

    /* Muted */
    --muted: 210 60% 95%; /* Seafoam */
    --muted-foreground: 210 30% 45%;

    /* Border & Input */
    --border: 210 40% 88%;
    --input: 210 60% 95%;

    /* Ring - Turquoise */
    --ring: 190 100% 42%;

    /* Destructive */
    --destructive: 0 84% 60%;
    --destructive-foreground: 0 0% 100%;

    /* Radius */
    --radius: 0.75rem;
  }

  .dark {
    --primary: 190 100% 42%;
    --primary-foreground: 0 0% 100%;

    --secondary: 199 97% 12%;
    --secondary-foreground: 0 0% 100%;

    --background: 200 50% 8%; /* Night Ocean */
    --foreground: 0 0% 98%;

    --card: 200 40% 12%;
    --card-foreground: 0 0% 98%;

    --popover: 200 40% 12%;
    --popover-foreground: 0 0% 98%;

    --muted: 200 30% 18%;
    --muted-foreground: 210 20% 60%;

    --border: 200 30% 22%;
    --input: 200 30% 18%;

    --ring: 190 100% 42%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground antialiased;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Image optimization */
img {
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
}

/* Code blocks */
pre {
  @apply rounded-lg bg-gray-900 my-6 text-xs text-gray-100 p-4 whitespace-pre-wrap overflow-auto;
}

/* 🌊 Marine Transitions */

/* Slide-from-right & Slide-from-left */
.slide-from-right-leave-active,
.slide-from-right-enter-active,
.slide-from-left-leave-active,
.slide-from-left-enter-active {
  transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-from-right-enter-from,
.slide-from-right-leave-to {
  transform: translateX(100%);
}

.slide-from-left-enter-from,
.slide-from-left-leave-to {
  transform: translateX(-100%);
}

/* Fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 200ms ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Scale Y */
.scale-y-enter-active,
.scale-y-leave-active {
  transition: all 400ms cubic-bezier(0.4, 0, 0.2, 1);
  will-change: max-height, opacity;
  max-height: 9999px;
  overflow: hidden;
  opacity: 1;
}

.scale-y-enter-from,
.scale-y-leave-to {
  max-height: 0;
  opacity: 0;
}

/* Page Transitions */
.page-enter-active,
.page-leave-active {
  transition: opacity 150ms ease-out;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}

/* 🌊 Wave Loading Animation */
@keyframes wave-loading {
  0%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(2); }
}

/* Custom Scrollbar - Ocean Themed */
.custom-scrollbar::-webkit-scrollbar-track,
.custom-scrollbar::-webkit-scrollbar {
  @apply rounded-full bg-seafoam;
  width: 8px;
  height: 8px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  @apply rounded-full bg-secondary/50 hover:bg-secondary;
}

/* 🌊 Skeleton Loading */
@keyframes skeleton-wave {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

img.skeleton {
  animation: skeleton-wave 2s infinite cubic-bezier(0.4, 0, 0.2, 1);
  background-image: linear-gradient(
    90deg,
    theme('colors.seafoam.DEFAULT') 25%,
    theme('colors.background') 50%,
    theme('colors.seafoam.DEFAULT') 75%
  );
  background-size: 200% 100%;
}

/* Form Elements */
input[type='checkbox'],
input[type='radio'] {
  @apply bg-white border rounded-lg cursor-pointer outline-none border-border w-full p-3 transition-all duration-150 appearance-none hover:border-secondary;

  width: 1.125em;
  height: 1.125em;
  position: relative;
  cursor: pointer;
  border-radius: 6px;
  padding: 0;
}

input[type='radio'] {
  border-radius: 50%;
}

input[type='checkbox']:after,
input[type='radio']:after {
  content: '';
  display: block;
  opacity: 0;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

input[type='checkbox']:after {
  width: 5px;
  height: 9px;
  border: 2px solid #fff;
  border-top: 0;
  border-left: 0;
  transform: rotate(0deg) translate(-1px, 1px) scale(0.75);
  position: absolute;
  top: 5px;
  left: 7px;
}

input[type='radio']:after {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  transform: scale(0);
  position: absolute;
  background: #fff;
  top: 5px;
  left: 5px;
}

input[type='checkbox']:checked,
input[type='radio']:checked {
  @apply bg-secondary border-secondary;
}

input[type='checkbox']:checked:after {
  opacity: 1;
  transform: rotate(45deg) translate(-1px, 1px) scale(1);
}

input[type='radio']:checked:after {
  opacity: 1;
  transform: scale(1);
}

input[type='checkbox'] + label,
input[type='radio'] + label {
  @apply cursor-pointer text-foreground hover:text-secondary transition-colors;
}

/* Select Dropdown */
.select,
select {
  @apply bg-white border rounded-lg font-medium border-border flex-1 text-sm p-1.5 pr-12 pl-4 text-foreground relative inline-flex items-center hover:border-secondary focus:border-secondary focus:ring-2 focus:ring-secondary/20 appearance-none cursor-pointer transition-all;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' viewBox='0 0 16 16'%3E%3Cpath stroke='%2300B4D8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M4 6l4 4 4-4'/%3E%3C/svg%3E");
  background-position: center right 10px;
  background-repeat: no-repeat;
  background-size: 1rem;
  padding-right: 2.5rem;
}

.dark .select,
.dark select {
  @apply bg-gray-800 border-gray-700 text-white;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' viewBox='0 0 16 16'%3E%3Cpath stroke='%2300B4D8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M4 6l4 4 4-4'/%3E%3C/svg%3E");
}
</style>
