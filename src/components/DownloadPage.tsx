import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Check, Cpu, Download, HardDrive, Info, MonitorDown, Sparkles, Wifi } from 'lucide-react';
import type { Dict, Page } from '../i18n';
import { cn } from '../utils/cn';
import BrandImg from './BrandImg';

const EASE = [0.22, 1, 0.36, 1] as const;

export default function DownloadPage({ t, go }: { t: Dict; go: (p: Page) => void }) {
  const [toast, setToast] = useState(false);

  const tryDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    setToast(true);
    window.setTimeout(() => setToast(false), 4200);
  };

  const reqIcons = [MonitorDown, Cpu, HardDrive, Wifi];

  return (
    <section className="relative mx-auto max-w-5xl px-5 pb-24 pt-32 md:px-8 lg:pt-40">
      <span className="pointer-events-none absolute right-0 top-16 select-none font-display text-[9rem] leading-none text-white/[0.025] md:text-[13rem]">
        β
      </span>

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }} className="text-center">
        <div className="mb-5 inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-sky/80">
          <span className="h-px w-8 bg-gradient-to-r from-transparent to-sky" />
          {t.download.kicker}
          <span className="h-px w-8 bg-gradient-to-l from-transparent to-sky" />
        </div>
        <h1 className="font-display text-3xl font-bold tracking-tight md:text-5xl">{t.download.heading}</h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-400 md:text-lg">{t.download.sub}</p>
      </motion.div>

      {/* download card */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.12, ease: EASE }}
        className="noise relative mt-14 overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent p-8 md:p-12"
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(70% 60% at 50% 0%, rgba(48,70,170,0.18) 0%, transparent 70%)' }}
        />

        <div className="relative flex flex-col items-center">
          <div className="relative">
            <span className="absolute inset-0 rounded-3xl bg-neon/40 blur-2xl" />
            <span className="relative block h-20 w-20 overflow-hidden rounded-3xl ring-1 ring-white/25 shadow-[0_20px_50px_-15px_rgba(48,70,170,0.9)]">
              <BrandImg alt="Catalytica PC logo" className="h-full w-full object-cover" />
            </span>
            <span className="absolute -right-2 -top-2 rounded-full border border-orchid/40 bg-ink px-2 py-0.5 font-mono text-[10px] font-semibold text-orchid">
              β
            </span>
          </div>

          <h2 className="mt-7 font-display text-2xl font-bold">Catalytica PC</h2>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-3 font-mono text-[11px] tracking-wider text-slate-400">
            <span className="rounded-full border border-sky/25 bg-neon/15 px-3 py-1 text-sky">{t.download.version}</span>
            <span className="rounded-full border border-white/10 px-3 py-1">{t.download.size}</span>
          </div>

          {/* platforms */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {t.download.platforms.map((p, i) => (
              <span
                key={p}
                className={cn(
                  'rounded-full border px-4 py-2 font-mono text-[11px] tracking-wide',
                  i === 0 ? 'border-sky/50 bg-neon/25 text-white' : 'border-white/8 text-slate-600',
                )}
              >
                {p}
              </span>
            ))}
          </div>

          <a
            href="#"
            onClick={tryDownload}
            className="btn-glow mt-9 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-abyss via-neon to-plum px-10 py-4 font-display text-base font-semibold text-white"
          >
            <Download size={18} />
            {t.download.downloadBtn}
          </a>
          <p className="mt-4 font-mono text-[10px] tracking-wider text-slate-600">{t.download.checksum}</p>

          <AnimatePresence>
            {toast && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="glass-strong mt-6 flex max-w-md items-start gap-3 rounded-2xl px-5 py-4 text-left"
              >
                <Info size={16} className="mt-0.5 shrink-0 text-sky" />
                <p className="text-xs leading-relaxed text-slate-300">{t.download.toast}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* release notes + requirements */}
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: EASE }}
          className="rounded-3xl border border-white/8 bg-white/[0.02] p-7 md:p-8"
        >
          <div className="flex items-center gap-2.5">
            <Sparkles size={16} className="text-orchid" />
            <h3 className="font-display text-lg font-semibold">{t.download.releaseTitle}</h3>
          </div>
          <ul className="mt-5 flex flex-col gap-3.5">
            {t.download.notes.map((n) => (
              <li key={n} className="flex items-start gap-3 text-sm leading-relaxed text-slate-300">
                <Check size={15} className="mt-0.5 shrink-0 text-sky" />
                {n}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, delay: 0.08, ease: EASE }}
          className="flex flex-col rounded-3xl border border-white/8 bg-white/[0.02] p-7 md:p-8"
        >
          <div className="flex items-center gap-2.5">
            <MonitorDown size={16} className="text-sky" />
            <h3 className="font-display text-lg font-semibold">{t.download.reqTitle}</h3>
          </div>
          <ul className="mt-5 grid flex-1 gap-3.5">
            {t.download.reqs.map((r, i) => {
              const Icon = reqIcons[i % reqIcons.length];
              return (
                <li key={r} className="flex items-center gap-3 text-sm text-slate-300">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-white/5 text-slate-400">
                    <Icon size={14} />
                  </span>
                  {r}
                </li>
              );
            })}
          </ul>
          <div className="mt-6 rounded-2xl border border-orchid/20 bg-plum/15 px-4 py-3 text-center font-mono text-[11px] tracking-widest text-orchid">
            {t.download.free}
          </div>
        </motion.div>
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        onClick={() => go('home')}
        className="group mx-auto mt-12 flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-sky"
      >
        <ArrowLeft size={15} className="transition-transform duration-300 group-hover:-translate-x-1" />
        {t.download.back}
      </motion.button>
    </section>
  );
}
