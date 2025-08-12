import { test } from '@fixtures/automation-exercise-fixtures';
import { expect } from '@playwright/test';
import { AllureHelpers, AutomationExerciseTestData } from '@utils/allure-helpers';

test.describe('TC13 - Verify Product Quantity in Cart', () => {
  test('TC13 - Verify Product Quantity in Cart @regression', async ({ 
    homePage, 
    productDetailPage, 
    cartPage 
  }) => {
    // Add Allure metadata
    AllureHelpers.addEpic(AutomationExerciseTestData.epic);
    AllureHelpers.addFeature(AutomationExerciseTestData.features.shoppingCart);
    AllureHelpers.addStory(AutomationExerciseTestData.stories.cartManagement);
    AllureHelpers.addSeverity('normal');
    AllureHelpers.addOwner('QA Team');
    AllureHelpers.addTestId('TC13');
    AllureHelpers.addDescription('Verify product quantity is correctly displayed in cart when custom quantity is set');
    AllureHelpers.addTag('regression');
    AllureHelpers.addTag('shopping-cart');
    AllureHelpers.addTag('quantity');

    await AllureHelpers.step('Navigate to home page', async () => {
      // 1. Launch browser and navigate to url 'http://automationexercise.com'
      await homePage.navigateTo();
    });

    await AllureHelpers.step('Verify home page is visible', async () => {
      // 2. Verify that home page is visible successfully
      await expect(homePage.homePageCarousel).toBeVisible();
    });

    await AllureHelpers.step('Navigate to product detail page', async () => {
      // 3. Click 'View Product' for any product on home page
      const firstProduct = homePage.page.locator('a:has-text("View Product")').first();
      await firstProduct.click();
    });

    await AllureHelpers.step('Verify product detail page is loaded', async () => {
      // 4. Verify product detail is opened
      await expect(productDetailPage.productName).toBeVisible();
    });

    await AllureHelpers.step('Set product quantity to 4', async () => {
      // 5. Increase quantity to 4
      await productDetailPage.setQuantity(4);
      AllureHelpers.addParameter('Product Quantity', '4');
    });

    await AllureHelpers.step('Add product to cart', async () => {
      // 6. Click 'Add to cart' button
      await productDetailPage.addToCart();
    });

    await AllureHelpers.step('Navigate to cart page', async () => {
      // 7. Click 'View Cart' button
      const viewCartButton = homePage.page.locator('a:has-text("View Cart")');
      await viewCartButton.click();
    });

    await AllureHelpers.step('Verify product quantity in cart', async () => {
      // 8. Verify that product is displayed in cart page with exact quantity
      await expect(cartPage.cartTable).toBeVisible();
      
      const quantities = await cartPage.getProductQuantities();
      expect(quantities[0]).toBe(4);
      
      // Verify only one product is in cart
      const itemsCount = await cartPage.getCartItemsCount();
      expect(itemsCount).toBe(1);
      
      AllureHelpers.addParameter('Expected Quantity', '4');
      AllureHelpers.addParameter('Actual Quantity', quantities[0].toString());
      AllureHelpers.addParameter('Cart Items Count', itemsCount.toString());
      
      // Take screenshot of cart with custom quantity
      const screenshot = await cartPage.page.screenshot();
      await AllureHelpers.addScreenshot('Cart with Custom Quantity', screenshot);
    });
  });
});
