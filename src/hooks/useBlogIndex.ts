import { useState, useEffect } from 'react';
import { fetchBlogIndex, type BlogIndexEntry } from '../utils/blogLoader';

export default function useBlogIndex(lang: string) {
  const [posts, setPosts] = useState<BlogIndexEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    setLoading(true);
    setError(null);

    fetchBlogIndex(lang)
      .then((entries) => {
        if (!cancelled) {
          setPosts(entries);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [lang]);

  return { posts, loading, error };
}
