import { type Page, type Locator } from '@playwright/test';
import { BasePage } from '@pages/base/BasePage';

/**
 * Signup/Login Page Object for Automation Exercise
 */
export class AutomationExerciseLoginPage extends BasePage {
  readonly newUserSignupTitle: Locator;
  readonly loginToAccountTitle: Locator;
  readonly signupNameInput: Locator;
  readonly signupEmailInput: Locator;
  readonly signupButton: Locator;
  readonly loginEmailInput: Locator;
  readonly loginPasswordInput: Locator;
  readonly loginButton: Locator;
  readonly loginErrorMessage: Locator;
  readonly signupErrorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.newUserSignupTitle = page.locator('h2:has-text("New User Signup!")');
    this.loginToAccountTitle = page.locator('h2:has-text("Login to your account")');
    this.signupNameInput = page.locator('input[data-qa="signup-name"]');
    this.signupEmailInput = page.locator('input[data-qa="signup-email"]');
    this.signupButton = page.locator('button[data-qa="signup-button"]');
    this.loginEmailInput = page.locator('input[data-qa="login-email"]');
    this.loginPasswordInput = page.locator('input[data-qa="login-password"]');
    this.loginButton = page.locator('button[data-qa="login-button"]');
    this.loginErrorMessage = page.locator('p:has-text("Your email or password is incorrect!")');
    this.signupErrorMessage = page.locator('p:has-text("Email Address already exist!")');
  }

  async waitForPageReady(): Promise<void> {
    await super.waitForPageLoad();
    await this.waitForElement(this.newUserSignupTitle);
  }

  /**
   * Check if New User Signup section is visible
   */
  async isNewUserSignupVisible(): Promise<boolean> {
    return await this.newUserSignupTitle.isVisible();
  }

  /**
   * Check if Login to Account section is visible
   */
  async isLoginToAccountVisible(): Promise<boolean> {
    return await this.loginToAccountTitle.isVisible();
  }

  /**
   * Fill signup form and submit
   */
  async signupUser(name: string, email: string): Promise<void> {
    await this.signupNameInput.fill(name);
    await this.signupEmailInput.fill(email);
    await this.signupButton.click();
  }

  /**
   * Login with email and password
   */
  async loginUser(email: string, password: string): Promise<void> {
    await this.loginEmailInput.fill(email);
    await this.loginPasswordInput.fill(password);
    await this.loginButton.click();
  }

  /**
   * Check if login error is visible
   */
  async isLoginErrorVisible(): Promise<boolean> {
    return await this.loginErrorMessage.isVisible();
  }

  /**
   * Check if signup error is visible
   */
  async isSignupErrorVisible(): Promise<boolean> {
    return await this.signupErrorMessage.isVisible();
  }

  /**
   * Get login error message
   */
  async getLoginErrorMessage(): Promise<string> {
    return await this.loginErrorMessage.textContent() ?? '';
  }

  /**
   * Get signup error message
   */
  async getSignupErrorMessage(): Promise<string> {
    return await this.signupErrorMessage.textContent() ?? '';
  }
}
