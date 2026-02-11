import { useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

interface UpdatePromptProps {
  onUpdate?: () => void;
}

export function useServiceWorker({ onUpdate }: UpdatePromptProps = {}) {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('Service Worker registered:', r);
    },
    onRegisterError(error) {
      console.error('Service Worker registration error:', error);
    },
  });

  useEffect(() => {
    if (needRefresh) {
      onUpdate?.();
    }
  }, [needRefresh, onUpdate]);

  const update = () => {
    updateServiceWorker(true);
  };

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  return {
    offlineReady,
    needRefresh,
    update,
    close,
  };
}

export function PWAUpdatePrompt() {
  const { offlineReady, needRefresh, update, close } = useServiceWorker();

  if (!offlineReady && !needRefresh) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      <div className="bg-white rounded-lg shadow-2xl border border-slate-200 p-4">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            {offlineReady ? (
              <div>
                <p className="font-semibold text-slate-900">
                  Приложение готово к работе офлайн
                </p>
                <p className="text-sm text-slate-600 mt-1">
                  Вы можете использовать сайт без подключения к интернету
                </p>
              </div>
            ) : (
              <div>
                <p className="font-semibold text-slate-900">
                  Доступно обновление
                </p>
                <p className="text-sm text-slate-600 mt-1">
                  Новая версия приложения готова к установке
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex gap-2 mt-4">
          {needRefresh && (
            <button
              onClick={update}
              className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors text-sm font-medium"
            >
              Обновить
            </button>
          )}
          <button
            onClick={close}
            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}
