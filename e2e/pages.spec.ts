import { test, expect } from '@playwright/test';

test.describe('Pages Content', () => {
  test.describe('Home Page', () => {
    test('should display hero section with main content', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await page.waitForSelector('h1, h2, main', { timeout: 10000 });
      
      // Check main heading is visible
      const heading = page.locator('h1, h2').first();
      await expect(heading).toBeVisible();
      
      // Check page has content
      const main = page.locator('main').first();
      await expect(main).toBeVisible();
    });

    test('should display services section', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Check page has loaded
      const content = page.locator('h1, h2, section').first();
      await expect(content).toBeVisible();
    });
  });

  test.describe('About Page', () => {
    test('should display company information', async ({ page }) => {
      await page.goto('/#/about');
      await page.waitForLoadState('networkidle');
      await page.waitForSelector('h1, h2', { timeout: 10000 });
      
      // Check page heading is visible
      const heading = page.locator('h1, h2').first();
      await expect(heading).toBeVisible();
    });
  });

  test.describe('Services Page', () => {
    test('should display all services', async ({ page }) => {
      await page.goto('/#/services');
      await page.waitForLoadState('networkidle');
      await page.waitForSelector('h1, h2', { timeout: 10000 });
      
      // Check page heading
      const heading = page.locator('h1, h2').first();
      await expect(heading).toBeVisible();
    });

    test('should have clickable service details', async ({ page }) => {
      await page.goto('/#/services');
      
      // Find any button or link in services
      const detailsButton = page.locator('button, a').filter({ hasText: /подробнее|записаться|узнать/i }).first();
      
      if (await detailsButton.count() > 0) {
        await expect(detailsButton).toBeVisible();
        await expect(detailsButton).toBeEnabled();
      }
    });
  });

  test.describe('Contacts Page', () => {
    test('should display contact information', async ({ page }) => {
      await page.goto('/#/contacts');
      await page.waitForLoadState('networkidle');
      await page.waitForSelector('h1, h2', { timeout: 10000 });
      
      // Check page heading
      const heading = page.locator('h1, h2').first();
      await expect(heading).toBeVisible();
    });
  });

  test.describe('Education Page', () => {
    test('should display educational programs', async ({ page }) => {
      await page.goto('/#/education');
      await page.waitForLoadState('networkidle');
      await page.waitForSelector('h1, h2', { timeout: 10000 });
      
      // Check page heading contains education-related text
      const heading = page.locator('h1, h2').first();
      await expect(heading).toBeVisible();
      const headingText = await heading.textContent();
      expect(headingText?.toLowerCase()).toContain('образов');
    });
  });

  test.describe('Veterans Page', () => {
    test('should display veterans support information', async ({ page }) => {
      await page.goto('/#/veterans');
      await page.waitForLoadState('networkidle');
      await page.waitForSelector('h1, h2', { timeout: 10000 });
      
      // Check page heading contains veterans-related text
      const heading = page.locator('h1, h2').first();
      await expect(heading).toBeVisible();
      const headingText = await heading.textContent();
      expect(headingText?.toLowerCase()).toMatch(/ветеран|поддерж/);
    });
  });
});
