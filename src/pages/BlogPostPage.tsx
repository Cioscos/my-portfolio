import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import { FaArrowLeft, FaClock, FaCalendarAlt } from 'react-icons/fa';
import type { Components } from 'react-markdown';
import { processFootnotes } from '../utils/footnotes';
import useBlogPost from '../hooks/useBlogPost';

const markdownComponents: Components = {
  a({ href, children, ...props }) {
    const text = String(children);
    const footnoteMatch = text.match(/^\^(\d+)\^$/);
    if (footnoteMatch) {
      return (
        <sup>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="footnote-ref"
            {...props}
          >
            {footnoteMatch[1]}
          </a>
        </sup>
      );
    }
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  },
};

function PostSkeleton() {
  return (
    <div className="px-6 py-24">
      <div className="mx-auto max-w-3xl animate-pulse">
        <div className="mb-8 h-4 w-32 rounded bg-white/5" />
        <div className="mb-4 h-9 w-3/4 rounded bg-white/5" />
        <div className="mb-4 flex gap-4">
          <div className="h-4 w-24 rounded bg-white/5" />
          <div className="h-4 w-24 rounded bg-white/5" />
        </div>
        <div className="mb-8 flex gap-2">
          <div className="h-5 w-16 rounded-md bg-white/5" />
          <div className="h-5 w-16 rounded-md bg-white/5" />
        </div>
        <div className="space-y-3">
          <div className="h-4 w-full rounded bg-white/5" />
          <div className="h-4 w-full rounded bg-white/5" />
          <div className="h-4 w-5/6 rounded bg-white/5" />
          <div className="h-4 w-full rounded bg-white/5" />
          <div className="h-4 w-4/6 rounded bg-white/5" />
        </div>
      </div>
    </div>
  );
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  const lang = i18n.language === 'it' ? 'it' : 'en';
  const { post, loading, error } = useBlogPost(slug, lang);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (post) {
      document.title = `${post.frontmatter.title} | Claudio Ciccarone`;
    }
    return () => {
      document.title = 'Claudio Ciccarone | Portfolio';
    };
  }, [post]);

  if (loading) return <PostSkeleton />;

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6">
        <p className="mb-4 text-lg text-text-secondary">{t('blog.error')}</p>
        <Link
          to="/"
          className="text-neon-cyan transition-colors hover:text-neon-magenta"
        >
          {t('blog.backToHome')}
        </Link>
      </div>
    );
  }

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
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[
              rehypeHighlight,
              [
                rehypeSanitize,
                {
                  ...defaultSchema,
                  tagNames: [...(defaultSchema.tagNames ?? []), 'sup'],
                  attributes: {
                    ...defaultSchema.attributes,
                    code: [
                      ...(defaultSchema.attributes?.code ?? []),
                      ['className', /^language-./],
                    ],
                    span: [
                      ...(defaultSchema.attributes?.span ?? []),
                      ['className', /^hljs/],
                    ],
                  },
                },
              ],
            ]}
            components={markdownComponents}
          >
            {processFootnotes(post.content)}
          </ReactMarkdown>
        </div>
      </article>
    </div>
  );
}
