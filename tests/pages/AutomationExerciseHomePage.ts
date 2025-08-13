import { type Page, type Locator } from '@playwright/test';
import { BasePage } from '@pages/base/BasePage';
import { NavigationComponent } from '@components/NavigationComponent';

/**
 * Automation Exercise Home Page Object
 * Handles all interactions with the home page
 */
export class AutomationExerciseHomePage extends BasePage {
  readonly navigation: NavigationComponent;
  readonly signupLoginLink: Locator;
  readonly contactUsLink: Locator;
  readonly testCasesLink: Locator;
  readonly productsLink: Locator;
  readonly cartLink: Locator;
  readonly logoutLink: Locator;
  readonly deleteAccountLink: Locator;
  readonly loggedInAsUser: Locator;
  readonly homePageCarousel: Locator;
  readonly featuresItems: Locator;
  readonly subscriptionSection: Locator;
  readonly subscriptionTitle: Locator;
  readonly subscriptionEmailInput: Locator;
  readonly subscriptionSubmitButton: Locator;
  readonly subscriptionSuccessMessage: Locator;
  readonly recommendedItems: Locator;
  readonly recommendedItemsTitle: Locator;
  readonly scrollUpButton: Locator;
  readonly fullFledgedText: Locator;
  readonly categoriesSidebar: Locator;
  readonly womenCategory: Locator;
  readonly menCategory: Locator;
  readonly brandsSidebar: Locator;

  constructor(page: Page) {
    super(page);
    this.navigation = new NavigationComponent(page);
    this.signupLoginLink = page.locator('a[href="/login"]').first();
    this.contactUsLink = page.locator('a[href="/contact_us"]').first();
    this.testCasesLink = page.locator('a[href="/test_cases"]').first();
    this.productsLink = page.locator('a[href="/products"]').first();
    this.cartLink = page.locator('a[href="/view_cart"]').first();
    this.logoutLink = page.locator('a[href="/logout"]');
    this.deleteAccountLink = page.locator('a[href="/delete_account"]');
    this.loggedInAsUser = page.locator('li:has-text("Logged in as")');
    this.homePageCarousel = page.locator('#slider-carousel');
    this.featuresItems = page.locator('.features_items');
    this.subscriptionSection = page.locator('#footer');
    this.subscriptionTitle = page.locator('h2:has-text("Subscription")');
    this.subscriptionEmailInput = page.locator('#susbscribe_email');
    this.subscriptionSubmitButton = page.locator('#subscribe');
    this.subscriptionSuccessMessage = page.locator('.alert-success');
    this.recommendedItems = page.locator('.recommended_items');
    this.recommendedItemsTitle = page.locator('h2:has-text("recommended items")');
    this.scrollUpButton = page.locator('#scrollUp');
    this.fullFledgedText = page.locator('h2:has-text("Full-Fledged practice website for Automation Engineers")').first();
    this.categoriesSidebar = page.locator('.left-sidebar .panel-group');
    this.womenCategory = page.locator('a[href="#Women"]');
    this.menCategory = page.locator('a[href="#Men"]');
    this.brandsSidebar = page.locator('.brands_products');
  }

    /**
   * Navigate to the home page with robust error handling
   */
  async navigateTo(): Promise<void> {
    const maxRetries = 3;
    let currentRetry = 0;
    
    while (currentRetry < maxRetries) {
      try {
        console.log(`Navigation attempt ${currentRetry + 1}/${maxRetries}`);
        
        // Try different wait strategies in order of preference
        try {
          await this.page.goto('/', { waitUntil: 'load', timeout: 45000 });
          console.log('Successfully loaded with "load" event');
          break;
        } catch (loadError) {
          console.log('Load event timeout, trying with networkidle...');
          try {
            await this.page.goto('/', { waitUntil: 'networkidle', timeout: 45000 });
            console.log('Successfully loaded with "networkidle" event');
            break;
          } catch (networkError) {
            console.log('Networkidle timeout, trying with domcontentloaded...');
            await this.page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
            console.log('Successfully loaded with "domcontentloaded" event');
            break;
          }
        }
      } catch (error) {
        currentRetry++;
        if (currentRetry >= maxRetries) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          throw new Error(`Failed to navigate to home page after ${maxRetries} attempts. Last error: ${errorMessage}`);
        }
        console.log(`Navigation attempt ${currentRetry} failed, retrying in 2 seconds...`);
        await this.page.waitForTimeout(2000);
      }
    }
    
    // Wait for basic page readiness with reduced timeout
    await this.waitForBasicPageReady();
  }

  /**
   * Wait for basic page readiness without strict network idle requirements
   */
  async waitForBasicPageReady(): Promise<void> {
    try {
      // Wait for the page to be basically interactive
      await this.page.waitForLoadState('domcontentloaded', { timeout: 10000 });
      
      // Wait for some key elements to ensure page is usable
      await this.page.waitForSelector('body', { timeout: 10000 });
      
      // Optional: Wait for main navigation or header
      await this.page.waitForSelector('header, nav, .navbar', { timeout: 5000 }).catch(() => {
        console.log('Header/nav not found or took too long - continuing anyway');
      });
      
    } catch (error) {
      console.log(`Basic page ready check failed: ${error instanceof Error ? error.message : String(error)} - continuing anyway`);
    }
  }

  /**
   * Wait for home page to be ready
   */
  async waitForPageReady(): Promise<void> {
    await super.waitForPageLoad();
    await this.waitForElement(this.homePageCarousel);
  }

  /**
   * Verify home page is visible
   */
  async isHomePageVisible(): Promise<boolean> {
    return await this.homePageCarousel.isVisible();
  }

  /**
   * Click Signup/Login link
   */
  async clickSignupLogin(): Promise<void> {
    await this.signupLoginLink.click();
  }

  /**
   * Click Contact Us link
   */
  async clickContactUs(): Promise<void> {
    await this.contactUsLink.click();
  }

  /**
   * Click Test Cases link
   */
  async clickTestCases(): Promise<void> {
    await this.testCasesLink.click();
  }

  /**
   * Click Products link
   */
  async clickProducts(): Promise<void> {
    await this.productsLink.click();
  }

  /**
   * Click Cart link
   */
  async clickCart(): Promise<void> {
    await this.cartLink.click();
  }

  /**
   * Click Logout link
   */
  async clickLogout(): Promise<void> {
    await this.logoutLink.click();
  }

  /**
   * Click Delete Account link
   */
  async clickDeleteAccount(): Promise<void> {
    await this.deleteAccountLink.click();
  }

  /**
   * Check if user is logged in
   */
  async isUserLoggedIn(): Promise<boolean> {
    return await this.loggedInAsUser.isVisible();
  }

  /**
   * Get logged in username
   */
  async getLoggedInUsername(): Promise<string> {
    return await this.loggedInAsUser.textContent() ?? '';
  }

  /**
   * Scroll to footer and subscribe to newsletter
   */
  async subscribeToNewsletter(email: string): Promise<void> {
    await this.subscriptionSection.scrollIntoViewIfNeeded();
    await this.subscriptionEmailInput.fill(email);
    await this.subscriptionSubmitButton.click();
  }

  /**
   * Check if subscription success message is visible
   */
  async isSubscriptionSuccessVisible(): Promise<boolean> {
    return await this.subscriptionSuccessMessage.isVisible();
  }

  /**
   * Check if subscription section is visible
   */
  async isSubscriptionSectionVisible(): Promise<boolean> {
    return await this.subscriptionTitle.isVisible();
  }

  /**
   * Check if recommended items are visible
   */
  async areRecommendedItemsVisible(): Promise<boolean> {
    return await this.recommendedItemsTitle.isVisible();
  }

  /**
   * Add recommended item to cart
   */
  async addRecommendedItemToCart(index: number = 0): Promise<void> {
    const addToCartButton = this.recommendedItems.locator('.btn-default').nth(index);
    await addToCartButton.click();
  }

  /**
   * Scroll to bottom of page
   */
  async scrollToBottom(): Promise<void> {
    await this.subscriptionSection.scrollIntoViewIfNeeded();
  }

  /**
   * Click scroll up button
   */
  async clickScrollUpButton(): Promise<void> {
    await this.scrollUpButton.click();
  }

  /**
   * Scroll to top of page
   */
  async scrollToTop(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo(0, 0));
  }

  /**
   * Check if full-fledged text is visible
   */
  async isFullFledgedTextVisible(): Promise<boolean> {
    return await this.fullFledgedText.isVisible();
  }

  /**
   * Check if categories are visible
   */
  async areCategoriesVisible(): Promise<boolean> {
    return await this.categoriesSidebar.isVisible();
  }

  /**
   * Click on Women category
   */
  async clickWomenCategory(): Promise<void> {
    await this.womenCategory.click();
  }

  /**
   * Click on Men category
   */
  async clickMenCategory(): Promise<void> {
    await this.menCategory.click();
  }

  /**
   * Click on subcategory under Women
   */
  async clickWomenSubcategory(subcategory: string): Promise<void> {
    const subcategoryLink = this.page.locator(`#Women a[href*="/category_products/"]:has-text("${subcategory}")`);
    await subcategoryLink.click();
  }

  /**
   * Click on subcategory under Men
   */
  async clickMenSubcategory(subcategory: string): Promise<void> {
    const subcategoryLink = this.page.locator(`a[href*="/category_products/"]:has-text("${subcategory}")`);
    await subcategoryLink.click();
  }

  /**
   * Check if brands are visible
   */
  async areBrandsVisible(): Promise<boolean> {
    return await this.brandsSidebar.isVisible();
  }

  /**
   * Click on brand
   */
  async clickBrand(brandName: string): Promise<void> {
    const brandLink = this.brandsSidebar.locator(`a:has-text("${brandName}")`);
    await brandLink.click();
  }
}
