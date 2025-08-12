import { test } from '@fixtures/automation-exercise-fixtures';
import { expect } from '@playwright/test';
import { TEST_USERS } from '@data/automation-exercise-data';
import { AllureHelpers, AutomationExerciseTestData } from '@utils/allure-helpers';

test.describe('TC02 - Login User with Correct Email and Password', () => {
  test('TC02 - Login User with Correct Email and Password @smoke', async ({ 
    homePage, 
    loginPage 
  }) => {
    // Add Allure metadata
    AllureHelpers.addEpic(AutomationExerciseTestData.epic);
    AllureHelpers.addFeature(AutomationExerciseTestData.features.authentication);
    AllureHelpers.addStory(AutomationExerciseTestData.stories.login);
    AllureHelpers.addSeverity('critical');
    AllureHelpers.addOwner('QA Team');
    AllureHelpers.addTestId('TC02');
    AllureHelpers.addDescription('Verify user can login with correct email and password');
    AllureHelpers.addTag('smoke');
    AllureHelpers.addTag('authentication');
    AllureHelpers.addParameter('User Email', TEST_USERS.VALID_USER.email);

    await AllureHelpers.step('Navigate to home page', async () => {
      // 1. Launch browser and navigate to url 'http://automationexercise.com'
      await homePage.navigateTo();
    });

    await AllureHelpers.step('Verify home page is visible', async () => {
      // 2. Verify that home page is visible successfully
      await expect(homePage.homePageCarousel).toBeVisible();
    });

    await AllureHelpers.step('Navigate to login page', async () => {
      // 3. Click on 'Signup / Login' button
      await homePage.clickSignupLogin();
    });

    await AllureHelpers.step('Verify login form is visible', async () => {
      // 4. Verify 'Login to your account' is visible
      await expect(loginPage.loginToAccountTitle).toBeVisible();
    });

    await AllureHelpers.step('Enter login credentials', async () => {
      // 5. Enter correct email address and password
      await loginPage.loginUser(TEST_USERS.VALID_USER.email, TEST_USERS.VALID_USER.password);
    });

    await AllureHelpers.step('Verify user is logged in', async () => {
      // 6. Verify that 'Logged in as username' is visible
      await expect(homePage.loggedInAsUser).toBeVisible();
    });

    await AllureHelpers.step('Logout user', async () => {
      // 7. Click 'Delete Account' button (if account exists)
      // Note: Since we're using test credentials, account may not exist
      // We'll try to click logout instead to verify login was successful
      await homePage.clickLogout();
    });

    await AllureHelpers.step('Verify logout successful', async () => {
      // 8. Verify that user is navigated to login page
      await expect(loginPage.loginToAccountTitle).toBeVisible();
    });
  });
});
