import { useState, useEffect } from 'react';
import { fetchBlogPost, type BlogPost } from '../utils/blogLoader';

export default function useBlogPost(slug: string | undefined, lang: string) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    setLoading(true);
    setError(null);
    setPost(null);

    fetchBlogPost(slug, lang)
      .then((result) => {
        if (!cancelled) {
          setPost(result);
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
    };
  }, [slug, lang]);

  return { post, loading, error };
}
