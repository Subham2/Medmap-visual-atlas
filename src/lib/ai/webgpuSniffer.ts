import type { WebGPUProbeResult } from './types';

let cached: Promise<WebGPUProbeResult> | null = null;

/**
 * Detect whether the browser can run WebGPU inference.
 * The result is memoised: adapter negotiation is slow and cannot change mid-session.
 */
export function probeWebGPU(timeoutMs = 1500): Promise<WebGPUProbeResult> {
  if (cached) return cached;

  cached = (async (): Promise<WebGPUProbeResult> => {
    if (typeof navigator === 'undefined') return { supported: false, reason: 'no_navigator' };
    const gpu = (navigator as any).gpu;
    if (!gpu) return { supported: false, reason: 'webgpu_api_absent' };
    if (typeof window !== 'undefined' && !window.isSecureContext) {
      return { supported: false, reason: 'insecure_context' };
    }

    try {
      const adapter = await Promise.race([
        gpu.requestAdapter({ powerPreference: 'high-performance' }),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), timeoutMs)),
      ]);
      if (!adapter) return { supported: false, reason: 'no_adapter' };

      // WebLLM's smallest models need roughly 1 GiB buffers; reject adapters that cannot allocate them.
      const maxBuffer = Number(adapter.limits?.maxBufferSize ?? 0);
      if (maxBuffer && maxBuffer < 256 * 1024 * 1024) {
        return { supported: false, reason: 'insufficient_buffer_limit' };
      }

      const info = adapter.info ?? {};
      return { supported: true, adapterInfo: { vendor: info.vendor, architecture: info.architecture } };
    } catch (err: any) {
      return { supported: false, reason: `probe_error:${err?.name || 'unknown'}` };
    }
  })();

  return cached;
}
