/**
 * Small fetch wrapper shared by the components: JSON POST with a timeout and
 * an AbortSignal so an unmounted or superseded request never sets stale state.
 */
export interface ApiEnvelope<T> {
  source: string;
  data: T;
  notice?: string;
}

export async function postJson<T>(
  url: string,
  body: unknown,
  opts: { signal?: AbortSignal; timeoutMs?: number } = {},
): Promise<ApiEnvelope<T>> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), opts.timeoutMs ?? 90_000);
  const onAbort = () => controller.abort();
  opts.signal?.addEventListener('abort', onAbort);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!res.ok) {
      let message = `${res.status} ${res.statusText}`;
      try {
        const err = await res.json();
        if (err?.error) message = err.error;
      } catch {
        /* non-JSON error body */
      }
      throw new Error(message);
    }
    return (await res.json()) as ApiEnvelope<T>;
  } finally {
    clearTimeout(timeout);
    opts.signal?.removeEventListener('abort', onAbort);
  }
}

export const isLiveSource = (source?: string) => source === 'gemini';

export function isAbortError(err: unknown): boolean {
  return (err as any)?.name === 'AbortError';
}
