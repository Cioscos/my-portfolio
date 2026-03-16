import { parseFrontmatter, type BlogFrontMatter } from './frontmatter';

export interface BlogPost {
  slug: string;
  lang: string;
  frontmatter: BlogFrontMatter;
  content: string;
}

const modules = import.meta.glob('/src/content/blog/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

function loadPosts(): BlogPost[] {
  const posts: BlogPost[] = [];

  for (const [path, raw] of Object.entries(modules)) {
    // Pattern: /src/content/blog/{slug}.{lang}.md
    const filename = path.split('/').pop()!.replace('.md', '');
    const lastDot = filename.lastIndexOf('.');
    if (lastDot === -1) continue;

    const slug = filename.slice(0, lastDot);
    const lang = filename.slice(lastDot + 1);
    const { data, content } = parseFrontmatter(raw);

    posts.push({ slug, lang, frontmatter: data, content });
  }

  return posts;
}

const allPosts = loadPosts();

export function getAllPosts(lang: string): BlogPost[] {
  return allPosts
    .filter((p) => p.lang === lang)
    .sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime());
}

export function getPostBySlug(slug: string, lang: string): BlogPost | undefined {
  return allPosts.find((p) => p.slug === slug && p.lang === lang);
}
