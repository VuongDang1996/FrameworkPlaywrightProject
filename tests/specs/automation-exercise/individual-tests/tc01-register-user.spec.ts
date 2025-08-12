import { test } from '@fixtures/automation-exercise-fixtures';
import { expect } from '@playwright/test';
import { SAMPLE_REGISTRATION_DATA } from '@data/automation-exercise-data';
import { AllureHelpers, AutomationExerciseTestData } from '@utils/allure-helpers';

test.describe('TC01 - Register User', () => {
  test('TC01 - Register User @smoke', async ({ 
    homePage, 
    loginPage, 
    signupPage 
  }) => {
    // Add Allure metadata
    AllureHelpers.addEpic(AutomationExerciseTestData.epic);
    AllureHelpers.addFeature(AutomationExerciseTestData.features.userManagement);
    AllureHelpers.addStory(AutomationExerciseTestData.stories.registration);
    AllureHelpers.addSeverity('critical');
    AllureHelpers.addOwner('QA Team');
    AllureHelpers.addTestId('TC01');
    AllureHelpers.addDescription('Verify user can successfully register with valid details');
    AllureHelpers.addTag('smoke');
    AllureHelpers.addTag('user-registration');

    // Generate unique user data for this test
    const userData = {
      ...SAMPLE_REGISTRATION_DATA,
      email: `test${Date.now()}@example.com`,
    };
    AllureHelpers.addParameter('User Email', userData.email);
    AllureHelpers.addParameter('User Name', userData.name);

    await AllureHelpers.step('Navigate to home page', async () => {
      // 1. Launch browser and navigate to url 'http://automationexercise.com'
      await homePage.navigateTo();
    });

    await AllureHelpers.step('Verify home page is visible', async () => {
      // 2. Verify that home page is visible successfully
      await expect(homePage.homePageCarousel).toBeVisible();
      await expect(homePage.featuresItems).toBeVisible();
    });

    await AllureHelpers.step('Navigate to signup page', async () => {
      // 3. Click on 'Signup / Login' button
      await homePage.clickSignupLogin();
    });

    await AllureHelpers.step('Verify signup form is visible', async () => {
      // 4. Verify 'New User Signup!' is visible
      await expect(loginPage.newUserSignupTitle).toBeVisible();
    });

    await AllureHelpers.step('Enter signup details', async () => {
      // 5. Enter name and email address and click 'Signup' button
      await loginPage.signupUser(userData.name, userData.email);
    });

    await AllureHelpers.step('Verify account information form', async () => {
      // 6. Verify that 'ENTER ACCOUNT INFORMATION' is visible
      await expect(signupPage.accountInfoTitle).toBeVisible();
    });

    await AllureHelpers.step('Fill account information', async () => {
      // 7. Fill account information details
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
    });

    await AllureHelpers.step('Fill address information', async () => {
      // 8. Fill address information
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
    });

    await AllureHelpers.step('Create account', async () => {
      // 9. Click 'Create Account' button
      await signupPage.clickCreateAccount();
    });

    await AllureHelpers.step('Verify account creation', async () => {
      // 10. Verify that 'ACCOUNT CREATED!' is visible
      await expect(signupPage.accountCreatedTitle).toBeVisible();
    });

    await AllureHelpers.step('Continue after account creation', async () => {
      // 11. Click 'Continue' button
      await signupPage.clickContinue();
    });

    await AllureHelpers.step('Verify user is logged in', async () => {
      // 12. Verify that 'Logged in as username' is visible
      await expect(homePage.loggedInAsUser).toBeVisible();
      await expect(homePage.loggedInAsUser).toContainText(userData.name);
    });

    await AllureHelpers.step('Delete account', async () => {
      // 13. Click 'Delete Account' button
      await homePage.clickDeleteAccount();
    });

    await AllureHelpers.step('Verify account deletion', async () => {
      // 14. Verify that 'ACCOUNT DELETED!' is visible and click 'Continue' button
      await expect(signupPage.accountDeletedTitle).toBeVisible();
      await signupPage.clickContinue();
    });
  });
});
