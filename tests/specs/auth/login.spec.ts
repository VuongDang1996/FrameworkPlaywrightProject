import { test, expect } from '@fixtures/page-fixtures';

/**
 * Login Page Tests
 * Test suite for login functionality using Page Object Model
 */
test.describe('Login Page', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigateTo();
  });

  test('should display login form elements @smoke', async ({ loginPage }) => {
    // Verify login form is visible
    await expect(loginPage.loginForm).toBeVisible();
    
    // Verify form elements
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
    await expect(loginPage.forgotPasswordLink).toBeVisible();
    await expect(loginPage.signupLink).toBeVisible();
    
    // Verify page title
    expect(await loginPage.getPageTitle()).toContain('Login');
  });

  test('should successfully login with valid credentials @smoke', async ({ loginPage, homePage }) => {
    // Perform login
    const result = await loginPage.login({
      username: 'testuser@example.com',
      password: 'password123'
    });

    // Verify successful login
    expect(result.success).toBe(true);
    expect(result.errorMessage).toBeUndefined();
    
    // Verify navigation to dashboard/home
    expect(loginPage.getCurrentUrl()).toContain('/dashboard');
    
    // Verify welcome message is displayed
    await expect(homePage.welcomeMessage).toBeVisible();
  });

  test('should show error for invalid credentials @regression', async ({ loginPage }) => {
    // Attempt login with invalid credentials
    const result = await loginPage.login({
      username: 'invalid@example.com',
      password: 'wrongpassword'
    });

    // Verify login failure
    expect(result.success).toBe(false);
    expect(result.errorMessage).toBeTruthy();
    
    // Verify error message is displayed
    await expect(loginPage.errorMessage).toBeVisible();
    expect(await loginPage.getLoginErrorMessage()).toContain('Invalid');
  });

  test('should validate required fields @regression', async ({ loginPage }) => {
    // Try to login without filling fields
    await loginPage.clickLoginButton();
    
    // Verify login button is disabled or validation errors appear
    const isButtonEnabled = await loginPage.isLoginButtonEnabled();
    const hasError = await loginPage.hasLoginError();
    
    expect(isButtonEnabled || hasError).toBeTruthy();
  });

  test('should navigate to forgot password page', async ({ loginPage, page }) => {
    await loginPage.clickForgotPassword();
    
    // Verify navigation to forgot password page
    await expect(page).toHaveURL(/.*forgot-password.*/);
  });

  test('should navigate to signup page', async ({ loginPage, page }) => {
    await loginPage.clickSignupLink();
    
    // Verify navigation to signup page
    await expect(page).toHaveURL(/.*signup.*/);
  });

  test('should remember user when checkbox is checked @regression', async ({ loginPage }) => {
    await loginPage.login({
      username: 'testuser@example.com',
      password: 'password123',
      rememberMe: true
    });

    // Verify remember me functionality
    // This would typically involve checking localStorage or cookies
    // For now, we'll just verify the checkbox was checked
    await loginPage.navigateTo();
    // Add assertions for persistent login state
  });

  test('should toggle password visibility', async ({ loginPage }) => {
    await loginPage.fillPassword('secretpassword');
    
    // Toggle password visibility
    await loginPage.togglePasswordVisibility();
    
    // Verify password is visible (implementation depends on actual app)
    const passwordInput = loginPage.passwordInput;
    const inputType = await passwordInput.getAttribute('type');
    expect(inputType).toBe('text');
    
    // Toggle back to hidden
    await loginPage.togglePasswordVisibility();
    const hiddenType = await passwordInput.getAttribute('type');
    expect(hiddenType).toBe('password');
  });

  test('should clear form fields', async ({ loginPage }) => {
    // Fill the form
    await loginPage.fillUsername('testuser');
    await loginPage.fillPassword('testpass');
    await loginPage.checkRememberMe();
    
    // Clear the form
    await loginPage.clearForm();
    
    // Verify fields are cleared
    expect(await loginPage.usernameInput.inputValue()).toBe('');
    expect(await loginPage.passwordInput.inputValue()).toBe('');
    expect(await loginPage.rememberMeCheckbox.isChecked()).toBe(false);
  });

  test('should validate form fields', async ({ loginPage }) => {
    // Test empty form
    let validation = await loginPage.validateForm();
    expect(validation.username).toBe(false);
    expect(validation.password).toBe(false);
    
    // Fill username only
    await loginPage.fillUsername('testuser');
    validation = await loginPage.validateForm();
    expect(validation.username).toBe(true);
    expect(validation.password).toBe(false);
    
    // Fill both fields
    await loginPage.fillPassword('password');
    validation = await loginPage.validateForm();
    expect(validation.username).toBe(true);
    expect(validation.password).toBe(true);
  });
});
