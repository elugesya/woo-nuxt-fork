/**
 * 🌊 ProductPage Page Object
 *
 * Encapsulates product detail page elements and actions
 */
import { Locator, Page, expect } from '@playwright/test';

export class ProductPage {
  readonly page: Page;

  // Product Info
  readonly productTitle: Locator;
  readonly productPrice: Locator;
  readonly productDescription: Locator;
  readonly productImages: Locator;
  readonly mainImage: Locator;
  readonly thumbnails: Locator;

  // Variations
  readonly variationSelectors: Locator;
  readonly colorOptions: Locator;
  readonly sizeOptions: Locator;

  // Stock
  readonly stockStatus: Locator;
  readonly addToCartButton: Locator;
  readonly quantityInput: Locator;
  readonly quantityIncrease: Locator;
  readonly quantityDecrease: Locator;

  // Actions
  readonly wishlistButton: Locator;
  readonly shareButton: Locator;

  // Tabs
  readonly tabs: Locator;
  readonly descriptionTab: Locator;
  readonly reviewsTab: Locator;
  readonly specsTab: Locator;

  // Reviews
  readonly reviewsSection: Locator;
  readonly reviewItems: Locator;
  readonly ratingStars: Locator;

  // Related Products
  readonly relatedProducts: Locator;

  // Mobile
  readonly mobileAddToCart: Locator;

  constructor(page: Page) {
    this.page = page;

    // Product Info - using more specific selectors that match actual implementation
    this.productTitle = page.locator('h1');
    // Price is in a flex container with font-semibold class, contains currency symbol
    this.productPrice = page.locator('span:has-text("₺"), span:has-text("TL"), span:has-text("$"), span:has-text("EUR")').first();
    this.productDescription = page.locator('[class*="prose"], [class*="description"], .prose').first();
    // Gallery images - the main image is in a container with rounded-xl class
    this.productImages = page.locator('.gallery-images, [class*="gallery"]').first();
    // Main image - look for the large product image with rounded-xl class
    this.mainImage = page.locator('img.rounded-xl, .rounded-xl.object-contain, img[class*="object-contain"]').first();
    // Thumbnails are small images in the gallery container
    this.thumbnails = page.locator('.gallery-images img, [class*="gallery"] img').filter({ hasNot: page.locator('.rounded-xl') });

    // Variations
    this.variationSelectors = page.locator('[class*="variation"], [class*="attribute"], [class*="Attribute"]');
    this.colorOptions = page.locator('[class*="color"], [class*="Color"] button, [class*="variant"] button');
    this.sizeOptions = page.locator('select, [class*="size"] button');

    // Stock - StockStatus component uses text-green-600, text-red-600, text-yellow-600 classes
    this.stockStatus = page.locator('span.text-green-600, span.text-red-600, span.text-yellow-600, span:has-text("Stokta"), span:has-text("Tükendi"), span:has-text("out of stock")').first();
    // Add to cart button
    this.addToCartButton = page.locator('button:has-text("Sepete Ekle"), button:has-text("Add to Cart"), button:has-text("Ekle")').first();
    // Quantity input - may not exist on all products
    this.quantityInput = page.locator('input[type="number"]').first();
    // Quantity buttons - look for + and - buttons
    this.quantityIncrease = page.locator('button:has-text("+"), button[aria-label*="artır" i], button[aria-label*="increase" i]').first();
    this.quantityDecrease = page.locator('button:has-text("-"):not(:has-text("Sepete")), button[aria-label*="azalt" i], button[aria-label*="decrease" i]').first();

    // Actions
    this.wishlistButton = page.locator('button[aria-label*="favor" i], button[aria-label*="wish" i], button:has([class*="Heart"])').first();
    this.shareButton = page.locator('button[aria-label*="paylaş" i], button[aria-label*="share" i]').first();

    // Tabs
    this.tabs = page.locator('[role="tablist"], [class*="tabs"]');
    this.descriptionTab = page.locator('button:has-text("Açıklama"), button:has-text("Description")');
    this.reviewsTab = page.locator('button:has-text("Değerlendirme"), button:has-text("Reviews")');
    this.specsTab = page.locator('button:has-text("Özellik"), button:has-text("Specs")');

    // Reviews
    this.reviewsSection = page.locator('[class*="review"], [class*="Review"]');
    this.reviewItems = this.reviewsSection.locator('article, [class*="review-item"]');
    this.ratingStars = page.locator('[class*="star"], [class*="Star"], [class*="rating"]').first();

    // Related Products
    this.relatedProducts = page.locator('section:has(h2:has-text("Benzer")), section:has(h2:has-text("Related"))');

    // Mobile
    this.mobileAddToCart = page.locator('[class*="fixed"] button:has-text("Sepete Ekle")');
  }

  async goto(slug: string) {
    await this.page.goto(`/urun/${slug}`);
    await this.page.waitForLoadState('domcontentloaded');
    // Wait for product title to be visible
    await this.productTitle.waitFor({ state: 'visible', timeout: 10000 });
  }

  async setQuantity(quantity: number) {
    // First clear and set the value
    await this.quantityInput.fill(quantity.toString());
  }

  async increaseQuantity() {
    await this.quantityIncrease.click();
  }

  async decreaseQuantity() {
    await this.quantityDecrease.click();
  }

  async selectColor(colorName: string) {
    await this.colorOptions.filter({ hasText: colorName }).click();
  }

  async selectSize(size: string) {
    const sizeOption = this.sizeOptions.locator(`option:has-text("${size}"), button:has-text("${size}")`);
    await sizeOption.click();
  }

  async addToCart() {
    await this.addToCartButton.click();
    // Wait for cart update
    await this.page.waitForTimeout(1000);
  }

  async addToWishlist() {
    await this.wishlistButton.click();
  }

  async openTab(tabName: 'description' | 'reviews' | 'specs') {
    switch (tabName) {
      case 'description':
        await this.descriptionTab.click();
        break;
      case 'reviews':
        await this.reviewsTab.click();
        break;
      case 'specs':
        await this.specsTab.click();
        break;
    }
  }

  async verifyProductLoaded() {
    await expect(this.productTitle).toBeVisible();
    await expect(this.productPrice).toBeVisible();
    await expect(this.addToCartButton).toBeVisible();
  }

  async isInStock(): Promise<boolean> {
    const stockText = await this.stockStatus.textContent();
    return stockText?.toLowerCase().includes('stokta') || stockText?.toLowerCase().includes('in stock') || false;
  }
}
