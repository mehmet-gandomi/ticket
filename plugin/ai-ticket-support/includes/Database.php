<?php
declare(strict_types=1);

namespace ATS;

final class Database {

    private const DB_VERSION = '1.2.0';

    private static ?self $instance = null;

    private function __construct(private readonly \wpdb $db) {}

    public static function instance(): self {
        if (self::$instance === null) {
            global $wpdb;
            self::$instance = new self($wpdb);
        }
        return self::$instance;
    }

    public function maybe_upgrade(): void {
        if (get_option('ats_db_version') !== self::DB_VERSION) {
            $this->install();
        }
    }

    public function install(): void {
        require_once ABSPATH . 'wp-admin/includes/upgrade.php';

        $charset = $this->db->get_charset_collate();

        dbDelta("CREATE TABLE {$this->db->prefix}ats_categories (
            id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            title       VARCHAR(255)    NOT NULL,
            description TEXT,
            created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id)
        ) ENGINE=InnoDB {$charset};");

        dbDelta("CREATE TABLE {$this->db->prefix}ats_tickets (
            id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            user_id       BIGINT UNSIGNED NOT NULL,
            title         VARCHAR(255)    NOT NULL,
            status        VARCHAR(20)     NOT NULL DEFAULT 'unreviewed',
            priority      VARCHAR(10)     NOT NULL DEFAULT 'low',
            category_id   BIGINT UNSIGNED DEFAULT NULL,
            ai_status     VARCHAR(10)     NOT NULL DEFAULT 'none',
            ai_suggestion TEXT            NULL,
            ai_resolved   TINYINT(1)      NOT NULL DEFAULT 0,
            created_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY idx_user   (user_id),
            KEY idx_status (status)
        ) ENGINE=InnoDB {$charset};");

        dbDelta("CREATE TABLE {$this->db->prefix}ats_messages (
            id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            ticket_id   BIGINT UNSIGNED NOT NULL,
            user_id     BIGINT UNSIGNED NOT NULL,
            author_type VARCHAR(10)     NOT NULL DEFAULT 'user',
            body        TEXT            NOT NULL,
            created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY idx_ticket (ticket_id)
        ) ENGINE=InnoDB {$charset};");

        dbDelta("CREATE TABLE {$this->db->prefix}ats_saved_answers (
            id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            category_id BIGINT UNSIGNED DEFAULT NULL,
            title       VARCHAR(255)    NOT NULL,
            body        TEXT            NOT NULL,
            created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY idx_category (category_id)
        ) ENGINE=InnoDB {$charset};");

        update_option('ats_db_version', self::DB_VERSION);
    }

    // ── Tickets ──────────────────────────────────────────────────────────────

    public function get_tickets_for_user(int $user_id, int $page = 1, int $per_page = 20): array {
        $offset = ($page - 1) * $per_page;
        return $this->db->get_results(
            $this->db->prepare(
                "SELECT t.*, c.title AS category_title,
                        (SELECT body FROM {$this->db->prefix}ats_messages
                         WHERE ticket_id = t.id ORDER BY created_at ASC LIMIT 1) AS first_body
                 FROM {$this->db->prefix}ats_tickets t
                 LEFT JOIN {$this->db->prefix}ats_categories c ON c.id = t.category_id
                 WHERE t.user_id = %d
                 ORDER BY t.updated_at DESC
                 LIMIT %d OFFSET %d",
                $user_id, $per_page, $offset
            ),
            ARRAY_A
        );
    }

    public function count_tickets_for_user(int $user_id): int {
        return (int) $this->db->get_var(
            $this->db->prepare(
                "SELECT COUNT(*) FROM {$this->db->prefix}ats_tickets WHERE user_id = %d",
                $user_id
            )
        );
    }

    public function get_all_tickets(array $filters = [], int $page = 1, int $per_page = 20): array {
        $where  = ['1=1'];
        $values = [];

        if (!empty($filters['status'])) {
            $where[]  = 'status = %s';
            $values[] = $filters['status'];
        }
        if (!empty($filters['priority'])) {
            $where[]  = 'priority = %s';
            $values[] = $filters['priority'];
        }
        if (!empty($filters['search'])) {
            $where[]  = '(title LIKE %s OR CAST(id AS CHAR) LIKE %s)';
            $like     = '%' . $this->db->esc_like($filters['search']) . '%';
            $values[] = $like;
            $values[] = $like;
        }

        $sql_where = implode(' AND ', $where);
        $offset    = ($page - 1) * $per_page;
        $base      = "SELECT t.*, u.display_name AS user_name, c.title AS category_title
                      FROM {$this->db->prefix}ats_tickets t
                      LEFT JOIN {$this->db->prefix}users u ON u.ID = t.user_id
                      LEFT JOIN {$this->db->prefix}ats_categories c ON c.id = t.category_id
                      WHERE {$sql_where}";

        $query = $values
            ? $this->db->prepare("{$base} ORDER BY t.updated_at DESC LIMIT %d OFFSET %d", ...[...$values, $per_page, $offset])
            : "{$base} ORDER BY t.updated_at DESC LIMIT {$per_page} OFFSET {$offset}";

        // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
        return $this->db->get_results($query, ARRAY_A);
    }

    public function count_all_tickets(array $filters = []): int {
        $where  = ['1=1'];
        $values = [];

        if (!empty($filters['status'])) {
            $where[]  = 'status = %s';
            $values[] = $filters['status'];
        }
        if (!empty($filters['priority'])) {
            $where[]  = 'priority = %s';
            $values[] = $filters['priority'];
        }
        if (!empty($filters['search'])) {
            $where[]  = '(title LIKE %s OR CAST(id AS CHAR) LIKE %s)';
            $like     = '%' . $this->db->esc_like($filters['search']) . '%';
            $values[] = $like;
            $values[] = $like;
        }

        $sql_where = implode(' AND ', $where);
        $base      = "SELECT COUNT(*) FROM {$this->db->prefix}ats_tickets WHERE {$sql_where}";

        $query = $values
            ? $this->db->prepare($base, ...$values)
            : $base;

        // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
        return (int) $this->db->get_var($query);
    }

    public function get_ticket(int $id): ?array {
        return $this->db->get_row(
            $this->db->prepare(
                "SELECT t.*, u.display_name AS user_name, c.title AS category_title
                 FROM {$this->db->prefix}ats_tickets t
                 LEFT JOIN {$this->db->prefix}users u ON u.ID = t.user_id
                 LEFT JOIN {$this->db->prefix}ats_categories c ON c.id = t.category_id
                 WHERE t.id = %d",
                $id
            ),
            ARRAY_A
        ) ?: null;
    }

    public function create_ticket(int $user_id, string $title, string $priority, ?int $category_id): int|false {
        $result = $this->db->insert(
            $this->db->prefix . 'ats_tickets',
            [
                'user_id'     => $user_id,
                'title'       => $title,
                'status'      => 'unreviewed',
                'priority'    => $priority,
                'category_id' => $category_id,
            ],
            ['%d', '%s', '%s', '%s', $category_id ? '%d' : '%s']
        );
        return $result !== false ? (int) $this->db->insert_id : false;
    }

    public function update_ticket_status(int $id, string $status): bool {
        return (bool) $this->db->update(
            $this->db->prefix . 'ats_tickets',
            ['status' => $status, 'updated_at' => current_time('mysql')],
            ['id'     => $id],
            ['%s', '%s'],
            ['%d']
        );
    }

    public function resolve_ticket_with_ai(int $ticket_id, string $ai_body): bool {
        $this->db->insert(
            $this->db->prefix . 'ats_messages',
            ['ticket_id' => $ticket_id, 'user_id' => 0, 'author_type' => 'support', 'body' => $ai_body],
            ['%d', '%d', '%s', '%s']
        );
        return (bool) $this->db->update(
            $this->db->prefix . 'ats_tickets',
            ['status' => 'closed', 'ai_resolved' => 1, 'updated_at' => current_time('mysql')],
            ['id' => $ticket_id],
            ['%s', '%d', '%s'],
            ['%d']
        );
    }

    public function count_ai_resolved(): int {
        return (int) $this->db->get_var(
            "SELECT COUNT(*) FROM {$this->db->prefix}ats_tickets WHERE ai_resolved = 1"
        );
    }

    public function save_ai_suggestion(int $ticket_id, ?string $suggestion): bool {
        $status = $suggestion !== null ? 'done' : 'failed';
        return (bool) $this->db->update(
            $this->db->prefix . 'ats_tickets',
            ['ai_status' => $status, 'ai_suggestion' => $suggestion, 'updated_at' => current_time('mysql')],
            ['id'        => $ticket_id],
            ['%s', $suggestion !== null ? '%s' : '%s'],
            ['%d']
        );
    }

    // ── Messages ─────────────────────────────────────────────────────────────

    public function get_messages(int $ticket_id): array {
        return $this->db->get_results(
            $this->db->prepare(
                "SELECT m.*, u.display_name AS author_name
                 FROM {$this->db->prefix}ats_messages m
                 LEFT JOIN {$this->db->prefix}users u ON u.ID = m.user_id
                 WHERE m.ticket_id = %d
                 ORDER BY m.created_at ASC",
                $ticket_id
            ),
            ARRAY_A
        );
    }

    public function create_message(int $ticket_id, int $user_id, string $author_type, string $body): int|false {
        $result = $this->db->insert(
            $this->db->prefix . 'ats_messages',
            [
                'ticket_id'   => $ticket_id,
                'user_id'     => $user_id,
                'author_type' => $author_type,
                'body'        => $body,
            ],
            ['%d', '%d', '%s', '%s']
        );
        return $result !== false ? (int) $this->db->insert_id : false;
    }

    // ── Categories ───────────────────────────────────────────────────────────

    public function get_categories(): array {
        return $this->db->get_results(
            "SELECT c.*, (SELECT COUNT(*) FROM {$this->db->prefix}ats_tickets t WHERE t.category_id = c.id) AS ticket_count
             FROM {$this->db->prefix}ats_categories c
             ORDER BY c.title ASC",
            ARRAY_A
        );
    }

    public function create_category(string $title, string $description): int|false {
        $result = $this->db->insert(
            $this->db->prefix . 'ats_categories',
            ['title' => $title, 'description' => $description],
            ['%s', '%s']
        );
        return $result !== false ? (int) $this->db->insert_id : false;
    }

    public function update_category(int $id, string $title, string $description): bool {
        return (bool) $this->db->update(
            $this->db->prefix . 'ats_categories',
            ['title' => $title, 'description' => $description],
            ['id'    => $id],
            ['%s', '%s'],
            ['%d']
        );
    }

    public function delete_category(int $id): bool {
        return (bool) $this->db->delete(
            $this->db->prefix . 'ats_categories',
            ['id' => $id],
            ['%d']
        );
    }

    // ── Saved Answers ─────────────────────────────────────────────────────────

    public function get_saved_answers(?int $category_id = null): array {
        if ($category_id !== null) {
            return $this->db->get_results(
                $this->db->prepare(
                    "SELECT a.*, c.title AS category_title
                     FROM {$this->db->prefix}ats_saved_answers a
                     LEFT JOIN {$this->db->prefix}ats_categories c ON c.id = a.category_id
                     WHERE a.category_id = %d
                     ORDER BY a.title ASC",
                    $category_id
                ),
                ARRAY_A
            );
        }
        return $this->db->get_results(
            "SELECT a.*, c.title AS category_title
             FROM {$this->db->prefix}ats_saved_answers a
             LEFT JOIN {$this->db->prefix}ats_categories c ON c.id = a.category_id
             ORDER BY a.title ASC",
            ARRAY_A
        );
    }

    public function create_saved_answer(string $title, string $body, ?int $category_id): int|false {
        $result = $this->db->insert(
            $this->db->prefix . 'ats_saved_answers',
            ['title' => $title, 'body' => $body, 'category_id' => $category_id],
            ['%s', '%s', $category_id ? '%d' : '%s']
        );
        return $result !== false ? (int) $this->db->insert_id : false;
    }

    public function update_saved_answer(int $id, string $title, string $body, ?int $category_id): bool {
        return (bool) $this->db->update(
            $this->db->prefix . 'ats_saved_answers',
            ['title' => $title, 'body' => $body, 'category_id' => $category_id, 'updated_at' => current_time('mysql')],
            ['id' => $id],
            ['%s', '%s', $category_id ? '%d' : '%s', '%s'],
            ['%d']
        );
    }

    public function delete_saved_answer(int $id): bool {
        return (bool) $this->db->delete(
            $this->db->prefix . 'ats_saved_answers',
            ['id' => $id],
            ['%d']
        );
    }
}
