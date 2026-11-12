#!/usr/bin/env node
/**
 * MedMap publish-readiness gate.
 *
 *   npm run check:publish                # static checks + boot dist/server.cjs and smoke-test every route
 *   npm run check:publish -- --static    # static checks only (no server boot)
 *   npm run check:publish -- --live      # smoke-test with the real AI provider from .env (costs credits)
 *
 * Exit code 0 = publishable (warnings allowed), 1 = at least one blocking failure.
 * The runtime phase forces offline mode by default so results are deterministic and free.
 */
import { spawn, execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import net from 'node:net';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const args = new Set(process.argv.slice(2));
const STATIC_ONLY = args.has('--static');
const LIVE = args.has('--live');

const results = [];
const record = (group, name, status, detail = '') => results.push({ group, name, status, detail });
const pass = (g, n, d) => record(g, n, 'pass', d);
const warn = (g, n, d) => record(g, n, 'warn', d);
const fail = (g, n, d) => record(g, n, 'fail', d);

// ---------------------------------------------------------------------------
// 1. Repository hygiene
// ---------------------------------------------------------------------------
function checkRepository() {
  const G = 'repo';
  const required = ['package.json', 'package-lock.json', 'server.ts', 'index.html', 'src/main.tsx', 'src/App.tsx', '.gitignore', '.env.example', 'Dockerfile', 'README.md'];
  const missing = required.filter((f) => !fs.existsSync(path.join(ROOT, f)));
  missing.length ? fail(G, 'Required files present', `missing: ${missing.join(', ')}`) : pass(G, 'Required files present', `${required.length} files`);

  const gitignore = fs.existsSync(path.join(ROOT, '.gitignore')) ? fs.readFileSync(path.join(ROOT, '.gitignore'), 'utf8') : '';
  const needIgnored = ['node_modules', 'dist', '.env'];
  const notIgnored = needIgnored.filter((p) => !new RegExp(`^/?${p.replace('.', '\\.')}`, 'm').test(gitignore));
  notIgnored.length ? fail(G, '.gitignore covers build output and secrets', `not ignored: ${notIgnored.join(', ')}`) : pass(G, '.gitignore covers build output and secrets');

  try {
    const tracked = execSync('git ls-files', { cwd: ROOT, encoding: 'utf8' }).split('\n');
    const leakedEnv = tracked.filter((f) => /(^|\/)\.env(\.|$)/.test(f) && !f.endsWith('.env.example'));
    leakedEnv.length ? fail(G, 'No .env files tracked by git', leakedEnv.join(', ')) : pass(G, 'No .env files tracked by git');
  } catch {
    warn(G, 'No .env files tracked by git', 'not a git checkout; skipped');
  }

  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
  ['build', 'start', 'lint'].every((s) => pkg.scripts?.[s])
    ? pass(G, 'npm scripts build/start/lint defined')
    : fail(G, 'npm scripts build/start/lint defined');
  pkg.engines?.node ? pass(G, 'Node engine pinned', pkg.engines.node) : warn(G, 'Node engine pinned', 'add "engines": { "node": ">=22.19" }');

  const readme = fs.existsSync(path.join(ROOT, 'README.md')) ? fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8') : '';
  /medical disclaimer/i.test(readme) ? pass(G, 'Medical disclaimer in README') : fail(G, 'Medical disclaimer in README', 'educational medical apps must carry a disclaimer');
}

// ---------------------------------------------------------------------------
// 2. Secret scan (source, config, docs; never node_modules/dist)
// ---------------------------------------------------------------------------
const SECRET_PATTERNS = [
  { name: 'OpenAI-style secret key', re: /\bsk-(?:live|proj|test)?-?[A-Za-z0-9]{32,}\b/ },
  { name: 'AWS access key', re: /\bAKIA[0-9A-Z]{16}\b/ },
  { name: 'GitHub token', re: /\bgh[pousr]_[A-Za-z0-9]{36,}\b/ },
  { name: 'Slack token', re: /\bxox[abposr]-[A-Za-z0-9-]{10,}\b/ },
  { name: 'Private key block', re: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/ },
  { name: 'Service-account private key', re: /"private_key"\s*:\s*"-----BEGIN/ },
  { name: 'Google OAuth client secret', re: /\bGOCSPX-[A-Za-z0-9_-]{20,}\b/ },
];
// Firebase web API keys are public client identifiers; allowed only in the applet config.
const GOOGLE_API_KEY = /\bAIza[0-9A-Za-z_-]{35}\b/;
const GOOGLE_KEY_ALLOWED = new Set(['firebase-applet-config.json']);

function* walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', 'dist', '.git', 'coverage'].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (/\.(ts|tsx|js|mjs|cjs|json|md|html|ya?ml|env|example|rules|txt|sh)$/i.test(entry.name) || entry.name.startsWith('.env')) yield full;
  }
}

function checkSecrets() {
  const G = 'secrets';
  const hits = [];
  let scanned = 0;
  for (const file of walk(ROOT)) {
    const rel = path.relative(ROOT, file);
    if (rel === 'package-lock.json' || rel.startsWith('.env') && rel !== '.env.example') continue; // .env is local-only by design
    const text = fs.readFileSync(file, 'utf8');
    scanned++;
    for (const { name, re } of SECRET_PATTERNS) {
      const m = text.match(re);
      if (m) hits.push(`${rel}: ${name} (${m[0].slice(0, 8)}…)`);
    }
    if (GOOGLE_API_KEY.test(text) && !GOOGLE_KEY_ALLOWED.has(rel)) hits.push(`${rel}: Google API key outside firebase-applet-config.json`);
  }
  hits.length ? fail(G, 'No credentials in source', hits.join('; ')) : pass(G, 'No credentials in source', `${scanned} files scanned`);

  const distServer = path.join(ROOT, 'dist', 'server.cjs');
  if (fs.existsSync(distServer)) {
    const bundle = fs.readFileSync(distServer, 'utf8');
    const leaked = SECRET_PATTERNS.filter(({ re }) => re.test(bundle)).map((p) => p.name);
    leaked.length ? fail(G, 'No credentials in server bundle', leaked.join(', ')) : pass(G, 'No credentials in server bundle');
  }
}

// ---------------------------------------------------------------------------
// 3. Build artefacts and bundle budget
// ---------------------------------------------------------------------------
const INITIAL_JS_BUDGET_KB = 200; // gzip, everything the browser must fetch before first render

function checkBuild() {
  const G = 'build';
  const indexHtml = path.join(ROOT, 'dist', 'index.html');
  if (!fs.existsSync(indexHtml) || !fs.existsSync(path.join(ROOT, 'dist', 'server.cjs'))) {
    fail(G, 'Production build present', 'run `npm run build` first');
    return false;
  }
  pass(G, 'Production build present');

  const html = fs.readFileSync(indexHtml, 'utf8');
  const initial = [...html.matchAll(/(?:src|href)="\/(assets\/[^"]+\.js)"/g)].map((m) => m[1]);
  const gzKb = initial.reduce((sum, rel) => sum + zlib.gzipSync(fs.readFileSync(path.join(ROOT, 'dist', rel))).length, 0) / 1024;
  const detail = `${gzKb.toFixed(1)} KB gzip across ${initial.length} file(s); budget ${INITIAL_JS_BUDGET_KB} KB`;
  gzKb <= INITIAL_JS_BUDGET_KB ? pass(G, 'Initial JS within budget', detail) : warn(G, 'Initial JS within budget', detail);

  const lazy = fs.readdirSync(path.join(ROOT, 'dist', 'assets')).filter((f) => /^(ObsidianMindMap|DrugMatrix|ClinicalQuiz|ComplianceAudit)-/.test(f));
  lazy.length === 4 ? pass(G, 'Secondary tabs code-split', lazy.length + ' lazy chunks') : warn(G, 'Secondary tabs code-split', `found ${lazy.length}/4 lazy chunks`);
  return true;
}

// ---------------------------------------------------------------------------
// 4. Runtime smoke test against the production bundle
// ---------------------------------------------------------------------------
function freePort() {
  return new Promise((resolve, reject) => {
    const srv = net.createServer();
    srv.listen(0, '127.0.0.1', () => {
      const { port } = srv.address();
      srv.close(() => resolve(port));
    });
    srv.on('error', reject);
  });
}

async function waitForHealth(base, timeoutMs = 15_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const r = await fetch(`${base}/api/health`);
      if (r.ok) return true;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  return false;
}

async function request(base, method, url, body) {
  const started = Date.now();
  const res = await fetch(base + url, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(LIVE ? 120_000 : 15_000),
  });
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    /* not JSON */
  }
  return { status: res.status, headers: res.headers, json, text, ms: Date.now() - started };
}

async function checkRuntime() {
  const G = 'runtime';
  const port = await freePort();
  const base = `http://127.0.0.1:${port}`;
  const env = { ...process.env, NODE_ENV: 'production', PORT: String(port), RATE_LIMIT_PER_MIN: '25' };
  if (LIVE) env.AI_TIMEOUT_MS = env.AI_TIMEOUT_MS || '110000';
  if (!LIVE) Object.assign(env, { GEMINI_API_KEY: '', GEMINI_BASE_URL: '', AI_BACKUP_API_KEY: '' });

  const child = spawn(process.execPath, ['dist/server.cjs'], { cwd: ROOT, env, stdio: ['ignore', 'pipe', 'pipe'] });
  let logs = '';
  child.stdout.on('data', (d) => (logs += d));
  child.stderr.on('data', (d) => (logs += d));

  try {
    if (!(await waitForHealth(base))) {
      fail(G, 'Server boots', `no /api/health within 15 s\n${logs.slice(-800)}`);
      return;
    }
    pass(G, 'Server boots', `port ${port}${LIVE ? ' (live AI)' : ' (offline mode)'}`);

    const cases = [
      ['GET /api/health', 'GET', '/api/health', null, (r) => r.status === 200 && r.json?.status === 'ok'],
      ['GET /api/status', 'GET', '/api/status', null, (r) => r.status === 200 && typeof r.json?.configured === 'boolean' && !JSON.stringify(r.json).match(/sk-|AIza/)],
      ['GET /api/readiness', 'GET', '/api/readiness', null, (r) => [200, 503].includes(r.status) && Array.isArray(r.json?.checks)],
      ['GET /api/cases', 'GET', '/api/cases', null, (r) => r.status === 200 && Array.isArray(r.json) && r.json.length > 0],
      ['POST /api/analyze-symptoms', 'POST', '/api/analyze-symptoms', { symptoms: ['chest pain', 'shortness of breath'] }, (r) => r.status === 200 && r.json?.data?.differentials?.length > 0],
      ['POST /api/analyze-symptoms (invalid)', 'POST', '/api/analyze-symptoms', { symptoms: 'chest pain' }, (r) => r.status === 400],
      ['POST /api/get-drug-interaction', 'POST', '/api/get-drug-interaction', { drugA: 'Aspirin', drugB: 'Warfarin' }, (r) => r.status === 200 && typeof r.json?.data?.severity === 'string'],
      ['POST /api/get-topic-drugs', 'POST', '/api/get-topic-drugs', { topic: 'Myocardial Infarction' }, (r) => r.status === 200 && r.json?.data?.length > 0],
      ['POST /api/generate-cases', 'POST', '/api/generate-cases', { topic: 'Myocardial Infarction' }, (r) => r.status === 200 && r.json?.data?.length > 0 && r.json.data.every((c) => c.options.includes(c.correctDiagnosis))],
      ['POST /api/generate-cases (non-cardiac)', 'POST', '/api/generate-cases', { topic: 'Ischemic stroke' }, (r) => r.status === 200 && r.json?.data?.length > 0 && (LIVE || r.json.data.every((c) => !/ST-segment elevation/i.test(JSON.stringify(c.tests))))],
      ['POST /api/generate-mindmap', 'POST', '/api/generate-mindmap', { topic: 'Myocardial Infarction' }, (r) => r.status === 200 && r.json?.data?.nodes?.length > 0 && typeof r.json.data.markdown === 'string'],
      ['POST /api/symptom-mechanism-map', 'POST', '/api/symptom-mechanism-map', { topic: 'Myocardial Infarction', symptoms: 'chest pain' }, (r) => r.status === 200 && r.json?.data?.masterTable?.length > 0],
      ['POST /api/clinical-quiz', 'POST', '/api/clinical-quiz', { topic: 'Asthma' }, (r) => r.status === 200 && r.json?.data?.length > 0],
      ['POST /api/medical-images', 'POST', '/api/medical-images', { topic: 'pneumonia' }, (r) => r.status === 200 && Array.isArray(r.json?.data)],
      ['POST /api/sync-to-sheets (no auth)', 'POST', '/api/sync-to-sheets', { caseId: 'X', caseTitle: 'Y' }, (r) => r.status === 401],
      ['Malformed JSON → 400 JSON', 'POST', '/api/analyze-symptoms', '__RAW__', (r) => r.status === 400 && r.json?.error],
      ['Unknown API route → 404 JSON', 'GET', '/api/does-not-exist', null, (r) => r.status === 404 && r.json?.error],
      ['SPA shell served', 'GET', '/some/client/route', null, (r) => r.status === 200 && r.text.includes('<div id="root">')],
      ['Security headers', 'GET', '/api/health', null, (r) => r.headers.get('x-content-type-options') === 'nosniff' && !r.headers.get('x-powered-by')],
    ];

    for (const [name, method, url, body, assert] of cases) {
      try {
        let r;
        if (body === '__RAW__') {
          const res = await fetch(base + url, { method, headers: { 'Content-Type': 'application/json' }, body: '{not json' });
          r = { status: res.status, json: await res.json().catch(() => null), headers: res.headers, text: '', ms: 0 };
        } else {
          r = await request(base, method, url, body);
        }
        const src = r.json?.source ? ` · source=${r.json.source}` : '';
        // In --live mode an AI route that silently fell back to offline data is a failure, not a pass.
        // Images may legitimately fall back when no candidate survives URL verification.
        const aiRoute = method === 'POST' && r.status === 200 && typeof r.json?.source === 'string' && !url.includes('sync-to-sheets');
        // Image retrieval also depends on Wikimedia, which can throttle shared IPs: degrade to a warning.
        if (LIVE && url === '/api/medical-images' && r.json.source !== 'gemini') {
          warn(G, name, `served curated images (source=${r.json.source}); check Wikimedia reachability from the host`);
          continue;
        }
        if (LIVE && aiRoute && r.json.source !== 'gemini') {
          fail(G, name, `expected live AI response, got source=${r.json.source} after ${r.ms} ms`);
          continue;
        }
        assert(r) ? pass(G, name, `${r.status} in ${r.ms} ms${src}`) : fail(G, name, `unexpected response ${r.status}: ${r.text.slice(0, 160)}`);
      } catch (err) {
        fail(G, name, err.message);
      }
    }

    // Hashed assets must be long-cached, index.html must not be.
    const html = await request(base, 'GET', '/', null);
    const asset = html.text.match(/\/assets\/[^"]+\.js/)?.[0];
    if (asset) {
      const a = await request(base, 'GET', asset, null);
      /immutable/.test(a.headers.get('cache-control') || '') && /no-cache/.test(html.headers.get('cache-control') || '')
        ? pass(G, 'Cache headers (immutable assets, revalidated shell)')
        : warn(G, 'Cache headers (immutable assets, revalidated shell)', `asset=${a.headers.get('cache-control')} shell=${html.headers.get('cache-control')}`);
    }

    // Rate limiter: the 25/min budget is partly used above; a burst must hit 429.
    let limited = false;
    for (let i = 0; i < 30 && !limited; i++) {
      const r = await request(base, 'POST', '/api/analyze-symptoms', { symptoms: ['cough'] });
      limited = r.status === 429;
    }
    limited ? pass(G, 'Rate limiter enforces 429') : fail(G, 'Rate limiter enforces 429', 'no 429 after burst');
  } finally {
    child.kill('SIGTERM');
    await new Promise((r) => child.once('exit', r).once('error', r) && setTimeout(r, 3000));
  }
}

// ---------------------------------------------------------------------------
async function main() {
  console.log('\nMedMap Visual Atlas: publish readiness check\n');
  checkRepository();
  checkSecrets();
  const built = checkBuild();
  if (!STATIC_ONLY && built) await checkRuntime();
  else if (!STATIC_ONLY) warn('runtime', 'Runtime smoke test', 'skipped: no build');

  const icon = { pass: '\x1b[32m✔\x1b[0m', warn: '\x1b[33m!\x1b[0m', fail: '\x1b[31m✘\x1b[0m' };
  let group = '';
  for (const r of results) {
    if (r.group !== group) {
      group = r.group;
      console.log(`\n  ${group.toUpperCase()}`);
    }
    console.log(`  ${icon[r.status]} ${r.name}${r.detail ? `  \x1b[2m${r.detail}\x1b[0m` : ''}`);
  }
  const count = (s) => results.filter((r) => r.status === s).length;
  const failed = count('fail');
  console.log(`\n  ${count('pass')} passed · ${count('warn')} warnings · ${failed} failed`);
  console.log(failed ? '\n  \x1b[31mNOT READY TO PUBLISH\x1b[0m\n' : '\n  \x1b[32mREADY TO PUBLISH\x1b[0m\n');

  // Written outside dist/ so the report is never served publicly.
  fs.writeFileSync(path.join(ROOT, 'publish-report.json'), JSON.stringify({ generatedAt: new Date().toISOString(), live: LIVE, results }, null, 2));
  process.exit(failed ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
