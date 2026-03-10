/**
 * 🌊 PDP Stability Test - Direct Navigation
 *
 * Tests to verify Product Detail Page doesn't continuously refresh
 * Issue: woonuxt-5l5 - PDP keeps Refreshing
 */
import { test, expect } from '@playwright/test';

test.describe('PDP - No Infinite Refresh (Direct)', () => {
  test('should not continuously refresh when loading PDP', async ({ page }) => {
    // Navigate directly to a known product URL
    // This test verifies the fix for useAsyncGql in onMounted causing re-render loops
    await page.goto('/urun/test-product');
    await page.waitForLoadState('domcontentloaded');

    // Track page load events
    let loadCount = 0;
    page.on('load', () => {
      loadCount++;
    });

    // Wait and observe - if there's an infinite refresh, loadCount will increase rapidly
    await page.waitForTimeout(5000);

    // Verify page is stable (should only have loaded once)
    // If loadCount > 2, there's likely a refresh loop
    expect(loadCount).toBeLessThanOrEqual(2);

    // Even if 404, we should get a stable response
    const currentUrl = page.url();
    expect(currentUrl).toContain('/urun/');
  });

  test('should not trigger multiple network requests for stock status', async ({ page }) => {
    let graphqlRequestCount = 0;
    const graphqlRequests: string[] = [];

    // Track GraphQL requests
    page.on('request', (request) => {
      const url = request.url();
      if (url.includes('/graphql')) {
        graphqlRequestCount++;
        graphqlRequests.push(url);
      }
    });

    await page.goto('/urun/test-product');
    await page.waitForLoadState('domcontentloaded');

    // Reset counter after initial load
    graphqlRequestCount = 0;
    graphqlRequests.length = 0;

    // Wait for stock status update (uses requestIdleCallback with 2000ms timeout)
    await page.waitForTimeout(3000);

    // Should have at most 1 additional GraphQL request for stock status
    // If useAsyncGql was causing re-renders, we'd see many more
    expect(graphqlRequestCount).toBeLessThanOrEqual(2);

    console.log('GraphQL requests after load:', graphqlRequestCount);
    console.log('Request URLs:', graphqlRequests);
  });

  test('should have stable DOM after initial load', async ({ page }) => {
    await page.goto('/urun/test-product');
    await page.waitForLoadState('domcontentloaded');

    // Wait for initial renders to complete
    await page.waitForTimeout(2000);

    const initialDomSize = await page.evaluate(() => document.body.innerHTML.length);

    // Wait for stock status update cycle
    await page.waitForTimeout(3000);

    const finalDomSize = await page.evaluate(() => document.body.innerHTML.length);

    // DOM size should be relatively stable
    // If there were constant re-renders, the size would fluctuate wildly
    const sizeDifference = Math.abs(finalDomSize - initialDomSize);
    const percentDifference = (sizeDifference / initialDomSize) * 100;

    console.log('Initial DOM size:', initialDomSize);
    console.log('Final DOM size:', finalDomSize);
    console.log('Size difference:', sizeDifference);
    console.log('Percent difference:', percentDifference.toFixed(2) + '%');

    // DOM should not grow by more than 50% (indicates constant re-renders)
    expect(percentDifference).toBeLessThan(50);
  });

  test('should handle page visibility changes without refresh', async ({ page }) => {
    await page.goto('/urun/test-product');
    await page.waitForLoadState('domcontentloaded');

    let loadCount = 0;
    page.on('load', () => {
      loadCount++;
    });

    // Simulate tab becoming hidden and visible again
    await page.evaluate(() => {
      document.dispatchEvent(new Event('visibilitychange'));
    });

    await page.waitForTimeout(2000);

    // Should not have reloaded
    expect(loadCount).toBe(0);
  });
});
