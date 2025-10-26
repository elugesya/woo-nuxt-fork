<script setup lang="ts">
const { frontEndUrl } = useHelpers();

useSeoMeta({
  title: 'Teslimat Bilgileri',
  description: 'Detaylı teslimat süreleri, bölgesel teslimat koşulları, paketleme ve güvenli teslimat bilgileri.',
  ogTitle: 'Teslimat Bilgileri',
  ogDescription: '3 iş günü içinde adresinize güvenli teslimat. Türkiye geneli teslimat kapsamı.',
});

// Structured Data
const breadcrumbJsonLd = computed(() =>
  JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: frontEndUrl },
        { '@type': 'ListItem', position: 2, name: 'Teslimat Bilgileri', item: `${frontEndUrl}/teslimat-bilgileri` },
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
      name: 'Teslimat Bilgileri',
      description: 'Detaylı teslimat süreleri, bölgesel koşullar ve güvenli paketleme bilgileri',
      url: `${frontEndUrl}/teslimat-bilgileri`,
    },
    null,
    2,
  ),
);

useHead(() => ({
  script: [
    { type: 'application/ld+json', children: breadcrumbJsonLd.value },
    { type: 'application/ld+json', children: webPageJsonLd.value },
  ],
}));
</script>

<template>
  <main class="bg-gray-50 py-16">
    <div class="container max-w-5xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
          <Icon name="ion:rocket-outline" class="w-10 h-10 text-primary" />
        </div>
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Teslimat Bilgileri</h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Siparişleriniz özenle paketlenir ve en kısa sürede adresinize güvenle ulaştırılır.
        </p>
      </div>

      <!-- 3 İş Günü Highlight -->
      <div class="bg-gradient-to-r from-green-600 to-green-500 text-white p-8 rounded-2xl mb-12 shadow-lg">
        <div class="flex flex-col md:flex-row items-center gap-6">
          <div class="flex-shrink-0">
            <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Icon name="ion:flash-outline" class="w-10 h-10" />
            </div>
          </div>
          <div class="flex-1 text-center md:text-left">
            <h2 class="text-2xl font-bold mb-2">Hızlı Teslimat: 3 İş Günü</h2>
            <p class="text-white/90 text-lg">
              Siparişiniz kargoya verildikten sonra ortalama 3 iş günü içinde adresinize teslim edilir.
            </p>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="bg-white rounded-2xl shadow-sm p-8 md:p-12 mb-8">
        <!-- Teslimat Süreci -->
        <section class="mb-12">
          <div class="flex items-start gap-4 mb-6">
            <div class="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="ion:git-network-outline" class="w-6 h-6 text-primary" />
            </div>
            <div class="flex-1">
              <h2 class="text-2xl font-bold text-gray-900 mb-4">Teslimat Süreci</h2>
              
              <div class="space-y-4">
                <div class="flex gap-4">
                  <div class="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <div class="flex-1 pt-1">
                    <h3 class="font-bold text-gray-900 mb-1">Sipariş Onayı</h3>
                    <p class="text-gray-600 text-sm">
                      Siparişiniz onaylandıktan sonra <strong>anında</strong> hazırlık sürecine alınır. 
                      Onay bilgisi e-posta ve SMS ile tarafınıza iletilir.
                    </p>
                  </div>
                </div>

                <div class="flex gap-4">
                  <div class="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <div class="flex-1 pt-1">
                    <h3 class="font-bold text-gray-900 mb-1">Paketleme ve Hazırlık (0-24 Saat)</h3>
                    <p class="text-gray-600 text-sm">
                      Ürünleriniz özenle paketlenir, kalite kontrolü yapılır ve kargo için hazırlanır. 
                      Bu süreç genellikle aynı gün içinde tamamlanır.
                    </p>
                  </div>
                </div>

                <div class="flex gap-4">
                  <div class="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <div class="flex-1 pt-1">
                    <h3 class="font-bold text-gray-900 mb-1">Kargoya Teslim (1-2 İş Günü)</h3>
                    <p class="text-gray-600 text-sm">
                      Paketlenen ürünleriniz <strong>1-2 iş günü</strong> içinde kargo firmasına teslim edilir. 
                      Kargo takip numaranız size iletilir.
                    </p>
                  </div>
                </div>

                <div class="flex gap-4">
                  <div class="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                    4
                  </div>
                  <div class="flex-1 pt-1">
                    <h3 class="font-bold text-gray-900 mb-1">Nakliye Süresi (2-5 İş Günü)</h3>
                    <p class="text-gray-600 text-sm">
                      Kargo firması ürününüzü <strong>2-5 iş günü</strong> içinde adresinize teslim eder. 
                      Teslimat süresi bölgenize göre değişiklik gösterebilir.
                    </p>
                  </div>
                </div>

                <div class="flex gap-4">
                  <div class="flex-shrink-0 w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                    ✓
                  </div>
                  <div class="flex-1 pt-1">
                    <h3 class="font-bold text-gray-900 mb-1">Teslimat Tamamlandı!</h3>
                    <p class="text-gray-600 text-sm">
                      Ürününüz kapınızda! Kargo görevlisinden teslimat makbuzu almayı unutmayın.
                    </p>
                  </div>
                </div>
              </div>

              <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p class="text-sm text-blue-900">
                  <Icon name="ion:information-circle" class="inline w-5 h-5 mr-1" />
                  <strong>Toplam Süre:</strong> Sipariş onayından teslimat tamamlanmasına kadar 
                  ortalama <strong>3-7 iş günü</strong> (bölgelere göre değişkenlik gösterir).
                </p>
              </div>
            </div>
          </div>
        </section>

        <hr class="my-8 border-gray-200" />

        <!-- Bölgesel Teslimat Süreleri -->
        <section class="mb-12">
          <div class="flex items-start gap-4 mb-6">
            <div class="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="ion:map-outline" class="w-6 h-6 text-primary" />
            </div>
            <div class="flex-1">
              <h2 class="text-2xl font-bold text-gray-900 mb-4">Bölgesel Teslimat Süreleri</h2>
              <p class="text-gray-600 leading-relaxed mb-4">
                Teslimat süreleri bulunduğunuz bölgeye göre değişiklik göstermektedir. 
                Aşağıda ortalama teslimat sürelerini bulabilirsiniz:
              </p>
              
              <div class="grid md:grid-cols-2 gap-4">
                <!-- Büyük Şehirler -->
                <div class="p-5 border-2 border-green-300 bg-green-50 rounded-lg">
                  <div class="flex items-center gap-3 mb-3">
                    <Icon name="ion:business-outline" class="w-6 h-6 text-green-600" />
                    <h3 class="font-bold text-gray-900 text-lg">Büyük Şehirler</h3>
                  </div>
                  <p class="text-sm text-gray-600 mb-3">
                    İstanbul, Ankara, İzmir, Antalya, Bursa, Adana vb. büyük şehir merkezleri
                  </p>
                  <div class="flex items-center gap-2">
                    <Icon name="ion:time-outline" class="w-5 h-5 text-green-600" />
                    <span class="font-bold text-green-700">2-3 İş Günü</span>
                  </div>
                </div>

                <!-- İl Merkezleri -->
                <div class="p-5 border-2 border-blue-300 bg-blue-50 rounded-lg">
                  <div class="flex items-center gap-3 mb-3">
                    <Icon name="ion:location-outline" class="w-6 h-6 text-blue-600" />
                    <h3 class="font-bold text-gray-900 text-lg">İl Merkezleri</h3>
                  </div>
                  <p class="text-sm text-gray-600 mb-3">
                    Türkiye geneli il merkezi lokasyonları
                  </p>
                  <div class="flex items-center gap-2">
                    <Icon name="ion:time-outline" class="w-5 h-5 text-blue-600" />
                    <span class="font-bold text-blue-700">3-4 İş Günü</span>
                  </div>
                </div>

                <!-- İlçeler -->
                <div class="p-5 border-2 border-amber-300 bg-amber-50 rounded-lg">
                  <div class="flex items-center gap-3 mb-3">
                    <Icon name="ion:navigate-outline" class="w-6 h-6 text-amber-600" />
                    <h3 class="font-bold text-gray-900 text-lg">İlçe Merkezleri</h3>
                  </div>
                  <p class="text-sm text-gray-600 mb-3">
                    İlçe merkezi ve bağlı mahalleler
                  </p>
                  <div class="flex items-center gap-2">
                    <Icon name="ion:time-outline" class="w-5 h-5 text-amber-600" />
                    <span class="font-bold text-amber-700">4-5 İş Günü</span>
                  </div>
                </div>

                <!-- Uzak Bölgeler -->
                <div class="p-5 border-2 border-gray-300 bg-gray-50 rounded-lg">
                  <div class="flex items-center gap-3 mb-3">
                    <Icon name="ion:trail-sign-outline" class="w-6 h-6 text-gray-600" />
                    <h3 class="font-bold text-gray-900 text-lg">Belde, Köy ve Uzak Bölgeler</h3>
                  </div>
                  <p class="text-sm text-gray-600 mb-3">
                    Kırsal alan ve uzak bölge teslimatları
                  </p>
                  <div class="flex items-center gap-2">
                    <Icon name="ion:time-outline" class="w-5 h-5 text-gray-600" />
                    <span class="font-bold text-gray-700">5-7 İş Günü</span>
                  </div>
                </div>
              </div>

              <div class="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p class="text-sm text-amber-900">
                  <Icon name="ion:warning-outline" class="inline w-5 h-5 mr-1" />
                  <strong>Not:</strong> Teslimat süreleri, hava koşulları, tatil günleri ve kargo yoğunluğuna bağlı olarak değişiklik gösterebilir. 
                  Özel günlerde (Ramazan, Yılbaşı vb.) kargo süreleri uzayabilir.
                </p>
              </div>
            </div>
          </div>
        </section>

        <hr class="my-8 border-gray-200" />

        <!-- Özel Durumlar -->
        <section class="mb-12">
          <div class="flex items-start gap-4 mb-6">
            <div class="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="ion:alert-circle-outline" class="w-6 h-6 text-primary" />
            </div>
            <div class="flex-1">
              <h2 class="text-2xl font-bold text-gray-900 mb-4">Özel Durumlar ve Gecikmeler</h2>
              
              <div class="space-y-4">
                <!-- Stokta Olmayan Ürünler -->
                <div class="p-5 bg-red-50 border border-red-200 rounded-lg">
                  <h3 class="font-bold text-red-900 mb-2 flex items-center gap-2">
                    <Icon name="ion:cube-outline" class="w-5 h-5" />
                    Stokta Olmayan Ürünler
                  </h3>
                  <p class="text-sm text-red-800">
                    Sipariş ettiğiniz ürün stokta yoksa, tedarik süresi eklenir. Bu durumda tarafınıza bilgilendirme yapılır 
                    ve onayınız alınarak süreç devam eder. Tedarik süresi ortalama <strong>3-7 iş günü</strong> arasında değişir.
                  </p>
                </div>

                <!-- Ağır ve Hacimli Ürünler -->
                <div class="p-5 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 class="font-bold text-blue-900 mb-2 flex items-center gap-2">
                    <Icon name="ion:barbell-outline" class="w-5 h-5" />
                    Ağır ve Hacimli Ürünler
                  </h3>
                  <p class="text-sm text-blue-800">
                    Motorlar, büyük bot aksesuarları gibi ağır ve hacimli ürünlerin teslimatı 
                    özel kargo gerektirdiğinden <strong>1-2 gün</strong> ek süre alabilir. 
                    Bu tür ürünlerde desi ücreti hesaplanmaz, kargo yine ücretsizdir.
                  </p>
                </div>

                <!-- Adres Sorunları -->
                <div class="p-5 bg-amber-50 border border-amber-200 rounded-lg">
                  <h3 class="font-bold text-amber-900 mb-2 flex items-center gap-2">
                    <Icon name="ion:home-outline" class="w-5 h-5" />
                    Adres ve İletişim Sorunları
                  </h3>
                  <p class="text-sm text-amber-800 mb-2">
                    Teslimat adresinizin tam ve doğru olması çok önemlidir. Eksik veya hatalı adres bilgisi teslimat gecikmelerine neden olur.
                  </p>
                  <ul class="text-sm text-amber-800 space-y-1 ml-4 list-disc">
                    <li>Mahalle, cadde, sokak, bina ve daire numarasını eksiksiz yazın</li>
                    <li>İletişim numaranızı güncel tutun</li>
                    <li>Kargo görevlisi arayabilir, telefonunuza cevap verebileceğinizden emin olun</li>
                    <li>Adresinizde bulunmayacaksanız alternatif teslim alacak kişi bilgisi bırakın</li>
                  </ul>
                </div>

                <!-- Tatil ve Bayram -->
                <div class="p-5 bg-purple-50 border border-purple-200 rounded-lg">
                  <h3 class="font-bold text-purple-900 mb-2 flex items-center gap-2">
                    <Icon name="ion:calendar-outline" class="w-5 h-5" />
                    Tatil, Bayram ve Özel Günler
                  </h3>
                  <p class="text-sm text-purple-800">
                    Resmi tatil günleri, bayram dönemleri ve özel günlerde (Ramazan, Yılbaşı, Anneler Günü vb.) 
                    kargo yoğunluğu artabilir. Bu dönemlerde teslimat sürelerine <strong>2-3 gün</strong> eklenebilir.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <hr class="my-8 border-gray-200" />

        <!-- Güvenli Paketleme Detayı -->
        <section class="mb-12">
          <div class="flex items-start gap-4 mb-6">
            <div class="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="ion:shield-checkmark-outline" class="w-6 h-6 text-primary" />
            </div>
            <div class="flex-1">
              <h2 class="text-2xl font-bold text-gray-900 mb-4">Güvenli ve Özenli Paketleme</h2>
              <p class="text-gray-600 leading-relaxed mb-4">
                Ürünlerinizin hasarsız şekilde elinize ulaşması için paketleme sürecinde azami özen gösteriyoruz.
              </p>

              <div class="grid md:grid-cols-2 gap-4">
                <div class="p-4 bg-gray-50 rounded-lg">
                  <div class="flex items-center gap-2 mb-2">
                    <Icon name="ion:cube-outline" class="w-5 h-5 text-primary" />
                    <h3 class="font-semibold text-gray-900">Orijinal Ambalaj Koruması</h3>
                  </div>
                  <p class="text-sm text-gray-600">
                    Ürünlerin orijinal kutuları korunur ve üzerine ekstra koruma malzemeleri eklenir.
                  </p>
                </div>

                <div class="p-4 bg-gray-50 rounded-lg">
                  <div class="flex items-center gap-2 mb-2">
                    <Icon name="ion:layers-outline" class="w-5 h-5 text-primary" />
                    <h3 class="font-semibold text-gray-900">Çoklu Koruma Katmanı</h3>
                  </div>
                  <p class="text-sm text-gray-600">
                    Hava kabarcıklı naylon, köpük ve karton seperatörlerle ürünler sabitlenir.
                  </p>
                </div>

                <div class="p-4 bg-gray-50 rounded-lg">
                  <div class="flex items-center gap-2 mb-2">
                    <Icon name="ion:warning-outline" class="w-5 h-5 text-primary" />
                    <h3 class="font-semibold text-gray-900">Özel İşaretleme</h3>
                  </div>
                  <p class="text-sm text-gray-600">
                    Kırılabilir, hassas veya ağır ürünler için özel uyarı etiketleri kullanılır.
                  </p>
                </div>

                <div class="p-4 bg-gray-50 rounded-lg">
                  <div class="flex items-center gap-2 mb-2">
                    <Icon name="ion:checkmark-circle-outline" class="w-5 h-5 text-primary" />
                    <h3 class="font-semibold text-gray-900">Kalite Kontrolü</h3>
                  </div>
                  <p class="text-sm text-gray-600">
                    Paketleme sonrası tüm koliler kalite kontrol sürecinden geçer.
                  </p>
                </div>
              </div>

              <div class="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p class="text-sm text-green-900">
                  <Icon name="ion:leaf-outline" class="inline w-5 h-5 mr-1" />
                  <strong>Çevre Dostu Paketleme:</strong> Geri dönüştürülebilir karton kutular ve 
                  çevre dostu koruma malzemeleri kullanıyoruz.
                </p>
              </div>
            </div>
          </div>
        </section>

        <hr class="my-8 border-gray-200" />

        <!-- Teslimat Takibi -->
        <section>
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="ion:eye-outline" class="w-6 h-6 text-primary" />
            </div>
            <div class="flex-1">
              <h2 class="text-2xl font-bold text-gray-900 mb-4">Teslimat Takibi</h2>
              <p class="text-gray-600 leading-relaxed mb-4">
                Siparişinizin her aşamasını anlık olarak takip edebilirsiniz.
              </p>

              <div class="space-y-3">
                <div class="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                  <Icon name="ion:mail-open-outline" class="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p class="font-semibold text-gray-900">E-posta Bildirimleri</p>
                    <p class="text-sm text-gray-600">
                      Sipariş onayı, kargoya teslim, yola çıktı ve teslim edildi bildirimlerini otomatik alırsınız
                    </p>
                  </div>
                </div>

                <div class="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                  <Icon name="ion:chatbubble-ellipses-outline" class="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p class="font-semibold text-gray-900">SMS Bildirimleri</p>
                    <p class="text-sm text-gray-600">
                      Kargo takip numaranız ve önemli güncellemeler SMS ile tarafınıza iletilir
                    </p>
                  </div>
                </div>

                <div class="flex items-start gap-3 p-4 bg-purple-50 rounded-lg">
                  <Icon name="ion:person-circle-outline" class="w-6 h-6 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p class="font-semibold text-gray-900">Hesabım Sayfası</p>
                    <p class="text-sm text-gray-600">
                      Siparişlerim bölümünden detaylı durum bilgisi ve kargo takip linkini görüntüleyin
                    </p>
                  </div>
                </div>

                <div class="flex items-start gap-3 p-4 bg-amber-50 rounded-lg">
                  <Icon name="ion:call-outline" class="w-6 h-6 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p class="font-semibold text-gray-900">Müşteri Hizmetleri Desteği</p>
                    <p class="text-sm text-gray-600">
                      Teslimat ile ilgili sorunuz varsa 7/24 müşteri hizmetlerimizle iletişime geçebilirsiniz
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Contact CTA -->
      <div class="bg-white rounded-2xl shadow-sm p-8 text-center">
        <h3 class="text-2xl font-bold text-gray-900 mb-3">Teslimat Hakkında Sorularınız mı Var?</h3>
        <p class="text-gray-600 mb-6">Size en iyi hizmeti sunmak için buradayız.</p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink
            to="/iletisim"
            class="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold">
            <Icon name="ion:mail-outline" class="w-5 h-5 mr-2" />
            Bize Yazın
          </NuxtLink>
          <NuxtLink
            to="/sss/kargo-ve-teslimat"
            class="inline-flex items-center justify-center px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-primary hover:text-primary transition-colors font-semibold">
            <Icon name="ion:help-circle-outline" class="w-5 h-5 mr-2" />
            Kargo SSS
          </NuxtLink>
        </div>
      </div>
    </div>
  </main>
</template>
