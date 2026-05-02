# Module 18: Accessibility Testing (a11y)

Accessibility (a11y) testing ensures your application is usable by people with disabilities (e.g., screen readers, keyboard-only navigation). Playwright officially integrates with `@axe-core/playwright`, an industry-standard accessibility testing engine, allowing you to catch accessibility violations directly in your E2E tests.

---

## 🧠 Flashcards

**Concept:** `@axe-core/playwright` package
This is the official Playwright integration for Axe. It requires installation (`npm install -D @axe-core/playwright`) and provides the `AxeBuilder` class to analyze pages for accessibility issues.

**Concept:** AxeBuilder().analyze()
`const results = await new AxeBuilder({ page }).analyze()` runs the Axe engine against the current page state. It returns a results object containing arrays of `violations`, `passes`, `incomplete`, and `inapplicable` rules.

**Concept:** Asserting no violations
After running `.analyze()`, the standard assertion is `expect(results.violations).toEqual([])`. If the array is not empty, Playwright will print a detailed diff showing exactly which HTML elements violated which WCAG rules.

**Concept:** AxeBuilder().include()
You don't always have to scan the entire page. Use `new AxeBuilder({ page }).include('#main-content').analyze()` to restrict the accessibility scan to a specific section of the DOM (like a newly added component).

**Concept:** AxeBuilder().exclude()
If a specific third-party widget (like a chat bubble) consistently fails a11y checks and you can't fix it, you can exclude it from the scan: `new AxeBuilder({ page }).exclude('#chat-widget').analyze()`.

**Concept:** AxeBuilder().withTags()
By default, Axe runs a wide range of rules. You can limit the scan to specific WCAG standards (e.g., WCAG 2.1 AA) using tags: `new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()`.

**Concept:** AxeBuilder().disableRules()
If you want to run the full suite but ignore a specific rule (e.g., color contrast because the design team hasn't fixed it yet), use `.disableRules(['color-contrast'])`.

**Concept:** Accessibility Test Snapshots
Instead of just asserting `toEqual([])`, you can use Playwright's snapshot testing to track violations over time: `expect(violationFingerprints).toMatchSnapshot()`. This is useful when you have existing legacy violations that you can't fix immediately but want to prevent *new* ones.

---

## 📝 Quizzes

### What package must be installed to run Axe accessibility tests in Playwright?
- [ ] `@playwright/accessibility`
- [x] `@axe-core/playwright`
- [ ] `axe-playwright-plugin`
- [ ] `@axe-core/cli`

### What does `new AxeBuilder({ page }).analyze()` return?
- [ ] A boolean indicating pass or fail
- [x] An object containing arrays of violations, passes, and incomplete rules
- [ ] A PDF report of accessibility issues
- [ ] An array of DOM elements with bad contrast

### How do you assert that a page has no accessibility violations?
- [ ] `expect(page).toBeAccessible()`
- [ ] `expect(results).toPassAxe()`
- [x] `expect(results.violations).toEqual([])`
- [ ] `expect(results.errors).toBe(0)`

### How do you prevent Axe from scanning a specific third-party iframe?
- [x] `new AxeBuilder({ page }).exclude('iframe').analyze()`
- [ ] `new AxeBuilder({ page }).ignore('iframe').analyze()`
- [ ] Hide the iframe using CSS before testing
- [ ] `page.route('**/*', route => route.abort())`

### How do you restrict the Axe scan to only WCAG 2.0 Level AA rules?
- [ ] `.withRules('wcag2aa')`
- [ ] `.filter('wcag2aa')`
- [x] `.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])`
- [ ] `.setStandard('WCAG2AA')`

---

## 🏋️ Coding Exercises

### [Exercise] Basic Page Accessibility Scan
- **Difficulty:** Basic
- **Description:** Navigate to a page, run an Axe accessibility scan on the entire document, and assert that there are no violations.

```typescript
import { test, expect } from '@playwright/test';
// Note: Requires npm i -D @axe-core/playwright
import AxeBuilder from '@axe-core/playwright';

test('Page should not have automatically detectable accessibility issues', async ({ page }) => {
  await page.goto('https://playwright.dev');

  // 1. Initialize AxeBuilder with the page and call analyze()
  //    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
  // YOUR CODE HERE

  // 2. Assert that the violations array is empty
  //    expect(accessibilityScanResults.violations).toEqual([]);
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('Page should not have automatically detectable accessibility issues', async ({ page }) => {
  await page.goto('https://playwright.dev');

  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});
```

---

### [Exercise] Exclude Elements from Accessibility Scan
- **Difficulty:** Intermediate
- **Description:** Run an accessibility scan, but exclude the site's navigation bar (`nav`) because you know it contains legacy issues that are currently being tracked in a separate ticket.

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('Scan page excluding navigation bar', async ({ page }) => {
  await page.goto('https://playwright.dev');

  // 1. Run AxeBuilder, but chain .exclude('nav') before .analyze()
  // YOUR CODE HERE

  // 2. Assert violations array is empty
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('Scan page excluding navigation bar', async ({ page }) => {
  await page.goto('https://playwright.dev');

  const accessibilityScanResults = await new AxeBuilder({ page })
    .exclude('nav')
    .analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});
```

---

### [Exercise] Scan Specific Component and Disable Rules
- **Difficulty:** Advanced
- **Description:** Instead of the whole page, scan only the main content area (`main`). Also, explicitly disable the `color-contrast` rule because the marketing team dictates the current colors.

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('Scan specific component and ignore color contrast', async ({ page }) => {
  await page.goto('https://playwright.dev');

  // 1. Run AxeBuilder using .include('main') and .disableRules(['color-contrast'])
  // YOUR CODE HERE

  // 2. Assert violations array is empty
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('Scan specific component and ignore color contrast', async ({ page }) => {
  await page.goto('https://playwright.dev');

  const accessibilityScanResults = await new AxeBuilder({ page })
    .include('main')
    .disableRules(['color-contrast'])
    .analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});
```
