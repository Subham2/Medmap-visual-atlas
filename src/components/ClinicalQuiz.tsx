import React, { useCallback, useEffect, useRef, useState } from 'react';
import { HelpCircle, RefreshCw, CheckCircle2, XCircle, Lightbulb, Trophy } from 'lucide-react';
import { postJson, isAbortError, isLiveSource } from '../lib/api';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  pearl?: string;
}

/** Normalise AI output: keep only well-formed questions whose answer is one of the options. */
function sanitize(raw: unknown): QuizQuestion[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((q: any, i) => ({
      id: String(q?.id ?? `q${i + 1}`),
      question: String(q?.question ?? ''),
      options: Array.isArray(q?.options) ? q.options.map(String).slice(0, 6) : [],
      correctAnswer: String(q?.correctAnswer ?? q?.answer ?? ''),
      explanation: String(q?.explanation ?? ''),
      pearl: q?.pearl ? String(q.pearl) : undefined,
    }))
    .filter((q) => q.question && q.options.length >= 2 && q.options.includes(q.correctAnswer));
}

export default function ClinicalQuiz({ activeTopic }: { activeTopic: string }) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [quizTopic, setQuizTopic] = useState('');
  const [source, setSource] = useState('');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const load = useCallback(async (topic: string) => {
    if (!topic.trim()) return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    setError(null);
    try {
      const body = await postJson<unknown>('/api/clinical-quiz', { topic: topic.trim() }, { signal: controller.signal, timeoutMs: 90_000 });
      const qs = sanitize(body.data);
      if (!qs.length) throw new Error('No valid questions were returned');
      setQuestions(qs);
      setQuizTopic(topic.trim());
      setSource(body.source);
      setAnswers({});
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

  const answered = Object.keys(answers).length;
  const correct = questions.filter((q) => answers[q.id] === q.correctAnswer).length;
  const done = questions.length > 0 && answered === questions.length;
  const topicChanged = quizTopic && quizTopic.toLowerCase() !== activeTopic.trim().toLowerCase();

  return (
    <div className="h-full flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      <div className="p-4 border-b border-slate-800 flex flex-wrap items-center gap-3 shrink-0">
        <HelpCircle className="w-4 h-4 text-cyan-400" />
        <div>
          <h3 className="text-xs font-bold text-slate-200 uppercase font-mono tracking-wider">Board-Style Clinical Vignettes</h3>
          <p className="text-[9px] text-slate-500">
            {quizTopic || activeTopic} · {source ? (isLiveSource(source) ? 'AI-generated' : 'offline set') : '…'}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {questions.length > 0 && (
            <span className="text-[10px] font-mono text-slate-300 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1" aria-live="polite">
              SCORE {correct}/{answered} · {questions.length} Q
            </span>
          )}
          <button
            onClick={() => load(activeTopic)}
            disabled={loading}
            className={`text-[9px] font-mono font-bold px-2.5 py-1 rounded-lg border cursor-pointer flex items-center gap-1 ${
              topicChanged ? 'border-amber-500/50 text-amber-300 bg-amber-500/10' : 'border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} /> {topicChanged ? 'NEW FOCUS QUIZ' : 'NEW SET'}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {loading && questions.length === 0 && <p className="text-[10px] font-mono text-slate-500 animate-pulse">WRITING VIGNETTES…</p>}
        {error && <p className="text-[9px] font-mono text-rose-400 bg-rose-500/10 border border-rose-500/20 p-2 rounded">✗ {error}</p>}

        {done && (
          <div className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-500/5 flex items-center gap-3">
            <Trophy className="w-5 h-5 text-cyan-300" />
            <div className="text-[10px] text-slate-300">
              <strong className="text-cyan-300 font-mono">{Math.round((correct / questions.length) * 100)}%</strong> correct.
              {correct === questions.length ? ' Excellent command of this topic.' : ' Review the explanations below, then generate a new set.'}
            </div>
          </div>
        )}

        {questions.map((q, idx) => {
          const chosen = answers[q.id];
          return (
            <article key={q.id} className="bg-slate-950 border border-slate-850 rounded-xl p-4 space-y-3">
              <p className="text-[11px] text-slate-200 leading-relaxed font-semibold">{idx + 1}. {q.question}</p>
              <div className="grid grid-cols-1 gap-1.5" role="radiogroup" aria-label={`Question ${idx + 1} options`}>
                {q.options.map((opt, oi) => {
                  const isChosen = chosen === opt;
                  const isCorrect = opt === q.correctAnswer;
                  const style = chosen
                    ? isCorrect
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200'
                      : isChosen
                        ? 'bg-rose-500/20 border-rose-500/50 text-rose-200'
                        : 'bg-slate-950 border-slate-900 text-slate-500'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-cyan-500/40 cursor-pointer';
                  return (
                    <button
                      key={oi}
                      role="radio"
                      aria-checked={isChosen}
                      disabled={!!chosen}
                      onClick={() => setAnswers((p) => ({ ...p, [q.id]: opt }))}
                      className={`text-left text-[10px] p-2.5 rounded-lg border leading-relaxed transition-all flex gap-2 ${style}`}
                    >
                      <span className="font-mono font-bold">{String.fromCharCode(65 + oi)}.</span>
                      <span className="flex-1">{opt}</span>
                      {chosen && isCorrect && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                      {chosen && isChosen && !isCorrect && <XCircle className="w-3.5 h-3.5 shrink-0" />}
                    </button>
                  );
                })}
              </div>
              {chosen && (
                <div className="space-y-2 animate-fade-in">
                  <p className="text-[10px] text-slate-400 leading-relaxed bg-slate-900/60 border border-slate-850 rounded-lg p-2.5">{q.explanation}</p>
                  {q.pearl && (
                    <p className="text-[10px] text-amber-200/90 bg-amber-500/5 border border-amber-500/20 rounded-lg p-2.5 flex gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5 shrink-0 text-amber-400" /> {q.pearl}
                    </p>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
