/**
 * TikTok Pixel Composable
 * Handles script injection and event tracking
 */

declare global {
    interface Window {
        ttq?: any;
    }
}

export const useTikTokPixel = () => {
    const config = useRuntimeConfig();
    const pixelId = config.public.TIKTOK_PIXEL_ID || 'D4I3633C77U4IAHDJB90'; // Default to user provided ID if not in config
    const isEnabled = !!pixelId && typeof window !== 'undefined';

    /**
     * SHA-256 Hashing for PII
     */
    const sha256 = async (message: string) => {
        if (!message) return '';
        const msgBuffer = new TextEncoder().encode(message.trim().toLowerCase());
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    };

    /**
     * Initialize TikTok Pixel
     * Injects the script into the head
     */
    const init = () => {
        if (!isEnabled || window.ttq) return;

        // TikTok Pixel Code
        (function (w: any, d: any, t: any) {
            w.TiktokAnalyticsObject = t;
            var ttq = (w[t] = w[t] || []);
            ttq.methods = [
                'page',
                'track',
                'identify',
                'instances',
                'debug',
                'on',
                'off',
                'once',
                'ready',
                'alias',
                'group',
                'enableCookie',
                'disableCookie',
                'holdConsent',
                'revokeConsent',
                'grantConsent',
            ];
            ttq.setAndDefer = function (t: any, e: any) {
                t[e] = function () {
                    t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
                };
            };
            for (var i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
            ttq.instance = function (t: any) {
                for (var e = ttq._i[t] || [], n = 0; n < ttq.methods.length; n++) ttq.setAndDefer(e, ttq.methods[n]);
                return e;
            };
            ttq.load = function (e: any, n: any) {
                var r = 'https://analytics.tiktok.com/i18n/pixel/events.js';
                ttq._i = ttq._i || {};
                ttq._i[e] = [];
                ttq._i[e]._u = r;
                ttq._t = ttq._t || {};
                ttq._t[e] = +new Date();
                ttq._o = ttq._o || {};
                ttq._o[e] = n || {};
                var c = document.createElement('script') as HTMLScriptElement;
                c.type = 'text/javascript';
                c.async = true;
                c.src = r + '?sdkid=' + e + '&lib=' + t;
                var s = document.getElementsByTagName('script')[0];
                if (s && s.parentNode) {
                    s.parentNode.insertBefore(c, s);
                } else {
                    document.head.appendChild(c);
                }
            };

            ttq.load(pixelId);
            ttq.page();
        })(window, document, 'ttq');
    };

    /**
     * Identify User (PII)
     */
    const identify = async (userData: { email?: string; phone_number?: string; external_id?: string }) => {
        if (!isEnabled || !window.ttq) return;

        const hashedData: any = {};
        if (userData.email) hashedData.email = await sha256(userData.email);
        if (userData.phone_number) hashedData.phone_number = await sha256(userData.phone_number);
        if (userData.external_id) hashedData.external_id = await sha256(userData.external_id);

        window.ttq.identify(hashedData);
    };

    /**
     * Helper to parse price string to number
     * Handles currency symbols, thousands separators, and decimal commas
     */
    const parsePrice = (price: string | number | undefined | null): number => {
        if (price === undefined || price === null) return 0;
        if (typeof price === 'number') return price;

        // Remove currency symbols and non-numeric chars except . and ,
        let cleanPrice = price.replace(/[^0-9.,]/g, '');

        // If it has both . and , assume the last one is the decimal separator
        if (cleanPrice.includes('.') && cleanPrice.includes(',')) {
            const lastDotIndex = cleanPrice.lastIndexOf('.');
            const lastCommaIndex = cleanPrice.lastIndexOf(',');

            if (lastCommaIndex > lastDotIndex) {
                // Comma is decimal separator (e.g. 1.234,56)
                cleanPrice = cleanPrice.replace(/\./g, '').replace(',', '.');
            } else {
                // Dot is decimal separator (e.g. 1,234.56)
                cleanPrice = cleanPrice.replace(/,/g, '');
            }
        } else if (cleanPrice.includes(',')) {
            // If only comma, assume it's decimal separator if it looks like one (e.g. 12,50)
            // But be careful with 1,000 (could be 1000). 
            // Usually in TR/EU, comma is decimal. 
            // Let's assume comma is decimal if it's the only separator and we are in TR context or generic.
            // A safer bet for single separator is: if it has 3 digits after, it MIGHT be thousands, but 12,345 is ambiguous.
            // Given the context of WooCommerce usually returning standard formats:
            // If we have rawTotal (which is float string), we use that. 
            // This fallback is for formatted strings.
            cleanPrice = cleanPrice.replace(',', '.');
        }

        return parseFloat(cleanPrice) || 0;
    };

    /**
     * Track ViewContent event
     */
    const trackViewContent = (product: any) => {
        if (!isEnabled || !window.ttq) return;

        window.ttq.track('ViewContent', {
            contents: [
                {
                    content_id: product.sku || String(product.databaseId),
                    content_type: 'product',
                    content_name: product.name,
                },
            ],
            value: parsePrice(product.salePrice || product.price || product.regularPrice),
            currency: config.public.CURRENCY_CODE || 'TRY',
        });
    };

    /**
     * Track AddToCart event
     */
    const trackAddToCart = (product: any, quantity = 1) => {
        if (!isEnabled || !window.ttq) return;

        window.ttq.track('AddToCart', {
            contents: [
                {
                    content_id: product.sku || String(product.databaseId),
                    content_type: 'product',
                    content_name: product.name,
                },
            ],
            value: parsePrice(product.salePrice || product.price || product.regularPrice) * quantity,
            currency: config.public.CURRENCY_CODE || 'TRY',
        });
    };

    /**
     * Track AddToWishlist event
     */
    const trackAddToWishlist = (product: any) => {
        if (!isEnabled || !window.ttq) return;

        window.ttq.track('AddToWishlist', {
            contents: [
                {
                    content_id: product.sku || String(product.databaseId),
                    content_type: 'product',
                    content_name: product.name,
                },
            ],
            value: parsePrice(product.salePrice || product.price || product.regularPrice),
            currency: config.public.CURRENCY_CODE || 'TRY',
        });
    };

    /**
     * Track Search event
     */
    const trackSearch = (searchTerm: string) => {
        if (!isEnabled || !window.ttq) return;

        window.ttq.track('Search', {
            contents: [],
            search_string: searchTerm,
            currency: config.public.CURRENCY_CODE || 'TRY',
        });
    };

    /**
     * Track InitiateCheckout event
     */
    const trackInitiateCheckout = (cart: any) => {
        if (!isEnabled || !window.ttq) return;

        const contents = (cart.contents?.nodes || []).map((item: any) => ({
            content_id: item.product?.node?.sku || String(item.product?.node?.databaseId),
            content_type: 'product',
            content_name: item.product?.node?.name,
        }));

        window.ttq.track('InitiateCheckout', {
            contents,
            currency: config.public.CURRENCY_CODE || 'TRY',
            value: parsePrice(cart.total),
        });
    };

    /**
     * Track AddPaymentInfo event
     */
    const trackAddPaymentInfo = (cart: any) => {
        if (!isEnabled || !window.ttq) return;

        const contents = (cart.contents?.nodes || []).map((item: any) => ({
            content_id: item.product?.node?.sku || String(item.product?.node?.databaseId),
            content_type: 'product',
            content_name: item.product?.node?.name,
        }));

        window.ttq.track('AddPaymentInfo', {
            contents,
            currency: config.public.CURRENCY_CODE || 'TRY',
            value: parsePrice(cart.total),
        });
    };

    /**
     * Track PlaceAnOrder / Purchase event
     */
    const trackPurchase = (order: any) => {
        if (!isEnabled || !window.ttq) return;

        const contents = (order.lineItems?.nodes || []).map((item: any) => ({
            content_id: item.product?.node?.sku || String(item.product?.node?.databaseId),
            content_type: 'product',
            content_name: item.product?.node?.name,
        }));

        // Prefer rawTotal if available, otherwise parse total
        const value = order.rawTotal ? parseFloat(order.rawTotal) : parsePrice(order.total);

        window.ttq.track('PlaceAnOrder', {
            contents,
            currency: config.public.CURRENCY_CODE || 'TRY',
            value,
        });

        window.ttq.track('Purchase', {
            contents,
            currency: config.public.CURRENCY_CODE || 'TRY',
            value,
        });
    };

    /**
     * Track CompleteRegistration event
     */
    const trackCompleteRegistration = () => {
        if (!isEnabled || !window.ttq) return;
        window.ttq.track('CompleteRegistration', {
            currency: config.public.CURRENCY_CODE || 'TRY',
        });
    };

    return {
        init,
        identify,
        trackViewContent,
        trackAddToCart,
        trackAddToWishlist,
        trackSearch,
        trackInitiateCheckout,
        trackAddPaymentInfo,
        trackPurchase,
        trackCompleteRegistration,
    };
};
