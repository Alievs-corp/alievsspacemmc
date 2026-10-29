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
  upcoming: Array<Pick<Task, 'id' | 'title' | 'projectId' | 'projectName' | 'status' | 'priority' | 'dueAt' | 'assignee'>>;
  companyBreakdown?: Array<{ id: string; name: string; status: CompanyStatus; projects: number; members: number; openTasks: number; overdue: number }>;
}

/** Set by CrmContext while a super admin uses "View as user". */
let viewAsUserId: string | null = null;
export function setViewAs(id: string | null) { viewAsUserId = id; }

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
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

function qs(params: Record<string, string | number | boolean | undefined | null>): string {
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

  activity: (f: { projectId?: string; companyId?: string; entityType?: string; entityId?: string } = {}) =>
    request<Activity[]>('GET', `/activity${qs(f)}`),
};

/** Mirrors Access.Can on the server for one scope (UI only). */
export function scopeCan(scope: Scope | undefined, p: CrmPermission): boolean {
  return !!scope && scope.permissions.includes(p);
}
