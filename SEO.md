# SEO Analiz ve Gereksinimler (seo.md)

Bu belge, WooNuxt e-ticaret sitesinin SEO iyileştirmesi için gerekli kontrol listesi ve eksiklikleri içermektedir. Amaç, organik ziyaretçileri siteye çekmek ve arama motorlarında üst sıralara çıkmaktır.

---

## 📋 1. TEKNİK SEO GEREKSİNİMLERİ

### 1.1 Site Hızı ve Performance
- [ ] **Lighthouse Score**: 90+ puan hedeflenmeli
- [ ] **Core Web Vitals**: LCP (<2.5s), FID (<100ms), CLS (<0.1)
- [ ] **Image Optimization**: WebP formatı, responsive images
- [ ] **Code Splitting**: Lazy loading, dynamic imports
- [ ] **Cache Strategy**: Browser cache, API caching
- [ ] **Minification**: CSS, JS minimize edilmiş mi?

**Durum**: ⚠️ Kontrol edilmesi gerekiyor

---

### 1.2 Mobile Responsiveness
- [ ] **Mobile-First Design**: Tüm ekranlarda uyumlu mu?
- [ ] **Viewport Meta Tag**: Doğru konfigüre edilmiş mi?
- [ ] **Touch-Friendly Buttons**: Minimum 48x48px
- [ ] **Mobile Navigation**: Hamburger menü ✓ (var)
- [ ] **Responsive Images**: `sizes` attribute ✓ (kısmen var)

**Durum**: ✅ Büyük oranda uyumlu

---

### 1.3 Sitemap ve Robots.txt
- [ ] **sitemap.xml**: Dinamik sitemap oluşturulmuş mu?
- [ ] **robots.txt**: Kurgulanmış mı? (önceliklendirme)
- [ ] **XML Sitemap Adresi**: Google Search Console'da kaydedilmiş mi?
- [ ] **Exclude Rules**: Admin, checkout, cart excluded mi?

**Durum**: ❌ **EKSIK** - Sitemap ve robots.txt oluşturulmalı

---

### 1.4 SSL/HTTPS
- [ ] **SSL Sertifikası**: HTTPS protokolü kullanılıyor mu?
- [ ] **Mixed Content**: HTTP ve HTTPS karışık içerik yok mu?
- [ ] **Security Headers**: HSTS, CSP, X-Frame-Options

**Durum**: ✅ HTTPS aktif (ntmc.com.tr)

---

## 📝 2. ON-PAGE SEO GEREKSİNİMLERİ

### 2.1 Title Tags
- [x] **Homepage Title**: ✅ Var (`Home - WooNuxt`)
- [x] **Product Pages**: ✅ Var - `SEOHead.vue` kullanılıyor
- [x] **Category Pages**: ⚠️ Genel "Products" kullanılıyor
- [x] **Format**: `[Brand] - [Primary Keyword]` şeklinde olmalı

**Durum**: ✅ Kısmen uyumlu

---

### 2.2 Meta Descriptions
- [x] **Homepage**: ✅ `useSeoMeta` ile ayarlanmış
- [x] **Product Pages**: ✅ `SEOHead.vue` ile otomatik
- [x] **Category Pages**: ⚠️ Sabit "Discover our products" metni
- [ ] **Karakter Limiti**: 120-160 karakter
- [ ] **Keyword Eklenmesi**: Hedef keywords içermeli

**Durum**: ⚠️ Kısmen uyumlu, kategori sayfaları dinamik olmalı

---

### 2.3 Heading Yapısı (H1, H2, H3)
- [x] **H1 Tag**: ✅ Ürün sayfalarında `product.name` kullanılıyor
- [x] **Tek H1**: ✅ Uyumlu
- [ ] **H2-H3 Hiyerarşisi**: Tüm sayfalarda tutarlı mı?
- [ ] **Keyword Eklenmesi**: Başlıklara hedef keywords

**Durum**: ✅ Ürün sayfalarında uyumlu

---

### 2.4 Meta Keywords (Opsiyonel ama Önemli)
- [ ] **Meta Keywords**: Eklenmiş mi?
- [ ] **Format**: Virgülle ayrılmış 5-10 keyword

**Durum**: ❌ EKSIK - Keywords eklenmeli

---

### 2.5 URL Yapısı
- [x] **Clean URLs**: ✅ Örnek: `/urun/ürün-adı` ✓
- [x] **Kategori URLs**: ✅ `/urun-kategorisi/kategori-adı` ✓
- [x] **Hyphens**: ✅ Underscores yerine hyphens
- [x] **HTTPS Uyarı**: ✅ Yapılıyor
- [ ] **URL Parametreleri**: Minimal olmalı (filter, sort minimal tutulmalı)

**Durum**: ✅ İyi yapılandırılmış

---

### 2.6 Structured Data (Schema.org)
- [ ] **JSON-LD**: Ürün schema'sı eklenmiş mi?
- [ ] **Product Schema**: 
  - Price
  - Rating
  - Availability
  - Description
- [ ] **Organization Schema**: Şirket bilgileri
- [ ] **LocalBusiness Schema**: Lokal iş bilgileri

**Durum**: ❌ EKSIK - Yapılandırılmış veri eklenmeli

---

### 2.7 Open Graph (OG) Tags
- [x] **og:title**: ✅ Var - `SEOHead.vue`
- [x] **og:description**: ✅ Var
- [x] **og:image**: ✅ Var - Ürün görseli
- [x] **og:url**: ✅ Var - Canonical URL
- [x] **og:type**: ⚠️ Kontrol edilmeli
- [x] **og:site_name**: ✅ Var

**Durum**: ✅ Uyumlu

---

### 2.8 Twitter Card Tags
- [x] **twitter:card**: ✅ `summary_large_image`
- [x] **twitter:title**: ✅ Var
- [x] **twitter:description**: ✅ Var
- [x] **twitter:image**: ✅ Var
- [ ] **twitter:handle**: ⚠️ Dinamik mi?

**Durum**: ✅ Uyumlu

---

## 🔗 3. BAĞLANTIL ve REFERANS (LINKAGE) SEO

### 3.1 Internal Linking
- [ ] **Breadcrumb Links**: ✅ Var - `Breadcrumb.vue`
- [ ] **Category Links**: Ürün sayfasından kategori linki
- [ ] **Related Products**: ✅ Var
- [ ] **Navigation Links**: ✅ Ana menu
- [ ] **Contextual Links**: İçerik içindeki linkler

**Durum**: ✅ Kısmen uyumlu

---

### 3.2 External Links (Backlinks)
- [ ] **Authority Links**: Yüksek otoriteli sitelerden linkler
- [ ] **Backlink Profile**: SEMrush/Ahrefs ile kontrol
- [ ] **Anchor Text Variety**: Değişken anchor text'ler

**Durum**: ❌ Kontrol edilemez (işletme bağımlı)

---

### 3.3 Canonical Tags
- [x] **Canonical URL**: ✅ `SEOHead.vue` ve `kategoriler.vue`'de var
- [x] **Format**: `<link rel="canonical" href="...">`

**Durum**: ✅ Uyumlu

---

## 📱 4. LOKAL SEO

### 4.1 Local Business Information
- [ ] **Business Name**: Kurgulanmış mı?
- [ ] **Address**: Tam adres belirtilmiş mi?
- [ ] **Phone**: İşletme telefonu
- [ ] **Hours**: Açılış/kapanış saatleri
- [ ] **Service Area**: Hizmet alanı

**Durum**: ❌ EKSIK - Local Business schema eklenmeli

---

### 4.2 Google My Business
- [ ] **GMB Profili**: Oluşturulmuş mu?
- [ ] **Doğrulama**: GMB doğrulanmış mı?
- [ ] **Bilgiler**: Güncel ve eksiksiz mi?

**Durum**: ❌ Kontrol edilemez (işletme bağımlı)

---

## 📊 5. CONTENT SEO

### 5.1 Keyword Araştırması
- [ ] **Primary Keywords**: Tespit edilmiş mi?
- [ ] **Long-tail Keywords**: Listelendi mi?
- [ ] **Keyword Density**: 1-2% hedef aralıkta

**Durum**: ❌ YAPILMALI - Keyword araştırması

---

### 5.2 Content Quality
- [ ] **Unique Content**: Tüm sayfalarda benzersiz mi?
- [ ] **Content Length**: 
  - Category: 300+ words
  - Product: 500+ words
  - Blog: 1000+ words
- [ ] **Readability**: Kolay okunabilir, paragraflar kısa
- [ ] **Grammar & Spelling**: Hatasız mı?

**Durum**: ⚠️ Kontrol edilmeli

---

### 5.3 H1/Keywords Dağılımı
- [x] **Sayfa başında H1**: ✅ Ürün sayfalarında var
- [x] **Keyword Tekrarı**: Doğal mi?
- [ ] **LSI Keywords**: İlişkili keywords

**Durum**: ✅ Ürün sayfalarında uyumlu

---

## 🖼️ 6. GÖRSEL SEO

### 6.1 Image Optimization
- [x] **Image Compression**: Optimize edilmiş mi? ⚠️
- [x] **Responsive Images**: ✅ `sizes` attribute
- [x] **Lazy Loading**: ✅ Var
- [x] **WebP Format**: ⚠️ Kontrol edilmeli

**Durum**: ✅ Kısmen uyumlu

---

### 6.2 Alt Text
- [x] **Tüm Resimlerde Alt**: `alt="Hero image"` ✓ (test edil)
- [ ] **Alt Text Kalitesi**: Açıklayıcı ve keyword içermeli
- [ ] **Format**: `[Keyword] - [Açıklama]`

**Durum**: ⚠️ Alt textler kontrol edilmeli

---

### 6.3 Image Filenames
- [ ] **Dosya Adları**: Açıklayıcı mı? (img123.jpg değil)
- [ ] **Format**: `kebab-case` (alt-text-format.jpg)

**Durum**: ❌ EKSIK - Dosya adları iyileştirilmeli

---

## 🔍 7. ARAMA MOTORU OPTİMİZASYONU

### 7.1 Google Search Console
- [ ] **GSC Kaydı**: Site kaydedilmiş mi?
- [ ] **Sitemap Gönderimi**: sitemap.xml gönderilmiş mi?
- [ ] **Mobile-Friendly Test**: Sonuçlar kontrol edildi mi?
- [ ] **Indexing**: Tüm önemli sayfalar index edilmiş mi?
- [ ] **Coverage**: Errors kontrol edildi mi?

**Durum**: ❌ Kontrol edilmeli

---

### 7.2 Google Analytics
- [ ] **GA4 Kurulumu**: Etkinleştirilmiş mi?
- [ ] **Tracking Code**: Tüm sayfalarda mı?
- [ ] **Goal Tracking**: Dönüşüm hedefleri tanımlandı mı?
- [ ] **User Journey**: E-ticaret tracking

**Durum**: ❌ Kontrol edilmeli

---

### 7.3 Bing Webmaster Tools
- [ ] **Bing WMT Kaydı**: Kaydedilmiş mi?
- [ ] **Sitemap**: Gönderilmiş mi?

**Durum**: ❌ Kontrol edilmeli

---

## 📱 8. KULLANICILIK (UX) VE SEO

### 8.1 Page Speed
- [ ] **GTmetrix**: Grade ≥ A
- [ ] **PageSpeed Insights**: 90+ Score
- [ ] **TTL**: Time to First Byte < 600ms

**Durum**: ⚠️ Kontrol edilmeli

---

### 8.2 User Experience
- [ ] **Navigation**: Kolay navigasyon
- [ ] **CTA Buttons**: Açık ve görünür
- [ ] **Forms**: Basit ve hızlı doldurulacak
- [ ] **Mobile Experience**: Touch-friendly

**Durum**: ✅ İyi

---

### 8.3 Crawlability
- [ ] **Robots.txt**: Doğru kurgulanmış
- [ ] **No-Index Tags**: Gerekenler no-index'lenmiş mi?
- [ ] **Broken Links**: Kırık linkler yok mu?
- [ ] **Redirect Chains**: Minimum redirect

**Durum**: ⚠️ Kontrol edilmeli

---

## 🔐 9. GÜVENLİK VE SEO

### 9.1 Security Headers
- [x] **HTTPS**: ✅ Aktif
- [ ] **HSTS**: Tanımlanmış mı?
- [ ] **CSP**: Content Security Policy
- [ ] **X-Frame-Options**: Clickjacking koruması

**Durum**: ⚠️ Security headers kontrol edilmeli

---

### 9.2 Privacy
- [x] **Privacy Policy**: ✅ Var (`gizlilik-politikasi.vue`)
- [ ] **GDPR Compliance**: Uyumlu mu?
- [ ] **Cookie Banner**: Bilgilendirme var mı?

**Durum**: ✅ Var

---

## 🎯 10. E-COMMERCE SEO ÖZELLİKLERİ

### 10.1 Product Pages
- [x] **Product Title**: ✅ SEO optimized
- [x] **Product Description**: ✅ Dinamik
- [x] **Product Images**: ✅ Ürün görseleri
- [x] **Price**: ✅ Görünüyor
- [x] **Reviews/Ratings**: ✅ Gösterilmiş
- [ ] **Stock Status**: ✅ Var ama daha önemli yapılabilir

**Durum**: ✅ İyi

---

### 10.2 Category Pages
- [x] **Category Description**: ⚠️ Dinamik değil - SABIT
- [x] **Category Image**: ✅ Var
- [x] **Product Listings**: ✅ Gösteriliyor
- [x] **Filtering Options**: ✅ Var
- [ ] **Pagination**: Kontrol edilmeli

**Durum**: ⚠️ Kategori açıklamaları dinamik yapılmalı

---

### 10.3 Filter/Sort Pages
- [ ] **No-Index Filter Pages**: Filterler no-index'lenmeli mi?
- [ ] **Parameter Tracking**: UTM parametreleri minimize

**Durum**: ⚠️ Kontrol edilmeli

---

## 📊 11. SOSYAL MEDYA İNTEGRASYONU

### 11.1 Social Sharing
- [x] **Share Buttons**: ✅ `ShareButton.vue` var
- [x] **OG Tags**: ✅ Sosyal paylaşım için optimize
- [x] **Pinterest Integration**: ✅ Var

**Durum**: ✅ İyi

---

### 11.2 Social Links
- [x] **Footer Links**: ✅ `SocialIcons.vue`
- [x] **Sosyal Kanaller**: Tanımlanmış mı?

**Durum**: ⚠️ Kontrol edilmeli

---

## 🎬 12. ADVANCED SEO

### 12.1 Schema.org Structured Data
- [ ] **JSON-LD Product**: 
  ```json
  {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "...",
    "description": "...",
    "price": "...",
    "priceCurrency": "...",
    "rating": "...",
    "availability": "..."
  }
  ```
- [ ] **JSON-LD Organization**
- [ ] **JSON-LD FAQPage** (Q&A)

**Durum**: ❌ EKSIK - Yapılandırılmış veri eklenmelidir

---

### 12.2 AMP (Accelerated Mobile Pages)
- [ ] **AMP Sayfaları**: Uygulanmış mı?
- [ ] **AMP Canonical**: Eğer varsa

**Durum**: ❌ Optional - Nuxt SSR daha iyi

---

### 12.3 Hreflang Tags (Multi-language)
- [x] **i18n Kullanımı**: ✅ Var
- [ ] **Hreflang Attributes**: Türkçe/İngilizce arası yapılandırılmış mı?

**Durum**: ⚠️ i18n var ama hreflang kontrol edilmeli

---

## ✅ ÖZET VE ÖNCELİKLER

### 🔴 KRİTİK (Hemen Yapılmalı)
1. **Sitemap.xml oluşturma** - Google indexing için zorunlu
2. **robots.txt kurgulanması** - Bot trafiğini kontrol etmek
3. **Schema.org Structured Data** - E-commerce için hayati
4. **Google Search Console kurulumu** - Arama performansı izleme
5. **Dinamik kategori açıklamaları** - Meta ve başlık optimizasyonu

### 🟠 ÖNEMLI (1-2 Hafta İçinde)
1. Kategori sayfalarında dinamik meta descriptions
2. Keywords eklenmesi (tüm sayfalara)
3. Image filenames ve alt text iyileştirmesi
4. Google Analytics 4 kurulumu
5. Performance optimization (Lighthouse 90+)

### 🟡 ORTA ÖNCELİK (Aylar İçinde)
1. Hreflang tags (çok dilli varsa)
2. Security headers (HSTS, CSP)
3. Backlinkler ve referans stratejisi
4. Content strategy ve keyword planning
5. Local SEO (işletme lokasyonu varsa)

---

## 🔄 İZLEME VE İTERASYON

- **Haftalık**: Google Search Console - Coverage, Performance
- **Aylık**: Lighthouse, PageSpeed, Ranking Position
- **Üç Aylık**: Backlink profili, Competitor analiz, Keyword ranking

---

**Son Güncelleme**: 23 Ekim 2025
**Durum**: İlk Analiz Tamamlandı
