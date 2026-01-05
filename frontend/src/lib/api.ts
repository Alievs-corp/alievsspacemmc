const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

export type Locale = 'en' | 'az' | 'ru';

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
  highlights: Array<{ title: string; desc: string }>;
  proof: Array<{ kpi: string; label: string }>;
}

export interface About {
  headline: string;
  paragraphs: string[];
  values: string[];
  process: string[];
}

export interface Service {
  id: string;
  category: string;
  title: string;
  desc: string;
  bullets: string[];
}

export interface Project {
  id: string;
  title: string;
  industry: string;
  summary: string;
  tags: string[];
  link?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  date: string;
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

export interface Inquiry {
  id: string;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  interest?: string;
  topic?: string;
  message?: string;
  status?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  company?: string;
  role: 'admin' | 'user';
}

export interface LoginResponse {
  token: string;
  user?: User;
  admin?: boolean;
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

function getAuthToken(): string | null {
  return localStorage.getItem('auth_token');
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
    throw new Error(error.error || `API error: ${response.statusText}`);
  }

  return response.json();
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

  getServices: (locale: Locale = 'en'): Promise<Service[]> =>
    fetchAPI<Service[]>(`/services?locale=${locale}`),

  getService: (id: string, locale: Locale = 'en'): Promise<Service> =>
    fetchAPI<Service>(`/services/${id}?locale=${locale}`),

  getProjects: (locale: Locale = 'en'): Promise<Project[]> =>
    fetchAPI<Project[]>(`/projects?locale=${locale}`),

  getProject: (id: string, locale: Locale = 'en'): Promise<Project> =>
    fetchAPI<Project>(`/projects/${id}?locale=${locale}`),

  getBlogPosts: (locale: Locale = 'en'): Promise<BlogPost[]> =>
    fetchAPI<BlogPost[]>(`/blog?locale=${locale}`),

  getBlogPost: (id: string, locale: Locale = 'en'): Promise<BlogPost> =>
    fetchAPI<BlogPost>(`/blog/${id}?locale=${locale}`),

  getCareers: (locale: Locale = 'en'): Promise<Career[]> =>
    fetchAPI<Career[]>(`/careers?locale=${locale}`),

  getCareer: (id: string, locale: Locale = 'en'): Promise<Career> =>
    fetchAPI<Career>(`/careers/${id}?locale=${locale}`),

  getEmployees: (locale: Locale = 'en'): Promise<Employee[]> =>
    fetchAPI<Employee[]>(`/employees?locale=${locale}`),

  getEmployee: (id: string, locale: Locale = 'en'): Promise<Employee> =>
    fetchAPI<Employee>(`/employees/${id}?locale=${locale}`),

  createInquiry: (inquiry: Omit<Inquiry, 'id' | 'createdAt'>): Promise<Inquiry> =>
    fetchAPI<Inquiry>('/inquiries', {
      method: 'POST',
      body: JSON.stringify(inquiry),
    }),

  auth: {
    adminLogin: (credentials: LoginRequest): Promise<LoginResponse> =>
      fetchAPI<LoginResponse>('/auth/admin/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),

    userLogin: (credentials: LoginRequest): Promise<LoginResponse> =>
      fetchAPI<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),

    register: (data: RegisterRequest): Promise<LoginResponse> =>
      fetchAPI<LoginResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    getCurrentUser: (): Promise<User> => fetchAPI<User>('/user/profile'),

    updateProfile: (data: Partial<User>): Promise<User> =>
      fetchAPI<User>('/user/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    changePassword: (currentPassword: string, newPassword: string): Promise<void> =>
      fetchAPI<void>('/user/password', {
        method: 'PUT',
        body: JSON.stringify({ currentPassword, newPassword }),
      }),
  },

  admin: {
    getInquiries: (): Promise<Inquiry[]> => fetchAPI<Inquiry[]>('/admin/inquiries'),

    updateInquiryStatus: (id: string, status: string): Promise<void> =>
      fetchAPI<void>(`/admin/inquiries/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      }),

    deleteInquiry: (id: string): Promise<void> =>
      fetchAPI<void>(`/admin/inquiries/${id}`, { method: 'DELETE' }),

    deleteAllInquiries: (): Promise<void> =>
      fetchAPI<void>('/admin/inquiries', { method: 'DELETE' }),

    getAllUsers: (): Promise<User[]> => fetchAPI<User[]>('/admin/users'),

    deleteUser: (email: string): Promise<void> =>
      fetchAPI<void>(`/admin/users/${email}`, { method: 'DELETE' }),

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

    createService: (services: Record<Locale, Partial<Service>>): Promise<{ id: string }> =>
      fetchAPI<{ id: string }>('/admin/services', {
        method: 'POST',
        body: JSON.stringify(services),
      }),

    updateService: (id: string, services: Record<Locale, Partial<Service>>): Promise<void> =>
      fetchAPI<void>(`/admin/services/${id}`, {
        method: 'PUT',
        body: JSON.stringify(services),
      }),

    deleteService: (id: string): Promise<void> =>
      fetchAPI<void>(`/admin/services/${id}`, { method: 'DELETE' }),

    createProject: (projects: Record<Locale, Partial<Project>>): Promise<{ id: string }> =>
      fetchAPI<{ id: string }>('/admin/projects', {
        method: 'POST',
        body: JSON.stringify(projects),
      }),

    updateProject: (id: string, projects: Record<Locale, Partial<Project>>): Promise<void> =>
      fetchAPI<void>(`/admin/projects/${id}`, {
        method: 'PUT',
        body: JSON.stringify(projects),
      }),

    deleteProject: (id: string): Promise<void> =>
      fetchAPI<void>(`/admin/projects/${id}`, { method: 'DELETE' }),

    createBlogPost: (posts: Record<Locale, Partial<BlogPost>>): Promise<{ id: string }> =>
      fetchAPI<{ id: string }>('/admin/blog', {
        method: 'POST',
        body: JSON.stringify(posts),
      }),

    updateBlogPost: (id: string, posts: Record<Locale, Partial<BlogPost>>): Promise<void> =>
      fetchAPI<void>(`/admin/blog/${id}`, {
        method: 'PUT',
        body: JSON.stringify(posts),
      }),

    deleteBlogPost: (id: string): Promise<void> =>
      fetchAPI<void>(`/admin/blog/${id}`, { method: 'DELETE' }),

    createCareer: (careers: Record<Locale, Partial<Career>>): Promise<{ id: string }> =>
      fetchAPI<{ id: string }>('/admin/careers', {
        method: 'POST',
        body: JSON.stringify(careers),
      }),

    updateCareer: (id: string, careers: Record<Locale, Partial<Career>>): Promise<void> =>
      fetchAPI<void>(`/admin/careers/${id}`, {
        method: 'PUT',
        body: JSON.stringify(careers),
      }),

    deleteCareer: (id: string): Promise<void> =>
      fetchAPI<void>(`/admin/careers/${id}`, { method: 'DELETE' }),

    createEmployee: (employees: Record<Locale, Partial<Employee>>): Promise<{ id: string }> =>
      fetchAPI<{ id: string }>('/admin/employees', {
        method: 'POST',
        body: JSON.stringify(employees),
      }),

    updateEmployee: (id: string, employees: Record<Locale, Partial<Employee>>): Promise<void> =>
      fetchAPI<void>(`/admin/employees/${id}`, {
        method: 'PUT',
        body: JSON.stringify(employees),
      }),

    deleteEmployee: (id: string): Promise<void> =>
      fetchAPI<void>(`/admin/employees/${id}`, { method: 'DELETE' }),
  },
};

