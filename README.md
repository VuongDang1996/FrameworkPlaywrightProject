# Playwright TypeScript Framework with Page Object Model (POM) & Allure Reporting

A comprehensive end-to-end testing framework built with Playwright and TypeScript, implementing the Page Object Model design pattern with advanced Allure reporting for maintainable and scalable test automation.

## 🚀 Features

- **Page Object Model (POM)** - Clean separation of test logic and page interactions
- **TypeScript Support** - Type safety and enhanced IDE support
- **Allure Reporting** - Beautiful, comprehensive test reports with step-by-step execution
- **Multi-Browser Testing** - Chrome, Firefox, Safari, and mobile browsers
- **Parallel Execution** - Fast test execution with configurable workers
- **CI/CD Integration** - GitHub Actions workflows with automated Allure report deployment
- **Component Architecture** - Reusable UI components for common elements
- **Authentication Fixtures** - Pre-authenticated user states for tests
- **Comprehensive Test Suite** - 26 individual test cases for Automation Exercise website
- **Visual Testing** - Screenshots and video recording on failures
- **Environment Management** - Multiple environment configurations

## 📁 Project Structure

```
PlaywrightFramework/
├── .github/
│   ├── workflows/
│   │   ├── individual-tests.yml    # Individual tests CI/CD with Allure
│   │   └── playwright.yml          # Main CI/CD workflow
│   └── copilot-instructions.md     # Project setup instructions
├── tests/
│   ├── pages/                      # Page Object classes
│   │   ├── auth/
│   │   │   ├── AutomationExerciseLoginPage.ts
│   │   │   └── AutomationExerciseSignupPage.ts
│   │   ├── components/             # Reusable components
│   │   │   ├── NavigationComponent.ts
│   │   │   └── FooterComponent.ts
│   │   ├── base/
│   │   │   └── BasePage.ts         # Base page class
│   │   ├── AutomationExerciseHomePage.ts
│   │   ├── AutomationExerciseProductsPage.ts
│   │   ├── AutomationExerciseCartPage.ts
│   │   ├── AutomationExerciseContactUsPage.ts
│   │   └── AutomationExerciseProductDetailPage.ts
│   ├── fixtures/                   # Custom fixtures
│   │   └── automation-exercise-fixtures.ts
│   ├── specs/
│   │   └── automation-exercise/
│   │       └── individual-tests/   # 26 comprehensive test cases
│   │           ├── tc01-register-user.spec.ts
│   │           ├── tc02-login-user-correct.spec.ts
│   │           ├── tc03-login-user-incorrect.spec.ts
│   │           ├── ...
│   │           └── tc26-verify-scroll-up-without-arrow-button.spec.ts
│   ├── data/                       # Test data and constants
│   │   └── automation-exercise-data.ts
│   ├── utils/                      # Utility functions
│   │   └── allure-helpers.ts       # Allure reporting utilities
│   └── interfaces/                 # TypeScript interfaces
├── allure-results/                 # Allure test results
├── allure-report/                  # Generated Allure reports
├── playwright.config.ts            # Playwright configuration with Allure
├── global-setup.ts                 # Global setup script
├── global-teardown.ts              # Global teardown script
├── allure.properties               # Allure configuration
├── environment.json                # Environment info for Allure
├── categories.json                 # Test categories for Allure
├── package.json                    # Dependencies and scripts
├── tsconfig.json                   # TypeScript configuration
├── AUTOMATION_EXERCISE_GUIDE.md    # Detailed implementation guide
├── GITHUB_ACTIONS_GUIDE.md         # CI/CD workflow guide
├── INDIVIDUAL_TESTS_GUIDE.md       # Individual tests guide
└── README.md                       # This file
```

## 🎯 Test Coverage - Automation Exercise Website

This framework includes **26 comprehensive test cases** covering all major functionality:

### Authentication & User Management (TC01-TC05)
- ✅ **TC01**: Register User - Complete user registration flow
- ✅ **TC02**: Login User with Correct Credentials - Valid user login
- ✅ **TC03**: Login User with Incorrect Credentials - Error handling
- ✅ **TC04**: Logout User - User logout functionality  
- ✅ **TC05**: Register User with Existing Email - Duplicate email validation

### Navigation & Information (TC06-TC08)
- ✅ **TC06**: Contact Us Form - Contact form submission and file upload
- ✅ **TC07**: Verify Test Cases Page - Navigation to test cases
- ✅ **TC08**: Verify All Products and Product Detail Page - Product catalog

### Product Search & Discovery (TC09, TC18-TC21)
- ✅ **TC09**: Search Product - Product search functionality
- ✅ **TC18**: View Category Products - Category-based browsing
- ✅ **TC19**: View & Cart Brand Products - Brand-based filtering
- ✅ **TC20**: Search Products and Verify Cart After Login - Cart persistence
- ✅ **TC21**: Add Review on Product - Product review functionality

### Newsletter & Subscription (TC10-TC11)
- ✅ **TC10**: Verify Subscription in Home Page - Newsletter signup from home
- ✅ **TC11**: Verify Subscription in Cart Page - Newsletter signup from cart

### Shopping Cart Management (TC12-TC13, TC17, TC22)
- ✅ **TC12**: Add Products in Cart - Multi-product cart addition
- ✅ **TC13**: Verify Product Quantity in Cart - Custom quantity handling
- ✅ **TC17**: Remove Products From Cart - Product removal
- ✅ **TC22**: Add to Cart from Recommended Items - Recommendation system

### Checkout & Order Placement (TC14-TC16, TC23-TC24)
- ✅ **TC14**: Place Order: Register While Checkout - Registration during checkout
- ✅ **TC15**: Place Order: Register Before Checkout - Pre-registered user checkout
- ✅ **TC16**: Place Order: Login Before Checkout - Existing user checkout
- ✅ **TC23**: Verify Address Details in Checkout Page - Address validation
- ✅ **TC24**: Download Invoice After Purchase Order - Invoice generation

### UI/UX Features (TC25-TC26)
- ✅ **TC25**: Verify Scroll Up Using Arrow Button - Scroll arrow functionality
- ✅ **TC26**: Verify Scroll Up Without Arrow Button - Manual scroll functionality

## 🛠️ Installation

### Prerequisites

- Node.js 18.x or later
- npm or yarn package manager
- Git for version control

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd PlaywrightFramework
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Playwright browsers**
   ```bash
   npm run install-browsers
   ```

4. **Install Allure CLI (optional for local reporting)**
   ```bash
   # macOS with Homebrew
   brew install allure
   
   # Or manually download from https://github.com/allure-framework/allure2/releases
   ```

## 🎮 Usage

### Running Individual Tests

```bash
# Run all individual tests with Allure reporting
npm run test:individual

# Run individual tests on specific browser
npm run test:individual:chrome

# Run with parallel workers
npm run ci:individual

# Run specific test case
npx playwright test tests/specs/automation-exercise/individual-tests/tc01-register-user.spec.ts

# Run tests by category
npx playwright test tests/specs/automation-exercise/individual-tests --grep "@smoke"
npx playwright test tests/specs/automation-exercise/individual-tests --grep "@regression"

# Run specific test range
npx playwright test tests/specs/automation-exercise/individual-tests --grep "tc01|tc02|tc03"
```

### Allure Reporting

```bash
# Generate and view Allure report
npm run report:allure-generate
npm run report:allure

# Or combined
npm run test:individual && npm run report:allure-generate && npm run report:allure
```

### Development & Debugging

```bash
# Run tests in headed mode
npm run test:headed

# Run with debug mode
npm run test:debug

# Run with UI mode
npm run test:ui

# Type checking
npm run type-check

# Linting and formatting
npm run lint
npm run lint:fix
npm run format
```

## 📊 Allure Reporting Features

### Enhanced Test Reporting
- **Step-by-step execution** with detailed logs
- **Screenshots** automatically captured on failures and key steps
- **Test metadata** including Epic, Feature, Story classification
- **Parameter tracking** for test inputs and outputs
- **Historical trends** and test result analytics
- **Test categorization** with custom tags and severity levels

### Allure Report Structure
- **Overview Dashboard** - Test execution summary and trends
- **Categories** - Test organization by type (Authentication, Shopping Cart, etc.)
- **Suites** - Test suite organization and results
- **Graphs** - Visual analytics and trend analysis
- **Timeline** - Execution timeline and parallel test visualization
- **Behaviors** - BDD-style feature and story organization

### Metadata Organization
```typescript
// Example test with Allure metadata
AllureHelpers.addEpic('Automation Exercise Testing');
AllureHelpers.addFeature('Authentication');
AllureHelpers.addStory('User Registration');
AllureHelpers.addSeverity('critical');
AllureHelpers.addTag('smoke');
AllureHelpers.addTestId('TC01');
```

## 🚀 CI/CD Integration with GitHub Actions

### Individual Tests Workflow

The framework includes a specialized GitHub Actions workflow for individual tests:

**File**: `.github/workflows/individual-tests.yml`

#### Features:
- **Multi-browser support** (Chrome, Firefox, Safari)
- **Flexible test patterns** (all, smoke, regression, specific test cases)
- **Parallel execution** with configurable workers
- **Automatic Allure report generation**
- **GitHub Pages deployment** for live report viewing
- **Comprehensive artifacts** for debugging

#### Manual Workflow Trigger:
1. Go to **Actions** tab in GitHub
2. Select **Individual Tests with Allure Report**
3. Click **Run workflow**
4. Configure options:
   - **Browser**: `chromium`, `firefox`, `webkit`, or `all`
   - **Test Pattern**: `all`, `smoke`, `regression`, or specific test case
   - **Parallel Workers**: Number of parallel workers (default: 4)

#### Automatic Triggers:
- Push to `main` or `develop` branches
- Pull requests affecting individual tests
- Changes to framework files (pages, fixtures, data, utils)

### Reports and Artifacts

After CI/CD execution:
- **Live Allure Report** on GitHub Pages (main branch)
- **Downloadable artifacts** with test results and reports
- **GitHub summary** with execution details and status
- **Comprehensive logs** for debugging failures

## 🔧 Configuration

### Environment Setup

The framework automatically configures environments and includes:
- **Base URL configuration** for Automation Exercise website
- **Test data management** with randomized user data
- **Browser configurations** for multiple environments
- **Retry logic** and timeout management
- **Authentication state management**

### Playwright Configuration

Key configurations in `playwright.config.ts`:
- **Allure reporter integration**
- **Multi-browser project setup**
- **Global setup and teardown**
- **Retry and timeout configurations**
- **Screenshot and video capture settings**

## 📖 Writing Tests with Allure

### Basic Test Structure with Allure

```typescript
import { test } from '@fixtures/automation-exercise-fixtures';
import { expect } from '@playwright/test';
import { AllureHelpers, AutomationExerciseTestData } from '@utils/allure-helpers';

test.describe('Feature Tests', () => {
  test('TC01 - Register User @smoke', async ({ homePage, loginPage, signupPage }) => {
    // Add Allure metadata
    AllureHelpers.addEpic(AutomationExerciseTestData.epic);
    AllureHelpers.addFeature(AutomationExerciseTestData.features.authentication);
    AllureHelpers.addStory(AutomationExerciseTestData.stories.registration);
    AllureHelpers.addSeverity('critical');
    AllureHelpers.addTestId('TC01');

    await AllureHelpers.step('Navigate to home page', async () => {
      await homePage.navigateTo();
      await expect(homePage.homePageCarousel).toBeVisible();
    });

    await AllureHelpers.step('Complete user registration', async () => {
      await homePage.clickSignupLogin();
      await loginPage.signupUser(userData.name, userData.email);
      // Screenshot automatically captured on failure
    });
  });
});
```

### Allure Helper Functions

```typescript
// Test metadata
AllureHelpers.addEpic('Epic Name');
AllureHelpers.addFeature('Feature Name');
AllureHelpers.addStory('Story Name');
AllureHelpers.addSeverity('critical|normal|minor');
AllureHelpers.addTestId('TC01');
AllureHelpers.addDescription('Test description');
AllureHelpers.addTag('smoke|regression');

// Step reporting
await AllureHelpers.step('Step description', async () => {
  // Test actions
});

// Parameters and attachments
AllureHelpers.addParameter('Key', 'Value');
await AllureHelpers.addScreenshot('Description', screenshot);
await AllureHelpers.addAttachment('File Description', content, 'text/plain');
```

## 🎯 Best Practices

### Test Organization
1. **Descriptive test names** with TC numbers for traceability
2. **Consistent tagging** (@smoke, @regression) for test categorization
3. **Allure metadata** for professional reporting and organization
4. **Step-by-step reporting** for detailed execution tracking

### Page Object Design
1. **BasePage inheritance** for common functionality
2. **Explicit waits** and element ready states
3. **Error handling** and retry mechanisms
4. **Component composition** for reusable UI elements

### Allure Reporting
1. **Meaningful step descriptions** for clear execution flow
2. **Parameter logging** for test inputs and results
3. **Screenshot capture** at key points and failures
4. **Proper categorization** with Epic/Feature/Story hierarchy

## 🐛 Debugging & Troubleshooting

### Local Debugging
```bash
# Run specific test in debug mode
npx playwright test tests/specs/automation-exercise/individual-tests/tc01-register-user.spec.ts --debug

# Run with browser UI visible
npm run test:headed

# Generate trace for detailed debugging
npx playwright test --trace on
```

### Common Issues
1. **Test timeouts** - Adjust timeouts in configuration
2. **Element not found** - Verify selectors and wait conditions
3. **Authentication issues** - Check test data and user state
4. **Report generation** - Ensure Allure CLI is installed correctly

### Allure Report Issues
```bash
# Clear old results and regenerate
npm run clean
npm run test:individual
npm run report:allure-generate
```

## 📚 Documentation

- **[AUTOMATION_EXERCISE_GUIDE.md](./AUTOMATION_EXERCISE_GUIDE.md)** - Detailed test implementation guide
- **[GITHUB_ACTIONS_GUIDE.md](./GITHUB_ACTIONS_GUIDE.md)** - CI/CD workflow configuration guide
- **[INDIVIDUAL_TESTS_GUIDE.md](./INDIVIDUAL_TESTS_GUIDE.md)** - Individual test execution guide

## 📈 Test Results Summary

Recent test execution results:
- **Total Test Cases**: 26
- **Pass Rate**: ~85% (22/26 passing)
- **Coverage Areas**: Authentication, Shopping Cart, Checkout, UI Features
- **Browsers Tested**: Chrome, Firefox, Safari
- **Reporting**: Comprehensive Allure reports with step-by-step execution

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests with proper Allure metadata
4. Ensure all tests pass
5. Update documentation if needed
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For questions and support:
- Create an issue in the repository
- Check the comprehensive documentation guides
- Review existing test examples
- Examine Allure reports for detailed execution insights

---

**Happy Testing with Allure! 🎭📊**

## 📁 Project Structure

```
playwright-pom-framework/
├── .github/
│   ├── workflows/
│   │   ├── playwright.yml          # Main CI/CD workflow
│   │   └── playwright-sharded.yml  # Sharded test execution
│   └── copilot-instructions.md     # Project setup instructions
├── tests/
│   ├── pages/                      # Page Object classes
│   │   ├── auth/
│   │   │   └── LoginPage.ts        # Login page object
│   │   ├── components/             # Reusable components
│   │   │   ├── NavigationComponent.ts
│   │   │   └── FooterComponent.ts
│   │   ├── base/
│   │   │   └── BasePage.ts         # Base page class
│   │   └── HomePage.ts             # Home page object
│   ├── fixtures/                   # Custom fixtures
│   │   ├── page-fixtures.ts        # Page object fixtures
│   │   └── auth-fixtures.ts        # Authentication fixtures
│   ├── specs/                      # Test specifications
│   │   └── auth/
│   │       └── login.spec.ts       # Login tests
│   ├── interfaces/                 # TypeScript interfaces
│   │   └── index.ts               # Common interfaces
│   └── utils/                      # Utility functions
├── playwright.config.ts            # Playwright configuration
├── global-setup.ts                 # Global setup script
├── global-teardown.ts              # Global teardown script
├── package.json                    # Dependencies and scripts
├── tsconfig.json                   # TypeScript configuration
├── .eslintrc.json                  # ESLint configuration
├── .prettierrc.json                # Prettier configuration
├── .gitignore                      # Git ignore rules
├── .env.example                    # Environment variables template
└── README.md                       # This file
```

## 🛠️ Installation

### Prerequisites

- Node.js 18.x or later
- npm or yarn package manager

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd playwright-pom-framework
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Playwright browsers**
   ```bash
   npm run install-browsers
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

## 🎮 Usage

### Running Tests

```bash
# Run all tests
npm test

# Run Automation Exercise tests specifically
npm test -- tests/specs/automation-exercise/

# Run tests in headed mode
npm run test:headed

# Run specific test case
npm test -- --grep "TC01 - Register User"

# Run tests with specific tags
npm run test:smoke
npm run test:regression

# Run tests with debug mode
npm run test:debug

# Run tests with UI mode
npm run test:ui

# Run tests on specific browser
npm run test:chrome
npm run test:firefox
npm run test:safari

# Run mobile tests
npm run test:mobile
```

### Automation Exercise Test Cases

The framework includes comprehensive tests for the Automation Exercise website with 26 test cases covering:

- **Authentication**: User registration, login, logout (TC01-TC05)
- **Navigation**: Contact form, test cases page (TC06-TC07)  
- **Products**: Product browsing, search, reviews (TC08-TC09, TC21)
- **Shopping Cart**: Add/remove products, quantity verification (TC12-TC13, TC17, TC22)
- **Subscription**: Newsletter subscription on different pages (TC10-TC11)
- **UI Features**: Scroll functionality, category browsing (TC25-TC26, TC18-TC19)

See [AUTOMATION_EXERCISE_GUIDE.md](./AUTOMATION_EXERCISE_GUIDE.md) for detailed implementation guide.

### Development

```bash
# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix

# Formatting
npm run format

# View test reports
npm run report
```

## 📖 Writing Tests

### Basic Test Structure

```typescript
import { test, expect } from '@fixtures/page-fixtures';

test.describe('Feature Tests', () => {
  test('should perform action', async ({ loginPage, homePage }) => {
    await loginPage.navigateTo();
    await loginPage.login({
      username: 'user@example.com',
      password: 'password123'
    });
    
    await expect(homePage.welcomeMessage).toBeVisible();
  });
});
```

### Using Authentication Fixtures

```typescript
import { test, expect } from '@fixtures/auth-fixtures';

test.describe('Authenticated Tests', () => {
  test('should access protected page', async ({ loggedInHomePage }) => {
    // User is already logged in
    await expect(loggedInHomePage.welcomeMessage).toBeVisible();
  });
});
```

### Creating Page Objects

```typescript
import { type Page, type Locator } from '@playwright/test';
import { BasePage } from '@pages/base/BasePage';

export class NewPage extends BasePage {
  readonly newElement: Locator;

  constructor(page: Page) {
    super(page);
    this.newElement = page.getByTestId('new-element');
  }

  async waitForPageReady(): Promise<void> {
    await super.waitForPageLoad();
    await this.waitForElement(this.newElement);
  }

  async performAction(): Promise<void> {
    await this.newElement.click();
  }
}
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
BASE_URL=https://your-app.com
TEST_USERNAME=testuser@example.com
TEST_PASSWORD=password123
```

### Playwright Configuration

The framework supports multiple project configurations:

- **chromium** - Desktop Chrome
- **firefox** - Desktop Firefox  
- **webkit** - Desktop Safari
- **mobile-chrome** - Mobile Chrome
- **mobile-safari** - Mobile Safari
- **authenticated-chrome** - Chrome with pre-authentication

### Browser Configuration

```typescript
// playwright.config.ts
export default defineConfig({
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Add more browser configurations
  ],
});
```

## 🚀 CI/CD Integration

### GitHub Actions

The framework includes comprehensive GitHub Actions workflows:

#### Main Workflow (`.github/workflows/playwright.yml`)
- Multi-browser testing matrix
- Smoke tests for quick feedback
- Mobile testing
- Artifact collection and reporting
- PR comments with results

#### Sharded Workflow (`.github/workflows/playwright-sharded.yml`)
- Parallel test execution across multiple runners
- Report merging
- Configurable shard count

### Secrets Configuration

Set up the following secrets in your GitHub repository:

```
BASE_URL - Application base URL
TEST_USERNAME - Test user username
TEST_PASSWORD - Test user password
```

## 📊 Reporting

The framework generates multiple report formats:

- **HTML Report** - Interactive web-based report
- **JSON Report** - Machine-readable test results
- **JUnit Report** - For CI/CD integration
- **GitHub Report** - Native GitHub Actions integration

### Viewing Reports

```bash
# Open HTML report
npm run report

# Reports are saved in:
# - playwright-report/ (HTML)
# - test-results/ (Screenshots, videos, traces)
```

## 🎯 Best Practices

### Page Object Design

1. **Single Responsibility** - Each page object represents one logical page
2. **Encapsulation** - Keep locators private, expose public methods
3. **Inheritance** - Extend BasePage for common functionality
4. **Composition** - Use components for reusable UI elements

### Test Organization

1. **Descriptive Names** - Use clear, descriptive test names
2. **Tags** - Use `@smoke`, `@regression` tags for test categorization
3. **Fixtures** - Leverage fixtures for setup and teardown
4. **Data Separation** - Keep test data separate from test logic

### Locator Strategy

1. **User-facing selectors** - Prefer `getByRole()`, `getByLabel()`
2. **Test IDs** - Use `data-testid` for complex elements
3. **Avoid CSS selectors** - Use semantic selectors when possible
4. **Stable locators** - Choose locators that won't break with UI changes

## 🐛 Debugging

### Debug Mode

```bash
# Run tests in debug mode
npm run test:debug

# Run specific test in debug mode
npx playwright test tests/specs/auth/login.spec.ts --debug
```

### Screenshots and Videos

The framework automatically captures:
- Screenshots on test failure
- Videos on test failure
- Traces for detailed debugging

### Headful Mode

```bash
# Run tests with browser UI visible
npm run test:headed
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📋 Test Categories

### Smoke Tests (`@smoke`)
- Critical path functionality
- Quick feedback tests
- Run on every commit

### Regression Tests (`@regression`)
- Comprehensive feature testing
- Edge case coverage
- Run on release candidates

## 🔍 Troubleshooting

### Common Issues

1. **Browser Installation**
   ```bash
   npx playwright install --with-deps
   ```

2. **TypeScript Errors**
   ```bash
   npm run type-check
   ```

3. **Test Timeouts**
   - Increase timeout in `playwright.config.ts`
   - Check for slow network conditions

4. **Authentication Issues**
   - Verify credentials in `.env`
   - Check authentication flow in global setup

## 📚 Resources

- [Playwright Documentation](https://playwright.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)
- [Best Practices Guide](https://playwright.dev/docs/best-practices)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For questions and support:
- Create an issue in the repository
- Check the documentation
- Review existing test examples

---

**Happy Testing! 🎭**
