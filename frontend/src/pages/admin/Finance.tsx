import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { CalendarDays, CheckCircle2, Plus, Trash2 } from 'lucide-react';
import { api, type Finance, type FinanceDebt, type FinanceIncome, type FinanceSettlement } from '@/lib/api';
import { useI18n } from '@/contexts/I18nContext';
import { ErrorState, LoadingRows, btn, errorMessage } from '@/components/admin/ui';
import { cn } from '@/lib/utils';
import { MonthlyPayments, type PayRow } from './FinancePayments';
import { num, sum, uid } from './financeUtils';
import { DealsSection, type DealRow, type SettleRow } from './FinanceDeals';

/*
 * Amounts are kept as the text the user typed (so "0." and "12,5" can be
 * entered) and turned into numbers only for totals and when saving.
 */
interface SalaryRow { id: string; name: string; card: string; cash: string; bonus: string; description: string }
interface Sheet { currency: string; salaries: SalaryRow[]; payments: PayRow[]; debts: DealRow[]; income: DealRow[] }

const CURRENCIES = ['AZN', 'USD', 'EUR', 'RUB', 'TRY', 'GEL'];

const txt = (n: number) => (n ? String(n) : '');

/**
 * Debts and expected payments are "an amount, partly settled". Entries saved
 * earlier as already paid / already received (`settledKind`) become one full
 * settlement, so their totals are unchanged.
 */
const toDeal = (r: FinanceDebt | FinanceIncome, settledKind: string): DealRow => {
  const settlements: SettleRow[] = (r.settlements || []).map((x) => ({ id: x.id || uid(), date: x.date || '', amount: txt(x.amount), description: x.description || '' }));
  if (settlements.length === 0 && r.kind === settledKind && r.amount > 0) {
    settlements.push({ id: uid(), date: r.date || '', amount: txt(r.amount), description: '' });
  }
  return { id: uid(), name: r.name, amount: txt(r.amount), date: r.date || '', description: r.description || '', settlements };
};

const toSettlements = (r: DealRow): FinanceSettlement[] =>
  r.settlements
    .filter((x) => num(x.amount) > 0)
    .map((x) => ({ id: x.id, date: x.date, amount: num(x.amount), description: x.description.trim() }));

const toSheet = (f: Finance): Sheet => ({
  currency: f.currency || 'AZN',
  salaries: (f.salaries || []).map((r) => ({ id: r.id || uid(), name: r.name, card: txt(r.card), cash: txt(r.cash), bonus: txt(r.bonus), description: r.description || '' })),
  payments: (f.payments || []).map((r) => ({ id: r.id || uid(), salaryId: r.salaryId, month: r.month, date: r.date, amount: txt(r.amount), description: r.description || '' })),
  debts: (f.debts || []).map((r) => toDeal(r, 'payment')),
  income: (f.income || []).map((r) => toDeal(r, 'income')),
});

/** Empty rows (no name and no amounts) are dropped on save. */
const toFinance = (s: Sheet): Finance => {
  const salaries = s.salaries
    .filter((r) => r.name.trim() || num(r.card) || num(r.cash) || num(r.bonus))
    .map((r) => ({ id: r.id, name: r.name.trim(), card: num(r.card), cash: num(r.cash), bonus: num(r.bonus), description: r.description.trim() }));
  const kept = new Set(salaries.map((r) => r.id));
  return {
    currency: s.currency,
    salaries,
    // Payments of a dropped (empty) employee row go with it; blank payments are not stored.
    payments: s.payments
      .filter((p) => kept.has(p.salaryId) && num(p.amount) > 0)
      .map((p) => ({ id: p.id, salaryId: p.salaryId, month: p.month, date: p.date || `${p.month}-01`, amount: num(p.amount), description: p.description.trim() })),
    // Debts are money we owe; income entries are money we expect (what was received sits in settlements).
    debts: s.debts
      .filter((r) => r.name.trim() || num(r.amount))
      .map((r) => ({ name: r.name.trim(), kind: 'debt' as const, amount: num(r.amount), date: r.date, description: r.description.trim(), settlements: toSettlements(r) })),
    income: s.income
      .filter((r) => r.name.trim() || num(r.amount))
      .map((r) => ({ name: r.name.trim(), kind: 'expected' as const, amount: num(r.amount), date: r.date, description: r.description.trim(), settlements: toSettlements(r) })),
  };
};

function money(n: number, currency: string) {
  return `${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`;
}

function Section({ title, hint, addLabel, onAdd, extra, children, totals }: { title: string; hint: string; addLabel: string; onAdd: () => void; extra?: ReactNode; children: ReactNode; totals: Array<{ label: string; value: string; tone?: 'good' | 'bad' }> }) {
  return (
    <section className="card space-y-4 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-display text-lg font-semibold text-text">{title}</h2>
          <p className="mt-0.5 text-sm text-text-muted">{hint}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {extra}
          <button type="button" onClick={onAdd} className={btn.primary}>
            <Plus className="h-4 w-4" /> {addLabel}
          </button>
        </div>
      </div>
      {children}
      <dl className="flex flex-wrap gap-x-8 gap-y-2 border-t border-border pt-3">
        {totals.map((tot) => (
          <div key={tot.label}>
            <dt className="text-xs uppercase tracking-wider text-text-subtle">{tot.label}</dt>
            <dd className={cn('font-mono text-base font-semibold', tot.tone === 'good' && 'text-success', tot.tone === 'bad' && 'text-danger', !tot.tone && 'text-text')}>{tot.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/** A labelled cell: the label shows on small screens, where the column header row is hidden. */
function Cell({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <label className={cn('block min-w-0', className)}>
      <span className="mb-1 block text-xs text-text-subtle md:hidden">{label}</span>
      {children}
    </label>
  );
}

function HeaderRow({ cols, labels }: { cols: string; labels: string[] }) {
  return (
    <div className={cn('hidden gap-3 px-1 text-xs uppercase tracking-wider text-text-subtle md:grid', cols)}>
      {labels.map((l, i) => (
        <span key={i}>{l}</span>
      ))}
    </div>
  );
}

const RowShell = ({ cols, children }: { cols: string; children: ReactNode }) => (
  <div className={cn('grid gap-3 rounded-md border border-border bg-surface-2/40 p-3 md:items-center md:border-0 md:bg-transparent md:p-0', cols)}>{children}</div>
);

export function FinanceSheet() {
  const { t } = useI18n();
  const [sheet, setSheet] = useState<Sheet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [showPayments, setShowPayments] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setSheet(toSheet(await api.admin.getFinance()));
      setDirty(false);
    } catch (err) {
      setError(errorMessage(err, t('panel.finance.loadFailed')));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    load();
  }, [load]);

  const edit = (fn: (s: Sheet) => Sheet) => {
    setSheet((s) => (s ? fn(s) : s));
    setDirty(true);
    setSaved(false);
  };

  const patch = <K extends 'salaries' | 'debts' | 'income'>(key: K, i: number, p: Partial<Sheet[K][number]>) =>
    edit((s) => ({ ...s, [key]: s[key].map((r, idx) => (idx === i ? { ...r, ...p } : r)) }));

  const remove = (key: 'salaries' | 'debts' | 'income', i: number) => {
    const sid = key === 'salaries' ? sheet?.salaries[i]?.id : undefined;
    const withPayments = !!sid && !!sheet?.payments.some((p) => p.salaryId === sid);
    if (!confirm(t(withPayments ? 'panel.finance.confirmRemoveSalary' : 'panel.finance.confirmRemove'))) return;
    edit((s) => ({
      ...s,
      [key]: s[key].filter((_, idx) => idx !== i),
      payments: sid ? s.payments.filter((p) => p.salaryId !== sid) : s.payments,
    }));
  };

  const save = async () => {
    if (!sheet) return;
    setSaving(true);
    setSaveError('');
    try {
      setSheet(toSheet(await api.admin.updateFinance(toFinance(sheet))));
      setDirty(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setSaveError(errorMessage(err, t('admin.failedToSave')));
    } finally {
      setSaving(false);
    }
  };

  const totals = useMemo(() => {
    if (!sheet) return null;
    const card = sum(sheet.salaries.map((r) => num(r.card)));
    const cash = sum(sheet.salaries.map((r) => num(r.cash)));
    const bonus = sum(sheet.salaries.map((r) => num(r.bonus)));
    return { card, cash, bonus, all: card + cash + bonus };
  }, [sheet]);

  if (error) return <ErrorState message={error} onRetry={load} />;
  if (loading || !sheet || !totals) return <LoadingRows rows={6} />;

  const cur = sheet.currency;
  const m = (n: number) => money(n, cur);
  const S = 'panel.finance.salaries.';

  const salCols = 'md:grid-cols-[minmax(0,1.3fr)_minmax(0,.8fr)_minmax(0,.8fr)_minmax(0,.8fr)_minmax(0,.9fr)_minmax(0,1.6fr)_2rem]';

  const del = (onClick: () => void) => (
    <button type="button" onClick={onClick} aria-label={t('panel.finance.remove')} title={t('panel.finance.remove')}
      className="grid h-8 w-8 place-items-center justify-self-end rounded-md text-text-subtle transition-colors hover:bg-danger/10 hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
      <Trash2 className="h-4 w-4" />
    </button>
  );

  return (
    <div className="space-y-6 pb-24">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-2xl text-text-muted">{t('panel.finance.subtitle')}</p>
        <label className="flex items-center gap-2 text-sm text-text-muted">
          {t('panel.finance.currency')}
          <select className="field w-auto" value={cur} onChange={(e) => edit((s) => ({ ...s, currency: e.target.value }))}>
            {(CURRENCIES.includes(cur) ? CURRENCIES : [cur, ...CURRENCIES]).map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>
      </div>

      {/* 1. Salaries */}
      <Section
        title={t(S + 'title')} hint={t(S + 'hint')} addLabel={t(S + 'add')}
        extra={
          <button type="button" onClick={() => setShowPayments((v) => !v)} aria-expanded={showPayments} className={showPayments ? btn.primary : btn.secondary}>
            <CalendarDays className="h-4 w-4" /> {t('panel.finance.payments.open')}
          </button>
        }
        onAdd={() => edit((s) => ({ ...s, salaries: [...s.salaries, { id: uid(), name: '', card: '', cash: '', bonus: '', description: '' }] }))}
        totals={[
          { label: t(S + 'card'), value: m(totals.card) }, { label: t(S + 'cash'), value: m(totals.cash) },
          { label: t(S + 'bonus'), value: m(totals.bonus) }, { label: t('panel.finance.total'), value: m(totals.all) },
        ]}
      >
        {sheet.salaries.length === 0 ? (
          <p className="py-4 text-center text-sm text-text-subtle">{t(S + 'empty')}</p>
        ) : (
          <div className="space-y-3">
            <HeaderRow cols={salCols} labels={[t(S + 'employee'), t(S + 'card'), t(S + 'cash'), t(S + 'bonus'), t('panel.finance.total'), t('panel.finance.description'), '']} />
            {sheet.salaries.map((r, i) => (
              <RowShell key={i} cols={salCols}>
                <Cell label={t(S + 'employee')}><input className="field" value={r.name} onChange={(e) => patch('salaries', i, { name: e.target.value })} aria-label={t(S + 'employee')} /></Cell>
                <Cell label={t(S + 'card')}><input className="field" inputMode="decimal" value={r.card} onChange={(e) => patch('salaries', i, { card: e.target.value })} aria-label={t(S + 'card')} placeholder="0" /></Cell>
                <Cell label={t(S + 'cash')}><input className="field" inputMode="decimal" value={r.cash} onChange={(e) => patch('salaries', i, { cash: e.target.value })} aria-label={t(S + 'cash')} placeholder="0" /></Cell>
                <Cell label={t(S + 'bonus')}><input className="field" inputMode="decimal" value={r.bonus} onChange={(e) => patch('salaries', i, { bonus: e.target.value })} aria-label={t(S + 'bonus')} placeholder="0" /></Cell>
                <Cell label={t('panel.finance.total')}><output className="block px-1 font-mono text-sm text-text">{m(num(r.card) + num(r.cash) + num(r.bonus))}</output></Cell>
                <Cell label={t('panel.finance.description')}><input className="field" value={r.description} onChange={(e) => patch('salaries', i, { description: e.target.value })} aria-label={t('panel.finance.description')} /></Cell>
                {del(() => remove('salaries', i))}
              </RowShell>
            ))}
          </div>
        )}
      </Section>

      {showPayments && (
        <MonthlyPayments
          salaries={sheet.salaries}
          payments={sheet.payments}
          currency={cur}
          onChange={(payments) => edit((s) => ({ ...s, payments }))}
          onClose={() => setShowPayments(false)}
        />
      )}

      {/* 2. Debts and 3. Expected payments: stats on top of each, independent of salaries */}
      <DealsSection ns="panel.finance.debts." rows={sheet.debts} onRows={(debts) => edit((x) => ({ ...x, debts }))} currency={cur} tone="debt" />
      <DealsSection ns="panel.finance.income." rows={sheet.income} onRows={(income) => edit((x) => ({ ...x, income }))} currency={cur} tone="income" />

      <div className="sticky bottom-4 z-10 flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface/95 p-3 shadow-lg backdrop-blur">
        <button type="button" onClick={save} disabled={saving || !dirty} className={btn.primary}>
          {saving ? t('admin.saving') : t('panel.finance.save')}
        </button>
        {dirty && !saving && <span className="text-sm text-text-subtle">{t('panel.finance.unsaved')}</span>}
        {saved && (
          <span className="inline-flex items-center gap-1.5 text-sm text-success">
            <CheckCircle2 className="h-4 w-4" /> {t('panel.finance.saved')}
          </span>
        )}
        {saveError && <span className="text-sm text-danger">{saveError}</span>}
      </div>
    </div>
  );
}
