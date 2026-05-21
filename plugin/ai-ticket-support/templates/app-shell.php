<?php
/**
 * Standalone HTML shell for the React app.
 * No WordPress theme header/footer — just the bare minimum to mount the app.
 *
 * $page_title and $mode are set by Pages::maybe_serve_app() before this include.
 */
declare(strict_types=1);

defined('ABSPATH') || exit;

// Enqueue scripts/styles so wp_head() / wp_footer() output them
do_action('wp_enqueue_scripts');

?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo esc_html($page_title ?? get_bloginfo('name')); ?></title>
    <base href="<?php echo esc_url(ATS_URL . 'assets/dist/'); ?>">
    <?php wp_head(); ?>
</head>
<body>
    <div id="root"></div>
    <?php wp_footer(); ?>
</body>
</html>
