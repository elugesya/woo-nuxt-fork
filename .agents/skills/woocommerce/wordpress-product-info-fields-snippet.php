<?php
/**
 * WordPress Code Snippet: Add Product Info Tabs Fields to WooCommerce Products
 *
 * Instructions:
 * 1. Install the "Code Snippets" plugin in WordPress
 * 2. Add a new snippet with this code
 * 3. Activate the snippet
 * 4. New fields will appear on product edit pages
 */

// Add custom fields to WooCommerce product admin
add_action('woocommerce_product_options_general_product_data', 'woo_add_product_info_fields');

function woo_add_product_info_fields() {
    echo '<div class="options_group show_if_simple show_if_variable">';

    // Kullanım ve Bakım (Usage & Maintenance)
    woocommerce_wp_textarea_input(
        array(
            'id'          => '_usage_maintenance_content',
            'label'       => __('Kullanım ve Bakım', 'woocommerce'),
            'placeholder' => __('Usage and maintenance information...', 'woocommerce'),
            'desc_tip'    => true,
            'description' => __('This content will appear in the "Kullanım ve Bakım" tab on the product page.', 'woocommerce'),
        )
    );

    // Onarım Talimatları (Repair Instructions)
    woocommerce_wp_textarea_input(
        array(
            'id'          => '_repair_instructions_content',
            'label'       => __('Onarım Talimatları', 'woocommerce'),
            'placeholder' => __('Repair instructions...', 'woocommerce'),
            'desc_tip'    => true,
            'description' => __('This content will appear in the "Onarım Talimatları" tab on the product page.', 'woocommerce'),
        )
    );

    // Garanti Koşulları (Warranty Conditions)
    woocommerce_wp_textarea_input(
        array(
            'id'          => '_warranty_conditions_content',
            'label'       => __('Garanti Koşulları', 'woocommerce'),
            'placeholder' => __('Warranty conditions...', 'woocommerce'),
            'desc_tip'    => true,
            'description' => __('This content will appear in the "Garanti Koşulları" tab on the product page.', 'woocommerce'),
        )
    );

    echo '</div>';
}

// Save custom fields
add_action('woocommerce_process_product_meta', 'woo_save_product_info_fields');

function woo_save_product_info_fields($post_id) {
    $usage_maintenance = isset($_POST['_usage_maintenance_content']) ? sanitize_textarea_field($_POST['_usage_maintenance_content']) : '';
    $repair_instructions = isset($_POST['_repair_instructions_content']) ? sanitize_textarea_field($_POST['_repair_instructions_content']) : '';
    $warranty_conditions = isset($_POST['_warranty_conditions_content']) ? sanitize_textarea_field($_POST['_warranty_conditions_content']) : '';

    update_post_meta($post_id, '_usage_maintenance_content', $usage_maintenance);
    update_post_meta($post_id, '_repair_instructions_content', $repair_instructions);
    update_post_meta($post_id, '_warranty_conditions_content', $warranty_conditions);
}

// Expose fields to WPGraphQL API
add_filter('graphql_product_fields', 'woo_expose_product_info_to_graphql', 10, 3);

function woo_expose_product_info_to_graphql($fields, $type_name, $type) {
    // Note: metaData is already exposed by WPGraphQL for WooCommerce
    // These fields will automatically be available in the metaData array
    return $fields;
}
