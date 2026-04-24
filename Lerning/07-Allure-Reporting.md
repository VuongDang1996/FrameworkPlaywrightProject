# 07 — Allure Reporting

## What Is Allure?

Allure is a test reporting framework that transforms your test results into
a rich, interactive HTML dashboard with:

- Pass/fail/skip summary
- Step-by-step execution trace per test
- Screenshots captured on failure
- Test history and trends across multiple runs
- Categories (retried, broken, failed)
- Test metadata: Epic, Feature, Story classification

---

## How It Fits Into This Project

```
Test runs (npm test)
    ↓
allure-results/          ← raw JSON files per test
    ↓
npm run report:allure-generate
    ↓
allure-report/           ← generated HTML files
    ↓
npm run report:allure
    ↓
Browser opens the interactive report
```

---

## Configuration

**File:** `playwright.config.ts`

The Allure reporter is registered here:

```ts
reporter: [
  ['html', { outputFolder: 'playwright-report' }],   // Playwright HTML report
  ['allure-playwright', {
    outputFolder: 'allure-results',   // raw results go here
    suiteTitle: true,
    links: [
      {
        type: 'issue',
        urlTemplate: 'https://github.com/your-repo/issues/%s',
        nameTemplate: 'Issue #%s'
      },
      {
        type: 'tms',
        urlTemplate: 'https://your-tms.com/testcase/%s',
        nameTemplate: 'Test Case %s'
      }
    ]
  }],
]
```

To use Allure reporter when running tests:

```bash
npx playwright test --reporter=allure-playwright
# or use the provided npm scripts:
npm run test:individual
npm run test:allure
```

---

## The AllureHelpers Class

**File:** `tests/utils/allure-helpers.ts`

This helper class wraps the Allure API in a clean, type-safe interface.
Use it at the start of every test to enrich your reports.

```ts
import { AllureHelpers } from '@utils/allure-helpers';

test('TC01 - Register User @smoke', async ({ homePage, loginPage, signupPage }) => {

  // Classification labels
  AllureHelpers.addEpic('Automation Exercise Testing');   // top-level grouping
  AllureHelpers.addFeature('Authentication');              // feature area
  AllureHelpers.addStory('User Registration');             // scenario name
  AllureHelpers.addSeverity('critical');                   // blocker | critical | normal | minor | trivial
  AllureHelpers.addTag('smoke');                           // freeform tag
  AllureHelpers.addTestId('TC01');                         // test case ID

  // Link to issue tracker or TMS
  AllureHelpers.addIssue('123');          // links to github issue #123
  AllureHelpers.addTmsLink('TC01');       // links to test management system

  // Describe the test
  AllureHelpers.addDescription('Verify that a new user can successfully register an account.');

  // ... your test steps
});
```

---

## Adding Named Steps

Wrap logical steps in `AllureHelpers.step()` to see them as individual entries in the report:

> **Important:** The method is `.step()` — NOT `.addStep()`. The source file is `tests/utils/allure-helpers.ts`.

```ts
test('TC01 - Register User @smoke', async ({ homePage, signupPage }) => {
  AllureHelpers.addEpic(AutomationExerciseTestData.epic);
  AllureHelpers.addFeature(AutomationExerciseTestData.features.authentication);

  await AllureHelpers.step('Navigate to home page', async () => {
    await homePage.navigateTo();
  });

  await AllureHelpers.step('Click Signup/Login link', async () => {
    await homePage.clickSignupLogin();
  });

  await AllureHelpers.step('Fill registration form', async () => {
    await signupPage.fillRegistrationForm(SAMPLE_REGISTRATION_DATA);
  });

  await AllureHelpers.step('Verify account created message', async () => {
    await expect(signupPage.accountCreatedMessage).toBeVisible();
  });
});
```

In the Allure report, each step appears in a collapsible tree with its own pass/fail status.

---

## AutomationExerciseTestData — Consistent Labels

**File:** `tests/utils/allure-helpers.ts`

Instead of typing Epic/Feature/Story strings manually, **all 26 tests use a shared constants object**:

```ts
import { AllureHelpers, AutomationExerciseTestData } from '@utils/allure-helpers';

// At the top of every test:
AllureHelpers.addEpic(AutomationExerciseTestData.epic);
// => 'Automation Exercise E2E Testing'

AllureHelpers.addFeature(AutomationExerciseTestData.features.authentication);
// Available features:
// .authentication  .userManagement  .productCatalog  .shoppingCart
// .checkout  .contactUs  .navigation  .newsletter

AllureHelpers.addStory(AutomationExerciseTestData.stories.login);
// Available stories:
// .registration  .login  .logout  .productBrowsing  .productSearch
// .cartManagement  .orderPlacement  .contactForm  .subscription
// .reviews  .pageNavigation
```

Why use constants?
- Prevents typos creating orphan groups in the report
- All tests with `features.authentication` appear together in the **Behaviors** tab
- One change to the constant updates all tests instantly

---

## Adding Parameters to Reports

Log the values used in a test so the report shows exact data:

```ts
AllureHelpers.addParameter('Email', userData.email);
AllureHelpers.addParameter('Browser', 'chromium');
AllureHelpers.addParameter('Environment', 'https://automationexercise.com');
```

This makes debugging much easier — you can see exactly what was tested.

---

## Attaching Screenshots Manually

Playwright auto-captures screenshots on failure. For important steps you can add them manually:

```ts
await AllureHelpers.attachScreenshot(page, 'After Login');
// or
const screenshot = await page.screenshot();
await allure.attachment('Page State', screenshot, 'image/png');
```

---

## Severity Levels

| Level | When to Use |
|---|---|
| `blocker` | Test can't run at all without this working |
| `critical` | Core user journey — must never fail in production |
| `normal` | Important but not critical |
| `minor` | Non-critical edge case or cosmetic issue |
| `trivial` | Negligible impact on user experience |

---

## Complete Workflow — Generate and View Report

```bash
# 1. Run tests with Allure reporter
npm run test:individual

# 2. Generate the HTML report from raw results
npm run report:allure-generate

# 3. Open the report in your browser
npm run report:allure
```

Or skip step 3 and just open `allure-report/index.html` directly in a browser.

---

## Understanding the Report UI

When the Allure report opens, you will see tabs:

| Tab | What It Shows |
|---|---|
| **Overview** | Total pass/fail/skip counts, trend chart, recent runs |
| **Categories** | Tests grouped by failure type (Product Defects, Test Defects, etc.) |
| **Suites** | Tests organized by spec file and describe block |
| **Graphs** | Visual charts — severity breakdown, status distribution |
| **Timeline** | Which tests ran on which worker and when |
| **Behaviors** | Grouped by Epic → Feature → Story hierarchy |
| **Packages** | Grouped by file path structure |

Click any test to see:
- Full step trace
- Screenshots
- Parameters
- Attachments
- History (which previous runs passed/failed)

---

## Allure in GitHub Actions (CI)

The `.github/workflows/individual-tests.yml` workflow:

1. Runs all tests on GitHub's servers
2. Generates the Allure report
3. Publishes it to **GitHub Pages** (a public or private URL)
4. Saves screenshots/videos as build artifacts

After each CI run you can see the live Allure report at your GitHub Pages URL.

---

## Quick Reference

| Helper | Example |
|---|---|
| `addEpic(name)` | `AllureHelpers.addEpic('Automation Exercise')` |
| `addFeature(name)` | `AllureHelpers.addFeature('Cart')` |
| `addStory(name)` | `AllureHelpers.addStory('Add product')` |
| `addSeverity(level)` | `AllureHelpers.addSeverity('critical')` |
| `addTag(tag)` | `AllureHelpers.addTag('regression')` |
| `addTestId(id)` | `AllureHelpers.addTestId('TC12')` |
| `addDescription(text)` | `AllureHelpers.addDescription('...')` |
| `addOwner(name)` | `AllureHelpers.addOwner('QA Team')` |
| `addParameter(key, val)` | `AllureHelpers.addParameter('Email', email)` |
| `step(name, fn)` | `await AllureHelpers.step('Click Login', async () => {...})` |
