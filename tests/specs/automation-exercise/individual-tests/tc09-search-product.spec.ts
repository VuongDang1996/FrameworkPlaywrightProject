import { test } from '@fixtures/automation-exercise-fixtures';
import { expect } from '@playwright/test';
import { SEARCH_TERMS } from '@data/automation-exercise-data';
import { AllureHelpers, AutomationExerciseTestData } from '@utils/allure-helpers';

test.describe('TC09 - Search Product', () => {
  test('TC09 - Search Product @regression', async ({ 
    homePage, 
    productsPage 
  }) => {
    // Add Allure metadata
    AllureHelpers.addEpic(AutomationExerciseTestData.epic);
    AllureHelpers.addFeature(AutomationExerciseTestData.features.productCatalog);
    AllureHelpers.addStory(AutomationExerciseTestData.stories.productSearch);
    AllureHelpers.addSeverity('critical');
    AllureHelpers.addOwner('QA Team');
    AllureHelpers.addTestId('TC09');
    AllureHelpers.addDescription('Verify user can search for products and see relevant results');
    AllureHelpers.addTag('regression');
    AllureHelpers.addTag('search');
    AllureHelpers.addTag('products');

    await AllureHelpers.step('Navigate to home page', async () => {
      // 1. Launch browser and navigate to url 'http://automationexercise.com'
      await homePage.navigateTo();
    });

    await AllureHelpers.step('Verify home page is visible', async () => {
      // 2. Verify that home page is visible successfully
      await expect(homePage.homePageCarousel).toBeVisible();
    });

    await AllureHelpers.step('Navigate to products page', async () => {
      // 3. Click on 'Products' button
      await homePage.clickProducts();
    });

    await AllureHelpers.step('Verify all products page is displayed', async () => {
      // 4. Verify user is navigated to ALL PRODUCTS page successfully
      await expect(productsPage.allProductsTitle).toBeVisible();
    });

    await AllureHelpers.step('Search for products', async () => {
      // 5. Enter product name in search input and click search button
      await productsPage.searchProducts(SEARCH_TERMS.SHIRT);
      AllureHelpers.addParameter('Search Term', SEARCH_TERMS.SHIRT);
    });

    await AllureHelpers.step('Verify search results title is displayed', async () => {
      // 6. Verify 'SEARCHED PRODUCTS' is visible
      await expect(productsPage.searchedProductsTitle).toBeVisible();
    });

    await AllureHelpers.step('Verify search results are displayed', async () => {
      // 7. Verify all the products related to search are visible
      await expect(productsPage.searchResults.first()).toBeVisible();
      
      // Verify that there are search results
      const searchResultsCount = await productsPage.getSearchResultsCount();
      expect(searchResultsCount).toBeGreaterThan(0);
      
      AllureHelpers.addParameter('Search Results Count', searchResultsCount.toString());
      
      // Take screenshot of search results
      const screenshot = await productsPage.page.screenshot();
      await AllureHelpers.addScreenshot('Search Results', screenshot);
    });
  });
});
