# Final Deployment Setup - MedMap Visual Atlas

## 1) Deployment Goal
This document is the final, deployment-ready setup guide for this repository.
It covers local build verification, production runtime, Docker deployment, reverse proxy setup, and operations checks.

## 2) Publish Gate (run before every release)
One command verifies the release end to end:

```bash
npm run verify          # typecheck → build → publish check
```

`npm run check:publish` (in `scripts/publish-check.mjs`) runs these checks and exits non-zero on any blocking failure:

| Stage | Checks |
|---|---|
| Repository | required files, `.gitignore` covers `node_modules`/`dist`/`.env`, no tracked `.env`, Node engine pinned, medical disclaimer |
| Secrets | scans source and `dist/server.cjs` for API keys, tokens and private keys |
| Build | `dist/` present, initial JS ≤ 200 KB gzip, secondary tabs code-split |
| Runtime | boots `dist/server.cjs` in offline mode and smoke-tests every API route, error handling (400/404/401), security and cache headers, and the rate limiter |

Flags: `--static` (no server boot), `--live` (smoke test against the real provider in `.env`; this uses credits).
The same gate runs in CI (`.github/workflows/ci.yml`). At runtime, `GET /api/readiness` and the **Audit & Compliance** tab show the live deployment checklist.

## 3) Runtime Architecture
- Frontend build output: `dist/index.html` and `dist/assets/*`
- Backend runtime: `dist/server.cjs`
- Backend source entry: `server.ts`
- Start command: `npm start`
- Dev command: `npm run dev`

## 4) Required Tools
- Node.js 20.x LTS (or newer)
- npm 10+
- Git
- Optional for container deploy:
  - Docker Engine 24+
  - Docker Compose v2+

## 5) Environment Configuration
Create `.env` in repository root.

Recommended production template:

```env
PORT=3000
NODE_ENV=production
APP_URL=https://your-domain.example

TRUST_PROXY=1

# Google Gemini (AIza... key) or any OpenAI-compatible gateway (set GEMINI_BASE_URL, https only)
GEMINI_API_KEY=
GEMINI_BASE_URL=
GEMINI_MODEL=gemini-2.5-flash
```

See `.env.example` for every variable (timeouts, cache, rate limit, backup provider).
With `GEMINI_API_KEY` empty the app runs fully offline on the curated dataset. No key is built into the code.

Important:
- Keep `.env` out of source control.
- Rotate keys if they were exposed.
- Use secrets manager in cloud production.

## 6) Local Production Build and Run
### Step 1: Install dependencies
```powershell
npm ci
```

### Step 2: Build artifacts
```powershell
npm run build
```

### Step 3: Run production server
```powershell
npm start
```

### Step 4: Smoke test
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/status" -Method GET | ConvertTo-Json -Depth 5
```

Expected response shape:
```json
{
  "configured": true,
  "source": "gemini",
  "provider": "gemini",
  "model": "gemini-2.5-flash"
}
```

`configured=false` means fallback mode, usually because API key is not active.

## 7) API Health Validation Checklist
Run these checks after startup:

1. Status endpoint:
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/status" -Method GET | ConvertTo-Json -Depth 5
```

2. Functional inference check:
```powershell
$body = @{ symptoms = @('chest pain','shortness of breath') } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/api/analyze-symptoms" -Method POST -ContentType "application/json" -Body $body | ConvertTo-Json -Depth 8
```

Pass criteria:
- HTTP 200
- JSON response with `source` and `data`
- Non-empty `differentials`

## 8) Linux VM Deployment (No Docker)
### 8.1 Provision app user
```bash
sudo useradd -m -s /bin/bash medmap
sudo mkdir -p /opt/medmap
sudo chown -R medmap:medmap /opt/medmap
```

### 8.2 Deploy source
```bash
cd /opt/medmap
git clone <your-repo-url> .
cp .env.example .env
# edit .env values
```

### 8.3 Install + build
The build needs dev dependencies (esbuild, TypeScript), so install everything, build, then prune:
```bash
npm ci
npm run verify
npm prune --omit=dev
```

### 8.4 Run with PM2
```bash
npm i -g pm2
pm2 start "node dist/server.cjs" --name medmap
pm2 save
pm2 startup
```

### 8.5 Verify
```bash
curl -s http://127.0.0.1:3000/api/status
```

## 9) Docker Deployment
### 9.1 Dockerfile (production)
A multi-stage `Dockerfile` ships in the repository root. It typechecks and builds in a full stage, installs only production dependencies in the runtime stage, runs as the non-root `node` user, and declares a `HEALTHCHECK` on `/api/health`.

### 9.2 Build and run image
```bash
docker build -t medmap:prod .
docker run --name medmap -p 3000:3000 --env-file .env medmap:prod
```

### 9.3 Container check
```bash
curl http://localhost:3000/api/status
```

## 10) Reverse Proxy (Nginx)
Example virtual host:

```nginx
server {
    listen 80;
    server_name your-domain.example;

    client_max_body_size 1m;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Add TLS (Let's Encrypt or managed cert) before public launch.

## 11) CI/CD Pipeline
Recommended pipeline stages:

1. `npm ci`
2. `npm run lint`
3. `npm run build`
4. `npm run check:publish`
5. `npm audit --omit=dev --audit-level=high`
6. deploy to staging, then `npm run check:publish -- --live` against staging config
7. promote to production; point the readiness probe at `/api/readiness` and the liveness probe at `/api/health`

Steps 1 to 5 are implemented in `.github/workflows/ci.yml`.

## 12) Operations and Monitoring
Track minimum signals:
- API 5xx rate
- p95 latency for `/api/analyze-symptoms`, `/api/generate-mindmap`, `/api/generate-cases`
- process RSS memory and CPU
- upstream provider error frequency

Log requirements:
- request method and path
- response status
- latency
- error stack traces server-side only

## 13) Hardening Status
Done:
- `/api/health` (liveness) and `/api/readiness` (503 when not publishable).
- Per-IP rate limit on AI routes (`RATE_LIMIT_PER_MIN`) and a 100 KB JSON body limit.
- Structured JSON access log with latency and response source.
- Frontend code splitting (lazy tabs, on-demand export libraries and Firestore).
- Upstream timeouts (`AI_TIMEOUT_MS`), LRU response cache (`AI_CACHE_TTL_MS`) and in-flight dedupe.

Remaining before scale-up:
- The rate limiter and cache are in-process. With more than one replica, move them to Redis or rely on the gateway.
- Some legacy handlers still log with plain `console.log`. Migrate them to the JSON format.
- Review `npm audit --omit=dev` findings each release.

## 14) Rollback Procedure
1. Stop active process/container.
2. Deploy prior successful artifact/image.
3. Start service.
4. Validate `/api/status` and one functional endpoint.
5. Confirm logs are clean.

## 15) Final Go-Live Checklist
- [ ] `.env` configured with production values
- [ ] secrets managed outside git
- [ ] HTTPS enabled
- [ ] reverse proxy active
- [ ] process manager configured for restart
- [ ] smoke tests passing
- [ ] rollback tested
- [ ] monitoring and alerting enabled
