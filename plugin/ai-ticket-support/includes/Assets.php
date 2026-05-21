<?php
declare(strict_types=1);

namespace ATS;

/**
 * Enqueues the React bundle only on the two custom plugin pages.
 * Reads the Vite manifest to get content-hashed filenames.
 */
final class Assets {

    private static ?self $instance = null;

    private function __construct() {}

    public static function instance(): self {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function enqueue(): void {
        $mode = get_query_var('ats_page');
        if ($mode === '') {
            return;
        }

        $manifest = $this->read_manifest();
        if ($manifest === null) {
            return;
        }

        $entry = $manifest['src/main.tsx'] ?? null;
        if ($entry === null) {
            return;
        }

        $dist = ATS_URL . 'assets/dist/';

        // CSS
        foreach ($entry['css'] ?? [] as $css_file) {
            wp_enqueue_style('ats-app', $dist . $css_file, [], null);
        }

        // JS
        wp_enqueue_script('ats-app', $dist . $entry['file'], [], null, true);

        // Runtime config passed to the React app via window.atsConfig
        $user         = wp_get_current_user();
        $base_path    = '/' . ($mode === 'admin' ? 'helpdesk-admin' : 'helpdesk');
        $config       = [
            'mode'      => $mode,
            'restUrl'   => rest_url('ats/v1'),
            'nonce'     => wp_create_nonce('wp_rest'),
            'assetsUrl' => $dist,
            'basePath'  => $base_path,
            'user'      => [
                'id'      => $user->ID,
                'name'    => $user->display_name,
                'email'   => $user->user_email,
                'isAdmin' => current_user_can('manage_options'),
            ],
        ];

        wp_localize_script('ats-app', 'atsConfig', $config);
    }

    private function read_manifest(): ?array {
        $path = ATS_DIR . 'assets/dist/.vite/manifest.json';
        if (! file_exists($path)) {
            return null;
        }
        $data = json_decode(file_get_contents($path), true);
        return is_array($data) ? $data : null;
    }
}
