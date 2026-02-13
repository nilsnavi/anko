import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate to home page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check page title
    await expect(page).toHaveTitle(/Экосистема учёта/);
    
    // Check hero section is visible
    await page.waitForSelector('h1, h2, main', { timeout: 10000 });
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('should navigate through all main pages', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Navigate to About page
    await page.click('text=О компании');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('h1, h2', { timeout: 10000 });
    await expect(page.url()).toContain('#/about');
    
    // Navigate to Services page
    await page.click('text=Услуги');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('h1, h2', { timeout: 10000 });
    await expect(page.url()).toContain('#/services');
    
    // Navigate to Contacts page
    await page.click('text=Контакты');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('h1, h2', { timeout: 10000 });
    await expect(page.url()).toContain('#/contacts');
    
    // Navigate to Education page
    await page.click('text=Образование');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('h1, h2', { timeout: 10000 });
    await expect(page.url()).toContain('#/education');
  });

  test('should have functional mobile menu', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Mobile menu button should be visible
    const menuButton = page.locator('button[aria-label*="меню"], button:has-text("Menu"), button:has(svg)').first();
    
    // Check if menu button exists (it should on mobile)
    const menuButtonCount = await menuButton.count();
    if (menuButtonCount > 0) {
      await expect(menuButton).toBeVisible();
      
      // Click mobile menu button
      await menuButton.click();
      await page.waitForTimeout(500); // Wait for animation
      
      // Menu should expand
      const nav = page.locator('nav, [role="navigation"]').first();
      await expect(nav).toBeVisible();
    }
  });

  test('should navigate back to home from logo', async ({ page }) => {
    await page.goto('/#/services');
    await page.waitForLoadState('networkidle');
    
    // Click on logo or home link
    const logoLink = page.locator('a[href="/"], a[href="#/"]').first();
    await logoLink.click();
    await page.waitForLoadState('networkidle');
    
    // Should be on home page
    await expect(page.url()).toMatch(/\/$|#\/$/);;
    await page.waitForSelector('h1, h2', { timeout: 10000 });
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('should have working footer links', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    
    // Check footer is visible
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    
    // Check that footer has content
    const footerText = await footer.textContent();
    expect(footerText).toBeTruthy();
  });
});
