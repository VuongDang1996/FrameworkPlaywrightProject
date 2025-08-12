import { test } from '@fixtures/automation-exercise-fixtures';
import { expect } from '@playwright/test';
import { AllureHelpers, AutomationExerciseTestData } from '@utils/allure-helpers';

test.describe('TC08 - Verify All Products and Product Detail Page', () => {
  test('TC08 - Verify All Products and Product Detail Page @smoke', async ({ 
    homePage, 
    productsPage, 
    productDetailPage 
  }) => {
    // Add Allure metadata
    AllureHelpers.addEpic(AutomationExerciseTestData.epic);
    AllureHelpers.addFeature(AutomationExerciseTestData.features.productCatalog);
    AllureHelpers.addStory(AutomationExerciseTestData.stories.productBrowsing);
    AllureHelpers.addSeverity('critical');
    AllureHelpers.addOwner('QA Team');
    AllureHelpers.addTestId('TC08');
    AllureHelpers.addDescription('Verify all products page and product detail page display correct information');
    AllureHelpers.addTag('smoke');
    AllureHelpers.addTag('products');
    AllureHelpers.addTag('product-details');

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

    await AllureHelpers.step('Verify products list is visible', async () => {
      // 5. The products list is visible
      await expect(productsPage.productsList).toBeVisible();
      
      // Take screenshot of products page
      const screenshot = await productsPage.page.screenshot();
      await AllureHelpers.addScreenshot('All Products Page', screenshot);
    });

    await AllureHelpers.step('Navigate to first product detail', async () => {
      // 6. Click on 'View Product' of first product
      await productsPage.clickViewProduct(0);
      AllureHelpers.addParameter('Product Index', '0 (first product)');
    });

    await AllureHelpers.step('Verify product detail page is loaded', async () => {
      // 7. User is landed to product detail page
      await expect(productDetailPage.productName).toBeVisible();
    });

    await AllureHelpers.step('Verify all product details are visible', async () => {
      // 8. Verify that detail is visible: product name, category, price, availability, condition, brand
      await expect(productDetailPage.productName).toBeVisible();
      await expect(productDetailPage.productCategory).toBeVisible();
      await expect(productDetailPage.productPrice).toBeVisible();
      await expect(productDetailPage.productAvailability).toBeVisible();
      await expect(productDetailPage.productCondition).toBeVisible();
      await expect(productDetailPage.productBrand).toBeVisible();
      
      // Capture product details for reporting
      const productName = await productDetailPage.productName.textContent();
      const productPrice = await productDetailPage.productPrice.textContent();
      const productCategory = await productDetailPage.productCategory.textContent();
      
      AllureHelpers.addParameter('Product Name', productName || 'N/A');
      AllureHelpers.addParameter('Product Price', productPrice || 'N/A');
      AllureHelpers.addParameter('Product Category', productCategory || 'N/A');
      
      // Take screenshot of product detail page
      const screenshot = await productDetailPage.page.screenshot();
      await AllureHelpers.addScreenshot('Product Detail Page', screenshot);
    });
  });
});
