/**
 * 🌊 CartPage Page Object
 *
 * Encapsulates cart slide-out and cart page elements and actions
 */
import { Locator, Page, expect } from '@playwright/test';

export class CartPage {
  readonly page: Page;

  // Cart Panel
  readonly cartPanel: Locator;
  readonly cartHeader: Locator;
  readonly cartTitle: Locator;
  readonly closeButton: Locator;

  // Cart Items
  readonly cartItems: Locator;
  readonly emptyCartMessage: Locator;

  // Cart Item Actions
  readonly cartItemRemove: Locator;
  readonly cartItemQuantity: Locator;
  readonly cartItemIncrease: Locator;
  readonly cartItemDecrease: Locator;

  // Summary
  readonly subtotal: Locator;
  readonly shippingNotice: Locator;
  readonly total: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  // Checkout Page
  readonly checkoutForm: Locator;
  readonly emailInput: Locator;
  readonly shippingForm: Locator;
  readonly paymentOptions: Locator;
  readonly placeOrderButton: Locator;
  readonly orderSummary: Locator;

  constructor(page: Page) {
    this.page = page;

    // Cart Panel - matches the actual Cart.vue component structure
    // The cart panel is a fixed div on the right side
    this.cartPanel = page.locator('div.fixed.top-0.right-0, div[class*="fixed"][class*="right-0"], [class*="z-50"]').filter({
      has: page.locator('text=/Sepetim|Cart/i')
    }).first();
    this.cartHeader = this.cartPanel.locator('div.bg-gradient-ocean, header, [class*="header"]').first();
    this.cartTitle = this.cartPanel.locator('h2:has-text("Sepetim"), h2:has-text("Cart"), text=/sepet|cart/i').first();
    this.closeButton = this.cartPanel.locator('button[aria-label="Kapat"], button[aria-label*="Close"], button:has(svg)').first();

    // Cart Items - items are in an <ul> with <li> elements
    this.cartItems = this.cartPanel.locator('ul > li, [class*="CartCard"], [class*="cart-item"]');
    this.emptyCartMessage = page.locator('text=/sepet.*boş|cart.*empty|Sepetiniz boş/i');

    // Cart Item Actions
    this.cartItemRemove = this.cartItems.locator('button[aria-label*="sil"], button[aria-label*="remove"], button[aria-label*="Kaldir"], button:has(svg)').first();
    this.cartItemQuantity = this.cartItems.locator('input[type="number"]').first();
    this.cartItemIncrease = this.cartItems.locator('button:has-text("+")').first();
    this.cartItemDecrease = this.cartItems.locator('button:has-text("-")').first();

    // Summary - matches actual implementation
    this.subtotal = this.cartPanel.locator('text=/Ara Toplam|Subtotal/i').locator('..').locator('span').last();
    this.shippingNotice = this.cartPanel.locator('text=/ücretsiz kargo|free shipping|500₺/i');
    this.total = this.cartPanel.locator('text=/Toplam|Total/i').filter({ hasText: /₺|TL|\$/ }).first();
    this.checkoutButton = this.cartPanel.locator('a[href*="/odeme"], a:has-text("Ödemeye"), a:has-text("Checkout"), button:has-text("Ödeme")').first();
    this.continueShoppingButton = this.cartPanel.locator('button:has-text("Devam"), a:has-text("ürün"), button:has-text("Alışveriş")');

    // Checkout Page (/odeme)
    this.checkoutForm = page.locator('form');
    this.emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email"]').first();
    this.shippingForm = page.locator('[class*="shipping"], [class*="address"], [class*="teslimat"]').first();
    this.paymentOptions = page.locator('[class*="payment"], [class*="Payment"], [class*="ödeme"]');
    this.placeOrderButton = page.locator('button[type="submit"]:has-text("Sipariş"), button[type="submit"]:has-text("Place"), button:has-text("Sipariş")');
    this.orderSummary = page.locator('[class*="order-summary"], [class*="OrderSummary"], [class*="sipariş"]');
  }

  async openCart() {
    // Click cart icon in header - matches actual implementation
    const candidates = [
      '[aria-label="Sepet"]',
      '[aria-label*="Cart" i]',
      'button:has([class*="shopping-cart"])',
      'button:has(svg[class*="ShoppingCart"])',
    ];

    let clicked = false;
    for (const selector of candidates) {
      const target = this.page.locator(selector).first();
      if (await target.isVisible().catch(() => false)) {
        await target.click();
        clicked = true;
        break;
      }
    }

    if (!clicked) {
      throw new Error('No visible cart trigger found');
    }

    await this.page.waitForTimeout(500);
    // Wait for cart panel to appear - it has gradient-ocean header
    await this.page.waitForSelector('text=/Sepetim|Cart/i, div.fixed.right-0', { timeout: 10000 });
  }

  async closeCart() {
    await this.closeButton.click();
    await this.page.waitForTimeout(300);
  }

  async removeFirstItem() {
    await this.cartItemRemove.click();
    await this.page.waitForTimeout(500);
  }

  async updateFirstItemQuantity(quantity: number) {
    await this.cartItemQuantity.fill(quantity.toString());
    await this.page.waitForTimeout(500);
  }

  async increaseFirstItemQuantity() {
    await this.cartItemIncrease.click();
    await this.page.waitForTimeout(300);
  }

  async decreaseFirstItemQuantity() {
    await this.cartItemDecrease.click();
    await this.page.waitForTimeout(300);
  }

  async goToCheckout() {
    await this.checkoutButton.click();
    await this.page.waitForURL('**/odeme**');
  }

  async getCartItemCount(): Promise<number> {
    return await this.cartItems.count();
  }

  async getTotalAmount(): Promise<string | null> {
    return await this.total.textContent();
  }

  async verifyCartOpen() {
    const hasPanel = await this.cartPanel.isVisible().catch(() => false);
    const hasCartText = await this.page.locator('text=/sepet|cart/i').count();
    expect(hasPanel || hasCartText > 0).toBe(true);
  }

  async verifyCartHasItems(count?: number) {
    const itemCount = await this.getCartItemCount();
    if (count !== undefined) {
      expect(itemCount).toBe(count);
    } else {
      expect(itemCount).toBeGreaterThan(0);
    }
  }

  async verifyCartEmpty() {
    await expect(this.emptyCartMessage.or(this.cartPanel.locator('text=/boş|empty/i'))).toBeVisible();
  }

  // Checkout methods
  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async fillShippingAddress(data: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postcode: string;
    phone: string;
  }) {
    const form = this.shippingForm;
    await form.locator('input[name*="firstName"], input[placeholder*="ad" i]').first().fill(data.firstName);
    await form.locator('input[name*="lastName"], input[placeholder*="soyad" i]').first().fill(data.lastName);
    await form.locator('input[name*="address"], input[placeholder*="adres" i]').first().fill(data.address);
    await form.locator('input[name*="city"], input[placeholder*="şehir" i]').first().fill(data.city);
    await form.locator('input[name*="postcode"], input[placeholder*="posta" i]').first().fill(data.postcode);
    await form.locator('input[name*="phone"], input[type="tel"]').first().fill(data.phone);
  }

  async selectPaymentMethod(method: string) {
    await this.paymentOptions.locator(`text=/${method}/i`).click();
  }

  async submitOrder() {
    await this.placeOrderButton.click();
  }
}
