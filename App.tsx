import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contacts from './pages/Contacts';
import Education from './pages/Education';
import Veterans from './pages/Veterans';

// Contexts
import { DataProvider } from './context/DataContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Admin Pages
import Login from './pages/admin/Login';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import AdminServices from './pages/admin/AdminServices';
import AdminNews from './pages/admin/AdminNews';
import AdminTeam from './pages/admin/AdminTeam';
import AdminFAQ from './pages/admin/AdminFAQ';
import AdminClients from './pages/admin/AdminClients';

// Function to reset scroll on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin } = useAuth();
  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <DataProvider>
      <AuthProvider>
        <Router>
          <ScrollToTop />
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
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </DataProvider>
  );
};

export default App;