import { useState, useEffect } from 'react';
import { api, type BlogPost, type Locale } from '@/lib/api';
import { useI18n } from '@/contexts/I18nContext';
import { Button } from '@/components/ui/Button';

export function AdminBlog() {
  const { locale, supportedLocales } = useI18n();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<Locale, Partial<BlogPost>>>({
    en: { title: '', date: '', excerpt: '', tags: [], content: '' },
    az: { title: '', date: '', excerpt: '', tags: [], content: '' },
    ru: { title: '', excerpt: '', tags: [], content: '' },
  });
  const [tagsText, setTagsText] = useState<Record<Locale, string>>({
    en: '',
    az: '',
    ru: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPosts();
  }, [locale]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await api.getBlogPosts(locale);
      setPosts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingId(post.id);
    const loadAllLocales = async () => {
      const locales: Locale[] = ['en', 'az', 'ru'];
      const data: Record<Locale, Partial<BlogPost>> = {
        en: {},
        az: {},
        ru: {},
      };
      const tags: Record<Locale, string> = { en: '', az: '', ru: '' };

      for (const loc of locales) {
        try {
          const p = await api.getBlogPost(post.id, loc);
          if (p) {
            data[loc] = p;
            tags[loc] = (p.tags || []).join(', ');
          }
        } catch {
          data[loc] = { title: '', date: new Date().toISOString().slice(0, 10), excerpt: '', tags: [], content: '' };
        }
      }

      setFormData(data);
      setTagsText(tags);
    };
    loadAllLocales();
  };

  const handleNew = () => {
    setEditingId(null);
    const today = new Date().toISOString().slice(0, 10);
    setFormData({
      en: { title: '', date: today, excerpt: '', tags: [], content: '' },
      az: { title: '', date: today, excerpt: '', tags: [], content: '' },
      ru: { title: '', date: today, excerpt: '', tags: [], content: '' },
    });
    setTagsText({ en: '', az: '', ru: '' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    try {
      await api.admin.deleteBlogPost(id);
      await loadPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete blog post');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      // Save per-locale using API contract
      for (const loc of supportedLocales.map((l) => l.code as Locale)) {
        const tags = tagsText[loc]
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);

        const payload: Partial<BlogPost> = {
          ...formData[loc],
          tags,
        };

        if (editingId) {
          await api.admin.updateBlogPost(editingId, loc, payload);
        } else {
          await api.admin.createBlogPost(loc, payload);
        }
      }

      await loadPosts();
      handleNew();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save blog post');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-[var(--color-muted-foreground)]">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Blog</h1>
          <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
            Manage blog posts. Content supports basic HTML.
          </p>
        </div>
        <Button onClick={handleNew}>New post</Button>
      </div>

      {error && (
        <div className="rounded-md bg-[var(--color-destructive)]/10 p-3 text-sm text-[var(--color-destructive)]">
          {error}
        </div>
      )}

      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] overflow-hidden">
        <table className="w-full">
          <thead className="bg-[var(--color-muted)]/50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Title</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Excerpt</th>
              <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {posts.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-sm text-[var(--color-muted-foreground)]">
                  No blog posts yet. Click "New post" to create one.
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} className="hover:bg-[var(--color-accent)]/50">
                  <td className="px-4 py-3 text-sm">{post.date}</td>
                  <td className="px-4 py-3 text-sm font-medium">{post.title}</td>
                  <td className="px-4 py-3 text-sm text-[var(--color-muted-foreground)] line-clamp-2">
                    {post.excerpt}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(post)}>
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(post.id)}
                        className="text-[var(--color-destructive)]"
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-6">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? 'Edit post' : 'Create post'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {supportedLocales.map((loc) => {
            const locCode = loc.code as Locale;
            return (
              <div key={locCode} className="space-y-4 p-4 border border-[var(--color-border)] rounded-lg">
                <h3 className="font-medium">{loc.label}</h3>
                <div className="grid gap-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium mb-1">Date</label>
                      <input
                        type="date"
                        value={formData[locCode].date || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            [locCode]: { ...formData[locCode], date: e.target.value },
                          })
                        }
                        className="w-full rounded-md border border-[var(--color-input)] bg-[var(--color-background)] px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Tags (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={tagsText[locCode]}
                        onChange={(e) =>
                          setTagsText({ ...tagsText, [locCode]: e.target.value })
                        }
                        placeholder="E-commerce, UX"
                        className="w-full rounded-md border border-[var(--color-input)] bg-[var(--color-background)] px-3 py-2 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <input
                      type="text"
                      value={formData[locCode].title || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [locCode]: { ...formData[locCode], title: e.target.value },
                        })
                      }
                      placeholder="Post title"
                      className="w-full rounded-md border border-[var(--color-input)] bg-[var(--color-background)] px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Excerpt</label>
                    <input
                      type="text"
                      value={formData[locCode].excerpt || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [locCode]: { ...formData[locCode], excerpt: e.target.value },
                        })
                      }
                      placeholder="Short excerpt"
                      className="w-full rounded-md border border-[var(--color-input)] bg-[var(--color-background)] px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">HTML Content</label>
                    <textarea
                      value={formData[locCode].content || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [locCode]: { ...formData[locCode], content: e.target.value },
                        })
                      }
                      placeholder="<p>Write content…</p>"
                      rows={10}
                      className="w-full rounded-md border border-[var(--color-input)] bg-[var(--color-background)] px-3 py-2 text-sm font-mono"
                    />
                    <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">
                      Tip: Use &lt;p&gt;...&lt;/p&gt; and simple tags.
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="flex gap-3">
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
            <Button type="button" variant="outline" onClick={handleNew}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

