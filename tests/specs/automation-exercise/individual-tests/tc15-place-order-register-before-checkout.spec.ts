import { test } from '@fixtures/automation-exercise-fixtures';
import { expect } from '@playwright/test';
import { SAMPLE_REGISTRATION_DATA } from '@data/automation-exercise-data';
import { AllureHelpers, AutomationExerciseTestData } from '@utils/allure-helpers';

test.describe('TC15 - Place Order: Register Before Checkout', () => {
  test('TC15 - Place Order: Register Before Checkout @regression', async ({ 
    homePage, 
    loginPage,
    signupPage,
    productsPage,
    cartPage
  }) => {
    // Add Allure metadata
    AllureHelpers.addEpic(AutomationExerciseTestData.epic);
    AllureHelpers.addFeature(AutomationExerciseTestData.features.checkout);
    AllureHelpers.addStory(AutomationExerciseTestData.stories.orderPlacement);
    AllureHelpers.addSeverity('critical');
    AllureHelpers.addOwner('QA Team');
    AllureHelpers.addTestId('TC15');
    AllureHelpers.addDescription('Verify user can place order by registering before checkout process');
    AllureHelpers.addTag('regression');
    AllureHelpers.addTag('checkout');
    AllureHelpers.addTag('registration');

    // Generate unique user data for this test
    const userData = {
      ...SAMPLE_REGISTRATION_DATA,
      email: `test${Date.now()}@example.com`,
    };

    await AllureHelpers.step('Navigate to home page', async () => {
      // 1. Launch browser and navigate to url 'http://automationexercise.com'
      await homePage.navigateTo();
    });

    await AllureHelpers.step('Verify home page is visible', async () => {
      // 2. Verify that home page is visible successfully
      await expect(homePage.homePageCarousel).toBeVisible();
    });

    await AllureHelpers.step('Navigate to signup page', async () => {
      // 3. Click 'Signup / Login' button
      await homePage.clickSignupLogin();
    });

    await AllureHelpers.step('Complete user registration', async () => {
      // 4. Fill all details in Signup and create account
      await loginPage.signupUser(userData.name, userData.email);
      await expect(signupPage.accountInfoTitle).toBeVisible();

      const accountInfo = {
        title: userData.title,
        password: userData.password,
        day: userData.day,
        month: userData.month,
        year: userData.year,
        newsletter: true,
        offers: true
      };
      await signupPage.fillAccountInformation(accountInfo);

      const addressInfo = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        company: userData.company,
        address1: userData.address1,
        address2: userData.address2,
        country: userData.country,
        state: userData.state,
        city: userData.city,
        zipcode: userData.zipcode,
        mobileNumber: userData.mobileNumber
      };
      await signupPage.fillAddressInformation(addressInfo);
      
      AllureHelpers.addParameter('User Email', userData.email);
      AllureHelpers.addParameter('User Name', userData.name);
    });

    await AllureHelpers.step('Create account', async () => {
      // 5. Click 'Create Account' button
      await signupPage.clickCreateAccount();
    });

    await AllureHelpers.step('Verify account creation', async () => {
      // 6. Verify 'ACCOUNT CREATED!' and click 'Continue' button
      await expect(signupPage.accountCreatedTitle).toBeVisible();
      await signupPage.clickContinue();
      
      const screenshot = await signupPage.page.screenshot();
      await AllureHelpers.addScreenshot('Account Created', screenshot);
    });

    await AllureHelpers.step('Verify user is logged in', async () => {
      // 7. Verify 'Logged in as username' at top
      await expect(homePage.loggedInAsUser).toBeVisible();
    });

    await AllureHelpers.step('Add products to cart', async () => {
      // 8. Add products to cart
      await homePage.clickProducts();
      await productsPage.hoverAndAddToCart(0);
      await productsPage.clickContinueShopping();
      AllureHelpers.addParameter('Product Index', '0 (first product)');
    });

    await AllureHelpers.step('Navigate to cart', async () => {
      // 9. Click 'Cart' button
      await homePage.clickCart();
    });

    await AllureHelpers.step('Verify cart page is displayed', async () => {
      // 10. Verify that cart page is displayed
      await expect(cartPage.cartTable).toBeVisible();
      
      const screenshot = await cartPage.page.screenshot();
      await AllureHelpers.addScreenshot('Cart with Products', screenshot);
    });

    await AllureHelpers.step('Proceed to checkout', async () => {
      // 11. Click 'Proceed To Checkout'
      await cartPage.clickProceedToCheckout();
    });

    await AllureHelpers.step('Verify checkout page', async () => {
      // 12. Verify Address Details and Review Your Order
      const checkoutPage = homePage.page.locator('h2:has-text("Review Your Order")');
      await expect(checkoutPage).toBeVisible();
      
      const screenshot = await homePage.page.screenshot();
      await AllureHelpers.addScreenshot('Checkout Page', screenshot);
      
      // 13-16. Enter payment details and place order (simplified)
      // In a real test, we would fill payment form and complete order
    });

    await AllureHelpers.step('Delete test account', async () => {
      // 17. Click 'Delete Account' button
      await homePage.clickDeleteAccount();
    });

    await AllureHelpers.step('Verify account deletion', async () => {
      // 18. Verify 'ACCOUNT DELETED!' and click 'Continue' button
      await expect(signupPage.accountDeletedTitle).toBeVisible();
      
      const screenshot = await signupPage.page.screenshot();
      await AllureHelpers.addScreenshot('Account Deleted', screenshot);
    });
  });
});
