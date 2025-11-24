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
                s.parentNode?.insertBefore(c, s);
            };

            ttq.load(pixelId);
            ttq.page();
        })(window, document, 'ttq');
    };

    /**
     * Track ViewContent event
     */
    const trackViewContent = (product: any) => {
        if (!isEnabled || !window.ttq) return;

        window.ttq.track('ViewContent', {
            content_id: product.sku || String(product.databaseId),
            content_type: 'product',
            content_name: product.name,
            quantity: 1,
            price: parseFloat(product.salePrice || product.price || product.regularPrice || 0),
            currency: config.public.CURRENCY_CODE || 'TRY',
        });
    };

    /**
     * Track AddToCart event
     */
    const trackAddToCart = (product: any, quantity = 1) => {
        if (!isEnabled || !window.ttq) return;

        window.ttq.track('AddToCart', {
            content_id: product.sku || String(product.databaseId),
            content_type: 'product',
            content_name: product.name,
            quantity: quantity,
            price: parseFloat(product.salePrice || product.price || product.regularPrice || 0),
            currency: config.public.CURRENCY_CODE || 'TRY',
            value: parseFloat(product.salePrice || product.price || product.regularPrice || 0) * quantity,
        });
    };

    /**
     * Track InitiateCheckout event
     */
    const trackInitiateCheckout = (cart: any) => {
        if (!isEnabled || !window.ttq) return;

        const contents = (cart.contents?.nodes || []).map((item: any) => ({
            content_id: item.product?.node?.sku || String(item.product?.node?.databaseId),
            content_name: item.product?.node?.name,
            quantity: item.quantity,
            price: parseFloat(item.product?.node?.salePrice || item.product?.node?.price || 0),
        }));

        window.ttq.track('InitiateCheckout', {
            contents,
            currency: config.public.CURRENCY_CODE || 'TRY',
            value: parseFloat(cart.total || '0'),
        });
    };

    /**
     * Track Purchase event
     * Note: TikTok uses 'PlaceAnOrder' or 'CompletePayment' depending on strategy, 
     * but 'PlaceAnOrder' or standard 'Purchase' (if mapped) is common. 
     * TikTok standard events: https://ads.tiktok.com/help/article/standard-events-parameters
     * We will use 'PlaceAnOrder' and 'CompletePayment' to be safe, or just 'PlaceAnOrder'.
     * Actually, 'PlaceAnOrder' is the standard e-com event.
     */
    const trackPurchase = (order: any) => {
        if (!isEnabled || !window.ttq) return;

        const contents = (order.lineItems?.nodes || []).map((item: any) => ({
            content_id: item.product?.node?.sku || String(item.product?.node?.databaseId),
            content_name: item.product?.node?.name,
            quantity: item.quantity,
            price: parseFloat(item.total || 0) / item.quantity, // approximate unit price
        }));

        window.ttq.track('PlaceAnOrder', {
            contents,
            currency: config.public.CURRENCY_CODE || 'TRY',
            value: order.rawTotal ? parseFloat(order.rawTotal) : parseFloat(order.total || '0'),
        });

        // Also track CompletePayment for good measure if needed, but PlaceAnOrder is usually sufficient for "Purchase"
        window.ttq.track('CompletePayment', {
            contents,
            currency: config.public.CURRENCY_CODE || 'TRY',
            value: order.rawTotal ? parseFloat(order.rawTotal) : parseFloat(order.total || '0'),
        });
    };

    return {
        init,
        trackViewContent,
        trackAddToCart,
        trackInitiateCheckout,
        trackPurchase,
    };
};
