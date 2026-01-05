import { Link } from 'react-router-dom';
import { useI18n } from '@/contexts/I18nContext';
import { useContent } from '@/contexts/ContentContext';
import { api, type BlogPost } from '@/lib/api';
import { useState, useEffect } from 'react';

export function Blog() {
  const { t, locale } = useI18n();
  const { content, loading: contentLoading } = useContent();
  const [posts, setPosts] = useState<BlogPost[]>(content?.blog || []);
  const [loading, setLoading] = useState(contentLoading);

  useEffect(() => {
    if (!content?.blog || content.blog.length === 0) {
      setLoading(true);
      api.getBlogPosts(locale).then(setPosts).finally(() => setLoading(false));
    } else {
      setPosts(content.blog);
    }
  }, [locale, content]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-[var(--color-muted-foreground)]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-b from-[var(--color-background)] to-[var(--color-muted)]/20 py-16">
        <div className="container px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 text-sm text-[var(--color-muted-foreground)]">
              {t('nav.home')} / {t('nav.blog')}
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">{t('nav.blog')}</h1>
            <p className="mt-6 text-lg leading-8 text-[var(--color-muted-foreground)]">
              {t('public.blogIntro')}
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 sm:py-32">
        <div className="container px-4">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.id}`}
                  className="group flex flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="mb-2 text-sm text-[var(--color-muted-foreground)]">{post.date}</div>
                  <h3 className="mb-3 text-xl font-semibold group-hover:text-[var(--color-primary)]">{post.title}</h3>
                  <p className="mb-4 flex-1 text-sm text-[var(--color-muted-foreground)] line-clamp-3">{post.excerpt}</p>
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {post.tags.slice(0, 3).map((tag, i) => (
                        <span
                          key={i}
                          className="rounded-md border border-[var(--color-border)] bg-[var(--color-background)] px-2 py-1 text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

