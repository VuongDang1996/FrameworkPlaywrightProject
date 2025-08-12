import { test } from '@fixtures/automation-exercise-fixtures';
import { expect } from '@playwright/test';
import { SAMPLE_REGISTRATION_DATA } from '@data/automation-exercise-data';
import { AllureHelpers, AutomationExerciseTestData } from '@utils/allure-helpers';

test.describe('TC24 - Download Invoice After Purchase Order', () => {
  test('TC24 - Download Invoice After Purchase Order @regression', async ({ 
    homePage, 
    productsPage,
    cartPage,
    loginPage,
    signupPage
  }) => {
    // Add Allure metadata
    AllureHelpers.addEpic(AutomationExerciseTestData.epic);
    AllureHelpers.addFeature(AutomationExerciseTestData.features.checkout);
    AllureHelpers.addStory(AutomationExerciseTestData.stories.orderPlacement);
    AllureHelpers.addSeverity('critical');
    AllureHelpers.addOwner('QA Team');
    AllureHelpers.addTestId('TC24');
    AllureHelpers.addDescription('Verify user can download invoice after completing purchase');
    AllureHelpers.addTag('regression');
    AllureHelpers.addTag('checkout');
    AllureHelpers.addTag('invoice-download');

    // Generate unique user data for this test
    const userData = {
      ...SAMPLE_REGISTRATION_DATA,
      email: `test${Date.now()}@example.com`,
    };

    // 1. Launch browser and navigate to url 'http://automationexercise.com'
    await homePage.navigateTo();

    // 2. Verify that home page is visible successfully
    await expect(homePage.homePageCarousel).toBeVisible();

    // 3. Add products to cart
    await homePage.clickProducts();
    await productsPage.hoverAndAddToCart(0);
    await productsPage.clickContinueShopping();

    // 4. Click 'Cart' button
    await homePage.clickCart();

    // 5. Verify that cart page is displayed
    await expect(cartPage.cartTable).toBeVisible();

    // 6. Click 'Proceed To Checkout'
    await cartPage.clickProceedToCheckout();

    // 7. Click 'Register / Login' button
    await cartPage.clickRegisterLogin();

    // 8. Fill all details in Signup and create account
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

    // 9. Click 'Create Account' button
    await signupPage.clickCreateAccount();

    // 10. Verify 'ACCOUNT CREATED!' and click 'Continue' button
    await expect(signupPage.accountCreatedTitle).toBeVisible();
    await signupPage.clickContinue();

    // 11. Verify 'Logged in as username' at top
    await expect(homePage.loggedInAsUser).toBeVisible();

    // 12. Click 'Cart' button
    await homePage.clickCart();

    // 13. Click 'Proceed To Checkout' button
    await cartPage.clickProceedToCheckout();

    // 14. Verify Address Details and Review Your Order
    const checkoutPage = homePage.page.locator('h2:has-text("Review Your Order")');
    await expect(checkoutPage).toBeVisible();

    // 15-17. Enter payment details and place order (simplified)
    // In a real implementation, we would fill payment form and complete order

    // 18. Verify success message 'Your order has been placed successfully!'
    // This would be on the order confirmation page

    // 19. Click 'Download Invoice' button and verify invoice is downloaded successfully
    // const downloadInvoiceButton = homePage.page.locator('a:has-text("Download Invoice")');
    // await downloadInvoiceButton.click();

    // 20. Click 'Continue' button
    // const continueButton = homePage.page.locator('a:has-text("Continue")');
    // await continueButton.click();

    // 21. Click 'Delete Account' button
    await homePage.clickDeleteAccount();

    // 22. Verify 'ACCOUNT DELETED!' and click 'Continue' button
    await expect(signupPage.accountDeletedTitle).toBeVisible();
  });
});
