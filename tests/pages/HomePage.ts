import { type Page, type Locator } from '@playwright/test';
import { BasePage } from '@pages/base/BasePage';
import { NavigationComponent } from '@components/NavigationComponent';
import { FooterComponent } from '@components/FooterComponent';

/**
 * Home Page Object
 * Encapsulates all home page interactions and elements
 */
export class HomePage extends BasePage {
  readonly navigation: NavigationComponent;
  readonly footer: FooterComponent;
  readonly welcomeMessage: Locator;
  readonly heroSection: Locator;
  readonly heroTitle: Locator;
  readonly heroSubtitle: Locator;
  readonly heroCallToAction: Locator;
  readonly featuresSection: Locator;
  readonly featureCards: Locator;
  readonly testimonialsSection: Locator;
  readonly testimonialItems: Locator;
  readonly newsSection: Locator;
  readonly newsArticles: Locator;
  readonly getStartedButton: Locator;
  readonly learnMoreButton: Locator;
  readonly contactButton: Locator;
  readonly searchSection: Locator;

  constructor(page: Page) {
    super(page);
    this.navigation = new NavigationComponent(page);
    this.footer = new FooterComponent(page);
    this.welcomeMessage = page.getByTestId('welcome-message');
    this.heroSection = page.getByTestId('hero-section');
    this.heroTitle = page.getByTestId('hero-title');
    this.heroSubtitle = page.getByTestId('hero-subtitle');
    this.heroCallToAction = page.getByTestId('hero-cta');
    this.featuresSection = page.getByTestId('features-section');
    this.featureCards = page.getByTestId('feature-card');
    this.testimonialsSection = page.getByTestId('testimonials-section');
    this.testimonialItems = page.getByTestId('testimonial-item');
    this.newsSection = page.getByTestId('news-section');
    this.newsArticles = page.getByTestId('news-article');
    this.getStartedButton = page.getByRole('button', { name: 'Get Started' });
    this.learnMoreButton = page.getByRole('button', { name: 'Learn More' });
    this.contactButton = page.getByRole('button', { name: 'Contact Us' });
    this.searchSection = page.getByTestId('search-section');
  }

  /**
   * Navigate to home page
   */
  async navigateTo(): Promise<void> {
    await this.page.goto('/');
    await this.waitForPageReady();
  }

  /**
   * Wait for home page to be ready
   */
  async waitForPageReady(): Promise<void> {
    await super.waitForPageLoad();
    await this.waitForElement(this.heroSection);
  }

  /**
   * Get welcome message text
   */
  async getWelcomeMessage(): Promise<string> {
    return await this.welcomeMessage.textContent() ?? '';
  }

  /**
   * Get hero title text
   */
  async getHeroTitle(): Promise<string> {
    return await this.heroTitle.textContent() ?? '';
  }

  /**
   * Get hero subtitle text
   */
  async getHeroSubtitle(): Promise<string> {
    return await this.heroSubtitle.textContent() ?? '';
  }

  /**
   * Click Get Started button
   */
  async clickGetStarted(): Promise<void> {
    await this.getStartedButton.click();
  }

  /**
   * Click Learn More button
   */
  async clickLearnMore(): Promise<void> {
    await this.learnMoreButton.click();
  }

  /**
   * Click Contact Us button
   */
  async clickContactUs(): Promise<void> {
    await this.contactButton.click();
  }

  /**
   * Get number of feature cards
   */
  async getFeatureCardCount(): Promise<number> {
    return await this.featureCards.count();
  }

  /**
   * Get feature card text by index
   */
  async getFeatureCardText(index: number): Promise<string> {
    return await this.featureCards.nth(index).textContent() ?? '';
  }

  /**
   * Click feature card by index
   */
  async clickFeatureCard(index: number): Promise<void> {
    await this.featureCards.nth(index).click();
  }

  /**
   * Get number of testimonials
   */
  async getTestimonialCount(): Promise<number> {
    return await this.testimonialItems.count();
  }

  /**
   * Get testimonial text by index
   */
  async getTestimonialText(index: number): Promise<string> {
    return await this.testimonialItems.nth(index).textContent() ?? '';
  }

  /**
   * Get number of news articles
   */
  async getNewsArticleCount(): Promise<number> {
    return await this.newsArticles.count();
  }

  /**
   * Click news article by index
   */
  async clickNewsArticle(index: number): Promise<void> {
    await this.newsArticles.nth(index).click();
  }

  /**
   * Check if hero section is visible
   */
  async isHeroSectionVisible(): Promise<boolean> {
    return await this.heroSection.isVisible();
  }

  /**
   * Check if features section is visible
   */
  async isFeaturesSectionVisible(): Promise<boolean> {
    return await this.featuresSection.isVisible();
  }

  /**
   * Check if testimonials section is visible
   */
  async isTestimonialsSectionVisible(): Promise<boolean> {
    return await this.testimonialsSection.isVisible();
  }

  /**
   * Check if news section is visible
   */
  async isNewsSectionVisible(): Promise<boolean> {
    return await this.newsSection.isVisible();
  }

  /**
   * Scroll to features section
   */
  async scrollToFeatures(): Promise<void> {
    await this.featuresSection.scrollIntoViewIfNeeded();
  }

  /**
   * Scroll to testimonials section
   */
  async scrollToTestimonials(): Promise<void> {
    await this.testimonialsSection.scrollIntoViewIfNeeded();
  }

  /**
   * Scroll to news section
   */
  async scrollToNews(): Promise<void> {
    await this.newsSection.scrollIntoViewIfNeeded();
  }

  /**
   * Check if welcome message is displayed for logged-in user
   */
  async isWelcomeMessageVisible(): Promise<boolean> {
    return await this.welcomeMessage.isVisible().catch(() => false);
  }

  /**
   * Check if search section is available
   */
  async isSearchSectionVisible(): Promise<boolean> {
    return await this.searchSection.isVisible().catch(() => false);
  }

  /**
   * Perform search from home page
   */
  async searchFromHome(query: string): Promise<void> {
    await this.navigation.search(query);
  }
}
