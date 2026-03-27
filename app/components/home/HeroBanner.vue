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
      'relative overflow-hidden min-h-[500px] lg:min-h-[600px]',
      props.class
    )"
  >
    <!-- Background Image -->
    <div class="absolute inset-0">
      <img
        src="/images/kampanyabot.png"
        alt="Kampanya"
        class="w-full h-full object-cover"
      />
      <!-- Gradient Overlay -->
      <div class="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
    </div>

    <!-- Content -->
    <div class="relative container mx-auto px-4 py-16 md:py-24 lg:py-32">
      <div class="max-w-2xl">
        <!-- Main Title -->
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
          {{ title }}
        </h1>

        <!-- Description -->
        <p class="text-lg md:text-xl text-white/90 mb-8 max-w-xl">
          {{ description }}
        </p>

        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row gap-4">
          <Button
            as-child
            size="lg"
            class="bg-accent hover:bg-accent/90 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg transition-all hover:scale-105"
          >
            <NuxtLink :to="primaryCta.href">
              {{ primaryCta.text }}
              <ArrowRight class="ml-2 w-5 h-5" />
            </NuxtLink>
          </Button>

          <Button
            as-child
            size="lg"
            variant="outline"
            class="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 hover:border-white/50 px-8 py-6 text-lg font-semibold rounded-xl transition-all hover:scale-105"
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
