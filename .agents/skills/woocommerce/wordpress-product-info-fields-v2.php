<?php
/**
 * WordPress Code Snippet: Add Product Info Tabs Fields to WooCommerce Products (Version 2)
 *
 * Instructions:
 * 1. Install the "Code Snippets" plugin in WordPress
 * 2. Add a new snippet with this code
 * 3. Set snippet to run "Everywhere" or "Only in admin area"
 * 4. Activate the snippet
 * 5. Edit a product - fields will appear in a "Ürün Bilgi" tab
 */

// Step 1: Add a custom tab to Product Data
add_filter('woocommerce_product_data_tabs', 'woo_add_product_info_tab', 50);

function woo_add_product_info_tab($tabs) {
    $tabs['product_info'] = array(
        'label'    => __('Ürün Bilgi', 'woocommerce'),
        'target'   => 'product_info_data',
        'priority' => 60,
        'class'    => array('show_if_simple', 'show_if_variable'),
    );
    return $tabs;
}

// Step 2: Add fields to the custom tab
add_action('woocommerce_product_data_panels', 'woo_add_product_info_tab_content');

function woo_add_product_info_tab_content() {
    global $post;

    echo '<div id="product_info_data" class="panel woocommerce_options_panel hidden">';
    echo '<div class="options_group">';

    // Kullanım ve Bakım (Usage & Maintenance)
    woocommerce_wp_textarea_input(
        array(
            'id'          => '_usage_maintenance_content',
            'label'       => __('Kullanım ve Bakım', 'woocommerce'),
            'placeholder' => '',
            'desc_tip'    => true,
            'description' => __('Bu içerik "Kullanım ve Bakım" sekmesinde görünecek.', 'woocommerce'),
        )
    );

    // Onarım Talimatları (Repair Instructions)
    woocommerce_wp_textarea_input(
        array(
            'id'          => '_repair_instructions_content',
            'label'       => __('Onarım Talimatları', 'woocommerce'),
            'placeholder' => '',
            'desc_tip'    => true,
            'description' => __('Bu içerik "Onarım Talimatları" sekmesinde görünecek.', 'woocommerce'),
        )
    );

    // Garanti Koşulları (Warranty Conditions)
    woocommerce_wp_textarea_input(
        array(
            'id'          => '_warranty_conditions_content',
            'label'       => __('Garanti Koşulları', 'woocommerce'),
            'placeholder' => '',
            'desc_tip'    => true,
            'description' => __('Bu içerik "Garanti Koşulları" sekmesinde görünecek.', 'woocommerce'),
        )
    );

    echo '</div>';
    echo '</div>';
}

// Step 3: Save the custom fields
add_action('woocommerce_process_product_meta', 'woo_save_product_info_fields');

function woo_save_product_info_fields($post_id) {
    // Usage & Maintenance
    $usage_maintenance = isset($_POST['_usage_maintenance_content']) ? sanitize_textarea_field($_POST['_usage_maintenance_content']) : '';
    update_post_meta($post_id, '_usage_maintenance_content', $usage_maintenance);

    // Repair Instructions
    $repair_instructions = isset($_POST['_repair_instructions_content']) ? sanitize_textarea_field($_POST['_repair_instructions_content']) : '';
    update_post_meta($post_id, '_repair_instructions_content', $repair_instructions);

    // Warranty Conditions
    $warranty_conditions = isset($_POST['_warranty_conditions_content']) ? sanitize_textarea_field($_POST['_warranty_conditions_content']) : '';
    update_post_meta($post_id, '_warranty_conditions_content', $warranty_conditions);
}
