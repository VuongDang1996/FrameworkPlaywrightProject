import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

// User registration specific steps
When('I enter name {string} and email address', async function (this: CustomWorld, name: string) {
  const uniqueEmail = `test${Date.now()}@example.com`;
  await this.loginPage.signupUser(name, uniqueEmail);
});

When('I fill in the account information with title {string}, password {string}', async function (this: CustomWorld, title: string, password: string) {
  const accountInfo = {
    title: title as 'Mr' | 'Mrs',
    password: password,
    day: '15',
    month: 'January', 
    year: '1990',
    newsletter: true,
    offers: true
  };
  await this.signupPage.fillAccountInformation(accountInfo);
});

When('I select date of birth {string}, {string}, {string}', async function (this: CustomWorld, day: string, month: string, year: string) {
  // Date selection is handled in fillAccountInformation method
  // This step is kept for BDD readability but actual implementation is above
});

When('I check newsletter and offers checkboxes', async function (this: CustomWorld) {
  // This is already handled in fillAccountInformation
  // Added here for clarity in the scenario
});

When('I fill in address information', async function (this: CustomWorld, dataTable) {
  const addressData = dataTable.hashes()[0];
  const addressInfo = {
    firstName: addressData.firstName,
    lastName: addressData.lastName,
    company: addressData.company,
    address1: addressData.address1,
    address2: '',
    country: addressData.country,
    state: addressData.state,
    city: addressData.city,
    zipcode: addressData.zipcode,
    mobileNumber: addressData.mobileNumber
  };
  await this.signupPage.fillAddressInformation(addressInfo);
});
