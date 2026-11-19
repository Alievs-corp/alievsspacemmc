import { useSearchParams } from 'react-router-dom';
import { Landmark, ScrollText } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import { PageHeader } from '@/components/admin/ui';
import { cn } from '@/lib/utils';
import { AdminAuditLog } from './AuditLog';
import { FinanceSheet } from './Finance';

/** Audit (super admin): the finance sheet and the log of administrative actions. */
export function AdminAudit() {
  const { t } = useI18n();
  const [params, setParams] = useSearchParams();
  const tab = params.get('tab') === 'log' ? 'log' : 'finance';

  const tabs = [
    { id: 'finance', label: t('panel.audit.tabFinance'), icon: Landmark },
    { id: 'log', label: t('panel.audit.tabLog'), icon: ScrollText },
  ] as const;

  return (
    <div className="space-y-6">
      <PageHeader title={t('panel.audit.title')} />

      <div role="tablist" className="inline-flex gap-1 rounded-lg border border-border bg-surface-2 p-1">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            onClick={() => setParams(id === 'finance' ? {} : { tab: id }, { replace: true })}
            className={cn(
              'inline-flex items-center gap-2 rounded-md px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
              tab === id ? 'bg-primary text-on-primary' : 'text-text-muted hover:bg-surface-3 hover:text-text',
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {tab === 'finance' ? <FinanceSheet /> : <AdminAuditLog embedded />}
    </div>
  );
}
