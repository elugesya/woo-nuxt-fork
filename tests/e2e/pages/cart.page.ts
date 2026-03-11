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

    // Cart Panel - look for any visible div containing "Sepetim" h2
    // The cart panel is rendered with v-if="isShowingCart" so it appears when cart is open
    this.cartPanel = page.locator('div:has(h2:has-text("Sepetim")), div:has(h2:has-text("Cart"))').first();
    this.cartHeader = this.cartPanel.locator('div.bg-gradient-ocean, .bg-gradient-ocean, header, [class*="header"], .bg-gradient').first();
    this.cartTitle = this.cartPanel.locator('h2').filter({ hasText: /Sepetim|Cart|My Cart/i }).first();
    this.closeButton = this.cartPanel.locator('button[aria-label="Kapat"], button[aria-label*="Close"], button[aria-label*="close" i], button:has([class*="X"])').first();

    // Cart Items - items are in a <ul> with CartCard components (li elements)
    this.cartItems = this.cartPanel.locator('ul > li, [class*="CartCard"], [class*="cart-item"], li').filter({
      has: page.locator('a[href*="/urun/"], a[href*="/product/"], img, [class*="product"]')
    });
    this.emptyCartMessage = page.locator('text=/sepet.*boş|cart.*empty|Sepetiniz Boş|Henüz ürün/i');

    // Cart Item Actions
    this.cartItemRemove = this.cartItems.locator('button[aria-label*="sil"], button[aria-label*="remove"], button[aria-label*="Kaldir"], button:has(svg)').first();
    this.cartItemQuantity = this.cartItems.locator('input[type="number"]').first();
    this.cartItemIncrease = this.cartItems.locator('button:has-text("+")').first();
    this.cartItemDecrease = this.cartItems.locator('button:has-text("-")').first();

    // Summary - matches actual Cart.vue implementation
    // Subtotal: "Ara Toplam" with span containing v-html="cart.subtotal"
    this.subtotal = this.cartPanel.locator('.flex.items-center.justify-between').filter({ hasText: /Ara Toplam|Subtotal/i }).locator('span').last();
    this.shippingNotice = this.cartPanel.locator('text=/ücretsiz kargo|free shipping|500₺/i');
    this.total = this.cartPanel.locator('.flex.items-center.justify-between .text-xl, .font-bold.text-primary').filter({ hasText: /Toplam|Total|₺|TL|\$/i }).first();
    this.checkoutButton = this.cartPanel.locator('a[href*="/odeme"], a[href*="/checkout"], button:has-text("Ödemeye"), button:has-text("Checkout"), button:has-text("Ödeme")').first();
    this.continueShoppingButton = this.cartPanel.locator('button:has-text("Devam"), a:has-text("ürün"), button:has-text("Alışveriş"), button:has-text("Ürünleri Keşfet")');

    // Checkout Page (/odeme)
    this.checkoutForm = page.locator('form');
    this.emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email"]').first();
    this.shippingForm = page.locator('[class*="shipping"], [class*="address"], [class*="teslimat"]').first();
    this.paymentOptions = page.locator('[class*="payment"], [class*="Payment"], [class*="ödeme"]');
    this.placeOrderButton = page.locator('button[type="submit"]:has-text("Sipariş"), button[type="submit"]:has-text("Place"), button:has-text("Sipariş")');
    this.orderSummary = page.locator('[class*="order-summary"], [class*="OrderSummary"], [class*="sipariş"]');
  }

  async openCart() {
    // First check if cart is already open
    const cartAlreadyOpen = await this.page.locator('h2:has-text("Sepetim"), h2:has-text("Cart")').isVisible().catch(() => false);

    if (!cartAlreadyOpen) {
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

      // Wait for Vue reactivity and transition to complete
      // The cart uses <Transition name="slide-from-right"> which takes 300ms
      await this.page.waitForTimeout(500);
    }

    // Wait for cart panel to appear - look for "Sepetim" text in a visible element
    // The cart panel has h2 with "Sepetim" text
    await this.page.waitForSelector('h2:has-text("Sepetim"), h2:has-text("Cart"), h2:has-text("My Cart")', {
      state: 'visible',
      timeout: 10000
    });

    // Also verify the cart panel is visible
    await this.cartPanel.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {
      // If cartPanel selector fails, we still have verified "Sepetim" is visible
    });
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
