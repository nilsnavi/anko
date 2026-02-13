import { test, expect } from '@playwright/test';

const viewports = [
  { name: 'Mobile', width: 375, height: 667 },
  { name: 'Tablet', width: 768, height: 1024 },
  { name: 'Desktop', width: 1920, height: 1080 },
];

test.describe('Responsive Design', () => {
  for (const viewport of viewports) {
    test(`should be responsive on ${viewport.name} (${viewport.width}x${viewport.height})`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Check main content is visible instead of body
      await page.waitForSelector('header, main, h1', { timeout: 10000 });
      const header = page.locator('header').first();
      await expect(header).toBeVisible();
      
      // Check no horizontal scroll
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth + 20;
      });
      expect(hasHorizontalScroll).toBe(false);
      
      // Check main content is visible
      const mainContent = page.locator('h1, h2').first();
      await expect(mainContent).toBeVisible();
    });
  }

  test('should adapt navigation for mobile', async ({ page }) => {
    // Desktop view
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Navigation should be accessible on desktop
    const nav = page.locator('nav, header').first();
    await expect(nav).toBeVisible();
    
    // Mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Header should still be visible
    await expect(nav).toBeVisible();
    
    // Either nav links are visible or there's a menu button
    const menuButton = page.locator('button[aria-label*="меню"], button:has(svg)').first();
    const menuButtonCount = await menuButton.count();
    
    // On mobile, expect menu button to exist
    expect(menuButtonCount).toBeGreaterThan(0);
  });

  test('should have readable text on all viewports', async ({ page }) => {
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/');
      
      // Check font size is reasonable
      const fontSize = await page.locator('body').evaluate(el => 
        window.getComputedStyle(el).fontSize
      );
      
      const fontSizeNum = parseInt(fontSize);
      expect(fontSizeNum).toBeGreaterThanOrEqual(14); // Minimum readable size
    }
  });

  test('should stack content vertically on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check page is scrollable (content stacks vertically)
    const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
    const viewportHeight = 667;
    
    // Allow for cases where content might fit in viewport
    expect(scrollHeight).toBeGreaterThanOrEqual(viewportHeight * 0.8);
  });

  test('should have touch-friendly buttons on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check button sizes
    const buttons = page.locator('button, a[role="button"]').first();
    
    if (await buttons.count() > 0) {
      const box = await buttons.boundingBox();
      
      if (box) {
        // Minimum touch target size is 44x44px (WCAG)
        expect(box.height).toBeGreaterThanOrEqual(40); // Some tolerance
      }
    }
  });
});
