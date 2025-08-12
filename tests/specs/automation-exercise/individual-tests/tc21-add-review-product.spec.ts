import { test } from '@fixtures/automation-exercise-fixtures';
import { expect } from '@playwright/test';
import { SAMPLE_REVIEW_DATA } from '@data/automation-exercise-data';
import { AllureHelpers, AutomationExerciseTestData } from '@utils/allure-helpers';

test.describe('TC21 - Add Review on Product', () => {
  test('TC21 - Add Review on Product @regression', async ({ 
    homePage, 
    productsPage, 
    productDetailPage 
  }) => {
    // Add Allure metadata
    AllureHelpers.addEpic(AutomationExerciseTestData.epic);
    AllureHelpers.addFeature(AutomationExerciseTestData.features.productCatalog);
    AllureHelpers.addStory(AutomationExerciseTestData.stories.reviews);
    AllureHelpers.addSeverity('normal');
    AllureHelpers.addOwner('QA Team');
    AllureHelpers.addTestId('TC21');
    AllureHelpers.addDescription('Verify user can add review to product');
    AllureHelpers.addTag('regression');
    AllureHelpers.addTag('product-review');
    AllureHelpers.addTag('user-feedback');

    await AllureHelpers.step('Navigate to home page', async () => {
      // 1. Launch browser and navigate to url 'http://automationexercise.com'
      await homePage.navigateTo();
    });

    await AllureHelpers.step('Navigate to products page', async () => {
      // 2. Click on 'Products' button
      await homePage.clickProducts();
    });

    // 3. Verify user is navigated to ALL PRODUCTS page successfully
    await expect(productsPage.allProductsTitle).toBeVisible();

    // 4. Click on 'View Product' button
    await productsPage.clickViewProduct(0);

    // Wait for product detail page to load and scroll down to find review section
    await productDetailPage.page.waitForTimeout(2000);
    await productDetailPage.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await productDetailPage.page.waitForTimeout(1000);

    // Click on the "Write Your Review" tab link to make the review section visible
    await productDetailPage.page.locator('a:has-text("Write Your Review")').click();

    // 5. Verify 'Write Your Review' form elements are visible (name, email, review inputs)
    await expect(productDetailPage.reviewNameInput).toBeVisible();
    await expect(productDetailPage.reviewEmailInput).toBeVisible();
    await expect(productDetailPage.reviewTextarea).toBeVisible();

    // 6. Enter name, email and review
    await productDetailPage.writeReview(SAMPLE_REVIEW_DATA);

    // 7. Verify success message 'Thank you for your review.'
    await expect(productDetailPage.reviewSuccessMessage).toBeVisible();
    await expect(productDetailPage.reviewSuccessMessage).toContainText('Thank you for your review.');
  });
});
