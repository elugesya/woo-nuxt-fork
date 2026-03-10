<script setup lang="ts">
/**
 * 🌊 PromoBanner - StackZero Component (Marine Themed)
 *
 * Promotional banner with gradient background and CTA.
 * Source: StackZero MCP - banner-03-block
 */
import { cn } from '@/lib/utils';
import { ArrowRight, Sparkles } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';

interface PromoBannerProps {
  title?: string;
  description?: string;
  ctaText?: string;
  ctaHref?: string;
  variant?: 'ocean' | 'coral' | 'turquoise';
  class?: string;
}

const props = withDefaults(defineProps<PromoBannerProps>(), {
  title: 'Özel Fırsatları Kaçırmayın!',
  description: 'Yeni üyelere özel %20 indirim ve ücretsiz kargo fırsatı',
  ctaText: 'Hemen Keşfet',
  ctaHref: '/urunler',
  variant: 'ocean',
});

const variantClasses = {
  ocean: 'bg-gradient-ocean text-white',
  coral: 'bg-gradient-coral text-white',
  turquoise: 'bg-gradient-to-r from-secondary to-secondary-light text-primary',
};
</script>

<template>
  <section :class="cn('py-8 md:py-12', props.class)">
    <div class="container-ocean">
      <div
        :class="cn(
          'relative overflow-hidden rounded-2xl p-8 md:p-12',
          variantClasses[variant]
        )"
      >
        <!-- Decorative elements -->
        <div class="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div class="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <!-- Content -->
          <div class="text-center md:text-left space-y-3">
            <div class="flex items-center justify-center md:justify-start gap-2">
              <Sparkles class="w-5 h-5" />
              <span class="text-sm font-semibold uppercase tracking-wider opacity-90">
                Sınırlı Süre
              </span>
            </div>

            <h2 class="text-2xl md:text-3xl lg:text-4xl font-bold">
              {{ title }}
            </h2>

            <p class="text-base md:text-lg opacity-90 max-w-xl">
              {{ description }}
            </p>
          </div>

          <!-- CTA -->
          <Button
            as-child
            size="lg"
            :class="cn(
              'bg-white text-primary hover:bg-white/90',
              'px-8 py-6 text-lg font-semibold rounded-xl',
              'shadow-lg transition-all hover:scale-105'
            )"
          >
            <NuxtLink :to="ctaHref">
              {{ ctaText }}
              <ArrowRight class="ml-2 w-5 h-5" />
            </NuxtLink>
          </Button>
        </div>
      </div>
    </div>
  </section>
</template>
