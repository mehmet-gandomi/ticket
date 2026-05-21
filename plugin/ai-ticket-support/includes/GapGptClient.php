<?php
declare(strict_types=1);

namespace ATS;

/**
 * Thin HTTP wrapper around GapGPT's OpenAI-compatible Responses API.
 * Uses WordPress's wp_remote_post so SSL/proxy settings are respected.
 */
final class GapGptClient {

    private const BASE_URL     = 'https://api.gapgpt.app/v1';
    private const BASE_URL_CDN = 'https://api.gapapi.com/v1';
    private const TIMEOUT      = 30;

    public function __construct(private readonly string $api_key) {}

    /**
     * POST /v1/responses — mirrors the OpenAI SDK client.responses.create().
     *
     * @param  string $model e.g. 'gapgpt-qwen-3.5'
     * @param  string $input the full prompt text
     * @return string|null   output_text on success, null on failure
     */
    public function respond(string $model, string $input): ?string {
        $args = [
            'timeout' => self::TIMEOUT,
            'headers' => [
                'Authorization' => 'Bearer ' . $this->api_key,
                'Content-Type'  => 'application/json',
            ],
            'body' => wp_json_encode([
                'model'    => $model,
                'messages' => [['role' => 'user', 'content' => $input]],
            ]),
        ];

        // Try primary URL first, fall back to international CDN on connection failure.
        foreach ([self::BASE_URL, self::BASE_URL_CDN] as $base) {
            $response = wp_remote_post($base . '/chat/completions', $args);

            if (is_wp_error($response)) {
                error_log('ATS GapGptClient error (' . $base . '): ' . $response->get_error_message());
                continue; // try next URL
            }

            $code = (int) wp_remote_retrieve_response_code($response);
            $body = json_decode(wp_remote_retrieve_body($response), true);

            if ($code !== 200 || ! is_array($body)) {
                error_log('ATS GapGptClient unexpected response [' . $code . '] (' . $base . '): ' . wp_remote_retrieve_body($response));
                return null; // HTTP error — retrying CDN won't help
            }

            return $body['choices'][0]['message']['content'] ?? null;
        }

        return null;
    }
}
