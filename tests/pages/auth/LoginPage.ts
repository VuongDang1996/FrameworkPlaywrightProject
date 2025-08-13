import { type Page, type Locator } from '@playwright/test';
import { BasePage } from '@pages/base/BasePage';
import { NavigationComponent } from '@components/NavigationComponent';
import { type UserCredentials, type LoginResult } from '@interfaces/index';

/**
 * Login Page Object
 * Encapsulates all login page interactions and elements
 */
export class LoginPage extends BasePage {
  readonly navigation: NavigationComponent;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly rememberMeCheckbox: Locator;
  readonly loginButton: Locator;
  readonly forgotPasswordLink: Locator;
  readonly signupLink: Locator;
  readonly errorMessage: Locator;
  readonly successMessage: Locator;
  readonly loginForm: Locator;
  readonly showPasswordButton: Locator;
  readonly socialLoginButtons: Locator;
  readonly googleLoginButton: Locator;
  readonly facebookLoginButton: Locator;
  readonly loginTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.navigation = new NavigationComponent(page);
    this.usernameInput = page.getByLabel('Username');
    this.passwordInput = page.getByLabel('Password');
    this.rememberMeCheckbox = page.getByLabel('Remember me');
    this.loginButton = page.getByRole('button', { name: 'Sign in' });
    this.forgotPasswordLink = page.getByRole('link', { name: 'Forgot password?' });
    this.signupLink = page.getByRole('link', { name: 'Sign up' });
    this.errorMessage = page.getByTestId('login-error-message');
    this.successMessage = page.getByTestId('login-success-message');
    this.loginForm = page.getByTestId('login-form');
    this.showPasswordButton = page.getByTestId('show-password-button');
    this.socialLoginButtons = page.getByTestId('social-login-buttons');
    this.googleLoginButton = page.getByRole('button', { name: 'Sign in with Google' });
    this.facebookLoginButton = page.getByRole('button', { name: 'Sign in with Facebook' });
    this.loginTitle = page.getByRole('heading', { name: 'Sign In' });
  }

  /**
   * Navigate to login page
   */
  async navigateTo(): Promise<void> {
    try {
      // Try with load event first
      await this.page.goto('/login', { waitUntil: 'load', timeout: 60000 });
    } catch (error) {
      console.log('Load event timeout, trying with networkidle...');
      try {
        // Fallback to networkidle
        await this.page.goto('/login', { waitUntil: 'networkidle', timeout: 60000 });
      } catch (secondError) {
        console.log('Networkidle timeout, trying with domcontentloaded...');
        // Final fallback to domcontentloaded
        await this.page.goto('/login', { waitUntil: 'domcontentloaded', timeout: 60000 });
      }
    }
    await this.waitForPageReady();
  }

  /**
   * Wait for login page to be ready
   */
  async waitForPageReady(): Promise<void> {
    await super.waitForPageLoad();
    await this.waitForElement(this.loginForm);
    await this.waitForElement(this.usernameInput);
    await this.waitForElement(this.passwordInput);
    await this.waitForElement(this.loginButton);
  }

  /**
   * Login with credentials
   */
  async login(credentials: UserCredentials): Promise<LoginResult> {
    try {
      await this.fillUsername(credentials.username);
      await this.fillPassword(credentials.password);
      
      if (credentials.rememberMe) {
        await this.checkRememberMe();
      }
      
      await this.clickLoginButton();
      
      // Wait for either success navigation or error message
      await Promise.race([
        this.page.waitForURL('/dashboard', { timeout: 5000 }),
        this.errorMessage.waitFor({ state: 'visible', timeout: 5000 })
      ]);

      // Check if login was successful
      if (await this.hasLoginError()) {
        const errorText = await this.getLoginErrorMessage();
        return { success: false, errorMessage: errorText };
      }

      return { 
        success: true, 
        redirectUrl: this.getCurrentUrl() 
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return { 
        success: false, 
        errorMessage: `Login failed: ${errorMessage}` 
      };
    }
  }

  /**
   * Quick login method for testing
   */
  async quickLogin(username: string, password: string): Promise<void> {
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickLoginButton();
  }

  /**
   * Fill username field
   */
  async fillUsername(username: string): Promise<void> {
    await this.usernameInput.clear();
    await this.usernameInput.fill(username);
  }

  /**
   * Fill password field
   */
  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.clear();
    await this.passwordInput.fill(password);
  }

  /**
   * Check remember me checkbox
   */
  async checkRememberMe(): Promise<void> {
    await this.rememberMeCheckbox.check();
  }

  /**
   * Click login button
   */
  async clickLoginButton(): Promise<void> {
    await this.loginButton.click();
  }

  /**
   * Click forgot password link
   */
  async clickForgotPassword(): Promise<void> {
    await this.forgotPasswordLink.click();
  }

  /**
   * Click signup link
   */
  async clickSignupLink(): Promise<void> {
    await this.signupLink.click();
  }

  /**
   * Toggle password visibility
   */
  async togglePasswordVisibility(): Promise<void> {
    await this.showPasswordButton.click();
  }

  /**
   * Login with Google
   */
  async loginWithGoogle(): Promise<void> {
    await this.googleLoginButton.click();
  }

  /**
   * Login with Facebook
   */
  async loginWithFacebook(): Promise<void> {
    await this.facebookLoginButton.click();
  }

  /**
   * Check if login error is visible
   */
  async hasLoginError(): Promise<boolean> {
    return await this.errorMessage.isVisible().catch(() => false);
  }

  /**
   * Get login error message
   */
  async getLoginErrorMessage(): Promise<string> {
    if (await this.hasLoginError()) {
      return await this.errorMessage.textContent() ?? '';
    }
    return '';
  }

  /**
   * Check if login success message is visible
   */
  async hasLoginSuccess(): Promise<boolean> {
    return await this.successMessage.isVisible().catch(() => false);
  }

  /**
   * Get login success message
   */
  async getLoginSuccessMessage(): Promise<string> {
    if (await this.hasLoginSuccess()) {
      return await this.successMessage.textContent() ?? '';
    }
    return '';
  }

  /**
   * Check if login form is visible
   */
  async isLoginFormVisible(): Promise<boolean> {
    return await this.loginForm.isVisible();
  }

  /**
   * Check if social login options are available
   */
  async areSocialLoginsAvailable(): Promise<boolean> {
    return await this.socialLoginButtons.isVisible();
  }

  /**
   * Get login page title
   */
  async getLoginTitle(): Promise<string> {
    return await this.loginTitle.textContent() ?? '';
  }

  /**
   * Clear login form
   */
  async clearForm(): Promise<void> {
    await this.usernameInput.clear();
    await this.passwordInput.clear();
    if (await this.rememberMeCheckbox.isChecked()) {
      await this.rememberMeCheckbox.uncheck();
    }
  }

  /**
   * Check if login button is enabled
   */
  async isLoginButtonEnabled(): Promise<boolean> {
    return await this.loginButton.isEnabled();
  }

  /**
   * Validate form fields
   */
  async validateForm(): Promise<{ username: boolean; password: boolean }> {
    const usernameValue = await this.usernameInput.inputValue();
    const passwordValue = await this.passwordInput.inputValue();
    
    return {
      username: usernameValue.length > 0,
      password: passwordValue.length > 0
    };
  }
}
