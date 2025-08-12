import { test } from '@fixtures/automation-exercise-fixtures';
import { expect } from '@playwright/test';
import { AllureHelpers, AutomationExerciseTestData } from '@utils/allure-helpers';

test.describe('TC10 - Verify Subscription in Home Page', () => {
  test('TC10 - Verify Subscription in Home Page @regression', async ({ 
    homePage 
  }) => {
    // Add Allure metadata
    AllureHelpers.addEpic(AutomationExerciseTestData.epic);
    AllureHelpers.addFeature(AutomationExerciseTestData.features.newsletter);
    AllureHelpers.addStory(AutomationExerciseTestData.stories.subscription);
    AllureHelpers.addSeverity('normal');
    AllureHelpers.addOwner('QA Team');
    AllureHelpers.addTestId('TC10');
    AllureHelpers.addDescription('Verify user can subscribe to newsletter from home page');
    AllureHelpers.addTag('regression');
    AllureHelpers.addTag('subscription');
    AllureHelpers.addTag('newsletter');

    await AllureHelpers.step('Navigate to home page', async () => {
      // 1. Launch browser and navigate to url 'http://automationexercise.com'
      await homePage.navigateTo();
    });

    await AllureHelpers.step('Verify home page is visible', async () => {
      // 2. Verify that home page is visible successfully
      await expect(homePage.homePageCarousel).toBeVisible();
    });

    await AllureHelpers.step('Scroll to footer section', async () => {
      // 3. Scroll down to footer
      await homePage.scrollToBottom();
    });

    await AllureHelpers.step('Verify subscription section is visible', async () => {
      // 4. Verify text 'SUBSCRIPTION'
      await expect(homePage.subscriptionTitle).toBeVisible();
      
      // Take screenshot of subscription section
      const screenshot = await homePage.page.screenshot();
      await AllureHelpers.addScreenshot('Subscription Section', screenshot);
    });

    await AllureHelpers.step('Subscribe to newsletter', async () => {
      // 5. Enter email address in input and click arrow button
      const testEmail = `test${Date.now()}@example.com`;
      await homePage.subscribeToNewsletter(testEmail);
      AllureHelpers.addParameter('Test Email', testEmail);
    });

    await AllureHelpers.step('Verify subscription success', async () => {
      // 6. Verify success message 'You have been successfully subscribed!' is visible
      await expect(homePage.subscriptionSuccessMessage).toBeVisible();
      await expect(homePage.subscriptionSuccessMessage).toContainText('You have been successfully subscribed!');
      
      // Take screenshot of success message
      const screenshot = await homePage.page.screenshot();
      await AllureHelpers.addScreenshot('Subscription Success', screenshot);
    });
  });
});
