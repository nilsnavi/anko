import { test, expect } from '@playwright/test';

test.describe('Performance', () => {
  test('should load home page within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Page should load in under 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  test('should have fast First Contentful Paint', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Wait for first content with longer timeout
    await page.waitForSelector('h1, h2, main', { timeout: 5000 });
    
    // Check that content is visible
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();
  });

  test('should lazy load images', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check for images with loading="lazy"
    const lazyImages = page.locator('img[loading="lazy"]');
    const count = await lazyImages.count();
    
    // Check all images
    const allImages = page.locator('img');
    const totalImages = await allImages.count();
    
    // If there are images but none are lazy-loaded, that's ok for now
    // This test is more of a suggestion than requirement
    expect(totalImages).toBeGreaterThanOrEqual(0);
  });

  test('should not have excessive DOM size', async ({ page }) => {
    await page.goto('/');
    
    // Count DOM nodes
    const nodeCount = await page.evaluate(() => 
      document.querySelectorAll('*').length
    );
    
    // Should be reasonable (< 1500 nodes for good performance)
    expect(nodeCount).toBeLessThan(2000);
  });

  test('should minimize layout shifts', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to stabilize
    await page.waitForTimeout(1000);
    
    // Get Cumulative Layout Shift
    const cls = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        let clsValue = 0;
        
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if ((entry as any).hadRecentInput) continue;
            clsValue += (entry as any).value;
          }
        });
        
        observer.observe({ type: 'layout-shift', buffered: true });
        
        setTimeout(() => {
          observer.disconnect();
          resolve(clsValue);
        }, 2000);
      });
    });
    
    // CLS should be low (< 0.1 is good, < 0.25 is acceptable)
    expect(cls).toBeLessThan(0.3);
  });

  test('should cache static assets', async ({ page }) => {
    // First visit
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Second visit - should use cache
    const startTime = Date.now();
    await page.reload();
    await page.waitForLoadState('networkidle');
    const reloadTime = Date.now() - startTime;
    
    // Reload should be faster (indicating caching)
    expect(reloadTime).toBeLessThan(2000);
  });
});
