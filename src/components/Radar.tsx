import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

type Field = { lines: string[]; pct: number; blurb: string };

type Props = {
  fields: Field[];
  legend: string;
  hoverHint: string;
};

const CX = 430;
const CY = 350;
const CORE = 86;

export default function Radar({ fields, legend, hoverHint }: Props) {
  const [active, setActive] = useState<number>(-1);
  const activeRef = useRef(active);
  activeRef.current = active;

  const lineRefs = useRef<(SVGLineElement | null)[]>([]);
  const hitRefs = useRef<(SVGLineElement | null)[]>([]);
  const dotRefs = useRef<(SVGCircleElement | null)[]>([]);
  const photonRefs = useRef<(SVGCircleElement | null)[]>([]);
  const labelRefs = useRef<(SVGGElement | null)[]>([]);

  const N = fields.length;
  const angleFor = (i: number) => ((-90 + i * (360 / N)) * Math.PI) / 180;
  const lenFor = (pct: number) => 70 + pct * 1.05;

  useEffect(() => {
    let raf = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = (now - start) / 1000;

      fields.forEach((f, i) => {
        const th = angleFor(i);
        const cos = Math.cos(th);
        const sin = Math.sin(th);

        const base = lenFor(f.pct);
        const freq = 0.2 + (f.pct / 100) * 0.45; // Hz — derived from the field's weight
        const amp = 4 + (f.pct / 100) * 7;
        const wobble = 1 + 0.015 * Math.sin(t * 0.3 + i);
        const L = base * wobble + Math.sin(2 * Math.PI * freq * t + i * 1.7) * amp;

        const ex = CX + cos * (CORE + L);
        const ey = CY + sin * (CORE + L);

        const line = lineRefs.current[i];
        if (line) {
          line.setAttribute('x2', ex.toFixed(2));
          line.setAttribute('y2', ey.toFixed(2));
        }
        const hit = hitRefs.current[i];
        if (hit) {
          hit.setAttribute('x2', ex.toFixed(2));
          hit.setAttribute('y2', ey.toFixed(2));
        }
        const dot = dotRefs.current[i];
        if (dot) {
          dot.setAttribute('cx', ex.toFixed(2));
          dot.setAttribute('cy', ey.toFixed(2));
        }

        const lab = labelRefs.current[i];
        if (lab) {
          const side = Math.abs(cos) > 0.3;
          const lx = side ? ex + (cos > 0 ? 15 : -15) : ex;
          const ly = side ? ey - 6 : ey + (sin < 0 ? -44 : 14);
          lab.setAttribute('transform', `translate(${lx.toFixed(2)} ${ly.toFixed(2)})`);
        }

        const ph = photonRefs.current[i];
        if (ph) {
          const speed = 0.1 + (f.pct / 100) * 0.22;
          const frac = (t * speed + i * 0.37) % 1;
          const px = CX + cos * (CORE + L * frac);
          const py = CY + sin * (CORE + L * frac);
          const dim = activeRef.current === -1 || activeRef.current === i;
          ph.setAttribute('cx', px.toFixed(2));
          ph.setAttribute('cy', py.toFixed(2));
          ph.setAttribute('opacity', (Math.sin(Math.PI * frac) * (dim ? 0.95 : 0.12)).toFixed(3));
        }
      });

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields]);

  const anchorFor = (i: number) => {
    const cos = Math.cos(angleFor(i));
    return Math.abs(cos) > 0.3 ? (cos > 0 ? 'start' : 'end') : 'middle';
  };

  return (
    <div className="grid items-center gap-10 lg:grid-cols-[1.35fr_1fr]">
      {/* ── Radial chart ─────────────────────────────────────────── */}
      <div className="relative">
        <svg viewBox="0 0 860 700" className="w-full select-none" role="img" aria-label="Application spectrum">
          <defs>
            <radialGradient id="coreGrad" cx="34%" cy="28%" r="82%">
              <stop offset="0%" stopColor="#aab9ff" />
              <stop offset="22%" stopColor="#5b74e0" />
              <stop offset="48%" stopColor="#3046aa" />
              <stop offset="74%" stopColor="#141f5e" />
              <stop offset="100%" stopColor="#070a1e" />
            </radialGradient>
            <radialGradient id="hiGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.5)" />
              <stop offset="45%" stopColor="rgba(255,255,255,0.14)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </radialGradient>
            <linearGradient id="shadeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="55%" stopColor="rgba(8,4,22,0)" />
              <stop offset="100%" stopColor="rgba(74,20,96,0.55)" />
            </linearGradient>
            <linearGradient id="coreText" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#eaf0ff" />
              <stop offset="100%" stopColor="#c084d8" />
            </linearGradient>
            <filter id="softGlow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="3.2" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* decorative rings */}
          <circle cx={CX} cy={CY} r={298} fill="none" stroke="rgba(126,160,255,0.16)" strokeWidth="1" strokeDasharray="2 8" style={{ transformOrigin: '430px 350px' }} className="animate-spin-slower" />
          <circle cx={CX} cy={CY} r={212} fill="none" stroke="rgba(192,132,216,0.14)" strokeWidth="1" strokeDasharray="1 10" style={{ transformOrigin: '430px 350px' }} className="animate-spin-slowest" />
          <circle cx={CX} cy={CY} r={150} fill="none" stroke="rgba(126,160,255,0.07)" strokeWidth="1" />

          {/* branches */}
          {fields.map((f, i) => {
            const th = angleFor(i);
            const sx = CX + Math.cos(th) * (CORE - 6);
            const sy = CY + Math.sin(th) * (CORE - 6);
            const isActive = active === i;
            const dimmed = active !== -1 && !isActive;
            return (
              <g key={i}>
                <line
                  ref={(el) => {
                    lineRefs.current[i] = el;
                  }}
                  x1={sx}
                  y1={sy}
                  x2={CX}
                  y2={CY}
                  stroke={isActive ? '#b9ccff' : 'rgba(110,132,230,0.5)'}
                  strokeWidth={isActive ? 2.2 : 1.3}
                  strokeLinecap="round"
                  style={{ transition: 'stroke .35s, stroke-width .35s, opacity .35s', opacity: dimmed ? 0.25 : 1 }}
                />
                <line
                  ref={(el) => {
                    hitRefs.current[i] = el;
                  }}
                  x1={sx}
                  y1={sy}
                  x2={CX}
                  y2={CY}
                  stroke="transparent"
                  strokeWidth={26}
                  strokeLinecap="round"
                  className="cursor-pointer"
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(-1)}
                />
                <circle
                  ref={(el) => {
                    dotRefs.current[i] = el;
                  }}
                  r={isActive ? 6 : 4}
                  cx={CX}
                  cy={CY}
                  fill={isActive ? '#eaf0ff' : '#5468d4'}
                  stroke={isActive ? '#c084d8' : 'rgba(234,240,255,0.35)'}
                  strokeWidth={1.4}
                  filter="url(#softGlow)"
                  className="cursor-pointer"
                  style={{ transition: 'fill .35s, r .35s, opacity .35s', opacity: dimmed ? 0.3 : 1 }}
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(-1)}
                />
                <circle
                  ref={(el) => {
                    photonRefs.current[i] = el;
                  }}
                  r={2.2}
                  cx={CX}
                  cy={CY}
                  fill="#dfe8ff"
                  filter="url(#softGlow)"
                  opacity={0}
                />
                <g
                  ref={(el) => {
                    labelRefs.current[i] = el;
                  }}
                  className="pointer-events-none hidden md:block"
                  style={{ transition: 'opacity .35s', opacity: dimmed ? 0.25 : 0.95 }}
                >
                  {f.lines.map((ln, li) => (
                    <text
                      key={li}
                      y={li * 15}
                      textAnchor={anchorFor(i)}
                      fontSize={13}
                      fontWeight={isActive ? 600 : 400}
                      fill={isActive ? '#ffffff' : '#c6d2f5'}
                      style={{ fontFamily: 'Space Grotesk, Inter, sans-serif' }}
                    >
                      {ln}
                    </text>
                  ))}
                  <text
                    y={f.lines.length * 15 + 1}
                    textAnchor={anchorFor(i)}
                    fontSize={11}
                    fill={isActive ? '#c084d8' : '#7ea0ff'}
                    style={{ fontFamily: 'JetBrains Mono, monospace' }}
                  >
                    {f.pct}
                  </text>
                </g>
              </g>
            );
          })}

          {/* core sphere */}
          <circle cx={CX} cy={CY} r={CORE} fill="none" stroke="rgba(126,160,255,0.5)" strokeWidth="1" style={{ transformOrigin: '430px 350px' }} className="animate-pulse-ring" />
          <circle cx={CX} cy={CY} r={CORE} fill="url(#coreGrad)" />
          <ellipse cx={CX - 26} cy={CY - 34} rx={34} ry={19} fill="url(#hiGrad)" />
          <circle cx={CX} cy={CY} r={CORE} fill="url(#shadeGrad)" />
          <circle
            cx={CX}
            cy={CY}
            r={CORE - 2}
            fill="none"
            stroke="rgba(190,205,255,0.55)"
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeDasharray="110 700"
            style={{ transformOrigin: '430px 350px' }}
            className="animate-spin-slower"
          />
          <circle cx={CX} cy={CY} r={CORE} fill="none" stroke="rgba(158,185,255,0.35)" strokeWidth="1" />
          <text
            x={CX}
            y={CY + 8}
            textAnchor="middle"
            fontSize={38}
            fontWeight={700}
            fill="url(#coreText)"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            PC
          </text>
          <text
            x={CX}
            y={CY + 30}
            textAnchor="middle"
            fontSize={9.5}
            letterSpacing={3}
            fill="rgba(201,214,255,0.8)"
            style={{ fontFamily: 'JetBrains Mono, monospace' }}
          >
            CATALYTICA
          </text>
        </svg>
      </div>

      {/* ── Ranked list + blurb ──────────────────────────────────── */}
      <div>
        <div className="flex flex-col gap-1.5">
          {fields.map((f, i) => {
            const isActive = active === i;
            return (
              <button
                key={i}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(-1)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(-1)}
                className={cn(
                  'group grid grid-cols-[2rem_1fr_3.2rem] items-center gap-3 rounded-xl border px-4 py-2.5 text-left transition-all duration-300',
                  isActive ? 'border-sky/35 bg-neon/15' : 'border-white/5 bg-white/[0.02] hover:border-white/10',
                )}
              >
                <span className={cn('font-mono text-xs', isActive ? 'text-orchid' : 'text-slate-500')}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="min-w-0">
                  <span className={cn('block truncate text-sm transition-colors', isActive ? 'text-white' : 'text-slate-300')}>
                    {f.lines.join(' ')}
                  </span>
                  <span className="mt-1.5 block h-[3px] overflow-hidden rounded-full bg-white/5">
                    <motion.span
                      className="block h-full rounded-full bg-gradient-to-r from-neon via-sky to-orchid"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${f.pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </span>
                </span>
                <span className={cn('text-right font-mono text-xs', isActive ? 'text-white' : 'text-slate-400')}>{f.pct}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-6 min-h-[96px] rounded-2xl border border-white/5 bg-white/[0.02] p-5">
          {active >= 0 ? (
            <motion.p
              key={active}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="text-sm leading-relaxed text-slate-300"
            >
              <span className="mr-2 font-mono text-xs text-orchid">{fields[active].pct}</span>
              {fields[active].blurb}
            </motion.p>
          ) : (
            <p className="text-sm leading-relaxed text-slate-400">
              {legend}
              <span className="mt-2 block font-mono text-[11px] tracking-wider text-slate-500">{hoverHint}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
