import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, ExternalLink, Search } from 'lucide-react';
import type { Dict, Lang } from '../i18n';
import { cn } from '../utils/cn';

const EASE = [0.22, 1, 0.36, 1] as const;

type Work = {
  doi: string;
  title: string;
  journal: string;
  year: number;
  dateLabel: string;
  ts: number;
  authors: string;
  url: string;
};

const JOURNALS: { key: string; issns: string[] }[] = [
  { key: 'all', issns: ['0028-0836', '1755-4330', '2520-1158', '2041-1723', '1754-2189'] },
  { key: 'nature', issns: ['0028-0836'] },
  { key: 'chem', issns: ['1755-4330'] },
  { key: 'cat', issns: ['2520-1158'] },
  { key: 'comms', issns: ['2041-1723'] },
  { key: 'prot', issns: ['1754-2189'] },
];

const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_RU = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];

function formatAuthors(list?: { family?: string }[]): string {
  if (!list || list.length === 0) return '';
  const names = list.slice(0, 2).map((a) => a.family ?? '').filter(Boolean);
  return names.join(', ') + (list.length > 2 ? ' et al.' : '');
}

export default function ArticlesPage({ t, lang }: { t: Dict; lang: Lang }) {
  const [tab, setTab] = useState('all');
  const [input, setInput] = useState('');
  const [q, setQ] = useState('');
  const [items, setItems] = useState<Work[]>([]);
  const [state, setState] = useState<'loading' | 'ok' | 'err'>('loading');

  // debounce the refinement query
  useEffect(() => {
    const id = setTimeout(() => setQ(input.trim()), 450);
    return () => clearTimeout(id);
  }, [input]);

  useEffect(() => {
    const controller = new AbortController();
    setState('loading');

    const issns = JOURNALS.find((j) => j.key === tab)?.issns ?? JOURNALS[0].issns;
    const perIssn = tab === 'all' ? 8 : 16;
    const query = encodeURIComponent(('photochemistry ' + q).trim());

    Promise.allSettled(
      issns.map((issn) =>
        fetch(
          `https://api.crossref.org/journals/${issn}/works?query=${query}&filter=type:journal-article&rows=${perIssn}&select=DOI,title,author,published,container-title&sort=published&order=desc&mailto=hello@catalytica.dev`,
          { signal: controller.signal },
        ).then((r) => {
          if (!r.ok) throw new Error(String(r.status));
          return r.json();
        }),
      ),
    )
      .then((settled) => {
        const results = settled
          .filter((s): s is PromiseFulfilledResult<any> => s.status === 'fulfilled')
          .map((s) => s.value);
        if (results.length === 0) throw new Error('all sources failed');
        const seen = new Set<string>();
        const merged: Work[] = [];
        const months = lang === 'ru' ? MONTHS_RU : MONTHS_EN;

        for (const res of results) {
          for (const it of res?.message?.items ?? []) {
            if (!it.DOI || seen.has(it.DOI) || !it.title?.[0]) continue;
            seen.add(it.DOI);
            const parts: number[] = it.published?.['date-parts']?.[0] ?? [];
            const year = parts[0] ?? 0;
            const month = parts[1];
            merged.push({
              doi: it.DOI,
              title: it.title[0],
              journal: it['container-title']?.[0] ?? 'Nature portfolio',
              year,
              ts: parts.length ? Date.UTC(parts[0], (parts[1] ?? 1) - 1, parts[2] ?? 1) : 0,
              dateLabel: [month ? months[month - 1] : null, year].filter(Boolean).join(' '),
              authors: formatAuthors(it.author),
              url: `https://doi.org/${it.DOI}`,
            });
          }
        }

        merged.sort((a, b) => b.ts - a.ts);
        setItems(merged.slice(0, 30));
        setState(merged.length ? 'ok' : 'err');
      })
      .catch((e) => {
        if (e?.name !== 'AbortError') setState('err');
      });

    return () => controller.abort();
  }, [tab, q, lang]);

  return (
    <section className="relative mx-auto max-w-6xl px-5 pb-24 pt-32 md:px-8 lg:pt-40">
      <span className="pointer-events-none absolute right-0 top-16 select-none font-display text-[9rem] leading-none text-white/[0.025] md:text-[13rem]">
        hν
      </span>

      {/* header */}
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }}>
        <div className="mb-5 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-sky/80">
          <span className="h-px w-8 bg-gradient-to-r from-sky to-transparent" />
          {t.articles.kicker}
        </div>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h1 className="max-w-2xl font-display text-3xl font-bold leading-tight tracking-tight md:text-5xl">
            {t.articles.heading}
            <span className="text-gradient">.</span>
          </h1>
          <span className="inline-flex items-center gap-2 rounded-full border border-sky/20 bg-neon/10 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-sky">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-sky" />
            </span>
            {t.articles.live}
          </span>
        </div>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-400 md:text-lg">{t.articles.sub}</p>

        <a
          href="https://www.nature.com/search?article_type=protocols,research,reviews&subject=photochemistry"
          target="_blank"
          rel="noreferrer"
          className="group mt-5 inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-sky"
        >
          <ExternalLink size={14} />
          {t.articles.source}
          <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
      </motion.div>

      {/* controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
        className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
      >
        <div className="flex flex-wrap gap-2">
          {JOURNALS.map((j) => (
            <button
              key={j.key}
              onClick={() => setTab(j.key)}
              className={cn(
                'rounded-full border px-4 py-2 font-mono text-[11px] tracking-wide transition-all duration-300',
                tab === j.key
                  ? 'border-sky/50 bg-neon/25 text-white shadow-[0_8px_30px_-12px_rgba(48,70,170,0.8)]'
                  : 'border-white/10 bg-white/[0.02] text-slate-400 hover:border-white/20 hover:text-slate-200',
              )}
            >
              {t.articles.tabs[j.key as keyof typeof t.articles.tabs]}
            </button>
          ))}
        </div>

        <label className="relative block lg:w-80">
          <Search size={15} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.articles.searchPh}
            className="w-full rounded-full border border-white/10 bg-white/[0.03] py-2.5 pl-11 pr-4 text-sm text-slate-200 placeholder:text-slate-600 focus:border-sky/50 focus:outline-none focus:ring-2 focus:ring-neon/30"
          />
        </label>
      </motion.div>

      <div className="mt-6 flex items-center justify-between border-b border-white/5 pb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-slate-600">
        <span>
          {items.length > 0 ? `${items.length} ${t.articles.count}` : '\u00A0'}
        </span>
        <span>doi.org</span>
      </div>

      {/* feed */}
      <div className="mt-8">
        {state === 'loading' && (
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-2xl border border-white/5 bg-white/[0.02] p-6">
                <div className="h-3 w-36 rounded bg-white/8" />
                <div className="mt-4 h-5 w-full rounded bg-white/8" />
                <div className="mt-2 h-5 w-2/3 rounded bg-white/6" />
                <div className="mt-5 h-3 w-44 rounded bg-white/5" />
              </div>
            ))}
            <p className="col-span-full mt-2 text-center font-mono text-xs text-slate-600">{t.articles.loading}</p>
          </div>
        )}

        {state === 'err' && (
          <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-8 text-center">
            <h3 className="font-display text-xl font-semibold">{t.articles.errTitle}</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">{t.articles.errBody}</p>
            <div className="mt-8 grid gap-3 text-left md:grid-cols-3">
              {t.articles.fallback.map((f) => (
                <a
                  key={f.url}
                  href={f.url}
                  target="_blank"
                  rel="noreferrer"
                  className="card-lift group rounded-2xl border border-white/10 p-5"
                >
                  <ArrowUpRight size={16} className="text-slate-500 transition-colors group-hover:text-sky" />
                  <div className="mt-4 font-display text-sm font-semibold leading-snug">{f.title}</div>
                  <div className="mt-1.5 font-mono text-[11px] text-slate-500">{f.meta}</div>
                </a>
              ))}
            </div>
          </div>
        )}

        {state === 'ok' && (
          <motion.div layout className="grid gap-4 md:grid-cols-2">
            <AnimatePresence mode="popLayout">
              {items.map((w, i) => (
                <motion.a
                  layout
                  key={w.doi}
                  href={w.url}
                  target="_blank"
                  rel="noreferrer"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.45, delay: Math.min(i * 0.03, 0.4), ease: EASE }}
                  className="card-lift group relative flex flex-col rounded-2xl border border-white/8 bg-white/[0.02] p-6"
                >
                  <div className="flex items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.18em]">
                    <span className="text-sky/90">{w.journal}</span>
                    <span className="text-slate-600">{w.dateLabel}</span>
                  </div>
                  <h3 className="mt-3.5 font-display text-[15px] font-semibold leading-snug text-slate-100 transition-colors duration-300 group-hover:text-sky md:text-base">
                    {w.title}
                  </h3>
                  {w.authors && <p className="mt-2.5 text-xs text-slate-500">{w.authors}</p>}
                  <div className="mt-auto flex items-center justify-between pt-5">
                    <span className="font-mono text-[10px] text-slate-600">doi:{w.doi.replace('10.1038/', '')}</span>
                    <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-slate-400 transition-colors group-hover:text-white">
                      {t.articles.readOn}
                      <ArrowUpRight size={13} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </motion.a>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
}
