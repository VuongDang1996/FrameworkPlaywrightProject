import { type Page, type Locator } from '@playwright/test';
import { BasePage } from '@pages/base/BasePage';

/**
 * Contact Us Page Object
 */
export class AutomationExerciseContactUsPage extends BasePage {
  readonly getInTouchTitle: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly subjectInput: Locator;
  readonly messageTextarea: Locator;
  readonly fileUploadInput: Locator;
  readonly submitButton: Locator;
  readonly successMessage: Locator;
  readonly homeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.getInTouchTitle = page.locator('h2:has-text("Get In Touch")');
    this.nameInput = page.locator('input[data-qa="name"]');
    this.emailInput = page.locator('input[data-qa="email"]');
    this.subjectInput = page.locator('input[data-qa="subject"]');
    this.messageTextarea = page.locator('textarea[data-qa="message"]');
    this.fileUploadInput = page.locator('input[name="upload_file"]');
    this.submitButton = page.locator('input[data-qa="submit-button"]');
    this.successMessage = page.locator('.status.alert.alert-success, div:has-text("Success! Your details have been submitted successfully")');
    this.homeButton = page.locator('a:has-text("Home"), .btn.btn-success:has-text("Home")').first();
  }

  async waitForPageReady(): Promise<void> {
    await super.waitForPageLoad();
    await this.waitForElement(this.getInTouchTitle);
  }

  /**
   * Check if Get In Touch title is visible
   */
  async isGetInTouchVisible(): Promise<boolean> {
    return await this.getInTouchTitle.isVisible();
  }

  /**
   * Fill contact form
   */
  async fillContactForm(contactData: {
    name: string;
    email: string;
    subject: string;
    message: string;
    filePath?: string;
  }): Promise<void> {
    await this.nameInput.fill(contactData.name);
    await this.emailInput.fill(contactData.email);
    await this.subjectInput.fill(contactData.subject);
    await this.messageTextarea.fill(contactData.message);

    if (contactData.filePath) {
      await this.fileUploadInput.setInputFiles(contactData.filePath);
    }
  }

  /**
   * Submit contact form
   */
  async submitForm(): Promise<void> {
    // Set up dialog handler in case it appears
    let dialogHandled = false;
    const dialogHandler = async (dialog: any) => {
      dialogHandled = true;
      await dialog.accept();
    };
    this.page.on('dialog', dialogHandler);
    
    try {
      // Wait for navigation/response after form submission
      const [response] = await Promise.all([
        this.page.waitForResponse(response => response.url().includes('contact_us') && response.request().method() === 'POST').catch(() => null),
        this.submitButton.click()
      ]);
      
      // Wait a bit to see if dialog appears
      await this.page.waitForTimeout(2000);
      
      // If no dialog appeared, continue
      if (!dialogHandled) {
        console.log('No dialog appeared, continuing...');
      }
    } finally {
      // Remove the dialog handler
      this.page.off('dialog', dialogHandler);
    }
  }

  /**
   * Check if success message is visible
   */
  async isSuccessMessageVisible(): Promise<boolean> {
    return await this.successMessage.isVisible();
  }

  /**
   * Get success message text
   */
  async getSuccessMessage(): Promise<string> {
    return await this.successMessage.textContent() ?? '';
  }

  /**
   * Click Home button
   */
  async clickHome(): Promise<void> {
    await this.homeButton.click();
  }
}
