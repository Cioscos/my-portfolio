import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useInView, animate } from 'motion/react';
import { FaCodeBranch, FaStar, FaCode, FaCubes } from 'react-icons/fa';
import GlassPanel from '../components/GlassPanel';
import useGitHubStats from '../hooks/useGitHubStats';
import { useEffect, useState } from 'react';

const LANG_COLORS = [
  'bg-neon-cyan',
  'bg-neon-magenta',
  'bg-neon-green',
  'bg-yellow-400',
  'bg-blue-400',
];

function CountUp({ target, inView }: { target: number; inView: boolean }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, target, {
      duration: 1.5,
      ease: 'easeOut',
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [target, inView]);

  return <>{value}</>;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
};

export default function GitHubStats() {
  const { t } = useTranslation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const { stats, loading, error } = useGitHubStats('Cioscos');

  const statCards = stats
    ? [
        { icon: <FaCubes />, value: stats.totalRepos, label: t('githubStats.repos') },
        { icon: <FaStar />, value: stats.totalStars, label: t('githubStats.stars') },
        { icon: <FaCodeBranch />, value: stats.totalForks, label: t('githubStats.forks') },
        { icon: <FaCode />, value: 0, label: t('githubStats.topLanguage'), text: stats.topLanguage },
      ]
    : [];

  const topLanguages = stats?.languages.slice(0, 5) ?? [];

  return (
    <section id="github-stats" className="bg-bg-secondary px-6 py-24">
      <div ref={ref} className="mx-auto max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center font-heading text-4xl font-bold text-text-primary"
        >
          {t('githubStats.title')}
        </motion.h2>

        {loading && (
          <p className="text-center text-text-secondary">{t('githubStats.loading')}</p>
        )}

        {error && (
          <p className="text-center text-neon-magenta">{t('githubStats.error')}</p>
        )}

        {stats && (
          <>
            {/* Stat Cards */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              className="mb-12 grid grid-cols-2 gap-4 lg:grid-cols-4"
            >
              {statCards.map((card) => (
                <GlassPanel
                  key={card.label}
                  variants={cardVariants}
                  className="flex flex-col items-center gap-2 text-center"
                >
                  <span className="text-2xl text-neon-cyan">{card.icon}</span>
                  <span className="font-heading text-3xl font-bold text-text-primary">
                    {card.text ?? <CountUp target={card.value} inView={isInView} />}
                  </span>
                  <span className="text-sm text-text-secondary">{card.label}</span>
                </GlassPanel>
              ))}
            </motion.div>

            {/* Language Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <h3 className="mb-4 text-center font-heading text-lg font-semibold text-text-primary">
                {t('githubStats.languages')}
              </h3>

              <div
                className="mb-4 flex h-4 overflow-hidden rounded-full"
                role="progressbar"
                aria-valuenow={100}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={t('githubStats.languages')}
              >
                {topLanguages.map((lang, i) => (
                  <motion.div
                    key={lang.name}
                    className={`${LANG_COLORS[i]} h-full`}
                    initial={{ width: 0 }}
                    animate={isInView ? { width: `${lang.percentage}%` } : {}}
                    transition={{ delay: 0.8 + i * 0.1, duration: 0.6, ease: 'easeOut' }}
                  />
                ))}
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                {topLanguages.map((lang, i) => (
                  <div key={lang.name} className="flex items-center gap-2 text-sm text-text-secondary">
                    <span className={`inline-block h-3 w-3 rounded-full ${LANG_COLORS[i]}`} />
                    {lang.name} ({lang.percentage}%)
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
}
