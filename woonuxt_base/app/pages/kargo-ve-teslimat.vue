<script setup lang="ts">
const { frontEndUrl } = useHelpers();

useSeoMeta({
  title: 'Kargo ve Teslimat Bilgileri',
  description: 'Ücretsiz kargo, teslimat süreleri, kargo takibi ve teslimat bölgeleri hakkında detaylı bilgi edinin.',
  ogTitle: 'Kargo ve Teslimat Bilgileri',
  ogDescription: 'Tüm siparişlerinizde ücretsiz kargo. Türkiye\'nin her yerine 3 iş günü içinde teslimat.',
});

// Structured Data
const breadcrumbJsonLd = computed(() =>
  JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: frontEndUrl },
        { '@type': 'ListItem', position: 2, name: 'Kargo ve Teslimat', item: `${frontEndUrl}/kargo-ve-teslimat` },
      ],
    },
    null,
    2,
  ),
);

const webPageJsonLd = computed(() =>
  JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Kargo ve Teslimat Bilgileri',
      description: 'Ücretsiz kargo, teslimat süreleri ve kargo takibi hakkında detaylı bilgiler',
      url: `${frontEndUrl}/kargo-ve-teslimat`,
    },
    null,
    2,
  ),
);

useHead({
  script: [
    { type: 'application/ld+json', innerHTML: breadcrumbJsonLd },
    { type: 'application/ld+json', innerHTML: webPageJsonLd },
  ],
});
</script>

<template>
  <main class="bg-gray-50 py-16">
    <div class="container max-w-5xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
          <Icon name="ion:cube-outline" class="w-10 h-10 text-primary" />
        </div>
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Kargo ve Teslimat Bilgileri</h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Tüm siparişlerinizde ücretsiz kargo hizmetimizden yararlanın. Türkiye'nin her yerine hızlı ve güvenli teslimat.
        </p>
      </div>

      <!-- Free Shipping Highlight -->
      <div class="bg-gradient-to-r from-primary to-primary/80 text-white p-8 rounded-2xl mb-12 shadow-lg">
        <div class="flex flex-col md:flex-row items-center gap-6">
          <div class="flex-shrink-0">
            <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Icon name="ion:checkmark-circle" class="w-10 h-10" />
            </div>
          </div>
          <div class="flex-1 text-center md:text-left">
            <h2 class="text-2xl font-bold mb-2">Tüm Siparişlerde Ücretsiz Kargo!</h2>
            <p class="text-white/90 text-lg">
              Sipariş tutarınız ne olursa olsun, kargo ücreti bizden. Türkiye'nin her yerine ücretsiz gönderim.
            </p>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="bg-white rounded-2xl shadow-sm p-8 md:p-12 mb-8">
        <!-- Teslimat Süresi -->
        <section class="mb-12">
          <div class="flex items-start gap-4 mb-6">
            <div class="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="ion:time-outline" class="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 class="text-2xl font-bold text-gray-900 mb-3">Teslimat Süresi</h2>
              <p class="text-gray-600 leading-relaxed">
                Siparişiniz onaylandıktan sonra <strong class="text-gray-900">1-2 iş günü</strong> içinde kargoya teslim edilir. 
                Kargoya verilen ürünleriniz <strong class="text-gray-900">3 iş günü</strong> içinde adresinize ulaşır.
              </p>
              <div class="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                <p class="text-sm text-blue-900">
                  <Icon name="ion:information-circle" class="inline w-5 h-5 mr-1" />
                  <strong>Önemli:</strong> Stokta olmayan ürünler için tedarik süresi değişkenlik gösterebilir. 
                  Bu durumda müşteri hizmetlerimiz tarafından bilgilendirilirsiniz.
                </p>
              </div>
            </div>
          </div>
        </section>

        <hr class="my-8 border-gray-200" />

        <!-- Kargo Firması ve Takip -->
        <section class="mb-12">
          <div class="flex items-start gap-4 mb-6">
            <div class="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="ion:location-outline" class="w-6 h-6 text-primary" />
            </div>
            <div class="flex-1">
              <h2 class="text-2xl font-bold text-gray-900 mb-3">Kargo Takibi</h2>
              <p class="text-gray-600 leading-relaxed mb-4">
                Siparişiniz kargoya verildikten sonra <strong class="text-gray-900">kargo takip numaranız</strong> 
                e-posta ve SMS ile tarafınıza iletilir. Takip numaranız ile kargo durumunuzu 7/24 takip edebilirsiniz.
              </p>
              
              <div class="space-y-3">
                <div class="flex items-start gap-3">
                  <Icon name="ion:mail-outline" class="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p class="font-semibold text-gray-900">E-posta Bildirimi</p>
                    <p class="text-sm text-gray-600">Sipariş durumu değişikliklerinde otomatik bilgilendirme</p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <Icon name="ion:chatbox-outline" class="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p class="font-semibold text-gray-900">SMS Bildirimi</p>
                    <p class="text-sm text-gray-600">Kargo takip numarası ve teslimat güncellemeleri</p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <Icon name="ion:person-circle-outline" class="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p class="font-semibold text-gray-900">Hesabım Sayfası</p>
                    <p class="text-sm text-gray-600">Siparişlerim bölümünden anlık durum takibi</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <hr class="my-8 border-gray-200" />

        <!-- Teslimat Bölgeleri -->
        <section class="mb-12">
          <div class="flex items-start gap-4 mb-6">
            <div class="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="ion:map-outline" class="w-6 h-6 text-primary" />
            </div>
            <div class="flex-1">
              <h2 class="text-2xl font-bold text-gray-900 mb-3">Teslimat Bölgeleri</h2>
              <p class="text-gray-600 leading-relaxed mb-4">
                Türkiye'nin tüm illerine ve ilçelerine teslimat yapıyoruz. Kargo hizmetimiz kapsamında:
              </p>
              
              <div class="grid md:grid-cols-2 gap-4">
                <div class="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <Icon name="ion:checkmark-circle" class="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p class="font-semibold text-gray-900">Şehir Merkezi</p>
                    <p class="text-sm text-gray-600">2-3 iş günü teslimat</p>
                  </div>
                </div>
                <div class="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <Icon name="ion:checkmark-circle" class="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p class="font-semibold text-gray-900">İlçe Merkezi</p>
                    <p class="text-sm text-gray-600">3-4 iş günü teslimat</p>
                  </div>
                </div>
                <div class="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <Icon name="ion:checkmark-circle" class="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p class="font-semibold text-gray-900">Belde ve Köyler</p>
                    <p class="text-sm text-gray-600">4-5 iş günü teslimat</p>
                  </div>
                </div>
                <div class="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <Icon name="ion:checkmark-circle" class="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p class="font-semibold text-gray-900">Uzak Bölgeler</p>
                    <p class="text-sm text-gray-600">5-7 iş günü teslimat</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <hr class="my-8 border-gray-200" />

        <!-- Paketleme ve Güvenlik -->
        <section class="mb-12">
          <div class="flex items-start gap-4 mb-6">
            <div class="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="ion:shield-checkmark-outline" class="w-6 h-6 text-primary" />
            </div>
            <div class="flex-1">
              <h2 class="text-2xl font-bold text-gray-900 mb-3">Güvenli Paketleme</h2>
              <p class="text-gray-600 leading-relaxed mb-4">
                Ürünleriniz özenle paketlenir ve hasarsız teslim edilmesi için gerekli tüm önlemler alınır.
              </p>
              
              <ul class="space-y-3">
                <li class="flex items-start gap-3">
                  <Icon name="ion:checkmark-circle" class="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span class="text-gray-700">Orijinal ürün ambalajı korunur</span>
                </li>
                <li class="flex items-start gap-3">
                  <Icon name="ion:checkmark-circle" class="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span class="text-gray-700">Ekstra koruyucu malzemeler kullanılır (hava kabarcıklı naylon, köpük vb.)</span>
                </li>
                <li class="flex items-start gap-3">
                  <Icon name="ion:checkmark-circle" class="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span class="text-gray-700">Sağlam karton kutular ile gönderim</span>
                </li>
                <li class="flex items-start gap-3">
                  <Icon name="ion:checkmark-circle" class="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span class="text-gray-700">Kırılabilir ürünlerde özel işaretleme</span>
                </li>
                <li class="flex items-start gap-3">
                  <Icon name="ion:checkmark-circle" class="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span class="text-gray-700">Sigortalı kargo seçeneği</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <hr class="my-8 border-gray-200" />

        <!-- Teslimat Sırasında -->
        <section>
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="ion:hand-right-outline" class="w-6 h-6 text-primary" />
            </div>
            <div class="flex-1">
              <h2 class="text-2xl font-bold text-gray-900 mb-3">Teslimat Sırasında Dikkat Edilmesi Gerekenler</h2>
              <div class="space-y-4">
                <div class="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p class="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                    <Icon name="ion:alert-circle-outline" class="w-5 h-5" />
                    Kargo Teslim Alırken Kontrol Edin
                  </p>
                  <ul class="text-sm text-amber-800 space-y-1 ml-7">
                    <li>• Koli dış görünümünü kontrol edin (ezik, yırtık, ıslak vb.)</li>
                    <li>• Hasar görülüyorsa tutanak tutarak teslim alın</li>
                    <li>• Kimlik kontrolü yapılabilir, kimliğinizi hazır bulundurun</li>
                    <li>• Kargo görevlisinden teslimat makbuzu alın</li>
                  </ul>
                </div>

                <div class="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p class="font-semibold text-green-900 mb-2 flex items-center gap-2">
                    <Icon name="ion:thumbs-up-outline" class="w-5 h-5" />
                    Hasar Durumunda
                  </p>
                  <p class="text-sm text-green-800">
                    Hasarlı teslimat durumunda kargo görevlisinden tutanak tutulmasını talep edin ve 
                    <strong> 24 saat içinde</strong> müşteri hizmetlerimize fotoğraflı bildirimde bulunun. 
                    Hasarlı ürünler için değişim veya iade işleminiz hızlıca gerçekleştirilecektir.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Contact CTA -->
      <div class="bg-white rounded-2xl shadow-sm p-8 text-center">
        <h3 class="text-2xl font-bold text-gray-900 mb-3">Kargo ile İlgili Sorularınız mı Var?</h3>
        <p class="text-gray-600 mb-6">Müşteri hizmetleri ekibimiz size yardımcı olmaktan mutluluk duyacaktır.</p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink
            to="/iletisim"
            class="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold">
            <Icon name="ion:mail-outline" class="w-5 h-5 mr-2" />
            İletişime Geçin
          </NuxtLink>
          <NuxtLink
            to="/sss"
            class="inline-flex items-center justify-center px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-primary hover:text-primary transition-colors font-semibold">
            <Icon name="ion:help-circle-outline" class="w-5 h-5 mr-2" />
            Sıkça Sorulan Sorular
          </NuxtLink>
        </div>
      </div>
    </div>
  </main>
</template>
