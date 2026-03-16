export interface BlogFrontMatter {
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  readTime: number;
}

export function parseFrontmatter(raw: string): { data: BlogFrontMatter; content: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    return {
      data: { title: '', date: '', excerpt: '', tags: [], readTime: 0 },
      content: raw,
    };
  }

  const [, frontBlock, content] = match;
  const data: Record<string, unknown> = {};

  for (const line of frontBlock.split('\n')) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    let value: unknown = line.slice(colonIdx + 1).trim();

    // Remove surrounding quotes
    if (typeof value === 'string' && value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }

    // Parse arrays like ["a", "b"]
    if (typeof value === 'string' && value.startsWith('[') && value.endsWith(']')) {
      value = value
        .slice(1, -1)
        .split(',')
        .map((s) => s.trim().replace(/^"|"$/g, ''));
    }

    // Parse numbers
    if (typeof value === 'string' && /^\d+$/.test(value)) {
      value = parseInt(value, 10);
    }

    data[key] = value;
  }

  return {
    data: {
      title: (data.title as string) || '',
      date: (data.date as string) || '',
      excerpt: (data.excerpt as string) || '',
      tags: (data.tags as string[]) || [],
      readTime: (data.readTime as number) || 0,
    },
    content: content.trim(),
  };
}
