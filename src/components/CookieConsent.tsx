import React, { useState, useEffect } from 'react';
import { X, Cookie, Settings, Shield } from 'lucide-react';
import {
  hasConsent,
  acceptAllCookies,
  acceptEssentialOnly,
  getCookieConsent,
} from '../utils/cookieConsent';

/**
 * Cookie Consent Banner Component
 * GDPR-compliant cookie notification
 */
export const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Show banner if user hasn't given consent
    if (!hasConsent()) {
      // Small delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    acceptAllCookies();
    setIsVisible(false);
  };

  const handleAcceptEssential = () => {
    acceptEssentialOnly();
    setIsVisible(false);
  };

  const handleCustomize = () => {
    setShowDetails(true);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-brand-600 shadow-2xl">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          {/* Icon and Text */}
          <div className="flex items-start gap-4 flex-1">
            <div className="bg-brand-100 p-3 rounded-full shrink-0">
              <Cookie className="w-6 h-6 text-brand-600" />
            </div>
            
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                🍪 Мы используем cookies
              </h3>
              
              {!showDetails ? (
                <p className="text-slate-600 text-sm leading-relaxed">
                  Мы используем cookies для улучшения вашего опыта, анализа трафика и персонализации контента. 
                  Нажимая "Принять всё", вы соглашаетесь с использованием всех cookies.
                </p>
              ) : (
                <div className="space-y-3 mt-3">
                  <div className="flex items-start gap-2">
                    <Shield className="w-4 h-4 text-green-600 mt-1 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Обязательные cookies</p>
                      <p className="text-xs text-slate-600">
                        Необходимы для работы сайта. Без них невозможны аутентификация и базовые функции.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Settings className="w-4 h-4 text-blue-600 mt-1 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Аналитические cookies</p>
                      <p className="text-xs text-slate-600">
                        Помогают понять, как вы используете сайт, для улучшения его работы (Google Analytics).
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-2 mt-3">
                <a 
                  href="/#/privacy" 
                  className="text-xs text-brand-600 hover:text-brand-700 underline"
                >
                  Политика конфиденциальности
                </a>
                <span className="text-slate-300">•</span>
                <a 
                  href="/#/cookie-policy" 
                  className="text-xs text-brand-600 hover:text-brand-700 underline"
                >
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">
            {!showDetails ? (
              <>
                <button
                  onClick={handleCustomize}
                  className="px-6 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium text-sm"
                >
                  Настроить
                </button>
                <button
                  onClick={handleAcceptEssential}
                  className="px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors font-medium text-sm"
                >
                  Только необходимые
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-6 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium text-sm"
                >
                  Принять всё
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setShowDetails(false)}
                  className="px-6 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium text-sm"
                >
                  Назад
                </button>
                <button
                  onClick={handleAcceptEssential}
                  className="px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors font-medium text-sm"
                >
                  Только необходимые
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-6 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium text-sm"
                >
                  Принять всё
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
