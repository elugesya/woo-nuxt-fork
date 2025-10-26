![full](https://user-images.githubusercontent.com/5116925/218879668-f4c1f9fd-bef4-44b0-bc7f-e87d994aa3a1.png)

# Next Generation Front-End for WooCommerce

## Introduction

The goal of WooNuxt is to provide a modern, fast, and SEO-friendly front-end for WooCommerce. It's built on Nuxt 3 and uses the WPGraphQL API to retrieve all the data it needs. It's also fully customizable and can be extended with your custom components and modules. You can see a live demo of WooNuxt by clicking the button below.

| Demo            | URL                            |
| --------------- | ------------------------------ |
| Netlify Demo    | https://v3.woonuxt.com/        |
| Vercel Demo     | https://woonuxt-v3.vercel.app/ |
| NuxtHub Demo    | https://woo.nuxt.dev/          |
| Customized Demo | https://myshop.woonuxt.com/    |

## Troubleshooting

You can find some common errors and how to fix them [here](https://woonuxt.com/faq#some-common-errors-to-troubleshoot)

## Get Started

- Download the latest WooNuxt Setting [(woonuxt-settings.zip)](<(https://github.com/scottyzen/woonuxt-settings/releases)>).
- Install and activate the plugin on your WordPress site. This will install all the required plugins for WooNuxt, add some useful fields to the WPGraphQL schema, and automatically retrieve the WooCommerce payment gateway settings for [Stripe](https://wordpress.org/plugins/woocommerce-gateway-stripe/) and [PayPal](https://woo.com/document/paypal-standard/).
- Once the plugin is activated you are ready to deploy WooNuxt on whatever hosting you like or click one of the fast deploy buttons below.
- Once the plugin is activated the only required environment variable is `GQL_HOST`. Check out the `.env.example` file for more details.

[![button](https://user-images.githubusercontent.com/5116925/218880214-a16287a7-fd8c-4299-9e65-0871136f0771.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/scottyzen/woonuxt) [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fscottyzen%2FWooNuxt3&repository-name=WooNuxt&env=GQL_HOST,NUXT_IMAGE_DOMAINS)

### Deployment on Coolify (self‑hosted)

For fully static generation (SSG) with scheduled redeploys via GitHub Actions and a Coolify Deploy Hook, see:

- docs/deployment-coolify.md

## How to customize & extend WooNuxt 🎨

WooNuxt now uses the Nuxt layers feature to make it easy to customize any part of WooNuxt just like you would with a WordPress theme with its child theme.

Example: I have created a pages directory and added a `contact.vue` file in the pages directory. This will override the default contact page that comes with WooNuxt. You can do this with any page or component. So think of the `woonuxt_base` folder as the parent theme and the root folder as the child theme.

Here is a [branch](https://github.com/scottyzen/woonuxt/tree/myshop) with an example of some basic customizations:
And here is the live demo of the customized WooNuxt site: [My Shop](https://myshop.woonuxt.com/).

### Progress

| Feature                                                   | Ongoing Enhancements | In the Pipeline | In Progress | Done | Next |
| --------------------------------------------------------- | -------------------- | --------------- | ----------- | ---- | ---- |
| Performance                                               | 🔷                   |                 |             | ✅   |      |
| SEO                                                       | 🔷                   |                 | ✅          |      |      |
| Cart                                                      |                      |                 |             | ✅   |      |
| Search                                                    |                      |                 |             | ✅   |      |
| Shipping                                                  |                      |                 |             | ✅   |      |
| Checkout (Stripe, PayPal, Cash on Delivery)               | 🔷                   |                 |             | ✅   | 🔶   |
| Filtering                                                 | 🔷                   |                 |             | ✅   |      |
| Wishlists                                                 |                      |                 |             | ✅   |      |
| Account                                                   |                      |                 |             | ✅   |      |
| Coupons                                                   |                      |                 |             | ✅   |      |
| Product Reviews                                           |                      |                 | ✅          |      |      |
| Product Category Pages                                    |                      |                 | ✅          |      |      |
| WooNuxt Settings Module                                   | 🔷                   |                 | ✅          |      |      |
| Better TypeScript Support                                 | 🔷                   |                 | ✅          |      |      |
| Mobile layout                                             | 🔷                   |                 |             | ✅   |      |
| Countries & States Enums                                  |                      |                 |             | ✅   |      |
| Cookie Popup & GDPR Compliance                            |                      | ✅              |             |      |      |
| Progressive Web App (PWA)                                 |                      |                 | ✅          |      |      |
| Queuing System (for checking out when the server is busy) |                      | ✅              |             |      | 🔶   |
| Language Support (i18n)                                   | 🔷                   |                 | ✅          |      |      |

&nbsp;

### Required WordPress Plugins

| Plugin Name                                                                        | Description                              |
| ---------------------------------------------------------------------------------- | ---------------------------------------- |
| [WPGraphQL](https://www.wpgraphql.com/)                                            | A free, open-source plugin for WordPress |
| [WooGraphQL](https://woographql.com/)                                              | GraphQL API for WooCommerce              |
| ~~[WPGraphQL Cors](https://github.com/funkhaus/wp-graphql-cors)~~                  | ~~Enable CORS for WPGraphQL~~            |
| [Headless Login for WPGraphQL](https://github.com/AxeWP/wp-graphql-headless-login) | Enable headless login for WPGraphQL      |
| [woonuxt-settings.zip](https://github.com/scottyzen/woonuxt-settings/releases)     | WooNuxt Settings plugin                  |

> **Note** The the [woonuxt-settings.zip](https://github.com/scottyzen/woonuxt-settings/releases) plugin will help you install all the required plugins.

&nbsp;

### Payment Methods

| Payment Method                                                      | Supported |
| ------------------------------------------------------------------- | --------- |
| [Stripe](https://wordpress.org/plugins/woocommerce-gateway-stripe/) | ✅        |
| [PayPal Standard](https://woo.com/document/paypal-standard/)        | ✅        |
| Cash on Delivery                                                    | ✅        |

### Required Environment Variables

`GQL_HOST` - The URL of your WordPress site. This is the only required environment variable. The WooNuxt Settings plugin will automatically populate the rest of the environment variables for you.

#### WhatsApp Support Line

Set the WhatsApp phone number via environment variables. This value is read at runtime (supports Coolify env and .env files):

- NUXT_PUBLIC_WHATSAPP_PHONE: Phone with country code, without + or spaces. Example: `905551234567`.

If not set, WhatsApp buttons/links will be hidden.

&nbsp;


### Sanal POS (Tosla/AKÖde) – Hybrid Headless Integration

WooNuxt now supports Tosla (AKÖde) payment gateway with a **hybrid headless approach** that provides:
- ✅ Full headless UX (user stays in Nuxt app)
- ✅ PCI-DSS SAQ A-EP compliance (card data proxied, not stored)
- ✅ BIN-based installment detection
- ✅ Dynamic commission calculation
- ✅ 3D Secure flow

#### How It Works

```
Nuxt Checkout → Card Details Page (Nuxt) → WordPress Proxy → Tosla ProcessCardForm API → 3D Secure → Callback → Order Complete
```

#### Setup Steps

**1. Install the Tosla Headless Bridge Plugin**

Upload and activate `tosla-headless-bridge.php` to WordPress (in `wp-content/plugins/` or use Code Snippets plugin):

This plugin provides:
- `POST /wp-json/tosla/v1/installments` - BIN detection & installment lookup
- `POST /wp-json/tosla/v1/process-payment` - ProcessCardForm API proxy
- GraphQL checkout redirect override for Tosla gateway

**2. Configure Return/Cancel URLs**

Add the existing return URL rewrite snippet (see above section) with your frontend base URL configured.

**3. Frontend Setup**

The frontend card details page is already implemented at `/odeme/kart-bilgileri`. When users select Tosla payment gateway during checkout:

1. Order is created (pending payment)
2. User is redirected to `/odeme/kart-bilgileri?order_id=X&key=Y&total=Z`
3. User enters card details
4. BIN detection (first 6 digits) triggers installment lookup via REST API
5. User selects installment option
6. Card data is sent to WordPress proxy
7. WordPress calls Tosla ProcessCardForm API
8. 3D Secure redirect HTML is returned and auto-submitted
9. After bank verification, callback returns to order-received page

#### Security & PCI Compliance

- **SAQ A-EP Level**: Card data is collected on your site but immediately proxied to Tosla (not stored)
- **SSL Required**: HTTPS must be enabled on WordPress backend
- **No Card Storage**: Card data exists only in memory during API call
- **CSRF Protection**: WordPress nonce validation on endpoints
- **Order Ownership Verification**: orderKey validation prevents unauthorized payment attempts

#### Frontend Features

The card details page (`/odeme/kart-bilgileri.vue`) includes:

- Real-time card number formatting
- BIN detection for installment options
- Commission calculation and display
- Responsive installment table
- Security badges and SSL indicators
- Error handling with user-friendly messages
- Loading states during API calls

#### Testing

Use Tosla test credentials in WordPress admin:
- Test mode endpoint: `https://payment.testdgpf.dgpaysit.com`
- Test cards provided by Tosla documentation
- Monitor WordPress `debug.log` for API responses (disable in production)

#### Configuration via wp-config.php

```php
// Frontend base URL (for redirects)
define('FRONTEND_BASE', 'https://shop.example.com');
```

Or use WP-CLI:
```bash
wp option update woonuxt_frontend_base 'https://shop.example.com'
```

#### Installment Feature

The installment system works as follows:

1. User enters first 6 digits of card (BIN)
2. AJAX call to `/wp-json/tosla/v1/installments`
3. Tosla API returns available installments with commission rates
4. Frontend calculates and displays:
   - Monthly payment amount
   - Total amount (including commission)
   - Commission fee
5. User selects installment count
6. Commission is added to order as fee item before payment

#### Troubleshooting

**"Taksit bilgileri alınamadı"**
- Check Tosla API credentials in WooCommerce settings
- Verify installment option is enabled in gateway settings
- Ensure merchant has installment authorization from Tosla

**"ThreeDSessionId alınamadı"**
- Check Tosla API connectivity
- Verify callback URL is accessible from internet
- Check WordPress error logs for API response

**Redirect not working**
- Ensure `tosla-headless-bridge.php` is active
- Verify `woonuxt_frontend_base` option is set correctly
- Check GraphQL response includes redirect URL

**Card details page shows 404**
- Ensure Nuxt route `/odeme/kart-bilgileri.vue` exists
- Check if order_id and key parameters are in URL
- Verify order status is pending/on-hold

#### Tested with:

| Component | Version |
|-----------|---------|
| Tosla (AKÖde) Plugin | 2.1.0 |
| WordPress | 6.8.3 |
| WooCommerce | 9.9.5 |
| WPGraphQL | 2.3.8 |
| WooGraphQL | 0.21.2 |

---

### WooCommerce Return/Cancel URL Rewrite (Required for Tosla & Other Redirect Gateways)

Add this snippet to WordPress to redirect payment gateway return/cancel URLs to your Nuxt frontend:

```php
<?php
// File: Code Snippets or wp-content/mu-plugins/woonuxt-return-urls.php
if (!defined('ABSPATH')) exit;

// 1) Configure your Nuxt frontend URL
const DEFAULT_FRONTEND_BASE = 'https://shop.example.com'; // <-- CHANGE THIS

// 2) Resolve the frontend base (priority: constant > env > option > default)
if (!function_exists('woonuxt_frontend_base')) {
    function woonuxt_frontend_base(): string {
        if (defined('FRONTEND_BASE') && FRONTEND_BASE) {
            return rtrim(FRONTEND_BASE, '/');
        }
        $env = getenv('FRONTEND_BASE');
        if (!empty($env)) {
            return rtrim($env, '/');
        }
        $opt = get_option('woonuxt_frontend_base');
        if (!empty($opt)) {
            return rtrim($opt, '/');
        }
        if (defined('DEFAULT_FRONTEND_BASE') && DEFAULT_FRONTEND_BASE) {
            return rtrim(DEFAULT_FRONTEND_BASE, '/');
        }
        return rtrim(get_site_url(), '/');
    }
}

// 3) Auto-seed option on first admin load
add_action('admin_init', function () {
    $current = get_option('woonuxt_frontend_base');
    if (empty($current) && defined('DEFAULT_FRONTEND_BASE') && DEFAULT_FRONTEND_BASE) {
        update_option('woonuxt_frontend_base', rtrim(DEFAULT_FRONTEND_BASE, '/'));
    }
});

// 4) Rewrite return URL → Nuxt order-received page
add_filter('woocommerce_get_return_url', function ($return_url, $order) {
    if (!$order instanceof WC_Order) return $return_url;
    $base = woonuxt_frontend_base();
    $order_id = $order->get_id();
    $key = $order->get_order_key();
    return sprintf('%s/odeme/siparis-alindi/%d/?key=%s', $base, $order_id, $key);
}, 10, 2);

// 5) Rewrite cancel URLs → Nuxt checkout page
add_filter('woocommerce_get_cancel_order_url', function ($cancel_url, $order) {
    $base = woonuxt_frontend_base();
    return sprintf('%s/odeme/?cancel_order=true', $base);
}, 10, 2);

add_filter('woocommerce_get_cancel_order_url_raw', function ($cancel_url, $order) {
    $base = woonuxt_frontend_base();
    return sprintf('%s/odeme/?cancel_order=true', $base);
}, 10, 2);
```

**Configuration Options:**

1. **Snippet constant** (easiest): Edit `DEFAULT_FRONTEND_BASE` in snippet above
2. **wp-config.php**: `define('FRONTEND_BASE', 'https://shop.example.com');`
3. **WP-CLI**: `wp option update woonuxt_frontend_base 'https://shop.example.com'`

---


#### Tested up to:

| Plugin/Software              | Version |
| ---------------------------- | ------- |
| WordPress                    | 6.8.3   |
| WooCommerce                  | 9.9.5   |
| WPGraphQL                    | 2.3.8   |
| WooGraphQL                   | 0.21.2  |
| ~~WPGraphQL CORS~~           | ~~2.1~~ |
| Headless Login for WPGraphQL | 0.4.2   |
| Node                         | 22.17.1 |
| PHP                          | 8.2     |

### Current translations

| Language      | Code |
| ------------- | ---- |
| English 🇺🇸    | en   |
| German 🇩🇪     | de   |
| Spanish 🇪🇸    | es   |
| French 🇫🇷     | fr   |
| Italian 🇮🇹    | it   |
| Portuguese 🇵🇹 | pt   |

### Local SSL Setup

- Install [mkcert](https://github.com/FiloSottile/mkcert) on your machine.
- Run `mkcert localhost` to generate a certificate for localhost. You should now have a `localhost.pem` and `localhost-key.pem` file in your current directory. See the image below for an example.
- Then run `mkcert -install` to install the certificate authority.
- Finally, run `npm run dev:ssl` to start the dev server with SSL.

#### Credits

This is an ongoing project but it wouldn't be possible without the help of the following people: [Jason Bahl](https://github.com/jasonbahl) & [Geoffrey K Taylor](https://github.com/kidunot89) for their ongoing work on WPGraphQL and WooGraphQL respectively. Also, a big thanks to the Nuxt team for all their hard work making Nuxt 3 a pleasure to build upon. And the [WooCommerce](https://woocommerce.com/) team for making such a great e-commerce platform. Some other honorable mentions are [Funkhaus](https://funkhaus.us/) for their work on the WPGraphQL Cors plugin. And the people who have contributed to making WooNuxt better every day, [Alex Lykesas](https://github.com/alexookah), [Zack Hatlen](https://github.com/zackha), [Galli](https://github.com/Zielgestalt), [Guillaume](https://github.com/GuillaumeDgr) Thank you all! 🙏

I don't know where this project will go, but I'm excited to see what the future holds. If you have any questions or would like to contribute to the project please feel free to reach out to me on [Twitter](https://twitter.com/scottyzen) or [GitHub](https://github.com/scottyzen).

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on how to get started.


## Brands integartion 
to get brands from woo you have to add this code snippet through code snippet plugin : 

```php
add_action( 'graphql_register_types', function() {
    register_graphql_connection([
        'fromType' => 'Product',
        'toType' => 'ProductBrand',
        'fromFieldName' => 'brands',
        'connectionTypeName' => 'ProductToBrandConnection',
        'resolve' => function( $product, $args, $context, $info ) {
            $resolver = new \WPGraphQL\Data\Connection\TermObjectConnectionResolver( $product, $args, $context, $info, 'product_brand' );
            return $resolver->get_connection();
        },
    ]);
});

add_filter( 'register_taxonomy_args', function( $args, $taxonomy ) {
    if ( 'product_brand' === $taxonomy ) {
        $args['show_in_graphql'] = true;
        $args['graphql_single_name'] = 'ProductBrand';
        $args['graphql_plural_name'] = 'ProductBrands';
    }
    return $args;
}, 10, 2 );
```