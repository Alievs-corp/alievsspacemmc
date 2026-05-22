import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import { api, type Service, type Project, type BlogPost, type Career, type Employee, type Inquiry } from '@/lib/api';
import { useState, useEffect } from 'react';
import {
  Briefcase, FolderKanban, FileText, GraduationCap, Users, Mail, ArrowRight, Inbox,
} from 'lucide-react';

interface Stats {
  services: number; projects: number; blog: number; careers: number; employees: number; inquiries: number;
}

export function AdminDashboard() {
  const { user } = useAuth();
  const { locale, t } = useI18n();
  const [stats, setStats] = useState<Stats>({ services: 0, projects: 0, blog: 0, careers: 0, employees: 0, inquiries: 0 });
  const [recent, setRecent] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const [services, projects, blog, careers, employees, inquiries] = await Promise.all([
          api.getServices(locale) as Promise<Service[]>,
          api.getProjects(locale) as Promise<Project[]>,
          api.getBlogPosts(locale) as Promise<BlogPost[]>,
          api.getCareers(locale) as Promise<Career[]>,
          api.getEmployees(locale) as Promise<Employee[]>,
          api.admin.getInquiries() as Promise<Inquiry[]>,
        ]);
        if (!active) return;
        setStats({
          services: services?.length || 0,
          projects: projects?.length || 0,
          blog: blog?.length || 0,
          careers: careers?.length || 0,
          employees: employees?.length || 0,
          inquiries: inquiries?.length || 0,
        });
        setRecent((inquiries || []).slice(0, 5));
      } catch (error) {
        console.error('Failed to load stats:', error);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [locale]);

  const cards = [
    { key: 'services', value: stats.services, labelKey: 'admin.services', icon: Briefcase, to: '/admin/services' },
    { key: 'projects', value: stats.projects, labelKey: 'admin.projects', icon: FolderKanban, to: '/admin/projects' },
    { key: 'blog', value: stats.blog, labelKey: 'admin.blog', icon: FileText, to: '/admin/blog' },
    { key: 'careers', value: stats.careers, labelKey: 'admin.careers', icon: GraduationCap, to: '/admin/careers' },
    { key: 'employees', value: stats.employees, labelKey: 'admin.team', icon: Users, to: '/admin/careers' },
    { key: 'inquiries', value: stats.inquiries, labelKey: 'admin.inquiries', icon: Mail, to: '/admin/inquiries' },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-2xl font-bold text-text sm:text-3xl">{t('admin.overview', 'Overview')}</h1>
        <p className="mt-1 text-text-muted">
          {t('admin.welcome', 'Welcome')}{user?.name ? `, ${user.name}` : ''}. {t('admin.manageContent', 'Manage your site content here.')}
        </p>
      </header>

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {cards.map((c) => {
          const Ico = c.icon;
          return (
            <Link key={c.key} to={c.to} className="card card-interactive flex items-center gap-4 p-5">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-surface-3 text-primary">
                <Ico className="h-6 w-6" />
              </span>
              <span className="min-w-0">
                <span className="block font-display text-3xl font-bold tabular-nums leading-none text-text">
                  {loading ? <span className="inline-block h-7 w-10 animate-pulse rounded bg-surface-3 align-middle" /> : c.value}
                </span>
                <span className="mt-1 block truncate text-sm text-text-muted">{t(c.labelKey)}</span>
              </span>
            </Link>
          );
        })}
      </div>

      {/* Recent inquiries */}
      <section className="card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-text">{t('admin.recentInquiries', 'Recent inquiries')}</h2>
          <Link to="/admin/inquiries" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-hover">
            {t('admin.viewAll', 'View all')} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => <div key={i} className="h-12 animate-pulse rounded-lg bg-surface-3/60" />)}
          </div>
        ) : recent.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
            <Inbox className="h-10 w-10 text-text-subtle" />
            <p className="text-text-muted">{t('admin.noInquiries', 'No inquiries yet')}</p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {recent.map((q, i) => (
              <li key={q.email || i} className="flex items-center justify-between gap-4 py-3">
                <div className="min-w-0">
                  <p className="truncate font-medium text-text">{q.name || t('admin.unknown', 'Unknown')}</p>
                  <p className="truncate text-sm text-text-subtle">{q.email}</p>
                </div>
                {q.interest && (
                  <span className="hidden shrink-0 rounded-full bg-surface-3 px-2.5 py-1 text-xs text-text-muted sm:inline">
                    {q.interest}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
