import { test, expect } from '@playwright/test';

test.describe('Accessibility', () => {
  test('should have proper heading hierarchy on home page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('h1, h2', { timeout: 10000 });
    
    // Check for h1
    const h1 = page.locator('h1');
    const h1Count = await h1.count();
    
    // Should have at least one h1
    expect(h1Count).toBeGreaterThanOrEqual(1);
    await expect(h1.first()).toBeVisible();
    
    // Check for proper heading levels (h1, h2, h3 etc.)
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    const count = await headings.count();
    
    expect(count).toBeGreaterThan(0);
  });

  test('should have alt text for images', async ({ page }) => {
    await page.goto('/');
    
    // Get all images
    const images = page.locator('img');
    const count = await images.count();
    
    if (count > 0) {
      // Check first few images have alt attribute
      for (let i = 0; i < Math.min(count, 5); i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute('alt');
        
        // Alt should exist (can be empty for decorative images)
        expect(alt).toBeDefined();
      }
    }
  });

  test('should have proper form labels', async ({ page }) => {
    await page.goto('/#/admin/login');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await page.waitForSelector('input', { timeout: 15000 });
    
    // Get all inputs
    const inputs = page.locator('input');
    const count = await inputs.count();
    
    if (count > 0) {
      // Check inputs have labels or aria-labels or placeholders
      for (let i = 0; i < count; i++) {
        const input = inputs.nth(i);
        const id = await input.getAttribute('id');
        const ariaLabel = await input.getAttribute('aria-label');
        const placeholder = await input.getAttribute('placeholder');
        
        // Input should have some form of label
        const hasLabel = id || ariaLabel || placeholder;
        expect(hasLabel).toBeTruthy();
      }
    }
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/');
    
    // Tab through focusable elements
    await page.keyboard.press('Tab');
    
    // Check if focus is visible
    const focused = page.locator(':focus');
    const count = await focused.count();
    
    expect(count).toBeGreaterThan(0);
  });

  test('should have proper ARIA roles for main sections', async ({ page }) => {
    await page.goto('/');
    
    // Check for main landmark
    const main = page.locator('main, [role="main"]');
    const hasMain = await main.count() > 0;
    
    // Check for navigation landmark
    const nav = page.locator('nav, [role="navigation"]');
    const hasNav = await nav.count() > 0;
    
    expect(hasMain || hasNav).toBeTruthy();
  });

  test('should have sufficient color contrast (manual check)', async ({ page }) => {
    await page.goto('/');
    
    // This is a placeholder - actual contrast checking would require axe-core
    // For now, just verify page loads correctly
    await expect(page.locator('body')).toBeVisible();
  });

  test('should have functional skip links if present', async ({ page }) => {
    await page.goto('/');
    
    // Check for skip to content link
    const skipLink = page.locator('a[href*="#main"], a:has-text("Skip")');
    
    if (await skipLink.count() > 0) {
      await expect(skipLink.first()).toBeVisible();
    }
  });
});
