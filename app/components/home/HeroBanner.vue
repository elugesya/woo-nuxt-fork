<script setup lang="ts">
/**
 * 🌊 HeroBanner - Campaign Hero
 *
 * Hero banner with campaign image background.
 */
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface HeroBannerProps {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  class?: string;
}

const props = withDefaults(defineProps<HeroBannerProps>(), {
  title: 'Kampanya Botu',
  description: 'Sana özel fırsatları keşfet!',
  buttonText: 'İncele',
  buttonLink: '/urunler?filter=on-sale',
});
</script>

<template>
  <section
    :class="cn(
      'relative w-full overflow-hidden',
      props.class
    )"
  >
    <!-- Hero Banner Container -->
    <div class="relative w-full aspect-[16/9] md:aspect-[21/9] lg:aspect-[21/9] bg-gray-900">
      <!-- Background Image - contains and covers the area -->
      <img
        src="/images/kampanyabot.png"
        alt="Kampanya"
        class="absolute inset-0 w-full h-full object-cover"
      />

      <!-- Gradient Overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

      <!-- Content - Bottom centered -->
      <div class="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-center">
        <!-- Main Title -->
        <h2 class="text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-2 md:mb-3">
          {{ title }}
        </h2>

        <!-- Description -->
        <p class="text-sm md:text-base lg:text-lg text-white/90 mb-4 md:mb-6 max-w-2xl mx-auto">
          {{ description }}
        </p>

        <!-- Single CTA Button -->
        <Button
          as-child
          size="lg"
          class="bg-white hover:bg-white/90 text-gray-900 px-10 py-6 text-base md:text-lg font-bold rounded-full shadow-2xl transition-all hover:scale-105 mx-auto"
        >
          <NuxtLink :to="buttonLink">
            {{ buttonText }}
          </NuxtLink>
        </Button>
      </div>
    </div>
  </section>
</template>
