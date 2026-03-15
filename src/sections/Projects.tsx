import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useInView } from 'motion/react';
import { FaStar, FaExternalLinkAlt } from 'react-icons/fa';
import GlassPanel from '../components/GlassPanel';
import useGitHubRepos from '../hooks/useGitHubRepos';

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

export default function Projects() {
  const { t } = useTranslation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { repos, loading, error } = useGitHubRepos('Cioscos');
  const [filter, setFilter] = useState<string | null>(null);

  const languages = [...new Set(repos.map((r) => r.language).filter(Boolean))] as string[];
  const filtered = filter ? repos.filter((r) => r.language === filter) : repos;

  return (
    <section id="projects" className="px-6 py-24">
      <div ref={ref} className="mx-auto max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center font-heading text-4xl font-bold text-text-primary"
        >
          {t('projects.title')}
        </motion.h2>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="mb-8 flex flex-wrap justify-center gap-3"
        >
          <button
            onClick={() => setFilter(null)}
            className={`rounded-lg px-4 py-1.5 text-sm transition-all ${
              filter === null
                ? 'bg-neon-cyan/20 text-neon-cyan'
                : 'border border-white/10 text-text-secondary hover:text-neon-cyan'
            }`}
          >
            {t('projects.filterAll')}
          </button>
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => setFilter(lang)}
              className={`rounded-lg px-4 py-1.5 text-sm transition-all ${
                filter === lang
                  ? 'bg-neon-cyan/20 text-neon-cyan'
                  : 'border border-white/10 text-text-secondary hover:text-neon-cyan'
              }`}
            >
              {lang}
            </button>
          ))}
        </motion.div>

        {loading && (
          <p className="text-center text-text-secondary">{t('projects.loading')}</p>
        )}

        {error && (
          <p className="text-center text-neon-magenta">{t('projects.error')}</p>
        )}

        {!loading && !error && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filtered.map((repo) => (
              <GlassPanel
                key={repo.id}
                variants={cardVariants}
                whileHover={{ scale: 1.03, boxShadow: '0 0 20px rgba(0,240,255,0.15)' }}
                className="flex flex-col justify-between"
              >
                <div>
                  <h3 className="mb-2 font-heading text-lg font-semibold text-text-primary">
                    {repo.name}
                  </h3>
                  <p className="mb-4 text-sm leading-relaxed text-text-secondary">
                    {repo.description || '—'}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-text-secondary">
                    {repo.language && (
                      <span className="rounded-md bg-neon-cyan/10 px-2 py-0.5 text-neon-cyan">
                        {repo.language}
                      </span>
                    )}
                    {repo.stargazers_count > 0 && (
                      <span className="flex items-center gap-1">
                        <FaStar className="text-yellow-400" />
                        {repo.stargazers_count}
                      </span>
                    )}
                  </div>

                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-secondary transition-colors hover:text-neon-cyan"
                    aria-label={t('projects.viewRepo')}
                  >
                    <FaExternalLinkAlt />
                  </a>
                </div>
              </GlassPanel>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
