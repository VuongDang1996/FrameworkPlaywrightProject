import { type Page, type Locator } from '@playwright/test';
import { BasePage } from '@pages/base/BasePage';

/**
 * Products Page Object
 */
export class AutomationExerciseProductsPage extends BasePage {
  readonly allProductsTitle: Locator;
  readonly productsList: Locator;
  readonly viewProductLinks: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly searchedProductsTitle: Locator;
  readonly searchResults: Locator;
  readonly addToCartButtons: Locator;
  readonly continueShoppingButton: Locator;
  readonly viewCartButton: Locator;
  readonly categorySection: Locator;
  readonly brandsSection: Locator;

  constructor(page: Page) {
    super(page);
    this.allProductsTitle = page.locator('h2:has-text("All Products")');
    this.productsList = page.locator('.features_items');
    this.viewProductLinks = page.locator('a:has-text("View Product")');
    this.searchInput = page.locator('#search_product');
    this.searchButton = page.locator('#submit_search');
    this.searchedProductsTitle = page.locator('h2:has-text("Searched Products")');
    this.searchResults = page.locator('.features_items .product-image-wrapper');
    this.addToCartButtons = page.locator('.btn.btn-default.add-to-cart');
    this.continueShoppingButton = page.locator('button:has-text("Continue Shopping")');
    this.viewCartButton = page.locator('a:has-text("View Cart")');
    this.categorySection = page.locator('.category-tab');
    this.brandsSection = page.locator('.brands_products');
  }

  async waitForPageReady(): Promise<void> {
    await super.waitForPageLoad();
    await this.waitForElement(this.allProductsTitle);
  }

  /**
   * Check if All Products title is visible
   */
  async isAllProductsTitleVisible(): Promise<boolean> {
    return await this.allProductsTitle.isVisible();
  }

  /**
   * Check if products list is visible
   */
  async isProductsListVisible(): Promise<boolean> {
    return await this.productsList.isVisible();
  }

  /**
   * Click on View Product for specific product
   */
  async clickViewProduct(index: number = 0): Promise<void> {
    await this.viewProductLinks.nth(index).click();
  }

  /**
   * Search for products
   */
  async searchProducts(searchTerm: string): Promise<void> {
    await this.searchInput.fill(searchTerm);
    await this.searchButton.click();
  }

  /**
   * Check if Searched Products title is visible
   */
  async isSearchedProductsTitleVisible(): Promise<boolean> {
    return await this.searchedProductsTitle.isVisible();
  }

  /**
   * Check if search results are visible
   */
  async areSearchResultsVisible(): Promise<boolean> {
    return await this.searchResults.first().isVisible();
  }

  /**
   * Get number of search results
   */
  async getSearchResultsCount(): Promise<number> {
    return await this.searchResults.count();
  }

  /**
   * Hover over product and add to cart
   */
  async hoverAndAddToCart(productIndex: number): Promise<void> {
    const product = this.productsList.locator('.product-image-wrapper').nth(productIndex);
    await product.hover();
    // Use the overlay add to cart button that appears on hover
    await product.locator('.overlay-content .add-to-cart').click();
  }

  /**
   * Click Continue Shopping
   */
  async clickContinueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }

  /**
   * Click View Cart
   */
  async clickViewCart(): Promise<void> {
    await this.viewCartButton.click();
  }

  /**
   * Add all search results to cart
   */
  async addSearchResultsToCart(productCount?: number): Promise<void> {
    const count = productCount || await this.getSearchResultsCount();
    for (let i = 0; i < count; i++) {
      try {
        await this.searchResults.nth(i).hover();
        await this.page.waitForTimeout(500); // Wait for hover effect
        await this.searchResults.nth(i).locator('.overlay-content .add-to-cart').click({ timeout: 10000 });
        await this.clickContinueShopping();
        await this.page.waitForTimeout(1000); // Wait between cart additions
      } catch (error) {
        console.log(`Failed to add product ${i} to cart, continuing...`);
        // Continue with next product if this one fails
        continue;
      }
    }
  }
}
