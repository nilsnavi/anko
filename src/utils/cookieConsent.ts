/**
 * Cookie Management Utility
 * GDPR-compliant cookie handling
 */

export type CookieCategory = 'essential' | 'analytics' | 'marketing' | 'preferences';

export interface CookieConsent {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
  timestamp: number;
}

const CONSENT_KEY = 'cookie_consent';
const CONSENT_VERSION = '1.0';
const CONSENT_EXPIRY_DAYS = 365;

/**
 * Get current cookie consent settings
 */
export const getCookieConsent = (): CookieConsent | null => {
  try {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) return null;
    
    const data = JSON.parse(stored);
    
    // Check if consent is still valid (not expired)
    const expiryTime = data.timestamp + (CONSENT_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
    if (Date.now() > expiryTime) {
      localStorage.removeItem(CONSENT_KEY);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error reading cookie consent:', error);
    return null;
  }
};

/**
 * Save cookie consent settings
 */
export const setCookieConsent = (consent: Omit<CookieConsent, 'timestamp'>): void => {
  try {
    const consentData: CookieConsent = {
      ...consent,
      timestamp: Date.now(),
    };
    
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consentData));
    
    // Dispatch custom event for other components to react
    window.dispatchEvent(new CustomEvent('cookieConsentChanged', { detail: consentData }));
  } catch (error) {
    console.error('Error saving cookie consent:', error);
  }
};

/**
 * Check if user has given consent
 */
export const hasConsent = (): boolean => {
  return getCookieConsent() !== null;
};

/**
 * Check if specific category is enabled
 */
export const isCategoryEnabled = (category: CookieCategory): boolean => {
  const consent = getCookieConsent();
  if (!consent) return false;
  return consent[category];
};

/**
 * Accept all cookies
 */
export const acceptAllCookies = (): void => {
  setCookieConsent({
    essential: true,
    analytics: true,
    marketing: true,
    preferences: true,
  });
};

/**
 * Accept only essential cookies
 */
export const acceptEssentialOnly = (): void => {
  setCookieConsent({
    essential: true,
    analytics: false,
    marketing: false,
    preferences: false,
  });
};

/**
 * Revoke all consent and clear cookies
 */
export const revokeConsent = (): void => {
  localStorage.removeItem(CONSENT_KEY);
  
  // Clear non-essential cookies
  clearAnalyticsCookies();
  clearMarketingCookies();
  
  window.dispatchEvent(new CustomEvent('cookieConsentChanged', { detail: null }));
};

/**
 * Clear analytics cookies
 */
export const clearAnalyticsCookies = (): void => {
  // Clear Google Analytics cookies
  const gaCookies = ['_ga', '_gid', '_gat', '_gat_gtag'];
  gaCookies.forEach(name => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  });
};

/**
 * Clear marketing cookies
 */
export const clearMarketingCookies = (): void => {
  // Add marketing cookie clearing logic here
  // Example: FB pixel, ads platforms, etc.
};

/**
 * Get cookie value
 */
export const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
};

/**
 * Set cookie with options
 */
export const setCookie = (
  name: string,
  value: string,
  days: number = CONSENT_EXPIRY_DAYS
): void => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
};

/**
 * Delete cookie
 */
export const deleteCookie = (name: string): void => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

/**
 * List all cookies
 */
export const getAllCookies = (): Record<string, string> => {
  const cookies: Record<string, string> = {};
  document.cookie.split(';').forEach(cookie => {
    const [name, value] = cookie.trim().split('=');
    if (name && value) {
      cookies[name] = value;
    }
  });
  return cookies;
};
