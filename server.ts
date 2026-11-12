import express, { type Request, type Response, type NextFunction } from "express";
import path from "path";
import fs from "fs";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { getFallbackMindmap, getFallbackCases } from "./fallbackGenerator";
import { getFallbackMap } from "./src/data/fallbackMaps";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

// ---------------------------------------------------------------------------
// Runtime configuration (all tunable through environment variables)
// ---------------------------------------------------------------------------
const APP_VERSION = process.env.npm_package_version || "1.2.0";
const PORT = Number(process.env.PORT) || 3000;
const IS_PROD = process.env.NODE_ENV === "production";
const AI_TIMEOUT_MS = Number(process.env.AI_TIMEOUT_MS) || 45_000;
const AI_CACHE_TTL_MS = Number(process.env.AI_CACHE_TTL_MS) || 30 * 60_000;
const AI_CACHE_MAX_ENTRIES = Number(process.env.AI_CACHE_MAX_ENTRIES) || 200;
const RATE_LIMIT_PER_MIN = Number(process.env.RATE_LIMIT_PER_MIN) || 30;
const MAX_TOPIC_LEN = 200;
const DEFAULT_CUSTOM_MODEL = "gemini-3.5-flash";

const app = express();
app.disable("x-powered-by");
// Behind Nginx / Cloud Run, set TRUST_PROXY=1 so req.ip is the client, not the proxy.
if (process.env.TRUST_PROXY) {
  const tp = process.env.TRUST_PROXY;
  app.set("trust proxy", /^\d+$/.test(tp) ? Number(tp) : tp === "true" ? 1 : tp);
}
app.use(express.json({ limit: "100kb" }));

// Baseline security headers (no helmet dependency needed for this small set).
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups"); // Firebase popup sign-in needs this
  if (IS_PROD) res.setHeader("Strict-Transport-Security", "max-age=15552000; includeSubDomains");
  next();
});

// Structured access log: one JSON line per API request with latency.
app.use("/api", (req, res, next) => {
  const started = process.hrtime.bigint();
  res.on("finish", () => {
    const ms = Number(process.hrtime.bigint() - started) / 1e6;
    console.log(JSON.stringify({
      level: res.statusCode >= 500 ? "error" : "info",
      msg: "request",
      method: req.method,
      path: req.originalUrl.split("?")[0],
      status: res.statusCode,
      ms: Math.round(ms),
      source: res.locals.source,
    }));
  });
  next();
});

// Fixed-window per-IP limiter for AI-backed POST routes (each call costs provider credits).
const rateBuckets = new Map<string, { count: number; resetAt: number }>();
setInterval(() => {
  const now = Date.now();
  for (const [ip, b] of rateBuckets) if (b.resetAt <= now) rateBuckets.delete(ip);
}, 60_000).unref();

app.use("/api", (req, res, next) => {
  if (req.method !== "POST") return next();
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  const now = Date.now();
  let bucket = rateBuckets.get(ip);
  if (!bucket || bucket.resetAt <= now) {
    bucket = { count: 0, resetAt: now + 60_000 };
    rateBuckets.set(ip, bucket);
  }
  bucket.count++;
  res.setHeader("X-RateLimit-Limit", String(RATE_LIMIT_PER_MIN));
  res.setHeader("X-RateLimit-Remaining", String(Math.max(0, RATE_LIMIT_PER_MIN - bucket.count)));
  if (bucket.count > RATE_LIMIT_PER_MIN) {
    res.setHeader("Retry-After", String(Math.ceil((bucket.resetAt - now) / 1000)));
    return res.status(429).json({ error: "Too many requests. Please wait a minute and try again." });
  }
  next();
});

// Tag the response source for the access log without touching every handler.
app.use("/api", (req, res, next) => {
  const json = res.json.bind(res);
  res.json = (body: any) => {
    if (body && typeof body === "object" && typeof body.source === "string") res.locals.source = body.source;
    return json(body);
  };
  next();
});

/** Trim and length-cap untrusted text before it is interpolated into prompts. */
function clampText(value: unknown, max = MAX_TOPIC_LEN): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

// Lazy initialization of Gemini client to avoid crash if API key is missing
let aiClient: GoogleGenAI | null = null;

const ENV_PLACEHOLDERS = new Set([
  "",
  "MY_GEMINI_API_KEY",
  "MY_GEMINI_BASE_URL",
  "MY_APP_URL",
  "YOUR_AI_CREDITS_KEY",
  "YOUR_API_KEY",
  "undefined",
  "null",
  "aion-1.0-mini",
  "aion",
]);

function cleanEnv(value: string | undefined): string | null {
  const cleaned = (value || "").trim().replace(/^['\"]|['\"]$/g, "");
  if (!cleaned || ENV_PLACEHOLDERS.has(cleaned)) return null;
  return cleaned;
}

function isValidModelName(modelName: string | undefined | null): boolean {
  if (!modelName) return false;
  const lower = modelName.toLowerCase().trim();
  if (ENV_PLACEHOLDERS.has(lower)) return false;
  if (lower.startsWith("aion") || lower.includes("/aion") || lower.includes("aion-")) return false;
  return true;
}

interface AIConfig {
  apiKey: string | null;
  baseUrl: string | null;
  model: string;
  provider: "gemini" | "openai-compatible" | "none";
  configured: boolean;
}

let lastConfigFingerprint = "";

/**
 * Resolve provider configuration from the environment. No credentials are
 * hard-coded: without GEMINI_API_KEY the server runs in offline fallback mode.
 */
function getAIConfig(): AIConfig {
  const apiKey = cleanEnv(process.env.GEMINI_API_KEY);
  let baseUrl = cleanEnv(process.env.GEMINI_BASE_URL);

  // A genuine Google key always talks to the Gemini API directly.
  if (apiKey && apiKey.startsWith("AIzaSy")) baseUrl = null;

  const rawModel = cleanEnv(process.env.GEMINI_MODEL);
  const model = isValidModelName(rawModel) ? rawModel! : baseUrl ? DEFAULT_CUSTOM_MODEL : "gemini-2.5-flash";
  const provider: AIConfig["provider"] = !apiKey ? "none" : baseUrl ? "openai-compatible" : "gemini";

  const fingerprint = `${apiKey ? apiKey.slice(-6) : "-"}|${baseUrl}|${model}`;
  if (fingerprint !== lastConfigFingerprint) {
    aiClient = null; // re-create client with the new key
    lastConfigFingerprint = fingerprint;
    console.log(JSON.stringify({ level: "info", msg: "ai_config", provider, model, baseUrl, configured: Boolean(apiKey) }));
  }

  return { apiKey, baseUrl, model, provider, configured: Boolean(apiKey) };
}

/** Optional secondary provider used only when the primary Gemini route fails. */
function getBackupProvider(): { apiKey: string; baseUrl: string } | null {
  const apiKey = cleanEnv(process.env.AI_BACKUP_API_KEY);
  const baseUrl = cleanEnv(process.env.AI_BACKUP_BASE_URL);
  return apiKey && baseUrl ? { apiKey, baseUrl } : null;
}

/** Flatten Gemini-style `contents` into a single prompt string for chat-completions APIs. */
function contentsToText(contents: any): string {
  if (typeof contents === "string") return contents;
  const partText = (p: any) => (typeof p === "string" ? p : p?.text || "");
  if (Array.isArray(contents)) {
    return contents
      .map((part: any) => {
        if (typeof part === "string") return part;
        if (part?.text) return part.text;
        if (Array.isArray(part?.parts)) return part.parts.map(partText).join("\n");
        return "";
      })
      .filter(Boolean)
      .join("\n");
  }
  if (contents && typeof contents === "object") {
    if (contents.text) return contents.text;
    if (Array.isArray(contents.parts)) return contents.parts.map(partText).join("\n");
  }
  return String(contents || "");
}

/** Wrap a chat-completions string in the shape callers expect from the Gemini SDK. */
function asGenAIResponse(content: string) {
  return { text: content };
}

class ProviderHttpError extends Error {
  constructor(public status: number, body: string) {
    super(`HTTP ${status}: ${body.slice(0, 300)}`);
  }
}

async function callCustomOpenAI(params: any, apiKey: string, baseUrl: string): Promise<{ text: string }> {
  let promptText = contentsToText(params.contents);
  const responseMimeType = params.config?.responseMimeType || params.generationConfig?.responseMimeType;
  if (responseMimeType === "application/json" && !promptText.toLowerCase().includes("json")) {
    promptText += "\n\nRespond strictly with valid JSON format only.";
  }
  const messages = [{ role: "user", content: promptText }];

  // Configured model first, then a short list of known-good fallbacks on the same endpoint.
  const configured = cleanEnv(process.env.GEMINI_MODEL);
  const candidates = [
    configured && isValidModelName(configured) ? configured : null,
    params.model && isValidModelName(params.model) && !/^gemini-2\.5/.test(params.model) ? params.model : null,
    DEFAULT_CUSTOM_MODEL,
    "gpt-4o-mini",
  ].filter(Boolean) as string[];
  const modelsToTry = Array.from(new Set(candidates)).slice(0, 3);

  const cleanBaseUrl = baseUrl.replace(/\/$/, "");
  const deadline = Date.now() + AI_TIMEOUT_MS;

  const post = async (body: any) => {
    const remaining = deadline - Date.now();
    if (remaining <= 0) throw new Error(`AI provider deadline of ${AI_TIMEOUT_MS} ms exceeded`);
    return fetch(`${cleanBaseUrl}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(remaining),
    });
  };

  let lastError: any = null;
  for (const model of modelsToTry) {
    try {
      const body: any = { model, messages };
      if (responseMimeType === "application/json") body.response_format = { type: "json_object" };

      let response = await post(body);
      // Some gateways reject response_format; retry once without it only for that class of error.
      if (!response.ok && body.response_format && (response.status === 400 || response.status === 422)) {
        delete body.response_format;
        response = await post(body);
      }
      if (!response.ok) throw new ProviderHttpError(response.status, await response.text());

      const resJson: any = await response.json();
      const content = resJson.choices?.[0]?.message?.content || "";
      if (!content) throw new Error(`Empty completion from model ${model}`);
      return asGenAIResponse(content);
    } catch (err: any) {
      lastError = err;
      // Bad credentials or exhausted credit will fail identically on every model: stop early.
      if (err instanceof ProviderHttpError && [401, 402, 403].includes(err.status)) break;
      if (Date.now() >= deadline) break;
    }
  }

  console.warn(JSON.stringify({ level: "warn", msg: "custom_provider_failed", error: String(lastError?.message || lastError).slice(0, 200) }));
  throw lastError || new Error("All models failed on the custom provider");
}

function cleanAndParseJSON(text: string): any {
  if (!text) return null;
  let cleanText = text.trim();

  // Strip markdown wraps if present
  if (cleanText.startsWith("```")) {
    cleanText = cleanText.replace(/^```[a-zA-Z]*\s*/, "");
    cleanText = cleanText.replace(/\s*```$/, "");
    cleanText = cleanText.trim();
  }

  // Find the first and last occurrence of '{' or '[' to locate the JSON boundaries
  const firstBrace = cleanText.indexOf("{");
  const firstBracket = cleanText.indexOf("[");
  let startIdx = -1;
  let endIdx = -1;

  if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
    startIdx = firstBrace;
    endIdx = cleanText.lastIndexOf("}");
  } else if (firstBracket !== -1) {
    startIdx = firstBracket;
    endIdx = cleanText.lastIndexOf("]");
  }

  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    cleanText = cleanText.substring(startIdx, endIdx + 1);
  }

  return JSON.parse(cleanText);
}

/**
 * Models in JSON-object mode often wrap a requested array in an object
 * ({"cases":[...]}). Return the first array found at the top level.
 */
function extractArray(parsed: any, preferredKeys: string[] = []): any[] | null {
  if (Array.isArray(parsed)) return parsed;
  if (!parsed || typeof parsed !== "object") return null;
  for (const k of preferredKeys) if (Array.isArray(parsed[k])) return parsed[k];
  const firstArray = Object.values(parsed).find(Array.isArray);
  return (firstArray as any[]) || null;
}

function getGeminiClient(): GoogleGenAI | null {
  const { apiKey, configured } = getAIConfig();
  if (!configured || !apiKey) return null;
  if (!aiClient) aiClient = new GoogleGenAI({ apiKey });
  return aiClient;
}

// ---------------------------------------------------------------------------
// AI response cache: identical prompts (same topic, same params) are served from
// memory for AI_CACHE_TTL_MS, and concurrent identical requests share one call.
// Map preserves insertion order, so deleting and re-inserting on read gives LRU.
// ---------------------------------------------------------------------------
const responseCache = new Map<string, { value: any; expiresAt: number }>();
const pendingRequests = new Map<string, Promise<any>>();
let cacheHits = 0;
let cacheMisses = 0;

function cacheGet(key: string): any | undefined {
  const hit = responseCache.get(key);
  if (!hit) return undefined;
  if (hit.expiresAt <= Date.now()) {
    responseCache.delete(key);
    return undefined;
  }
  responseCache.delete(key);
  responseCache.set(key, hit);
  return hit.value;
}

function cacheSet(key: string, value: any) {
  responseCache.set(key, { value, expiresAt: Date.now() + AI_CACHE_TTL_MS });
  while (responseCache.size > AI_CACHE_MAX_ENTRIES) {
    responseCache.delete(responseCache.keys().next().value as string);
  }
}

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  let timer: NodeJS.Timeout;
  return Promise.race([
    promise.finally(() => clearTimeout(timer)),
    new Promise<T>((_, reject) => {
      timer = setTimeout(() => reject(new Error(`${label} timed out after ${ms} ms`)), ms);
    }),
  ]);
}

// Call the configured provider with timeout, retry on transient errors, caching and in-flight dedupe.
async function callGeminiWithRetry(ai: GoogleGenAI, params: any, retries = 1, delayMs = 1000): Promise<any> {
  const { apiKey, baseUrl, model } = getAIConfig();
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");

  // Google Search grounding is incompatible with structured JSON output; strip it in JSON mode.
  const isJsonMode =
    params.config?.responseMimeType === "application/json" ||
    params.generationConfig?.responseMimeType === "application/json" ||
    Boolean(params.config?.responseSchema);

  const cleanedConfig = params.config ? { ...params.config } : undefined;
  if (isJsonMode && cleanedConfig?.tools) {
    const filteredTools = cleanedConfig.tools.filter((t: any) => !t.googleSearch);
    if (filteredTools.length > 0) cleanedConfig.tools = filteredTools;
    else delete cleanedConfig.tools;
  }
  // The SDK reads `config`; older call sites passed `generationConfig`.
  const mergedConfig = cleanedConfig ?? (params.generationConfig ? { ...params.generationConfig } : undefined);

  let selectedModel = baseUrl ? model : params.model || model || "gemini-2.5-flash";
  if (!isValidModelName(selectedModel) || /gemini-(1\.5|2\.0)-/i.test(selectedModel) || /^gemini-(pro|2\.0-pro|1\.5-pro)$/.test(selectedModel)) {
    selectedModel = "gemini-2.5-flash";
  }

  const normalizedParams = { model: selectedModel, contents: params.contents, config: mergedConfig };
  const cacheKey = `${baseUrl || "gemini"}|${JSON.stringify(normalizedParams)}`;

  const cached = cacheGet(cacheKey);
  if (cached) {
    cacheHits++;
    return cached;
  }
  const inflight = pendingRequests.get(cacheKey);
  if (inflight) return inflight;
  cacheMisses++;

  const requestPromise = (async () => {
    if (baseUrl) return callCustomOpenAI(normalizedParams, apiKey, baseUrl);

    let lastError: any = null;
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        return await withTimeout(ai.models.generateContent(normalizedParams), AI_TIMEOUT_MS, "Gemini request");
      } catch (error: any) {
        lastError = error;
        const message = String(error?.message || error);
        const transient = /429|500|502|503|504|RESOURCE_EXHAUSTED|UNAVAILABLE|high demand|quota|timed out/i.test(message);
        if (transient && attempt < retries) {
          await new Promise((r) => setTimeout(r, delayMs * (attempt + 1)));
          continue;
        }
        break;
      }
    }

    const backup = getBackupProvider();
    if (backup) {
      console.warn(JSON.stringify({ level: "warn", msg: "gemini_failover", error: String(lastError?.message || lastError).slice(0, 160) }));
      return callCustomOpenAI(normalizedParams, backup.apiKey, backup.baseUrl);
    }
    throw lastError;
  })();

  pendingRequests.set(cacheKey, requestPromise);
  try {
    const result = await requestPromise;
    // Cache plain data only (the SDK response object carries getters and prototype state).
    const value = { text: result?.text ?? "" };
    if (value.text) cacheSet(cacheKey, value);
    return value;
  } finally {
    pendingRequests.delete(cacheKey);
  }
}

// Fallback high-quality local clinical data if Gemini API is not configured
const FALLBACK_ANATOMY: Record<string, any> = {
  heart: {
    definition: "A muscular organ in most animals, which pumps blood through the blood vessels of the circulatory system.",
    functions: ["Pumping oxygenated blood to the body", "Pumping deoxygenated blood to the lungs", "Regulating blood pressure via stroke volume & cardiac output"],
    biomarkers: ["Troponin I/T (infarction indicator)", "BNP / NT-proBNP (stretch/heart failure indicator)", "CK-MB (cardiac muscle damage)"],
    pathologies: [
      { name: "Myocardial Infarction", code: "I21.9", desc: "Ischemic necrosis of myocardial tissue usually due to coronary artery occlusion." },
      { name: "Congestive Heart Failure", code: "I50.9", desc: "Inability of the heart to pump sufficient blood to meet metabolic demands." },
      { name: "Atrial Fibrillation", code: "I48.91", desc: "Supraventricular tachyarrhythmia characterized by uncoordinated atrial activation." }
    ],
    tests: ["Electrocardiogram (ECG)", "Echocardiogram (TTE/TEE)", "Coronary Angiography", "Cardiac MRI"],
    trivia: "The heart pumps about 7,200 liters of blood every single day, beating approximately 100,000 times."
  },
  brain: {
    definition: "The central organ of the human nervous system, controlling most of the activities of the body, processing, integrating, and coordinating information.",
    functions: ["Cognitive processing and memory consolidation", "Motor control & coordination", "Autonomic regulation (respiration, cardiac rhythm via brainstem)"],
    biomarkers: ["S100B (astroglial damage marker)", "NSE (Neuron-Specific Enolase)", "Amyloid-Beta 42 & Tau ratio (neurodegeneration)"],
    pathologies: [
      { name: "Ischemic Stroke", code: "I63.9", desc: "Cerebral infarction caused by arterial occlusion, leading to focal neurological deficits." },
      { name: "Glioblastoma Multiforme", code: "C71.9", desc: "A highly aggressive malignant grade IV brain tumor arising from astrocytes." },
      { name: "Meningitis", code: "G00.9", desc: "Acute inflammation of the protective membranes covering the brain and spinal cord." }
    ],
    tests: ["CT Scan of the Head (Non-contrast to rule out hemorrhage)", "Brain MRI (FLAIR, DWI)", "Lumbar Puncture (CSF analysis)", "Electroencephalogram (EEG)"],
    trivia: "While accounting for only 2% of total body weight, the brain consumes about 20% of the body's total energy and oxygen."
  },
  lungs: {
    definition: "A pair of breathing organs situated within the chest which pull in oxygen and expel carbon dioxide from the bloodstream.",
    functions: ["Gas exchange (O2 absorption, CO2 elimination)", "Acid-base balance regulation (via respiratory rate and CO2 partial pressure)", "Filtering small blood clots and emboli"],
    biomarkers: ["Arterial Blood Gas (ABG: PaO2, PaCO2, pH)", "D-Dimer (thromboembolism indicator)", "Procalcitonin (bacterial pneumonia marker)"],
    pathologies: [
      { name: "Pneumonia", code: "J18.9", desc: "Infection that inflames air sacs in one or both lungs, filling them with pus/fluid." },
      { name: "Pulmonary Embolism", code: "I26.99", desc: "Obstruction of one or more pulmonary arteries by solid, liquid, or gas masses." },
      { name: "COPD Exacerbation", code: "J44.1", desc: "Acute worsening of respiratory symptoms beyond normal day-to-day variations." }
    ],
    tests: ["Chest X-Ray (CXR)", "CT Pulmonary Angiography (CTPA)", "Spirometry / Pulmonary Function Tests (PFTs)", "Sputum Culture & Gram Stain"],
    trivia: "The surface area of both human lungs combined is roughly equal to a full tennis court (about 70 square meters)."
  },
  liver: {
    definition: "A large lobulated glandular organ in the abdomen, involved in many metabolic, detoxification, and secretory processes.",
    functions: ["Metabolic processing of carbohydrates, lipids, and proteins", "Bile production for lipid emulsification", "Synthesis of plasma proteins (Albumin, Clotting Factors II, VII, IX, X)"],
    biomarkers: ["Alanine Aminotransferase (ALT)", "Aspartate Aminotransferase (AST)", "Total & Direct Bilirubin", "Alkaline Phosphatase (ALP)"],
    pathologies: [
      { name: "Acute Hepatic Failure", code: "K72.0", desc: "Rapid deterioration of liver function resulting in coagulopathy and encephalopathy." },
      { name: "Decompensated Cirrhosis", code: "K74.60", desc: "Advanced scarring of the liver leading to portal hypertension, ascites, and variceal bleeding." },
      { name: "Nonalcoholic Steatohepatitis (NASH)", code: "K75.81", desc: "Hepatic inflammation and fat accumulation not due to alcohol consumption." }
    ],
    tests: ["Liver Function Panel (LFTs)", "Abdominal Ultrasound", "FibroScan (Transient Elastography)", "Liver Biopsy"],
    trivia: "The liver is the only organ in the human body capable of complete regeneration; as little as 25% of liver tissue can grow back to its full original size."
  },
  stomach: {
    definition: "A muscular, hollow organ in the gastrointestinal tract of humans and many other animals, serving as a primary organ of the digestive system.",
    functions: ["Acidic breakdown of bolus into chyme (using HCl & Pepsin)", "Temporary food reservoir", "Intrinsic factor secretion for Vitamin B12 absorption"],
    biomarkers: ["Pepsinogen I/II ratio", "Gastrin-17 levels", "H. pylori stool antigen / Breath Test"],
    pathologies: [
      { name: "Peptic Ulcer Disease", code: "K27.9", desc: "Breaks in the mucosal lining of the stomach or duodenum, often caused by Helicobacter pylori or NSAIDs." },
      { name: "Gastroparesis", code: "K31.84", desc: "Delayed gastric emptying in the absence of mechanical obstruction, highly prevalent in diabetics." },
      { name: "Gastric Adenocarcinoma", code: "C16.9", desc: "Malignant epithelial tumor of the stomach mucosa, associated with chronic mucosal inflammation." }
    ],
    tests: ["Esophagogastroduodenoscopy (EGD)", "Barium Swallow / Upper GI Series", "Gastric Emptying Study", "Helicobacter pylori Urea Breath Test"],
    trivia: "The hydrochloric acid in your stomach is strong enough to dissolve metal, but a specialized thick mucus layer protects your stomach from digesting itself."
  }
};

const FALLBACK_CASES = [
  {
    id: "MI_001",
    title: "Acute Retrosternal Pressure",
    summary: "A 58-year-old male presents with acute, crushing retrosternal chest pain radiating to his left arm, accompanied by diaphoresis and nausea.",
    demographics: "58-year-old Male, overweight, active smoker, hypertensive.",
    history: "Symptoms began 45 minutes ago while shoveling snow. He has a history of type 2 diabetes and dyslipidemia, non-adherent to statin therapy.",
    initialVitals: { hr: 98, bp: "152/95", spo2: 93, temp: 36.8 },
    correctDiagnosis: "St-Elevation Myocardial Infarction (STEMI)",
    correctTreatment: "Emergency PCI / Coronary Angioplasty & Antiplatelet therapy",
    tests: {
      ecg: { name: "12-Lead ECG", result: "Hyperacute T-waves and 3mm ST-segment elevation in leads V1 to V4 (Anteroseptal MI).", status: "abnormal", details: "Diagnostic of acute transmural anterior myocardial ischemia." },
      labs: { name: "High-Sensitivity Troponin", result: "Troponin I is markedly elevated at 250 ng/L (Normal < 14 ng/L).", status: "abnormal", details: "Indicates acute myocardial injury." },
      cxr: { name: "Chest X-Ray", result: "No evidence of acute pulmonary congestion, pneumonia, or widened mediastinum.", status: "normal", details: "Excludes aortic dissection-associated mediastinal widening." },
      echo: { name: "Echocardiogram", result: "Anteroseptal regional wall motion abnormality (hypokinesis) with reduced Left Ventricular Ejection Fraction (LVEF) at 42%.", status: "abnormal", details: "Consistent with active anterior myocardial wall injury." }
    },
    options: [
      "St-Elevation Myocardial Infarction (STEMI)",
      "Acute Aortic Dissection",
      "Gastroesophageal Reflux Disease (GERD)",
      "Pneumothorax"
    ],
    treatments: [
      { name: "Emergency PCI / Angioplasty", success: true, feedback: "Excellent! The occlusion in the Left Anterior Descending (LAD) artery was dilated and stented. Vitals stabilize immediately, ST elevations resolve, and chest pain subsides.", vitals: { hr: 74, bp: "124/80", spo2: 98, temp: 36.8 } },
      { name: "High-Dose Intravenous Antibiotics", success: false, feedback: "Incorrect. The patient is having an ischemic cardiac event, not a bacterial infection. Valuable cardiac muscle is being lost! Re-evaluate clinical tests.", vitals: { hr: 110, bp: "140/90", spo2: 91, temp: 37.0 } },
      { name: "Administration of IV Thrombolytic (Alteplase)", success: true, feedback: "Good alternative! Since PCI is the gold standard but might not be immediately available everywhere, thrombolysis successfully recanalizes the coronary artery, though stent placement remains preferred.", vitals: { hr: 80, bp: "120/75", spo2: 96, temp: 36.8 } },
      { name: "Antacid & Proton Pump Inhibitor Protocol", success: false, feedback: "Dangerous error! Treating a massive STEMI as GERD delays critical reperfusion. The patient's blood pressure is dropping and runs into ventricular tachycardia!", vitals: { hr: 135, bp: "90/55", spo2: 89, temp: 36.8 } }
    ]
  },
  {
    id: "ST_002",
    title: "Acute Focal Neurological Deficit",
    summary: "A 67-year-old female is brought in by EMS with sudden-onset right-sided weakness, facial drooping, and motor aphasia that started 90 minutes ago.",
    demographics: "67-year-old Female, history of uncontrolled atrial fibrillation and osteoarthritis.",
    history: "Her daughter noticed her slurring words and struggling to lift her coffee cup. No history of recent trauma, coagulopathy, or bleeding disorders.",
    initialVitals: { hr: 112, bp: "178/104", spo2: 96, temp: 36.9 },
    correctDiagnosis: "Acute Ischemic Stroke",
    correctTreatment: "Intravenous Thrombolysis (tPA / Tenecteplase) within therapeutic window",
    tests: {
      ecg: { name: "12-Lead ECG", result: "Irregularly irregular rhythm with absent P waves and variable R-R intervals, heart rate 112 bpm (Atrial Fibrillation).", status: "abnormal", details: "Atrial fibrillation is a major source of cardioembolic strokes." },
      labs: { name: "Coagulation Profile & CBC", result: "Platelets 210,000, INR 1.1 (therapeutic is 2.0-3.0 for Afib, indicating under-anticoagulation). Glucose is normal at 98 mg/dL.", status: "normal", details: "Enables safe use of thrombolytics since blood is not pre-thinned." },
      cxr: { name: "Chest X-Ray", result: "Mild cardiomegaly, otherwise clear lung fields.", status: "normal", details: "Excludes active pulmonary pathology." },
      ct: { name: "Non-Contrast Head CT", result: "No acute intracranial hemorrhage or mass effect. Early hyperdense middle cerebral artery (MCA) sign.", status: "normal", details: "CRITICAL: Excludes hemorrhagic stroke, clearing the path for thrombolytic therapy!" }
    },
    options: [
      "Acute Ischemic Stroke",
      "Intracerebral Hemorrhage (Hemorrhagic Stroke)",
      "Hypoglycemia (Neuroglycopenia)",
      "Bell's Palsy"
    ],
    treatments: [
      { name: "Intravenous Alteplase (tPA)", success: true, feedback: "Brilliant! Initiating tPA at 1.5 hours post-onset is highly effective. The embolic clot in her left MCA dissolves. Facial symmetry and right-sided motor function return to near baseline within hours.", vitals: { hr: 88, bp: "148/85", spo2: 97, temp: 36.8 } },
      { name: "Emergency Neurosurgical Evacuation", success: false, feedback: "Incorrect. There is no hematoma or blood on the CT scan; this is an ischemic stroke, not a hemorrhagic one. Surgical craniotomy is not indicated and would cause severe trauma.", vitals: { hr: 115, bp: "185/110", spo2: 95, temp: 37.1 } },
      { name: "Dual Antiplatelet Therapy (DAPT)", success: true, feedback: "Partial credit! DAPT is excellent for stroke prevention and mild stroke, but given her severe deficit and presenting within 4.5 hours, thrombolysis is the absolute first-line choice to reverse symptoms.", vitals: { hr: 94, bp: "155/92", spo2: 96, temp: 36.9 } },
      { name: "High-Dose Intravenous Insulin (50 Units)", success: false, feedback: "Catastrophic! Her blood glucose was normal (98 mg/dL). Giving high-dose insulin causes extreme iatrogenic hypoglycemia, leading to seizures and permanent neurological injury.", vitals: { hr: 140, bp: "80/40", spo2: 92, temp: 36.5 } }
    ]
  },
  {
    id: "PE_003",
    title: "Pleuritic Chest Pain & Sudden Dyspnea",
    summary: "A 42-year-old female presents with acute pleuritic chest pain, severe dyspnea, and mild tachycardia, occurring shortly after arriving home from a flight from Europe.",
    demographics: "42-year-old Female, taking oral contraceptive pills, sedentary executive.",
    history: "Woke up with sharp chest pain on inspiration. Her right calf is mildly swollen and tender. No cough, fever, or prior cardiac issues.",
    initialVitals: { hr: 118, bp: "115/72", spo2: 89, temp: 37.1 },
    correctDiagnosis: "Acute Pulmonary Embolism",
    correctTreatment: "Intravenous Heparin infusion followed by oral anticoagulation",
    tests: {
      ecg: { name: "12-Lead ECG", result: "Sinus tachycardia at 118 bpm. S1Q3T3 pattern present (Deep S-wave in lead I, Q-wave in III, inverted T-wave in III).", status: "abnormal", details: "Classic sign of acute right ventricular strain." },
      labs: { name: "D-Dimer Assay", result: "Markedly elevated D-Dimer at 2,400 ng/mL (Normal < 500 ng/mL).", status: "abnormal", details: "High sensitivity for venous thromboembolism, warrants imaging." },
      cxr: { name: "Chest X-Ray", result: "Normal lung fields with a wedge-shaped opacity at the right lung periphery (Hampton's Hump).", status: "normal", details: "Often normal in pulmonary embolisms, but can show peripheral ischemia." },
      ctpa: { name: "CT Pulmonary Angiogram", result: "Large saddle embolus bifurcating into both left and right main pulmonary arteries.", status: "abnormal", details: "Diagnostic gold standard. Confirms life-threatening pulmonary embolus." }
    },
    options: [
      "Acute Pulmonary Embolism",
      "Lobular Pneumonia",
      "Panic Attack",
      "Acute Pericarditis"
    ],
    treatments: [
      { name: "Low Molecular Weight Heparin (Enoxaparin)", success: true, feedback: "Perfect decision! Anticoagulation prevents clot propagation and allows endogenous fibrinolytics to slowly degrade the thrombus. Oxygen supplementation relieves hypoxia, heart rate falls.", vitals: { hr: 88, bp: "120/78", spo2: 97, temp: 37.0 } },
      { name: "Broad-Spectrum Antibiotics & Nebulizer", success: false, feedback: "Incorrect. The patient does not have pneumonia or asthma. Delaying anticoagulation poses a high risk of cardiovascular collapse and sudden death.", vitals: { hr: 124, bp: "100/60", spo2: 86, temp: 37.1 } },
      { name: "Intravenous Alteplase (Thrombolytics)", success: true, feedback: "Correct for severe cases! While heparin is standard for hemodynamically stable PE, systemic thrombolysis is indicated if the patient becomes hypotensive (massive PE). Good clinical judgment.", vitals: { hr: 92, bp: "118/76", spo2: 95, temp: 36.9 } },
      { name: "Anxiolytics (Lorazepam 2mg)", success: false, feedback: "Dangerous! Attributing severe hypoxemia (SpO2 89%) and sinus tachycardia after a long flight to a panic attack is a fatal clinical mistake. The patient goes into respiratory arrest.", vitals: { hr: 145, bp: "70/30", spo2: 78, temp: 37.1 } }
    ]
  }
];

// Liveness probe: the process is up and the event loop responds.
app.get("/api/health", (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.json({ status: "ok", uptimeSec: Math.round(process.uptime()) });
});

// Lightweight provider status (never calls a model, never exposes secrets).
app.get("/api/status", (req, res) => {
  const cfg = getAIConfig();
  res.setHeader("Cache-Control", "no-store");
  return res.json({
    configured: cfg.configured,
    source: cfg.configured ? "gemini" : "fallback",
    provider: cfg.provider,
    model: cfg.configured ? cfg.model : null,
  });
});

type CheckStatus = "pass" | "warn" | "fail";
interface ReadinessCheck { id: string; label: string; status: CheckStatus; detail: string }

/**
 * Publish-readiness report. Each check is a deployment precondition; any "fail"
 * makes the endpoint return 503, so it works directly as a readiness probe.
 */
function buildReadinessReport() {
  const cfg = getAIConfig();
  const checks: ReadinessCheck[] = [];
  const add = (id: string, label: string, status: CheckStatus, detail: string) => checks.push({ id, label, status, detail });

  const nodeMajor = Number(process.versions.node.split(".")[0]);
  add("runtime.node", "Node.js 20 or newer", nodeMajor >= 20 ? "pass" : "fail", `Running ${process.versions.node}`);
  add("runtime.env", "NODE_ENV=production", IS_PROD ? "pass" : "warn", IS_PROD ? "Production mode" : `NODE_ENV=${process.env.NODE_ENV || "(unset)"}: dev server and HMR active`);

  if (IS_PROD) {
    const indexHtml = path.join(process.cwd(), "dist", "index.html");
    add("build.frontend", "Frontend build present", fs.existsSync(indexHtml) ? "pass" : "fail", fs.existsSync(indexHtml) ? "dist/index.html found" : "Run npm run build");
  }

  add(
    "ai.provider",
    "AI provider configured",
    cfg.configured ? "pass" : "warn",
    cfg.configured ? `${cfg.provider} · model ${cfg.model}` : "No GEMINI_API_KEY: serving the curated offline dataset",
  );
  if (cfg.baseUrl) {
    add("ai.baseUrl.https", "Provider endpoint uses HTTPS", cfg.baseUrl.startsWith("https://") ? "pass" : "fail", cfg.baseUrl);
  }
  add("ai.backup", "Backup provider for failover", getBackupProvider() ? "pass" : "warn", getBackupProvider() ? "AI_BACKUP_* configured" : "Optional: set AI_BACKUP_BASE_URL and AI_BACKUP_API_KEY");

  const appUrl = cleanEnv(process.env.APP_URL);
  add("app.url", "APP_URL set to an HTTPS origin", appUrl?.startsWith("https://") ? "pass" : "warn", appUrl || "APP_URL not set");
  add("security.trustProxy", "Proxy trust configured", process.env.TRUST_PROXY ? "pass" : "warn", process.env.TRUST_PROXY ? `TRUST_PROXY=${process.env.TRUST_PROXY}` : "Behind a reverse proxy, set TRUST_PROXY=1 so rate limits apply per client");
  add("security.rateLimit", "Rate limiting enabled", "pass", `${RATE_LIMIT_PER_MIN} AI requests/min per client`);
  add("security.secretsInEnv", "Secrets loaded from environment", "pass", "No credentials compiled into the server bundle");

  const rssMb = Math.round(process.memoryUsage().rss / 1048576);
  add("runtime.memory", "Memory headroom", rssMb < 768 ? "pass" : "warn", `RSS ${rssMb} MB`);

  const hitRate = cacheHits + cacheMisses ? Math.round((cacheHits / (cacheHits + cacheMisses)) * 100) : 0;
  add("perf.cache", "AI response cache active", "pass", `${responseCache.size}/${AI_CACHE_MAX_ENTRIES} entries · ${hitRate}% hit rate · TTL ${Math.round(AI_CACHE_TTL_MS / 60000)} min`);

  const summary = checks.reduce((acc, c) => ({ ...acc, [c.status]: acc[c.status] + 1 }), { pass: 0, warn: 0, fail: 0 } as Record<CheckStatus, number>);
  return {
    ready: summary.fail === 0,
    summary,
    checks,
    runtime: { node: process.versions.node, uptimeSec: Math.round(process.uptime()), rssMb, env: process.env.NODE_ENV || "development", version: APP_VERSION },
    generatedAt: new Date().toISOString(),
  };
}

app.get("/api/readiness", (req, res) => {
  const report = buildReadinessReport();
  res.setHeader("Cache-Control", "no-store");
  res.status(report.ready ? 200 : 503).json(report);
});

// Fallback high-quality verified clinical medical images database
const FALLBACK_IMAGES: Record<string, any[]> = {
  "myocardial infarction": [
    {
      originalSourcePage: "https://commons.wikimedia.org/wiki/File:Infarct_of_the_posterior_wall_of_the_left_ventricle.jpg",
      imageTitle: "Acute Posterior Wall Myocardial Infarction Gross Pathology",
      imageCategory: "gross pathology specimen",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/e/ec/Infarct_of_the_posterior_wall_of_the_left_ventricle.jpg",
      sourceName: "Wikimedia Commons",
      authorInstitution: "Patho / University Hospital Pathologists",
      license: "CC BY-SA 3.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/deed.en",
      attributionText: "By Patho - Own work, CC BY-SA 3.0, https://commons.wikimedia.org/wiki/File:Infarct_of_the_posterior_wall_of_the_left_ventricle.jpg",
      teachingPoints: "The gross specimen exhibits a clear yellowish area of coagulative necrosis in the posterior wall of the left ventricle, indicating acute/subacute ischemic injury. Surrounding myocardium shows hyperemia.",
      clinicalPathologyCorrelation: "Infarction results from prolonged coronary artery occlusion (usually LAD or RCA), leading to severe ATP depletion, cell swelling, membrane rupture, and leakage of cardiac troponins into circulation.",
      verificationStatus: "verified"
    }
  ],
  "pneumonia": [
    {
      originalSourcePage: "https://commons.wikimedia.org/wiki/File:Lobar_pneumonia_Klaus_Dieterich.jpg",
      imageTitle: "Lobar Pneumonia of Right Middle Lobe Chest X-Ray",
      imageCategory: "radiology image",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a1/Lobar_pneumonia_Klaus_Dieterich.jpg",
      sourceName: "Wikimedia Commons",
      authorInstitution: "Klaus Dieterich, MD",
      license: "CC BY-SA 3.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/deed.en",
      attributionText: "By Klaus Dieterich - Own work, CC BY-SA 3.0, https://commons.wikimedia.org/wiki/File:Lobar_pneumonia_Klaus_Dieterich.jpg",
      teachingPoints: "The chest X-ray reveals homogeneous consolidation in the right middle lobe with visible air bronchograms. The heart borders remain distinct, correlating with localized lobar involvement.",
      clinicalPathologyCorrelation: "Lobar pneumonia corresponds to alveolar fill with fibrinous exudate, neutrophils, and red blood cells (red and grey hepatization), impairing regional gas exchange and causing ventilation-perfusion mismatch.",
      verificationStatus: "verified"
    }
  ],
  "stroke": [
    {
      originalSourcePage: "https://commons.wikimedia.org/wiki/File:Stroke_ischemic.png",
      imageTitle: "Middle Cerebral Artery (MCA) Ischemic Stroke Head CT",
      imageCategory: "radiology image",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e4/Stroke_ischemic.png",
      sourceName: "Wikimedia Commons",
      authorInstitution: "James Heilman, MD / Clinical Radiologist",
      license: "CC BY-SA 3.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/deed.en",
      attributionText: "By James Heilman, MD - Own work, CC BY-SA 3.0, https://commons.wikimedia.org/wiki/File:Stroke_ischemic.png",
      teachingPoints: "Non-contrast head CT scan showing a prominent, wedge-shaped hypodense region in the left cerebral hemisphere, representing cytotoxic edema and acute tissue infarction within the MCA distribution.",
      clinicalPathologyCorrelation: "Arterial thrombosis prevents oxygen delivery, halting the Na+/K+ ATPase pump. Cellular swelling (cytotoxic edema) develops, causing the characteristic hypodense appearance on CT within 12-24 hours.",
      verificationStatus: "verified"
    }
  ],
  "appendicitis": [
    {
      originalSourcePage: "https://commons.wikimedia.org/wiki/File:Appendicitis_01.jpg",
      imageTitle: "Acute Gangrenous Appendicitis Gross Specimen",
      imageCategory: "gross pathology specimen",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Appendicitis_01.jpg",
      sourceName: "Wikimedia Commons",
      authorInstitution: "Mikael Häggström, MD",
      license: "CC0 1.0 Universal Public Domain Dedication",
      licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/deed.en",
      attributionText: "By Mikael Häggström, MD - Own work, CC0 1.0, https://commons.wikimedia.org/wiki/File:Appendicitis_01.jpg",
      teachingPoints: "Gross specimen of a resected appendix showing marked swelling, congestion of serosal blood vessels, fibrinopurulent exudate, and dark green/black areas indicating focal gangrenous necrosis.",
      clinicalPathologyCorrelation: "Luminal obstruction (by a fecalith or lymphoid hyperplasia) elevates intraluminal pressure, obstructing venous flow. Subsequent ischemia, bacterial invasion, and gangrene present as severe right lower quadrant pain.",
      verificationStatus: "verified"
    }
  ],
  "cirrhosis": [
    {
      originalSourcePage: "https://commons.wikimedia.org/wiki/File:Macronodular_cirrhosis_of_liver.jpg",
      imageTitle: "Macronodular Cirrhosis of the Liver Gross Specimen",
      imageCategory: "gross pathology specimen",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Macronodular_cirrhosis_of_liver.jpg",
      sourceName: "Wikimedia Commons",
      authorInstitution: "Patho / Pathology Department",
      license: "CC BY-SA 3.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/deed.en",
      attributionText: "By Patho - Own work, CC BY-SA 3.0, https://commons.wikimedia.org/wiki/File:Macronodular_cirrhosis_of_liver.jpg",
      teachingPoints: "Gross view of liver parenchyma showing dense, fibrous bands of scar tissue surrounding large, irregular regenerative nodules of hepatocytes exceeding 3mm in diameter.",
      clinicalPathologyCorrelation: "Chronic hepatic inflammation activates hepatic stellate cells to deposit Type I and III collagen in the space of Disse. Fibrosis destroys vascular architecture, giving rise to portal hypertension and ascites.",
      verificationStatus: "verified"
    }
  ]
};

function getFallbackImagesForTopic(topic: string): any[] {
  const normalized = topic.toLowerCase();
  if (normalized.includes("infarct") || normalized.includes("heart") || normalized.includes("coronary") || normalized.includes("cardiac")) {
    return FALLBACK_IMAGES["myocardial infarction"];
  }
  if (normalized.includes("pneumonia") || normalized.includes("lung") || normalized.includes("pulmonary")) {
    return FALLBACK_IMAGES["pneumonia"];
  }
  if (normalized.includes("stroke") || normalized.includes("brain") || normalized.includes("cerebral") || normalized.includes("ischemi")) {
    return FALLBACK_IMAGES["stroke"];
  }
  if (normalized.includes("appendix") || normalized.includes("appendi") || normalized.includes("abdomen") || normalized.includes("belly")) {
    return FALLBACK_IMAGES["appendicitis"];
  }
  if (normalized.includes("cirrhosis") || normalized.includes("liver") || normalized.includes("hepat")) {
    return FALLBACK_IMAGES["cirrhosis"];
  }
  
  // Return high-quality subset as default fallback list
  return [
    ...FALLBACK_IMAGES["myocardial infarction"],
    ...FALLBACK_IMAGES["pneumonia"],
    ...FALLBACK_IMAGES["stroke"],
    ...FALLBACK_IMAGES["appendicitis"],
    ...FALLBACK_IMAGES["cirrhosis"]
  ].slice(0, 3);
}

async function checkUrlLive(url: string, isImage: boolean = false): Promise<{ ok: boolean; contentType?: string; status?: number }> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);
  try {
    // Try HEAD first
    let response = await fetch(url, {
      method: 'HEAD',
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/119.0' },
      signal: controller.signal
    });

    if (!response.ok || (isImage && !response.headers.get('content-type')?.startsWith('image/'))) {
      // If HEAD is blocked or fails (e.g. 405 Method Not Allowed), retry with GET
      clearTimeout(timeoutId);
      const getController = new AbortController();
      const getTimeoutId = setTimeout(() => getController.abort(), 6000);
      
      const headers: Record<string, string> = { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/119.0' 
      };
      if (isImage) {
        // GET with range to avoid downloading the entire large image
        headers['Range'] = 'bytes=0-1024';
      }

      response = await fetch(url, {
        method: 'GET',
        headers,
        signal: getController.signal
      });
      clearTimeout(getTimeoutId);
    } else {
      clearTimeout(timeoutId);
    }

    const contentType = response.headers.get('content-type') || '';
    
    // Redirects check: check response.url
    if (response.url) {
      try {
        const resUrlObj = new URL(response.url);
        const forbiddenDomains = ["pinterest", "instagram", "facebook", "twitter", "x.com", "tiktok", "shutterstock", "istock", "gettyimages", "alamy", "stockphoto", "adobe", "dreamstime", "canva"];
        const isForbiddenRedirect = forbiddenDomains.some(d => resUrlObj.hostname.includes(d));
        if (isForbiddenRedirect) {
          console.log(`[Verification] Redirected to forbidden domain: ${response.url}`);
          return { ok: false, status: response.status, contentType };
        }
      } catch (err) {
        // ignore
      }
    }

    return {
      ok: response.status >= 200 && response.status < 400,
      contentType,
      status: response.status
    };
  } catch (error) {
    clearTimeout(timeoutId);
    console.log(`[Verification] URL check failed for ${url}:`, error);
    return { ok: false };
  }
}

async function verifyMedicalImageAsync(img: any): Promise<{ verified: boolean; score: number; status: "verified" | "needs_review" | "rejected"; metadata?: any }> {
  if (!img || typeof img !== "object") {
    return { verified: false, score: 0, status: "rejected" };
  }

  const originalSourcePage = String(img.originalSourcePage || "").trim();
  const imageUrl = String(img.imageUrl || "").trim();
  let license = String(img.license || "").trim();
  let licenseUrl = String(img.licenseUrl || "").trim();
  let attributionText = String(img.attributionText || "").trim();
  let imageTitle = String(img.imageTitle || "").trim();

  // Basic validation first (synchronous check)
  if (!originalSourcePage || !imageUrl || !license || !licenseUrl || !attributionText || !imageTitle) {
    console.log(`[Verification] Rejected (Missing required fields): ${imageTitle}`);
    return { verified: false, score: 0, status: "rejected" };
  }

  // 1. Domain allowlist check
  const allowedDomains = [
    "wikimedia.org",
    "wikipedia.org",
    "cdc.gov",
    "nih.gov",
    "cancer.gov",
    "nlm.nih.gov",
    "ncbi.nlm.nih.gov"
  ];

  let sourcePageValid = false;
  let imageUrlValid = false;

  try {
    const pageUrlObj = new URL(originalSourcePage);
    const imgUrlObj = new URL(imageUrl);

    sourcePageValid = allowedDomains.some(domain => 
      pageUrlObj.hostname === domain || pageUrlObj.hostname.endsWith("." + domain)
    );
    
    imageUrlValid = allowedDomains.some(domain => 
      imgUrlObj.hostname === domain || imgUrlObj.hostname.endsWith("." + domain)
    );
  } catch (e) {
    console.log(`[Verification] Rejected (Invalid URL format): ${imageUrl}`);
    return { verified: false, score: 0, status: "rejected" };
  }

  if (!sourcePageValid || !imageUrlValid) {
    console.log(`[Verification] Rejected (Domain not allowed): ${imageUrl}`);
    return { verified: false, score: 0, status: "rejected" };
  }

  // 2. Forbidden patterns check (social media, stock, etc.)
  const forbiddenPatterns = [
    "pinterest", "instagram", "facebook", "twitter", "x.com", "tiktok", "shutterstock", 
    "istock", "gettyimages", "alamy", "stockphoto", "adobe", "dreamstime", "canva", 
    "textbook", "scan", "ai-generated", "midjourney", "dall-e", "stable-diffusion", "deviantart"
  ];

  const contentToSearch = `${originalSourcePage} ${imageUrl} ${attributionText} ${imageTitle} ${img.teachingPoints || ""} ${img.clinicalPathologyCorrelation || ""}`.toLowerCase();
  const hasForbiddenPattern = forbiddenPatterns.some(pat => contentToSearch.includes(pat));
  if (hasForbiddenPattern) {
    console.log(`[Verification] Rejected (Forbidden pattern): ${imageUrl}`);
    return { verified: false, score: 0, status: "rejected" };
  }

  // 3. License checks
  const licenseUpper = license.toUpperCase();
  const badLicenseIndicators = ["RESTRICTED", "COPYRIGHT", "ALL RIGHTS RESERVED", "UNCLEAR", "UNKNOWN", "COMMERCIAL ONLY", "PERSONAL USE ONLY", "RESTRICTED-USE"];
  const hasBadLicense = badLicenseIndicators.some(ind => licenseUpper.includes(ind));
  if (hasBadLicense) {
    console.log(`[Verification] Rejected (Restricted license): ${license}`);
    return { verified: false, score: 0, status: "rejected" };
  }

  // Calculate scores
  let sourceCredibilityScore = 0;
  let licenseClarityScore = 0;
  let urlValidityScore = 0;
  let medicalRelevanceScore = 0;
  let metadataCompletenessScore = 0;
  let imageQualityScore = 5; // Default quality score

  // 3a. Source credibility (0-25)
  try {
    const pageUrlObj = new URL(originalSourcePage);
    const domain = pageUrlObj.hostname.toLowerCase();
    if (domain.endsWith("cdc.gov") || domain.endsWith("nih.gov") || domain.endsWith("cancer.gov") || domain.endsWith("nlm.nih.gov") || domain.endsWith("ncbi.nlm.nih.gov")) {
      sourceCredibilityScore = 25;
    } else if (domain.endsWith("wikimedia.org") || domain.endsWith("wikipedia.org")) {
      sourceCredibilityScore = 20;
    } else {
      sourceCredibilityScore = 0;
    }
  } catch (e) {
    sourceCredibilityScore = 0;
  }

  // 3b. License clarity (0-25)
  const isCCorPD = licenseUpper.includes("CC0") || 
                  licenseUpper.includes("PUBLIC DOMAIN") || 
                  licenseUpper.includes("PD") || 
                  licenseUpper.includes("CC BY") || 
                  licenseUpper.includes("CC BY-SA") || 
                  licenseUpper.includes("CREATIVE COMMONS");
  if (isCCorPD) {
    licenseClarityScore = 25;
  } else if (licenseUpper.includes("CC BY-NC") || licenseUpper.includes("NON-COMMERCIAL")) {
    licenseClarityScore = 15;
  } else {
    licenseClarityScore = 0;
  }

  // 3c. Medical relevance (0-15)
  const medicalKeywords = [
    "necrosis", "ischemia", "infarct", "myocardial", "cardiac", "heart", "pneumonia", "lung", "pulmonary", 
    "bronchogram", "consolidation", "stroke", "brain", "cerebral", "hemisphere", "cytotoxic", "edema", "lesion", 
    "appendicitis", "appendix", "gangrenous", "exudate", "cirrhosis", "liver", "fibrosis", "portal", "hepatocyte", 
    "macronodular", "cell", "pathology", "pathophysiology", "clinical", "radiology", "histology", "gross", "microscopy"
  ];
  let keywordCount = 0;
  medicalKeywords.forEach(keyword => {
    if (contentToSearch.includes(keyword)) {
      keywordCount++;
    }
  });
  if (keywordCount >= 3) {
    medicalRelevanceScore = 15;
  } else if (keywordCount >= 1) {
    medicalRelevanceScore = 10;
  } else {
    medicalRelevanceScore = 5;
  }

  // 3d. Metadata completeness (0-10)
  if (img.authorInstitution && String(img.authorInstitution).length > 5) metadataCompletenessScore += 2.5;
  if (img.teachingPoints && String(img.teachingPoints).length > 10) metadataCompletenessScore += 2.5;
  if (img.clinicalPathologyCorrelation && String(img.clinicalPathologyCorrelation).length > 15) metadataCompletenessScore += 2.5;
  if (img.attributionText && String(img.attributionText).length > 5) metadataCompletenessScore += 2.5;

  // 3e. Wikimedia specific verification
  const isWikimedia = originalSourcePage.includes("wikimedia.org") || imageUrl.includes("wikimedia.org");
  if (isWikimedia) {
    try {
      // Extract filename
      let filename = "";
      const pageMatch = originalSourcePage.match(/\/wiki\/(File:[^?#]+)/);
      if (pageMatch && pageMatch[1]) {
        filename = decodeURIComponent(pageMatch[1]);
      } else {
        const urlParts = imageUrl.split('/');
        filename = "File:" + decodeURIComponent(urlParts[urlParts.length - 1]);
      }

      if (filename) {
        const wmApiUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(filename)}&prop=imageinfo&iiprop=extmetadata&format=json&origin=*`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);
        
        const wmRes = await fetch(wmApiUrl, { signal: controller.signal });
        clearTimeout(timeoutId);
        
        if (wmRes.ok) {
          const wmJson = await wmRes.json() as any;
          const pages = wmJson.query?.pages || {};
          const pageKey = Object.keys(pages)[0];
          const pageInfo = pages[pageKey];
          const extmetadata = pageInfo?.imageinfo?.[0]?.extmetadata;
          
          if (extmetadata) {
            const wmLicense = extmetadata.LicenseShortName?.value || "";
            const wmArtist = extmetadata.Artist?.value || "";
            const wmCredit = extmetadata.Credit?.value || "";
            const wmDesc = extmetadata.ImageDescription?.value || "";
            const wmLicenseUrl = extmetadata.LicenseUrl?.value || "";

            const stripHtml = (html: string) => html.replace(/<[^>]*>/g, '').trim();

            if (wmLicense) {
              license = wmLicense;
              const wmLicenseUpper = wmLicense.toUpperCase();
              if (wmLicenseUpper.includes("CC0") || wmLicenseUpper.includes("PUBLIC DOMAIN") || wmLicenseUpper.includes("PD") || wmLicenseUpper.includes("CC-BY") || wmLicenseUpper.includes("CC BY") || wmLicenseUpper.includes("CC-BY-SA") || wmLicenseUpper.includes("CC BY-SA")) {
                licenseClarityScore = 25;
              } else if (wmLicenseUpper.includes("NC") || wmLicenseUpper.includes("NON-COMMERCIAL")) {
                licenseClarityScore = 15;
              } else {
                console.log(`[Verification] Rejected Wikimedia due to restricted license: ${wmLicense}`);
                return { verified: false, score: 0, status: "rejected" };
              }
            }

            if (wmLicenseUrl) {
              licenseUrl = wmLicenseUrl;
            }

            // Generate verified attribution
            const artistClean = wmArtist ? stripHtml(wmArtist) : (wmCredit ? stripHtml(wmCredit) : "Unknown Creator");
            attributionText = `By ${artistClean} - ${license}, via Wikimedia Commons (${filename})`;

            // Metadata updates inside our returning object
            img.license = license;
            img.licenseUrl = licenseUrl;
            img.attributionText = attributionText;
            if (wmDesc) {
              img.imageTitle = stripHtml(wmDesc).substring(0, 100);
              imageTitle = img.imageTitle;
            }
          }
        }
      }
    } catch (e) {
      console.log(`[Verification] Wikimedia metadata API query failed/timed out, continuing with original info:`, e);
    }
  }

  // 3f. Live URL validity check (0-20)
  // The three checks are independent: run them concurrently (worst case 6 s instead of 18 s).
  const [originalSourcePageCheck, imageUrlCheck, licenseUrlCheck] = await Promise.all([
    checkUrlLive(originalSourcePage),
    checkUrlLive(imageUrl, true),
    checkUrlLive(licenseUrl),
  ]);

  if (!originalSourcePageCheck.ok) {
    console.log(`[Verification] Rejected: originalSourcePage check failed for ${originalSourcePage}`);
    return { verified: false, score: 0, status: "rejected" };
  }

  if (!imageUrlCheck.ok) {
    console.log(`[Verification] Rejected: imageUrl check failed for ${imageUrl}`);
    return { verified: false, score: 0, status: "rejected" };
  }

  if (!imageUrlCheck.contentType || !imageUrlCheck.contentType.startsWith("image/")) {
    console.log(`[Verification] Rejected: imageUrl content-type is not image/ for ${imageUrl} (Got ${imageUrlCheck.contentType})`);
    return { verified: false, score: 0, status: "rejected" };
  }

  if (originalSourcePageCheck.ok) urlValidityScore += 5;
  if (imageUrlCheck.ok && imageUrlCheck.contentType?.startsWith("image/")) urlValidityScore += 10;
  if (licenseUrlCheck.ok) urlValidityScore += 5;

  const totalScore = sourceCredibilityScore + licenseClarityScore + urlValidityScore + medicalRelevanceScore + metadataCompletenessScore + imageQualityScore;
  console.log(`[Verification] Title: ${imageTitle}, Score: ${totalScore} (Source: ${sourceCredibilityScore}, License: ${licenseClarityScore}, URL: ${urlValidityScore}, Med: ${medicalRelevanceScore}, Meta: ${metadataCompletenessScore}, Qual: ${imageQualityScore})`);

  let status: "verified" | "needs_review" | "rejected" = "rejected";
  if (totalScore >= 80) {
    status = "verified";
  } else if (totalScore >= 60) {
    status = "needs_review";
  }

  return {
    verified: status === "verified",
    score: totalScore,
    status,
    metadata: img
  };
}

// 1. API: Find real source-linked medical images
app.post("/api/medical-images", async (req, res) => {
  const topic = clampText(req.body?.topic);
  if (!topic) {
    return res.status(400).json({ error: "Medical topic is required" });
  }

  const fallback = getFallbackImagesForTopic(topic);
  res.setTimeout(20000, () => {
    if (!res.headersSent) {
      res.json({ source: "fallback-timeout", data: fallback });
    }
  });
  const ai = getGeminiClient();
  if (!ai) {
    console.log("Gemini client not initialized. Utilizing local verified clinical images fallback database.");
    return res.json({ source: "fallback-no-client", data: fallback });
  }

  try {
    // ... [Prompt omitted for brevity, but I should restore it if possible] ...
    // Actually I can reconstruct it.
    const systemPrompt = `You are an expert clinical medical educator and academic media researcher.
Search the web to find real, authentic, source-linked medical images for the topic: "${topic}".
Return structured educational image metadata only.

You MUST find and extract details for 2 to 4 real, credible medical images representing this topic.
Every URL must be a real, live, open-source or openly-reusable URL of an image file from verified sources (e.g., Wikimedia Commons, CDC Public Health Image Library (PHIL), NIH/NLM resources, NCI Visuals Online, PubMed Central open-access figures, MedPix). Do NOT generate AI images or fabricate URLs.

The search categories can be: "clinical image", "histopathology slide", "gross pathology specimen", "tissue section", "radiology image", "anatomy diagram", "pathophysiology diagram".

For each image, include:
- originalSourcePage: URL of the web page containing the image (e.g., the Wikimedia Commons File page, or PubMed Central article PMC page).
- imageTitle: title or descriptive name of the image.
- imageCategory: one of: "clinical image", "histopathology slide", "gross pathology specimen", "tissue section", "radiology image", "anatomy diagram", "pathophysiology diagram".
- imageUrl: direct URL of the image file (must be a real, live, direct image file URL from Wikimedia Commons [upload.wikimedia.org], CDC, or NIH).
- sourceName: name of the source (e.g., "Wikimedia Commons", "CDC PHIL", "PubMed Central", "MedPix").
- authorInstitution: creator, author, or institution.
- license: the specific open-access license (e.g., "CC BY-SA 3.0", "CC BY 4.0", "CC0", "Public Domain").
- licenseUrl: the URL for the license terms.
- attributionText: proper attribution string.
- teachingPoints: clinical pearls or teaching points about what is shown in the image (2-3 sentences).
- clinicalPathologyCorrelation: detailed correlation linking the visual findings to the molecular/cellular pathophysiology or clinical presentation.
- verificationStatus: set to "verified" if from a verified clinical source.

Reject all AI-generated images, unsourced images, social media reposts, stock photos, copyrighted textbook scans, paywalled atlas images, or identifiable patient images without clear consent.

Return ONLY valid JSON of the form {"images": [ ...image objects... ]}, without any markdown formatting wrappers or backticks.`;

    const response = await callGeminiWithRetry(ai, {
      model: "gemini-2.5-flash",
      contents: systemPrompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    // JSON-object mode returns {"images":[...]}, not a bare array.
    const parsed = cleanAndParseJSON(response.text || "[]");
    const rawList = (extractArray(parsed, ["images", "data", "results"]) || []).slice(0, 6);
    
    // Concurrently verify medical images using the upgraded async verifier with live HTTP checks
    const verificationResults = await Promise.all(
      rawList.map(async (img: any) => {
        try {
          const result = await verifyMedicalImageAsync(img);
          if (result.status === "rejected") {
            return null;
          }
          return {
            ...result.metadata,
            verificationStatus: result.status,
            verificationScore: result.score
          };
        } catch (e) {
          console.warn("Error verifying image asynchronously:", e);
          return null;
        }
      })
    );

    // Filter out rejected null entries
    const filteredAndReviewed = verificationResults.filter(Boolean);
    if (filteredAndReviewed.length === 0) {
      // Nothing survived verification: fall back to curated verified images rather than an empty atlas.
      return res.json({ source: "fallback-none-verified", data: fallback });
    }
    return res.json({ source: "gemini", data: filteredAndReviewed });
  } catch (error: any) {
    const errorMsg = error?.message || String(error);
    console.log("Gemini medical images search service failed or unavailable. Activating clinical images fallback safely:", errorMsg);
    return res.json({ source: "fallback-due-to-error", data: fallback });
  }
});

// 2. API: Proxy Wikimedia API search
app.get("/api/wikimedia-search", async (req, res) => {
  const query = clampText(req.query.query, 120);
  if (!query) {
    return res.status(400).json({ error: "Query parameter is required" });
  }

  try {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(query + ' medical')}&gsrlimit=8&prop=imageinfo&iiprop=url|extmetadata&format=json`;
    const response = await fetch(url, {
      headers: { 'User-Agent': 'MedMapVisualAtlas/6.0' },
      signal: AbortSignal.timeout(8000),
    });
    
    if (!response.ok) {
      throw new Error(`Wikimedia API returned ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.warn("Error proxying Wikimedia search:", error);
    res.status(500).json({ error: "Failed to fetch from Wikimedia" });
  }
});


// 1b. API: Symptom Mechanism Mapping Module
app.post("/api/symptom-mechanism-map", async (req, res) => {
  const topic = clampText(req.body?.topic);
  const case_details = clampText(req.body?.case_details, 1000);
  const symptoms = Array.isArray(req.body?.symptoms)
    ? req.body.symptoms.map((x: unknown) => clampText(x, 80)).filter(Boolean).slice(0, 12).join(", ")
    : clampText(req.body?.symptoms, 600);
  if (!topic) {
    return res.status(400).json({ error: "Missing required topic field" });
  }

  const fallback = getFallbackMap(topic, symptoms);

  const ai = getGeminiClient();
  if (!ai) {
    console.log("Gemini client not initialized. Utilizing local high-fidelity symptom mechanism fallback.");
    return res.json({ source: "fallback", data: fallback });
  }

  try {
    const prompt = `You are an expert clinician, pathophysiologist, histopathologist, biochemist, geneticist, medical educator, and clinical reasoning architect.
Build a complete, structured "Symptom Mechanism Mapping" module for:
TOPIC: ${topic}
PATIENT / CASE DETAILS: ${case_details || "None provided"}
SYMPTOMS AND SIGNS: ${symptoms || "Common presentations for this topic"}

Explain not only "what symptom occurs," but exactly "why it occurs."
Your output must be returned strictly in raw JSON format matching the following structure:
{
  "topic": "${topic}",
  "diseaseOverview": "Detailed clinical overview of the pathology/disease...",
  "keySymptoms": [
    {
      "name": "Symptom name",
      "definition": "Definition...",
      "acuteChronic": "Acute/chronic nature...",
      "commonness": "Commonness percentage/frequency...",
      "severityImplication": "Severity implication...",
      "redFlagStatus": "Red flag status...",
      "relatedOrganSystem": "Related organ system..."
    }
  ],
  "masterTable": [
    {
      "symptomName": "Symptom name",
      "primaryMechanism": "Primary mechanism...",
      "anatomicalSite": "Anatomical site involved...",
      "histopathology": "Histopathological changes...",
      "biochemicalBasis": "Biochemical basis...",
      "geneticMolecularBasis": "Genetic/molecular basis...",
      "keyInvestigations": "Key investigations...",
      "differentialClues": "Differential clues...",
      "treatmentImplication": "Treatment implication...",
      "highYieldPoint": "High-yield exam point..."
    }
  ],
  "pathophysiologicalAnalysis": [
    {
      "symptomName": "Symptom name",
      "primaryDiseaseMechanism": "Primary disease mechanism...",
      "initiatingTrigger": "Initiating trigger...",
      "cellularResponse": "Cellular response...",
      "tissueLevelChange": "Tissue level change...",
      "organLevelDysfunction": "Organ level dysfunction...",
      "systemicEffect": "Systemic effect...",
      "finalClinicalManifestation": "Final clinical manifestation...",
      "chainOfEvents": "Cause -> Molecular event -> Cellular injury/adaptation -> Tissue pathology -> Organ dysfunction -> Symptom/sign"
    }
  ],
  "histopathologicalAnalysis": [
    {
      "symptomName": "Symptom name",
      "relevantTissue": "Relevant tissue involved...",
      "microscopicChanges": "Microscopic changes...",
      "cellularInfiltrate": "Cellular infiltrate...",
      "pathologicalProcess": "Necrosis, fibrosis, edema, inflammation, atrophy, hypertrophy, hyperplasia, dysplasia, or malignancy...",
      "vascularChanges": "Vascular changes...",
      "specialStains": "Special stains...",
      "immunohistochemistry": "Immunohistochemistry...",
      "mechanismOfSymptomProduction": "How the microscopic finding produces the symptom..."
    }
  ],
  "biochemicalAnalysis": [
    {
      "symptomName": "Symptom name",
      "enzymeAbnormality": "Enzyme abnormality...",
      "hormonalAbnormality": "Hormonal abnormality...",
      "metabolicPathwayAffected": "Metabolic pathway affected...",
      "receptorDysfunction": "Receptor dysfunction...",
      "ionChannelAbnormality": "Ion channel abnormality...",
      "electrolyteDisturbance": "Electrolyte disturbance...",
      "acidBaseDisturbance": "Acid-base disturbance...",
      "oxidativeStress": "Oxidative stress...",
      "inflammatoryMediator": "Inflammatory mediator...",
      "cytokineRole": "Cytokine or chemokine role...",
      "biomarkersLabCorrelation": "Biomarkers and lab correlation..."
    }
  ],
  "geneticAndMolecularAnalysis": [
    {
      "symptomName": "Symptom name",
      "geneInvolved": "Gene involved if known...",
      "mutationType": "Mutation type if relevant...",
      "inheritancePattern": "Inheritance pattern if relevant...",
      "proteinAffected": "Protein affected...",
      "molecularPathway": "Molecular pathway affected...",
      "genotypePhenotypeCorrelation": "Genotype-phenotype correlation...",
      "epigeneticContribution": "Epigenetic contribution...",
      "pharmacogenomicRelevance": "Pharmacogenomic relevance...",
      "familialRiskScreening": "Familial risk or screening implication..."
    }
  ],
  "anatomyPhysiologyCorrelation": [
    {
      "symptomName": "Symptom name",
      "anatomicalStructure": "Anatomical structure involved...",
      "normalFunction": "Normal function...",
      "howStructuralDamageCausesDysfunction": "How structural damage causes dysfunction...",
      "localVsSystemic": "Local vs systemic effect...",
      "neurovascularLymphatic": "Neurovascular or lymphatic correlation...",
      "normalPhysiologicalProcess": "Normal physiological process...",
      "abnormalPhysiologicalChange": "Abnormal physiological change...",
      "feedbackLoopDisruption": "Feedback loop disruption...",
      "homeostaticFailure": "Homeostatic failure...",
      "compensatoryResponse": "Compensatory response...",
      "decompensaryMechanism": "Decompensation mechanism..."
    }
  ],
  "investigationCorrelation": [
    {
      "symptomName": "Symptom name",
      "bedsideTests": "Bedside tests...",
      "laboratoryTests": "Laboratory tests...",
      "imagingFindings": "Imaging findings...",
      "histopathologyFindings": "Histopathology findings...",
      "geneticTests": "Genetic tests...",
      "biomarkers": "Biomarkers...",
      "diagnosticCriteria": "Diagnostic criteria...",
      "expectedAbnormalResults": "Expected abnormal results...",
      "howTestConfirmsMechanism": "How test confirms the mechanism..."
    }
  ],
  "differentialDiagnosisMapping": [
    {
      "symptomName": "Symptom name",
      "otherDiseases": "Other diseases causing same symptom...",
      "sharedMechanism": "Shared mechanism...",
      "differentMechanism": "Different mechanism...",
      "differentiatingClues": "Differentiating clues...",
      "mostDangerousDifferential": "Most dangerous differential...",
      "mostCommonDifferential": "Most common differential...",
      "commonDiagnosticTraps": "Common diagnostic traps..."
    }
  ],
  "therapeuticImplications": [
    {
      "symptomName": "Symptom name",
      "treatmentTarget": "Treatment target...",
      "mechanismOfSymptomRelief": "Mechanism of symptom relief...",
      "diseaseModifyingTherapy": "Disease-modifying therapy...",
      "supportiveTherapy": "Supportive therapy...",
      "advancedTherapy": "Advanced therapy...",
      "monitoringResponse": "Monitoring response...",
      "urgentTreatmentCriteria": "When urgent treatment is needed..."
    }
  ],
  "visualMindMapStructure": [
    {
      "symptomName": "Symptom name",
      "branches": {
        "pathophysiology": "short summary node...",
        "histopathology": "short summary node...",
        "biochemistry": "short summary node...",
        "genetics": "short summary node...",
        "anatomy": "short summary node...",
        "physiology": "short summary node...",
        "investigations": "short summary node...",
        "differentialDiagnosis": "short summary node...",
        "treatmentImplication": "short summary node...",
        "highYieldPoint": "short summary node..."
      }
    }
  ],
  "causeToSymptomFlow": [
    {
      "etiology": "Etiology...",
      "molecularTrigger": "Molecular trigger...",
      "biochemicalDisturbance": "Biochemical disturbance...",
      "cellularInjury": "Cellular injury...",
      "histopathologicalChange": "Histopathological change...",
      "organDysfunction": "Organ dysfunction...",
      "clinicalSymptom": "Clinical symptom...",
      "diagnosticFinding": "Diagnostic finding...",
      "treatmentTarget": "Treatment target..."
    }
  ],
  "caseBasedCorrelation": [
    {
      "finding": "Present symptom/finding...",
      "mechanisticExplanation": "Mechanistic explanation...",
      "supportingEvidenceHistory": "Supporting evidence from history...",
      "supportingExamination": "Supporting examination finding...",
      "supportingLabImaging": "Supporting lab/imaging finding...",
      "differentialDiagnosis": "Differential diagnosis...",
      "finalInterpretation": "Final interpretation..."
    }
  ],
  "highYieldExamPoints": [
    {
      "symptomName": "Symptom name",
      "oneLineMechanism": "One-line mechanism...",
      "mcqTrap": "MCQ trap...",
      "vivaQuestion": "Viva question...",
      "diagnosticClue": "Diagnostic clue...",
      "redFlag": "Red flag...",
      "mustKnowCorrelation": "Must-know correlation...",
      "memoryHook": "Memory hook..."
    }
  ],
  "visualLearningPrompts": {
    "pathophysiologyDiagram": "Detailed illustration prompt for pathophysiology...",
    "histopathologySlide": "Detailed illustration prompt for histopathology slide...",
    "grossPathology": "Detailed illustration prompt for gross pathology...",
    "biochemicalPathway": "Detailed illustration prompt for biochemical pathway...",
    "geneticPathway": "Detailed illustration prompt for genetic pathway...",
    "flowchart": "Detailed illustration prompt for flowchart...",
    "reasoningMap": "Detailed illustration prompt for clinical reasoning map..."
  },
  "finalSummary": "High-yield educational summary of the disease mapping...",
  "sourcesAndLinks": [
    {
      "originalSourcePage": "URL of the original educational page...",
      "imageTitle": "Title of the clinical/medical image...",
      "imageCategory": "Category (e.g. radiology, histology, gross pathology)...",
      "imageUrl": "Direct open-access image URL (from Wikimedia, NIH, CDC)...",
      "sourceName": "E.g. Wikimedia Commons, MedPix, CDC, NIH...",
      "authorInstitution": "Author or Institution name...",
      "license": "E.g. CC BY-SA 4.0, Public Domain...",
      "licenseUrl": "URL to license details...",
      "attributionText": "Attribution text...",
      "teachingPoints": "Key clinical teaching points...",
      "clinicalPathologyCorrelation": "Pathology correlation...",
      "verificationStatus": "verified"
    }
  ],
  "references": ["Title of Study - Author, Journal, Year (DOI or URL)"]
}

Ensure all URLs in "sourcesAndLinks" are real, valid links from Wikimedia Commons or NIH/CDC, and do NOT fabricate URLs.
For "references", provide ONLY actual existing clinical references. Do NOT fabricate citations.
Return ONLY valid raw JSON matching this structure. Do not include markdown code backticks.`;

    const response = await callGeminiWithRetry(ai, {
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const parsed = cleanAndParseJSON(response.text || "");
    return res.json({ source: "gemini", data: parsed });
  } catch (error: any) {
    console.warn("Gemini mapping fallback activated:", error?.message || error);
    return res.json({ source: "fallback-due-to-error", data: fallback });
  }
});

// 2. API: Analyze symptoms
app.post("/api/analyze-symptoms", async (req, res) => {
  const symptoms: string[] = Array.isArray(req.body?.symptoms)
    ? req.body.symptoms.map((x: unknown) => clampText(x, 80)).filter(Boolean).slice(0, 15)
    : [];
  if (symptoms.length === 0) {
    return res.status(400).json({ error: "Missing or invalid symptoms array" });
  }

  // Simple local symptom analyzer for fallback
  const getFallbackAnalysis = (symList: string[]) => {
    const syms = symList.map(s => s.toLowerCase());
    if (syms.some(s => s.includes("chest") || s.includes("angina")) && syms.some(s => s.includes("dyspnea") || s.includes("breath"))) {
      return {
        differentials: [
          { name: "Myocardial Infarction", probability: 45, mechanism: "Occlusion of coronary artery causing regional ischemia and necrosis.", emergency: true },
          { name: "Pulmonary Embolism", probability: 30, mechanism: "Obstruction of pulmonary vasculature, typically by deep vein thrombus.", emergency: true },
          { name: "Pneumothorax", probability: 15, mechanism: "Accumulation of air in the pleural space compressing lung parenchyma.", emergency: true },
          { name: "Gastroesophageal Reflux Disease", probability: 10, mechanism: "Acid irritation of esophageal mucosa simulating retrosternal pain.", emergency: false }
        ],
        tests: ["12-lead Electrocardiogram (ECG)", "High-sensitivity Cardiac Troponin", "CT Pulmonary Angiography (CTPA)", "Chest X-Ray (CXR)"],
        clinicalPearl: "Always prioritize excluding the 'Big Five' lethal causes of chest pain: MI, PE, Aortic Dissection, Tension Pneumothorax, and Esophageal Rupture."
      };
    }
    
    return {
      differentials: [
        { name: "Viral Upper Respiratory Infection", probability: 55, mechanism: "Viral invasion of respiratory mucosa triggering inflammatory cascade.", emergency: false },
        { name: "Allergic Rhinitis / Asthma Flare", probability: 25, mechanism: "IgE-mediated hypersensitivity reaction causing bronchoconstriction.", emergency: false },
        { name: "Acute Bronchitis", probability: 15, mechanism: "Self-limiting inflammation of large bronchi, typically post-viral.", emergency: false },
        { name: "Atypical Pneumonia", probability: 5, mechanism: "Mycoplasma or Chlamydia infection causing interstitial alveolar infiltrates.", emergency: true }
      ],
      tests: ["Sputum Culture", "Complete Blood Count (CBC) with Differential", "Chest Radiograph", "Spirometry"],
      clinicalPearl: "The absence of fever and focal lung consolidation strongly points away from bacterial lobar pneumonia."
    };
  };

  const fallback = getFallbackAnalysis(symptoms);
  const ai = getGeminiClient();
  if (!ai) {
    return res.json({ source: "fallback", data: fallback });
  }

  try {
    const prompt = `You are an elite clinical diagnostic AI specializing in differential diagnostics.
Analyze the following presenting symptoms: ${JSON.stringify(symptoms)}.
Formulate a rigorous, clinically sound differential diagnosis.
Your response MUST be in raw JSON format with the following exact keys and structure:
{
  "differentials": [
    {
      "name": "Diagnosis Name",
      "probability": 60, // integer representing percentage
      "mechanism": "Detailed physiological/cellular mechanism linking the symptoms to the condition.",
      "emergency": true // true if life-threatening
    }
  ],
  "tests": ["List 4 targeted diagnostic tests to narrow down these differentials"],
  "clinicalPearl": "A high-yield clinical tip or mnemonic for managing or identifying this combination."
}
Limit differentials to 4. Ensure probabilities sum to 100%. Return only raw JSON.`;

    const response = await callGeminiWithRetry(ai, {
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            differentials: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  probability: { type: Type.INTEGER },
                  mechanism: { type: Type.STRING },
                  emergency: { type: Type.BOOLEAN }
                },
                required: ["name", "probability", "mechanism", "emergency"]
              }
            },
            tests: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            clinicalPearl: { type: Type.STRING }
          },
          required: ["differentials", "tests", "clinicalPearl"]
        }
      }
    });

    const parsed = cleanAndParseJSON(response.text || "");
    return res.json({ source: "gemini", data: parsed });
  } catch (error: any) {
    const errorMsg = error?.message || String(error);
    const isRateLimit = errorMsg.includes("503") || 
                        errorMsg.includes("429") || 
                        errorMsg.includes("RESOURCE_EXHAUSTED") || 
                        errorMsg.toLowerCase().includes("quota") || 
                        errorMsg.toLowerCase().includes("unavailable");
    if (isRateLimit) {
      console.log("Gemini is currently experiencing high demand or rate limits. Utilizing local high-fidelity differential fallback clinical data safely.");
    } else {
      console.log("Gemini analyze-symptoms service unavailable. Activating clinical simulation fallback safely:", errorMsg);
    }
    return res.json({ source: "fallback-due-to-error", data: fallback });
  }
});

// 3. API: Get drug interaction
app.post("/api/get-drug-interaction", async (req, res) => {
  const drugA = clampText(req.body?.drugA, 100);
  const drugB = clampText(req.body?.drugB, 100);
  if (!drugA || !drugB) {
    return res.status(400).json({ error: "Missing drug names" });
  }

  const getFallbackInteraction = (a: string, b: string) => {
    const da = a.toLowerCase();
    const db = b.toLowerCase();

    if ((da.includes("nsaid") || da.includes("aspirin") || da.includes("ibuprofen")) &&
        (db.includes("anticoagulant") || db.includes("warfarin") || db.includes("heparin") || db.includes("apixaban"))) {
      return {
        severity: "Severe",
        mechanism: "Synergistic pharmacodynamic effect. NSAIDs inhibit platelet COX-1 (reducing Thromboxane A2) and damage gastric mucosa, multiplying the bleeding risk of systemic anticoagulants.",
        clinicalGuideline: "Avoid co-administration. Use Acetaminophen for pain control. If NSAIDs are mandatory, prescribe a concurrent proton pump inhibitor (PPI) and monitor Hemoglobin and stool color closely.",
        alternatives: "Acetaminophen for analgesia; Celecoxib (highly selective COX-2, with extreme caution) + PPI."
      };
    }

    if ((da.includes("beta-blocker") || da.includes("metoprolol")) && (db.includes("calcium channel blocker") || db.includes("verapamil") || db.includes("diltiazem"))) {
      return {
        severity: "Moderate",
        mechanism: "Additive negative inotropic and dromotropic effects. Concurrent use blocks both beta-adrenergic and L-type calcium channels, severely depressing SA/AV node conduction and cardiac contractility.",
        clinicalGuideline: "Monitor HR and BP. High risk of severe bradycardia, AV block, and cardiogenic shock. Avoid combining with non-dihydropyridine CCBs (Verapamil, Diltiazem).",
        alternatives: "Combine Beta-blocker with a Dihydropyridine CCB (Amlodipine) or an ACE inhibitor instead of Verapamil/Diltiazem."
      };
    }

    return {
      severity: "None",
      mechanism: "No major direct pharmacodynamic or cytochrome P450 pharmacokinetic interactions noted. Metabolized via distinct metabolic pathways.",
      clinicalGuideline: "Generally safe to co-administer. Standard clinical vigilance is advised.",
      alternatives: "No changes needed."
    };
  };

  const fallback = getFallbackInteraction(drugA, drugB);
  const ai = getGeminiClient();
  if (!ai) {
    return res.json({ source: "fallback", data: fallback });
  }

  try {
    const prompt = `You are an elite clinical pharmacologist and toxicologist.
Analyze the interaction between "${drugA}" and "${drugB}".
Provide highly detailed pharmacokinetics/pharmacodynamics interaction profiles.
Your response MUST be in raw JSON format with the following exact keys and structure:
{
  "severity": "Severe" | "Moderate" | "Mild" | "None",
  "mechanism": "Comprehensive biochemical and physiological mechanism of the interaction. Mention enzymes (e.g. CYP3A4), receptors, or physiological feedback loops involved.",
  "clinicalGuideline": "Clear, direct clinical recommendations, monitoring rules (vitals/labs), or tapering strategies.",
  "alternatives": "Specific, safer substitute drugs or class switches for the patient."
}
Return only raw JSON.`;

    const response = await callGeminiWithRetry(ai, {
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            severity: {
              type: Type.STRING,
              description: "Severity level of interaction: Severe, Moderate, Mild, or None"
            },
            mechanism: { type: Type.STRING },
            clinicalGuideline: { type: Type.STRING },
            alternatives: { type: Type.STRING }
          },
          required: ["severity", "mechanism", "clinicalGuideline", "alternatives"]
        }
      }
    });

    const parsed = cleanAndParseJSON(response.text || "");
    return res.json({ source: "gemini", data: parsed });
  } catch (error: any) {
    const errorMsg = error?.message || String(error);
    const isRateLimit = errorMsg.includes("503") || 
                        errorMsg.includes("429") || 
                        errorMsg.includes("RESOURCE_EXHAUSTED") || 
                        errorMsg.toLowerCase().includes("quota") || 
                        errorMsg.toLowerCase().includes("unavailable");
    if (isRateLimit) {
      console.log("Gemini is currently experiencing high demand or rate limits. Utilizing local high-fidelity pharmacodynamic fallback clinical data safely.");
    } else {
      console.log("Gemini get-drug-interaction service unavailable. Activating clinical simulation fallback safely:", errorMsg);
    }
    return res.json({ source: "fallback-due-to-error", data: fallback });
  }
});

// 4b. API: Get topic-specific drugs dynamically
function getFallbackDrugsForTopic(topic: string) {
  const norm = (topic || "").toLowerCase();
  if (norm.includes("infarct") || norm.includes("heart") || norm.includes("coronary")) {
    return [
      { id: "aspirin", name: "Aspirin (Acetylsalicylic Acid)", class: "Antiplatelet", desc: "Inhibits COX-1 irreversibly to prevent platelet aggregation in acute coronary events." },
      { id: "clopidogrel", name: "Clopidogrel (Plavix)", class: "P2Y12 Inhibitor", desc: "Synergistic antiplatelet that blocks ADP receptors on platelet membranes." },
      { id: "metoprolol", name: "Metoprolol Succinate", class: "Beta-1 Blocker", desc: "Reduces heart rate and myocardial oxygen demand to limit infarct size." },
      { id: "apixaban", name: "Apixaban (Eliquis)", class: "Factor Xa Inhibitor Anticoagulant", desc: "Used to prevent systemic thrombus in atrial fibrillation or arterial lines." },
      { id: "atorvastatin", name: "Atorvastatin (Lipitor)", class: "HMG-CoA Reductase Inhibitor", desc: "Stabilizes coronary arterial plaques and lowers LDL-C aggressively." },
      { id: "lisinopril", name: "Lisinopril (Zestril)", class: "ACE Inhibitor", desc: "Blocks conversion of Angiotensin I to II, preventing negative cardiac remodeling." },
      { id: "nitroglycerin", name: "Nitroglycerin (Nitro-Bid)", class: "Organic Nitrate Vasodilator", desc: "Venodilator that reduces preload and relieves ischemic retrosternal chest pain." }
    ];
  }
  if (norm.includes("pneumonia") || norm.includes("lung") || norm.includes("pulmonary")) {
    return [
      { id: "ceftriaxone", name: "Ceftriaxone (Rocephin)", class: "Third-Generation Cephalosporin", desc: "Binds penicillin-binding proteins to inhibit bacterial cell wall synthesis in pneumonia." },
      { id: "azithromycin", name: "Azithromycin (Zithromax)", class: "Macrolide Antibiotic", desc: "Inhibits bacterial protein synthesis by binding to 50S ribosomal subunits." },
      { id: "albuterol", name: "Albuterol (ProAir)", class: "Beta-2 Adrenergic Agonist", desc: "Symptomatic bronchodilator relaxing smooth muscle in reactive airways." },
      { id: "prednisone", name: "Prednisone (Deltasone)", class: "Systemic Glucocorticoid", desc: "Suppresses inflammatory cytokine synthesis and decreases airway edema." },
      { id: "levofloxacin", name: "Levofloxacin (Levaquin)", class: "Fluoroquinolone Antibiotic", desc: "Inhibits DNA gyrase, covering atypical respiratory pathogens." },
      { id: "acetylcysteine", name: "Acetylcysteine (Mucomyst)", class: "Mucolytic Agent", desc: "Cleaves disulfide bonds in mucoproteins to reduce sputum viscosity." }
    ];
  }
  if (norm.includes("stroke") || norm.includes("cerebral") || norm.includes("brain")) {
    return [
      { id: "alteplase", name: "Alteplase (tPA)", class: "Thrombolytic / Tissue Plasminogen Activator", desc: "Converts plasminogen to plasmin to dissolve fibrin-rich ischemic stroke thrombi." },
      { id: "aspirin", name: "Aspirin (Acetylsalicylic Acid)", class: "Antiplatelet", desc: "Initiated post-bleed exclusion to prevent secondary ischemic stroke recurrences." },
      { id: "clopidogrel", name: "Clopidogrel (Plavix)", class: "ADP P2Y12 Receptor Antagonist", desc: "Alternative antiplatelet used for secondary prevention of cerebral infarction." },
      { id: "atorvastatin", name: "Atorvastatin (Lipitor)", class: "HMG-CoA Reductase Inhibitor", desc: "Plaque-stabilizing statin targeting LDL cholesterol reduction." },
      { id: "labetalol", name: "Labetalol Hydrochloride", class: "Alpha/Beta Blocker", desc: "Maintains blood pressure below 185/110 mmHg to permit thrombolysis safely." },
      { id: "mannitol", name: "Mannitol (Osmitrol)", class: "Osmotic Diuretic", desc: "Establishes osmotic gradient to draw fluid from brain parenchymal cells, reducing ICP." }
    ];
  }

  const cap = topic.charAt(0).toUpperCase() + topic.slice(1);
  return [
    { id: "drug_a", name: `${cap}-Therapy Option A`, class: "Primary Therapeutic Class", desc: `Standard first-line pharmacological treatment designed for ${cap} to target core etiology.` },
    { id: "drug_b", name: `${cap}-Therapy Option B`, class: "Secondary Supportive Class", desc: `Secondary supportive agent used to relieve associated symptoms in ${cap}.` },
    { id: "drug_c", name: `${cap}-Therapy Option C`, class: "Preventative Agent", desc: `Long-term preventive pharmacological therapy designed to limit recurrences of ${cap}.` },
    { id: "ibuprofen", name: "Ibuprofen (Advil)", class: "NSAID Analgesic", desc: "Provides anti-inflammatory relief and manages secondary clinical pain." },
    { id: "omeprazole", name: "Omeprazole (Prilosec)", class: "Proton Pump Inhibitor", desc: "Protects gastrointestinal mucosa and manages potential hyperacidity." },
    { id: "sertraline", name: "Sertraline (Zoloft)", class: "SSRI Antidepressant", desc: "Used to manage secondary quality-of-life adjustments or chronic distress." }
  ];
}

app.post("/api/get-topic-drugs", async (req, res) => {
  const cleanTopic = clampText(req.body?.topic);
  if (!cleanTopic) {
    return res.status(400).json({ error: "Topic is required" });
  }

  const fallback = getFallbackDrugsForTopic(cleanTopic);
  const ai = getGeminiClient();

  if (!ai) {
    return res.json({ source: "fallback", data: fallback });
  }

  try {
    const prompt = `You are an expert clinical pharmacologist.
Generate a list of exactly 6-8 key medications commonly used to treat, manage, or diagnose: "${cleanTopic}".
Each drug MUST have:
- id: a unique string slug (e.g. "aspirin")
- name: brand/generic name (e.g. "Aspirin (Acetylsalicylic Acid)")
- class: pharmacological class (e.g. "Antiplatelet / NSAID")
- desc: a short explanation of how it is used for this condition and its mechanism.

Return your response strictly in raw JSON format matching this array structure:
[
  {
    "id": "drug_id",
    "name": "Drug Name",
    "class": "Class Name",
    "desc": "Usage explanation"
  }
]`;

    const response = await callGeminiWithRetry(ai, {
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: { responseMimeType: "application/json" }
    });

    const list = extractArray(cleanAndParseJSON(response.text || ""), ["drugs", "medications", "data"]);
    if (list && list.length > 0) {
      return res.json({ source: "gemini", data: list.filter((d: any) => d && typeof d.name === "string").slice(0, 10) });
    }
    throw new Error("Invalid structure returned");
  } catch (error: any) {
    console.log("Failed to dynamically generate topic drugs:", error?.message || error);
    return res.json({ source: "fallback-due-to-error", data: fallback });
  }
});

// 5. API: Get list of medical cases
app.get("/api/cases", (req, res) => {
  // We can return the fallback cases which are extremely comprehensive and high-quality!
  return res.json(FALLBACK_CASES);
});

/** A case is playable only if the simulator can render it without crashing. */
function isPlayableCase(c: any): boolean {
  return Boolean(
    c && typeof c === "object" &&
    typeof c.title === "string" &&
    typeof c.correctDiagnosis === "string" &&
    c.initialVitals && typeof c.initialVitals.hr === "number" && typeof c.initialVitals.bp === "string" &&
    c.tests && typeof c.tests === "object" &&
    Array.isArray(c.options) && c.options.includes(c.correctDiagnosis) &&
    Array.isArray(c.treatments) && c.treatments.length > 0 &&
    c.treatments.every((t: any) => t && typeof t.name === "string" && t.vitals)
  );
}

const CARDIAC_KEYWORDS = ["myocardial", "infarct", "heart attack", "coronary", "stemi", "acs", "angina"];
const CURATED_CASE_KEYWORDS: Record<string, string[]> = {
  MI_001: CARDIAC_KEYWORDS,
  ST_002: ["stroke", "cerebrovascular", "cva", "tia", "hemiparesis", "aphasia"],
  PE_003: ["embolism", "pulmonary embol", " pe", "dvt", "thrombo"],
};

/**
 * Offline cases for a topic. The 10-case generator is cardiac-specific content,
 * so it is used only for cardiac topics; other topics get the matching curated
 * case(s), else all curated cases. Off-topic MI vignettes relabelled as
 * "Classic Asthma" would teach wrong medicine.
 */
function getTopicFallbackCases(topic: string): any[] {
  const lower = ` ${topic.toLowerCase()}`;
  if (CARDIAC_KEYWORDS.some((k) => lower.includes(k))) return getFallbackCases(topic);
  const matched = FALLBACK_CASES.filter((c) => (CURATED_CASE_KEYWORDS[c.id] || []).some((k) => lower.includes(k)));
  return matched.length ? matched : FALLBACK_CASES;
}

// 5b. API: Generate clinical cases dynamically
app.post("/api/generate-cases", async (req, res) => {
  const topic = clampText(req.body?.topic);
  if (!topic) {
    return res.status(400).json({ error: "Medical topic is required" });
  }

  const fallback = getTopicFallbackCases(topic);

  try {
    const ai = getGeminiClient();
    if (!ai) {
      console.log("Gemini client not initialized. Utilizing local high-fidelity fallback cases database.");
      return res.json({ source: "fallback-no-client", data: fallback });
    }

    const systemPrompt = `You are an expert clinical medical educator.
Generate multiple high-fidelity clinical case scenarios for the medical topic: "${topic}".
Return structured educational content only.

You MUST generate 10 different cases corresponding to these 10 distinct case types:
1. Classic presentation
2. Early/subtle presentation
3. Severe or emergency presentation
4. Atypical presentation
5. Pediatric case
6. Elderly case
7. Pregnancy case (if pregnancy is not relevant to this topic, adapt it as a reproductive age female case)
8. Comorbidity case
9. Complication case
10. Differential diagnosis challenge

For each case, include:
- id: a unique short string ID (e.g. "CASE_001")
- title: clear clinical title (e.g., "Classic Presentation of...")
- summary: a short high-yield summary of the scenario
- demographics: detailed patient profile/demographics
- chiefComplaint: the patient's primary presenting complaint
- history: detailed history of present illness (HPI), past medical history, social history
- examination: comprehensive physical examination findings
- initialVitals: a JSON object with { hr, bp, spo2, temp } (e.g., { hr: 95, bp: "140/90", spo2: 95, temp: 36.8 })
- correctDiagnosis: the single correct primary diagnosis name
- correctTreatment: the single most appropriate initial treatment option
- tests: a dictionary of 3 relevant diagnostic investigations: "ecg", "labs", and "cxr" or similar custom test.
  Each test is an object with { name: string, result: string, status: "normal" | "abnormal", details: string }
- options: an array of 4 string options for the diagnosis (one must be the correctDiagnosis, the other 3 should be realistic clinical differentials)
- treatments: an array of 4 treatment options. Each option is an object with:
  - name: string
  - success: boolean (only 1 option is true)
  - feedback: string explaining the clinical rationale of this decision
  - vitals: PatientVitals representing the updated vitals after treatment (if success=true, normalize vitals; if success=false, worsen them)
- differentialDiagnosis: an array of at least 3 realistic alternative diagnoses
- pathophysiologyCorrelation: detailed explanation of the molecular or cellular pathophysiology correlating to the presentation
- managementApproach: overview of the full management guideline
- complications: potential acute/chronic complications of this condition
- prognosis: estimated prognosis based on timely intervention
- questions: an array of 2 clinical reasoning multiple-choice questions. Each question is an object with:
  - question: string
  - options: array of 4 string choices
  - answer: string (exactly matches one of the options)
  - explanation: detailed medical explanation of why that option is correct and others are incorrect
- highYieldPoints: an array of 2-3 high-yield clinical pearls
- visualLearningPrompts: a description of a visual representation/anatomy layout to assist learning

Return ONLY valid JSON matching the specified structure, without any markdown formatting wrappers or backticks.`;

    const response = await callGeminiWithRetry(ai, {
      model: "gemini-2.5-flash",
      contents: systemPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              summary: { type: Type.STRING },
              demographics: { type: Type.STRING },
              chiefComplaint: { type: Type.STRING },
              history: { type: Type.STRING },
              examination: { type: Type.STRING },
              initialVitals: {
                type: Type.OBJECT,
                properties: {
                  hr: { type: Type.INTEGER },
                  bp: { type: Type.STRING },
                  spo2: { type: Type.INTEGER },
                  temp: { type: Type.NUMBER }
                },
                required: ["hr", "bp", "spo2", "temp"]
              },
              correctDiagnosis: { type: Type.STRING },
              correctTreatment: { type: Type.STRING },
              tests: {
                type: Type.OBJECT,
                properties: {
                  ecg: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      result: { type: Type.STRING },
                      status: { type: Type.STRING },
                      details: { type: Type.STRING }
                    },
                    required: ["name", "result", "status", "details"]
                  },
                  labs: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      result: { type: Type.STRING },
                      status: { type: Type.STRING },
                      details: { type: Type.STRING }
                    },
                    required: ["name", "result", "status", "details"]
                  },
                  cxr: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      result: { type: Type.STRING },
                      status: { type: Type.STRING },
                      details: { type: Type.STRING }
                    },
                    required: ["name", "result", "status", "details"]
                  }
                },
                required: ["ecg", "labs", "cxr"]
              },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              treatments: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    success: { type: Type.BOOLEAN },
                    feedback: { type: Type.STRING },
                    vitals: {
                      type: Type.OBJECT,
                      properties: {
                        hr: { type: Type.INTEGER },
                        bp: { type: Type.STRING },
                        spo2: { type: Type.INTEGER },
                        temp: { type: Type.NUMBER }
                      },
                      required: ["hr", "bp", "spo2", "temp"]
                    }
                  },
                  required: ["name", "success", "feedback", "vitals"]
                }
              },
              differentialDiagnosis: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              pathophysiologyCorrelation: { type: Type.STRING },
              managementApproach: { type: Type.STRING },
              complications: { type: Type.STRING },
              prognosis: { type: Type.STRING },
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    question: { type: Type.STRING },
                    options: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING }
                    },
                    answer: { type: Type.STRING },
                    explanation: { type: Type.STRING }
                  },
                  required: ["question", "options", "answer", "explanation"]
                }
              },
              highYieldPoints: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              visualLearningPrompts: { type: Type.STRING }
            },
            required: [
              "id", "title", "summary", "demographics", "chiefComplaint",
              "history", "examination", "initialVitals", "correctDiagnosis",
              "correctTreatment", "tests", "options", "treatments",
              "differentialDiagnosis", "pathophysiologyCorrelation",
              "managementApproach", "complications", "prognosis",
              "questions", "highYieldPoints", "visualLearningPrompts"
            ]
          }
        }
      }
    });

    const cases = (extractArray(cleanAndParseJSON(response.text || ""), ["cases", "data"]) || []).filter(isPlayableCase);
    if (cases.length === 0) throw new Error("AI returned no playable cases");
    // Guarantee unique IDs: React keys and DOM ids are derived from them.
    const seen = new Set<string>();
    cases.forEach((c: any, i: number) => {
      if (!c.id || seen.has(c.id)) c.id = `CASE_${String(i + 1).padStart(3, "0")}`;
      seen.add(c.id);
    });
    return res.json({ source: "gemini", data: cases });
  } catch (error: any) {
    const errorMsg = error?.message || String(error);
    const isRateLimit = errorMsg.includes("503") || 
                        errorMsg.includes("429") || 
                        errorMsg.includes("RESOURCE_EXHAUSTED") || 
                        errorMsg.toLowerCase().includes("quota") || 
                        errorMsg.toLowerCase().includes("unavailable");
    if (isRateLimit) {
      console.log("Gemini is currently experiencing high demand or rate limits. Utilizing local high-fidelity cases fallback database safely.");
    } else {
      console.log("Gemini cases generation service unavailable. Activating clinical simulation fallback safely:", errorMsg);
    }
    return res.json({ source: "fallback-due-to-error", data: fallback });
  }
});

// 5c. API: Generate clinical reasoning quiz questions dynamically
app.post("/api/clinical-quiz", async (req, res) => {
  const cleanTopic = clampText(req.body?.topic);
  if (!cleanTopic) {
    return res.status(400).json({ error: "Medical topic is required" });
  }

  const ai = getGeminiClient();

  const fallbackQuestions = [
    {
      id: "q1",
      question: `Which of the following is the most critical immediate priority in the management of acute ${cleanTopic}?`,
      options: [
        `Stabilizing airway, breathing, and hemodynamics while initiating targeted first-line therapy`,
        `Immediate non-urgent discharge with outpatient follow-up`,
        `Empirical broad-spectrum therapy without diagnostic confirmation`,
        `Withholding all interventions pending 24-hour observational lab trends`
      ],
      correctAnswer: `Stabilizing airway, breathing, and hemodynamics while initiating targeted first-line therapy`,
      explanation: `In the acute presentation of ${cleanTopic}, patient stabilization and immediate guideline-directed therapy take precedence to prevent ischemic organ damage and decompensation.`,
      pearl: `Always address ABCs (Airway, Breathing, Circulation) first in emergency presentations.`
    },
    {
      id: "q2",
      question: `What pathophysiological mechanism underpins the primary clinical manifestations of ${cleanTopic}?`,
      options: [
        `Targeted cellular injury and dysregulated homeostatic feedback loops`,
        `Benign, non-inflammatory physiological variation`,
        `Isolated psychosomatic symptom amplification`,
        `Complete spontaneous self-limiting metabolic dormancy`
      ],
      correctAnswer: `Targeted cellular injury and dysregulated homeostatic feedback loops`,
      explanation: `Pathology in ${cleanTopic} arises from specific cellular/molecular disruptions, activating compensatory cascades that eventually produce characteristic clinical signs.`,
      pearl: `Mapping symptoms back to molecular and histological drivers enables precise differential diagnosis.`
    }
  ];

  if (!ai) {
    return res.json({ source: "fallback", data: fallbackQuestions });
  }

  try {
    const prompt = `You are an expert medical board exam author (USMLE Step 2/3 and ABIM).
Generate 3-4 high-yield, challenging clinical vignette multiple-choice questions for the medical condition: "${cleanTopic}".
Each question must be a realistic patient scenario with 4 choices.

Return raw JSON matching this structure:
[
  {
    "id": "q1",
    "question": "A 54-year-old presenting with...",
    "options": ["Choice A", "Choice B", "Choice C", "Choice D"],
    "correctAnswer": "Exact string matching the correct choice",
    "explanation": "Detailed medical explanation why this choice is correct and others are incorrect.",
    "pearl": "High-yield clinical pearl for board examination."
  }
]`;

    const response = await callGeminiWithRetry(ai, {
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const questions = (extractArray(cleanAndParseJSON(response.text || "[]"), ["questions", "quiz", "data"]) || []).filter(
      (q: any) => q && typeof q.question === "string" && Array.isArray(q.options) && q.options.includes(q.correctAnswer ?? q.answer),
    );
    if (questions.length === 0) throw new Error("AI returned no valid questions");
    return res.json({ source: "gemini", data: questions });
  } catch (error: any) {
    console.log("Failed to generate clinical quiz via AI:", error?.message || error);
    return res.json({ source: "fallback-due-to-error", data: fallbackQuestions });
  }
});

// Secure Server-side Google Sheets Helper Functions
const SPREADSHEET_ID_RE = /^[A-Za-z0-9_-]{20,100}$/;
const GOOGLE_TIMEOUT_MS = 15_000;

async function findExistingSpreadsheet(accessToken: string): Promise<string | null> {
  const q = encodeURIComponent("name = 'MedMap Clinical Simulation Logs' and mimeType = 'application/vnd.google-apps.spreadsheet' and trashed = false");
  const response = await fetch(`https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name)`, {
    headers: { "Authorization": `Bearer ${accessToken}` },
    signal: AbortSignal.timeout(GOOGLE_TIMEOUT_MS),
  });
  if (!response.ok) return null;
  const data = await response.json() as any;
  return data.files && data.files.length > 0 ? data.files[0].id : null;
}

async function createSpreadsheet(accessToken: string): Promise<string> {
  const response = await fetch("https://sheets.googleapis.com/v4/spreadsheets", {
    signal: AbortSignal.timeout(GOOGLE_TIMEOUT_MS),
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      properties: { title: "MedMap Clinical Simulation Logs" },
      sheets: [
        {
          properties: {
            title: "Simulation History",
            gridProperties: { frozenRowCount: 1 }
          }
        }
      ]
    })
  });
  if (!response.ok) {
    throw new Error(`Failed to create spreadsheet: HTTP ${response.status} ${(await response.text()).slice(0, 200)}`);
  }
  const data = await response.json() as any;
  return data.spreadsheetId;
}

async function appendRowToSheet(accessToken: string, spreadsheetId: string, values: string[][]): Promise<void> {
  const range = encodeURIComponent("Simulation History!A1");
  // RAW (not USER_ENTERED): a value starting with "=" must never be evaluated as a formula.
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`;
  const response = await fetch(url, {
    signal: AbortSignal.timeout(GOOGLE_TIMEOUT_MS),
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ values })
  });
  if (!response.ok) {
    throw new Error(`Failed to append row: HTTP ${response.status} ${(await response.text()).slice(0, 200)}`);
  }
}

async function formatSheetHeaders(accessToken: string, spreadsheetId: string): Promise<void> {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`;
  const headersCount = 12;
  const requestBody = {
    requests: [
      {
        repeatCell: {
          range: {
            sheetId: 0,
            startRowIndex: 0,
            endRowIndex: 1,
            startColumnIndex: 0,
            endColumnIndex: headersCount
          },
          cell: {
            userEnteredFormat: {
              backgroundColor: { red: 0.05, green: 0.25, blue: 0.2 }, // Professional pine green
              textFormat: {
                foregroundColor: { red: 1.0, green: 1.0, blue: 1.0 },
                bold: true,
                fontSize: 10,
                fontFamily: "Arial"
              },
              horizontalAlignment: "CENTER",
              verticalAlignment: "MIDDLE"
            }
          },
          fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)"
        }
      },
      {
        autoResizeDimensions: {
          dimensions: {
            sheetId: 0,
            dimension: "COLUMNS",
            startIndex: 0,
            endIndex: headersCount
          }
        }
      }
    ]
  };
  await fetch(url, {
    method: "POST",
    signal: AbortSignal.timeout(GOOGLE_TIMEOUT_MS),
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(requestBody)
  }).catch(() => { /* header styling is cosmetic */ });
}

// 6. API: Securely sync run to Google Sheets using Gemini and REST APIs
app.post("/api/sync-to-sheets", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid authorization token." });
  }
  const accessToken = authHeader.substring(7);

  const body = req.body || {};
  const spreadsheetId = clampText(body.spreadsheetId, 120);
  const caseId = clampText(body.caseId, 60);
  const caseTitle = clampText(body.caseTitle, 200);
  const demographics = clampText(body.demographics, 500);
  const presentingSymptoms = clampText(body.presentingSymptoms, 1000);
  const vitalsBefore = clampText(body.vitalsBefore, 200);
  const diagnosticsOrdered = clampText(body.diagnosticsOrdered, 2000);
  const suspectedDiagnosis = clampText(body.suspectedDiagnosis, 200);
  const interventionChosen = clampText(body.interventionChosen, 200);
  const vitalsAfter = clampText(body.vitalsAfter, 200);
  const outcome = clampText(body.outcome, 200);

  if (!caseId || !caseTitle) {
    return res.status(400).json({ error: "Missing required clinical case data." });
  }
  // The ID is interpolated into a Sheets API URL path: accept only the documented ID alphabet.
  if (spreadsheetId && !SPREADSHEET_ID_RE.test(spreadsheetId)) {
    return res.status(400).json({ error: "Invalid spreadsheet ID." });
  }

  // 1. Generate Attending Feedback & Learning Points (server-side Gemini)
  const ai = getGeminiClient();
  let attendingFeedback = "";
  let learningPoints = "";

  if (ai) {
    try {
      const prompt = `You are a Senior Attending Physician mentoring a resident in clinical simulation.
We are logging a simulated clinical case trial to Google Sheets. Generate high-quality, professional clinical analysis.

Case Details:
- Case Title: ${caseTitle}
- Demographics: ${demographics}
- Presenting Symptoms: ${presentingSymptoms}
- Vitals Before: ${vitalsBefore}
- Diagnostics Ordered: ${diagnosticsOrdered}
- Resident's Suspected Diagnosis: ${suspectedDiagnosis}
- Intervention Chosen: ${interventionChosen}
- Vitals After: ${vitalsAfter}
- Outcome: ${outcome}

Generate exactly:
1. Attending Feedback: A professional, constructive, concise clinical critique of the resident's decisions (max 2 sentences).
2. Learning Points: A high-yield educational medical takeaway about this pathology/intervention (max 2 sentences).

Your response MUST be in JSON format matching the schema:
{
  "attendingFeedback": "string",
  "learningPoints": "string"
}`;

      const response = await callGeminiWithRetry(ai, {
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              attendingFeedback: { type: Type.STRING },
              learningPoints: { type: Type.STRING }
            },
            required: ["attendingFeedback", "learningPoints"]
          }
        }
      });

      const parsed = cleanAndParseJSON(response.text || "{}");
      attendingFeedback = parsed.attendingFeedback || "";
      learningPoints = parsed.learningPoints || "";
    } catch (error: any) {
      console.log("Gemini failed to generate sheets feedback (utilizing high-quality deterministic clinical feedback instead):", error?.message || error);
    }
  }

  if (!attendingFeedback || !learningPoints) {
    // Fallback generator based on outcome
    const isSuccess = /stabil|success/i.test(outcome);
    if (isSuccess) {
      attendingFeedback = `Excellent clinical performance. You successfully recognized the presenting symptoms for ${caseTitle} and initiated ${interventionChosen || "appropriate therapeutic measures"}, leading to clinical stabilization and rapid physiological improvement.`;
      learningPoints = `Early gold-standard therapy minimizes target organ ischemia and mitigates further pathology. Consistent monitoring of vital parameters ensures the efficacy of the selected treatment course.`;
    } else {
      attendingFeedback = `Critique: The therapeutic choice of ${interventionChosen || "treatment"} did not address the acute pathology of ${caseTitle}, causing physiological deterioration. Closely re-evaluate diagnostic studies and ECGs to avoid fatal delays in care.`;
      learningPoints = `Differentiating medical emergencies from their benign mimics is essential. Prioritize ABCs (Airway, Breathing, Circulation) and always consult senior staff or clinical pathways when diagnostic ambiguity exists.`;
    }
  }

  // 2. Locate or Create Google Sheet
  try {
    let activeSpreadsheetId = spreadsheetId;
    if (!activeSpreadsheetId) {
      activeSpreadsheetId = await findExistingSpreadsheet(accessToken);
      if (!activeSpreadsheetId) {
        activeSpreadsheetId = await createSpreadsheet(accessToken);
        // Initialize with headers
        const CLINICAL_HEADERS = [
          "Timestamp (UTC)",
          "Case ID",
          "Patient Demographics",
          "Presenting Symptoms",
          "Vitals Before Intervention",
          "Diagnostics Ordered",
          "Suspected Diagnosis",
          "Intervention Chosen",
          "Vitals After Intervention",
          "Outcome",
          "Attending Feedback",
          "Learning Points"
        ];
        await appendRowToSheet(accessToken, activeSpreadsheetId, [CLINICAL_HEADERS]);
        await formatSheetHeaders(accessToken, activeSpreadsheetId);
      }
    }

    // 3. Prepare row data matching the 12 requested items
    const rowValues = [
      new Date().toUTCString(),
      caseId,
      demographics || "N/A",
      presentingSymptoms || "N/A",
      vitalsBefore || "N/A",
      diagnosticsOrdered || "None",
      suspectedDiagnosis || "Incomplete Workup",
      interventionChosen || "None",
      vitalsAfter || "N/A",
      outcome || "Unknown",
      attendingFeedback,
      learningPoints
    ];

    // 4. Append row
    await appendRowToSheet(accessToken, activeSpreadsheetId, [rowValues]);

    return res.json({
      success: true,
      spreadsheetId: activeSpreadsheetId,
      attendingFeedback,
      learningPoints,
      timestamp: rowValues[0]
    });
  } catch (err: any) {
    console.warn("Error in sync-to-sheets backend:", err?.message || err);
    // Google returns 401 for an expired token: tell the client to re-authenticate.
    const status = /HTTP 401|UNAUTHENTICATED|invalid authentication/i.test(String(err?.message)) ? 401 : 502;
    return res.status(status).json({
      error: status === 401 ? "Google session expired. Please sign in again." : "Failed to synchronize log to Google Sheets.",
    });
  }
});

// 4. API: Generate Obsidian-style Medical Mind Map
app.post("/api/generate-mindmap", async (req, res) => {
  const cleanTopic = clampText(req.body?.topic);
  if (!cleanTopic) {
    return res.status(400).json({ error: "Please provide a valid medical topic." });
  }

  const fallbackMindmap = getFallbackMindmap(cleanTopic);
  const ai = getGeminiClient();
  if (!ai) {
    console.log("Gemini API key is not configured. Returning fallback mindmap.");
    return res.json({ source: "fallback", data: fallbackMindmap });
  }
  try {
    const prompt = `You are a world-class, brilliant medical researcher, clinician, pathologist, anatomist, physiologist, and master medical school professor.
Create a complete, master-level medical mind map of the topic provided: "${cleanTopic}".
Your mind map must follow the structured prompt schema perfectly, delivering high-fidelity medical content across all 21 required sections.

TOPIC:
${cleanTopic}

STRUCTURE:
Strictly follow the exact 21 headings specified below. Your markdown field must include comprehensive, layered, clinically deep medical notes for each of the 21 sections. Do NOT summarize or use placeholders; provide absolute, dense, high-yield clinical value:

# MEDICAL MIND MAP: ${cleanTopic.toUpperCase()}

## 1. Definition
### 1.1 Standard Definition
### 1.2 Clinical Definition
### 1.3 Key Terminology

## 2. Anatomy
### 2.1 Relevant Structures
### 2.2 Blood Supply
### 2.3 Nerve Supply
### 2.4 Lymphatics
### 2.5 Applied Anatomy

## 3. Physiology
### 3.1 Normal Function
### 3.2 Regulation
### 3.3 Feedback Mechanisms
### 3.4 Homeostasis

## 4. Biochemistry
### 4.1 Molecular Basis
### 4.2 Enzymes / Proteins / Receptors
### 4.3 Metabolic Pathways
### 4.4 Biomarkers

## 5. Etiology
### 5.1 Genetic Causes
### 5.2 Infectious Causes
### 5.3 Autoimmune Causes
### 5.4 Metabolic Causes
### 5.5 Environmental Causes
### 5.6 Iatrogenic Causes

## 6. Risk Factors
### 6.1 Modifiable
### 6.2 Non-Modifiable
### 6.3 Protective Factors

## 7. Pathophysiology
### 7.1 Initiating Event
### 7.2 Molecular Mechanism
### 7.3 Cellular Changes
### 7.4 Tissue-Level Changes
### 7.5 Organ-Level Dysfunction
### 7.6 Systemic Effects
### 7.7 Clinical Correlation

## 8. Pathology
### 8.1 Gross Pathology
### 8.2 Microscopy
### 8.3 Histology
### 8.4 Staging / Grading if relevant

## 9. Clinical Features
### 9.1 Symptoms
### 9.2 Signs
### 9.3 Early Features
### 9.4 Late Features
### 9.5 Red Flags

## 10. Diagnosis
### 10.1 Clinical Diagnosis
### 10.2 Laboratory Tests
### 10.3 Imaging
### 10.4 Special Tests
### 10.5 Diagnostic Criteria

## 11. Differential Diagnosis
### 11.1 Similar Condition 1
### 11.2 Similar Condition 2
### 11.3 How to Differentiate

## 12. Management
### 12.1 Initial Stabilization
### 12.2 Medical Treatment
### 12.3 Surgical Treatment
### 12.4 Lifestyle Management
### 12.5 Follow-Up
### 12.6 Prevention

## 13. Pharmacology
### 13.1 Drug Classes
### 13.2 Mechanism of Action
### 13.3 Indications
### 13.4 Contraindications
### 13.5 Adverse Effects
### 13.6 Monitoring

## 14. Complications
### 14.1 Acute Complications
### 14.2 Chronic Complications
### 14.3 Life-Threatening Complications

## 15. Prognosis
### 15.1 Prognostic Factors
### 15.2 Outcome
### 15.3 Recurrence Risk

## 16. Prevention and Screening
### 16.1 Primary Prevention
### 16.2 Secondary Prevention
### 16.3 Screening Guidelines

## 17. Research and Recent Advances
### 17.1 Current Research
### 17.2 New Drugs / Therapies
### 17.3 Biomarkers
### 17.4 Clinical Trials
### 17.5 Unanswered Questions

## 18. High-Yield Exam Points
### 18.1 Must-Know Facts
### 18.2 Common MCQ Traps
### 18.3 Viva Questions
### 18.4 One-Liners

## 19. Clinical Correlation
### 19.1 Case Presentation
### 19.2 Diagnostic Reasoning
### 19.3 Management Reasoning

## 20. Final Summary
### 20.1 One-Line Summary
### 20.2 Pathophysiology in One Flow
### 20.3 Most Important Takeaways

## 21. Latest and Advanced Therapeutics
### 21.1 Standard Treatment
### 21.2 Latest Guidelines
### 21.3 Advanced Therapeutics
### 21.4 Drug Details
### 21.5 Mechanism-Based Treatment
### 21.6 Treatment Algorithm
### 21.7 Special Populations
### 21.8 Emerging and Experimental Therapies
### 21.9 Evidence Grading and Comparison
### 21.10 Visual Learning Integration

In addition to the dense, multi-thousand word detailed markdown string, populate the 'nodes' and 'links' JSON fields which will be used to render an interactive Obsidian Graph View.
- Provide a central core node (id: "core") representing the main topic.
- Provide 21 nodes representing each of the 21 main headings (ids: "def", "anat", "phys", "biochem", "etio", "risk", "pathophys", "path", "clin", "diag", "diff", "mgmt", "pharm", "comp", "prog", "prev", "rsch", "exam", "corr", "summ", "therapeutics") with exact human labels ("1. Definition", "2. Anatomy", ..., "21. Latest & Advanced Therapeutics") and an high-yield summary of that section in the 'description' field.
- Provide links connecting the "core" node to each of the 21 section nodes.
- CRITICAL: Provide cross-link connections (links) that represent deep medical correlations, such as:
  * Linking Anatomy ("anat") to Pathophysiology ("pathophys")
  * Linking Physiology ("phys") to Pathophysiology ("pathophys")
  * Linking Biochemistry ("biochem") to Diagnosis ("diag") or Pathology ("path")
  * Linking Pathophysiology ("pathophys") to Clinical Features ("clin")
  * Linking Clinical Features ("clin") to Diagnosis ("diag")
  * Linking Diagnosis ("diag") to Differential Diagnosis ("diff")
  * Linking Diagnosis ("diag") to Management ("mgmt")
  * Linking Management ("mgmt") to Pharmacology ("pharm")
  * Linking Pathology ("path") to Complications ("comp")
  * Linking Management ("mgmt") to Latest & Advanced Therapeutics ("therapeutics")
  * Linking Pharmacology ("pharm") to Latest & Advanced Therapeutics ("therapeutics")

This schema binds anatomical structures to pathophysiological changes, and matches clinical signs to biochemical and diagnostic markers!`;

    const response = await callGeminiWithRetry(ai, {
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topic: { type: Type.STRING, description: "The medical topic of the mind map." },
            markdown: { type: Type.STRING, description: "The complete, detailed markdown document containing all 21 sections, strictly structured." },
            nodes: {
              type: Type.ARRAY,
              description: "High-level interactive graph nodes.",
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING, description: "Unique identifier for the node (e.g. core, def, anat)." },
                  label: { type: Type.STRING, description: "Short readable label for the node." },
                  category: { 
                    type: Type.STRING, 
                    description: "Category of the node (core, definition, anatomy, physiology, biochemistry, etiology, risk_factors, pathophysiology, pathology, clinical_features, diagnosis, differential, management, pharmacology, complications, prognosis, prevention, research, exam, correlation, summary, therapeutics)." 
                  },
                  description: { type: Type.STRING, description: "High-yield one-sentence medical summary of this node's content." }
                },
                required: ["id", "label", "category", "description"]
              }
            },
            links: {
              type: Type.ARRAY,
              description: "Links connecting the nodes to represent correlations.",
              items: {
                type: Type.OBJECT,
                properties: {
                  source: { type: Type.STRING, description: "The ID of the source node." },
                  target: { type: Type.STRING, description: "The ID of the target node." }
                },
                required: ["source", "target"]
              }
            },
            therapeutics: {
              type: Type.OBJECT,
              description: "The complete, evidence-based Latest and Advanced Therapeutics module for the topic.",
              properties: {
                disclaimer: { type: Type.STRING, description: "Standard clinical disclaimer: 'Educational use only. Not a substitute for professional medical advice, diagnosis, or treatment. Verify with current clinical guidelines and local protocols.'" },
                lastUpdated: { type: Type.STRING, description: "Year/date checked." },
                standardTreatment: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "First-line, second-line, third-line/salvage, supportive, preventive, and emergency care."
                },
                latestGuidelines: {
                  type: Type.ARRAY,
                  description: "Most recent guideline recommendations.",
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      source: { type: Type.STRING, description: "Guideline source organization (e.g. WHO, NICE, CDC, IDSA, AHA/ACC, ESC, ADA, KDIGO, EULAR, ACR, ASCO, NCCN, GOLD, GINA, AASLD, EASL)." },
                      year: { type: Type.STRING, description: "Year of guideline publication." },
                      recommendation: { type: Type.STRING, description: "Key clinical guideline recommendation." },
                      evidenceLevel: { type: Type.STRING, description: "Strength and level of evidence (e.g. Class I, Level A)." },
                      clinicalUse: { type: Type.STRING, description: "Key clinical indication or application." }
                    },
                    required: ["source", "year", "recommendation"]
                  }
                },
                advancedTherapies: {
                  type: Type.ARRAY,
                  description: "Modern targeted therapies, biologics, gene/RNA therapy, immunotherapy, and precision medicine options.",
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING, description: "Name of the advanced therapy." },
                      category: { type: Type.STRING, description: "Category (e.g. Biologics, Monoclonal antibodies, CAR-T, Gene Therapy, siRNA)." },
                      mechanism: { type: Type.STRING, description: "Detailed molecular mechanism." },
                      target: { type: Type.STRING, description: "Specific cellular/receptor target." },
                      indications: { type: Type.STRING, description: "Clinical indications." },
                      contraindications: { type: Type.STRING, description: "Contraindications." },
                      benefits: { type: Type.STRING, description: "Therapeutic benefits." },
                      limitations: { type: Type.STRING, description: "Clinical limitations." },
                      adverseEffects: { type: Type.STRING, description: "Major adverse effects and toxicities." },
                      monitoring: { type: Type.STRING, description: "Monitoring requirements." },
                      evidenceStatus: { type: Type.STRING, description: "Evidence status (e.g., Established, Guideline-supported, recently approved, Investigational, Experimental, Not recommended, Controversial)." },
                      highYieldPoint: { type: Type.STRING, description: "High-yield pearl for clinical practice or exams." }
                    },
                    required: ["name", "category", "mechanism", "target"]
                  }
                },
                emergingTherapies: {
                  type: Type.ARRAY,
                  description: "Pipeline molecules, clinical trial agents, and controversial therapies.",
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      status: { type: Type.STRING, description: "Investigational / Recently approved / Experimental / Controversial" },
                      mechanism: { type: Type.STRING },
                      trialPhase: { type: Type.STRING, description: "Current clinical trial phase (e.g., Phase I/II/III)." },
                      potentialUse: { type: Type.STRING },
                      limitations: { type: Type.STRING },
                      safetyConcerns: { type: Type.STRING }
                    },
                    required: ["name", "status", "mechanism"]
                  }
                },
                treatmentAlgorithm: {
                  type: Type.ARRAY,
                  description: "Stepwise therapeutic pathway steps.",
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      step: { type: Type.STRING, description: "Step number/label (e.g., Step 1: Diagnosis & Triage)." },
                      decisionPoint: { type: Type.STRING, description: "Clinical trigger or severity class." },
                      action: { type: Type.STRING, description: "Action to take." },
                      reason: { type: Type.STRING, description: "Clinical rationale." }
                    },
                    required: ["step", "decisionPoint", "action", "reason"]
                  }
                },
                drugComparisonTable: {
                  type: Type.ARRAY,
                  description: "Drug classes/agents comparison table.",
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      therapy: { type: Type.STRING, description: "Name of drug/class" },
                      mechanism: { type: Type.STRING, description: "Mechanism of action" },
                      indication: { type: Type.STRING, description: "Main indication" },
                      benefit: { type: Type.STRING, description: "Key clinical benefit" },
                      limitation: { type: Type.STRING, description: "Clinical limitation" },
                      adverseEffects: { type: Type.STRING, description: "Major adverse effects" },
                      monitoring: { type: Type.STRING, description: "Required monitoring" },
                      evidenceLevel: { type: Type.STRING, description: "Evidence Level (e.g., Strong, Moderate, Limited, Expert opinion, Experimental)" },
                      highYieldPoint: { type: Type.STRING, description: "High yield exam/clinical point" }
                    },
                    required: ["therapy", "mechanism", "indication", "benefit", "limitation", "adverseEffects", "monitoring", "evidenceLevel", "highYieldPoint"]
                  }
                },
                specialPopulations: {
                  type: Type.ARRAY,
                  description: "Therapeutic differences for special cohorts (Pediatrics, Elderly, Pregnancy, Lactation, Renal, Liver, Immunocompromised).",
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      population: { type: Type.STRING, description: "Population class name (e.g., Pediatrics, Elderly, Pregnancy)." },
                      details: { type: Type.STRING, description: "Therapeutic adjustments and key guideline considerations." }
                    },
                    required: ["population", "details"]
                  }
                },
                monitoring: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      parameter: { type: Type.STRING, description: "Clinical parameter or laboratory test to monitor." },
                      frequency: { type: Type.STRING, description: "Frequency of checking." },
                      rationale: { type: Type.STRING, description: "Detailed clinical rationale." }
                    },
                    required: ["parameter", "rationale"]
                  }
                },
                contraindications: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      contraindication: { type: Type.STRING, description: "Contraindication name or clinical trigger." },
                      rationale: { type: Type.STRING, description: "Detailed pathophysiological rationale." }
                    },
                    required: ["contraindication", "rationale"]
                  }
                },
                adverseEffects: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      effect: { type: Type.STRING, description: "Adverse effect." },
                      management: { type: Type.STRING, description: "Clinical management or mitigation strategy." }
                    },
                    required: ["effect", "management"]
                  }
                },
                clinicalPearls: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Expert clinical pearls." },
                highYieldExamPoints: { type: Type.ARRAY, items: { type: Type.STRING }, description: "High-yield board exam points." },
                referencesToVerify: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Key clinical trial papers, guideline publications, or databases to cross-check." }
              },
              required: [
                "disclaimer",
                "lastUpdated",
                "standardTreatment",
                "latestGuidelines",
                "advancedTherapies",
                "emergingTherapies",
                "treatmentAlgorithm",
                "drugComparisonTable",
                "specialPopulations",
                "monitoring",
                "contraindications",
                "adverseEffects",
                "clinicalPearls",
                "highYieldExamPoints",
                "referencesToVerify"
              ]
            }
          },
          required: ["topic", "markdown", "nodes", "links", "therapeutics"]
        }
      }
    });

    const parsed = cleanAndParseJSON(response.text || "{}");
    if (!parsed || !Array.isArray(parsed.nodes) || parsed.nodes.length === 0) {
      throw new Error("AI mind map missing nodes");
    }
    if (!Array.isArray(parsed.links)) parsed.links = [];
    return res.json({ source: "gemini", data: parsed });
  } catch (error: any) {
    const errorMsg = error?.message || String(error);
    const isRateLimit = errorMsg.includes("503") || 
                        errorMsg.includes("429") || 
                        errorMsg.includes("RESOURCE_EXHAUSTED") || 
                        errorMsg.toLowerCase().includes("quota") || 
                        errorMsg.toLowerCase().includes("unavailable");
    if (isRateLimit) {
      console.log("Gemini is currently experiencing high demand or rate limits. Utilizing local high-fidelity clinical fallback mind map safely.");
    } else {
      console.log("Gemini mindmap generator failed. Utilizing local high-fidelity clinical fallback safely:", errorMsg);
    }
    return res.json({ source: "fallback-due-to-error", data: fallbackMindmap });
  }
});

// Unknown API routes return JSON 404 (not the SPA shell).
app.use("/api", (req, res) => {
  res.status(404).json({ error: `No API route for ${req.method} ${req.path}` });
});

// Central error handler: malformed JSON, oversized bodies and unexpected throws become JSON errors.
app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  const status = err?.type === "entity.too.large" ? 413 : err?.type === "entity.parse.failed" ? 400 : err?.status || 500;
  if (status >= 500) console.error(JSON.stringify({ level: "error", msg: "unhandled", path: req.path, error: String(err?.stack || err).slice(0, 2000) }));
  if (res.headersSent) return;
  res.status(status).json({ error: status === 500 ? "Internal server error" : err?.message || "Bad request" });
});

// Serve static assets in production, hook Vite dev server in development
async function startServer() {
  if (!IS_PROD) {
    const { createServer } = await import("vite");
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    // Hashed assets never change: cache for a year. index.html must always revalidate.
    app.use("/assets", express.static(path.join(distPath, "assets"), { immutable: true, maxAge: "1y", fallthrough: false }));
    app.use(express.static(distPath, { index: false, maxAge: "1h" }));
    app.get("*", (req, res) => {
      res.setHeader("Cache-Control", "no-cache");
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const server = app.listen(PORT, "0.0.0.0", () => {
    const cfg = getAIConfig();
    console.log(JSON.stringify({ level: "info", msg: "server_started", port: PORT, env: process.env.NODE_ENV || "development", aiProvider: cfg.provider, version: APP_VERSION }));
  });
  // Slow AI calls can take up to AI_TIMEOUT_MS; keep sockets open slightly longer than that.
  server.requestTimeout = AI_TIMEOUT_MS * 3 + 10_000;
  server.keepAliveTimeout = 65_000;

  const shutdown = (signal: string) => {
    console.log(JSON.stringify({ level: "info", msg: "shutdown", signal }));
    server.close(() => process.exit(0));
    // Force-exit if in-flight requests do not drain in time.
    setTimeout(() => process.exit(1), 10_000).unref();
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
