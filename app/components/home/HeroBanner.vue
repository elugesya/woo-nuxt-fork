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
      'relative overflow-hidden',
      props.class
    )"
  >
    <!-- Background Image -->
    <div class="absolute inset-0 bg-gray-900">
      <img
        src="/images/kampanyabot.png"
        alt="Kampanya"
        class="w-full h-full object-cover object-center"
      />
      <!-- Gradient Overlay -->
      <div class="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
    </div>

    <!-- Content -->
    <div class="relative container mx-auto px-4 py-12 md:py-16 lg:py-24 min-h-[400px] md:min-h-[500px] flex items-center">
      <div class="max-w-2xl">
        <!-- Main Title -->
        <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
          {{ title }}
        </h1>

        <!-- Description -->
        <p class="text-base md:text-lg text-white/90 mb-6 max-w-xl">
          {{ description }}
        </p>

        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row gap-3">
          <Button
            as-child
            size="lg"
            class="bg-accent hover:bg-accent/90 text-white px-6 py-5 text-base font-semibold rounded-lg shadow-lg transition-all hover:scale-105"
          >
            <NuxtLink :to="primaryCta.href">
              {{ primaryCta.text }}
              <ArrowRight class="ml-2 w-4 h-4" />
            </NuxtLink>
          </Button>

          <Button
            as-child
            size="lg"
            variant="outline"
            class="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 hover:border-white/50 px-6 py-5 text-base font-semibold rounded-lg transition-all hover:scale-105"
          >
            <NuxtLink :to="secondaryCta.href">
              {{ secondaryCta.text }}
            </NuxtLink>
          </Button>
        </div>
      </div>
    </div>
  </section>
</template>
