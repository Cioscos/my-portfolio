import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Link } from 'react-scroll';
import { HiDownload } from 'react-icons/hi';

export default function Hero() {
  const { t } = useTranslation();
  const items = t('hero.typingItems', { returnObjects: true }) as string[];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = items[currentIndex];

    if (!deleting && displayed === word) {
      const timeout = setTimeout(() => setDeleting(true), 1500);
      return () => clearTimeout(timeout);
    }

    if (deleting && displayed === '') {
      setDeleting(false);
      setCurrentIndex((prev) => (prev + 1) % items.length);
      return;
    }

    const speed = deleting ? 40 : 80;
    const timeout = setTimeout(() => {
      setDisplayed(
        deleting ? word.slice(0, displayed.length - 1) : word.slice(0, displayed.length + 1)
      );
    }, speed);

    return () => clearTimeout(timeout);
  }, [displayed, deleting, currentIndex, items]);

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,240,255,0.08)_0%,_transparent_70%)]" />

      <div className="relative z-10 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-2 text-lg text-text-secondary"
        >
          {t('hero.greeting')}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-4 font-heading text-5xl font-bold text-text-primary md:text-7xl"
        >
          {t('hero.name')}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-6 text-xl text-neon-cyan md:text-2xl"
        >
          {t('hero.role')}
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-10 h-8 font-mono text-lg text-text-secondary"
        >
          {'> '}
          <span className="text-neon-magenta">{displayed}</span>
          <span className="animate-pulse text-neon-cyan">|</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            to="contact"
            smooth
            duration={500}
            className="inline-block cursor-pointer rounded-xl border border-neon-cyan/50 bg-neon-cyan/10 px-8 py-3 font-heading font-semibold text-neon-cyan transition-all hover:bg-neon-cyan/20 hover:shadow-[0_0_20px_rgba(0,240,255,0.3)]"
          >
            {t('hero.cta')}
          </Link>
          <a
            href="/my-portfolio/cv/Claudio_Ciccarone_CV.pdf"
            download
            className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-8 py-3 font-heading font-semibold text-text-secondary transition-all hover:border-neon-cyan/50 hover:text-neon-cyan hover:shadow-[0_0_20px_rgba(0,240,255,0.15)]"
          >
            <HiDownload />
            {t('hero.downloadCv')}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
