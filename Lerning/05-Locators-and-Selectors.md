# 05 — Locators and Selectors

## What Is a Locator?

A Locator is Playwright's way of finding HTML elements on a page.
It is **lazy** — it does not search the DOM immediately. It waits until an action is called.

```ts
// This line does NOT throw if the element doesn't exist yet
const loginBtn = page.locator('button.login-btn');

// This is where Playwright actually searches and interacts
await loginBtn.click();
```

All locators in this project are declared as class properties in page objects —
never written inline inside spec files.

---

## Priority Order: Best Locators First

Use the first strategy that works for your element.
Higher priority = more stable when UI changes.

| Priority | Strategy | Example |
|---|---|---|
| 1 (Best) | Role + name | `page.getByRole('button', { name: 'Submit' })` |
| 2 | Label text | `page.getByLabel('Email address')` |
| 3 | Placeholder | `page.getByPlaceholder('Enter your email')` |
| 4 | Visible text | `page.getByText('Welcome back')` |
| 5 | Test ID attribute | `page.getByTestId('submit-btn')` |
| 6 | Specific CSS (data attr) | `page.locator('[data-qa="login-button"]')` |
| 7 (Avoid) | Generic CSS / XPath | `page.locator('.btn.btn-primary')` |

---

## Real Locators From This Project

From `AutomationExerciseHomePage.ts`:

```ts
// Link by its href attribute — very stable
this.signupLoginLink = page.locator('a[href="/login"]').first();
this.productsLink    = page.locator('a[href="/products"]').first();
this.cartLink        = page.locator('a[href="/view_cart"]').first();

// Input by its HTML id — stable when id is intentional
this.subscriptionEmailInput = page.locator('#susbscribe_email');

// Element by text content — good for headings and labels
this.subscriptionTitle = page.locator('h2:has-text("Subscription")');

// Specific structural selector
this.featuresItems = page.locator('.features_items');
```

---

## Playwright Locator Strategies — Full Reference

### 1. By Role (preferred)

Based on ARIA roles. Most resilient to UI changes.

```ts
page.getByRole('button', { name: 'Add to Cart' })
page.getByRole('link', { name: 'Products' })
page.getByRole('heading', { name: 'Login to your account' })
page.getByRole('textbox', { name: 'Email' })
page.getByRole('checkbox', { name: 'Newsletter' })
```

### 2. By Label

Matches an `<input>` by its associated `<label>` text.

```ts
page.getByLabel('Email Address')
page.getByLabel('Password')
```

### 3. By Placeholder

```ts
page.getByPlaceholder('Your Email Here')
```

### 4. By Text Content

```ts
page.getByText('Logged in as')           // exact or substring
page.getByText('Logged in as', { exact: true })
```

### 5. By Test ID (data-testid)

If your app uses `data-testid` attributes, this is the most stable strategy.

```ts
page.getByTestId('signup-button')
// Matches: <button data-testid="signup-button">
```

### 6. By CSS Selector

```ts
page.locator('a[href="/login"]')              // attribute selector
page.locator('#footer')                       // by id
page.locator('h2:has-text("Subscription")')   // CSS + text filter
page.locator('li:has-text("Logged in as")')   // container + text
```

### 7. Chaining and Filtering

```ts
// Within a parent container
page.locator('.cart-items').locator('tr').first()

// Filter by text
page.locator('.product-card').filter({ hasText: 'Blue Top' })

// nth match
page.locator('button.add-to-cart').nth(0)   // first
page.locator('button.add-to-cart').last()   // last
```

---

## What to Avoid

```ts
// BAD — breaks when CSS classes change
page.locator('.btn.btn-primary.mt-3')

// BAD — position-based, breaks when order changes
page.locator('div > div > div > button')

// BAD — fragile XPath
page.locator('//div[@class="col-sm-9"]//button[2]')

// BAD — raw locator in spec file (belongs in page object)
// In a test: await page.locator('#login-btn').click()
```

---

## Waiting for Elements

Playwright locators **auto-wait** — when you call `.click()` or `.fill()`, Playwright
automatically waits for the element to be visible, enabled, and stable (not animating).

You only need explicit waits in special situations:

```ts
// Wait until visible
await locator.waitFor({ state: 'visible' });

// Wait until hidden (e.g., loading spinner disappears)
await locator.waitFor({ state: 'hidden' });

// Wait until attached to DOM
await locator.waitFor({ state: 'attached' });

// Wait for URL to change
await page.waitForURL(/dashboard/);

// Wait for network to settle
await page.waitForLoadState('networkidle');
```

**Never use:**
```ts
await page.waitForTimeout(3000);  // hard sleep — fragile and slow
```

---

## Handling Multiple Matches

If a selector matches more than one element, you must resolve the ambiguity:

```ts
// Get specific index
page.locator('button.add-cart').first()
page.locator('button.add-cart').nth(1)   // 0-based index
page.locator('button.add-cart').last()

// Filter by parent element
page.locator('.product-item').filter({ hasText: 'Blue Top' }).locator('button')

// Count how many matched
const count = await page.locator('.product-item').count();
```

---

## Locators in Page Objects — Pattern Summary

```ts
export class MyPage extends BasePage {
  // Declare every locator as a readonly property
  readonly emailInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    // Initialize in constructor — never recreate during actions
    this.emailInput    = page.getByLabel('Email');
    this.submitButton  = page.getByRole('button', { name: 'Submit' });
    this.errorMessage  = page.getByRole('alert');
  }

  async submitForm(email: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.submitButton.click();
  }
}
```

This ensures each locator is defined once, used everywhere.

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
    // Any cleanup code AFTER use() runs after the test finishes
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
// Import the EXTENDED test object from your fixtures file
import { test, expect } from '../fixtures/automation-exercise-fixtures';

test('my test', async ({
  homePage,      // ← automatically created by fixture
  loginPage,     // ← automatically created by fixture
}) => {
  await homePage.navigateTo();
  await homePage.signupLoginLink.click();
  // loginPage is ready to use
});
```

You never write `new AutomationExerciseHomePage(page)` in spec files.

---

## Fixture Scopes

Playwright supports different fixture scopes:

| Scope | Runs | Use Case |
|---|---|---|
| `'test'` (default) | Once per test | Page objects, fresh data |
| `'worker'` | Once per worker (shared) | Expensive setup like auth tokens |

Example of a worker-scoped fixture (shared authentication state):
```ts
authenticatedPage: [async ({ browser }, use) => {
  const context = await browser.newContext({
    storageState: 'auth-state.json',
  });
  const page = await context.newPage();
  await use(page);
  await context.close();
}, { scope: 'worker' }]
```

---

## test.beforeEach and test.afterEach

These are not fixtures but work alongside them to reduce code repetition:

```ts
test.describe('Shopping Cart Tests', () => {

  test.beforeEach(async ({ homePage }) => {
    // This runs before EVERY test in this describe block
    await homePage.navigateTo();
  });

  test('add product to cart', async ({ homePage, productsPage, cartPage }) => {
    // homePage is already at home page thanks to beforeEach
    await homePage.productsLink.click();
    // ...
  });

});
```

---

## Test Data — Interfaces and Constants

**File:** `tests/data/automation-exercise-data.ts`

### Available TypeScript Interfaces

```ts
// For registration
interface UserRegistrationData {
  name: string;
  email: string;
  title: 'Mr' | 'Mrs';  // union type — only these two values allowed
  password: string;
  day: string;
  month: string;
  year: string;
  newsletter?: boolean;   // ? means optional
  firstName: string;
  lastName: string;
  company: string;
  address1: string;
  address2?: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
  mobileNumber: string;
}

// For login
interface LoginCredentials {
  email: string;
  password: string;
}

// For contact form
interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  filePath?: string;
}

// For payment
interface PaymentData {
  nameOnCard: string;
  cardNumber: string;
  cvc: string;
  expirationMonth: string;
  expirationYear: string;
}
```

---

### Creating Test Data Objects

```ts
import type { UserRegistrationData, LoginCredentials } from '@data/automation-exercise-data';

// Valid login credentials
const validUser: LoginCredentials = {
  email: 'testaccount@example.com',
  password: 'SecurePass123',
};

// Full registration data
const newUser: UserRegistrationData = {
  name: 'John Doe',
  email: `user_${Date.now()}@example.com`,  // unique email per run
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

## Dynamic Data — Preventing Test Conflicts

When tests register new users, use a timestamp or random value in the email to
avoid "email already exists" failures when running tests multiple times:

```ts
const uniqueEmail = `testuser_${Date.now()}@mailinator.com`;
// e.g., testuser_1714000000000@mailinator.com
```

Or use a random suffix:
```ts
const uniqueEmail = `testuser_${Math.floor(Math.random() * 99999)}@mailinator.com`;
```

---

## Passing Data Through Page Methods

Page object methods accept typed data objects:

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
  password: 'MyPassword',
});
```

TypeScript will error at compile time if you forget a required field or mistype a property name.

---

## Environment Variables

For secrets and environment-specific values, use `.env` file:

```env
BASE_URL=https://automationexercise.com
TEST_USER_EMAIL=real-account@example.com
TEST_USER_PASSWORD=realpassword
```

Access in code (already configured in `playwright.config.ts`):
```ts
process.env.TEST_USER_EMAIL
process.env.TEST_USER_PASSWORD
```

Never commit real credentials to git. The `.env` file should be in `.gitignore`.

---

## Summary

| Concept | Where It Lives | Purpose |
|---|---|---|
| Fixtures | `tests/fixtures/` | Inject page objects into tests |
| Type interfaces | `tests/data/automation-exercise-data.ts` | Type-safe test data shapes |
| Test constants | `tests/data/automation-exercise-data.ts` | Reusable data values |
| Secrets | `.env` file | Passwords, URLs (not committed) |
| `beforeEach` | Inside `test.describe()` in spec files | Shared test setup |
</content>
</invoke>