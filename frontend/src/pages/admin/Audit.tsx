import { useSearchParams } from 'react-router-dom';
import { Banknote, HandCoins, ScrollText, TrendingUp, type LucideIcon } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import { cn } from '@/lib/utils';
import { AdminAuditLog } from './AuditLog';
import { FinanceSheet, type FinanceSection } from './Finance';

type Tab = FinanceSection | 'log';

const TABS: Array<{ id: Tab; icon: LucideIcon; key: string }> = [
  { id: 'salaries', icon: Banknote, key: 'tabSalaries' },
  { id: 'debts', icon: HandCoins, key: 'tabDebts' },
  { id: 'income', icon: TrendingUp, key: 'tabIncome' },
  { id: 'log', icon: ScrollText, key: 'tabLog' },
];

/**
 * Audit (super admin): salaries, debts and payments, income and expected
 * payments, and the activity log. The four sections sit side by side as small
 * boxes and open one at a time. The finance sheet stays mounted so unsaved
 * edits survive switching boxes.
 */
export function AdminAudit() {
  const { t } = useI18n();
  const [params, setParams] = useSearchParams();
  const raw = params.get('tab');
  const tab: Tab = TABS.some((x) => x.id === raw) ? (raw as Tab) : 'salaries';

  return (
    <div className="space-y-4 sm:space-y-6">
      <h1 className="font-display text-xl font-bold text-text sm:text-3xl">{t('panel.audit.title')}</h1>

      <div role="tablist" aria-label={t('panel.audit.title')} className="grid grid-cols-4 gap-1.5 sm:gap-3">
        {TABS.map(({ id, icon: Icon, key }) => {
          const active = tab === id;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setParams(id === 'salaries' ? {} : { tab: id }, { replace: true })}
              className={cn(
                'flex min-w-0 flex-col items-center justify-center gap-1 rounded-lg border px-1 py-2 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus sm:flex-row sm:gap-2.5 sm:px-4 sm:py-3',
                active
                  ? 'border-primary bg-primary text-on-primary shadow-sm'
                  : 'border-border bg-surface-2 text-text-muted hover:border-border-strong hover:bg-surface-3 hover:text-text',
              )}
            >
              <Icon className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" aria-hidden />
              <span className="w-full truncate text-[10.5px] font-medium leading-tight sm:text-sm">{t(`panel.audit.${key}`)}</span>
            </button>
          );
        })}
      </div>

      <FinanceSheet section={tab === 'log' ? 'salaries' : tab} hidden={tab === 'log'} />
      {tab === 'log' && <AdminAuditLog embedded />}
    </div>
  );
}
