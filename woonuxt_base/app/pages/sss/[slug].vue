<script lang="ts" setup>
const route = useRoute()
const slug = route.params.slug as string

// FAQ kategorilerine göre içerik - burada statik içerik ekleyebilirsiniz
const faqContent: Record<string, any> = {
  'siparis-ve-odeme': {
    title: 'Sipariş ve Ödeme',
    description: 'Sipariş verme, ödeme yöntemleri ve fatura ile ilgili sorular',
    questions: [
      {
        question: 'Nasıl sipariş verebilirim?',
        answer: 'Sitemizden ürün seçerek sepete ekleyebilir, sepet sayfasından ödeme adımlarını tamamlayarak siparişinizi oluşturabilirsiniz. Alternatif olarak WhatsApp üzerinden de sipariş verebilirsiniz.',
      },
      {
        question: 'Hangi ödeme yöntemlerini kullanabilirim?',
        answer: 'Kredi kartı (Visa, Mastercard), banka havalesi ve kapıda ödeme seçeneklerini kullanabilirsiniz. Tüm ödemeleriniz güvenli altyapımız ile koruma altındadır.',
      },
      {
        question: 'Fatura alabilir miyim?',
        answer: 'Evet, tüm siparişleriniz için e-fatura düzenlenmektedir. Faturanız sipariş tamamlandıktan sonra e-posta adresinize gönderilir.',
      },
      {
        question: 'Siparişimi iptal edebilir miyim?',
        answer: 'Henüz kargoya verilmemiş siparişlerinizi iptal edebilirsiniz. Bunun için müşteri hizmetlerimiz ile iletişime geçmeniz yeterlidir.',
      },
    ],
  },
  'kargo-ve-teslimat': {
    title: 'Kargo ve Teslimat',
    description: 'Kargo süreçleri, teslimat süreleri ve takip bilgileri',
    questions: [
      {
        question: 'Kargo ücreti ne kadardır?',
        answer: 'Tüm siparişlerinizde kargo ücretsizdir. Türkiye\'nin her yerine ücretsiz kargo hizmeti sunuyoruz.',
      },
      {
        question: 'Siparişim ne zaman kargoya verilir?',
        answer: 'Siparişiniz onaylandıktan sonra 1-2 iş günü içinde kargoya teslim edilir. Stokta olmayan ürünler için tedarik süresi değişkenlik gösterebilir.',
      },
      {
        question: 'Kargo takip numaramı nasıl öğrenebilirim?',
        answer: 'Siparişiniz kargoya verildikten sonra takip numarası e-posta ve SMS ile tarafınıza iletilir. Ayrıca hesabım sayfasından siparişlerim bölümünden de takip edebilirsiniz.',
      },
      {
        question: 'Teslimat süresi ne kadardır?',
        answer: 'Kargoya verildikten sonra 2-5 iş günü içinde adresinize teslim edilir. Bölgelere göre süre değişkenlik gösterebilir.',
      },
    ],
  },
  'iade-ve-degisim': {
    title: 'İade ve Değişim',
    description: 'İade koşulları, değişim işlemleri ve garanti bilgileri',
    questions: [
      {
        question: 'Ürünü iade edebilir miyim?',
        answer: 'Ürünü teslim aldıktan sonra 14 gün içinde kullanılmamış ve orijinal ambalajında olmak kaydıyla iade edebilirsiniz.',
      },
      {
        question: 'İade işlemi nasıl yapılır?',
        answer: 'İade talebinizi müşteri hizmetlerimize bildirmeniz yeterlidir. Size bir iade kodu ve kargo adresi iletilecektir. Ürünü kargoya verdikten sonra iade işleminiz başlatılır.',
      },
      {
        question: 'İade bedelim ne zaman ödenir?',
        answer: 'Ürün tarafımıza ulaştıktan ve kontrol edildikten sonra 5-7 iş günü içinde ödeme yönteminize iade edilir.',
      },
      {
        question: 'Ürün değişimi yapabilir miyim?',
        answer: 'Evet, aynı kategorideki başka bir ürün ile değişim yapabilirsiniz. Fiyat farkı varsa ödeme veya iade işlemi gerçekleştirilir.',
      },
      {
        question: 'Garanti süresi ne kadardır?',
        answer: 'Ürünlerimizin çoğu 2 yıl garanti kapsamındadır. Garanti şartları ve süreleri ürün sayfalarında detaylı olarak belirtilmiştir.',
      },
    ],
  },
  'urunler-ve-ozellikler': {
    title: 'Ürünler ve Özellikler',
    description: 'Ürün özellikleri, kullanım ve bakım bilgileri',
    questions: [
      {
        question: 'Ürünler orijinal midir?',
        answer: 'Evet, sitemizde satışa sunulan tüm ürünler yetkili distribütörlerden temin edilmiş orijinal ürünlerdir.',
      },
      {
        question: 'Teknik destek alabilir miyim?',
        answer: 'Elbette. Ürünlerinizle ilgili teknik destek için müşteri hizmetlerimizle iletişime geçebilirsiniz. Deneyimli ekibimiz size yardımcı olacaktır.',
      },
      {
        question: 'Ürün kullanım kılavuzu var mı?',
        answer: 'Tüm ürünlerimiz Türkçe kullanım kılavuzu ile birlikte gönderilir. Ayrıca ürün sayfalarında dijital kılavuzlara da ulaşabilirsiniz.',
      },
      {
        question: 'Yedek parça bulabilir miyim?',
        answer: 'Evet, sattığımız markaların yedek parçalarını temin edebiliyoruz. İhtiyacınız olan yedek parça için bizimle iletişime geçebilirsiniz.',
      },
    ],
  },
  'servis-ve-bakim': {
    title: 'Servis ve Bakım',
    description: 'Servis hizmetleri, bakım ve onarım bilgileri',
    questions: [
      {
        question: 'Servis hizmeti veriyor musunuz?',
        answer: 'Evet, Göcek bölgesinde servis, bakım ve onarım hizmetleri sunuyoruz. Diğer bölgeler için yetkili servislere yönlendirme yapabiliriz.',
      },
      {
        question: 'Periyodik bakım ne zaman yapılmalıdır?',
        answer: 'Motor ve deniz araçlarınız için yıllık bakım önerilir. Yoğun kullanımda daha sık bakım gerekebilir. Detaylı bilgi için servisimizle iletişime geçebilirsiniz.',
      },
      {
        question: 'Garantili ürünlerin servisi nasıl yapılır?',
        answer: 'Garanti kapsamındaki ürünler için servis işlemlerinizi ücretsiz gerçekleştiriyoruz. Garanti belgesi ve fatura ile servisimize başvurabilirsiniz.',
      },
      {
        question: 'Acil servis hizmeti var mı?',
        answer: 'Göcek ve çevresinde acil servis desteği sağlıyoruz. Acil durumlar için WhatsApp hattımızdan bize ulaşabilirsiniz.',
      },
    ],
  },
  'hesap-ve-uyelik': {
    title: 'Hesap ve Üyelik',
    description: 'Üyelik işlemleri, hesap yönetimi ve güvenlik',
    questions: [
      {
        question: 'Üyelik zorunlu mu?',
        answer: 'Hayır, misafir kullanıcı olarak da alışveriş yapabilirsiniz. Ancak üyelik ile sipariş takibi ve hızlı alışveriş gibi avantajlardan yararlanabilirsiniz.',
      },
      {
        question: 'Şifremi unuttum, ne yapmalıyım?',
        answer: 'Giriş sayfasındaki "Şifremi Unuttum" linkine tıklayarak e-posta adresinize şifre sıfırlama linki gönderebilirsiniz.',
      },
      {
        question: 'Hesap bilgilerimi nasıl güncellerim?',
        answer: 'Hesabım sayfasından kişisel bilgilerinizi, adres bilgilerinizi güncelleyebilir ve şifrenizi değiştirebilirsiniz.',
      },
      {
        question: 'Hesabımı silebilir miyim?',
        answer: 'Evet, hesabınızı silmek isterseniz müşteri hizmetlerimizle iletişime geçmeniz yeterlidir. KVKK kapsamında verileriniz silinecektir.',
      },
    ],
  },
}

const currentFaq = computed(() => faqContent[slug])

// Eğer kategori bulunamazsa 404
if (!currentFaq.value) {
  throw createError({ statusCode: 404, message: 'Sayfa bulunamadı' })
}

useSeoMeta({
  title: currentFaq.value.title,
  description: currentFaq.value.description,
})

const openQuestions = ref<Set<number>>(new Set())

const toggleQuestion = (index: number) => {
// Structured Data: FAQPage + BreadcrumbList
const { frontEndUrl } = useHelpers()
const breadcrumbJsonLd = computed(() =>
  JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: frontEndUrl },
        { '@type': 'ListItem', position: 2, name: 'SSS', item: `${frontEndUrl}/sss` },
        { '@type': 'ListItem', position: 3, name: currentFaq.value.title, item: `${frontEndUrl}${route.path}` },
      ],
    },
    null,
    2,
  ),
)

const faqJsonLd = computed(() =>
  JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: currentFaq.value.questions.map((q: { question: string; answer: string }) => ({
        '@type': 'Question',
        name: q.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: q.answer,
        },
      })),
    },
    null,
    2,
  ),
)

useHead(() => ({
  script: [
    { type: 'application/ld+json', innerHTML: breadcrumbJsonLd.value },
    { type: 'application/ld+json', innerHTML: faqJsonLd.value },
  ],
}));
  if (openQuestions.value.has(index)) {
    openQuestions.value.delete(index)
  } else {
    openQuestions.value.add(index)
  }
}
</script>

<template>
  <main class="container py-16">
    <div class="max-w-4xl mx-auto">
      <!-- Breadcrumb -->
      <nav class="flex items-center text-sm text-gray-600 mb-8">
        <NuxtLink to="/" class="hover:text-primary">Ana Sayfa</NuxtLink>
        <Icon name="ion:chevron-forward" class="w-4 h-4 mx-2" />
        <NuxtLink to="/sss" class="hover:text-primary">SSS</NuxtLink>
        <Icon name="ion:chevron-forward" class="w-4 h-4 mx-2" />
        <span class="text-gray-900">{{ currentFaq.title }}</span>
      </nav>

      <!-- Header -->
      <div class="mb-12">
        <h1 class="text-4xl font-bold mb-4">{{ currentFaq.title }}</h1>
        <p class="text-gray-600 text-lg">{{ currentFaq.description }}</p>
      </div>

      <!-- Questions -->
      <div class="space-y-4">
        <div
          v-for="(item, index) in currentFaq.questions"
          :key="index"
          class="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <button
            @click="toggleQuestion(index)"
            class="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors">
            <h2 class="text-lg font-semibold pr-4">{{ item.question }}</h2>
            <Icon
              name="ion:chevron-down"
              class="w-6 h-6 text-gray-400 flex-shrink-0 transition-transform"
              :class="{ 'rotate-180': openQuestions.has(index) }" />
          </button>
          <div
            v-show="openQuestions.has(index)"
            class="px-6 pb-6">
            <p class="text-gray-700 leading-relaxed">{{ item.answer }}</p>
          </div>
        </div>
      </div>

      <!-- Back to Categories -->
      <div class="mt-12 text-center">
        <NuxtLink
          to="/sss"
          class="inline-flex items-center text-primary hover:underline">
          <Icon name="ion:arrow-back" class="w-5 h-5 mr-2" />
          Tüm SSS Kategorileri
        </NuxtLink>
      </div>

      <!-- Contact Section -->
      <div class="mt-16 bg-gray-50 p-8 rounded-lg text-center">
        <h2 class="text-2xl font-semibold mb-4">Başka bir sorunuz mu var?</h2>
        <p class="text-gray-600 mb-6">Size yardımcı olmaktan mutluluk duyarız</p>
        <NuxtLink
          to="/iletisim"
          class="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
          <Icon name="ion:mail-outline" class="w-5 h-5 mr-2" />
          Bize Ulaşın
        </NuxtLink>
      </div>
    </div>
  </main>
</template>
