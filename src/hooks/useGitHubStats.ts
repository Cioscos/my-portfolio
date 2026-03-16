import { useState, useEffect } from 'react';

export interface LanguageStat {
  name: string;
  count: number;
  percentage: number;
}

export interface GitHubStats {
  totalRepos: number;
  totalStars: number;
  totalForks: number;
  topLanguage: string;
  languages: LanguageStat[];
}

export default function useGitHubStats(username: string) {
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`, {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
        return res.json();
      })
      .then((repos: { stargazers_count: number; forks_count: number; language: string | null; name: string }[]) => {
        const filtered = repos.filter((r) => !r.name.includes('.github.io'));

        const totalStars = filtered.reduce((sum, r) => sum + r.stargazers_count, 0);
        const totalForks = filtered.reduce((sum, r) => sum + r.forks_count, 0);

        const langCounts: Record<string, number> = {};
        for (const repo of filtered) {
          if (repo.language) {
            langCounts[repo.language] = (langCounts[repo.language] || 0) + 1;
          }
        }

        const totalWithLang = Object.values(langCounts).reduce((a, b) => a + b, 0);
        const languages: LanguageStat[] = Object.entries(langCounts)
          .sort((a, b) => b[1] - a[1])
          .map(([name, count]) => ({
            name,
            count,
            percentage: totalWithLang > 0 ? Math.round((count / totalWithLang) * 100) : 0,
          }));

        setStats({
          totalRepos: filtered.length,
          totalStars,
          totalForks,
          topLanguage: languages[0]?.name || '—',
          languages,
        });
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [username]);

  return { stats, loading, error };
}
