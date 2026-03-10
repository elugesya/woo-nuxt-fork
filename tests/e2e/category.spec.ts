/**
 * 🌊 Category Page E2E Tests
 *
 * Tests for category pages and product card display
 */
import { test, expect } from '@playwright/test';

test.describe('Category Page - Product Cards', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a known category
    await page.goto('/urun-kategorisi/sup-boardlar');
    await page.waitForLoadState('domcontentloaded');
  });

  test('should load category page successfully', async ({ page }) => {
    // Check for header
    const header = page.locator('header');
    await expect(header).toBeVisible({ timeout: 15000 });

    // Check URL is correct
    expect(page.url()).toContain('urun-kategorisi');
  });

  test('should display category title or products section', async ({ page }) => {
    // Wait for content to load
    await page.waitForTimeout(3000);

    // Check for category hero banner or products section
    const heroBanner = page.locator('[class*="hero"], [class*="Hero"]');
    const productsSection = page.locator('[class*="product"], article');
    const categoryTitle = page.locator('h1, h2').first();

    // At least one of these should be visible
    const heroVisible = await heroBanner.count().then(c => c > 0);
    const productsVisible = await productsSection.count().then(c => c > 0);
    const titleVisible = await categoryTitle.count().then(c => c > 0);

    expect(heroVisible || productsVisible || titleVisible).toBeTruthy();
  });

  test('should display product cards in the grid', async ({ page }) => {
    // Wait for products to load
    await page.waitForTimeout(3000);

    // Look for product articles/cards - try multiple selectors
    // The base ProductCard uses div with Card class, new one uses article
    const productCards = page.locator('article, [class*="group"][class*="bg-background"]');
    const cardCount = await productCards.count();

    // Log for debugging
    console.log(`Found ${cardCount} product cards`);

    // Should have at least 1 product card if the category has products
    // If the category is empty, we should see "no products" message
    const noProductsMessage = page.locator('text=/bulunamadı|no.*product/i');
    const hasNoProducts = await noProductsMessage.count() > 0;

    if (!hasNoProducts) {
      expect(cardCount).toBeGreaterThan(0);
    }
  });

  test('product cards should have visible content', async ({ page }) => {
    await page.waitForTimeout(3000);

    // Look for product cards - try multiple selectors
    const productCards = page.locator('article, [class*="group"][class*="bg-background"]');
    const cardCount = await productCards.count();

    if (cardCount > 0) {
      const firstCard = productCards.first();

      // Card should be visible
      await expect(firstCard).toBeVisible();

      // Card should have an image
      const image = firstCard.locator('img');
      const imageCount = await image.count();
      expect(imageCount).toBeGreaterThan(0);

      // Card should have a link
      const link = firstCard.locator('a');
      const linkCount = await link.count();
      expect(linkCount).toBeGreaterThan(0);

      // Card should have some text (product name)
      const textContent = await firstCard.textContent();
      expect(textContent?.length).toBeGreaterThan(0);
    }
  });

  test('product card should navigate to product page', async ({ page }) => {
    await page.waitForTimeout(3000);

    const productCards = page.locator('article');
    const cardCount = await productCards.count();

    if (cardCount > 0) {
      // Click on the first product card's link
      const firstCardLink = productCards.first().locator('a').first();
      await firstCardLink.click();

      // Wait for navigation
      await page.waitForLoadState('networkidle');

      // Should be on a product page
      expect(page.url()).toMatch(/\/urun\//);
    }
  });

  test('should display product grid with correct styling', async ({ page }) => {
    await page.waitForTimeout(3000);

    // Look for grid container
    const grid = page.locator('[class*="grid"]');
    const gridCount = await grid.count();

    console.log(`Found ${gridCount} grid elements`);

    // Should have at least one grid
    expect(gridCount).toBeGreaterThan(0);
  });

  test('should not have JavaScript errors on category page', async ({ page }) => {
    const errors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/urun-kategorisi/sup-boardlar');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Filter out known harmless errors
    const realErrors = errors.filter(
      (e) => !e.includes('Warning:') && !e.includes('[HMR]') && !e.includes('net::')
    );

    console.log('Console errors:', realErrors);

    expect(realErrors.length).toBe(0);
  });

  test('should show product prices', async ({ page }) => {
    await page.waitForTimeout(3000);

    const productCards = page.locator('article');
    const cardCount = await productCards.count();

    if (cardCount > 0) {
      const firstCard = productCards.first();

      // Look for price element (₺ symbol or number)
      const priceElement = firstCard.locator('[class*="price"], :text("₺"), :text("TL")');
      const priceCount = await priceElement.count();

      console.log(`Found ${priceCount} price elements in first card`);

      // Card should display a price
      expect(priceCount).toBeGreaterThan(0);
    }
  });

  test('mobile: should display product cards on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 390, height: 844 });

    await page.goto('/urun-kategorisi/sup-boardlar');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    // Look for product cards - try multiple selectors
    const productCards = page.locator('article, [class*="group"][class*="bg-background"]');
    const cardCount = await productCards.count();

    const noProductsMessage = page.locator('text=/bulunamadı|no.*product/i');
    const hasNoProducts = await noProductsMessage.count() > 0;

    if (!hasNoProducts) {
      expect(cardCount).toBeGreaterThan(0);

      // First card should be visible on mobile
      if (cardCount > 0) {
        await expect(productCards.first()).toBeVisible();
      }
    }
  });
});

test.describe('Category Page - Different Categories', () => {
  test('should load products listing page', async ({ page }) => {
    await page.goto('/urunler');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    // Look for product cards - try multiple selectors
    const productCards = page.locator('article, [class*="group"][class*="bg-background"]');
    const cardCount = await productCards.count();

    console.log(`Products page has ${cardCount} products`);

    // Products page should have products
    expect(cardCount).toBeGreaterThan(0);
  });
});
