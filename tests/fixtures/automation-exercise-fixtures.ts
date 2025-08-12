import { test as base } from '@playwright/test';
import { AutomationExerciseHomePage } from '@pages/AutomationExerciseHomePage';
import { AutomationExerciseLoginPage } from '@pages/auth/AutomationExerciseLoginPage';
import { AutomationExerciseSignupPage } from '@pages/auth/AutomationExerciseSignupPage';
import { AutomationExerciseContactUsPage } from '@pages/AutomationExerciseContactUsPage';
import { AutomationExerciseProductsPage } from '@pages/AutomationExerciseProductsPage';
import { AutomationExerciseProductDetailPage } from '@pages/AutomationExerciseProductDetailPage';
import { AutomationExerciseCartPage } from '@pages/AutomationExerciseCartPage';

/**
 * Automation Exercise Page Fixtures
 * Provides page objects as fixtures for tests
 */
type AutomationExercisePageFixtures = {
  homePage: AutomationExerciseHomePage;
  loginPage: AutomationExerciseLoginPage;
  signupPage: AutomationExerciseSignupPage;
  contactPage: AutomationExerciseContactUsPage;
  productsPage: AutomationExerciseProductsPage;
  productDetailPage: AutomationExerciseProductDetailPage;
  cartPage: AutomationExerciseCartPage;
};

/**
 * Extended test with Automation Exercise page fixtures
 */
export const test = base.extend<AutomationExercisePageFixtures>({
  /**
   * Home page fixture
   */
  homePage: async ({ page }, use) => {
    const homePage = new AutomationExerciseHomePage(page);
    await use(homePage);
  },

  /**
   * Login page fixture
   */
  loginPage: async ({ page }, use) => {
    const loginPage = new AutomationExerciseLoginPage(page);
    await use(loginPage);
  },

  /**
   * Signup page fixture
   */
  signupPage: async ({ page }, use) => {
    const signupPage = new AutomationExerciseSignupPage(page);
    await use(signupPage);
  },

  /**
   * Contact page fixture
   */
  contactPage: async ({ page }, use) => {
    const contactPage = new AutomationExerciseContactUsPage(page);
    await use(contactPage);
  },

  /**
   * Products page fixture
   */
  productsPage: async ({ page }, use) => {
    const productsPage = new AutomationExerciseProductsPage(page);
    await use(productsPage);
  },

  /**
   * Product detail page fixture
   */
  productDetailPage: async ({ page }, use) => {
    const productDetailPage = new AutomationExerciseProductDetailPage(page);
    await use(productDetailPage);
  },

  /**
   * Cart page fixture
   */
  cartPage: async ({ page }, use) => {
    const cartPage = new AutomationExerciseCartPage(page);
    await use(cartPage);
  },
});

export { expect } from '@playwright/test';
