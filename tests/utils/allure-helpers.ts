import { test } from '@playwright/test';
import { allure } from 'allure-playwright';

/**
 * Allure Helper Functions for Enhanced Reporting
 */
export class AllureHelpers {
  /**
   * Add description to test
   */
  static addDescription(description: string): void {
    allure.description(description);
  }

  /**
   * Add test ID
   */
  static addTestId(testId: string): void {
    allure.label('testId', testId);
  }

  /**
   * Add issue link
   */
  static addIssue(issueId: string): void {
    allure.issue(issueId, `Issue #${issueId}`);
  }

  /**
   * Add TMS link
   */
  static addTmsLink(testCaseId: string): void {
    allure.tms(testCaseId, `Test Case ${testCaseId}`);
  }

  /**
   * Add story label
   */
  static addStory(story: string): void {
    allure.story(story);
  }

  /**
   * Add feature label
   */
  static addFeature(feature: string): void {
    allure.feature(feature);
  }

  /**
   * Add epic label
   */
  static addEpic(epic: string): void {
    allure.epic(epic);
  }

  /**
   * Add severity
   */
  static addSeverity(severity: 'blocker' | 'critical' | 'normal' | 'minor' | 'trivial'): void {
    allure.severity(severity);
  }

  /**
   * Add owner
   */
  static addOwner(owner: string): void {
    allure.owner(owner);
  }

  /**
   * Add tag
   */
  static addTag(tag: string): void {
    allure.tag(tag);
  }

  /**
   * Add custom label
   */
  static addLabel(name: string, value: string): void {
    allure.label(name, value);
  }

  /**
   * Add parameter
   */
  static addParameter(name: string, value: string): void {
    allure.parameter(name, value);
  }

  /**
   * Add attachment
   */
  static async addAttachment(name: string, content: string | Buffer, type: string = 'text/plain'): Promise<void> {
    await allure.attachment(name, content, type);
  }

  /**
   * Add screenshot attachment
   */
  static async addScreenshot(name: string, screenshot: Buffer): Promise<void> {
    await allure.attachment(name, screenshot, 'image/png');
  }

  /**
   * Start step
   */
  static async startStep(name: string): Promise<void> {
    await allure.step(name, async () => {});
  }

  /**
   * Execute step with function
   */
  static async step<T>(name: string, fn: () => Promise<T>): Promise<T> {
    let result: T;
    await allure.step(name, async () => {
      result = await fn();
    });
    return result!;
  }

  /**
   * Add environment info
   */
  static addEnvironment(key: string, value: string): void {
    allure.label('environment', `${key}:${value}`);
  }
}

/**
 * Test metadata decorator for individual test cases
 */
export function TestMetadata(metadata: {
  testId?: string;
  feature?: string;
  story?: string;
  epic?: string;
  severity?: 'blocker' | 'critical' | 'normal' | 'minor' | 'trivial';
  owner?: string;
  description?: string;
  tags?: string[];
  tmsLink?: string;
  issueLink?: string;
}) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function(...args: any[]) {
      // Add metadata to Allure
      if (metadata.testId) AllureHelpers.addTestId(metadata.testId);
      if (metadata.feature) AllureHelpers.addFeature(metadata.feature);
      if (metadata.story) AllureHelpers.addStory(metadata.story);
      if (metadata.epic) AllureHelpers.addEpic(metadata.epic);
      if (metadata.severity) AllureHelpers.addSeverity(metadata.severity);
      if (metadata.owner) AllureHelpers.addOwner(metadata.owner);
      if (metadata.description) AllureHelpers.addDescription(metadata.description);
      if (metadata.tmsLink) AllureHelpers.addTmsLink(metadata.tmsLink);
      if (metadata.issueLink) AllureHelpers.addIssue(metadata.issueLink);
      if (metadata.tags) {
        metadata.tags.forEach(tag => AllureHelpers.addTag(tag));
      }

      return await originalMethod.apply(this, args);
    };
  };
}

/**
 * Test data for Automation Exercise test cases
 */
export const AutomationExerciseTestData = {
  epic: 'Automation Exercise E2E Testing',
  features: {
    authentication: 'User Authentication',
    userManagement: 'User Management',
    productCatalog: 'Product Catalog',
    shoppingCart: 'Shopping Cart',
    checkout: 'Checkout Process',
    contactUs: 'Contact Us',
    navigation: 'Navigation & UI',
    newsletter: 'Newsletter & Subscription'
  },
  stories: {
    registration: 'User Registration',
    login: 'User Login',
    logout: 'User Logout',
    productBrowsing: 'Product Browsing',
    productSearch: 'Product Search',
    cartManagement: 'Cart Management',
    orderPlacement: 'Order Placement',
    contactForm: 'Contact Form',
    subscription: 'Newsletter Subscription',
    reviews: 'Product Reviews',
    pageNavigation: 'Page Navigation'
  }
};
