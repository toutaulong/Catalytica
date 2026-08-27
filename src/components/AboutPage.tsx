import { motion } from 'framer-motion';
import { FolderGit2, UserRound } from 'lucide-react';
import type { Dict } from '../i18n';

const EASE = [0.22, 1, 0.36, 1] as const;

export default function AboutPage({ t }: { t: Dict }) {
  const icons = [FolderGit2, UserRound];

  return (
    <section className="relative mx-auto max-w-5xl px-5 pb-24 pt-32 md:px-8 lg:pt-40">
      <span className="pointer-events-none absolute right-0 top-16 select-none font-display text-[9rem] leading-none text-white/[0.025] md:text-[13rem]">
        PC
      </span>

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }}>
        <div className="mb-5 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-sky/80">
          <span className="h-px w-8 bg-gradient-to-r from-sky to-transparent" />
          {t.about.kicker}
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <h1 className="font-display text-3xl font-bold tracking-tight md:text-5xl">{t.about.heading}</h1>
          <span className="rounded-full border border-orchid/30 bg-plum/20 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-orchid">
            {t.about.badge}
          </span>
        </div>
      </motion.div>

      <div className="mt-14 grid gap-5 md:grid-cols-2">
        {t.about.cards.map((c, i) => {
          const Icon = icons[i];
          return (
            <motion.div
              key={c.t}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 + i * 0.1, ease: EASE }}
              className="relative overflow-hidden rounded-3xl border border-dashed border-white/15 bg-white/[0.015] p-8 md:p-10"
            >
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-neon/60 to-plum/60 text-white">
                <Icon size={20} />
              </span>
              <h3 className="mt-6 font-display text-xl font-semibold">{c.t}</h3>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-500">{c.b}</p>
              <div className="mt-8 flex flex-col gap-2.5">
                <span className="h-2 w-3/4 rounded-full bg-white/5" />
                <span className="h-2 w-full rounded-full bg-white/[0.04]" />
                <span className="h-2 w-1/2 rounded-full bg-white/5" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
