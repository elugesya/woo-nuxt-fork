# Cloudflare Cache Purge Setup Guide

Bu dokümantasyon, Coolify deployment sonrası Cloudflare cache'inin otomatik olarak temizlenmesi için gerekli adımları açıklar.

## 🎯 Amaç

Her deployment sonrasında:
1. Build version bilgisi HTML meta tag'ine eklenir
2. Cache headers doğru ayarlanır
3. Cloudflare cache'i otomatik temizlenir
4. Kullanıcılar her zaman en güncel versiyonu görür

## 📋 Gereksinimler

1. **Cloudflare Account** - Zone ID ve API Token
2. **Coolify Access** - Environment variables ekleyebilme
3. **Post-deployment Hook** - Script çalıştırabilme

## 🔧 Kurulum Adımları

### 1. Cloudflare API Token Oluşturma

1. Cloudflare Dashboard → [https://dash.cloudflare.com/profile/api-tokens](https://dash.cloudflare.com/profile/api-tokens)
2. "Create Token" butonuna tıkla
3. "Custom token" seç
4. Token ayarları:
   - **Token name**: `Coolify Cache Purge`
   - **Permissions**: 
     - Zone → Cache Purge → Purge
   - **Zone Resources**:
     - Include → Specific zone → ntmc.com.tr seç
5. "Continue to summary" → "Create Token"
6. Token'ı kopyala (bir daha gösterilmeyecek!)

### 2. Cloudflare Zone ID Bulma

1. Cloudflare Dashboard → ntmc.com.tr domain'ine tıkla
2. Sağ tarafta "API" bölümünde **Zone ID**'yi kopyala

### 3. Coolify Environment Variables Ekleme

Coolify dashboard'da projenin ayarlarına git ve şu environment variable'ları ekle:

```bash
# Cloudflare Zone ID (ntmc.com.tr için)
CLOUDFLARE_ZONE_ID="your-zone-id-here"

# Cloudflare API Token (yukarıda oluşturduğun token)
CLOUDFLARE_API_TOKEN="your-api-token-here"

# Cache purge'ü aktif et
CLOUDFLARE_PURGE_ON_DEPLOY="true"
```

### 4. Coolify Post-Deployment Command Ekleme

Coolify'da proje ayarlarında "Post Deployment Command" bölümüne:

```bash
pnpm run postdeploy
```

veya doğrudan:

```bash
bash ./scripts/purge-cloudflare-cache.sh
```

## 🧪 Test Etme

### Local Test

```bash
# Environment variable'ları set et
export CLOUDFLARE_ZONE_ID="your-zone-id"
export CLOUDFLARE_API_TOKEN="your-token"
export CLOUDFLARE_PURGE_ON_DEPLOY="true"

# Script'i çalıştır
./scripts/purge-cloudflare-cache.sh
```

Başarılı çıktı:
```
🔄 Starting Cloudflare cache purge...
🧹 Purging Cloudflare cache for zone: xxx...
✅ Cloudflare cache purged successfully!
🎉 Cache purge complete!
```

### Production Test

1. Kod değişikliği yap ve commit et
2. Coolify'a push et
3. Deployment loglarını izle:
   - Build başarılı ✅
   - Post-deployment script çalışıyor ✅
   - Cache purge başarılı ✅

## 📊 Cache Strategy

### HTML Files (/, /urun/, /kategoriler/)
- Browser Cache: `max-age=0, must-revalidate`
- Cloudflare Edge: 2-4 saat (her deployment'ta purge edilir)

### Static Assets (/_nuxt/, /images/)
- Browser Cache: `max-age=31536000, immutable` (1 yıl)
- Cloudflare Edge: 1 ay
- Hash'li dosya adları sayesinde cache busting otomatik

### API/Feed (google-feed.xml, _payload.json)
- Browser Cache: Minimal veya no-cache
- Cloudflare Edge: 5 dakika

## 🔍 Debug

### Build version kontrol

Deployed site'ta sağ tık → "View Page Source" → `<meta name="build-version">` ara:

```html
<meta name="build-version" content="1729783200">
<meta name="build-timestamp" content="2025-10-24T13:00:00.000Z">
```

### Cache headers kontrol

```bash
curl -I https://ntmc.com.tr/
```

Görmek istediğin headerlar:
```
Cache-Control: public, max-age=0, must-revalidate
X-Content-Type-Options: nosniff
```

### Cloudflare cache status

Response headerlarında:
```
CF-Cache-Status: MISS  # İlk request
CF-Cache-Status: HIT   # Cache'den geldi
```

## 🚨 Troubleshooting

### Problem: Script çalışmıyor

**Çözüm:**
```bash
# Script executable mi kontrol et
ls -la scripts/purge-cloudflare-cache.sh

# Değilse:
chmod +x scripts/purge-cloudflare-cache.sh
```

### Problem: API Token hatası

**Çözüm:**
- Token'ın doğru kopyalandığından emin ol
- Token permission'ları kontrol et (Cache Purge → Purge)
- Zone seçimini kontrol et

### Problem: Zone ID yanlış

**Çözüm:**
- Cloudflare dashboard'dan Zone ID'yi tekrar kontrol et
- Environment variable'da tırnak içinde mi (`"..."`) kontrol et

### Problem: Coolify'da script çalışmıyor

**Çözüm:**
1. Coolify loglarına bak
2. Environment variable'ların set olduğundan emin ol
3. Script path'i doğru mu kontrol et: `./scripts/purge-cloudflare-cache.sh`

## 📈 Monitoring

### Cache Hit Rate

Cloudflare Analytics → Caching:
- **Target:** %95+ cache hit rate
- İlk deploy'dan sonra düşük olması normal
- 1-2 saat içinde yükselmeli

### Build Version Takibi

Her deployment'ta yeni version:
```bash
# Current version
curl -s https://ntmc.com.tr/ | grep build-version

# Compare with previous
```

## 🎉 Sonuç

Setup tamamlandıktan sonra:

1. ✅ Her deployment otomatik cache purge
2. ✅ Browser'lar en güncel versiyonu görür
3. ✅ Static asset'ler agresif cache'lenir (performans)
4. ✅ HTML dosyaları her zaman taze (content güncel)
5. ✅ Zero downtime, zero manual işlem

## 📞 Support

Sorun yaşarsan:
1. Coolify deployment loglarını kontrol et
2. Cloudflare Analytics'i incele
3. Browser developer tools → Network tab → cache headerları kontrol et
