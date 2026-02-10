import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Users, HelpCircle, Briefcase, LogOut, Home, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLayout: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Обзор', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Услуги', path: '/admin/services', icon: Briefcase },
    { label: 'Новости', path: '/admin/news', icon: FileText },
    { label: 'Команда', path: '/admin/team', icon: Users },
    { label: 'Клиенты', path: '/admin/clients', icon: UserCheck },
    { label: 'Вопросы', path: '/admin/faq', icon: HelpCircle },
  ];

  return (
    <div className="flex h-screen bg-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl z-10">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold tracking-tight">Экосистема учёта</h2>
          <p className="text-xs text-slate-400 mt-1">Панель администратора</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ease-in-out ${
                  isActive 
                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/20 scale-[1.02]' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white hover:scale-[1.02]'
                }`
              }
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800 space-y-2">
           <NavLink to="/" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-200 hover:scale-[1.02]">
              <Home size={20} />
              <span>На сайт</span>
           </NavLink>
          <button 
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-all duration-200 hover:scale-[1.02]"
          >
            <LogOut size={20} />
            <span>Выйти</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-slate-50">
        <div className="p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;