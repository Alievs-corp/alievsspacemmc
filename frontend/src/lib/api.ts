import { BIG_UPLOAD_THRESHOLD, bigUpload } from './bigUpload';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

/** Locales the CMS backend actually stores content for. */
export const CMS_LOCALES = ['en', 'az', 'ru'] as const;
export type Locale = (typeof CMS_LOCALES)[number];

/** The UI supports more languages than the CMS; anything else reads English. */
export function toCmsLocale(locale: string): Locale {
  return (CMS_LOCALES as readonly string[]).includes(locale) ? (locale as Locale) : 'en';
}

/** Create/update bodies carry every language at once: { en: {...}, az: {...}, ru: {...} }. */
export type MultiLocale<T> = Partial<Record<Locale, Partial<T>>>;

export interface Settings {
  brandName: string;
  tagline: string;
  accent: string;
  email: string;
  phone: string;
  address: string;
  social: {
    instagram: string;
    linkedin: string;
    youtube: string;
  };
  cta: {
    primaryText: string;
    primaryHref: string;
  };
}

export interface Home {
  heroTitle: string;
  heroSubtitle: string;
  heroImage?: string;
  highlights: Array<{ title: string; desc: string; image?: string }>;
  proof: Array<{ kpi: string; label: string }>;
}

export interface About {
  headline: string;
  headlineImage?: string;
  paragraphs: string[];
  values: string[];
  process: Array<{ title: string; desc: string; image?: string }>;
}

export interface MarketingPartner {
  name: string;
  logo: string;
  link: string;
  desc: string;
}

export interface MarketingMedia {
  kind: 'image' | 'video';
  /** Image URL, uploaded video file, or a YouTube/Vimeo link. */
  url: string;
  poster: string;
  caption: string;
}

export interface Marketing {
  headline: string;
  intro: string;
  partners: MarketingPartner[];
  gallery: MarketingMedia[];
}

export interface Service {
  id: string;
  category: string;
  title: string;
  desc: string;
  bullets: string[];
  image?: string;
}

export interface Project {
  id: string;
  title: string;
  industry: string;
  summary: string;
  image?: string;
  tags: string[];
  link?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  date: string;
  image?: string;
  tags: string[];
  excerpt: string;
  content: string;
}

export interface Career {
  id: string;
  title: string;
  type: string;
  location: string;
  desc: string;
  requirements: string[];
  status: string;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  experience: string;
  photo: string;
  bio: string;
}

export interface Inquiry {
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  interest?: string;
  topic?: string;
  message?: string;
}

export type Role = 'user' | 'admin' | 'super_admin';

/** Admin areas an ADMIN can be granted; SUPER_ADMIN implicitly has all. */
export const PERMISSIONS = ['content', 'inquiries', 'applications', 'academy', 'users.view', 'users.manage'] as const;
export type Permission = (typeof PERMISSIONS)[number];

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  company?: string;
  role: Role;
  permissions: Permission[];
  blocked: boolean;
  lastLoginAt?: string;
  createdAt: string;
}

export function isAdminRole(role?: Role): boolean {
  return role === 'admin' || role === 'super_admin';
}

/** Where a role lands after signing in: the admin panel is super-admin only. */
export function homePath(role?: Role): string {
  if (role === 'super_admin') return '/panel';
  if (role === 'admin') return '/crm';
  return '/profile';
}

export function hasPermission(user: User | null | undefined, p: Permission): boolean {
  if (!user || user.blocked) return false;
  if (user.role === 'super_admin') return true;
  return user.role === 'admin' && (user.permissions || []).includes(p);
}

export interface Paginated<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface FinanceSalary {
  id: string;
  name: string;
  card: number;
  cash: number;
  bonus: number;
  description: string;
}

/** One (possibly partial) salary payment; `month` is YYYY-MM, `date` is YYYY-MM-DD. */
export interface FinancePayment {
  id: string;
  salaryId: string;
  month: string;
  date: string;
  amount: number;
  description: string;
}

/** A (partial) payment against a debt (paid out) or an expected income (received). */
export interface FinanceSettlement {
  id: string;
  date: string;
  amount: number;
  description: string;
}

export interface FinanceDebt {
  name: string;
  kind: 'debt' | 'payment';
  amount: number;
  date: string;
  description: string;
  settlements: FinanceSettlement[];
}

export interface FinanceIncome {
  name: string;
  kind: 'income' | 'expected';
  amount: number;
  date: string;
  description: string;
  settlements: FinanceSettlement[];
}

export interface Finance {
  currency: string;
  salaries: FinanceSalary[];
  payments: FinancePayment[];
  debts: FinanceDebt[];
  income: FinanceIncome[];
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorEmail: string;
  action: string;
  targetType: string;
  targetId: string;
  details: string;
  ip: string;
  status: number;
  createdAt: string;
}

export interface SystemSettings {
  registrationEnabled: boolean;
  inquiriesEnabled: boolean;
  jobApplicationsEnabled: boolean;
  academyRegistrationEnabled: boolean;
  maintenanceMessage: string;
}

export interface ServiceStatus {
  name: string;
  status: 'ok' | 'down' | 'disabled' | 'unknown' | 'warning';
  latencyMs: number;
  message?: string;
}

export interface SystemOverview {
  users?: {
    total: number;
    byRole: Record<Role, number>;
    blocked: number;
    newLast7Days: number;
    newLast30Days: number;
    activeLast7Days: number;
  };
  counts: { inquiries?: number; applications?: number; academyRegistrations?: number };
  services: ServiceStatus[];
  requests: { total: number; failed: number; uptimeSeconds: number };
  modules: SystemSettings;
  recentActivity?: AuditLog[];
}

export interface IntegrationSetting {
  key: string;
  value: string;
  secret: boolean;
  isSet: boolean;
}

export interface Integration {
  id: string;
  name: string;
  description: string;
  status: ServiceStatus['status'];
  message?: string;
  latencyMs: number;
  settings: IntegrationSetting[];
}

export interface ApiErrorEntry {
  time: string;
  method: string;
  path: string;
  status: number;
  latencyMs: number;
  error?: string;
}

export interface JobApplication {
  id: string;
  careerId: string;
  name: string;
  email: string;
  phone: string;
  coverLetter: string;
  resumeUrl: string;
  status: string;
  createdAt: string;
}

export interface LoginResponse {
  token: string;
  user?: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phone?: string;
  company?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
}

export interface Content {
  settings: Settings;
  home: Home;
  about: About;
  services: Service[];
  projects: Project[];
  blog: BlogPost[];
  careers: Career[];
  employees: Employee[];
}

function getAuthToken(): string | null {
  return localStorage.getItem('auth_token');
}

/** Thrown for non-2xx responses; `code` is the API's machine-readable reason. */
export class ApiError extends Error {
  status: number;
  code?: string;
  constructor(message: string, status: number, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new ApiError(error.error || `API error: ${response.statusText}`, response.status, error.code);
  }

  return response.json();
}

function qs(params: Record<string, string | number | undefined>): string {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== '') q.set(k, String(v));
  }
  const s = q.toString();
  return s ? `?${s}` : '';
}

/**
 * Fetch a list endpoint, tolerating both a plain array and the API's
 * paginated envelope ({ data: [...], page, limit, total, totalPages }).
 * Always resolves to an array so callers can safely .map()/.slice().
 */
async function fetchList<T>(endpoint: string, options?: RequestInit): Promise<T[]> {
  const res = await fetchAPI<unknown>(endpoint, options);
  if (Array.isArray(res)) return res as T[];
  if (res && typeof res === 'object' && Array.isArray((res as { data?: unknown }).data)) {
    return (res as { data: T[] }).data;
  }
  return [];
}

export const api = {
  getContent: (locale: Locale = 'en'): Promise<Content> => 
    fetchAPI<Content>(`/content?locale=${locale}`),

  getSettings: (locale: Locale = 'en'): Promise<Settings> => 
    fetchAPI<Settings>(`/settings?locale=${locale}`),

  getHome: (locale: Locale = 'en'): Promise<Home> => 
    fetchAPI<Home>(`/home?locale=${locale}`),

  getAbout: (locale: Locale = 'en'): Promise<About> => 
    fetchAPI<About>(`/about?locale=${locale}`),
  
  getMarketing: (locale: Locale = 'en'): Promise<Marketing> =>
    fetchAPI<Marketing>(`/marketing?locale=${locale}`),

  getServices: (locale: Locale = 'en'): Promise<Service[]> => 
    fetchList<Service>(`/services?locale=${locale}`),

  getService: (id: string, locale: Locale = 'en'): Promise<Service> => 
    fetchAPI<Service>(`/services/${id}?locale=${locale}`),

  getProjects: (locale: Locale = 'en'): Promise<Project[]> => 
    fetchList<Project>(`/projects?locale=${locale}`),

  getProject: (id: string, locale: Locale = 'en'): Promise<Project> => 
    fetchAPI<Project>(`/projects/${id}?locale=${locale}`),

  getBlogPosts: (locale: Locale = 'en'): Promise<BlogPost[]> => 
    fetchList<BlogPost>(`/blog?locale=${locale}`),

  getBlogPost: (id: string, locale: Locale = 'en'): Promise<BlogPost> => 
    fetchAPI<BlogPost>(`/blog/${id}?locale=${locale}`),

  getCareers: (locale: Locale = 'en'): Promise<Career[]> => 
    fetchList<Career>(`/careers?locale=${locale}`),

  getCareer: (id: string, locale: Locale = 'en'): Promise<Career> => 
    fetchAPI<Career>(`/careers/${id}?locale=${locale}`),

  getEmployees: (locale: Locale = 'en'): Promise<Employee[]> => 
    fetchList<Employee>(`/employees?locale=${locale}`),

  getEmployee: (id: string, locale: Locale = 'en'): Promise<Employee> => 
    fetchAPI<Employee>(`/employees/${id}?locale=${locale}`),

  getSystemStatus: (): Promise<SystemSettings> => fetchAPI<SystemSettings>('/system/status'),

  createInquiry: (inquiry: Inquiry): Promise<any> => 
    fetchAPI('/inquiries', {
      method: 'POST',
      body: JSON.stringify(inquiry),
    }),

  auth: {
    adminLogin: (credentials: LoginRequest): Promise<LoginResponse> => 
      fetchAPI<LoginResponse>('/auth/admin/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),

    register: (data: RegisterRequest): Promise<LoginResponse> => 
      fetchAPI<LoginResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    login: (credentials: LoginRequest): Promise<LoginResponse> => 
      fetchAPI<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
  },

  user: {
    getProfile: (): Promise<User> => 
      fetchAPI<User>('/user/profile'),

    updateProfile: (data: Partial<User>): Promise<User> => 
      fetchAPI<User>('/user/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    /** Signs out every other session; the response carries a fresh token for this one. */
    changePassword: (data: PasswordChangeRequest): Promise<{ message: string; token: string }> =>
      fetchAPI('/user/password', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    logoutEverywhere: (): Promise<void> => fetchAPI<void>('/user/logout-all', { method: 'POST' }),
  },

  admin: {
    updateSettings: (locale: Locale, settings: Partial<Settings>): Promise<Settings> => 
      fetchAPI<Settings>(`/admin/settings?locale=${locale}`, {
        method: 'PUT',
        body: JSON.stringify(settings),
      }),

    updateHome: (locale: Locale, home: Partial<Home>): Promise<Home> => 
      fetchAPI<Home>(`/admin/home?locale=${locale}`, {
        method: 'PUT',
        body: JSON.stringify(home),
      }),

    updateAbout: (locale: Locale, about: Partial<About>): Promise<About> => 
      fetchAPI<About>(`/admin/about?locale=${locale}`, {
        method: 'PUT',
        body: JSON.stringify(about),
      }),

    updateMarketing: (locale: Locale, data: Marketing): Promise<Marketing> =>
      fetchAPI<Marketing>(`/admin/marketing?locale=${locale}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    // Services Management
    createService: (data: MultiLocale<Service>): Promise<MultiLocale<Service>> =>
      fetchAPI<MultiLocale<Service>>(`/admin/services`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    updateService: (id: string, data: MultiLocale<Service>): Promise<MultiLocale<Service>> =>
      fetchAPI<MultiLocale<Service>>(`/admin/services/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    deleteService: (id: string): Promise<void> => 
      fetchAPI<void>(`/admin/services/${id}`, { 
        method: 'DELETE' 
      }),

    // Projects Management
    createProject: (data: MultiLocale<Project>): Promise<MultiLocale<Project>> =>
      fetchAPI<MultiLocale<Project>>(`/admin/projects`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    updateProject: (id: string, data: MultiLocale<Project>): Promise<MultiLocale<Project>> =>
      fetchAPI<MultiLocale<Project>>(`/admin/projects/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    deleteProject: (id: string): Promise<void> => 
      fetchAPI<void>(`/admin/projects/${id}`, { 
        method: 'DELETE' 
      }),

    // Blog Management
    createBlogPost: (data: MultiLocale<BlogPost>): Promise<MultiLocale<BlogPost>> =>
      fetchAPI<MultiLocale<BlogPost>>(`/admin/blog`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    updateBlogPost: (id: string, data: MultiLocale<BlogPost>): Promise<MultiLocale<BlogPost>> =>
      fetchAPI<MultiLocale<BlogPost>>(`/admin/blog/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    deleteBlogPost: (id: string): Promise<void> => 
      fetchAPI<void>(`/admin/blog/${id}`, { 
        method: 'DELETE' 
      }),

    // Careers Management
    createCareer: (data: MultiLocale<Career>): Promise<MultiLocale<Career>> =>
      fetchAPI<MultiLocale<Career>>(`/admin/careers`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    updateCareer: (id: string, data: MultiLocale<Career>): Promise<MultiLocale<Career>> =>
      fetchAPI<MultiLocale<Career>>(`/admin/careers/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    deleteCareer: (id: string): Promise<void> => 
      fetchAPI<void>(`/admin/careers/${id}`, { 
        method: 'DELETE' 
      }),

    // Employees Management
    createEmployee: (data: MultiLocale<Employee>): Promise<MultiLocale<Employee>> =>
      fetchAPI<MultiLocale<Employee>>(`/admin/employees`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    updateEmployee: (id: string, data: MultiLocale<Employee>): Promise<MultiLocale<Employee>> =>
      fetchAPI<MultiLocale<Employee>>(`/admin/employees/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    deleteEmployee: (id: string): Promise<void> => 
      fetchAPI<void>(`/admin/employees/${id}`, { 
        method: 'DELETE' 
      }),

    // INQUIRIES MANAGEMENT - ADMIN ONLY
    getInquiries: (): Promise<Inquiry[]> =>
      fetchList<Inquiry>('/admin/inquiries'), // GET /api/v1/admin/inquiries (Admin auth required)

    updateInquiryStatus: (id: string, status: string): Promise<void> =>
      fetchAPI<void>(`/admin/inquiries/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      }),

    deleteInquiry: (id: string): Promise<void> =>
      fetchAPI<void>(`/admin/inquiries/${id}`, { 
        method: 'DELETE' 
      }),

    deleteAllInquiries: (): Promise<void> =>
      fetchAPI<void>('/admin/inquiries', { 
        method: 'DELETE' 
      }),

    // User Management
    getUsers: (): Promise<User[]> =>
      fetchList<User>('/admin/users?limit=100'),

    searchUsers: (params: { q?: string; role?: Role | 'staff' | ''; status?: 'active' | 'blocked' | ''; page?: number; limit?: number }): Promise<Paginated<User>> =>
      fetchAPI<Paginated<User>>(`/admin/users${qs(params)}`),

    getUser: (id: string): Promise<User> => fetchAPI<User>(`/admin/users/${encodeURIComponent(id)}`),

    setUserRole: (id: string, role: Role, permissions: Permission[] = []): Promise<User> =>
      fetchAPI<User>(`/admin/users/${encodeURIComponent(id)}/role`, {
        method: 'PUT',
        body: JSON.stringify({ role, permissions }),
      }),

    setUserPermissions: (id: string, permissions: Permission[]): Promise<User> =>
      fetchAPI<User>(`/admin/users/${encodeURIComponent(id)}/permissions`, {
        method: 'PUT',
        body: JSON.stringify({ permissions }),
      }),

    setUserBlocked: (id: string, blocked: boolean): Promise<User> =>
      fetchAPI<User>(`/admin/users/${encodeURIComponent(id)}/block`, {
        method: 'PUT',
        body: JSON.stringify({ blocked }),
      }),

    revokeUserSessions: (id: string): Promise<void> =>
      fetchAPI<void>(`/admin/users/${encodeURIComponent(id)}/revoke-sessions`, { method: 'POST' }),

    // System
    getOverview: (): Promise<SystemOverview> => fetchAPI<SystemOverview>('/admin/system/overview'),

    getIntegrations: (): Promise<{ integrations: Integration[]; runtime: { goVersion: string; port: string } }> =>
      fetchAPI('/admin/system/integrations'),

    getRecentErrors: (): Promise<ApiErrorEntry[]> => fetchList<ApiErrorEntry>('/admin/system/errors'),

    getFinance: (): Promise<Finance> => fetchAPI<Finance>('/admin/finance'),

    updateFinance: (data: Finance): Promise<Finance> =>
      fetchAPI<Finance>('/admin/finance', { method: 'PUT', body: JSON.stringify(data) }),

    getAuditLogs: (params: { q?: string; actorId?: string; page?: number; limit?: number }): Promise<Paginated<AuditLog>> =>
      fetchAPI<Paginated<AuditLog>>(`/admin/audit-logs${qs(params)}`),

    getSystemSettings: (): Promise<SystemSettings> => fetchAPI<SystemSettings>('/admin/system/settings'),

    updateSystemSettings: (settings: SystemSettings): Promise<SystemSettings> =>
      fetchAPI<SystemSettings>('/admin/system/settings', {
        method: 'PUT',
        body: JSON.stringify(settings),
      }),

    // Job applications
    getApplications: (): Promise<JobApplication[]> => fetchList<JobApplication>('/admin/applications?limit=100'),

    updateApplicationStatus: (id: string, status: string): Promise<void> =>
      fetchAPI<void>(`/admin/applications/${encodeURIComponent(id)}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      }),

    deleteApplication: (id: string): Promise<void> =>
      fetchAPI<void>(`/admin/applications/${encodeURIComponent(id)}`, { method: 'DELETE' }),

    deleteUser: (email: string): Promise<void> => 
      fetchAPI<void>(`/admin/users/${encodeURIComponent(email)}`, { 
        method: 'DELETE' 
      }),

    // File Upload
    uploadFile: (file: File, folder?: string, isPublic?: boolean, opts?: { onProgress?: (fraction: number) => void; signal?: AbortSignal }): Promise<{ url: string; filename: string; size: number }> => {
      // Big files (videos up to 40 GB) go to storage in parts instead of one request.
      if (file.size > BIG_UPLOAD_THRESHOLD) {
        return bigUpload(
          <T,>(path: string, body: unknown) => fetchAPI<T>(path, { method: 'POST', body: JSON.stringify(body) }),
          file,
          { folder, isPublic, onProgress: opts?.onProgress, signal: opts?.signal },
        );
      }
      const formData = new FormData();
      formData.append('file', file);
      
      const url = new URL(`${API_BASE_URL}/admin/upload`);
      if (folder) url.searchParams.append('folder', folder);
      if (isPublic !== undefined) url.searchParams.append('public', String(isPublic));
      
      const token = getAuthToken();
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      return fetch(url.toString(), {
        method: 'POST',
        headers,
        body: formData,
      }).then(async (response) => {
        if (!response.ok) {
          const error = await response.json().catch(() => ({ error: response.statusText }));
          throw new Error(error.error || `API error: ${response.statusText}`);
        }
        return response.json();
      });
    },

    deleteFile: (key: string): Promise<void> => {
      const url = new URL(`${API_BASE_URL}/admin/upload`);
      url.searchParams.append('key', key);
      
      return fetchAPI<void>(url.pathname + url.search, {
        method: 'DELETE',
      });
    },
  },
};