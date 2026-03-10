import { defineConfig, devices } from '@playwright/test';

/**
 * 🌊 SeaShop E2E Test Configuration
 *
 * Comprehensive test suite for the marine-themed e-commerce webshop.
 *
 * Usage:
 * 1. Start dev server: pnpm run dev
 * 2. Run tests: pnpm test
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 4,
  reporter: [
    ['html', { outputFolder: 'tests/report' }],
    ['list'],
  ],
  use: {
    baseURL: 'http://127.0.0.1:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'pnpm run dev -- --host 127.0.0.1 --port 3000',
    url: 'http://127.0.0.1:3000',
    timeout: 180000,
    reuseExistingServer: true,
  },
});
