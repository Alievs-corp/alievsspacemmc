/* eslint-disable react-refresh/only-export-components */
import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { BarChart3, Table2 } from 'lucide-react';
import { t } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import type { Bucket } from '@/lib/crmAnalytics';
import './analytics.css';

/**
 * Small inline-SVG charts for CRM analytics: thin columns with a 2px surface
 * gap between stacked segments, 2px lines, a hairline grid, a per-column hover
 * readout and a table view for every chart (the values never depend on hover).
 */

export interface Series {
  key: string;
  label: string;
  /** CSS color, normally var(--series-n). */
  color: string;
  values: number[];
}

function useWidth<T extends HTMLElement>(): [React.RefObject<T | null>, number] {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(Math.floor(entry.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, width];
}

/** A round axis maximum and its ticks (integers: these are counts). */
function niceScale(max: number): number[] {
  if (max <= 4) return [0, 1, 2, 3, 4].slice(0, Math.max(2, Math.ceil(max) + 1));
  const raw = max / 4;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? raw;
  const ticks: number[] = [];
  for (let v = 0; v < max + step; v += step) ticks.push(v);
  return ticks;
}

const compact = (n: number) => new Intl.NumberFormat(undefined, { notation: 'compact', maximumFractionDigits: 1 }).format(n);

export function bucketLabel(start: string, bucket: Bucket, long = false): string {
  const [y, m, d] = start.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  if (bucket === 'month') return date.toLocaleDateString(undefined, { month: long ? 'long' : 'short', year: 'numeric' });
  const s = date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
  if (bucket === 'week' && long) {
    const end = new Date(y, m - 1, d + 6);
    return `${s} – ${end.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}`;
  }
  return s;
}

/** Card with a title, legend and a chart / table switch. */
export function ChartCard({ title, subtitle, legend, chart, table, actions }: {
  title: string; subtitle?: string; legend?: ReactNode; chart: ReactNode; table: ReactNode; actions?: ReactNode;
}) {
  const [asTable, setAsTable] = useState(false);
  return (
    <section className="card crm-viz min-w-0 p-4">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <h2 className="font-display font-semibold text-text">{title}</h2>
          {subtitle && <p className="text-xs text-text-subtle">{subtitle}</p>}
        </div>
        <div className="crm-no-print flex items-center gap-1">
          {actions}
          <button
            onClick={() => setAsTable((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-2 py-1 text-xs text-text-muted hover:bg-surface-3 hover:text-text"
            aria-pressed={asTable}
          >
            {asTable ? <BarChart3 className="h-3.5 w-3.5" /> : <Table2 className="h-3.5 w-3.5" />}
            {asTable ? t('crm.analytics.showChart', 'Chart') : t('crm.analytics.showTable', 'Table')}
          </button>
        </div>
      </div>
      {legend && !asTable && <div className="mb-2">{legend}</div>}
      {asTable ? <div className="overflow-x-auto">{table}</div> : chart}
    </section>
  );
}

export function Legend({ items }: { items: Array<{ label: string; color: string; line?: boolean }> }) {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-muted">
      {items.map((i) => (
        <li key={i.label} className="inline-flex items-center gap-1.5">
          {i.line
            ? <span className="h-0.5 w-3.5 rounded-full" style={{ background: i.color }} aria-hidden />
            : <span className="h-2.5 w-2.5 rounded-sm" style={{ background: i.color }} aria-hidden />}
          {i.label}
        </li>
      ))}
    </ul>
  );
}

const H = 200;
const M = { top: 10, right: 8, bottom: 24, left: 30 };

function Tooltip({ x, width, title, rows }: { x: number; width: number; title: string; rows: Array<{ label: string; value: number; color: string; line?: boolean }> }) {
  const w = 168;
  const left = Math.min(Math.max(x - w / 2, 0), Math.max(0, width - w));
  return (
    <div className="pointer-events-none absolute top-0 z-10 rounded-lg border border-border bg-surface-2 px-3 py-2 text-xs shadow-lg" style={{ left, width: w }}>
      <p className="mb-1 text-text-subtle">{title}</p>
      {rows.map((r) => (
        <p key={r.label} className="flex items-center gap-2">
          <span className={cn('w-3 shrink-0 rounded-full', r.line ? 'h-0.5' : 'h-1')} style={{ background: r.color }} aria-hidden />
          <span className="font-semibold tabular-nums text-text">{r.value}</span>
          <span className="min-w-0 truncate text-text-muted">{r.label}</span>
        </p>
      ))}
    </div>
  );
}

function Axes({ width, ticks, y, labels, x, band }: {
  width: number; ticks: number[]; y: (v: number) => number; labels: string[]; x: (i: number) => number; band: number;
}) {
  // Enough room for every label at ~56px each; otherwise show every n-th.
  const every = Math.max(1, Math.ceil((labels.length * 56) / Math.max(1, width - M.left - M.right)));
  return (
    <g>
      {ticks.map((v) => (
        <g key={v}>
          <line x1={M.left} x2={width - M.right} y1={y(v)} y2={y(v)} stroke={v === 0 ? 'var(--viz-axis)' : 'var(--viz-grid)'} strokeWidth={1} />
          <text x={M.left - 6} y={y(v)} dy="0.32em" textAnchor="end" className="fill-text-subtle text-[10px] tabular-nums">{compact(v)}</text>
        </g>
      ))}
      {labels.map((l, i) => (i % every === 0 ? (
        <text key={i} x={x(i) + band / 2} y={H - 6} textAnchor="middle" className="fill-text-subtle text-[10px]">{l}</text>
      ) : null))}
    </g>
  );
}

/**
 * Stacked columns (e.g. published per platform) with an optional line on the
 * same count axis (e.g. planned).
 */
export function ColumnChart({ labels, longLabels, series, line, emptyText }: {
  labels: string[]; longLabels: string[]; series: Series[]; line?: Series; emptyText: string;
}) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const totals = labels.map((_, i) => series.reduce((s, se) => s + (se.values[i] ?? 0), 0));
  const max = Math.max(0, ...totals, ...(line?.values ?? []));
  const ticks = niceScale(max);
  const top = ticks[ticks.length - 1] || 1;
  const n = labels.length;
  const band = n ? (width - M.left - M.right) / n : 0;
  const colW = Math.max(2, Math.min(24, band * 0.7));
  const x = (i: number) => M.left + i * band;
  const y = (v: number) => M.top + (H - M.top - M.bottom) * (1 - v / top);

  return (
    <div ref={ref} className="relative w-full">
      {max === 0 && <p className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-sm text-text-muted">{emptyText}</p>}
      {width > 0 && (
        <svg width={width} height={H} role="img" aria-label={series.map((s) => s.label).join(', ')} onMouseLeave={() => setHover(null)}>
          <Axes width={width} ticks={ticks} y={y} labels={labels} x={x} band={band} />
          {labels.map((_, i) => {
            let base = 0;
            const segs = series.filter((s) => (s.values[i] ?? 0) > 0);
            const cx = x(i) + (band - colW) / 2;
            return (
              <g key={i} opacity={hover === null || hover === i ? 1 : 0.55}>
                {segs.map((s, k) => {
                  const v = s.values[i];
                  const y0 = y(base), y1 = y(base + v);
                  base += v;
                  const topSeg = k === segs.length - 1;
                  // 2px surface gap below every segment except the first.
                  const bottom = k === 0 ? y0 : y0 - 2;
                  const h = Math.max(1, bottom - y1);
                  const r = topSeg ? Math.min(4, h, colW / 2) : 0;
                  const d = `M${cx},${bottom} V${y1 + r} Q${cx},${y1} ${cx + r},${y1} H${cx + colW - r} Q${cx + colW},${y1} ${cx + colW},${y1 + r} V${bottom} Z`;
                  return <path key={s.key} d={d} fill={s.color} />;
                })}
              </g>
            );
          })}
          {line && n > 0 && (
            <>
              <polyline
                fill="none" stroke={line.color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round"
                points={line.values.map((v, i) => `${x(i) + band / 2},${y(v)}`).join(' ')}
              />
              {hover !== null && (
                <circle cx={x(hover) + band / 2} cy={y(line.values[hover] ?? 0)} r={4} fill={line.color} stroke="var(--color-surface)" strokeWidth={2} />
              )}
            </>
          )}
          {labels.map((_, i) => (
            <rect
              key={i} x={x(i)} y={M.top} width={band} height={H - M.top - M.bottom} fill="transparent"
              tabIndex={0} aria-label={longLabels[i]}
              onMouseEnter={() => setHover(i)} onFocus={() => setHover(i)} onBlur={() => setHover(null)}
            />
          ))}
        </svg>
      )}
      {hover !== null && width > 0 && (
        <Tooltip
          x={x(hover) + band / 2} width={width} title={longLabels[hover]}
          rows={[
            ...(line ? [{ label: line.label, value: line.values[hover] ?? 0, color: line.color, line: true }] : []),
            ...series.map((s) => ({ label: s.label, value: s.values[hover] ?? 0, color: s.color })),
          ]}
        />
      )}
    </div>
  );
}

/** Lines over time with a crosshair readout of every series. */
export function LineChart({ labels, longLabels, series, emptyText }: {
  labels: string[]; longLabels: string[]; series: Series[]; emptyText: string;
}) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(0, ...series.flatMap((s) => s.values));
  const ticks = niceScale(max);
  const top = ticks[ticks.length - 1] || 1;
  const n = labels.length;
  const band = n ? (width - M.left - M.right) / n : 0;
  const x = (i: number) => M.left + i * band;
  const y = (v: number) => M.top + (H - M.top - M.bottom) * (1 - v / top);

  return (
    <div ref={ref} className="relative w-full">
      {max === 0 && <p className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-sm text-text-muted">{emptyText}</p>}
      {width > 0 && (
        <svg width={width} height={H} role="img" aria-label={series.map((s) => s.label).join(', ')} onMouseLeave={() => setHover(null)}>
          <Axes width={width} ticks={ticks} y={y} labels={labels} x={x} band={band} />
          {hover !== null && (
            <line x1={x(hover) + band / 2} x2={x(hover) + band / 2} y1={M.top} y2={H - M.bottom} stroke="var(--viz-axis)" strokeWidth={1} />
          )}
          {max > 0 && series.map((s) => (
            <g key={s.key}>
              <polyline
                fill="none" stroke={s.color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round"
                points={s.values.map((v, i) => `${x(i) + band / 2},${y(v)}`).join(' ')}
              />
              {(hover !== null ? [hover] : [n - 1]).map((i) => (
                <circle key={i} cx={x(i) + band / 2} cy={y(s.values[i] ?? 0)} r={4} fill={s.color} stroke="var(--color-surface)" strokeWidth={2} />
              ))}
            </g>
          ))}
          {labels.map((_, i) => (
            <rect
              key={i} x={x(i)} y={M.top} width={band} height={H - M.top - M.bottom} fill="transparent"
              tabIndex={0} aria-label={longLabels[i]}
              onMouseEnter={() => setHover(i)} onFocus={() => setHover(i)} onBlur={() => setHover(null)}
            />
          ))}
        </svg>
      )}
      {hover !== null && width > 0 && (
        <Tooltip
          x={x(hover) + band / 2} width={width} title={longLabels[hover]}
          rows={series.map((s) => ({ label: s.label, value: s.values[hover] ?? 0, color: s.color, line: true }))}
        />
      )}
    </div>
  );
}

/** One horizontal 100% bar split into parts, with a hover title per part. */
export function SplitBar({ parts, total, label }: {
  parts: Array<{ key: string; label: string; value: number; color: string }>; total: number; label: string;
}) {
  if (total <= 0) return <div className="h-2.5 rounded-full bg-surface-3" aria-label={label} />;
  const shown = parts.filter((p) => p.value > 0);
  return (
    <div className="flex h-2.5 gap-0.5 overflow-hidden rounded-full" role="img" aria-label={`${label}: ${shown.map((p) => `${p.label} ${p.value}`).join(', ')}`}>
      {shown.map((p) => (
        <span key={p.key} title={`${p.label}: ${p.value}`} className="h-full first:rounded-l-full last:rounded-r-full"
          style={{ width: `${(p.value / total) * 100}%`, background: p.color }} />
      ))}
    </div>
  );
}

/** Plain table used as every chart's table view. */
export function DataTable({ head, rows }: { head: string[]; rows: Array<Array<ReactNode>> }) {
  return (
    <table className="min-w-full text-left text-sm">
      <thead className="text-xs uppercase tracking-wider text-text-subtle">
        <tr>{head.map((h, i) => <th key={i} className={cn('px-2 py-1.5 font-medium', i > 0 && 'text-right')}>{h}</th>)}</tr>
      </thead>
      <tbody className="divide-y divide-border">
        {rows.map((r, i) => (
          <tr key={i}>{r.map((c, j) => <td key={j} className={cn('px-2 py-1.5', j > 0 && 'text-right tabular-nums')}>{c}</td>)}</tr>
        ))}
      </tbody>
    </table>
  );
}
