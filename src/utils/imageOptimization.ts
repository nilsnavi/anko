/**
 * Image optimization utilities
 */

/**
 * Generate srcset for responsive images
 * @param baseUrl - Base image URL
 * @param widths - Array of widths to generate
 * @returns srcset string
 */
export function generateSrcSet(baseUrl: string, widths: number[]): string {
  return widths
    .map((width) => `${baseUrl}?w=${width} ${width}w`)
    .join(', ');
}

/**
 * Generate sizes attribute for responsive images
 * @param breakpoints - Object with breakpoint and size pairs
 * @returns sizes string
 */
export function generateSizes(breakpoints: Record<string, string>): string {
  return Object.entries(breakpoints)
    .map(([breakpoint, size]) => {
      if (breakpoint === 'default') {
        return size;
      }
      return `(max-width: ${breakpoint}) ${size}`;
    })
    .join(', ');
}

/**
 * Preload critical images
 * @param imageUrl - Image URL to preload
 * @param as - Resource type (default: 'image')
 */
export function preloadImage(imageUrl: string, as: string = 'image'): void {
  if (typeof window === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = as;
  link.href = imageUrl;
  document.head.appendChild(link);
}

/**
 * Lazy load images that are about to enter viewport
 */
export function setupLazyLoading(): void {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const src = img.dataset.src;
          if (src) {
            img.src = src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach((img) => {
      imageObserver.observe(img);
    });
  }
}

/**
 * Convert image to WebP format (if browser supports)
 * @param imageUrl - Original image URL
 * @returns WebP URL if supported, original otherwise
 */
export function getOptimizedImageUrl(imageUrl: string): string {
  // Check if browser supports WebP
  const supportsWebP = () => {
    const elem = document.createElement('canvas');
    if (elem.getContext && elem.getContext('2d')) {
      return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
    return false;
  };

  if (supportsWebP()) {
    // Replace extension with .webp
    return imageUrl.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  }

  return imageUrl;
}
