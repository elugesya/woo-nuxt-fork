# ShadCN Roadmap - WooNuxt UI Refactor

Bu doküman, WooNuxt projesinin tüm UI sisteminin ShadCN ile yeniden yapılandırılması sürecini adım adım açıklar.

## 1. Neden ShadCN?
- ✅ Modern, erişilebilir ve kullanıcı dostu UI bileşenleri
- ✅ Tasarım tutarlılığı ve kolay özelleştirme
- ✅ Daha hızlı geliştirme ve bakım
- ✅ Topluluk desteği ve güncel dokümantasyon
- ✅ Copy-paste friendly, kütüphane bağımlılığı yok
- ✅ Tailwind CSS ile mükemmel entegrasyon

## 2. Mevcut UI Analizi

### 2.1 Genel Yapı
- **Toplam Sayfa Sayısı**: ~52 adet
- **Toplam Component Sayısı**: ~162 adet
- **Component Kategorileri**:
  - generalElements (26 adet)
  - productElements (24 adet)
  - shopElements (40 adet)
  - cartElements (14 adet)
  - forms (20 adet)
  - filtering (18 adet)
  - Root components (20 adet)

### 2.2 UI Elementleri Detay Listesi

#### A. BUTTON & INTERACTIVE ELEMENTS
| Component | Lokasyon | Kullanım Amacı | ShadCN Karşılığı |
|-----------|----------|----------------|------------------|
| AddToCartButton | productElements/ | Ürün sepete ekle | Button |
| WishlistButton | productElements/ | İstek listesine ekle | Button + Icon |
| ShareButton | productElements/ | Ürün paylaş | Button + Popover |
| CartTrigger | cartElements/ | Sepet aç/kapat | Button + Badge |
| SearchTrigger | generalElements/ | Arama aç | Button + Icon |
| MenuTrigger | generalElements/ | Mobil menü | Button + Icon |
| ShowFilterTrigger | filtering/ | Filtreleri göster | Button |
| ResetFiltersButton | filtering/ | Filtreleri temizle | Button |
| WhatsAppOrderButton | components/ | WhatsApp sipariş | Button + Icon |
| SignInLink | components/ | Giriş linki | Button variant="link" |

#### B. FORM ELEMENTS
| Component | Lokasyon | Kullanım Amacı | ShadCN Karşılığı |
|-----------|----------|----------------|------------------|
| LoginAndRegister | forms/ | Giriş/Kayıt formu | Form + Input + Button |
| PasswordInput | forms/ | Şifre girişi | Input type="password" |
| BillingDetails | forms/ | Fatura bilgileri | Form + Input + Select |
| ShippingDetails | forms/ | Teslimat bilgileri | Form + Input + Select |
| PersonalInformation | forms/ | Kişisel bilgiler | Form + Input |
| ChangePassword | forms/ | Şifre değiştir | Form + Input + Button |
| ResetPassword | forms/ | Şifre sıfırla | Form + Input + Button |
| BillingAndShipping | forms/ | Fatura+Teslimat | Form + Tabs |
| AddressSummary | forms/ | Adres özeti | Card + Text |
| CountrySelect | shopElements/ | Ülke seç | Select |
| StateSelect | shopElements/ | Eyalet seç | Select |
| QuantityInput | cartElements/ | Miktar girişi | Input type="number" |
| AddCoupon | shopElements/ | Kupon ekle | Input + Button |

#### C. DISPLAY & LAYOUT
| Component | Lokasyon | Kullanım Amacı | ShadCN Karşılığı |
|-----------|----------|----------------|------------------|
| ProductCard | productElements/ | Ürün kartı | Card + Image + Badge |
| CategoryCard | components/ | Kategori kartı | Card + Image |
| CartCard | cartElements/ | Sepet ürün kartı | Card + Image + Button |
| WishListItem | components/ | İstek listesi öğesi | Card + Image |
| OrderList | components/ | Sipariş listesi | Table / Card list |
| ProductGrid | shopElements/ | Ürün grid | Grid layout |
| ProductRow | shopElements/ | Ürün sırası | Flex layout |
| ProductImageGallery | productElements/ | Ürün galerisi | Carousel / Gallery |
| HeroBanner | generalElements/ | Ana banner | Custom Card |
| EmptyCart | cartElements/ | Boş sepet mesajı | Alert / Empty State |
| NoProductsFound | shopElements/ | Ürün yok mesajı | Alert / Empty State |
| EmptyCartMessage | shopElements/ | Sepet boş | Alert |

#### D. NAVIGATION
| Component | Lokasyon | Kullanım Amacı | ShadCN Karşılığı |
|-----------|----------|----------------|------------------|
| MainMenu | generalElements/ | Ana menü | Navigation Menu |
| MobileMenu | generalElements/ | Mobil menü | Sheet + Navigation |
| AppHeader | generalElements/ | Üst header | Custom Header |
| AppFooter | generalElements/ | Alt footer | Custom Footer |
| Breadcrumb | generalElements/ | Breadcrumb | Breadcrumb |
| Pagination | shopElements/ | Sayfalama | Pagination |
| ProductTabs | productElements/ | Ürün tabları | Tabs |

#### E. OVERLAY & MODAL
| Component | Lokasyon | Kullanım Amacı | ShadCN Karşılığı |
|-----------|----------|----------------|------------------|
| Cart | shopElements/ | Sepet drawer | Sheet |
| ProductSearch | shopElements/ | Arama modal | Dialog / Command |
| Filters | filtering/ | Filtre paneli | Sheet / Dialog |
| Tooltip | generalElements/ | Tooltip | Tooltip |

#### F. FEEDBACK & STATUS
| Component | Lokasyon | Kullanım Amacı | ShadCN Karşılığı |
|-----------|----------|----------------|------------------|
| LoadingIcon | generalElements/ | Yükleniyor | Spinner / Loading |
| StockStatus | productElements/ | Stok durumu | Badge |
| OrderStatusLabel | shopElements/ | Sipariş durumu | Badge |
| SaleBadge | productElements/ | İndirim badge | Badge |
| StarRating | productElements/ | Yıldız puanı | Custom Rating |
| ReviewsScore | productElements/ | Değerlendirme | Custom Component |
| ProductReviews | shopElements/ | Ürün yorumları | Card + List |

#### G. INPUT & SELECTION
| Component | Lokasyon | Kullanım Amacı | ShadCN Karşılığı |
|-----------|----------|----------------|------------------|
| OrderByDropdown | shopElements/ | Sıralama dropdown | Select |
| AttributeSelections | productElements/ | Varyasyon seçimi | RadioGroup / Select |
| ColorFilter | filtering/ | Renk filtresi | Checkbox + Custom |
| PriceFilter | filtering/ | Fiyat filtresi | Slider + Input |
| CategoryFilter | filtering/ | Kategori filtresi | Checkbox |
| StarRatingFilter | filtering/ | Yıldız filtresi | Checkbox + Rating |
| OnSaleFilter | filtering/ | İndirimli filtre | Checkbox |
| GlobalFilter | filtering/ | Genel filtre | Multi-select |
| LangSwitcher | components/ | Dil değiştirici | Select / Dropdown |
| ShippingOptions | shopElements/ | Kargo seçimi | RadioGroup |
| PaymentOptions | shopElements/ | Ödeme seçimi | RadioGroup |

#### H. MISC & UTILITIES
| Component | Lokasyon | Kullanım Amacı | ShadCN Karşılığı |
|-----------|----------|----------------|------------------|
| Logo | generalElements/ | Logo | Image/Link |
| SocialIcons | generalElements/ | Sosyal medya | Button + Icon |
| SEOHead | generalElements/ | SEO meta | - (logic only) |
| SwipeCard | cartElements/ | Kaydırmalı kart | Custom + Gesture |
| TrashIcon | cartElements/ | Silme ikonu | Icon |
| CloseIcon | cartElements/ | Kapatma ikonu | Icon |
| DownloadList | components/ | İndirme listesi | List + Button |
| DownloadableItems | components/ | İndirilebilir öğeler | Card + Button |
| AccountMyDetails | components/ | Hesap detayları | Form + Card |
| WPAdminLink | components/ | WP admin link | Link |
| OrderSummary | shopElements/ | Sipariş özeti | Card + List |
| ProductResultCount | shopElements/ | Sonuç sayısı | Text |
| WebsiteShortDescription | shopElements/ | Site açıklama | Text |
| StripeElement | shopElements/ | Stripe ödeme | Custom |
| WishList | shopElements/ | İstek listesi | Grid + Card |
| LoginProviders | forms/ | OAuth login | Button group |

### 2.3 Sayfa Listesi (Pages)
```
Ana Sayfalar:
- index.vue (Ana sayfa)
- urunler.vue (Ürünler)
- kategoriler.vue (Kategoriler)
- urun/[slug].vue (Ürün detay)
- urun-kategorisi/[slug].vue (Kategori detay)
- istek-listesi.vue (İstek listesi)
- siparis-ozeti.vue (Sipariş özeti)

Statik Sayfalar:
- hakkimizda.vue
- iletisim.vue
- gizlilik-politikasi.vue
- iade-ve-degisim.vue
- kargo-ve-teslimat.vue

Checkout & Ödeme:
- odeme/index.vue
- odeme/kart-bilgileri.vue
- odeme/callback.vue
- teslimat-bilgileri.vue

Hesap:
- hesabim/index.vue
- hesabim/siparisler.vue
- hesabim/adresler.vue
- hesabim/hesap-detaylari.vue

Blog:
- blog/index.vue
- blog/[slug].vue
- blog/kategori/[slug].vue

SSS:
- sss/index.vue
- sss/[slug].vue

OAuth:
- oauth/callback.vue
```

## 3. ShadCN Kurulum ve Konfigürasyon

### 3.1 Gerekli ShadCN Componentleri
```
Öncelikli:
✅ Button
✅ Input
✅ Card
✅ Badge
✅ Select
✅ Dialog
✅ Sheet
✅ Tabs
✅ Form
✅ Checkbox
✅ RadioGroup
✅ Slider
✅ Tooltip
✅ Breadcrumb
✅ Navigation Menu
✅ Pagination
✅ Alert
✅ Table
✅ Command (Arama için)

İkincil:
- Carousel
- Popover
- Dropdown Menu
- Separator
- Skeleton
- Progress
- Toast
- Avatar
```

### 3.2 Kurulum Adımları
```bash
# Shadcn-vue kurulumu (Nuxt için)
npx shadcn-vue@latest init

# Tüm gerekli componentleri ekle
npx shadcn-vue@latest add button
npx shadcn-vue@latest add input
npx shadcn-vue@latest add card
npx shadcn-vue@latest add badge
npx shadcn-vue@latest add select
npx shadcn-vue@latest add dialog
npx shadcn-vue@latest add sheet
npx shadcn-vue@latest add tabs
npx shadcn-vue@latest add form
npx shadcn-vue@latest add checkbox
npx shadcn-vue@latest add radio-group
npx shadcn-vue@latest add slider
npx shadcn-vue@latest add tooltip
npx shadcn-vue@latest add breadcrumb
npx shadcn-vue@latest add navigation-menu
npx shadcn-vue@latest add pagination
npx shadcn-vue@latest add alert
npx shadcn-vue@latest add table
npx shadcn-vue@latest add command
```

## 4. Refactor Stratejisi

### 4.1 Aşamalı Geçiş Planı
**Faz 1: Temel UI Elementleri (Hafta 1)**
- Button, Input, Badge, Card componentleri
- Form elementlerini refactor et
- Genel kullanılan küçük componentler

**Faz 2: Navigation & Layout (Hafta 2)**
- Header, Footer, Menu componentleri
- Breadcrumb, Pagination
- Modal ve Drawer componentleri

**Faz 3: Product & Shop (Hafta 3)**
- ProductCard, ProductGrid
- Filtering componentleri
- Cart componentleri

**Faz 4: Pages (Hafta 4)**
- Tüm sayfaları refactor et
- Checkout flow
- Account sayfaları

**Faz 5: Testing & Polish (Hafta 5)**
- Test ve bug fix
- Performans optimizasyonu
- Dokümantasyon

### 4.2 Refactor Öncelik Sırası
1. ✅ Temel form elementleri (Input, Select, Button)
2. ✅ Card ve Badge componentleri
3. ✅ Navigation (Menu, Breadcrumb)
4. ✅ Modal/Sheet componentleri
5. ✅ ProductCard ve cart componentleri
6. ✅ Filtering componentleri
7. ✅ Sayfalar (önce basit olanlar)

## 5. Kullanım Kuralları

### 5.1 Zorunlu Standartlar
- ❌ Projede ShadCN dışında UI kütüphanesi kullanılmayacak
- ❌ Custom HTML button, input, select kullanılmayacak
- ✅ Tüm UI ihtiyaçları ShadCN ile karşılanacak
- ✅ ShadCN componentleri variants ve props ile özelleştirilecek
- ✅ Tema renkleri CSS variables ile yönetilecek

### 5.2 Code Review Checklist
- [ ] ShadCN component kullanılmış mı?
- [ ] Accessibility standartlarına uygun mu?
- [ ] Responsive tasarım var mı?
- [ ] Tailwind class'ları doğru kullanılmış mı?
- [ ] Props ve variants uygun mu?

### 5.3 Örnek Kullanım
**Eski Kod:**
```vue
<button class="btn-primary">
  Sepete Ekle
</button>
```

**Yeni Kod (ShadCN):**
```vue
<Button variant="default" size="lg">
  Sepete Ekle
</Button>
```

## 6. Kaynaklar
- [ShadCN UI Dokümantasyonu](https://ui.shadcn.com/)
- [ShadCN Vue](https://www.shadcn-vue.com/)
- [Nuxt + ShadCN entegrasyon](https://www.shadcn-vue.com/docs/installation/nuxt.html)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix Vue](https://www.radix-vue.com/)

## 7. Progress Tracking

### Completed ✅
- [x] UI Analizi ve listeleme
- [x] Roadmap oluşturma

### In Progress 🔄
- [ ] ShadCN kurulumu
- [ ] Temel componentlerin refactor'ü

### Todo 📋
- [ ] Form componentleri
- [ ] Navigation componentleri
- [ ] Product componentleri
- [ ] Shop componentleri
- [ ] Cart componentleri
- [ ] Filtering componentleri
- [ ] Tüm sayfalar
- [ ] Testing
- [ ] Documentation

---

**Son Güncelleme**: 27 Ekim 2025
**Proje**: WooNuxt ShadCN Refactor
**Branch**: shadcn