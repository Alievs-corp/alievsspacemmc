import { useMemo, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, Plus, Trash2, X } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import { btn } from '@/components/admin/ui';
import { cn } from '@/lib/utils';
import { num, sum, uid } from './financeUtils';

export interface PaySalary { id: string; name: string; card: string; cash: string; bonus: string }
export interface PayRow { id: string; salaryId: string; month: string; date: string; amount: string; description: string }


const pad = (n: number) => String(n).padStart(2, '0');
const monthOf = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
const shiftMonth = (m: string, by: number) => {
  const [y, mo] = m.split('-').map(Number);
  return monthOf(new Date(y, mo - 1 + by, 1));
};
const lastDay = (m: string) => {
  const [y, mo] = m.split('-').map(Number);
  return `${m}-${pad(new Date(y, mo, 0).getDate())}`;
};

/**
 * Monthly salary payments: pick a month, then record every payment per
 * employee (date + amount). Partial payments are normal, so an employee can
 * have several rows; the row shows what is left and when it is paid in full.
 */
export function MonthlyPayments({
  salaries, payments, currency, onChange, onClose,
}: {
  salaries: PaySalary[];
  payments: PayRow[];
  currency: string;
  onChange: (next: PayRow[]) => void;
  onClose: () => void;
}) {
  const { t, localeTag } = useI18n();
  const P = 'panel.finance.payments.';
  const [month, setMonth] = useState(() => monthOf(new Date()));

  const label = useMemo(() => {
    const [y, mo] = month.split('-').map(Number);
    return new Intl.DateTimeFormat(localeTag, { month: 'long', year: 'numeric' }).format(new Date(y, mo - 1, 1));
  }, [month, localeTag]);

  const money = (n: number) => `${n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })} ${currency}`;
  const employees = salaries.filter((s) => s.name.trim());
  const inMonth = payments.filter((p) => p.month === month);

  const rows = employees.map((s) => {
    const due = num(s.card) + num(s.cash) + num(s.bonus);
    const mine = inMonth.filter((p) => p.salaryId === s.id);
    const paid = sum(mine.map((p) => num(p.amount)));
    return { s, due, mine, paid, left: due - paid };
  });
  const totals = { due: sum(rows.map((r) => r.due)), paid: sum(rows.map((r) => r.paid)) };

  const patch = (id: string, p: Partial<PayRow>) => onChange(payments.map((x) => (x.id === id ? { ...x, ...p } : x)));
  const remove = (id: string) => onChange(payments.filter((x) => x.id !== id));
  const add = (salaryId: string, left: number) => {
    const today = new Date();
    const date = monthOf(today) === month ? `${month}-${pad(today.getDate())}` : `${month}-01`;
    onChange([...payments, { id: uid(), salaryId, month, date, amount: left > 0 ? String(Math.round(left * 100) / 100) : '', description: '' }]);
  };

  const status = (paid: number, left: number) => {
    if (paid > 0 && left < -0.005) return { text: t(P + 'over'), cls: 'bg-warning/15 text-warning' };
    if (paid > 0 && left <= 0.005) return { text: t(P + 'closed'), cls: 'bg-success/15 text-success' };
    if (paid > 0) return { text: t(P + 'partial'), cls: 'bg-warning/15 text-warning' };
    return { text: t(P + 'unpaid'), cls: 'bg-surface-3 text-text-muted' };
  };

  return (
    <section className="card space-y-3 p-3 sm:space-y-5 sm:p-5" aria-label={t(P + 'title')}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="inline-flex items-center gap-2 font-display text-base font-semibold text-text sm:text-lg">
            <CalendarDays className="h-5 w-5 text-primary" /> {t(P + 'title')}
          </h2>
          <p className="mt-0.5 max-w-2xl text-xs text-text-muted sm:text-sm">{t(P + 'hint')}</p>
        </div>
        <button type="button" onClick={onClose} className={btn.ghost} aria-label={t(P + 'close')} title={t(P + 'close')}>
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Month picker */}
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" className={btn.secondary} onClick={() => setMonth(shiftMonth(month, -1))} aria-label={t(P + 'prev')} title={t(P + 'prev')}>
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="min-w-[7.5rem] flex-1 text-center font-display text-base font-semibold capitalize text-text sm:min-w-[10rem] sm:flex-none sm:text-lg" aria-live="polite">{label}</span>
        <button type="button" className={btn.secondary} onClick={() => setMonth(shiftMonth(month, 1))} aria-label={t(P + 'next')} title={t(P + 'next')}>
          <ChevronRight className="h-4 w-4" />
        </button>
        <input type="month" className="field w-auto sm:ml-2" value={month} onChange={(e) => e.target.value && setMonth(e.target.value)} aria-label={label} />
      </div>

      {rows.length === 0 ? (
        <p className="py-4 text-center text-sm text-text-subtle">{t(P + 'noEmployees')}</p>
      ) : (
        <div className="space-y-4">
          {rows.map(({ s, due, mine, paid, left }) => {
            const st = status(paid, left);
            return (
              <div key={s.id} className="rounded-md border border-border bg-surface-2/40 p-2.5 sm:p-4">
                <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
                  <div className="flex min-w-0 items-center gap-3">
                    <h3 className="truncate text-sm font-semibold text-text sm:text-base">{s.name}</h3>
                    <span className={cn('shrink-0 rounded-full px-2 py-0.5 text-[10.5px] font-medium sm:px-2.5 sm:text-xs', st.cls)}>{st.text}</span>
                  </div>
                  <dl className="grid w-full grid-cols-3 gap-x-2 text-[13px] sm:flex sm:w-auto sm:flex-wrap sm:gap-x-6 sm:gap-y-1 sm:text-sm">
                    <div><dt className="text-xs uppercase tracking-wider text-text-subtle">{t(P + 'due')}</dt><dd className="font-mono text-text">{money(due)}</dd></div>
                    <div><dt className="text-xs uppercase tracking-wider text-text-subtle">{t(P + 'paid')}</dt><dd className="font-mono text-success">{money(paid)}</dd></div>
                    <div><dt className="text-xs uppercase tracking-wider text-text-subtle">{t(P + 'left')}</dt><dd className={cn('font-mono', left > 0.005 ? 'text-danger' : 'text-text')}>{money(Math.max(left, 0))}</dd></div>
                  </dl>
                </div>

                {mine.length === 0 ? (
                  <p className="mt-3 text-sm text-text-subtle">{t(P + 'noPayments')}</p>
                ) : (
                  <div className="mt-3 space-y-2">
                    {mine.map((p) => (
                      <div key={p.id} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] items-end gap-x-2 gap-y-1.5 md:grid-cols-[11rem_minmax(0,10rem)_minmax(0,1fr)_2rem]">
                        <label className="block">
                          <span className="mb-0.5 block text-[10px] text-text-subtle sm:text-xs">{t(P + 'date')}</span>
                          <input type="date" className="field" min={`${month}-01`} max={lastDay(month)} value={p.date} onChange={(e) => patch(p.id, { date: e.target.value })} />
                        </label>
                        <label className="block">
                          <span className="mb-0.5 block text-[10px] text-text-subtle sm:text-xs">{t('panel.finance.amount')}</span>
                          <input className="field" inputMode="decimal" placeholder="0" value={p.amount} onChange={(e) => patch(p.id, { amount: e.target.value })} />
                        </label>
                        <label className="col-span-3 block md:col-span-1">
                          <span className="mb-0.5 block text-[10px] text-text-subtle sm:text-xs">{t(P + 'note')}</span>
                          <input className="field" value={p.description} onChange={(e) => patch(p.id, { description: e.target.value })} />
                        </label>
                        <button type="button" onClick={() => remove(p.id)} aria-label={t(P + 'removePayment')} title={t(P + 'removePayment')}
                          className="grid h-9 w-8 place-items-center justify-self-end rounded-md text-text-subtle transition-colors hover:bg-danger/10 hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <button type="button" onClick={() => add(s.id, left)} className={cn(btn.secondary, 'mt-2 px-2.5 py-1.5 text-xs sm:mt-3 sm:px-3.5 sm:py-2 sm:text-sm')}>
                  <Plus className="h-4 w-4" /> {t(P + 'addPayment')}
                </button>
              </div>
            );
          })}
        </div>
      )}

      <dl className="grid grid-cols-3 gap-2 border-t border-border pt-3 sm:flex sm:flex-wrap sm:gap-x-8">
        <div className="min-w-0"><dt className="text-[10px] uppercase leading-tight tracking-wider text-text-subtle sm:text-xs">{t(P + 'totalDue')}</dt><dd className="truncate font-mono text-[13px] font-semibold text-text sm:text-base">{money(totals.due)}</dd></div>
        <div className="min-w-0"><dt className="text-[10px] uppercase leading-tight tracking-wider text-text-subtle sm:text-xs">{t(P + 'totalPaid')}</dt><dd className="truncate font-mono text-[13px] font-semibold text-success sm:text-base">{money(totals.paid)}</dd></div>
        <div className="min-w-0"><dt className="text-[10px] uppercase leading-tight tracking-wider text-text-subtle sm:text-xs">{t(P + 'totalLeft')}</dt><dd className="truncate font-mono text-[13px] font-semibold text-danger sm:text-base">{money(Math.max(totals.due - totals.paid, 0))}</dd></div>
      </dl>
    </section>
  );
}
