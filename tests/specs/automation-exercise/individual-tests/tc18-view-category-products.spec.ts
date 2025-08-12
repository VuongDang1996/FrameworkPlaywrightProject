import { test } from '@fixtures/automation-exercise-fixtures';
import { expect } from '@playwright/test';
import { CATEGORIES } from '@data/automation-exercise-data';
import { AllureHelpers, AutomationExerciseTestData } from '@utils/allure-helpers';

test.describe('TC18 - View Category Products', () => {
  test('TC18 - View Category Products @regression', async ({ 
    homePage
  }) => {
    // Add Allure metadata
    AllureHelpers.addEpic(AutomationExerciseTestData.epic);
    AllureHelpers.addFeature(AutomationExerciseTestData.features.productCatalog);
    AllureHelpers.addStory(AutomationExerciseTestData.stories.productBrowsing);
    AllureHelpers.addSeverity('normal');
    AllureHelpers.addOwner('QA Team');
    AllureHelpers.addTestId('TC18');
    AllureHelpers.addDescription('Verify user can browse products by categories');
    AllureHelpers.addTag('regression');
    AllureHelpers.addTag('categories');
    AllureHelpers.addTag('product-browsing');

    await AllureHelpers.step('Navigate to home page', async () => {
      // 1. Launch browser and navigate to url 'http://automationexercise.com'
      await homePage.navigateTo();
    });

    await AllureHelpers.step('Verify categories sidebar is visible', async () => {
      // 2. Verify that categories are visible on left side bar
      await expect(homePage.categoriesSidebar).toBeVisible();
      
      const screenshot = await homePage.page.screenshot();
      await AllureHelpers.addScreenshot('Categories Sidebar', screenshot);
    });

    await AllureHelpers.step('Navigate to Women category', async () => {
      // 3. Click on 'Women' category
      await homePage.clickWomenCategory();
    });

    await AllureHelpers.step('Navigate to Women Dress subcategory', async () => {
      // 4. Click on any category link under 'Women' category, for example: Dress
      await homePage.clickWomenSubcategory(CATEGORIES.WOMEN.DRESS);
      AllureHelpers.addParameter('Selected Category', 'Women - Dress');
    });

    await AllureHelpers.step('Verify women dress category page', async () => {
      // 5. Verify that category page is displayed and confirm text 'WOMEN - DRESS PRODUCTS'
      const categoryTitle = homePage.page.locator('h2:has-text("Women -"), h2:has-text("Dress")');
      await expect(categoryTitle).toBeVisible();
      
      const screenshot = await homePage.page.screenshot();
      await AllureHelpers.addScreenshot('Women Dress Category Page', screenshot);
    });

    await AllureHelpers.step('Navigate to Men category', async () => {
      // 6. On left side bar, click on any sub-category link of 'Men' category
      await homePage.clickMenCategory();
      await homePage.clickMenSubcategory(CATEGORIES.MEN.TSHIRTS);
      AllureHelpers.addParameter('Selected Category', 'Men - T-shirts');
    });

    await AllureHelpers.step('Verify men t-shirts category page', async () => {
      // 7. Verify that user is navigated to that category page
      const menCategoryTitle = homePage.page.locator('h2:has-text("Men -"), h2:has-text("Tshirts")');
      await expect(menCategoryTitle).toBeVisible();
      
      const screenshot = await homePage.page.screenshot();
      await AllureHelpers.addScreenshot('Men T-shirts Category Page', screenshot);
    });
  });
});
