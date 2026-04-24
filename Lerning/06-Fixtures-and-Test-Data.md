# 06 — Fixtures and Test Data

## What Are Fixtures?

In Playwright, a **fixture** is a mechanism to share setup/teardown code between tests.
Instead of creating page objects manually in every test, fixtures inject them automatically.

Think of fixtures as a **dependency injection system**:
- You declare what your test needs (e.g., `homePage`, `loginPage`)
- Playwright creates those objects, passes them to your test, and cleans up after

---

## How Fixtures Work in This Project

**File:** `tests/fixtures/automation-exercise-fixtures.ts`

### Step 1 — Define a type for your fixtures

```ts
type AutomationExercisePageFixtures = {
  homePage: AutomationExerciseHomePage;
  loginPage: AutomationExerciseLoginPage;
  signupPage: AutomationExerciseSignupPage;
  contactPage: AutomationExerciseContactUsPage;
  productsPage: AutomationExerciseProductsPage;
  productDetailPage: AutomationExerciseProductDetailPage;
  cartPage: AutomationExerciseCartPage;
};
```

Each property name (e.g., `homePage`) becomes a parameter name in your test function.

---

### Step 2 — Extend the base `test` with your fixtures

```ts
import { test as base } from '@playwright/test';

export const test = base.extend<AutomationExercisePageFixtures>({

  homePage: async ({ page }, use) => {
    const homePage = new AutomationExerciseHomePage(page);
    await use(homePage);  // ← "use" gives the object to the test
    // Any cleanup code placed AFTER use() runs after the test ends
  },

  loginPage: async ({ page }, use) => {
    const loginPage = new AutomationExerciseLoginPage(page);
    await use(loginPage);
  },

  // ... same pattern for every page object
});
```

The `page` parameter is Playwright's built-in page fixture — a fresh browser page per test.

---

### Step 3 — Use in a test

```ts
// IMPORTANT: Import the EXTENDED test object from your fixtures file
//            import 'expect' SEPARATELY from '@playwright/test'
import { test } from '@fixtures/automation-exercise-fixtures';
import { expect } from '@playwright/test';

test('my test', async ({
  homePage,      // ← automatically created by fixture
  loginPage,     // ← automatically created by fixture
}) => {
  await homePage.navigateTo();
  await homePage.signupLoginLink.click();
  // loginPage is ready to use — no 'new' keyword needed
});
```

You never write `new AutomationExerciseHomePage(page)` in spec files.

---

## Fixture Scopes

Playwright supports different fixture scopes:

| Scope | Runs | Use Case |
|---|---|---|
| `'test'` (default) | Once per test — fresh each time | Page objects, test data |
| `'worker'` | Once per worker — shared | Expensive setup like auth sessions |

Example of a worker-scoped fixture (shared authenticated browser state):

```ts
authenticatedPage: [async ({ browser }, use) => {
  const context = await browser.newContext({
    storageState: 'auth-state.json',  // pre-logged-in state
  });
  const page = await context.newPage();
  await use(page);
  await context.close();
}, { scope: 'worker' }]
```

---

## test.beforeEach and test.afterEach

These run before/after every test inside a `test.describe()` block.
Use them to avoid repeating setup code:

```ts
test.describe('Shopping Cart Tests', () => {

  test.beforeEach(async ({ homePage }) => {
    // Runs before EVERY test in this block
    await homePage.navigateTo();
  });

  test.afterEach(async ({ page }) => {
    // Optional cleanup after each test
    await page.close();
  });

  test('add product to cart', async ({ productsPage, cartPage }) => {
    // We're already on home page — beforeEach handled navigation
    await productsPage.addFirstProductToCart();
    await expect(cartPage.cartItems).toHaveCount(1);
  });

});
```

---

## Test Data — Interfaces

**File:** `tests/data/automation-exercise-data.ts`

All test data shapes are defined as TypeScript interfaces. This means:
- TypeScript auto-completes field names
- You get a compile error if you forget a required field
- It documents exactly what data each feature needs

### Available Interfaces

```ts
// User registration — all required fields
interface UserRegistrationData {
  name: string;
  email: string;
  title: 'Mr' | 'Mrs';   // only these two values accepted
  password: string;
  day: string;
  month: string;
  year: string;
  newsletter?: boolean;   // optional
  firstName: string;
  lastName: string;
  company: string;
  address1: string;
  address2?: string;      // optional
  country: string;
  state: string;
  city: string;
  zipcode: string;
  mobileNumber: string;
}

// Login
interface LoginCredentials {
  email: string;
  password: string;
}

// Contact form
interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  filePath?: string;
}

// Payment page
interface PaymentData {
  nameOnCard: string;
  cardNumber: string;
  cvc: string;
  expirationMonth: string;
  expirationYear: string;
}
```

---

## Creating Test Data Objects

```ts
import type { UserRegistrationData, LoginCredentials } from '@data/automation-exercise-data';

// Simple login data
const validUser: LoginCredentials = {
  email: 'testaccount@example.com',
  password: 'SecurePass123',
};

// Full registration object
const newUser: UserRegistrationData = {
  name: 'John Doe',
  email: `user_${Date.now()}@example.com`,  // unique each run
  title: 'Mr',
  password: 'Password123!',
  day: '15',
  month: 'March',
  year: '1990',
  newsletter: true,
  firstName: 'John',
  lastName: 'Doe',
  company: 'Test Corp',
  address1: '123 Test Street',
  country: 'United States',
  state: 'California',
  city: 'Los Angeles',
  zipcode: '90001',
  mobileNumber: '1234567890',
};
```

---

## Dynamic Data — Avoiding Test Conflicts

Tests that create accounts must use unique emails to avoid "email already exists" errors
when you run the suite multiple times:

```ts
// Using timestamp (milliseconds since epoch)
const uniqueEmail = `user_${Date.now()}@mailinator.com`;

// Using random number
const uniqueEmail = `user_${Math.floor(Math.random() * 99999)}@mailinator.com`;
```

---

## How Page Methods Accept Test Data

Interfaces flow from data file → page object → test:

```ts
// In AutomationExerciseLoginPage.ts
async loginAs(credentials: LoginCredentials): Promise<void> {
  await this.emailInput.fill(credentials.email);
  await this.passwordInput.fill(credentials.password);
  await this.loginButton.click();
}
```

```ts
// In your test
await loginPage.loginAs({
  email: 'user@example.com',
  password: 'mypassword',
});
// TypeScript error if you misspell a field name
```

---

## Environment Variables

Secrets and environment URLs go in a `.env` file:

```env
BASE_URL=https://automationexercise.com
TEST_USER_EMAIL=real-account@example.com
TEST_USER_PASSWORD=realpassword
```

Already wired in `playwright.config.ts`:
```ts
dotenv.config();
baseURL: process.env.BASE_URL || 'https://automationexercise.com',
```

Access anywhere in test code:
```ts
process.env.TEST_USER_EMAIL
```

**Security rule:** Never commit real credentials. Add `.env` to `.gitignore`.

---

## Real Constants From the Data File

**File:** `tests/data/automation-exercise-data.ts`

The data file exports ready-to-use constant objects — you do **not** need to type values yourself.

### TEST_USERS

```ts
import { TEST_USERS } from '@data/automation-exercise-data';

// Three pre-defined user objects
TEST_USERS.VALID_USER    // { email: 'vanvuongbtm@gmail.com', password: '...' }
TEST_USERS.INVALID_USER  // { email: 'invalid@example.com', password: 'wrong' }
TEST_USERS.EXISTING_USER // user that already exists in the system

// Usage in a test
await loginPage.loginUser(
  TEST_USERS.VALID_USER.email,
  TEST_USERS.VALID_USER.password
);
```

### SEARCH_TERMS

```ts
import { SEARCH_TERMS } from '@data/automation-exercise-data';

SEARCH_TERMS.SHIRT   // 'shirt'
SEARCH_TERMS.DRESS   // 'dress'
SEARCH_TERMS.JEANS   // 'jeans'
SEARCH_TERMS.TOP     // 'top'

// Usage
await productsPage.searchProducts(SEARCH_TERMS.SHIRT);
```

### CATEGORIES

```ts
import { CATEGORIES } from '@data/automation-exercise-data';

CATEGORIES.WOMEN.DRESS        // 'Dress'
CATEGORIES.WOMEN.TOPS         // 'Tops'
CATEGORIES.WOMEN.SAREE        // 'Saree'
CATEGORIES.MEN.TSHIRTS        // 'Tshirts'
CATEGORIES.MEN.JEANS          // 'Jeans'
CATEGORIES.KIDS.DRESS         // 'Dress'
CATEGORIES.KIDS.TOPS_SHIRTS   // 'Tops & Shirts'
```

### BRANDS

```ts
import { BRANDS } from '@data/automation-exercise-data';

BRANDS.POLO           BRANDS.H_AND_M
BRANDS.MADAME         BRANDS.MAST_HARBOUR
BRANDS.BABYHUG        BRANDS.ALLEN_SOLLY_JUNIOR
BRANDS.KOOKIE_KIDS    BRANDS.BIBA
```

### SAMPLE_* Ready-Made Objects

For tests that need full objects, use the pre-built samples:

```ts
import {
  SAMPLE_REGISTRATION_DATA,
  SAMPLE_PAYMENT_DATA,
  SAMPLE_CONTACT_DATA,
  SAMPLE_REVIEW_DATA,
} from '@data/automation-exercise-data';

// SAMPLE_REGISTRATION_DATA has ALL required fields already filled in
// Useful when you just need to create an account and do not care which one
await signupPage.fillRegistrationForm(SAMPLE_REGISTRATION_DATA);

// SAMPLE_PAYMENT_DATA has card details for the checkout page
await checkoutPage.fillPaymentDetails(SAMPLE_PAYMENT_DATA);
```

### AutomationExerciseTestData — Allure Labels

From `tests/utils/allure-helpers.ts`, this constant provides consistent Allure label strings:

```ts
import { AllureHelpers, AutomationExerciseTestData } from '@utils/allure-helpers';

// Epic (top-level grouping in Behaviors tab)
AutomationExerciseTestData.epic
// => 'Automation Exercise E2E Testing'

// Features
AutomationExerciseTestData.features.authentication      // 'Authentication'
AutomationExerciseTestData.features.userManagement      // 'User Management'
AutomationExerciseTestData.features.productCatalog      // 'Product Catalog'
AutomationExerciseTestData.features.shoppingCart        // 'Shopping Cart'
AutomationExerciseTestData.features.checkout            // 'Checkout'
AutomationExerciseTestData.features.contactUs           // 'Contact Us'
AutomationExerciseTestData.features.navigation          // 'Navigation'
AutomationExerciseTestData.features.newsletter          // 'Newsletter'

// Stories
AutomationExerciseTestData.stories.registration         // 'User Registration'
AutomationExerciseTestData.stories.login                // 'User Login'
AutomationExerciseTestData.stories.logout               // 'User Logout'
AutomationExerciseTestData.stories.productBrowsing      // 'Product Browsing'
AutomationExerciseTestData.stories.productSearch        // 'Product Search'
AutomationExerciseTestData.stories.cartManagement       // 'Cart Management'
AutomationExerciseTestData.stories.orderPlacement       // 'Order Placement'
AutomationExerciseTestData.stories.contactForm          // 'Contact Form'
AutomationExerciseTestData.stories.subscription         // 'Newsletter Subscription'
AutomationExerciseTestData.stories.reviews              // 'Product Reviews'
AutomationExerciseTestData.stories.pageNavigation       // 'Page Navigation'
```

Using these constants means every test uses the **exact same label strings** — so the Allure Behaviors tab groups correctly:

```ts
// ✅ Consistent — all TC02/TC03/TC04 will appear under same Feature+Story node
AllureHelpers.addEpic(AutomationExerciseTestData.epic);
AllureHelpers.addFeature(AutomationExerciseTestData.features.authentication);
AllureHelpers.addStory(AutomationExerciseTestData.stories.login);

// ❌ Fragile — a typo creates a new orphan group in the report
AllureHelpers.addFeature('authentication');  // lowercase ≠ 'Authentication'
```

---

## Summary Table

| What | Location | Purpose |
|---|---|---|
| Page object fixtures | `tests/fixtures/automation-exercise-fixtures.ts` | Inject page objects into tests |
| TypeScript interfaces | `tests/data/automation-exercise-data.ts` | Typed test data shapes |
| Test constants | `tests/data/automation-exercise-data.ts` | Reusable hardcoded values |
| Environment secrets | `.env` (never committed) | Passwords, base URLs |
| `beforeEach` / `afterEach` | Inside `test.describe()` in spec files | Shared setup per group |
