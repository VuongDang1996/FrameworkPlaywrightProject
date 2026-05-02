# 13 — Advanced Patterns & Deep Dives

Deep-dive exercises covering advanced Playwright patterns: parallel testing, network interception, storage states, component testing patterns, and CI/CD integration.

---

## 🧠 Flashcards

**Concept:** Storage State (Authentication Reuse)
`storageState` saves browser cookies and localStorage to a JSON file after a login. Subsequent tests can load that file using `use: { storageState: 'auth.json' }`, skipping the login step entirely. This dramatically speeds up authenticated test suites.

**Concept:** page.waitForResponse()
`await page.waitForResponse(url)` pauses test execution until a specific network response is received. This is safer than `waitForTimeout()` because it reacts to actual application events rather than arbitrary delays.

**Concept:** Playwright Workers
Workers are parallel execution slots. Each worker runs an independent browser instance. Setting `workers: 4` in `playwright.config.ts` runs up to 4 test files in parallel. `fullyParallel: true` also parallelises tests within the same file.

**Concept:** Global Setup and Teardown
`globalSetup` is a file that runs once before all tests (e.g., seed a database or login once). `globalTeardown` runs once after all tests (e.g., clean up database). Configured in `playwright.config.ts` under `globalSetup` and `globalTeardown` keys.

**Concept:** page.evaluate()
`page.evaluate()` runs a JavaScript function directly in the browser context (not Node.js). Use it to manipulate the DOM, read `window` properties, or inject data. Example: `const title = await page.evaluate(() => document.title)`.

**Concept:** expect(locator).toHaveCount()
Asserts that a locator matches exactly N elements. Useful for checking lists — e.g., assert that a search result page shows exactly 5 items. It auto-retries until the count matches or timeout is reached.

**Concept:** Retries in playwright.config.ts
`retries: 2` in `playwright.config.ts` tells Playwright to automatically re-run a failed test up to 2 times before marking it as failed. This helps filter out flaky tests due to network delays in CI. Only affects non-local runs by default with `process.env.CI ? 2 : 0`.

**Concept:** Video Recording
Setting `use: { video: 'on-first-retry' }` in `playwright.config.ts` records a video of test execution only when a test is retried (i.e., it failed once). This is ideal for CI — you get video evidence without storing videos for every passing test.

**Concept:** Trace Viewer
Playwright's Trace Viewer is a powerful debugging tool. Enable it with `use: { trace: 'on-first-retry' }`. After a test run, open the trace with `npx playwright show-trace trace.zip`. It shows a timeline of actions, screenshots, network logs, and console output.

**Concept:** page.route() (Request Interception)
`page.route(pattern, handler)` intercepts network requests matching a URL pattern before they reach the server. You can `abort()`, `fulfill()` with mock data, or `continue()` with modified headers. Essential for testing offline scenarios and API error states.

**Term:** test.skip()
Marks a test as skipped — it will not run and will be marked as "skipped" in the report. Can be conditional: `test.skip(process.env.CI === 'true', 'Skipped in CI')`. Useful for environment-specific exclusions.

**Term:** test.fixme()
Marks a test as broken/todo. The test is expected to fail. Similar to `skip` but semantically signals the test needs fixing. Example: `test.fixme('broken feature', async () => { ... })`.

**Term:** test.slow()
Triples the timeout for a specific test. Use when a test legitimately takes longer than the default — e.g., file upload, email verification flow, or a slow third-party API response. `test.slow()` is safer than manually setting a huge timeout globally.

**Term:** Locator.all()
`await locator.all()` returns an array of all matching locator objects. Useful when you need to iterate over a list of elements and interact with each one. Example: `const rows = await page.locator('tr').all()`.

**Term:** expect(locator).toHaveAttribute()
Asserts that an element has a specific HTML attribute with a specific value. Example: `await expect(page.locator('a')).toHaveAttribute('href', '/home')`. Auto-retries like all Playwright assertions.

**Term:** page.keyboard.press()
Simulates pressing a keyboard key. Example: `await page.keyboard.press('Enter')` or `await page.keyboard.press('Tab')`. Useful for testing keyboard navigation and form submission without clicking.

**Concept:** Playwright CLI Flags
Key CLI flags: `--headed` (show browser), `--grep "pattern"` (filter by tag), `--project chromium` (single browser), `--reporter html` (HTML report), `--workers 1` (serial execution), `--timeout 60000` (override default timeout).

**Concept:** expect(page).toHaveURL()
Asserts the current page URL matches a string or regex pattern. Playwright auto-retries this assertion, making it safe to place immediately after a navigation action without needing explicit `waitForURL()`.

**Concept:** Accessibility Testing with getByRole
Using `getByRole()` locators serves dual purpose: they make tests more robust to DOM changes AND enforce accessibility best practices. If `getByRole('button', { name: 'Submit' })` can't find the button, it means the button lacks proper ARIA labelling.

**Concept:** Environment Variables in Tests
Use `process.env.VARIABLE_NAME` in TypeScript tests to access environment variables (from `.env` or CI secrets). Always define a fallback: `process.env.BASE_URL ?? 'http://localhost:3000'`. Never hardcode credentials — use env vars.

---

## 📝 Quizzes

### What does `storageState` do in Playwright config?
- [ ] It stores test results to a file
- [x] It saves browser cookies and localStorage so tests can reuse an authenticated session
- [ ] It configures the browser's local storage quota
- [ ] It stores screenshots between test runs

### When should you use `page.waitForResponse()` instead of `page.waitForTimeout()`?
- [ ] When you want to wait a fixed number of milliseconds
- [ ] When testing mobile viewports
- [x] When you want to wait until a specific network response is received
- [ ] When you want to wait for a locator to appear

### What does `fullyParallel: true` do in playwright.config.ts?
- [ ] Runs all assertions in parallel inside a test
- [ ] Opens multiple browser tabs per test
- [x] Parallelises tests within the same file, not just across files
- [ ] Doubles the number of retries for each test

### Which method runs JavaScript directly in the browser context?
- [ ] `page.run()`
- [ ] `page.execute()`
- [x] `page.evaluate()`
- [ ] `browser.inject()`

### What does `test.slow()` do?
- [ ] Runs the test with 1 worker
- [ ] Adds a `waitForTimeout(3000)` before every step
- [x] Triples the default timeout for that specific test
- [ ] Marks the test as skipped

### How do you assert a list shows exactly 5 items?
- [ ] `await expect(page.locator('li').count()).toBe(5)`
- [ ] `await expect(page.locator('li')).toHaveLength(5)`
- [x] `await expect(page.locator('li')).toHaveCount(5)`
- [ ] `await expect(page.locator('li').all()).toHaveCount(5)`

### What does `use: { video: 'on-first-retry' }` do?
- [ ] Records video for every single test run
- [x] Records video only when a test fails and is being retried
- [ ] Takes screenshots on failure
- [ ] Saves network logs to a video file

### How do you skip a test only when running in CI?
- [ ] `test.only('name', ...)`
- [ ] `if (process.env.CI) return;`
- [x] `test.skip(!!process.env.CI, 'Skipped in CI')`
- [ ] `test.fixme('name', ...)`

### What does `page.route()` allow you to do?
- [ ] Navigate to a specific route in a SPA
- [ ] Define page object routes
- [x] Intercept network requests and mock, abort, or modify them
- [ ] Log all page navigations to console

### Which assertion checks an element's HTML attribute value?
- [ ] `expect(locator).toHaveProperty('href', '/home')`
- [x] `expect(locator).toHaveAttribute('href', '/home')`
- [ ] `expect(locator).toContainAttribute('href', '/home')`
- [ ] `expect(locator).toHaveValue('href')`

### How do you run only Chromium tests from CLI?
- [ ] `npx playwright test --browser chromium`
- [x] `npx playwright test --project chromium`
- [ ] `npx playwright test --engine chromium`
- [ ] `npx playwright test --only chromium`

### What is Playwright Trace Viewer used for?
- [ ] Generating test coverage reports
- [ ] Streaming live test execution
- [x] Debugging failures with a timeline of actions, screenshots, and network logs
- [ ] Running tests in a visual grid layout

---

## 🏋️ Coding Exercises

### [Exercise] Assert Element Count in a List
- **Difficulty:** Basic
- **Description:** Navigate to a page and assert that a list has an exact number of elements using `toHaveCount()`. This tests your ability to work with multiple matching elements.

```typescript
import { test, expect } from '@playwright/test';

test('navigation menu has correct number of links', async ({ page }) => {
  await page.goto('https://playwright.dev');

  // 1. Count all <a> elements inside the nav element
  //    Use: page.locator('nav a')
  // YOUR CODE HERE

  // 2. Assert the count is greater than 3 using toHaveCount() or a comparison
  //    Tip: Use .count() method and regular expect(count).toBeGreaterThan(3)
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

test('navigation menu has correct number of links', async ({ page }) => {
  await page.goto('https://playwright.dev');
  const navLinks = page.locator('nav a');
  const count = await navLinks.count();
  expect(count).toBeGreaterThan(3);
});
```

---

### [Exercise] Use keyboard.press() for Form Submission
- **Difficulty:** Basic
- **Description:** Fill in a search input field and press Enter using `page.keyboard.press()` instead of clicking a submit button. Many forms accept Enter key submission.

```typescript
import { test, expect } from '@playwright/test';

test('submit search form with Enter key', async ({ page }) => {
  await page.goto('https://playwright.dev');

  // 1. Find the search button/input (look for role='button' named 'Search')
  //    and click it to open the search dialog
  // YOUR CODE HERE

  // 2. Type 'locators' into the active search input using page.keyboard.type()
  // YOUR CODE HERE

  // 3. Press Enter to submit
  // YOUR CODE HERE

  // 4. Assert the URL contains 'locators' or a result is visible
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

test('submit search form with Enter key', async ({ page }) => {
  await page.goto('https://playwright.dev');
  await page.getByRole('button', { name: 'Search' }).click();
  await page.keyboard.type('locators');
  await page.keyboard.press('Enter');
  await expect(page.locator('.DocSearch-Hits')).toBeVisible();
});
```

---

### [Exercise] Check Element Attribute
- **Difficulty:** Basic
- **Description:** Find an anchor tag and assert that its `href` attribute points to the correct URL using `toHaveAttribute()`.

```typescript
import { test, expect } from '@playwright/test';

test('get started link points to correct URL', async ({ page }) => {
  await page.goto('https://playwright.dev');

  // 1. Find the 'Get started' link using getByRole
  // YOUR CODE HERE

  // 2. Assert it has an href attribute containing '/docs/intro'
  //    Use: toHaveAttribute('href', /\/docs\/intro/)
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

test('get started link points to correct URL', async ({ page }) => {
  await page.goto('https://playwright.dev');
  const link = page.getByRole('link', { name: 'Get started' });
  await expect(link).toHaveAttribute('href', /\/docs\/intro/);
});
```

---

### [Exercise] Iterate Over a List with locator.all()
- **Difficulty:** Intermediate
- **Description:** Use `locator.all()` to get all matching elements as an array, then loop over them to verify each one meets a condition. This pattern replaces brittle nth-child selectors.

```typescript
import { test, expect } from '@playwright/test';

test('all list items are visible', async ({ page }) => {
  await page.goto('https://playwright.dev/docs/test-assertions');

  // 1. Get all <h3> elements on the page using locator.all()
  // YOUR CODE HERE

  // 2. Assert that there are more than 5 h3 elements
  // YOUR CODE HERE

  // 3. Loop through the first 3 h3 elements and assert each is visible
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

test('all list items are visible', async ({ page }) => {
  await page.goto('https://playwright.dev/docs/test-assertions');
  const headings = await page.locator('h3').all();
  expect(headings.length).toBeGreaterThan(5);
  for (const heading of headings.slice(0, 3)) {
    await expect(heading).toBeVisible();
  }
});
```

---

### [Exercise] Mock an API Error Response
- **Difficulty:** Intermediate
- **Description:** Use `page.route()` to intercept an API call and return a 500 Internal Server Error. Then assert that the UI correctly handles and displays the error state.

```typescript
import { test, expect } from '@playwright/test';

test('app shows error state when API returns 500', async ({ page }) => {
  // 1. Use page.route() to intercept requests matching '**/api/**'
  // 2. Fulfill with status 500 and body '{"error": "Internal Server Error"}'
  // YOUR CODE HERE

  await page.goto('https://your-app.example.com');

  // 3. Assert an error message or fallback UI is shown
  //    e.g., expect(page.getByText('Something went wrong')).toBeVisible()
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

test('app shows error state when API returns 500', async ({ page }) => {
  await page.route('**/api/**', async (route) => {
    await route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Internal Server Error' }),
    });
  });

  await page.goto('https://your-app.example.com');
  await expect(page.getByText('Something went wrong')).toBeVisible();
});
```

---

### [Exercise] Wait for Network Response
- **Difficulty:** Intermediate
- **Description:** Trigger an action that causes a network request and use `page.waitForResponse()` to wait for it to complete before making assertions. This is more reliable than arbitrary timeouts.

```typescript
import { test, expect } from '@playwright/test';

test('wait for search API response before asserting results', async ({ page }) => {
  await page.goto('https://your-app.example.com/search');

  // 1. Start waiting for the response BEFORE triggering the action
  //    Use: const responsePromise = page.waitForResponse('**/api/search**')
  // YOUR CODE HERE

  // 2. Type into the search box to trigger the request
  // YOUR CODE HERE

  // 3. Await the response promise
  //    const response = await responsePromise
  // YOUR CODE HERE

  // 4. Assert the response status is 200
  //    expect(response.status()).toBe(200)
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

test('wait for search API response before asserting results', async ({ page }) => {
  await page.goto('https://your-app.example.com/search');

  const responsePromise = page.waitForResponse('**/api/search**');
  await page.fill('#search-input', 'playwright');
  const response = await responsePromise;

  expect(response.status()).toBe(200);
});
```

---

### [Exercise] Use page.evaluate() to Read DOM Data
- **Difficulty:** Intermediate
- **Description:** Use `page.evaluate()` to run JavaScript in the browser context and return data that isn't easily accessible via locators. Read the `document.title` and a `window` property.

```typescript
import { test, expect } from '@playwright/test';

test('read DOM data using page.evaluate', async ({ page }) => {
  await page.goto('https://playwright.dev');

  // 1. Use page.evaluate() to get the document.title from the browser
  //    const title = await page.evaluate(() => document.title)
  // YOUR CODE HERE

  // 2. Assert the title string includes 'Playwright'
  // YOUR CODE HERE

  // 3. Use page.evaluate() to count the number of <a> tags via JS
  //    const linkCount = await page.evaluate(() => document.querySelectorAll('a').length)
  // YOUR CODE HERE

  // 4. Assert the link count is greater than 10
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

test('read DOM data using page.evaluate', async ({ page }) => {
  await page.goto('https://playwright.dev');

  const title = await page.evaluate(() => document.title);
  expect(title).toContain('Playwright');

  const linkCount = await page.evaluate(() => document.querySelectorAll('a').length);
  expect(linkCount).toBeGreaterThan(10);
});
```

---

### [Exercise] Save and Reuse Authentication State
- **Difficulty:** Advanced
- **Description:** Write a `globalSetup` script that logs in once, saves the storage state to a file, and then configure `playwright.config.ts` to reuse that auth state for all tests. This is the industry-standard pattern for fast authenticated test suites.

```typescript
// global-setup.ts
import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  // 1. Launch a browser using chromium.launch()
  // YOUR CODE HERE

  // 2. Create a new page from a new browser context
  // YOUR CODE HERE

  // 3. Navigate to the login page and fill credentials
  // YOUR CODE HERE

  // 4. Save the storage state to 'auth.json'
  //    Use: await context.storageState({ path: 'auth.json' })
  // YOUR CODE HERE

  // 5. Close the browser
  // YOUR CODE HERE
}

export default globalSetup;
```

### Solution
```typescript
import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://your-app.example.com/login');
  await page.fill('#username', process.env.TEST_USER!);
  await page.fill('#password', process.env.TEST_PASS!);
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard');

  await context.storageState({ path: 'auth.json' });
  await browser.close();
}

export default globalSetup;
```

---

### [Exercise] Conditional Test Skipping by Environment
- **Difficulty:** Advanced
- **Description:** Write a test that uses `test.skip()` conditionally to avoid running in CI environments, and `test.slow()` to triple the timeout for a known slow operation. Demonstrate environment-aware test configuration.

```typescript
import { test, expect } from '@playwright/test';

// 1. Write a test.describe block named 'Environment-Aware Tests'
// 2. Inside, write a test named 'visual check (skip in CI)'
//    - Mark it as skipped if process.env.CI is truthy
//    - Mark it as slow()
//    - Navigate to playwright.dev and assert the title
// YOUR CODE HERE
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

test.describe('Environment-Aware Tests', () => {
  test('visual check (skip in CI)', async ({ page }) => {
    test.skip(!!process.env.CI, 'Visual checks are skipped in CI');
    test.slow();

    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
  });
});
```

---

### [Exercise] Full Parallel Data-Driven Test Suite
- **Difficulty:** Advanced
- **Description:** Build a data-driven, parallel-safe test suite that tests multiple URL routes of a documentation site. Each route should be verified to load and return a visible `h1` heading. Use `test.describe.parallel()` for maximum speed.

```typescript
import { test, expect } from '@playwright/test';

const routes = [
  { path: '/docs/intro', expectedH1: /Introduction/ },
  { path: '/docs/locators', expectedH1: /Locators/ },
  { path: '/docs/assertions', expectedH1: /Assertions/ },
];

// 1. Create a test.describe.parallel() block named 'Documentation Routes'
// 2. Loop over routes array
// 3. For each route, create a test that:
//    - Navigates to 'https://playwright.dev' + route.path
//    - Asserts that the h1 element matches expectedH1
// YOUR CODE HERE
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

const routes = [
  { path: '/docs/intro', expectedH1: /Introduction/ },
  { path: '/docs/locators', expectedH1: /Locators/ },
  { path: '/docs/assertions', expectedH1: /Assertions/ },
];

test.describe.parallel('Documentation Routes', () => {
  for (const route of routes) {
    test(`${route.path} loads correctly`, async ({ page }) => {
      await page.goto(`https://playwright.dev${route.path}`);
      await expect(page.locator('h1').first()).toHaveText(route.expectedH1);
    });
  }
});
```

---

### [Exercise] Network Request Spy with waitForRequest
- **Difficulty:** Advanced
- **Description:** Use `page.waitForRequest()` to spy on outgoing network requests and assert their properties — URL, method, and POST body payload. This is useful for verifying analytics events and API call payloads.

```typescript
import { test, expect } from '@playwright/test';

test('verify form submission sends correct POST payload', async ({ page }) => {
  await page.goto('https://your-app.example.com/contact');

  // 1. Set up the request spy BEFORE triggering the action
  //    const requestPromise = page.waitForRequest(req =>
  //      req.url().includes('/api/contact') && req.method() === 'POST'
  //    )
  // YOUR CODE HERE

  // 2. Fill and submit the form
  // YOUR CODE HERE

  // 3. Await the request promise
  //    const request = await requestPromise
  // YOUR CODE HERE

  // 4. Parse and assert the POST body
  //    const body = request.postDataJSON()
  //    expect(body.email).toBe('test@example.com')
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

test('verify form submission sends correct POST payload', async ({ page }) => {
  await page.goto('https://your-app.example.com/contact');

  const requestPromise = page.waitForRequest(
    (req) => req.url().includes('/api/contact') && req.method() === 'POST'
  );

  await page.fill('#email', 'test@example.com');
  await page.fill('#message', 'Hello World');
  await page.click('button[type="submit"]');

  const request = await requestPromise;
  const body = request.postDataJSON();
  expect(body.email).toBe('test@example.com');
});
```

---

## 🧠 More Flashcards

**Concept:** BrowserContext vs Page
A `BrowserContext` is an isolated browser session (separate cookies, storage). A `Page` is a single tab inside a context. One context can have multiple pages (tabs). Use multiple contexts to simulate different logged-in users simultaneously.

**Concept:** page.route().continue()
Instead of mocking a response, `route.continue()` passes the intercepted request through to the real server — but you can modify headers or the URL before it goes. Useful for injecting auth tokens without changing the app code.

**Concept:** page.pause()
`await page.pause()` halts test execution and opens the Playwright Inspector — an interactive debugger. Use during development to step through a test manually. Remove it before committing, or gate it: `if (process.env.DEBUG) await page.pause()`.

**Term:** test.only()
`test.only('name', ...)` marks a test to be the ONLY test that runs in the entire suite. Useful for debugging a single test quickly. Must be removed before committing — leaving it in breaks the full test suite in CI.

**Term:** locator.inputValue()
Returns the current value of an input, textarea, or select element as a string. Use when you need the raw field value to make a non-assertion decision in your test logic.

**Term:** page.goBack() / page.goForward()
Navigates the browser history backward or forward. Always `await` these and follow with a `waitForLoadState()` to ensure the page is fully rendered.

**Concept:** Clock API (fake timers)
`await page.clock.install()` replaces the browser's real clock with a fake one. `await page.clock.tick(5000)` advances time by 5 seconds instantly. Useful for testing timeout-based UI behaviour without waiting real time.

**Concept:** page.exposeFunction()
Exposes a Node.js function to the browser's `window` object. Useful for bridging browser and Node.js contexts — e.g., triggering server-side logging from within `page.evaluate()`.

---

## 📝 More Quizzes

### What does `test.only()` do?
- [x] Runs ONLY that test in the entire suite, skipping all others
- [ ] Marks the test as the most important one for reporting
- [ ] Runs the test in only one browser
- [ ] Makes the test always run even if other tests are skipped

### What does `page.pause()` do?
- [ ] Adds a 1-second delay
- [ ] Skips the current test
- [x] Halts execution and opens the Playwright Inspector for interactive debugging
- [ ] Takes a screenshot and pauses rendering

### What is the difference between a BrowserContext and a Page?
- [ ] They are the same thing
- [x] A BrowserContext is an isolated session; a Page is a single tab inside a context
- [ ] BrowserContext is only used in headed mode
- [ ] A Page can contain multiple BrowserContexts

### How does `route.continue()` differ from `route.fulfill()`?
- [x] `continue()` passes the request to the real server; `fulfill()` returns a mock response
- [ ] They are identical
- [ ] `continue()` is for GET requests only
- [ ] `fulfill()` modifies headers; `continue()` replaces the body

### What does `locator.inputValue()` return?
- [ ] Whether the input is valid
- [x] The current value of the input as a string
- [ ] The input's placeholder text
- [ ] A Locator for the value attribute

### What does `page.waitForLoadState('networkidle')` wait for?
- [ ] The page `load` event to fire
- [x] Network activity to drop to less than 2 connections for 500ms
- [ ] All images to finish loading
- [ ] The DOM to be fully interactive

### What does `page.clock.tick(5000)` do?
- [ ] Waits 5 seconds in real time
- [x] Advances the fake browser clock by 5 seconds instantly
- [ ] Sets a 5 second timeout for all actions
- [ ] Retries a failed action for 5 seconds

### What does `page.exposeFunction()` do?
- [ ] Runs a browser function in Node.js context
- [x] Makes a Node.js function callable from `window` inside the browser
- [ ] Exports a page method to the global scope
- [ ] Enables calling async functions from `page.evaluate()`

---

## 🏋️ More Coding Exercises

### [Exercise] Intercept and Modify Request Headers
- **Difficulty:** Intermediate
- **Description:** Use `page.route()` with `route.continue()` to intercept and inject a custom header before the request reaches the server.

```typescript
import { test, expect } from '@playwright/test';

test('inject custom header via route interception', async ({ page }) => {
  // 1. Set up a route for 'https://jsonplaceholder.typicode.com/**'
  //    In the handler, call route.continue() adding 'X-Custom-Token': 'test-123'
  //    to the existing headers using spread: { ...route.request().headers(), ... }
  // YOUR CODE HERE

  await page.goto('https://playwright.dev');
  await expect(page).toHaveTitle(/Playwright/);
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

test('inject custom header via route interception', async ({ page }) => {
  await page.route('https://jsonplaceholder.typicode.com/**', async (route) => {
    await route.continue({
      headers: { ...route.request().headers(), 'X-Custom-Token': 'test-123' },
    });
  });

  await page.goto('https://playwright.dev');
  await expect(page).toHaveTitle(/Playwright/);
});
```

---

### [Exercise] Multi-Context — Two Users Simultaneously
- **Difficulty:** Advanced
- **Description:** Create two separate browser contexts to simulate two different logged-in users interacting simultaneously. Each context is completely isolated.

```typescript
import { test, expect } from '@playwright/test';

test('two users in separate contexts', async ({ browser }) => {
  // 1. Create context1 and context2 using browser.newContext()
  // YOUR CODE HERE

  // 2. Create a page from each context
  // YOUR CODE HERE

  // 3. Navigate both pages to 'https://playwright.dev'
  // YOUR CODE HERE

  // 4. Assert both pages have the Playwright title
  // YOUR CODE HERE

  // 5. Close both contexts
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

test('two users in separate contexts', async ({ browser }) => {
  const context1 = await browser.newContext();
  const context2 = await browser.newContext();

  const page1 = await context1.newPage();
  const page2 = await context2.newPage();

  await page1.goto('https://playwright.dev');
  await page2.goto('https://playwright.dev');

  await expect(page1).toHaveTitle(/Playwright/);
  await expect(page2).toHaveTitle(/Playwright/);

  await context1.close();
  await context2.close();
});
```

---

### [Exercise] Navigate Browser History with goBack()
- **Difficulty:** Basic
- **Description:** Navigate to two pages then use `page.goBack()` to return to the first. Assert both navigation steps work correctly.

```typescript
import { test, expect } from '@playwright/test';

test('browser history navigation', async ({ page }) => {
  // 1. Navigate to 'https://playwright.dev'
  // YOUR CODE HERE

  // 2. Navigate to 'https://playwright.dev/docs/intro'
  // YOUR CODE HERE

  // 3. Assert URL contains '/docs/intro'
  // YOUR CODE HERE

  // 4. Call page.goBack() and assert URL is back to the root
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

test('browser history navigation', async ({ page }) => {
  await page.goto('https://playwright.dev');
  await page.goto('https://playwright.dev/docs/intro');
  await expect(page).toHaveURL(/\/docs\/intro/);

  await page.goBack();
  await expect(page).toHaveURL('https://playwright.dev/');
});
```
```

---

## 🧠 Flashcards — Batch 3

**Concept:** page.on('console') — Console Log Spy
`page.on('console', msg => ...)` intercepts browser console messages in Node.js. Use `msg.type()` to check if it's `'error'`, `'warning'`, or `'log'`. Collect errors into an array and assert the array is empty after the test.

**Concept:** page.on('pageerror') — JS Error Detection
`page.on('pageerror', err => ...)` fires when an uncaught JavaScript error occurs on the page. Register this BEFORE navigating. Collect errors into an array and assert it's empty — a powerful way to detect hidden JS exceptions that don't affect visible UI.

**Concept:** page.emulateMedia()
`await page.emulateMedia({ colorScheme: 'dark' })` simulates CSS media query states mid-test. Use `media: 'print'` to test print layouts or `reducedMotion: 'reduce'` to test accessibility-friendly animation states.

**Concept:** expect.extend() — Custom Matchers
`expect.extend({ myMatcher(received) { ... } })` adds domain-specific assertions to Playwright's `expect`. Returns `{ pass: boolean, message: () => string }`. Produces readable failure messages like `expected 42 to be within range [10, 50]`.

**Concept:** test.describe.configure({ mode: 'parallel' })
Enables parallel execution for a specific `describe` block without setting `fullyParallel: true` globally. All tests in that block run concurrently. The surrounding describe blocks remain serial.

**Term:** test.info().annotations
`test.info().annotations.push({ type: 'issue', description: 'JIRA-123' })` attaches custom metadata to the test that appears in HTML and Allure reports. Useful for linking tests to tickets and requirements.

**Term:** test.info().attach()
`await test.info().attach('screenshot', { body: buffer, contentType: 'image/png' })` embeds a binary or text artifact directly into the test report entry. Use for API responses, HAR files, or extra screenshots.

**Term:** context.clearCookies()
`await context.clearCookies()` removes all cookies from a browser context mid-test. Use between logical scenarios in a single test to simulate session expiry without creating a new context.

**Concept:** Fixture scope: 'worker'
Setting `scope: 'worker'` on a fixture makes it run once per worker process, shared across all tests in that worker. Ideal for expensive operations like API login that produce a `storageState` file — avoids logging in for every single test.

**Concept:** Playwright Inspector
Opened via `PWDEBUG=1 npx playwright test` or `page.pause()`. Shows the page alongside a step list, action log, and selector explorer. You can click elements in the browser and Playwright suggests the best locator. Essential for debugging failing selectors.

---

## 📝 Quizzes — Batch 3

### What does `page.on('pageerror', err => ...)` detect?
- [ ] Network request failures
- [x] Uncaught JavaScript errors thrown in the browser page
- [ ] Playwright assertion failures
- [ ] Console.warn() messages

### What does `page.emulateMedia({ colorScheme: 'dark' })` do?
- [ ] Changes the system theme to dark mode
- [x] Simulates the `prefers-color-scheme: dark` CSS media query in the browser
- [ ] Applies a dark CSS overlay to the page
- [ ] Switches the Playwright UI theme

### What is `expect.extend()` used for?
- [ ] Extending the Playwright test runner with plugins
- [x] Adding custom assertion matchers with domain-specific failure messages
- [ ] Extending a fixture's timeout globally
- [ ] Adding extra properties to the expect object at runtime

### What does `context.clearCookies()` do?
- [ ] Clears localStorage and sessionStorage
- [x] Removes all cookies from the current browser context
- [ ] Removes all cookies from the user's OS cookie store
- [ ] Resets all network interception routes

### What is the purpose of `yield` in a Playwright fixture function?
- [ ] It pauses the test until user input
- [x] Code before yield is setup; code after yield is teardown (always runs even on test failure)
- [ ] It yields the test result to the reporter
- [ ] It allows a fixture to run in a separate thread

### What does `test.info().attach()` do?
- [ ] Attaches a file to the test runner process
- [x] Embeds a binary or text artifact directly into the test report entry
- [ ] Attaches a listener to the test lifecycle
- [ ] Uploads an artifact to CI storage

### What reporter does Playwright use by default locally?
- [ ] `dot`
- [ ] `html`
- [x] `list`
- [ ] `junit`

### What does `test.describe.configure({ mode: 'parallel' })` do?
- [ ] Makes the entire test suite parallel
- [x] Enables parallel execution for only that specific describe block
- [ ] Requires fullyParallel to be true in global config
- [ ] Runs each test in a new browser type

### What does `page.on('console', msg => ...)` capture?
- [ ] Only console.error() messages
- [x] All browser console messages (log, warn, error, info)
- [ ] Network responses logged by the browser
- [ ] Playwright's internal debug messages

### What does fixture `scope: 'worker'` provide?
- [ ] The fixture runs once per test
- [x] The fixture runs once per worker process, shared across multiple tests in that worker
- [ ] The fixture runs in a background worker thread
- [ ] The fixture runs after all tests complete

---

## 🏋️ Coding Exercises — Batch 3

### [Exercise] Capture Console Errors During Test
- **Difficulty:** Basic
- **Description:** Register a `console` listener to collect any browser console errors during the test. After actions, assert no unexpected errors were logged.

```typescript
import { test, expect } from '@playwright/test';

test('page emits no console errors', async ({ page }) => {
  const consoleErrors: string[] = [];

  // 1. Register page.on('console') and collect messages where msg.type() === 'error'
  // YOUR CODE HERE

  await page.goto('https://playwright.dev');
  await page.getByRole('link', { name: 'Docs' }).first().click();

  // 2. Assert consoleErrors is empty
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

test('page emits no console errors', async ({ page }) => {
  const consoleErrors: string[] = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  await page.goto('https://playwright.dev');
  await page.getByRole('link', { name: 'Docs' }).first().click();

  expect(consoleErrors).toHaveLength(0);
});
```

---

### [Exercise] Detect Uncaught Page JS Errors
- **Difficulty:** Intermediate
- **Description:** Register a `pageerror` listener to automatically detect uncaught JavaScript exceptions on the page — bugs that would otherwise be silent.

```typescript
import { test, expect } from '@playwright/test';

test('no uncaught JS errors on page', async ({ page }) => {
  const pageErrors: Error[] = [];

  // 1. Register page.on('pageerror', error => pageErrors.push(error))
  // YOUR CODE HERE

  await page.goto('https://playwright.dev');
  await page.getByRole('link', { name: 'Get started' }).click();
  await page.waitForLoadState();

  // 2. Assert pageErrors is empty
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

test('no uncaught JS errors on page', async ({ page }) => {
  const pageErrors: Error[] = [];
  page.on('pageerror', (error) => pageErrors.push(error));

  await page.goto('https://playwright.dev');
  await page.getByRole('link', { name: 'Get started' }).click();
  await page.waitForLoadState();

  expect(pageErrors).toHaveLength(0);
});
```

---

### [Exercise] Dark Mode Emulation
- **Difficulty:** Intermediate
- **Description:** Use `page.emulateMedia()` to switch between light and dark color schemes and verify the page changes its background color accordingly.

```typescript
import { test, expect } from '@playwright/test';

test('page responds to dark and light mode media query', async ({ page }) => {
  // 1. Emulate dark scheme and navigate
  // YOUR CODE HERE

  // 2. Read computed background-color in dark mode
  //    const darkBg = await page.locator('body').evaluate(el => getComputedStyle(el).backgroundColor)
  // YOUR CODE HERE

  // 3. Emulate light scheme, reload, read background-color in light mode
  // YOUR CODE HERE

  // 4. Assert the two colors differ
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

test('page responds to dark and light mode media query', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('https://playwright.dev');
  const darkBg = await page.locator('body').evaluate((el) => getComputedStyle(el).backgroundColor);

  await page.emulateMedia({ colorScheme: 'light' });
  await page.reload();
  const lightBg = await page.locator('body').evaluate((el) => getComputedStyle(el).backgroundColor);

  expect(darkBg).not.toBe(lightBg);
});
```

---

### [Exercise] Parallel Describe with Independent Tests
- **Difficulty:** Advanced
- **Description:** Use `test.describe.configure({ mode: 'parallel' })` to run documentation route tests concurrently, then keep a serial describe block for order-dependent checks.

```typescript
import { test, expect } from '@playwright/test';

// 1. Create 'Parallel Docs Checks' describe with mode: 'parallel'
//    - 3 tests each navigating to a different /docs/* URL and asserting h1 visible
// YOUR CODE HERE

// 2. Create a separate describe 'Serial Health Checks' (no parallel config)
//    - 2 simple tests that assert arithmetic (simulating order-dependent steps)
// YOUR CODE HERE
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

test.describe('Parallel Docs Checks', () => {
  test.describe.configure({ mode: 'parallel' });

  test('intro page h1 visible', async ({ page }) => {
    await page.goto('https://playwright.dev/docs/intro');
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('locators page h1 visible', async ({ page }) => {
    await page.goto('https://playwright.dev/docs/locators');
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('assertions page h1 visible', async ({ page }) => {
    await page.goto('https://playwright.dev/docs/test-assertions');
    await expect(page.locator('h1').first()).toBeVisible();
  });
});

test.describe('Serial Health Checks', () => {
  test('step 1: baseline check', () => expect(1 + 1).toBe(2));
  test('step 2: dependent check', () => expect(2 * 2).toBe(4));
});
```

---

## ðŸ§  Flashcards â€” Batch 4

**Concept:** page.waitForResponse()
`await page.waitForResponse('**/api/users')` waits for a network response matching the URL pattern. Returns an `APIResponse` object. Use to wait for an API call to complete before asserting the UI updated â€” more reliable than fixed timeouts.

**Concept:** page.waitForRequest()
`await page.waitForRequest('**/api/search')` waits for an outgoing network request matching the pattern. Useful to assert that the correct API is called when a user interacts with the UI. Pair with `Promise.all` to avoid race conditions.

**Concept:** Abort Network Requests
`page.route('**/*.{png,jpg}', route => route.abort())` aborts specific requests. Use to speed up tests by blocking images, fonts, or analytics scripts that aren't relevant to the tested functionality.

**Concept:** page.waitForEvent()
`await page.waitForEvent('download')` waits for a specific page event (download, popup, dialog, filechooser). Returns the event payload. Use with `Promise.all` to avoid missing events that fire during the triggering action.

**Concept:** Handling Dialogs (alert/confirm/prompt)
`page.on('dialog', dialog => dialog.accept())` handles browser dialogs. Register BEFORE the action that triggers the dialog. Use `dialog.dismiss()` for Cancel. `dialog.message()` returns the dialog text. `dialog.accept(text)` provides input for prompts.

**Term:** page.video()
After enabling `recordVideo` in the browser context, `page.video()?.path()` returns the path to the recorded video. Playwright records from test start to context close. Use in `afterEach` to attach the video to the test report on failure.

**Term:** BrowserContext.tracing
`await context.tracing.start({ screenshots: true, snapshots: true })` records a Playwright Trace. Stop with `await context.tracing.stop({ path: 'trace.zip' })`. Open in the Playwright Trace Viewer: `npx playwright show-trace trace.zip`.

**Concept:** locator.evaluate()
`await locator.evaluate(el => el.getAttribute('data-testid'))` executes a function in the browser context with the matched DOM element as argument. Returns any serializable value. Use for accessing properties not exposed by Playwright's locator API.

**Concept:** locator.evaluateAll()
`await page.locator('a').evaluateAll(els => els.map(e => e.href))` passes ALL matched elements to a single browser-side function. More efficient than looping `.nth()` calls for bulk data extraction.

**Concept:** page.evaluate() with Arguments
`await page.evaluate(([a, b]) => a + b, [3, 4])` passes serializable arguments to the browser function. Arguments must be serializable (no functions, no DOM nodes). Use to pass test data into browser-side scripts.

---

## ðŸ“ Quizzes â€” Batch 4

### What does `page.waitForResponse('**/api/data')` return?
- [ ] A boolean indicating if the response arrived
- [x] The matching APIResponse object when the response arrives
- [ ] The response body as a string
- [ ] A promise that times out after 30 seconds regardless

### Why must you use `Promise.all` when waiting for a popup or request?
- [ ] It makes the test run in parallel
- [x] To avoid a race condition where the event fires before the `waitForEvent` listener is registered
- [ ] To handle multiple browsers
- [ ] Because Playwright requires it for all async operations

### What does `page.route('**/*.png', route => route.abort())` do?
- [ ] Replaces all PNG images with a 404 error page
- [x] Prevents all PNG image requests from reaching the server
- [ ] Saves all PNG images to disk
- [ ] Logs all PNG requests without intercepting them

### How do you handle a browser `alert()` dialog in Playwright?
- [ ] `page.alert.accept()`
- [x] Register `page.on('dialog', dialog => dialog.accept())` BEFORE the action that triggers it
- [ ] `page.keyboard.press('Enter')` after the alert appears
- [ ] Dialogs are auto-dismissed in Playwright

### What does `locator.evaluate(el => el.dataset.id)` do?
- [ ] Asserts the element has a dataset id
- [x] Executes a function in the browser with the matched DOM element and returns the result
- [ ] Evaluates a CSS selector against the element
- [ ] Returns the element's data attributes as an object

### What does `locator.evaluateAll(els => els.map(e => e.href))` do?
- [ ] Evaluates the locator against each element one by one
- [x] Passes all matched elements to a single browser-side function and returns the mapped result
- [ ] Filters the locator to elements with an href attribute
- [ ] Returns a count of elements with href attributes

### What is the Playwright Trace Viewer used for?
- [ ] Live streaming test execution to a dashboard
- [x] Replaying a recorded trace to debug failures, including screenshots, DOM snapshots, and network logs
- [ ] Generating HTML test reports
- [ ] Monitoring test flakiness over time

### What does `page.waitForEvent('download')` wait for?
- [ ] A file to finish uploading
- [x] A download to start in the browser and returns the Download object
- [ ] The page to stop loading resources
- [ ] A network request with content-type: attachment

---

## ðŸ‹ï¸ Coding Exercises â€” Batch 4

### [Exercise] Intercept and Assert API Call Made by UI
- **Difficulty:** Intermediate
- **Description:** Use `Promise.all` + `page.waitForRequest()` to assert the UI triggers the correct API endpoint when a user interacts with a search field.

```typescript
import { test, expect } from '@playwright/test';

test('UI triggers correct search API call', async ({ page }) => {
  await page.goto('https://playwright.dev');

  // 1. Use Promise.all to simultaneously:
  //    - Wait for a request matching '**/search*'
  //    - Click or type in the search field
  //    The Promise.all ensures we don't miss the request
  const [request] = await Promise.all([
    page.waitForRequest('**/search*'),
    page.getByRole('button', { name: /search/i }).first().click(),
  ]);

  // 2. Assert the request URL contains 'search'
  expect(request.url()).toContain('search');
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

test('UI triggers correct search API call', async ({ page }) => {
  await page.goto('https://playwright.dev');

  const [request] = await Promise.all([
    page.waitForRequest('**/search*'),
    page.getByRole('button', { name: /search/i }).first().click(),
  ]);

  expect(request.url()).toContain('search');
});
```

---

### [Exercise] Block Images to Speed Up Tests
- **Difficulty:** Basic
- **Description:** Abort all image requests to dramatically speed up page loads in tests that only care about text content and form interactions.

```typescript
import { test, expect } from '@playwright/test';

test('page loads without images (faster test)', async ({ page }) => {
  // 1. Set up route to abort all .png, .jpg, .gif, .webp requests
  //    Use pattern: '**/*.{png,jpg,jpeg,gif,webp,svg}'
  // YOUR CODE HERE

  await page.goto('https://playwright.dev');

  // 2. Assert the page title is still correct (images blocked, text still loads)
  await expect(page).toHaveTitle(/Playwright/);

  // 3. Assert navigation links are still visible
  await expect(page.getByRole('link', { name: 'Docs' }).first()).toBeVisible();
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

test('page loads without images (faster test)', async ({ page }) => {
  await page.route('**/*.{png,jpg,jpeg,gif,webp,svg}', (route) => route.abort());

  await page.goto('https://playwright.dev');

  await expect(page).toHaveTitle(/Playwright/);
  await expect(page.getByRole('link', { name: 'Docs' }).first()).toBeVisible();
});
```

---

### [Exercise] Handle Alert Dialog
- **Difficulty:** Intermediate
- **Description:** Register a dialog event listener before triggering an action that produces a browser `alert()`. Assert the dialog message and that the page continues working after dismissal.

```typescript
import { test, expect } from '@playwright/test';

test('handle browser alert dialog', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/javascript_alerts');

  let alertMessage = '';

  // 1. Register page.on('dialog', ...) handler BEFORE clicking
  //    Capture dialog.message() into alertMessage, then accept
  // YOUR CODE HERE

  // 2. Click 'Click for JS Alert' button
  await page.getByRole('button', { name: 'Click for JS Alert' }).click();

  // 3. Assert alertMessage is 'I am a JS Alert'
  // YOUR CODE HERE

  // 4. Assert the result text shows 'You successfully clicked an alert'
  await expect(page.locator('#result')).toContainText('You successfully clicked an alert');
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

test('handle browser alert dialog', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/javascript_alerts');

  let alertMessage = '';

  page.on('dialog', async (dialog) => {
    alertMessage = dialog.message();
    await dialog.accept();
  });

  await page.getByRole('button', { name: 'Click for JS Alert' }).click();

  expect(alertMessage).toBe('I am a JS Alert');
  await expect(page.locator('#result')).toContainText('You successfully clicked an alert');
});
```

---

### [Exercise] Extract All Link HREFs with evaluateAll()
- **Difficulty:** Intermediate
- **Description:** Use `locator.evaluateAll()` to extract all href attributes from links in the navbar in a single browser-side call. Assert the list contains expected destinations.

```typescript
import { test, expect } from '@playwright/test';

test('extract all nav link hrefs with evaluateAll', async ({ page }) => {
  await page.goto('https://playwright.dev');

  // 1. Use page.locator('nav a').evaluateAll() to extract all href attributes
  //    evaluateAll(els => els.map(el => el.getAttribute('href') ?? ''))
  // YOUR CODE HERE

  // 2. Assert hrefs is an array with length > 0
  // YOUR CODE HERE

  // 3. Assert at least one href contains '/docs'
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

test('extract all nav link hrefs with evaluateAll', async ({ page }) => {
  await page.goto('https://playwright.dev');

  const hrefs = await page.locator('nav a').evaluateAll(
    (els) => els.map((el) => el.getAttribute('href') ?? '')
  );

  expect(hrefs.length).toBeGreaterThan(0);
  expect(hrefs.some((href) => href.includes('/docs'))).toBe(true);
});
```

---

### [Exercise] Handle File Download
- **Difficulty:** Advanced
- **Description:** Trigger a file download, wait for it using `page.waitForEvent('download')`, and assert the suggested filename is correct.

```typescript
import { test, expect } from '@playwright/test';

test('trigger and assert file download', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/download');

  // 1. Use Promise.all with waitForEvent('download') and click the first file link
  //    const [download] = await Promise.all([
  //      page.waitForEvent('download'),
  //      page.locator('.example a').first().click(),
  //    ])
  // YOUR CODE HERE

  // 2. Assert download.suggestedFilename() is not empty
  // YOUR CODE HERE

  // 3. Log the suggested filename
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

test('trigger and assert file download', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/download');

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.locator('.example a').first().click(),
  ]);

  const filename = download.suggestedFilename();
  expect(filename.length).toBeGreaterThan(0);
  console.log(`Downloaded file: ${filename}`);
});
```
