import { test as base, Page } from '@playwright/test';
import { LoginPage } from '@pages/auth/LoginPage';
import { HomePage } from '@pages/HomePage';
import { NavigationComponent } from '@components/NavigationComponent';

/**
 * Authentication Fixtures
 * Provides authenticated user states for tests
 */
type AuthFixtures = {
  authenticatedPage: Page;
  loggedInHomePage: HomePage;
  authenticatedNavigation: NavigationComponent;
};

/**
 * Test user credentials
 */
const TEST_USER = {
  username: process.env.TEST_USERNAME || 'testuser@example.com',
  password: process.env.TEST_PASSWORD || 'password123',
};

/**
 * Extended test with authentication fixtures
 */
export const test = base.extend<AuthFixtures>({
  /**
   * Authenticated page fixture
   * Automatically logs in a user before the test
   */
  authenticatedPage: async ({ page }, use) => {
    // Navigate to login page and authenticate
    const loginPage = new LoginPage(page);
    await loginPage.navigateTo();
    
    const result = await loginPage.login({
      username: TEST_USER.username,
      password: TEST_USER.password,
    });

    if (!result.success) {
      throw new Error(`Authentication failed: ${result.errorMessage}`);
    }

    // Use the authenticated page
    await use(page);

    // Cleanup: logout after test
    try {
      const navigation = new NavigationComponent(page);
      if (await navigation.isLoggedIn()) {
        await navigation.logout();
      }
    } catch (error) {
      // Ignore logout errors in cleanup
      console.warn('Cleanup warning: Could not logout user');
    }
  },

  /**
   * Logged-in home page fixture
   */
  loggedInHomePage: async ({ authenticatedPage }, use) => {
    const homePage = new HomePage(authenticatedPage);
    await homePage.navigateTo();
    await use(homePage);
  },

  /**
   * Authenticated navigation fixture
   */
  authenticatedNavigation: async ({ authenticatedPage }, use) => {
    const navigation = new NavigationComponent(authenticatedPage);
    await use(navigation);
  },
});

export { expect } from '@playwright/test';
