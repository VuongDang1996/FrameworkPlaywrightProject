import { type Page, type Locator } from '@playwright/test';
import { BasePage } from '@pages/base/BasePage';

/**
 * Product Detail Page Object
 */
export class AutomationExerciseProductDetailPage extends BasePage {
  readonly productName: Locator;
  readonly productCategory: Locator;
  readonly productPrice: Locator;
  readonly productAvailability: Locator;
  readonly productCondition: Locator;
  readonly productBrand: Locator;
  readonly quantityInput: Locator;
  readonly addToCartButton: Locator;
  readonly writeReviewSection: Locator;
  readonly reviewNameInput: Locator;
  readonly reviewEmailInput: Locator;
  readonly reviewTextarea: Locator;
  readonly reviewSubmitButton: Locator;
  readonly reviewSuccessMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.productName = page.locator('.product-information h2');
    this.productCategory = page.locator('.product-information p:has-text("Category:")');
    this.productPrice = page.locator('.product-information span span');
    this.productAvailability = page.locator('.product-information p:has-text("Availability:")');
    this.productCondition = page.locator('.product-information p:has-text("Condition:")');
    this.productBrand = page.locator('.product-information p:has-text("Brand:")');
    this.quantityInput = page.locator('#quantity');
    this.addToCartButton = page.locator('.btn.btn-default.cart');
    this.writeReviewSection = page.locator('#reviews');
    this.reviewNameInput = page.locator('#name');
    this.reviewEmailInput = page.locator('#email');
    this.reviewTextarea = page.locator('#review');
    this.reviewSubmitButton = page.locator('#button-review');
    this.reviewSuccessMessage = page.locator('span:has-text("Thank you for your review.")');
  }

  async waitForPageReady(): Promise<void> {
    await super.waitForPageLoad();
    await this.waitForElement(this.productName);
  }

  /**
   * Get product name
   */
  async getProductName(): Promise<string> {
    return await this.productName.textContent() ?? '';
  }

  /**
   * Get product category
   */
  async getProductCategory(): Promise<string> {
    return await this.productCategory.textContent() ?? '';
  }

  /**
   * Get product price
   */
  async getProductPrice(): Promise<string> {
    return await this.productPrice.textContent() ?? '';
  }

  /**
   * Get product availability
   */
  async getProductAvailability(): Promise<string> {
    return await this.productAvailability.textContent() ?? '';
  }

  /**
   * Get product condition
   */
  async getProductCondition(): Promise<string> {
    return await this.productCondition.textContent() ?? '';
  }

  /**
   * Get product brand
   */
  async getProductBrand(): Promise<string> {
    return await this.productBrand.textContent() ?? '';
  }

  /**
   * Set product quantity
   */
  async setQuantity(quantity: number): Promise<void> {
    await this.quantityInput.clear();
    await this.quantityInput.fill(quantity.toString());
  }

  /**
   * Add product to cart
   */
  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }

  /**
   * Check if Write Your Review section is visible
   */
  async isWriteReviewVisible(): Promise<boolean> {
    return await this.writeReviewSection.isVisible();
  }

  /**
   * Write a product review
   */
  async writeReview(reviewData: {
    name: string;
    email: string;
    review: string;
  }): Promise<void> {
    await this.reviewNameInput.fill(reviewData.name);
    await this.reviewEmailInput.fill(reviewData.email);
    await this.reviewTextarea.fill(reviewData.review);
    await this.reviewSubmitButton.click();
  }

  /**
   * Check if review success message is visible
   */
  async isReviewSuccessVisible(): Promise<boolean> {
    return await this.reviewSuccessMessage.isVisible();
  }

  /**
   * Verify all product details are visible
   */
  async areAllDetailsVisible(): Promise<{
    name: boolean;
    category: boolean;
    price: boolean;
    availability: boolean;
    condition: boolean;
    brand: boolean;
  }> {
    return {
      name: await this.productName.isVisible(),
      category: await this.productCategory.isVisible(),
      price: await this.productPrice.isVisible(),
      availability: await this.productAvailability.isVisible(),
      condition: await this.productCondition.isVisible(),
      brand: await this.productBrand.isVisible(),
    };
  }
}
