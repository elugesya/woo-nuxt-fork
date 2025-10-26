<?php
/**
 * Plugin Name: Tosla Headless Bridge
 * Description: REST API endpoints for headless Tosla payment integration with WooNuxt
 * Version: 1.0.0
 * Author: Emrah Eryılmaz
 * 
 * This plugin provides:
 * - /wp-json/tosla/v1/installments - BIN-based installment lookup
 * - /wp-json/tosla/v1/process-payment - ProcessCardForm proxy for headless checkout
 */

if (!defined('ABSPATH')) exit;

class Tosla_Headless_Bridge {
    
    private $gateway_instance = null;
    
    public function __construct() {
        add_action('rest_api_init', [$this, 'register_routes']);
        // Allow CORS for frontend (needed for headless usage)
        add_action('rest_api_init', [$this, 'enable_cors_headers']);
        // Allow CORS for WPGraphQL endpoint (/graphql)
        add_action('init', [$this, 'enable_graphql_cors'], 0);
        
        // Inject dummy card data BEFORE any validation
        add_filter('woocommerce_checkout_posted_data', [$this, 'inject_dummy_card_data_for_tosla'], 5);
        
        // CRITICAL: Prevent Tosla from returning HTML form during GraphQL checkout
        add_filter('woocommerce_gateway_wc_alttantire_process_payment', [$this, 'prevent_tosla_html_form'], 999);
        
        // Security: Disable error logging for card data
        add_filter('woocommerce_logger_log_message', [$this, 'sanitize_log_messages'], 10, 2);
    }

    /**
     * Enable CORS for WPGraphQL endpoint (/graphql), including preflight handling
     */
    public function enable_graphql_cors() {
        // Only act on /graphql requests
        $request_uri = isset($_SERVER['REQUEST_URI']) ? wp_unslash($_SERVER['REQUEST_URI']) : '';
        $path = parse_url($request_uri, PHP_URL_PATH);
        if (!$path || !preg_match('#/graphql/?$#', $path)) {
            return;
        }

        // Determine allowed origin (frontend)
        $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
        $allowed_origins = [
            'http://localhost:3000',
            'https://localhost:3000',
        ];
        // Also allow configured frontend URL if defined
        if (defined('NUXT_FRONTEND_URL')) {
            $allowed_origins[] = rtrim(NUXT_FRONTEND_URL, '/');
        }

        if ($origin && in_array($origin, $allowed_origins, true)) {
            header('Access-Control-Allow-Origin: ' . $origin);
            header('Vary: Origin');
            header('Access-Control-Allow-Credentials: true');
            header('Access-Control-Allow-Methods: POST, OPTIONS');
            // Allow WooCommerce session header and common headers used by fetch/GraphQL
            header('Access-Control-Allow-Headers: Authorization, Content-Type, X-WP-Nonce, woocommerce-session, X-Requested-With, Accept, Origin');
        }

        // Handle preflight
        if (isset($_SERVER['REQUEST_METHOD']) && strtoupper($_SERVER['REQUEST_METHOD']) === 'OPTIONS') {
            status_header(200);
            exit;
        }
    }

    /**
     * Enable CORS headers for our REST endpoints
     */
    public function enable_cors_headers() {
        // Remove default and add our headers
        remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
        add_filter('rest_pre_serve_request', function ($value) {
            // Allow local dev and any origin by default (adjust for production)
            $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '*';
            // Whitelist: allow localhost:3000 by default
            if ($origin === 'http://localhost:3000' || $origin === 'https://localhost:3000') {
                header('Access-Control-Allow-Origin: ' . $origin);
            } else {
                // Fallback: allow all (safe here since we verify order ownership and don't use cookies)
                header('Access-Control-Allow-Origin: *');
            }
            header('Vary: Origin');
            header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
            header('Access-Control-Allow-Credentials: false');
            header('Access-Control-Allow-Headers: Authorization, Content-Type, X-WP-Nonce');
            // Handle preflight quickly
            if ('OPTIONS' === $_SERVER['REQUEST_METHOD']) {
                status_header(200);
                exit;
            }
            return $value;
        }, 15);
    }
    
    /**
     * Inject dummy card data for Tosla validation during checkout
     * This allows order creation without actual card details
     * Real card details will be collected on the card details page
     */
    public function inject_dummy_card_data_for_tosla($data) {
        // Only inject if payment method is Tosla
        if (!isset($data['payment_method']) || $data['payment_method'] !== 'wc_alttantire') {
            return $data;
        }
        
        // Check if card data is already present (traditional checkout)
        if (!empty($_POST['wc_alttantire-card-number'])) {
            return $data;
        }
        
        error_log('Tosla: Injecting dummy card data for headless GraphQL checkout');
        
        // Inject dummy card data into $_POST for Tosla validation
        $_POST['wc_alttantire-cc-name'] = 'HEADLESS CHECKOUT';
        $_POST['wc_alttantire-card-number'] = '0000000000000000';
        $_POST['wc_alttantire-card-expiry-month'] = '12';
        $_POST['wc_alttantire-card-expiry-year'] = '2099';
        $_POST['wc_alttantire-card-cvc'] = '000';
        $_POST['wc_alttantire-installment-rate'] = '1';
        
        return $data;
    }
    
    /**
     * Prevent Tosla from returning HTML form during GraphQL checkout
     * This stops the traditional redirect flow
     */
    public function prevent_tosla_html_form($result) {
        // Check if this is a GraphQL request
        if (defined('GRAPHQL_REQUEST') && GRAPHQL_REQUEST) {
            error_log('Tosla: Preventing HTML form return for GraphQL checkout');
            
            // Return simple success without HTML redirect
            return [
                'result' => 'success',
                'redirect' => '' // Empty redirect - will be handled by frontend fallback
            ];
        }
        
        return $result;
    }
    
    /**
     * Sanitize log messages to prevent card data exposure
     */
    public function sanitize_log_messages($message, $level) {
        // Remove potential card numbers from logs
        $message = preg_replace('/\b\d{13,19}\b/', '[CARD_NUMBER_REDACTED]', $message);
        // Remove CVV patterns
        $message = preg_replace('/\b\d{3,4}\b/', '[CVV_REDACTED]', $message);
        return $message;
    }
    
    /**
     * Simple rate limiting for payment endpoint
     */
    private function check_rate_limit($order_id) {
        $ip = isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : 'unknown';
        $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
        $transient_key = 'tosla_payment_attempt_' . $order_id . '_' . md5($ip);
        $attempts = get_transient($transient_key);

        // Dev-friendly window if coming from localhost frontend
        $is_local_frontend = in_array($origin, ['http://localhost:3000','https://localhost:3000'], true);
        $max_attempts = $is_local_frontend ? 10 : 3;
        $window = $is_local_frontend ? 1 * MINUTE_IN_SECONDS : 5 * MINUTE_IN_SECONDS;

        if ($attempts && $attempts >= $max_attempts) {
            return new WP_Error(
                'rate_limit_exceeded',
                sprintf('Çok fazla deneme yapıldı. Lütfen %d dakika bekleyin.', max(1, intval($window / MINUTE_IN_SECONDS))),
                ['status' => 429]
            );
        }

        // Increment attempts within window
        $new_attempts = $attempts ? $attempts + 1 : 1;
        set_transient($transient_key, $new_attempts, $window);

        return true;
    }
    
    /**
     * Register REST API routes
     */
    public function register_routes() {
        // 1. Installment lookup endpoint (public)
        register_rest_route('tosla/v1', '/installments', [
            'methods' => 'POST',
            'callback' => [$this, 'get_installments'],
            'permission_callback' => '__return_true',
            'args' => [
                'bin' => [
                    'required' => true,
                    'type' => 'string',
                    'validate_callback' => function($param) {
                        return strlen($param) === 6 && ctype_digit($param);
                    },
                    'sanitize_callback' => 'sanitize_text_field'
                ],
                'orderTotal' => [
                    'required' => false,
                    'type' => 'number',
                    'default' => 0
                ]
            ]
        ]);
        
        // 1.5. Public order status check by id+key (for headless callback page)
        register_rest_route('tosla/v1', '/order-status', [
            'methods' => ['GET'],
            'callback' => [$this, 'get_order_status'],
            'permission_callback' => '__return_true',
            'args' => [
                'orderId' => [
                    'required' => true,
                    'type' => 'integer'
                ],
                'orderKey' => [
                    'required' => true,
                    'type' => 'string'
                ]
            ]
        ]);

        // 2. Process payment endpoint (requires order ownership verification)
        register_rest_route('tosla/v1', '/process-payment', [
            'methods' => 'POST',
            'callback' => [$this, 'process_payment'],
            'permission_callback' => [$this, 'verify_payment_permission'],
            'args' => [
                'orderId' => [
                    'required' => true,
                    'type' => 'integer'
                ],
                'orderKey' => [
                    'required' => true,
                    'type' => 'string'
                ],
                'cardData' => [
                    'required' => true,
                    'type' => 'object'
                ],
                'installment' => [
                    'required' => true,
                    'type' => 'integer',
                    'minimum' => 1,
                    'maximum' => 12
                ],
                'commission' => [
                    'required' => false,
                    'type' => 'number',
                    'default' => 0
                ]
            ]
        ]);
    }

    /**
     * Public order status lookup by (orderId, orderKey)
     * Returns minimal status needed by the frontend callback page without authentication
     */
    public function get_order_status($request) {
        $order_id = intval($request->get_param('orderId'));
        $order_key = sanitize_text_field($request->get_param('orderKey'));

        if (!$order_id || !$order_key) {
            return new WP_Error('bad_request', 'Eksik parametre', ['status' => 400]);
        }

        $order = wc_get_order($order_id);
        if (!$order) {
            return new WP_Error('not_found', 'Sipariş bulunamadı', ['status' => 404]);
        }

        if ($order->get_order_key() !== $order_key) {
            return new WP_Error('forbidden', 'Geçersiz sipariş anahtarı', ['status' => 403]);
        }

        $status = $order->get_status();
        $needs_payment = $order->needs_payment();
        $is_paid = in_array($status, ['processing', 'completed'], true);

        return rest_ensure_response([
            'success' => true,
            'orderId' => $order_id,
            'orderKey' => $order_key,
            'status' => $status,
            'needsPayment' => $needs_payment,
            'isPaid' => $is_paid,
            'total' => (float) $order->get_total(),
        ]);
    }
    
    /**
     * Get Tosla gateway instance
     */
    private function get_gateway() {
        if ($this->gateway_instance === null) {
            if (!class_exists('Woo_Alttantire_Gateway')) {
                require_once(WP_PLUGIN_DIR . '/wc-alttantire-gateway/includes/wc-alttantire-gateway.php');
            }
            $this->gateway_instance = new Woo_Alttantire_Gateway(true);
        }
        return $this->gateway_instance;
    }
    
    /**
     * Installment lookup endpoint handler
     */
    public function get_installments($request) {
        try {
            $bin = $request->get_param('bin');
            $order_total = $request->get_param('orderTotal');
            
            $gateway = $this->get_gateway();
            
            // Check if installment is enabled (use get_option for private property)
            $installment_enabled = $gateway->get_option('installment') === 'yes';
            
            if (!$installment_enabled || !$gateway->has_installment_auth) {
                return rest_ensure_response([
                    'success' => true,
                    'installments' => [],
                    'hasInstallment' => false,
                    'message' => 'Taksit seçeneği bu kart için mevcut değil.'
                ]);
            }
            
            // Call Tosla API
            $result = $gateway->get_commission_and_installment_info($bin);
            
            // Convert to array if object
            if (is_object($result)) {
                $result = json_decode(json_encode($result), true);
            }
            
            // Check if API returned valid data
            if (!isset($result['CommissionPackages'][0]['InstallmentRate']) || 
                empty($result['CommissionPackages'][0]['InstallmentRate'])) {
                return rest_ensure_response([
                    'success' => true,
                    'installments' => [],
                    'hasInstallment' => false,
                    'message' => 'Bu kart için taksit seçeneği bulunamadı.'
                ]);
            }
            
            // Format installment options for frontend
            $installments = [];
            $installment_rates = $result['CommissionPackages'][0]['InstallmentRate'];
            
            // Convert installment rates to array if object
            if (is_object($installment_rates)) {
                $installment_rates = json_decode(json_encode($installment_rates), true);
            }
            
            foreach ($installment_rates as $key => $rate_info) {
                // Convert rate_info to array if object
                if (is_object($rate_info)) {
                    $rate_info = json_decode(json_encode($rate_info), true);
                }
                
                $installment_count = (int)str_replace('T', '', $key);
                $rate = (float)($rate_info['Rate'] ?? 0);
                $constant = (float)($rate_info['Constant'] ?? 0);
                
                // Calculate total amount with commission
                $calculated_amount = $order_total / (1 - ($rate / 100));
                $total_amount = round(($calculated_amount + $constant), 2);
                $commission_fee = round($total_amount - $order_total, 2);
                $monthly_payment = $installment_count > 0 ? round($total_amount / $installment_count, 2) : $total_amount;
                
                $installments[] = [
                    'count' => $installment_count,
                    'rate' => $rate,
                    'constant' => $constant,
                    'totalAmount' => $total_amount,
                    'commissionFee' => $commission_fee,
                    'monthlyPayment' => $monthly_payment,
                    'label' => $installment_count > 1 ? $installment_count . ' Taksit' : 'Tek Çekim'
                ];
            }
            
            return rest_ensure_response([
                'success' => true,
                'installments' => $installments,
                'hasInstallment' => count($installments) > 0,
                'binInfo' => [
                    'bin' => $bin,
                    'bankName' => $result['BankName'] ?? '',
                    'cardType' => $result['CardType'] ?? ''
                ]
            ]);
            
        } catch (Exception $e) {
            return new WP_Error('installment_error', $e->getMessage(), ['status' => 500]);
        }
    }
    
    /**
     * Verify permission for payment processing
     */
    public function verify_payment_permission($request) {
        $order_id = $request->get_param('orderId');
        $order_key = $request->get_param('orderKey');
        
        if (!$order_id || !$order_key) {
            return false;
        }
        
        $order = wc_get_order($order_id);
        
        if (!$order) {
            return false;
        }
        
        // Verify order key matches (proves user ownership)
        if ($order->get_order_key() !== $order_key) {
            return false;
        }
        
        // Verify payment method is Tosla
        if ($order->get_payment_method() !== 'wc_alttantire') {
            return false;
        }
        
        // Verify order status is pending payment
        if (!in_array($order->get_status(), ['pending', 'on-hold'])) {
            return false;
        }
        
        return true;
    }
    
    /**
     * Process payment endpoint handler
     */
    public function process_payment($request) {
        try {
            $order_id = $request->get_param('orderId');
            
            // Rate limiting check
            $rate_check = $this->check_rate_limit($order_id);
            if (is_wp_error($rate_check)) {
                return $rate_check;
            }
            
            $card_data = $request->get_param('cardData');
            $installment = $request->get_param('installment');
            $commission = $request->get_param('commission');
            
            $order = wc_get_order($order_id);
            $gateway = $this->get_gateway();
            
            // Add commission fee to order if installment > 1
            if ($installment > 1 && $commission > 0) {
                // Remove any existing commission fees
                foreach ($order->get_items('fee') as $item_id => $item) {
                    if (strpos($item->get_name(), 'Kredi Kartı Komisyonu') !== false) {
                        $order->remove_item($item_id);
                    }
                }
                
                // Add new commission fee
                $item_fee = new WC_Order_Item_Fee();
                $item_fee->set_name('Kredi Kartı Komisyonu (' . ($installment > 1 ? $installment . ' Taksit' : "Tek Çekim") . ')');
                $item_fee->set_amount($commission);
                $item_fee->set_tax_class('');
                $item_fee->set_tax_status('none');
                $item_fee->set_total($commission);
                $order->add_item($item_fee);
                $order->calculate_totals();
                $order->save();
            }
            
            // Get updated total amount
            $order_total = $order->get_total();
            $amount_in_kurus = round($order_total * 100); // Convert to kuruş
            
                // Build callback URL - redirect to frontend instead of WordPress
                // Frontend will handle the callback and query WordPress for payment status
                $frontend_url = defined('NUXT_FRONTEND_URL') ? NUXT_FRONTEND_URL : 'https://ntmc.com.tr';
                $callback_url = $frontend_url . '/odeme/callback?order_id=' . $order_id . '&key=' . $order->get_order_key();
            
            // Get currency code (949 = TRY)
            $currency = get_woocommerce_currency();
            $currency_code = 949; // TRY
            if ($currency === 'USD') $currency_code = 840;
            if ($currency === 'EUR') $currency_code = 978;
            
            // Step 1: Call threeDPayment API to get session ID
            $session_response = $gateway->Gateway->threeDPayment(
                $callback_url,
                $amount_in_kurus,
                $installment,
                $order_id,
                $currency_code
            );
            // Normalize response to array
            if (is_object($session_response)) {
                $session_response = json_decode(json_encode($session_response), true);
            } elseif (is_string($session_response)) {
                $maybe_json = json_decode($session_response, true);
                if (json_last_error() === JSON_ERROR_NONE && is_array($maybe_json)) {
                    $session_response = $maybe_json;
                } else {
                    // Unexpected response type
                    $order->add_order_note('Tosla threeDPayment beklenmedik yanıt türü alındı.');
                    return new WP_Error('session_error', 'ThreeDPayment yanıtı işlenemedi', ['status' => 500]);
                }
            }

            // Extract ThreeDSessionId with case-insensitive and nested support
            $session_id = null;
            if (isset($session_response['threeDSessionId'])) {
                $session_id = $session_response['threeDSessionId'];
            } elseif (isset($session_response['ThreeDSessionId'])) {
                $session_id = $session_response['ThreeDSessionId'];
            } elseif (isset($session_response['data']['ThreeDSessionId'])) {
                $session_id = $session_response['data']['ThreeDSessionId'];
            } elseif (isset($session_response['Data']['ThreeDSessionId'])) {
                $session_id = $session_response['Data']['ThreeDSessionId'];
            } else {
                // Deep search in case the API wraps it differently
                $walker = function($array, &$found) use (&$walker) {
                    foreach ($array as $k => $v) {
                        if (is_array($v)) {
                            $walker($v, $found);
                        } else {
                            if (is_string($k) && strtolower($k) === 'threedsessionid' && $found === null) {
                                $found = $v;
                                return;
                            }
                        }
                    }
                };
                if (is_array($session_response)) {
                    $walker($session_response, $session_id);
                }
            }

            if (!$session_id) {
                $keys = is_array($session_response) ? implode(',', array_keys($session_response)) : 'n/a';
                $order->add_order_note('Tosla threeDPayment hatası: ThreeDSessionId bulunamadı. Anahtarlar: ' . substr($keys, 0, 200));
                $error_msg = isset($session_response['message']) ? $session_response['message'] : 'ThreeDSessionId alınamadı';
                return new WP_Error('session_error', $error_msg, ['status' => 500, 'response' => $session_response]);
            }
            
            $session_id = sanitize_text_field((string)$session_id);
            
            // Store session ID in order meta
            $order->update_meta_data('_tosla_session_id', $session_id);
            $order->update_meta_data('_tosla_installment', $installment);
            $order->save();
            
            // Step 2: Call ProcessCardForm API
            // Check if payment_url already includes ProcessCardForm
            $base_url = rtrim($gateway->payment_url, '/');
            if (strpos($base_url, 'ProcessCardForm') !== false) {
                // Already contains ProcessCardForm, use as-is
                $process_url = $base_url;
            } else {
                // Append ProcessCardForm
                $process_url = $base_url . '/ProcessCardForm';
            }
            
            // Validate and sanitize card data
            if (!isset($card_data['CardHolderName']) || !isset($card_data['CardNo']) || 
                !isset($card_data['ExpireDate']) || !isset($card_data['Cvv'])) {
                return new WP_Error('invalid_card', 'Kart bilgileri eksik', ['status' => 400]);
            }
            
            $card_payload = [
                'ThreeDSessionId' => $session_id,
                'CardHolderName' => sanitize_text_field($card_data['CardHolderName']),
                'CardNo' => preg_replace('/\s+/', '', $card_data['CardNo']),
                'ExpireDate' => sanitize_text_field($card_data['ExpireDate']),
                'Cvv' => sanitize_text_field($card_data['Cvv'])
            ];
            
            // IMPORTANT: Log card processing attempt (NOT card details)
            $order->add_order_note(sprintf(
                'Tosla ProcessCardForm çağrısı yapılıyor. URL: %s, Taksit: %d, Session ID: %s, Payload keys: %s',
                $process_url,
                $installment,
                substr($session_id, 0, 20) . '...',
                implode(',', array_keys($card_payload))
            ));
            
            // Make API call
            $response = wp_remote_post($process_url, [
                'body' => $card_payload,  // Send as form data, not JSON!
                'headers' => [
                    'Content-Type' => 'application/x-www-form-urlencoded'
                ],
                'timeout' => 30,
                'sslverify' => true,
                // Do NOT auto-follow 3xx so we can capture Location for client-side redirect
                'redirection' => 0
            ]);
            
            if (is_wp_error($response)) {
                $order->add_order_note('Tosla ProcessCardForm hatası: ' . $response->get_error_message());
                return new WP_Error('api_error', $response->get_error_message(), ['status' => 500]);
            }
            
            $response_code = wp_remote_retrieve_response_code($response);
            $response_body = wp_remote_retrieve_body($response);
            $response_headers = wp_remote_retrieve_headers($response);
            
            // ProcessCardForm returns HTML form that redirects to 3D Secure
            // We need to extract the redirect URL or return the HTML
            
            if ($response_code === 200) {
                // Check if response contains HTML form
                if (strpos($response_body, '<form') !== false) {
                    // Return HTML for frontend to render and auto-submit
                    return rest_ensure_response([
                        'success' => true,
                        'type' => 'html',
                        'html' => $response_body,
                        'sessionId' => $session_id
                    ]);
                } else {
                    // Check if JSON response with redirect URL
                    $json_response = json_decode($response_body, true);
                    if (isset($json_response['redirectUrl'])) {
                        return rest_ensure_response([
                            'success' => true,
                            'type' => 'redirect',
                            'redirectUrl' => $json_response['redirectUrl'],
                            'sessionId' => $session_id
                        ]);
                    }
                }
            } elseif (in_array($response_code, [301, 302, 303, 307, 308], true)) {
                // Handle redirect responses explicitly
                $location = '';
                if (is_array($response_headers)) {
                    $location = $response_headers['location'] ?? '';
                } elseif (is_object($response_headers) && method_exists($response_headers, 'offsetGet')) {
                    $location = $response_headers->offsetGet('location');
                }
                if (!empty($location)) {
                    $order->add_order_note('ProcessCardForm 3xx yönlendirme alındı. Location: ' . esc_url_raw($location));
                    return rest_ensure_response([
                        'success' => true,
                        'type' => 'redirect',
                        'redirectUrl' => $location,
                        'sessionId' => $session_id
                    ]);
                }
            }
            
            // If we got here, log detailed response for debugging
            $order->add_order_note(sprintf(
                'ProcessCardForm yanıt: HTTP %d, Content-Type: %s, Body başlangıcı: %s',
                $response_code,
                is_array($response_headers) ? ($response_headers['content-type'] ?? 'unknown') : 'unknown',
                substr((string)$response_body, 0, 200)
            ));
            
            // FALLBACK: If 200 but no form/redirect, still try to return the body
            // Maybe Tosla returns different format than expected
            if ($response_code === 200 && !empty($response_body)) {
                // Log full body to order notes for debugging
                $order->add_order_note('ProcessCardForm 200 yanıtı (beklenmedik format): ' . substr($response_body, 0, 500));
                
                // Try to return as HTML anyway - maybe it's a valid 3D page
                return rest_ensure_response([
                    'success' => true,
                    'type' => 'html',
                    'html' => $response_body,
                    'sessionId' => $session_id,
                    'debug' => 'Fallback: returned 200 body as HTML'
                ]);
            }
            
            return new WP_Error('unexpected_response', 'Ödeme işlemi başlatılamadı', [
                'status' => 500,
                'responseCode' => $response_code,
                'body' => substr((string)$response_body, 0, 500),
                'location' => isset($location) ? $location : '',
                'headers' => is_array($response_headers) ? array_slice($response_headers, 0, 10, true) : $response_headers
            ]);
            
        } catch (Exception $e) {
            if (isset($order)) {
                $order->add_order_note('Tosla ödeme hatası: ' . $e->getMessage());
            }
            return new WP_Error('payment_error', $e->getMessage(), ['status' => 500]);
        }
    }
}

// Initialize plugin
new Tosla_Headless_Bridge();
