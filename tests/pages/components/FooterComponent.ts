import { type Page, type Locator } from '@playwright/test';

/**
 * Reusable Footer Component
 * Handles footer functionality across pages
 */
export class FooterComponent {
  readonly page: Page;
  readonly footer: Locator;
  readonly copyrightText: Locator;
  readonly privacyPolicyLink: Locator;
  readonly termsOfServiceLink: Locator;
  readonly contactEmail: Locator;
  readonly socialMediaLinks: Locator;
  readonly facebookLink: Locator;
  readonly twitterLink: Locator;
  readonly linkedinLink: Locator;
  readonly instagramLink: Locator;
  readonly newsletterSubscription: Locator;
  readonly emailInput: Locator;
  readonly subscribeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.footer = page.getByRole('contentinfo');
    this.copyrightText = page.getByTestId('copyright-text');
    this.privacyPolicyLink = page.getByRole('link', { name: 'Privacy Policy' });
    this.termsOfServiceLink = page.getByRole('link', { name: 'Terms of Service' });
    this.contactEmail = page.getByTestId('contact-email');
    this.socialMediaLinks = page.getByTestId('social-media-links');
    this.facebookLink = page.getByRole('link', { name: 'Facebook' });
    this.twitterLink = page.getByRole('link', { name: 'Twitter' });
    this.linkedinLink = page.getByRole('link', { name: 'LinkedIn' });
    this.instagramLink = page.getByRole('link', { name: 'Instagram' });
    this.newsletterSubscription = page.getByTestId('newsletter-subscription');
    this.emailInput = page.getByPlaceholder('Enter your email');
    this.subscribeButton = page.getByRole('button', { name: 'Subscribe' });
  }

  /**
   * Get copyright text
   */
  async getCopyrightText(): Promise<string> {
    return await this.copyrightText.textContent() ?? '';
  }

  /**
   * Navigate to privacy policy
   */
  async goToPrivacyPolicy(): Promise<void> {
    await this.privacyPolicyLink.click();
  }

  /**
   * Navigate to terms of service
   */
  async goToTermsOfService(): Promise<void> {
    await this.termsOfServiceLink.click();
  }

  /**
   * Get contact email
   */
  async getContactEmail(): Promise<string> {
    return await this.contactEmail.textContent() ?? '';
  }

  /**
   * Subscribe to newsletter
   */
  async subscribeToNewsletter(email: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.subscribeButton.click();
  }

  /**
   * Click on social media link
   */
  async clickSocialMediaLink(platform: 'facebook' | 'twitter' | 'linkedin' | 'instagram'): Promise<void> {
    switch (platform) {
      case 'facebook':
        await this.facebookLink.click();
        break;
      case 'twitter':
        await this.twitterLink.click();
        break;
      case 'linkedin':
        await this.linkedinLink.click();
        break;
      case 'instagram':
        await this.instagramLink.click();
        break;
      default:
        throw new Error(`Unsupported social media platform: ${platform}`);
    }
  }

  /**
   * Check if footer is visible
   */
  async isFooterVisible(): Promise<boolean> {
    return await this.footer.isVisible();
  }

  /**
   * Scroll to footer
   */
  async scrollToFooter(): Promise<void> {
    await this.footer.scrollIntoViewIfNeeded();
  }
}
