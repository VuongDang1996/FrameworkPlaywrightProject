import { type Page, type Locator } from '@playwright/test';

/**
 * Base Page class providing common functionality for all page objects
 * Implements common patterns and utilities shared across pages
 */
export abstract class BasePage {
  readonly page: Page;
  readonly loadingSpinner: Locator;
  readonly errorMessage: Locator;
  readonly successMessage: Locator;
  readonly pageTitle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loadingSpinner = page.getByTestId('loading-spinner');
    this.errorMessage = page.getByRole('alert').filter({ hasText: /error|failed/i });
    this.successMessage = page.getByRole('alert').filter({ hasText: /success|completed/i });
    this.pageTitle = page.getByRole('heading', { level: 1 });
  }

  /**
   * Wait for page to load completely
   */
  async waitForPageLoad(): Promise<void> {
    try {
      // Try networkidle first
      await this.page.waitForLoadState('networkidle', { timeout: 30000 });
    } catch (error) {
      console.log('Networkidle timeout, trying domcontentloaded...');
      try {
        // Fallback to domcontentloaded
        await this.page.waitForLoadState('domcontentloaded', { timeout: 30000 });
      } catch (secondError) {
        console.log('DOMContentLoaded timeout, trying load state...');
        // Final fallback to load
        await this.page.waitForLoadState('load', { timeout: 30000 });
      }
    }
    
    // Wait for loading spinner to disappear (if present)
    await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {
      // Loading spinner might not be present on all pages
    });
  }

  /**
   * Abstract method that must be implemented by each page
   * Should wait for page-specific elements to be ready
   */
  abstract waitForPageReady(): Promise<void>;

  /**
   * Get the current page title
   */
  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Get page heading text
   */
  async getPageHeading(): Promise<string> {
    return await this.pageTitle.textContent() ?? '';
  }

  /**
   * Check if error message is visible
   */
  async hasError(): Promise<boolean> {
    return await this.errorMessage.isVisible().catch(() => false);
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string> {
    if (await this.hasError()) {
      return await this.errorMessage.textContent() ?? '';
    }
    return '';
  }

  /**
   * Check if success message is visible
   */
  async hasSuccess(): Promise<boolean> {
    return await this.successMessage.isVisible().catch(() => false);
  }

  /**
   * Get success message text
   */
  async getSuccessMessage(): Promise<string> {
    if (await this.hasSuccess()) {
      return await this.successMessage.textContent() ?? '';
    }
    return '';
  }

  /**
   * Wait for an element to be visible
   */
  async waitForElement(locator: Locator, timeout = 10000): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  /**
   * Wait for an element to be hidden
   */
  async waitForElementHidden(locator: Locator, timeout = 10000): Promise<void> {
    await locator.waitFor({ state: 'hidden', timeout });
  }

  /**
   * Scroll element into view
   */
  async scrollToElement(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }

  /**
   * Take a screenshot of the current page
   */
  async takeScreenshot(name?: string): Promise<Buffer> {
    const screenshotName = name || `screenshot-${Date.now()}`;
    return await this.page.screenshot({ 
      path: `test-results/screenshots/${screenshotName}.png`,
      fullPage: true 
    });
  }

  /**
   * Wait for navigation to complete
   */
  async waitForNavigation(url?: string): Promise<void> {
    if (url) {
      await this.page.waitForURL(url);
    } else {
      await this.page.waitForLoadState('networkidle');
    }
  }

  /**
   * Refresh the current page
   */
  async refreshPage(): Promise<void> {
    await this.page.reload();
    await this.waitForPageLoad();
  }

  /**
   * Navigate back in browser history
   */
  async goBack(): Promise<void> {
    await this.page.goBack();
    await this.waitForPageLoad();
  }

  /**
   * Navigate forward in browser history
   */
  async goForward(): Promise<void> {
    await this.page.goForward();
    await this.waitForPageLoad();
  }

  /**
   * Get current URL
   */
  getCurrentUrl(): string {
    return this.page.url();
  }

  /**
   * Check if current URL matches pattern
   */
  isCurrentUrl(urlPattern: string | RegExp): boolean {
    const currentUrl = this.getCurrentUrl();
    if (typeof urlPattern === 'string') {
      return currentUrl.includes(urlPattern);
    }
    return urlPattern.test(currentUrl);
  }
}
