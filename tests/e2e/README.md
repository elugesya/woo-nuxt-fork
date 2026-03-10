# 🌊 SeaShop E2E Tests

Comprehensive end-to-end test suite for the SeaShop marine-themed e-commerce webshop.

## Prerequisites

```bash
# Install dependencies
pnpm install

# Install Playwright browsers
pnpm run test:install
```

## Running Tests

### Quick Start (Recommended)

1. **Start the dev server first:**
   ```bash
   pnpm run dev
   ```

2. **Wait for the server to be ready** (you should see "Local: http://localhost:3000")

3. **Run the tests:**
   ```bash
   pnpm test
   ```

### Using the Test Runner Script
```bash
# From the project root
./tests/run-tests.sh

# Or run specific tests
./tests/run-tests.sh tests/e2e/homepage.spec.ts
```

### All Tests
```bash
# Run all tests (make sure dev server is running)
pnpm test

# Run tests with UI (interactive mode)
pnpm test:ui

# Run tests in headed mode (visible browser)
pnpm test:headed
```

### Specific Test Suites
```bash
# Homepage tests only
pnpm test:homepage

# Product page tests only
pnpm test:product

# Cart and checkout tests only
pnpm test:cart
```

### Mobile Tests
```bash
# Run mobile tests only
pnpm test:mobile
```

### Debug Mode
```bash
# Debug tests step by step
pnpm test:debug
```

### View Test Report
```bash
# Open HTML report
pnpm test:report
```

## Test Structure

```
tests/
├── e2e/
│   ├── fixtures/
│   │   └── test-fixtures.ts    # Custom test fixtures
│   ├── pages/
│   │   ├── home.page.ts        # Homepage page object
│   │   ├── product.page.ts     # Product page object
│   │   └── cart.page.ts        # Cart & checkout page object
│   ├── homepage.spec.ts        # Homepage tests
│   ├── product.spec.ts         # Product detail tests
│   └── cart.spec.ts            # Cart & checkout tests
└── playwright.config.ts        # Playwright configuration
```

## Test Coverage

### Homepage Tests
- ✅ Page load and structure
- ✅ Hero section display
- ✅ Navigation functionality
- ✅ Header components (cart, search)
- ✅ Mobile navigation
- ✅ Product grid display
- ✅ Category navigation
- ✅ Newsletter subscription
- ✅ Theme and styling
- ✅ Performance metrics

### Product Page Tests
- ✅ Product display (title, price, images)
- ✅ Product gallery with thumbnails
- ✅ Image zoom functionality
- ✅ Add to cart functionality
- ✅ Quantity selection
- ✅ Product variations
- ✅ Product tabs (description, reviews, specs)
- ✅ Wishlist functionality
- ✅ Share functionality
- ✅ Related products
- ✅ Breadcrumb navigation
- ✅ Mobile sticky add to cart
- ✅ SEO and meta tags

### Cart & Checkout Tests
- ✅ Cart panel open/close
- ✅ Empty cart state
- ✅ Add to cart from PDP
- ✅ Cart item management (quantity, remove)
- ✅ Cart summary (subtotal, total, shipping)
- ✅ Navigate to checkout
- ✅ Checkout page validation
- ✅ Contact information form
- ✅ Shipping address form
- ✅ Payment options
- ✅ Order placement
- ✅ Full purchase flow

## Writing New Tests

### Using Page Objects
```typescript
import { test, expect } from '../fixtures/test-fixtures';
import { HomePage } from '../pages/home.page';

test('my test', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.goto();
  await homePage.verifyPageLoaded();
});
```

### Mobile Testing
```typescript
test.describe('Mobile tests', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('mobile specific test', async ({ page }) => {
    // Test code here
  });
});
```

## Configuration

The test configuration is in `playwright.config.ts`:

- **Base URL**: `http://localhost:3000`
- **Browsers**: Chromium, Mobile Chrome
- **Retries**: 2 (CI), 0 (local)
- **Workers**: 1 (CI), 4 (local)
- **Screenshots**: On failure
- **Video**: On failure

## CI Integration

For CI pipelines, tests run with:
- Single worker
- 2 retries
- Automatic dev server startup

## Debugging Tips

1. **Use `test:ui`** for interactive debugging
2. **Check screenshots** in `tests/report` for failed tests
3. **Use `page.pause()`** to pause test execution
4. **Check console errors** in test output

## Test Data

Tests use the actual WooCommerce backend. Ensure:
- Products exist in the store
- Products have images
- Some products have variations
- Payment gateways are configured
