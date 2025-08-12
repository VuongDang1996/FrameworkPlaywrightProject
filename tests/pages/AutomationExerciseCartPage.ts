import { type Page, type Locator } from '@playwright/test';
import { BasePage } from '@pages/base/BasePage';

/**
 * Cart Page Object
 */
export class AutomationExerciseCartPage extends BasePage {
  readonly cartTable: Locator;
  readonly cartItems: Locator;
  readonly productNames: Locator;
  readonly productPrices: Locator;
  readonly productQuantities: Locator;
  readonly productTotals: Locator;
  readonly removeButtons: Locator;
  readonly proceedToCheckoutButton: Locator;
  readonly registerLoginButton: Locator;
  readonly subscriptionSection: Locator;
  readonly subscriptionTitle: Locator;
  readonly subscriptionEmailInput: Locator;
  readonly subscriptionSubmitButton: Locator;
  readonly subscriptionSuccessMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.cartTable = page.locator('#cart_info_table');
    this.cartItems = page.locator('tbody tr');
    this.productNames = page.locator('.cart_description h4 a');
    this.productPrices = page.locator('.cart_price p');
    this.productQuantities = page.locator('.cart_quantity button');
    this.productTotals = page.locator('.cart_total_price');
    this.removeButtons = page.locator('.cart_quantity_delete');
    this.proceedToCheckoutButton = page.locator('a:has-text("Proceed To Checkout")');
    this.registerLoginButton = page.locator('u:has-text("Register / Login")');
    this.subscriptionSection = page.locator('#footer');
    this.subscriptionTitle = page.locator('h2:has-text("Subscription")');
    this.subscriptionEmailInput = page.locator('#susbscribe_email');
    this.subscriptionSubmitButton = page.locator('#subscribe');
    this.subscriptionSuccessMessage = page.locator('.alert-success');
  }

  async waitForPageReady(): Promise<void> {
    await super.waitForPageLoad();
    await this.waitForElement(this.cartTable);
  }

  /**
   * Check if cart page is displayed
   */
  async isCartPageDisplayed(): Promise<boolean> {
    return await this.cartTable.isVisible();
  }

  /**
   * Get number of items in cart
   */
  async getCartItemsCount(): Promise<number> {
    return await this.cartItems.count();
  }

  /**
   * Get product names in cart
   */
  async getProductNames(): Promise<string[]> {
    const names: string[] = [];
    const count = await this.productNames.count();
    
    for (let i = 0; i < count; i++) {
      const name = await this.productNames.nth(i).textContent();
      if (name) names.push(name);
    }
    
    return names;
  }

  /**
   * Get product prices in cart
   */
  async getProductPrices(): Promise<string[]> {
    const prices: string[] = [];
    const count = await this.productPrices.count();
    
    for (let i = 0; i < count; i++) {
      const price = await this.productPrices.nth(i).textContent();
      if (price) prices.push(price);
    }
    
    return prices;
  }

  /**
   * Get product quantities in cart
   */
  async getProductQuantities(): Promise<number[]> {
    const quantities: number[] = [];
    const count = await this.productQuantities.count();
    
    for (let i = 0; i < count; i++) {
      const quantity = await this.productQuantities.nth(i).textContent();
      if (quantity) quantities.push(parseInt(quantity));
    }
    
    return quantities;
  }

  /**
   * Get product total prices in cart
   */
  async getProductTotals(): Promise<string[]> {
    const totals: string[] = [];
    const count = await this.productTotals.count();
    
    for (let i = 0; i < count; i++) {
      const total = await this.productTotals.nth(i).textContent();
      if (total) totals.push(total);
    }
    
    return totals;
  }

  /**
   * Remove product from cart
   */
  async removeProduct(index: number): Promise<void> {
    const initialCount = await this.getCartItemsCount();
    await this.removeButtons.nth(index).click();
    
    // Wait for the product to be removed
    await this.page.waitForFunction(
      (expectedCount) => {
        const rows = document.querySelectorAll('tbody tr');
        return rows.length === expectedCount;
      },
      initialCount - 1,
      { timeout: 5000 }
    );
  }

  /**
   * Verify specific product is in cart
   */
  async isProductInCart(productName: string): Promise<boolean> {
    const names = await this.getProductNames();
    return names.some(name => name.includes(productName));
  }

  /**
   * Verify product quantity in cart
   */
  async verifyProductQuantity(productIndex: number, expectedQuantity: number): Promise<boolean> {
    const quantities = await this.getProductQuantities();
    return quantities[productIndex] === expectedQuantity;
  }

  /**
   * Click Proceed to Checkout
   */
  async clickProceedToCheckout(): Promise<void> {
    await this.proceedToCheckoutButton.click();
  }

  /**
   * Click Register/Login button (appears when not logged in)
   */
  async clickRegisterLogin(): Promise<void> {
    await this.registerLoginButton.click();
  }

  /**
   * Subscribe to newsletter from cart page
   */
  async subscribeToNewsletter(email: string): Promise<void> {
    await this.subscriptionSection.scrollIntoViewIfNeeded();
    await this.subscriptionEmailInput.fill(email);
    await this.subscriptionSubmitButton.click();
  }

  /**
   * Check if subscription success message is visible
   */
  async isSubscriptionSuccessVisible(): Promise<boolean> {
    return await this.subscriptionSuccessMessage.isVisible();
  }

  /**
   * Check if subscription section is visible
   */
  async isSubscriptionSectionVisible(): Promise<boolean> {
    return await this.subscriptionTitle.isVisible();
  }
}
