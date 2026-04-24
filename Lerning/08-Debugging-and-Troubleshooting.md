# 08 — Debugging and Troubleshooting

## The Debugging Toolkit

Playwright provides several tools. Use the right one for the situation.

| Tool | When to Use | Command |
|---|---|---|
| **Headed mode** | See what the browser is doing | `npm run test:headed` |
| **UI mode** | Interactive test runner + timeline | `npm run test:ui` |
| **Debug mode** | Step through test line by line | `npm run test:debug` |
| **Trace viewer** | Review what happened after a failure | Automatic on failure |
| **Screenshots** | Capture page state | Automatic on failure |
| `console.log` | Quick variable inspection | In your test code |

---

## Headed Mode

Run tests with a visible browser window:

```bash
npm run test:headed
```

Or for a single file:
```bash
npx playwright test tc01-register-user.spec.ts --headed
```

You will see exactly what Playwright sees — useful when tests fail due to unexpected UI.

---

## UI Mode (Most Useful for Development)

```bash
npm run test:ui
```

UI mode opens a VS Code-style panel in your browser where you can:

- Re-run individual tests with one click
- Watch the test run in slow motion
- See each step with before/after DOM snapshots
- Filter tests by name or status
- See the call tree for every action

---

## Debug Mode — Step Through Line by Line

```bash
npm run test:debug
```

This opens the **Playwright Inspector**:
- Pause button to stop execution
- Step button to go line by line
- DOM explorer on the right
- Log of all actions

Add a `page.pause()` in your test to stop at a specific point:

```ts
test('my test', async ({ homePage }) => {
  await homePage.navigateTo();
  await page.pause();   // ← execution stops here and Inspector opens
  await homePage.signupLoginLink.click();
});
```

**Remember:** Remove `page.pause()` before committing.

---

## Trace Viewer — Replay What Happened

When a test fails in CI or locally, Playwright saves a trace file.
Open it with:

```bash
npx playwright show-trace test-results/[test-name]/trace.zip
```

The trace viewer shows:
- Timeline of all actions
- Screenshots before AND after each action
- Network requests made
- Console log output
- DOM snapshots at every step

This is the most powerful debugging tool for failures you cannot reproduce locally.

Trace recording is configured in `playwright.config.ts`:
```ts
trace: 'on-first-retry',   // records trace only when test is retried
```

Change to `'on'` if you always want traces:
```ts
trace: 'on',
```

---

## Screenshots and Videos

Also configured in `playwright.config.ts`:

```ts
screenshot: 'only-on-failure',   // screenshot when test fails
video: 'retain-on-failure',      // video when test fails
```

After a failing test, look in:
```
test-results/[test-name]-[browser]/
  ├── screenshot.png
  └── video.webm
```

---

## Common Errors and Fixes

### 1. Element not found / Timeout

```
Error: locator.click: Timeout 30000ms exceeded
```

**Causes and fixes:**
- Wrong selector → use `--headed` mode to inspect actual HTML
- Element is hidden by popup/modal → close it first in your test
- Page not fully loaded → use `waitForPageReady()` or a suitable locator wait

```ts
// Add explicit wait for element
await locator.waitFor({ state: 'visible', timeout: 10000 });
await locator.click();
```

---

### 2. Element not interactable

```
Error: element is not visible / not enabled
```

**Cause:** Playwright found the element but it is covered or disabled.

**Fix:**
```ts
await locator.scrollIntoViewIfNeeded();  // scroll to make it visible
await locator.click();
```

---

### 3. Multiple elements matched

```
Error: strict mode violation: locator('button') resolved to 3 elements
```

**Fix:** Be more specific:
```ts
// Add context
page.locator('.login-form button')

// Or use filter
page.locator('button').filter({ hasText: 'Submit' })

// Or use nth
page.locator('button').first()
```

---

### 4. Navigation timeout

```
Error: page.goto: Navigation timeout of 60000ms exceeded
```

**Causes and fixes:**
- Slow network → increase `navigationTimeout` in config
- Page redirects → check correct URL
- Site is down → confirm the site is accessible

```ts
// In playwright.config.ts
navigationTimeout: 90 * 1000,  // increase to 90 seconds
```

---

### 5. TypeScript path alias not resolved

```
Error: Cannot find module '@pages/AutomationExerciseHomePage'
```

**Fix:** Check `tsconfig.json` has the `paths` section:
```json
{
  "compilerOptions": {
    "paths": {
      "@pages/*": ["tests/pages/*"],
      "@fixtures/*": ["tests/fixtures/*"],
      "@data/*": ["tests/data/*"],
      "@utils/*": ["tests/utils/*"],
      "@components/*": ["tests/pages/components/*"]
    }
  }
}
```

If paths exist, restart the TypeScript server in VS Code: `Ctrl+Shift+P` → "Restart TS Server".

---

### 6. Allure report is empty

```
No tests found in allure-results/
```

**Fix:** Make sure you ran tests with the Allure reporter:
```bash
npx playwright test --reporter=allure-playwright
# or:
npm run test:individual
```

Then regenerate:
```bash
npm run report:allure-generate
```

---

### 7. Flaky test (sometimes passes, sometimes fails)

**Common causes:**
- Hard-coded `waitForTimeout(2000)` — replace with smart wait
- Race condition — element appears after an animation
- Different timing on CI vs local

**Fix pattern:**
```ts
// BAD (time-based: might be too short or waste time)
await page.waitForTimeout(2000);

// GOOD (event-based: waits exactly as long as needed)
await locator.waitFor({ state: 'visible' });
await page.waitForLoadState('networkidle');
await page.waitForURL(/expected-path/);
```

---

## Playwright VS Code Extension

Install the official **Playwright Test for VS Code** extension for:
- Run/debug individual tests from the editor gutter
- See inline test status
- Pick a locator interactively from within the browser
- Generate locators by clicking elements

---

## Useful `console.log` Patterns

Quick diagnostics during test development:

```ts
// Log current URL
console.log('Current URL:', page.url());

// Log page title
console.log('Title:', await page.title());

// Log element text
console.log('Button text:', await button.textContent());

// Log element count
console.log('Products visible:', await page.locator('.product-item').count());
```

Remove all console.log before committing to avoid noisy CI output.

---

## Quick Checklist When a Test Fails

1. Read the error message fully — it usually tells you the locator and what was expected
2. Run in `--headed` mode to see what the browser shows
3. Check the screenshot in `test-results/`
4. If it passed before, check what changed (selector? test data? config?)
5. Add `await page.pause()` to stop at the failing step and inspect the DOM
6. Use trace viewer if failure happened on CI
7. Verify there are no hard sleeps in the code path
