import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Mail, User, Globe, ArrowUp, Star, Send, Info } from 'lucide-react';
import { COMPANY_INFO, NAV_LINKS } from '../constants';

const Layout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [toast, setToast] = useState<{message: string, isVisible: boolean} | null>(null);
  const location = useLocation();

  const closeMenu = () => setIsMobileMenuOpen(false);

  // Handle scroll for Back to Top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showNotification = (message: string) => {
    setToast({ message, isVisible: true });
    setTimeout(() => {
      setToast(prev => prev ? { ...prev, isVisible: false } : null);
      // Remove from DOM after animation
      setTimeout(() => setToast(null), 300);
    }, 3000);
  };

  const handlePersonalCabinet = () => {
    showNotification('Личный кабинет находится в стадии разработки. Следите за обновлениями!');
    closeMenu();
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 relative">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-24 right-4 z-[60] transition-all duration-300 transform ${toast.isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
           <div className="bg-slate-900 text-white px-6 py-4 rounded-lg shadow-xl flex items-center gap-3 max-w-sm">
              <Info className="text-brand-400 shrink-0" size={20} />
              <p className="text-sm font-medium leading-snug">{toast.message}</p>
           </div>
        </div>
      )}

      {/* Top Bar - Info */}
      <div className="bg-brand-900 text-white text-sm py-2 px-4 hidden md:block">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex gap-6">
            <span className="flex items-center gap-2">
              <Phone size={14} /> {COMPANY_INFO.phone}
            </span>
            <span className="flex items-center gap-2">
              <Mail size={14} /> {COMPANY_INFO.email}
            </span>
            <span className="opacity-80">{COMPANY_INFO.address}</span>
          </div>
          <div className="flex gap-4 items-center">
             <button className="hover:text-brand-100 transition-colors flex items-center gap-1">
                <Globe size={14} /> RU
             </button>
             <button 
                onClick={handlePersonalCabinet}
                className="flex items-center gap-1 bg-brand-700 hover:bg-brand-600 px-3 py-1 rounded text-xs transition-colors"
             >
                <User size={12} /> Личный кабинет
             </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-3" onClick={closeMenu}>
            <div className="bg-brand-600 text-white p-2 rounded-lg">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 21l18 0" />
                <path d="M5 21v-14l8 -4l8 4v14" />
                <path d="M19 10l-4 0" />
                <path d="M5 10l4 0" />
                <path d="M9 21v-8a3 3 0 0 1 6 0v8" />
              </svg>
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight text-slate-800">Экосистема учёта</h1>
              <p className="text-xs text-slate-500 hidden sm:block">АНО Профессионального сопровождения</p>
            </div>
          </NavLink>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex gap-8 font-medium text-slate-600">
            {NAV_LINKS.map((link) => (
              <NavLink 
                key={link.path}
                to={link.path}
                className={({ isActive }) => 
                  link.path === '/veterans' 
                    ? `flex items-center gap-1.5 transition-colors py-2 border-b-2 ${isActive ? 'text-red-600 border-red-600' : 'text-slate-600 border-transparent hover:text-red-600'}`
                    : `hover:text-brand-600 transition-colors py-2 border-b-2 ${isActive ? 'text-brand-600 border-brand-600' : 'border-transparent'}`
                }
              >
                {link.path === '/veterans' && <Star size={16} className="text-red-500 fill-red-500/20" />}
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Action Button & Mobile Toggle */}
          <div className="flex items-center gap-4">
            <NavLink to="/contacts" className="hidden sm:block bg-brand-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-brand-700 transition-colors shadow-sm hover:shadow-md">
              Консультация
            </NavLink>
            <button 
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-md"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden bg-white border-t border-slate-100 absolute w-full left-0 shadow-lg transition-all duration-300 ease-in-out origin-top ${isMobileMenuOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 h-0'}`}>
            <nav className="flex flex-col p-4 gap-2">
              {NAV_LINKS.map((link) => (
                <NavLink 
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) => 
                    link.path === '/veterans'
                    ? `px-4 py-3 rounded-md flex items-center gap-2 font-bold ${isActive ? 'bg-red-50 text-red-700' : 'text-slate-700 hover:bg-red-50 hover:text-red-600'}`
                    : `px-4 py-3 rounded-md ${isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'}`
                  }
                  onClick={closeMenu}
                >
                  {link.path === '/veterans' && <Star size={18} className="text-red-500" />}
                  {link.label}
                </NavLink>
              ))}
              <div className="h-px bg-slate-100 my-2"></div>
              <button 
                onClick={handlePersonalCabinet}
                className="w-full text-left px-4 py-3 text-brand-600 font-medium"
              >
                Войти в кабинет
              </button>
            </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4 text-white">
                 <div className="bg-brand-600 p-1.5 rounded">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 21l18 0" />
                        <path d="M5 21v-14l8 -4l8 4v14" />
                        <path d="M9 21v-8a3 3 0 0 1 6 0v8" />
                    </svg>
                 </div>
                 <span className="font-bold text-lg">Экосистема учёта</span>
              </div>
              <p className="text-sm text-slate-400 mb-6">
                Содействие социально-экономической адаптации и развитию предпринимательства в Новороссийске и Краснодарском крае.
              </p>
              <div className="flex gap-4">
                <a 
                  href={COMPANY_INFO.vk} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-brand-600 transition-colors text-white"
                  title="Мы ВКонтакте"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M13.2 16.5c-3.6 0-5.7-2.5-5.8-6.6H9.9c.1 3 1.4 4.3 2.4 4.6V10h2.4v2.6c1.5-.1 3-1.9 3.6-4.6h2.3c-.7 2.3-2.1 4-3.8 5l3.8 5.6h-2.8l-3-4.2c-.7-.8-1.7-.9-2.1-.8v5z"/>
                    </svg>
                </a>
                <a 
                  href={COMPANY_INFO.telegram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-brand-600 transition-colors text-white"
                  title="Мы в Telegram"
                >
                  <Send size={16} className="-ml-0.5 mt-0.5" />
                </a>
                <a 
                  href={COMPANY_INFO.max} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-brand-600 transition-colors text-white font-bold"
                  title="Мы в Max"
                >
                  M
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Навигация</h3>
              <ul className="space-y-2 text-sm">
                {NAV_LINKS.map(link => (
                  <li key={link.path}>
                    <NavLink to={link.path} className="hover:text-brand-400 transition-colors">
                      {link.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Услуги</h3>
              <ul className="space-y-2 text-sm">
                <li><NavLink to="/services" className="hover:text-brand-400">Регистрация бизнеса</NavLink></li>
                <li><NavLink to="/services" className="hover:text-brand-400">Бухгалтерский учет</NavLink></li>
                <li><NavLink to="/veterans" className="hover:text-brand-400">Поддержка ветеранов</NavLink></li>
                <li><NavLink to="/education" className="hover:text-brand-400">Обучение</NavLink></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Контакты</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex gap-3">
                   <Phone size={16} className="text-brand-500 shrink-0" />
                   {COMPANY_INFO.phone}
                </li>
                <li className="flex gap-3">
                   <Mail size={16} className="text-brand-500 shrink-0" />
                   {COMPANY_INFO.email}
                </li>
                <li className="flex gap-3">
                   <div className="mt-1"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-500"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg></div>
                   {COMPANY_INFO.address}
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
            <p>&copy; {new Date().getFullYear()} {COMPANY_INFO.shortName}. Все права защищены.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Политика конфиденциальности</a>
              <NavLink to="/admin/login" className="hover:text-white transition-colors opacity-50 hover:opacity-100">Администратор</NavLink>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      <button 
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 bg-brand-600 text-white p-3 rounded-full shadow-lg hover:bg-brand-700 transition-all duration-300 z-40 ${showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
      >
        <ArrowUp size={24} />
      </button>
    </div>
  );
};

export default Layout;