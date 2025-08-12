import { test } from '@fixtures/automation-exercise-fixtures';
import { expect } from '@playwright/test';
import { AllureHelpers, AutomationExerciseTestData } from '@utils/allure-helpers';

test.describe('TC25 - Verify Scroll Up Using Arrow Button', () => {
  test('TC25 - Verify Scroll Up Using Arrow Button @regression', async ({ 
    homePage 
  }) => {
    // Add Allure metadata
    AllureHelpers.addEpic(AutomationExerciseTestData.epic);
    AllureHelpers.addFeature(AutomationExerciseTestData.features.navigation);
    AllureHelpers.addStory(AutomationExerciseTestData.stories.pageNavigation);
    AllureHelpers.addSeverity('normal');
    AllureHelpers.addOwner('QA Team');
    AllureHelpers.addTestId('TC25');
    AllureHelpers.addDescription('Verify scroll up functionality using arrow button');
    AllureHelpers.addTag('regression');
    AllureHelpers.addTag('navigation');
    AllureHelpers.addTag('scroll-functionality');

    await AllureHelpers.step('Navigate to home page', async () => {
      // 1. Launch browser and navigate to url 'http://automationexercise.com'
      await homePage.navigateTo();
    });

    await AllureHelpers.step('Verify home page is visible', async () => {
      // 2. Verify that home page is visible successfully
      await expect(homePage.homePageCarousel).toBeVisible();
    });

    await AllureHelpers.step('Scroll down to bottom of page', async () => {
      // 3. Scroll down page to bottom
      await homePage.scrollToBottom();
    });

    await AllureHelpers.step('Verify subscription text is visible', async () => {
      // 4. Verify 'SUBSCRIPTION' is visible
      await expect(homePage.subscriptionTitle).toBeVisible();
      
      const screenshot = await homePage.page.screenshot();
      await AllureHelpers.addScreenshot('Page Bottom with Subscription', screenshot);
    });

    await AllureHelpers.step('Click scroll up arrow button', async () => {
      // 5. Click on arrow at bottom right side to move upward
      await homePage.clickScrollUpButton();
    });

    await AllureHelpers.step('Verify page scrolled up to top', async () => {
      // 6. Verify that page is scrolled up and 'Full-Fledged practice website for Automation Engineers' text is visible on screen
      await expect(homePage.fullFledgedText).toBeVisible();
      
      const screenshot = await homePage.page.screenshot();
      await AllureHelpers.addScreenshot('Page Scrolled to Top', screenshot);
    });
  });
});
