import React, { useState, useEffect } from 'react';
import { X, Cookie, Shield, BarChart, MessageSquare, Settings as SettingsIcon } from 'lucide-react';
import {
  getCookieConsent,
  setCookieConsent,
  revokeConsent,
  type CookieConsent as CookieConsentType,
} from '../utils/cookieConsent';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Cookie Settings Modal
 * Allows users to customize cookie preferences
 */
export const CookieSettings: React.FC<Props> = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState<CookieConsentType>({
    essential: true,
    analytics: false,
    marketing: false,
    preferences: false,
    timestamp: Date.now(),
  });

  useEffect(() => {
    const consent = getCookieConsent();
    if (consent) {
      setSettings(consent);
    }
  }, [isOpen]);

  const handleSave = () => {
    setCookieConsent({
      essential: settings.essential,
      analytics: settings.analytics,
      marketing: settings.marketing,
      preferences: settings.preferences,
    });
    onClose();
  };

  const handleRevokeAll = () => {
    if (window.confirm('Вы уверены, что хотите отозвать все согласия и удалить cookies?')) {
      revokeConsent();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="bg-brand-100 p-2 rounded-lg">
              <Cookie className="w-6 h-6 text-brand-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Настройки Cookies</h2>
              <p className="text-sm text-slate-600">Управляйте своими предпочтениями</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Закрыть"
          >
            <X className="w-6 h-6 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Essential Cookies */}
          <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-slate-900">Обязательные cookies</h3>
                  <p className="text-sm text-slate-600 mt-1">
                    Эти cookies необходимы для работы сайта и не могут быть отключены. 
                    Они используются для аутентификации, безопасности и базовых функций.
                  </p>
                </div>
              </div>
              <div className="shrink-0 ml-4">
                <input
                  type="checkbox"
                  checked={true}
                  disabled
                  className="w-5 h-5 rounded text-brand-600 opacity-50 cursor-not-allowed"
                />
              </div>
            </div>
            <div className="text-xs text-slate-500 mt-2">
              <strong>Всегда активны</strong>
            </div>
          </div>

          {/* Analytics Cookies */}
          <div className="border border-slate-200 rounded-lg p-4 hover:border-brand-300 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                <BarChart className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-slate-900">Аналитические cookies</h3>
                  <p className="text-sm text-slate-600 mt-1">
                    Помогают нам понять, как посетители взаимодействуют с сайтом, собирая 
                    анонимную информацию. Используется Google Analytics.
                  </p>
                </div>
              </div>
              <div className="shrink-0 ml-4">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.analytics}
                    onChange={(e) => setSettings({ ...settings, analytics: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
                </label>
              </div>
            </div>
            <div className="text-xs text-slate-500 mt-2">
              <strong>Cookies:</strong> _ga, _gid, _gat
            </div>
          </div>

          {/* Marketing Cookies */}
          <div className="border border-slate-200 rounded-lg p-4 hover:border-brand-300 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                <MessageSquare className="w-5 h-5 text-purple-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-slate-900">Маркетинговые cookies</h3>
                  <p className="text-sm text-slate-600 mt-1">
                    Используются для отслеживания посетителей между сайтами для показа 
                    релевантной рекламы. Могут использоваться рекламными сетями.
                  </p>
                </div>
              </div>
              <div className="shrink-0 ml-4">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.marketing}
                    onChange={(e) => setSettings({ ...settings, marketing: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
                </label>
              </div>
            </div>
            <div className="text-xs text-slate-500 mt-2">
              <strong>В разработке</strong>
            </div>
          </div>

          {/* Preferences Cookies */}
          <div className="border border-slate-200 rounded-lg p-4 hover:border-brand-300 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                <SettingsIcon className="w-5 h-5 text-orange-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-slate-900">Настройки и предпочтения</h3>
                  <p className="text-sm text-slate-600 mt-1">
                    Помогают сохранить ваши настройки (язык, регион, тема), 
                    чтобы предоставить персонализированный опыт.
                  </p>
                </div>
              </div>
              <div className="shrink-0 ml-4">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.preferences}
                    onChange={(e) => setSettings({ ...settings, preferences: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
                </label>
              </div>
            </div>
            <div className="text-xs text-slate-500 mt-2">
              <strong>В разработке</strong>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>ℹ️ Информация:</strong> Вы можете изменить свои настройки cookies в любое время. 
              Отключение некоторых cookies может повлиять на функциональность сайта.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-6 border-t border-slate-200 bg-slate-50">
          <button
            onClick={handleRevokeAll}
            className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            Отозвать все согласия
          </button>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-medium"
            >
              Отмена
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium"
            >
              Сохранить настройки
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
