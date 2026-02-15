declare module 'virtual:pwa-register/react' {
    export interface RegisterSWOptions {
        onRegistered?: (registration: ServiceWorkerRegistration | undefined) => void;
        onRegisterError?: (error: Error) => void;
    }

    export function useRegisterSW(options?: RegisterSWOptions): {
        offlineReady: [boolean, (value: boolean) => void];
        needRefresh: [boolean, (value: boolean) => void];
        updateServiceWorker: (reloadPage?: boolean) => Promise<void>;
    };
}
