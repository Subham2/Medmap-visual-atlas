import { CircuitBreaker } from "./circuitBreaker";
import { probeWebGPU } from "./webgpuSniffer";
import type { AITier } from "./types";

const cloudBreaker = new CircuitBreaker({
  failureRateThreshold: 0.5,
  minimumWindowSize: 8,
  cooldownMs: 30_000
});

const ollamaBreaker = new CircuitBreaker({
  failureRateThreshold: 0.5,
  minimumWindowSize: 6,
  cooldownMs: 30_000
});

export interface RouteDecision {
  tier: AITier;
  reason: string;
}

// Cloud tier is usable only when the server has a provider configured, not merely when it is up.
async function pingHealthEndpoint(url: string, timeoutMs = 1500): Promise<{ online: boolean }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal, cache: "no-store" });
    if (!res.ok) return { online: false };
    const body = await res.json().catch(() => null);
    return { online: Boolean(body?.configured) };
  } catch {
    return { online: false };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Probing localhost from a public page triggers Chrome's Local Network Access
 * permission prompt, so the Ollama tier is opt-in: on when the app itself runs on
 * localhost, or when the learner sets localStorage "medmap_enable_ollama" = "1".
 */
function ollamaProbeAllowed(): boolean {
  if (typeof window === "undefined") return false;
  if (["localhost", "127.0.0.1"].includes(window.location.hostname)) return true;
  try {
    return window.localStorage.getItem("medmap_enable_ollama") === "1";
  } catch {
    return false;
  }
}

async function probeOllama(timeoutMs = 1000): Promise<boolean> {
  if (!ollamaProbeAllowed()) return false;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch("http://localhost:11434/api/tags", { signal: controller.signal });
    clearTimeout(timer);
    return res.ok;
  } catch {
    clearTimeout(timer);
    return false;
  }
}

export async function selectAITier(): Promise<RouteDecision> {
  // Scatter-gather concurrent execution
  const [networkResult, ollamaResult] = await Promise.allSettled([
    cloudBreaker.canAttempt() ? pingHealthEndpoint("/api/status", 1500) : Promise.resolve({ online: false }),
    ollamaBreaker.canAttempt() ? probeOllama() : Promise.resolve(false)
  ]);

  const isNetworkOnline = networkResult.status === "fulfilled" && networkResult.value.online;
  if (isNetworkOnline && cloudBreaker.canAttempt()) {
    return { tier: "cloud_gemini", reason: "network_healthy_cloud_breaker_closed" };
  }

  const isOllamaOnline = ollamaResult.status === "fulfilled" && ollamaResult.value;
  if (isOllamaOnline && ollamaBreaker.canAttempt()) {
    return { tier: "local_ollama", reason: "cloud_unavailable_ollama_healthy" };
  }

  const webgpu = await probeWebGPU();
  if (webgpu.supported) {
    return { tier: "browser_webllm", reason: "cloud_and_ollama_unavailable_webgpu_supported" };
  }

  return { tier: "deterministic_static", reason: `fallback_static_${webgpu.reason ?? "no_webgpu"}` };
}

export function recordTierSuccess(tier: AITier): void {
  if (tier === "cloud_gemini") cloudBreaker.recordSuccess();
  if (tier === "local_ollama") ollamaBreaker.recordSuccess();
}

export function recordTierFailure(tier: AITier): void {
  if (tier === "cloud_gemini") cloudBreaker.recordFailure();
  if (tier === "local_ollama") ollamaBreaker.recordFailure();
}
