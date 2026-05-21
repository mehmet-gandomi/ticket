<?php
declare(strict_types=1);

namespace ATS\RestApi;

use WP_REST_Request;
use WP_REST_Response;
use WP_Error;

abstract class AbstractController {

    protected const NAMESPACE = 'ats/v1';

    abstract public function register_routes(): void;

    // ── Response helpers ─────────────────────────────────────────────────────

    protected function ok(mixed $data, int $status = 200): WP_REST_Response {
        return new WP_REST_Response($data, $status);
    }

    protected function created(mixed $data): WP_REST_Response {
        return new WP_REST_Response($data, 201);
    }

    protected function no_content(): WP_REST_Response {
        return new WP_REST_Response(null, 204);
    }

    protected function error(string $code, string $message, int $status = 400): WP_Error {
        return new WP_Error($code, $message, ['status' => $status]);
    }

    protected function not_found(string $message = 'Not found'): WP_Error {
        return $this->error('not_found', $message, 404);
    }

    protected function forbidden(string $message = 'Access denied'): WP_Error {
        return $this->error('forbidden', $message, 403);
    }

    // ── Permission callbacks (must be public — WordPress calls them via call_user_func) ───

    public function require_logged_in(): bool|WP_Error {
        if (! is_user_logged_in()) {
            return $this->error('not_authenticated', 'You must be logged in.', 401);
        }
        return true;
    }

    public function require_admin(): bool|WP_Error {
        if (! current_user_can('manage_options')) {
            return $this->forbidden();
        }
        return true;
    }
}
