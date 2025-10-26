<script setup lang="ts">
const { frontEndUrl } = useHelpers();

useSeoMeta({
  title: 'İade ve Değişim Politikası',
  description: 'Ürün iadesi, değişim koşulları, yetkili servis raporu gerekliliği ve iade süreci hakkında detaylı bilgi edinin.',
  ogTitle: 'İade ve Değişim Politikası',
  ogDescription: '14 gün içinde iade ve değişim hakkı. Yetkili servis raporu ile kolay iade süreci.',
});

// Structured Data
const breadcrumbJsonLd = computed(() =>
  JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: frontEndUrl },
        { '@type': 'ListItem', position: 2, name: 'İade ve Değişim', item: `${frontEndUrl}/iade-ve-degisim` },
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
      name: 'İade ve Değişim Politikası',
      description: 'Ürün iadesi ve değişim koşulları, yetkili servis raporu gerekliliği hakkında bilgiler',
      url: `${frontEndUrl}/iade-ve-degisim`,
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
          <Icon name="ion:swap-horizontal-outline" class="w-10 h-10 text-primary" />
        </div>
        <h1 class="text-4xl font-bold text-gray-900 mb-4">İade ve Değişim Politikası</h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Müşteri memnuniyeti odaklı iade ve değişim politikamız ile güvenle alışveriş yapın.
        </p>
      </div>

      <!-- 14 Gün Highlight -->
      <div class="bg-gradient-to-r from-primary to-primary/80 text-white p-8 rounded-2xl mb-12 shadow-lg">
        <div class="flex flex-col md:flex-row items-center gap-6">
          <div class="flex-shrink-0">
            <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Icon name="ion:calendar-outline" class="w-10 h-10" />
            </div>
          </div>
          <div class="flex-1 text-center md:text-left">
            <h2 class="text-2xl font-bold mb-2">14 Gün İade ve Değişim Hakkı</h2>
            <p class="text-white/90 text-lg">
              Ürünü teslim aldığınız tarihten itibaren 14 gün içinde iade veya değişim talebinde bulunabilirsiniz.
            </p>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="bg-white rounded-2xl shadow-sm p-8 md:p-12 mb-8">
        <!-- İade Koşulları -->
        <section class="mb-12">
          <div class="flex items-start gap-4 mb-6">
            <div class="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="ion:document-text-outline" class="w-6 h-6 text-primary" />
            </div>
            <div class="flex-1">
              <h2 class="text-2xl font-bold text-gray-900 mb-4">İade Koşulları</h2>
              <p class="text-gray-600 leading-relaxed mb-4">
                İade talebinizin kabul edilebilmesi için aşağıdaki koşulların sağlanması gerekmektedir:
              </p>
              
              <div class="space-y-3 mb-6">
                <div class="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <Icon name="ion:checkmark-circle" class="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p class="font-semibold text-gray-900">Orijinal Ambalaj ve Etiketler</p>
                    <p class="text-sm text-gray-600">Ürün orijinal ambalajında, etiketi eksiksiz ve hasarsız olmalıdır</p>
                  </div>
                </div>
                <div class="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <Icon name="ion:checkmark-circle" class="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p class="font-semibold text-gray-900">Kullanılmamış Olmalı</p>
                    <p class="text-sm text-gray-600">Ürün kullanılmamış, denenmemiş ve ticari değerini kaybetmemiş olmalıdır</p>
                  </div>
                </div>
                <div class="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <Icon name="ion:checkmark-circle" class="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p class="font-semibold text-gray-900">Fatura ve Belgeleri</p>
                    <p class="text-sm text-gray-600">Ürünle birlikte gelen tüm belgeler, aksesuarlar ve fatura eksiksiz olmalıdır</p>
                  </div>
                </div>
                <div class="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <Icon name="ion:checkmark-circle" class="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p class="font-semibold text-gray-900">14 Gün Süresi</p>
                    <p class="text-sm text-gray-600">Ürün teslim tarihinden itibaren 14 gün içinde iade talebi yapılmalıdır</p>
                  </div>
                </div>
              </div>

              <div class="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p class="font-semibold text-red-900 mb-2 flex items-center gap-2">
                  <Icon name="ion:close-circle-outline" class="w-5 h-5" />
                  İade Edilemeyen Ürünler
                </p>
                <ul class="text-sm text-red-800 space-y-1 ml-7">
                  <li>• Hijyen ve sağlık açısından iade edilmesi uygun olmayan ürünler</li>
                  <li>• Kullanılmış, yıpranmış veya hasarlı ürünler</li>
                  <li>• Kampanya ve özel indirimli ürünler (belirtilmişse)</li>
                  <li>• Kişiye özel üretilmiş veya özelleştirilmiş ürünler</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <hr class="my-8 border-gray-200" />

        <!-- Yetkili Servis Raporu -->
        <section class="mb-12">
          <div class="flex items-start gap-4 mb-6">
            <div class="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="ion:shield-checkmark-outline" class="w-6 h-6 text-primary" />
            </div>
            <div class="flex-1">
              <h2 class="text-2xl font-bold text-gray-900 mb-4">Yetkili Servis Raporu Gerekliliği</h2>
              <p class="text-gray-600 leading-relaxed mb-4">
                Arızalı veya hasarlı ürün iadelerinde <strong class="text-gray-900">yetkili servis raporu</strong> zorunludur. 
                Bu rapor, ürünün üretim hatası veya nakliye sırasında hasar görmüş olduğunu belgelendirir.
              </p>

              <div class="p-5 bg-amber-50 border-2 border-amber-300 rounded-lg mb-4">
                <p class="font-bold text-amber-900 mb-2 flex items-center gap-2 text-lg">
                  <Icon name="ion:alert-circle" class="w-6 h-6" />
                  Önemli: Arızalı Ürün İadesi
                </p>
                <p class="text-amber-800 mb-3">
                  Ürününüzde arıza veya hasar tespit ederseniz, iade işlemi için öncelikle yetkili servise başvurmanız gerekmektedir. 
                  Servis raporunda ürünün kullanıcı hatası olmaksızın arızalı olduğu belgelenmelidir.
                </p>
                <div class="bg-white p-4 rounded border border-amber-200">
                  <p class="font-semibold text-amber-900 mb-2">Yetkili Servis Raporu Nasıl Alınır?</p>
                  <ol class="text-sm text-amber-800 space-y-1 list-decimal ml-4">
                    <li>Ürünün yetkili servisine başvurun (iletişim bilgileri ürün belgelerinde mevcuttur)</li>
                    <li>Servis teknisyeninin ürünü incelemesini sağlayın</li>
                    <li>Üretim hatası veya nakliye hasarı tespit edilirse yazılı rapor talep edin</li>
                    <li>Raporu ve ürünü bize iade sürecinde gönderin</li>
                  </ol>
                </div>
              </div>

              <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p class="text-sm text-blue-900">
                  <Icon name="ion:information-circle" class="inline w-5 h-5 mr-1" />
                  Yetkili servis raporunuz yoksa, ürün incelemesi için önce bize gönderebilirsiniz. 
                  Ancak kullanıcı hatası tespit edilirse iade kabul edilmeyecek ve ürün kargo bedeli tarafınıza ait olmak üzere iade edilecektir.
                </p>
              </div>
            </div>
          </div>
        </section>

        <hr class="my-8 border-gray-200" />

        <!-- İade Süreci -->
        <section class="mb-12">
          <div class="flex items-start gap-4 mb-6">
            <div class="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="ion:git-network-outline" class="w-6 h-6 text-primary" />
            </div>
            <div class="flex-1">
              <h2 class="text-2xl font-bold text-gray-900 mb-4">İade Süreci Adım Adım</h2>
              
              <div class="space-y-4">
                <div class="flex gap-4">
                  <div class="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <div class="flex-1 pt-1">
                    <h3 class="font-bold text-gray-900 mb-1">İade Talebi Oluşturun</h3>
                    <p class="text-gray-600 text-sm">
                      Müşteri hizmetlerimize e-posta, telefon veya WhatsApp üzerinden iade talebinizi bildirin. 
                      Sipariş numaranızı ve iade sebebinizi belirtin.
                    </p>
                  </div>
                </div>

                <div class="flex gap-4">
                  <div class="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <div class="flex-1 pt-1">
                    <h3 class="font-bold text-gray-900 mb-1">İade Onayı Alın</h3>
                    <p class="text-gray-600 text-sm">
                      Talebiniz incelendikten sonra size bir <strong>iade kodu</strong> ve iade kargo adresi iletilecektir. 
                      Arızalı ürünlerde yetkili servis raporu talep edilecektir.
                    </p>
                  </div>
                </div>

                <div class="flex gap-4">
                  <div class="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <div class="flex-1 pt-1">
                    <h3 class="font-bold text-gray-900 mb-1">Ürünü Paketleyin ve Gönderin</h3>
                    <p class="text-gray-600 text-sm mb-2">
                      Ürünü orijinal ambalajında, tüm aksesuarları ve belgeleriyle birlikte güvenli şekilde paketleyin. 
                      İade kodunu paketin üzerine yazın.
                    </p>
                    <div class="p-3 bg-green-50 border border-green-200 rounded text-sm text-green-800">
                      <Icon name="ion:gift-outline" class="inline w-4 h-4 mr-1" />
                      <strong>İade Kargo Ücreti:</strong> Ürün kusurlu veya hatalı gönderilmişse kargo ücreti tarafımızca karşılanır. 
                      Müşteri kaynaklı iadelerde kargo bedeli alıcı ödemeli gönderim yapılmalıdır.
                    </div>
                  </div>
                </div>

                <div class="flex gap-4">
                  <div class="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                    4
                  </div>
                  <div class="flex-1 pt-1">
                    <h3 class="font-bold text-gray-900 mb-1">Ürün İncelemesi</h3>
                    <p class="text-gray-600 text-sm">
                      Ürün tarafımıza ulaştıktan sonra 2-3 iş günü içinde kalite kontrol ekibimiz tarafından incelenir. 
                      İade koşullarına uygunluğu kontrol edilir.
                    </p>
                  </div>
                </div>

                <div class="flex gap-4">
                  <div class="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                    5
                  </div>
                  <div class="flex-1 pt-1">
                    <h3 class="font-bold text-gray-900 mb-1">İade Onayı ve Ödeme</h3>
                    <p class="text-gray-600 text-sm">
                      Ürün iade koşullarına uygunsa, ödemeniz <strong>5-7 iş günü</strong> içinde ödeme yönteminize iade edilir. 
                      Kredi kartı ödemelerinde iadenin hesabınıza yansıması bankanıza bağlı olarak 2-3 gün daha sürebilir.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <hr class="my-8 border-gray-200" />

        <!-- Değişim İşlemi -->
        <section class="mb-12">
          <div class="flex items-start gap-4 mb-6">
            <div class="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="ion:repeat-outline" class="w-6 h-6 text-primary" />
            </div>
            <div class="flex-1">
              <h2 class="text-2xl font-bold text-gray-900 mb-4">Değişim İşlemi</h2>
              <p class="text-gray-600 leading-relaxed mb-4">
                Aldığınız ürünü başka bir ürünle değiştirmek istiyorsanız, önce iade işlemi başlatmanız gerekmektedir. 
                İade onaylandıktan sonra yeni siparişinizi oluşturabilirsiniz.
              </p>

              <div class="space-y-3">
                <div class="p-4 bg-gray-50 rounded-lg">
                  <p class="font-semibold text-gray-900 mb-1">Aynı Kategoride Değişim</p>
                  <p class="text-sm text-gray-600">
                    Aynı kategoriden farklı bir model veya renk tercih edebilirsiniz. Fiyat farkı varsa ödeme veya iade işlemi yapılır.
                  </p>
                </div>
                <div class="p-4 bg-gray-50 rounded-lg">
                  <p class="font-semibold text-gray-900 mb-1">Farklı Ürün ile Değişim</p>
                  <p class="text-sm text-gray-600">
                    Farklı kategoriden bir ürünle değişim yapmak isterseniz, önce iade sonra yeni sipariş süreci uygulanır.
                  </p>
                </div>
                <div class="p-4 bg-gray-50 rounded-lg">
                  <p class="font-semibold text-gray-900 mb-1">Hızlı Değişim</p>
                  <p class="text-sm text-gray-600">
                    Beden veya renk değişimi gibi durumlarda hızlı değişim seçeneğimizden yararlanabilirsiniz. 
                    Müşteri hizmetlerimizle iletişime geçin.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <hr class="my-8 border-gray-200" />

        <!-- Garanti Kapsamı -->
        <section>
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="ion:ribbon-outline" class="w-6 h-6 text-primary" />
            </div>
            <div class="flex-1">
              <h2 class="text-2xl font-bold text-gray-900 mb-4">Garanti Kapsamı</h2>
              <p class="text-gray-600 leading-relaxed mb-4">
                Ürünlerimizin çoğu <strong class="text-gray-900">2 yıl garanti</strong> kapsamındadır. 
                Garanti süresi içinde üretici kaynaklı arızalarda ücretsiz onarım veya değişim hizmeti sunulmaktadır.
              </p>

              <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                <p class="font-semibold text-blue-900 mb-2">Garanti Şartları</p>
                <ul class="text-sm text-blue-800 space-y-1 ml-4 list-disc">
                  <li>Garanti belgesi ve fatura eksiksiz olmalıdır</li>
                  <li>Ürün yetkili servislerde onarılmış olmalıdır</li>
                  <li>Kullanıcı hatası olmaksızın arıza meydana gelmiş olmalıdır</li>
                  <li>Ürün üzerinde izinsiz müdahale yapılmamış olmalıdır</li>
                </ul>
              </div>

              <div class="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p class="font-semibold text-amber-900 mb-2">Garanti Kapsamı Dışı Durumlar</p>
                <ul class="text-sm text-amber-800 space-y-1 ml-4 list-disc">
                  <li>Hatalı kullanım veya bakım eksikliğinden kaynaklanan arızalar</li>
                  <li>Dış etkenler (darbe, düşme, su teması vb.) sonucu oluşan hasarlar</li>
                  <li>Yetkisiz servislerde yapılan onarımlar</li>
                  <li>Normal yıpranma ve aşınmalar</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Contact CTA -->
      <div class="bg-white rounded-2xl shadow-sm p-8 text-center">
        <h3 class="text-2xl font-bold text-gray-900 mb-3">İade veya Değişim İçin Yardıma mı İhtiyacınız Var?</h3>
        <p class="text-gray-600 mb-6">Müşteri hizmetleri ekibimiz size yardımcı olmaktan mutluluk duyacaktır.</p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink
            to="/iletisim"
            class="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold">
            <Icon name="ion:mail-outline" class="w-5 h-5 mr-2" />
            İletişime Geçin
          </NuxtLink>
          <NuxtLink
            to="/sss/iade-ve-degisim"
            class="inline-flex items-center justify-center px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-primary hover:text-primary transition-colors font-semibold">
            <Icon name="ion:help-circle-outline" class="w-5 h-5 mr-2" />
            İade SSS
          </NuxtLink>
        </div>
      </div>
    </div>
  </main>
</template>
