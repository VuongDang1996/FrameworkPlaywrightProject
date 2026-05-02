# 12 — Playwright TypeScript Interactive Exercises

A complete practice lab covering Playwright, TypeScript, POM architecture, fixtures, locators, assertions, and more.

---

## 🧠 Flashcards

**Concept:** Page Object Model (POM)
POM is a design pattern where each web page is represented as a class. The class contains locators as properties and user interactions as methods. This keeps test files clean — they only call page object methods, never raw selectors.

**Concept:** Playwright Locator
A Playwright Locator is a lazy reference to a DOM element. It is created with `page.locator(selector)`. Unlike querying the DOM directly, a locator automatically retries until the element is found or a timeout is reached.

**Concept:** Auto-waiting
Playwright automatically waits for elements to be actionable before performing actions like `click()`, `fill()`, `hover()`. This means you rarely need `await page.waitForTimeout()` — Playwright waits for visibility, stability, and enabled state automatically.

**Concept:** test.describe
`test.describe()` is a grouping block that organises related test cases. It can have its own `beforeEach` and `afterEach` hooks, and you can nest `describe` blocks for hierarchical organisation.

**Concept:** Fixtures in Playwright
Fixtures are the dependency injection system of Playwright. They setup and teardown resources (pages, authenticated users, databases) automatically before and after each test. Custom fixtures extend the base `test` object.

**Concept:** expect() Assertions
`expect()` is the assertion library built into Playwright. It provides auto-retrying assertions like `toBeVisible()`, `toHaveText()`, `toHaveURL()`, and `toBeEnabled()`. These are preferred over manual checks.

**Term:** toBeVisible()
An assertion that confirms the selected element is visible in the DOM and on screen. It retries automatically up to the default timeout (usually 5 seconds). Fails if element is hidden, detached, or has `display: none`.

**Term:** page.goto()
A Playwright method that navigates the browser to a given URL. It waits until the page reaches the `load` state by default. Example: `await page.goto('https://example.com')`.

**Term:** page.fill()
A Playwright method that clears an input field and types the given text into it. It focuses the element first. Example: `await page.fill('#email', 'user@test.com')`.

**Term:** getByRole()
A Playwright locator strategy that finds elements by their ARIA role and accessible name. It is the most recommended strategy because it encourages accessibility. Example: `page.getByRole('button', { name: 'Submit' })`.

**Term:** getByTestId()
A locator strategy that finds elements using a `data-testid` attribute. This is robust because test IDs are not affected by styling or content changes. Example: `page.getByTestId('login-btn')`.

**Term:** Soft Assertions
Soft assertions (`expect.soft()`) allow multiple assertions in a test to run even if one fails. All failures are collected and reported at the end, rather than stopping the test immediately at the first failure.

**Term:** test.beforeEach
A hook that runs a given async function before each test inside a `describe` block. Commonly used to navigate to a page, log in, or set up state. Keeps test bodies lean and removes repeated setup code.

**Term:** Headed vs Headless Mode
In **headless** mode (default), the browser runs without a UI window — faster and better for CI. In **headed** mode (`--headed` flag), you can see the browser — great for debugging. Toggle with `npx playwright test --headed`.

**Term:** Playwright Config (playwright.config.ts)
The central configuration file for a Playwright project. It defines the base URL, test directory, global timeout, browser projects (Chromium, Firefox, WebKit), reporters (Allure, HTML), and global setup/teardown files.

**Concept:** Allure Reporting
Allure is a visual test reporting framework. Playwright integrates with it via the `allure-playwright` package. Each test can be decorated with metadata: Epic, Feature, Story, Severity, Owner, Test ID. This produces rich, filterable HTML reports.

**Concept:** Locator Chaining
You can chain locators to narrow down the target element. Example: `page.locator('.card').filter({ hasText: 'Premium' }).getByRole('button')`. This is far safer than writing deeply nested CSS selectors.

**Concept:** TypeScript Interface for Test Data
Defining a TypeScript interface for your test data objects (e.g., `UserData { email: string; password: string }`) enforces structure, enables IDE autocomplete, and catches typos at compile time rather than at runtime.

---

## 📝 Quizzes

### Which locator strategy is most recommended by Playwright?
- [ ] `page.locator('.btn-submit')`
- [ ] `page.locator('#submit-id')`
- [x] `page.getByRole('button', { name: 'Submit' })`
- [ ] `page.locator('button:nth-child(2)')`

### What does auto-waiting mean in Playwright?
- [ ] Playwright waits a fixed 5 seconds before every action
- [x] Playwright automatically retries actions until the element is actionable or timeout is reached
- [ ] You must manually add `await page.waitForTimeout(1000)` before all clicks
- [ ] Auto-waiting only applies to assertions, not actions

### In our POM framework, where should raw `page.locator()` calls be placed?
- [ ] Directly inside each `test()` block
- [ ] In `playwright.config.ts`
- [x] As properties inside the Page Object class
- [ ] In `karate-config.js`

### What is the correct import for `expect` in this Playwright TypeScript framework?
- [x] `import { expect } from '@playwright/test'`
- [ ] `import { expect } from '@fixtures/automation-exercise-fixtures'`
- [ ] `import { expect } from 'jest'`
- [ ] `import expect from 'chai'`

### What does `test.describe()` do?
- [ ] Runs a single test case
- [ ] Configures the browser to use
- [x] Groups related tests together and allows shared hooks like `beforeEach`
- [ ] Skips tests that match the description

### Which method clears an input field AND types new text?
- [ ] `page.type(selector, text)`
- [x] `page.fill(selector, text)`
- [ ] `page.click(selector)`
- [ ] `page.keyboard.type(text)`

### How do you run only tests tagged with `@smoke` in Playwright?
- [ ] `npx playwright test --tag smoke`
- [ ] `npx playwright test --filter smoke`
- [x] `npx playwright test --grep "@smoke"`
- [ ] `npx playwright test smoke`

### What is a soft assertion in Playwright?
- [ ] An assertion that always passes
- [ ] An assertion that only works on mobile browsers
- [x] An assertion that records a failure but allows the test to continue running
- [ ] An assertion using `assert` from Node.js

### What does `toBeVisible()` check?
- [ ] That the element exists in the DOM
- [x] That the element is both in the DOM and visible on screen
- [ ] That the element has the correct text content
- [ ] That the element is enabled for interaction

### Where should `playwright.config.ts` set the base URL?
- [ ] In a `.env.local` file only
- [ ] Inside every individual test file
- [x] In the `use: { baseURL: '...' }` property of `playwright.config.ts`
- [ ] In `package.json` under a `playwright` key

---

## 🏋️ Coding Exercises

### [Exercise] Navigate and Assert Page Title
- **Difficulty:** Basic
- **Description:** Write a simple Playwright test that navigates to `https://playwright.dev` and asserts that the page title contains the word "Playwright".

```typescript
import { test, expect } from '@playwright/test';

test('playwright.dev has correct title', async ({ page }) => {
  // 1. Navigate to https://playwright.dev
  // YOUR CODE HERE

  // 2. Assert the page title contains 'Playwright'
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

test('playwright.dev has correct title', async ({ page }) => {
  await page.goto('https://playwright.dev');
  await expect(page).toHaveTitle(/Playwright/);
});
```

---

### [Exercise] Fill a Login Form
- **Difficulty:** Basic
- **Description:** Navigate to a login page and fill in the email and password fields, then click the submit button. Use `page.fill()` and `page.click()` with CSS selectors.

```typescript
import { test, expect } from '@playwright/test';

test('user can fill login form', async ({ page }) => {
  await page.goto('https://practice.expandtesting.com/login');

  // 1. Fill the username field (selector: #username) with 'practice'
  // YOUR CODE HERE

  // 2. Fill the password field (selector: #password) with 'SuperSecretPassword!'
  // YOUR CODE HERE

  // 3. Click the submit button (selector: button[type="submit"])
  // YOUR CODE HERE

  // 4. Assert the URL contains '/secure'
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

test('user can fill login form', async ({ page }) => {
  await page.goto('https://practice.expandtesting.com/login');
  await page.fill('#username', 'practice');
  await page.fill('#password', 'SuperSecretPassword!');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/\/secure/);
});
```

---

### [Exercise] Use getByRole Locator
- **Difficulty:** Basic
- **Description:** Rewrite the click action using the accessible `getByRole` locator strategy instead of CSS selectors. Find a button by its role and accessible name.

```typescript
import { test, expect } from '@playwright/test';

test('use getByRole to click a button', async ({ page }) => {
  await page.goto('https://playwright.dev');

  // 1. Find the link with the name 'Get started' using getByRole
  //    and click it. Role is 'link'.
  // YOUR CODE HERE

  // 2. Assert the new URL contains '/docs/intro'
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

test('use getByRole to click a button', async ({ page }) => {
  await page.goto('https://playwright.dev');
  await page.getByRole('link', { name: 'Get started' }).click();
  await expect(page).toHaveURL(/\/docs\/intro/);
});
```

---

### [Exercise] Create a Page Object Class
- **Difficulty:** Intermediate
- **Description:** Create a TypeScript class `LoginPage` that encapsulates the login page's locators and a `login()` method. Then write a test that uses this class.

```typescript
import { test, expect, Page } from '@playwright/test';

// 1. Create a LoginPage class with a constructor that accepts Page
// 2. Add locator properties: usernameInput, passwordInput, submitButton, welcomeMessage
// 3. Add a login(username: string, password: string) method
// YOUR CODE HERE

test('POM login test', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await page.goto('https://practice.expandtesting.com/login');

  // 4. Call loginPage.login('practice', 'SuperSecretPassword!')
  // YOUR CODE HERE

  // 5. Assert that the welcome message is visible
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect, Page, Locator } from '@playwright/test';

class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly welcomeMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.submitButton = page.locator('button[type="submit"]');
    this.welcomeMessage = page.locator('#flash');
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}

test('POM login test', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await page.goto('https://practice.expandtesting.com/login');
  await loginPage.login('practice', 'SuperSecretPassword!');
  await expect(loginPage.welcomeMessage).toBeVisible();
});
```

---

### [Exercise] Write a test.describe Block with beforeEach
- **Difficulty:** Intermediate
- **Description:** Group two related tests inside a `test.describe` block. Use `beforeEach` to navigate to the home page before both tests, so you don't repeat navigation code.

```typescript
import { test, expect } from '@playwright/test';

// 1. Create a test.describe block named 'Home Page Tests'
// 2. Add a beforeEach hook that navigates to 'https://playwright.dev'
// 3. Add a test that asserts the title contains 'Playwright'
// 4. Add a second test that asserts there is a link named 'Get started'
// YOUR CODE HERE
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

test.describe('Home Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://playwright.dev');
  });

  test('page has correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Playwright/);
  });

  test('page has get started link', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Get started' })).toBeVisible();
  });
});
```

---

### [Exercise] Locator Chaining and Filtering
- **Difficulty:** Intermediate
- **Description:** Use locator chaining to find a specific item inside a list. Filter a parent container by text, then find a child element within it.

```typescript
import { test, expect } from '@playwright/test';

test('find item inside a filtered container', async ({ page }) => {
  await page.goto('https://playwright.dev/docs/locators');

  // 1. Find the first <article> element that contains the text 'filter'
  //    using: page.locator('article').filter({ hasText: /filter/i }).first()
  // YOUR CODE HERE

  // 2. Assert that this filtered article element is visible
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

test('find item inside a filtered container', async ({ page }) => {
  await page.goto('https://playwright.dev/docs/locators');
  const filteredArticle = page.locator('article').filter({ hasText: /filter/i }).first();
  await expect(filteredArticle).toBeVisible();
});
```

---

### [Exercise] Multiple Assertions with Soft Expect
- **Difficulty:** Intermediate
- **Description:** Use `expect.soft()` to check multiple properties of a page without stopping at the first failure. This allows you to collect all assertion results in a single test run.

```typescript
import { test, expect } from '@playwright/test';

test('soft assertions check multiple page properties', async ({ page }) => {
  await page.goto('https://playwright.dev');

  // 1. Use expect.soft() to assert the title contains 'Playwright'
  // YOUR CODE HERE

  // 2. Use expect.soft() to assert the URL is 'https://playwright.dev/'
  // YOUR CODE HERE

  // 3. Use expect.soft() to assert a 'Get started' link is visible
  // YOUR CODE HERE

  // 4. (Regular) Assert a 'Docs' link is visible using normal expect()
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

test('soft assertions check multiple page properties', async ({ page }) => {
  await page.goto('https://playwright.dev');

  await expect.soft(page).toHaveTitle(/Playwright/);
  await expect.soft(page).toHaveURL('https://playwright.dev/');
  await expect.soft(page.getByRole('link', { name: 'Get started' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Docs' })).toBeVisible();
});
```

---

### [Exercise] Define a TypeScript Interface for Test Data
- **Difficulty:** Intermediate
- **Description:** Define a TypeScript interface `UserCredentials` and use it to type a test data object. Then use that typed object inside a test to fill a login form.

```typescript
import { test, expect } from '@playwright/test';

// 1. Define an interface UserCredentials with fields: username (string) and password (string)
// YOUR CODE HERE

// 2. Create a const testUser: UserCredentials object with values 'practice' and 'SuperSecretPassword!'
// YOUR CODE HERE

test('login using typed test data', async ({ page }) => {
  await page.goto('https://practice.expandtesting.com/login');

  // 3. Use testUser.username and testUser.password to fill the form
  // YOUR CODE HERE

  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/\/secure/);
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

interface UserCredentials {
  username: string;
  password: string;
}

const testUser: UserCredentials = {
  username: 'practice',
  password: 'SuperSecretPassword!',
};

test('login using typed test data', async ({ page }) => {
  await page.goto('https://practice.expandtesting.com/login');
  await page.fill('#username', testUser.username);
  await page.fill('#password', testUser.password);
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/\/secure/);
});
```

---

### [Exercise] Screenshot on Failure
- **Difficulty:** Intermediate
- **Description:** Use a `try/catch` block to attempt a test action and manually capture a screenshot if it fails. This is useful for debugging intermittent CI failures.

```typescript
import { test, expect } from '@playwright/test';

test('capture screenshot on assertion failure', async ({ page }) => {
  await page.goto('https://playwright.dev');

  try {
    // 1. Write an assertion that will FAIL intentionally
    //    e.g., assert the title is 'Wrong Title'
    // YOUR CODE HERE
  } catch (error) {
    // 2. Take a full-page screenshot saved as 'failure-screenshot.png'
    //    Use: await page.screenshot({ path: '...', fullPage: true })
    // YOUR CODE HERE
    throw error; // Re-throw so the test still fails
  }
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

test('capture screenshot on assertion failure', async ({ page }) => {
  await page.goto('https://playwright.dev');

  try {
    await expect(page).toHaveTitle('Wrong Title');
  } catch (error) {
    await page.screenshot({ path: 'failure-screenshot.png', fullPage: true });
    throw error;
  }
});
```

---

### [Exercise] Custom Fixture with Page Object
- **Difficulty:** Advanced
- **Description:** Create a custom Playwright fixture that automatically instantiates a `LoginPage` object and injects it into tests. This is how our framework works under the hood.

```typescript
import { test as base, expect, Page, Locator } from '@playwright/test';

class LoginPage {
  constructor(public page: Page) {}
  usernameInput = this.page.locator('#username');
  passwordInput = this.page.locator('#password');
  submitButton  = this.page.locator('button[type="submit"]');

  async login(u: string, p: string) {
    await this.usernameInput.fill(u);
    await this.passwordInput.fill(p);
    await this.submitButton.click();
  }
}

// 1. Define a custom fixture type: { loginPage: LoginPage }
// 2. Use base.extend<{ loginPage: LoginPage }>() to create a custom test
// 3. Inside the fixture, create a new LoginPage(page) and use({ loginPage })
// YOUR CODE HERE

// 4. Write a test using the custom 'test' (not the base) that injects loginPage
// YOUR CODE HERE
```

### Solution
```typescript
import { test as base, expect, Page } from '@playwright/test';

class LoginPage {
  constructor(public page: Page) {}
  usernameInput = this.page.locator('#username');
  passwordInput = this.page.locator('#password');
  submitButton  = this.page.locator('button[type="submit"]');

  async login(u: string, p: string) {
    await this.usernameInput.fill(u);
    await this.passwordInput.fill(p);
    await this.submitButton.click();
  }
}

const test = base.extend<{ loginPage: LoginPage }>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
});

test('custom fixture injects loginPage', async ({ loginPage, page }) => {
  await page.goto('https://practice.expandtesting.com/login');
  await loginPage.login('practice', 'SuperSecretPassword!');
  await expect(page).toHaveURL(/\/secure/);
});
```

---

### [Exercise] API Request Mocking with route()
- **Difficulty:** Advanced
- **Description:** Use `page.route()` to intercept and mock an API response. This lets you test UI behaviour for edge cases (like empty responses or errors) without depending on a real backend.

```typescript
import { test, expect } from '@playwright/test';

test('mock API to return empty products list', async ({ page }) => {
  // 1. Use page.route() to intercept requests to '**/api/products**'
  // 2. Fulfil the request with: status 200, body: JSON.stringify([])
  //    Use: route.fulfill({ status: 200, body: ..., contentType: 'application/json' })
  // YOUR CODE HERE

  await page.goto('https://your-app.example.com/products');

  // 3. Assert that an 'No products found' text is visible
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

test('mock API to return empty products list', async ({ page }) => {
  await page.route('**/api/products**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([]),
    });
  });

  await page.goto('https://your-app.example.com/products');
  await expect(page.getByText('No products found')).toBeVisible();
});
```

---

### [Exercise] Data-Driven Tests with test.each (Parametrize)
- **Difficulty:** Advanced
- **Description:** Use Playwright's `test.each` (or a loop) pattern to run the same test logic with multiple sets of data. This avoids duplicated test blocks for different input scenarios.

```typescript
import { test, expect } from '@playwright/test';

// Define an array of test case data
const loginScenarios = [
  { username: 'practice', password: 'SuperSecretPassword!', shouldPass: true },
  { username: 'wronguser', password: 'wrongpass', shouldPass: false },
];

// 1. Loop over loginScenarios
// 2. For each scenario, create a test() block with a descriptive name
// 3. Navigate to the login page and attempt login
// 4. If shouldPass is true, assert URL contains '/secure'
// 5. If shouldPass is false, assert an error message is visible
// YOUR CODE HERE
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

const loginScenarios = [
  { username: 'practice', password: 'SuperSecretPassword!', shouldPass: true },
  { username: 'wronguser', password: 'wrongpass', shouldPass: false },
];

for (const scenario of loginScenarios) {
  test(`login with ${scenario.username} - should ${scenario.shouldPass ? 'pass' : 'fail'}`, async ({ page }) => {
    await page.goto('https://practice.expandtesting.com/login');
    await page.fill('#username', scenario.username);
    await page.fill('#password', scenario.password);
    await page.click('button[type="submit"]');

    if (scenario.shouldPass) {
      await expect(page).toHaveURL(/\/secure/);
    } else {
      await expect(page.locator('#flash.error')).toBeVisible();
    }
  });
}
```

---

### [Exercise] Full E2E Test with Allure Metadata
- **Difficulty:** Advanced
- **Description:** Write a complete end-to-end test using our project's custom fixtures and AllureHelpers. Use `AllureHelpers.step()` to create named steps and decorate the test with Epic, Feature, Story, and Severity metadata.

```typescript
import { test } from '@fixtures/automation-exercise-fixtures';
import { expect } from '@playwright/test';
import { AllureHelpers, AutomationExerciseTestData } from '@utils/allure-helpers';
import { TEST_USERS } from '@data/automation-exercise-data';

// 1. Write a test inside a describe block named 'Account Management'
// 2. Add AllureHelpers metadata: Epic, Feature (navigation), Story (pageNavigation), Severity 'critical'
// 3. Create 3 AllureHelpers.step() blocks:
//    - Step 1: 'Navigate to home page' - call homePage.navigateTo()
//    - Step 2: 'Click Signup/Login link' - call homePage.clickSignupLogin()
//    - Step 3: 'Login with valid credentials' - call loginPage.loginUser(email, password) from TEST_USERS.VALID_USER
// 4. Assert: the current URL contains '/account'
// YOUR CODE HERE
```

### Solution
```typescript
import { test } from '@fixtures/automation-exercise-fixtures';
import { expect } from '@playwright/test';
import { AllureHelpers, AutomationExerciseTestData } from '@utils/allure-helpers';
import { TEST_USERS } from '@data/automation-exercise-data';

test.describe('Account Management', () => {
  test('TC-ADV-01 - Login and land on account page @regression', async ({
    homePage,
    loginPage,
  }) => {
    AllureHelpers.addEpic(AutomationExerciseTestData.epic);
    AllureHelpers.addFeature(AutomationExerciseTestData.features.navigation);
    AllureHelpers.addStory(AutomationExerciseTestData.stories.pageNavigation);
    AllureHelpers.addSeverity('critical');
    AllureHelpers.addOwner('QA Team');
    AllureHelpers.addTestId('TC-ADV-01');

    await AllureHelpers.step('Navigate to home page', async () => {
      await homePage.navigateTo();
    });

    await AllureHelpers.step('Click Signup/Login link', async () => {
      await homePage.clickSignupLogin();
    });

    await AllureHelpers.step('Login with valid credentials', async () => {
      await loginPage.loginUser(TEST_USERS.VALID_USER.email, TEST_USERS.VALID_USER.password);
    });

    await expect(homePage.page).toHaveURL(/account/);
  });
});
```

---

## 🧠 More Flashcards

**Term:** page.hover()
Simulates a mouse hover over an element. Triggers CSS `:hover` states, tooltip reveals, or dropdown menus. Example: `await page.locator('.menu-item').hover()`. Playwright waits for the element to be visible before hovering.

**Term:** page.waitForSelector()
Waits for a CSS selector to appear in the DOM and reach a specific state (visible, attached, hidden, detached). Prefer `expect(locator).toBeVisible()` for assertions, but `waitForSelector` is useful in non-assertion waiting scenarios.

**Term:** locator.nth(index)
Returns the nth element matching a locator (0-indexed). `page.locator('tr').nth(2)` returns the 3rd row. Prefer `first()` and `last()` shortcuts for clarity. Avoids brittle CSS `:nth-child()` selectors.

**Term:** locator.first() / locator.last()
`first()` returns the first element matching the locator; `last()` returns the last. These are shorthand for `.nth(0)` and `.nth(-1)`. Use when you know you want the first or last item in a list.

**Concept:** getByLabel()
Finds a form input associated with a `<label>` element. `page.getByLabel('Email address')` finds the input whose label reads "Email address". This is the most user-friendly locator for forms — mirrors how real users identify fields.

**Concept:** getByPlaceholder()
Finds an input element by its `placeholder` attribute text. Example: `page.getByPlaceholder('Enter your email')`. Less robust than `getByLabel` but useful when no label is present.

**Concept:** getByText()
Finds any element that contains the given text. `page.getByText('Submit')` returns any element (button, span, div) with that exact text. Add `{ exact: true }` for exact matching, or pass a regex for partial matches.

**Concept:** Test Isolation
Each Playwright test runs in a fresh browser context (new cookies, new localStorage, clean slate). This means tests cannot accidentally share state. Never rely on a previous test having run — each test must independently set up all the state it needs.

**Concept:** afterEach Hook
`test.afterEach()` runs after every test in a describe block, regardless of pass or fail. Use it to clean up test data, log results, or take a final screenshot. Teardown should be idempotent — safe to run even if setup partially failed.

**Concept:** expect.configure()
`expect.configure({ timeout: 10000 })` sets a custom timeout for all assertions that follow it in that scope. Use when testing slow UI animations or network-heavy pages that legitimately need more time. Prefer targeted timeouts over global increases.

---

## 📝 More Quizzes

### What does `locator.nth(2)` return?
- [ ] The 2nd element (1-indexed)
- [x] The 3rd element (0-indexed)
- [ ] The last 2 elements
- [ ] An error — nth() requires at least 3 matches

### Which locator finds an input by its associated label text?
- [ ] `page.getByText('Email')`
- [ ] `page.getByPlaceholder('Email')`
- [x] `page.getByLabel('Email')`
- [ ] `page.locator('label:has-text("Email") + input')`

### What does test isolation mean in Playwright?
- [ ] Tests share cookies from the previous test
- [x] Each test gets a fresh browser context — clean cookies and localStorage
- [ ] Tests run sequentially to avoid conflicts
- [ ] You must manually clear cookies in beforeEach

### What is `afterEach` used for?
- [ ] Running setup before each test
- [ ] Defining test data
- [x] Running teardown/cleanup after every test, even on failure
- [ ] Registering custom reporters

### What does `getByText('Submit', { exact: true })` do?
- [ ] Finds elements containing the word 'Submit' anywhere
- [x] Finds only elements whose full text content is exactly 'Submit'
- [ ] Finds all submit buttons by ARIA role
- [ ] Throws an error if multiple elements match

### How do you hover over an element in Playwright?
- [ ] `page.mouseover(selector)`
- [ ] `locator.trigger('mouseover')`
- [x] `await locator.hover()`
- [ ] `page.dispatch('hover', selector)`

### When should you use `page.waitForSelector()` vs `expect(locator).toBeVisible()`?
- [ ] They are identical — use either
- [x] `toBeVisible()` is preferred for assertions; `waitForSelector` for non-assertion waiting
- [ ] `waitForSelector` is deprecated — always use toBeVisible
- [ ] `toBeVisible()` only works in headed mode

### What does `expect.configure({ timeout: 10000 })` do?
- [ ] Sets the global test timeout to 10 seconds
- [x] Sets a custom assertion timeout for all assertions that follow in that scope
- [ ] Retries the entire test for 10 seconds
- [ ] Makes all actions wait 10 seconds before executing

---

## 🏋️ More Coding Exercises

### [Exercise] Use getByLabel and getByPlaceholder
- **Difficulty:** Basic
- **Description:** Practice using the user-centric locators `getByLabel()` and `getByPlaceholder()` to find form inputs. These are more readable and accessible than CSS selectors.

```typescript
import { test, expect } from '@playwright/test';

test('find form inputs using getByLabel and getByPlaceholder', async ({ page }) => {
  await page.goto('https://practice.expandtesting.com/login');

  // 1. Find the username field using getByLabel('Username')
  //    and fill it with 'practice'
  // YOUR CODE HERE

  // 2. Find the password field using getByPlaceholder('Password')
  //    and fill it with 'SuperSecretPassword!'
  // YOUR CODE HERE

  // 3. Click the submit button
  await page.click('button[type="submit"]');

  // 4. Assert the URL contains '/secure'
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

test('find form inputs using getByLabel and getByPlaceholder', async ({ page }) => {
  await page.goto('https://practice.expandtesting.com/login');

  await page.getByLabel('Username').fill('practice');
  await page.getByPlaceholder('Password').fill('SuperSecretPassword!');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/\/secure/);
});
```

---

### [Exercise] Use nth(), first(), and last()
- **Difficulty:** Basic
- **Description:** Practice using `nth()`, `first()`, and `last()` to target specific elements in a list without brittle CSS nth-child selectors.

```typescript
import { test, expect } from '@playwright/test';

test('access specific list items with nth, first, last', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/checkboxes');

  const checkboxes = page.locator('input[type="checkbox"]');

  // 1. Assert the first checkbox is NOT checked using first()
  // YOUR CODE HERE

  // 2. Assert the last checkbox IS checked using last()
  // YOUR CODE HERE

  // 3. Click the nth(0) checkbox (first one) to check it
  // YOUR CODE HERE

  // 4. Assert the first checkbox is now checked
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

test('access specific list items with nth, first, last', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/checkboxes');

  const checkboxes = page.locator('input[type="checkbox"]');

  await expect(checkboxes.first()).not.toBeChecked();
  await expect(checkboxes.last()).toBeChecked();
  await checkboxes.nth(0).check();
  await expect(checkboxes.first()).toBeChecked();
});
```

---

### [Exercise] Hover to Reveal a Tooltip
- **Difficulty:** Intermediate
- **Description:** Hover over an element to trigger a tooltip or dropdown, then assert the revealed content is visible. This tests UI behaviour that only appears on mouse interaction.

```typescript
import { test, expect } from '@playwright/test';

test('hover reveals tooltip or submenu', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/hovers');

  // 1. Hover over the first figure/profile image
  //    Locator: page.locator('.figure').first()
  // YOUR CODE HERE

  // 2. Assert that a caption or 'View profile' link becomes visible
  //    Locator: page.locator('.figcaption').first()
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

test('hover reveals tooltip or submenu', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/hovers');

  await page.locator('.figure').first().hover();
  await expect(page.locator('.figcaption').first()).toBeVisible();
});
```

---

### [Exercise] afterEach for Cleanup Logging
- **Difficulty:** Intermediate
- **Description:** Add an `afterEach` hook that logs the test name and result after every test in a describe block. Use `testInfo` from the hook to access test metadata.

```typescript
import { test, expect } from '@playwright/test';

test.describe('Login Suite with afterEach logging', () => {
  // 1. Add an afterEach hook that:
  //    - Receives testInfo from the hook parameter
  //    - Logs: `Test "${testInfo.title}" finished with status: ${testInfo.status}`
  // YOUR CODE HERE

  test('successful login @smoke', async ({ page }) => {
    await page.goto('https://practice.expandtesting.com/login');
    await page.fill('#username', 'practice');
    await page.fill('#password', 'SuperSecretPassword!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/secure/);
  });

  test('failed login shows error', async ({ page }) => {
    await page.goto('https://practice.expandtesting.com/login');
    await page.fill('#username', 'bad');
    await page.fill('#password', 'wrong');
    await page.click('button[type="submit"]');
    await expect(page.locator('#flash')).toBeVisible();
  });
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

test.describe('Login Suite with afterEach logging', () => {
  test.afterEach(async ({}, testInfo) => {
    console.log(`Test "${testInfo.title}" finished with status: ${testInfo.status}`);
  });

  test('successful login @smoke', async ({ page }) => {
    await page.goto('https://practice.expandtesting.com/login');
    await page.fill('#username', 'practice');
    await page.fill('#password', 'SuperSecretPassword!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/secure/);
  });

  test('failed login shows error', async ({ page }) => {
    await page.goto('https://practice.expandtesting.com/login');
    await page.fill('#username', 'bad');
    await page.fill('#password', 'wrong');
    await page.click('button[type="submit"]');
    await expect(page.locator('#flash')).toBeVisible();
  });
});
```

---

### [Exercise] getByText with Exact Matching
- **Difficulty:** Intermediate
- **Description:** Use `getByText()` with both partial and exact matching to find elements. Understand the difference between the two modes and when each is appropriate.

```typescript
import { test, expect } from '@playwright/test';

test('getByText partial vs exact matching', async ({ page }) => {
  await page.goto('https://playwright.dev');

  // 1. Find and assert a link that CONTAINS the text 'started' (partial match)
  //    Use: page.getByText(/started/i) - regex is always partial
  // YOUR CODE HERE

  // 2. Find the heading that EXACTLY matches 'Playwright enables reliable...'
  //    Use: page.getByText('Playwright enables reliable', { exact: false })
  //    (partial match on a longer string)
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

test('getByText partial vs exact matching', async ({ page }) => {
  await page.goto('https://playwright.dev');

  await expect(page.getByText(/started/i).first()).toBeVisible();
  await expect(page.getByText('Playwright enables reliable', { exact: false }).first()).toBeVisible();
});
```

---

### [Exercise] Multi-Describe Nested Blocks
- **Difficulty:** Advanced
- **Description:** Nest `test.describe` blocks to create a hierarchical test structure. Use separate `beforeEach` hooks at each level — the outer one runs first, then the inner one. This mirrors how real test suites are organised.

```typescript
import { test, expect } from '@playwright/test';

// 1. Create an outer describe: 'Playwright.dev Site'
//    - beforeEach: navigate to 'https://playwright.dev'
// 2. Inside, create a nested describe: 'Homepage'
//    - One test: assert title contains 'Playwright'
//    - One test: assert 'Get started' link is visible
// 3. Inside, create another nested describe: 'Docs'
//    - beforeEach: click 'Docs' link
//    - One test: assert URL contains '/docs'
// YOUR CODE HERE
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

test.describe('Playwright.dev Site', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://playwright.dev');
  });

  test.describe('Homepage', () => {
    test('has correct title', async ({ page }) => {
      await expect(page).toHaveTitle(/Playwright/);
    });

    test('has get started link', async ({ page }) => {
      await expect(page.getByRole('link', { name: 'Get started' })).toBeVisible();
    });
  });

  test.describe('Docs navigation', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByRole('link', { name: 'Docs' }).first().click();
    });

    test('navigates to docs URL', async ({ page }) => {
      await expect(page).toHaveURL(/\/docs/);
    });
  });
});
```

---

## 🧠 Flashcards — Batch 3

**Concept:** locator.tap()
On touch/mobile devices, `locator.tap()` simulates a finger tap instead of a mouse click. Use it when testing apps with touch-specific event listeners. Pair with `viewport` set to mobile dimensions for realistic device simulation.

**Concept:** page.type() vs page.fill()
`page.fill()` clears the field first and sets the value in one operation — fast and reliable. `page.type()` simulates key-by-key typing with delays, triggering `keydown/keyup/keypress` events. Use `type()` only when the app has live keystroke event handlers (autocomplete, live search).

**Concept:** expect(locator).toHaveCSS()
Asserts that an element has a specific CSS property value: `await expect(locator).toHaveCSS('color', 'rgb(255, 0, 0)')`. Note: CSS values are usually resolved (e.g., `red` becomes `rgb(255, 0, 0)`). Useful for testing dark mode, theming, or state-based styling.

**Concept:** Accessibility Testing
Playwright integrates with the `axe-core` library via `@axe-core/playwright` for automated WCAG accessibility audits. `const results = await new AxeBuilder({ page }).analyze()` returns violations. Always assert `results.violations` is an empty array.

**Concept:** Visual Snapshot Comparison
`await expect(page).toHaveScreenshot('login.png')` creates or compares a screenshot pixel-by-pixel. On first run it creates the baseline. On subsequent runs it diffs against the baseline. Run with `--update-snapshots` to regenerate baselines after intentional UI changes.

**Term:** page.addInitScript()
Runs a script in every new page before any other script executes. Used to mock global objects (`window.fetch`, `window.localStorage`), inject polyfills, or set feature flags before the app initialises. It is permanent for the lifetime of the page.

**Term:** locator.focus()
Explicitly focuses an element without clicking. Useful for testing keyboard navigation — after calling `.focus()`, use `page.keyboard.press('Tab')` to move focus to the next element and assert it landed in the right place.

**Term:** expect(locator).toBeFocused()
Asserts that an element is currently focused (is the `document.activeElement`). Essential for testing keyboard navigation flows and accessibility — ensures Tab order and focus management work correctly.

**Concept:** Page Object Composition
Instead of one giant Page Object class, split into smaller, focused classes: `NavBar`, `SearchBar`, `ProductCard`. Then compose them inside a `StorePage` that contains instances of each. This keeps classes small, testable, and reusable.

**Concept:** Locator Strict Mode
By default, Playwright throws if a locator matches more than one element during an *action* (click, fill). This is Strict Mode — it prevents you from accidentally acting on the wrong element. Use `.first()`, `.nth()`, or a more specific selector to resolve ambiguity.

---

## 📝 Quizzes — Batch 3

### What does `page.fill()` do that `page.type()` does not?
- [ ] It works only on password fields
- [x] It clears the field before setting the value in one atomic operation
- [ ] It dispatches keydown/keypress events for each character
- [ ] It finds the input by label automatically

### What does `toHaveCSS('color', 'rgb(255,0,0)')` check?
- [ ] The element's class contains 'color'
- [x] The computed CSS color property equals the specified RGB value
- [ ] The element's inline style attribute contains 'color: red'
- [ ] The CSS variable `--color` is set to red

### What is `page.addInitScript()` used for?
- [ ] Adding a `<script>` tag to the HTML after page load
- [ ] Loading test fixtures before each test
- [x] Running a script before any app script executes, to mock globals or set flags
- [ ] Registering a global error handler for the test

### What does `expect(locator).toBeFocused()` assert?
- [ ] The element is visible and enabled
- [ ] The element has a CSS outline
- [x] The element is the current `document.activeElement`
- [ ] The element has a `tabindex` attribute

### When does Playwright's Strict Mode throw an error?
- [ ] When an assertion fails
- [ ] When the page has more than 100 elements
- [x] When an action locator matches more than one element
- [ ] When two tests run simultaneously

### What is Page Object Composition?
- [ ] Inheriting all page objects from one base class
- [x] Building a Page Object from smaller, focused component objects rather than one giant class
- [ ] Using JavaScript object composition instead of classes
- [ ] Composing locators with CSS combinators

### Which method explicitly focuses an element without clicking?
- [ ] `locator.activate()`
- [ ] `locator.select()`
- [x] `locator.focus()`
- [ ] `locator.highlight()`

### What library integrates with Playwright for WCAG accessibility audits?
- [ ] `lighthouse-playwright`
- [ ] `pa11y`
- [x] `@axe-core/playwright`
- [ ] `@playwright/accessibility`

### What does `page.type('#input', 'hello')` do differently from `page.fill('#input', 'hello')`?
- [ ] They are identical
- [x] `type()` simulates real keystrokes (keydown/keypress/keyup) character by character
- [ ] `type()` is faster than `fill()`
- [ ] `fill()` works only on text inputs; `type()` works on all elements

### What does `locator.tap()` do?
- [ ] Clicks the element twice
- [x] Simulates a finger touch tap, useful for mobile/touch event testing
- [ ] Pauses execution until the element is tappable
- [ ] Scrolls the element into view

---

## 🏋️ Coding Exercises — Batch 3

### [Exercise] Assert CSS Property (Dark Mode Check)
- **Difficulty:** Basic
- **Description:** Use `toHaveCSS()` to verify that a page element has the expected background colour. This technique is used to test theme changes like dark mode toggle.

```typescript
import { test, expect } from '@playwright/test';

test('body background color check', async ({ page }) => {
  await page.goto('https://playwright.dev');

  // 1. Get the body element
  const body = page.locator('body');

  // 2. Assert body has a CSS 'display' of 'block' using toHaveCSS()
  // YOUR CODE HERE

  // 3. Assert the body has some background-color defined
  //    Use: await body.evaluate(el => getComputedStyle(el).backgroundColor)
  //    Then: expect(bgColor).toBeTruthy()
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

test('body background color check', async ({ page }) => {
  await page.goto('https://playwright.dev');

  const body = page.locator('body');
  await expect(body).toHaveCSS('display', 'block');

  const bgColor = await body.evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(bgColor).toBeTruthy();
});
```

---

### [Exercise] Keyboard Focus and Tab Navigation
- **Difficulty:** Intermediate
- **Description:** Test keyboard-driven navigation by explicitly focusing an element, then pressing Tab to move through interactive elements. Assert that focus lands on the expected element.

```typescript
import { test, expect } from '@playwright/test';

test('tab key moves focus between form fields', async ({ page }) => {
  await page.goto('https://practice.expandtesting.com/login');

  // 1. Focus the username input using locator.focus()
  // YOUR CODE HERE

  // 2. Assert the username input is focused using toBeFocused()
  // YOUR CODE HERE

  // 3. Press Tab to move focus to the next field
  // YOUR CODE HERE

  // 4. Assert the password input is now focused
  //    Locator: page.locator('#password')
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

test('tab key moves focus between form fields', async ({ page }) => {
  await page.goto('https://practice.expandtesting.com/login');

  await page.locator('#username').focus();
  await expect(page.locator('#username')).toBeFocused();

  await page.keyboard.press('Tab');
  await expect(page.locator('#password')).toBeFocused();
});
```

---

### [Exercise] Use addInitScript to Mock a Global
- **Difficulty:** Intermediate
- **Description:** Use `page.addInitScript()` to inject a mock for `window.localStorage` or a feature flag before the page loads. This lets you test different app states without modifying the app code.

```typescript
import { test, expect } from '@playwright/test';

test('addInitScript sets a flag before page loads', async ({ page }) => {
  // 1. Use page.addInitScript() to set window.__TEST_FLAG__ = true
  //    before any page script runs
  // YOUR CODE HERE

  await page.goto('https://playwright.dev');

  // 2. Use page.evaluate() to read window.__TEST_FLAG__
  //    const flag = await page.evaluate(() => window.__TEST_FLAG__)
  // YOUR CODE HERE

  // 3. Assert the flag is true
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

test('addInitScript sets a flag before page loads', async ({ page }) => {
  await page.addInitScript(() => {
    (window as Window & { __TEST_FLAG__: boolean }).__TEST_FLAG__ = true;
  });

  await page.goto('https://playwright.dev');

  const flag = await page.evaluate(() => (window as Window & { __TEST_FLAG__: boolean }).__TEST_FLAG__);
  expect(flag).toBe(true);
});
```

---

### [Exercise] Simulate Key Press Shortcuts
- **Difficulty:** Intermediate
- **Description:** Use `page.keyboard.press()` to simulate keyboard shortcuts. Test that pressing `Ctrl+A` selects all text in an input and `Ctrl+C` / `Ctrl+V` simulate clipboard operations.

```typescript
import { test, expect } from '@playwright/test';

test('keyboard shortcuts in input field', async ({ page }) => {
  await page.goto('https://practice.expandtesting.com/login');

  // 1. Fill the username field with 'practice'
  // YOUR CODE HERE

  // 2. Click the username field to focus it
  // YOUR CODE HERE

  // 3. Press Ctrl+A to select all text
  // YOUR CODE HERE

  // 4. Type 'replaced' to overwrite the selection
  // YOUR CODE HERE

  // 5. Assert the field now contains 'replaced'
  //    Use: toHaveValue('replaced')
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

test('keyboard shortcuts in input field', async ({ page }) => {
  await page.goto('https://practice.expandtesting.com/login');

  await page.fill('#username', 'practice');
  await page.locator('#username').click();
  await page.keyboard.press('Control+A');
  await page.keyboard.type('replaced');

  await expect(page.locator('#username')).toHaveValue('replaced');
});
```

---

### [Exercise] Full Page Object Composition Pattern
- **Difficulty:** Advanced
- **Description:** Build a composed page object where a `LoginPage` contains a `FormComponent` and an `AlertComponent` as sub-objects. This models real-world POM architecture used in the framework.

```typescript
import { test, expect, Page, Locator } from '@playwright/test';

// 1. Create a FormComponent class that encapsulates:
//    - usernameInput: Locator
//    - passwordInput: Locator
//    - submitButton: Locator
//    - fill(username, password): async method
//    - submit(): async method
// YOUR CODE HERE

// 2. Create an AlertComponent class that encapsulates:
//    - alertMessage: Locator
//    - isVisible(): returns Promise<boolean> using isVisible()
//    - getText(): returns Promise<string | null> using textContent()
// YOUR CODE HERE

// 3. Create a LoginPage class that COMPOSES FormComponent and AlertComponent:
//    - constructor(page) sets this.form = new FormComponent(page) and this.alert = new AlertComponent(page)
// YOUR CODE HERE

test('composed POM login test', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await page.goto('https://practice.expandtesting.com/login');

  // 4. Use loginPage.form.fill() and loginPage.form.submit()
  // YOUR CODE HERE

  // 5. Assert loginPage.alert.isVisible() is true
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect, Page, Locator } from '@playwright/test';

class FormComponent {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.submitButton  = page.locator('button[type="submit"]');
  }

  async fill(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }
}

class AlertComponent {
  readonly alertMessage: Locator;

  constructor(page: Page) {
    this.alertMessage = page.locator('#flash');
  }

  isVisible(): Promise<boolean> {
    return this.alertMessage.isVisible();
  }

  getText(): Promise<string | null> {
    return this.alertMessage.textContent();
  }
}

class LoginPage {
  readonly form: FormComponent;
  readonly alert: AlertComponent;

  constructor(page: Page) {
    this.form  = new FormComponent(page);
    this.alert = new AlertComponent(page);
  }
}

test('composed POM login test', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await page.goto('https://practice.expandtesting.com/login');

  await loginPage.form.fill('practice', 'SuperSecretPassword!');
  await loginPage.form.submit();

  expect(await loginPage.alert.isVisible()).toBe(true);
});
```

---

## 🧠 Flashcards — Batch 4

**Concept:** page.locator().count()
wait page.locator('li').count() returns the number of matching elements as a number. Unlike 	oHaveCount() (assertion), .count() returns the raw value for use in conditional logic. Example: if (await rows.count() > 0) { ... }.

**Concept:** locator.isEnabled() / locator.isDisabled()
wait locator.isEnabled() returns 	rue if the element is enabled (not greyed-out or disabled). Use in conditional logic. For assertions, prefer expect(locator).toBeEnabled() which auto-retries.

**Concept:** locator.isChecked()
wait locator.isChecked() returns 	rue if a checkbox or radio is checked. Returns a boolean for conditional logic. For asserting in tests, use expect(locator).toBeChecked() which auto-retries.

**Concept:** locator.isVisible()
wait locator.isVisible() returns 	rue if the element is visible right now (no retrying). Used for conditional branching: if (await modal.isVisible()) await modal.close(). For assertions, use expect(locator).toBeVisible().

**Concept:** page.title()
wait page.title() returns the current page title as a string. Used in conditional logic or logging. For asserting, prefer wait expect(page).toHaveTitle(...) which auto-retries.

**Term:** locator.textContent()
wait locator.textContent() returns the text content of the element as a string (or null). Includes hidden text. No auto-retrying. For assertions use 	oHaveText(). Useful for extracting values to use in further logic.

**Term:** locator.innerText()
wait locator.innerText() returns only the visible text content, respecting CSS visibility. Differs from 	extContent() which includes hidden text. Also no auto-retrying.

**Term:** locator.innerHTML()
wait locator.innerHTML() returns the inner HTML of the element as a string. Use to inspect the rendered HTML structure of a container when debugging complex layout issues.

**Concept:** page.content()
wait page.content() returns the full HTML content of the current page as a string. Useful for offline parsing, debugging unexpected DOM states, or writing assertions against the raw HTML structure.

**Concept:** Playwright Codegen

px playwright codegen https://example.com opens a browser and records your interactions, auto-generating Playwright TypeScript code in real time. The generated code is a great starting point — clean it up by replacing fragile CSS selectors with getByRole() or getByLabel().

---

## ðŸ§  Flashcards â€” Batch 4

**Concept:** locator.count()
`await page.locator('li').count()` returns the number of matching elements as a plain number. Unlike `toHaveCount()` (assertion with retry), `.count()` is immediate â€” use it for conditional logic: `if (await rows.count() > 0) { ... }`.

**Concept:** locator.isVisible() vs expect().toBeVisible()
`await locator.isVisible()` checks visibility immediately, returning a boolean â€” no retrying. Use for conditional logic: `if (await modal.isVisible()) await modal.close()`. For test assertions, always prefer `expect(locator).toBeVisible()` which auto-retries.

**Concept:** locator.isEnabled() / isDisabled()
`await locator.isEnabled()` returns `true` if an element is not disabled. No auto-retrying. Use for conditional logic before clicking. For assertions, use `expect(locator).toBeEnabled()` which retries until the element becomes enabled.

**Concept:** locator.isChecked()
`await locator.isChecked()` returns `true` if a checkbox or radio button is currently checked. No retrying â€” point-in-time snapshot. For assertions, use `expect(locator).toBeChecked()`.

**Concept:** page.title()
`await page.title()` returns the current `<title>` tag content as a string. Immediate, no retry. Use when you need the title value for logic or logging. For assertions, use `expect(page).toHaveTitle()`.

**Term:** locator.textContent()
Returns the raw text content of an element including hidden text. Returns `string | null`. Used for extracting values to use in logic. For assertions use `expect(locator).toHaveText()` which auto-retries.

**Term:** locator.innerText()
Returns only the *visible* text (respects CSS `display:none` and `visibility:hidden`). Different from `textContent()` which includes hidden text. Neither retries â€” use `toHaveText()` for auto-retrying assertions.

**Term:** locator.innerHTML()
Returns the inner HTML string of an element's children. Useful for debugging rendered structure or checking that a container holds specific child elements when locator-based approaches are insufficient.

**Concept:** page.content()
`await page.content()` returns the full rendered HTML of the current page. Useful for offline parsing, snapshot testing against raw HTML, or debugging unexpected DOM mutations during complex SPAs.

**Concept:** Playwright Codegen
`npx playwright codegen https://url.com` opens an interactive browser that records clicks and keystrokes, generating TypeScript test code in real time. Always refactor the output: replace fragile CSS selectors with `getByRole()`, `getByLabel()`, and `getByTestId()`.

---

## ðŸ“ Quizzes â€” Batch 4

### What does `await locator.count()` return?
- [ ] A Locator for all matching elements
- [x] The number of matching elements as a plain integer
- [ ] A boolean: true if at least one element matches
- [ ] A promise resolving to an array of element handles

### What is the key difference between `locator.isVisible()` and `expect(locator).toBeVisible()`?
- [x] `isVisible()` checks immediately without retry; `toBeVisible()` auto-retries until timeout
- [ ] They are identical
- [ ] `isVisible()` only works in headed mode
- [ ] `toBeVisible()` is deprecated in Playwright v1.40+

### What does `locator.textContent()` include that `locator.innerText()` does NOT?
- [x] Text that is hidden via CSS (display:none, visibility:hidden)
- [ ] HTML tags inside the element
- [ ] Text from child iframes
- [ ] Placeholder text from input elements

### What is `npx playwright codegen` used for?
- [ ] Generating JUnit XML test reports
- [ ] Compiling TypeScript test files
- [x] Recording browser interactions and auto-generating Playwright TypeScript test code
- [ ] Validating test selectors against the live page

### When should you use `locator.isEnabled()` instead of `expect(locator).toBeEnabled()`?
- [ ] Always â€” they are equivalent
- [x] When you need a boolean for conditional logic, not as a test assertion
- [ ] When the element might be inside a shadow DOM
- [ ] Only for form submit buttons

### What does `await page.content()` return?
- [ ] Only the visible text of the page
- [x] The full HTML source of the current page as a string
- [ ] The page title and meta tags
- [ ] The HTTP response body from the initial page load

### What does `locator.innerHTML()` return?
- [ ] The element's own opening and closing tags plus children
- [x] The inner HTML of the element's children as a string
- [ ] Only the visible text content
- [ ] A count of child elements

### What is the best first step after using Playwright Codegen?
- [ ] Run the generated code immediately in CI
- [ ] Delete all comments
- [x] Refactor fragile CSS selectors to semantic locators like `getByRole()` and `getByLabel()`
- [ ] Convert TypeScript to JavaScript

---

## ðŸ‹ï¸ Coding Exercises â€” Batch 4

### [Exercise] Count Elements and Log
- **Difficulty:** Basic
- **Description:** Use `locator.count()` to count links on a page, assert a minimum, and log the result. This shows how to use the raw count value in logic vs. assertions.

```typescript
import { test, expect } from '@playwright/test';

test('count links and assert minimum', async ({ page }) => {
  await page.goto('https://playwright.dev');

  // 1. Count all <a> elements on the page
  // YOUR CODE HERE

  // 2. Assert count is greater than 5
  // YOUR CODE HERE

  // 3. Log: `Found N links on the page`
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

test('count links and assert minimum', async ({ page }) => {
  await page.goto('https://playwright.dev');

  const count = await page.locator('a').count();
  expect(count).toBeGreaterThan(5);
  console.log(`Found ${count} links on the page`);
});
```

---

### [Exercise] Conditional Modal Dismissal with isVisible()
- **Difficulty:** Intermediate
- **Description:** Use `isVisible()` to handle optional overlays without failing the test when they are absent. A real-world pattern for cookie banners, tour dialogs, and notification prompts.

```typescript
import { test, expect } from '@playwright/test';

test('handle optional overlay before interacting', async ({ page }) => {
  await page.goto('https://playwright.dev');

  // 1. Check if an 'Accept' button is visible using isVisible()
  //    const acceptBtn = page.getByRole('button', { name: /accept/i })
  // YOUR CODE HERE

  // 2. If visible, click it; otherwise skip
  // YOUR CODE HERE

  // 3. Assert the main heading is always visible
  await expect(page.locator('h1').first()).toBeVisible();
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

test('handle optional overlay before interacting', async ({ page }) => {
  await page.goto('https://playwright.dev');

  const acceptBtn = page.getByRole('button', { name: /accept/i });
  if (await acceptBtn.isVisible()) {
    await acceptBtn.click();
  }

  await expect(page.locator('h1').first()).toBeVisible();
});
```

---

### [Exercise] Extract Text and Transform for Dynamic Assertion
- **Difficulty:** Intermediate
- **Description:** Extract text from an element using `textContent()`, transform it (lowercase, trim), and use the result in a dynamic assertion. Shows using extracted values in logic.

```typescript
import { test, expect } from '@playwright/test';

test('extract and use heading text dynamically', async ({ page }) => {
  await page.goto('https://playwright.dev');

  // 1. Extract the first h1 text using textContent()
  // YOUR CODE HERE

  // 2. Assert it is not null
  // YOUR CODE HERE

  // 3. Assert the trimmed, lowercased text contains 'playwright'
  // YOUR CODE HERE

  // 4. Log the extracted text
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

test('extract and use heading text dynamically', async ({ page }) => {
  await page.goto('https://playwright.dev');

  const text = await page.locator('h1').first().textContent();
  expect(text).not.toBeNull();
  expect(text!.trim().toLowerCase()).toContain('playwright');
  console.log(`Page heading: "${text}"`);
});
```

---

### [Exercise] isChecked() Conditional Logic
- **Difficulty:** Intermediate
- **Description:** Use `isChecked()` to read the current state of a checkbox, then perform different actions depending on whether it is checked or not.

```typescript
import { test, expect } from '@playwright/test';

test('conditionally toggle checkbox based on current state', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/checkboxes');

  const firstCheckbox = page.locator('input[type="checkbox"]').first();

  // 1. Read current checked state using isChecked()
  // YOUR CODE HERE

  // 2. If it is NOT checked, check it; if it IS checked, uncheck it
  // YOUR CODE HERE

  // 3. Read the new state and assert it changed
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

test('conditionally toggle checkbox based on current state', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/checkboxes');

  const firstCheckbox = page.locator('input[type="checkbox"]').first();
  const wasCheked = await firstCheckbox.isChecked();

  if (!wasCheked) {
    await firstCheckbox.check();
  } else {
    await firstCheckbox.uncheck();
  }

  const nowChecked = await firstCheckbox.isChecked();
  expect(nowChecked).toBe(!wasCheked);
});
```

---

### [Exercise] Page HTML Content Inspection
- **Difficulty:** Advanced
- **Description:** Use `page.content()` to get the full HTML and assert structural patterns using string methods. Useful for snapshot-style checks without a visual comparison library.

```typescript
import { test, expect } from '@playwright/test';

test('page HTML contains expected structural elements', async ({ page }) => {
  await page.goto('https://playwright.dev');

  // 1. Get the full page HTML using page.content()
  // YOUR CODE HERE

  // 2. Assert the HTML string includes a <nav> element
  // YOUR CODE HERE

  // 3. Assert the HTML includes 'Playwright' (case-sensitive)
  // YOUR CODE HERE

  // 4. Assert the HTML includes a canonical <link> tag
  //    Check for: 'rel="canonical"'
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

test('page HTML contains expected structural elements', async ({ page }) => {
  await page.goto('https://playwright.dev');

  const html = await page.content();
  expect(html).toContain('<nav');
  expect(html).toContain('Playwright');
  expect(html).toContain('rel="canonical"');
});
```
