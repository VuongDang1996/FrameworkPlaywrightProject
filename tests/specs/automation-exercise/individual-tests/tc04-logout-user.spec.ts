import { test } from '@fixtures/automation-exercise-fixtures';
import { expect } from '@playwright/test';
import { TEST_USERS } from '@data/automation-exercise-data';
import { AllureHelpers, AutomationExerciseTestData } from '@utils/allure-helpers';

test.describe('TC04 - Logout User', () => {
  test('TC04 - Logout User @smoke', async ({ 
    homePage, 
    loginPage 
  }) => {
    // Add Allure metadata
    AllureHelpers.addEpic(AutomationExerciseTestData.epic);
    AllureHelpers.addFeature(AutomationExerciseTestData.features.authentication);
    AllureHelpers.addStory(AutomationExerciseTestData.stories.logout);
    AllureHelpers.addSeverity('critical');
    AllureHelpers.addOwner('QA Team');
    AllureHelpers.addTestId('TC04');
    AllureHelpers.addDescription('Verify user can successfully logout from the application');
    AllureHelpers.addTag('smoke');
    AllureHelpers.addTag('authentication');
    AllureHelpers.addTag('logout');

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

    await AllureHelpers.step('Verify login section is visible', async () => {
      // 4. Verify 'Login to your account' is visible
      await expect(loginPage.loginToAccountTitle).toBeVisible();
    });

    await AllureHelpers.step('Login with valid credentials', async () => {
      // 5. Enter correct email address and password
      await loginPage.loginUser(TEST_USERS.VALID_USER.email, TEST_USERS.VALID_USER.password);
      AllureHelpers.addParameter('Email', TEST_USERS.VALID_USER.email);
    });

    await AllureHelpers.step('Verify successful login', async () => {
      // 6. Verify that 'Logged in as username' is visible
      await expect(homePage.loggedInAsUser).toBeVisible();
      
      // Take screenshot of logged in state
      const screenshot = await homePage.page.screenshot();
      await AllureHelpers.addScreenshot('User Logged In', screenshot);
    });

    await AllureHelpers.step('Logout from application', async () => {
      // 7. Click 'Logout' button
      await homePage.clickLogout();
    });

    await AllureHelpers.step('Verify successful logout', async () => {
      // 8. Verify that user is navigated to login page
      await expect(loginPage.loginToAccountTitle).toBeVisible();
      await expect(loginPage.newUserSignupTitle).toBeVisible();
      
      // Take screenshot of logout state
      const screenshot = await loginPage.page.screenshot();
      await AllureHelpers.addScreenshot('User Logged Out', screenshot);
    });
  });
});
