<?php
declare(strict_types=1);

namespace ATS;

/**
 * Generates AI-powered answer suggestions for newly submitted tickets.
 *
 * Cost strategy
 * ─────────────
 * 1. Filter saved answers by the ticket's category first.
 *    A user asking a billing question gets only billing answers — not the
 *    entire knowledge base.
 * 2. If the category has no saved answers, fall back to all answers.
 * 3. Hard-cap at MAX_ANSWERS items and truncate each body to MAX_BODY_CHARS.
 *    This keeps every prompt under ~1 500 tokens regardless of library size.
 */
final class AiService {

    private const DEFAULT_MODEL = 'gapgpt-qwen-3.5';
    private const MAX_ANSWERS   = 10;
    private const MAX_BODY_CHARS = 300;

    /**
     * Try to generate an AI suggestion for a ticket.
     *
     * @param  array  $ticket       Row from ats_tickets (with category_id).
     * @param  string $user_message The first message the user wrote.
     * @return string|null          AI answer text, or null when skipped/failed.
     */
    public function suggest(array $ticket, string $user_message): ?string {
        $client = $this->resolve_client();
        if ($client === null) {
            return null;
        }

        $answers = $this->load_answers($ticket['category_id'] ? (int) $ticket['category_id'] : null);
        if (empty($answers)) {
            return null;
        }

        $prompt = $this->build_prompt(
            title:   $ticket['title'],
            message: $user_message,
            answers: $answers,
        );

        $model  = $this->resolve_model();
        $result = $client->respond($model, $prompt);

        // Treat "no relevant answer" responses as null so the UI hides the panel
        if ($result === null || mb_stripos($result, 'پاسخ مناسبی یافت نشد') !== false) {
            return null;
        }

        return trim($result);
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    private function resolve_client(): ?GapGptClient {
        $settings = (array) get_option('ats_settings', []);
        $providers = (array) ($settings['providers'] ?? []);
        $gapcode   = (array) ($providers['gapcode'] ?? []);

        if (empty($gapcode['enabled']) || empty($gapcode['apiKey'])) {
            return null;
        }

        return new GapGptClient((string) $gapcode['apiKey']);
    }

    private function resolve_model(): string {
        $settings = (array) get_option('ats_settings', []);
        $providers = (array) ($settings['providers'] ?? []);
        $gapcode   = (array) ($providers['gapcode'] ?? []);
        return ! empty($gapcode['model']) ? (string) $gapcode['model'] : self::DEFAULT_MODEL;
    }

    /**
     * Load saved answers for a category; fall back to all answers if empty.
     * Always caps the result at MAX_ANSWERS.
     */
    private function load_answers(?int $category_id): array {
        $db = Database::instance();

        $answers = $category_id !== null
            ? $db->get_saved_answers($category_id)
            : [];

        if (empty($answers)) {
            $answers = $db->get_saved_answers();
        }

        return array_slice($answers, 0, self::MAX_ANSWERS);
    }

    private function build_prompt(string $title, string $message, array $answers): string {
        $list = '';
        foreach ($answers as $i => $a) {
            $body  = strip_tags((string) $a['body']);
            $body  = preg_replace('/\s+/', ' ', $body);
            if (mb_strlen($body) > self::MAX_BODY_CHARS) {
                $body = mb_substr($body, 0, self::MAX_BODY_CHARS) . '…';
            }
            $num   = $i + 1;
            $list .= "{$num}. عنوان: {$a['title']}\n   پاسخ: {$body}\n\n";
        }

        $user_text = strip_tags($message);

        return <<<PROMPT
شما دستیار پشتیبانی هستید. از میان پاسخ‌های آماده زیر، مناسب‌ترین را برای سوال کاربر انتخاب کنید و آن را عیناً به کاربر ارائه دهید. اگر هیچ پاسخ مناسبی وجود ندارد دقیقاً بنویسید: پاسخ مناسبی یافت نشد

سوال کاربر:
عنوان: {$title}
توضیحات: {$user_text}

پاسخ‌های آماده:
{$list}
PROMPT;
    }
}
