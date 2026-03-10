/**
 * 🌊 HomePage Page Object
 *
 * Encapsulates homepage elements and actions
 */
import { Locator, Page, expect } from '@playwright/test';

export class HomePage {
  readonly page: Page;

  // Navigation
  readonly header: Locator;
  readonly logo: Locator;
  readonly navLinks: Locator;
  readonly cartButton: Locator;
  readonly searchInput: Locator;
  readonly mobileMenuButton: Locator;

  // Hero Section
  readonly heroSection: Locator;
  readonly heroTitle: Locator;
  readonly heroCtaButton: Locator;

  // Categories
  readonly categoriesSection: Locator;
  readonly categoryCards: Locator;

  // Products
  readonly productGrid: Locator;
  readonly productCards: Locator;

  // Newsletter
  readonly newsletterSection: Locator;
  readonly newsletterInput: Locator;
  readonly newsletterButton: Locator;

  // Footer
  readonly footer: Locator;
  readonly footerLinks: Locator;

  constructor(page: Page) {
    this.page = page;

    // Navigation
    this.header = page.locator('header, [role="banner"]').first();
    this.logo = this.header.locator('a[href="/"], a[href="/"] img, img[alt*="logo" i]').first();
    this.navLinks = this.header.locator('nav a');
    this.cartButton = page
      .locator('[aria-label*="Sepet" i], [aria-label*="Cart" i], [title="Cart"], button:has([class*="ShoppingCart"]), [class*="ion:cart"], [class*="cart-outline"]')
      .or(page.locator('svg[class*="cart"], [data-icon*="cart"]').locator('xpath=ancestor::*[self::button or self::div][1]'))
      .first();
    this.searchInput = page.locator('input[type="search"], input[placeholder*="ara" i]').first();
    this.mobileMenuButton = page.locator('[class*="ion:menu"], [class*="menu-outline"], button[aria-label*="Menü"], button[aria-label*="Menüyü aç"], button[aria-label*="menu" i]').first();

    // Hero
    this.heroSection = page.locator('section, [class*="hero" i], [class*="banner" i]').first();
    this.heroTitle = page.locator('h1, section h2, [class*="hero" i] h2').first();
    this.heroCtaButton = page.getByRole('link', { name: /alışveriş|shop|ürün|gör/i });

    // Categories
    this.categoriesSection = page.locator('section:has(h2:has-text("Kategori")), section:has(h2:has-text("Categories"))');
    this.categoryCards = this.categoriesSection.locator('a[href*="/urun-kategorisi"], a[href*="/category"]');

    // Products
    this.productGrid = page.locator('[class*="grid" i], section').filter({ has: page.locator('article, [class*="product" i], a[href*="/urun/"]') });
    this.productCards = page.locator('article, [class*="product" i], a[href*="/urun/"]');

    // Newsletter
    this.newsletterSection = page.locator('section:has(input[type="email"]), form:has(input[type="email"])');
    this.newsletterInput = this.newsletterSection.locator('input[type="email"]');
    this.newsletterButton = this.newsletterSection.locator('button:has-text("Abone"), button:has-text("Subscribe")');

    // Footer
    this.footer = page.locator('footer');
    this.footerLinks = this.footer.locator('a');
  }

  async goto() {
    await this.page.goto('/', { waitUntil: 'domcontentloaded' });
    // Wait for any element to be visible on the page
    await this.page.locator('body').waitFor({ state: 'attached', timeout: 15000 });
    // Give the page a moment to hydrate
    await this.page.waitForTimeout(1000);
  }

  async clickNavLink(name: string) {
    await this.navLinks.filter({ hasText: name }).click();
  }

  async openCart() {
    await this.cartButton.click();
    await this.page.waitForSelector('[class*="cart" i], [class*="sheet" i], [role="dialog"], a[href*="/odeme"]', { state: 'visible' });
  }

  async openMobileMenu() {
    await this.mobileMenuButton.click();
    // Wait for mobile menu to appear (it's a fixed panel on the left)
    await this.page.waitForSelector('.fixed.top-0.left-0, [class*="MobileMenu"], nav:visible', { state: 'visible', timeout: 5000 });
  }

  async searchFor(query: string) {
    await this.searchInput.fill(query);
    await this.searchInput.press('Enter');
  }

  async clickProductByIndex(index: number) {
    const product = this.productCards.nth(index);
    const productLink = product.locator('a[href*="/urun/"], a[href*="/product/"]').first();
    if (await productLink.count()) {
      await productLink.click();
      return;
    }
    if (await product.getAttribute('href')) {
      await product.click();
      return;
    }
    await this.page.locator('a[href*="/urun/"], a[href*="/product/"]').nth(index).click();
  }

  async subscribeNewsletter(email: string) {
    await this.newsletterInput.fill(email);
    await this.newsletterButton.click();
  }

  async verifyPageLoaded() {
    await expect(this.header).toBeVisible();
    await expect(this.heroTitle).toBeVisible();
  }
}
