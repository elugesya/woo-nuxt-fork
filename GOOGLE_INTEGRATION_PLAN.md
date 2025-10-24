# Google Entegrasyon ve SEO Optimizasyon Planı

## 📋 Genel Bakış

Bu döküman, WooNuxt e-ticaret sitesinin Google ekosistemi ile tam entegrasyonu ve arama motorlarında üst sıralarda yer alması için yapılacak çalışmaları detaylandırmaktadır.

---

## 🎯 Hedefler

1. **Google Analytics 4 (GA4)** - Kullanıcı davranışları ve e-ticaret izleme
2. **Google Tag Manager (GTM)** - Tüm tracking kodlarının merkezi yönetimi
3. **Google Search Console** - Arama performansı izleme ve indexleme
4. **Google Merchant Center** - Ürün feed'i ve alışveriş reklamları
5. **SEO Teknik Optimizasyonlar** - Core Web Vitals, Schema.org, meta tags
6. **Bing Webmaster Tools** - Microsoft arama motoru entegrasyonu

---

## 1️⃣ Google Analytics 4 (GA4) Entegrasyonu

### Amaç
- Kullanıcı davranışlarını izlemek
- E-ticaret conversion'larını ölçmek
- Satış hunisini analiz etmek
- Ürün performansını takip etmek

### Yapılacaklar

#### 1.1 GA4 Hesap Kurulumu
- [ ] Google Analytics hesabı oluştur (https://analytics.google.com)
- [ ] GA4 property oluştur
- [ ] Data stream ayarla (Web)
- [ ] Measurement ID al (G-XXXXXXXXXX)

#### 1.2 Nuxt Modülü Kurulumu
```bash
pnpm add -D @nuxtjs/google-analytics
# veya
pnpm add -D nuxt-gtag
```

#### 1.3 Nuxt Config Ayarları
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['nuxt-gtag'],
  gtag: {
    id: process.env.NUXT_PUBLIC_GOOGLE_ANALYTICS_ID
  }
})
```

#### 1.4 E-commerce Events Implementasyonu

**Takip Edilecek Eventler:**

| Event | Tetiklenme Yeri | Parametreler |
|-------|----------------|--------------|
| `view_item_list` | Ürün listesi sayfası | items[], item_list_name |
| `view_item` | Ürün detay sayfası | items[], value, currency |
| `add_to_cart` | Sepete ekle butonu | items[], value, currency |
| `remove_from_cart` | Sepetten çıkar | items[], value, currency |
| `begin_checkout` | Checkout sayfası | items[], value, currency |
| `add_payment_info` | Ödeme bilgisi girişi | items[], payment_type |
| `purchase` | Sipariş tamamlama | transaction_id, value, tax, shipping, items[] |
| `search` | Ürün arama | search_term |

#### 1.5 Örnek Event Gönderimi
```typescript
// composables/useGoogleAnalytics.ts
export const useGoogleAnalytics = () => {
  const trackAddToCart = (product: any, quantity: number) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'add_to_cart', {
        currency: 'TRY',
        value: product.price * quantity,
        items: [{
          item_id: product.sku,
          item_name: product.name,
          price: product.price,
          quantity: quantity
        }]
      })
    }
  }

  const trackPurchase = (order: any) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'purchase', {
        transaction_id: order.id,
        value: order.total,
        tax: order.tax,
        shipping: order.shipping,
        currency: 'TRY',
        items: order.items.map((item: any) => ({
          item_id: item.sku,
          item_name: item.name,
          price: item.price,
          quantity: item.quantity
        }))
      })
    }
  }

  return {
    trackAddToCart,
    trackPurchase
  }
}
```

---

## 2️⃣ Google Tag Manager (GTM) Entegrasyonu

### Amaç
- Tüm tracking kodlarını merkezi yönetmek
- GA4, Facebook Pixel, vb. kodları tek noktadan yönetmek
- A/B testleri için esneklik sağlamak

### Yapılacaklar

#### 2.1 GTM Hesap Kurulumu
- [ ] Google Tag Manager hesabı oluştur (https://tagmanager.google.com)
- [ ] Container oluştur (Web)
- [ ] Container ID al (GTM-XXXXXXX)

#### 2.2 Nuxt Implementasyonu
```bash
pnpm add -D @gtm-support/vue-gtm
```

```typescript
// plugins/gtm.client.ts
import { createGtm } from '@gtm-support/vue-gtm'

export default defineNuxtPlugin((nuxtApp) => {
  const gtmId = useRuntimeConfig().public.GTM_ID
  
  if (gtmId) {
    nuxtApp.vueApp.use(createGtm({
      id: gtmId,
      defer: false,
      compatibility: false,
      enabled: true,
      debug: false,
      loadScript: true,
      vueRouter: useRouter(),
    }))
  }
})
```

#### 2.3 Data Layer Push
```typescript
// composables/useDataLayer.ts
export const useDataLayer = () => {
  const push = (data: any) => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push(data)
    }
  }

  return { push }
}
```

#### 2.4 GTM Container'da Yapılacak Ayarlar
- [ ] GA4 Configuration Tag ekle
- [ ] Enhanced E-commerce için Variables tanımla
- [ ] Triggers oluştur (page view, click, form submit)
- [ ] Facebook Pixel tag'i ekle (varsa)
- [ ] Conversion tracking tag'leri ekle

---

## 3️⃣ Google Search Console Entegrasyonu

### Amaç
- Site indexleme durumunu izlemek
- Arama performansını analiz etmek
- Teknik SEO sorunlarını tespit etmek
- Sitemap göndermek

### Yapılacaklar

#### 3.1 Search Console Kurulumu
- [ ] Google Search Console'a giriş yap (https://search.google.com/search-console)
- [ ] Property ekle (Domain veya URL prefix)
- [ ] Ownership doğrulama (HTML tag, DNS, Google Analytics)

#### 3.2 Ownership Doğrulama
```html
<!-- HTML Tag yöntemi -->
<meta name="google-site-verification" content="VERIFICATION_CODE" />
```

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  app: {
    head: {
      meta: [
        { 
          name: 'google-site-verification', 
          content: process.env.GOOGLE_SITE_VERIFICATION 
        }
      ]
    }
  }
})
```

#### 3.3 Sitemap Gönderimi
- [ ] Sitemap URL'ini Search Console'a ekle: `https://ntmc.com.tr/sitemap.xml`
- [ ] Sitemap düzenli güncellensin (her deploy'da)

#### 3.4 robots.txt Optimizasyonu
```typescript
// server/routes/robots.txt.ts
export default defineEventHandler(() => {
  const config = useRuntimeConfig()
  const siteUrl = config.public.FRONT_END_URL

  return `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${siteUrl}/sitemap.xml

# Block admin pages
Disallow: /hesabim/
Disallow: /odeme/
Disallow: /siparis-ozeti/

# Block search result pages with parameters
Disallow: /*?*
Allow: /*.js
Allow: /*.css
Allow: /*.jpg
Allow: /*.jpeg
Allow: /*.png
Allow: /*.gif
Allow: /*.svg
Allow: /*.webp

# Crawl-delay
Crawl-delay: 1
`
})
```

#### 3.5 İzlenecek Metrikler
- Toplam tıklama sayısı
- Ortalama pozisyon
- Click-through rate (CTR)
- İndexlenen sayfa sayısı
- Mobile usability hataları
- Core Web Vitals skorları

---

## 4️⃣ Google Merchant Center Entegrasyonu

### Amaç
- Google Shopping'de ürünleri göstermek
- Google Ads alışveriş kampanyaları çalıştırmak
- Ücretsiz ürün listelemeleri (Free listings)

### Yapılacaklar

#### 4.1 Merchant Center Hesap Kurulumu
- [ ] Merchant Center hesabı oluştur (https://merchants.google.com)
- [ ] İş bilgilerini ekle
- [ ] Web sitesini claim et ve doğrula
- [ ] Shipping ve tax ayarlarını yap

#### 4.2 Product Feed Oluşturma

**Feed Formatı: XML (Google Product Feed)**

```typescript
// server/routes/google-feed.xml.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const GQL_HOST = config.GQL_HOST
  const SITE_URL = config.public.FRONT_END_URL

  // GraphQL'den tüm ürünleri çek
  const products = await fetchAllProducts() // Bu fonksiyonu implement etmeniz gerekecek

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Neta Marine Ürünleri</title>
    <link>${SITE_URL}</link>
    <description>Tekne Motorları ve Denizcilik Ürünleri</description>
    ${products.map(product => `
    <item>
      <g:id>${product.sku}</g:id>
      <g:title>${escapeXml(product.name)}</g:title>
      <g:description>${escapeXml(product.shortDescription || product.description)}</g:description>
      <g:link>${SITE_URL}/urun/${product.slug}</g:link>
      <g:image_link>${product.image?.sourceUrl}</g:image_link>
      ${product.galleryImages?.nodes?.map((img: any) => `<g:additional_image_link>${img.sourceUrl}</g:additional_image_link>`).join('\n')}
      <g:condition>new</g:condition>
      <g:availability>${product.stockStatus === 'IN_STOCK' ? 'in_stock' : 'out_of_stock'}</g:availability>
      <g:price>${product.price} TRY</g:price>
      ${product.salePrice ? `<g:sale_price>${product.salePrice} TRY</g:sale_price>` : ''}
      <g:brand>${product.brand || 'Neta Marine'}</g:brand>
      <g:gtin>${product.gtin || ''}</g:gtin>
      <g:mpn>${product.sku}</g:mpn>
      <g:product_type>${product.productCategories?.nodes?.[0]?.name}</g:product_type>
      <g:google_product_category>${getGoogleCategory(product)}</g:google_product_category>
      <g:shipping>
        <g:country>TR</g:country>
        <g:service>Ücretsiz Kargo</g:service>
        <g:price>0 TRY</g:price>
      </g:shipping>
    </item>
    `).join('\n')}
  </channel>
</rss>`

  setHeader(event, 'Content-Type', 'application/xml')
  return xml
})
```

#### 4.3 Google Product Category Mapping
```typescript
// utils/googleCategories.ts
export const getGoogleCategory = (product: any): string => {
  const categoryMap: Record<string, string> = {
    'Dıştan Takma Motorlar': '899', // Vehicles & Parts > Vehicle Parts & Accessories
    'Şişme Botlar': '3214', // Sporting Goods > Water Sports > Boats
    'Elektrikli Motorlar': '899',
    'Sup Boardlar': '499811', // Sporting Goods > Water Sports > Stand-Up Paddleboards
    // Diğer kategoriler...
  }

  const categoryName = product.productCategories?.nodes?.[0]?.name
  return categoryMap[categoryName] || '899'
}
```

#### 4.4 Feed Güncellemesi
- [ ] Merchant Center'a feed URL'ini ekle: `https://ntmc.com.tr/google-feed.xml`
- [ ] Otomatik güncellenme ayarla (günlük)
- [ ] Feed'i test et ve hataları düzelt

#### 4.5 Zorunlu Alanlar Kontrolü
- ✅ id (SKU)
- ✅ title
- ✅ description
- ✅ link
- ✅ image_link
- ✅ price
- ✅ availability
- ✅ brand
- ✅ gtin veya mpn
- ✅ condition

---

## 5️⃣ SEO Teknik Optimizasyonlar

### 5.1 Meta Tags Optimizasyonu

#### Title Tag Yapısı
```
[Ürün/Kategori Adı] | [Marka] | Neta Marine
```

**Örnek:**
- Ana Sayfa: `Tekne Motorları ve Denizcilik Ekipmanları | Neta Marine`
- Ürün: `Parsun 9.8 HP Dıştan Takma Motor | Parsun | Neta Marine`
- Kategori: `Dıştan Takma Motorlar | Neta Marine`

#### Meta Description
- Her sayfa için benzersiz
- 150-160 karakter arası
- Harekete geçirici ifadeler (CTA)
- Ana keyword'ü içermeli

#### Implementasyon
```typescript
// composables/useSeoMeta.ts
export const useSeoMeta = (data: {
  title: string
  description: string
  image?: string
  type?: string
}) => {
  const config = useRuntimeConfig()
  const route = useRoute()
  const siteUrl = config.public.FRONT_END_URL
  const canonicalUrl = `${siteUrl}${route.path}`

  useHead({
    title: `${data.title} | Neta Marine`,
    meta: [
      { name: 'description', content: data.description },
      { property: 'og:title', content: data.title },
      { property: 'og:description', content: data.description },
      { property: 'og:image', content: data.image || `${siteUrl}/og-default.jpg` },
      { property: 'og:url', content: canonicalUrl },
      { property: 'og:type', content: data.type || 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: data.title },
      { name: 'twitter:description', content: data.description },
      { name: 'twitter:image', content: data.image || `${siteUrl}/og-default.jpg` }
    ],
    link: [
      { rel: 'canonical', href: canonicalUrl }
    ]
  })
}
```

### 5.2 Structured Data (Schema.org) - Genişletme

#### Mevcut Schemas
- ✅ Organization
- ✅ WebSite
- ✅ Product
- ✅ BreadcrumbList
- ✅ Review
- ✅ ItemList

#### Eklenecek Schemas

**Offer Schema (Ürün Sayfası)**
```json
{
  "@type": "Offer",
  "url": "https://ntmc.com.tr/urun/parsun-9-8-hp",
  "priceCurrency": "TRY",
  "price": "45000",
  "priceValidUntil": "2025-12-31",
  "itemCondition": "https://schema.org/NewCondition",
  "availability": "https://schema.org/InStock",
  "seller": {
    "@type": "Organization",
    "name": "Neta Marine"
  }
}
```

**FAQPage Schema (Ürün Detay)**
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "Bu motor hangi bot tipleri için uygundur?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "4-6 metre arası şişme botlar için idealdir."
    }
  }]
}
```

**VideoObject Schema (Varsa)**
```json
{
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "name": "Parsun 9.8 HP Motor İnceleme",
  "description": "Motor kullanım ve bakım videosu",
  "thumbnailUrl": "https://ntmc.com.tr/video-thumb.jpg",
  "uploadDate": "2025-01-15",
  "contentUrl": "https://youtube.com/watch?v=xxx"
}
```

### 5.3 URL Yapısı Optimizasyonu

**Mevcut:**
- ✅ `/urun/[slug]`
- ✅ `/urun-kategorisi/[slug]`

**Öneriler:**
- URL'ler Türkçe karakter içermemeli (SEO friendly slug)
- Kısa ve açıklayıcı olmalı
- Gereksiz parametrelerden kaçınılmalı

### 5.4 Image Optimization

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  image: {
    quality: 80,
    formats: ['webp', 'avif', 'jpg'],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
    presets: {
      product: {
        modifiers: {
          format: 'webp',
          quality: 80,
          width: 800,
          height: 800,
          fit: 'contain'
        }
      },
      thumbnail: {
        modifiers: {
          format: 'webp',
          quality: 70,
          width: 300,
          height: 300,
          fit: 'cover'
        }
      }
    }
  }
})
```

**Alt Text Optimizasyonu:**
```vue
<NuxtImg
  :src="product.image"
  :alt="`${product.name} - ${product.category} - Neta Marine`"
  loading="lazy"
  preset="product"
/>
```

### 5.5 Core Web Vitals Optimizasyonu

**Metrikler:**
- **LCP (Largest Contentful Paint):** < 2.5s
- **FID (First Input Delay):** < 100ms
- **CLS (Cumulative Layout Shift):** < 0.1

**Optimizasyon Teknikleri:**

1. **Critical CSS Inline**
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    compressPublicAssets: true,
  },
  experimental: {
    inlineSSRStyles: false
  }
})
```

2. **Resource Hints**
```typescript
useHead({
  link: [
    { rel: 'preconnect', href: 'https://backend.ntmc.com.tr' },
    { rel: 'dns-prefetch', href: 'https://backend.ntmc.com.tr' },
    { rel: 'preload', as: 'image', href: '/hero-image.webp' }
  ]
})
```

3. **Lazy Loading**
- Görseller için lazy loading
- Component lazy loading
- Route-based code splitting

### 5.6 Mobile Optimization

- ✅ Responsive design
- ✅ Touch-friendly buttons (min 44x44px)
- ✅ Fast tap targets
- ✅ Readable font sizes (min 16px)
- ✅ Viewport meta tag

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
```

### 5.7 Hreflang Tags (Çoklu Dil Desteği)

```typescript
// Eğer gelecekte çoklu dil eklenirse
useHead({
  link: [
    { rel: 'alternate', hreflang: 'tr', href: 'https://ntmc.com.tr/urun/...' },
    { rel: 'alternate', hreflang: 'en', href: 'https://ntmc.com.tr/en/product/...' },
    { rel: 'alternate', hreflang: 'x-default', href: 'https://ntmc.com.tr/urun/...' }
  ]
})
```

---

## 6️⃣ Bing Webmaster Tools Entegrasyonu

### Amaç
- Microsoft arama motorunda görünürlük
- Bing'de indexleme
- Alternatif trafik kaynağı

### Yapılacaklar

#### 6.1 Bing Webmaster Tools Kurulumu
- [ ] Bing Webmaster Tools'a kayıt ol (https://www.bing.com/webmasters)
- [ ] Site ekle
- [ ] Ownership doğrula

```html
<meta name="msvalidate.01" content="BING_VERIFICATION_CODE" />
```

#### 6.2 Sitemap Gönderimi
- [ ] Sitemap URL'ini Bing'e ekle
- [ ] URL submission API kullan (opsiyonel)

---

## 7️⃣ Content Optimization (İçerik Optimizasyonu)

### 7.1 Keyword Research

**Ana Keyword'ler:**
- Tekne motoru
- Dıştan takma motor
- Parsun motor
- Şişme bot
- Denizcilik ekipmanları
- [Marka] + [Ürün Tipi]

**Long-tail Keywords:**
- "2025 parsun 9.8 hp motor fiyatları"
- "en iyi dıştan takma motor hangisi"
- "şişme bot için motor tavsiyesi"

### 7.2 İçerik Stratejisi

#### Blog Section Eklenmesi (Opsiyonel)
```
/blog
  /tekne-motoru-nasil-secilir
  /bot-bakim-rehberi
  /denizcilik-ekipmanlari-kilavuzu
```

**Faydaları:**
- Organik trafik artışı
- Keyword çeşitliliği
- Uzman konumlandırma
- Backlink fırsatları

### 7.3 Ürün Açıklamaları

**Best Practices:**
- Minimum 300 kelime
- Benzersiz içerik (duplicate content yok)
- Bullet points ile özellikler
- Kullanım senaryoları
- Teknik spesifikasyonlar tablo formatında
- FAQ section

---

## 8️⃣ Performance Monitoring

### 8.1 İzlenecek Metrikler

| Metrik | Tool | Hedef |
|--------|------|-------|
| Page Load Time | GA4, GTM | < 3s |
| Core Web Vitals | Search Console | Good |
| Conversion Rate | GA4 | > 2% |
| Bounce Rate | GA4 | < 40% |
| Organic Traffic | GA4, Search Console | +20% MoM |
| Search Rankings | Search Console, Ahrefs | Top 10 |

### 8.2 Monitoring Tools

1. **Google PageSpeed Insights**
   - https://pagespeed.web.dev/
   - Mobile ve desktop skorları

2. **Google Search Console**
   - Performance report
   - Coverage report
   - Core Web Vitals report

3. **GA4 Dashboard**
   - Real-time reports
   - E-commerce reports
   - Acquisition reports

4. **GTM Preview Mode**
   - Tag firing kontrolü
   - Data layer debugging

---

## 9️⃣ Implementation Timeline (Zaman Çizelgesi)

### Faz 1: Temel Kurulum (1-2 gün)
- [x] Google Analytics 4 kurulumu
- [ ] Google Tag Manager entegrasyonu
- [ ] Search Console kurulumu ve doğrulama
- [ ] robots.txt optimizasyonu

### Faz 2: E-commerce Tracking (2-3 gün)
- [ ] GA4 e-commerce events implementasyonu
- [ ] GTM container yapılandırması
- [ ] Data layer structure
- [ ] Test ve debugging

### Faz 3: Merchant Center (2-3 gün)
- [ ] Merchant Center hesap kurulumu
- [ ] Product feed oluşturma
- [ ] Feed optimizasyonu
- [ ] Google Shopping kampanya hazırlığı

### Faz 4: SEO Optimizasyonları (3-4 gün)
- [ ] Meta tags iyileştirme
- [ ] Schema.org genişletme
- [ ] Image optimization
- [ ] Core Web Vitals iyileştirmeleri

### Faz 5: Testing & Launch (1-2 gün)
- [ ] Tüm tracking'lerin test edilmesi
- [ ] Production deployment
- [ ] Monitoring setup
- [ ] Documentation

**Toplam Süre:** 9-14 gün

---

## 🔟 Success Metrics (Başarı Metrikleri)

### 3 Ay Sonrası Hedefler

| Metrik | Başlangıç | Hedef |
|--------|-----------|-------|
| Organic Traffic | Baseline | +150% |
| Indexed Pages | TBD | %100 |
| Avg. Position | TBD | < 15 |
| Conversion Rate | TBD | > 2% |
| Page Speed Score | TBD | > 90 |
| Core Web Vitals | TBD | All Green |

---

## 📚 Referanslar ve Kaynaklar

1. **Google Analytics 4**
   - https://developers.google.com/analytics/devguides/collection/ga4
   - https://support.google.com/analytics/answer/9267735

2. **Google Tag Manager**
   - https://developers.google.com/tag-platform/tag-manager

3. **Google Merchant Center**
   - https://support.google.com/merchants/answer/7052112
   - https://support.google.com/merchants/answer/7052112?hl=tr

4. **Schema.org**
   - https://schema.org/
   - https://developers.google.com/search/docs/appearance/structured-data/product

5. **Core Web Vitals**
   - https://web.dev/vitals/
   - https://developers.google.com/search/docs/appearance/core-web-vitals

---

## ✅ Checklist - Tamamlanma Durumu

### Google Analytics 4
- [ ] Hesap oluşturuldu
- [ ] Measurement ID alındı
- [ ] Nuxt modülü kuruldu
- [ ] E-commerce events implementasyonu
- [ ] Test edildi

### Google Tag Manager
- [ ] Container oluşturuldu
- [ ] GTM ID alındı
- [ ] Nuxt plugin oluşturuldu
- [ ] Data layer yapısı
- [ ] Tags yapılandırıldı

### Google Search Console
- [ ] Property eklendi
- [ ] Ownership doğrulandı
- [ ] Sitemap gönderildi
- [ ] İlk veriler gelmeye başladı

### Google Merchant Center
- [ ] Hesap oluşturuldu
- [ ] Feed endpoint hazırlandı
- [ ] Feed submit edildi
- [ ] Ürünler onaylandı

### SEO Optimizasyonları
- [ ] Meta tags güncellendi
- [ ] Schema.org genişletildi
- [ ] Image optimization
- [ ] Core Web Vitals optimizasyonu
- [ ] robots.txt güncellendi

### Bing Webmaster Tools
- [ ] Hesap oluşturuldu
- [ ] Site eklendi
- [ ] Sitemap gönderildi

---

## 📝 Notlar

- Tüm tracking kodları GDPR/KVKK uyumlu olmalı (Cookie consent)
- Production'da debug mode kapalı olmalı
- GTM preview mode ile test yapılmalı
- Analytics filtreleri eklenm eli (internal traffic, spam)
- Backup ve rollback planı hazır olmalı

---

**Son Güncelleme:** 24 Ekim 2025
**Branch:** gkit
**Sorumlu:** Development Team
