<script setup lang="ts">
const features = [
  {
    image: '/images/showcase/aerowave-efoil.jpg',
    title: 'E-Foil Teknolojisi',
    subtitle: 'Geleceğin Su Sporları',
    description: 'Güçlü ve tamamen elektrikli AEROWAVE E-Foil ile dalga beklemeden hızlanın. Sessiz motor, uzun menzil ve yüksek stabilite ile suyun üstünde adeta havalan!',
    cta: 'E-Foil Ürünleri',
    link: '/urun-kategorisi/surf-board',
    imagePosition: 'left',
  },
  {
    image: '/images/showcase/floral-sup-board.jpg',
    title: 'SUP Board Koleksiyonu',
    subtitle: 'Denizle Bütünleşin',
    description: 'FLORAL, CORAL, ZEN ve NIA modelleriyle denizin keyfini en renkli haliyle çıkarın. Tasarım ve dayanıklılığın mükemmel uyumu.',
    cta: 'SUP Modellerini Gör',
    link: '/urun-kategorisi/sup-boardlar',
    imagePosition: 'right',
  },
  {
    image: '/images/showcase/axion-52.jpg',
    title: 'Profesyonel RIB Tekneleri',
    subtitle: 'Denizde Sınıf Atlayın',
    description: 'AXION 5.2 ile denizde sınıf atla. 5,23 m boyu, 3,50 m genişliği ve 11 kişilik kapasitesiyle profesyonel performans.',
    cta: 'RIB Tekneleri',
    link: '/urun-kategorisi/sabit-tabanli-rib-botlar',
    imagePosition: 'left',
  },
];
</script>

<template>
  <section class="py-16 md:py-24 bg-background">
    <div class="container space-y-24">
      <div
        v-for="(feature, index) in features"
        :key="index"
        class="grid md:grid-cols-2 gap-8 md:gap-12 items-center"
        :class="feature.imagePosition === 'right' ? 'md:grid-flow-dense' : ''"
      >
        <!-- Image -->
        <div
          class="relative overflow-hidden rounded-2xl shadow-2xl group"
          :class="feature.imagePosition === 'right' ? 'md:col-start-2' : ''"
        >
          <img
            :src="feature.image"
            :alt="feature.title"
            width="800"
            height="600"
            class="w-full h-[400px] md:h-[500px] object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        <!-- Content -->
        <div
          class="space-y-6"
          :class="feature.imagePosition === 'right' ? 'md:col-start-1 md:row-start-1' : ''"
        >
          <div class="space-y-2">
            <p class="text-primary font-semibold text-sm uppercase tracking-wider">
              {{ feature.subtitle }}
            </p>
            <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-dark leading-tight">
              {{ feature.title }}
            </h2>
          </div>
          
          <p class="text-lg text-muted-foreground leading-relaxed">
            {{ feature.description }}
          </p>

          <NuxtLink
            :to="feature.link"
            class="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg group"
          >
            {{ feature.cta }}
            <Icon name="lucide:arrow-right" class="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>
