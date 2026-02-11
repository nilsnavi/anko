import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { initGA, GAEvents } from './analytics';
import { initPerformanceMonitoring } from './performanceMonitoring';

/**
 * Custom hook to initialize and track analytics
 */
export function useAnalytics() {
  const location = useLocation();

  useEffect(() => {
    // Initialize Google Analytics on mount
    initGA();
    
    // Initialize Performance Monitoring
    initPerformanceMonitoring();
  }, []);

  useEffect(() => {
    // Track page views on route change
    const pagePath = location.pathname + location.search + location.hash;
    GAEvents.pageView(pagePath);
  }, [location]);
}

/**
 * Track scroll depth
 */
export function useScrollTracking() {
  useEffect(() => {
    const scrollDepths = [25, 50, 75, 100];
    const triggeredDepths = new Set<number>();

    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrollPercent = ((scrollTop + windowHeight) / documentHeight) * 100;

      scrollDepths.forEach((depth) => {
        if (scrollPercent >= depth && !triggeredDepths.has(depth)) {
          triggeredDepths.add(depth);
          GAEvents.scrollDepth(depth);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
}

/**
 * Track time spent on page
 */
export function useTimeTracking(pageName: string) {
  useEffect(() => {
    const startTime = Date.now();

    return () => {
      const endTime = Date.now();
      const timeSpent = Math.round((endTime - startTime) / 1000);
      
      // Only track if user spent more than 5 seconds
      if (timeSpent >= 5) {
        GAEvents.timeOnPage(timeSpent, pageName);
      }
    };
  }, [pageName]);
}
