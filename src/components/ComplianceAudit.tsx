import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ShieldCheck, ShieldAlert, RefreshCw, CheckCircle2, AlertTriangle, XCircle, Download, Trash2,
  FileSpreadsheet, Cpu, Rocket, Clock,
} from 'lucide-react';
import { selectAITier, type RouteDecision } from '../lib/ai/tierRouter';

type CheckStatus = 'pass' | 'warn' | 'fail';
interface ReadinessCheck {
  id: string;
  label: string;
  status: CheckStatus;
  detail: string;
}
interface ReadinessReport {
  ready: boolean;
  summary: { pass: number; warn: number; fail: number };
  checks: ReadinessCheck[];
  runtime: { node: string; uptimeSec: number; rssMb: number; env: string; version: string };
  generatedAt: string;
}

interface Props {
  logs: any[];
  onExportCsv: () => void;
  onClearLogs: () => void;
  sheetsUser: any;
  sheetsToken: string | null;
  sheetsSpreadsheetId: string | null;
  onSignInSheets: () => void;
  onExportSheets: () => void;
  isExportingSheets: boolean;
  sheetsExportSuccess: boolean;
  sheetsExportError: string | null;
  isApiSimulated: boolean;
  activeTopic: string;
}

const STATUS_ICON: Record<CheckStatus, React.ReactNode> = {
  pass: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />,
  warn: <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />,
  fail: <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />,
};

/** Checks that can only run in the browser (they depend on the viewer's context). */
function clientChecks(isApiSimulated: boolean): ReadinessCheck[] {
  const secure = typeof window !== 'undefined' && (window.isSecureContext || location.hostname === 'localhost');
  let storage = true;
  try {
    localStorage.setItem('__medmap_probe', '1');
    localStorage.removeItem('__medmap_probe');
  } catch {
    storage = false;
  }
  return [
    {
      id: 'client.https',
      label: 'Served over HTTPS',
      status: secure ? 'pass' : 'fail',
      detail: secure ? `Secure context (${location.protocol})` : 'Google sign-in and clipboard need HTTPS. Terminate TLS at the proxy.',
    },
    {
      id: 'client.storage',
      label: 'Browser storage available',
      status: storage ? 'pass' : 'warn',
      detail: storage ? 'Local journal persists between visits' : 'Private mode or blocked storage: the local journal will not persist',
    },
    {
      id: 'client.ai',
      label: 'AI mode reachable from this browser',
      status: isApiSimulated ? 'warn' : 'pass',
      detail: isApiSimulated ? 'Running on the curated offline dataset' : 'Live AI responses active',
    },
  ];
}

export default function ComplianceAudit(props: Props) {
  const {
    logs, onExportCsv, onClearLogs, sheetsUser, sheetsSpreadsheetId, onSignInSheets, onExportSheets,
    isExportingSheets, sheetsExportSuccess, sheetsExportError, isApiSimulated,
  } = props;

  const [report, setReport] = useState<ReadinessReport | null>(null);
  const [reportError, setReportError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [tier, setTier] = useState<RouteDecision | null>(null);

  const runChecks = useCallback(async () => {
    setLoading(true);
    setReportError(null);
    try {
      const [res, decision] = await Promise.all([
        fetch('/api/readiness', { cache: 'no-store' }),
        selectAITier().catch(() => null),
      ]);
      // 503 still carries a full report body (not ready ≠ unreachable).
      const body = await res.json();
      if (!body?.checks) throw new Error(`Readiness endpoint returned HTTP ${res.status}`);
      setReport(body);
      setTier(decision);
    } catch (err) {
      setReportError((err as Error).message || 'Readiness endpoint unreachable');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    runChecks();
  }, [runChecks]);

  const allChecks = useMemo(
    () => [...(report?.checks || []), ...clientChecks(isApiSimulated)],
    [report, isApiSimulated],
  );
  const counts = useMemo(
    () => allChecks.reduce((acc, c) => ({ ...acc, [c.status]: acc[c.status] + 1 }), { pass: 0, warn: 0, fail: 0 } as Record<CheckStatus, number>),
    [allChecks],
  );
  const verdict: CheckStatus = counts.fail > 0 || reportError ? 'fail' : counts.warn > 0 ? 'warn' : 'pass';

  const stats = useMemo(() => {
    const stabilized = logs.filter((l) => l.outcome?.includes('STABILIZED')).length;
    const withDx = logs.filter((l) => l.suspectedDiagnosis && !String(l.suspectedDiagnosis).startsWith('Incomplete')).length;
    return {
      total: logs.length,
      successRate: logs.length ? Math.round((stabilized / logs.length) * 100) : 0,
      workupCompleteness: logs.length ? Math.round((withDx / logs.length) * 100) : 0,
    };
  }, [logs]);

  const downloadReport = () => {
    const payload = { verdict, counts, checks: allChecks, runtime: report?.runtime, aiTier: tier, generatedAt: new Date().toISOString() };
    const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `medmap-publish-readiness-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      <div className="p-4 border-b border-slate-800 flex flex-wrap items-center gap-3 shrink-0">
        <ShieldCheck className="w-4 h-4 text-indigo-400" />
        <div>
          <h3 className="text-xs font-bold text-slate-200 uppercase font-mono tracking-wider">Audit, Compliance & Publish Readiness</h3>
          <p className="text-[9px] text-slate-500">Live deployment checks, AI routing state and simulation audit trail</p>
        </div>
        <div className="ml-auto flex gap-2">
          <button onClick={downloadReport} disabled={!report} className="text-[9px] font-mono font-bold px-2.5 py-1 rounded-lg border border-slate-800 text-slate-400 hover:text-slate-200 cursor-pointer flex items-center gap-1">
            <Download className="w-3 h-3" /> REPORT
          </button>
          <button onClick={runChecks} disabled={loading} className="text-[9px] font-mono font-bold px-2.5 py-1 rounded-lg border border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/10 cursor-pointer flex items-center gap-1">
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} /> RE-RUN
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {/* Verdict */}
        <div
          className={`p-4 rounded-xl border flex items-center gap-3 ${
            verdict === 'pass' ? 'border-emerald-500/30 bg-emerald-500/5' : verdict === 'warn' ? 'border-amber-500/30 bg-amber-500/5' : 'border-rose-500/30 bg-rose-500/5'
          }`}
          aria-live="polite"
        >
          <Rocket className={`w-5 h-5 ${verdict === 'pass' ? 'text-emerald-400' : verdict === 'warn' ? 'text-amber-400' : 'text-rose-400'}`} />
          <div className="flex-1">
            <div className="text-[11px] font-mono font-bold text-slate-100">
              {loading && !report ? 'RUNNING CHECKS…' : verdict === 'pass' ? 'READY TO PUBLISH' : verdict === 'warn' ? 'PUBLISHABLE WITH WARNINGS' : 'NOT READY TO PUBLISH'}
            </div>
            <div className="text-[9px] font-mono text-slate-400">
              {counts.pass} pass · {counts.warn} warn · {counts.fail} fail
              {report && ` · server ${report.runtime.version} on Node ${report.runtime.node} (${report.runtime.env})`}
            </div>
          </div>
        </div>

        {reportError && (
          <p className="text-[9px] font-mono text-rose-400 bg-rose-500/10 border border-rose-500/20 p-2 rounded flex gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5" /> {reportError}
          </p>
        )}

        {/* Checklist */}
        <ul className="space-y-1.5">
          {allChecks.map((c) => (
            <li key={c.id} className="flex items-start gap-2 bg-slate-950 border border-slate-850 rounded-lg p-2.5">
              {STATUS_ICON[c.status]}
              <div className="min-w-0">
                <div className="text-[10px] font-bold text-slate-200">{c.label}</div>
                <div className="text-[9px] text-slate-500 break-words">{c.detail}</div>
              </div>
              <span className="ml-auto text-[8px] font-mono text-slate-600 shrink-0">{c.id}</span>
            </li>
          ))}
        </ul>

        {/* AI tier routing */}
        <div className="bg-slate-950 border border-slate-850 rounded-xl p-3.5 space-y-1.5">
          <div className="flex items-center gap-1.5 text-[9px] font-mono text-slate-500 uppercase tracking-widest">
            <Cpu className="w-3 h-3" /> Inference tier router
          </div>
          {tier ? (
            <div className="text-[10px] font-mono">
              <span className="text-indigo-300 font-bold">{tier.tier}</span>
              <span className="text-slate-500"> · {tier.reason}</span>
            </div>
          ) : (
            <div className="text-[10px] font-mono text-slate-500">Probing…</div>
          )}
          <p className="text-[9px] text-slate-500">Degradation order: cloud provider → local Ollama → in-browser WebGPU → curated offline data.</p>
        </div>

        {/* Audit trail */}
        <div className="bg-slate-950 border border-slate-850 rounded-xl p-3.5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Simulation audit trail</span>
            <div className="flex gap-2">
              <button onClick={onExportCsv} disabled={!logs.length} className="text-[8.5px] font-mono text-emerald-400 border border-emerald-500/20 rounded px-2 py-0.5 cursor-pointer flex items-center gap-1 disabled:opacity-40">
                <Download className="w-2.5 h-2.5" /> CSV
              </button>
              <button onClick={onClearLogs} disabled={!logs.length} className="text-[8.5px] font-mono text-rose-400 border border-rose-500/20 rounded px-2 py-0.5 cursor-pointer flex items-center gap-1 disabled:opacity-40">
                <Trash2 className="w-2.5 h-2.5" /> CLEAR
              </button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center font-mono">
            {[
              ['RUNS LOGGED', stats.total],
              ['STABILISED', `${stats.successRate}%`],
              ['DX RECORDED', `${stats.workupCompleteness}%`],
            ].map(([k, v]) => (
              <div key={k as string} className="bg-slate-900/60 border border-slate-850 rounded-lg p-2">
                <div className="text-lg font-bold text-slate-100">{v}</div>
                <div className="text-[8px] text-slate-500">{k}</div>
              </div>
            ))}
          </div>
          {logs.slice(0, 5).map((l, i) => (
            <div key={i} className="flex items-center gap-2 text-[9px] font-mono text-slate-400 border-t border-slate-900 pt-1.5">
              <Clock className="w-3 h-3 text-slate-600" />
              <span className="truncate flex-1">{l.caseId} · {l.caseTitle}</span>
              <span className={l.outcome?.includes('STABILIZED') ? 'text-emerald-400' : 'text-rose-400'}>
                {l.outcome?.includes('STABILIZED') ? 'STABLE' : 'CRITICAL'}
              </span>
            </div>
          ))}
        </div>

        {/* Sheets ledger */}
        <div className="bg-slate-950 border border-slate-850 rounded-xl p-3.5 space-y-2">
          <div className="flex items-center gap-1.5 text-[9px] font-mono text-slate-500 uppercase tracking-widest">
            <FileSpreadsheet className="w-3 h-3" /> External ledger (Google Sheets)
          </div>
          {sheetsUser ? (
            <div className="text-[10px] font-mono text-slate-300 space-y-1">
              <div>Operator: <span className="text-emerald-400">{sheetsUser.email}</span></div>
              {sheetsSpreadsheetId && (
                <a className="text-cyan-400 hover:underline" href={`https://docs.google.com/spreadsheets/d/${sheetsSpreadsheetId}`} target="_blank" rel="noopener noreferrer">
                  Open ledger ↗
                </a>
              )}
              <button onClick={onExportSheets} disabled={isExportingSheets} className="block mt-1 text-[9px] font-bold px-2.5 py-1 rounded border border-emerald-500/30 text-emerald-300 cursor-pointer">
                {isExportingSheets ? 'SYNCING…' : 'SYNC ACTIVE TRIAL'}
              </button>
            </div>
          ) : (
            <button onClick={onSignInSheets} className="text-[9px] font-mono font-bold px-2.5 py-1 rounded border border-slate-800 text-slate-300 hover:border-slate-700 cursor-pointer">
              CONNECT GOOGLE ACCOUNT
            </button>
          )}
          {sheetsExportSuccess && <p className="text-[9px] font-mono text-emerald-400">✓ Last sync succeeded</p>}
          {sheetsExportError && <p className="text-[9px] font-mono text-rose-400">✗ {sheetsExportError}</p>}
        </div>

        {/* Medical disclaimer: always visible, as required for publishing */}
        <p className="text-[9px] text-slate-500 leading-relaxed border-t border-slate-850 pt-3">
          MedMap Visual Atlas is for education and simulation only. It does not provide medical advice, diagnosis or treatment.
          Verify all clinical, diagnostic, therapeutic and drug information against current guidelines and qualified professionals.
        </p>
      </div>
    </div>
  );
}
