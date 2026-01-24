import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import { api, type Service, type Project, type BlogPost, type Career, type Employee, type Inquiry } from '@/lib/api';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';

interface Stats {
  services: number;
  projects: number;
  blog: number;
  careers: number;
  inquiries: number; // leads əvəzinə inquiries
  employees: number;
}

export function AdminDashboard() {
  const { user } = useAuth();
  const { locale, t } = useI18n();
  const [stats, setStats] = useState<Stats>({
    services: 0,
    projects: 0,
    blog: 0,
    careers: 0,
    inquiries: 0, // leads əvəzinə inquiries
    employees: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [services, projects, blog, careers, employees, inquiries] = await Promise.all([
          api.getServices(locale) as Promise<Service[]>,
          api.getProjects(locale) as Promise<Project[]>,
          api.getBlogPosts(locale) as Promise<BlogPost[]>,
          api.getCareers(locale) as Promise<Career[]>,
          api.getEmployees(locale) as Promise<Employee[]>,
          api.admin.getInquiries() as Promise<Inquiry[]>, // getLeads əvəzinə getInquiries
        ]);

        setStats({
          services: services?.length || 0,
          projects: projects?.length || 0,
          blog: blog?.length || 0,
          careers: careers?.length || 0,
          employees: employees?.length || 0,
          inquiries: inquiries?.length || 0, // leads əvəzinə inquiries
        });
      } catch (error) {
        console.error('Failed to load stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [locale]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">{t('admin.overview')}</h1>
        <p className="mt-2 text-[#808087]">
          {t('admin.welcome')}, {user?.name}. {t('admin.manageContent')}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-[#546691] bg-[#13132F] p-6">
          <h2 className="text-xl font-semibold mb-4 text-white">{t('admin.quickActions')}</h2>
          <div className="grid gap-3">
            <Button asChild variant="default">
              <Link to="/admin/services">{t('admin.editServices')}</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/admin/projects">{t('admin.editProjects')}</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/admin/blog">{t('admin.editBlog')}</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/admin/inquiries">{t('admin.viewInquiries')}</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/admin/users">{t('admin.manageUsers')}</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/admin/home">{t('admin.editHome')}</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/admin/about">{t('admin.editAbout')}</Link>
            </Button>
          </div>
        </div>

        <div className="rounded-lg border border-[#546691] bg-[#13132F] p-6">
          <h2 className="text-xl font-semibold mb-4 text-white">{t('admin.status')}</h2>
          {loading ? (
            <div className="text-sm text-[#808087]">{t('admin.loading')}</div>
          ) : (
            <div className="text-sm text-[#808087] space-y-1">
              <div>{t('admin.services')}: {stats.services}</div>
              <div>{t('admin.projects')}: {stats.projects}</div>
              <div>{t('admin.blog')}: {stats.blog}</div>
              <div>{t('admin.careers')}: {stats.careers}</div>
              <div>{t('admin.users')}: {stats.employees}</div>
              <div>{t('admin.inquiries')}: {stats.inquiries}</div>
            </div>
          )}
          <div className="mt-4 pt-4 border-t border-[#546691]">
            <p className="text-xs text-[#808087]">
              {t('admin.tip')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}