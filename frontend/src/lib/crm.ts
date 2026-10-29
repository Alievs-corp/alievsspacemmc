import { API_BASE_URL, ApiError } from './api';

/** CRM API client. Every request is authorised again on the server. */

export const PLATFORMS = ['instagram', 'tiktok', 'youtube', 'linkedin'] as const;
export type Platform = (typeof PLATFORMS)[number];

export type CrmPermission =
  | 'company.manage' | 'project.manage'
  | 'team.view' | 'team.manage'
  | 'tasks.view' | 'tasks.create' | 'tasks.assign' | 'tasks.manage'
  | 'calendar.view' | 'calendar.manage'
  | 'content.view' | 'content.create' | 'content.edit' | 'content.approve' | 'content.publish'
  | 'media.view' | 'media.manage'
  | 'social.view' | 'social.manage'
  | 'inbox.view' | 'inbox.reply'
  | 'analytics.view';

export interface PermissionInfo {
  key: CrmPermission;
  group: string;
  platformScoped: boolean;
}

export interface UserBrief {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface Scope {
  permissions: CrmPermission[];
  /** null = every platform. */
  platforms: Platform[] | null;
}

export interface Membership {
  id: string;
  companyId: string;
  companyName: string;
  projectId: string | null;
  projectName: string;
  role: string;
  roleName: string;
  platforms: Platform[];
  permissions: CrmPermission[];
}

export interface CrmMe {
  hasAccess: boolean;
  superAdmin: boolean;
  viewAs: boolean;
  user: UserBrief;
  permissions: CrmPermission[];
  platforms: Platform[];
  memberships: Membership[];
}

export type CompanyStatus = 'active' | 'archived';
export interface Company {
  id: string;
  name: string;
  description: string;
  logoUrl: string;
  website: string;
  status: CompanyStatus;
  createdAt: string;
  updatedAt: string;
  projectCount: number;
  memberCount: number;
  scope: Scope;
}

export type ProjectStatus = 'active' | 'paused' | 'completed' | 'archived';
export const PROJECT_STATUSES: ProjectStatus[] = ['active', 'paused', 'completed', 'archived'];
export interface Project {
  id: string;
  companyId: string;
  companyName: string;
  name: string;
  description: string;
  managerId: string;
  manager: UserBrief | null;
  status: ProjectStatus;
  platforms: Platform[];
  startDate: string | null;
  dueDate: string | null;
  memberCount: number;
  openTasks: number;
  createdAt: string;
  updatedAt: string;
  scope: Scope;
}

export interface Role {
  key: string;
  name: string;
  description: string;
  permissions: CrmPermission[];
  system: boolean;
  memberCount: number;
}

export interface Member {
  id: string;
  userId: string;
  companyId: string;
  projectId: string | null;
  role: string;
  platforms: Platform[];
  extraPermissions: CrmPermission[];
  deniedPermissions: CrmPermission[];
  active: boolean;
  createdAt: string;
  user: UserBrief | null;
  companyName: string;
  projectName: string;
  effectivePermissions: CrmPermission[];
}

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'completed' | 'cancelled';
export const TASK_STATUSES: TaskStatus[] = ['todo', 'in_progress', 'review', 'completed', 'cancelled'];
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export const TASK_PRIORITIES: TaskPriority[] = ['low', 'medium', 'high', 'urgent'];

export interface Task {
  id: string;
  projectId: string;
  companyId: string;
  projectName: string;
  companyName: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: string;
  assignee: UserBrief | null;
  creator: UserBrief | null;
  dueAt: string | null;
  position: number;
  commentCount: number;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  can: { edit: boolean; status: boolean; assign: boolean; delete: boolean };
}

export interface TaskComment {
  id: string;
  taskId: string;
  body: string;
  createdAt: string;
  author: UserBrief | null;
}

export interface Activity {
  id: string;
  companyId: string;
  projectId: string;
  entityType: string;
  entityId: string;
  action: string;
  details: string;
  createdAt: string;
  actor: UserBrief | null;
}

export interface Dashboard {
  companies: number;
  projects: { total: number; byStatus: Partial<Record<ProjectStatus, number>> };
  platforms: Partial<Record<Platform, number>>;
  members: number;
  tasks: { byStatus: Partial<Record<TaskStatus, number>>; overdue: number; mine: number; dueThisWeek: number };
  content: ContentStats;
  upcoming: Array<Pick<Task, 'id' | 'title' | 'projectId' | 'projectName' | 'status' | 'priority' | 'dueAt' | 'assignee'>>;
  companyBreakdown?: Array<{ id: string; name: string; status: CompanyStatus; projects: number; members: number; openTasks: number; overdue: number }>;
}

export interface MediaFile {
  id: string;
  rootId: string;
  version: number;
  latest: boolean;
  companyId: string;
  projectId: string;
  folder: string;
  name: string;
  kind: 'image' | 'video' | 'document';
  contentType: string;
  size: number;
  uploadedBy: string;
  createdAt: string;
  /** Signed, short-lived link relative to the API base; use fileUrl(). */
  url: string;
  uploader: UserBrief | null;
}

export type ContentStatus = 'idea' | 'in_progress' | 'ready_for_review' | 'changes_requested' | 'rejected' | 'approved';
export const CONTENT_STATUSES: ContentStatus[] = ['idea', 'in_progress', 'ready_for_review', 'changes_requested', 'rejected', 'approved'];
export type PublishStatus = 'draft' | 'scheduled' | 'published' | 'failed';
/** What the calendar shows: the workflow status until a publication is scheduled. */
export type EffectiveStatus = ContentStatus | Exclude<PublishStatus, 'draft'>;
export const EFFECTIVE_STATUSES: EffectiveStatus[] = [...CONTENT_STATUSES, 'scheduled', 'published', 'failed'];
export const CONTENT_FORMATS = ['post', 'reel', 'story', 'carousel', 'video', 'short', 'article'] as const;
export type ContentFormat = (typeof CONTENT_FORMATS)[number];

/** Server-side limits (internal/crm/content.go). */
export const CAPTION_LIMITS: Record<Platform, number> = { instagram: 2200, tiktok: 4000, youtube: 5000, linkedin: 3000 };
export const TITLE_LIMITS: Record<Platform, number> = { instagram: 300, tiktok: 300, youtube: 100, linkedin: 300 };
export const MAX_HASHTAGS = 30;

export interface PubRights { edit: boolean; reschedule: boolean; schedule: boolean; publish: boolean; delete: boolean }

export interface Publication {
  id: string;
  contentId: string;
  platform: Platform;
  title: string;
  caption: string;
  hashtags: string[];
  mediaIds: string[];
  coverMediaId: string;
  options: Record<string, unknown>;
  scheduledAt: string | null;
  publishStatus: PublishStatus;
  status: EffectiveStatus;
  publishedAt: string | null;
  externalUrl: string;
  error: string;
  media: MediaFile[];
  cover: MediaFile | null;
  can: PubRights;
}

export interface ApprovalStep { name: string; roles: string[]; userIds: string[] }

export interface ApprovalDecision {
  id: string;
  step: number;
  stepName: string;
  decision: 'approved' | 'changes_requested' | 'rejected';
  comment: string;
  createdAt: string;
  actor: UserBrief | null;
}

export interface Approval {
  id: string;
  contentId: string;
  round: number;
  step: number;
  steps: ApprovalStep[];
  stepName: string;
  status: 'pending' | 'approved' | 'changes_requested' | 'rejected' | 'cancelled';
  submitter: UserBrief | null;
  versionId: string;
  createdAt: string;
  closedAt: string | null;
  decisions: ApprovalDecision[];
}

export interface ContentItem {
  id: string;
  companyId: string;
  projectId: string;
  projectName: string;
  companyName: string;
  title: string;
  brief: string;
  format: ContentFormat;
  status: ContentStatus;
  assigneeId: string;
  assignee: UserBrief | null;
  creator: UserBrief | null;
  approvalRound: number;
  createdAt: string;
  updatedAt: string;
  publications: Publication[];
  approval: Approval | null;
  can: { edit: boolean; delete: boolean; submit: boolean; decide: boolean; addPlatforms: Platform[] };
}

export interface ContentVersion {
  id: string;
  number: number;
  note: string;
  createdAt: string;
  author: UserBrief | null;
  snapshot: {
    title: string; brief: string; format: ContentFormat;
    publications: Array<Pick<Publication, 'platform' | 'title' | 'caption' | 'hashtags' | 'mediaIds' | 'coverMediaId'>>;
  };
}

export interface CalendarEntry {
  id: string;
  contentId: string;
  projectId: string;
  projectName: string;
  companyName: string;
  platform: Platform;
  title: string;
  format: ContentFormat;
  status: EffectiveStatus;
  publishStatus: PublishStatus;
  scheduledAt: string | null;
  publishedAt: string | null;
  externalUrl: string;
  assignee: UserBrief | null;
  thumbnail: MediaFile | null;
  can: PubRights;
}

export interface ContentStats {
  byStatus: Partial<Record<ContentStatus, number>>;
  today: number;
  thisWeek: number;
  scheduled: number;
  publishedLast30Days: number;
  failed: number;
  pendingMyApproval: number;
}

/** Absolute URL of a signed media link. */
export function fileUrl(m: Pick<MediaFile, 'url'>): string {
  return `${API_BASE_URL}${m.url}`;
}

/** Set by CrmContext while a super admin uses "View as user". */
let viewAsUserId: string | null = null;
export function setViewAs(id: string | null) { viewAsUserId = id; }
export function viewAsId(): string | null { return viewAsUserId; }

export async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('auth_token');
  if (token) headers.Authorization = `Bearer ${token}`;
  if (viewAsUserId) headers['X-CRM-View-As'] = viewAsUserId;
  const res = await fetch(`${API_BASE_URL}/crm${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new ApiError(err.error || res.statusText, res.status, err.code);
  }
  return res.status === 204 ? (undefined as T) : res.json();
}

async function upload<T>(path: string, form: FormData): Promise<T> {
  const headers: Record<string, string> = {};
  const token = localStorage.getItem('auth_token');
  if (token) headers.Authorization = `Bearer ${token}`;
  if (viewAsUserId) headers['X-CRM-View-As'] = viewAsUserId;
  const res = await fetch(`${API_BASE_URL}/crm${path}`, { method: 'POST', headers, body: form });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new ApiError(err.error || res.statusText, res.status, err.code);
  }
  return res.json();
}

export function qs(params: Record<string, string | number | boolean | undefined | null>): string {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== '' && v !== false) q.set(k, String(v));
  }
  const s = q.toString();
  return s ? `?${s}` : '';
}

export type CompanyInput = Partial<Pick<Company, 'name' | 'description' | 'logoUrl' | 'website' | 'status'>>;
export type ProjectInput = Partial<Pick<Project, 'companyId' | 'name' | 'description' | 'managerId' | 'status' | 'platforms'>> & {
  startDate?: string; dueDate?: string;
};
export type MemberInput = {
  userId?: string; companyId?: string; projectId?: string | null; role?: string;
  platforms?: Platform[]; extraPermissions?: CrmPermission[]; deniedPermissions?: CrmPermission[]; active?: boolean;
};
export type TaskInput = Partial<Pick<Task, 'projectId' | 'title' | 'description' | 'status' | 'priority' | 'assigneeId' | 'position'>> & {
  dueAt?: string;
};
export type TaskFilter = {
  projectId?: string; companyId?: string; status?: string; assigneeId?: string; mine?: boolean; q?: string;
  dueFrom?: string; dueTo?: string; overdue?: boolean;
};

export type ContentInput = Partial<Pick<ContentItem, 'projectId' | 'title' | 'brief' | 'format' | 'status' | 'assigneeId'>> & { platforms?: Platform[] };
export type PublicationInput = Partial<Pick<Publication, 'title' | 'caption' | 'hashtags' | 'mediaIds' | 'coverMediaId' | 'options'>> & {
  scheduledAt?: string;
};
export type ContentFilter = { projectId?: string; status?: string; platform?: string; assigneeId?: string; mine?: boolean; q?: string };
export type CalendarFilter = { from?: string; to?: string; projectId?: string; platform?: string; assigneeId?: string; status?: string; unscheduled?: boolean };

export const crm = {
  me: () => request<CrmMe>('GET', '/me'),
  dashboard: () => request<Dashboard>('GET', '/dashboard'),
  permissions: () => request<{ permissions: PermissionInfo[]; platforms: Platform[] }>('GET', '/permissions'),

  companies: (status?: string) => request<Company[]>('GET', `/companies${qs({ status })}`),
  company: (id: string) => request<Company>('GET', `/companies/${id}`),
  createCompany: (data: CompanyInput) => request<Company>('POST', '/companies', data),
  updateCompany: (id: string, data: CompanyInput) => request<Company>('PUT', `/companies/${id}`, data),
  deleteCompany: (id: string) => request<void>('DELETE', `/companies/${id}`),

  projects: (f: { companyId?: string; status?: string } = {}) => request<Project[]>('GET', `/projects${qs(f)}`),
  project: (id: string) => request<Project>('GET', `/projects/${id}`),
  createProject: (data: ProjectInput) => request<Project>('POST', '/projects', data),
  updateProject: (id: string, data: ProjectInput) => request<Project>('PUT', `/projects/${id}`, data),
  deleteProject: (id: string) => request<void>('DELETE', `/projects/${id}`),

  members: (f: { companyId?: string; projectId?: string; userId?: string; active?: boolean } = {}) =>
    request<Member[]>('GET', `/members${qs(f)}`),
  createMember: (data: MemberInput) => request<Member>('POST', '/members', data),
  updateMember: (id: string, data: MemberInput) => request<Member>('PUT', `/members/${id}`, data),
  deleteMember: (id: string) => request<void>('DELETE', `/members/${id}`),
  searchUsers: (q: string) => request<UserBrief[]>('GET', `/users/search${qs({ q })}`),

  roles: () => request<Role[]>('GET', '/roles'),
  createRole: (data: Pick<Role, 'key' | 'name' | 'description' | 'permissions'>) => request<Role>('POST', '/roles', data),
  updateRole: (key: string, data: Partial<Pick<Role, 'name' | 'description' | 'permissions'>>) => request<Role>('PUT', `/roles/${key}`, data),
  deleteRole: (key: string) => request<void>('DELETE', `/roles/${key}`),

  tasks: (f: TaskFilter = {}) => request<Task[]>('GET', `/tasks${qs({ ...f, mine: f.mine ? 1 : undefined, overdue: f.overdue ? 1 : undefined })}`),
  task: (id: string) => request<Task>('GET', `/tasks/${id}`),
  createTask: (data: TaskInput) => request<Task>('POST', '/tasks', data),
  updateTask: (id: string, data: TaskInput) => request<Task>('PUT', `/tasks/${id}`, data),
  deleteTask: (id: string) => request<void>('DELETE', `/tasks/${id}`),
  taskComments: (id: string) => request<TaskComment[]>('GET', `/tasks/${id}/comments`),
  addTaskComment: (id: string, body: string) => request<TaskComment>('POST', `/tasks/${id}/comments`, { body }),

  media: (f: { projectId?: string; folder?: string; kind?: string; q?: string } = {}) => {
    // folder "" is a real filter (root folder), so it is passed explicitly.
    const base = qs({ ...f, folder: undefined });
    const folder = f.folder === undefined ? '' : `${base ? '&' : '?'}folder=${encodeURIComponent(f.folder)}`;
    return request<MediaFile[]>('GET', `/media${base}${folder}`);
  },
  mediaFolders: (projectId: string) => request<Array<{ name: string; count: number }>>('GET', `/media/folders${qs({ projectId })}`),
  uploadMedia: (projectId: string, file: File, folder = '') => {
    const form = new FormData();
    form.set('projectId', projectId);
    form.set('folder', folder);
    form.set('file', file);
    return upload<MediaFile>('/media', form);
  },
  uploadMediaVersion: (id: string, file: File) => {
    const form = new FormData();
    form.set('file', file);
    return upload<MediaFile>(`/media/${id}/versions`, form);
  },
  mediaVersions: (id: string) => request<MediaFile[]>('GET', `/media/${id}/versions`),
  updateMedia: (id: string, data: { name?: string; folder?: string }) => request<MediaFile>('PUT', `/media/${id}`, data),
  deleteMedia: (id: string) => request<void>('DELETE', `/media/${id}`),

  contentList: (f: ContentFilter = {}) => request<ContentItem[]>('GET', `/content${qs({ ...f, mine: f.mine ? 1 : undefined })}`),
  content: (id: string) => request<ContentItem>('GET', `/content/${id}`),
  createContent: (data: ContentInput) => request<ContentItem>('POST', '/content', data),
  updateContent: (id: string, data: ContentInput) => request<ContentItem>('PUT', `/content/${id}`, data),
  deleteContent: (id: string) => request<void>('DELETE', `/content/${id}`),
  addPublication: (id: string, platform: Platform) => request<ContentItem>('POST', `/content/${id}/publications`, { platform }),
  updatePublication: (id: string, data: PublicationInput) => request<ContentItem>('PUT', `/publications/${id}`, data),
  deletePublication: (id: string) => request<ContentItem>('DELETE', `/publications/${id}`),
  schedulePublication: (id: string, scheduledAt?: string) => request<ContentItem>('POST', `/publications/${id}/schedule`, { scheduledAt }),
  unschedulePublication: (id: string) => request<ContentItem>('POST', `/publications/${id}/unschedule`),
  markPublished: (id: string, externalUrl: string) => request<ContentItem>('POST', `/publications/${id}/published`, { externalUrl }),
  contentVersions: (id: string) => request<ContentVersion[]>('GET', `/content/${id}/versions`),
  saveContentVersion: (id: string, note: string) => request<ContentVersion>('POST', `/content/${id}/versions`, { note }),
  restoreContentVersion: (id: string, versionId: string) => request<ContentItem>('POST', `/content/${id}/versions/${versionId}/restore`),
  submitContent: (id: string) => request<ContentItem>('POST', `/content/${id}/submit`),
  withdrawContent: (id: string) => request<ContentItem>('POST', `/content/${id}/withdraw`),
  decideContent: (id: string, decision: 'approve' | 'changes' | 'reject', comment: string) =>
    request<ContentItem>('POST', `/content/${id}/decision`, { decision, comment }),
  contentApprovals: (id: string) => request<Approval[]>('GET', `/content/${id}/approvals`),
  approvals: (f: { projectId?: string; mine?: boolean } = {}) => request<ContentItem[]>('GET', `/approvals${qs({ ...f, mine: f.mine ? 1 : undefined })}`),
  approvalFlow: (projectId: string) => request<{ steps: ApprovalStep[]; default: ApprovalStep[] }>('GET', `/projects/${projectId}/approval-flow`),
  updateApprovalFlow: (projectId: string, steps: ApprovalStep[]) =>
    request<{ steps: ApprovalStep[]; default: ApprovalStep[] }>('PUT', `/projects/${projectId}/approval-flow`, { steps }),
  calendar: (f: CalendarFilter) => request<CalendarEntry[]>('GET', `/calendar${qs({ ...f, unscheduled: f.unscheduled ? 1 : undefined })}`),

  activity: (f: { projectId?: string; companyId?: string; entityType?: string; entityId?: string } = {}) =>
    request<Activity[]>('GET', `/activity${qs(f)}`),

  notifications: (f: NotificationFilter = {}) =>
    request<NotificationPage>('GET', `/notifications${qs({ ...f, unread: f.unread ? 1 : undefined })}`),
  unreadCount: () => request<{ count: number }>('GET', '/notifications/unread-count'),
  markNotificationRead: (id: string) => request<CrmNotification>('POST', `/notifications/${id}/read`),
  markAllNotificationsRead: () => request<{ updated: number }>('POST', '/notifications/read-all'),
  deleteNotification: (id: string) => request<void>('DELETE', `/notifications/${id}`),
  notificationSettings: () => request<NotificationSettings>('GET', '/settings/notifications'),
  updateNotificationSettings: (types: Partial<Record<NotificationType, boolean>>) =>
    request<NotificationSettings>('PUT', '/settings/notifications', { types }),
};

export type NotificationType =
  | 'task.assigned' | 'task.status' | 'task.comment' | 'task.due_soon' | 'task.overdue'
  | 'content.assigned' | 'approval.requested' | 'approval.decided'
  | 'publication.scheduled' | 'publication.unscheduled' | 'publication.missed'
  | 'access.granted';

export interface CrmNotification {
  id: string;
  type: NotificationType;
  companyId: string;
  projectId: string;
  projectName: string;
  entityType: 'task' | 'content' | 'publication' | 'member';
  entityId: string;
  actorId: string;
  actor: UserBrief | null;
  /** Snapshot taken when the notice was created (title, platform, step...). */
  payload: Record<string, unknown>;
  readAt: string | null;
  createdAt: string;
}

export interface NotificationPage {
  items: CrmNotification[];
  total: number;
  hasMore: boolean;
}

export type NotificationFilter = { unread?: boolean; type?: string; limit?: number; offset?: number };

export interface NotificationSettings {
  types: Array<{ type: NotificationType; group: 'tasks' | 'content' | 'access'; enabled: boolean }>;
  /** Only in-app delivery exists today; email is listed as not available. */
  channels: Array<{ key: 'in_app' | 'email'; available: boolean }>;
}

/** Mirrors Access.Can on the server for one scope (UI only). */
export function scopeCan(scope: Scope | undefined, p: CrmPermission): boolean {
  return !!scope && scope.permissions.includes(p);
}
