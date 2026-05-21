<?php
declare(strict_types=1);

namespace ATS;

final class Plugin {

    private static ?self $instance = null;

    private function __construct() {}

    public static function instance(): self {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public static function activate(): void {
        Database::instance()->install();
        Pages::instance()->flush_rules();
    }

    public static function deactivate(): void {
        flush_rewrite_rules();
    }

    public function boot(): void {
        add_action('init',              [Database::instance(), 'maybe_upgrade']);
        add_action('init',              [Pages::instance(),    'register_rewrite_rules']);
        add_action('template_redirect', [Pages::instance(),    'maybe_serve_app']);
        add_action('wp_enqueue_scripts',[Assets::instance(),   'enqueue']);
        add_action('rest_api_init',     [$this,                'register_rest_routes']);
    }

    public function register_rest_routes(): void {
        (new RestApi\TicketsController())->register_routes();
        (new RestApi\AdminController())->register_routes();
        (new RestApi\SettingsController())->register_routes();
    }
}
