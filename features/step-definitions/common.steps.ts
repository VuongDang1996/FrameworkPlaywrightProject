import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

// Common navigation steps
Given('I navigate to the home page', async function (this: CustomWorld) {
  await this.automationExerciseHomePage.navigateTo();
});

// Common verification steps
When('I verify that home page is visible successfully', async function (this: CustomWorld) {
  await expect(this.automationExerciseHomePage.homePageCarousel).toBeVisible();
  await expect(this.automationExerciseHomePage.featuresItems).toBeVisible();
});

// Common button click steps
When('I click on {string} button', async function (this: CustomWorld, buttonName: string) {
  switch (buttonName) {
    case 'Signup / Login':
      await this.automationExerciseHomePage.clickSignupLogin();
      break;
    case 'Signup':
      await this.loginPage.signupButton.click();
      break;
    case 'Login':
      await this.loginPage.loginButton.click();
      break;
    case 'Logout':
      await this.automationExerciseHomePage.clickLogout();
      break;
    case 'Create Account':
      await this.signupPage.clickCreateAccount();
      break;
    case 'Continue':
      await this.signupPage.clickContinue();
      break;
    case 'Delete Account':
      await this.automationExerciseHomePage.clickDeleteAccount();
      break;
    case 'Test Cases':
      await this.automationExerciseHomePage.clickTestCases();
      break;
    case 'Products':
      await this.automationExerciseHomePage.clickProducts();
      break;
    case 'Continue Shopping':
      await this.productsPage.clickContinueShopping();
      break;
    case 'View Cart':
      await this.productsPage.clickViewCart();
      break;
    default:
      throw new Error(`Unknown button: ${buttonName}`);
  }
});

When('I click {string} button', async function (this: CustomWorld, buttonName: string) {
  // This is an alias for the main click handler - same implementation
  switch (buttonName) {
    case 'Signup / Login':
      await this.automationExerciseHomePage.clickSignupLogin();
      break;
    case 'Signup':
      await this.loginPage.signupButton.click();
      break;
    case 'Login':
      await this.loginPage.loginButton.click();
      break;
    case 'Logout':
      await this.automationExerciseHomePage.clickLogout();
      break;
    case 'Create Account':
      await this.signupPage.clickCreateAccount();
      break;
    case 'Continue':
      await this.signupPage.clickContinue();
      break;
    case 'Delete Account':
      await this.automationExerciseHomePage.clickDeleteAccount();
      break;
    default:
      throw new Error(`Unknown button: ${buttonName}`);
  }
});

// Common visibility verification steps
Then('I should see {string} is visible', async function (this: CustomWorld, text: string) {
  switch (text) {
    case 'New User Signup!':
      await expect(this.loginPage.newUserSignupTitle).toBeVisible();
      break;
    case 'Login to your account':
      await expect(this.loginPage.loginToAccountTitle).toBeVisible();
      break;
    case 'ENTER ACCOUNT INFORMATION':
      await expect(this.signupPage.accountInfoTitle).toBeVisible();
      break;
    case 'ACCOUNT CREATED!':
      await expect(this.signupPage.accountCreatedTitle).toBeVisible();
      break;
    case 'Logged in as username':
      await expect(this.automationExerciseHomePage.loggedInAsUser).toBeVisible();
      break;
    case 'ACCOUNT DELETED!':
      await expect(this.signupPage.accountDeletedTitle).toBeVisible();
      break;
    case 'SEARCHED PRODUCTS':
      await expect(this.productsPage.searchedProductsTitle).toBeVisible();
      break;
    default:
      throw new Error(`Unknown text to verify: ${text}`);
  }
});
