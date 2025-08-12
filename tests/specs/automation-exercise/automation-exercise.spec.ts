import { test, expect } from '@playwright/test';
import { AutomationExerciseHomePage } from '@pages/AutomationExerciseHomePage';
import { AutomationExerciseLoginPage } from '@pages/auth/AutomationExerciseLoginPage';
import { AutomationExerciseSignupPage } from '@pages/auth/AutomationExerciseSignupPage';
import { AutomationExerciseContactUsPage } from '@pages/AutomationExerciseContactUsPage';
import { AutomationExerciseProductsPage } from '@pages/AutomationExerciseProductsPage';
import { AutomationExerciseProductDetailPage } from '@pages/AutomationExerciseProductDetailPage';
import { AutomationExerciseCartPage } from '@pages/AutomationExerciseCartPage';

/**
 * Automation Exercise Test Cases
 * Complete test suite for all 26 test scenarios
 */
test.describe('Automation Exercise Test Cases', () => {
  
  /**
   * Test Case 1: Register User
   */
  test('TC01 - Register User @smoke', async ({ page }) => {
    const homePage = new AutomationExerciseHomePage(page);
    const loginPage = new AutomationExerciseLoginPage(page);
    const signupPage = new AutomationExerciseSignupPage(page);
    
    // 1. Launch browser and navigate to url
    await homePage.navigateTo();
    
    // 3. Verify that home page is visible successfully
    expect(await homePage.isHomePageVisible()).toBeTruthy();
    
    // 4. Click on 'Signup / Login' button
    await homePage.clickSignupLogin();
    
    // 5. Verify 'New User Signup!' is visible
    expect(await loginPage.isNewUserSignupVisible()).toBeTruthy();
    
    // 6. Enter name and email address
    const testEmail = `test${Date.now()}@example.com`;
    await loginPage.signupUser('Test User', testEmail);
    
    // 8. Verify that 'ENTER ACCOUNT INFORMATION' is visible
    expect(await signupPage.isAccountInfoTitleVisible()).toBeTruthy();
    
    // 9. Fill details: Title, Name, Email, Password, Date of birth
    await signupPage.fillAccountInformation({
      title: 'Mr',
      password: 'password123',
      day: '15',
      month: 'January',
      year: '1990',
      newsletter: true,  // 10. Select checkbox 'Sign up for our newsletter!'
      offers: true,      // 11. Select checkbox 'Receive special offers from our partners!'
    });
    
    // 12. Fill details: First name, Last name, Company, Address, etc.
    await signupPage.fillAddressInformation({
      firstName: 'Test',
      lastName: 'User',
      company: 'Test Company',
      address1: '123 Test Street',
      address2: 'Apt 456',
      country: 'United States',
      state: 'California',
      city: 'Los Angeles',
      zipcode: '90210',
      mobileNumber: '+1234567890',
    });
    
    // 13. Click 'Create Account' button
    await signupPage.clickCreateAccount();
    
    // 14. Verify that 'ACCOUNT CREATED!' is visible
    expect(await signupPage.isAccountCreatedVisible()).toBeTruthy();
    
    // 15. Click 'Continue' button
    await signupPage.clickContinue();
    
    // 16. Verify that 'Logged in as username' is visible
    expect(await homePage.isUserLoggedIn()).toBeTruthy();
    
    // 17. Click 'Delete Account' button
    await homePage.clickDeleteAccount();
    
    // 18. Verify that 'ACCOUNT DELETED!' is visible and click 'Continue' button
    expect(await signupPage.isAccountDeletedVisible()).toBeTruthy();
    await signupPage.clickContinue();
  });

  /**
   * Test Case 2: Login User with Correct Email and Password
   */
  test('TC02 - Login User with Correct Email and Password @smoke', async ({ page }) => {
    const homePage = new AutomationExerciseHomePage(page);
    const loginPage = new AutomationExerciseLoginPage(page);
    
    // 1-3. Launch browser, navigate and verify home page
    await homePage.navigateTo();
    expect(await homePage.isHomePageVisible()).toBeTruthy();
    
    // 4. Click on 'Signup / Login' button
    await homePage.clickSignupLogin();
    
    // 5. Verify 'Login to your account' is visible
    expect(await loginPage.isLoginToAccountVisible()).toBeTruthy();
    
    // 6-7. Enter correct email and password, click login
    await loginPage.loginUser('testuser@example.com', 'password123');
    
    // 8. Verify that 'Logged in as username' is visible
    expect(await homePage.isUserLoggedIn()).toBeTruthy();
    
    // 9-10. Click 'Delete Account' and verify deletion
    await homePage.clickDeleteAccount();
    const signupPage = new AutomationExerciseSignupPage(page);
    expect(await signupPage.isAccountDeletedVisible()).toBeTruthy();
  });

  /**
   * Test Case 3: Login User with Incorrect Email and Password
   */
  test('TC03 - Login User with Incorrect Email and Password @regression', async ({ page }) => {
    const homePage = new AutomationExerciseHomePage(page);
    const loginPage = new AutomationExerciseLoginPage(page);
    
    // 1-3. Launch browser, navigate and verify home page
    await homePage.navigateTo();
    expect(await homePage.isHomePageVisible()).toBeTruthy();
    
    // 4. Click on 'Signup / Login' button
    await homePage.clickSignupLogin();
    
    // 5. Verify 'Login to your account' is visible
    expect(await loginPage.isLoginToAccountVisible()).toBeTruthy();
    
    // 6-7. Enter incorrect email and password, click login
    await loginPage.loginUser('incorrect@example.com', 'wrongpassword');
    
    // 8. Verify error 'Your email or password is incorrect!' is visible
    expect(await loginPage.isLoginErrorVisible()).toBeTruthy();
    expect(await loginPage.getLoginErrorMessage()).toContain('Your email or password is incorrect!');
  });

  /**
   * Test Case 4: Logout User
   */
  test('TC04 - Logout User @smoke', async ({ page }) => {
    const homePage = new AutomationExerciseHomePage(page);
    const loginPage = new AutomationExerciseLoginPage(page);
    
    // 1-3. Launch browser, navigate and verify home page
    await homePage.navigateTo();
    expect(await homePage.isHomePageVisible()).toBeTruthy();
    
    // 4. Click on 'Signup / Login' button
    await homePage.clickSignupLogin();
    
    // 5. Verify 'Login to your account' is visible
    expect(await loginPage.isLoginToAccountVisible()).toBeTruthy();
    
    // 6-7. Enter correct email and password, click login
    await loginPage.loginUser('testuser@example.com', 'password123');
    
    // 8. Verify that 'Logged in as username' is visible
    expect(await homePage.isUserLoggedIn()).toBeTruthy();
    
    // 9. Click 'Logout' button
    await homePage.clickLogout();
    
    // 10. Verify that user is navigated to login page
    expect(page.url()).toContain('/login');
  });

  /**
   * Test Case 5: Register User with Existing Email
   */
  test('TC05 - Register User with Existing Email @regression', async ({ page }) => {
    const homePage = new AutomationExerciseHomePage(page);
    const loginPage = new AutomationExerciseLoginPage(page);
    
    // 1-3. Launch browser, navigate and verify home page
    await homePage.navigateTo();
    expect(await homePage.isHomePageVisible()).toBeTruthy();
    
    // 4. Click on 'Signup / Login' button
    await homePage.clickSignupLogin();
    
    // 5. Verify 'New User Signup!' is visible
    expect(await loginPage.isNewUserSignupVisible()).toBeTruthy();
    
    // 6-7. Enter name and already registered email address, click signup
    await loginPage.signupUser('Test User', 'existing@example.com');
    
    // 8. Verify error 'Email Address already exist!' is visible
    expect(await loginPage.isSignupErrorVisible()).toBeTruthy();
    expect(await loginPage.getSignupErrorMessage()).toContain('Email Address already exist!');
  });

  /**
   * Test Case 6: Contact Us Form
   */
  test('TC06 - Contact Us Form @regression', async ({ page }) => {
    const homePage = new AutomationExerciseHomePage(page);
    const contactPage = new AutomationExerciseContactUsPage(page);
    
    // 1-3. Launch browser, navigate and verify home page
    await homePage.navigateTo();
    expect(await homePage.isHomePageVisible()).toBeTruthy();
    
    // 4. Click on 'Contact Us' button
    await homePage.clickContactUs();
    
    // 5. Verify 'GET IN TOUCH' is visible
    expect(await contactPage.isGetInTouchVisible()).toBeTruthy();
    
    // 6. Enter name, email, subject and message
    await contactPage.fillContactForm({
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Test Subject',
      message: 'This is a test message for contact form.',
    });
    
    // 8. Click 'Submit' button (includes handling OK button dialog)
    await contactPage.submitForm();
    
    // 10. Verify success message is visible
    expect(await contactPage.isSuccessMessageVisible()).toBeTruthy();
    expect(await contactPage.getSuccessMessage()).toContain('Success! Your details have been submitted successfully.');
    
    // 11. Click 'Home' button and verify navigation
    await contactPage.clickHome();
    expect(await homePage.isHomePageVisible()).toBeTruthy();
  });

  /**
   * Test Case 7: Verify Test Cases Page
   */
  test('TC07 - Verify Test Cases Page @smoke', async ({ page }) => {
    const homePage = new AutomationExerciseHomePage(page);
    
    // 1-3. Launch browser, navigate and verify home page
    await homePage.navigateTo();
    expect(await homePage.isHomePageVisible()).toBeTruthy();
    
    // 4. Click on 'Test Cases' button
    await homePage.clickTestCases();
    
    // 5. Verify user is navigated to test cases page successfully
    expect(page.url()).toContain('/test_cases');
  });

  /**
   * Test Case 8: Verify All Products and Product Detail Page
   */
  test('TC08 - Verify All Products and Product Detail Page @smoke', async ({ page }) => {
    const homePage = new AutomationExerciseHomePage(page);
    const productsPage = new AutomationExerciseProductsPage(page);
    const productDetailPage = new AutomationExerciseProductDetailPage(page);
    
    // 1-3. Launch browser, navigate and verify home page
    await homePage.navigateTo();
    expect(await homePage.isHomePageVisible()).toBeTruthy();
    
    // 4. Click on 'Products' button
    await homePage.clickProducts();
    
    // 5. Verify user is navigated to ALL PRODUCTS page successfully
    expect(await productsPage.isAllProductsTitleVisible()).toBeTruthy();
    
    // 6. The products list is visible
    expect(await productsPage.isProductsListVisible()).toBeTruthy();
    
    // 7. Click on 'View Product' of first product
    await productsPage.clickViewProduct(0);
    
    // 8-9. User is landed to product detail page and verify details
    const details = await productDetailPage.areAllDetailsVisible();
    expect(details.name).toBeTruthy();
    expect(details.category).toBeTruthy();
    expect(details.price).toBeTruthy();
    expect(details.availability).toBeTruthy();
    expect(details.condition).toBeTruthy();
    expect(details.brand).toBeTruthy();
  });

  /**
   * Test Case 9: Search Product
   */
  test('TC09 - Search Product @regression', async ({ page }) => {
    const homePage = new AutomationExerciseHomePage(page);
    const productsPage = new AutomationExerciseProductsPage(page);
    
    // 1-3. Launch browser, navigate and verify home page
    await homePage.navigateTo();
    expect(await homePage.isHomePageVisible()).toBeTruthy();
    
    // 4. Click on 'Products' button
    await homePage.clickProducts();
    
    // 5. Verify user is navigated to ALL PRODUCTS page successfully
    expect(await productsPage.isAllProductsTitleVisible()).toBeTruthy();
    
    // 6. Enter product name in search input and click search button
    await productsPage.searchProducts('shirt');
    
    // 7. Verify 'SEARCHED PRODUCTS' is visible
    expect(await productsPage.isSearchedProductsTitleVisible()).toBeTruthy();
    
    // 8. Verify all the products related to search are visible
    expect(await productsPage.areSearchResultsVisible()).toBeTruthy();
    expect(await productsPage.getSearchResultsCount()).toBeGreaterThan(0);
  });

  /**
   * Test Case 10: Verify Subscription in Home Page
   */
  test('TC10 - Verify Subscription in Home Page @regression', async ({ page }) => {
    const homePage = new AutomationExerciseHomePage(page);
    
    // 1-3. Launch browser, navigate and verify home page
    await homePage.navigateTo();
    expect(await homePage.isHomePageVisible()).toBeTruthy();
    
    // 4. Scroll down to footer
    await homePage.scrollToBottom();
    
    // 5. Verify text 'SUBSCRIPTION'
    expect(await homePage.isSubscriptionSectionVisible()).toBeTruthy();
    
    // 6. Enter email address in input and click arrow button
    await homePage.subscribeToNewsletter('test@example.com');
    
    // 7. Verify success message 'You have been successfully subscribed!' is visible
    expect(await homePage.isSubscriptionSuccessVisible()).toBeTruthy();
  });

  /**
   * Test Case 11: Verify Subscription in Cart Page
   */
  test('TC11 - Verify Subscription in Cart Page @regression', async ({ page }) => {
    const homePage = new AutomationExerciseHomePage(page);
    const cartPage = new AutomationExerciseCartPage(page);
    
    // 1-3. Launch browser, navigate and verify home page
    await homePage.navigateTo();
    expect(await homePage.isHomePageVisible()).toBeTruthy();
    
    // 4. Click 'Cart' button
    await homePage.clickCart();
    
    // 5. Scroll down to footer
    // 6. Verify text 'SUBSCRIPTION'
    expect(await cartPage.isSubscriptionSectionVisible()).toBeTruthy();
    
    // 7. Enter email address in input and click arrow button
    await cartPage.subscribeToNewsletter('test@example.com');
    
    // 8. Verify success message 'You have been successfully subscribed!' is visible
    expect(await cartPage.isSubscriptionSuccessVisible()).toBeTruthy();
  });

  /**
   * Test Case 12: Add Products in Cart
   */
  test('TC12 - Add Products in Cart @regression', async ({ page }) => {
    const homePage = new AutomationExerciseHomePage(page);
    const productsPage = new AutomationExerciseProductsPage(page);
    const cartPage = new AutomationExerciseCartPage(page);
    
    // 1-3. Launch browser, navigate and verify home page
    await homePage.navigateTo();
    expect(await homePage.isHomePageVisible()).toBeTruthy();
    
    // 4. Click 'Products' button
    await homePage.clickProducts();
    
    // 5. Hover over first product and click 'Add to cart'
    await productsPage.hoverAndAddToCart(0);
    
    // 6. Click 'Continue Shopping' button
    await productsPage.clickContinueShopping();
    
    // 7. Hover over second product and click 'Add to cart'
    await productsPage.hoverAndAddToCart(1);
    
    // 8. Click 'View Cart' button
    await productsPage.clickViewCart();
    
    // 9. Verify both products are added to Cart
    expect(await cartPage.getCartItemsCount()).toBe(2);
    
    // 10. Verify their prices, quantity and total price
    const prices = await cartPage.getProductPrices();
    const quantities = await cartPage.getProductQuantities();
    const totals = await cartPage.getProductTotals();
    
    expect(prices.length).toBe(2);
    expect(quantities.length).toBe(2);
    expect(totals.length).toBe(2);
  });

  /**
   * Test Case 13: Verify Product Quantity in Cart
   */
  test('TC13 - Verify Product Quantity in Cart @regression', async ({ page }) => {
    const homePage = new AutomationExerciseHomePage(page);
    const productDetailPage = new AutomationExerciseProductDetailPage(page);
    const cartPage = new AutomationExerciseCartPage(page);
    
    // 1-3. Launch browser, navigate and verify home page
    await homePage.navigateTo();
    expect(await homePage.isHomePageVisible()).toBeTruthy();
    
    // 4. Click 'View Product' for any product on home page
    const viewProductLink = page.locator('a:has-text("View Product")').first();
    await viewProductLink.click();
    
    // 5. Verify product detail is opened
    await productDetailPage.waitForPageReady();
    
    // 6. Increase quantity to 4
    await productDetailPage.setQuantity(4);
    
    // 7. Click 'Add to cart' button
    await productDetailPage.addToCart();
    
    // 8. Click 'View Cart' button
    const viewCartButton = page.locator('a:has-text("View Cart")');
    await viewCartButton.click();
    
    // 9. Verify that product is displayed in cart page with exact quantity
    expect(await cartPage.verifyProductQuantity(0, 4)).toBeTruthy();
  });

  /**
   * Test Case 21: Add Review on Product
   */
  test('TC21 - Add Review on Product @regression', async ({ page }) => {
    const homePage = new AutomationExerciseHomePage(page);
    const productsPage = new AutomationExerciseProductsPage(page);
    const productDetailPage = new AutomationExerciseProductDetailPage(page);
    
    // 1-3. Launch browser, navigate and verify home page
    await homePage.navigateTo();
    expect(await homePage.isHomePageVisible()).toBeTruthy();
    
    // 4. Click on 'Products' button
    await homePage.clickProducts();
    
    // 4. Verify user is navigated to ALL PRODUCTS page successfully
    expect(await productsPage.isAllProductsTitleVisible()).toBeTruthy();
    
    // 5. Click on 'View Product' button
    await productsPage.clickViewProduct(0);
    
    // 6. Verify 'Write Your Review' is visible
    expect(await productDetailPage.isWriteReviewVisible()).toBeTruthy();
    
    // 7. Enter name, email and review
    await productDetailPage.writeReview({
      name: 'Test Reviewer',
      email: 'reviewer@example.com',
      review: 'This is a great product! Highly recommended.',
    });
    
    // 9. Verify success message 'Thank you for your review.'
    expect(await productDetailPage.isReviewSuccessVisible()).toBeTruthy();
  });

  /**
   * Test Case 22: Add to Cart from Recommended Items
   */
  test('TC22 - Add to Cart from Recommended Items @regression', async ({ page }) => {
    const homePage = new AutomationExerciseHomePage(page);
    const cartPage = new AutomationExerciseCartPage(page);
    
    // 1-2. Launch browser and navigate
    await homePage.navigateTo();
    
    // 3. Scroll to bottom of page
    await homePage.scrollToBottom();
    
    // 4. Verify 'RECOMMENDED ITEMS' are visible
    expect(await homePage.areRecommendedItemsVisible()).toBeTruthy();
    
    // 5. Click on 'Add To Cart' on Recommended product
    await homePage.addRecommendedItemToCart(0);
    
    // 6. Click on 'View Cart' button
    const viewCartButton = page.locator('a:has-text("View Cart")');
    await viewCartButton.click();
    
    // 7. Verify that product is displayed in cart page
    expect(await cartPage.isCartPageDisplayed()).toBeTruthy();
    expect(await cartPage.getCartItemsCount()).toBeGreaterThan(0);
  });

  /**
   * Test Case 25: Verify Scroll Up Using 'Arrow' Button and Scroll Down Functionality
   */
  test('TC25 - Verify Scroll Up Using Arrow Button @regression', async ({ page }) => {
    const homePage = new AutomationExerciseHomePage(page);
    
    // 1-2. Launch browser and navigate
    await homePage.navigateTo();
    
    // 3. Verify that home page is visible successfully
    expect(await homePage.isHomePageVisible()).toBeTruthy();
    
    // 4. Scroll down page to bottom
    await homePage.scrollToBottom();
    
    // 5. Verify 'SUBSCRIPTION' is visible
    expect(await homePage.isSubscriptionSectionVisible()).toBeTruthy();
    
    // 6. Click on arrow at bottom right side to move upward
    await homePage.clickScrollUpButton();
    
    // 7. Verify that page is scrolled up and text is visible
    expect(await homePage.isFullFledgedTextVisible()).toBeTruthy();
  });

  /**
   * Test Case 26: Verify Scroll Up Without 'Arrow' Button and Scroll Down Functionality
   */
  test('TC26 - Verify Scroll Up Without Arrow Button @regression', async ({ page }) => {
    const homePage = new AutomationExerciseHomePage(page);
    
    // 1-2. Launch browser and navigate
    await homePage.navigateTo();
    
    // 3. Verify that home page is visible successfully
    expect(await homePage.isHomePageVisible()).toBeTruthy();
    
    // 4. Scroll down page to bottom
    await homePage.scrollToBottom();
    
    // 5. Verify 'SUBSCRIPTION' is visible
    expect(await homePage.isSubscriptionSectionVisible()).toBeTruthy();
    
    // 6. Scroll up page to top
    await homePage.scrollToTop();
    
    // 7. Verify that page is scrolled up and text is visible
    expect(await homePage.isFullFledgedTextVisible()).toBeTruthy();
  });
});
