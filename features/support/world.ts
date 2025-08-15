import { setWorldConstructor, Before, After, BeforeAll, AfterAll } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, chromium } from '@playwright/test';
import { HomePage } from '../../tests/pages/HomePage';
import { AutomationExerciseHomePage } from '../../tests/pages/AutomationExerciseHomePage';
import { AutomationExerciseLoginPage } from '../../tests/pages/auth/AutomationExerciseLoginPage';
import { AutomationExerciseSignupPage } from '../../tests/pages/auth/AutomationExerciseSignupPage';
import { AutomationExerciseProductsPage } from '../../tests/pages/AutomationExerciseProductsPage';
import { AutomationExerciseProductDetailPage } from '../../tests/pages/AutomationExerciseProductDetailPage';
import { AutomationExerciseCartPage } from '../../tests/pages/AutomationExerciseCartPage';
import { AutomationExerciseContactUsPage } from '../../tests/pages/AutomationExerciseContactUsPage';

export class CustomWorld {
  public browser!: Browser;
  public context!: BrowserContext;
  public page!: Page;
  
  // Page Objects
  public homePage!: HomePage;
  public automationExerciseHomePage!: AutomationExerciseHomePage;
  public loginPage!: AutomationExerciseLoginPage;
  public signupPage!: AutomationExerciseSignupPage;
  public productsPage!: AutomationExerciseProductsPage;
  public productDetailPage!: AutomationExerciseProductDetailPage;
  public cartPage!: AutomationExerciseCartPage;
  public contactUsPage!: AutomationExerciseContactUsPage;

  async init() {
    this.browser = await chromium.launch({ 
      headless: true,
      args: ['--disable-web-security', '--disable-features=VizDisplayCompositor']
    });
    this.context = await this.browser.newContext({
      baseURL: 'https://automationexercise.com',
      viewport: { width: 1280, height: 720 },
      ignoreHTTPSErrors: true,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    });
    this.page = await this.context.newPage();
    
    // Initialize page objects
    this.homePage = new HomePage(this.page);
    this.automationExerciseHomePage = new AutomationExerciseHomePage(this.page);
    this.loginPage = new AutomationExerciseLoginPage(this.page);
    this.signupPage = new AutomationExerciseSignupPage(this.page);
    this.productsPage = new AutomationExerciseProductsPage(this.page);
    this.productDetailPage = new AutomationExerciseProductDetailPage(this.page);
    this.cartPage = new AutomationExerciseCartPage(this.page);
    this.contactUsPage = new AutomationExerciseContactUsPage(this.page);
  }

  async cleanup() {
    if (this.context) {
      await this.context.close();
    }
    if (this.browser) {
      await this.browser.close();
    }
  }
}

setWorldConstructor(CustomWorld);

Before(async function () {
  await this.init();
});

After(async function () {
  await this.cleanup();
});
