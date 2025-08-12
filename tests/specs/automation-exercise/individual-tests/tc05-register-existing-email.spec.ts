import { test } from '@fixtures/automation-exercise-fixtures';
import { expect } from '@playwright/test';
import { TEST_USERS } from '@data/automation-exercise-data';
import { AllureHelpers, AutomationExerciseTestData } from '@utils/allure-helpers';

test.describe('TC05 - Register User with Existing Email', () => {
  test('TC05 - Register User with Existing Email @regression', async ({ 
    homePage, 
    loginPage 
  }) => {
    // Add Allure metadata
    AllureHelpers.addEpic(AutomationExerciseTestData.epic);
    AllureHelpers.addFeature(AutomationExerciseTestData.features.authentication);
    AllureHelpers.addStory(AutomationExerciseTestData.stories.registration);
    AllureHelpers.addSeverity('normal');
    AllureHelpers.addOwner('QA Team');
    AllureHelpers.addTestId('TC05');
    AllureHelpers.addDescription('Verify error message is displayed when user tries to register with existing email');
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

    await AllureHelpers.step('Navigate to signup page', async () => {
      // 3. Click on 'Signup / Login' button
      await homePage.clickSignupLogin();
    });

    await AllureHelpers.step('Verify signup section is visible', async () => {
      // 4. Verify 'New User Signup!' is visible
      await expect(loginPage.newUserSignupTitle).toBeVisible();
    });

    await AllureHelpers.step('Enter existing email for signup', async () => {
      // 5. Enter name and already registered email address
      await loginPage.signupUser('Test User', TEST_USERS.EXISTING_USER.email);
      AllureHelpers.addParameter('Test Name', 'Test User');
      AllureHelpers.addParameter('Existing Email', TEST_USERS.EXISTING_USER.email);
    });

    await AllureHelpers.step('Verify error message for existing email', async () => {
      // 6. Verify error 'Email Address already exist!' is visible
      await expect(loginPage.signupErrorMessage).toBeVisible();
      await expect(loginPage.signupErrorMessage).toContainText('Email Address already exist!');
      
      // Take screenshot of error message
      const screenshot = await loginPage.page.screenshot();
      await AllureHelpers.addScreenshot('Existing Email Error', screenshot);
    });
  });
});
