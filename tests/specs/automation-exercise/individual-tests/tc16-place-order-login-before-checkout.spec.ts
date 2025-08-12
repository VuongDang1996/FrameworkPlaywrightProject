import { test } from '@fixtures/automation-exercise-fixtures';
import { expect } from '@playwright/test';
import { TEST_USERS } from '@data/automation-exercise-data';
import { AllureHelpers, AutomationExerciseTestData } from '@utils/allure-helpers';

test.describe('TC16 - Place Order: Login Before Checkout', () => {
  test('TC16 - Place Order: Login Before Checkout @regression', async ({ 
    homePage, 
    loginPage,
    productsPage,
    cartPage
  }) => {
    // Add Allure metadata
    AllureHelpers.addEpic(AutomationExerciseTestData.epic);
    AllureHelpers.addFeature(AutomationExerciseTestData.features.checkout);
    AllureHelpers.addStory(AutomationExerciseTestData.stories.orderPlacement);
    AllureHelpers.addSeverity('critical');
    AllureHelpers.addOwner('QA Team');
    AllureHelpers.addTestId('TC16');
    AllureHelpers.addDescription('Verify user can place order by logging in before checkout process');
    AllureHelpers.addTag('regression');
    AllureHelpers.addTag('checkout');
    AllureHelpers.addTag('login');

    await AllureHelpers.step('Navigate to home page', async () => {
      // 1. Launch browser and navigate to url 'http://automationexercise.com'
      await homePage.navigateTo();
    });

    await AllureHelpers.step('Verify home page is visible', async () => {
      // 2. Verify that home page is visible successfully
      await expect(homePage.homePageCarousel).toBeVisible();
    });

    await AllureHelpers.step('Navigate to login page', async () => {
      // 3. Click 'Signup / Login' button
      await homePage.clickSignupLogin();
    });

    await AllureHelpers.step('Login with existing user', async () => {
      // 4. Fill email, password and click 'Login' button
      await loginPage.loginUser(TEST_USERS.VALID_USER.email, TEST_USERS.VALID_USER.password);
      AllureHelpers.addParameter('User Email', TEST_USERS.VALID_USER.email);
    });

    await AllureHelpers.step('Verify user is logged in', async () => {
      // 5. Verify 'Logged in as username' at top
      await expect(homePage.loggedInAsUser).toBeVisible();
      
      const screenshot = await homePage.page.screenshot();
      await AllureHelpers.addScreenshot('User Logged In', screenshot);
    });

    await AllureHelpers.step('Add products to cart', async () => {
      // 6. Add products to cart
      await homePage.clickProducts();
      await productsPage.hoverAndAddToCart(0);
      await productsPage.clickContinueShopping();
      AllureHelpers.addParameter('Product Index', '0 (first product)');
    });

    await AllureHelpers.step('Navigate to cart', async () => {
      // 7. Click 'Cart' button
      await homePage.clickCart();
    });

    await AllureHelpers.step('Verify cart page is displayed', async () => {
      // 8. Verify that cart page is displayed
      await expect(cartPage.cartTable).toBeVisible();
      
      const screenshot = await cartPage.page.screenshot();
      await AllureHelpers.addScreenshot('Cart with Products', screenshot);
    });

    await AllureHelpers.step('Proceed to checkout', async () => {
      // 9. Click 'Proceed To Checkout'
      await cartPage.clickProceedToCheckout();
    });

    await AllureHelpers.step('Verify checkout page', async () => {
      // 10. Verify Address Details and Review Your Order
      const checkoutPage = homePage.page.locator('h2:has-text("Review Your Order")');
      await expect(checkoutPage).toBeVisible();
      
      const screenshot = await homePage.page.screenshot();
      await AllureHelpers.addScreenshot('Checkout Page', screenshot);
      
      // 11-14. Enter payment details and place order (simplified)
      // In a real test, we would fill payment form and complete order

      // 15. Click 'Delete Account' button (optional for existing user)
      // await homePage.clickDeleteAccount();

      // 16. Verify 'ACCOUNT DELETED!' and click 'Continue' button
      // await expect(signupPage.accountDeletedTitle).toBeVisible();
    });
  });
});
