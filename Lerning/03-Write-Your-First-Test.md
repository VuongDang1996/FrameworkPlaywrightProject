# 03 — Write Your First Test Step by Step

## Before You Start

Make sure you have completed setup:

```bash
npm install
npm run install-browsers
```

Try running an existing test to confirm everything works:

```bash
npx playwright test tests/specs/automation-exercise/individual-tests/tc02-login-user-correct.spec.ts
```

If the test runs (even if it fails due to data issues), the setup is correct.

---

## Step 1 — Understand an Existing Test First

Open `tests/specs/automation-exercise/individual-tests/tc02-login-user-correct.spec.ts`.

Key things to notice:

```ts
// 1. Import test from the CUSTOM fixtures file (not from @playwright/test)
import { test } from '@fixtures/automation-exercise-fixtures';
// 2. Import expect SEPARATELY — always from '@playwright/test'
import { expect } from '@playwright/test';

test('TC02 - Login User with Correct Credentials @smoke', async ({
  // 2. Page objects are injected by name — no 'new' keyword needed
  homePage,
  loginPage,
}) => {
  // 3. Test uses page object methods, not raw Playwright calls
  await homePage.navigateTo();
  // ...
});
```

Notice you never write `const page = context.newPage()` or `new AutomationExerciseHomePage(page)`.
The fixture handles all of that.

---

## Step 2 — Create Your Test File

Create a new file in `tests/specs/automation-exercise/individual-tests/`:

**File name:** `tc-learn-home-page.spec.ts`

```ts
import { test } from '@fixtures/automation-exercise-fixtures';
import { expect } from '@playwright/test';

test.describe('Learning Test: Home Page', () => {

  test('home page loads and shows logo @smoke', async ({ homePage }) => {
    // Navigate to the home page
    await homePage.navigateTo();

    // Assert the page title contains "Automation Exercise"
    await expect(homePage.page).toHaveTitle(/Automation Exercise/i);
  });

  test('home page has products section @smoke', async ({ homePage }) => {
    await homePage.navigateTo();

    // Assert the features/products section is visible
    await expect(homePage.featuresItems).toBeVisible();
  });

});
```

---

## Step 3 — Run Your Test

Run only your new test:

```bash
npx playwright test tests/specs/automation-exercise/individual-tests/tc-learn-home-page.spec.ts
```

Run in headed mode to see the browser:

```bash
npx playwright test tests/specs/automation-exercise/individual-tests/tc-learn-home-page.spec.ts --headed
```

Expected output:
```
✓  home page loads and shows logo (1.5s)
✓  home page has products section (1.2s)

2 passed
```

---

## Step 4 — Add a Multi-Page Scenario

Now let's exercise the navigation + login flow:

```ts
test('navigate to login page and see login form @regression', async ({
  homePage,
  loginPage,
}) => {
  // 1. Start at home page
  await homePage.navigateTo();

  // 2. Click the login link
  await homePage.signupLoginLink.click();

  // 3. Confirm we are on the login page
  await expect(loginPage.page).toHaveURL(/login/);
});
```

Key point: `homePage.signupLoginLink` is a locator declared in `AutomationExerciseHomePage.ts`.
It is accessed as a property, then Playwright clicks it. You never write the raw CSS selector.

---

## Step 5 — Use Test Data

Instead of hardcoding strings, use the data file:

```ts
import { test } from '@fixtures/automation-exercise-fixtures';
import { expect } from '@playwright/test';
import { TEST_USERS } from '@data/automation-exercise-data';

test('login with typed data object @regression', async ({
  homePage,
  loginPage,
}) => {
  // TEST_USERS.VALID_USER already has real email + password
  await homePage.navigateTo();
  await homePage.clickSignupLogin();
  await loginPage.loginUser(
    TEST_USERS.VALID_USER.email,
    TEST_USERS.VALID_USER.password
  );
});
```

This approach:
- Makes test data centrally manageable
- TypeScript enforces all required fields
- Easy to swap test environments

---

## Step 6 — Add Allure Metadata

Decorate your test with Allure labels for rich reports:

```ts
import { test } from '@fixtures/automation-exercise-fixtures';
import { expect } from '@playwright/test';
import { AllureHelpers, AutomationExerciseTestData } from '@utils/allure-helpers';

test('verify subscription functionality @regression', async ({ homePage }) => {
  // Use the pre-defined constants from AutomationExerciseTestData
  AllureHelpers.addEpic(AutomationExerciseTestData.epic);
  AllureHelpers.addFeature(AutomationExerciseTestData.features.newsletter);
  AllureHelpers.addStory(AutomationExerciseTestData.stories.subscription);
  AllureHelpers.addSeverity('normal');
  AllureHelpers.addOwner('QA Team');
  AllureHelpers.addTestId('TC-LEARN-01');

  await homePage.navigateTo();

  // NOTE: use AllureHelpers.step() — NOT addStep()
  await AllureHelpers.step('Subscribe with valid email', async () => {
    await homePage.subscribeToNewsletter('learn@example.com');
  });

  await expect(homePage.subscriptionSuccessMessage).toBeVisible();
});
```

After the run use `npm run report:allure-generate && npm run report:allure` to see it in the report.

---

## Step 7 — Add a Missing Page Method

If you need an action that does not yet exist in a page object, add it there.

Example: say you want `homePage.clickProductsLink()` but it does not exist.

Open `tests/pages/AutomationExerciseHomePage.ts` and add:

```ts
async clickProductsLink(): Promise<void> {
  await this.productsLink.click();
}
```

Then use it in your test:

```ts
await homePage.clickProductsLink();
```

This keeps the locator (`productsLink`) inside the page class.

---

## Full Template — Copy and Use

```ts
import { test } from '@fixtures/automation-exercise-fixtures';
import { expect } from '@playwright/test';
import { AllureHelpers, AutomationExerciseTestData } from '@utils/allure-helpers';
import { TEST_USERS } from '@data/automation-exercise-data';

test.describe('My Feature Name', () => {

  test.beforeEach(async ({ homePage }) => {
    await homePage.navigateTo();
  });

  test('TC-XXX - Scenario description @tag', async ({
    homePage,
    // add more page objects as needed
  }) => {
    AllureHelpers.addEpic(AutomationExerciseTestData.epic);
    AllureHelpers.addFeature(AutomationExerciseTestData.features.navigation);
    AllureHelpers.addStory(AutomationExerciseTestData.stories.pageNavigation);
    AllureHelpers.addSeverity('normal');
    AllureHelpers.addOwner('QA Team');
    AllureHelpers.addTestId('TC-XXX');

    await AllureHelpers.step('Navigate to home page', async () => {
      await homePage.navigateTo();
    });

    // Write your test steps here using page object methods

    // Assertions
    await expect(homePage.page).toHaveTitle(/Automation Exercise/i);
  });

});
```

---

## Definition of Done for a New Test

- [ ] File named `tcXX-short-scenario.spec.ts`
- [ ] Imports `test` and `expect` from the fixtures file
- [ ] Uses only page object methods (no raw `page.locator()` in spec)
- [ ] Has Allure metadata (Epic, Feature, Story, Severity)
- [ ] Passes at least 2 consecutive local runs
- [ ] Test name includes a tag (`@smoke` or `@regression`)
- [ ] Produces a clear failure message when an assertion fails

