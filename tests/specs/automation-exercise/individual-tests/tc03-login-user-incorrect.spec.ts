import { test } from '@fixtures/automation-exercise-fixtures';
import { expect } from '@playwright/test';
import { TEST_USERS } from '@data/automation-exercise-data';
import { AllureHelpers, AutomationExerciseTestData } from '@utils/allure-helpers';

test.describe('TC03 - Login User with Incorrect Email and Password', () => {
  test('TC03 - Login User with Incorrect Email and Password @regression', async ({ 
    homePage, 
    loginPage 
  }) => {
    // Add Allure metadata
    AllureHelpers.addEpic(AutomationExerciseTestData.epic);
    AllureHelpers.addFeature(AutomationExerciseTestData.features.authentication);
    AllureHelpers.addStory(AutomationExerciseTestData.stories.login);
    AllureHelpers.addSeverity('normal');
    AllureHelpers.addOwner('QA Team');
    AllureHelpers.addTestId('TC03');
    AllureHelpers.addDescription('Verify error message is displayed when user tries to login with incorrect credentials');
    AllureHelpers.addTag('regression');
    AllureHelpers.addTag('authentication');
    AllureHelpers.addTag('negative-test');

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

    await AllureHelpers.step('Enter incorrect login credentials', async () => {
      // 5. Enter incorrect email address and password
      await loginPage.loginUser(TEST_USERS.INVALID_USER.email, TEST_USERS.INVALID_USER.password);
      AllureHelpers.addParameter('Invalid Email', TEST_USERS.INVALID_USER.email);
      AllureHelpers.addParameter('Invalid Password', '[MASKED]');
    });

    await AllureHelpers.step('Verify error message is displayed', async () => {
      // 6. Verify error 'Your email or password is incorrect!' is visible
      await expect(loginPage.loginErrorMessage).toBeVisible();
      await expect(loginPage.loginErrorMessage).toContainText('Your email or password is incorrect!');
      
      // Take screenshot of error message
      const screenshot = await loginPage.page.screenshot();
      await AllureHelpers.addScreenshot('Login Error Message', screenshot);
    });
  });
});
