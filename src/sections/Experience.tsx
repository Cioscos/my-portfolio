import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useInView } from 'motion/react';
import GlassPanel from '../components/GlassPanel';

interface ExperienceEntry {
  role: string;
  company: string;
  period: string;
  description: string;
}

export default function Experience() {
  const { t } = useTranslation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const entries = t('experience.entries', { returnObjects: true }) as ExperienceEntry[];

  return (
    <section id="experience" className="px-6 py-24">
      <div ref={ref} className="mx-auto max-w-3xl">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center font-heading text-4xl font-bold text-text-primary"
        >
          {t('experience.title')}
        </motion.h2>

        {/* Timeline */}
        <div className="relative border-l-2 border-neon-cyan/30 pl-8">
          {entries.map((entry, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.2 }}
              className="relative mb-10 last:mb-0"
            >
              {/* Dot */}
              <div className="absolute -left-[calc(2rem+5px)] top-2 h-3 w-3 rounded-full border-2 border-neon-cyan bg-bg-primary" />

              <GlassPanel>
                <p className="mb-1 text-sm text-neon-cyan">{entry.period}</p>
                <h3 className="font-heading text-xl font-semibold text-text-primary">
                  {entry.role}
                </h3>
                <p className="mb-3 text-sm text-neon-magenta">{entry.company}</p>
                <p className="text-sm leading-relaxed text-text-secondary">
                  {entry.description}
                </p>
              </GlassPanel>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
