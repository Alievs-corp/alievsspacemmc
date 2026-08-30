import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { I18nProvider } from './contexts/I18nContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { ScrollToTop } from './components/ScrollToTop';
import { ContentProvider } from './contexts/ContentContext';
import { AuthProvider } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
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


function App() {
  return (
    <HelmetProvider>
      <I18nProvider>
        <CurrencyProvider>
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
                            <Route path="/services" element={<AdminServices />} />
                            <Route path="/projects" element={<AdminProjects />} />
                            <Route path="/blog" element={<AdminBlog />} />
                            <Route path="/careers" element={<AdminCareers />} />
                            <Route path="/inquiries" element={<AdminInquiries />} />
                            <Route path="/settings" element={<AdminSettings />} />
                            <Route path="/home" element={<AdminHome />} />
                            <Route path="/about" element={<AdminAbout />} />
                          </Routes>
                          </AdminLayout>
                        </Suspense>
                      </ProtectedRoute>
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
        </CurrencyProvider>
      </I18nProvider>
    </HelmetProvider>
  );
}

export default App;
