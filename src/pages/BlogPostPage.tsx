import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { FaArrowLeft, FaClock, FaCalendarAlt } from 'react-icons/fa';
import { getPostBySlug } from '../utils/blogLoader';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  const lang = i18n.language === 'it' ? 'it' : 'en';
  const post = slug ? getPostBySlug(slug, lang) : undefined;

  useEffect(() => {
    if (post) {
      document.title = `${post.frontmatter.title} | Claudio Ciccarone`;
    }
    return () => {
      document.title = 'Claudio Ciccarone | Portfolio';
    };
  }, [post]);

  if (!post) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6">
        <p className="mb-4 text-lg text-text-secondary">{t('blog.noPosts')}</p>
        <Link
          to="/"
          className="text-neon-cyan transition-colors hover:text-neon-magenta"
        >
          {t('blog.backToHome')}
        </Link>
      </div>
    );
  }

  return (
    <div className="px-6 py-24">
      <article className="mx-auto max-w-3xl">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-neon-cyan transition-colors hover:text-neon-magenta"
        >
          <FaArrowLeft />
          {t('blog.backToHome')}
        </Link>

        <header className="mb-8">
          <h1 className="mb-4 font-heading text-4xl font-bold text-text-primary">
            {post.frontmatter.title}
          </h1>

          <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-text-secondary">
            <span className="flex items-center gap-1">
              <FaCalendarAlt />
              {post.frontmatter.date}
            </span>
            <span className="flex items-center gap-1">
              <FaClock />
              {post.frontmatter.readTime} {t('blog.readTime')}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {post.frontmatter.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-neon-cyan/10 px-2 py-0.5 text-xs text-neon-cyan"
              >
                {tag}
              </span>
            ))}
          </div>
        </header>

        <div className="prose-custom">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
            {post.content}
          </ReactMarkdown>
        </div>
      </article>
    </div>
  );
}
