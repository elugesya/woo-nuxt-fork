<script lang="ts" setup>
useSeoMeta({
  title: 'Hakkımızda',
  description: 'Neta Marine - 2009 yılından bu yana Ortaca, Muğla ve Dalaman\'da denizcilik hizmetleri sunuyoruz.',
})
</script>

<template>
  <main class="container py-16">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-4xl font-bold mb-8">Hakkımızda</h1>
      
      <div class="prose prose-lg max-w-none">
        <section class="mb-12">
          <h2 class="text-2xl font-semibold mb-4">Neta Marine</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            2009 yılından bu yana denizcilik sektöründe faaliyet gösteren Neta Marine, 
            Ortaca, Muğla ve Dalaman bölgesinde özellikle Göcek çevresinde müşterilerine 
            profesyonel hizmet sunmaktadır.
          </p>
        </section>

        <section class="mb-12">
          <h2 class="text-2xl font-semibold mb-4">Hizmetlerimiz</h2>
          <div class="grid md:grid-cols-2 gap-6 mb-6">
            <div class="bg-white p-6 rounded-lg shadow-sm border">
              <h3 class="text-xl font-semibold mb-3">Servis & Bakım</h3>
              <p class="text-gray-700">
                Göcek bölgesinde deniz araçlarınız için profesyonel servis, bakım ve onarım hizmetleri sunuyoruz.
              </p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-sm border">
              <h3 class="text-xl font-semibold mb-3">Denizcilik Malzemeleri</h3>
              <p class="text-gray-700">
                Tüm Türkiye'ye denizcilik ekipmanları, yedek parça ve aksesuarlar tedarik ediyoruz.
              </p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-sm border">
              <h3 class="text-xl font-semibold mb-3">Motor & Bot Satışı</h3>
              <p class="text-gray-700">
                Parsun, BTM ve diğer önde gelen markaların motor ve bot satışını gerçekleştiriyoruz.
              </p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-sm border">
              <h3 class="text-xl font-semibold mb-3">Ürün Çeşitliliği</h3>
              <p class="text-gray-700">
                SUP board'lardan marina ekipmanlarına kadar geniş ürün yelpazesiyle hizmetinizdeyiz.
              </p>
            </div>
          </div>
        </section>

        <section class="mb-12">
          <h2 class="text-2xl font-semibold mb-4">Bölgesel Varlığımız</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Ortaca, Muğla ve Dalaman merkezli olarak başlayan yolculuğumuz, özellikle Göcek 
            bölgesindeki yoğun marina aktiviteleri sayesinde deneyim kazanmamızı sağladı. 
            Bölgedeki tekne sahipleri ve denizciler için güvenilir bir iş ortağı olarak 
            hizmet vermeye devam ediyoruz.
          </p>
        </section>

        <section class="mb-12">
          <h2 class="text-2xl font-semibold mb-4">Türkiye Geneli Hizmet</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Yerel varlığımızın yanı sıra, tüm Türkiye genelinde denizcilik malzemeleri, 
            motor ve bot satışı konusunda hizmet vermekteyiz. Online mağazamız üzerinden 
            ürünlerimize kolayca ulaşabilir, güvenli ödeme yöntemleri ile sipariş verebilirsiniz.
          </p>
        </section>

        <section class="bg-gray-50 p-8 rounded-lg">
          <h2 class="text-2xl font-semibold mb-4">İletişim</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Denizcilik ihtiyaçlarınız için bize ulaşın. Profesyonel ekibimiz size en iyi 
            hizmeti sunmak için hazır.
          </p>
          <div class="flex flex-col gap-2 text-gray-700">
            <p><strong>Adres:</strong> Tersakan Çayı mevkii Dalaman - Fethiye Çevreyolu üzeri Dalamn , Muğla - Dalaman / Göcek Bölgesi</p>
            <p><strong>Hizmet Alanı:</strong> Tüm Türkiye</p>
          </div>
        </section>
      </div>
    </div>
  </main>
</template>

<style scoped>
.prose h2 {
  color: #1a202c;
}

.prose p {
  margin-bottom: 1rem;
}
</style>
