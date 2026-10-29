import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense, type ReactNode } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { I18nProvider } from './contexts/I18nContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { MarketProvider } from './contexts/MarketContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ScrollToTop } from './components/ScrollToTop';
import { ContentProvider } from './contexts/ContentContext';
import { AuthProvider } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { ProtectedRoute, AccessDenied } from './components/ProtectedRoute';
import { CrmProvider, useCrm } from './contexts/CrmContext';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Services } from './pages/Services';
import Contact  from './pages/Contact';
import { Industries } from './pages/Industries';
import CaseStudies from './pages/CaseStudies';
import Packages from './pages/Packages';
import Faq from './pages/Faq';
import Process from './pages/Process';
import NotFound from './pages/NotFound';


/* Legal texts, case-study detail and job pages: long, rarely opened, and not
   part of the conversion path — keep them out of the initial bundle. */
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy').then((m) => ({ default: m.PrivacyPolicy })));
const TermsOfService = lazy(() => import('./pages/TermsOfService').then((m) => ({ default: m.TermsOfService })));
const RefundPolicy = lazy(() => import('./pages/RefundPolicy').then((m) => ({ default: m.RefundPolicy })));
const CookiePolicy = lazy(() => import('./pages/CookiePolicy').then((m) => ({ default: m.CookiePolicy })));
const Careers = lazy(() => import('./pages/Careers').then((m) => ({ default: m.Careers })));
const MarketplaceMVP = lazy(() => import('./pages/MarketplaceMVP'));
const FintechReportingDashboard = lazy(() => import('./pages/FintechReportingDashboard'));
const InventorySystem = lazy(() => import('./pages/InventorySystem'));
const Frontend = lazy(() => import('./pages/Frontend'));
const Backend = lazy(() => import('./pages/Backend'));
const UiDesigner = lazy(() => import('./pages/UiDesigner'));
const Apply = lazy(() => import('./pages/Apply'));

/* Admin screens load on demand — they must not weigh down public pages. */
const Register = lazy(() => import('./pages/admin/Register').then((m) => ({ default: m.Register })));
const Login = lazy(() => import('./pages/admin/Login').then((m) => ({ default: m.Login })));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard').then((m) => ({ default: m.AdminDashboard })));
const AdminLayout = lazy(() => import('./components/admin/AdminLayout').then((m) => ({ default: m.AdminLayout })));
const AdminServices = lazy(() => import('./pages/admin/Services').then((m) => ({ default: m.AdminServices })));
const AdminProjects = lazy(() => import('./pages/admin/Projects').then((m) => ({ default: m.AdminProjects })));
const AdminBlog = lazy(() => import('./pages/admin/Blog').then((m) => ({ default: m.AdminBlog })));
const AdminCareers = lazy(() => import('./pages/admin/Careers').then((m) => ({ default: m.AdminCareers })));
const AdminInquiries = lazy(() => import('./pages/admin/Inquiry').then((m) => ({ default: m.AdminInquiries })));
const AdminSettings = lazy(() => import('./pages/admin/Settings').then((m) => ({ default: m.AdminSettings })));
const AdminHome = lazy(() => import('./pages/admin/Home').then((m) => ({ default: m.AdminHome })));
const AdminAbout = lazy(() => import('./pages/admin/About').then((m) => ({ default: m.AdminAbout })));
const AdminUsers = lazy(() => import('./pages/admin/Users').then((m) => ({ default: m.AdminUsers })));
const AdminAdmins = lazy(() => import('./pages/admin/Users').then((m) => ({ default: m.AdminAdmins })));
const AdminApplications = lazy(() => import('./pages/admin/Applications').then((m) => ({ default: m.AdminApplications })));
const AdminIntegrations = lazy(() => import('./pages/admin/Integrations').then((m) => ({ default: m.AdminIntegrations })));
const AdminSystem = lazy(() => import('./pages/admin/System').then((m) => ({ default: m.AdminSystem })));
const AdminAuditLog = lazy(() => import('./pages/admin/AuditLog').then((m) => ({ default: m.AdminAuditLog })));
const Profile = lazy(() => import('./pages/Profile'));

/* CRM: its own layout and chunk, entered from the header's CRM tab. */
const CrmGate = lazy(() => import('./pages/crm/Gate').then((m) => ({ default: m.CrmGate })));
const SoonPage = lazy(() => import('./pages/crm/Gate').then((m) => ({ default: m.SoonPage })));
const CrmDashboard = lazy(() => import('./pages/crm/Dashboard').then((m) => ({ default: m.CrmDashboard })));
const CrmCompanies = lazy(() => import('./pages/crm/Companies').then((m) => ({ default: m.CrmCompanies })));
const CrmCompanyDetail = lazy(() => import('./pages/crm/Companies').then((m) => ({ default: m.CrmCompanyDetail })));
const CrmProjects = lazy(() => import('./pages/crm/Projects').then((m) => ({ default: m.CrmProjects })));
const CrmProjectWorkspace = lazy(() => import('./pages/crm/Projects').then((m) => ({ default: m.CrmProjectWorkspace })));
const CrmTasks = lazy(() => import('./pages/crm/Tasks').then((m) => ({ default: m.CrmTasks })));
const CrmTeam = lazy(() => import('./pages/crm/Team').then((m) => ({ default: m.CrmTeam })));
const CrmAccess = lazy(() => import('./pages/crm/Team').then((m) => ({ default: m.CrmAccess })));
const CrmRoles = lazy(() => import('./pages/crm/Roles').then((m) => ({ default: m.CrmRoles })));
const CrmActivity = lazy(() => import('./pages/crm/Activity').then((m) => ({ default: m.CrmActivity })));
const CrmStudio = lazy(() => import('./pages/crm/Studio').then((m) => ({ default: m.CrmStudio })));
const CrmContentEditor = lazy(() => import('./pages/crm/Studio').then((m) => ({ default: m.CrmContentEditor })));
const CrmMedia = lazy(() => import('./pages/crm/Media').then((m) => ({ default: m.CrmMedia })));
const CrmCalendar = lazy(() => import('./pages/crm/Calendar').then((m) => ({ default: m.CrmCalendar })));
const CrmApprovals = lazy(() => import('./pages/crm/Approvals').then((m) => ({ default: m.CrmApprovals })));
const CrmAnalytics = lazy(() => import('./pages/crm/Analytics').then((m) => ({ default: m.CrmAnalytics })));
const CrmReports = lazy(() => import('./pages/crm/Reports').then((m) => ({ default: m.CrmReports })));

/** Modules of later CRM stages: routed so links work, rendered as "coming". */
const CRM_SOON: Array<[string, string, string]> = [
  ['instagram', 'crm.nav.instagram', 'Instagram'],
  ['tiktok', 'crm.nav.tiktok', 'TikTok'],
  ['youtube', 'crm.nav.youtube', 'YouTube'],
  ['linkedin', 'crm.nav.linkedin', 'LinkedIn'],
  ['inbox', 'crm.nav.inbox', 'Social Inbox'],
  ['ai', 'crm.nav.ai', 'AI Assistant'],
  ['notifications', 'crm.nav.notifications', 'Notifications'],
  ['settings', 'crm.nav.settings', 'Settings'],
];

function SuperOnly({ children }: { children: ReactNode }) {
  const { me } = useCrm();
  return me?.superAdmin ? <>{children}</> : <AccessDenied />;
}


function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <I18nProvider>
          <CurrencyProvider>
            <MarketProvider>
          <AuthProvider>
            <ContentProvider>
              <BrowserRouter>
                <ScrollToTop />
                <Routes>
                  <Route
                    path="/admin/*"
                    element={
                      <ProtectedRoute requireAdmin>
                        <Suspense fallback={<div className="p-8 text-text-muted">…</div>}>
                          <AdminLayout>
                          <Routes>
                            <Route path="/" element={<AdminDashboard />} />
                            <Route path="/services" element={<ProtectedRoute permissions={['content']}><AdminServices /></ProtectedRoute>} />
                            <Route path="/projects" element={<ProtectedRoute permissions={['content']}><AdminProjects /></ProtectedRoute>} />
                            <Route path="/blog" element={<ProtectedRoute permissions={['content']}><AdminBlog /></ProtectedRoute>} />
                            <Route path="/careers" element={<ProtectedRoute permissions={['content']}><AdminCareers /></ProtectedRoute>} />
                            <Route path="/settings" element={<ProtectedRoute permissions={['content']}><AdminSettings /></ProtectedRoute>} />
                            <Route path="/home" element={<ProtectedRoute permissions={['content']}><AdminHome /></ProtectedRoute>} />
                            <Route path="/about" element={<ProtectedRoute permissions={['content']}><AdminAbout /></ProtectedRoute>} />
                            <Route path="/inquiries" element={<ProtectedRoute permissions={['inquiries']}><AdminInquiries /></ProtectedRoute>} />
                            <Route path="/applications" element={<ProtectedRoute permissions={['applications']}><AdminApplications /></ProtectedRoute>} />
                            <Route path="/users" element={<ProtectedRoute permissions={['users.view', 'users.manage']}><AdminUsers /></ProtectedRoute>} />
                            <Route path="/admins" element={<ProtectedRoute requireSuperAdmin><AdminAdmins /></ProtectedRoute>} />
                            <Route path="/api" element={<ProtectedRoute requireSuperAdmin><AdminIntegrations /></ProtectedRoute>} />
                            <Route path="/system" element={<ProtectedRoute requireSuperAdmin><AdminSystem /></ProtectedRoute>} />
                            <Route path="/audit" element={<ProtectedRoute requireSuperAdmin><AdminAuditLog /></ProtectedRoute>} />
                            <Route path="/crm-access" element={<ProtectedRoute requireSuperAdmin><CrmProvider><CrmAccess /></CrmProvider></ProtectedRoute>} />
                            <Route path="/crm-roles" element={<ProtectedRoute requireSuperAdmin><CrmProvider><CrmRoles /></CrmProvider></ProtectedRoute>} />
                            <Route path="*" element={<Navigate to="/admin" replace />} />
                          </Routes>
                          </AdminLayout>
                        </Suspense>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/crm/*"
                    element={
                      <CrmProvider>
                        <Suspense fallback={<div className="min-h-dvh bg-bg" />}>
                          <CrmGate>
                            <Suspense fallback={<div className="p-8 text-text-muted">…</div>}>
                              <Routes>
                                <Route path="/" element={<CrmDashboard />} />
                                <Route path="/global" element={<SuperOnly><CrmDashboard global /></SuperOnly>} />
                                <Route path="/companies" element={<CrmCompanies />} />
                                <Route path="/companies/:id" element={<CrmCompanyDetail />} />
                                <Route path="/projects" element={<CrmProjects />} />
                                <Route path="/projects/:id" element={<CrmProjectWorkspace />} />
                                <Route path="/tasks" element={<CrmTasks />} />
                                <Route path="/team" element={<CrmTeam />} />
                                <Route path="/access" element={<SuperOnly><CrmAccess /></SuperOnly>} />
                                <Route path="/roles" element={<SuperOnly><CrmRoles /></SuperOnly>} />
                                <Route path="/activity" element={<CrmActivity />} />
                                <Route path="/studio" element={<CrmStudio />} />
                                <Route path="/studio/:id" element={<CrmContentEditor />} />
                                <Route path="/media" element={<CrmMedia />} />
                                <Route path="/calendar" element={<CrmCalendar />} />
                                <Route path="/approvals" element={<CrmApprovals />} />
                                <Route path="/analytics" element={<CrmAnalytics />} />
                                <Route path="/reports" element={<CrmReports />} />
                                {CRM_SOON.map(([path, key, label]) => (
                                  <Route key={path} path={`/${path}`} element={<SoonPage titleKey={key} title={label} />} />
                                ))}
                                <Route path="*" element={<Navigate to="/crm" replace />} />
                              </Routes>
                            </Suspense>
                          </CrmGate>
                        </Suspense>
                      </CrmProvider>
                    }
                  />
                  <Route
                    path="/*"
                    element={
                      <Layout>
                        <Suspense fallback={null}>
                          <Routes>
                          <Route path="/" element={<Home />} />
                          <Route path="/login" element={<Login />} />
                          <Route path="/register" element={<Register />} />
                          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                          <Route path="/about" element={<About />} />
                          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                          <Route path="/terms-of-service" element={<TermsOfService />} />
                          <Route path="/refund-policy" element={<RefundPolicy />} />
                          <Route path="/cookie-policy" element={<CookiePolicy />} />
                          <Route path="/services" element={<Services />} />
                          <Route path="/case-studies" element={<CaseStudies />} />
                          <Route path="/case-studies/marketplace-mvp" element={<MarketplaceMVP />} />
                          <Route path="/case-studies/fintech-reporting-dashboard" element={<FintechReportingDashboard />} />
                          <Route path="/case-studies/operations-inventory-system" element={<InventorySystem />} />
                          <Route path="/careers" element={<Careers />} />
                          <Route path="/careers/frontend-developer" element={<Frontend />} />
                          <Route path="/careers/ui-ux-designer" element={<UiDesigner />} />
                          <Route path="/careers/backend-developer" element={<Backend />} />
                          <Route path="/contact" element={<Contact />} />
                          <Route path="/industries" element={<Industries />} />
                          <Route path="/apply" element={<Apply />} />
                          <Route path="/packages" element={<Packages />} />
                          {/* Legacy/alias URL — one canonical page, so redirect instead of duplicating. */}
                          <Route path="/pricing" element={<Navigate to="/packages" replace />} />
                          <Route path="/faq" element={<Faq />} />
                          <Route path="/process" element={<Process />} />
                          <Route path="*" element={<NotFound />} />
                          </Routes>
                        </Suspense>
                      </Layout>
                    }
                  />
                </Routes>
              </BrowserRouter>
            </ContentProvider>
          </AuthProvider>
            </MarketProvider>
          </CurrencyProvider>
        </I18nProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
