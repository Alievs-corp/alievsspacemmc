import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Building2, Plus, Pencil, Globe, Trash2, ArrowLeft } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import { useCrm } from '@/contexts/CrmContext';
import { crm, scopeCan, type Company, type CompanyInput } from '@/lib/crm';
import { ApiError } from '@/lib/api';
import { EmptyState, ErrorState, LoadingRows, Notice, PageHeader, Spinner, btn, errorMessage } from '@/components/admin/ui';
import { useLoad } from '@/components/crm/useLoad';
import { Drawer, Field, ProjectStatusBadge, plural } from '@/components/crm/ui';
import { ProjectList } from './Projects';
import { TeamList } from './Team';
import { ActivityFeed } from './Activity';

export function CompanyLogo({ company, size = 'md' }: { company: Pick<Company, 'name' | 'logoUrl'>; size?: 'md' | 'lg' }) {
  const cls = size === 'lg' ? 'h-14 w-14 text-lg' : 'h-10 w-10 text-sm';
  if (company.logoUrl) return <img src={company.logoUrl} alt="" className={`${cls} shrink-0 rounded-lg border border-border bg-surface-2 object-cover`} />;
  return (
    <span className={`${cls} flex shrink-0 items-center justify-center rounded-lg border border-border bg-surface-3 font-display font-semibold text-text-muted`}>
      {company.name.slice(0, 2).toUpperCase()}
    </span>
  );
}

export function CompanyForm({ company, open, onClose, onSaved }: {
  company: Company | null; open: boolean; onClose: () => void; onSaved: (c: Company) => void;
}) {
  const { t } = useI18n();
  const [form, setForm] = useState<CompanyInput>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setForm(company ? { name: company.name, description: company.description, logoUrl: company.logoUrl, website: company.website, status: company.status } : { status: 'active' });
      setError(null);
    }
  }, [open, company]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const saved = company ? await crm.updateCompany(company.id, form) : await crm.createCompany(form);
      onSaved(saved);
      onClose();
    } catch (err) {
      setError(errorMessage(err, t('crm.saveFailed', 'Could not save.')));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={company ? t('crm.companies.edit', 'Edit company') : t('crm.companies.new', 'New company')}
      footer={<>
        <button type="button" onClick={onClose} className={btn.secondary}>{t('ui.cancel', 'Cancel')}</button>
        <button type="submit" form="company-form" disabled={saving || !form.name?.trim()} className={btn.primary}>
          {saving && <Spinner />} {t('account.profile.save', 'Save changes')}
        </button>
      </>}
    >
      <form id="company-form" onSubmit={save} className="space-y-4">
        {error && <Notice>{error}</Notice>}
        <Field label={t('crm.fields.name', 'Name')} htmlFor="co-name">
          <input id="co-name" className="field" required maxLength={200} value={form.name ?? ''} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </Field>
        <Field label={t('crm.fields.description', 'Description')} htmlFor="co-desc">
          <textarea id="co-desc" className="field" rows={4} value={form.description ?? ''} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </Field>
        <Field label={t('crm.fields.logo', 'Logo URL')} htmlFor="co-logo" hint={t('crm.fields.logoHint', 'A link to an https image. Uploads arrive with the Media Library.')}>
          <input id="co-logo" type="url" className="field" placeholder="https://…" value={form.logoUrl ?? ''} onChange={(e) => setForm({ ...form, logoUrl: e.target.value })} />
        </Field>
        <Field label={t('crm.fields.website', 'Website')} htmlFor="co-web">
          <input id="co-web" className="field" placeholder="example.com" value={form.website ?? ''} onChange={(e) => setForm({ ...form, website: e.target.value })} />
        </Field>
        {company && (
          <Field label={t('panel.users.status', 'Status')} htmlFor="co-status" hint={t('crm.companies.archiveHint', 'Archiving keeps all projects, tasks and access; it only marks the company as inactive.')}>
            <select id="co-status" className="field" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Company['status'] })}>
              <option value="active">{t('crm.status.active', 'Active')}</option>
              <option value="archived">{t('crm.status.archived', 'Archived')}</option>
            </select>
          </Field>
        )}
      </form>
    </Drawer>
  );
}

export function CrmCompanies() {
  const { t } = useI18n();
  const { adminMode, readOnly } = useCrm();
  const [creating, setCreating] = useState(false);
  const [status, setStatus] = useState('');

  const { data: items, error, reload: load } = useLoad<Company[]>(() => crm.companies(status || undefined), [status]);

  return (
    <div className="space-y-6">
      <PageHeader
        title={adminMode ? t('crm.nav.allCompanies', 'All companies') : t('crm.nav.companies', 'Companies')}
        subtitle={t('crm.companies.subtitle', 'Each company has its own projects, team and access rules.')}
        actions={<>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="field py-2 text-sm" aria-label={t('panel.users.status', 'Status')}>
            <option value="">{t('crm.filters.allStatuses', 'All statuses')}</option>
            <option value="active">{t('crm.status.active', 'Active')}</option>
            <option value="archived">{t('crm.status.archived', 'Archived')}</option>
          </select>
          {adminMode && !readOnly && (
            <button onClick={() => setCreating(true)} className={btn.primary}><Plus className="h-4 w-4" /> {t('crm.companies.new', 'New company')}</button>
          )}
        </>}
      />

      {error ? <ErrorState message={error} onRetry={load} /> : !items ? <LoadingRows /> : items.length === 0 ? (
        <EmptyState icon={<Building2 className="h-12 w-12" />} title={t('crm.companies.empty', 'No companies yet')}
          hint={adminMode ? t('crm.companies.emptyHint', 'Create the first company, then add projects and people to it.') : undefined} />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((c) => (
            <Link key={c.id} to={`/crm/companies/${c.id}`} className="card card-interactive flex flex-col gap-3 p-4">
              <div className="flex items-start gap-3">
                <CompanyLogo company={c} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display font-semibold text-text">{c.name}</p>
                  {c.website && <p className="truncate text-xs text-text-subtle">{c.website}</p>}
                </div>
                {c.status !== 'active' && <ProjectStatusBadge status={c.status} />}
              </div>
              {c.description && <p className="line-clamp-2 text-sm text-text-muted">{c.description}</p>}
              <div className="mt-auto flex gap-4 text-xs text-text-subtle">
                <span><b className="text-text">{c.projectCount}</b> {plural(c.projectCount, 'projects', 'project', 'projects')}</span>
                <span><b className="text-text">{c.memberCount}</b> {t('crm.peopleLower', 'people')}</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      <CompanyForm company={null} open={creating} onClose={() => setCreating(false)} onSaved={() => load()} />
    </div>
  );
}

export function CrmCompanyDetail() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { t } = useI18n();
  const { adminMode, readOnly } = useCrm();
  const [editing, setEditing] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const { data: company, error, reload: load } = useLoad<Company>(() => crm.company(id), [id]);

  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!company) return <LoadingRows />;

  const canManage = scopeCan(company.scope, 'company.manage') && !readOnly;

  const remove = async () => {
    if (!window.confirm(t('crm.companies.confirmDelete', 'Delete this company? Only empty companies can be deleted.'))) return;
    setActionError(null);
    try {
      await crm.deleteCompany(company.id);
      navigate('/crm/companies');
    } catch (err) {
      setActionError(err instanceof ApiError && err.code === 'company_not_empty'
        ? t('crm.companies.notEmpty', 'The company has projects. Archive it instead, or delete its projects first.')
        : errorMessage(err, t('crm.saveFailed', 'Could not save.')));
    }
  };

  return (
    <div className="space-y-6">
      <Link to="/crm/companies" className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text"><ArrowLeft className="h-4 w-4" /> {t('crm.nav.companies', 'Companies')}</Link>
      <header className="flex flex-wrap items-start gap-4">
        <CompanyLogo company={company} size="lg" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-2xl font-bold text-text sm:text-3xl">{company.name}</h1>
            <ProjectStatusBadge status={company.status} />
          </div>
          {company.website && (
            <a href={/^https?:\/\//.test(company.website) ? company.website : `https://${company.website}`} target="_blank" rel="noopener noreferrer"
              className="mt-1 inline-flex items-center gap-1 text-sm text-text-muted hover:text-primary"><Globe className="h-3.5 w-3.5" /> {company.website}</a>
          )}
          {company.description && <p className="mt-2 max-w-3xl whitespace-pre-wrap text-text-muted">{company.description}</p>}
        </div>
        <div className="flex gap-2">
          {canManage && <button onClick={() => setEditing(true)} className={btn.secondary}><Pencil className="h-4 w-4" /> {t('crm.edit', 'Edit')}</button>}
          {adminMode && !readOnly && <button onClick={remove} className={btn.danger} aria-label={t('panel.users.delete', 'Delete')}><Trash2 className="h-4 w-4" /></button>}
        </div>
      </header>
      {actionError && <Notice>{actionError}</Notice>}

      <ProjectList companyId={company.id} canCreate={canManage} />
      <TeamList companyId={company.id} title={t('crm.nav.team', 'Team')} />
      <ActivityFeed companyId={company.id} compact />

      <CompanyForm company={company} open={editing} onClose={() => setEditing(false)} onSaved={() => load()} />
    </div>
  );
}
