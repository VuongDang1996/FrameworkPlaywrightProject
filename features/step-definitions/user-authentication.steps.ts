import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

// Authentication specific steps
When('I enter correct email {string} and password {string}', async function (this: CustomWorld, email: string, password: string) {
  await this.loginPage.loginUser(email, password);
});

When('I enter incorrect email {string} and password {string}', async function (this: CustomWorld, email: string, password: string) {
  await this.loginPage.loginUser(email, password);
});

Then('I should see error message {string}', async function (this: CustomWorld, errorMessage: string) {
  switch (errorMessage) {
    case 'Your email or password is incorrect!':
      await expect(this.loginPage.loginErrorMessage).toBeVisible();
      break;
    default:
      throw new Error(`Unknown error message: ${errorMessage}`);
  }
});

When('I login with valid credentials', async function (this: CustomWorld) {
  // Use test user credentials - this would need to be set up with actual test data
  await this.loginPage.loginUser('test@example.com', 'password123');
});

Then('I should be navigated to login page', async function (this: CustomWorld) {
  // Verify we're on login page by checking URL or page elements
  await expect(this.loginPage.loginToAccountTitle).toBeVisible();
});
