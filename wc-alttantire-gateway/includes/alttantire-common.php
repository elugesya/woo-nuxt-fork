<?php
/**
 * Copyright (c) 2021
 * @author: Alttantire Yazılım Çözümleri <info@alttantire.com>
 * Web: https://www.alttantire.com
 *
 */

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly
if(!class_exists('WIG_Common')){
    class WIG_Common{
        public static function simple_crypt($string, $action = 'e'){
            $secret_key = 'alttantire';
            $secret_iv = 'alttantire';

            $output = false;
            $encrypt_method = "AES-256-CBC";
            $key = hash( 'sha256', $secret_key );
            $iv = substr( hash( 'sha256', $secret_iv ), 0, 16 );

            if( $action == 'e' ) {
                $output = base64_encode( openssl_encrypt( $string, $encrypt_method, $key, 0, $iv ) );
            }
            else if( $action == 'd' ){
                $output = openssl_decrypt( base64_decode( $string ), $encrypt_method, $key, 0, $iv );
            }

            return $output;
        }
    }
}
