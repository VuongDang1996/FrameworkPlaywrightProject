import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

// Product management specific steps
Then('I should be navigated to test cases page successfully', async function (this: CustomWorld) {
  // This would need to check for test cases page elements
  await expect(this.page).toHaveURL(/.*test_cases/);
});

Then('I should be navigated to ALL PRODUCTS page successfully', async function (this: CustomWorld) {
  await expect(this.productsPage.allProductsTitle).toBeVisible();
});

Then('I should see the products list is visible', async function (this: CustomWorld) {
  await expect(this.productsPage.productsList).toBeVisible();
});

When('I click on {string} of first product', async function (this: CustomWorld, action: string) {
  switch (action) {
    case 'View Product':
      await this.productsPage.clickViewProduct(0);
      break;
    default:
      throw new Error(`Unknown action: ${action}`);
  }
});

Then('I should be landed on product detail page', async function (this: CustomWorld) {
  await expect(this.productDetailPage.productName).toBeVisible();
});

Then('I should see product name, category, price, availability, condition, brand', async function (this: CustomWorld) {
  await expect(this.productDetailPage.productName).toBeVisible();
  await expect(this.productDetailPage.productCategory).toBeVisible();
  await expect(this.productDetailPage.productPrice).toBeVisible();
  await expect(this.productDetailPage.productAvailability).toBeVisible();
  await expect(this.productDetailPage.productCondition).toBeVisible();
  await expect(this.productDetailPage.productBrand).toBeVisible();
});

When('I enter product name {string} in search input', async function (this: CustomWorld, productName: string) {
  await this.productsPage.searchProducts(productName);
});

When('I click search button', async function (this: CustomWorld) {
  // The search is already performed in searchProducts method
  // This step is kept for BDD readability
});

Then('I should see all the products related to search are visible', async function (this: CustomWorld) {
  await expect(this.productsPage.searchResults).toBeVisible();
});

When('I hover over first product and click {string}', async function (this: CustomWorld, action: string) {
  switch (action) {
    case 'Add to cart':
      await this.productsPage.hoverAndAddToCart(0);
      break;
    default:
      throw new Error(`Unknown action: ${action}`);
  }
});

When('I hover over second product and click {string}', async function (this: CustomWorld, action: string) {
  switch (action) {
    case 'Add to cart':
      await this.productsPage.hoverAndAddToCart(1);
      break;
    default:
      throw new Error(`Unknown action: ${action}`);
  }
});

Then('I should see both products are added to Cart', async function (this: CustomWorld) {
  await expect(this.cartPage.cartTable).toBeVisible();
  // Verify there are 2 products
  const productRows = this.cartPage.cartItems;
  await expect(productRows).toHaveCount(2);
});

Then('I should see their prices, quantity and total price', async function (this: CustomWorld) {
  await expect(this.cartPage.productPrices).toBeVisible();
  await expect(this.cartPage.productQuantities).toBeVisible();
  await expect(this.cartPage.productTotals).toBeVisible();
});
