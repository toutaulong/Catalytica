import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  BrainCircuit,
  ChevronDown,
  Database,
  Download,
  FileBadge,
  FlaskConical,
  Flame,
  Gauge,
  Globe,
  LayoutDashboard,
  ScanText,
  Sparkles,
  TrendingUp,
  Zap,
} from 'lucide-react';
import type { Dict, Page } from '../i18n';
import { cn } from '../utils/cn';
import Radar from './Radar';

const EASE = [0.22, 1, 0.36, 1] as const;

function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 0.75, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="mb-5 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-sky/80">
      <span className="h-px w-8 bg-gradient-to-r from-sky to-transparent" />
      {children}
    </div>
  );
}

const SECTION = 'relative mx-auto max-w-6xl scroll-mt-28 px-5 py-20 md:px-8 md:py-28';
const WATERMARK =
  'pointer-events-none absolute right-0 top-6 select-none font-display text-[9rem] leading-none text-white/[0.025] md:text-[13rem]';

export default function HomePage({ t, go }: { t: Dict; go: (p: Page) => void }) {
  const scrollToHow = () => document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' });

  const productIcons = [Zap, Flame, Activity];
  const resultIcons = [Database, Gauge, FileBadge, Globe];
  const stepIcons = [ScanText, BrainCircuit, LayoutDashboard];

  return (
    <>
      {/* ══════════════ HERO ══════════════ */}
      <section className="relative mx-auto max-w-7xl px-5 pb-14 pt-32 md:px-8 lg:pt-40">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky/20 bg-neon/10 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.22em] text-sky"
            >
              <Sparkles size={13} />
              {t.hero.eyebrow}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.08, ease: EASE }}
              className="font-display text-[clamp(2.7rem,6.4vw,5.3rem)] font-bold leading-[1.02] tracking-tight"
            >
              {t.hero.titleA}
              <br />
              <span className="text-gradient">{t.hero.titleB}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.16, ease: EASE }}
              className="mt-6 max-w-xl text-base leading-relaxed text-slate-400 md:text-lg"
            >
              {t.hero.sub}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.24, ease: EASE }}
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <button
                onClick={() => go('beta')}
                className="btn-glow inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-abyss via-neon to-plum px-7 py-3.5 font-display text-sm font-semibold tracking-wide text-white"
              >
                <Download size={16} />
                {t.hero.ctaPrimary}
              </button>
              <button
                onClick={scrollToHow}
                className="rounded-full border border-white/15 px-7 py-3.5 font-display text-sm font-semibold text-slate-200 transition-all duration-300 hover:border-sky/50 hover:bg-white/5"
              >
                {t.hero.ctaSecondary}
              </button>
              <button
                onClick={() => go('research')}
                className="group inline-flex items-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-sky"
              >
                {t.hero.ctaTertiary}
                <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="mt-14 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-white/10 pt-8 sm:grid-cols-4"
            >
              {t.hero.stats.map((s, i) => (
                <div key={i}>
                  <div className="text-gradient-soft font-display text-2xl font-bold md:text-[1.7rem]">{s.v}</div>
                  <div className="mt-1.5 text-[11px] leading-snug text-slate-500">{s.l}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Hero visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.15, ease: EASE }}
            className="relative mx-auto w-full max-w-[30rem] lg:max-w-none"
          >
            <div className="absolute -inset-10 rounded-full border border-dashed border-sky/10 animate-spin-slower" />
            <div className="absolute -inset-24 hidden rounded-full border border-white/[0.04] lg:block" />

            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 shadow-[0_40px_120px_-40px_rgba(48,70,170,0.65)]">
              <img
  src="hero-art.jpg"
  alt="Photochemical molecular lattice"
  loading="lazy"
  className="aspect-[4/5] w-full object-cover md:aspect-square"
  onError={(e) => {
    (e.currentTarget.parentElement as HTMLElement).style.display = 'none';
  }}
/>
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-ink/20" />
              <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-ink/50 px-3 py-1 font-mono text-[10px] tracking-[0.25em] text-ice backdrop-blur">
                CATALYTICA · PC
              </div>
            </div>

            {/* floating prediction chips */}
            <div className="glass-strong animate-float absolute -right-3 top-10 rounded-2xl px-4 py-3 md:-right-8">
              <div className="font-mono text-[10px] uppercase tracking-widest text-slate-400">#1 ranked</div>
              <div className="mt-1 font-mono text-xs text-ice">
                fac-Ir(ppy)₃ · 450 nm
              </div>
              <div className="mt-1.5 flex items-center gap-2">
                <span className="h-1 w-20 overflow-hidden rounded-full bg-white/10">
                  <motion.span
                    className="block h-full rounded-full bg-gradient-to-r from-sky to-orchid"
                    initial={{ width: 0 }}
                    animate={{ width: '87%' }}
                    transition={{ duration: 1.4, delay: 0.9, ease: EASE }}
                  />
                </span>
                <span className="font-mono text-[11px] text-orchid">0.87</span>
              </div>
            </div>

            <div className="glass-strong animate-float-late absolute -left-3 bottom-12 rounded-2xl px-4 py-3 md:-left-8">
              <div className="font-mono text-[10px] uppercase tracking-widest text-slate-400">conditions</div>
              <div className="mt-1 font-mono text-xs text-ice">MeCN · 25 °C · 24 h</div>
            </div>
          </motion.div>
        </div>

        <div className="mt-16 flex justify-center lg:mt-8">
          <motion.button
            onClick={scrollToHow}
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-slate-500 transition-colors hover:border-sky/40 hover:text-sky"
            aria-label="Scroll"
          >
            <ChevronDown size={17} />
          </motion.button>
        </div>
      </section>

      {/* ══════════════ MARQUEE ══════════════ */}
      <div className="relative overflow-hidden border-y border-white/5 bg-white/[0.015] py-3.5">
        <div className="animate-marquee flex w-max gap-10 whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.3em] text-slate-500">
          {[0, 1].map((rep) => (
            <div key={rep} className="flex gap-10">
              {['photocatalysis', 'visible light', 'photoredox', 'machine learning', 'ranked conditions', 'expected yields', 'hν-driven', 'catalytica pc'].map(
                (w) => (
                  <span key={w} className="flex items-center gap-10">
                    {w}
                    <span className="text-plum">✦</span>
                  </span>
                ),
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════ 01 ABSTRACT ══════════════ */}
      <section id="abstract" className={SECTION}>
        <span className={WATERMARK}>01</span>
        <Reveal>
          <Eyebrow>{t.abstract.eyebrow}</Eyebrow>
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
            <h2 className="font-display text-3xl font-bold leading-tight tracking-tight md:text-5xl">{t.abstract.heading}</h2>
            <p className="text-base leading-relaxed text-slate-400 md:text-lg">{t.abstract.body}</p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {t.abstract.products.map((p, i) => {
            const Icon = productIcons[i];
            const live = i === 0;
            return (
              <Reveal key={p.name} delay={i * 0.1}>
                <div
                  className={cn(
                    'card-lift relative h-full overflow-hidden rounded-3xl border p-7',
                    live ? 'glass-strong border-sky/25' : 'border-white/8 bg-white/[0.02] opacity-70',
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        'grid h-11 w-11 place-items-center rounded-2xl',
                        live ? 'bg-gradient-to-br from-neon to-plum text-white' : 'bg-white/5 text-slate-400',
                      )}
                    >
                      <Icon size={19} />
                    </span>
                    <span
                      className={cn(
                        'rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest',
                        live ? 'bg-sky/15 text-sky' : 'bg-white/5 text-slate-500',
                      )}
                    >
                      {live ? t.abstract.live : t.abstract.soon}
                    </span>
                  </div>
                  <h3 className="mt-6 font-display text-xl font-semibold">{p.name}</h3>
                  <div className="mt-1 font-mono text-[11px] uppercase tracking-widest text-slate-500">{p.sub}</div>
                  <p className="mt-4 text-sm leading-relaxed text-slate-400">{p.body}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ══════════════ 02 PURPOSE ══════════════ */}
      <section id="purpose" className={SECTION}>
        <span className={WATERMARK}>02</span>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          <Reveal>
            <Eyebrow>{t.purpose.eyebrow}</Eyebrow>
            <h2 className="font-display text-3xl font-bold leading-tight tracking-tight md:text-5xl">{t.purpose.heading}</h2>
            <p className="mt-6 text-base leading-relaxed text-slate-400 md:text-lg">{t.purpose.body}</p>

            <div className="mt-10">
              <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-slate-500">{t.purpose.outputsLabel}</div>
              <div className="mt-4 flex flex-wrap gap-3">
                {t.purpose.outputs.map((o, i) => (
                  <span
                    key={o}
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-neon/30 to-plum/30 px-5 py-2.5 font-display text-sm font-medium text-ice ring-1 ring-sky/20"
                  >
                    {i === 0 ? <FlaskConical size={15} className="text-sky" /> : <TrendingUp size={15} className="text-orchid" />}
                    {o}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          <div>
            <Reveal delay={0.1}>
              <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-slate-500">{t.purpose.inputsLabel}</div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {t.purpose.params.map((p, i) => (
                  <div
                    key={p.label}
                    className={cn('card-lift glass rounded-2xl p-5', i === t.purpose.params.length - 1 && 'sm:col-span-2')}
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-gradient font-display text-2xl font-bold">{p.k}</span>
                      {p.ex && <span className="font-mono text-[10px] text-slate-500">{p.ex}</span>}
                    </div>
                    <div className="mt-2 text-sm font-medium text-slate-200">{p.label}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══════════════ 03 NOVELTY ══════════════ */}
      <section id="novelty" className={cn(SECTION, 'text-center')}>
        <span className={WATERMARK}>03</span>
        <Reveal>
          <Eyebrow>{t.novelty.eyebrow}</Eyebrow>
          <h2 className="font-display text-3xl font-bold tracking-tight md:text-5xl">{t.novelty.heading}</h2>
        </Reveal>
        <div className="mx-auto mt-16 flex max-w-4xl flex-col gap-12 md:gap-16">
          {t.novelty.statements.map((s, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div
                className={cn(
                  'flex flex-wrap items-baseline justify-center gap-x-4 gap-y-2 font-display',
                  i % 2 === 1 && 'lg:flex-row-reverse',
                )}
              >
                <span className="text-xl text-slate-500 md:text-2xl">{s.no}</span>
                <span className="text-gradient text-3xl font-bold leading-tight md:text-5xl">{s.yes}</span>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.2}>
          <p className="mx-auto mt-20 max-w-2xl text-lg leading-relaxed text-slate-400">
            <span className="text-orchid">“</span>
            {t.novelty.closing}
            <span className="text-orchid">”</span>
          </p>
        </Reveal>
      </section>

      {/* ══════════════ 04 HOW IT WORKS ══════════════ */}
      <section id="how" className={SECTION}>
        <span className={WATERMARK}>04</span>
        <Reveal>
          <Eyebrow>{t.how.eyebrow}</Eyebrow>
          <h2 className="max-w-3xl font-display text-3xl font-bold leading-tight tracking-tight md:text-5xl">{t.how.heading}</h2>
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-slate-400 md:text-lg">{t.how.sub}</p>
        </Reveal>

        <div className="relative mt-14 grid gap-5 md:grid-cols-3">
          <div className="hairline absolute left-0 right-0 top-14 hidden md:block" />
          {t.how.steps.map((s, i) => {
            const Icon = stepIcons[i];
            return (
              <Reveal key={s.k} delay={i * 0.12}>
                <div className="card-lift relative h-full rounded-3xl border border-white/8 bg-ink/60 p-7 backdrop-blur">
                  <div className="flex items-center justify-between">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-neon to-plum text-white shadow-[0_10px_30px_-10px_rgba(48,70,170,0.8)]">
                      <Icon size={20} />
                    </span>
                    <span className="font-mono text-sm text-slate-600">{s.k}</span>
                  </div>
                  <h3 className="mt-6 font-display text-lg font-semibold">{s.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-400">{s.body}</p>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* prediction mock */}
        <Reveal delay={0.15} className="mt-14">
          <div className="noise relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent">
            <div className="flex items-center gap-2 border-b border-white/8 px-5 py-3.5">
              <span className="h-2.5 w-2.5 rounded-full bg-plum" />
              <span className="h-2.5 w-2.5 rounded-full bg-neon" />
              <span className="h-2.5 w-2.5 rounded-full bg-sky/70" />
              <span className="ml-3 font-mono text-[11px] tracking-widest text-slate-500">{t.how.mockTitle}</span>
            </div>
            <div className="p-5 md:p-7">
              <div className="inline-flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl border border-sky/20 bg-neon/10 px-4 py-2.5 font-mono text-xs text-ice md:text-sm">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-sky" />
                <span>{t.how.mockSubstrate}</span>
                <span className="inline-flex flex-col items-center leading-none text-slate-400">
                  <span className="text-[9px] font-semibold tracking-wide text-sky">hν</span>
                  <ArrowRight size={13} className="mt-0.5" />
                </span>
                <span className="text-orchid">?</span>
              </div>

              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[640px] border-collapse font-mono text-xs md:text-sm">
                  <thead>
                    <tr className="text-left text-[10px] uppercase tracking-[0.2em] text-slate-600">
                      {t.how.cols.map((c, i) => (
                        <th key={c} className={cn('pb-3 pr-4 font-medium', i === t.how.cols.length - 1 && 'w-[32%]')}>
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {t.how.rows.map((r, i) => (
                      <tr key={r.catalyst} className="border-t border-white/5 text-slate-300 transition-colors hover:bg-white/[0.03]">
                        <td className="py-3.5 pr-4 text-slate-600">{i + 1}</td>
                        <td className="py-3.5 pr-4 text-sky">{r.catalyst}</td>
                        <td className="py-3.5 pr-4">{r.lambda}</td>
                        <td className="py-3.5 pr-4">{r.solvent}</td>
                        <td className="py-3.5 pr-4">{r.time}</td>
                        <td className="py-3.5">
                          <div className="flex items-center gap-3">
                            <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/8">
                              <motion.span
                                className="block h-full rounded-full bg-gradient-to-r from-neon via-sky to-orchid"
                                initial={{ width: 0 }}
                                whileInView={{ width: `${r.prob * 100}%` }}
                                viewport={{ once: true }}
                                transition={{ duration: 1.2, delay: 0.25 + i * 0.12, ease: EASE }}
                              />
                            </span>
                            <span className="w-10 text-right text-orchid">{r.prob.toFixed(2)}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-5 font-mono text-[11px] text-slate-500">// {t.how.mockNote}</p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ══════════════ 05 FIELD SPECTRUM ══════════════ */}
      <section id="apps" className={SECTION}>
        <span className={WATERMARK}>05</span>
        <Reveal>
          <Eyebrow>{t.apps.eyebrow}</Eyebrow>
          <h2 className="font-display text-3xl font-bold leading-tight tracking-tight md:text-5xl">{t.apps.heading}</h2>
        </Reveal>
        <Reveal delay={0.15} className="mt-14">
          <Radar fields={t.apps.fields} legend={t.apps.legend} hoverHint={t.apps.hoverHint} />
        </Reveal>
      </section>

      {/* ══════════════ 06 DELIVERABLES ══════════════ */}
      <section id="results" className={SECTION}>
        <span className={WATERMARK}>06</span>
        <Reveal>
          <Eyebrow>{t.results.eyebrow}</Eyebrow>
          <h2 className="font-display text-3xl font-bold leading-tight tracking-tight md:text-5xl">{t.results.heading}</h2>
        </Reveal>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {t.results.cards.map((c, i) => {
            const Icon = resultIcons[i];
            return (
              <Reveal key={c.t} delay={i * 0.08}>
                <div className="card-lift glass h-full rounded-3xl p-6">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-neon/70 to-plum/70 text-white">
                    <Icon size={18} />
                  </span>
                  <h3 className="mt-5 font-display text-base font-semibold">{c.t}</h3>
                  <p className="mt-2.5 text-[13px] leading-relaxed text-slate-400">{c.b}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ══════════════ SHIFT STATEMENT ══════════════ */}
      <section className="relative overflow-hidden px-5 py-24 text-center md:py-32">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{ background: 'radial-gradient(60% 80% at 50% 50%, rgba(48,70,170,0.22) 0%, transparent 70%)' }}
        />
        <Reveal>
          <h2 className="relative font-display text-4xl font-bold tracking-tight md:text-6xl">
            <span className="text-slate-500">{t.shift.bigA}</span>
            <br />
            <span className="text-gradient">{t.shift.bigB}</span>
          </h2>
          <p className="relative mx-auto mt-7 max-w-2xl text-base leading-relaxed text-slate-400 md:text-lg">{t.shift.sub}</p>
        </Reveal>
      </section>

      {/* ══════════════ CTA ══════════════ */}
      <section id="cta" className={cn(SECTION, 'pt-4')}>
        <div className="grid gap-5 md:grid-cols-2">
          <Reveal>
            <button
              onClick={() => go('beta')}
              className="card-lift group relative block h-full w-full overflow-hidden rounded-3xl border border-sky/25 bg-gradient-to-br from-neon/25 via-ink to-plum/25 p-8 text-left md:p-10"
            >
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-neon to-plum text-white">
                <Download size={20} />
              </span>
              <h3 className="mt-7 font-display text-2xl font-bold md:text-3xl">{t.cta.beta.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{t.cta.beta.sub}</p>
              <span className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-abyss via-neon to-plum px-6 py-3 font-display text-sm font-semibold text-white btn-glow">
                {t.cta.beta.btn}
                <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </button>
          </Reveal>
          <Reveal delay={0.1}>
            <button
              onClick={() => go('research')}
              className="card-lift group relative block h-full w-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-8 text-left md:p-10"
            >
              <span className="grid h-12 w-12 place-items-center rounded-2xl border border-orchid/30 bg-plum/30 text-orchid">
                <BookOpen size={20} />
              </span>
              <h3 className="mt-7 font-display text-2xl font-bold md:text-3xl">{t.cta.research.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{t.cta.research.sub}</p>
              <span className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 font-display text-sm font-semibold text-slate-200 transition-all duration-300 group-hover:border-orchid/50 group-hover:text-white">
                {t.cta.research.btn}
                <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </button>
          </Reveal>
        </div>
      </section>
    </>
  );
}
