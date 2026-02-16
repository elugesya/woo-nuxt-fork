<?php
/*
Plugin Name: Sanal Pos Modülü
Description: Sanal POS WooCommerce modülü ile sitenizden ödeme almaya başlayın.
Version: 2.1.0
Requires at least: 4.5
Tested up to: 5.6
WC requires at least: 3.5
WC tested up to: 4.9.2
Author: Alttantire Yazılım Çözümleri
Author URI: https://www.alttantire.com
Text Domain: wc_alttantire
Domain Path: /languages/
 */

if (!defined('ABSPATH'))
    exit; // Exit if accessed directly
if (!defined('WIG_PLUGIN_DIR'))
    define('WIG_PLUGIN_DIR', dirname(__FILE__));
if (!defined('WIG_PLUGIN_ROOT_PHP'))
    define('WIG_PLUGIN_ROOT_PHP', dirname(__FILE__) . '/' . basename(__FILE__));
if (!defined('WIG_PLUGIN_ABSOLUTE_PATH'))
    define('WIG_PLUGIN_ABSOLUTE_PATH', plugin_dir_url(__FILE__));
if (!defined('WIG_PLUGIN_ADMIN_DIR'))
    define('WIG_PLUGIN_ADMIN_DIR', dirname(__FILE__) . '/admin');
if (!defined('WIG_TEXT_DOMAIN'))
    define('WIG_TEXT_DOMAIN', 'wc_alttantire');

if (!class_exists('WC_Alttantire_Payment')) {
    class WC_Alttantire_Payment
    {

        public function __construct()
        {
            if (in_array('woocommerce/woocommerce.php', apply_filters('active_plugins', get_option('active_plugins')))) {
                add_action('plugin_loaded', [&$this, 'load_main_gateway_class'], 0);
                add_filter('plugin_action_links_' . plugin_basename(__FILE__), [&$this, 'add_setting_link']);
            } else {
                add_action('admin_notices', [&$this, 'add_notice_for_woocommerce']);
            }

            add_action('init', array(&$this, 'load_language_file'));
            add_action("wp_ajax_installment", array($this, 'so_wp_ajax_function'));
            add_action("wp_ajax_nopriv_installment", array($this, 'so_wp_ajax_function'));
            add_action('wp_enqueue_scripts', [&$this, 'payment_gateway_enqueue_custom_js']);
            add_action('woocommerce_checkout_order_processed', array($this, 'addFeesBeforePayment'), 10, 3);
            add_action("wp_ajax_commission_fee", array($this, 'wp_ajax_commission_fee_function'), 10);
            add_action("wp_ajax_nopriv_commission_fee", array($this, 'wp_ajax_commission_fee_function'), 10);
        }

        function addFeesBeforePayment($order_id, $posted_data, $order)
        {
            $extra_fee = 0;
            $installment = 1;

            if (isset($_COOKIE['gtw_tmp'])) {
                $tmp = json_decode(stripcslashes((string)$_COOKIE['gtw_tmp']));
                $extra_fee = isset($tmp->extra_fee) ? $tmp->extra_fee : 0;
                $installment = isset($tmp->installment) ? $tmp->installment : 1;
            }

            $item_fee = new WC_Order_Item_Fee();
            $item_fee->set_name('Kredi Kartı Komisyonu (' . (($installment > 1) ? $installment . ' Taksit' : "Tek Çekim") . ")");
            $item_fee->set_amount($extra_fee);
            $item_fee->set_tax_class('');
            $item_fee->set_tax_status('none');
            $item_fee->set_total($extra_fee);
            $order->add_item($item_fee);
            $order->calculate_totals();
        }

        function wp_ajax_commission_fee_function()
        {
            $installment = filter_input(INPUT_POST, 'installment', FILTER_SANITIZE_SPECIAL_CHARS);
            $extra_fee = filter_input(INPUT_POST, 'extra_fee', FILTER_SANITIZE_SPECIAL_CHARS);

            if (intval($installment) > 1) {
                setcookie('gtw_tmp', json_encode(["installment" => $installment, "extra_fee" => $extra_fee]), time() + 62208000, '/');
            }

            wp_die();
        }

        function payment_gateway_enqueue_custom_js()
        {
            $settings = new Woo_Alttantire_Gateway(true);
            wp_register_script(
                'ajaxHandle',
                WP_PLUGIN_URL . '/wc-alttantire-gateway/assets/js/jquery.ajax.js',
                array(),
                false,
                true
            );
            wp_enqueue_script('ajaxHandle');
            wp_localize_script(
                'ajaxHandle',
                'ajax_object',
                array('ajaxurl' => admin_url('admin-ajax.php'), 'order' => $settings->get_order_total(), 'plugin_id' => $settings->id)
            );

            wp_register_style( 'alttantire-payment-style', WP_PLUGIN_URL . '/wc-alttantire-gateway/assets/css/alttantire.css', array(), '1.0.0', 'all' );
            wp_enqueue_style( 'alttantire-payment-style' );
        }

        public function so_wp_ajax_function()
        {
            $settings = new Woo_Alttantire_Gateway(true);
            $installment_info = $settings->get_commission_and_installment_info(filter_input(INPUT_POST, 'bin', FILTER_SANITIZE_SPECIAL_CHARS));
            echo json_encode($installment_info);
            wp_die();
        }

        public function load_language_file()
        {
            load_plugin_textdomain(WIG_TEXT_DOMAIN, FALSE, dirname(plugin_basename(__FILE__)) . '/languages/');
        }

        public function load_main_gateway_class()
        {
            if (!class_exists('WC_Payment_Gateway'))
                return;
            require_once(WIG_PLUGIN_DIR . '/includes/wc-alttantire-gateway.php');

            add_filter('woocommerce_payment_gateways', [&$this, 'add_alttantire_gateway']);
        }

        public static function add_alttantire_gateway($methods)
        {
            $methods[] = 'Woo_Alttantire_Gateway';
            return $methods;
        }

        public static function add_setting_link($links)
        {

            array_unshift($links, '<a href="' . admin_url('admin.php?page=wc-settings&tab=checkout&section=wc_alttantire') . '">' . __('Settings', WIG_TEXT_DOMAIN) . '</a>');
            return $links;
        }

        public static function add_notice_for_woocommerce()
        {
            ?>
            <div class="notice notice-error">
                <p>
                    <strong><?php _e('Sanal POS Payment Gateway requires the WooCommerce plugin to be installed and active.', WIP_TEXT_DOMAIN); ?></strong>
                </p>
            </div>
            <?php

        }
    }

    new WC_Alttantire_Payment();
}

if(WP_DEBUG){
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);
}

date_default_timezone_set("Europe/Istanbul");
