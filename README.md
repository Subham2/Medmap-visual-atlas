# MedMap Visual Atlas

MedMap Visual Atlas is a comprehensive clinical education tool designed for medical simulation, pharmacology analysis, and visual clinical learning.

## Features
- **Mind Map Visualization**: Interactive mind maps using React Flow for exploring clinical topics.
- **Symptom & Mechanism Mapping**: AI-driven analysis of symptoms and pathophysiology.
- **Pharmacology Dashboard**: Comprehensive drug interaction and pharmacology analysis.
- **Case Simulator**: Interactive clinical reasoning challenges and case management.
- **Visual Image Atlas**: Real-time retrieval and verification of clinical medical images from trusted sources using a scored verification pipeline.
- **Google Sheets Sync**: Secure synchronization of clinical runs to Google Sheets for automated grading and ledger tracking.

## Medical Disclaimer
MedMap Visual Atlas is intended for educational and simulation purposes ONLY. It does not provide medical advice, diagnosis, or treatment. Verify all clinical, diagnostic, therapeutic, and drug information with current guidelines, local protocols, standard textbooks, and qualified healthcare professionals.

## Environment Variables
See `.env.example` for the full list.
- `GEMINI_API_KEY`: provider key. Leave empty for offline mode. No key is bundled in the code.
- `GEMINI_BASE_URL`: optional OpenAI-compatible endpoint (https only).
- `GEMINI_MODEL`: model name (default `gemini-2.5-flash`).
- `AI_BACKUP_BASE_URL` / `AI_BACKUP_API_KEY`: optional failover provider.
- `AI_TIMEOUT_MS`, `AI_CACHE_TTL_MS`, `AI_CACHE_MAX_ENTRIES`, `RATE_LIMIT_PER_MIN`, `TRUST_PROXY`: runtime tuning.
- Google Sheets sync uses Firebase Google sign-in (`firebase-applet-config.json`, or `VITE_FIREBASE_*` overrides). No server-side OAuth secret is needed.

## Local Setup
1. Clone the repository.
2. Install dependencies: `npm install`.
3. Configure `.env` with required API keys using `.env.example` as a template.
4. Start development server: `npm run dev`.

## Production Build
- Build: `npm run build`
- Start: `npm start`
- **Publish check:** `npm run check:publish` (or `npm run verify` for typecheck + build + check). See `FINAL_DEPLOYMENT_SETUP.md`.

## API Routes
- `/api/health`: liveness probe.
- `/api/status`: provider configuration (never exposes secrets).
- `/api/readiness`: publish-readiness checklist (HTTP 503 when a blocking check fails).
- `/api/medical-images`: Retrieves and verifies clinical images with live URL/content-type checks.
- `/api/symptom-mechanism-map`: Generates the symptom → mechanism map.
- `/api/generate-mindmap`: Generates the knowledge-graph mind map.
- `/api/get-topic-drugs`: Topic formulary for the pharmacology matrix.
- `/api/clinical-quiz`: Board-style vignette questions.
- `/api/analyze-symptoms`: Analyzes user-input symptoms.
- `/api/get-drug-interaction`: Checks pharmacological interactions.
- `/api/generate-cases`: Generates dynamic clinical cases.
- `/api/sync-to-sheets`: Synchronizes simulation data to Google Sheets.

## Fallback Mode
If `GEMINI_API_KEY` is not configured, the app runs in offline mode on a curated local dataset of maps, images and cases. Topics without curated content get a clearly labelled reasoning template rather than invented facts, and case generation returns the closest curated cases instead of relabelled off-topic vignettes.

## Medical Image Verification Workflow
1. Retrieval: AI retrieves metadata candidates.
2. Async Verification: Multi-threaded URL HEAD/GET checks + Content-Type validation.
3. Provider Adapters: Source-specific enrichment (e.g., Wikimedia API metadata).
4. Scoring: 0-100 score across Credibility, License, URL Validity, Medical Relevance, Metadata Completeness, and Quality.
5. Status: `verified` (>=80), `needs_review` (>=60), or `rejected`.

## Export Features
- Mind Map: PNG, SVG, PDF, JSON, Markdown, Mermaid code.
- Clinical Run: Google Sheets sync.

## Troubleshooting
- If Gemini API fails, the system reverts to local fallback modes.
- If Google Sheets sync fails, data is logged to local browser storage.

## Deployment Notes
Ensure all environment variables are correctly configured in the production environment.
