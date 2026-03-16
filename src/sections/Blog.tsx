import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useInView } from 'motion/react';
import { Link } from 'react-router-dom';
import { FaClock, FaCalendarAlt } from 'react-icons/fa';
import GlassPanel from '../components/GlassPanel';
import { getAllPosts } from '../utils/blogLoader';

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

export default function Blog() {
  const { t, i18n } = useTranslation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const posts = getAllPosts(i18n.language === 'it' ? 'it' : 'en').slice(0, 6);

  if (posts.length === 0) return null;

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

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {posts.map((post) => (
            <Link key={post.slug} to={`/blog/${post.slug}`}>
              <GlassPanel
                variants={cardVariants}
                whileHover={{ scale: 1.03, boxShadow: '0 0 20px rgba(0,240,255,0.15)' }}
                className="flex h-full cursor-pointer flex-col justify-between"
              >
                <div>
                  <h3 className="mb-2 font-heading text-lg font-semibold text-text-primary">
                    {post.frontmatter.title}
                  </h3>
                  <p className="mb-4 text-sm leading-relaxed text-text-secondary">
                    {post.frontmatter.excerpt}
                  </p>
                </div>

                <div>
                  <div className="mb-3 flex flex-wrap gap-2">
                    {post.frontmatter.tags.map((tag) => (
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
                      {post.frontmatter.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaClock />
                      {post.frontmatter.readTime} {t('blog.readTime')}
                    </span>
                  </div>
                </div>
              </GlassPanel>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
