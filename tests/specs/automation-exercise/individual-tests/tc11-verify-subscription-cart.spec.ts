import { test } from '@fixtures/automation-exercise-fixtures';
import { expect } from '@playwright/test';
import { AllureHelpers, AutomationExerciseTestData } from '@utils/allure-helpers';

test.describe('TC11 - Verify Subscription in Cart Page', () => {
  test('TC11 - Verify Subscription in Cart Page @regression', async ({ 
    homePage 
  }) => {
    // Add Allure metadata
    AllureHelpers.addEpic(AutomationExerciseTestData.epic);
    AllureHelpers.addFeature(AutomationExerciseTestData.features.newsletter);
    AllureHelpers.addStory(AutomationExerciseTestData.stories.subscription);
    AllureHelpers.addSeverity('normal');
    AllureHelpers.addOwner('QA Team');
    AllureHelpers.addTestId('TC11');
    AllureHelpers.addDescription('Verify newsletter subscription functionality from cart page');
    AllureHelpers.addTag('regression');
    AllureHelpers.addTag('newsletter');
    AllureHelpers.addTag('subscription');

    await AllureHelpers.step('Navigate to home page', async () => {
      // 1. Launch browser and navigate to url 'http://automationexercise.com'
      await homePage.navigateTo();
    });

    await AllureHelpers.step('Verify home page is visible', async () => {
      // 2. Verify that home page is visible successfully
      await expect(homePage.homePageCarousel).toBeVisible();
    });

    await AllureHelpers.step('Navigate to cart page', async () => {
      // 3. Click 'Cart' button
      await homePage.clickCart();
    });

    await AllureHelpers.step('Scroll to footer section', async () => {
      // 4. Scroll down to footer
      await homePage.scrollToBottom();
    });

    await AllureHelpers.step('Verify subscription section is visible', async () => {
      // 5. Verify text 'SUBSCRIPTION'
      await expect(homePage.subscriptionTitle).toBeVisible();
      
      // Take screenshot of subscription section
      const screenshot = await homePage.page.screenshot();
      await AllureHelpers.addScreenshot('Subscription Section in Cart', screenshot);
    });

    await AllureHelpers.step('Subscribe to newsletter', async () => {
      // 6. Enter email address in input and click arrow button
      const testEmail = `test${Date.now()}@example.com`;
      await homePage.subscribeToNewsletter(testEmail);
      AllureHelpers.addParameter('Subscription Email', testEmail);
    });

    await AllureHelpers.step('Verify subscription success', async () => {
      // 7. Verify success message 'You have been successfully subscribed!' is visible
      await expect(homePage.subscriptionSuccessMessage).toBeVisible();
      await expect(homePage.subscriptionSuccessMessage).toContainText('You have been successfully subscribed!');
      
      // Take screenshot of success message
      const screenshot = await homePage.page.screenshot();
      await AllureHelpers.addScreenshot('Newsletter Subscription Success', screenshot);
    });
  });
});
