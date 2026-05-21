<?php
declare(strict_types=1);

namespace ATS;

/**
 * Thin HTTP wrapper around GapGPT's OpenAI-compatible Responses API.
 * Uses WordPress's wp_remote_post so SSL/proxy settings are respected.
 */
final class GapGptClient {

    private const BASE_URL = 'https://api.gapgpt.app/v1';
    private const TIMEOUT  = 30;

    public function __construct(private readonly string $api_key) {}

    /**
     * POST /v1/responses — mirrors the OpenAI SDK client.responses.create().
     *
     * @param  string $model e.g. 'gapgpt-qwen-3.5'
     * @param  string $input the full prompt text
     * @return string|null   output_text on success, null on failure
     */
    public function respond(string $model, string $input): ?string {
        $response = wp_remote_post(self::BASE_URL . '/responses', [
            'timeout' => self::TIMEOUT,
            'headers' => [
                'Authorization' => 'Bearer ' . $this->api_key,
                'Content-Type'  => 'application/json',
            ],
            'body' => wp_json_encode([
                'model' => $model,
                'input' => $input,
            ]),
        ]);

        if (is_wp_error($response)) {
            error_log('ATS GapGptClient error: ' . $response->get_error_message());
            return null;
        }

        $code = (int) wp_remote_retrieve_response_code($response);
        $body = json_decode(wp_remote_retrieve_body($response), true);

        if ($code !== 200 || ! is_array($body)) {
            error_log('ATS GapGptClient unexpected response: ' . wp_remote_retrieve_body($response));
            return null;
        }

        return isset($body['output_text']) ? (string) $body['output_text'] : null;
    }
}
