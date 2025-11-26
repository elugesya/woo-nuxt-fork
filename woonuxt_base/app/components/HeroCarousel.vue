<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const slides = [
  {
    image: '/images/showcase/rib-boat.webp',
    title: 'Profesyonel RIB Tekneleri',
    description: 'Dayanıklılık ve performansın buluştuğu nokta',
    cta: 'Ürünleri İncele',
    link: '/urun-kategorisi/sabit-tabanli-rib-botlar',
  },
  {
    image: '/images/showcase/zaphira-efoil-alt.webp',
    title: 'ZAPHIRA E-Foil',
    description: 'Hızın ve özgürlüğün yeni adı - Elektrikli surf teknolojisi',
    cta: 'Keşfet',
    link: '/urun-kategorisi/surf-board',
  },
  {
    image: '/images/showcase/arx-420.webp',
    title: 'ARX 420',
    description: 'Her detayı deniz için, her çizgisi performans için',
    cta: 'İncele',
    link: '/urun-kategorisi/sisme-deniz-botlari',
  },
  {
    image: '/images/showcase/coral-sup-board.webp',
    title: 'SUP Board Koleksiyonu',
    description: 'Denizin keyfini en renkli haliyle çıkar',
    cta: 'Tüm Modeller',
    link: '/urun-kategorisi/sup-boardlar',
  },
];

const currentSlide = ref(0);
const isPaused = ref(false);
let intervalId: NodeJS.Timeout | null = null;

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.length;
};

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + slides.length) % slides.length;
};

const goToSlide = (index: number) => {
  currentSlide.value = index;
};

const startAutoPlay = () => {
  if (intervalId) clearInterval(intervalId);
  intervalId = setInterval(() => {
    if (!isPaused.value) {
      nextSlide();
    }
  }, 6000);
};

onMounted(() => {
  startAutoPlay();
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});
</script>

<template>
  <div 
    class="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden bg-muted"
    @mouseenter="isPaused = true"
    @mouseleave="isPaused = false"
  >
    <!-- Slides -->
    <TransitionGroup name="slide">
      <div
        v-for="(slide, index) in slides"
        v-show="currentSlide === index"
        :key="index"
        class="absolute inset-0"
      >
        <!-- Background Image -->
        <img
          :src="slide.image"
          :alt="slide.title"
          width="1920"
          height="600"
          class="w-full h-full object-cover"
          :loading="index === 0 ? 'eager' : 'lazy'"
        />
        
        <!-- Overlay -->
        <div class="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        
        <!-- Content -->
        <div class="absolute inset-0 container flex items-center">
          <div class="max-w-2xl text-white space-y-6">
            <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              {{ slide.title }}
            </h1>
            <p class="text-lg md:text-xl text-white/90">
              {{ slide.description }}
            </p>
            <NuxtLink
              :to="slide.link"
              class="inline-block px-8 py-4 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 shadow-lg"
            >
              {{ slide.cta }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </TransitionGroup>

    <!-- Navigation Arrows -->
    <button
      @click="prevSlide"
      class="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:scale-110 z-10"
      aria-label="Previous slide"
    >
      <Icon name="lucide:chevron-left" class="w-6 h-6 text-white" />
    </button>
    <button
      @click="nextSlide"
      class="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:scale-110 z-10"
      aria-label="Next slide"
    >
      <Icon name="lucide:chevron-right" class="w-6 h-6 text-white" />
    </button>

    <!-- Dots Navigation -->
    <div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
      <button
        v-for="(slide, index) in slides"
        :key="index"
        @click="goToSlide(index)"
        :class="[
          'w-3 h-3 rounded-full transition-all duration-300',
          currentSlide === index
            ? 'bg-white w-8'
            : 'bg-white/50 hover:bg-white/75'
        ]"
        :aria-label="`Go to slide ${index + 1}`"
      />
    </div>
  </div>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.8s ease-in-out;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}
</style>
