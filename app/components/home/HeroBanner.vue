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
    <!-- Mobile: Full height banner with bottom content -->
    <div class="relative w-full h-[60vh] md:h-[70vh] lg:h-[80vh] bg-gray-900">
      <!-- Background Image -->
      <img
        src="/images/kampanyabot.png"
        alt="Kampanya"
        class="absolute inset-0 w-full h-full object-cover object-top md:object-center"
      />

      <!-- Gradient Overlay - lighter on mobile, darker on desktop -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 md:via-black/50 to-transparent md:bg-gradient-to-r md:from-black/70 md:via-black/40 md:to-transparent" />

      <!-- Content - Bottom on mobile, left on desktop -->
      <div class="absolute inset-0 flex flex-col justify-end pb-6 md:pb-8 md:items-center md:justify-center">
        <div class="container mx-auto px-4 md:px-8">
          <div class="md:max-w-2xl">
            <!-- Main Title -->
            <h1 class="text-xl md:text-3xl lg:text-5xl font-bold text-white leading-tight mb-2 md:mb-4 text-center md:text-left">
              {{ title }}
            </h1>

            <!-- Description - hidden on small mobile, visible on larger screens -->
            <p class="text-sm md:text-base lg:text-lg text-white/90 mb-3 md:mb-6 max-w-lg text-center md:text-left">
              {{ description }}
            </p>

            <!-- CTA Buttons -->
            <div class="flex flex-col sm:flex-row gap-2 md:gap-4 justify-center md:justify-start">
              <Button
                as-child
                size="default"
                class="bg-accent hover:bg-accent/90 text-white px-6 py-3 text-sm font-semibold rounded-full shadow-lg transition-all hover:scale-105"
              >
                <NuxtLink :to="primaryCta.href">
                  {{ primaryCta.text }}
                </NuxtLink>
              </Button>

              <Button
                as-child
                size="default"
                variant="outline"
                class="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:border-white/50 px-6 py-3 text-sm font-semibold rounded-full transition-all hover:scale-105"
              >
                <NuxtLink :to="secondaryCta.href">
                  {{ secondaryCta.text }}
                </NuxtLink>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
