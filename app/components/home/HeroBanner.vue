<script setup lang="ts">
/**
 * 🌊 HeroBanner - Campaign Hero
 *
 * Hero banner with campaign image background.
 */
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';

interface HeroBannerProps {
  title?: string;
  description?: string;
  primaryCta?: {
    text: string;
    href: string;
  };
  secondaryCta?: {
    text: string;
    href: string;
  };
  class?: string;
}

const props = withDefaults(defineProps<HeroBannerProps>(), {
  title: 'Özel Kampanya!',
  description: 'Sınırlı süreli indirimleri kaçırma. Hemen alışverişe başla!',
  primaryCta: () => ({
    text: 'Fırsatları Yakala',
    href: '/urunler?filter=on-sale',
  }),
  secondaryCta: () => ({
    text: 'Tüm Ürünler',
    href: '/urunler',
  }),
});
</script>

<template>
  <section
    :class="cn(
      'relative w-full overflow-hidden',
      props.class
    )"
  >
    <!-- Hero Banner Container - maintains aspect ratio -->
    <div class="relative w-full aspect-video md:aspect-[21/9] lg:aspect-[21/9] bg-gray-900">
      <!-- Background Image -->
      <img
        src="/images/kampanyabot.png"
        alt="Kampanya"
        class="absolute inset-0 w-full h-full object-cover object-center"
      />

      <!-- Gradient Overlay -->
      <div class="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

      <!-- Content -->
      <div class="absolute inset-0 container mx-auto px-4 md:px-8 flex items-center">
        <div class="max-w-xl md:max-w-2xl">
          <!-- Main Title -->
          <h1 class="text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-3 md:mb-4">
            {{ title }}
          </h1>

          <!-- Description -->
          <p class="text-sm md:text-lg lg:text-xl text-white/90 mb-4 md:mb-6 max-w-lg">
            {{ description }}
          </p>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-2 md:gap-4">
            <Button
              as-child
              size="lg"
              class="bg-accent hover:bg-accent/90 text-white px-5 md:px-8 py-4 md:py-6 text-sm md:text-lg font-semibold rounded-lg shadow-lg transition-all hover:scale-105"
            >
              <NuxtLink :to="primaryCta.href">
                {{ primaryCta.text }}
                <ArrowRight class="ml-1 md:ml-2 w-4 h-4" />
              </NuxtLink>
            </Button>

            <Button
              as-child
              size="lg"
              variant="outline"
              class="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 hover:border-white/50 px-5 md:px-8 py-4 md:py-6 text-sm md:text-lg font-semibold rounded-lg transition-all hover:scale-105"
            >
              <NuxtLink :to="secondaryCta.href">
                {{ secondaryCta.text }}
              </NuxtLink>
            </Button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
