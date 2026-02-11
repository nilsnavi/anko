import React, { Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import { PWAUpdatePrompt } from './components/PWAUpdatePrompt';
import { useAnalytics } from './hooks/useAnalytics';

// Contexts
import { DataProvider } from './context/DataContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const Contacts = lazy(() => import('./pages/Contacts'));
const Education = lazy(() => import('./pages/Education'));
const Veterans = lazy(() => import('./pages/Veterans'));

// Lazy load Admin Pages
const Login = lazy(() => import('./pages/admin/Login'));
const Register = lazy(() => import('./pages/admin/Register'));
const ResetPassword = lazy(() => import('./pages/admin/ResetPassword'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminServices = lazy(() => import('./pages/admin/AdminServices'));
const AdminNews = lazy(() => import('./pages/admin/AdminNews'));
const AdminTeam = lazy(() => import('./pages/admin/AdminTeam'));
const AdminFAQ = lazy(() => import('./pages/admin/AdminFAQ'));
const AdminClients = lazy(() => import('./pages/admin/AdminClients'));
const MediaManager = lazy(() => import('./pages/admin/MediaManager'));

// Loading component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-100">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto mb-4"></div>
      <p className="text-slate-600">Загрузка...</p>
    </div>
  </div>
);

// Function to reset scroll on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Проверка авторизации...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

// Analytics wrapper
const AnalyticsWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useAnalytics();
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <DataProvider>
        <AuthProvider>
          <Router>
            <AnalyticsWrapper>
              <ScrollToTop />
              <PWAUpdatePrompt />
              <Suspense fallback={<LoadingFallback />}>
              <Routes>
                {/* Public Website Routes */}
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="about" element={<About />} />
                  <Route path="services" element={<Services />} />
                  <Route path="veterans" element={<Veterans />} />
                  <Route path="education" element={<Education />} />
                  <Route path="contacts" element={<Contacts />} />
                </Route>

                {/* Admin Routes */}
                <Route path="/admin/login" element={<Login />} />
                <Route path="/admin/register" element={<Register />} />
                <Route path="/admin/reset-password" element={<ResetPassword />} />
                <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

                <Route path="/admin" element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="services" element={<AdminServices />} />
                  <Route path="news" element={<AdminNews />} />
                  <Route path="team" element={<AdminTeam />} />
                  <Route path="faq" element={<AdminFAQ />} />
                  <Route path="clients" element={<AdminClients />} />
                  <Route path="media" element={<MediaManager />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
            </AnalyticsWrapper>
          </Router>
        </AuthProvider>
      </DataProvider>
    </ErrorBoundary>
  );
};

export default App;