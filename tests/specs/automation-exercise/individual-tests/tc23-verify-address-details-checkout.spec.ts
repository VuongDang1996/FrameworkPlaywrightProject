import { test } from '@fixtures/automation-exercise-fixtures';
import { expect } from '@playwright/test';
import { SAMPLE_REGISTRATION_DATA } from '@data/automation-exercise-data';
import { AllureHelpers, AutomationExerciseTestData } from '@utils/allure-helpers';

test.describe('TC23 - Verify Address Details in Checkout Page', () => {
  test('TC23 - Verify Address Details in Checkout Page @regression', async ({ 
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
    AllureHelpers.addTestId('TC23');
    AllureHelpers.addDescription('Verify address details are correctly displayed in checkout page');
    AllureHelpers.addTag('regression');
    AllureHelpers.addTag('checkout');
    AllureHelpers.addTag('address-verification');

    // Generate unique user data for this test
    const userData = {
      ...SAMPLE_REGISTRATION_DATA,
      email: `test${Date.now()}@example.com`,
    };

    // 1. Launch browser and navigate to url 'http://automationexercise.com'
    await homePage.navigateTo();

    // 2. Verify that home page is visible successfully
    await expect(homePage.homePageCarousel).toBeVisible();

    // 3. Click 'Signup / Login' button
    await homePage.clickSignupLogin();

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

    // 5. Click 'Create Account' button
    await signupPage.clickCreateAccount();

    // 6. Verify 'ACCOUNT CREATED!' and click 'Continue' button
    await expect(signupPage.accountCreatedTitle).toBeVisible();
    await signupPage.clickContinue();

    // 7. Verify 'Logged in as username' at top
    await expect(homePage.loggedInAsUser).toBeVisible();

    // 8. Add products to cart
    await homePage.clickProducts();
    await productsPage.hoverAndAddToCart(0);
    await productsPage.clickContinueShopping();

    // 9. Click 'Cart' button
    await homePage.clickCart();

    // 10. Verify that cart page is displayed
    await expect(cartPage.cartTable).toBeVisible();

    // 11. Click 'Proceed To Checkout'
    await cartPage.clickProceedToCheckout();

    // 12. Verify that the delivery address is same address filled at the time registration of account
    const deliveryAddress = homePage.page.locator('#address_delivery');
    await expect(deliveryAddress).toContainText(userData.firstName);
    await expect(deliveryAddress).toContainText(userData.lastName);
    await expect(deliveryAddress).toContainText(userData.address1);
    await expect(deliveryAddress).toContainText(userData.city);

    // 13. Verify that the billing address is same address filled at the time registration of account
    const billingAddress = homePage.page.locator('#address_invoice');
    await expect(billingAddress).toContainText(userData.firstName);
    await expect(billingAddress).toContainText(userData.lastName);
    await expect(billingAddress).toContainText(userData.address1);
    await expect(billingAddress).toContainText(userData.city);

    // 14. Click 'Delete Account' button
    await homePage.clickDeleteAccount();

    // 15. Verify 'ACCOUNT DELETED!' and click 'Continue' button
    await expect(signupPage.accountDeletedTitle).toBeVisible();
  });
});
