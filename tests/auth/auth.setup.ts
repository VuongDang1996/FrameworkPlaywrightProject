import { test as setup, expect } from '@playwright/test';
import { TEST_USERS } from '@data/automation-exercise-data';

const authFile = 'tests/auth/user.json';

setup('authenticate', async ({ page }) => {
  // Navigate to login page
  await page.goto('/login');
  
  // Wait for page to load
  await page.waitForLoadState('networkidle');
  
  // Fill login form
  await page.locator('input[data-qa="login-email"]').fill(TEST_USERS.VALID_USER.email);
  await page.locator('input[data-qa="login-password"]').fill(TEST_USERS.VALID_USER.password);
  
  // Click login button
  await page.locator('button[data-qa="login-button"]').click();
  
  // Wait for successful login - check for logged in user element
  await page.waitForSelector('li:has-text("Logged in as")', { timeout: 10000 });
  
  // Verify login was successful
  await expect(page.locator('li:has-text("Logged in as")')).toBeVisible();
  
  // Save authentication state
  await page.context().storageState({ path: authFile });
});
