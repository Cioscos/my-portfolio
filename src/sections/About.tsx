import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useInView } from 'motion/react';
import GlassPanel from '../components/GlassPanel';
import { HiLocationMarker } from 'react-icons/hi';

export default function About() {
  const { t } = useTranslation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const highlights = t('about.highlights', { returnObjects: true }) as string[];

  return (
    <section id="about" className="px-6 py-24">
      <div ref={ref} className="mx-auto max-w-4xl">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center font-heading text-4xl font-bold text-text-primary"
        >
          {t('about.title')}
        </motion.h2>

        <GlassPanel
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col items-center gap-6 md:flex-row md:items-start"
        >
          {/* Avatar placeholder */}
          <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-full border-2 border-neon-cyan/30 bg-bg-secondary font-heading text-4xl font-bold text-neon-cyan">
            CC
          </div>

          <div>
            {t('about.bio')
              .split('\n\n')
              .map((paragraph, i) => (
                <p
                  key={i}
                  className="mb-4 text-lg leading-relaxed text-text-secondary"
                >
                  {paragraph}
                </p>
              ))}
            <p className="flex items-center gap-2 text-sm text-text-secondary">
              <HiLocationMarker className="text-neon-magenta" />
              {t('about.location')}
            </p>
          </div>
        </GlassPanel>

        {/* Highlight badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 flex flex-wrap justify-center gap-3"
        >
          {highlights.map((label, i) => (
            <span
              key={i}
              className="rounded-full border border-white/10 bg-bg-glass px-4 py-2 text-sm font-medium text-neon-cyan backdrop-blur-sm"
            >
              {label}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
