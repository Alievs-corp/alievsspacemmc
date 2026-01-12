import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { I18nProvider } from './contexts/I18nContext';
import { ContentProvider } from './contexts/ContentContext';
import { AuthProvider } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Services } from './pages/Services';
import { Careers } from './pages/Careers';
import Contact  from './pages/Contact';
import { Industries } from './pages/Industries';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { AdminDashboard } from './pages/admin/Dashboard';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminServices } from './pages/admin/Services';
import { AdminProjects } from './pages/admin/Projects';
import { AdminBlog } from './pages/admin/Blog';
import { AdminCareers } from './pages/admin/Careers';
import { AdminInquiries } from './pages/admin/Inquiries';
import { AdminSettings } from './pages/admin/Settings';
import { AdminHome } from './pages/admin/Home';
import { AdminAbout } from './pages/admin/About';
import CaseStudies from './pages/CaseStudies';
import MarketplaceMVP from './pages/MarketplaceMVP';
import FintechReportingDashboard from './pages/FintechReportingDashboard';
import InventorySystem from './pages/InventorySystem';
import Frontend from './pages/Frontend';
import Backend from './pages/Backend';
import UiDesigner from './pages/UiDesigner';
import Apply from './pages/Apply';

function App() {
  return (
    <I18nProvider>
      <AuthProvider>
        <ContentProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute requireAdmin>
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
                  </ProtectedRoute>
                }
              />
              <Route
                path="/*"
                element={
                  <Layout>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/about" element={<About />} />
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
                    </Routes>
                  </Layout>
                }
              />
            </Routes>
          </BrowserRouter>
        </ContentProvider>
      </AuthProvider>
    </I18nProvider>
  );
}

export default App;
