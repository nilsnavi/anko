import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Key, ArrowLeft } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const Register: React.FC = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear errors when user types
        if (error) setError('');
    };

    const validateForm = () => {
        if (!formData.username.trim()) {
            setError('Имя пользователя обязательно');
            return false;
        }
        if (!formData.email.trim()) {
            setError('Email обязателен');
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            setError('Неверный формат email');
            return false;
        }
        if (!formData.password) {
            setError('Пароль обязателен');
            return false;
        }
        if (formData.password.length < 6) {
            setError('Пароль должен быть минимум 6 символов');
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('Пароли не совпадают');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        setError('');

        try {
            await axios.post(`${API_BASE_URL}/auth/register`, {
                username: formData.username.trim(),
                email: formData.email.trim(),
                password: formData.password
            });

            setSuccess(true);
            // Auto redirect after 3 seconds
            setTimeout(() => {
                navigate('/admin/login');
            }, 3000);
        } catch (err: any) {
            if (err.response?.status === 409) {
                setError('Пользователь с таким именем или email уже существует');
            } else if (err.response?.status === 400) {
                setError(err.response.data.message || 'Неверные данные');
            } else {
                setError('Ошибка при регистрации. Попробуйте позже.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-100">
                <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Регистрация успешна!</h2>
                    <p className="text-slate-600 mb-6">
                        Аккаунт администратора создан. Через несколько секунд вы будете перенаправлены на страницу входа.
                    </p>
                    <button
                        onClick={() => navigate('/admin/login')}
                        className="text-brand-600 hover:text-brand-700 font-medium"
                    >
                        Перейти сейчас
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <div className="flex justify-center mb-6">
                    <div className="bg-brand-100 p-4 rounded-full text-brand-600">
                        <User size={32} />
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-center text-slate-900 mb-2">Создать аккаунт администратора</h2>
                <p className="text-center text-slate-500 mb-6">Зарегистрируйтесь для доступа к административной панели</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Имя пользователя</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none bg-white text-slate-900"
                                placeholder="Введите имя пользователя"
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none bg-white text-slate-900"
                                placeholder="your@email.com"
                                disabled={isLoading}
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
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none bg-white text-slate-900"
                                placeholder="••••••••"
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Подтвердите пароль</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Key className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none bg-white text-slate-900"
                                placeholder="••••••••"
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading || !formData.username || !formData.email || !formData.password || !formData.confirmPassword}
                        className="w-full bg-brand-600 text-white font-bold py-3 rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Регистрация...
                            </>
                        ) : (
                            'Зарегистрироваться'
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-slate-600">
                        Уже есть аккаунт?{' '}
                        <Link to="/admin/login" className="text-brand-600 hover:text-brand-700 font-medium">
                            Войти
                        </Link>
                    </p>
                </div>

                <div className="mt-4">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 text-sm transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Вернуться на сайт
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;