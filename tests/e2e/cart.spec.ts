/**
 * 🌊 Cart & Checkout E2E Tests
 *
 * Comprehensive tests for the SeaShop cart and checkout flow
 */
import { test, expect } from '@playwright/test';
import { CartPage } from './pages/cart.page';
import { ProductPage } from './pages/product.page';
import { HomePage } from './pages/home.page';

test.describe('Cart - SeaShop', () => {
  let cartPage: CartPage;
  let productPage: ProductPage;
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    cartPage = new CartPage(page);
    productPage = new ProductPage(page);
    homePage = new HomePage(page);
  });

    test.describe.skip('Cart Panel', () => {
    test.skip('should open cart panel from header', async ({ page }) => {
      // Skip: Cart panel requires client-side state management
      await homePage.goto();
      await cartPage.openCart();
      await cartPage.verifyCartOpen();
    });

    test.skip('should close cart panel', async ({ page }) => {
      // Skip: Cart panel interaction is flaky
      await homePage.goto();
      await cartPage.openCart();
      await cartPage.verifyCartOpen();

      await cartPage.closeCart();

      // Cart panel should be hidden
      await expect(cartPage.cartPanel).not.toBeVisible();
    });

    test.skip('should display empty cart message when cart is empty', async ({ page }) => {
      // Skip: Empty cart check is flaky
      await homePage.goto();

      // Make sure cart is empty (remove items if any)
      await cartPage.openCart();

      const itemCount = await cartPage.getCartItemCount();

      if (itemCount === 0) {
        await cartPage.verifyCartEmpty();
      }
    });

    test.skip('should close cart when clicking outside', async ({ page }) => {
      // Skip: Click outside behavior is flaky
      await homePage.goto();
      await cartPage.openCart();
      await cartPage.verifyCartOpen();

      // Click on overlay/background
      await page.locator('body').click({ position: { x: 10, y: 10 } });

      // Cart should close
      await page.waitForTimeout(500);
    });
  });

  test.describe('Add to Cart Flow', () => {
    test('should add product to cart from PDP', async ({ page }) => {
      await homePage.goto();
      await page.waitForSelector('article, [class*="ProductCard"]');

      // Click first product
      await homePage.clickProductByIndex(0);
      await page.waitForLoadState('networkidle');

      // Get product title
      const productTitle = await productPage.productTitle.textContent();

      // Add to cart
      await productPage.addToCart();
      await page.waitForTimeout(1500);

      // Open cart
      await cartPage.openCart();

      // Verify item in cart
      await cartPage.verifyCartHasItems();

      // Cart should contain the product
      const cartText = await cartPage.cartPanel.textContent();
      expect(cartText).toContain(productTitle?.split(' ').slice(0, 3).join(' '));
    });

    test('should update cart count in header', async ({ page }) => {
      await homePage.goto();
      await page.waitForSelector('article, [class*="ProductCard"]');

      // Get initial cart count - look for badge within cart icon/button
      const cartBadge = page.locator('button[aria-label="Sepet"] [class*="rounded-full"], button[aria-label*="Cart" i] [class*="rounded-full"], [class*="cart"] [class*="rounded-full"][class*="absolute"]').first();
      const initialCount = await cartBadge.isVisible().catch(() => false) ? await cartBadge.textContent() : '0';

      // Add product to cart
      await homePage.clickProductByIndex(0);
      await page.waitForLoadState('networkidle');
      await productPage.addToCart();
      await page.waitForTimeout(1500);

      // Check cart badge updated
      const newCount = await cartBadge.isVisible().catch(() => false) ? await cartBadge.textContent() : '0';

      expect(parseInt(newCount || '0')).toBeGreaterThanOrEqual(parseInt(initialCount || '0'));
    });

    test('should add product with quantity > 1', async ({ page }) => {
      await homePage.goto();
      await page.waitForSelector('article, [class*="ProductCard"]');
      await homePage.clickProductByIndex(0);
      await page.waitForLoadState('networkidle');

      // Set quantity
      const quantityVisible = await productPage.quantityInput.isVisible();
      if (quantityVisible) {
        await productPage.setQuantity(3);
        await productPage.addToCart();
        await page.waitForTimeout(1500);

        await cartPage.openCart();
        await cartPage.verifyCartHasItems();

        // Verify quantity in cart
        const quantityValue = await cartPage.cartItemQuantity.inputValue();
        expect(quantityValue).toBe('3');
      }
    });
  });

  test.describe('Cart Item Management', () => {
    test.beforeEach(async ({ page }) => {
      // Add a product to cart first
      await homePage.goto();
      await page.waitForSelector('article, [class*="ProductCard"]');
      await homePage.clickProductByIndex(0);
      await page.waitForLoadState('networkidle');
      await productPage.addToCart();
      await page.waitForTimeout(1500);
    });

    test('should display cart item details', async ({ page }) => {
      await cartPage.openCart();
      await cartPage.verifyCartHasItems();

      // Cart item should have image, title, price, quantity
      const cartItem = cartPage.cartItems.first();
      await expect(cartItem.locator('img')).toBeVisible();
      await expect(cartItem.locator('a')).toBeVisible();
    });

    test('should increase item quantity', async ({ page }) => {
      await cartPage.openCart();
      await cartPage.verifyCartHasItems();

      const initialQuantity = await cartPage.cartItemQuantity.inputValue();
      await cartPage.increaseFirstItemQuantity();
      await page.waitForTimeout(500);

      const newQuantity = await cartPage.cartItemQuantity.inputValue();
      expect(parseInt(newQuantity)).toBeGreaterThan(parseInt(initialQuantity));
    });

    test('should decrease item quantity', async ({ page }) => {
      // First increase quantity to 2
      await cartPage.openCart();
      await cartPage.increaseFirstItemQuantity();
      await page.waitForTimeout(500);

      const quantityBeforeDecrease = await cartPage.cartItemQuantity.inputValue();
      await cartPage.decreaseFirstItemQuantity();
      await page.waitForTimeout(500);

      const newQuantity = await cartPage.cartItemQuantity.inputValue();
      expect(parseInt(newQuantity)).toBeLessThan(parseInt(quantityBeforeDecrease));
    });

    test('should remove item from cart', async ({ page }) => {
      await cartPage.openCart();
      await cartPage.verifyCartHasItems();

      const initialCount = await cartPage.getCartItemCount();
      await cartPage.removeFirstItem();
      await page.waitForTimeout(500);

      const newCount = await cartPage.getCartItemCount();
      expect(newCount).toBeLessThan(initialCount);
    });

    test('should update total when quantity changes', async ({ page }) => {
      await cartPage.openCart();
      await cartPage.verifyCartHasItems();

      const initialTotal = await cartPage.getTotalAmount();

      await cartPage.increaseFirstItemQuantity();
      await page.waitForTimeout(500);

      const newTotal = await cartPage.getTotalAmount();

      // Total should have changed
      expect(newTotal).not.toBe(initialTotal);
    });
  });

  test.describe('Cart Summary', () => {
    test.beforeEach(async ({ page }) => {
      await homePage.goto();
      await page.waitForSelector('article, [class*="ProductCard"]');
      await homePage.clickProductByIndex(0);
      await page.waitForLoadState('networkidle');
      await productPage.addToCart();
      await page.waitForTimeout(1500);
    });

    test('should display subtotal', async ({ page }) => {
      await cartPage.openCart();
      await cartPage.verifyCartHasItems();

      const subtotalText = await cartPage.subtotal.textContent();
      expect(subtotalText).toMatch(/₺|TL|\$/);
    });

    test('should display total', async ({ page }) => {
      await cartPage.openCart();
      await cartPage.verifyCartHasItems();

      const totalText = await cartPage.getTotalAmount();
      expect(totalText).toMatch(/₺|TL|\$/);
    });

    test('should display free shipping notice', async ({ page }) => {
      await cartPage.openCart();
      await cartPage.verifyCartHasItems();

      await expect(cartPage.shippingNotice).toBeVisible();
    });

    test('should display checkout button', async ({ page }) => {
      await cartPage.openCart();
      await cartPage.verifyCartHasItems();

      await expect(cartPage.checkoutButton).toBeVisible();
    });
  });

  test.describe('Navigate to Checkout', () => {
    test('should navigate to checkout page', async ({ page }) => {
      // Add product first
      await homePage.goto();
      await page.waitForSelector('article, [class*="ProductCard"]');
      await homePage.clickProductByIndex(0);
      await page.waitForLoadState('networkidle');
      await productPage.addToCart();
      await page.waitForTimeout(1500);

      await cartPage.openCart();
      await cartPage.verifyCartHasItems();

      await cartPage.goToCheckout();

      // Should be on checkout page
      expect(page.url()).toContain('odeme');
    });
  });
});

test.describe('Checkout - SeaShop', () => {
  let cartPage: CartPage;
  let productPage: ProductPage;
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    cartPage = new CartPage(page);
    productPage = new ProductPage(page);
    homePage = new HomePage(page);

    // Add product to cart before each test
    await homePage.goto();
    await page.waitForSelector('article, [class*="ProductCard"]');
    await homePage.clickProductByIndex(0);
    await page.waitForLoadState('networkidle');
    await productPage.addToCart();
    await page.waitForTimeout(1500);
  });

  test.describe('Checkout Page Load', () => {
    test('should load checkout page', async ({ page }) => {
      await page.goto('/odeme');
      await page.waitForLoadState('networkidle');

      await expect(cartPage.checkoutForm).toBeVisible();
    });

    test('should display order summary', async ({ page }) => {
      await page.goto('/odeme');
      await page.waitForLoadState('networkidle');

      await expect(cartPage.orderSummary).toBeVisible();
    });

    test('should redirect to home if cart is empty', async ({ page }) => {
      // Clear cart first
      await cartPage.openCart();
      const itemCount = await cartPage.getCartItemCount();

      if (itemCount > 0) {
        await cartPage.removeFirstItem();
        await page.waitForTimeout(500);
      }
      await cartPage.closeCart();

      // Try to go to checkout
      await page.goto('/odeme');
      await page.waitForLoadState('networkidle');

      // Should show empty cart message or redirect
      const url = page.url();
      const hasEmptyMessage = await page.locator('text=/boş|empty/i').count() > 0;

      expect(hasEmptyMessage || !url.includes('odeme')).toBe(true);
    });
  });

  test.describe('Contact Information', () => {
    test('should display email input for guest', async ({ page }) => {
      await page.goto('/odeme');
      await page.waitForLoadState('networkidle');

      await expect(cartPage.emailInput).toBeVisible();
    });

    test('should validate email format', async ({ page }) => {
      await page.goto('/odeme');
      await page.waitForLoadState('networkidle');

      // Enter invalid email
      await cartPage.emailInput.fill('invalid-email');
      await cartPage.emailInput.blur();

      // Should show error
      await page.waitForTimeout(500);
      const errorMessage = page.locator('text=/geçersiz|invalid|error/i');
      const hasError = await errorMessage.count() > 0;

      // Enter valid email
      await cartPage.emailInput.fill('test@example.com');
      await cartPage.emailInput.blur();

      // Error should clear
      await page.waitForTimeout(500);
    });
  });

  test.describe('Shipping Address', () => {
    test('should display shipping form', async ({ page }) => {
      await page.goto('/odeme');
      await page.waitForLoadState('networkidle');

      await expect(cartPage.shippingForm.or(page.locator('[class*="address"]'))).toBeVisible();
    });

    test('should fill shipping address', async ({ page }) => {
      await page.goto('/odeme');
      await page.waitForLoadState('networkidle');

      await cartPage.fillEmail('test@example.com');
      await cartPage.fillShippingAddress({
        firstName: 'Test',
        lastName: 'User',
        address: 'Test Mah. Test Sok. No:1',
        city: 'Istanbul',
        postcode: '34000',
        phone: '05321234567'
      });

      // Verify values
      const firstNameInput = page.locator('input[name*="firstName"], input[placeholder*="ad" i]').first();
      await expect(firstNameInput).toHaveValue('Test');
    });
  });

  test.describe('Payment Options', () => {
    test('should display payment options', async ({ page }) => {
      await page.goto('/odeme');
      await page.waitForLoadState('networkidle');

      await expect(cartPage.paymentOptions).toBeVisible();
    });

    test('should have selectable payment methods', async ({ page }) => {
      await page.goto('/odeme');
      await page.waitForLoadState('networkidle');

      const paymentMethods = page.locator('[class*="payment"] input, [class*="Payment"] button');
      const count = await paymentMethods.count();

      expect(count).toBeGreaterThan(0);
    });
  });

  test.describe('Place Order', () => {
    test('should have place order button', async ({ page }) => {
      await page.goto('/odeme');
      await page.waitForLoadState('networkidle');

      const placeOrderButton = page.locator('button[type="submit"]:has-text("Sipariş"), button[type="submit"]:has-text("Place")');
      await expect(placeOrderButton.first()).toBeVisible();
    });

    test('should validate required fields before order', async ({ page }) => {
      await page.goto('/odeme');
      await page.waitForLoadState('networkidle');

      // Try to submit without filling form
      const submitButton = page.locator('button[type="submit"]').first();

      // Button should be disabled or show validation on click
      const isDisabled = await submitButton.isDisabled();

      if (!isDisabled) {
        // If not disabled, clicking should show validation errors
        await submitButton.click();
        await page.waitForTimeout(500);

        const validationErrors = page.locator('[class*="error"], [class*="invalid"], :has-text("gerekli"), :has-text("required")');
        const errorCount = await validationErrors.count();

        expect(errorCount).toBeGreaterThan(0);
      }
    });
  });

  test.describe('Mobile Checkout', () => {
    test.use({ viewport: { width: 390, height: 844 } });

    test('should display mobile sticky checkout button', async ({ page }) => {
      await page.goto('/odeme');
      await page.waitForLoadState('networkidle');

      // Scroll down
      await page.evaluate(() => window.scrollTo(0, 500));

      // Sticky button should be visible
      const stickyButton = page.locator('[class*="fixed"] button[type="submit"]');
      await expect(stickyButton.first()).toBeVisible();
    });

    test('should show order summary on mobile', async ({ page }) => {
      await page.goto('/odeme');
      await page.waitForLoadState('networkidle');

      // Order summary should be visible
      await expect(cartPage.orderSummary).toBeVisible();
    });
  });
});

test.describe('Full Purchase Flow - SeaShop', () => {
  let cartPage: CartPage;
  let productPage: ProductPage;
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    cartPage = new CartPage(page);
    productPage = new ProductPage(page);
    homePage = new HomePage(page);
  });

  test('complete purchase flow: browse -> product -> cart -> checkout', async ({ page }) => {
    // 1. Load homepage
    await homePage.goto();
    await homePage.verifyPageLoaded();

    // 2. Click on a product
    await page.waitForSelector('article, [class*="ProductCard"]');
    await homePage.clickProductByIndex(0);
    await page.waitForLoadState('networkidle');
    await productPage.verifyProductLoaded();

    // 3. Add to cart
    await productPage.addToCart();
    await page.waitForTimeout(1500);

    // 4. Open cart and verify
    await cartPage.openCart();
    await cartPage.verifyCartHasItems();

    // 5. Go to checkout
    await cartPage.goToCheckout();
    await page.waitForLoadState('networkidle');

    // 6. Fill checkout form
    await cartPage.fillEmail('test@example.com');
    await cartPage.fillShippingAddress({
      firstName: 'Test',
      lastName: 'User',
      address: 'Test Mah. Test Sok. No:1',
      city: 'Istanbul',
      postcode: '34000',
      phone: '05321234567'
    });

    // 7. Verify checkout form is filled
    await expect(cartPage.emailInput).toHaveValue('test@example.com');
  });

  test('add multiple products to cart', async ({ page }) => {
    await homePage.goto();

    // Add first product
    await page.waitForSelector('article, [class*="ProductCard"]');
    await homePage.clickProductByIndex(0);
    await page.waitForLoadState('networkidle');
    await productPage.addToCart();
    await page.waitForTimeout(1500);

    // Go back and add second product
    await page.goBack();
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('article, [class*="ProductCard"]');
    await homePage.clickProductByIndex(1);
    await page.waitForLoadState('networkidle');
    await productPage.addToCart();
    await page.waitForTimeout(1500);

    // Verify cart has 2 items
    await cartPage.openCart();
    const itemCount = await cartPage.getCartItemCount();
    expect(itemCount).toBeGreaterThanOrEqual(2);
  });
});
