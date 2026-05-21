<?php
declare(strict_types=1);

namespace ATS\RestApi;

use WP_REST_Request;
use WP_REST_Response;

/**
 * GET  /ats/v1/admin/settings  – fetch all plugin settings
 * POST /ats/v1/admin/settings  – persist all plugin settings
 */
final class SettingsController extends AbstractController {

    private const OPTION_KEY = 'ats_settings';

    private const DEFAULTS = [
        'aiEnabled'   => false,
        'brandColor'  => '#3B3214',
        'providers'   => [],
    ];

    public function register_routes(): void {
        $admin = [$this, 'require_admin'];

        register_rest_route(self::NAMESPACE, '/admin/settings', [
            ['methods' => 'GET',  'callback' => [$this, 'show'],  'permission_callback' => $admin],
            ['methods' => 'POST', 'callback' => [$this, 'store'], 'permission_callback' => $admin,
             'args' => [
                'aiEnabled'  => ['type' => 'boolean', 'default' => false],
                'brandColor' => ['type' => 'string',  'default' => '#3B3214',
                                 'sanitize_callback' => 'sanitize_hex_color'],
                'providers'  => ['type' => 'array',   'default' => []],
             ]],
        ]);
    }

    public function show(): WP_REST_Response {
        $settings = get_option(self::OPTION_KEY, self::DEFAULTS);
        return $this->ok(array_merge(self::DEFAULTS, (array) $settings));
    }

    public function store(WP_REST_Request $req): WP_REST_Response {
        $settings = [
            'aiEnabled'  => (bool) $req->get_param('aiEnabled'),
            'brandColor' => sanitize_hex_color($req->get_param('brandColor')) ?: '#3B3214',
            'providers'  => $this->sanitize_providers((array) ($req->get_param('providers') ?? [])),
        ];

        update_option(self::OPTION_KEY, $settings);
        return $this->ok($settings);
    }

    private function sanitize_providers(array $providers): array {
        $allowed_ids = ['chatgpt', 'claude', 'gemini', 'gapcode'];
        $sanitized   = [];

        foreach ($providers as $id => $config) {
            if (! in_array($id, $allowed_ids, true) || ! is_array($config)) {
                continue;
            }
            $sanitized[$id] = [
                'enabled' => (bool) ($config['enabled'] ?? false),
                'apiKey'  => sanitize_text_field($config['apiKey'] ?? ''),
                'model'   => sanitize_text_field($config['model']  ?? ''),
            ];
        }

        return $sanitized;
    }
}
