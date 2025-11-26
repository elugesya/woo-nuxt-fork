<script setup lang="ts">
interface Props {
  category?: string;
}

const props = defineProps<Props>();

// Map categories to their hero images
const categoryImages: Record<string, { image: string; title: string; description: string }> = {
  'sup-board': {
    image: '/images/showcase/zen-sup-board.jpg',
    title: 'SUP Board Koleksiyonu',
    description: 'Gücün ve zarafetin birleşimi - Denizde özgürlüğü yaşayın',
  },
  'e-foil': {
    image: '/images/showcase/efoil-technology.jpg',
    title: 'E-Foil Teknolojisi',
    description: 'Suyun üstünde adeta havalanan gelecek teknolojisi',
  },
  'rib-botlar': {
    image: '/images/showcase/rib-boat.png',
    title: 'Profesyonel RIB Tekneleri',
    description: 'Dayanıklılık ve performansın buluştuğu nokta',
  },
  'botlar': {
    image: '/images/showcase/compact-boat.jpg',
    title: 'Botlar',
    description: 'Kompakt gücün yeni tanımı - Üstün performans',
  },
  'motorlar': {
    image: '/images/showcase/mx-400.jpg',
    title: 'Dıştan Takma Motorlar',
    description: 'Profesyonel kullanım için tasarlandı',
  },
};

const bannerData = computed(() => {
  if (props.category && categoryImages[props.category]) {
    return categoryImages[props.category];
  }
  return null;
});
</script>

<template>
  <div v-if="bannerData" class="relative w-full h-[300px] md:h-[400px] overflow-hidden rounded-2xl mb-8">
    <!-- Background Image -->
    <img
      :src="bannerData.image"
      :alt="bannerData.title"
      width="1920"
      height="400"
      class="w-full h-full object-cover"
      loading="eager"
    />
    
    <!-- Overlay -->
    <div class="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
    
    <!-- Content -->
    <div class="absolute inset-0 container flex items-center">
      <div class="max-w-2xl text-white space-y-4">
        <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
          {{ bannerData.title }}
        </h1>
        <p class="text-lg md:text-xl text-white/90">
          {{ bannerData.description }}
        </p>
      </div>
    </div>
  </div>
</template>
