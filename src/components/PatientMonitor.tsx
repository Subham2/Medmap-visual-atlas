import React, { memo, useEffect, useRef } from 'react';
import { Heart, Wind, Thermometer, Activity } from 'lucide-react';
import type { PatientVitals } from '../types';

interface Props {
  vitals: PatientVitals;
  title: string;
  patientName: string;
  isStElevation?: boolean;
}

type Level = 'ok' | 'warn' | 'crit';

// Adult alarm thresholds (typical bedside-monitor defaults).
function hrLevel(hr: number): Level {
  if (hr === 0 || hr < 40 || hr > 140) return 'crit';
  if (hr < 50 || hr > 110) return 'warn';
  return 'ok';
}
function spo2Level(s: number): Level {
  if (s < 88) return 'crit';
  if (s < 94) return 'warn';
  return 'ok';
}
function tempLevel(t: number): Level {
  if (t < 35 || t >= 39.5) return 'crit';
  if (t < 36 || t >= 38) return 'warn';
  return 'ok';
}
function bpLevel(bp: string): Level {
  const [sys, dia] = bp.split('/').map((n) => parseInt(n, 10));
  if (!Number.isFinite(sys)) return 'warn';
  if (sys < 90 || sys >= 180 || dia >= 120) return 'crit';
  if (sys < 100 || sys >= 140 || dia >= 90) return 'warn';
  return 'ok';
}

function meanArterialPressure(bp: string): number | null {
  const [sys, dia] = bp.split('/').map((n) => parseInt(n, 10));
  if (!Number.isFinite(sys) || !Number.isFinite(dia)) return null;
  return Math.round(dia + (sys - dia) / 3);
}

const LEVEL_CLASS: Record<Level, string> = {
  ok: 'text-emerald-400',
  warn: 'text-amber-400',
  crit: 'text-rose-400 animate-pulse',
};

/**
 * Synthetic lead-II waveform. Phase t ∈ [0,1) spans one R–R interval.
 * Gaussian bumps model P, QRS and T; stElevation lifts the ST segment
 * (J-point to T) to mimic a transmural injury current.
 */
function ecgSample(t: number, stElevation: boolean): number {
  const g = (mu: number, sigma: number, amp: number) => amp * Math.exp(-((t - mu) ** 2) / (2 * sigma ** 2));
  let v =
    g(0.18, 0.025, 0.12) + // P
    g(0.285, 0.008, -0.12) + // Q
    g(0.3, 0.011, 1.0) + // R
    g(0.318, 0.009, -0.22) + // S
    g(0.5, 0.045, stElevation ? 0.42 : 0.25); // T
  if (stElevation && t > 0.33 && t < 0.5) v += 0.22;
  return v;
}

function PatientMonitor({ vitals, title, patientName, isStElevation = false }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Keep the latest props in refs so the animation loop never restarts on a vitals change.
  const hrRef = useRef(vitals.hr);
  const stRef = useRef(isStElevation);
  hrRef.current = vitals.hr;
  stRef.current = isStElevation;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let x = 0;
    let phase = 0;
    let lastY: number | null = null;
    let lastTs = performance.now();
    const SWEEP_PX_PER_S = 120;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, rect.width, rect.height);
      x = 0;
      lastY = null;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const drawStatic = () => {
      const { width, height } = canvas.getBoundingClientRect();
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, width, height);
      ctx.strokeStyle = '#34d399';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let px = 0; px < width; px++) {
        const t = (px / 140) % 1;
        const y = height * 0.62 - ecgSample(t, stRef.current) * height * 0.45;
        px === 0 ? ctx.moveTo(px, y) : ctx.lineTo(px, y);
      }
      ctx.stroke();
    };

    const frame = (ts: number) => {
      const dt = Math.min(0.05, (ts - lastTs) / 1000);
      lastTs = ts;
      const { width, height } = canvas.getBoundingClientRect();
      const hr = hrRef.current;
      const steps = Math.max(1, Math.round(SWEEP_PX_PER_S * dt));

      for (let i = 0; i < steps; i++) {
        // Erase a narrow band ahead of the pen (classic sweep monitor).
        ctx.fillStyle = '#020617';
        ctx.fillRect(x, 0, 8, height);

        const beatsPerPx = hr > 0 ? hr / 60 / SWEEP_PX_PER_S : 0;
        phase = (phase + beatsPerPx) % 1;
        const amplitude = hr > 0 ? ecgSample(phase, stRef.current) : 0;
        const y = height * 0.62 - amplitude * height * 0.45;

        ctx.strokeStyle = hr === 0 ? '#f43f5e' : '#34d399';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x - 1, lastY ?? y);
        ctx.lineTo(x, y);
        ctx.stroke();

        lastY = y;
        x += 1;
        if (x >= width) {
          x = 0;
          lastY = null;
        }
      }
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      lastTs = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const onVisibility = () => (document.hidden ? cancelAnimationFrame(raf) : start());

    if (reduceMotion) {
      drawStatic();
    } else {
      start();
      document.addEventListener('visibilitychange', onVisibility);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  const map = meanArterialPressure(vitals.bp);
  const hrL = hrLevel(vitals.hr);
  const spL = spo2Level(vitals.spo2);
  const bpL = bpLevel(vitals.bp);
  const tL = tempLevel(vitals.temp);
  const anyCritical = [hrL, spL, bpL, tL].includes('crit');

  return (
    <div
      className={`bg-slate-950 border rounded-xl overflow-hidden shadow-inner ${anyCritical ? 'border-rose-500/40' : 'border-slate-800'}`}
      role="region"
      aria-label={`Patient monitor for ${patientName}`}
    >
      <div className="flex justify-between items-center px-4 py-2 border-b border-slate-850 bg-slate-900/60">
        <div className="flex items-center gap-2 text-[10px] font-mono">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-slate-300 font-bold">BED {title}</span>
          <span className="text-slate-500 truncate max-w-[220px]">{patientName}</span>
        </div>
        <div className="flex items-center gap-2 text-[9px] font-mono">
          {isStElevation && (
            <span className="px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-400 border border-rose-500/30">ST↑ PATTERN</span>
          )}
          <span className={anyCritical ? 'text-rose-400 font-bold' : 'text-slate-500'}>
            {anyCritical ? 'ALARM' : 'LEAD II'}
          </span>
        </div>
      </div>

      <canvas ref={canvasRef} className="w-full h-24 block" aria-hidden="true" />

      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-850 border-t border-slate-850 font-mono" aria-live="polite">
        <div className="p-3">
          <div className="flex items-center gap-1 text-[9px] text-slate-500"><Heart className="w-3 h-3" /> HR bpm</div>
          <div className={`text-2xl font-bold ${LEVEL_CLASS[hrL]}`}>{vitals.hr}</div>
        </div>
        <div className="p-3">
          <div className="text-[9px] text-slate-500">NIBP mmHg</div>
          <div className={`text-2xl font-bold ${LEVEL_CLASS[bpL]}`}>{vitals.bp}</div>
          {map !== null && <div className="text-[9px] text-slate-500">MAP {map}</div>}
        </div>
        <div className="p-3">
          <div className="flex items-center gap-1 text-[9px] text-slate-500"><Wind className="w-3 h-3" /> SpO₂ %</div>
          <div className={`text-2xl font-bold ${LEVEL_CLASS[spL]}`}>{vitals.spo2}</div>
        </div>
        <div className="p-3">
          <div className="flex items-center gap-1 text-[9px] text-slate-500"><Thermometer className="w-3 h-3" /> TEMP °C</div>
          <div className={`text-2xl font-bold ${LEVEL_CLASS[tL]}`}>{vitals.temp.toFixed(1)}</div>
        </div>
      </div>
    </div>
  );
}

export default memo(PatientMonitor);
