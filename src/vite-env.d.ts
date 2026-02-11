/// <reference types="vite/client" />

/**
 * Environment Variables Type Definitions
 * Provides type-safe access to environment variables
 */

interface ImportMetaEnv {
  // API
  readonly VITE_API_URL: string;
  
  // Analytics
  readonly VITE_GA_TRACKING_ID?: string;
  
  // App
  readonly VITE_APP_NAME?: string;
  readonly VITE_APP_VERSION?: string;
  
  // Feature Flags
  readonly VITE_ENABLE_PWA?: string;
  readonly VITE_ENABLE_ANALYTICS?: string;
  readonly VITE_ENABLE_PERFORMANCE_MONITORING?: string;
  readonly VITE_DEBUG_MODE?: string;
  
  // Vite built-in
  readonly MODE: 'development' | 'production' | 'test';
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly SSR: boolean;
  readonly BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface ImportMetaEnv {
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
