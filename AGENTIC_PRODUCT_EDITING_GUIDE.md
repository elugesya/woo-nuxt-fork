# Agentic Product Editing Guide

WooCommerce ürünlerini varyasyonlu ürünlere dönüştürme ve SEO optimizasyonu için standart çalışma prosedürü.

## 📋 İş Akışı (Workflow)

### 1. Ürün Analizi
```
1.1. Ürün bilgilerini getir (woocommerce-products-get)
1.2. Açıklamayı kontrol et - birden fazla boyut/variation var mı?
1.3. Ürün tipi kontrolü: "simple" → "variable" dönüşümü gerekiyor mu?
```

### 2. Kullanıcı Onayı (Gerekli Bilgiler)
```
Aşağıdaki bilgileri kullanıcıdan al:
- Her varyasyon için fiyatlar (farklı fiyatlar varsa)
- Stok takibi yapılacak mı? (varsayılan: hayır)
```

### 3. Ürünü Variable Tipine Dönüştür
```json
{
  "type": "variable",
  "attributes": [
    {
      "name": "Beden",
      "position": 0,
      "visible": true,
      "variation": true,
      "options": ["305 cm", "335 cm", "..."]
    }
  ],
  "stock_status": "instock",
  "default_attributes": [{"name": "Beden", "option": "en ucuz varyasyon"}]
}
```

### 4. SEO Uyumlu Türkçe İçerik Oluştur

#### Ürün Adı Formatı (SEO Optimizasyonu)
```
{MODEL} {TÜR} {ÜRÜN ADI} - {SATIŞ NOKTASI}

Örnekler:
- "COSMIC Şişme SUP Stand Up Paddle Board - Tam Ekipman Dahil"
- "MODEL Pnömatik Bot Balıkçı Botu - Motor Dahil"
- "MARKA Deniz Motoru Elektrikli Start - Dıştan Takma"

KURALLAR:
- Model adı HER ZAMAN korunmalı (COSMIC, NXT, vb.)
- Anahtar kelimeler: Şişme SUP, Pnömatik Bot, Deniz Motoru, Stand Up Paddle Board
- Satış noktası ekleyin: Tam Ekipman Dahil, Motor Dahil, Kurtarma Paketi vb.
```

#### Kısa Açıklama (Short Description) Formatı
```
{MODEL} {TÜR} - {Ana Özellikler}. {Çağrı-to-action}.

Örnek:
"COSMIC Şişme SUP Board - İki boyut seçeneği (305cm / 335cm). Tam ekipman dahil. Hafif, dayanıklı ve taşınabilir. Hemen sipariş verin!"

KURALLAR:
- Maksimum 150 karakter
- Anahtar kelimeler başta
- "Hemen sipariş verin" veya benzeri CTA sonuca
```

#### Uzun Açıklama (Description) Formatı
```html
<h2>{MODEL} {ÜRÜN TÜRÜ} - {Benzersiz Değer Önermesi}</h2>

<p>{Ürün genel tanıtımı - hedef kitle ve kullanım alanı}</p>

<h3>Öne Çıkan Özellikler</h3>
<ul>
<li><strong>{Özellik 1}:</strong> {Açıklama}</li>
<li><strong>{Özellik 2}:</strong> {Açıklama}</li>
<li><strong>{Özellik 3}:</strong> {Açıklama}</li>
<li><strong>{Özellik 4}:</strong> {Açıklama}</li>
<li><strong>{Özellik 5}:</strong> {Açıklama}</li>
</ul>

<h3>Teknik Özellikler</h3>
<table>
<tr><th>Özellik</th><th>Varyasyon 1</th><th>Varyasyon 2</th></tr>
<tr><td>{Özellik Adı}</td><td>{Değer 1}</td><td>{Değer 2}</td></tr>
<!-- ... daha fazla satır ... -->
</table>

<h3>Paket İçeriği</h3>
<ul>
<li>1x {Ana Ürün}</li>
<li>1x {Aksesuar 1}</li>
<li>1x {Aksesuar 2}</li>
<!-- ... daha fazla öğe ... -->
</ul>

<p><strong>Kullanım Alanı:</strong> {Kullanım alanları}</p>
```

### 5. Varyasyon Oluşturma (WordPress REST API)

İki varyasyon oluşturulur (veya daha fazla gerekirse):

```bash
# Varyasyon 1 (örnek: 305 cm)
curl -X POST "https://backend.ntmc.com.tr/wp-json/wc/v3/products/{PRODUCT_ID}/variations" \
  -u "neta:{APP_PASSWORD}" \
  -H "Content-Type: application/json" \
  -d '{
    "regular_price": "18900",
    "stock_status": "instock",
    "attributes": [{"name": "Beden", "option": "305 cm"}],
    "description": "{MODEL} {TÜR} - 305 cm boyutu. {Spesifik özellikler}."
  }'
```

```bash
# Varyasyon 2 (örnek: 335 cm)
curl -X POST "https://backend.ntmc.com.tr/wp-json/wc/v3/products/{PRODUCT_ID}/variations" \
  -u "neta:{APP_PASSWORD}" \
  -H "Content-Type: application/json" \
  -d '{
    "regular_price": "21499",
    "stock_status": "instock",
    "attributes": [{"name": "Beden", "option": "335 cm"}],
    "description": "{MODEL} {TÜR} - 335 cm boyutu. {Spesifik özellikler}."
  }'
```

### 6. Doğrulama
```
6.1. Ürünü tekrar getir ve kontrol et
6.2. type == "variable" mı?
6.3. variations array doldu mu?
6.4. default_attributes en ucuz varyasyonu mu gösteriyor?
6.5. Ürün adı SEO uyumlu mu?
6.6. Açıklamalar Türkçe ve kapsamlı mı?
```

---

## 🔑 Kimlik Bilgileri (Credentials)

```bash
# WooCommerce / WordPress REST API
URL: https://backend.ntmc.com.tr/wp-json/wc/v3
Kullanıcı Adı: neta
App Password: 7b4X 1Bsu xzxQ 8dwe bHNi RU8e
```

---

## 📝 Kontrol Listesi (Checklist)

Her ürün düzenlemesinde bu kontrol listesini takip et:

| # | Görev | Durum |
|---|------|-------|
| 1 | Ürün bilgilerini al | ☐ |
| 2 | Açıklamayı analiz et, varyasyon sayısı belirle | ☐ |
| 3 | Kullanıcıdan fiyatları al | ☐ |
| 4 | Ürünü "variable" tipine güncelle | ☐ |
| 5 | "Beden" özniteliğini ekle | ☐ |
| 6 | SEO uyumlu Türkçe ürün adı oluştur | ☐ |
| 7 | Kısa açıklama ekle | ☐ |
| 8 | Uzun açıklama ekle (HTML formatında) | ☐ |
| 9 | Varyasyon 1 oluştur (curl ile) | ☐ |
| 10 | Varyasyon 2 oluştur (curl ile) | ☐ |
| 11 | Default varyasyonu ayarla (en ucuz) | ☐ |
| 12 | Son kontrol - ürünü doğrula | ☐ |

---

## 🎯 Örnek Tamamlanmış Ürün

**Ürün ID:** 7373
**Eski Ad:** COSMIC
**Yeni Ad:** COSMIC Şişme SUP Stand Up Paddle Board - Tam Ekipman Dahil

| Varyasyon ID | Boyut | Fiyat | Durum |
|--------------|-------|-------|-------|
| 7374 | 305 cm | ₺18,900 | Stokta |
| 7375 | 335 cm | ₺21,499 | Stokta |

**Default:** 305 cm (en ucuz)

---

## ⚠️ Önemli Kurallar

1. **Model adını asla değiştirme** - COSMIC her zaman COSMIC kalmalı
2. **Her zaman Türkçe içerik** - Kısa/uzun açıklamalar Türkçe olmalı
3. **SEO anahtar kelimeleri** - Şişme SUP, Stand Up Paddle Board, Pnömatik Bot vb.
4. **Default varyasyon** - Her zaman en ucuz varyasyon
5. **Stok durumu** - Kullanıcı aksini belirtmedikçe "instock"
6. **Fiyat formatı** - TRY cinsinden, ondalık virgülle değil noktayla (18900.00)
7. **Varyasyon açıklamaları** - Her varyasyon için spesifik özellikleri belirt

---

## 📌 MCP Araçları Kullanımı

```javascript
// Ürün getir
mcp__woocommerce_ntmc__woocommerce-products-get({id: PRODUCT_ID})

// Ürün güncelle
mcp__woocommerce_ntmc__woocommerce-products-update({
  id: PRODUCT_ID,
  type: "variable",
  name: "SEO uyumlu ad",
  description: "HTML açıklama",
  short_description: "Kısa açıklama",
  attributes: [...],
  default_attributes: [...],
  stock_status: "instock"
})

// Varyasyonlar için curl kullan (MCP aracı yok)
```

---

## 🔄 Otomasyon İçin Prompt Şablonu

Kullanıcı yeni bir ürün ID verdiğinde:

```
Ürün ID {PRODUCT_ID} için agentic product editing iş akışını başlat:

1. Ürün bilgilerini getir ve analiz et
2. Varyasyon gereksinimlerini belirle
3. Kullanıcıdan fiyatları onayla
4. Ürünü varyasyonlu hale getir
5. SEO uyumlu içerik ekle
6. Varyasyonları oluştur
7. Default varyasyonu ayarla
8. Sonuçları özetle
```

---

*Son güncelleme: 2026-03-02*
*Sürüm: 1.0*
