import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { I18nProvider } from './contexts/I18nContext';
import { ContentProvider } from './contexts/ContentContext';
import { AuthProvider } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Services } from './pages/Services';
import { Projects } from './pages/Projects';
import { Project } from './pages/Project';
import { Blog } from './pages/Blog';
import { BlogPost } from './pages/BlogPost';
import { Careers } from './pages/Careers';
import { Contact } from './pages/Contact';
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
                      <Route path="/projects" element={<Projects />} />
                      <Route path="/projects/:id" element={<Project />} />
                      <Route path="/blog" element={<Blog />} />
                      <Route path="/blog/:id" element={<BlogPost />} />
                      <Route path="/careers" element={<Careers />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/industries" element={<Industries />} />
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
