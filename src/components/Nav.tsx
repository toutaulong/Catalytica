import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import BrandImg from './BrandImg';
import type { Dict, Lang, Page } from '../i18n';
import { cn } from '../utils/cn';

type Props = {
  t: Dict;
  lang: Lang;
  setLang: (l: Lang) => void;
  page: Page;
  go: (p: Page) => void;
};

export default function Nav({ t, lang, setLang, page, go }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const pages: { id: Page; label: string }[] = [
    { id: 'home', label: t.nav.overview },
    { id: 'research', label: t.nav.research },
    { id: 'beta', label: t.nav.beta },
    { id: 'about', label: t.nav.about },
  ];

  const jump = (p: Page) => {
    go(p);
    setOpen(false);
  };

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-500',
        scrolled ? 'border-b border-white/5 bg-ink/70 backdrop-blur-xl' : 'bg-transparent',
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 md:px-8">
        {/* Brand */}
        <button onClick={() => jump('home')} className="group flex items-center gap-3">
          <BrandImg className="h-9 w-9 rounded-xl object-cover ring-1 ring-white/25 transition-transform duration-500 group-hover:rotate-6" />
          <span className="font-display text-lg font-semibold tracking-tight">
            Catalytica
            <span className="ml-2 rounded-md border border-sky/30 bg-neon/20 px-1.5 py-0.5 align-middle font-mono text-[10px] font-medium tracking-widest text-sky">
              PC
            </span>
          </span>
        </button>

        {/* Desktop pages */}
        <nav className="hidden items-center gap-1 md:flex">
          {pages.map((p) => (
            <button
              key={p.id}
              onClick={() => jump(p.id)}
              className={cn(
                'relative rounded-full px-4 py-2 text-sm transition-colors',
                page === p.id ? 'text-white' : 'text-slate-400 hover:text-slate-100',
              )}
            >
              {p.label}
              {page === p.id && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute inset-x-4 -bottom-[1px] h-px bg-gradient-to-r from-sky to-orchid"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          {/* Language toggle */}
          <div className="relative flex items-center rounded-full border border-white/10 bg-white/[0.03] p-1 font-mono text-[11px] tracking-wider">
            {(['en', 'ru'] as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={cn(
                  'relative z-10 rounded-full px-2.5 py-1 uppercase transition-colors duration-300',
                  lang === l ? 'text-white' : 'text-slate-500 hover:text-slate-300',
                )}
              >
                {l === 'en' ? 'EN' : 'RU'}
                {lang === l && (
                  <motion.span
                    layoutId="lang-thumb"
                    className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-neon to-plum"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
              </button>
            ))}
          </div>

          <button
            onClick={() => jump('beta')}
            className="btn-glow hidden items-center gap-1.5 rounded-full bg-gradient-to-r from-abyss via-neon to-plum px-4 py-2 text-sm font-medium text-white md:inline-flex"
          >
            {t.nav.cta}
            <ArrowUpRight size={15} />
          </button>

          {/* Mobile burger */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-slate-300 md:hidden"
            aria-label="Menu"
          >
            {open ? <X size={17} /> : <Menu size={17} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-b border-white/5 bg-ink/90 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              {pages.map((p) => (
                <button
                  key={p.id}
                  onClick={() => jump(p.id)}
                  className={cn(
                    'rounded-xl px-4 py-3 text-left font-display text-base',
                    page === p.id ? 'bg-white/5 text-white' : 'text-slate-400',
                  )}
                >
                  {p.label}
                </button>
              ))}
              <button
                onClick={() => jump('beta')}
                className="mt-2 rounded-xl bg-gradient-to-r from-abyss via-neon to-plum px-4 py-3 text-left font-medium text-white"
              >
                {t.nav.cta}
              </button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
