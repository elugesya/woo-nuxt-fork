<script setup lang="ts">
const { frontEndUrl } = useHelpers();
const runtimeConfig = useRuntimeConfig();
const siteName = runtimeConfig.public.SITE_NAME || 'Sitemiz';
const contactEmail = runtimeConfig.public.ORGANIZATION_CONTACT_EMAIL || 'info@example.com';

useSeoMeta({
  title: 'Gizlilik Politikası ve KVKK',
  description: 'Kişisel verilerinizin korunması, işlenmesi ve KVKK kapsamındaki haklarınız hakkında detaylı bilgi.',
  ogTitle: 'Gizlilik Politikası ve KVKK',
  ogDescription: 'KVKK ve GDPR uyumlu gizlilik politikamız ile verileriniz güvende.',
});

// Structured Data
const breadcrumbJsonLd = computed(() =>
  JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: frontEndUrl },
        { '@type': 'ListItem', position: 2, name: 'Gizlilik Politikası', item: `${frontEndUrl}/gizlilik-politikasi` },
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
      name: 'Gizlilik Politikası ve KVKK Aydınlatma Metni',
      description: 'Kişisel verilerinizin korunması ve işlenmesi hakkında KVKK uyumlu bilgilendirme',
      url: `${frontEndUrl}/gizlilik-politikasi`,
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

const lastUpdated = 'Ekim 2025';
</script>

<template>
  <main class="bg-gray-50 py-16">
    <div class="container max-w-5xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
          <Icon name="ion:shield-checkmark-outline" class="w-10 h-10 text-primary" />
        </div>
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Gizlilik Politikası ve KVKK Aydınlatma Metni</h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Kişisel verilerinizin korunması bizim için önceliklidir. Bu metinde verilerinizi nasıl topladığımız, 
          işlediğimiz ve koruduğumuz hakkında detaylı bilgi bulabilirsiniz.
        </p>
        <p class="text-sm text-gray-500 mt-4">Son Güncelleme: {{ lastUpdated }}</p>
      </div>

      <!-- Main Content -->
      <div class="bg-white rounded-2xl shadow-sm p-8 md:p-12 prose prose-lg max-w-none">
        
        <!-- Veri Sorumlusu -->
        <section class="mb-12">
          <div class="flex items-start gap-4 mb-6">
            <div class="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="ion:business-outline" class="w-6 h-6 text-primary" />
            </div>
            <div class="flex-1">
              <h2 class="text-2xl font-bold text-gray-900 mb-3 mt-0">1. Veri Sorumlusu</h2>
              <p class="text-gray-700 leading-relaxed">
                6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") ve Avrupa Birliği Genel Veri Koruma Tüzüğü (GDPR) kapsamında, 
                <strong>{{ siteName }}</strong> olarak kişisel verilerinizin veri sorumlusu sıfatıyla güvenliğini sağlamak ve 
                gizliliğinizi korumak önceliğimizdir.
              </p>
              <div class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg not-prose">
                <p class="text-sm text-blue-900 mb-2"><strong>İletişim Bilgileri:</strong></p>
                <p class="text-sm text-blue-800">E-posta: {{ contactEmail }}</p>
                <p class="text-sm text-blue-800">Web: {{ frontEndUrl }}</p>
              </div>
            </div>
          </div>
        </section>

        <hr class="my-8 border-gray-200" />

        <!-- İşlenen Kişisel Veriler -->
        <section class="mb-12">
          <div class="flex items-start gap-4 mb-6">
            <div class="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="ion:document-text-outline" class="w-6 h-6 text-primary" />
            </div>
            <div class="flex-1">
              <h2 class="text-2xl font-bold text-gray-900 mb-3 mt-0">2. İşlenen Kişisel Veriler</h2>
              <p class="text-gray-700 leading-relaxed mb-4">
                Hizmetlerimizi sunabilmek ve yasal yükümlülüklerimizi yerine getirebilmek amacıyla 
                aşağıdaki kişisel verilerinizi işlemekteyiz:
              </p>

              <div class="space-y-3 not-prose">
                <div class="p-4 bg-gray-50 rounded-lg">
                  <h3 class="font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <Icon name="ion:person-outline" class="w-5 h-5 text-primary" />
                    Kimlik Bilgileri
                  </h3>
                  <p class="text-sm text-gray-700">Ad, soyad, T.C. kimlik numarası (fatura için gerekli hallerde)</p>
                </div>

                <div class="p-4 bg-gray-50 rounded-lg">
                  <h3 class="font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <Icon name="ion:call-outline" class="w-5 h-5 text-primary" />
                    İletişim Bilgileri
                  </h3>
                  <p class="text-sm text-gray-700">Telefon numarası, e-posta adresi, teslimat ve fatura adresi</p>
                </div>

                <div class="p-4 bg-gray-50 rounded-lg">
                  <h3 class="font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <Icon name="ion:card-outline" class="w-5 h-5 text-primary" />
                    Finansal Bilgiler
                  </h3>
                  <p class="text-sm text-gray-700">Ödeme bilgileri (kredi kartı bilgileri şifreli olarak ödeme kuruluşu tarafından işlenir, sunucularımızda saklanmaz)</p>
                </div>

                <div class="p-4 bg-gray-50 rounded-lg">
                  <h3 class="font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <Icon name="ion:cart-outline" class="w-5 h-5 text-primary" />
                    İşlem Güvenliği Bilgileri
                  </h3>
                  <p class="text-sm text-gray-700">IP adresi, çerez bilgileri, oturum kayıtları, tarayıcı bilgileri</p>
                </div>

                <div class="p-4 bg-gray-50 rounded-lg">
                  <h3 class="font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <Icon name="ion:analytics-outline" class="w-5 h-5 text-primary" />
                    Pazarlama Bilgileri
                  </h3>
                  <p class="text-sm text-gray-700">Alışveriş geçmişi, ürün tercihleri, site kullanım davranışları (analitik)</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <hr class="my-8 border-gray-200" />

        <!-- Veri İşleme Amaçları -->
        <section class="mb-12">
          <div class="flex items-start gap-4 mb-6">
            <div class="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="ion:flag-outline" class="w-6 h-6 text-primary" />
            </div>
            <div class="flex-1">
              <h2 class="text-2xl font-bold text-gray-900 mb-3 mt-0">3. Kişisel Verilerin İşlenme Amaçları</h2>
              <p class="text-gray-700 leading-relaxed mb-4">
                Kişisel verileriniz, KVKK'nın 5. ve 6. maddelerinde belirtilen kişisel veri işleme şartları dahilinde 
                aşağıdaki amaçlarla işlenmektedir:
              </p>

              <ul class="space-y-2 not-prose">
                <li class="flex items-start gap-3">
                  <Icon name="ion:checkmark-circle" class="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span class="text-gray-700">Sipariş süreçlerinin yönetimi ve yerine getirilmesi</span>
                </li>
                <li class="flex items-start gap-3">
                  <Icon name="ion:checkmark-circle" class="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span class="text-gray-700">Ödeme işlemlerinin gerçekleştirilmesi ve fatura düzenlenmesi</span>
                </li>
                <li class="flex items-start gap-3">
                  <Icon name="ion:checkmark-circle" class="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span class="text-gray-700">Kargo ve teslimat hizmetlerinin sağlanması</span>
                </li>
                <li class="flex items-start gap-3">
                  <Icon name="ion:checkmark-circle" class="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span class="text-gray-700">Müşteri hizmetleri ve destek taleplerinin karşılanması</span>
                </li>
                <li class="flex items-start gap-3">
                  <Icon name="ion:checkmark-circle" class="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span class="text-gray-700">Güvenlik ve dolandırıcılık önleme</span>
                </li>
                <li class="flex items-start gap-3">
                  <Icon name="ion:checkmark-circle" class="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span class="text-gray-700">Yasal yükümlülüklerin yerine getirilmesi (vergi, muhasebe vb.)</span>
                </li>
                <li class="flex items-start gap-3">
                  <Icon name="ion:checkmark-circle" class="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span class="text-gray-700">Pazarlama ve tanıtım faaliyetleri (açık rızanız dahilinde)</span>
                </li>
                <li class="flex items-start gap-3">
                  <Icon name="ion:checkmark-circle" class="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span class="text-gray-700">Site ve hizmet kalitesinin iyileştirilmesi</span>
                </li>
                <li class="flex items-start gap-3">
                  <Icon name="ion:checkmark-circle" class="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span class="text-gray-700">İstatistiksel analiz ve raporlama</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <hr class="my-8 border-gray-200" />

        <!-- Veri Paylaşımı -->
        <section class="mb-12">
          <div class="flex items-start gap-4 mb-6">
            <div class="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="ion:share-social-outline" class="w-6 h-6 text-primary" />
            </div>
            <div class="flex-1">
              <h2 class="text-2xl font-bold text-gray-900 mb-3 mt-0">4. Kişisel Verilerin Aktarımı</h2>
              <p class="text-gray-700 leading-relaxed mb-4">
                Kişisel verileriniz, yukarıda belirtilen amaçların gerçekleştirilebilmesi için gerekli olduğu ölçüde 
                ve KVKK'nın öngördüğü şartlar çerçevesinde aşağıdaki taraflarla paylaşılabilir:
              </p>

              <div class="space-y-3 not-prose">
                <div class="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <h3 class="font-bold text-amber-900 mb-2">Kargo Firmaları</h3>
                  <p class="text-sm text-amber-800">Teslimat için ad, soyad, telefon, adres bilgileri</p>
                </div>

                <div class="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <h3 class="font-bold text-amber-900 mb-2">Ödeme Kuruluşları</h3>
                  <p class="text-sm text-amber-800">Ödeme işlemleri için gerekli finansal bilgiler (kart bilgileri PCI-DSS standartlarında şifrelenir)</p>
                </div>

                <div class="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <h3 class="font-bold text-amber-900 mb-2">Hukuki Merciler</h3>
                  <p class="text-sm text-amber-800">Yasal yükümlülükler çerçevesinde yetkili kamu kurum ve kuruluşları</p>
                </div>

                <div class="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <h3 class="font-bold text-amber-900 mb-2">Hizmet Sağlayıcılar</h3>
                  <p class="text-sm text-amber-800">Sunucu, bulut hizmeti, analitik araçlar gibi teknik hizmet sağlayıcılar (gizlilik sözleşmeleriyle korunur)</p>
                </div>
              </div>

              <div class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg not-prose">
                <p class="text-sm text-red-900">
                  <Icon name="ion:shield-outline" class="inline w-5 h-5 mr-1" />
                  <strong>Önemli:</strong> Kişisel verileriniz, pazarlama veya ticari amaçlarla üçüncü taraflara satılmaz, 
                  kiralanmaz veya herhangi bir şekilde ticari amaçla paylaşılmaz.
                </p>
              </div>
            </div>
          </div>
        </section>

        <hr class="my-8 border-gray-200" />

        <!-- KVKK Hakları -->
        <section class="mb-12">
          <div class="flex items-start gap-4 mb-6">
            <div class="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="ion:hand-right-outline" class="w-6 h-6 text-primary" />
            </div>
            <div class="flex-1">
              <h2 class="text-2xl font-bold text-gray-900 mb-3 mt-0">5. KVKK Kapsamındaki Haklarınız</h2>
              <p class="text-gray-700 leading-relaxed mb-4">
                KVKK'nın 11. maddesi uyarınca, kişisel verilerinizle ilgili olarak aşağıdaki haklara sahipsiniz:
              </p>

              <div class="space-y-3 not-prose">
                <div class="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                  <Icon name="ion:eye-outline" class="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p class="font-bold text-green-900">Bilgi Talep Etme</p>
                    <p class="text-sm text-green-800">Kişisel verilerinizin işlenip işlenmediğini öğrenme ve işlenmişse buna ilişkin bilgi talep etme</p>
                  </div>
                </div>

                <div class="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                  <Icon name="ion:information-circle-outline" class="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p class="font-bold text-green-900">İşlenme Amacını Öğrenme</p>
                    <p class="text-sm text-green-800">Kişisel verilerinizin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme</p>
                  </div>
                </div>

                <div class="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                  <Icon name="ion:globe-outline" class="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p class="font-bold text-green-900">Aktarım Bilgisi</p>
                    <p class="text-sm text-green-800">Kişisel verilerin yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri öğrenme</p>
                  </div>
                </div>

                <div class="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                  <Icon name="ion:create-outline" class="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p class="font-bold text-green-900">Düzeltme Talebi</p>
                    <p class="text-sm text-green-800">Kişisel verilerin eksik veya yanlış işlenmiş olması halinde bunların düzeltilmesini isteme</p>
                  </div>
                </div>

                <div class="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                  <Icon name="ion:trash-outline" class="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p class="font-bold text-green-900">Silme ve Yok Etme</p>
                    <p class="text-sm text-green-800">KVKK'da öngörülen şartlar çerçevesinde kişisel verilerinin silinmesini veya yok edilmesini isteme</p>
                  </div>
                </div>

                <div class="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                  <Icon name="ion:megaphone-outline" class="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p class="font-bold text-green-900">Bildirim Talebi</p>
                    <p class="text-sm text-green-800">Düzeltme, silme veya yok etme işlemlerinin, kişisel verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme</p>
                  </div>
                </div>

                <div class="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                  <Icon name="ion:alert-circle-outline" class="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p class="font-bold text-green-900">İtiraz Etme</p>
                    <p class="text-sm text-green-800">İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle kişinin aleyhine bir sonucun ortaya çıkmasına itiraz etme</p>
                  </div>
                </div>

                <div class="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                  <Icon name="ion:scale-outline" class="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p class="font-bold text-green-900">Zarar Talebi</p>
                    <p class="text-sm text-green-800">Kişisel verilerinizin kanuna aykırı olarak işlenmesi sebebiyle zarara uğramanız halinde zararın giderilmesini talep etme</p>
                  </div>
                </div>
              </div>

              <div class="mt-6 p-5 bg-blue-50 border-2 border-blue-300 rounded-lg not-prose">
                <p class="font-bold text-blue-900 mb-2 text-lg">Haklarınızı Nasıl Kullanabilirsiniz?</p>
                <p class="text-sm text-blue-800 mb-3">
                  KVKK kapsamındaki taleplerinizi, yazılı olarak veya Kişisel Verileri Koruma Kurulu'nun belirlediği diğer yöntemlerle 
                  bize iletebilirsiniz:
                </p>
                <ul class="text-sm text-blue-800 space-y-1 ml-4">
                  <li>• E-posta: <strong>{{ contactEmail }}</strong></li>
                  <li>• İletişim formu üzerinden</li>
                  <li>• Kayıtlı elektronik posta (KEP) adresi ile</li>
                  <li>• Güvenli elektronik imza ile</li>
                </ul>
                <p class="text-sm text-blue-800 mt-3">
                  Başvurularınız en geç <strong>30 gün</strong> içinde ücretsiz olarak sonuçlandırılır. 
                  İşlemin ayrıca bir maliyeti gerektirmesi halinde, Kişisel Verileri Koruma Kurulu tarafından belirlenen tarifedeki ücret alınabilir.
                </p>
              </div>
            </div>
          </div>
        </section>

        <hr class="my-8 border-gray-200" />

        <!-- Çerezler -->
        <section class="mb-12">
          <div class="flex items-start gap-4 mb-6">
            <div class="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="ion:filing-outline" class="w-6 h-6 text-primary" />
            </div>
            <div class="flex-1">
              <h2 class="text-2xl font-bold text-gray-900 mb-3 mt-0">6. Çerez (Cookie) Politikası</h2>
              <p class="text-gray-700 leading-relaxed mb-4">
                Web sitemiz, kullanıcı deneyimini iyileştirmek ve site performansını analiz etmek amacıyla çerezler kullanmaktadır.
              </p>

              <h3 class="text-xl font-bold text-gray-900 mb-3">Çerez Türleri:</h3>

              <div class="space-y-3 not-prose">
                <div class="p-4 bg-gray-50 rounded-lg">
                  <h4 class="font-bold text-gray-900 mb-1">Zorunlu Çerezler</h4>
                  <p class="text-sm text-gray-700">
                    Sitenin çalışması için gerekli temel çerezler. Oturum yönetimi, güvenlik, alışveriş sepeti gibi temel fonksiyonları sağlar.
                  </p>
                </div>

                <div class="p-4 bg-gray-50 rounded-lg">
                  <h4 class="font-bold text-gray-900 mb-1">Performans Çerezleri</h4>
                  <p class="text-sm text-gray-700">
                    Site performansını ölçmek ve iyileştirmek için kullanılır. Ziyaretçi sayısı, sayfa görüntülemeleri gibi anonim istatistikler toplar.
                  </p>
                </div>

                <div class="p-4 bg-gray-50 rounded-lg">
                  <h4 class="font-bold text-gray-900 mb-1">Fonksiyonel Çerezler</h4>
                  <p class="text-sm text-gray-700">
                    Tercihlerinizi hatırlamak için kullanılır (dil seçimi, bölge tercihleri vb.).
                  </p>
                </div>

                <div class="p-4 bg-gray-50 rounded-lg">
                  <h4 class="font-bold text-gray-900 mb-1">Hedefleme/Reklam Çerezleri</h4>
                  <p class="text-sm text-gray-700">
                    İlgi alanlarınıza uygun içerik sunmak için kullanılır. Bu çerezler sadece açık rızanızla aktif edilir.
                  </p>
                </div>
              </div>

              <div class="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg not-prose">
                <p class="text-sm text-purple-900">
                  <Icon name="ion:settings-outline" class="inline w-5 h-5 mr-1" />
                  Tarayıcınızın ayarlarından çerezleri yönetebilir, silebilir veya engelleyebilirsiniz. 
                  Ancak bazı çerezlerin engellenmesi site fonksiyonlarını etkileyebilir.
                </p>
              </div>
            </div>
          </div>
        </section>

        <hr class="my-8 border-gray-200" />

        <!-- Veri Güvenliği -->
        <section class="mb-12">
          <div class="flex items-start gap-4 mb-6">
            <div class="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="ion:lock-closed-outline" class="w-6 h-6 text-primary" />
            </div>
            <div class="flex-1">
              <h2 class="text-2xl font-bold text-gray-900 mb-3 mt-0">7. Veri Güvenliği</h2>
              <p class="text-gray-700 leading-relaxed mb-4">
                Kişisel verilerinizin güvenliğini sağlamak için teknik ve idari tedbirler almaktayız:
              </p>

              <ul class="space-y-2 not-prose">
                <li class="flex items-start gap-3">
                  <Icon name="ion:shield-checkmark" class="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span class="text-gray-700">SSL/TLS şifreleme ile güvenli veri iletimi</span>
                </li>
                <li class="flex items-start gap-3">
                  <Icon name="ion:shield-checkmark" class="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span class="text-gray-700">Güvenlik duvarı ve saldırı tespit sistemleri</span>
                </li>
                <li class="flex items-start gap-3">
                  <Icon name="ion:shield-checkmark" class="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span class="text-gray-700">Düzenli güvenlik denetimleri ve güncellemeleri</span>
                </li>
                <li class="flex items-start gap-3">
                  <Icon name="ion:shield-checkmark" class="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span class="text-gray-700">Yetkilendirme ve erişim kontrol sistemleri</span>
                </li>
                <li class="flex items-start gap-3">
                  <Icon name="ion:shield-checkmark" class="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span class="text-gray-700">Personel gizlilik sözleşmeleri ve eğitimleri</span>
                </li>
                <li class="flex items-start gap-3">
                  <Icon name="ion:shield-checkmark" class="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span class="text-gray-700">Veri yedekleme ve kurtarma sistemleri</span>
                </li>
              </ul>

              <div class="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg not-prose">
                <p class="text-sm text-green-900">
                  <Icon name="ion:card-outline" class="inline w-5 h-5 mr-1" />
                  <strong>Ödeme Güvenliği:</strong> Kredi kartı bilgileriniz PCI-DSS standartlarına uygun olarak şifrelenir 
                  ve güvenli ödeme altyapısı sağlayıcıları tarafından işlenir. Kart bilgileriniz sunucularımızda saklanmaz.
                </p>
              </div>
            </div>
          </div>
        </section>

        <hr class="my-8 border-gray-200" />

        <!-- Saklama Süresi -->
        <section class="mb-12">
          <div class="flex items-start gap-4 mb-6">
            <div class="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="ion:time-outline" class="w-6 h-6 text-primary" />
            </div>
            <div class="flex-1">
              <h2 class="text-2xl font-bold text-gray-900 mb-3 mt-0">8. Verilerin Saklanma Süresi</h2>
              <p class="text-gray-700 leading-relaxed mb-4">
                Kişisel verileriniz, işlenme amacının gerektirdiği süre boyunca ve/veya ilgili mevzuatta öngörülen süreler boyunca saklanır:
              </p>

              <div class="space-y-3 not-prose">
                <div class="p-4 bg-gray-50 rounded-lg">
                  <h4 class="font-bold text-gray-900 mb-1">Fatura ve Muhasebe Kayıtları</h4>
                  <p class="text-sm text-gray-700">Vergi mevzuatı gereği <strong>10 yıl</strong></p>
                </div>

                <div class="p-4 bg-gray-50 rounded-lg">
                  <h4 class="font-bold text-gray-900 mb-1">Sipariş ve Sözleşme Bilgileri</h4>
                  <p class="text-sm text-gray-700">Borçlar Kanunu gereği <strong>10 yıl</strong></p>
                </div>

                <div class="p-4 bg-gray-50 rounded-lg">
                  <h4 class="font-bold text-gray-900 mb-1">İletişim Kayıtları</h4>
                  <p class="text-sm text-gray-700">İlgili amaç sona erene kadar veya talep üzerine silinir</p>
                </div>

                <div class="p-4 bg-gray-50 rounded-lg">
                  <h4 class="font-bold text-gray-900 mb-1">Pazarlama İzinleri</h4>
                  <p class="text-sm text-gray-700">Rızanızı geri çekene kadar veya hesap kapatana kadar</p>
                </div>

                <div class="p-4 bg-gray-50 rounded-lg">
                  <h4 class="font-bold text-gray-900 mb-1">Çerez Verileri</h4>
                  <p class="text-sm text-gray-700">Çerez tipine göre <strong>oturum süresi - 2 yıl</strong> arası</p>
                </div>
              </div>

              <p class="text-gray-700 text-sm mt-4">
                Yasal saklama süresi sona erdikten sonra verileriniz güvenli şekilde silinir, yok edilir veya anonimleştirilir.
              </p>
            </div>
          </div>
        </section>

        <hr class="my-8 border-gray-200" />

        <!-- Çocukların Gizliliği -->
        <section class="mb-12">
          <div class="flex items-start gap-4 mb-6">
            <div class="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="ion:people-outline" class="w-6 h-6 text-primary" />
            </div>
            <div class="flex-1">
              <h2 class="text-2xl font-bold text-gray-900 mb-3 mt-0">9. Çocukların Gizliliği</h2>
              <p class="text-gray-700 leading-relaxed">
                Hizmetlerimiz 18 yaş altı bireyler için tasarlanmamıştır. Bilerek 18 yaş altı çocuklardan kişisel veri toplamıyoruz. 
                Eğer bir ebeveyn veya vasi olarak çocuğunuzun bize kişisel veri sağladığını fark ederseniz, 
                lütfen bizimle iletişime geçin. Kanuni temsilci izni olmadan 18 yaş altı kişilerden topladığımız verileri tespit edersek, 
                bu verileri sunucularımızdan sileriz.
              </p>
            </div>
          </div>
        </section>

        <hr class="my-8 border-gray-200" />

        <!-- Değişiklikler -->
        <section class="mb-12">
          <div class="flex items-start gap-4 mb-6">
            <div class="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="ion:refresh-outline" class="w-6 h-6 text-primary" />
            </div>
            <div class="flex-1">
              <h2 class="text-2xl font-bold text-gray-900 mb-3 mt-0">10. Politika Değişiklikleri</h2>
              <p class="text-gray-700 leading-relaxed">
                Bu Gizlilik Politikası zaman zaman güncellenebilir. Önemli değişiklikler olması durumunda, 
                web sitemizde duyuru yaparak ve/veya e-posta ile bilgilendirme göndererek sizi haberdar edeceğiz. 
                Güncel politikayı düzenli olarak gözden geçirmenizi öneririz.
              </p>
              <p class="text-sm text-gray-600 mt-3">
                <strong>Son güncelleme tarihi:</strong> {{ lastUpdated }}
              </p>
            </div>
          </div>
        </section>

        <hr class="my-8 border-gray-200" />

        <!-- İletişim -->
        <section>
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="ion:mail-outline" class="w-6 h-6 text-primary" />
            </div>
            <div class="flex-1">
              <h2 class="text-2xl font-bold text-gray-900 mb-3 mt-0">11. İletişim</h2>
              <p class="text-gray-700 leading-relaxed mb-4">
                Gizlilik politikamız veya kişisel verilerinizle ilgili sorularınız için bizimle iletişime geçebilirsiniz:
              </p>

              <div class="not-prose p-5 bg-primary/5 border-2 border-primary/20 rounded-lg">
                <p class="font-bold text-gray-900 mb-3">{{ siteName }}</p>
                <p class="text-sm text-gray-700 mb-2">
                  <Icon name="ion:mail" class="inline w-4 h-4 mr-2 text-primary" />
                  E-posta: <strong>{{ contactEmail }}</strong>
                </p>
                <p class="text-sm text-gray-700 mb-3">
                  <Icon name="ion:globe" class="inline w-4 h-4 mr-2 text-primary" />
                  Web: <strong>{{ frontEndUrl }}</strong>
                </p>
                <NuxtLink
                  to="/iletisim"
                  class="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-semibold">
                  <Icon name="ion:send" class="w-4 h-4 mr-2" />
                  İletişim Formu
                </NuxtLink>
              </div>
            </div>
          </div>
        </section>

      </div>

      <!-- Info Boxes -->
      <div class="grid md:grid-cols-2 gap-6 mt-8">
        <div class="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 class="font-bold text-blue-900 text-lg mb-3 flex items-center gap-2">
            <Icon name="ion:information-circle" class="w-6 h-6" />
            KVKK Hakkında
          </h3>
          <p class="text-sm text-blue-800 mb-4">
            6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK), kişisel verilerin işlenmesinde başta özel hayatın gizliliği 
            olmak üzere kişilerin temel hak ve özgürlüklerini korumayı ve kişisel verileri işleyen gerçek ve tüzel kişilerin 
            yükümlülükleri ile uyacakları usul ve esasları düzenler.
          </p>
          <a 
            href="https://kvkk.gov.tr" 
            target="_blank" 
            rel="noopener noreferrer"
            class="text-sm text-blue-600 hover:underline font-semibold">
            KVKK Resmi Sitesi →
          </a>
        </div>

        <div class="bg-green-50 border border-green-200 rounded-xl p-6">
          <h3 class="font-bold text-green-900 text-lg mb-3 flex items-center gap-2">
            <Icon name="ion:shield-checkmark" class="w-6 h-6" />
            GDPR Uyumluluğu
          </h3>
          <p class="text-sm text-green-800 mb-4">
            Avrupa Birliği Genel Veri Koruma Tüzüğü (GDPR), AB vatandaşlarının kişisel verilerinin korunmasını sağlar. 
            AB'den hizmet alan şirketler GDPR'ye uymak zorundadır. Gizlilik politikamız GDPR standartlarına uygundur.
          </p>
          <a 
            href="https://gdpr.eu" 
            target="_blank" 
            rel="noopener noreferrer"
            class="text-sm text-green-600 hover:underline font-semibold">
            GDPR Hakkında →
          </a>
        </div>
      </div>

    </div>
  </main>
</template>
