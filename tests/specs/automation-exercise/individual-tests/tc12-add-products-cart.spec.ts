import { test } from '@fixtures/automation-exercise-fixtures';
import { expect } from '@playwright/test';
import { AllureHelpers, AutomationExerciseTestData } from '@utils/allure-helpers';

test.describe('TC12 - Add Products in Cart', () => {
  test('TC12 - Add Products in Cart @regression', async ({ 
    homePage, 
    productsPage, 
    cartPage 
  }) => {
    // Add Allure metadata
    AllureHelpers.addEpic(AutomationExerciseTestData.epic);
    AllureHelpers.addFeature(AutomationExerciseTestData.features.shoppingCart);
    AllureHelpers.addStory(AutomationExerciseTestData.stories.cartManagement);
    AllureHelpers.addSeverity('normal');
    AllureHelpers.addOwner('QA Team');
    AllureHelpers.addTestId('TC12');
    AllureHelpers.addDescription('Verify user can add multiple products to cart');
    AllureHelpers.addTag('regression');
    AllureHelpers.addTag('shopping-cart');
    AllureHelpers.addTag('products');

    await AllureHelpers.step('Navigate to home page', async () => {
      // 1. Launch browser and navigate to url 'http://automationexercise.com'
      await homePage.navigateTo();
    });

    await AllureHelpers.step('Verify home page is visible', async () => {
      // 2. Verify that home page is visible successfully
      await expect(homePage.homePageCarousel).toBeVisible();
    });

    await AllureHelpers.step('Navigate to products page', async () => {
      // 3. Click 'Products' button
      await homePage.clickProducts();
    });

    await AllureHelpers.step('Add first product to cart', async () => {
      // 4. Hover over first product and click 'Add to cart'
      await productsPage.hoverAndAddToCart(0);
      AllureHelpers.addParameter('First Product', 'Product at index 0');
    });

    await AllureHelpers.step('Continue shopping after first product', async () => {
      // 5. Click 'Continue Shopping' button
      await productsPage.clickContinueShopping();
    });

    await AllureHelpers.step('Add second product to cart', async () => {
      // 6. Hover over second product and click 'Add to cart'
      await productsPage.hoverAndAddToCart(1);
      AllureHelpers.addParameter('Second Product', 'Product at index 1');
    });

    await AllureHelpers.step('View cart', async () => {
      // 7. Click 'View Cart' button
      await productsPage.clickViewCart();
    });

    await AllureHelpers.step('Verify cart contents', async () => {
      // 8. Verify both products are added to Cart
      await expect(cartPage.cartTable).toBeVisible();
    });

    await AllureHelpers.step('Verify product details in cart', async () => {
      // 9. Verify their prices, quantity and total price
      const cartItems = await cartPage.getCartItemsCount();
      expect(cartItems).toBe(2);
      AllureHelpers.addParameter('Cart Items Count', cartItems.toString());
      
      // Verify quantities and prices are displayed
      const quantities = await cartPage.getProductQuantities();
      expect(quantities).toHaveLength(2);
      expect(quantities[0]).toBe(1);
      expect(quantities[1]).toBe(1);
      
      const prices = await cartPage.getProductPrices();
      expect(prices).toHaveLength(2);
      
      const totals = await cartPage.getProductTotals();
      expect(totals).toHaveLength(2);
      
      // Take screenshot of cart for evidence
      const screenshot = await cartPage.page.screenshot();
      await AllureHelpers.addScreenshot('Cart Contents', screenshot);
    });
  });
});
