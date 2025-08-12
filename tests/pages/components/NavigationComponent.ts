import { type Page, type Locator } from '@playwright/test';

/**
 * Reusable Navigation Component
 * Handles common navigation functionality across pages
 */
export class NavigationComponent {
  readonly page: Page;
  readonly homeLink: Locator;
  readonly aboutLink: Locator;
  readonly contactLink: Locator;
  readonly loginLink: Locator;
  readonly logoutButton: Locator;
  readonly profileDropdown: Locator;
  readonly userMenuButton: Locator;
  readonly cartIcon: Locator;
  readonly cartItemCount: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly mobileMenuButton: Locator;
  readonly navigationMenu: Locator;

  constructor(page: Page) {
    this.page = page;
    this.homeLink = page.getByRole('link', { name: 'Home' });
    this.aboutLink = page.getByRole('link', { name: 'About' });
    this.contactLink = page.getByRole('link', { name: 'Contact' });
    this.loginLink = page.getByRole('link', { name: 'Login' });
    this.logoutButton = page.getByRole('button', { name: 'Logout' });
    this.profileDropdown = page.getByTestId('profile-dropdown');
    this.userMenuButton = page.getByTestId('user-menu-button');
    this.cartIcon = page.getByTestId('cart-icon');
    this.cartItemCount = page.getByTestId('cart-item-count');
    this.searchInput = page.getByPlaceholder('Search...');
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.mobileMenuButton = page.getByTestId('mobile-menu-button');
    this.navigationMenu = page.getByRole('navigation');
  }

  /**
   * Navigate to home page
   */
  async goToHome(): Promise<void> {
    await this.homeLink.click();
  }

  /**
   * Navigate to about page
   */
  async goToAbout(): Promise<void> {
    await this.aboutLink.click();
  }

  /**
   * Navigate to contact page
   */
  async goToContact(): Promise<void> {
    await this.contactLink.click();
  }

  /**
   * Navigate to login page
   */
  async goToLogin(): Promise<void> {
    await this.loginLink.click();
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    await this.userMenuButton.click();
    await this.logoutButton.click();
  }

  /**
   * Open user profile dropdown
   */
  async openProfileDropdown(): Promise<void> {
    await this.profileDropdown.click();
  }

  /**
   * Get cart item count
   */
  async getCartItemCount(): Promise<number> {
    const countText = await this.cartItemCount.textContent();
    return parseInt(countText || '0', 10);
  }

  /**
   * Click on cart icon
   */
  async goToCart(): Promise<void> {
    await this.cartIcon.click();
  }

  /**
   * Search for items
   */
  async search(query: string): Promise<void> {
    await this.searchInput.fill(query);
    await this.searchButton.click();
  }

  /**
   * Check if user is logged in
   */
  async isLoggedIn(): Promise<boolean> {
    return await this.userMenuButton.isVisible();
  }

  /**
   * Toggle mobile menu
   */
  async toggleMobileMenu(): Promise<void> {
    await this.mobileMenuButton.click();
  }

  /**
   * Check if navigation menu is visible
   */
  async isNavigationVisible(): Promise<boolean> {
    return await this.navigationMenu.isVisible();
  }
}
