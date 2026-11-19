import { useState, type ReactNode } from 'react';
import { Check, ChevronDown, Plus, Trash2 } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import { btn } from '@/components/admin/ui';
import { cn } from '@/lib/utils';
import { num, sum, uid } from './financeUtils';

export interface SettleRow { id: string; date: string; amount: string; description: string }
export interface DealRow { id: string; name: string; amount: string; date: string; description: string; settlements: SettleRow[] }

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const rowCols = 'md:grid-cols-[minmax(0,1.3fr)_minmax(0,.8fr)_minmax(9.5rem,1fr)_minmax(0,1.4fr)_minmax(0,1.5fr)_auto]';

/**
 * Debts (money we owe) and expected payments (money owed to us) work the same
 * way: each entry has a full amount, and money can be marked as paid / received
 * in parts. The stats on top are only about these entries, never salaries.
 */
export function DealsSection({
  ns, rows, onRows, currency, tone,
}: {
  /** i18n namespace: 'panel.finance.debts.' or 'panel.finance.income.' */
  ns: string;
  rows: DealRow[];
  onRows: (next: DealRow[]) => void;
  currency: string;
  /** Debts are bad news while unpaid; expected income is good news once received. */
  tone: 'debt' | 'income';
}) {
  const { t } = useI18n();
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const money = (n: number) => `${n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })} ${currency}`;

  const calc = rows.map((r) => {
    const total = num(r.amount);
    const done = sum(r.settlements.map((x) => num(x.amount)));
    return { r, total, done, left: Math.max(total - done, 0) };
  });
  const total = sum(calc.map((c) => c.total));
  const done = sum(calc.map((c) => c.done));
  const left = sum(calc.map((c) => c.left));
  const pct = total > 0 ? Math.min(100, Math.round((Math.min(done, total) / total) * 100)) : 0;

  const patch = (id: string, p: Partial<DealRow>) => onRows(rows.map((r) => (r.id === id ? { ...r, ...p } : r)));
  const setSettle = (id: string, next: (s: SettleRow[]) => SettleRow[]) =>
    onRows(rows.map((r) => (r.id === id ? { ...r, settlements: next(r.settlements) } : r)));
  const addSettle = (r: DealRow, amount: number) => {
    setSettle(r.id, (s) => [...s, { id: uid(), date: today(), amount: amount > 0 ? String(Math.round(amount * 100) / 100) : '', description: '' }]);
    setOpen((o) => ({ ...o, [r.id]: true }));
  };
  const remove = (r: DealRow) => {
    if (!confirm(t('panel.finance.confirmRemove'))) return;
    onRows(rows.filter((x) => x.id !== r.id));
  };

  const stat = (label: string, value: string, cls?: string): ReactNode => (
    <div className="min-w-0">
      <dt className="text-[10px] uppercase leading-tight tracking-wider text-text-subtle sm:text-xs">{label}</dt>
      <dd className={cn('truncate font-mono text-[13px] font-semibold sm:text-lg', cls ?? 'text-text')}>{value}</dd>
    </div>
  );

  const status = (c: (typeof calc)[number]) => {
    if (c.total > 0 && c.left <= 0.005 && c.done > 0) return { text: t(ns + 'statusDone'), cls: 'bg-success/15 text-success' };
    if (c.done > 0) return { text: t(ns + 'statusPartial'), cls: 'bg-warning/15 text-warning' };
    return { text: t(ns + 'statusNone'), cls: 'bg-surface-3 text-text-muted' };
  };

  return (
    <section className="card space-y-3 p-3 sm:space-y-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-display text-base font-semibold text-text sm:text-lg">{t(ns + 'title')}</h2>
          <p className="mt-0.5 text-xs text-text-muted sm:text-sm">{t(ns + 'hint')}</p>
        </div>
        <button
          type="button"
          onClick={() => onRows([...rows, { id: uid(), name: '', amount: '', date: '', description: '', settlements: [] }])}
          className={cn(btn.primary, 'px-2.5 py-1.5 text-xs sm:px-3.5 sm:py-2 sm:text-sm')}
        >
          <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> {t(ns + 'add')}
        </button>
      </div>

      {/* Overall stats: updates as payments are marked */}
      <div className="space-y-2 rounded-md border border-border bg-surface-2/40 p-2.5 sm:p-4">
        <dl className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:gap-x-10">
          {stat(t(ns + 'totalLabel'), money(total))}
          {stat(t(ns + 'doneLabel'), money(done), 'text-success')}
          {stat(t(ns + 'leftLabel'), money(left), left > 0.005 ? (tone === 'debt' ? 'text-danger' : 'text-warning') : 'text-text')}
        </dl>
        <div className="h-1.5 overflow-hidden rounded-full bg-surface-3" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
          <div className="h-full rounded-full bg-success transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {rows.length === 0 ? (
        <p className="py-4 text-center text-sm text-text-subtle">{t(ns + 'empty')}</p>
      ) : (
        <div className="space-y-2 sm:space-y-3">
          <div className={cn('hidden gap-3 px-1 text-xs uppercase tracking-wider text-text-subtle md:grid', rowCols)}>
            <span>{t('panel.finance.name')}</span>
            <span>{t('panel.finance.amount')}</span>
            <span>{t(ns + 'dueDate')}</span>
            <span>{t('panel.finance.description')}</span>
            <span>{t(ns + 'progress')}</span>
            <span />
          </div>
          {calc.map((c) => {
            const { r } = c;
            const st = status(c);
            const isOpen = !!open[r.id];
            return (
              <div key={r.id} className="rounded-md border border-border bg-surface-2/40 p-2 sm:p-3 md:border-0 md:bg-transparent md:p-0">
                <div className={cn('grid grid-cols-6 gap-x-2 gap-y-1.5 md:items-center md:gap-3', rowCols)}>
                  <Cell label={t('panel.finance.name')} className="col-span-6 md:col-span-1"><input className="field" value={r.name} onChange={(e) => patch(r.id, { name: e.target.value })} aria-label={t('panel.finance.name')} /></Cell>
                  <Cell label={t('panel.finance.amount')} className="col-span-3 md:col-span-1"><input className="field" inputMode="decimal" placeholder="0" value={r.amount} onChange={(e) => patch(r.id, { amount: e.target.value })} aria-label={t('panel.finance.amount')} /></Cell>
                  <Cell label={t(ns + 'dueDate')} className="col-span-3 md:col-span-1"><input className="field" type="date" value={r.date} onChange={(e) => patch(r.id, { date: e.target.value })} aria-label={t(ns + 'dueDate')} /></Cell>
                  <Cell label={t('panel.finance.description')} className="col-span-6 md:col-span-1"><input className="field" value={r.description} onChange={(e) => patch(r.id, { description: e.target.value })} aria-label={t('panel.finance.description')} /></Cell>
                  <div className="col-span-6 flex items-center justify-between gap-2 md:contents">
                  <div className="min-w-0 space-y-0.5 text-sm">
                    <span className={cn('inline-block rounded-full px-2 py-0.5 text-[10.5px] font-medium sm:px-2.5 sm:text-xs', st.cls)}>{st.text}</span>
                    <p className="truncate font-mono text-[10.5px] text-text-muted sm:text-xs">
                      {money(c.done)} <span className="text-text-subtle">/</span> {money(c.total)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center justify-end gap-0.5 sm:gap-1">
                    {c.left > 0.005 && (
                      <button type="button" onClick={() => addSettle(r, c.left)} className={cn(btn.secondary, 'px-2 py-1 text-xs sm:px-3.5 sm:py-2 sm:text-sm')} title={t(ns + 'markDoneHint')}>
                        <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> {t(ns + 'markDone')}
                      </button>
                    )}
                    <button type="button" onClick={() => setOpen((o) => ({ ...o, [r.id]: !isOpen }))} aria-expanded={isOpen}
                      aria-label={t(ns + 'settlementsTitle')} title={t(ns + 'settlementsTitle')}
                      className="grid h-9 w-8 place-items-center rounded-md text-text-subtle transition-colors hover:bg-surface-3 hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                      <ChevronDown className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')} />
                    </button>
                    <button type="button" onClick={() => remove(r)} aria-label={t('panel.finance.remove')} title={t('panel.finance.remove')}
                      className="grid h-9 w-8 place-items-center rounded-md text-text-subtle transition-colors hover:bg-danger/10 hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  </div>
                </div>

                {isOpen && (
                  <div className="mt-2 space-y-2 rounded-md border border-border bg-surface-2/50 p-2 sm:mt-3 sm:p-3">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-text-subtle">{t(ns + 'settlementsTitle')}</h3>
                    {r.settlements.length === 0 && <p className="text-sm text-text-subtle">{t(ns + 'noSettlements')}</p>}
                    {r.settlements.map((s) => (
                      <div key={s.id} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] items-end gap-x-2 gap-y-1.5 md:grid-cols-[11rem_minmax(0,10rem)_minmax(0,1fr)_2rem]">
                        <label className="block">
                          <span className="mb-0.5 block text-[10px] text-text-subtle sm:text-xs">{t(ns + 'doneOn')}</span>
                          <input type="date" className="field" value={s.date} onChange={(e) => setSettle(r.id, (list) => list.map((x) => (x.id === s.id ? { ...x, date: e.target.value } : x)))} />
                        </label>
                        <label className="block">
                          <span className="mb-0.5 block text-[10px] text-text-subtle sm:text-xs">{t('panel.finance.amount')}</span>
                          <input className="field" inputMode="decimal" placeholder="0" value={s.amount} onChange={(e) => setSettle(r.id, (list) => list.map((x) => (x.id === s.id ? { ...x, amount: e.target.value } : x)))} />
                        </label>
                        <label className="col-span-3 block md:col-span-1">
                          <span className="mb-0.5 block text-[10px] text-text-subtle sm:text-xs">{t('panel.finance.payments.note')}</span>
                          <input className="field" value={s.description} onChange={(e) => setSettle(r.id, (list) => list.map((x) => (x.id === s.id ? { ...x, description: e.target.value } : x)))} />
                        </label>
                        <button type="button" onClick={() => setSettle(r.id, (list) => list.filter((x) => x.id !== s.id))}
                          aria-label={t(ns + 'removeSettlement')} title={t(ns + 'removeSettlement')}
                          className="grid h-9 w-8 place-items-center justify-self-end rounded-md text-text-subtle transition-colors hover:bg-danger/10 hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <button type="button" onClick={() => addSettle(r, c.left)} className={btn.secondary}>
                      <Plus className="h-4 w-4" /> {t(ns + 'addSettlement')}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function Cell({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <label className={cn('block min-w-0', className)}>
      <span className="mb-0.5 block text-[10px] text-text-subtle sm:text-xs md:hidden">{label}</span>
      {children}
    </label>
  );
}
