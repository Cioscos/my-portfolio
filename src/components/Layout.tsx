import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence } from 'motion/react';
import Navbar from './Navbar';
import ParticleBackground from './ParticleBackground';
import Footer from './Footer';
import GameOverlay from './GameOverlay';
import useKonamiCode from '../hooks/useKonamiCode';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { i18n } = useTranslation();
  const { activated, reset } = useKonamiCode();
  const [showGame, setShowGame] = useState(false);

  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  useEffect(() => {
    if (activated) {
      setShowGame(true);
      reset();
    }
  }, [activated, reset]);

  return (
    <>
      <a
        href="#main-content"
        className="fixed left-2 top-2 z-[100] rounded-lg bg-neon-cyan px-4 py-2 font-heading font-semibold text-bg-primary sr-only focus:not-sr-only"
      >
        Skip to content
      </a>
      <ParticleBackground />
      <Navbar />
      <main id="main-content">
        {children}
      </main>
      <Footer />
      <AnimatePresence>
        {showGame && <GameOverlay onClose={() => setShowGame(false)} />}
      </AnimatePresence>
    </>
  );
}
