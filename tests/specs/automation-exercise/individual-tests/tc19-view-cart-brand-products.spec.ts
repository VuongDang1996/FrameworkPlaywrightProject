import { test } from '@fixtures/automation-exercise-fixtures';
import { expect } from '@playwright/test';
import { BRANDS } from '@data/automation-exercise-data';
import { AllureHelpers, AutomationExerciseTestData } from '@utils/allure-helpers';

test.describe('TC19 - View & Cart Brand Products', () => {
  test('TC19 - View & Cart Brand Products @regression', async ({ 
    homePage,
    productsPage
  }) => {
    // Add Allure metadata
    AllureHelpers.addEpic(AutomationExerciseTestData.epic);
    AllureHelpers.addFeature(AutomationExerciseTestData.features.productCatalog);
    AllureHelpers.addStory(AutomationExerciseTestData.stories.productBrowsing);
    AllureHelpers.addSeverity('normal');
    AllureHelpers.addOwner('QA Team');
    AllureHelpers.addTestId('TC19');
    AllureHelpers.addDescription('Verify user can browse products by brands');
    AllureHelpers.addTag('regression');
    AllureHelpers.addTag('brands');
    AllureHelpers.addTag('product-browsing');

    await AllureHelpers.step('Navigate to home page', async () => {
      // 1. Launch browser and navigate to url 'http://automationexercise.com'
      await homePage.navigateTo();
    });

    await AllureHelpers.step('Navigate to products page', async () => {
      // 2. Click on 'Products' button
      await homePage.clickProducts();
    });

    await AllureHelpers.step('Verify brands sidebar is visible', async () => {
      // 3. Verify that Brands are visible on left side bar
      await expect(homePage.brandsSidebar).toBeVisible();
      
      const screenshot = await homePage.page.screenshot();
      await AllureHelpers.addScreenshot('Brands Sidebar', screenshot);
    });

    await AllureHelpers.step('Navigate to first brand', async () => {
      // 4. Click on any brand name
      await homePage.clickBrand(BRANDS.POLO);
      AllureHelpers.addParameter('Selected Brand', BRANDS.POLO);
    });

    await AllureHelpers.step('Verify first brand page', async () => {
      // 5. Verify that user is navigated to brand page and brand products are displayed
      const brandTitle = homePage.page.locator(`h2:has-text("${BRANDS.POLO}")`);
      await expect(brandTitle).toBeVisible();
      await expect(productsPage.productsList).toBeVisible();
      
      const screenshot = await homePage.page.screenshot();
      await AllureHelpers.addScreenshot('First Brand Page', screenshot);
    });

    await AllureHelpers.step('Navigate to second brand', async () => {
      // 6. On left side bar, click on any other brand link
      await homePage.clickBrand(BRANDS.H_AND_M);
      AllureHelpers.addParameter('Second Selected Brand', BRANDS.H_AND_M);
    });

    await AllureHelpers.step('Verify second brand page', async () => {
      // 7. Verify that user is navigated to that brand page and can see products
      const secondBrandTitle = homePage.page.locator(`h2:has-text("${BRANDS.H_AND_M}")`);
      await expect(secondBrandTitle).toBeVisible();
      await expect(productsPage.productsList).toBeVisible();
      
      const screenshot = await homePage.page.screenshot();
      await AllureHelpers.addScreenshot('Second Brand Page', screenshot);
    });
  });
});
