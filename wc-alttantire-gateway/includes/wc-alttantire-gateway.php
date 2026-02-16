<?php
/**
 * Copyright (c) 2021
 * @author: Alttantire Yazılım Çözümleri <info@alttantire.com>
 * Web: https://www.alttantire.com
 *
 */

use Alttantire\Gateway;

if (!defined('ABSPATH'))
    exit;

require_once("class/Gateway.php");

/**
 * Class Woo_Alttantire_Gateway
 */
class Woo_Alttantire_Gateway extends WC_Payment_Gateway
{
    public $id;
    private $card;
    private $threed_session_id;
    private $installment_option;
    private $installment;
    public $has_installment_auth;
    public $verified;

    public function __construct()
    {

        $this->id = 'wc_alttantire';
        $this->method_title = __('Sanal POS', WIG_TEXT_DOMAIN);
        $this->method_description = __('Woocommerce için Sanal POS ödeme modülü ', WIG_TEXT_DOMAIN);
        $this->title = $this->get_option('title');
        $this->description = $this->get_option('description') ? $this->get_option('description') : __('Credit/Debit Card', WIG_TEXT_DOMAIN);
        $this->has_fields = true;
        $this->init_form_fields();
        $this->init_settings();

        $this->installment_option = $this->get_option('installment') ? $this->get_option('installment') : 'no';
        $this->supports[] = 'default_credit_card_form';

        add_action('woocommerce_update_options_payment_gateways_' . $this->id, [&$this, 'process_admin_options']);
        add_action('woocommerce_api_' . $this->id, array($this, 'callback_handler'));


        add_action('admin_notices', array($this, 'dd_add_notice'));
        add_action('init', array($this, 'dd_remove_notice'));

        $client_id = $this->get_option('client_id');
        $api_user = $this->get_option('api_user');
        $api_pass = $this->get_option('api_pass');
        $environment = $this->get_option('environment');

        $this->Gateway = new Gateway($environment, $client_id, $api_user, $api_pass);
        $this->payment_url = $this->Gateway->getFormUrl();

        delete_option('dd_notice');
        $this->verified = false;


        try {
            $verify_client = $this->Gateway->verifyClient();
            $this->verified = $verify_client->Code == 0 ? true : false;

            $this->has_installment_auth = isset($verify_client->HasInstallmentAuth) ? $verify_client->HasInstallmentAuth : false;

            if (!$this->verified) {
                $this->dd_notice("" . $verify_client->Message . "<br/><strong>Sanal POS ayarlarınızı kontrol ediniz. Ödeme modülü mevcut ayarlarınızla çalışmayacaktır.</strong>", 'error');
            }

        } catch (Exception $e) {
            $this->dd_notice($e->getMessage() . "<br/><strong>Sanal POS bilgilerinizi kontrol ediniz. Ödeme modülü mevcut ayarlarınızla çalışmayacaktır.</strong>", 'error');
        }


        if (isset($_COOKIE['message'])) {
            $this->dd_notice((string)$_COOKIE['message'], 'error');
            unset($_COOKIE["message"]);
            setcookie("message", '', time() - (15 * 60));
        }

    }


    public function process_admin_options()
    {

        $validation = true;

        $this->init_settings();


        $environment = filter_input(INPUT_POST, "woocommerce_" . $this->id . "_environment", FILTER_SANITIZE_SPECIAL_CHARS);
        $client_id = filter_input(INPUT_POST, "woocommerce_" . $this->id . "_client_id", FILTER_SANITIZE_SPECIAL_CHARS);
        $api_user = filter_input(INPUT_POST, "woocommerce_" . $this->id . "_api_user", FILTER_SANITIZE_SPECIAL_CHARS);
        $api_pass = filter_input(INPUT_POST, "woocommerce_" . $this->id . "_api_pass", FILTER_SANITIZE_SPECIAL_CHARS);


        if (empty($environment)) {
            $validation = false;
            $this->add_error("API URL bilgisini giriniz");
        }
        if (empty($client_id)) {
            $validation = false;

            $this->add_error("ClientID bilgisini giriniz");
        }
        if (empty($api_user)) {
            $validation = false;

            $this->add_error("ApiUser bilgisini giriniz");
        }
        if (empty($api_pass)) {
            $validation = false;

            $this->add_error("ApiPass bilgisini giriniz");
        }

        if (!$validation) {
            echo '<style>.update-nag, .updated { display: none; }</style>';

            $this->display_errors();

            return false;
        } else {
            $saved = parent::process_admin_options();

        }


    }


    public function get_commission_and_installment_info($bin): ?object
    {
        return ($this->has_installment_auth && $this->installment_option == 'yes') ? $this->Gateway->getCommissionAndInstallmentInfo($bin) : null;
    }

    public function get_order_total(): array
    {
        $currency = get_woocommerce_currency_symbol();

        return ['total' => WC()->cart->total, 'currency_symbol' => $currency
        ];

    }

    function callback_handler()
    {
        global $woocommerce;

        $ae_order_id = isset($_POST['OrderId']) ? $_POST['OrderId'] : null;
        $order_id = isset($_POST['OrderId']) ? explode("_", $_POST['OrderId'])[0] : null;
        $order = wc_get_order($order_id);
        $this->Gateway->setPost($_POST);

        if ($this->Gateway->isSuccessfull()) {
            $paymentCheck = $this->Gateway->inquiry($ae_order_id);
            if ($paymentCheck->BankResponseCode == "00") {
                $order->payment_complete();
                $woocommerce->cart->empty_cart();
                wp_redirect($this->get_return_url($order));
                exit;
            } else {
                $err_message = $paymentCheck->BankResponseCode . " - " . $paymentCheck->BankResponseMessage;
                wc_add_notice((string)$err_message, 'error');
                setcookie("message", $err_message, time() + 3600);
                wp_redirect(wc_get_checkout_url());
                exit;
            }
        } else {
            $err_message = $_POST["BankResponseCode"] . " - " . $_POST["BankResponseMessage"];
            wc_add_notice((string)$err_message, 'error');
            setcookie("message", $err_message, time() + 3600);
            wp_redirect(wc_get_checkout_url());
            exit;
        }
    }

    public function process_payment($order_id)
    {

        $installment = filter_input(INPUT_POST, $this->id . '-installment-rate', FILTER_SANITIZE_SPECIAL_CHARS);
        $this->installment = $installment ? $installment : 1;

        $card_expiry_month = filter_input(INPUT_POST, $this->id . '-card-expiry-month', FILTER_SANITIZE_SPECIAL_CHARS);
        $card_expiry_year = filter_input(INPUT_POST, $this->id . '-card-expiry-year', FILTER_SANITIZE_SPECIAL_CHARS);


        $callback_url = get_site_url() . "/?wc-api=" . $this->id;
        $alttantire_order_id = $order_id . "_AE" . rand(999, 99999);


        $extra_fee = 0;

        if (isset($_COOKIE['gtw_tmp'])) {
            $tmp = json_decode(stripcslashes((string)$_COOKIE['gtw_tmp']));
            $extra_fee = isset($tmp->extra_fee) ? $tmp->extra_fee : 0;
        }


        unset($_COOKIE["gtw_tmp"]);
        setcookie("gtw_tmp", '', time() - (15 * 60));

        $order_total_amount = $this->get_order_total()["total"] + $extra_fee;

        $result = $this->Gateway->threeDPayment($callback_url, $order_total_amount * 100, $this->installment, $alttantire_order_id);

        $this->threed_session_id = $result->ThreeDSessionId;

        $this->card = [
            'owner_name' => $_POST[$this->id . '-cc-name'],
            'number' => preg_replace("/\s+/", "", $_POST[$this->id . '-card-number']),
            'expire_month' => $card_expiry_month,
            'expire_year' => $card_expiry_year,
            'expire_date' => $card_expiry_month . "" . $card_expiry_year,
            'cvc' => $_POST[$this->id . '-card-cvc']
        ];

        $threeDhtml = $this->payThreeD();

        return [
            'result' => 'success',
            'messages' => "$threeDhtml",
        ];

    }

    public function payThreeD()
    {

        $form = "<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.0 Transitional//EN\">";
        $form .= "<html>";
        $form .= "<body>";
        $form .= "<form action=\"" . $this->payment_url . "\" method=\"post\" id=\"threed_form\"/>";

        $form .= "<input type=\"hidden\" name=\"ThreeDSessionId\" value=\"" . $this->threed_session_id . "\"/>";

        $form .= "<input type=\"hidden\" name=\"CardHolderName\" value=\"" . $this->card['owner_name'] . "\"/>";

        $form .= "<input type=\"hidden\" name=\"CardNo\" value=\"" . $this->card['number'] . "\"/>";

        $form .= "<input type=\"hidden\" name=\"Cvv\" value=\"" . $this->card['cvc'] . "\"/>";

        $form .= "<input type=\"hidden\" name=\"ExpireDate\" value=\"" . $this->card['expire_date'] . "\"/>";

        $form .= "<input type=\"hidden\" name=\"installment\" value=\"" . $this->installment . "\"/>";

        $form .= "<input type=\"submit\" value=\"Öde\" style=\"display:none;\"/>";
        $form .= "<noscript>";
        $form .= "<br/>";
        $form .= "<br/>";
        $form .= "<center>";
        $form .= "<h1>3D Secure Yönlendirme İşlemi</h1>";
        $form .= "<h2>Javascript internet tarayıcınızda kapatılmış veya desteklenmiyor.<br/></h2>";
        $form .= "<h3>Lütfen banka 3D Secure sayfasına yönlenmek için tıklayınız.</h3>";
        $form .= "<input type=\"submit\" value=\"3D Secure Sayfasına Yönlen\">";
        $form .= "</center>";
        $form .= "</noscript>";
        $form .= "</form>";
        $form .= "</body>";
        $form .= "<script>document.getElementById(\"threed_form\").submit();</script>";
        $form .= "</html>";

        return $form;
    }

    public function payment_fields()
    {
        wp_enqueue_script('jquery-payment-min', WP_PLUGIN_URL . '/wc-alttantire-gateway/assets/js/jquery.payment.min.js?ver=3.0.0-wc.7.3.0');
        wp_enqueue_script('credit-card-form-min', WP_PLUGIN_URL . '/wc-alttantire-gateway/assets/js/credit-card-form.min.js');

        if ($this->description) {
            if (!$this->verified) {
                $this->description = 'Sanal POS ile ödeme ayarları doğru yapılandırılmamış. Lütfen Sanal POS ayarlarını kontrol ediniz.';
                $this->description = trim($this->description);

                echo wpautop(wp_kses_post($this->description));
                return;
            }
            echo wpautop(wp_kses_post($this->description));
        }

        do_action('woocommerce_credit_card_form_start', $this->id);

        ob_start();
        echo '<fieldset id="wc-' . esc_attr($this->id) . '-cc-form" class="wc-credit-card-form wc-payment-form" style="background:transparent;">';

        ?>

        <div class="form-row form-row-wide">
            <label for="<?php echo $this->id ?>-cc-name"><?php echo __('Ad Soyad', WIG_TEXT_DOMAIN) ?> <span
                        class="required">*</span></label>
            <input type="text" class="input-text "
                   placeholder="<?php echo __('Kart Üzerindeki Ad Soyad', WIG_TEXT_DOMAIN) ?>"
                   name="<?php echo $this->id ?>-cc-name" id="<?php echo $this->id ?>-cc-name"/>
        </div>

        <div class="form-row form-row-wide">
            <label for="<?php echo $this->id ?>-card-number"><?php echo __('Kart Numarası', WIG_TEXT_DOMAIN) ?> <span
                        class="required">*</span></label>

            <input id="<?php echo $this->id ?>-card-number" name="<?php echo $this->id ?>-card-number"
                   class="input-text wc-credit-card-form-card-number"
                   inputmode="numeric" autocomplete="cc-number" autocorrect="no" autocapitalize="no" spellcheck="no"
                   type="tel" placeholder="•••• •••• •••• ••••" style="font-size: unset">
        </div>

        <div class="form-row form-row-wide" style="margin-bottom: 1px">
            <label><?php echo __('Son Kullanım Tarihi', WIG_TEXT_DOMAIN) ?> <span class="required">*</span></label>
        </div>

        <div class="form-row form-row-first">
            <select class="input-text" id="<?php echo $this->id ?>-card-expiry-month"
                    name="<?php echo $this->id ?>-card-expiry-month">

                <option disabled selected value><?php echo __('Ay', WIG_TEXT_DOMAIN) ?></option>
                <?php

                for ($i = 1; $i < 13; $i++) {
                    echo '<option value="' . str_pad($i, 2, '0', STR_PAD_LEFT) . '">' . str_pad($i, 2, '0', STR_PAD_LEFT)
                        . '</option>';
                }
                ?>
            </select>
        </div>

        <div class="form-row form-row-last">
            <select class="input-text" id="<?php echo $this->id ?>-card-expiry-year"
                    name="<?php echo $this->id ?>-card-expiry-year">
                <option disabled selected value><?php echo __('Yıl', WIG_TEXT_DOMAIN) ?></option>

                <?php

                for ($i = date("y"); $i < date("y") + 10; $i++) {
                    echo '<option value="' . str_pad($i, 2, '0', STR_PAD_LEFT) . '">' . str_pad($i, 2, '0', STR_PAD_LEFT)
                        . '</option>';
                }
                ?>
            </select>
        </div>

        <div class="form-row form-row-wide">
            <label for="<?php echo $this->id ?>-card-cvc"><?php echo __('Güvenlik Kodu (CVC)', WIG_TEXT_DOMAIN) ?> <span
                        class="required">*</span></label>
            <input id="<?php echo $this->id ?>-card-cvc" name="<?php echo $this->id ?>-card-cvc" type="password"
                   autocomplete="off"
                   placeholder="Cvc" class="input-text wc-credit-card-form-card-cvc" style="font-size: unset">
        </div>

        <div class="clear"></div>

        <?php
        if ($this->has_installment_auth && $this->installment_option == 'yes') {
            ?>
            <div class="form-row form-row-wide installment-table-div" style="display: none;">
                <label for="<?php echo $this->id ?>-installment">Taksit Sayısı</label>
                <table>
                    <thead>
                    <th>#</th>
                    <th>Vade</th>
                    <th>Toplam Tutar</th>
                    </thead>
                    <tbody id="installment_table"></tbody>
                </table>
            </div>
        <?php } ?>

        <div class="clear"></div>
        </fieldset>

        <?php
        $output = ob_get_contents();
        ob_end_clean();

        do_action('woocommerce_credit_card_form_end', $this->id);
        echo $output;
    }

    public function init_form_fields()
    {
        $this->form_fields = [
            'enabled' => [
                'title' => __('Aktif/Pasif', WIG_TEXT_DOMAIN),
                'type' => 'checkbox',
                'label' => __('Sanal POS 3D Ödeme Modülü Aktif', WIG_TEXT_DOMAIN),
                'default' => 'yes'
            ],
            'title' => [
                'title' => __('Başlık', 'woocommerce'),
                'type' => 'text',
                'description' => __('Bu, kullanıcının ödeme sırasında gördüğü ödeme yöntemi başlığını belirtir.', WIG_TEXT_DOMAIN),
                'default' => __('Kredi kartı ile Ödeme', WIG_TEXT_DOMAIN),
                'desc_tip' => true,
            ],
            'description' => [
                'title' => __('Açıklama', WIG_TEXT_DOMAIN),
                'type' => 'textarea',
                'description' => __('Müşteriye gösterilecek ödeme yöntemi açıklaması', WIG_TEXT_DOMAIN),
                'default' => __('Kredi Kartı / Banka Kartı ile ödeme', WIG_TEXT_DOMAIN)
            ],
            'environment' => [
                'title' => __('API URL', WIG_TEXT_DOMAIN),
                'type' => 'text',
                'description' => '',
                'default' => '',
            ],
            'client_id' => [
                'title' => __('Client ID', WIG_TEXT_DOMAIN),
                'type' => 'text',
                'description' => '',
                'default' => '',
            ],
            'api_user' => [
                'title' => __('API User', WIG_TEXT_DOMAIN),
                'type' => 'text',
                'description' => '',
                'default' => '',
            ],
            'api_pass' => [
                'title' => __('API Pass', WIG_TEXT_DOMAIN),
                'type' => 'text',
                'description' => '',
                'default' => '',
            ],

            'installment' => [
                'title' => __('Taksit', WIG_TEXT_DOMAIN),
                'type' => 'checkbox',
                'label' => __('Taksit seçenekleri gösterilsin', WIG_TEXT_DOMAIN),
                'default' => 'no'
            ],

        ];
    }

    public function validate_fields()
    {

        if (empty($_POST[$this->id . '-cc-name'])) {
            wc_add_notice(__('Kart üzerindeki isim soyisim bilgisini eksiksiz giriniz', WIG_TEXT_DOMAIN), 'error');
            return false;
        }

        if (empty($_POST[$this->id . '-card-number']) || strlen((string)$_POST[$this->id . '-card-number']) < 15) {
            wc_add_notice(__('Kart numarasını eksiksiz giriniz', WIG_TEXT_DOMAIN), 'error');
            return false;
        }

        if (empty($_POST[$this->id . '-card-expiry-month'])) {
            wc_add_notice(__('Son kullanma tarihi AY bilgisini giriniz', WIG_TEXT_DOMAIN), 'error');
            return false;
        }

        if (empty($_POST[$this->id . '-card-expiry-year'])) {
            wc_add_notice(__('Son kullanma tarihi YIL bilgisini giriniz', WIG_TEXT_DOMAIN), 'error');
            return false;
        }

        if (empty($_POST[$this->id . '-card-cvc']) || strlen((string)$_POST[$this->id . '-card-cvc']) < 3) {
            wc_add_notice(__('Kartın arka tarafındaki güvenlik kodunu eksiksiz giriniz', WIG_TEXT_DOMAIN), 'error');
            return false;
        }

        if ($this->has_installment_auth && $this->installment_option == 'yes' && empty($_POST[$this->id . '-installment-rate'])) {
            wc_add_notice(__('Taksit adedini seçiniz', WIG_TEXT_DOMAIN), 'error');
            return false;
        }


        return true;

    }


    function dd_notice($message, $type)
    {
        if (is_admin()) {
            update_option('dd_notice', $message);
        } else {
//            wc_add_notice(__($message, 'woocommerce'), $type);
        }
    }

    function dd_add_notice()
    {
        if (get_option('dd_notice')) {
            echo sprintf(
                '<div class="notice notice-error"><p>HATA! %s</p></div>',
                get_option('dd_notice')
            );
        }
    }

    function dd_remove_notice()
    {
        if (isset($_GET['dd_remove_notice'])) {
            delete_option('dd_notice');
        }
    }


}



