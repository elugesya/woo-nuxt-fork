/**
 * 🌊 PDP Stability Tests
 *
 * Tests to verify Product Detail Page doesn't continuously refresh
 * Issue: woonuxt-5l5 - PDP keeps Refreshing
 */
import { test, expect } from '@playwright/test';
import { HomePage } from './pages/home.page';
import { ProductPage } from './pages/product.page';

test.describe('PDP - No Infinite Refresh', () => {
  let homePage: HomePage;
  let productPage: ProductPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    productPage = new ProductPage(page);
  });

  test('should not continuously refresh PDP', async ({ page }) => {
    // Navigate to homepage
    await homePage.goto();
    await page.waitForSelector('article, [class*="ProductCard"]');

    // Navigate to first product
    await homePage.clickProductByIndex(0);
    await page.waitForLoadState('networkidle');

    // Get initial URL
    const initialUrl = page.url();

    // Track page reload events
    let reloadCount = 0;
    page.on('load', () => {
      reloadCount++;
    });

    // Wait and observe for potential refreshes
    // If there's an infinite refresh bug, reloadCount will increase rapidly
    await page.waitForTimeout(5000);

    // Verify page is still stable (no continuous refresh)
    // reloadCount should be 1 (initial load) or at most 2 (if there's one redirect)
    // If it's more than 3, there's likely a refresh loop
    expect(reloadCount).toBeLessThanOrEqual(3);

    // Verify URL hasn't changed unexpectedly
    const currentUrl = page.url();
    expect(currentUrl).toContain('/urun/');

    // Verify page is still interactive
    await expect(productPage.productTitle).toBeVisible();
  });

  test('should not refresh when viewing product images', async ({ page }) => {
    await homePage.goto();
    await page.waitForSelector('article, [class*="ProductCard"]');
    await homePage.clickProductByIndex(0);
    await page.waitForLoadState('networkidle');

    let reloadCount = 0;
    page.on('load', () => {
      reloadCount++;
    });

    // Wait for page to be fully loaded
    await page.waitForTimeout(2000);

    // Try interacting with the page
    if (await productPage.thumbnails.count() > 0) {
      await productPage.thumbnails.first().click();
      await page.waitForTimeout(1000);
    }

    // Should not have reloaded
    expect(reloadCount).toBe(0);
  });

  test('should remain stable after scrolling', async ({ page }) => {
    await homePage.goto();
    await page.waitForSelector('article, [class*="ProductCard"]');
    await homePage.clickProductByIndex(0);
    await page.waitForLoadState('networkidle');

    let reloadCount = 0;
    page.on('load', () => {
      reloadCount++;
    });

    // Scroll to bottom of page
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);

    // Scroll back to top
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1000);

    // Should not have reloaded
    expect(reloadCount).toBe(0);
  });

  test('should load and be stable on direct product URL', async ({ page }) => {
    // Navigate directly to a product page (assuming we have at least one product)
    await homePage.goto();
    await page.waitForSelector('article, [class*="ProductCard"]');

    // Get first product link
    const firstProductLink = page.locator('article a, [class*="ProductCard"] a').first();
    const href = await firstProductLink.getAttribute('href');

    if (href) {
      // Navigate directly to the product URL
      await page.goto(href);
      await page.waitForLoadState('networkidle');

      let reloadCount = 0;
      page.on('load', () => {
        reloadCount++;
      });

      // Wait and observe
      await page.waitForTimeout(5000);

      // Should be stable
      expect(reloadCount).toBeLessThanOrEqual(1);

      // Verify product is visible
      await expect(productPage.productTitle).toBeVisible();
    }
  });

  test('should not refresh when stock status updates', async ({ page }) => {
    await homePage.goto();
    await page.waitForSelector('article, [class*="ProductCard"]');
    await homePage.clickProductByIndex(0);
    await page.waitForLoadState('networkidle');

    let reloadCount = 0;
    page.on('load', () => {
      reloadCount++;
    });

    // Wait for any async stock status updates to complete
    // The fix uses requestIdleCallback with timeout of 2000ms
    await page.waitForTimeout(3000);

    // Page should not have reloaded due to stock status update
    expect(reloadCount).toBe(0);

    // Verify stock status is visible
    await expect(productPage.stockStatus).toBeVisible();
  });

  test('should handle variation selection without refresh', async ({ page }) => {
    await homePage.goto();
    await page.waitForSelector('article, [class*="ProductCard"]');
    await homePage.clickProductByIndex(0);
    await page.waitForLoadState('networkidle');

    let reloadCount = 0;
    page.on('load', () => {
      reloadCount++;
    });

    // Check if there are variation selectors
    const variationCount = await productPage.variationSelectors.count();

    if (variationCount > 0) {
      // Try clicking on a variation option
      const firstVariation = productPage.variationSelectors.first();
      await firstVariation.click();
      await page.waitForTimeout(1000);

      // Should not have reloaded
      expect(reloadCount).toBe(0);
    }
  });
});

test.describe('PDP - Performance & Stability', () => {
  let homePage: HomePage;
  let productPage: ProductPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    productPage = new ProductPage(page);
  });

  test('should have stable DOM after load', async ({ page }) => {
    await homePage.goto();
    await page.waitForSelector('article, [class*="ProductCard"]');
    await homePage.clickProductByIndex(0);
    await page.waitForLoadState('networkidle');

    // Wait for initial renders
    await page.waitForTimeout(2000);

    const initialDomSize = await page.evaluate(() => document.body.innerHTML.length);

    // Wait some more
    await page.waitForTimeout(3000);

    const finalDomSize = await page.evaluate(() => document.body.innerHTML.length);

    // DOM size should be relatively stable
    // Allow for some variation due to animations, but not massive growth
    const sizeDifference = Math.abs(finalDomSize - initialDomSize);
    const percentDifference = (sizeDifference / initialDomSize) * 100;

    // DOM size should not grow by more than 50% (indicates constant re-renders)
    expect(percentDifference).toBeLessThan(50);
  });

  test('should not have excessive network requests after load', async ({ page }) => {
    let requestCount = 0;

    page.on('request', () => {
      requestCount++;
    });

    await homePage.goto();
    await page.waitForSelector('article, [class*="ProductCard"]');
    await homePage.clickProductByIndex(0);
    await page.waitForLoadState('networkidle');

    // Reset counter after initial load
    requestCount = 0;

    // Wait and observe
    await page.waitForTimeout(5000);

    // Should not have excessive requests (more than 20 might indicate a refresh loop)
    expect(requestCount).toBeLessThan(20);
  });
});
