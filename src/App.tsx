import { Component, useEffect, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { dict, type Lang, type Page } from './i18n';
import Background from './components/Background';
import Nav from './components/Nav';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import ArticlesPage from './components/ArticlesPage';
import DownloadPage from './components/DownloadPage';
import AboutPage from './components/AboutPage';

function readLang(): Lang {
  try {
    const saved = window.localStorage.getItem('cat-lang');
    return saved === 'ru' || saved === 'en' ? saved : 'en';
  } catch {
    return 'en';
  }
}

// Never let a runtime glitch turn into a white screen.
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err: unknown) {
    console.error('Catalytica PC render error:', err);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="grid min-h-screen place-items-center bg-ink px-6 text-center">
          <div>
            <div className="mx-auto mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-neon to-plum font-mono text-lg text-white">
              hν
            </div>
            <h1 className="font-display text-2xl font-bold text-white">Catalytica PC</h1>
            <p className="mt-3 max-w-sm text-sm text-slate-400">
              Something glitched while rendering the interface. A reload usually fixes it.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 rounded-full bg-gradient-to-r from-abyss via-neon to-plum px-6 py-3 font-display text-sm font-semibold text-white"
            >
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [lang, setLang] = useState<Lang>(readLang);
  const [page, setPage] = useState<Page>('home');

  const t = dict[lang];

  useEffect(() => {
    try {
      window.localStorage.setItem('cat-lang', lang);
    } catch {
      /* private mode — language simply won't persist */
    }
    document.documentElement.lang = lang === 'ru' ? 'ru' : 'en';
  }, [lang]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [page]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen font-body antialiased">
        <Background />
        <Nav t={t} lang={lang} setLang={setLang} page={page} go={setPage} />

        <AnimatePresence mode="wait">
          <motion.main
            key={page}
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {page === 'home' && <HomePage t={t} go={setPage} />}
            {page === 'research' && <ArticlesPage t={t} lang={lang} />}
            {page === 'beta' && <DownloadPage t={t} go={setPage} />}
            {page === 'about' && <AboutPage t={t} />}
          </motion.main>
        </AnimatePresence>

        <Footer t={t} go={setPage} />
      </div>
    </ErrorBoundary>
  );
}
