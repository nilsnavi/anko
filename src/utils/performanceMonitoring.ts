/**
 * Performance Monitoring Utilities
 * Track and report performance metrics
 */

interface PerformanceMetrics {
  // Core Web Vitals
  FCP?: number; // First Contentful Paint
  LCP?: number; // Largest Contentful Paint
  FID?: number; // First Input Delay
  CLS?: number; // Cumulative Layout Shift
  TTFB?: number; // Time to First Byte

  // Additional metrics
  domContentLoaded?: number;
  windowLoad?: number;
  
  // Navigation timing
  navigationStart?: number;
  responseEnd?: number;
  domInteractive?: number;
}

let metrics: PerformanceMetrics = {};

/**
 * Initialize performance monitoring
 */
export function initPerformanceMonitoring(): void {
  if (typeof window === 'undefined') return;

  // Monitor Core Web Vitals
  monitorWebVitals();

  // Monitor page load times
  monitorPageLoad();

  // Monitor resource timing
  monitorResources();
}

/**
 * Monitor Core Web Vitals
 */
function monitorWebVitals(): void {
  // FCP - First Contentful Paint
  const observeFCP = () => {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          metrics.FCP = entry.startTime;
          reportMetric('FCP', entry.startTime);
        }
      }
    });
    observer.observe({ entryTypes: ['paint'] });
  };

  // LCP - Largest Contentful Paint
  const observeLCP = () => {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as any;
      metrics.LCP = lastEntry.renderTime || lastEntry.loadTime;
      reportMetric('LCP', metrics.LCP);
    });
    observer.observe({ entryTypes: ['largest-contentful-paint'] });
  };

  // FID - First Input Delay
  const observeFID = () => {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const fidEntry = entry as any;
        metrics.FID = fidEntry.processingStart - fidEntry.startTime;
        reportMetric('FID', metrics.FID);
      }
    });
    observer.observe({ entryTypes: ['first-input'] });
  };

  // CLS - Cumulative Layout Shift
  const observeCLS = () => {
    let clsValue = 0;
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const clsEntry = entry as any;
        if (!clsEntry.hadRecentInput) {
          clsValue += clsEntry.value;
          metrics.CLS = clsValue;
        }
      }
      reportMetric('CLS', clsValue);
    });
    observer.observe({ entryTypes: ['layout-shift'] });
  };

  try {
    observeFCP();
    observeLCP();
    observeFID();
    observeCLS();
  } catch (error) {
    console.warn('Performance Observer not supported', error);
  }
}

/**
 * Monitor page load timing
 */
function monitorPageLoad(): void {
  window.addEventListener('load', () => {
    setTimeout(() => {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (perfData) {
        metrics.TTFB = perfData.responseStart - perfData.requestStart;
        metrics.domContentLoaded = perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart;
        metrics.windowLoad = perfData.loadEventEnd - perfData.loadEventStart;
        metrics.navigationStart = perfData.startTime;
        metrics.responseEnd = perfData.responseEnd;
        metrics.domInteractive = perfData.domInteractive;

        reportAllMetrics();
      }
    }, 0);
  });
}

/**
 * Monitor resource loading
 */
function monitorResources(): void {
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      const resource = entry as PerformanceResourceTiming;
      
      // Log slow resources (> 1 second)
      if (resource.duration > 1000) {
        console.warn(`Slow resource: ${resource.name} took ${resource.duration.toFixed(2)}ms`);
        reportMetric('SlowResource', resource.duration, {
          resourceName: resource.name,
          resourceType: resource.initiatorType,
        });
      }
    }
  });

  try {
    observer.observe({ entryTypes: ['resource'] });
  } catch (error) {
    console.warn('Resource timing not supported');
  }
}

/**
 * Report metric to analytics or monitoring service
 */
function reportMetric(
  metricName: string,
  value: number,
  additionalData?: Record<string, any>
): void {
  // Send to Google Analytics if available
  if (window.gtag) {
    window.gtag('event', 'performance_metric', {
      metric_name: metricName,
      metric_value: Math.round(value),
      ...additionalData,
    });
  }

  // Log to console in development
  if (import.meta.env.DEV) {
    console.log(`[Performance] ${metricName}:`, value.toFixed(2), 'ms', additionalData);
  }
}

/**
 * Report all collected metrics
 */
function reportAllMetrics(): void {
  console.table(metrics);

  // Determine performance rating
  const rating = getPerformanceRating(metrics);
  console.log(`Overall Performance Rating: ${rating}`);

  // Send summary to analytics
  if (window.gtag) {
    window.gtag('event', 'performance_summary', {
      fcp: metrics.FCP ? Math.round(metrics.FCP) : undefined,
      lcp: metrics.LCP ? Math.round(metrics.LCP) : undefined,
      fid: metrics.FID ? Math.round(metrics.FID) : undefined,
      cls: metrics.CLS ? Math.round(metrics.CLS * 1000) / 1000 : undefined,
      ttfb: metrics.TTFB ? Math.round(metrics.TTFB) : undefined,
      rating: rating,
    });
  }
}

/**
 * Get performance rating based on Core Web Vitals
 */
function getPerformanceRating(metrics: PerformanceMetrics): 'good' | 'needs-improvement' | 'poor' {
  let score = 0;
  let count = 0;

  // FCP: good < 1800ms, poor > 3000ms
  if (metrics.FCP) {
    count++;
    if (metrics.FCP < 1800) score += 1;
    else if (metrics.FCP < 3000) score += 0.5;
  }

  // LCP: good < 2500ms, poor > 4000ms
  if (metrics.LCP) {
    count++;
    if (metrics.LCP < 2500) score += 1;
    else if (metrics.LCP < 4000) score += 0.5;
  }

  // FID: good < 100ms, poor > 300ms
  if (metrics.FID) {
    count++;
    if (metrics.FID < 100) score += 1;
    else if (metrics.FID < 300) score += 0.5;
  }

  // CLS: good < 0.1, poor > 0.25
  if (metrics.CLS !== undefined) {
    count++;
    if (metrics.CLS < 0.1) score += 1;
    else if (metrics.CLS < 0.25) score += 0.5;
  }

  if (count === 0) return 'needs-improvement';

  const averageScore = score / count;
  if (averageScore >= 0.8) return 'good';
  if (averageScore >= 0.5) return 'needs-improvement';
  return 'poor';
}

/**
 * Get current performance metrics
 */
export function getPerformanceMetrics(): PerformanceMetrics {
  return { ...metrics };
}

/**
 * Measure custom timing
 */
export function measureTiming(name: string, startMark?: string, endMark?: string): number | null {
  try {
    if (startMark && endMark) {
      performance.measure(name, startMark, endMark);
    }
    
    const measures = performance.getEntriesByName(name, 'measure');
    if (measures.length > 0) {
      return measures[measures.length - 1].duration;
    }
  } catch (error) {
    console.warn(`Failed to measure timing for ${name}`, error);
  }
  return null;
}

/**
 * Mark performance point
 */
export function markPerformance(name: string): void {
  try {
    performance.mark(name);
  } catch (error) {
    console.warn(`Failed to mark performance point ${name}`, error);
  }
}
