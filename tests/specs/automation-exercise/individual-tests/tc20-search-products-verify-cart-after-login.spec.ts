import { test } from '@fixtures/automation-exercise-fixtures';
import { expect } from '@playwright/test';
import { SEARCH_TERMS, TEST_USERS } from '@data/automation-exercise-data';
import { AllureHelpers, AutomationExerciseTestData } from '@utils/allure-helpers';

test.describe('TC20 - Search Products and Verify Cart After Login', () => {
  test('TC20 - Search Products and Verify Cart After Login @regression', async ({ 
    homePage,
    productsPage,
    cartPage,
    loginPage
  }) => {
    // Add Allure metadata
    AllureHelpers.addEpic(AutomationExerciseTestData.epic);
    AllureHelpers.addFeature(AutomationExerciseTestData.features.shoppingCart);
    AllureHelpers.addStory(AutomationExerciseTestData.stories.cartManagement);
    AllureHelpers.addSeverity('critical');
    AllureHelpers.addOwner('QA Team');
    AllureHelpers.addTestId('TC20');
    AllureHelpers.addDescription('Verify cart items persist after login when products are added before login');
    AllureHelpers.addTag('regression');
    AllureHelpers.addTag('shopping-cart');
    AllureHelpers.addTag('authentication');

    await AllureHelpers.step('Navigate to home page', async () => {
      // 1. Launch browser and navigate to url 'http://automationexercise.com'
      await homePage.navigateTo();
    });

    await AllureHelpers.step('Navigate to products page', async () => {
      // 2. Click on 'Products' button
      await homePage.clickProducts();
    });

    await AllureHelpers.step('Verify products page is loaded', async () => {
      // 3. Verify user is navigated to ALL PRODUCTS page successfully
      await expect(productsPage.allProductsTitle).toBeVisible();
    });

    await AllureHelpers.step('Search for products', async () => {
      // 4. Enter product name in search input and click search button
      await productsPage.searchProducts(SEARCH_TERMS.SHIRT);
    });

    await AllureHelpers.step('Verify search results are displayed', async () => {
      // 5. Verify 'SEARCHED PRODUCTS' is visible
      await expect(productsPage.searchedProductsTitle).toBeVisible();

      // 6. Verify all the products related to search are visible
      await expect(productsPage.searchResults.first()).toBeVisible();
    });

    await AllureHelpers.step('Add search results to cart', async () => {
      // 7. Add those products to cart (limit to first 3 to avoid timeouts)
      await productsPage.addSearchResultsToCart(3);
    });

    let itemsBeforeLogin: number;

    await AllureHelpers.step('Verify cart contains products before login', async () => {
      // 8. Click 'Cart' button and verify that products are visible in cart
      await homePage.clickCart();
      await expect(cartPage.cartTable).toBeVisible();
      itemsBeforeLogin = await cartPage.getCartItemsCount();
      expect(itemsBeforeLogin).toBeGreaterThan(0);
    });

    await AllureHelpers.step('Login with existing user', async () => {
      // 9. Click 'Signup / Login' button and submit login details
      await homePage.clickSignupLogin();
      await loginPage.loginUser(TEST_USERS.VALID_USER.email, TEST_USERS.VALID_USER.password);
    });

    await AllureHelpers.step('Verify cart items persist after login', async () => {
      // 10. Again, go to Cart page
      await homePage.clickCart();

      // 11. Verify that those products are visible in cart after login as well
      await expect(cartPage.cartTable).toBeVisible();
      const itemsAfterLogin = await cartPage.getCartItemsCount();
      expect(itemsAfterLogin).toBeGreaterThanOrEqual(itemsBeforeLogin); // Cart should have at least the same items
    });
  });
});
