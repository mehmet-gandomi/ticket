<?php
declare(strict_types=1);

namespace ATS;

/**
 * Generates AI-powered answer suggestions for newly submitted tickets.
 *
 * Cost strategy
 * ─────────────
 * 1. Filter saved answers by the ticket's category (falls back to all).
 * 2. Score each answer by keyword overlap with the user's message.
 *    Answers with zero overlap are skipped entirely — no AI call made.
 * 3. Take only the top TOP_K answers as a knowledge base.
 * 4. Single AI call: model generates a fresh answer from that knowledge base.
 *    It does not copy-paste; it synthesises a clear, concise response.
 */
final class AiService {

    private const DEFAULT_MODEL  = 'gapgpt-qwen-3.5';
    private const TOP_K          = 4;   // max answers sent to AI as context
    private const MAX_BODY_CHARS = 400; // per-answer body truncation

    private const SYSTEM_PROMPT = <<<'SYS'
تو یک کارشناس پشتیبانی فنی هستی. وظیفه‌ات نوشتن یک پاسخ کامل و واضح برای سوال کاربر است.

قوانین مهم:
- فقط از اطلاعات موجود در پایگاه دانش زیر استفاده کن.
- پاسخ را با کلمات خودت بنویس. متن پایگاه دانش را کپی نکن.
- اگر جواب نیاز به مراحل دارد، آن‌ها را به صورت قدم‌به‌قدم بنویس.
- اگر در پایگاه دانش لینکی وجود دارد، آن را عیناً در پاسخ ذکر کن.
- همه اطلاعات لازم را بگو — نه کمتر، نه بیشتر. اضافه‌گویی نکن.
- از ایموجی استفاده نکن.
- زبان ساده و قابل فهم به کار ببر.
- پاسخ را با جمله‌هایی مثل «اگر سوالی دارید بفرمایید» یا «موفق باشید» یا هر عبارت مشابهی تمام نکن. فقط پاسخ را بنویس.
- از علامت‌های مارک‌داون مثل ** یا # یا * استفاده نکن. متن ساده بنویس.
- اگر اطلاعات کافی برای پاسخ دادن وجود ندارد، دقیقاً بنویس: پاسخ مناسبی یافت نشد
SYS;

    public function suggest(array $ticket, string $user_message): ?string {
        $client = $this->resolve_client();
        if ($client === null) {
            return null;
        }

        $category_id = $ticket['category_id'] ? (int) $ticket['category_id'] : null;
        $pool        = $this->load_answers($category_id);
        if (empty($pool)) {
            return null;
        }

        $top = $this->top_k($user_message, $pool);
        if (empty($top)) {
            return null; // no keyword overlap — skip AI call entirely
        }

        $prompt = $this->build_prompt($ticket['title'], $user_message, $top);
        $model  = $this->resolve_model();
        $result = $client->respond($model, self::SYSTEM_PROMPT, $prompt);

        if ($result === null || mb_stripos($result, 'پاسخ مناسبی یافت نشد') !== false) {
            return null;
        }

        return trim($result);
    }

    // ── Retrieval ─────────────────────────────────────────────────────────────

    private function load_answers(?int $category_id): array {
        $db      = Database::instance();
        $answers = $category_id !== null ? $db->get_saved_answers($category_id) : [];

        if (empty($answers)) {
            $answers = $db->get_saved_answers();
        }

        return $answers;
    }

    /**
     * Score every answer by keyword overlap with the user message,
     * return the top TOP_K with score > 0, sorted best-first.
     */
    private function top_k(string $user_message, array $answers): array {
        $words = $this->tokenize($user_message);
        if (empty($words)) {
            return [];
        }

        $scored = [];
        foreach ($answers as $answer) {
            $score = $this->score($words, $answer);
            if ($score > 0) {
                $scored[] = ['answer' => $answer, 'score' => $score];
            }
        }

        if (empty($scored)) {
            return [];
        }

        usort($scored, fn($a, $b) => $b['score'] <=> $a['score']);

        return array_column(array_slice($scored, 0, self::TOP_K), 'answer');
    }

    private function score(array $words, array $answer): int {
        $haystack = mb_strtolower(strip_tags($answer['title'] . ' ' . $answer['body']));
        $score    = 0;
        foreach ($words as $word) {
            if (str_contains($haystack, $word)) {
                $score++;
            }
        }
        return $score;
    }

    /**
     * Convert HTML to plain text while keeping anchor URLs visible.
     * e.g. <a href="https://example.com">کلیک کنید</a>
     *   →  کلیک کنید (https://example.com)
     */
    private function html_to_text(string $html): string {
        // Replace <a href="URL">text</a> with "text (URL)"
        $text = preg_replace_callback(
            '/<a\s[^>]*href=["\']([^"\']+)["\'][^>]*>(.*?)<\/a>/is',
            static fn($m) => trim(strip_tags($m[2])) . ' (' . $m[1] . ')',
            $html
        );
        return strip_tags((string) $text);
    }

    private function tokenize(string $text): array {
        $text  = mb_strtolower(strip_tags($text));
        $words = preg_split('/[\s\.,،؛:!\?؟\-\/\(\)]+/u', $text, -1, PREG_SPLIT_NO_EMPTY);
        // drop very short words (particles, prepositions)
        return array_values(array_unique(array_filter($words, fn($w) => mb_strlen($w) > 2)));
    }

    // ── Prompt ────────────────────────────────────────────────────────────────

    private function build_prompt(string $title, string $message, array $answers): string {
        $kb = '';
        foreach ($answers as $i => $a) {
            $body = $this->html_to_text((string) $a['body']);
            $body = preg_replace('/\s+/', ' ', trim($body));
            if (mb_strlen($body) > self::MAX_BODY_CHARS) {
                $body = mb_substr($body, 0, self::MAX_BODY_CHARS) . '…';
            }
            $n    = $i + 1;
            $kb  .= "--- مورد {$n} ---\nعنوان: {$a['title']}\nمحتوا: {$body}\n\n";
        }

        $user_text = trim(strip_tags($message));

        return <<<PROMPT
پایگاه دانش:
{$kb}
سوال کاربر:
عنوان تیکت: {$title}
متن: {$user_text}

بر اساس پایگاه دانش بالا، پاسخ مناسب را بنویس.
PROMPT;
    }

    // ── Config ────────────────────────────────────────────────────────────────

    private function resolve_client(): ?GapGptClient {
        $settings  = (array) get_option('ats_settings', []);
        $providers = (array) ($settings['providers'] ?? []);
        $gapcode   = (array) ($providers['gapcode'] ?? []);

        if (empty($gapcode['enabled']) || empty($gapcode['apiKey'])) {
            return null;
        }

        return new GapGptClient((string) $gapcode['apiKey']);
    }

    private function resolve_model(): string {
        $settings  = (array) get_option('ats_settings', []);
        $providers = (array) ($settings['providers'] ?? []);
        $gapcode   = (array) ($providers['gapcode'] ?? []);
        return ! empty($gapcode['model']) ? (string) $gapcode['model'] : self::DEFAULT_MODEL;
    }
}
