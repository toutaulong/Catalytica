import { Mail } from 'lucide-react';
import BrandImg from './BrandImg';
import type { Dict } from '../i18n';
import type { Page } from '../i18n';

type Props = {
  t: Dict;
  go: (p: Page) => void;
};

export default function Footer({ t, go }: Props) {
  return (
    <footer className="relative mt-6 border-t border-white/5">
      <div
        className="pointer-events-none absolute inset-x-0 -top-40 h-40"
        style={{ background: 'linear-gradient(to top, rgba(48,70,170,0.08), transparent)' }}
      />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-5 py-16 md:grid-cols-2 md:px-8 md:py-20">
        <div>
          <h2 className="font-display text-4xl font-bold leading-[1.04] tracking-tight md:text-[3.4rem]">
            {t.footer.powered1}
            <br />
            <span className="text-gradient">{t.footer.powered2}</span>
          </h2>
        </div>

        <div className="flex flex-col justify-between gap-8 md:items-end md:text-right">
          <p className="max-w-sm text-sm leading-relaxed text-slate-400">{t.footer.author}</p>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-600">{t.footer.emailLabel}</div>
            <a
              href={`mailto:${t.footer.email}`}
              className="group mt-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm text-slate-200 transition-all duration-300 hover:border-sky/40 hover:text-white"
            >
              <Mail size={14} className="text-sky" />
              {t.footer.email}
            </a>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/5">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-6 font-mono text-[11px] text-slate-500 md:px-8">
          <span>{t.footer.rights}</span>
          <div className="flex items-center gap-5">
            <button onClick={() => go('about')} className="transition-colors hover:text-slate-200">
              {t.footer.aboutLink}
            </button>
            <button onClick={() => go('home')} className="flex items-center gap-2 transition-colors hover:text-slate-300">
              <BrandImg alt="" className="h-4 w-4 rounded" />
              Catalytica <span className="text-slate-600">·</span> PC
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
