import { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useInView } from 'motion/react';
import { FaStar, FaExternalLinkAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import GlassPanel from '../components/GlassPanel';
import useGitHubRepos from '../hooks/useGitHubRepos';
import useMediaQuery from '../hooks/useMediaQuery';

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
  const sentinelRef = useRef(null);
  const isInView = useInView(sentinelRef, { once: true });
  const { repos, loading, error } = useGitHubRepos('Cioscos');
  const [filter, setFilter] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const isMobile = useMediaQuery('(max-width: 639px)');

  const MOBILE_PAGE_SIZE = 3;

  const languages = [...new Set(repos.map((r) => r.language).filter(Boolean))] as string[];
  const filtered = filter ? repos.filter((r) => r.language === filter) : repos;

  const totalPages = Math.ceil(filtered.length / MOBILE_PAGE_SIZE);
  const visibleProjects = isMobile
    ? filtered.slice(page * MOBILE_PAGE_SIZE, (page + 1) * MOBILE_PAGE_SIZE)
    : filtered;

  // Reset page when filter changes or when filtered list shrinks
  useEffect(() => {
    setPage(0);
  }, [filter]);

  return (
    <section id="projects" className="px-6 py-24">
      <div ref={sentinelRef} className="h-0 w-0" aria-hidden />
      <div className="mx-auto max-w-6xl">
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
          <>
            <motion.div
              key={isMobile ? page : 'all'}
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {visibleProjects.map((repo) => (
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

            {/* Mobile pagination controls */}
            {isMobile && totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-4">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="rounded-lg border border-white/10 p-2 text-text-secondary transition-colors hover:text-neon-cyan disabled:opacity-30 disabled:hover:text-text-secondary"
                  aria-label={t('projects.prevPage')}
                >
                  <FaChevronLeft />
                </button>
                <span className="text-sm text-text-secondary">
                  {page + 1} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page === totalPages - 1}
                  className="rounded-lg border border-white/10 p-2 text-text-secondary transition-colors hover:text-neon-cyan disabled:opacity-30 disabled:hover:text-text-secondary"
                  aria-label={t('projects.nextPage')}
                >
                  <FaChevronRight />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
