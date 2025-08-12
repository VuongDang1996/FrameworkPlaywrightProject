import { test } from '@fixtures/automation-exercise-fixtures';
import { expect } from '@playwright/test';
import { AllureHelpers, AutomationExerciseTestData } from '@utils/allure-helpers';

test.describe('TC17 - Remove Products From Cart', () => {
  test('TC17 - Remove Products From Cart @regression', async ({ 
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
    AllureHelpers.addTestId('TC17');
    AllureHelpers.addDescription('Verify user can remove products from shopping cart');
    AllureHelpers.addTag('regression');
    AllureHelpers.addTag('shopping-cart');
    AllureHelpers.addTag('product-removal');

    await AllureHelpers.step('Navigate to home page', async () => {
      // 1. Launch browser and navigate to url 'http://automationexercise.com'
      await homePage.navigateTo();
    });

    await AllureHelpers.step('Verify home page is visible', async () => {
      // 2. Verify that home page is visible successfully
      await expect(homePage.homePageCarousel).toBeVisible();
    });

    await AllureHelpers.step('Add multiple products to cart', async () => {
      // 3. Add products to cart
      await homePage.clickProducts();
      await productsPage.hoverAndAddToCart(0);
      await productsPage.clickContinueShopping();
      await productsPage.hoverAndAddToCart(1);
      AllureHelpers.addParameter('Products Added', '2 products (index 0 and 1)');
    });

    await AllureHelpers.step('Navigate to cart', async () => {
      // 4. Click 'Cart' button
      await productsPage.clickViewCart();
    });

    await AllureHelpers.step('Verify cart page and initial product count', async () => {
      // 5. Verify that cart page is displayed
      await expect(cartPage.cartTable).toBeVisible();
      
      // Verify we have products in cart
      const initialItemsCount = await cartPage.getCartItemsCount();
      expect(initialItemsCount).toBeGreaterThan(0);
      AllureHelpers.addParameter('Initial Items Count', initialItemsCount.toString());
      
      const screenshot = await cartPage.page.screenshot();
      await AllureHelpers.addScreenshot('Cart Before Product Removal', screenshot);
    });

    await AllureHelpers.step('Remove product from cart', async () => {
      // 6. Click 'X' button corresponding to particular product
      await cartPage.removeProduct(0);
      AllureHelpers.addParameter('Removed Product Index', '0 (first product)');
    });

    await AllureHelpers.step('Verify product removal', async () => {
      // 7. Verify that product is removed from the cart
      const initialItemsCount = await cartPage.getCartItemsCount();
      const finalItemsCount = await cartPage.getCartItemsCount();
      expect(finalItemsCount).toBe(initialItemsCount - 1);
      
      AllureHelpers.addParameter('Final Items Count', finalItemsCount.toString());
      
      const screenshot = await cartPage.page.screenshot();
      await AllureHelpers.addScreenshot('Cart After Product Removal', screenshot);
    });
  });
});
