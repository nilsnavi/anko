import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Key, ArrowLeft, CheckCircle } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const ResetPassword: React.FC = () => {
    const [step, setStep] = useState<'request' | 'confirm' | 'success'>('request');
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [debugToken, setDebugToken] = useState(''); // For demo purposes
    const navigate = useNavigate();

    const handleRequestReset = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email.trim()) {
            setError('Введите email');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await axios.post(`${API_BASE_URL}/auth/reset-password/request`, {
                email: email.trim()
            });

            // For demo purposes, show the token
            if (response.data.debugToken) {
                setDebugToken(response.data.debugToken);
            }

            setStep('confirm');
        } catch (err: any) {
            setError('Ошибка при запросе восстановления пароля');
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirmReset = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token.trim()) {
            setError('Введите токен восстановления');
            return;
        }

        if (!newPassword) {
            setError('Введите новый пароль');
            return;
        }

        if (newPassword.length < 6) {
            setError('Пароль должен быть минимум 6 символов');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Пароли не совпадают');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            await axios.post(`${API_BASE_URL}/auth/reset-password/confirm`, {
                token: token.trim(),
                newPassword
            });

            setStep('success');
            // Auto redirect after 3 seconds
            setTimeout(() => {
                navigate('/admin/login');
            }, 3000);
        } catch (err: any) {
            if (err.response?.status === 400) {
                setError(err.response.data.message || 'Неверный токен или пароль');
            } else {
                setError('Ошибка при восстановлении пароля');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const renderRequestStep = () => (
        <form onSubmit={handleRequestReset} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email для восстановления</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            if (error) setError('');
                        }}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none bg-white text-slate-900"
                        placeholder="your@email.com"
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
                disabled={isLoading || !email}
                className="w-full bg-brand-600 text-white font-bold py-3 rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Отправка...
                    </>
                ) : (
                    'Отправить инструкции'
                )}
            </button>
        </form>
    );

    const renderConfirmStep = () => (
        <form onSubmit={handleConfirmReset} className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-blue-800 text-sm">
                    <strong>Внимание:</strong> Инструкции отправлены на ваш email.
                    {debugToken && (
                        <span className="block mt-2">
                            <strong>Демо токен:</strong> {debugToken}
                        </span>
                    )}
                </p>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Токен восстановления</label>
                <input
                    type="text"
                    value={token}
                    onChange={(e) => {
                        setToken(e.target.value);
                        if (error) setError('');
                    }}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none bg-white text-slate-900"
                    placeholder="Введите токен из email"
                    disabled={isLoading}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Новый пароль</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Key className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => {
                            setNewPassword(e.target.value);
                            if (error) setError('');
                        }}
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
                        value={confirmPassword}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            if (error) setError('');
                        }}
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
                disabled={isLoading || !token || !newPassword || !confirmPassword}
                className="w-full bg-brand-600 text-white font-bold py-3 rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Восстановление...
                    </>
                ) : (
                    'Восстановить пароль'
                )}
            </button>
        </form>
    );

    const renderSuccessStep = () => (
        <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">Пароль успешно изменен!</h3>
            <p className="text-slate-600 mb-6">
                Вы можете теперь войти с новым паролем.
            </p>
            <button
                onClick={() => navigate('/admin/login')}
                className="text-brand-600 hover:text-brand-700 font-medium"
            >
                Перейти к входу
            </button>
        </div>
    );

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <div className="flex justify-center mb-6">
                    <div className="bg-brand-100 p-4 rounded-full text-brand-600">
                        <Key size={32} />
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-center text-slate-900 mb-2">Восстановление пароля</h2>
                <p className="text-center text-slate-500 mb-6">
                    {step === 'request' && 'Введите email для получения инструкций'}
                    {step === 'confirm' && 'Введите токен и новый пароль'}
                    {step === 'success' && 'Пароль успешно изменен'}
                </p>

                {step === 'request' && renderRequestStep()}
                {step === 'confirm' && renderConfirmStep()}
                {step === 'success' && renderSuccessStep()}

                {step !== 'success' && (
                    <div className="mt-6 text-center">
                        <Link to="/admin/login" className="text-brand-600 hover:text-brand-700 font-medium">
                            ← Назад к входу
                        </Link>
                    </div>
                )}

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

export default ResetPassword;