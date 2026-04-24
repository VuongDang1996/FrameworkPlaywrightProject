# 04 — Commands and Cheat Sheet

All commands are run from the project root folder.

---

## Setup Commands

| Command | What It Does |
|---|---|
| `npm install` | Install all dependencies |
| `npm run install-browsers` | Download Playwright browsers (Chrome, Firefox, Safari) |
| `npm run type-check` | TypeScript compile check, no output files |
| `npm run lint` | Check code style |
| `npm run lint:fix` | Auto-fix code style issues |
| `npm run format` | Prettier format all test files |
| `npm run clean` | Delete all test output folders |

---

## Running Tests

### Run everything
```bash
npm test
```

### Run a specific file
```bash
npx playwright test tests/specs/automation-exercise/individual-tests/tc01-register-user.spec.ts
```

### Run by tag
```bash
npm run test:smoke         # all @smoke tests
npm run test:regression    # all @regression tests
```

### Run by browser
```bash
npm run test:chrome        # Chromium only
npm run test:firefox       # Firefox only
npm run test:safari        # WebKit (Safari) only
npm run test:mobile        # Mobile viewport
```

### Run with visual browser (headed)
```bash
npm run test:headed
```

### Run with Playwright UI mode (timeline, rerun individual tests)
```bash
npm run test:ui
```

### Run in step-by-step debug mode
```bash
npm run test:debug
```

### Run with multiple parallel workers
```bash
npm run test:parallel      # 4 workers
```

### Run individual tests folder (with Allure reporter)
```bash
npm run test:individual
npm run test:individual:chrome
```

### Run with grep pattern (multiple keywords)
```bash
npx playwright test --grep "TC01|TC02|TC03"
```

---

## Allure Report Commands

```bash
# Step 1: run tests to generate raw results
npm test

# Step 2: convert results to HTML report
npm run report:allure-generate

# Step 3: open the report in browser
npm run report:allure

# Or combine steps 2 and 3 manually:
npx allure generate allure-results --clean -o allure-report
npx allure open allure-report
```

### View built-in Playwright HTML report
```bash
npm run report
```

---

## Cucumber (BDD) Commands

```bash
npm run cucumber                    # Run all feature files
npm run cucumber:smoke              # @smoke tagged scenarios
npm run cucumber:products           # @products tagged scenarios
npm run cucumber:authentication     # @authentication tagged scenarios
npm run cucumber:report             # Generate Cucumber HTML report
```

---

## CI Commands (used in GitHub Actions)

```bash
npm run ci:test          # Run with GitHub reporter
npm run ci:individual    # Individual tests with line + Allure reporter
```

---

## Environment Variables

Set these in a `.env` file at the project root:

```env
BASE_URL=https://automationexercise.com
TEST_USERNAME=your-email@example.com
TEST_PASSWORD=yourpassword
```

If `.env` is missing, `playwright.config.ts` falls back to `https://automationexercise.com`.

---

## Quick Playwright Code Cheat Sheet

### Locators you will use most often

```ts
page.locator('css-selector')          // CSS selector
page.getByRole('button', { name: 'Submit' })   // by ARIA role
page.getByText('Welcome')             // by text content
page.getByLabel('Email')              // by label text
page.getByPlaceholder('Enter email')  // by placeholder
page.getByTestId('login-button')      // by data-testid attribute
page.locator('a[href="/login"]').first()  // first match
```

### Common actions

```ts
await locator.click();
await locator.fill('text');
await locator.selectOption('value');
await locator.check();
await locator.uncheck();
await locator.hover();
await locator.scrollIntoViewIfNeeded();
await page.goto('/path');
await page.keyboard.press('Enter');
```

### Wait strategies

```ts
await locator.waitFor({ state: 'visible' });
await locator.waitFor({ state: 'hidden' });
await page.waitForLoadState('networkidle');
await page.waitForURL(/dashboard/);
```

### Assertions

```ts
await expect(locator).toBeVisible();
await expect(locator).toBeHidden();
await expect(locator).toHaveText('Expected text');
await expect(locator).toContainText('partial');
await expect(locator).toHaveValue('field value');
await expect(page).toHaveURL(/expected-path/);
await expect(page).toHaveTitle(/Expected Title/);
await expect(locator).toBeEnabled();
await expect(locator).toBeDisabled();
await expect(locator).toHaveCount(3);
```

---

## File Naming Conventions

| Thing | Convention | Example |
|---|---|---|
| Test file | `tcXX-short-name.spec.ts` | `tc03-login-invalid.spec.ts` |
| Page object | `SiteName + PageName + Page.ts` | `AutomationExerciseCartPage.ts` |
| Component | `NameComponent.ts` | `NavigationComponent.ts` |
| Test data constant | `SCREAMING_SNAKE_CASE` | `VALID_USER_DATA` |
| Page method | `verbNoun()` | `searchProduct()` |

---

## Quick Troubleshooting

| Problem | Fix |
|---|---|
| `browser not found` | Run `npm run install-browsers` |
| `Type error` | Run `npm run type-check` to see exactly where |
| `Cannot find module @pages/...` | Check `tsconfig.json` paths and restart TS server |
| `Test times out` | Increase `actionTimeout` in `playwright.config.ts` or fix the locator |
| `Allure report empty` | Make sure you ran tests with `--reporter=allure-playwright` |
| `Element not found` | Check if selector changed; use `--headed` mode to see the page |
| `Flaky test` | Replace `page.waitForTimeout(...)` with `locator.waitFor(...)` |

