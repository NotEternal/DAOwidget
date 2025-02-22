<?php
/**
Plugin Name: Dao Factory
Description: Governance and proposals for your crypto token.
Author: Vitaliy Shulik
Requires PHP: 7.1
Text Domain: daofactory
Domain Path: /lang
Version: 0.1.13
 */

/* Define Plugin Constants */
defined( 'ABSPATH' ) || exit;
define( 'DAOFACTORY_URL', plugin_dir_url( __FILE__ ) );
define( 'DAOFACTORY_BASE_DIR', __DIR__ );
define( 'DAOFACTORY_VER', '0.1.13');

require 'inc/functions.php';
require 'inc/post-type.php';
require 'inc/shortcode.php';
require 'inc/metabox.php';


// First register resources with init
function daofactory_app_init() {

  wp_register_script( 'daofactory-app', DAOFACTORY_URL . 'build/static/js/main.js', array(), DAOFACTORY_VER, false );
	wp_register_style( 'daofactory-app', DAOFACTORY_URL . 'build/static/css/main.css', false, DAOFACTORY_VER, "all");
}

add_action( 'init', 'daofactory_app_init' );

// Function for the short code that call React app
function daofactory_app( $atts ) {
  $a = shortcode_atts( array(
		'ens_space' => 'onout.eth',
    'network_id' => '56',
		'template' => 'light_template',
    'token_address' => '0x92648e4537cdfa1ee743a244465a31aa034b1ce8',
    'token_symbol' => 'SWAP',
    'token_decimals' => '18',
    'hide_service_link' => 'false',
    'required_amount_to_publish' => '5',
    'required_amount_to_vote' => '1',
	), $atts );

  wp_enqueue_script("daofactory-app", DAOFACTORY_VER, true);
  wp_enqueue_style("daofactory-app");

  $html = '
    <div
      id="daofactory_app"
      data-ens="' . esc_attr($a['ens_space']) . '"
      data-network="' . esc_attr($a['network_id']) . '"
      data-token-address="' . esc_attr($a['token_address']) . '"
      data-token-symbol="' . esc_attr($a['token_symbol']) . '"
      data-token-decimals="' . esc_attr($a['token_decimals']) . '"
      data-color-template="' . esc_attr($a['template']) . '"
      data-hide-service-link="' . esc_attr($a['hide_service_link']) . '"
      data-required-amount-to-publish="' . esc_attr($a['required_amount_to_publish']) . '"
      data-required-amount-to-vote="' . esc_attr($a['required_amount_to_vote']) . '"
    ></div>
  ';

  return $html;
}

add_shortcode('daofactory_app', 'daofactory_app');
