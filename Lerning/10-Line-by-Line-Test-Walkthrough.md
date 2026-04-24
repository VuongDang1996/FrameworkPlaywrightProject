# 10 — Line-by-Line Test Walkthrough (TC02)

This file walks through every single line of `tc02-login-user-correct.spec.ts`
and explains **what it does**, **why it is there**, and **where it comes from**.

Reading this file will make every other test in the project feel familiar.

---

## The Complete Test (Reference)

```ts
import { test } from '@fixtures/automation-exercise-fixtures';
import { expect } from '@playwright/test';
import { TEST_USERS } from '@data/automation-exercise-data';
import { AllureHelpers, AutomationExerciseTestData } from '@utils/allure-helpers';

test.describe('TC02 - Login User with Correct Email and Password', () => {
  test('TC02 - Login User with Correct Email and Password @smoke', async ({ 
    homePage, 
    loginPage 
  }) => {
    AllureHelpers.addEpic(AutomationExerciseTestData.epic);
    AllureHelpers.addFeature(AutomationExerciseTestData.features.authentication);
    AllureHelpers.addStory(AutomationExerciseTestData.stories.login);
    AllureHelpers.addSeverity('critical');
    AllureHelpers.addOwner('QA Team');
    AllureHelpers.addTestId('TC02');
    AllureHelpers.addDescription('Verify user can login with correct email and password');
    AllureHelpers.addTag('smoke');
    AllureHelpers.addTag('authentication');
    AllureHelpers.addParameter('User Email', TEST_USERS.VALID_USER.email);

    await AllureHelpers.step('Navigate to home page', async () => {
      await homePage.navigateTo();
    });

    await AllureHelpers.step('Verify home page is visible', async () => {
      await expect(homePage.homePageCarousel).toBeVisible();
    });

    await AllureHelpers.step('Navigate to login page', async () => {
      await homePage.clickSignupLogin();
    });

    await AllureHelpers.step('Verify login form is visible', async () => {
      await expect(loginPage.loginToAccountTitle).toBeVisible();
    });

    await AllureHelpers.step('Enter login credentials', async () => {
      await loginPage.loginUser(TEST_USERS.VALID_USER.email, TEST_USERS.VALID_USER.password);
    });

    await AllureHelpers.step('Verify user is logged in', async () => {
      await expect(homePage.loggedInAsUser).toBeVisible();
    });

    await AllureHelpers.step('Logout user', async () => {
      await homePage.clickLogout();
    });

    await AllureHelpers.step('Verify logout successful', async () => {
      await expect(loginPage.loginToAccountTitle).toBeVisible();
    });
  });
});
```

---

## Line-by-Line Explanation

---

### Line 1 — Import `test` from fixtures

```ts
import { test } from '@fixtures/automation-exercise-fixtures';
```

**What it does:**
Imports the `test` function that has all the page objects pre-wired as fixtures.

**Why not `@playwright/test`?**
Playwright's built-in `test` only knows about `page`, `browser`, `context`.
Our extended `test` adds `homePage`, `loginPage`, `cartPage` etc.

**Where it lives:**
`tests/fixtures/automation-exercise-fixtures.ts`
`@fixtures/` is a path alias — see `tsconfig.json`.

---

### Line 2 — Import `expect` from Playwright

```ts
import { expect } from '@playwright/test';
```

**What it does:**
Imports the assertion function used to verify things — `toBeVisible()`, `toHaveURL()`, etc.

**Why separate from test?**
It is intentionally a separate import. If you import `expect` from the fixtures file,
you get a version with fewer assertion helpers.

**Rule:** `test` always from `@fixtures/...`, `expect` always from `@playwright/test`.

---

### Line 3 — Import test data constants

```ts
import { TEST_USERS } from '@data/automation-exercise-data';
```

**What it does:**
Imports the `TEST_USERS` object which contains real email/password values for the test account.

**Where it lives:**
`tests/data/automation-exercise-data.ts`

**What `TEST_USERS` looks like:**
```ts
export const TEST_USERS = {
  VALID_USER:    { email: 'vanvuongbtm@gmail.com', password: '...' },
  INVALID_USER:  { email: 'invalid@example.com',   password: 'wrong' },
  EXISTING_USER: { email: '...', password: '...' },
} as const;
```

---

### Line 4 — Import Allure utilities

```ts
import { AllureHelpers, AutomationExerciseTestData } from '@utils/allure-helpers';
```

**What it does:**
Imports two things:
- `AllureHelpers` — the class with static methods for adding metadata to the Allure report
- `AutomationExerciseTestData` — a constant with pre-defined Epic/Feature/Story label strings

**Where it lives:**
`tests/utils/allure-helpers.ts`

---

### Lines 6–7 — test.describe block

```ts
test.describe('TC02 - Login User with Correct Email and Password', () => {
```

**What it does:**
Groups one or more related tests under a named suite.
In the Allure report, the `describe` name appears as the suite name.
In the Playwright HTML report, all tests inside are grouped together.

**It is optional but recommended** — keeps related tests bundled and clearly named.

---

### Lines 7–10 — test() function and page object injection

```ts
  test('TC02 - Login User with Correct Email and Password @smoke', async ({ 
    homePage, 
    loginPage 
  }) => {
```

**`test('name', async (fixtures) => {...})`** is the basic test structure.

**`async`** — required because every browser interaction is asynchronous.

**`{ homePage, loginPage }`** — this is **destructuring**. The fixtures system calls the
test function with a big object that has all page objects. By writing `{ homePage, loginPage }`,
you pull out only the two you need.

The fixture system does this for you automatically:
```ts
// You never write this in a spec file:
const homePage = new AutomationExerciseHomePage(page);
const loginPage = new AutomationExerciseLoginPage(page);
```

**`@smoke`** in the test name — this is a Playwright tag. It lets you run only
tagged tests: `npx playwright test --grep @smoke`

---

### Lines 11–20 — Allure metadata (no await needed)

```ts
    AllureHelpers.addEpic(AutomationExerciseTestData.epic);
    AllureHelpers.addFeature(AutomationExerciseTestData.features.authentication);
    AllureHelpers.addStory(AutomationExerciseTestData.stories.login);
    AllureHelpers.addSeverity('critical');
    AllureHelpers.addOwner('QA Team');
    AllureHelpers.addTestId('TC02');
    AllureHelpers.addDescription('Verify user can login with correct email and password');
    AllureHelpers.addTag('smoke');
    AllureHelpers.addTag('authentication');
    AllureHelpers.addParameter('User Email', TEST_USERS.VALID_USER.email);
```

These are **synchronous** metadata calls — no `await` needed.
They attach labels to the current test's Allure result JSON file.

| Method | What appears in Allure report |
|---|---|
| `addEpic(...)` | Top-level group in Behaviors tab |
| `addFeature(...)` | Second-level group under Epic |
| `addStory(...)` | Third-level group under Feature |
| `addSeverity(...)` | Priority badge (critical = red) |
| `addOwner(...)` | Shows who owns this test |
| `addTestId(...)` | Test case ID badge |
| `addDescription(...)` | Description text on the test detail page |
| `addTag(...)` | Freeform tag shown on the test |
| `addParameter(key, val)` | Shows the exact data used in this run |

`AutomationExerciseTestData.epic` resolves to `'Automation Exercise E2E Testing'`.
Using the constant (not a hardcoded string) ensures all tests appear under the same group.

---

### Lines 22–24 — First step: navigate

```ts
    await AllureHelpers.step('Navigate to home page', async () => {
      await homePage.navigateTo();
    });
```

**`AllureHelpers.step(name, async () => {...})`** — wraps your action in a named step.
The step name appears in the Allure report as a collapsible row.
If the action inside throws an error, the step is marked as failed.

**`await`** before `AllureHelpers.step` — the step method is `async`, 
so you must await it. Without `await`, Playwright moves to the next line
before the step finishes.

**`await homePage.navigateTo()`** — calls the method defined in
`tests/pages/AutomationExerciseHomePage.ts`:
```ts
async navigateTo(): Promise<void> {
  await this.page.goto('/');   // navigates to baseURL = https://automationexercise.com
  await this.waitForPageLoad();
}
```

---

### Lines 26–28 — Verify home page is visible

```ts
    await AllureHelpers.step('Verify home page is visible', async () => {
      await expect(homePage.homePageCarousel).toBeVisible();
    });
```

**`homePage.homePageCarousel`** — a `Locator` property declared in `AutomationExerciseHomePage.ts`:
```ts
readonly homePageCarousel: Locator;
// constructor: this.homePageCarousel = page.locator('#slider');
```

**`await expect(...).toBeVisible()`** — Playwright assertion that waits (up to 5s by default)
for the element to be visible. If it never appears, the test fails with a clear message.

You always `await` expect calls because they are async assertions.

---

### Lines 30–32 — Click signup/login link

```ts
    await AllureHelpers.step('Navigate to login page', async () => {
      await homePage.clickSignupLogin();
    });
```

**`homePage.clickSignupLogin()`** — a method in the Home page object:
```ts
async clickSignupLogin(): Promise<void> {
  await this.signupLoginLink.click();
}
```

The locator and click logic live in the page class. The spec file only calls
a descriptive method name. This is the core principle of POM.

---

### Lines 34–36 — Verify login form

```ts
    await AllureHelpers.step('Verify login form is visible', async () => {
      await expect(loginPage.loginToAccountTitle).toBeVisible();
    });
```

**`loginPage.loginToAccountTitle`** — a locator in `AutomationExerciseLoginPage.ts`:
```ts
readonly loginToAccountTitle: Locator;
// constructor: this.loginToAccountTitle = page.locator('.login-form h2')
```

This confirms the browser is now on the login page before interacting with inputs.

---

### Lines 38–40 — Fill login credentials

```ts
    await AllureHelpers.step('Enter login credentials', async () => {
      await loginPage.loginUser(TEST_USERS.VALID_USER.email, TEST_USERS.VALID_USER.password);
    });
```

**`loginPage.loginUser(email, password)`** — method in `AutomationExerciseLoginPage.ts`:
```ts
async loginUser(email: string, password: string): Promise<void> {
  await this.emailInput.fill(email);
  await this.passwordInput.fill(password);
  await this.loginButton.click();
}
```

**`TEST_USERS.VALID_USER.email`** — pulls the actual email string from the constants object.
You never hardcode `'vanvuongbtm@gmail.com'` directly in a test file.

---

### Lines 42–44 — Assert logged in

```ts
    await AllureHelpers.step('Verify user is logged in', async () => {
      await expect(homePage.loggedInAsUser).toBeVisible();
    });
```

**`homePage.loggedInAsUser`** — locator for the "Logged in as username" nav link:
```ts
readonly loggedInAsUser: Locator;
// constructor: this.loggedInAsUser = page.locator('a:has-text("Logged in as")')
```

This is the **core assertion** — proves login succeeded by verifying the nav bar changed.

---

### Lines 46–48 + 50–52 — Logout and verify

```ts
    await AllureHelpers.step('Logout user', async () => {
      await homePage.clickLogout();
    });

    await AllureHelpers.step('Verify logout successful', async () => {
      await expect(loginPage.loginToAccountTitle).toBeVisible();
    });
```

**Why logout at the end?** Leaves the browser in a clean state. If the test is re-run
without this, a previous session cookie might skip the login form entirely.

**`loginPage.loginToAccountTitle`** appears again — confirms redirect back to login page.

---

## Mental Model Summary

```
Spec file (tc02)               Fixture system                  Page object
──────────────────             ────────────────────            ──────────────────────
import { test }           →    extends base Playwright test
import { TEST_USERS }     →    constants from data file
import { AllureHelpers }  →    Allure metadata wrapper

test('...', async ({           creates:
  homePage,               →      new AutomationExerciseHomePage(page)
  loginPage               →      new AutomationExerciseLoginPage(page)
}) => {

AllureHelpers.addEpic()   →    writes metadata to result file
AllureHelpers.step()      →    wraps block in named Allure step

await homePage            →    calls page class method
  .navigateTo()           →      which calls page.goto('/')
                          →      and waitForPageLoad()

await expect(             →    Playwright waits for element
  loginPage               →    locator defined in class constructor
    .loginToAccountTitle  →      = page.locator('.login-form h2')
  ).toBeVisible()         →    assertion passes or test fails
```

---

## What to Read Next

- [06-Fixtures-and-Test-Data.md](./06-Fixtures-and-Test-Data.md) — deep dive on fixture system
- [07-Allure-Reporting.md](./07-Allure-Reporting.md) — full Allure metadata reference
- [02-POM-and-Architecture.md](./02-POM-and-Architecture.md) — how page objects are structured
- [11-All-26-Test-Cases-Map.md](./11-All-26-Test-Cases-Map.md) — what every other test does
