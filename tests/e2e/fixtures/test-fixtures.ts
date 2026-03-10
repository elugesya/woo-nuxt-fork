/**
 * 🌊 SeaShop Test Fixtures
 *
 * Custom fixtures for e-commerce testing
 */
import { test as base, expect, Page } from '@playwright/test';

// Custom fixtures for authenticated state, etc.
type SeaShopFixtures = {
  mobilePage: Page;
};

export const test = base.extend<SeaShopFixtures>({
  mobilePage: async ({ browser }, use) => {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
    });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
});

export { expect };
