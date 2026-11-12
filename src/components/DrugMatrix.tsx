import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Beaker, RefreshCw, AlertTriangle, ShieldCheck, Plus } from 'lucide-react';
import type { DrugInteraction } from '../types';
import { postJson, isAbortError } from '../lib/api';

interface Drug {
  id: string;
  name: string;
  class: string;
  desc: string;
}

interface Props {
  onCheckInteraction: (drugA: string, drugB: string) => Promise<DrugInteraction | null>;
  isChecking: boolean;
  interactionResult: DrugInteraction | null;
  activeTopic: string;
}

const SEVERITY_STYLE: Record<string, { cell: string; badge: string }> = {
  severe: { cell: 'bg-rose-500/70', badge: 'bg-rose-500/15 text-rose-300 border-rose-500/40' },
  moderate: { cell: 'bg-amber-500/70', badge: 'bg-amber-500/15 text-amber-300 border-amber-500/40' },
  mild: { cell: 'bg-yellow-300/60', badge: 'bg-yellow-300/10 text-yellow-200 border-yellow-300/30' },
  none: { cell: 'bg-emerald-500/50', badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' },
};

function severityKey(sev?: string): keyof typeof SEVERITY_STYLE {
  const s = (sev || '').toLowerCase();
  if (s.includes('severe') || s.includes('major') || s.includes('contraindicated')) return 'severe';
  if (s.includes('moderate')) return 'moderate';
  if (s.includes('mild') || s.includes('minor')) return 'mild';
  return 'none';
}

const pairKey = (a: string, b: string) => [a, b].sort().join('||');
const shortName = (n: string) => n.split('(')[0].trim();

export default function DrugMatrix({ onCheckInteraction, isChecking, interactionResult, activeTopic }: Props) {
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [drugsTopic, setDrugsTopic] = useState('');
  const [loadingDrugs, setLoadingDrugs] = useState(false);
  const [drugA, setDrugA] = useState('');
  const [drugB, setDrugB] = useState('');
  const [customDrug, setCustomDrug] = useState('');
  const [results, setResults] = useState<Record<string, DrugInteraction>>({});
  const [lastPair, setLastPair] = useState<[string, string] | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const loadDrugs = useCallback(async (topic: string) => {
    const t = topic.trim();
    if (!t) return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoadingDrugs(true);
    try {
      const body = await postJson<Drug[]>('/api/get-topic-drugs', { topic: t }, { signal: controller.signal, timeoutMs: 60_000 });
      const list = Array.isArray(body.data) ? body.data.filter((d) => d && d.name).slice(0, 10) : [];
      setDrugs(list);
      setDrugsTopic(t);
      setResults({});
      setDrugA(list[0]?.name || '');
      setDrugB(list[1]?.name || '');
    } catch (err) {
      if (!isAbortError(err)) console.warn('Failed to load topic drugs', err);
    } finally {
      if (abortRef.current === controller) setLoadingDrugs(false);
    }
  }, []);

  useEffect(() => {
    loadDrugs(activeTopic);
    return () => abortRef.current?.abort();
    // Initial load only; reload is explicit (button) so typing does not trigger AI calls.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const check = async (a: string, b: string) => {
    if (!a || !b || a === b) return;
    setDrugA(a);
    setDrugB(b);
    setLastPair([a, b]);
    const key = pairKey(a, b);
    if (results[key]) return; // cached
    const res = await onCheckInteraction(a, b);
    if (res) setResults((prev) => ({ ...prev, [key]: res }));
  };

  const addCustom = () => {
    const name = customDrug.trim().slice(0, 80);
    if (!name || drugs.some((d) => d.name.toLowerCase() === name.toLowerCase())) return;
    setDrugs((prev) => [...prev, { id: name.toLowerCase().replace(/\W+/g, '_'), name, class: 'User-added', desc: 'Added manually for interaction screening.' }]);
    setCustomDrug('');
  };

  const shown = lastPair ? results[pairKey(lastPair[0], lastPair[1])] || interactionResult : null;
  const sev = severityKey(shown?.severity);
  const topicChanged = drugsTopic && drugsTopic.toLowerCase() !== activeTopic.trim().toLowerCase();

  return (
    <div className="h-full flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      <div className="p-4 border-b border-slate-800 flex flex-wrap items-center gap-3 shrink-0">
        <Beaker className="w-4 h-4 text-amber-400" />
        <div>
          <h3 className="text-xs font-bold text-slate-200 uppercase font-mono tracking-wider">Pharmacology Interaction Matrix</h3>
          <p className="text-[9px] text-slate-500">Pairwise PK/PD screening for agents used in {drugsTopic || activeTopic}</p>
        </div>
        <button
          onClick={() => loadDrugs(activeTopic)}
          disabled={loadingDrugs}
          className={`ml-auto text-[9px] font-mono font-bold px-2.5 py-1 rounded-lg border cursor-pointer flex items-center gap-1 ${
            topicChanged ? 'border-amber-500/50 text-amber-300 bg-amber-500/10' : 'border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <RefreshCw className={`w-3 h-3 ${loadingDrugs ? 'animate-spin' : ''}`} />
          {topicChanged ? `LOAD DRUGS FOR "${activeTopic.trim().toUpperCase()}"` : 'RELOAD'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {loadingDrugs && drugs.length === 0 && <p className="text-[10px] font-mono text-slate-500 animate-pulse">LOADING FORMULARY…</p>}

        {drugs.length > 0 && (
          <>
            {/* Selector */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-2">
              {[{ v: drugA, set: setDrugA, label: 'Drug A' }, { v: drugB, set: setDrugB, label: 'Drug B' }].map(({ v, set, label }) => (
                <select
                  key={label}
                  aria-label={label}
                  value={v}
                  onChange={(e) => set(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-[10px] font-mono text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  {drugs.map((d) => <option key={d.id + d.name} value={d.name}>{d.name}</option>)}
                </select>
              ))}
              <button
                onClick={() => check(drugA, drugB)}
                disabled={isChecking || !drugA || !drugB || drugA === drugB}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 text-[10px] font-mono font-bold rounded-lg cursor-pointer"
              >
                {isChecking ? 'ANALYSING…' : 'CHECK'}
              </button>
            </div>

            <div className="flex gap-2">
              <input
                value={customDrug}
                onChange={(e) => setCustomDrug(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addCustom()}
                placeholder="Add another drug (e.g. Amiodarone)"
                aria-label="Add custom drug"
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-[10px] font-mono text-slate-200 focus:outline-none focus:border-amber-500 placeholder:text-slate-600"
              />
              <button onClick={addCustom} className="px-2.5 border border-slate-800 rounded-lg text-slate-400 hover:text-amber-300 cursor-pointer" aria-label="Add drug">
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Result */}
            {shown && (
              <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 space-y-2.5 animate-fade-in">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold text-slate-200">
                    {shortName(lastPair![0])} + {shortName(lastPair![1])}
                  </span>
                  <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border flex items-center gap-1 ${SEVERITY_STYLE[sev].badge}`}>
                    {sev === 'none' ? <ShieldCheck className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                    {String(shown.severity).toUpperCase()}
                  </span>
                </div>
                <div className="text-[10px] leading-relaxed space-y-2 text-slate-300">
                  <p><strong className="text-slate-400 font-mono text-[9px] uppercase block">Mechanism</strong>{shown.mechanism}</p>
                  <p><strong className="text-slate-400 font-mono text-[9px] uppercase block">Clinical guidance</strong>{shown.clinicalGuideline}</p>
                  <p><strong className="text-slate-400 font-mono text-[9px] uppercase block">Alternatives</strong>{shown.alternatives}</p>
                </div>
                <p className="text-[8.5px] text-slate-500 italic">Educational screening only. Confirm against a current interaction reference before prescribing.</p>
              </div>
            )}

            {/* Matrix */}
            <div>
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block mb-2">Pairwise matrix (click a cell)</span>
              <div className="overflow-x-auto">
                <table className="border-separate border-spacing-0.5 text-[8.5px] font-mono">
                  <thead>
                    <tr>
                      <th />
                      {drugs.map((d) => (
                        <th key={d.id + d.name} className="text-slate-500 font-normal px-1 max-w-[70px] truncate" title={d.name}>
                          {shortName(d.name).slice(0, 10)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {drugs.map((row, i) => (
                      <tr key={row.id + row.name}>
                        <th className="text-slate-400 font-normal text-right pr-2 whitespace-nowrap" title={row.class}>{shortName(row.name).slice(0, 16)}</th>
                        {drugs.map((col, j) => {
                          if (i === j) return <td key={col.id + col.name} className="w-6 h-6 bg-slate-800/40 rounded" />;
                          const r = results[pairKey(row.name, col.name)];
                          return (
                            <td key={col.id + col.name} className="p-0">
                              <button
                                onClick={() => check(row.name, col.name)}
                                disabled={isChecking}
                                title={`${row.name} + ${col.name}${r ? `: ${r.severity}` : ''}`}
                                aria-label={`Check ${row.name} with ${col.name}`}
                                className={`w-6 h-6 rounded cursor-pointer border border-slate-800 hover:border-amber-400 ${r ? SEVERITY_STYLE[severityKey(r.severity)].cell : 'bg-slate-950'}`}
                              />
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex gap-3 mt-2 text-[8.5px] font-mono text-slate-500">
                {(['severe', 'moderate', 'mild', 'none'] as const).map((k) => (
                  <span key={k} className="flex items-center gap-1"><span className={`w-2.5 h-2.5 rounded ${SEVERITY_STYLE[k].cell}`} />{k.toUpperCase()}</span>
                ))}
              </div>
            </div>

            {/* Formulary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {drugs.map((d) => (
                <div key={d.id + d.name} className="bg-slate-950 border border-slate-850 rounded-lg p-2.5">
                  <div className="text-[10px] font-bold text-slate-200">{d.name}</div>
                  <div className="text-[8.5px] font-mono text-amber-400/80">{d.class}</div>
                  <p className="text-[9px] text-slate-400 mt-1 leading-relaxed">{d.desc}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
