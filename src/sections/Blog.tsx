import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useInView } from 'motion/react';
import { Link } from 'react-router-dom';
import { FaClock, FaCalendarAlt } from 'react-icons/fa';
import GlassPanel from '../components/GlassPanel';
import useBlogIndex from '../hooks/useBlogIndex';

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

function SkeletonCard() {
  return (
    <GlassPanel className="flex h-full flex-col justify-between">
      <div className="animate-pulse">
        <div className="mb-2 h-5 w-3/4 rounded bg-white/5" />
        <div className="mb-4 space-y-2">
          <div className="h-3 w-full rounded bg-white/5" />
          <div className="h-3 w-5/6 rounded bg-white/5" />
        </div>
      </div>
      <div className="animate-pulse">
        <div className="mb-3 flex gap-2">
          <div className="h-5 w-14 rounded-md bg-white/5" />
          <div className="h-5 w-14 rounded-md bg-white/5" />
        </div>
        <div className="h-3 w-1/2 rounded bg-white/5" />
      </div>
    </GlassPanel>
  );
}

export default function Blog() {
  const { t, i18n } = useTranslation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const lang = i18n.language === 'it' ? 'it' : 'en';
  const { posts, loading, error } = useBlogIndex(lang);

  if (!loading && posts.length === 0 && !error) return null;

  return (
    <section id="blog" className="px-6 py-24">
      <div ref={ref} className="mx-auto max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center font-heading text-4xl font-bold text-text-primary"
        >
          {t('blog.title')}
        </motion.h2>

        {error && (
          <p className="text-center text-sm text-text-secondary">{t('blog.error')}</p>
        )}

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }, (_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {posts.slice(0, 6).map((post) => (
              <Link key={post.slug} to={`/blog/${post.slug}`}>
                <GlassPanel
                  variants={cardVariants}
                  whileHover={{ scale: 1.03, boxShadow: '0 0 20px rgba(0,240,255,0.15)' }}
                  className="flex h-full cursor-pointer flex-col justify-between"
                >
                  <div>
                    <h3 className="mb-2 font-heading text-lg font-semibold text-text-primary">
                      {post.title}
                    </h3>
                    <p className="mb-4 text-sm leading-relaxed text-text-secondary">
                      {post.excerpt}
                    </p>
                  </div>

                  <div>
                    <div className="mb-3 flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md bg-neon-cyan/10 px-2 py-0.5 text-xs text-neon-cyan"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-text-secondary">
                      <span className="flex items-center gap-1">
                        <FaCalendarAlt />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaClock />
                        {post.readTime} {t('blog.readTime')}
                      </span>
                    </div>
                  </div>
                </GlassPanel>
              </Link>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
