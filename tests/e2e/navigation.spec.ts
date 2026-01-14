import { test, expect } from '@playwright/test';

/**
 * Basic navigation E2E tests
 * These tests verify core routing and navigation functionality
 */

test.describe('Navigation', () => {
  test('homepage loads without errors', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');
    
    // Check for console errors
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Verify no critical console errors
    const criticalErrors = errors.filter(e => 
      !e.includes('favicon') && // Ignore missing favicon
      !e.includes('DevTools') // Ignore DevTools warnings
    );
    expect(criticalErrors).toHaveLength(0);
  });

  test('header navigation is visible', async ({ page }) => {
    await page.goto('/');
    
    // Check for navigation header
    const header = page.locator('header').first();
    await expect(header).toBeVisible();
  });

  test('mobile menu toggle works', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Look for mobile menu button (commonly a hamburger icon)
    const menuButton = page.locator('button[aria-label*="menu"], button[aria-label*="Menu"], [data-testid="mobile-menu"]').first();
    
    // If mobile menu exists, test it
    if (await menuButton.isVisible()) {
      await menuButton.click();
      
      // Wait for menu animation
      await page.waitForTimeout(300);
      
      // Menu should be open - check for nav links being visible
      const nav = page.locator('nav').first();
      await expect(nav).toBeVisible();
    }
  });
});

test.describe('Route Resolution', () => {
  test('wireframe index route resolves', async ({ page }) => {
    // This test assumes at least one wireframe project exists
    // The exact route depends on the project configuration
    const response = await page.goto('/');
    
    // Should not be a 404
    expect(response?.status()).not.toBe(404);
  });

  test('404 page shows for unknown routes', async ({ page }) => {
    const response = await page.goto('/this-route-definitely-does-not-exist-12345');
    
    // Either returns 404 or shows a 404 component
    // React Router typically returns 200 with a 404 component
    const pageContent = await page.content();
    const is404 = response?.status() === 404 || 
                  pageContent.toLowerCase().includes('not found') ||
                  pageContent.toLowerCase().includes('404');
    
    expect(is404).toBe(true);
  });
});

test.describe('Accessibility Basics', () => {
  test('page has proper heading structure', async ({ page }) => {
    await page.goto('/');
    
    // Should have at least one h1
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThanOrEqual(1);
  });

  test('images have alt text', async ({ page }) => {
    await page.goto('/');
    
    // Find all images
    const images = page.locator('img');
    const count = await images.count();
    
    // Check each image has alt attribute (can be empty for decorative)
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      // alt should exist (even if empty string for decorative images)
      expect(alt).not.toBeNull();
    }
  });

  test('interactive elements are keyboard accessible', async ({ page }) => {
    await page.goto('/');
    
    // Find all buttons and links
    const buttons = await page.locator('button:visible').count();
    const links = await page.locator('a:visible').count();
    
    // Page should have some interactive elements
    expect(buttons + links).toBeGreaterThan(0);
    
    // Tab through focus - first element should receive focus
    await page.keyboard.press('Tab');
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    
    // Something should be focused
    expect(focusedElement).not.toBe('BODY');
  });
});
