<script setup lang="ts">
const promos = [
  {
    image: '/images/showcase/nxt-sup-weekend.webp',
    badge: 'Yaz Sezonu',
    title: 'Hafta Sonu Keyfi',
    description: 'NXT SUP Board ile akışa bırak. Kur, şişir ve denizin tadını çıkar!',
    cta: 'Keşfet',
    link: '/urun-kategorisi/sup-boardlar',
  },
  {
    image: '/images/showcase/zaphira-power.webp',
    badge: 'Elektrikli Teknoloji',
    title: 'ZAPHIRA E-Foil',
    description: 'Suyun üzerindeki güç. Kendi hızını anında ayarla, özgürlüğü yaşa!',
    cta: 'İncele',
    link: '/urun-kategorisi/surf-board',
  },
  {
    image: '/images/showcase/btm-aluminyum-taban-bot.webp',
    badge: 'Profesyonel Çözümler',
    title: 'BTM Alüminyum Taban Bot',
    description: 'Profesyonel kullanım için tasarlanmış dayanıklı çözümler',
    cta: 'Detaylar',
    link: '/urun-kategorisi/sisme-deniz-botlari',
  },
];
</script>

<template>
  <section class="py-16 bg-muted/30">
    <div class="container">
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-bold text-primary-dark mb-4">
          Öne Çıkan Kampanyalar
        </h2>
        <p class="text-lg text-muted-foreground">
          Sezonun en iyi fırsatlarını kaçırmayın
        </p>
      </div>

      <div class="grid md:grid-cols-3 gap-8">
        <div
          v-for="(promo, index) in promos"
          :key="index"
          class="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500"
        >
          <!-- Image -->
          <div class="relative h-[400px] overflow-hidden">
            <img
              :src="promo.image"
              :alt="promo.title"
              width="600"
              height="400"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            
            <!-- Badge -->
            <div class="absolute top-4 left-4">
              <span class="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-full">
                {{ promo.badge }}
              </span>
            </div>
          </div>

          <!-- Content -->
          <div class="absolute bottom-0 left-0 right-0 p-6 text-white space-y-3">
            <h3 class="text-2xl font-bold">{{ promo.title }}</h3>
            <p class="text-white/90">{{ promo.description }}</p>
            <NuxtLink
              :to="promo.link"
              class="inline-flex items-center gap-2 text-white font-semibold group-hover:gap-3 transition-all"
            >
              {{ promo.cta }}
              <Icon name="lucide:arrow-right" class="w-5 h-5" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
