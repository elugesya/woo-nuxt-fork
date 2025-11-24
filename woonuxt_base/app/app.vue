<script setup lang="ts">
const route = useRoute();
const { isShowingCart } = useCart();
const { isShowingMobileMenu, toggleMobileMenu, addBodyClass, removeBodyClass } = useHelpers();
const runtimeConfig = useRuntimeConfig();

const siteName = runtimeConfig.public.SITE_NAME || 'WooNuxt';
const siteName = runtimeConfig.public.SITE_NAME || 'WooNuxt';
const frontEndUrl = runtimeConfig.public.FRONT_END_URL || 'http://localhost:3000';

const { init: initTikTok } = useTikTokPixel();

onMounted(() => {
  initTikTok();
});

//

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
import MobileMenu from "./components/generalElements/MobileMenu.vue";

useHead({
  titleTemplate: `%s - ${siteName}`,
});

// Organization + WebSite JSON-LD site-wide (dynamic from env)
// Sanitize potential misconfigured env values (quotes, inline comments)
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
  <NuxtLoadingIndicator />
  <div class="flex flex-col min-h-screen">
    <AppHeader />

    <LazyCart />

    <Transition name="slide-from-left">
      <MobileMenu v-if="isShowingMobileMenu" />
    </Transition>

    <NuxtPage />

    <Transition name="fade">
      <div v-if="isShowingMobileMenu" class="bg-black opacity-25 inset-0 z-40 fixed" @click="closeMobileMenu" />
    </Transition>

    <FloatingWhatsAppButton />
    <LazyAppFooter hydrate-on-visible />
  </div>
</template>

<style lang="postcss">
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}

html,
body {
  @apply bg-gray-100 text-gray-900;
  scroll-behavior: smooth;
}

img {
  image-rendering: crisp-edges;
  image-rendering: -webkit-optimize-contrast;
}

pre {
  @apply rounded bg-gray-800 my-8 text-xs text-white p-4 whitespace-pre-wrap overflow-auto;
}

select {
  @apply bg-white border rounded-md font-medium border-gray-300 flex-1 text-sm p-1.5 pr-12 pl-4 text-gray-500 relative inline-flex items-center hover:bg-gray-50 focus:z-20 py-2 px-4 appearance-none;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' viewBox='0 0 16 16'%3E%3Cpath stroke='%23333' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M4 6l4 4 4-4'/%3E%3C/svg%3E")
    center right 10px no-repeat;
  background-size: 1rem;
  padding-right: 2.5rem;
}

/* Slide-from-right & Slide-from-left */
.slide-from-right-leave-active,
.slide-from-right-enter-active,
.slide-from-left-leave-active,
.slide-from-left-enter-active {
  transition: transform 300ms ease-in-out;
}

.slide-from-right-enter-from,
.slide-from-right-leave-to {
  transform: translateX(500px);
}

.slide-from-left-enter-from,
.slide-from-left-leave-to {
  transform: translateX(-500px);
}

/* Fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 300ms ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Scale Y */
.scale-y-enter-active,
.scale-y-leave-active {
  transition: all 500ms linear;
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

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.custom-scrollbar::-webkit-scrollbar-track,
.custom-scrollbar::-webkit-scrollbar {
  @apply rounded bg-gray-100 w-1.5;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  @apply rounded bg-gray-400;
}

@keyframes fadeIn {
  0% {
    opacity: 0.001;
  }

  100% {
    opacity: 1;
  }
}

@keyframes fadeDisabledIn {
  0% {
    opacity: 0.001;
  }

  100% {
    opacity: 0.7;
  }
}

@keyframes fadeOut {
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0.001;
  }
}

.page-enter-active,
.page-leave-active {
  transition: opacity 20ms;
}

.page-enter,
.page-leave-to {
  opacity: 0;
}

.page-enter-active {
  animation-duration: 200ms;
  animation-name: fadeIn;
  animation-timing-function: linear;
  backface-visibility: hidden;
}

.page-leave-active {
  animation-name: fadeOut;
  animation-duration: 200ms;
}

@keyframes skelaton {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

img.skeleton {
  animation: skelaton 2000ms infinite cubic-bezier(0.4, 0, 0.2, 1);
  background-image: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
}

input[type='checkbox'],
input[type='radio'] {
  @apply bg-white border rounded-lg cursor-pointer font-sans outline-none border-gray-300 w-full p-3 transition-all duration-150 appearance-none hover:border-primary;

  width: 1em;
  height: 1em;
  position: relative;
  cursor: pointer;
  border-radius: 4px;
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
  transition: all 250ms cubic-bezier(0.65, -0.43, 0.4, 1.71);
}

input[type='checkbox']:after {
  width: 5px;
  height: 9px;
  border: 2px solid #fff;
  border-top: 0;
  border-left: 0;
  transform: rotate(0deg) translate(-1px, 1px) scale(0.75);
  position: absolute;
  top: 3px;
  left: 6.5px;
}

input[type='radio']:after {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  transform: scale(0);
  position: absolute;
  background: #fff;
  top: 4px;
  left: 4px;
}

input[type='checkbox']:checked:after,
input[type='checkbox'] + label,
input[type='radio'] + label {
  @apply cursor-pointer text-gray-600 hover:text-primary;
}

input[type='checkbox']:checked + label,
input[type='radio']:checked + label {
  @apply text-gray-800 hover:text-primary-dark;
}

input[type='checkbox']:checked,
input[type='radio']:checked {
  @apply bg-primary border-0;
}

input[type='checkbox']:checked:after {
  opacity: 1;
  transform: rotate(45deg) translate(-1px, 1px) scale(1);
}

input[type='radio']:checked:after {
  opacity: 1;
  transform: scale(1);
}
</style>
