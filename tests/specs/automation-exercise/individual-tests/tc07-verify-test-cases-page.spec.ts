import { test } from '@fixtures/automation-exercise-fixtures';
import { expect } from '@playwright/test';
import { AllureHelpers, AutomationExerciseTestData } from '@utils/allure-helpers';

test.describe('TC07 - Verify Test Cases Page', () => {
  test('TC07 - Verify Test Cases Page @smoke', async ({ 
    homePage
  }) => {
    // Add Allure metadata
    AllureHelpers.addEpic(AutomationExerciseTestData.epic);
    AllureHelpers.addFeature(AutomationExerciseTestData.features.navigation);
    AllureHelpers.addStory(AutomationExerciseTestData.stories.pageNavigation);
    AllureHelpers.addSeverity('normal');
    AllureHelpers.addOwner('QA Team');
    AllureHelpers.addTestId('TC07');
    AllureHelpers.addDescription('Verify user can navigate to test cases page successfully');
    AllureHelpers.addTag('smoke');
    AllureHelpers.addTag('navigation');
    AllureHelpers.addTag('test-cases');

    await AllureHelpers.step('Navigate to home page', async () => {
      // 1. Launch browser and navigate to url 'http://automationexercise.com'
      await homePage.navigateTo();
    });

    await AllureHelpers.step('Verify home page is visible', async () => {
      // 2. Verify that home page is visible successfully
      await expect(homePage.homePageCarousel).toBeVisible();
    });

    await AllureHelpers.step('Navigate to test cases page', async () => {
      // 3. Click on 'Test Cases' button
      await homePage.clickTestCases();
    });

    await AllureHelpers.step('Verify test cases page is displayed', async () => {
      // 4. Verify user is navigated to test cases page successfully
      await expect(homePage.page).toHaveURL(/.*test_cases/);
      
      // Additional verification - check if the page has test cases content
      const testCasesTitle = homePage.page.locator('h2:has-text("Test Cases")');
      await expect(testCasesTitle).toBeVisible();
      
      // Take screenshot of test cases page
      const screenshot = await homePage.page.screenshot();
      await AllureHelpers.addScreenshot('Test Cases Page', screenshot);
      
      AllureHelpers.addParameter('Test Cases Page URL', await homePage.page.url());
    });
  });
});
