<script setup lang="ts">
/**
 * 🌊 HeroBanner - StackZero Component (Marine Themed)
 *
 * Eye-catching hero section with ocean gradient background.
 * Source: StackZero MCP - banner-01-block + banner-02-block
 */
import { cn } from '@/lib/utils';
import { ArrowRight, Anchor, Waves } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';

interface HeroBannerProps {
  title?: string;
  subtitle?: string;
  description?: string;
  primaryCta?: {
    text: string;
    href: string;
  };
  secondaryCta?: {
    text: string;
    href: string;
  };
  image?: string;
  overlay?: boolean;
  showCampaignBot?: boolean;
  campaignBotMessage?: string;
  campaignBotLink?: string;
  class?: string;
}

const props = withDefaults(defineProps<HeroBannerProps>(), {
  title: 'Deniz Tutkusu',
  subtitle: 'Premium Deniz Malzemeleri',
  description: 'Deniz sporları ve eğlence için en kaliteli ürünler. Güvenli alışveriş, hızlı kargo.',
  primaryCta: () => ({
    text: 'Alışverişe Başla',
    href: '/urunler',
  }),
  secondaryCta: () => ({
    text: 'Kategoriler',
    href: '/kategoriler',
  }),
  image: 'https://backend.ntmc.com.tr/wp-content/uploads/2026/03/inferno.jpg',
  overlay: true,
  showCampaignBot: true,
  campaignBotMessage: 'Fırsatları Kaçırma! 👋',
  campaignBotLink: '/urunler?filter=on-sale',
});

const config = useRuntimeConfig();
</script>

<template>
  <section
    :class="cn(
      'relative overflow-hidden',
      props.class
    )"
  >
    <!-- Background with gradient -->
    <div class="absolute inset-0 bg-gradient-ocean">
      <!-- Animated wave pattern -->
      <div class="absolute inset-0 opacity-10">
        <svg
          class="absolute bottom-0 w-full h-64"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="white"
            fill-opacity="0.3"
            d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,138.7C672,128,768,160,864,181.3C960,203,1056,213,1152,197.3C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          >
            <animate
              attributeName="d"
              dur="10s"
              repeatCount="indefinite"
              values="
                M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,138.7C672,128,768,160,864,181.3C960,203,1056,213,1152,197.3C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
                M0,128L48,144C96,160,192,192,288,186.7C384,181,480,139,576,128C672,117,768,139,864,160C960,181,1056,203,1152,197.3C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
                M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,138.7C672,128,768,160,864,181.3C960,203,1056,213,1152,197.3C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z
              "
            />
          </path>
        </svg>
      </div>

      <!-- Decorative bubbles -->
      <div class="absolute top-20 left-10 w-32 h-32 rounded-full bg-white/5 animate-pulse" />
      <div class="absolute top-40 right-20 w-24 h-24 rounded-full bg-secondary/10 animate-pulse" style="animation-delay: 1s" />
      <div class="absolute bottom-40 left-1/4 w-16 h-16 rounded-full bg-white/5 animate-pulse" style="animation-delay: 2s" />

      <!-- 🤖 Campaign Bot Mascot -->
      <NuxtLink
        v-if="showCampaignBot"
        :to="campaignBotLink"
        class="absolute bottom-8 right-8 md:bottom-12 md:right-12 z-20 group"
      >
        <!-- Speech Bubble -->
        <div class="relative mb-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
          <div class="bg-white/95 backdrop-blur-sm text-primary px-4 py-2 rounded-2xl shadow-lg whitespace-nowrap">
            <span class="text-sm font-semibold">{{ campaignBotMessage }}</span>
            <!-- Speech bubble tail -->
            <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white/95 rotate-45" />
          </div>
        </div>

        <!-- Bot Image Container -->
        <div class="relative w-20 h-20 md:w-24 md:h-24">
          <!-- Glowing ring animation -->
          <div class="absolute inset-0 rounded-full bg-gradient-to-r from-accent to-secondary animate-ping opacity-20" />
          <div class="absolute inset-0 rounded-full bg-gradient-to-r from-accent to-secondary animate-pulse opacity-40" />

          <!-- Bot Image -->
          <div class="relative w-full h-full rounded-full bg-white/10 backdrop-blur-sm p-1 shadow-2xl border-2 border-white/30 transition-all duration-300 group-hover:scale-110 group-hover:border-accent/50">
            <NuxtImg
              src="/images/kampanyabot.png"
              alt="Kampanya Botu"
              class="w-full h-full object-cover rounded-full"
              width="96"
              height="96"
            />
          </div>

          <!-- Notification Badge -->
          <div class="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center animate-bounce">
            <span class="text-white text-xs font-bold">!</span>
          </div>
        </div>
      </NuxtLink>
    </div>

    <!-- Content -->
    <div class="relative container-ocean py-16 md:py-24 lg:py-32">
      <div class="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        <!-- Text Content -->
        <div class="text-center lg:text-left space-y-6">
          <!-- Subtitle with anchor icon -->
          <div class="flex items-center justify-center lg:justify-start gap-2 text-secondary">
            <Anchor class="w-5 h-5" />
            <span class="text-sm font-semibold uppercase tracking-widest">
              {{ subtitle }}
            </span>
          </div>

          <!-- Main Title -->
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            {{ title }}
          </h1>

          <!-- Description -->
          <p class="text-lg text-white/80 max-w-xl mx-auto lg:mx-0">
            {{ description }}
          </p>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
            <Button
              as-child
              size="lg"
              class="bg-accent hover:bg-accent/90 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-ocean transition-all hover:scale-105"
            >
              <NuxtLink :to="primaryCta.href">
                {{ primaryCta.text }}
                <ArrowRight class="ml-2 w-5 h-5" />
              </NuxtLink>
            </Button>

            <Button
              as-child
              size="lg"
              class="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 hover:border-white/50 px-8 py-6 text-lg font-semibold rounded-xl shadow-lg transition-all hover:scale-105"
            >
              <NuxtLink :to="secondaryCta.href">
                {{ secondaryCta.text }}
              </NuxtLink>
            </Button>
          </div>

          <!-- Trust badges -->
          <div class="flex items-center justify-center lg:justify-start gap-6 pt-8 text-white/70">
            <div class="flex items-center gap-2">
              <Waves class="w-5 h-5" />
              <span class="text-sm">Ücretsiz Kargo</span>
            </div>
            <div class="flex items-center gap-2">
              <Anchor class="w-5 h-5" />
              <span class="text-sm">Güvenli Ödeme</span>
            </div>
          </div>
        </div>

        <!-- Hero Image -->
        <div class="relative hidden lg:block">
          <div class="relative z-10 float-animation">
            <NuxtImg
              v-if="image"
              :src="image"
              alt="Hero Product"
              class="w-full max-w-lg mx-auto rounded-2xl shadow-2xl"
              preset="product"
            />
            <!-- Placeholder wave illustration -->
            <div
              v-else
              class="w-full max-w-lg mx-auto aspect-square rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center"
            >
              <Waves class="w-32 h-32 text-white/30" />
            </div>
          </div>

          <!-- Decorative ring -->
          <div class="absolute -top-4 -right-4 w-24 h-24 border-4 border-secondary/30 rounded-full animate-pulse" />
          <div class="absolute -bottom-4 -left-4 w-16 h-16 border-4 border-accent/30 rounded-full animate-pulse" style="animation-delay: 1s" />
        </div>
      </div>
    </div>
  </section>
</template>
