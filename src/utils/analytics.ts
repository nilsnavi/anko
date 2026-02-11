/**
 * Google Analytics Integration
 * Provides type-safe wrapper for Google Analytics
 */

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export const GA_TRACKING_ID = import.meta.env.VITE_GA_TRACKING_ID || '';

// Initialize Google Analytics
export function initGA(): void {
  if (!GA_TRACKING_ID) {
    console.warn('Google Analytics tracking ID not found');
    return;
  }

  // Load gtag script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
  document.head.appendChild(script);

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer?.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_TRACKING_ID, {
    send_page_view: false, // We'll send manually
  });
}

// Page view tracking
export function trackPageView(url: string, title?: string): void {
  if (!window.gtag) return;

  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
    page_title: title || document.title,
  });
}

// Event tracking
interface EventParams {
  category: string;
  action: string;
  label?: string;
  value?: number;
  [key: string]: any;
}

export function trackEvent({
  category,
  action,
  label,
  value,
  ...customParams
}: EventParams): void {
  if (!window.gtag) return;

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
    ...customParams,
  });
}

// Common event trackers
export const GAEvents = {
  // Navigation
  pageView: (path: string, title?: string) => {
    trackPageView(path, title);
  },

  // User interactions
  click: (elementName: string, elementLocation?: string) => {
    trackEvent({
      category: 'User Interaction',
      action: 'Click',
      label: elementName,
      location: elementLocation,
    });
  },

  // Forms
  formSubmit: (formName: string, success: boolean) => {
    trackEvent({
      category: 'Form',
      action: success ? 'Submit Success' : 'Submit Error',
      label: formName,
    });
  },

  formStart: (formName: string) => {
    trackEvent({
      category: 'Form',
      action: 'Start',
      label: formName,
    });
  },

  // Downloads
  download: (fileName: string, fileType: string) => {
    trackEvent({
      category: 'Download',
      action: 'File Download',
      label: fileName,
      file_type: fileType,
    });
  },

  // Errors
  error: (errorMessage: string, errorLocation?: string) => {
    trackEvent({
      category: 'Error',
      action: 'JavaScript Error',
      label: errorMessage,
      location: errorLocation,
    });
  },

  // Engagement
  scrollDepth: (depth: number) => {
    trackEvent({
      category: 'Engagement',
      action: 'Scroll Depth',
      label: `${depth}%`,
      value: depth,
    });
  },

  timeOnPage: (seconds: number, pageName: string) => {
    trackEvent({
      category: 'Engagement',
      action: 'Time on Page',
      label: pageName,
      value: seconds,
    });
  },

  // E-commerce (for future use)
  viewService: (serviceId: string, serviceName: string) => {
    trackEvent({
      category: 'Services',
      action: 'View Service',
      label: serviceName,
      service_id: serviceId,
    });
  },

  contactRequest: (serviceType?: string) => {
    trackEvent({
      category: 'Conversion',
      action: 'Contact Request',
      label: serviceType || 'General',
    });
  },
};

// Hook for React components
export function usePageTracking(): void {
  // Track page views on mount and route changes
  // This should be used in main App component or route wrapper
}
