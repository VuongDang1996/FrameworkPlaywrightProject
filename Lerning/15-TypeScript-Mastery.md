# 15 — TypeScript Mastery for Test Engineers

Deep TypeScript knowledge applied to Playwright testing: generics, utility types, async/await patterns, type guards, decorators, and building type-safe test utilities.

---

## 🧠 Flashcards

**Concept:** TypeScript Generics in Test Utilities
Generics allow you to write reusable functions that work with any type. Example: `function getFirst<T>(arr: T[]): T { return arr[0]; }`. In testing, use generics for helper functions that wrap API responses: `async function fetchAndParse<T>(url: string): Promise<T>`.

**Concept:** Union Types
A union type allows a variable to be one of several types: `type Status = 'pass' | 'fail' | 'skip'`. This is perfect for test data enums — TypeScript will catch if you accidentally pass an invalid status string.

**Concept:** Intersection Types
An intersection type combines multiple types: `type AdminUser = User & { adminLevel: number }`. Use this when a test data object must satisfy multiple contracts simultaneously.

**Concept:** Optional Chaining (?.)
`object?.property?.nested` safely accesses nested properties without throwing if any level is null or undefined. In test code: `const message = response?.body?.error?.message ?? 'Unknown error'`. Essential when working with API responses of unknown shape.

**Concept:** Nullish Coalescing (??)
`value ?? defaultValue` returns the right side only if the left side is `null` or `undefined` (not falsy!). Different from `||` which also triggers for `0`, `''`, and `false`. Use in test data setup: `const timeout = config.timeout ?? 30000`.

**Concept:** TypeScript Readonly
`readonly` prevents reassignment after initialization. Use it for Page Object locators: `readonly submitButton: Locator`. This prevents accidental reassignment and communicates intent — locators should be configured once and never changed.

**Concept:** async/await vs Promise chains
`async/await` makes asynchronous code look synchronous and is far easier to read and debug. In Playwright, every interaction and assertion is async. Never mix `.then().catch()` chains with `await` in the same flow — pick one style consistently.

**Concept:** Type Assertion (as keyword)
`value as SomeType` tells TypeScript to treat a value as a specific type. Use sparingly — it bypasses type checking. Prefer type guards instead. Example: `const btn = element as HTMLButtonElement` — only when you are certain of the type.

**Concept:** Type Guards
A type guard is a function that narrows a type at runtime: `function isError(val: unknown): val is Error { return val instanceof Error }`. In test utilities, use type guards to safely handle API response parsing where the type is unknown.

**Concept:** Mapped Types
Mapped types transform the properties of an existing type: `type Optional<T> = { [K in keyof T]?: T[K] }`. Useful for creating partial test data builders where not all fields are required for every test scenario.

**Term:** Pick<T, K>
A utility type that creates a new type containing only the specified keys from T. Example: `type LoginData = Pick<User, 'email' | 'password'>`. Use in test data to extract only the fields relevant to a specific test.

**Term:** Omit<T, K>
The opposite of Pick — creates a type with all keys EXCEPT the specified ones. Example: `type UserWithoutId = Omit<User, 'id'>`. Use when creating new records in tests where the ID is server-generated.

**Term:** Partial<T>
Makes all properties of T optional. `Partial<User>` means every field of User becomes optional. Perfect for test data override patterns where you provide default values and let individual tests override only what they need.

**Term:** Required<T>
Makes all properties of T required (removes optional markers). Opposite of Partial. Use to enforce that test data passed to an assertion helper is complete.

**Term:** Record<K, V>
`Record<string, number>` creates a type for an object where all keys are strings and all values are numbers. Use for test data maps: `const productPrices: Record<string, number> = { widget: 9.99 }`.

**Concept:** Enums vs Literal Types
TypeScript enums (`enum Status { Pass, Fail }`) create runtime objects. String literal union types (`type Status = 'pass' | 'fail'`) are compile-time only and produce no JS output. Prefer literal types in test code for simplicity.

**Concept:** Interface vs Type Alias
`interface` is extendable with `extends` and supports declaration merging. `type` is more powerful (supports unions, intersections, mapped types). For test data shapes, both work — be consistent. Most Playwright types use `interface`.

**Concept:** Async Iterator (for await...of)
`for await (const item of asyncIterable)` loops over async data streams. Rarely needed in Playwright tests but useful when processing paginated API responses in test setup utilities.

**Term:** Promise.all() vs Promise.allSettled()
`Promise.all()` rejects immediately if any promise fails. `Promise.allSettled()` waits for all promises and returns each result (fulfilled or rejected). Use `allSettled` in test teardown to ensure all cleanup steps run even if one fails.

**Term:** satisfies keyword (TS 4.9+)
`const config = { baseURL: 'http://localhost' } satisfies PlaywrightConfig` validates the object against a type WITHOUT widening it. The object retains its literal types. Useful for strongly-typed config objects.

---

## 📝 Quizzes

### What does `Partial<T>` do in TypeScript?
- [ ] Makes all properties required
- [ ] Removes all properties from T
- [x] Makes all properties of T optional
- [ ] Creates a new type from a subset of T's keys

### What is the difference between `??` and `||`?
- [ ] They are identical
- [ ] `??` works for strings, `||` works for numbers
- [x] `??` only triggers for null/undefined; `||` also triggers for falsy values like 0 and ''
- [ ] `||` is for async code; `??` is for synchronous code

### What does `Pick<User, 'email' | 'password'>` produce?
- [ ] User type with email and password removed
- [x] A new type containing only the email and password fields from User
- [ ] An intersection of User with email and password overrides
- [ ] A union of email and password types

### Which TypeScript utility type is the opposite of Pick?
- [ ] `Partial<T>`
- [ ] `Required<T>`
- [x] `Omit<T, K>`
- [ ] `Exclude<T, K>`

### Why should Playwright Page Object locators be marked `readonly`?
- [ ] To make them faster
- [ ] To prevent TypeScript errors in tests
- [x] To prevent accidental reassignment and communicate that locators are configured once
- [ ] readonly is required by the Playwright API

### What is a type guard?
- [ ] A TypeScript keyword that prevents type errors
- [ ] A way to cast a type using `as`
- [x] A function that narrows a type at runtime using `value is Type` in its return type
- [ ] A decorator that validates type at runtime

### What does `Promise.allSettled()` do differently from `Promise.all()`?
- [ ] It runs promises in sequence instead of parallel
- [x] It waits for all promises to complete and returns each result, even if some rejected
- [ ] It only resolves when all promises succeed
- [ ] It cancels remaining promises if one fails

### Which is preferred for test data shapes in TypeScript?
- [ ] JavaScript objects with JSDoc comments
- [ ] `class` with all optional properties
- [x] `interface` or `type` alias — be consistent, both work well
- [ ] `enum` for all test data

### What is the `satisfies` keyword useful for?
- [ ] Runtime type checking like `instanceof`
- [ ] Asserting a value equals something in tests
- [x] Validating an object against a type without widening its literal types
- [ ] Making all properties required at compile time

### What does `Record<string, number>` describe?
- [ ] A tuple of string and number
- [ ] An array alternating strings and numbers
- [x] An object where all keys are strings and all values are numbers
- [ ] A Map with string keys and number values

### When should you use `as` type assertion?
- [ ] Always — it makes code clearer
- [ ] Never — use any instead
- [x] Sparingly, only when you are certain of the type and a type guard isn't practical
- [ ] Only in .test.ts files, never in page objects

### What does optional chaining `?.` prevent?
- [ ] Async race conditions
- [x] TypeError when accessing properties on null or undefined values
- [ ] Infinite loops in recursive functions
- [ ] TypeScript compilation errors on optional properties

---

## 🏋️ Coding Exercises

### [Exercise] Define Strict Test Data Interfaces
- **Difficulty:** Basic
- **Description:** Create TypeScript interfaces for user and product test data. Use `readonly` for ID fields (which should never be modified) and optional properties for fields that aren't always needed.

```typescript
// 1. Define a UserData interface with:
//    - id: readonly number
//    - email: string
//    - password: string
//    - firstName?: string (optional)
//    - lastName?: string (optional)
//    - role: 'admin' | 'user' | 'guest' (literal union)
// YOUR CODE HERE

// 2. Define a ProductData interface with:
//    - readonly id: number
//    - name: string
//    - price: number
//    - category: string
//    - inStock: boolean
// YOUR CODE HERE

// 3. Create a const testUser satisfying UserData
// YOUR CODE HERE

// 4. Create a const testProduct satisfying ProductData
// YOUR CODE HERE

import { test, expect } from '@playwright/test';

test('test data interfaces are correct', () => {
  // 5. Assert testUser.role is 'user'
  // YOUR CODE HERE

  // 6. Assert testProduct.inStock is true
  // YOUR CODE HERE
});
```

### Solution
```typescript
interface UserData {
  readonly id: number;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role: 'admin' | 'user' | 'guest';
}

interface ProductData {
  readonly id: number;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
}

const testUser: UserData = {
  id: 1,
  email: 'test@example.com',
  password: 'Secret123!',
  firstName: 'Test',
  role: 'user',
};

const testProduct: ProductData = {
  id: 101,
  name: 'Test Widget',
  price: 9.99,
  category: 'Electronics',
  inStock: true,
};

import { test, expect } from '@playwright/test';

test('test data interfaces are correct', () => {
  expect(testUser.role).toBe('user');
  expect(testProduct.inStock).toBe(true);
});
```

---

### [Exercise] Use Partial<T> for Test Data Overrides
- **Difficulty:** Basic
- **Description:** Create a default test user object and a factory function that merges overrides using `Partial<T>`. This is the standard pattern for creating test data variants without duplicating the entire object.

```typescript
import { test, expect } from '@playwright/test';

interface User {
  email: string;
  password: string;
  role: string;
  isActive: boolean;
}

const defaultUser: User = {
  email: 'default@example.com',
  password: 'Default123!',
  role: 'user',
  isActive: true,
};

// 1. Create a function createUser(overrides: Partial<User>): User
//    that merges defaultUser with overrides using spread syntax
// YOUR CODE HERE

test('partial override creates correct user', () => {
  // 2. Create an admin user by overriding only the role property
  // YOUR CODE HERE

  // 3. Assert the admin user has role 'admin'
  // YOUR CODE HERE

  // 4. Assert the admin user still has the defaultUser email
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

interface User {
  email: string;
  password: string;
  role: string;
  isActive: boolean;
}

const defaultUser: User = {
  email: 'default@example.com',
  password: 'Default123!',
  role: 'user',
  isActive: true,
};

function createUser(overrides: Partial<User> = {}): User {
  return { ...defaultUser, ...overrides };
}

test('partial override creates correct user', () => {
  const adminUser = createUser({ role: 'admin' });
  expect(adminUser.role).toBe('admin');
  expect(adminUser.email).toBe('default@example.com');
});
```

---

### [Exercise] Generic API Response Helper
- **Difficulty:** Intermediate
- **Description:** Write a generic async function `fetchJSON<T>` that wraps the Playwright API request context, parses JSON, and returns a typed result. This eliminates repeated `JSON.parse` boilerplate across tests.

```typescript
import { test, expect, APIRequestContext } from '@playwright/test';

interface Product {
  id: number;
  name: string;
  price: number;
}

// 1. Write an async generic function:
//    async function fetchJSON<T>(request: APIRequestContext, url: string): Promise<T>
//    - Make a GET request to the url using request.get(url)
//    - Parse and return the JSON body typed as T
// YOUR CODE HERE

test('generic fetch helper returns typed data', async ({ request }) => {
  // 2. Use fetchJSON<Product[]> to fetch from 'https://fakestoreapi.com/products?limit=3'
  // YOUR CODE HERE

  // 3. Assert the result is an array with 3 items
  // YOUR CODE HERE

  // 4. Assert the first product has an 'id' property that is a number
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect, APIRequestContext } from '@playwright/test';

interface Product {
  id: number;
  name: string;
  price: number;
}

async function fetchJSON<T>(request: APIRequestContext, url: string): Promise<T> {
  const response = await request.get(url);
  return response.json() as Promise<T>;
}

test('generic fetch helper returns typed data', async ({ request }) => {
  const products = await fetchJSON<Product[]>(request, 'https://fakestoreapi.com/products?limit=3');

  expect(products).toHaveLength(3);
  expect(typeof products[0].id).toBe('number');
});
```

---

### [Exercise] Type-Safe Page Object with Generics
- **Difficulty:** Intermediate
- **Description:** Create a generic `BasePage<TConfig>` class that accepts a config object type. Subclass it for a specific page. This pattern allows sharing common navigation logic while keeping page-specific config strongly typed.

```typescript
import { Page, Locator } from '@playwright/test';

// 1. Define an interface PageConfig with: { path: string; title: string }
// YOUR CODE HERE

// 2. Create a generic class BasePage<TConfig extends PageConfig>
//    - Constructor takes Page and TConfig
//    - Has a method navigate() that calls page.goto(this.config.path)
//    - Has a method assertTitle() that calls expect(page).toHaveTitle(this.config.title)
// YOUR CODE HERE

// 3. Define a HomePageConfig interface extending PageConfig that adds:
//    - heroHeading: string (the locator selector for the h1)
// YOUR CODE HERE

// 4. Create class HomePage extending BasePage<HomePageConfig>
//    - Add a property heroHeadingLocator that uses page.locator(config.heroHeading)
// YOUR CODE HERE

import { test, expect } from '@playwright/test';

test('type-safe generic page object works', async ({ page }) => {
  // 5. Instantiate HomePage with appropriate config and use it
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { Page, Locator, test, expect } from '@playwright/test';

interface PageConfig {
  path: string;
  title: string | RegExp;
}

class BasePage<TConfig extends PageConfig> {
  constructor(protected page: Page, protected config: TConfig) {}

  async navigate(): Promise<void> {
    await this.page.goto(this.config.path);
  }

  async assertTitle(): Promise<void> {
    await expect(this.page).toHaveTitle(this.config.title);
  }
}

interface HomePageConfig extends PageConfig {
  heroHeading: string;
}

class HomePage extends BasePage<HomePageConfig> {
  readonly heroHeadingLocator: Locator;

  constructor(page: Page, config: HomePageConfig) {
    super(page, config);
    this.heroHeadingLocator = page.locator(config.heroHeading);
  }
}

test('type-safe generic page object works', async ({ page }) => {
  const homePage = new HomePage(page, {
    path: 'https://playwright.dev',
    title: /Playwright/,
    heroHeading: 'h1',
  });

  await homePage.navigate();
  await homePage.assertTitle();
  await expect(homePage.heroHeadingLocator.first()).toBeVisible();
});
```

---

### [Exercise] Type Guard for API Response Validation
- **Difficulty:** Intermediate
- **Description:** Write a runtime type guard to safely validate that an unknown API response body matches the expected shape before using it in assertions. This prevents cryptic errors when an API returns unexpected data.

```typescript
import { test, expect } from '@playwright/test';

interface UserResponse {
  id: number;
  name: string;
  email: string;
}

// 1. Write a type guard function isUserResponse(val: unknown): val is UserResponse
//    Check that val is an object with number id, string name, string email
// YOUR CODE HERE

test('type guard validates API response', async ({ request }) => {
  const response = await request.get('https://jsonplaceholder.typicode.com/users/1');
  const body: unknown = await response.json();

  // 2. Use the type guard to check if body is a valid UserResponse
  // YOUR CODE HERE

  // 3. If valid, assert body.name is a non-empty string
  // YOUR CODE HERE

  // 4. If NOT valid, throw an error 'Invalid response shape'
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

interface UserResponse {
  id: number;
  name: string;
  email: string;
}

function isUserResponse(val: unknown): val is UserResponse {
  return (
    typeof val === 'object' &&
    val !== null &&
    typeof (val as UserResponse).id === 'number' &&
    typeof (val as UserResponse).name === 'string' &&
    typeof (val as UserResponse).email === 'string'
  );
}

test('type guard validates API response', async ({ request }) => {
  const response = await request.get('https://jsonplaceholder.typicode.com/users/1');
  const body: unknown = await response.json();

  if (!isUserResponse(body)) {
    throw new Error('Invalid response shape');
  }

  expect(body.name.length).toBeGreaterThan(0);
});
```

---

### [Exercise] Enum-Based Test Data Factory
- **Difficulty:** Intermediate
- **Description:** Create an enum for user roles and a factory function that generates test data based on the role. Map each role to specific permissions and test the factory output.

```typescript
import { test, expect } from '@playwright/test';

// 1. Define an enum UserRole with values: Admin, Editor, Viewer
// YOUR CODE HERE

// 2. Define an interface UserProfile: { role: UserRole, canEdit: boolean, canDelete: boolean, canView: boolean }
// YOUR CODE HERE

// 3. Write a function createUserProfile(role: UserRole): UserProfile
//    - Admin: canEdit=true, canDelete=true, canView=true
//    - Editor: canEdit=true, canDelete=false, canView=true
//    - Viewer: canEdit=false, canDelete=false, canView=true
// YOUR CODE HERE

test('Admin has full permissions', () => {
  // 4. Create admin profile and assert all permissions are true
  // YOUR CODE HERE
});

test('Viewer can only view', () => {
  // 5. Create viewer profile and assert canEdit and canDelete are false
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

enum UserRole {
  Admin = 'Admin',
  Editor = 'Editor',
  Viewer = 'Viewer',
}

interface UserProfile {
  role: UserRole;
  canEdit: boolean;
  canDelete: boolean;
  canView: boolean;
}

function createUserProfile(role: UserRole): UserProfile {
  const permissions: Record<UserRole, Omit<UserProfile, 'role'>> = {
    [UserRole.Admin]:  { canEdit: true,  canDelete: true,  canView: true },
    [UserRole.Editor]: { canEdit: true,  canDelete: false, canView: true },
    [UserRole.Viewer]: { canEdit: false, canDelete: false, canView: true },
  };
  return { role, ...permissions[role] };
}

test('Admin has full permissions', () => {
  const admin = createUserProfile(UserRole.Admin);
  expect(admin.canEdit).toBe(true);
  expect(admin.canDelete).toBe(true);
  expect(admin.canView).toBe(true);
});

test('Viewer can only view', () => {
  const viewer = createUserProfile(UserRole.Viewer);
  expect(viewer.canEdit).toBe(false);
  expect(viewer.canDelete).toBe(false);
  expect(viewer.canView).toBe(true);
});
```

---

### [Exercise] Promise.allSettled() for Parallel Teardown
- **Difficulty:** Advanced
- **Description:** Use `Promise.allSettled()` in an `afterEach` hook to run multiple cleanup operations in parallel and collect any failures — without one failing teardown step preventing the others from running.

```typescript
import { test, expect } from '@playwright/test';

// Simulated cleanup functions (replace with real API calls in production)
async function deleteTestUser(id: number): Promise<void> {
  if (id < 0) throw new Error(`Invalid user id: ${id}`);
  // await request.delete(`/api/users/${id}`);
}

async function clearTestData(tag: string): Promise<void> {
  if (!tag) throw new Error('Tag is required');
  // await request.delete(`/api/test-data/${tag}`);
}

test.describe('Parallel teardown example', () => {
  test.afterEach(async () => {
    // 1. Use Promise.allSettled() to run deleteTestUser(1) and clearTestData('session-test') in parallel
    // YOUR CODE HERE

    // 2. Loop over results and log any rejected cleanups
    //    results.forEach(r => { if (r.status === 'rejected') console.warn(...) })
    // YOUR CODE HERE
  });

  test('main test that creates data', async ({ page }) => {
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
  });
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

async function deleteTestUser(id: number): Promise<void> {
  if (id < 0) throw new Error(`Invalid user id: ${id}`);
}

async function clearTestData(tag: string): Promise<void> {
  if (!tag) throw new Error('Tag is required');
}

test.describe('Parallel teardown example', () => {
  test.afterEach(async () => {
    const results = await Promise.allSettled([
      deleteTestUser(1),
      clearTestData('session-test'),
    ]);

    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        console.warn(`Cleanup step ${index} failed:`, result.reason);
      }
    });
  });

  test('main test that creates data', async ({ page }) => {
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
  });
});
```

---

### [Exercise] Build a Reusable Retry Utility
- **Difficulty:** Advanced
- **Description:** Write a generic `retry<T>` utility function that re-runs an async operation up to N times with a delay between attempts. Use generics and TypeScript's built-in `RetryConfig` pattern.

```typescript
import { test, expect } from '@playwright/test';

interface RetryConfig {
  attempts: number;
  delayMs: number;
}

// 1. Write an async generic function retry<T>(
//      fn: () => Promise<T>,
//      config: RetryConfig
//    ): Promise<T>
//    - Try fn() up to config.attempts times
//    - Wait config.delayMs between failures using new Promise(r => setTimeout(r, ms))
//    - Throw the last error if all attempts fail
// YOUR CODE HERE

test('retry utility retries flaky operation', async () => {
  let callCount = 0;

  // 2. Create a flaky function that fails the first 2 times, then succeeds
  const flakyFn = async () => {
    callCount++;
    if (callCount < 3) throw new Error(`Attempt ${callCount} failed`);
    return 'success';
  };

  // 3. Use retry() with 5 attempts and 100ms delay
  // YOUR CODE HERE

  // 4. Assert the result is 'success' and callCount is 3
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

interface RetryConfig {
  attempts: number;
  delayMs: number;
}

async function retry<T>(fn: () => Promise<T>, config: RetryConfig): Promise<T> {
  let lastError: unknown;
  for (let i = 0; i < config.attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (i < config.attempts - 1) {
        await new Promise((r) => setTimeout(r, config.delayMs));
      }
    }
  }
  throw lastError;
}

test('retry utility retries flaky operation', async () => {
  let callCount = 0;

  const flakyFn = async () => {
    callCount++;
    if (callCount < 3) throw new Error(`Attempt ${callCount} failed`);
    return 'success';
  };

  const result = await retry(flakyFn, { attempts: 5, delayMs: 100 });

  expect(result).toBe('success');
  expect(callCount).toBe(3);
});
```

---

### [Exercise] Mapped Type for Selector Configuration
- **Difficulty:** Advanced
- **Description:** Use a mapped type to create a strongly-typed selector map for a Page Object. Each key is a locator name, and the value is the CSS selector string. TypeScript will enforce exhaustiveness.

```typescript
import { Page, Locator } from '@playwright/test';
import { test, expect } from '@playwright/test';

// 1. Define a literal type union for selector keys:
//    type LoginSelectors = 'emailInput' | 'passwordInput' | 'submitButton' | 'errorMessage'
// YOUR CODE HERE

// 2. Define a mapped type: type SelectorMap<T extends string> = { [K in T]: string }
// YOUR CODE HERE

// 3. Create a const loginSelectorMap: SelectorMap<LoginSelectors> with real CSS selectors
// YOUR CODE HERE

// 4. Create a LoginPage class that:
//    - Accepts Page in the constructor
//    - Converts each entry in loginSelectorMap to a Locator using a loop
//    - Exposes each locator as a typed property
// YOUR CODE HERE

test('mapped type selector config works', async ({ page }) => {
  await page.goto('https://practice.expandtesting.com/login');

  // 5. Instantiate LoginPage and assert the emailInput is visible
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { Page, Locator, test, expect } from '@playwright/test';

type LoginSelectors = 'emailInput' | 'passwordInput' | 'submitButton' | 'errorMessage';
type SelectorMap<T extends string> = { [K in T]: string };

const loginSelectorMap: SelectorMap<LoginSelectors> = {
  emailInput:     '#username',
  passwordInput:  '#password',
  submitButton:   'button[type="submit"]',
  errorMessage:   '#flash',
};

class LoginPage {
  emailInput:     Locator;
  passwordInput:  Locator;
  submitButton:   Locator;
  errorMessage:   Locator;

  constructor(private page: Page) {
    this.emailInput    = page.locator(loginSelectorMap.emailInput);
    this.passwordInput = page.locator(loginSelectorMap.passwordInput);
    this.submitButton  = page.locator(loginSelectorMap.submitButton);
    this.errorMessage  = page.locator(loginSelectorMap.errorMessage);
  }
}

test('mapped type selector config works', async ({ page }) => {
  await page.goto('https://practice.expandtesting.com/login');
  const loginPage = new LoginPage(page);
  await expect(loginPage.emailInput).toBeVisible();
});
```

---

## 🧠 More Flashcards

**Concept:** Discriminated Unions
A discriminated union uses a shared `kind` or `type` field to narrow the type: `type Shape = { kind: 'circle'; radius: number } | { kind: 'rect'; width: number }`. In test data, use this for multi-variant payloads like login vs. SSO requests.

**Concept:** Template Literal Types
`type EventName = `on${Capitalize<string>}`` creates types like `onClick`, `onChange`. Useful in test utilities for strongly-typed event name strings, ensuring only valid DOM event names are passed to listeners.

**Concept:** Tuple Types
`type Point = [number, number]` is a fixed-length array with typed positions. In tests: `type LoginArgs = [string, string]` for `[username, password]`. Tuples prevent accidentally swapping arguments in parameterized test helpers.

**Concept:** Readonly Arrays
`readonly string[]` or `ReadonlyArray<string>` prevents mutation. Use for test data arrays that should never be modified at runtime: `const TEST_EMAILS: readonly string[] = ['a@b.com']`. TypeScript will error if you try to push to it.

**Term:** NonNullable<T>
`NonNullable<string | null | undefined>` produces `string` — removes null and undefined from the type. Use in test helpers that receive values from API responses and must assert they are present before using them.

**Term:** ReturnType<T>
Extracts the return type of a function: `type ApiResult = ReturnType<typeof fetchUser>`. Useful for typing the result of async factory functions without manually duplicating the interface.

**Term:** Parameters<T>
Extracts the parameter types of a function as a tuple: `type LoginParams = Parameters<typeof loginUser>`. Use to build wrapper functions that pass arguments through without re-declaring types.

**Concept:** Conditional Types
`type IsArray<T> = T extends any[] ? 'yes' : 'no'`. Conditional types allow logic at the type level. In test utilities: validate that a generic type is an array before mapping over it, preventing runtime errors.

---

## 📝 More Quizzes

### What is a discriminated union used for?
- [ ] Combining two objects into one
- [x] Narrowing a union type using a shared `kind` or `type` field
- [ ] Making all union members partial
- [ ] Excluding null from a type

### What does `NonNullable<string | null | undefined>` produce?
- [ ] `string | null`
- [ ] `undefined`
- [x] `string`
- [ ] `string | undefined`

### What does `ReturnType<typeof myFunction>` extract?
- [ ] The parameter types of myFunction
- [ ] The generic type arguments of myFunction
- [x] The return type of myFunction as a TypeScript type
- [ ] The function itself as a type

### What is a `readonly string[]` array?
- [ ] An array that can only hold strings, no numbers
- [x] An array that cannot be mutated (no push, pop, splice)
- [ ] An array where elements are frozen objects
- [ ] A string viewed as an array of characters

### What does `Parameters<typeof fn>` return?
- [ ] The return type of fn as a type
- [ ] The number of parameters fn accepts
- [x] The parameter types of fn as a tuple type
- [ ] A function that calls fn with no arguments

### What is a Tuple type in TypeScript?
- [ ] An object with numeric keys
- [x] A fixed-length array where each position has a specific type
- [ ] A union of array types
- [ ] An array that cannot be modified

### What does a Template Literal Type `type Route = \`/${string}\`` enforce?
- [ ] Nothing — it is just a string
- [x] That the value must start with a forward slash followed by any string
- [ ] That the value is a URL
- [ ] That the value is a template string at runtime

### When would you use `NonNullable<T>` in a test helper?
- [ ] When you want to remove the number type from a union
- [x] When asserting an API response field is present before accessing its properties
- [ ] When sorting test data arrays
- [ ] When comparing two optional values

---

## 🏋️ More Coding Exercises

### [Exercise] Use Discriminated Union for Test Payloads
- **Difficulty:** Intermediate
- **Description:** Create a discriminated union type for different login request methods and a handler function that correctly processes each variant.

```typescript
import { test, expect } from '@playwright/test';

// 1. Define type LoginRequest as discriminated union:
//    | { method: 'password'; username: string; password: string }
//    | { method: 'sso'; provider: 'google' | 'github'; token: string }
// YOUR CODE HERE

// 2. Write function getLoginDescription(req: LoginRequest): string
//    - If method is 'password': return 'Password login for ${req.username}'
//    - If method is 'sso': return 'SSO login via ${req.provider}'
// YOUR CODE HERE

test('discriminated union handles both login types', () => {
  // 3. Create a password login request and assert the description
  // YOUR CODE HERE

  // 4. Create an SSO login request and assert the description
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

type LoginRequest =
  | { method: 'password'; username: string; password: string }
  | { method: 'sso'; provider: 'google' | 'github'; token: string };

function getLoginDescription(req: LoginRequest): string {
  if (req.method === 'password') return `Password login for ${req.username}`;
  return `SSO login via ${req.provider}`;
}

test('discriminated union handles both login types', () => {
  const passReq: LoginRequest = { method: 'password', username: 'test@mail.com', password: 'S3cr3t!' };
  expect(getLoginDescription(passReq)).toBe('Password login for test@mail.com');

  const ssoReq: LoginRequest = { method: 'sso', provider: 'google', token: 'abc123' };
  expect(getLoginDescription(ssoReq)).toBe('SSO login via google');
});
```

---

### [Exercise] Use ReturnType to Avoid Duplication
- **Difficulty:** Intermediate
- **Description:** Extract the return type of an async factory function using `ReturnType` + `Awaited` instead of manually declaring a matching interface.

```typescript
import { test, expect } from '@playwright/test';

async function createTestSession() {
  return {
    sessionId: `sess-${Date.now()}`,
    userId: 42,
    expiresAt: new Date(Date.now() + 3600 * 1000),
  };
}

// 1. Extract the type without manually declaring it:
//    type TestSession = Awaited<ReturnType<typeof createTestSession>>
// YOUR CODE HERE

// 2. Write a function assertSessionValid(session: TestSession): void
//    that asserts sessionId starts with 'sess-', userId > 0, and expiresAt is in the future
// YOUR CODE HERE

test('ReturnType extracts async return type correctly', async () => {
  const session = await createTestSession();
  // 3. Call assertSessionValid(session)
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

async function createTestSession() {
  return {
    sessionId: `sess-${Date.now()}`,
    userId: 42,
    expiresAt: new Date(Date.now() + 3600 * 1000),
  };
}

type TestSession = Awaited<ReturnType<typeof createTestSession>>;

function assertSessionValid(session: TestSession): void {
  expect(session.sessionId).toMatch(/^sess-/);
  expect(session.userId).toBeGreaterThan(0);
  expect(session.expiresAt.getTime()).toBeGreaterThan(Date.now());
}

test('ReturnType extracts async return type correctly', async () => {
  const session = await createTestSession();
  assertSessionValid(session);
});
```

---

### [Exercise] Readonly Test Data with Tuple Parameters
- **Difficulty:** Advanced
- **Description:** Define a readonly test data array of tuples, and use it to drive a parameterized test suite. TypeScript enforces both the immutability and the parameter types.

```typescript
import { test, expect } from '@playwright/test';

// 1. Define type LoginCase = [description: string, username: string, password: string, shouldPass: boolean]
// YOUR CODE HERE

// 2. Create a readonly array of LoginCase tuples with at least 2 test cases
//    (one that should pass, one that should fail)
// YOUR CODE HERE

// 3. Loop over the array and create a test for each case
//    - Navigate to the login page
//    - Fill credentials using the tuple values
//    - Submit and assert based on shouldPass
// YOUR CODE HERE
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

type LoginCase = [description: string, username: string, password: string, shouldPass: boolean];

const loginCases: readonly LoginCase[] = [
  ['Valid credentials', 'practice', 'SuperSecretPassword!', true],
  ['Invalid credentials', 'wrong', 'badpass', false],
];

for (const [description, username, password, shouldPass] of loginCases) {
  test(`Login: ${description}`, async ({ page }) => {
    await page.goto('https://practice.expandtesting.com/login');
    await page.fill('#username', username);
    await page.fill('#password', password);
    await page.click('button[type="submit"]');

    if (shouldPass) {
      await expect(page).toHaveURL(/\/secure/);
    } else {
      await expect(page.locator('#flash')).toBeVisible();
    }
  });
}
```

---

## 🧠 Flashcards — Batch 3

**Concept:** as const for Literal Type Safety
`const routes = ['/login', '/signup'] as const` narrows the inferred type from `string[]` to `readonly ['/login', '/signup']`. Use `typeof routes[number]` to derive a union type: `'/login' | '/signup'`. Prevents invalid route strings at compile time.

**Concept:** Extract<T, U> utility type
`Extract<'pass' | 'fail' | 'skip', 'pass' | 'fail'>` produces `'pass' | 'fail'` — only the members present in BOTH types. Use to create sub-types from broader status unions that are relevant to a specific test scenario.

**Concept:** Exclude<T, U> utility type
`Exclude<'pass' | 'fail' | 'skip', 'skip'>` produces `'pass' | 'fail'` — removes U members from T. Use to build a `NonSkippedStatus` type when you only want to handle tests that actually ran.

**Concept:** DeepReadonly recursive type
`type DeepReadonly<T> = { readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K] }`. Unlike `Readonly<T>` (shallow), this makes all nested properties readonly too. Apply to test config objects to prevent accidental mutation.

**Term:** keyof typeof myObj
`keyof typeof errors` where `errors = { NOT_FOUND: 404, SERVER_ERROR: 500 }` produces `'NOT_FOUND' | 'SERVER_ERROR'`. Use when you have a literal object and want a type that can only be one of its keys.

**Term:** Awaited<T>
`Awaited<Promise<string>>` unwraps to `string`. Essential for typing the resolved value of async functions: `type SessionData = Awaited<ReturnType<typeof createSession>>`. Introduced in TypeScript 4.5.

**Term:** infer keyword in conditional types
`type UnpackArray<T> = T extends (infer U)[] ? U : T` uses `infer U` to capture the element type of an array. Run `UnpackArray<Product[]>` → `Product`. Essential for building generic utility types.

**Concept:** Template Literal Types in Tests
`` type Endpoint = `/api/${string}` `` ensures only strings starting with `/api/` are accepted. Use in test helpers: `function mockEndpoint(path: Endpoint)` rejects invalid paths at compile time.

---

## 📝 Quizzes — Batch 3

### What does `as const` do to an object or array?
- [ ] Makes it a generic type
- [x] Makes it readonly with literal types preserved, preventing type widening
- [ ] Freezes the object at runtime with Object.freeze()
- [ ] Converts it to a Map

### What does `Extract<'a' | 'b' | 'c', 'a' | 'b'>` produce?
- [ ] `'c'`
- [x] `'a' | 'b'`
- [ ] `'a' | 'b' | 'c'`
- [ ] `never`

### What does `Exclude<'pass' | 'fail' | 'skip', 'skip'>` produce?
- [x] `'pass' | 'fail'`
- [ ] `'skip'`
- [ ] `never`
- [ ] All three values

### What does `keyof typeof myObject` produce?
- [ ] The values of the object as a union
- [x] The property names of the object as a string literal union type
- [ ] The type of the object itself
- [ ] A boolean checking if a key exists

### What is `Awaited<T>` used for?
- [ ] Making a type awaitable
- [x] Unwrapping the resolved type from a Promise type
- [ ] Delaying type checking until runtime
- [ ] Converting sync types to async types

### What is the difference between `Readonly<T>` and `DeepReadonly<T>`?
- [x] `Readonly<T>` only makes top-level properties readonly; `DeepReadonly<T>` makes ALL nested properties readonly
- [ ] They are identical in TypeScript 5+
- [ ] `DeepReadonly<T>` is a built-in utility type since TS 4.9
- [ ] `Readonly<T>` works on primitives; `DeepReadonly<T>` works on objects

### What does the `infer` keyword do in conditional types?
- [ ] Forces TypeScript to infer types automatically
- [x] Captures a type variable from within an extends clause for use in the return branch
- [ ] Infers the return type of any function
- [ ] Makes the type conditional on a runtime value

### What does `` type Path = `/api/${string}` `` enforce?
- [ ] The string must be exactly '/api/'
- [x] The string must start with '/api/' followed by any characters
- [ ] The string must be a valid URL
- [ ] The string must contain 'api' anywhere

---

## 🏋️ Coding Exercises — Batch 3

### [Exercise] as const with Derived Union Type
- **Difficulty:** Intermediate
- **Description:** Use `as const` on a test data array to preserve literal types, then derive a union type from it and write a type guard.

```typescript
import { test, expect } from '@playwright/test';

// 1. Create: const VALID_METHODS = ['GET', 'POST', 'PUT', 'DELETE'] as const
// YOUR CODE HERE

// 2. Derive: type HttpMethod = typeof VALID_METHODS[number]
// YOUR CODE HERE

// 3. Write isHttpMethod(m: string): m is HttpMethod
// YOUR CODE HERE

test('as const derives correct union type', () => {
  // 4. Assert isHttpMethod('GET') is true
  // 5. Assert isHttpMethod('CONNECT') is false
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

const VALID_METHODS = ['GET', 'POST', 'PUT', 'DELETE'] as const;
type HttpMethod = typeof VALID_METHODS[number];

function isHttpMethod(m: string): m is HttpMethod {
  return (VALID_METHODS as readonly string[]).includes(m);
}

test('as const derives correct union type', () => {
  expect(isHttpMethod('GET')).toBe(true);
  expect(isHttpMethod('CONNECT')).toBe(false);
});
```

---

### [Exercise] Extract and Exclude Status Types
- **Difficulty:** Intermediate
- **Description:** Use `Extract` and `Exclude` to create focused sub-types from a broader test status union and write typed handler functions for each sub-type.

```typescript
import { test, expect } from '@playwright/test';

type TestStatus = 'passed' | 'failed' | 'skipped' | 'timedOut' | 'flaky';

// 1. type FailureStatus = Extract<TestStatus, 'failed' | 'timedOut'>
// 2. type HealthyStatus = Exclude<TestStatus, 'failed' | 'timedOut' | 'flaky'>
// YOUR CODE HERE

// 3. Write isFailure(s: TestStatus): s is FailureStatus
// YOUR CODE HERE

test('Extract and Exclude narrow status unions', () => {
  expect(isFailure('failed')).toBe(true);
  expect(isFailure('timedOut')).toBe(true);
  expect(isFailure('passed')).toBe(false);
  expect(isFailure('skipped')).toBe(false);
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

type TestStatus = 'passed' | 'failed' | 'skipped' | 'timedOut' | 'flaky';
type FailureStatus = Extract<TestStatus, 'failed' | 'timedOut'>;
type HealthyStatus = Exclude<TestStatus, 'failed' | 'timedOut' | 'flaky'>;

function isFailure(s: TestStatus): s is FailureStatus {
  return s === 'failed' || s === 'timedOut';
}

test('Extract and Exclude narrow status unions', () => {
  expect(isFailure('failed')).toBe(true);
  expect(isFailure('timedOut')).toBe(true);
  expect(isFailure('passed')).toBe(false);
  expect(isFailure('skipped')).toBe(false);
});
```

---

### [Exercise] DeepReadonly Immutable Config
- **Difficulty:** Advanced
- **Description:** Implement `DeepReadonly<T>` and apply it to a nested test configuration object. Verify all nested values are accessible and TypeScript prevents mutation.

```typescript
import { test, expect } from '@playwright/test';

// 1. Implement: type DeepReadonly<T> = { readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K] }
// YOUR CODE HERE

interface FrameworkConfig {
  base: { url: string; timeout: number };
  auth: { username: string; password: string };
}

// 2. Create config: DeepReadonly<FrameworkConfig>
// YOUR CODE HERE

test('DeepReadonly makes nested properties immutable', () => {
  // 3. Assert config.base.url and config.auth.username
  // YOUR CODE HERE
  // TypeScript error (compile-time only): config.base.url = 'new' would fail
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};

interface FrameworkConfig {
  base: { url: string; timeout: number };
  auth: { username: string; password: string };
}

const config: DeepReadonly<FrameworkConfig> = {
  base: { url: 'https://practice.expandtesting.com', timeout: 30000 },
  auth: { username: 'practice', password: 'SuperSecretPassword!' },
};

test('DeepReadonly makes nested properties immutable', () => {
  expect(config.base.url).toBe('https://practice.expandtesting.com');
  expect(config.auth.username).toBe('practice');
});
```

---

## ðŸ§  Flashcards â€” Batch 4

**Concept:** Mapped Types with Modifiers
`type Mutable<T> = { -readonly [K in keyof T]: T[K] }` removes `readonly` from all properties. `type Required<T> = { [K in keyof T]-?: T[K] }` removes `?` (optionality). The `-` prefix is the "remove modifier" operator in TypeScript mapped types.

**Concept:** Record<K, V>
`Record<string, number>` is an object type with string keys and number values. Equivalent to `{ [key: string]: number }` but more readable. Use for typed dictionaries: `Record<TestName, TestResult>` maps test names to their results.

**Concept:** Mapped Type Remapping (as clause)
`type Getters<T> = { [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K] }` remaps property names. Applied to `{ name: string }` produces `{ getName: () => string }`. Use to auto-generate method names from data shapes.

**Concept:** Assertion Functions
`function assertDefined<T>(val: T | undefined): asserts val is T { if (val === undefined) throw new Error('Expected defined'); }` â€” after calling `assertDefined(x)`, TypeScript narrows `x` from `T | undefined` to `T`. Use in test helpers to assert and narrow simultaneously.

**Concept:** Overloaded Functions in TypeScript
Function overloads let you declare multiple call signatures: `function parse(input: string): object; function parse(input: Buffer): string;` with one implementation. TypeScript checks callers against the declared overloads, not the implementation signature.

**Term:** Mapped Type Iteration over Unions
`type UnionToObject<T extends string> = { [K in T]: K }` creates an object type where keys AND values are the union members. Applied to `'a' | 'b'` â†’ `{ a: 'a'; b: 'b' }`. Useful for creating reverse-lookup maps from union types.

**Term:** TypeScript satisfies operator
`const cfg = { timeout: 5000 } satisfies Partial<Config>` validates the shape WITHOUT widening. The literal type `5000` is preserved (not widened to `number`), so downstream code can use `typeof cfg.timeout` as `5000`. Different from `as`.

**Concept:** Variance in Generics (Covariance)
Covariant: `Producer<Dog>` is assignable to `Producer<Animal>` if `Dog extends Animal`. TypeScript generic types are structurally covariant for function return types. Contravariant for function parameter types. Affects how you design generic test helper functions.

---

## ðŸ“ Quizzes â€” Batch 4

### What does `type Mutable<T> = { -readonly [K in keyof T]: T[K] }` do?
- [ ] Makes all properties optional
- [x] Removes the `readonly` modifier from all properties in T
- [ ] Makes all properties required
- [ ] Adds `readonly` to all properties

### What is `Record<string, number>` equivalent to?
- [ ] `Map<string, number>`
- [x] `{ [key: string]: number }`
- [ ] `Array<[string, number]>`
- [ ] `Set<string | number>`

### What does the `satisfies` operator preserve that a type annotation does not?
- [ ] The runtime value
- [x] The literal types of values (e.g., `5000` stays `5000`, not widened to `number`)
- [ ] The mutability of the object
- [ ] The prototype chain of the object

### What is an assertion function in TypeScript?
- [ ] A function that wraps `expect()` calls
- [x] A function that throws if a condition is false and narrows the type for subsequent code
- [ ] A function decorated with `@assert`
- [ ] A Jest-style `expect` wrapper

### What is the `as` clause in a mapped type used for?
- [ ] Type casting the resulting type
- [x] Remapping property names during iteration (e.g., adding `get` prefix)
- [ ] Making properties optional
- [ ] Filtering properties from the mapped type

### What does `type UnionToObject<T extends string> = { [K in T]: K }` produce for `'a' | 'b'`?
- [ ] `'a' | 'b'`
- [x] `{ a: 'a'; b: 'b' }`
- [ ] `{ a: string; b: string }`
- [ ] `['a', 'b']`

### What are TypeScript function overloads used for?
- [ ] Running the same function in multiple threads
- [x] Declaring multiple call signatures with different argument/return type combinations
- [ ] Overriding a parent class method
- [ ] Creating generic functions

### What is covariance in TypeScript generics?
- [ ] When two generic types are identical
- [x] When a generic type with a subtype is assignable to the same generic with its supertype (e.g., Producer<Dog> assignable to Producer<Animal>)
- [ ] When a generic type has no type constraints
- [ ] When a function's return type is inferred

---

## ðŸ‹ï¸ Coding Exercises â€” Batch 4

### [Exercise] Build a Record-Based Test Registry
- **Difficulty:** Basic
- **Description:** Use `Record<string, boolean>` to build a test feature flag registry and a helper function that looks up flags by name with a typed default.

```typescript
import { test, expect } from '@playwright/test';

// 1. Define: const FLAGS: Record<string, boolean>
//    with entries: darkMode: true, betaFeature: false, experimentalApi: true
// YOUR CODE HERE

// 2. Write getFlag(name: string, defaultVal: boolean): boolean
//    Returns FLAGS[name] ?? defaultVal
// YOUR CODE HERE

test('Record feature flags', () => {
  // 3. Assert getFlag('darkMode', false) is true
  // 4. Assert getFlag('betaFeature', true) is false
  // 5. Assert getFlag('unknown', true) is true (uses default)
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

const FLAGS: Record<string, boolean> = {
  darkMode: true,
  betaFeature: false,
  experimentalApi: true,
};

function getFlag(name: string, defaultVal: boolean): boolean {
  return FLAGS[name] ?? defaultVal;
}

test('Record feature flags', () => {
  expect(getFlag('darkMode', false)).toBe(true);
  expect(getFlag('betaFeature', true)).toBe(false);
  expect(getFlag('unknown', true)).toBe(true);
});
```

---

### [Exercise] Assertion Function with Type Narrowing
- **Difficulty:** Intermediate
- **Description:** Write an assertion function that throws if a value is null/undefined and simultaneously narrows the TypeScript type. Use it in a test to eliminate null-safety checks.

```typescript
import { test, expect } from '@playwright/test';

// 1. Write: function assertDefined<T>(val: T | null | undefined, msg?: string): asserts val is T
//    Throw Error(msg ?? 'Value is null or undefined') if val is null or undefined
// YOUR CODE HERE

test('assertion function narrows null to defined', async ({ page }) => {
  await page.goto('https://playwright.dev');

  // 2. Get the first h1 textContent() â€” returns string | null
  const text = await page.locator('h1').first().textContent();

  // 3. Call assertDefined(text) â€” after this, TypeScript knows text is string
  // YOUR CODE HERE

  // 4. Use text.toUpperCase() safely (no ! needed after assertDefined)
  // YOUR CODE HERE

  expect(text.toLowerCase()).toContain('playwright');
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

function assertDefined<T>(val: T | null | undefined, msg?: string): asserts val is T {
  if (val === null || val === undefined) {
    throw new Error(msg ?? 'Value is null or undefined');
  }
}

test('assertion function narrows null to defined', async ({ page }) => {
  await page.goto('https://playwright.dev');

  const text = await page.locator('h1').first().textContent();
  assertDefined(text, 'h1 text content should not be null');

  const upper = text.toUpperCase(); // No ! needed â€” TypeScript knows it's string
  expect(upper).toContain('PLAYWRIGHT');
});
```

---

### [Exercise] Mapped Type â€” Auto-Generate Getter Interface
- **Difficulty:** Advanced
- **Description:** Use a mapped type with the `as` clause to auto-generate a `Getters<T>` type that transforms a data interface into getter methods. Apply it to a test data model.

```typescript
import { test, expect } from '@playwright/test';

// 1. Implement:
//    type Getters<T> = {
//      [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K]
//    }
// YOUR CODE HERE

interface TestUser {
  name: string;
  email: string;
  age: number;
}

// Getters<TestUser> should produce:
// { getName: () => string; getEmail: () => string; getAge: () => number }

// 2. Create a factory function createGetters<T>(data: T): Getters<T>
//    that returns an object with getter methods wrapping each property
// YOUR CODE HERE

test('Getters mapped type generates getter methods', () => {
  const user: TestUser = { name: 'Vuong', email: 'v@test.com', age: 28 };
  // 3. Call createGetters(user) and assert each getter
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

interface TestUser {
  name: string;
  email: string;
  age: number;
}

function createGetters<T>(data: T): Getters<T> {
  const result = {} as Getters<T>;
  for (const key in data) {
    const getterName = `get${key.charAt(0).toUpperCase()}${key.slice(1)}`;
    (result as Record<string, unknown>)[getterName] = () => data[key];
  }
  return result;
}

test('Getters mapped type generates getter methods', () => {
  const user: TestUser = { name: 'Vuong', email: 'v@test.com', age: 28 };
  const getters = createGetters(user);

  expect((getters as Record<string, () => unknown>).getName()).toBe('Vuong');
  expect((getters as Record<string, () => unknown>).getEmail()).toBe('v@test.com');
  expect((getters as Record<string, () => unknown>).getAge()).toBe(28);
});
```
