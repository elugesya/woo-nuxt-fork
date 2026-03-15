<?php
/**
 * Simple Debug Version - Adds fields to a custom meta box
 * Use this if the snippet above doesn't work
 */

// Add a meta box to product edit page
add_action('add_meta_boxes', 'woo_add_product_info_metabox');

function woo_add_product_info_metabox() {
    add_meta_box(
        'woo_product_info_fields',
        __('Ürün Bilgi Sekmeleri İçeriği', 'woocommerce'),
        'woo_product_info_metabox_callback',
        'product',
        'normal',
        'default'
    );
}

// Meta box callback function
function woo_product_info_metabox_callback($post) {
    wp_nonce_field('woo_product_info_nonce', 'woo_product_info_nonce_field');

    echo '<style>.woo-product-info-field { margin-bottom: 15px; } .woo-product-info-field label { display: block; font-weight: bold; margin-bottom: 5px; }</style>';

    // Kullanım ve Bakım
    $usage_value = get_post_meta($post->ID, '_usage_maintenance_content', true);
    echo '<div class="woo-product-info-field">';
    echo '<label for="_usage_maintenance_content">' . __('Kullanım ve Bakım', 'woocommerce') . '</label>';
    echo '<textarea id="_usage_maintenance_content" name="_usage_maintenance_content" rows="5" style="width: 100%;">' . esc_textarea($usage_value) . '</textarea>';
    echo '<p class="description">Bu içerik "Kullanım ve Bakım" sekmesinde görünecek.</p>';
    echo '</div>';

    // Onarım Talimatları
    $repair_value = get_post_meta($post->ID, '_repair_instructions_content', true);
    echo '<div class="woo-product-info-field">';
    echo '<label for="_repair_instructions_content">' . __('Onarım Talimatları', 'woocommerce') . '</label>';
    echo '<textarea id="_repair_instructions_content" name="_repair_instructions_content" rows="5" style="width: 100%;">' . esc_textarea($repair_value) . '</textarea>';
    echo '<p class="description">Bu içerik "Onarım Talimatları" sekmesinde görünecek.</p>';
    echo '</div>';

    // Garanti Koşulları
    $warranty_value = get_post_meta($post->ID, '_warranty_conditions_content', true);
    echo '<div class="woo-product-info-field">';
    echo '<label for="_warranty_conditions_content">' . __('Garanti Koşulları', 'woocommerce') . '</label>';
    echo '<textarea id="_warranty_conditions_content" name="_warranty_conditions_content" rows="5" style="width: 100%;">' . esc_textarea($warranty_value) . '</textarea>';
    echo '<p class="description">Bu içerik "Garanti Koşulları" sekmesinde görünecek.</p>';
    echo '</div>';
}

// Save the meta box data
add_action('save_post', 'woo_save_product_info_metabox_data', 10, 2);

function woo_save_product_info_metabox_data($post_id, $post) {
    // Check nonce
    if (!isset($_POST['woo_product_info_nonce_field']) || !wp_verify_nonce($_POST['woo_product_info_nonce_field'], 'woo_product_info_nonce')) {
        return;
    }

    // Check autosave
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }

    // Check permissions
    if ('product' !== $post->post_type || !current_user_can('edit_post', $post_id)) {
        return;
    }

    // Save fields
    if (isset($_POST['_usage_maintenance_content'])) {
        update_post_meta($post_id, '_usage_maintenance_content', sanitize_textarea_field($_POST['_usage_maintenance_content']));
    }

    if (isset($_POST['_repair_instructions_content'])) {
        update_post_meta($post_id, '_repair_instructions_content', sanitize_textarea_field($_POST['_repair_instructions_content']));
    }

    if (isset($_POST['_warranty_conditions_content'])) {
        update_post_meta($post_id, '_warranty_conditions_content', sanitize_textarea_field($_POST['_warranty_conditions_content']));
    }
}
