import { Link, useParams } from 'react-router-dom';
import { useI18n } from '@/contexts/I18nContext';
import { api, type BlogPost } from '@/lib/api';
import { useState, useEffect } from 'react';

export function BlogPost() {
  const { id } = useParams<{ id: string }>();
  const { t, locale } = useI18n();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api
      .getBlogPost(id, locale)
      .then(setPost)
      .catch(() => setPost(null))
      .finally(() => setLoading(false));
  }, [id, locale]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-[var(--color-muted-foreground)]">Loading...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-2xl font-semibold">{t('public.notFoundPost')}</div>
          <Link to="/blog" className="text-[var(--color-primary)] hover:underline">
            {t('nav.blog')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="py-16">
        <div className="mx-auto max-w-[var(--container-width)] px-5">
          <div className="mb-4 text-sm text-[var(--color-muted-foreground)]">
            <Link to="/" className="hover:underline">
              {t('nav.home')}
            </Link>{' '}
            /{' '}
            <Link to="/blog" className="hover:underline">
              {t('nav.blog')}
            </Link>
          </div>
          <div className="mb-2 text-sm text-[var(--color-muted-foreground)]">{post.date}</div>
          <h1 className="mb-6 text-5xl font-bold leading-tight">{post.title}</h1>
          {post.tags && post.tags.length > 0 && (
            <div className="mb-8 flex flex-wrap gap-2">
              {post.tags.map((tag, i) => (
                <span
                  key={i}
                  className="rounded-lg border border-[var(--color-line)] bg-[var(--color-card)] px-3 py-1.5 text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-[var(--container-width)] px-5">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2">
              <div
                className="prose prose-invert max-w-none text-[var(--color-platinum)] prose-headings:text-[var(--color-platinum)] prose-p:text-[var(--color-muted)] prose-a:text-[var(--color-accent-2)]"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>
            <div className="rounded-lg border border-[var(--color-line)] bg-[var(--color-card)] p-6">
              <h3 className="mb-4 text-xl font-semibold">{t('public.postHelpTitle')}</h3>
              <p className="mb-6 text-sm text-[var(--color-muted-foreground)]">{t('public.postHelpCopy')}</p>
              <Link
                to="/contact"
                className="block rounded-lg bg-[var(--color-accent)] px-4 py-3 text-center text-sm font-medium transition-colors hover:bg-[var(--color-accent-2)]"
              >
                {t('nav.cta')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

