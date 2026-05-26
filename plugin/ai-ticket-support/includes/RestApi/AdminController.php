<?php
declare(strict_types=1);

namespace ATS\RestApi;

use ATS\Database;
use WP_REST_Request;
use WP_REST_Response;
use WP_Error;

/**
 * Admin-only endpoints.
 *
 * Tickets
 *   GET  /ats/v1/admin/tickets
 *   PUT  /ats/v1/admin/tickets/:id
 *   POST /ats/v1/admin/tickets/:id/messages
 *
 * Categories
 *   GET    /ats/v1/admin/categories
 *   POST   /ats/v1/admin/categories
 *   PUT    /ats/v1/admin/categories/:id
 *   DELETE /ats/v1/admin/categories/:id
 *
 * Saved Answers
 *   GET    /ats/v1/admin/saved-answers
 *   POST   /ats/v1/admin/saved-answers
 *   PUT    /ats/v1/admin/saved-answers/:id
 *   DELETE /ats/v1/admin/saved-answers/:id
 */
final class AdminController extends AbstractController {

    public function register_routes(): void {
        $admin = [$this, 'require_admin'];

        // Tickets list + update
        register_rest_route(self::NAMESPACE, '/admin/tickets', [
            ['methods' => 'GET', 'callback' => [$this, 'tickets_index'], 'permission_callback' => $admin,
             'args' => [
                'page'     => ['type' => 'integer', 'default' => 1, 'minimum' => 1],
                'per_page' => ['type' => 'integer', 'default' => 20, 'minimum' => 1, 'maximum' => 100],
                'status'   => ['type' => 'string',  'default' => ''],
                'priority' => ['type' => 'string',  'default' => ''],
                'search'   => ['type' => 'string',  'default' => '', 'sanitize_callback' => 'sanitize_text_field'],
             ]],
        ]);

        register_rest_route(self::NAMESPACE, '/admin/tickets/(?P<id>\d+)', [
            ['methods' => 'PUT',    'callback' => [$this, 'tickets_update'],  'permission_callback' => $admin,
             'args' => [
                'id'     => ['type' => 'integer'],
                'status' => ['type' => 'string', 'required' => true,
                             'enum' => ['unreviewed', 'reviewing', 'pending', 'answered', 'closed', 'spam', 'ai_resolved']],
             ]],
            ['methods' => 'DELETE', 'callback' => [$this, 'tickets_destroy'], 'permission_callback' => $admin,
             'args' => ['id' => ['type' => 'integer']]],
        ]);

        register_rest_route(self::NAMESPACE, '/admin/tickets/(?P<id>\d+)/messages', [
            ['methods' => 'POST', 'callback' => [$this, 'tickets_reply'], 'permission_callback' => $admin,
             'args' => [
                'id'   => ['type' => 'integer'],
                'body' => ['type' => 'string', 'required' => true, 'sanitize_callback' => 'wp_kses_post'],
             ]],
        ]);

        // Categories
        register_rest_route(self::NAMESPACE, '/admin/categories', [
            ['methods' => 'GET',  'callback' => [$this, 'categories_index'],  'permission_callback' => $admin],
            ['methods' => 'POST', 'callback' => [$this, 'categories_store'],  'permission_callback' => $admin,
             'args' => [
                'title'       => ['type' => 'string', 'required' => true, 'sanitize_callback' => 'sanitize_text_field', 'maxLength' => 255],
                'description' => ['type' => 'string', 'default' => '', 'sanitize_callback' => 'sanitize_textarea_field'],
             ]],
        ]);

        register_rest_route(self::NAMESPACE, '/admin/categories/(?P<id>\d+)', [
            ['methods' => 'PUT',    'callback' => [$this, 'categories_update'], 'permission_callback' => $admin,
             'args' => [
                'id'          => ['type' => 'integer'],
                'title'       => ['type' => 'string', 'required' => true, 'sanitize_callback' => 'sanitize_text_field'],
                'description' => ['type' => 'string', 'default' => '', 'sanitize_callback' => 'sanitize_textarea_field'],
             ]],
            ['methods' => 'DELETE', 'callback' => [$this, 'categories_destroy'], 'permission_callback' => $admin,
             'args' => ['id' => ['type' => 'integer']]],
        ]);

        // Saved answers
        register_rest_route(self::NAMESPACE, '/admin/saved-answers', [
            ['methods' => 'GET',  'callback' => [$this, 'answers_index'],  'permission_callback' => $admin],
            ['methods' => 'POST', 'callback' => [$this, 'answers_store'],  'permission_callback' => $admin,
             'args' => [
                'title'       => ['type' => 'string',  'required' => true, 'sanitize_callback' => 'sanitize_text_field'],
                'body'        => ['type' => 'string',  'required' => true, 'sanitize_callback' => 'wp_kses_post'],
                'category_id' => ['type' => 'integer', 'default' => null],
             ]],
        ]);

        register_rest_route(self::NAMESPACE, '/admin/saved-answers/(?P<id>\d+)', [
            ['methods' => 'PUT',    'callback' => [$this, 'answers_update'],  'permission_callback' => $admin,
             'args' => [
                'id'          => ['type' => 'integer'],
                'title'       => ['type' => 'string',  'required' => true, 'sanitize_callback' => 'sanitize_text_field'],
                'body'        => ['type' => 'string',  'required' => true, 'sanitize_callback' => 'wp_kses_post'],
                'category_id' => ['type' => 'integer', 'default' => null],
             ]],
            ['methods' => 'DELETE', 'callback' => [$this, 'answers_destroy'], 'permission_callback' => $admin,
             'args' => ['id' => ['type' => 'integer']]],
        ]);
    }

    // ── Tickets ───────────────────────────────────────────────────────────────

    public function tickets_index(WP_REST_Request $req): WP_REST_Response {
        $db      = Database::instance();
        $page    = (int) $req->get_param('page');
        $per     = (int) $req->get_param('per_page');
        $filters = array_filter([
            'status'   => $req->get_param('status'),
            'priority' => $req->get_param('priority'),
            'search'   => $req->get_param('search'),
        ]);

        $tickets = $db->get_all_tickets($filters, $page, $per);
        $total   = $db->count_all_tickets($filters);

        $statuses = ['unreviewed', 'reviewing', 'pending', 'answered', 'closed', 'spam', 'ai_resolved'];
        $counts   = ['all' => $db->count_all_tickets([])];
        foreach ($statuses as $s) {
            $counts[$s] = $db->count_all_tickets(['status' => $s]);
        }

        return $this->ok([
            'items'       => array_map([$this, 'format_ticket'], $tickets),
            'total'       => $total,
            'page'        => $page,
            'total_pages' => (int) ceil($total / $per),
            'counts'      => $counts,
            'aiResolved'  => $db->count_ai_resolved(),
        ]);
    }

    public function tickets_update(WP_REST_Request $req): WP_REST_Response|WP_Error {
        $db     = Database::instance();
        $id     = (int) $req->get_param('id');
        $status = $req->get_param('status');

        $ticket = $db->get_ticket($id);
        if ($ticket === null) {
            return $this->not_found('Ticket not found.');
        }

        $db->update_ticket_status($id, $status);
        return $this->ok($this->format_ticket($db->get_ticket($id)));
    }

    public function tickets_destroy(WP_REST_Request $req): WP_REST_Response|WP_Error {
        $db = Database::instance();
        $id = (int) $req->get_param('id');

        if ($db->get_ticket($id) === null) {
            return $this->not_found('Ticket not found.');
        }

        $db->delete_ticket($id);
        return $this->ok(['deleted' => $id]);
    }

    public function tickets_reply(WP_REST_Request $req): WP_REST_Response|WP_Error {
        $db     = Database::instance();
        $id     = (int) $req->get_param('id');
        $body   = $req->get_param('body');

        $ticket = $db->get_ticket($id);
        if ($ticket === null) {
            return $this->not_found('Ticket not found.');
        }
        if (in_array($ticket['status'], ['closed', 'ai_resolved'], true)) {
            return $this->error('ticket_closed', 'This ticket is closed.', 422);
        }

        $msg_id = $db->create_message($id, get_current_user_id(), 'support', $body);
        if ($msg_id === false) {
            return $this->error('db_error', 'Failed to send reply.', 500);
        }

        $db->update_ticket_status($id, 'pending');

        $messages   = $db->get_messages($id);
        $att_by_msg = $this->group_attachments($db->get_attachments_for_ticket($id));
        return $this->created(['messages' => array_map(fn($m) => $this->format_message($m, $att_by_msg[(string) $m['id']] ?? []), $messages)]);
    }

    private function group_attachments(array $all): array {
        $grouped = [];
        foreach ($all as $a) {
            if ($a['message_id']) {
                $grouped[(string) $a['message_id']][] = [
                    'id'       => (string) $a['id'],
                    'url'      => $a['file_url'],
                    'filename' => $a['filename'],
                    'size'     => (int) $a['file_size'],
                    'mimeType' => $a['mime_type'],
                ];
            }
        }
        return $grouped;
    }

    // ── Categories ────────────────────────────────────────────────────────────

    public function categories_index(): WP_REST_Response {
        $cats = Database::instance()->get_categories();
        return $this->ok(array_map([$this, 'format_category'], $cats));
    }

    public function categories_store(WP_REST_Request $req): WP_REST_Response|WP_Error {
        $id = Database::instance()->create_category(
            $req->get_param('title'),
            $req->get_param('description') ?? ''
        );
        if ($id === false) {
            return $this->error('db_error', 'Failed to create category.', 500);
        }
        $cats = Database::instance()->get_categories();
        $cat  = current(array_filter($cats, fn($c) => (int) $c['id'] === $id));
        return $this->created($this->format_category($cat));
    }

    public function categories_update(WP_REST_Request $req): WP_REST_Response|WP_Error {
        $db = Database::instance();
        $id = (int) $req->get_param('id');

        $ok = $db->update_category($id, $req->get_param('title'), $req->get_param('description') ?? '');
        if (! $ok) {
            return $this->not_found('Category not found.');
        }

        $cats = $db->get_categories();
        $cat  = current(array_filter($cats, fn($c) => (int) $c['id'] === $id));
        return $this->ok($this->format_category($cat ?: []));
    }

    public function categories_destroy(WP_REST_Request $req): WP_REST_Response|WP_Error {
        $ok = Database::instance()->delete_category((int) $req->get_param('id'));
        return $ok ? $this->no_content() : $this->not_found('Category not found.');
    }

    // ── Saved Answers ─────────────────────────────────────────────────────────

    public function answers_index(): WP_REST_Response {
        $answers = Database::instance()->get_saved_answers();
        return $this->ok(array_map([$this, 'format_answer'], $answers));
    }

    public function answers_store(WP_REST_Request $req): WP_REST_Response|WP_Error {
        $cat_id = $req->get_param('category_id') ? (int) $req->get_param('category_id') : null;
        $id     = Database::instance()->create_saved_answer(
            $req->get_param('title'),
            $req->get_param('body'),
            $cat_id
        );
        if ($id === false) {
            return $this->error('db_error', 'Failed to create saved answer.', 500);
        }
        $answers = Database::instance()->get_saved_answers();
        $answer  = current(array_filter($answers, fn($a) => (int) $a['id'] === $id));
        return $this->created($this->format_answer($answer));
    }

    public function answers_update(WP_REST_Request $req): WP_REST_Response|WP_Error {
        $db     = Database::instance();
        $id     = (int) $req->get_param('id');
        $cat_id = $req->get_param('category_id') ? (int) $req->get_param('category_id') : null;

        $ok = $db->update_saved_answer($id, $req->get_param('title'), $req->get_param('body'), $cat_id);
        if (! $ok) {
            return $this->not_found('Saved answer not found.');
        }

        $answers = $db->get_saved_answers();
        $answer  = current(array_filter($answers, fn($a) => (int) $a['id'] === $id));
        return $this->ok($this->format_answer($answer ?: []));
    }

    public function answers_destroy(WP_REST_Request $req): WP_REST_Response|WP_Error {
        $ok = Database::instance()->delete_saved_answer((int) $req->get_param('id'));
        return $ok ? $this->no_content() : $this->not_found('Saved answer not found.');
    }

    // ── Formatters ────────────────────────────────────────────────────────────

    private function format_ticket(array $t): array {
        $raw_body = strip_tags((string) ($t['first_body'] ?? ''));
        $raw_body = preg_replace('/\s+/', ' ', trim($raw_body));
        $preview  = mb_strlen($raw_body) > 120 ? mb_substr($raw_body, 0, 120) . '…' : $raw_body;

        return [
            'id'            => (string) $t['id'],
            'userId'        => (int) $t['user_id'],
            'user'          => $t['user_name'] ?? '',
            'title'         => $t['title'],
            'state'         => $t['status'],
            'priority'      => $t['priority'],
            'categoryId'    => $t['category_id'] ? (int) $t['category_id'] : null,
            'categoryTitle' => $t['category_title'] ?? null,
            'preview'       => $preview,
            'createdAt'     => $t['created_at'],
            'updatedAt'     => $t['updated_at'],
        ];
    }

    private function format_message(array $m, array $attachments = []): array {
        return [
            'id'          => (string) $m['id'],
            'ticketId'    => (string) $m['ticket_id'],
            'authorType'  => $m['author_type'],
            'authorName'  => $m['author_name'] ?? ($m['author_type'] === 'support' ? 'پشتیبان' : 'کاربر'),
            'body'        => $m['body'],
            'createdAt'   => $m['created_at'],
            'attachments' => $attachments,
        ];
    }

    private function format_category(array $c): array {
        return [
            'id'          => (string) $c['id'],
            'title'       => $c['title'],
            'description' => $c['description'] ?? '',
            'count'       => (int) ($c['answer_count'] ?? 0),
        ];
    }

    private function format_answer(array $a): array {
        return [
            'id'            => (int) $a['id'],
            'categoryId'    => $a['category_id'] ? (int) $a['category_id'] : null,
            'categoryTitle' => $a['category_title'] ?? null,
            'title'         => $a['title'],
            'body'          => $a['body'],
            'createdAt'     => $a['created_at'],
            'updatedAt'     => $a['updated_at'],
        ];
    }
}
