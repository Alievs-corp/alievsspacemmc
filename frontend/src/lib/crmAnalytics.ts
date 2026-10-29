import { API_BASE_URL, ApiError } from './api';
import { qs, request, viewAsId, type EffectiveStatus, type Platform, type UserBrief } from './crm';

/**
 * Analytics and Reports client. Every number comes from CRM records on the
 * server; social network metrics stay empty until accounts are connected.
 */

export type Bucket = 'day' | 'week' | 'month';

export interface AnalyticsFilter {
  /** YYYY-MM-DD, both inclusive, in the browser's time zone. */
  from?: string;
  to?: string;
  bucket?: Bucket;
  companyId?: string;
  projectId?: string;
  platform?: Platform | '';
}

export interface PlatformOutput {
  platform: Platform | 'all';
  planned: number;
  published: number;
  onTime: number;
  late: number;
  unplanned: number;
  missed: number;
  failed: number;
}

export interface ContentBucket {
  start: string;
  planned: number;
  published: number;
  byPlatform: Partial<Record<Platform, number>>;
}

export interface StepWaiting { step: number; name: string; items: number; oldestHours: number }

export interface ApprovalAnalytics {
  submitted: number;
  items: number;
  approved: number;
  changesRequested: number;
  rejected: number;
  withdrawn: number;
  pending: number;
  changesRate: number | null;
  rejectionRate: number | null;
  avgHoursToApprove: number | null;
  medianHoursToApprove: number | null;
  avgRoundsToApprove: number | null;
  waiting: StepWaiting[];
}

export interface MemberWorkload {
  user: UserBrief | null;
  openTasks: number;
  overdueTasks: number;
  completedTasks: number;
  openContent: number;
}

export interface TeamAnalytics {
  available: boolean;
  members: MemberWorkload[];
  buckets: Array<{ start: string; created: number; completed: number }>;
  totals: { open: number; overdue: number; created: number; completed: number };
}

export interface PlatformMetrics {
  platform: Platform;
  reach: number;
  views: number;
  engagements: number;
  followers: number;
  followersChange: number;
}

export interface SocialAnalytics {
  /** False until social accounts are connected: metrics is then empty. */
  connected: boolean;
  platforms: Platform[];
  metrics: PlatformMetrics[];
}

export interface AnalyticsOption { id: string; name: string; companyId?: string; platforms?: Platform[] }

export interface AnalyticsData {
  period: { from: string; to: string; bucket: Bucket };
  content: {
    totals: PlatformOutput;
    byPlatform: PlatformOutput[];
    byStatus: Partial<Record<EffectiveStatus, number>>;
    buckets: ContentBucket[];
  };
  approvals: ApprovalAnalytics;
  team: TeamAnalytics;
  social: SocialAnalytics;
}

export interface AnalyticsOverview extends AnalyticsData {
  options: { companies: AnalyticsOption[]; projects: AnalyticsOption[]; platforms: Platform[] };
}

export interface Report extends AnalyticsData {
  subject: { type: 'company' | 'project'; company: AnalyticsOption; project: AnalyticsOption | null; projects: AnalyticsOption[] };
  platform: Platform | '';
  generatedAt: string;
  summary: {
    planned: number;
    published: number;
    onTimeRate: number | null;
    missed: number;
    approved: number;
    avgHoursToApprove: number | null;
    openTasks: number | null;
    overdueTasks: number | null;
    completedTasks: number | null;
  };
}

/** Minutes east of UTC, as the server expects. */
const tzOffset = () => -new Date().getTimezoneOffset();

export const analytics = {
  options: () => request<AnalyticsOverview['options']>('GET', '/analytics/options'),
  overview: (f: AnalyticsFilter) => request<AnalyticsOverview>('GET', `/analytics/overview${qs({ ...f, tzOffset: tzOffset() })}`),
  report: (f: AnalyticsFilter) => request<Report>('GET', `/reports${qs({ ...f, tzOffset: tzOffset() })}`),
  /** Downloads the server-generated CSV (the export is recorded in activity). */
  exportCsv: async (f: AnalyticsFilter) => {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    const token = localStorage.getItem('auth_token');
    if (token) headers.Authorization = `Bearer ${token}`;
    const viewAs = viewAsId();
    if (viewAs) headers['X-CRM-View-As'] = viewAs;
    const res = await fetch(`${API_BASE_URL}/crm/reports/export`, {
      method: 'POST', headers, body: JSON.stringify({ ...f, tzOffset: tzOffset() }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      throw new ApiError(err.error || res.statusText, res.status, err.code);
    }
    const name = /filename="([^"]+)"/.exec(res.headers.get('Content-Disposition') ?? '')?.[1] ?? `crm-report-${f.from ?? ''}-${f.to ?? ''}.csv`;
    const url = URL.createObjectURL(await res.blob());
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  },
};

/** Local YYYY-MM-DD. */
export function isoDay(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export type PeriodPreset = '7d' | '30d' | '90d' | 'month' | 'lastMonth' | 'quarter' | 'year' | 'custom';
export const PERIOD_PRESETS: Exclude<PeriodPreset, 'custom'>[] = ['7d', '30d', '90d', 'month', 'lastMonth', 'quarter', 'year'];

/** Inclusive [from, to] of a preset, ending today. */
export function presetRange(p: Exclude<PeriodPreset, 'custom'>, now = new Date()): { from: string; to: string } {
  const y = now.getFullYear(), m = now.getMonth(), d = now.getDate();
  const day = (yy: number, mm: number, dd: number) => isoDay(new Date(yy, mm, dd));
  switch (p) {
    case '7d': return { from: day(y, m, d - 6), to: day(y, m, d) };
    case '30d': return { from: day(y, m, d - 29), to: day(y, m, d) };
    case '90d': return { from: day(y, m, d - 89), to: day(y, m, d) };
    case 'month': return { from: day(y, m, 1), to: day(y, m, d) };
    case 'lastMonth': return { from: day(y, m - 1, 1), to: day(y, m, 0) };
    case 'quarter': { const q = Math.floor(m / 3) * 3; return { from: day(y, q, 1), to: day(y, m, d) }; }
    case 'year': return { from: day(y, 0, 1), to: day(y, m, d) };
  }
}
