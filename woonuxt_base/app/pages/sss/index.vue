<script lang="ts" setup>
const runtimeConfig = useRuntimeConfig()
// WhatsApp numarasını sadece ortam değişkenlerinden al; fallback kullanma
const whatsappPhone = runtimeConfig.public.WHATSAPP_PHONE || ''

useSeoMeta({
  title: 'Sıkça Sorulan Sorular (SSS)',
  description: 'Neta Marine hakkında sıkça sorulan sorular ve cevapları. Sipariş, kargo, iade ve ürünler hakkında bilgi edinin.',
})

const faqCategories = [
  {
    title: 'Sipariş ve Ödeme',
    slug: 'siparis-ve-odeme',
    description: 'Sipariş verme, ödeme yöntemleri ve fatura ile ilgili sorular',
    icon: 'ion:card-outline',
  },
  {
    title: 'Kargo ve Teslimat',
    slug: 'kargo-ve-teslimat',
    description: 'Kargo süreçleri, teslimat süreleri ve takip bilgileri',
    icon: 'ion:cube-outline',
  },
  {
    title: 'İade ve Değişim',
    slug: 'iade-ve-degisim',
    description: 'İade koşulları, değişim işlemleri ve garanti bilgileri',
    icon: 'ion:swap-horizontal-outline',
  },
  {
    title: 'Ürünler ve Özellikler',
    slug: 'urunler-ve-ozellikler',
    description: 'Ürün özellikleri, kullanım ve bakım bilgileri',
    icon: 'ion:information-circle-outline',
  },
  {
    title: 'Servis ve Bakım',
    slug: 'servis-ve-bakim',
    description: 'Servis hizmetleri, bakım ve onarım bilgileri',
    icon: 'ion:construct-outline',
  },
  {
    title: 'Hesap ve Üyelik',
    slug: 'hesap-ve-uyelik',
    description: 'Üyelik işlemleri, hesap yönetimi ve güvenlik',
    icon: 'ion:person-outline',
  },
]
</script>

<template>
  <main class="container py-16">
    <div class="max-w-6xl mx-auto">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold mb-4">Sıkça Sorulan Sorular</h1>
        <p class="text-gray-600 text-lg">Size yardımcı olmak için en çok sorulan soruları derledik</p>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <NuxtLink
          v-for="category in faqCategories"
          :key="category.slug"
          :to="`/sss/${category.slug}`"
          class="group bg-white p-6 rounded-lg border border-gray-200 hover:border-primary hover:shadow-lg transition-all duration-300">
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0">
              <Icon :name="category.icon" class="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
            </div>
            <div class="flex-1">
              <h2 class="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                {{ category.title }}
              </h2>
              <p class="text-gray-600 text-sm">
                {{ category.description }}
              </p>
            </div>
          </div>
          <div class="mt-4 flex items-center text-primary text-sm font-medium">
            <span>Detaylı Bilgi</span>
            <Icon name="ion:arrow-forward" class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </div>
        </NuxtLink>
      </div>

      <div class="mt-16 bg-gray-50 p-8 rounded-lg text-center">
        <h2 class="text-2xl font-semibold mb-4">Sorunuz mu var?</h2>
        <p class="text-gray-600 mb-6">Aradığınız cevabı bulamadıysanız bizimle iletişime geçin</p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink
            to="/iletisim"
            class="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
            <Icon name="ion:mail-outline" class="w-5 h-5 mr-2" />
            İletişim Formu
          </NuxtLink>
          <a
            v-if="whatsappPhone"
            :href="`https://wa.me/${whatsappPhone}`"
            target="_blank"
            class="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Icon name="ion:logo-whatsapp" class="w-5 h-5 mr-2" />
            WhatsApp Destek
          </a>
        </div>
      </div>
    </div>
  </main>
</template>
