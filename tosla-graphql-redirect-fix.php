<?php
/**
 * Tosla Gateway GraphQL Redirect Fix
 * 
 * Bu snippet Tosla gateway için WPGraphQL checkout response'una redirect URL ekler.
 * WordPress'te Code Snippets plugin'i ile veya mu-plugins klasörüne ekleyin.
 * 
 * Dosya: wp-content/mu-plugins/tosla-graphql-redirect-fix.php
 */

if (!defined('ABSPATH')) exit;

/**
 * Tosla için özel checkout endpoint oluştur
 */
add_action('woocommerce_api_wc_alttantire_graphql', function() {
    // Order bilgilerini al
    $order_id = isset($_GET['order_id']) ? absint($_GET['order_id']) : 0;
    $order_key = isset($_GET['key']) ? wc_clean($_GET['key']) : '';
    
    if (!$order_id || !$order_key) {
        wp_die('Invalid order');
    }
    
    $order = wc_get_order($order_id);
    
    if (!$order || $order->get_order_key() !== $order_key) {
        wp_die('Invalid order');
    }
    
    // Tosla gateway'i al
    $gateway = WC()->payment_gateways->get_available_payment_gateways()['wc_alttantire'];
    
    if (!$gateway) {
        wp_die('Gateway not available');
    }
    
    // Tosla'nın kendi process_payment metodunu çalıştır
    // Ama önceden POST verilerini simüle etmemiz lazım
    
    // Eğer session'da kart bilgileri varsa onları kullan
    $card_data = WC()->session->get('tosla_card_data');
    
    if ($card_data) {
        $_POST[$gateway->id . '-cc-name'] = $card_data['owner_name'];
        $_POST[$gateway->id . '-card-number'] = $card_data['number'];
        $_POST[$gateway->id . '-card-expiry-month'] = $card_data['expire_month'];
        $_POST[$gateway->id . '-card-expiry-year'] = $card_data['expire_year'];
        $_POST[$gateway->id . '-card-cvc'] = $card_data['cvc'];
        $_POST[$gateway->id . '-installment-rate'] = $card_data['installment'];
    }
    
    // 3D form HTML'ini oluştur ve direkt göster
    $result = $gateway->process_payment($order_id);
    
    if (isset($result['messages'])) {
        // HTML formu direkt render et - tarayıcı otomatik submit edecek
        echo $result['messages'];
        exit;
    }
    
    wp_die('Payment processing failed');
});

/**
 * WPGraphQL checkout için Tosla redirect URL'ini ekle
 */
add_filter('graphql_woocommerce_process_checkout', function($response, $order) {
    if (!$order || !$order instanceof WC_Order) {
        return $response;
    }
    
    $payment_method = $order->get_payment_method();
    
    // Sadece Tosla için işlem yap
    if ($payment_method === 'wc_alttantire') {
        // Kart bilgilerini session'a kaydet (geçici)
        if (isset($_POST['cardData'])) {
            $card_data = json_decode(stripslashes($_POST['cardData']), true);
            if ($card_data) {
                WC()->session->set('tosla_card_data', [
                    'owner_name' => sanitize_text_field($card_data['ownerName'] ?? ''),
                    'number' => sanitize_text_field($card_data['number'] ?? ''),
                    'expire_month' => sanitize_text_field($card_data['expireMonth'] ?? ''),
                    'expire_year' => sanitize_text_field($card_data['expireYear'] ?? ''),
                    'cvc' => sanitize_text_field($card_data['cvc'] ?? ''),
                    'installment' => absint($card_data['installment'] ?? 1),
                ]);
            }
        }
        
        // Custom endpoint'e yönlendir - bu endpoint 3D form'unu render edecek
        $redirect_url = add_query_arg([
            'wc-api' => 'wc_alttantire_graphql',
            'order_id' => $order->get_id(),
            'key' => $order->get_order_key(),
        ], home_url('/'));
        
        $response['redirect'] = $redirect_url;
    }
    
    return $response;
}, 10, 2);

/**
 * Alternative: Eğer yukarıdaki çalışmazsa, direkt 3D URL'ini döndür
 */
add_filter('graphql_woocommerce_checkout_mutation_response_data', function($data, $order) {
    if (!$order || $order->get_payment_method() !== 'wc_alttantire') {
        return $data;
    }
    
    // Eğer messages içinde HTML varsa, onu redirect URL'e çevir
    if (isset($data['messages']) && strpos($data['messages'], '<form') !== false) {
        // Custom endpoint URL'ini oluştur
        $redirect_url = add_query_arg([
            'wc-api' => 'wc_alttantire_graphql',
            'order_id' => $order->get_id(),
            'key' => $order->get_order_key(),
        ], home_url('/'));
        
        $data['redirect'] = $redirect_url;
    }
    
    return $data;
}, 10, 2);
