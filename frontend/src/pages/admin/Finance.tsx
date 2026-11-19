import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { CheckCircle2, Plus, Trash2 } from 'lucide-react';
import { api, type Finance } from '@/lib/api';
import { useI18n } from '@/contexts/I18nContext';
import { ErrorState, LoadingRows, btn, errorMessage } from '@/components/admin/ui';
import { cn } from '@/lib/utils';

/*
 * Amounts are kept as the text the user typed (so "0." and "12,5" can be
 * entered) and turned into numbers only for totals and when saving.
 */
interface SalaryRow { name: string; card: string; cash: string; bonus: string; description: string }
interface DebtRow { name: string; kind: 'debt' | 'payment'; amount: string; date: string; description: string }
interface IncomeRow { name: string; kind: 'income' | 'expected'; amount: string; date: string; description: string }
interface Sheet { currency: string; salaries: SalaryRow[]; debts: DebtRow[]; income: IncomeRow[] }

const CURRENCIES = ['AZN', 'USD', 'EUR', 'RUB', 'TRY', 'GEL'];

const num = (s: string) => {
  const n = parseFloat(String(s).replace(/\s/g, '').replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
};
const txt = (n: number) => (n ? String(n) : '');

const toSheet = (f: Finance): Sheet => ({
  currency: f.currency || 'AZN',
  salaries: (f.salaries || []).map((r) => ({ name: r.name, card: txt(r.card), cash: txt(r.cash), bonus: txt(r.bonus), description: r.description || '' })),
  debts: (f.debts || []).map((r) => ({ name: r.name, kind: r.kind === 'payment' ? 'payment' : 'debt', amount: txt(r.amount), date: r.date || '', description: r.description || '' })),
  income: (f.income || []).map((r) => ({ name: r.name, kind: r.kind === 'expected' ? 'expected' : 'income', amount: txt(r.amount), date: r.date || '', description: r.description || '' })),
});

/** Empty rows (no name and no amounts) are dropped on save. */
const toFinance = (s: Sheet): Finance => ({
  currency: s.currency,
  salaries: s.salaries
    .filter((r) => r.name.trim() || num(r.card) || num(r.cash) || num(r.bonus))
    .map((r) => ({ name: r.name.trim(), card: num(r.card), cash: num(r.cash), bonus: num(r.bonus), description: r.description.trim() })),
  debts: s.debts
    .filter((r) => r.name.trim() || num(r.amount))
    .map((r) => ({ name: r.name.trim(), kind: r.kind, amount: num(r.amount), date: r.date, description: r.description.trim() })),
  income: s.income
    .filter((r) => r.name.trim() || num(r.amount))
    .map((r) => ({ name: r.name.trim(), kind: r.kind, amount: num(r.amount), date: r.date, description: r.description.trim() })),
});

const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);

function money(n: number, currency: string) {
  return `${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`;
}

function Section({ title, hint, addLabel, onAdd, children, totals }: { title: string; hint: string; addLabel: string; onAdd: () => void; children: ReactNode; totals: Array<{ label: string; value: string; tone?: 'good' | 'bad' }> }) {
  return (
    <section className="card space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-display text-lg font-semibold text-text">{title}</h2>
          <p className="mt-0.5 text-sm text-text-muted">{hint}</p>
        </div>
        <button type="button" onClick={onAdd} className={btn.primary}>
          <Plus className="h-4 w-4" /> {addLabel}
        </button>
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
    if (!confirm(t('panel.finance.confirmRemove'))) return;
    edit((s) => ({ ...s, [key]: s[key].filter((_, idx) => idx !== i) }));
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
    const by = <T extends { kind: string; amount: string }>(rows: T[], kind: string) => sum(rows.filter((r) => r.kind === kind).map((r) => num(r.amount)));
    return {
      card, cash, bonus, all: card + cash + bonus,
      debt: by(sheet.debts, 'debt'), paid: by(sheet.debts, 'payment'),
      income: by(sheet.income, 'income'), expected: by(sheet.income, 'expected'),
    };
  }, [sheet]);

  if (error) return <ErrorState message={error} onRetry={load} />;
  if (loading || !sheet || !totals) return <LoadingRows rows={6} />;

  const cur = sheet.currency;
  const m = (n: number) => money(n, cur);
  const S = 'panel.finance.salaries.';
  const D = 'panel.finance.debts.';
  const I = 'panel.finance.income.';

  const salCols = 'md:grid-cols-[minmax(0,1.3fr)_minmax(0,.8fr)_minmax(0,.8fr)_minmax(0,.8fr)_minmax(0,.9fr)_minmax(0,1.6fr)_2rem]';
  const dealCols = 'md:grid-cols-[minmax(0,1.3fr)_minmax(0,.8fr)_minmax(0,.9fr)_minmax(0,.9fr)_minmax(0,1.8fr)_2rem]';

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
        onAdd={() => edit((s) => ({ ...s, salaries: [...s.salaries, { name: '', card: '', cash: '', bonus: '', description: '' }] }))}
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

      {/* 2. Debts and payments */}
      <Section
        title={t(D + 'title')} hint={t(D + 'hint')} addLabel={t(D + 'add')}
        onAdd={() => edit((s) => ({ ...s, debts: [...s.debts, { name: '', kind: 'debt', amount: '', date: '', description: '' }] }))}
        totals={[{ label: t(D + 'totalDebt'), value: m(totals.debt), tone: 'bad' }, { label: t(D + 'totalPayment'), value: m(totals.paid), tone: 'good' }]}
      >
        {sheet.debts.length === 0 ? (
          <p className="py-4 text-center text-sm text-text-subtle">{t(D + 'empty')}</p>
        ) : (
          <div className="space-y-3">
            <HeaderRow cols={dealCols} labels={[t('panel.finance.name'), t('panel.finance.type'), t('panel.finance.amount'), t('panel.finance.date'), t('panel.finance.description'), '']} />
            {sheet.debts.map((r, i) => (
              <RowShell key={i} cols={dealCols}>
                <Cell label={t('panel.finance.name')}><input className="field" value={r.name} onChange={(e) => patch('debts', i, { name: e.target.value })} aria-label={t('panel.finance.name')} /></Cell>
                <Cell label={t('panel.finance.type')}>
                  <select className="field" value={r.kind} onChange={(e) => patch('debts', i, { kind: e.target.value as DebtRow['kind'] })} aria-label={t('panel.finance.type')}>
                    <option value="debt">{t(D + 'debt')}</option>
                    <option value="payment">{t(D + 'payment')}</option>
                  </select>
                </Cell>
                <Cell label={t('panel.finance.amount')}><input className="field" inputMode="decimal" value={r.amount} onChange={(e) => patch('debts', i, { amount: e.target.value })} aria-label={t('panel.finance.amount')} placeholder="0" /></Cell>
                <Cell label={t('panel.finance.date')}><input className="field" type="date" value={r.date} onChange={(e) => patch('debts', i, { date: e.target.value })} aria-label={t('panel.finance.date')} /></Cell>
                <Cell label={t('panel.finance.description')}><input className="field" value={r.description} onChange={(e) => patch('debts', i, { description: e.target.value })} aria-label={t('panel.finance.description')} /></Cell>
                {del(() => remove('debts', i))}
              </RowShell>
            ))}
          </div>
        )}
      </Section>

      {/* 3. Income and expected payments */}
      <Section
        title={t(I + 'title')} hint={t(I + 'hint')} addLabel={t(I + 'add')}
        onAdd={() => edit((s) => ({ ...s, income: [...s.income, { name: '', kind: 'income', amount: '', date: '', description: '' }] }))}
        totals={[{ label: t(I + 'totalIncome'), value: m(totals.income), tone: 'good' }, { label: t(I + 'totalExpected'), value: m(totals.expected) }]}
      >
        {sheet.income.length === 0 ? (
          <p className="py-4 text-center text-sm text-text-subtle">{t(I + 'empty')}</p>
        ) : (
          <div className="space-y-3">
            <HeaderRow cols={dealCols} labels={[t('panel.finance.name'), t('panel.finance.type'), t('panel.finance.amount'), t('panel.finance.date'), t('panel.finance.description'), '']} />
            {sheet.income.map((r, i) => (
              <RowShell key={i} cols={dealCols}>
                <Cell label={t('panel.finance.name')}><input className="field" value={r.name} onChange={(e) => patch('income', i, { name: e.target.value })} aria-label={t('panel.finance.name')} /></Cell>
                <Cell label={t('panel.finance.type')}>
                  <select className="field" value={r.kind} onChange={(e) => patch('income', i, { kind: e.target.value as IncomeRow['kind'] })} aria-label={t('panel.finance.type')}>
                    <option value="income">{t(I + 'income')}</option>
                    <option value="expected">{t(I + 'expected')}</option>
                  </select>
                </Cell>
                <Cell label={t('panel.finance.amount')}><input className="field" inputMode="decimal" value={r.amount} onChange={(e) => patch('income', i, { amount: e.target.value })} aria-label={t('panel.finance.amount')} placeholder="0" /></Cell>
                <Cell label={t('panel.finance.date')}><input className="field" type="date" value={r.date} onChange={(e) => patch('income', i, { date: e.target.value })} aria-label={t('panel.finance.date')} /></Cell>
                <Cell label={t('panel.finance.description')}><input className="field" value={r.description} onChange={(e) => patch('income', i, { description: e.target.value })} aria-label={t('panel.finance.description')} /></Cell>
                {del(() => remove('income', i))}
              </RowShell>
            ))}
          </div>
        )}
      </Section>

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
