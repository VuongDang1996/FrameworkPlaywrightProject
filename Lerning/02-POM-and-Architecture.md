# 02 — Page Object Model and Framework Architecture

## What Is the Page Object Model?

POM is a design pattern where each web page (or major section) is represented by a TypeScript class.

- The **class** holds: locators (how to find elements) + methods (what actions to take)
- The **test** only calls those methods and asserts outcomes

**Without POM:**
```ts
// Everything messy in one test file
await page.locator('#email').fill('user@test.com');
await page.locator('.login-btn').click();
await expect(page.locator('.error')).toBeVisible();
```

**With POM:**
```ts
// Clean, readable test
await loginPage.loginAs({ email: 'user@test.com', password: 'pass' });
await expect(loginPage.errorMessage).toBeVisible();
```

---

## Layer Model of This Framework

```
┌─────────────────────────────────────────┐
│           SPEC FILES (tests)            │  ← What to test
│   tc01-register-user.spec.ts            │
│   tc02-login-user-correct.spec.ts ...   │
├─────────────────────────────────────────┤
│           FIXTURES                      │  ← How to inject page objects
│   automation-exercise-fixtures.ts       │
├─────────────────────────────────────────┤
│           PAGE OBJECTS                  │  ← How to interact with pages
│   AutomationExerciseHomePage.ts         │
│   AutomationExerciseLoginPage.ts ...    │
├─────────────────────────────────────────┤
│           COMPONENTS                    │  ← Reusable UI parts
│   NavigationComponent.ts               │
│   FooterComponent.ts                   │
├─────────────────────────────────────────┤
│           BASE PAGE (abstract)          │  ← Shared low-level helpers
│   BasePage.ts                          │
├─────────────────────────────────────────┤
│           PLAYWRIGHT + BROWSER         │  ← The real browser engine
└─────────────────────────────────────────┘
```

---

## Layer A — BasePage (the foundation)

**File:** `tests/pages/base/BasePage.ts`

All page objects extend this class. It provides shared behavior so you don't repeat it:

```ts
export abstract class BasePage {
  readonly page: Page;
  readonly loadingSpinner: Locator;
  readonly errorMessage: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loadingSpinner = page.getByTestId('loading-spinner');
    this.errorMessage = page.getByRole('alert').filter({ hasText: /error|failed/i });
    this.successMessage = page.getByRole('alert').filter({ hasText: /success|completed/i });
  }

  // Shared method: wait for page to fully load
  async waitForPageLoad(): Promise<void> { ... }

  // Shared method: get page title
  async getPageTitle(): Promise<string> { ... }

  // Each subclass MUST implement this
  abstract waitForPageReady(): Promise<void>;
}
```

**Rules about BasePage:**
- Always call `super(page)` in every subclass constructor
- `waitForPageReady()` must be overridden — different pages have different readiness signals
- Add a method to BasePage only if it is needed by 3+ page objects

---

## Layer B — Page Objects

**Folder:** `tests/pages/`

Each page class extends BasePage and adds its own locators and methods.

**Real example from `AutomationExerciseHomePage.ts`:**

```ts
export class AutomationExerciseHomePage extends BasePage {
  // 1. Declare locators as readonly class properties
  readonly signupLoginLink: Locator;
  readonly subscriptionEmailInput: Locator;
  readonly subscriptionSubmitButton: Locator;
  readonly scrollUpButton: Locator;

  constructor(page: Page) {
    super(page);  // Always call super

    // 2. Initialize locators in constructor
    this.signupLoginLink = page.locator('a[href="/login"]').first();
    this.subscriptionEmailInput = page.locator('#susbscribe_email');
    this.subscriptionSubmitButton = page.locator('#subscribe');
    this.scrollUpButton = page.locator('#scrollUp');
  }

  // 3. Implement abstract method
  async waitForPageReady(): Promise<void> {
    await this.page.waitForSelector('.features_items');
  }

  // 4. Define business-level action methods
  async navigateTo(): Promise<void> {
    await this.page.goto('/');
    await this.waitForPageReady();
  }

  async subscribeToNewsletter(email: string): Promise<void> {
    await this.subscriptionEmailInput.fill(email);
    await this.subscriptionSubmitButton.click();
  }
}
```

**Naming conventions:**

| Type | Pattern | Example |
|---|---|---|
| Action | `verb + Noun` | `clickLoginButton()` |
| Navigation | `navigateTo...()` | `navigateToProductsPage()` |
| Input | `fill...()` or `enter...()` | `fillEmailAddress()` |
| Query | `is...()` or `get...()` | `isLoggedIn()` |
| Wait | `waitFor...()` | `waitForProductsToLoad()` |

---

## Layer C — Components

**Folder:** `tests/pages/components/`

Components are sections shared across multiple pages (e.g., header, navigation, footer).

```ts
// NavigationComponent.ts
export class NavigationComponent {
  readonly page: Page;
  readonly homeLink: Locator;
  readonly productsLink: Locator;
  readonly cartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.homeLink = page.locator('a[href="/"]').first();
    this.productsLink = page.locator('a[href="/products"]').first();
    this.cartLink = page.locator('a[href="/view_cart"]').first();
  }

  async goToProducts(): Promise<void> {
    await this.productsLink.click();
  }
}
```

A page object uses a component by composing it:

```ts
export class AutomationExerciseHomePage extends BasePage {
  readonly navigation: NavigationComponent;  // ← composed component

  constructor(page: Page) {
    super(page);
    this.navigation = new NavigationComponent(page);
  }
}
```

In a test: `await homePage.navigation.goToProducts();`

---

## Layer D — Fixtures

**File:** `tests/fixtures/automation-exercise-fixtures.ts`

Fixtures provide ready-made page object instances to tests using Playwright's dependency injection.

```ts
import { test as base } from '@playwright/test';
import { AutomationExerciseHomePage } from '@pages/AutomationExerciseHomePage';

type AutomationExercisePageFixtures = {
  homePage: AutomationExerciseHomePage;
  loginPage: AutomationExerciseLoginPage;
  // ... all page objects
};

export const test = base.extend<AutomationExercisePageFixtures>({
  homePage: async ({ page }, use) => {
    const homePage = new AutomationExerciseHomePage(page);
    await use(homePage);   // ← "use" makes it available in the test
  },
  // ...etc for every page object
});
```

In the test file you import `test` from this file, NOT from `@playwright/test`.  
This gives you all pages as named parameters automatically.

---

## Layer E — Spec Files

**Folder:** `tests/specs/automation-exercise/individual-tests/`

Files: `tc01-register-user.spec.ts` through `tc26-verify-scroll-up-without-arrow-button.spec.ts`

```ts
// Always import from your fixtures, not from @playwright/test
import { test, expect } from '../../../fixtures/automation-exercise-fixtures';

test('TC02 - Login User with Correct Credentials @smoke', async ({
  homePage,
  loginPage,
}) => {
  await homePage.navigateTo();
  await homePage.signupLoginLink.click();

  await loginPage.loginAs({
    email: 'valid@email.com',
    password: 'validpassword',
  });

  await expect(homePage.loggedInAsUser).toBeVisible();
});
```

Note how the test reads like a human-readable scenario — no browser plumbing at all.

---

## TypeScript Path Aliases

The `tsconfig.json` defines path aliases so imports are clean:

| Alias | Resolves to |
|---|---|
| `@pages/...` | `tests/pages/...` |
| `@fixtures/...` | `tests/fixtures/...` |
| `@components/...` | `tests/pages/components/...` |
| `@data/...` | `tests/data/...` |
| `@utils/...` | `tests/utils/...` |

Use aliases in every import — never use long relative paths like `../../../../pages/`.

---

## Data Files

**File:** `tests/data/automation-exercise-data.ts`

Contains TypeScript interfaces and test data constants:

```ts
export interface UserRegistrationData {
  name: string;
  email: string;
  title: 'Mr' | 'Mrs';
  password: string;
  firstName: string;
  lastName: string;
  country: string;
  // ... more fields
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface PaymentData {
  nameOnCard: string;
  cardNumber: string;
  cvc: string;
  expirationMonth: string;
  expirationYear: string;
}
```

Use these interfaces in your page methods to get type-safe, autocomplete-friendly test data.

---

## Key Design Rules (Summary)

| Rule | Why |
|---|---|
| Selectors stay inside page classes | One place to fix when UI changes |
| Tests call high-level methods, not locators | Tests remain readable |
| `abstract waitForPageReady()` must be implemented | Prevents flaky tests from timing |
| Use `@pages/` path alias | Cleaner, portable imports |
| One page class per URL/section | Focused responsibility |
| No business logic in BasePage | BasePage is infrastructure only |

