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

export interface Inquiry {
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  interest?: string;
  topic?: string;
  message?: string;
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

    changePassword: (data: PasswordChangeRequest): Promise<void> => 
      fetchAPI<void>('/user/password', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
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

    // Services Management
    createService: (locale: Locale, service: Partial<Service>): Promise<Service> => 
      fetchAPI<Service>(`/admin/services?locale=${locale}`, {
        method: 'POST',
        body: JSON.stringify(service),
      }),

    updateService: (id: string, locale: Locale, service: Partial<Service>): Promise<Service> => 
      fetchAPI<Service>(`/admin/services/${id}?locale=${locale}`, {
        method: 'PUT',
        body: JSON.stringify(service),
      }),

    deleteService: (id: string): Promise<void> => 
      fetchAPI<void>(`/admin/services/${id}`, { 
        method: 'DELETE' 
      }),

    // Projects Management
    createProject: (locale: Locale, project: Partial<Project>): Promise<Project> => 
      fetchAPI<Project>(`/admin/projects?locale=${locale}`, {
        method: 'POST',
        body: JSON.stringify(project),
      }),

    updateProject: (id: string, locale: Locale, project: Partial<Project>): Promise<Project> => 
      fetchAPI<Project>(`/admin/projects/${id}?locale=${locale}`, {
        method: 'PUT',
        body: JSON.stringify(project),
      }),

    deleteProject: (id: string): Promise<void> => 
      fetchAPI<void>(`/admin/projects/${id}`, { 
        method: 'DELETE' 
      }),

    // Blog Management
    createBlogPost: (locale: Locale, post: Partial<BlogPost>): Promise<BlogPost> => 
      fetchAPI<BlogPost>(`/admin/blog?locale=${locale}`, {
        method: 'POST',
        body: JSON.stringify(post),
      }),

    updateBlogPost: (id: string, locale: Locale, post: Partial<BlogPost>): Promise<BlogPost> => 
      fetchAPI<BlogPost>(`/admin/blog/${id}?locale=${locale}`, {
        method: 'PUT',
        body: JSON.stringify(post),
      }),

    deleteBlogPost: (id: string): Promise<void> => 
      fetchAPI<void>(`/admin/blog/${id}`, { 
        method: 'DELETE' 
      }),

    // Careers Management
    createCareer: (locale: Locale, career: Partial<Career>): Promise<Career> => 
      fetchAPI<Career>(`/admin/careers?locale=${locale}`, {
        method: 'POST',
        body: JSON.stringify(career),
      }),

    updateCareer: (id: string, locale: Locale, career: Partial<Career>): Promise<Career> => 
      fetchAPI<Career>(`/admin/careers/${id}?locale=${locale}`, {
        method: 'PUT',
        body: JSON.stringify(career),
      }),

    deleteCareer: (id: string): Promise<void> => 
      fetchAPI<void>(`/admin/careers/${id}`, { 
        method: 'DELETE' 
      }),

    // Employees Management
    createEmployee: (locale: Locale, employee: Partial<Employee>): Promise<Employee> => 
      fetchAPI<Employee>(`/admin/employees?locale=${locale}`, {
        method: 'POST',
        body: JSON.stringify(employee),
      }),

    updateEmployee: (id: string, locale: Locale, employee: Partial<Employee>): Promise<Employee> => 
      fetchAPI<Employee>(`/admin/employees/${id}?locale=${locale}`, {
        method: 'PUT',
        body: JSON.stringify(employee),
      }),

    deleteEmployee: (id: string): Promise<void> => 
      fetchAPI<void>(`/admin/employees/${id}`, { 
        method: 'DELETE' 
      }),

    // INQUIRIES MANAGEMENT - ADMIN ONLY
    getInquiries: (): Promise<Inquiry[]> => 
      fetchAPI<Inquiry[]>('/inquiries'), // GET /api/v1/inquiries (Admin auth required)

    updateInquiryStatus: (id: string, status: string): Promise<void> =>
      fetchAPI<void>(`/inquiries/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      }),

    deleteInquiry: (id: string): Promise<void> =>
      fetchAPI<void>(`/inquiries/${id}`, { 
        method: 'DELETE' 
      }),

    // User Management
    getUsers: (): Promise<User[]> => 
      fetchAPI<User[]>('/admin/users'),

    deleteUser: (email: string): Promise<void> => 
      fetchAPI<void>(`/admin/users/${email}`, { 
        method: 'DELETE' 
      }),
  },
};