import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, Key } from 'lucide-react';

const Login: React.FC = () => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isLoading: authLoading, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (isAdmin) {
      navigate('/admin/dashboard');
    }
  }, [isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(username, password);
      if (success) {
        navigate('/admin/dashboard');
      } else {
        setError('Неверные учетные данные');
      }
    } catch (err) {
      setError('Ошибка при входе в систему');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-brand-100 p-4 rounded-full text-brand-600">
            <Lock size={32} />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center text-slate-900 mb-6">Вход в панель управления</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Имя пользователя</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none bg-white text-slate-900"
                placeholder="admin"
                disabled={isLoading || authLoading}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Пароль</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Key className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none bg-white text-slate-900"
                placeholder="••••••••"
                disabled={isLoading || authLoading}
              />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            type="submit"
            disabled={isLoading || authLoading || !username || !password}
            className="w-full bg-brand-600 text-white font-bold py-3 rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {(isLoading || authLoading) ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Вход...
              </>
            ) : (
              'Войти'
            )}
          </button>
        </form>
        <div className="mt-6 space-y-3">
          <div className="flex justify-center gap-4 text-sm">
            <Link to="/admin/register" className="text-brand-600 hover:text-brand-700 font-medium">
              Регистрация
            </Link>
            <span className="text-slate-300">|</span>
            <Link to="/admin/reset-password" className="text-brand-600 hover:text-brand-700 font-medium">
              Забыли пароль?
            </Link>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <h3 className="text-sm font-semibold text-slate-700 mb-2">Тестовые учетные данные:</h3>
            <div className="text-xs text-slate-600 space-y-1">
              <p><span className="font-medium">Имя пользователя:</span> admin</p>
              <p><span className="font-medium">Пароль:</span> admin123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;