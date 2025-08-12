import { test as base } from '@playwright/test';
import { LoginPage } from '@pages/auth/LoginPage';
import { HomePage } from '@pages/HomePage';
import { NavigationComponent } from '@components/NavigationComponent';
import { FooterComponent } from '@components/FooterComponent';

/**
 * Page Object Model Fixtures
 * Provides page objects as fixtures for tests
 */
type PageFixtures = {
  loginPage: LoginPage;
  homePage: HomePage;
  navigation: NavigationComponent;
  footer: FooterComponent;
};

/**
 * Extended test with POM fixtures
 */
export const test = base.extend<PageFixtures>({
  /**
   * Login page fixture
   */
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  /**
   * Home page fixture
   */
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },

  /**
   * Navigation component fixture
   */
  navigation: async ({ page }, use) => {
    const navigation = new NavigationComponent(page);
    await use(navigation);
  },

  /**
   * Footer component fixture
   */
  footer: async ({ page }, use) => {
    const footer = new FooterComponent(page);
    await use(footer);
  },
});

export { expect } from '@playwright/test';
