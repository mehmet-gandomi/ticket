<?php
/**
 * Fully standalone HTML shell — zero WordPress theme output.
 * Reads the Vite manifest directly and outputs only this plugin's assets.
 */
declare(strict_types=1);

defined('ABSPATH') || exit;

$manifest_path = ATS_DIR . 'assets/dist/.vite/manifest.json';
if (! file_exists($manifest_path)) {
    wp_die('AI Ticket Support: asset manifest not found. Run <code>npm run build</code> first.', 500);
}

$manifest = json_decode((string) file_get_contents($manifest_path), true);
$entry    = $manifest['src/main.tsx'] ?? null;
if ($entry === null) {
    wp_die('AI Ticket Support: entry point missing from manifest.', 500);
}

$dist_url  = ATS_URL . 'assets/dist/';
$mode      = get_query_var('ats_page');
$user      = wp_get_current_user();

// Parse the path portion so React Router basename works regardless of
// whether WordPress is installed in a subdirectory (e.g. /wordpress/).
$user_path  = (string) parse_url(home_url('helpdesk'),       PHP_URL_PATH);
$admin_path = (string) parse_url(home_url('helpdesk-admin'), PHP_URL_PATH);
$base_path  = $mode === 'admin' ? $admin_path : $user_path;

$config = [
    'mode'      => $mode,
    'restUrl'   => rest_url('ats/v1'),
    'nonce'     => wp_create_nonce('wp_rest'),
    'assetsUrl' => $dist_url,
    'basePath'  => $base_path,
    'user'      => [
        'id'      => $user->ID,
        'name'    => $user->display_name,
        'email'   => $user->user_email,
        'isAdmin' => current_user_can('manage_options'),
    ],
];

?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo esc_html($page_title ?? get_bloginfo('name')); ?></title>
    <?php foreach ($entry['css'] ?? [] as $css_file): ?>
    <link rel="stylesheet" href="<?php echo esc_url($dist_url . $css_file); ?>">
    <?php endforeach; ?>
</head>
<body>
    <div id="root"></div>
    <script>window.atsConfig = <?php echo wp_json_encode($config); ?>;</script>
    <script type="module" src="<?php echo esc_url($dist_url . $entry['file']); ?>"></script>
</body>
</html>
