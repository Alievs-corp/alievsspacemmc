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
  const { locale } = useI18n();
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
        <h1 className="text-3xl font-bold">Overview</h1>
        <p className="mt-2 text-[var(--color-muted-foreground)]">
          Welcome back, {user?.name}. Manage your site content, services, projects, blog posts, careers, and inquiries.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid gap-3">
            <Button asChild variant="default">
              <Link to="/admin/services">Edit Services</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/admin/projects">Edit Projects</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/admin/blog">Edit Blog</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/admin/inquiries">View Inquiries</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/admin/users">Manage Users</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/admin/home">Edit Home</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/admin/about">Edit About</Link>
            </Button>
          </div>
        </div>

        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-6">
          <h2 className="text-xl font-semibold mb-4">Status</h2>
          {loading ? (
            <div className="text-sm text-[var(--color-muted-foreground)]">Loading...</div>
          ) : (
            <div className="text-sm text-[var(--color-muted-foreground)] space-y-1">
              <div>Services: {stats.services}</div>
              <div>Projects: {stats.projects}</div>
              <div>Blog Posts: {stats.blog}</div>
              <div>Careers: {stats.careers}</div>
              <div>Employees: {stats.employees}</div>
              <div>Inquiries: {stats.inquiries}</div> {/* Leads əvəzinə Inquiries */}
            </div>
          )}
          <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
            <p className="text-xs text-[var(--color-muted-foreground)]">
              Tip: Use Settings → Export JSON to save a backup.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}