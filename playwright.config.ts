import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Playwright Configuration for POM Framework
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // Test directory
  testDir: './tests/specs',
  
  // Global test timeout - increased for connectivity issues
  timeout: 120 * 1000,
  
  // Global expect timeout
  expect: {
    timeout: 10 * 1000,
  },

  // Test execution settings
  fullyParallel: false, // Disable parallel execution to reduce server load
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 2, // Always use retries for connectivity issues
  workers: 1, // Single worker to avoid overwhelming the target site
  
  // Reporter configuration
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['allure-playwright', { 
      outputFolder: 'allure-results',
      suiteTitle: true,
      links: [
        {
          type: 'issue',
          urlTemplate: 'https://github.com/your-repo/issues/%s',
          nameTemplate: 'Issue #%s'
        },
        {
          type: 'tms',
          urlTemplate: 'https://your-tms.com/testcase/%s',
          nameTemplate: 'Test Case %s'
        }
      ]
    }],
    ...(process.env.CI ? [['github'] as const] : [['list'] as const]),
  ],

  // Global setup and teardown
  globalSetup: require.resolve('./global-setup'),
  globalTeardown: require.resolve('./global-teardown'),

  // Output directories
  outputDir: 'test-results/',
  
  // Web Server configuration (for local development)
  // webServer: {
  //   command: 'npm run start',
  //   port: 3000,
  //   reuseExistingServer: !process.env.CI,
  // },

  use: {
    // Base URL - Updated to use HTTPS
    baseURL: process.env.BASE_URL || 'https://automationexercise.com',
    
    // Browser settings
    headless: process.env.CI ? true : false,
    viewport: { width: 1280, height: 720 },
    
    // Tracing and debugging
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    
    // Action timeout - increased for slow website
    actionTimeout: 30 * 1000,
    navigationTimeout: 60 * 1000, // Increased navigation timeout
    
    // Other settings
    ignoreHTTPSErrors: true,
    acceptDownloads: true,
    
    // Additional settings for connectivity issues
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    extraHTTPHeaders: {
      'Accept-Language': 'en-US,en;q=0.9',
    },
    
    // Locale and timezone
    locale: 'en-US',
    timezoneId: 'America/New_York',
  },

  // Project configurations for different browsers and devices
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        channel: 'chrome',
      },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
    },
    {
      name: 'tablet',
      use: { ...devices['iPad Pro'] },
    },
    
    // Authenticated tests
    {
      name: 'authenticated-chrome',
      use: { 
        ...devices['Desktop Chrome'],
        storageState: 'tests/auth/user.json',
      },
      dependencies: ['setup'],
    },
    
    // Setup project for authentication
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
