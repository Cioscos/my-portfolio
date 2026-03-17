import { parseFrontmatter, type BlogFrontMatter } from './frontmatter';

export interface BlogPost {
  slug: string;
  lang: string;
  frontmatter: BlogFrontMatter;
  content: string;
}

export interface BlogIndexEntry {
  slug: string;
  lang: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  readTime: number;
}

const BLOG_BASE_URL =
  'https://raw.githubusercontent.com/Cioscos/blog-content/main';

const indexCache = new Map<string, BlogIndexEntry[]>();
const postCache = new Map<string, BlogPost>();

export async function fetchBlogIndex(lang: string): Promise<BlogIndexEntry[]> {
  if (indexCache.has(lang)) return indexCache.get(lang)!;

  const res = await fetch(`${BLOG_BASE_URL}/index.json`);
  if (!res.ok) throw new Error(`Failed to fetch blog index: ${res.status}`);

  const entries: BlogIndexEntry[] = await res.json();
  const allLangs = new Map<string, BlogIndexEntry[]>();

  for (const entry of entries) {
    const list = allLangs.get(entry.lang) ?? [];
    list.push(entry);
    allLangs.set(entry.lang, list);
  }

  for (const [l, list] of allLangs) {
    list.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
    indexCache.set(l, list);
  }

  return indexCache.get(lang) ?? [];
}

export async function fetchBlogPost(
  slug: string,
  lang: string,
): Promise<BlogPost | null> {
  const key = `${slug}:${lang}`;
  if (postCache.has(key)) return postCache.get(key)!;

  const res = await fetch(`${BLOG_BASE_URL}/posts/${slug}.${lang}.md`);
  if (!res.ok) return null;

  const raw = await res.text();
  const { data, content } = parseFrontmatter(raw);
  const post: BlogPost = { slug, lang, frontmatter: data, content };

  postCache.set(key, post);
  return post;
}
