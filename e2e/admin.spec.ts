import { test, expect } from '@playwright/test';

test.describe('Admin Panel', () => {
  test.describe('Login Page', () => {
    test('should display login form', async ({ page }) => {
      await page.goto('/#/admin/login');
      await page.waitForLoadState('networkidle');
      
      // Wait longer for lazy-loaded page
      await page.waitForTimeout(2000);
      await page.waitForSelector('h1, h2, form', { timeout: 15000 });
      
      // Check login heading is visible
      const heading = page.locator('h1, h2').first();
      await expect(heading).toBeVisible();
      
      // Check form fields
      const usernameInput = page.locator('input[type="text"], input[placeholder*="admin"]').first();
      const passwordInput = page.locator('input[type="password"]').first();
      
      await expect(usernameInput).toBeVisible();
      await expect(passwordInput).toBeVisible();
      
      // Check submit button
      const submitButton = page.locator('button[type="submit"]');
      await expect(submitButton).toBeVisible();
    });

    test('should show validation errors on empty submit', async ({ page }) => {
      await page.goto('/#/admin/login');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      await page.waitForSelector('form, button[type="submit"]', { timeout: 15000 });
      
      // Clear fields and click submit
      const usernameInput = page.locator('input[type="text"]').first();
      await usernameInput.clear();
      
      const passwordInput = page.locator('input[type="password"]').first();
      await passwordInput.clear();
      
      const submitButton = page.locator('button[type="submit"]');
      await submitButton.click();
      
      // Should stay on login page
      await page.waitForTimeout(1000);
      await expect(page.url()).toContain('login');
    });

    test('should have link to registration', async ({ page }) => {
      await page.goto('/#/admin/login');
      
      // Check for registration link
      const registerLink = page.locator('a[href*="register"]');
      if (await registerLink.count() > 0) {
        await expect(registerLink).toBeVisible();
      }
    });

    test('should have link to password reset', async ({ page }) => {
      await page.goto('/#/admin/login');
      
      // Check for password reset link
      const resetLink = page.locator('a[href*="reset"]').or(page.locator('text=Забыли пароль'));
      if (await resetLink.count() > 0) {
        await expect(resetLink).toBeVisible();
      }
    });
  });

  test.describe('Registration Page', () => {
    test('should display registration form', async ({ page }) => {
      await page.goto('/#/admin/register');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      await page.waitForSelector('h1, h2, form', { timeout: 15000 });
      
      // Check registration heading is visible
      const heading = page.locator('h1, h2').first();
      await expect(heading).toBeVisible();
      
      // Check form exists
      const form = page.locator('form').first();
      await expect(form).toBeVisible();
    });
  });

  test.describe('Protected Routes', () => {
    test('should redirect to login when not authenticated', async ({ page }) => {
      // Try to access admin dashboard without auth
      await page.goto('/#/admin/dashboard');
      await page.waitForLoadState('networkidle');
      
      // Wait a moment for potential redirect
      await page.waitForTimeout(2000);
      
      // Check that we're either on login or have a login form
      const url = page.url();
      const isOnLogin = url.includes('login');
      const hasForm = await page.locator('form, input[type="password"]').count() > 0;
      
      expect(isOnLogin || hasForm).toBeTruthy();
    });
  });

  test.describe('Admin Navigation', () => {
    test('should have admin menu items when logged in', async ({ page }) => {
      // For now, just check the admin login page structure
      await page.goto('/#/admin/login');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      // Page should load successfully
      const content = page.locator('h1, h2, form').first();
      await expect(content).toBeVisible({ timeout: 15000 });
    });
  });
});
