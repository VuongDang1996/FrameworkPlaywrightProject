import { type Page, type Locator } from '@playwright/test';
import { BasePage } from '@pages/base/BasePage';

/**
 * Signup Page Object for Account Information
 */
export class AutomationExerciseSignupPage extends BasePage {
  readonly accountInfoTitle: Locator;
  readonly titleMr: Locator;
  readonly titleMrs: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly daySelect: Locator;
  readonly monthSelect: Locator;
  readonly yearSelect: Locator;
  readonly newsletterCheckbox: Locator;
  readonly offersCheckbox: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly companyInput: Locator;
  readonly address1Input: Locator;
  readonly address2Input: Locator;
  readonly countrySelect: Locator;
  readonly stateInput: Locator;
  readonly cityInput: Locator;
  readonly zipcodeInput: Locator;
  readonly mobileNumberInput: Locator;
  readonly createAccountButton: Locator;
  readonly accountCreatedTitle: Locator;
  readonly continueButton: Locator;
  readonly accountDeletedTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.accountInfoTitle = page.locator('h2:has-text("Enter Account Information")');
    this.titleMr = page.locator('#id_gender1');
    this.titleMrs = page.locator('#id_gender2');
    this.nameInput = page.locator('#name');
    this.emailInput = page.locator('#email');
    this.passwordInput = page.locator('#password');
    this.daySelect = page.locator('#days');
    this.monthSelect = page.locator('#months');
    this.yearSelect = page.locator('#years');
    this.newsletterCheckbox = page.locator('#newsletter');
    this.offersCheckbox = page.locator('#optin');
    this.firstNameInput = page.locator('#first_name');
    this.lastNameInput = page.locator('#last_name');
    this.companyInput = page.locator('#company');
    this.address1Input = page.locator('#address1');
    this.address2Input = page.locator('#address2');
    this.countrySelect = page.locator('#country');
    this.stateInput = page.locator('#state');
    this.cityInput = page.locator('#city');
    this.zipcodeInput = page.locator('#zipcode');
    this.mobileNumberInput = page.locator('#mobile_number');
    this.createAccountButton = page.locator('button[data-qa="create-account"]');
    this.accountCreatedTitle = page.locator('h2[data-qa="account-created"]');
    this.continueButton = page.locator('a[data-qa="continue-button"]');
    this.accountDeletedTitle = page.locator('h2[data-qa="account-deleted"]');
  }

  async waitForPageReady(): Promise<void> {
    await super.waitForPageLoad();
    await this.waitForElement(this.accountInfoTitle);
  }

  /**
   * Check if Enter Account Information is visible
   */
  async isAccountInfoTitleVisible(): Promise<boolean> {
    return await this.accountInfoTitle.isVisible();
  }

  /**
   * Fill account information form
   */
  async fillAccountInformation(accountData: {
    title: 'Mr' | 'Mrs';
    password: string;
    day: string;
    month: string;
    year: string;
    newsletter?: boolean;
    offers?: boolean;
  }): Promise<void> {
    // Select title
    if (accountData.title === 'Mr') {
      await this.titleMr.check();
    } else {
      await this.titleMrs.check();
    }

    // Fill password
    await this.passwordInput.fill(accountData.password);

    // Select date of birth
    await this.daySelect.selectOption(accountData.day);
    await this.monthSelect.selectOption(accountData.month);
    await this.yearSelect.selectOption(accountData.year);

    // Check optional checkboxes
    if (accountData.newsletter) {
      await this.newsletterCheckbox.check();
    }

    if (accountData.offers) {
      await this.offersCheckbox.check();
    }
  }

  /**
   * Fill address information
   */
  async fillAddressInformation(addressData: {
    firstName: string;
    lastName: string;
    company: string;
    address1: string;
    address2?: string;
    country: string;
    state: string;
    city: string;
    zipcode: string;
    mobileNumber: string;
  }): Promise<void> {
    await this.firstNameInput.fill(addressData.firstName);
    await this.lastNameInput.fill(addressData.lastName);
    await this.companyInput.fill(addressData.company);
    await this.address1Input.fill(addressData.address1);
    
    if (addressData.address2) {
      await this.address2Input.fill(addressData.address2);
    }

    await this.countrySelect.selectOption(addressData.country);
    await this.stateInput.fill(addressData.state);
    await this.cityInput.fill(addressData.city);
    await this.zipcodeInput.fill(addressData.zipcode);
    await this.mobileNumberInput.fill(addressData.mobileNumber);
  }

  /**
   * Click Create Account button
   */
  async clickCreateAccount(): Promise<void> {
    await this.createAccountButton.click();
  }

  /**
   * Check if Account Created message is visible
   */
  async isAccountCreatedVisible(): Promise<boolean> {
    return await this.accountCreatedTitle.isVisible();
  }

  /**
   * Click Continue button
   */
  async clickContinue(): Promise<void> {
    await this.continueButton.click();
  }

  /**
   * Check if Account Deleted message is visible
   */
  async isAccountDeletedVisible(): Promise<boolean> {
    return await this.accountDeletedTitle.isVisible();
  }
}
