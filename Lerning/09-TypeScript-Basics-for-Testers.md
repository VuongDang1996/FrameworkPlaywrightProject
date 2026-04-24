# 09 — TypeScript Basics for Testers

You do not need to be a TypeScript expert to write good Playwright tests.
This file covers the 10 concepts you will actually encounter in this project,
shown with examples taken directly from the real test files.

---

## 1. What TypeScript Actually Is

TypeScript = JavaScript + **types**.

Every `.ts` file you write gets compiled to plain JavaScript before running.
The TypeScript compiler catches mistakes — like typos in property names or
calling a function with the wrong number of arguments — **before** the test runs.

```ts
// JavaScript — no error until runtime
const user = { email: 'a@b.com' };
console.log(user.emial);  // typo — prints "undefined"

// TypeScript — error at compile time
const user: { email: string } = { email: 'a@b.com' };
console.log(user.emial);  // TS error: Property 'emial' does not exist
```

In this project, `npm run type-check` (or `npx tsc --noEmit`) catches all type errors.

---

## 2. Primitive Types

The three most common types you will see:

```ts
const search: string  = 'shirt';       // text
const count:  number  = 3;             // number
const found:  boolean = true;          // true / false
```

TypeScript usually infers the type automatically, so you rarely need to write `: string` yourself:

```ts
const search = 'shirt';   // TypeScript infers: string
const count  = 3;         // TypeScript infers: number
```

---

## 3. Interfaces — Typed Data Objects

An **interface** describes the *shape* of an object: what fields it has and what type each field is.

**From `tests/data/automation-exercise-data.ts`:**

```ts
interface LoginCredentials {
  email: string;
  password: string;
}

interface UserRegistrationData {
  name: string;
  email: string;
  title: 'Mr' | 'Mrs';   // ← only these two values allowed (union type, see #4)
  password: string;
  day: string;
  month: string;
  year: string;
  newsletter?: boolean;   // ← the ? makes this field optional
  firstName: string;
  lastName: string;
  // ... more fields
}
```

When you use these interfaces, TypeScript auto-completes field names and warns you if you
forget a required field or use a wrong type:

```ts
const creds: LoginCredentials = {
  email: 'a@example.com',
  password: 'pass123',
  // TypeScript error if you add: username: 'someone'  — not in the interface
};
```

---

## 4. Union Types — One of These Values

A union type says "this value can only be one of these exact options".

```ts
// From UserRegistrationData
title: 'Mr' | 'Mrs'

// From AllureHelpers
addSeverity(level: 'blocker' | 'critical' | 'normal' | 'minor' | 'trivial')
```

If you pass any other string, TypeScript shows an error immediately:

```ts
AllureHelpers.addSeverity('high');    // TS Error: Argument '"high"' is not assignable
AllureHelpers.addSeverity('critical'); // ✅ OK
```

---

## 5. async / await — How Tests Actually Run

Every test function and every page method in this project runs **asynchronously**.
This means that when you call a method, you must `await` it or the action is skipped.

```ts
// ❌ WRONG — navigateTo() is called but test does not wait for it to finish
test('my test', async ({ homePage }) => {
  homePage.navigateTo();      // forgot await — page may not be loaded
  expect(homePage.logo).toBeVisible();
});

// ✅ CORRECT
test('my test', async ({ homePage }) => {
  await homePage.navigateTo();
  await expect(homePage.logo).toBeVisible();
});
```

Rule: **if a method returns `Promise<...>`, always await it.**

---

## 6. Import Patterns — Path Aliases

This project uses **path aliases** in `tsconfig.json` to avoid long relative paths.

```ts
// Without aliases (fragile — breaks when you move files)
import { test } from '../../../fixtures/automation-exercise-fixtures';

// With aliases (always works, no matter where the spec file lives)
import { test } from '@fixtures/automation-exercise-fixtures';
import { expect } from '@playwright/test';
import { TEST_USERS } from '@data/automation-exercise-data';
import { AllureHelpers, AutomationExerciseTestData } from '@utils/allure-helpers';
```

All four aliases are defined in `tsconfig.json`:

| Alias | Resolves to |
|---|---|
| `@fixtures/*` | `tests/fixtures/*` |
| `@data/*` | `tests/data/*` |
| `@utils/*` | `tests/utils/*` |
| `@pages/*` | `tests/pages/*` |
| `@components/*` | `tests/pages/components/*` |

> **Critical rule:** `test` always comes from `@fixtures/...` and `expect` always comes from
> `@playwright/test`. They are always on **separate import lines**. Never combine them.

---

## 7. Classes — What Page Objects Are

A **class** is a blueprint for an object. Page objects in this project use classes.

```ts
// Simplified from AutomationExerciseLoginPage.ts
export class AutomationExerciseLoginPage extends BasePage {
  // readonly = can be read but not reassigned
  readonly emailInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);   // calls BasePage constructor — sets this.page = page
    this.emailInput  = page.locator('input[data-qa="login-email"]');
    this.loginButton = page.locator('button[data-qa="login-button"]');
  }

  async loginUser(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.page.locator('input[data-qa="login-password"]').fill(password);
    await this.loginButton.click();
  }
}
```

Key vocabulary:
- `class` — defines the page object
- `extends BasePage` — inherits shared methods like `waitForPageLoad()`
- `constructor` — runs when the fixture creates `new AutomationExerciseLoginPage(page)`
- `readonly` — this locator cannot be accidentally overwritten
- `super(page)` — passes `page` up to BasePage so `this.page` is available everywhere

You never call `new AutomationExerciseLoginPage(page)` yourself in a spec file —
the **fixture system** (see file 06) does it for you.

---

## 8. `as const` — Frozen Object Values

When a data file declares an object with `as const`, every value is **readonly and typed literally**.

**From `tests/data/automation-exercise-data.ts`:**

```ts
export const SEARCH_TERMS = {
  SHIRT: 'shirt',
  DRESS: 'dress',
  JEANS: 'jeans',
  TOP:   'top',
} as const;
```

Without `as const`, TypeScript would type `SEARCH_TERMS.SHIRT` as `string` (any string).
With `as const`, it is typed as the literal `'shirt'` — TypeScript knows the exact value.

This means you cannot accidentally overwrite a constant:

```ts
SEARCH_TERMS.SHIRT = 'suits';   // TypeScript Error: Cannot assign to 'SHIRT' because it is a read-only property
```

---

## 9. `Promise<T>` — What Functions Return

When a function is declared as `async`, it always returns a `Promise`.
The type inside `<>` tells you what value the promise resolves to.

| Return type | Means |
|---|---|
| `Promise<void>` | Function finishes but returns nothing (most page methods) |
| `Promise<string>` | Function returns a text value |
| `Promise<number>` | Function returns a number |
| `Promise<boolean>` | Function returns true or false |
| `Promise<string[]>` | Function returns an array of strings |

```ts
// Returns nothing — just performs the click and navigation
async navigateTo(): Promise<void>

// Returns text from the page
async getErrorMessage(): Promise<string>

// Returns number of items
async getCartItemsCount(): Promise<number>

// Returns true/false
async isLoginErrorVisible(): Promise<boolean>
```

You always `await` these calls regardless of what they return:

```ts
const count: number = await cartPage.getCartItemsCount();
const isVisible: boolean = await loginPage.isLoginErrorVisible();
```

---

## 10. Common TypeScript Mistakes in Tests

| Mistake | What Happens | Fix |
|---|---|---|
| Missing `await` on page method | Test passes even though action didn't run | Add `await` before every page method call |
| `import { test, expect }` from fixtures file | `expect` comes with fewer assertion helpers | Use two separate imports |
| Using relative path `../../../fixtures/...` | Breaks when file moves | Use `@fixtures/` alias |
| Directly using `page.locator(...)` in spec file | Breaks POM pattern, hard to maintain | Add locator and method to the page object class |
| Hardcoding email strings in tests | "Email already exists" errors on re-run | Use `TEST_USERS` constants or `Date.now()` unique emails |
| Calling `AllureHelpers.step(...)` without `await` | Steps are created but don't appear correctly | Always `await AllureHelpers.step(...)` |
| Using `AllureHelpers.addStep(...)` | Method does not exist — runtime error | Use `AllureHelpers.step(...)` |

---

## Quick Reference

```ts
// The correct 4-import pattern for most tests
import { test } from '@fixtures/automation-exercise-fixtures';
import { expect } from '@playwright/test';
import { TEST_USERS, SEARCH_TERMS } from '@data/automation-exercise-data';
import { AllureHelpers, AutomationExerciseTestData } from '@utils/allure-helpers';

// async test with awaited steps
test('TC-XX - My test @smoke', async ({ homePage, loginPage }) => {

  AllureHelpers.addEpic(AutomationExerciseTestData.epic);
  AllureHelpers.addFeature(AutomationExerciseTestData.features.authentication);
  AllureHelpers.addStory(AutomationExerciseTestData.stories.login);

  await AllureHelpers.step('Navigate', async () => {
    await homePage.navigateTo();          // Promise<void> — always await
  });

  const count: number = await cartPage.getCartItemsCount();  // Promise<number>
  const error: string = await loginPage.getLoginErrorMessage(); // Promise<string>

  await expect(homePage.homePageCarousel).toBeVisible();
});
```
