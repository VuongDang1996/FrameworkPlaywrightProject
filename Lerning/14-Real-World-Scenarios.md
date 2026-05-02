# 14 — Real-World Scenarios & E2E Workflows

End-to-end real-world test scenarios: shopping carts, form validation, file uploads, multi-tab flows, drag-and-drop, and complete user journeys with full Allure instrumentation.

---

## 🧠 Flashcards

**Concept:** Multi-step User Journey Test
A user journey test follows a real user flow across multiple pages: land → search → select → add to cart → checkout → confirm. Each step uses page object methods. These tests are high-value but run slower — tag them as `@regression` not `@smoke`.

**Concept:** Dialog Handling (alert/confirm)
Playwright auto-dismisses browser dialogs. To handle them explicitly, register a listener BEFORE the action that triggers the dialog: `page.on('dialog', dialog => dialog.accept())`. You can also read the dialog message with `dialog.message()`.

**Concept:** File Upload with setInputFiles()
To upload a file, use `locator.setInputFiles(path)` on the `<input type="file">` element. Example: `await page.locator('input[type="file"]').setInputFiles('./test-files/document.pdf')`. Works for single and multiple files.

**Concept:** New Tab Handling (popup)
When an action opens a new browser tab, listen for the `popup` event BEFORE clicking: `const [newPage] = await Promise.all([context.waitForEvent('popup'), page.click('a[target="_blank"]')])`. Then interact with `newPage` as a normal page object.

**Concept:** Drag and Drop
Use `page.dragAndDrop(source, target)` to drag one element onto another. For complex drag operations, use the lower-level `mouse.move()` + `mouse.down()` + `mouse.up()` sequence. Always verify the result by asserting the final DOM state.

**Concept:** Viewport and Mobile Testing
Set `use: { viewport: { width: 375, height: 812 } }` in `playwright.config.ts` (or in a specific project) to simulate mobile devices. Use `use: { userAgent: devices['iPhone 13'].userAgent }` along with viewport for a full device simulation.

**Term:** expect(locator).toBeEnabled()
Asserts that a form element (button, input, select) is not disabled. Playwright retries this assertion automatically. Useful for verifying that a Submit button becomes enabled after form validation passes.

**Term:** expect(locator).toBeChecked()
Asserts that a checkbox or radio button is in the checked state. Example: `await expect(page.locator('#terms-checkbox')).toBeChecked()`. Pair with `.check()` action to tick the checkbox first.

**Term:** page.selectOption()
Selects an `<option>` inside a `<select>` dropdown by value, label, or index. Example: `await page.selectOption('#country-select', { label: 'Vietnam' })`. The locator-based equivalent is `locator.selectOption()`.

**Term:** locator.check() / locator.uncheck()
Specifically for checkbox and radio elements. `locator.check()` checks the element, `locator.uncheck()` unchecks it. These are preferred over `locator.click()` for checkboxes because they verify the element type and only change state if needed.

**Term:** page.screenshot()
Captures a screenshot of the page or a specific element. `{ path: 'screenshot.png' }` saves to file. `{ fullPage: true }` captures the entire scrollable page. `locator.screenshot()` captures just that element's bounding box.

**Concept:** Retry-ability vs. Awaiting
Playwright assertions auto-retry. Regular JavaScript expressions do not. Never write `const text = await locator.textContent(); expect(text).toBe('...')` — instead use `await expect(locator).toHaveText('...')` which retries automatically if the text changes.

**Concept:** Test Tagging Strategy
Use tags systematically: `@smoke` for 5-10 critical tests that must pass before deployment; `@regression` for full coverage tests run nightly; `@wip` for in-progress tests; `@flaky` for known intermittent tests. Run subsets with `--grep`.

**Concept:** baseURL Configuration
Setting `baseURL: 'http://localhost:3000'` in `playwright.config.ts` lets you write `page.goto('/login')` instead of the full URL. This makes tests portable across environments — just change `baseURL` and all tests update automatically.

**Concept:** Fixtures Scope (test vs. worker)
By default, a fixture runs per-test (setup/teardown for each test). Setting `scope: 'worker'` makes it run once per worker process — ideal for expensive operations like browser login that can be shared across tests in the same worker.

**Term:** toHaveText() vs toContainText()
`toHaveText('exact string')` asserts the full text content matches exactly. `toContainText('partial')` asserts the element contains the substring. Use `toContainText` for dynamic content where other text may also be present.

**Term:** page.addLocatorHandler()
Registers a handler that fires automatically when a locator becomes visible — useful for dismissing cookie banners, modals, or tour overlays that appear unpredictably during tests. Example: auto-dismiss a GDPR banner before any click.

**Concept:** Visual Regression Testing
`await expect(page).toHaveScreenshot('reference.png')` compares the current page against a stored reference screenshot. On first run it creates the baseline. On subsequent runs it diffs pixel-by-pixel. Update snapshots with `--update-snapshots` flag.

**Concept:** Playwright Component Testing
Playwright supports component testing via `@playwright/experimental-ct-*` packages for React, Vue, and Svelte. You mount a single component (`mount(<Button label="Click" />)`) and interact with it in isolation, without needing a full app server.

---

## 📝 Quizzes

### How do you handle a browser `alert()` dialog in Playwright?
- [ ] `await page.alert.dismiss()`
- [ ] `page.waitForAlert().then(a => a.accept())`
- [x] `page.on('dialog', dialog => dialog.accept())` — registered BEFORE the action
- [ ] Playwright automatically blocks all dialogs with no way to intercept them

### What is the correct way to upload a file in Playwright?
- [ ] `await page.upload('input[type=file]', './file.pdf')`
- [x] `await page.locator('input[type="file"]').setInputFiles('./file.pdf')`
- [ ] `await page.dragAndDrop('./file.pdf', 'input[type=file]')`
- [ ] `await page.fill('input[type=file]', './file.pdf')`

### How do you capture a new browser tab that opens when clicking a link?
- [ ] `const newPage = await page.newTab()`
- [ ] `page.on('tab', (tab) => tab.waitForLoad())`
- [x] `const [newPage] = await Promise.all([context.waitForEvent('popup'), page.click('a')])`
- [ ] `await page.switchToTab(1)`

### What does `page.selectOption('#select', { label: 'Vietnam' })` do?
- [ ] Types 'Vietnam' into a text input
- [x] Selects the `<option>` with the display text 'Vietnam' in a `<select>` dropdown
- [ ] Filters visible elements by label text
- [ ] Finds an ARIA combobox named 'Vietnam'

### Which assertion retries automatically until it passes?
- [x] `await expect(locator).toHaveText('Hello')`
- [ ] `const t = await locator.textContent(); expect(t).toBe('Hello')`
- [ ] `assert(await locator.textContent() === 'Hello')`
- [ ] `if (await locator.textContent() !== 'Hello') throw new Error()`

### What does `toContainText()` do compared to `toHaveText()`?
- [ ] They are identical
- [ ] `toContainText` only works on lists
- [x] `toContainText` checks for a substring; `toHaveText` checks the full text content
- [ ] `toHaveText` is case-insensitive; `toContainText` is case-sensitive

### How do you simulate a mobile device in Playwright?
- [ ] `playwright test --mobile`
- [ ] `page.setMobile(true)`
- [x] Set `viewport` and `userAgent` in config using `devices['iPhone 13']` from `@playwright/test`
- [ ] Install a mobile browser driver separately

### What is a fixture with `scope: 'worker'` used for?
- [ ] Running a fixture in parallel within one test
- [ ] Resetting state between tests in the same file
- [x] Running an expensive setup (like login) once per worker, shared across multiple tests
- [ ] Scoping the fixture to a specific browser type

### What does `locator.check()` do that `locator.click()` doesn't?
- [ ] It's faster
- [x] It verifies the element is a checkbox and only acts if not already checked
- [ ] It works on buttons as well as checkboxes
- [ ] It submits the parent form after checking

### Which command updates visual regression baseline screenshots?
- [ ] `npx playwright test --reset-snapshots`
- [ ] `npx playwright test --regenerate`
- [x] `npx playwright test --update-snapshots`
- [ ] `npx playwright test --baseline`

### What does `page.addLocatorHandler()` help with?
- [ ] Adding custom locator strategies
- [x] Automatically handling overlays like cookie banners that appear unexpectedly during tests
- [ ] Registering event handlers for locator changes
- [ ] Making locators work faster

### When should you use `@smoke` vs `@regression` tags?
- [ ] They are interchangeable
- [ ] `@smoke` for happy path, `@regression` for edge cases only
- [x] `@smoke` for critical pre-deployment checks; `@regression` for full nightly coverage
- [ ] `@regression` for new features, `@smoke` for bug fixes

---

## 🏋️ Coding Exercises

### [Exercise] Handle a Browser Alert Dialog
- **Difficulty:** Basic
- **Description:** Register a dialog listener to automatically accept a browser alert, then trigger the action that causes it. Assert the dialog was handled by checking the resulting page state.

```typescript
import { test, expect } from '@playwright/test';

test('handle alert dialog automatically', async ({ page }) => {
  // 1. Register a dialog listener BEFORE the action using page.on('dialog', ...)
  //    Call dialog.accept() inside the handler
  // YOUR CODE HERE

  // 2. Navigate to a page that triggers an alert
  await page.goto('https://the-internet.herokuapp.com/javascript_alerts');

  // 3. Click the button that triggers alert() - look for 'Click for JS Alert'
  // YOUR CODE HERE

  // 4. Assert the result text says 'You successfully clicked an alert'
  //    Locator: page.locator('#result')
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

test('handle alert dialog automatically', async ({ page }) => {
  page.on('dialog', (dialog) => dialog.accept());

  await page.goto('https://the-internet.herokuapp.com/javascript_alerts');
  await page.getByRole('button', { name: 'Click for JS Alert' }).click();
  await expect(page.locator('#result')).toHaveText('You successfully clicked an alert');
});
```

---

### [Exercise] Select from a Dropdown
- **Difficulty:** Basic
- **Description:** Navigate to a page with a `<select>` dropdown, select an option by value, and assert the correct option is now selected using `toHaveValue()`.

```typescript
import { test, expect } from '@playwright/test';

test('select an option from dropdown', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/dropdown');

  // 1. Select option with value '1' from the dropdown (id: #dropdown)
  //    Use page.selectOption('#dropdown', '1')
  // YOUR CODE HERE

  // 2. Assert the dropdown now has value '1'
  //    Use expect(page.locator('#dropdown')).toHaveValue('1')
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

test('select an option from dropdown', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/dropdown');
  await page.selectOption('#dropdown', '1');
  await expect(page.locator('#dropdown')).toHaveValue('1');
});
```

---

### [Exercise] Check and Uncheck Checkboxes
- **Difficulty:** Basic
- **Description:** Navigate to a checkboxes page, check an unchecked checkbox and assert it's checked, then uncheck it and assert it's unchecked.

```typescript
import { test, expect } from '@playwright/test';

test('check and uncheck a checkbox', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/checkboxes');

  const checkbox = page.locator('input[type="checkbox"]').first();

  // 1. Check the checkbox using .check()
  // YOUR CODE HERE

  // 2. Assert it is now checked using toBeChecked()
  // YOUR CODE HERE

  // 3. Uncheck the checkbox using .uncheck()
  // YOUR CODE HERE

  // 4. Assert it is now NOT checked using not.toBeChecked()
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

test('check and uncheck a checkbox', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/checkboxes');

  const checkbox = page.locator('input[type="checkbox"]').first();

  await checkbox.check();
  await expect(checkbox).toBeChecked();

  await checkbox.uncheck();
  await expect(checkbox).not.toBeChecked();
});
```

---

### [Exercise] Handle a New Tab (Popup)
- **Difficulty:** Intermediate
- **Description:** Click a link that opens in a new tab, switch context to the new tab, and verify its URL and title before closing it.

```typescript
import { test, expect } from '@playwright/test';

test('interact with a new tab popup', async ({ page, context }) => {
  await page.goto('https://the-internet.herokuapp.com/windows');

  // 1. Listen for the popup and click the link simultaneously
  //    Use Promise.all with context.waitForEvent('page') and the click
  // YOUR CODE HERE

  // 2. Wait for the new tab to fully load
  //    Use newPage.waitForLoadState()
  // YOUR CODE HERE

  // 3. Assert the new page URL contains 'new'
  // YOUR CODE HERE

  // 4. Assert the new page has an h3 with text 'New Window'
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

test('interact with a new tab popup', async ({ page, context }) => {
  await page.goto('https://the-internet.herokuapp.com/windows');

  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    page.getByRole('link', { name: 'Click Here' }).click(),
  ]);

  await newPage.waitForLoadState();
  await expect(newPage).toHaveURL(/new/);
  await expect(newPage.locator('h3')).toHaveText('New Window');
});
```

---

### [Exercise] Full Shopping Cart User Journey
- **Difficulty:** Intermediate
- **Description:** Write a complete multi-step user journey that simulates a shopping flow: navigate to a store, find a product, add it to cart, and verify cart contents. Use a `test.describe` block with `beforeEach` setup.

```typescript
import { test, expect } from '@playwright/test';

test.describe('Shopping Cart Journey', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the demo store
    await page.goto('https://practicesoftwaretesting.com');
  });

  test('user can add a product to cart', async ({ page }) => {
    // 1. Click the first product card visible on the page
    // YOUR CODE HERE

    // 2. Click the 'Add to Cart' button on the product detail page
    // YOUR CODE HERE

    // 3. Navigate to the cart page
    // YOUR CODE HERE

    // 4. Assert the cart contains at least 1 item
    //    Check that cart items list is visible
    // YOUR CODE HERE
  });
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

test.describe('Shopping Cart Journey', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://practicesoftwaretesting.com');
  });

  test('user can add a product to cart', async ({ page }) => {
    await page.locator('.card').first().click();
    await page.getByRole('button', { name: 'Add to cart' }).click();
    await page.getByRole('link', { name: /cart/i }).click();
    await expect(page.locator('.cart-item, .product-title').first()).toBeVisible();
  });
});
```

---

### [Exercise] Form Validation Error Messages
- **Difficulty:** Intermediate
- **Description:** Test that a form correctly shows validation error messages when submitted empty, and that errors disappear once valid data is entered. This exercises the complete validation flow.

```typescript
import { test, expect } from '@playwright/test';

test('form shows validation errors on empty submit', async ({ page }) => {
  await page.goto('https://practice.expandtesting.com/login');

  // 1. Click the submit button without filling anything
  await page.click('button[type="submit"]');

  // 2. Assert that an error message is visible
  //    Locator: page.locator('.alert, .error, [role="alert"]')
  // YOUR CODE HERE

  // 3. Fill in valid credentials
  // YOUR CODE HERE

  // 4. Click submit again
  // YOUR CODE HERE

  // 5. Assert the URL changed to the secure page (no more error)
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

test('form shows validation errors on empty submit', async ({ page }) => {
  await page.goto('https://practice.expandtesting.com/login');

  await page.click('button[type="submit"]');
  await expect(page.locator('#flash')).toBeVisible();

  await page.fill('#username', 'practice');
  await page.fill('#password', 'SuperSecretPassword!');
  await page.click('button[type="submit"]');

  await expect(page).toHaveURL(/\/secure/);
});
```

---

### [Exercise] Viewport Responsive Breakpoint Testing
- **Difficulty:** Intermediate
- **Description:** Test the same page at three different viewport sizes to verify responsive behaviour. Assert that a navigation menu is visible at desktop size but hidden (replaced by a hamburger) at mobile size.

```typescript
import { test, expect } from '@playwright/test';

const viewports = [
  { name: 'Desktop', width: 1280, height: 720 },
  { name: 'Tablet', width: 768, height: 1024 },
  { name: 'Mobile', width: 375, height: 812 },
];

// 1. Loop over viewports
// 2. For each, create a test that:
//    - Sets the viewport size using page.setViewportSize()
//    - Navigates to 'https://playwright.dev'
//    - Takes a screenshot named after the viewport size
//    - Asserts the h1 heading is always visible regardless of viewport
// YOUR CODE HERE
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

const viewports = [
  { name: 'Desktop', width: 1280, height: 720 },
  { name: 'Tablet', width: 768, height: 1024 },
  { name: 'Mobile', width: 375, height: 812 },
];

for (const vp of viewports) {
  test(`playwright.dev is responsive on ${vp.name}`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto('https://playwright.dev');
    await page.screenshot({ path: `screenshots/${vp.name.toLowerCase()}.png` });
    await expect(page.locator('h1').first()).toBeVisible();
  });
}
```

---

### [Exercise] Complete E2E with Route Mocking and Validation
- **Difficulty:** Advanced
- **Description:** Write an advanced test that mocks a product listing API to return controlled test data, then validates that the UI renders the correct number of products with the right names.

```typescript
import { test, expect } from '@playwright/test';

const mockProducts = [
  { id: 1, name: 'Test Widget A', price: 9.99 },
  { id: 2, name: 'Test Widget B', price: 19.99 },
  { id: 3, name: 'Test Widget C', price: 29.99 },
];

test('renders mock product list correctly', async ({ page }) => {
  // 1. Set up route mock for '**/api/products**'
  //    Fulfill with JSON.stringify(mockProducts) and status 200
  // YOUR CODE HERE

  await page.goto('https://your-app.example.com/products');

  // 2. Assert that exactly 3 product cards are shown
  //    Use: toHaveCount(3)
  // YOUR CODE HERE

  // 3. Assert that 'Test Widget A' is visible on the page
  // YOUR CODE HERE

  // 4. Assert that 'Test Widget C' is visible on the page
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

const mockProducts = [
  { id: 1, name: 'Test Widget A', price: 9.99 },
  { id: 2, name: 'Test Widget B', price: 19.99 },
  { id: 3, name: 'Test Widget C', price: 29.99 },
];

test('renders mock product list correctly', async ({ page }) => {
  await page.route('**/api/products**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockProducts),
    });
  });

  await page.goto('https://your-app.example.com/products');

  await expect(page.locator('.product-card')).toHaveCount(3);
  await expect(page.getByText('Test Widget A')).toBeVisible();
  await expect(page.getByText('Test Widget C')).toBeVisible();
});
```

---

### [Exercise] Multi-Assertion Test with Soft Expects and Screenshot
- **Difficulty:** Advanced
- **Description:** Write a comprehensive page health check that uses `expect.soft()` to validate multiple UI elements in one pass, captures a full-page screenshot for evidence, and marks the test as slow with `test.slow()`.

```typescript
import { test, expect } from '@playwright/test';

test('full homepage health check', async ({ page }) => {
  // 1. Mark this test as slow() since it checks many elements
  // YOUR CODE HERE

  await page.goto('https://playwright.dev');

  // 2. Use expect.soft() to check: title contains 'Playwright'
  // YOUR CODE HERE

  // 3. Use expect.soft() to check: URL is 'https://playwright.dev/'
  // YOUR CODE HERE

  // 4. Use expect.soft() to check: h1 heading is visible
  // YOUR CODE HERE

  // 5. Use expect.soft() to check: 'Get started' link is visible
  // YOUR CODE HERE

  // 6. Use expect.soft() to check: 'Docs' link is visible
  // YOUR CODE HERE

  // 7. Take a fullPage screenshot saved to 'homepage-health.png'
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

test('full homepage health check', async ({ page }) => {
  test.slow();

  await page.goto('https://playwright.dev');

  await expect.soft(page).toHaveTitle(/Playwright/);
  await expect.soft(page).toHaveURL('https://playwright.dev/');
  await expect.soft(page.locator('h1').first()).toBeVisible();
  await expect.soft(page.getByRole('link', { name: 'Get started' })).toBeVisible();
  await expect.soft(page.getByRole('link', { name: 'Docs' })).toBeVisible();

  await page.screenshot({ path: 'homepage-health.png', fullPage: true });
});
```

---

## 🧠 More Flashcards

**Concept:** Infinite Scroll Testing
To test infinite scroll, use `page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))` to scroll to the bottom. Then wait for new content to appear with `expect(locator).toHaveCount(n)` where n is greater than the initial count.

**Concept:** Table Data Extraction
To assert table data, use `page.locator('table tr')` to get all rows, then `.nth(1)` for the first data row (skipping the header). Extract cell text with `locator.locator('td').nth(0).textContent()`. Build a typed array to assert in bulk.

**Concept:** Frame Handling (iframes)
Playwright uses `page.frameLocator('iframe')` to interact with content inside an iframe. Example: `const frame = page.frameLocator('#payment-iframe'); await frame.locator('#card-number').fill('4242')`. The frame locator is lazy — it doesn't need to load before you declare it.

**Concept:** Geolocation Mocking
Override the browser's geolocation API: `await context.setGeolocation({ latitude: 10.762622, longitude: 106.660172 })`. Grant location permission first: `await context.grantPermissions(['geolocation'])`. Useful for testing location-aware features.

**Term:** page.locator().filter({ hasText })
Narrows a locator to only elements containing specific text. `page.locator('.card').filter({ hasText: 'In Stock' })` returns only cards that contain "In Stock". Cleaner than writing complex CSS attribute selectors.

**Term:** page.locator().filter({ has })
`filter({ has: page.locator('button') })` narrows to elements that contain a specific child element. Combine with `hasText` for powerful contextual filtering without brittle CSS.

**Term:** locator.getByRole() (chained)
You can call `getByRole()` on a locator, not just on `page`. Example: `page.locator('nav').getByRole('link')` finds all links inside the nav. This is the preferred way to scope a search to a specific container.

**Concept:** Network Throttling
Use `page.context().setOffline(true)` to simulate offline mode and test your app's error handling. Use the CDP session for fine-grained throttling (e.g., 3G speed). Always restore online status in `afterEach`.

---

## 📝 More Quizzes

### How do you interact with content inside an iframe?
- [ ] `page.iframe('#id').locator('input')`
- [x] `page.frameLocator('#id').locator('input')`
- [ ] `page.switchToFrame('#id')` then `page.locator('input')`
- [ ] `page.locator('iframe input')` — CSS descends into iframes

### Which filter option narrows a locator by a child element?
- [ ] `filter({ contains: locator })`
- [x] `filter({ has: page.locator('button') })`
- [ ] `filter({ child: 'button' })`
- [ ] `filter({ within: locator })`

### How do you mock the browser's GPS location in Playwright?
- [ ] `page.setLocation({ lat, lng })`
- [x] `context.setGeolocation({ latitude, longitude })` after granting geolocation permission
- [ ] Pass `--geolocation` flag to Playwright CLI
- [ ] Set `navigator.geolocation` directly in page.evaluate()

### How do you simulate offline mode in Playwright?
- [ ] `page.setNetwork('offline')`
- [x] `await page.context().setOffline(true)`
- [ ] Disconnect from WiFi and run the test
- [ ] `page.route('**', route => route.abort())`

### What does `page.locator('.card').filter({ hasText: 'In Stock' })` do?
- [ ] Finds all elements with class 'card' and text 'In Stock' as a separate assertion
- [x] Returns only `.card` elements that contain the text 'In Stock'
- [ ] Filters the page DOM to hide elements not matching
- [ ] Adds a CSS class to matching elements

### How do you scope a `getByRole()` search to a specific container?
- [ ] You cannot scope getByRole to a container
- [ ] `page.getByRole('link', { within: 'nav' })`
- [x] `page.locator('nav').getByRole('link')`
- [ ] `page.getByRole('link').within('nav')`

### What is the correct order of steps to test geolocation?
- [ ] setGeolocation, then navigate, then grantPermissions
- [x] grantPermissions, then setGeolocation, then navigate
- [ ] navigate, then grantPermissions, then setGeolocation
- [ ] setGeolocation only — permissions are auto-granted

### How do you scroll to the bottom of a page in Playwright?
- [ ] `page.scroll('bottom')`
- [ ] `page.locator('body').scrollIntoView()`
- [x] `page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))`
- [ ] `page.keyboard.press('End')`

---

## 🏋️ More Coding Exercises

### [Exercise] Filter Locators by Text and Child Element
- **Difficulty:** Intermediate
- **Description:** Use `filter({ hasText })` and chained `getByRole()` to find specific items in a list without fragile CSS selectors.

```typescript
import { test, expect } from '@playwright/test';

test('filter locators by text content', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/tables');

  // 1. Get all table rows in the first table (locator: '#table1 tbody tr')
  // YOUR CODE HERE

  // 2. Filter rows to only those containing the text 'Smith'
  //    Use: .filter({ hasText: 'Smith' })
  // YOUR CODE HERE

  // 3. Assert the filtered row count is greater than 0
  // YOUR CODE HERE

  // 4. Assert the filtered row contains 'jsmith@example.com'
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

test('filter locators by text content', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/tables');

  const smithRows = page.locator('#table1 tbody tr').filter({ hasText: 'Smith' });
  const count = await smithRows.count();
  expect(count).toBeGreaterThan(0);
  await expect(smithRows.first()).toContainText('jsmith@example.com');
});
```

---

### [Exercise] Iframe Interaction
- **Difficulty:** Intermediate
- **Description:** Navigate to a page with an iframe and interact with form elements inside it using `page.frameLocator()`.

```typescript
import { test, expect } from '@playwright/test';

test('interact with content inside an iframe', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/iframe');

  // 1. Create a frameLocator for the iframe with id 'mce_0_ifr'
  //    const frame = page.frameLocator('#mce_0_ifr')
  // YOUR CODE HERE

  // 2. Clear the body element and type new text
  //    frame.locator('body#tinymce').click()
  //    await page.keyboard.press('Control+A')
  //    await page.keyboard.type('Hello Playwright!')
  // YOUR CODE HERE

  // 3. Assert the iframe body contains 'Hello Playwright!'
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

test('interact with content inside an iframe', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/iframe');

  const frame = page.frameLocator('#mce_0_ifr');
  await frame.locator('body#tinymce').click();
  await page.keyboard.press('Control+A');
  await page.keyboard.type('Hello Playwright!');

  await expect(frame.locator('body#tinymce')).toContainText('Hello Playwright!');
});
```

---

### [Exercise] Simulate Offline Mode
- **Difficulty:** Advanced
- **Description:** Set the browser context to offline mode, navigate to a page, and assert that the offline error state is shown. Then restore online mode and verify the page loads correctly.

```typescript
import { test, expect } from '@playwright/test';

test('app handles offline mode gracefully', async ({ page, context }) => {
  // 1. Set the context to offline mode
  //    await context.setOffline(true)
  // YOUR CODE HERE

  // 2. Try to navigate to 'https://playwright.dev' (it will fail)
  try {
    await page.goto('https://playwright.dev', { timeout: 5000 });
  } catch {
    // Expected to fail in offline mode
  }

  // 3. Restore online mode
  //    await context.setOffline(false)
  // YOUR CODE HERE

  // 4. Navigate again — this time it should succeed
  // YOUR CODE HERE

  // 5. Assert the page title is correct
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

test('app handles offline mode gracefully', async ({ page, context }) => {
  await context.setOffline(true);

  try {
    await page.goto('https://playwright.dev', { timeout: 5000 });
  } catch {
    // Expected — offline mode prevents navigation
  }

  await context.setOffline(false);
  await page.goto('https://playwright.dev');
  await expect(page).toHaveTitle(/Playwright/);
});
```

---

### [Exercise] Extract Table Data into Typed Array
- **Difficulty:** Advanced
- **Description:** Scrape all rows of an HTML table, extract cell values, build a typed data array, and assert specific records exist using array methods.

```typescript
import { test, expect } from '@playwright/test';

interface TableRow {
  lastName: string;
  firstName: string;
  email: string;
}

test('extract and assert table data', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/tables');

  const rows = await page.locator('#table1 tbody tr').all();

  // 1. Map over rows to extract lastName (td:nth-child(1)), firstName (nth-child(2)), email (nth-child(3))
  //    Use locator.textContent() to get cell values
  // YOUR CODE HERE - const tableData: TableRow[] = await Promise.all(rows.map(async (row) => {...}))

  // 2. Assert tableData has at least 4 entries
  // YOUR CODE HERE

  // 3. Assert at least one entry has lastName === 'Smith'
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

interface TableRow {
  lastName: string;
  firstName: string;
  email: string;
}

test('extract and assert table data', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/tables');
  const rows = await page.locator('#table1 tbody tr').all();

  const tableData: TableRow[] = await Promise.all(
    rows.map(async (row) => ({
      lastName:  (await row.locator('td:nth-child(1)').textContent()) ?? '',
      firstName: (await row.locator('td:nth-child(2)').textContent()) ?? '',
      email:     (await row.locator('td:nth-child(3)').textContent()) ?? '',
    }))
  );

  expect(tableData.length).toBeGreaterThanOrEqual(4);
  expect(tableData.some((r) => r.lastName === 'Smith')).toBe(true);
});
```

---

## 🧠 Flashcards — Batch 3

**Concept:** Drag and Drop with mouse API
For complex drag operations where `page.dragAndDrop()` doesn't work, use the low-level mouse API: `mouse.move(x, y)` → `mouse.down()` → `mouse.move(targetX, targetY)` → `mouse.up()`. Get coordinates with `locator.boundingBox()`.

**Concept:** page.waitForURL()
`await page.waitForURL('**/dashboard')` waits until the page URL matches a pattern. More semantic than `waitForNavigation()` (which is now deprecated). Use after clicks that trigger navigation — especially for SPAs that change the URL without a full page reload.

**Concept:** expect(locator).toHaveValues()
For multi-select `<select>` elements, `toHaveValues(['option1', 'option2'])` asserts multiple selected values simultaneously. Use with `locator.selectOption(['val1', 'val2'])` to select multiple options at once.

**Concept:** Keyboard Navigation Full Flow
A complete keyboard accessibility test: `page.keyboard.press('Tab')` to cycle through all interactive elements, `page.keyboard.press('Space')` to toggle checkboxes, `page.keyboard.press('Enter')` to activate buttons. Assert `toBeFocused()` at each step.

**Term:** locator.scrollIntoViewIfNeeded()
Scrolls an element into the visible viewport if it isn't already visible. Playwright actions do this automatically, but calling it explicitly is useful before taking element-level screenshots or before asserting CSS properties of off-screen elements.

**Term:** locator.dispatchEvent()
`await locator.dispatchEvent('click')` dispatches a DOM event directly, bypassing Playwright's actionability checks. Use for elements with custom event listeners that don't respond to normal Playwright interactions.

**Term:** page.locator(':visible')
The CSS pseudo-class `:visible` can be used in Playwright locators to filter to only visible elements: `page.locator('button:visible')`. Equivalent to adding `.filter()` with a visibility check.

**Concept:** HAR File Recording
`await context.routeFromHAR('recording.har')` replays network requests from a HAR file, making tests completely offline and reproducible. Record a HAR with `await context.recordHAR({ path: 'recording.har' })` during a test run.

---

## 📝 Quizzes — Batch 3

### What is `page.waitForURL()` used for?
- [ ] Setting the base URL for all navigation
- [x] Waiting until the current page URL matches a given pattern after navigation
- [ ] Asserting the URL has not changed
- [ ] Catching navigation errors

### What does `toHaveValues(['a', 'b'])` assert on a select element?
- [ ] The select has options 'a' and 'b' available
- [x] The multi-select element has 'a' and 'b' both currently selected
- [ ] The select's value attribute is 'a,b'
- [ ] The select contains exactly 2 options

### What does `locator.dispatchEvent('click')` do differently from `locator.click()`?
- [ ] It is slower
- [x] It dispatches the DOM event directly, bypassing Playwright's actionability checks
- [ ] It works only on buttons
- [ ] It triggers a double-click

### What is a HAR file used for in Playwright?
- [ ] Recording a video of the test
- [x] Recording and replaying network requests to make tests offline and reproducible
- [ ] Storing test results in a compressed format
- [ ] Archiving screenshots from multiple test runs

### What does `locator.scrollIntoViewIfNeeded()` do?
- [ ] Waits for the element to scroll into view on its own
- [x] Scrolls the element into the visible viewport if it isn't already visible
- [ ] Scrolls the page to the top
- [ ] Asserts the element is within the viewport

### For a complex drag operation where `page.dragAndDrop()` fails, what should you use?
- [ ] `locator.drag()` with custom options
- [x] The low-level mouse API: `mouse.move()` + `mouse.down()` + `mouse.move()` + `mouse.up()`
- [ ] `page.evaluate()` with jQuery drag calls
- [ ] `locator.trigger('dragstart')`

### What does `page.locator('button:visible')` do?
- [ ] Finds all buttons regardless of visibility
- [x] Finds only buttons that are currently visible in the DOM
- [ ] Finds buttons with a CSS `visibility: visible` inline style
- [ ] Selects the button with the highest z-index

### What is the correct way to select multiple options in a `<select multiple>` element?
- [ ] `locator.click()` while holding Ctrl
- [ ] `locator.selectOption()` called multiple times
- [x] `locator.selectOption(['value1', 'value2'])` with an array
- [ ] `page.fill(selector, 'value1,value2')`

---

## 🏋️ Coding Exercises — Batch 3

### [Exercise] Use waitForURL After Navigation
- **Difficulty:** Basic
- **Description:** Trigger a navigation action and use `page.waitForURL()` to explicitly wait for the URL to change to the expected pattern before making assertions.

```typescript
import { test, expect } from '@playwright/test';

test('waitForURL after clicking navigation link', async ({ page }) => {
  await page.goto('https://playwright.dev');

  // 1. Click the 'Get started' link
  // YOUR CODE HERE

  // 2. Use page.waitForURL('**/docs/intro') to wait for the URL to change
  // YOUR CODE HERE

  // 3. Assert the current URL contains '/docs/intro'
  // YOUR CODE HERE

  // 4. Assert the h1 heading is visible on the new page
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

test('waitForURL after clicking navigation link', async ({ page }) => {
  await page.goto('https://playwright.dev');
  await page.getByRole('link', { name: 'Get started' }).click();
  await page.waitForURL('**/docs/intro');

  await expect(page).toHaveURL(/\/docs\/intro/);
  await expect(page.locator('h1').first()).toBeVisible();
});
```

---

### [Exercise] Multi-Select Dropdown
- **Difficulty:** Intermediate
- **Description:** Navigate to a page with a multi-select dropdown, select multiple options at once, and assert both are selected using `toHaveValues()`.

```typescript
import { test, expect } from '@playwright/test';

test('select multiple options in a multi-select dropdown', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/dropdown');

  // Note: This dropdown is single-select. For a multi-select example:
  // Simulate selecting the single option by value and assert with toHaveValue()

  // 1. Select option '1' from the dropdown
  //    await page.selectOption('#dropdown', '1')
  // YOUR CODE HERE

  // 2. Assert the dropdown has value '1' using toHaveValue()
  // YOUR CODE HERE

  // 3. Select option '2' and assert again
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

test('select multiple options in a multi-select dropdown', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/dropdown');

  await page.selectOption('#dropdown', '1');
  await expect(page.locator('#dropdown')).toHaveValue('1');

  await page.selectOption('#dropdown', '2');
  await expect(page.locator('#dropdown')).toHaveValue('2');
});
```

---

### [Exercise] Scroll Element Into View and Screenshot
- **Difficulty:** Intermediate
- **Description:** Scroll an off-screen element into view using `scrollIntoViewIfNeeded()` and then take a targeted element screenshot to capture only that element.

```typescript
import { test, expect } from '@playwright/test';

test('scroll into view and screenshot element', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/infinite_scroll');

  // 1. Scroll to the bottom of the page using JavaScript
  //    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  // YOUR CODE HERE

  // 2. Find the last paragraph on the page
  //    const lastParagraph = page.locator('.jscroll-added').last()
  // YOUR CODE HERE

  // 3. Call scrollIntoViewIfNeeded() on the last paragraph
  // YOUR CODE HERE

  // 4. Assert the last paragraph is visible
  // YOUR CODE HERE

  // 5. Take an element-level screenshot
  //    await lastParagraph.screenshot({ path: 'last-paragraph.png' })
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

test('scroll into view and screenshot element', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/infinite_scroll');

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

  const lastParagraph = page.locator('.jscroll-added').last();
  await lastParagraph.scrollIntoViewIfNeeded();
  await expect(lastParagraph).toBeVisible();
  await lastParagraph.screenshot({ path: 'last-paragraph.png' });
});
```

---

### [Exercise] Complete Keyboard Accessibility Flow
- **Difficulty:** Advanced
- **Description:** Test a complete keyboard-driven user flow: Tab through all form fields in order, use Space to check a checkbox, and Enter to submit — without touching the mouse at all.

```typescript
import { test, expect } from '@playwright/test';

test('complete form using only keyboard', async ({ page }) => {
  await page.goto('https://practice.expandtesting.com/login');

  // 1. Focus the username field (first interactive element)
  await page.locator('#username').focus();

  // 2. Type the username using page.keyboard.type()
  // YOUR CODE HERE

  // 3. Press Tab to move to password field
  // YOUR CODE HERE

  // 4. Assert password field is focused
  // YOUR CODE HERE

  // 5. Type the password
  // YOUR CODE HERE

  // 6. Press Tab again to move to the submit button, then press Enter
  // YOUR CODE HERE

  // 7. Assert navigation to secure page
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

test('complete form using only keyboard', async ({ page }) => {
  await page.goto('https://practice.expandtesting.com/login');

  await page.locator('#username').focus();
  await page.keyboard.type('practice');

  await page.keyboard.press('Tab');
  await expect(page.locator('#password')).toBeFocused();

  await page.keyboard.type('SuperSecretPassword!');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');

  await expect(page).toHaveURL(/\/secure/);
});
```

---

## ðŸ§  Flashcards â€” Batch 4

**Concept:** Visual Regression Testing Workflow
1. First run: `npx playwright test` creates baseline screenshots in `__snapshots__/`. 2. Subsequent runs: Playwright diffs pixel-by-pixel against baseline. 3. To update baselines after intentional UI changes: `npx playwright test --update-snapshots`. Always commit baseline images to version control.

**Concept:** locator.screenshot()
`await locator.screenshot({ path: 'element.png' })` captures only the bounding box of a specific element. More precise than full-page screenshots for component-level visual regression. The element must be visible and in the viewport.

**Concept:** Accessibility Tree Snapshot
`await page.accessibility.snapshot()` returns the browser's accessibility tree as a JSON object. Use to assert ARIA roles, labels, and states. More comprehensive than individual `getByRole()` checks for full accessibility audits.

**Concept:** Multiple File Upload
To upload multiple files: `await page.locator('input[type=file]').setInputFiles(['file1.png', 'file2.pdf'])`. Pass an array of paths. After upload, assert the UI shows all uploaded file names in the confirmation list.

**Concept:** Drag and Drop with page.dragAndDrop()
`await page.dragAndDrop('#source', '#target')` drags element from source to target. Uses bounding box centers. If this doesn't work (custom drag logic), fall back to the mouse API: `mouse.move`, `mouse.down`, `mouse.move` to target, `mouse.up`.

**Term:** page.locator('text=...')
The `text=` prefix in Playwright locators is a legacy text selector. Prefer `page.getByText()` for new code. Both find elements by text content, but `getByText()` is more explicit about exact vs partial matching and has cleaner syntax.

**Term:** locator.boundingBox()
`await locator.boundingBox()` returns `{ x, y, width, height }` of the element relative to the viewport. Use for precise mouse operations (drag/drop, custom hover coordinates), or to assert an element is within a specific area of the page.

**Concept:** Responsive Design Testing
`await page.setViewportSize({ width: 375, height: 667 })` changes viewport mid-test. Combine with mobile user agent: `await context.newPage()` after setting `userAgent` in context options. Test breakpoints at 375px (mobile), 768px (tablet), 1280px (desktop).

---

## ðŸ“ Quizzes â€” Batch 4

### What does `locator.screenshot({ path: 'btn.png' })` capture?
- [ ] The full page including the element
- [x] Only the bounding box of the specific element
- [ ] A screenshot of the current viewport
- [ ] The element's shadow DOM

### What command regenerates Playwright visual snapshot baselines?
- [ ] `npx playwright test --reset-snapshots`
- [ ] `npx playwright test --regenerate`
- [x] `npx playwright test --update-snapshots`
- [ ] `npx playwright test --new-baseline`

### How do you upload multiple files in Playwright?
- [ ] Call `setInputFiles()` once per file
- [x] Pass an array of file paths to `locator.setInputFiles(['file1', 'file2'])`
- [ ] Use `page.uploadFiles(['file1', 'file2'])`
- [ ] Drag each file to the dropzone separately

### What does `locator.boundingBox()` return?
- [ ] A CSS string of the element's position
- [x] An object with x, y, width, height relative to the viewport
- [ ] The element's CSS box model values (margin, padding, border)
- [ ] A boolean indicating if the element is in the viewport

### What is `page.accessibility.snapshot()` used for?
- [ ] Taking a DOM snapshot for visual regression
- [x] Returning the browser accessibility tree as JSON for ARIA role/label assertions
- [ ] Checking if the page meets WCAG 2.1 AA standards
- [ ] Capturing keyboard navigation flow

### What viewpoint size simulates an iPhone SE?
- [ ] `{ width: 1280, height: 800 }`
- [x] `{ width: 375, height: 667 }`
- [ ] `{ width: 768, height: 1024 }`
- [ ] `{ width: 414, height: 896 }`

### What is the preferred modern alternative to `page.locator('text=Submit')`?
- [ ] `page.locator('[text="Submit"]')`
- [x] `page.getByText('Submit')`
- [ ] `page.locator(':text("Submit")')`
- [ ] `page.findText('Submit')`

### What does `page.dragAndDrop('#source', '#target')` do?
- [ ] Triggers dragstart on source and dragover on target
- [x] Performs a full drag-and-drop using bounding box centers of source and target
- [ ] Copies the content from source into target
- [ ] Moves the DOM element from source to target

---

## ðŸ‹ï¸ Coding Exercises â€” Batch 4

### [Exercise] Element-Level Screenshot Assertion
- **Difficulty:** Basic
- **Description:** Take a screenshot of a specific element and use `toMatchSnapshot()` for visual regression. On first run it creates the baseline; on subsequent runs it diffs.

```typescript
import { test, expect } from '@playwright/test';

test('header element matches visual snapshot', async ({ page }) => {
  await page.goto('https://playwright.dev');

  // 1. Get the header/nav element
  const header = page.locator('header').first();

  // 2. Assert it matches a snapshot named 'header.png'
  //    await expect(header).toHaveScreenshot('header.png')
  // YOUR CODE HERE

  // 3. Also assert the full page matches a snapshot
  //    await expect(page).toHaveScreenshot('full-page.png', { fullPage: true })
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

test('header element matches visual snapshot', async ({ page }) => {
  await page.goto('https://playwright.dev');

  const header = page.locator('header').first();
  await expect(header).toHaveScreenshot('header.png');
  await expect(page).toHaveScreenshot('full-page.png', { fullPage: true });
});
```

---

### [Exercise] Responsive Layout Testing at Multiple Breakpoints
- **Difficulty:** Intermediate
- **Description:** Test a page at three viewport sizes (mobile, tablet, desktop) in a single test using `page.setViewportSize()` to verify responsive layout changes.

```typescript
import { test, expect } from '@playwright/test';

const breakpoints = [
  { name: 'mobile',  width: 375,  height: 667 },
  { name: 'tablet',  width: 768,  height: 1024 },
  { name: 'desktop', width: 1280, height: 800 },
];

for (const { name, width, height } of breakpoints) {
  test(`layout at ${name} (${width}x${height})`, async ({ page }) => {
    // 1. Set viewport size
    // YOUR CODE HERE

    await page.goto('https://playwright.dev');

    // 2. Assert the page title is correct at this viewport
    // YOUR CODE HERE

    // 3. Assert the main h1 is visible
    // YOUR CODE HERE

    // 4. Take a screenshot named `playwright-${name}.png`
    // YOUR CODE HERE
  });
}
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

const breakpoints = [
  { name: 'mobile',  width: 375,  height: 667 },
  { name: 'tablet',  width: 768,  height: 1024 },
  { name: 'desktop', width: 1280, height: 800 },
];

for (const { name, width, height } of breakpoints) {
  test(`layout at ${name} (${width}x${height})`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.goto('https://playwright.dev');

    await expect(page).toHaveTitle(/Playwright/);
    await expect(page.locator('h1').first()).toBeVisible();
    await page.screenshot({ path: `playwright-${name}.png` });
  });
}
```

---

### [Exercise] Drag and Drop with API and Mouse Fallback
- **Difficulty:** Advanced
- **Description:** Attempt drag-and-drop using `page.dragAndDrop()` first. If the target state is not reached (due to custom JS), demonstrate the mouse API fallback approach.

```typescript
import { test, expect } from '@playwright/test';

test('drag and drop list item', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/drag_and_drop');

  const columnA = page.locator('#column-a');
  const columnB = page.locator('#column-b');

  // 1. Assert Column A header text is 'A' before drag
  await expect(columnA.locator('header')).toHaveText('A');

  // 2. Use page.dragAndDrop() to drag #column-a onto #column-b
  // YOUR CODE HERE

  // 3. Assert Column A header now shows 'B' (they swapped)
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

test('drag and drop list item', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/drag_and_drop');

  const columnA = page.locator('#column-a');
  const columnB = page.locator('#column-b');

  await expect(columnA.locator('header')).toHaveText('A');

  await page.dragAndDrop('#column-a', '#column-b');

  await expect(columnA.locator('header')).toHaveText('B');
});
```

---

### [Exercise] Get Element Position with boundingBox()
- **Difficulty:** Intermediate
- **Description:** Use `locator.boundingBox()` to get an element's position and assert it is in the expected area of the page (e.g., the nav is near the top).

```typescript
import { test, expect } from '@playwright/test';

test('navigation is at the top of the viewport', async ({ page }) => {
  await page.goto('https://playwright.dev');

  const nav = page.locator('nav').first();

  // 1. Get the bounding box of the nav element
  //    const box = await nav.boundingBox()
  // YOUR CODE HERE

  // 2. Assert box is not null
  // YOUR CODE HERE

  // 3. Assert box.y is less than 200 (nav is near the top)
  // YOUR CODE HERE

  // 4. Assert box.width is greater than 0
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

test('navigation is at the top of the viewport', async ({ page }) => {
  await page.goto('https://playwright.dev');

  const nav = page.locator('nav').first();
  const box = await nav.boundingBox();

  expect(box).not.toBeNull();
  expect(box!.y).toBeLessThan(200);
  expect(box!.width).toBeGreaterThan(0);
});
```
