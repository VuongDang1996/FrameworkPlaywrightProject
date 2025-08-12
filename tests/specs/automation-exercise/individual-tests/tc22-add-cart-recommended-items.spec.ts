import { test } from '@fixtures/automation-exercise-fixtures';
import { expect } from '@playwright/test';
import { AllureHelpers, AutomationExerciseTestData } from '@utils/allure-helpers';

test.describe('TC22 - Add to Cart from Recommended Items', () => {
  test('TC22 - Add to Cart from Recommended Items @regression', async ({ 
    homePage, 
    cartPage 
  }) => {
    // Add Allure metadata
    AllureHelpers.addEpic(AutomationExerciseTestData.epic);
    AllureHelpers.addFeature(AutomationExerciseTestData.features.shoppingCart);
    AllureHelpers.addStory(AutomationExerciseTestData.stories.cartManagement);
    AllureHelpers.addSeverity('normal');
    AllureHelpers.addOwner('QA Team');
    AllureHelpers.addTestId('TC22');
    AllureHelpers.addDescription('Verify user can add recommended items to cart');
    AllureHelpers.addTag('regression');
    AllureHelpers.addTag('shopping-cart');
    AllureHelpers.addTag('recommendations');

    await AllureHelpers.step('Navigate to home page', async () => {
      // 1. Launch browser and navigate to url 'http://automationexercise.com'
      await homePage.navigateTo();
    });

    // 2. Scroll to bottom of page
    await homePage.scrollToBottom();

    // 3. Verify 'RECOMMENDED ITEMS' are visible
    await expect(homePage.recommendedItemsTitle).toBeVisible();

    // 4. Click on 'Add To Cart' on Recommended product
    await homePage.addRecommendedItemToCart(0);

    // 5. Click on 'View Cart' button
    const viewCartButton = homePage.page.locator('a:has-text("View Cart")');
    await viewCartButton.click();

    // 6. Verify that product is displayed in cart page
    await expect(cartPage.cartTable).toBeVisible();
    
    const itemsCount = await cartPage.getCartItemsCount();
    expect(itemsCount).toBeGreaterThan(0);
  });
});
