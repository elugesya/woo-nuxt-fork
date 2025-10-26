# Tosla Headless Integration - Deployment Guide

## 🎯 Overview

This guide walks through deploying the Tosla (AKÖde) headless payment integration for WooNuxt.

## 📋 Prerequisites

- [x] WordPress with WooCommerce installed
- [x] Tosla/AKÖde payment gateway plugin installed and configured
- [x] WPGraphQL and WooGraphQL plugins active
- [x] HTTPS/SSL certificate on WordPress backend (required for PCI compliance)
- [x] Nuxt frontend deployed and accessible

## 🚀 Deployment Steps

### Step 1: Install WordPress Bridge Plugin

1. **Upload the plugin file:**
   ```bash
   # Via WP-CLI
   wp plugin install /path/to/tosla-headless-bridge.php --activate
   
   # Or manually upload to:
   # wp-content/plugins/tosla-headless-bridge/tosla-headless-bridge.php
   ```

2. **Or use Code Snippets plugin:**
   - Install "Code Snippets" plugin from WordPress.org
   - Create new snippet
   - Paste contents of `tosla-headless-bridge.php`
   - Set "Run snippet everywhere"
   - Save and activate

3. **Verify installation:**
   ```bash
   # Check REST API endpoints are registered
   curl https://your-wordpress.com/wp-json/tosla/v1/installments -I
   # Should return 200 or 405 (method not allowed is OK, means endpoint exists)
   ```

### Step 2: Configure Return URLs

1. **Upload the return URL snippet:**
   
   Create file: `wp-content/mu-plugins/woonuxt-return-urls.php`
   
   ```bash
   # Via WP-CLI
   wp eval-file woonuxt-return-urls.php
   ```

2. **Configure your frontend URL:**

   Edit the snippet and change:
   ```php
   const DEFAULT_FRONTEND_BASE = 'https://your-nuxt-site.com';
   ```

3. **Or set via wp-config.php:**
   ```php
   define('FRONTEND_BASE', 'https://your-nuxt-site.com');
   ```

4. **Or use WP-CLI:**
   ```bash
   wp option update woonuxt_frontend_base 'https://your-nuxt-site.com'
   ```

5. **Verify configuration:**
   ```bash
   wp option get woonuxt_frontend_base
   # Should output: https://your-nuxt-site.com
   ```

### Step 3: Verify Tosla Gateway Configuration

1. **Check gateway settings in WordPress:**
   - Go to WooCommerce → Settings → Payments
   - Click "Manage" on "Kredi kartı ile Ödeme" (Tosla)
   - Verify:
     - ✅ Gateway is enabled
     - ✅ API credentials are correct (Client ID, API User, API Pass)
     - ✅ Test/Production mode is set correctly
     - ✅ Installment option is enabled (if needed)

2. **Test API connectivity:**
   ```bash
   # Via WordPress debug log, add to wp-config.php temporarily:
   define('WP_DEBUG', true);
   define('WP_DEBUG_LOG', true);
   
   # Then check wp-content/debug.log after a test payment attempt
   ```

### Step 4: Deploy Nuxt Frontend

1. **Ensure card details page exists:**
   ```bash
   # Check if file exists
   ls woonuxt_base/app/pages/odeme/kart-bilgileri.vue
   ```

2. **Build and deploy:**
   ```bash
   cd woonuxt
   pnpm install
   pnpm run build
   
   # Deploy to your hosting (Netlify, Vercel, etc.)
   # Or for static generation:
   pnpm run generate
   ```

3. **Verify environment variables:**
   ```bash
   # .env or hosting platform env vars
   GQL_HOST=https://your-wordpress.com/graphql
   NUXT_PUBLIC_WP_URL=https://your-wordpress.com
   ```

### Step 5: Test the Integration

#### 5.1 Test BIN Detection

1. Navigate to checkout in frontend
2. Select Tosla payment method
3. Complete checkout (creates pending order)
4. You should be redirected to `/odeme/kart-bilgileri?order_id=X&key=Y&total=Z`
5. Enter first 6 digits of a test card
6. Verify installment options appear

**Test BIN (provided by Tosla):**
- Card: 4159 5600 4741 7732 (Visa)
- Expiry: Any future date
- CVV: 123

#### 5.2 Test Full Payment Flow

1. Enter complete card details
2. Select installment option (or single payment)
3. Click "Ödemeyi Tamamla"
4. You should be redirected to 3D Secure page
5. Enter test SMS code (provided by Tosla)
6. After verification, should return to `/odeme/siparis-alindi/:orderId`

#### 5.3 Verify Callback Handling

```bash
# Check order status in WordPress
wp wc order get <ORDER_ID> --field=status
# Should show: processing or completed (after successful payment)

# Check order notes
wp wc order get <ORDER_ID> --field=customer_note
```

### Step 6: Security Hardening

1. **Disable WordPress debug logging in production:**
   ```php
   # wp-config.php
   define('WP_DEBUG', false);
   define('WP_DEBUG_LOG', false);
   ```

2. **Verify SSL is active:**
   ```bash
   curl -I https://your-wordpress.com | grep "HTTP/2 200"
   ```

3. **Check file permissions:**
   ```bash
   # Plugin files should not be writable by web server
   chmod 644 wp-content/plugins/tosla-headless-bridge/*.php
   chmod 644 wp-content/mu-plugins/woonuxt-return-urls.php
   ```

4. **Enable rate limiting (already in plugin):**
   - Default: 3 attempts per order per 5 minutes
   - Adjust in `check_rate_limit()` method if needed

5. **Monitor logs for suspicious activity:**
   ```bash
   # Watch for repeated failed payment attempts
   tail -f wp-content/debug.log | grep "Tosla"
   ```

### Step 7: Production Checklist

- [ ] WordPress backend has valid SSL certificate
- [ ] Tosla gateway set to **Production mode** (not test mode)
- [ ] Production API credentials configured
- [ ] `WP_DEBUG` and `WP_DEBUG_LOG` disabled
- [ ] Return/cancel URLs configured correctly
- [ ] Frontend environment variables updated for production
- [ ] Test payment completed successfully
- [ ] Order status updates correctly after payment
- [ ] Email notifications working
- [ ] 3D Secure redirect works
- [ ] Installment options display correctly
- [ ] Commission fees calculated accurately

## 🔍 Troubleshooting

### Issue: "Taksit bilgileri alınamadı"

**Cause:** BIN detection API call failing

**Solution:**
```bash
# 1. Check if installment is enabled
wp wc payment-gateway get wc_alttantire --field=installment_option
# Should return: yes

# 2. Verify API credentials
wp wc payment-gateway get wc_alttantire --field=apiUser
# Should return your API username

# 3. Test API connectivity manually
curl -X POST https://your-wp.com/wp-json/tosla/v1/installments \
  -H "Content-Type: application/json" \
  -d '{"bin":"415956","orderTotal":100}'
```

### Issue: "ThreeDSessionId alınamadı"

**Cause:** Tosla API not responding or credentials invalid

**Solution:**
```bash
# 1. Enable debug logging
wp config set WP_DEBUG true --raw
wp config set WP_DEBUG_LOG true --raw

# 2. Attempt payment and check log
tail -50 wp-content/debug.log

# 3. Verify callback URL is accessible
curl https://your-wp.com/?wc-api=wc_alttantire -I
# Should return 200 or 302
```

### Issue: Order stuck in "Pending Payment"

**Cause:** Callback not reaching WordPress or payment verification failed

**Solution:**
```bash
# 1. Check order notes for clues
wp wc order get <ORDER_ID> --format=json | jq '.meta_data'

# 2. Verify callback URL in Tosla dashboard matches:
# https://your-wordpress.com/?wc-api=wc_alttantire

# 3. Check if firewall blocking callback
# Whitelist Tosla IPs if needed
```

### Issue: Card data validation errors

**Cause:** Card number formatting or validation

**Solution:**
- Ensure card number has spaces removed before API call (already handled in code)
- Check CVV length (3-4 digits)
- Verify expiry date format: MMYY (e.g., 0824 for August 2024)

### Issue: CORS errors in browser console

**Cause:** Frontend making direct API calls to WordPress from different domain

**Solution:**
```php
// Add to wp-config.php or plugin
header('Access-Control-Allow-Origin: https://your-nuxt-site.com');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
```

Or use WordPress CORS plugin.

## 📊 Monitoring & Logs

### WordPress Logs

```bash
# Enable logging temporarily for debugging
wp config set WP_DEBUG true --raw
wp config set WP_DEBUG_LOG true --raw

# Watch logs in real-time
tail -f wp-content/debug.log | grep -E "Tosla|ProcessCardForm|threeDPayment"

# Disable after debugging
wp config set WP_DEBUG false --raw
wp config set WP_DEBUG_LOG false --raw
```

### Nuxt Server Logs

```bash
# If using PM2
pm2 logs woonuxt --lines 100

# If using Netlify
netlify logs

# If using Vercel
vercel logs
```

### Order-level Tracking

```bash
# Get order details
wp wc order list --status=pending --format=table

# Get specific order
wp wc order get <ORDER_ID> --format=json

# Check order meta for Tosla session
wp wc order get <ORDER_ID> --format=json | jq '.meta_data[] | select(.key=="_tosla_session_id")'
```

## 🛡️ PCI Compliance Notes

**SAQ A-EP Requirements (our implementation):**

✅ **Card data flow:**
- Collected on HTTPS frontend
- Transmitted via HTTPS to WordPress
- Immediately proxied to Tosla (PCI-certified processor)
- Never stored in WordPress database or logs

✅ **Security measures:**
- SSL/TLS for all connections
- Card numbers redacted from logs (via `sanitize_log_messages` filter)
- Rate limiting (3 attempts per 5 minutes)
- Order ownership verification (orderKey validation)
- CSRF protection (WordPress nonce)

✅ **Annual requirements:**
- SSL certificate renewal
- WordPress security updates
- Plugin updates
- Quarterly vulnerability scans (recommended)

❌ **NOT required for SAQ A-EP:**
- Full PCI-DSS Level 1 compliance
- On-site security audit
- Card data encryption at rest (we don't store)
- Tokenization infrastructure (Tosla handles)

## 📚 Additional Resources

- [Tosla API Documentation](https://tosla.com/docs)
- [WooCommerce Payment Gateway API](https://woocommerce.com/document/payment-gateway-api/)
- [WPGraphQL Documentation](https://www.wpgraphql.com/docs)
- [PCI SAQ A-EP Guide](https://www.pcisecuritystandards.org/documents/SAQ_A-EP_v3.pdf)

## 🆘 Support

If you encounter issues not covered in this guide:

1. Check WordPress `debug.log`
2. Check browser console for errors
3. Verify all environment variables
4. Test with Tosla test cards
5. Contact Tosla support for API issues
6. Open GitHub issue for WooNuxt integration bugs

---

**Last Updated:** October 25, 2025
**Version:** 1.0.0
