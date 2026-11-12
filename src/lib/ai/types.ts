/**
 * Inference tiers, ordered from most to least capable.
 * The router degrades through them as availability drops.
 */
export type AITier =
  | 'cloud_gemini'          // Server-side provider (Gemini or OpenAI-compatible)
  | 'local_ollama'          // Ollama on the learner's machine (localhost:11434)
  | 'browser_webllm'        // In-browser WebGPU inference
  | 'deterministic_static'; // Curated offline dataset, always available

export interface WebGPUProbeResult {
  supported: boolean;
  reason?: string;
  adapterInfo?: { vendor?: string; architecture?: string };
}
