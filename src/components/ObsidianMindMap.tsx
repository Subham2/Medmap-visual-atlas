import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ReactFlow, Background, Controls, MiniMap, MarkerType, type Edge, type Node } from '@xyflow/react';
import { Network, RefreshCw, Download, X, Pill } from 'lucide-react';
import { postJson, isAbortError, isLiveSource } from '../lib/api';

interface MindNode {
  id: string;
  label: string;
  category: string;
  description: string;
}
interface MindLink {
  source: string;
  target: string;
}
interface MindMapData {
  topic: string;
  markdown: string;
  nodes: MindNode[];
  links: MindLink[];
  therapeutics?: Record<string, any>;
}

interface Props {
  activeTopic: string;
  setActiveTopic: (t: string) => void;
}

const CATEGORY_COLOR: Record<string, string> = {
  core: '#10b981', definition: '#22d3ee', anatomy: '#60a5fa', physiology: '#818cf8', biochemistry: '#a78bfa',
  etiology: '#f472b6', risk_factors: '#fb7185', pathophysiology: '#f97316', pathology: '#f59e0b',
  clinical_features: '#facc15', diagnosis: '#a3e635', differential: '#4ade80', management: '#34d399',
  pharmacology: '#2dd4bf', complications: '#ef4444', prognosis: '#94a3b8', prevention: '#38bdf8',
  research: '#c084fc', exam: '#e879f9', correlation: '#fbbf24', summary: '#cbd5e1', therapeutics: '#14b8a6',
};
const colorFor = (c: string) => CATEGORY_COLOR[c] || '#64748b';

/** Radial layout: core node at the origin, the rest evenly spaced on a ring sized to the node count. */
function layout(data: MindMapData): { nodes: Node[]; edges: Edge[] } {
  const core = data.nodes.find((n) => n.category === 'core') || data.nodes[0];
  const others = data.nodes.filter((n) => n !== core);
  const radius = Math.max(260, others.length * 26);

  const nodes: Node[] = [];
  if (core) {
    nodes.push({
      id: core.id,
      position: { x: 0, y: 0 },
      data: { label: core.label },
      style: { background: '#064e3b', color: '#ecfdf5', border: '2px solid #10b981', borderRadius: 12, fontWeight: 700, fontSize: 13, width: 200, textAlign: 'center' },
    });
  }
  others.forEach((n, i) => {
    const angle = (2 * Math.PI * i) / Math.max(1, others.length) - Math.PI / 2;
    const color = colorFor(n.category);
    nodes.push({
      id: n.id,
      position: { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius },
      data: { label: n.label },
      style: { background: '#0f172a', color: '#e2e8f0', border: `1.5px solid ${color}`, borderRadius: 10, fontSize: 11, width: 150, textAlign: 'center' },
    });
  });

  const ids = new Set(nodes.map((n) => n.id));
  const edges: Edge[] = data.links
    .filter((l) => ids.has(l.source) && ids.has(l.target))
    .map((l, i) => ({
      id: `e${i}-${l.source}-${l.target}`,
      source: l.source,
      target: l.target,
      animated: l.source !== core?.id,
      style: { stroke: l.source === core?.id ? '#334155' : '#14b8a6', strokeWidth: l.source === core?.id ? 1 : 1.5 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#475569', width: 12, height: 12 },
    }));

  return { nodes, edges };
}

/** Extract the "## N. Title" markdown section matching a node label like "7. Pathophysiology". */
function sectionFor(markdown: string, label: string): string | null {
  const num = label.match(/^(\d+)\./)?.[1];
  if (!num || !markdown) return null;
  const re = new RegExp(`^## ${num}\\.[^\\n]*\\n([\\s\\S]*?)(?=^## \\d+\\.|$(?![\\s\\S]))`, 'm');
  return markdown.match(re)?.[1]?.trim() || null;
}

function toMermaid(data: MindMapData): string {
  const safe = (s: string) => s.replace(/["[\]{}()<>]/g, '').slice(0, 60);
  const lines = ['graph TD'];
  data.nodes.forEach((n) => lines.push(`  ${n.id}["${safe(n.label)}"]`));
  data.links.forEach((l) => lines.push(`  ${l.source} --> ${l.target}`));
  return lines.join('\n');
}

function downloadBlob(content: BlobPart, filename: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function ObsidianMindMap({ activeTopic }: Props) {
  const [data, setData] = useState<MindMapData | null>(null);
  const [source, setSource] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<MindNode | null>(null);
  const [showTherapeutics, setShowTherapeutics] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const flowRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const load = useCallback(async (topic: string) => {
    if (!topic.trim()) return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    setError(null);
    setSelected(null);
    try {
      const body = await postJson<MindMapData>('/api/generate-mindmap', { topic: topic.trim() }, { signal: controller.signal, timeoutMs: 150_000 });
      const d = body.data;
      if (!d || !Array.isArray(d.nodes) || d.nodes.length === 0) throw new Error('Mind map returned no nodes');
      setData({ ...d, links: Array.isArray(d.links) ? d.links : [] });
      setSource(body.source);
    } catch (err) {
      if (!isAbortError(err)) setError((err as Error).message);
    } finally {
      if (abortRef.current === controller) setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(activeTopic);
    return () => abortRef.current?.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const graph = useMemo(() => (data ? layout(data) : { nodes: [], edges: [] }), [data]);
  const nodeById = useMemo(() => new Map((data?.nodes || []).map((n) => [n.id, n])), [data]);
  const selectedSection = useMemo(() => (selected && data ? sectionFor(data.markdown, selected.label) : null), [selected, data]);

  const exportAs = async (kind: 'png' | 'svg' | 'pdf' | 'json' | 'md' | 'mermaid') => {
    if (!data) return;
    const base = `MedMap_${data.topic.replace(/\W+/g, '_')}`;
    setExportOpen(false);
    if (kind === 'json') return downloadBlob(JSON.stringify(data, null, 2), `${base}.json`, 'application/json');
    if (kind === 'md') return downloadBlob(data.markdown, `${base}.md`, 'text/markdown');
    if (kind === 'mermaid') return downloadBlob(toMermaid(data), `${base}.mmd`, 'text/plain');

    const el = flowRef.current?.querySelector('.react-flow') as HTMLElement | null;
    if (!el) return;
    setExporting(true);
    try {
      // Loaded on demand: html-to-image and jsPDF together add ~400 KB that most sessions never use.
      const { toPng, toSvg } = await import('html-to-image');
      const filter = (node: HTMLElement) =>
        !node.classList?.contains('react-flow__controls') && !node.classList?.contains('react-flow__minimap');
      const opts = { backgroundColor: '#020617', pixelRatio: 2, filter };
      if (kind === 'svg') {
        const url = await toSvg(el, opts);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${base}.svg`;
        a.click();
      } else {
        const png = await toPng(el, opts);
        if (kind === 'png') {
          const a = document.createElement('a');
          a.href = png;
          a.download = `${base}.png`;
          a.click();
        } else {
          const { jsPDF } = await import('jspdf');
          const pdf = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
          const w = pdf.internal.pageSize.getWidth();
          const h = pdf.internal.pageSize.getHeight();
          pdf.setFontSize(14);
          pdf.text(`MedMap Mind Map: ${data.topic}`, 24, 28);
          const img = new Image();
          img.src = png;
          await img.decode();
          const scale = Math.min((w - 48) / img.width, (h - 60) / img.height);
          pdf.addImage(png, 'PNG', 24, 40, img.width * scale, img.height * scale);
          pdf.addPage();
          pdf.setFontSize(9);
          const lines = pdf.splitTextToSize(data.markdown.replace(/[#*`]/g, ''), w - 48);
          let y = 30;
          for (const line of lines) {
            if (y > h - 24) {
              pdf.addPage();
              y = 30;
            }
            pdf.text(line, 24, y);
            y += 11;
          }
          pdf.save(`${base}.pdf`);
        }
      }
    } catch (err) {
      setError(`Export failed: ${(err as Error).message}`);
    } finally {
      setExporting(false);
    }
  };

  const ther = data?.therapeutics;
  const topicChanged = data && data.topic.toLowerCase() !== activeTopic.trim().toLowerCase();

  return (
    <div className="h-full flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl min-h-[600px]">
      <div className="p-3 border-b border-slate-800 flex flex-wrap items-center gap-2 shrink-0">
        <Network className="w-4 h-4 text-emerald-400" />
        <h3 className="text-xs font-bold text-slate-200 uppercase font-mono tracking-wider">{data?.topic || activeTopic} · Knowledge Graph</h3>
        {source && (
          <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded border ${isLiveSource(source) ? 'text-emerald-400 border-emerald-500/30' : 'text-amber-400 border-amber-500/30'}`}>
            {isLiveSource(source) ? 'AI' : 'OFFLINE'}
          </span>
        )}
        <div className="ml-auto flex items-center gap-1.5 relative">
          {ther && (
            <button onClick={() => setShowTherapeutics((v) => !v)} className="text-[9px] font-mono font-bold px-2 py-1 rounded-lg border border-teal-500/30 text-teal-300 hover:bg-teal-500/10 cursor-pointer flex items-center gap-1">
              <Pill className="w-3 h-3" /> THERAPEUTICS
            </button>
          )}
          <button
            onClick={() => load(activeTopic)}
            disabled={loading}
            className={`text-[9px] font-mono font-bold px-2 py-1 rounded-lg border cursor-pointer flex items-center gap-1 ${
              topicChanged ? 'border-amber-500/50 text-amber-300 bg-amber-500/10' : 'border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} /> {topicChanged ? 'BUILD FOR NEW FOCUS' : 'REGENERATE'}
          </button>
          <button
            onClick={() => setExportOpen((v) => !v)}
            disabled={!data || exporting}
            aria-haspopup="menu"
            aria-expanded={exportOpen}
            className="text-[9px] font-mono font-bold px-2 py-1 rounded-lg border border-slate-800 text-slate-400 hover:text-slate-200 cursor-pointer flex items-center gap-1"
          >
            <Download className="w-3 h-3" /> {exporting ? 'EXPORTING…' : 'EXPORT'}
          </button>
          {exportOpen && (
            <div role="menu" className="absolute right-0 top-8 z-20 bg-slate-950 border border-slate-800 rounded-lg shadow-xl p-1 grid grid-cols-1 min-w-[120px]">
              {(['png', 'svg', 'pdf', 'json', 'md', 'mermaid'] as const).map((k) => (
                <button key={k} role="menuitem" onClick={() => exportAs(k)} className="text-left text-[10px] font-mono px-2 py-1 rounded text-slate-300 hover:bg-slate-800 cursor-pointer">
                  {k === 'md' ? 'MARKDOWN' : k.toUpperCase()}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {error && <p className="m-3 text-[9px] font-mono text-rose-400 bg-rose-500/10 border border-rose-500/20 p-2 rounded">✗ {error}</p>}

      <div className="flex-1 relative min-h-0" ref={flowRef}>
        {loading && !data && <div className="absolute inset-0 flex items-center justify-center text-[10px] font-mono text-slate-500 animate-pulse">GENERATING KNOWLEDGE GRAPH…</div>}
        {data && (
          <ReactFlow
            nodes={graph.nodes}
            edges={graph.edges}
            fitView
            fitViewOptions={{ padding: 0.15 }}
            minZoom={0.15}
            nodesConnectable={false}
            onNodeClick={(_, n) => setSelected(nodeById.get(n.id) || null)}
            onPaneClick={() => setSelected(null)}
            proOptions={{ hideAttribution: true }}
            colorMode="dark"
          >
            <Background color="#1e293b" gap={22} />
            <Controls showInteractive={false} />
            <MiniMap pannable zoomable nodeColor={(n) => colorFor(nodeById.get(n.id)?.category || '')} maskColor="rgba(2,6,23,0.7)" style={{ background: '#0f172a' }} />
          </ReactFlow>
        )}

        {selected && (
          <aside className="absolute top-3 left-3 bottom-3 w-[min(360px,85%)] bg-slate-950/95 border border-slate-800 rounded-xl p-4 overflow-y-auto z-10 shadow-2xl animate-fade-in">
            <div className="flex justify-between items-start gap-2">
              <h4 className="text-xs font-bold" style={{ color: colorFor(selected.category) }}>{selected.label}</h4>
              <button onClick={() => setSelected(null)} aria-label="Close" className="text-slate-500 hover:text-slate-200 cursor-pointer"><X className="w-3.5 h-3.5" /></button>
            </div>
            <p className="text-[10px] text-slate-300 mt-2 leading-relaxed">{selected.description}</p>
            {selectedSection && (
              <div className="mt-3 pt-3 border-t border-slate-850 space-y-1.5 text-[10px] leading-relaxed text-slate-400">
                {selectedSection.split('\n').map((line, i) =>
                  line.startsWith('###') ? (
                    <h5 key={i} className="text-[9px] font-mono font-bold text-slate-200 uppercase mt-2">{line.replace(/^#+\s*/, '')}</h5>
                  ) : line.trim() ? (
                    <p key={i}>{line.replace(/^[-*]\s*/, '• ')}</p>
                  ) : null,
                )}
              </div>
            )}
          </aside>
        )}

        {showTherapeutics && ther && (
          <aside className="absolute top-3 right-3 bottom-3 w-[min(420px,90%)] bg-slate-950/95 border border-teal-500/30 rounded-xl p-4 overflow-y-auto z-10 shadow-2xl text-[10px] text-slate-300 space-y-3 animate-fade-in">
            <div className="flex justify-between">
              <h4 className="text-xs font-bold text-teal-300 font-mono uppercase">Latest & Advanced Therapeutics</h4>
              <button onClick={() => setShowTherapeutics(false)} aria-label="Close" className="text-slate-500 hover:text-slate-200 cursor-pointer"><X className="w-3.5 h-3.5" /></button>
            </div>
            {ther.disclaimer && <p className="text-[9px] italic text-amber-300/80">{ther.disclaimer}</p>}
            {Object.entries(ther)
              .filter(([k]) => !['disclaimer', 'lastUpdated'].includes(k))
              .map(([k, v]) => (
                <section key={k}>
                  <h5 className="font-mono text-[9px] font-bold uppercase text-slate-400 mb-1">{k.replace(/([A-Z])/g, ' $1')}</h5>
                  {Array.isArray(v) ? (
                    <ul className="space-y-1.5">
                      {v.map((item: any, i: number) => (
                        <li key={i} className="bg-slate-900/60 border border-slate-850 rounded p-2">
                          {typeof item === 'string'
                            ? item
                            : Object.entries(item).map(([ik, iv]) => (
                                <div key={ik}><span className="text-slate-500 text-[9px]">{ik}: </span>{String(iv)}</div>
                              ))}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>{String(v)}</p>
                  )}
                </section>
              ))}
          </aside>
        )}
      </div>
    </div>
  );
}
