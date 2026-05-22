import { getConfig } from '../config';

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  formData?: FormData,
): Promise<T> {
  const { restUrl, nonce } = getConfig();
  const url = `${restUrl}${path}`;

  const headers: Record<string, string> = {};
  if (!formData) headers['Content-Type'] = 'application/json';
  if (nonce) headers['X-WP-Nonce'] = nonce;

  const res = await fetch(url, {
    method,
    headers,
    body: formData ?? (body !== undefined ? JSON.stringify(body) : undefined),
    credentials: 'same-origin',
  });

  if (res.status === 204) {
    return undefined as T;
  }

  const json = await res.json();

  if (!res.ok) {
    throw new ApiError(res.status, json.code ?? 'error', json.message ?? 'Unknown error');
  }

  return json as T;
}

export const api = {
  get:    <T>(path: string)                  => request<T>('GET',    path),
  post:   <T>(path: string, body: unknown)   => request<T>('POST',   path, body),
  put:    <T>(path: string, body: unknown)   => request<T>('PUT',    path, body),
  delete: <T>(path: string)                  => request<T>('DELETE', path),
  upload: <T>(path: string, form: FormData)  => request<T>('POST',   path, undefined, form),
};
