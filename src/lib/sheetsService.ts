/**
 * Client-side Google Sheets / Drive helpers.
 * Normal sync goes through POST /api/sync-to-sheets, which also writes AI grading.
 * These helpers cover discovery (finding an existing ledger after sign-in) and a
 * direct-write path that works when the backend is unreachable.
 */

export const SPREADSHEET_TITLE = 'MedMap Clinical Simulation Logs';
export const SHEET_TAB = 'Simulation History';

export const CLINICAL_HEADERS = [
  'Timestamp (UTC)',
  'Case ID',
  'Patient Demographics',
  'Presenting Symptoms',
  'Vitals Before Intervention',
  'Diagnostics Ordered',
  'Suspected Diagnosis',
  'Intervention Chosen',
  'Vitals After Intervention',
  'Outcome',
  'Attending Feedback',
  'Learning Points',
];

const REQUEST_TIMEOUT_MS = 15_000;

async function googleFetch(url: string, accessToken: string, init: RequestInit = {}): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        ...(init.headers || {}),
      },
    });
  } finally {
    clearTimeout(timer);
  }
}

export async function findExistingSpreadsheet(accessToken: string): Promise<string | null> {
  const q = encodeURIComponent(
    `name = '${SPREADSHEET_TITLE}' and mimeType = 'application/vnd.google-apps.spreadsheet' and trashed = false`,
  );
  try {
    const res = await googleFetch(
      `https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name)&orderBy=modifiedTime desc&pageSize=1`,
      accessToken,
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.files?.[0]?.id ?? null;
  } catch {
    return null;
  }
}

export async function createMedMapSpreadsheet(accessToken: string): Promise<string> {
  const res = await googleFetch('https://sheets.googleapis.com/v4/spreadsheets', accessToken, {
    method: 'POST',
    body: JSON.stringify({
      properties: { title: SPREADSHEET_TITLE },
      sheets: [{ properties: { title: SHEET_TAB, gridProperties: { frozenRowCount: 1 } } }],
    }),
  });
  if (!res.ok) throw new Error(`Failed to create spreadsheet (HTTP ${res.status})`);
  const data = await res.json();
  await appendRow(accessToken, data.spreadsheetId, CLINICAL_HEADERS);
  return data.spreadsheetId;
}

export async function appendRow(accessToken: string, spreadsheetId: string, values: string[]): Promise<void> {
  if (!/^[A-Za-z0-9_-]{20,100}$/.test(spreadsheetId)) throw new Error('Invalid spreadsheet ID');
  const range = encodeURIComponent(`${SHEET_TAB}!A1`);
  const res = await googleFetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
    accessToken,
    { method: 'POST', body: JSON.stringify({ values: [values] }) },
  );
  if (!res.ok) throw new Error(`Failed to append row (HTTP ${res.status})`);
}
