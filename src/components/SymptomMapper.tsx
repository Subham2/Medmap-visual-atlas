import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Brain, Search, X, RefreshCw, Image as ImageIcon, AlertTriangle, ExternalLink } from 'lucide-react';
import type { SymptomMechanismMap, MedicalImage } from '../types';
import { postJson, isAbortError, isLiveSource } from '../lib/api';

interface Props {
  onStatusChange: (simulated: boolean) => void;
  activeTopic: string;
  setActiveTopic: (topic: string) => void;
  /** Incremented by the app when a new topic is applied. */
  topicVersion?: number;
}

type SectionKey =
  | 'overview' | 'master' | 'patho' | 'histo' | 'biochem' | 'genetic'
  | 'anatomy' | 'invest' | 'ddx' | 'therapy' | 'exam' | 'images';

const SECTIONS: { key: SectionKey; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'master', label: 'Master' },
  { key: 'patho', label: 'Patho' },
  { key: 'histo', label: 'Histo' },
  { key: 'biochem', label: 'Biochem' },
  { key: 'genetic', label: 'Genetic' },
  { key: 'anatomy', label: 'Anat/Phys' },
  { key: 'invest', label: 'Tests' },
  { key: 'ddx', label: 'DDx' },
  { key: 'therapy', label: 'Therapy' },
  { key: 'exam', label: 'Exam' },
  { key: 'images', label: 'Images' },
];

const SUGGESTED = ['Chest pain', 'Dyspnoea', 'Diaphoresis', 'Syncope', 'Fever', 'Headache', 'Abdominal pain', 'Fatigue'];

/** Turn a camelCase key into a readable label. */
const humanize = (k: string) => k.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase());

/** Render an array of flat records as stacked key/value cards (readable in a narrow column). */
function RecordCards({ rows, titleKey = 'symptomName' }: { rows?: Record<string, any>[]; titleKey?: string }) {
  if (!rows || rows.length === 0) return <p className="text-[10px] text-slate-500 font-mono">No data for this section.</p>;
  return (
    <div className="space-y-3">
      {rows.map((row, i) => (
        <div key={i} className="bg-slate-950 border border-slate-850 rounded-lg p-3 space-y-1.5">
          <h5 className="text-[10px] font-bold text-emerald-400 font-mono uppercase tracking-wide">
            {String(row[titleKey] ?? row.name ?? row.finding ?? `Item ${i + 1}`)}
          </h5>
          {Object.entries(row)
            .filter(([k]) => k !== titleKey)
            .map(([k, v]) => (
              <div key={k} className="text-[10px] leading-relaxed">
                <span className="text-slate-500 font-mono text-[9px] uppercase">{humanize(k)}: </span>
                <span className="text-slate-300">
                  {typeof v === 'object' && v !== null
                    ? Object.entries(v).map(([bk, bv]) => `${humanize(bk)}: ${bv}`).join(' • ')
                    : String(v)}
                </span>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}

const ImageCard: React.FC<{ img: MedicalImage & { verificationScore?: number } }> = ({ img }) => {
  const [failed, setFailed] = useState(false);
  return (
    <figure className="bg-slate-950 border border-slate-850 rounded-lg overflow-hidden">
      {!failed ? (
        <img
          src={img.imageUrl}
          alt={img.imageTitle}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
          className="w-full h-40 object-cover bg-slate-900"
        />
      ) : (
        <div className="h-24 flex items-center justify-center text-[10px] text-slate-500 font-mono bg-slate-900">IMAGE UNAVAILABLE</div>
      )}
      <figcaption className="p-3 space-y-1.5 text-[10px]">
        <div className="flex justify-between gap-2">
          <span className="font-bold text-slate-200">{img.imageTitle}</span>
          <span
            className={`shrink-0 text-[8px] font-mono px-1.5 py-0.5 rounded border ${
              img.verificationStatus === 'verified'
                ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
                : 'text-amber-400 border-amber-500/30 bg-amber-500/10'
            }`}
          >
            {img.verificationStatus?.toUpperCase()}
            {typeof img.verificationScore === 'number' ? ` ${img.verificationScore}` : ''}
          </span>
        </div>
        <p className="text-slate-400">{img.teachingPoints}</p>
        <p className="text-slate-500 italic">{img.clinicalPathologyCorrelation}</p>
        <p className="text-[9px] text-slate-500">
          {img.attributionText} ·{' '}
          <a href={img.licenseUrl} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">
            {img.license}
          </a>{' '}
          ·{' '}
          <a href={img.originalSourcePage} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline inline-flex items-center gap-0.5">
            Source <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </p>
      </figcaption>
    </figure>
  );
};

export default function SymptomMapper({ onStatusChange, activeTopic, topicVersion = 0 }: Props) {
  const [symptoms, setSymptoms] = useState<string[]>(['Chest pain', 'Dyspnoea']);
  const [symptomInput, setSymptomInput] = useState('');
  const [caseDetails, setCaseDetails] = useState('');
  const [map, setMap] = useState<SymptomMechanismMap | null>(null);
  const [mapSource, setMapSource] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [section, setSection] = useState<SectionKey>('overview');

  const [images, setImages] = useState<MedicalImage[] | null>(null);
  const [imagesTopic, setImagesTopic] = useState<string>('');
  const [imagesLoading, setImagesLoading] = useState(false);

  const mapAbort = useRef<AbortController | null>(null);
  const imgAbort = useRef<AbortController | null>(null);

  const generate = useCallback(
    async (topic: string, syms: string[], details: string) => {
      if (!topic.trim()) return;
      mapAbort.current?.abort();
      const controller = new AbortController();
      mapAbort.current = controller;
      setLoading(true);
      setError(null);
      try {
        const body = await postJson<SymptomMechanismMap>(
          '/api/symptom-mechanism-map',
          { topic: topic.trim(), symptoms: syms.join(', '), case_details: details || undefined },
          { signal: controller.signal, timeoutMs: 120_000 },
        );
        setMap(body.data);
        setMapSource(body.source);
        onStatusChange(!isLiveSource(body.source));
      } catch (err) {
        if (!isAbortError(err)) setError((err as Error).message || 'Failed to build mechanism map');
      } finally {
        if (mapAbort.current === controller) setLoading(false);
      }
    },
    [onStatusChange],
  );

  // Load once on mount; later runs are explicit so typing a topic never floods the API.
  useEffect(() => {
    generate(activeTopic, symptoms, caseDetails);
    return () => {
      mapAbort.current?.abort();
      imgAbort.current?.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // A newly applied topic rebuilds the map; symptoms reset so the model picks that topic's cardinal features.
  useEffect(() => {
    if (topicVersion === 0) return;
    setSymptoms([]);
    setImagesTopic('');
    setImages(null);
    generate(activeTopic, [], '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicVersion]);

  // Images load lazily, only when the tab is opened (each one costs several live URL checks).
  useEffect(() => {
    if (section !== 'images' || !activeTopic.trim() || imagesTopic === activeTopic.trim()) return;
    imgAbort.current?.abort();
    const controller = new AbortController();
    imgAbort.current = controller;
    setImagesLoading(true);
    postJson<MedicalImage[]>('/api/medical-images', { topic: activeTopic.trim() }, { signal: controller.signal, timeoutMs: 30_000 })
      .then((body) => {
        setImages(Array.isArray(body.data) ? body.data : []);
        setImagesTopic(activeTopic.trim());
      })
      .catch((err) => {
        if (!isAbortError(err)) setImages([]);
      })
      .finally(() => {
        if (imgAbort.current === controller) setImagesLoading(false);
      });
  }, [section, activeTopic, imagesTopic]);

  const addSymptom = (raw: string) => {
    const s = raw.trim().slice(0, 80);
    if (!s || symptoms.some((x) => x.toLowerCase() === s.toLowerCase()) || symptoms.length >= 12) return;
    setSymptoms((prev) => [...prev, s]);
    setSymptomInput('');
  };

  const stale = map && map.topic && map.topic.toLowerCase() !== activeTopic.trim().toLowerCase();
  const isTemplate = useMemo(() => map?.diseaseOverview?.includes('OFFLINE TEMPLATE'), [map]);

  const body = (() => {
    if (!map) return null;
    switch (section) {
      case 'overview':
        return (
          <div className="space-y-3 text-[10px] leading-relaxed text-slate-300">
            <p className="whitespace-pre-line">{map.diseaseOverview}</p>
            <RecordCards rows={map.keySymptoms} titleKey="name" />
            {map.causeToSymptomFlow?.map((flow, i) => (
              <ol key={i} className="bg-slate-950 border border-slate-850 rounded-lg p-3 space-y-1 list-decimal list-inside font-mono text-[9px]">
                {Object.entries(flow).map(([k, v]) => (
                  <li key={k}><span className="text-slate-500">{humanize(k)}:</span> <span className="text-slate-300">{String(v)}</span></li>
                ))}
              </ol>
            ))}
            <p className="text-emerald-300/90 bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-3">{map.finalSummary}</p>
          </div>
        );
      case 'master': return <RecordCards rows={map.masterTable} />;
      case 'patho': return <RecordCards rows={map.pathophysiologicalAnalysis} />;
      case 'histo': return <RecordCards rows={map.histopathologicalAnalysis} />;
      case 'biochem': return <RecordCards rows={map.biochemicalAnalysis} />;
      case 'genetic': return <RecordCards rows={map.geneticAndMolecularAnalysis} />;
      case 'anatomy': return <RecordCards rows={map.anatomyPhysiologyCorrelation} />;
      case 'invest': return <RecordCards rows={map.investigationCorrelation} />;
      case 'ddx': return <RecordCards rows={map.differentialDiagnosisMapping} />;
      case 'therapy': return <RecordCards rows={map.therapeuticImplications} />;
      case 'exam': return <RecordCards rows={map.highYieldExamPoints} />;
      case 'images': {
        const list = [...(images || []), ...((imagesTopic ? [] : map.sourcesAndLinks) || [])];
        if (imagesLoading) return <p className="text-[10px] font-mono text-cyan-400 animate-pulse">VERIFYING SOURCE-LINKED IMAGES…</p>;
        if (!list.length) return <p className="text-[10px] font-mono text-slate-500">No verified open-licence images found for this topic.</p>;
        return <div className="space-y-3">{list.map((img, i) => <ImageCard key={img.imageUrl + i} img={img} />)}</div>;
      }
    }
  })();

  return (
    <div className="flex-1 flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl min-h-0">
      <div className="p-4 border-b border-slate-800 space-y-3 shrink-0">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-bold text-slate-200 uppercase font-mono tracking-wider">Symptom Mechanism Mapper</h3>
          {mapSource && (
            <span className={`ml-auto text-[8px] font-mono px-1.5 py-0.5 rounded border ${isLiveSource(mapSource) ? 'text-emerald-400 border-emerald-500/30' : 'text-amber-400 border-amber-500/30'}`}>
              {isLiveSource(mapSource) ? 'AI' : 'OFFLINE'}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5" aria-label="Selected symptoms">
          {symptoms.map((s) => (
            <span key={s} className="inline-flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[9px] font-mono px-2 py-0.5 rounded-full">
              {s}
              <button aria-label={`Remove ${s}`} onClick={() => setSymptoms((p) => p.filter((x) => x !== s))} className="hover:text-rose-400 cursor-pointer">
                <X className="w-2.5 h-2.5" />
              </button>
            </span>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            value={symptomInput}
            onChange={(e) => setSymptomInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addSymptom(symptomInput)}
            placeholder="Add symptom and press Enter"
            aria-label="Add symptom"
            className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-[10px] font-mono text-slate-200 focus:outline-none focus:border-emerald-500 placeholder:text-slate-600"
          />
        </div>
        <div className="flex flex-wrap gap-1">
          {SUGGESTED.filter((s) => !symptoms.includes(s)).slice(0, 6).map((s) => (
            <button key={s} onClick={() => addSymptom(s)} className="text-[8.5px] font-mono text-slate-500 hover:text-emerald-400 border border-slate-800 rounded px-1.5 py-0.5 cursor-pointer">
              + {s}
            </button>
          ))}
        </div>

        <textarea
          value={caseDetails}
          onChange={(e) => setCaseDetails(e.target.value.slice(0, 1000))}
          placeholder="Optional case details (age, history, findings)…"
          aria-label="Case details"
          rows={2}
          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-[10px] text-slate-200 focus:outline-none focus:border-emerald-500 placeholder:text-slate-600 resize-none"
        />

        <button
          onClick={() => generate(activeTopic, symptoms, caseDetails)}
          disabled={loading || !activeTopic.trim()}
          className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 text-[10px] font-mono font-bold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
        >
          {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
          {loading ? 'MAPPING MECHANISMS…' : `MAP "${activeTopic.trim().toUpperCase() || '…'}"`}
        </button>

        {stale && !loading && (
          <p className="text-[9px] font-mono text-amber-400 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Showing "{map!.topic}". Press MAP to rebuild for the new focus.
          </p>
        )}
        {error && <p className="text-[9px] font-mono text-rose-400 bg-rose-500/10 border border-rose-500/20 p-2 rounded">✗ {error}</p>}
      </div>

      {map && (
        <>
          <div className="flex gap-1 overflow-x-auto px-3 py-2 border-b border-slate-800 shrink-0" role="tablist">
            {SECTIONS.map((s) => (
              <button
                key={s.key}
                role="tab"
                aria-selected={section === s.key}
                onClick={() => setSection(s.key)}
                className={`shrink-0 px-2 py-1 rounded text-[9px] font-mono font-bold uppercase cursor-pointer flex items-center gap-1 ${
                  section === s.key ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' : 'text-slate-500 hover:text-slate-300 border border-transparent'
                }`}
              >
                {s.key === 'images' && <ImageIcon className="w-3 h-3" />}
                {s.label}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto p-4 min-h-0" role="tabpanel">
            {isTemplate && section !== 'images' && (
              <p className="mb-3 text-[9px] font-mono text-amber-400 bg-amber-500/5 border border-amber-500/20 p-2 rounded">
                Offline reasoning template. Topic-specific facts need an AI provider.
              </p>
            )}
            {body}
          </div>
        </>
      )}
      {!map && loading && <div className="p-8 text-center text-[10px] font-mono text-slate-500 animate-pulse">BUILDING MECHANISM MAP…</div>}
    </div>
  );
}
