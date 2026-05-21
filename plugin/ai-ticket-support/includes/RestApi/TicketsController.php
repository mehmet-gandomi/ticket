<?php
declare(strict_types=1);

namespace ATS\RestApi;

use ATS\Database;
use WP_REST_Request;
use WP_REST_Response;
use WP_Error;

/**
 * Endpoints for the logged-in user (non-admin).
 *
 * GET    /ats/v1/tickets                  – list own tickets
 * POST   /ats/v1/tickets                  – create ticket (first message included)
 * GET    /ats/v1/tickets/:id              – ticket detail + messages
 * POST   /ats/v1/tickets/:id/messages     – reply to own ticket
 */
final class TicketsController extends AbstractController {

    public function register_routes(): void {
        register_rest_route(self::NAMESPACE, '/tickets', [
            [
                'methods'             => 'GET',
                'callback'            => [$this, 'index'],
                'permission_callback' => [$this, 'require_logged_in'],
                'args'                => [
                    'page'     => ['type' => 'integer', 'default' => 1, 'minimum' => 1],
                    'per_page' => ['type' => 'integer', 'default' => 20, 'minimum' => 1, 'maximum' => 100],
                ],
            ],
            [
                'methods'             => 'POST',
                'callback'            => [$this, 'store'],
                'permission_callback' => [$this, 'require_logged_in'],
                'args'                => [
                    'title'       => ['type' => 'string', 'required' => true, 'sanitize_callback' => 'sanitize_text_field', 'minLength' => 3, 'maxLength' => 255],
                    'body'        => ['type' => 'string', 'required' => true, 'sanitize_callback' => 'wp_kses_post'],
                    'priority'    => ['type' => 'string', 'default' => 'low',  'enum' => ['low', 'medium', 'high']],
                    'category_id' => ['type' => 'integer', 'default' => null],
                ],
            ],
        ]);

        register_rest_route(self::NAMESPACE, '/tickets/(?P<id>\d+)', [
            [
                'methods'             => 'GET',
                'callback'            => [$this, 'show'],
                'permission_callback' => [$this, 'require_logged_in'],
                'args'                => [
                    'id' => ['type' => 'integer'],
                ],
            ],
        ]);

        register_rest_route(self::NAMESPACE, '/tickets/(?P<id>\d+)/messages', [
            [
                'methods'             => 'POST',
                'callback'            => [$this, 'send_message'],
                'permission_callback' => [$this, 'require_logged_in'],
                'args'                => [
                    'id'   => ['type' => 'integer'],
                    'body' => ['type' => 'string', 'required' => true, 'sanitize_callback' => 'wp_kses_post'],
                ],
            ],
        ]);
    }

    public function index(WP_REST_Request $req): WP_REST_Response {
        $db      = Database::instance();
        $user_id = get_current_user_id();
        $page    = (int) $req->get_param('page');
        $per     = (int) $req->get_param('per_page');

        $tickets = $db->get_tickets_for_user($user_id, $page, $per);
        $total   = $db->count_tickets_for_user($user_id);

        $response = $this->ok([
            'items'      => array_map([$this, 'format_ticket'], $tickets),
            'total'      => $total,
            'page'       => $page,
            'total_pages'=> (int) ceil($total / $per),
        ]);
        $response->header('X-WP-Total',      (string) $total);
        $response->header('X-WP-TotalPages', (string) ceil($total / $per));
        return $response;
    }

    public function store(WP_REST_Request $req): WP_REST_Response|WP_Error {
        $db          = Database::instance();
        $user_id     = get_current_user_id();
        $title       = $req->get_param('title');
        $body        = $req->get_param('body');
        $priority    = $req->get_param('priority');
        $category_id = $req->get_param('category_id') ? (int) $req->get_param('category_id') : null;

        $ticket_id = $db->create_ticket($user_id, $title, $priority, $category_id);
        if ($ticket_id === false) {
            return $this->error('db_error', 'Failed to create ticket.', 500);
        }

        $msg_id = $db->create_message($ticket_id, $user_id, 'user', $body);
        if ($msg_id === false) {
            return $this->error('db_error', 'Ticket created but message failed.', 500);
        }

        $ticket = $db->get_ticket($ticket_id);
        return $this->created($this->format_ticket($ticket));
    }

    public function show(WP_REST_Request $req): WP_REST_Response|WP_Error {
        $db      = Database::instance();
        $id      = (int) $req->get_param('id');
        $ticket  = $db->get_ticket($id);

        if ($ticket === null) {
            return $this->not_found('Ticket not found.');
        }

        // Users can only view their own tickets
        if ((int) $ticket['user_id'] !== get_current_user_id() && ! current_user_can('manage_options')) {
            return $this->forbidden();
        }

        $messages = $db->get_messages($id);

        return $this->ok([
            'ticket'   => $this->format_ticket($ticket),
            'messages' => array_map([$this, 'format_message'], $messages),
        ]);
    }

    public function send_message(WP_REST_Request $req): WP_REST_Response|WP_Error {
        $db      = Database::instance();
        $id      = (int) $req->get_param('id');
        $user_id = get_current_user_id();
        $body    = $req->get_param('body');

        $ticket = $db->get_ticket($id);
        if ($ticket === null) {
            return $this->not_found('Ticket not found.');
        }
        if ((int) $ticket['user_id'] !== $user_id && ! current_user_can('manage_options')) {
            return $this->forbidden();
        }
        if ($ticket['status'] === 'closed') {
            return $this->error('ticket_closed', 'This ticket is closed.', 422);
        }

        $is_admin  = current_user_can('manage_options');
        $author    = $is_admin ? 'support' : 'user';
        $new_status = $is_admin ? 'pending' : 'unreviewed';

        $msg_id = $db->create_message($id, $user_id, $author, $body);
        if ($msg_id === false) {
            return $this->error('db_error', 'Failed to send message.', 500);
        }

        $db->update_ticket_status($id, $new_status);

        $messages = $db->get_messages($id);
        return $this->created([
            'messages' => array_map([$this, 'format_message'], $messages),
        ]);
    }

    // ── Formatters ────────────────────────────────────────────────────────────

    private function format_ticket(array $t): array {
        return [
            'id'             => (string) $t['id'],
            'userId'         => (int) $t['user_id'],
            'userName'       => $t['user_name'] ?? null,
            'title'          => $t['title'],
            'status'         => $this->user_facing_status($t['status']),
            'adminState'     => $t['status'],
            'priority'       => $t['priority'],
            'categoryId'     => $t['category_id'] ? (int) $t['category_id'] : null,
            'categoryTitle'  => $t['category_title'] ?? null,
            'createdAt'      => $t['created_at'],
            'updatedAt'      => $t['updated_at'],
        ];
    }

    private function format_message(array $m): array {
        return [
            'id'         => (string) $m['id'],
            'ticketId'   => (string) $m['ticket_id'],
            'authorType' => $m['author_type'],
            'authorName' => $m['author_name'] ?? ($m['author_type'] === 'support' ? 'پشتیبان' : 'کاربر'),
            'body'       => $m['body'],
            'createdAt'  => $m['created_at'],
        ];
    }

    /** Maps internal status to what the end-user should see. */
    private function user_facing_status(string $status): string {
        return match ($status) {
            'unreviewed', 'reviewing', 'spam' => 'pending',
            'pending'                          => 'answered',
            'answered'                         => 'answered',
            'closed'                           => 'closed',
            default                            => 'pending',
        };
    }
}
