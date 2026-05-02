# 16 — API Testing, CI/CD & Reporting Mastery

Master Playwright's API testing capabilities, CI/CD pipeline integration with GitHub Actions, and advanced Allure reporting configurations for professional QA workflows.

---

## 🧠 Flashcards

**Concept:** Playwright API Testing (request fixture)
Playwright includes a built-in `request` fixture for making HTTP API calls without a browser. Use `request.get()`, `request.post()`, `request.put()`, `request.delete()`. This is faster than UI testing and perfect for contract testing.

**Concept:** APIRequestContext
The `APIRequestContext` object (provided by the `request` fixture) manages HTTP sessions, including cookies, headers, and base URL. You can create isolated contexts with `playwright.request.newContext({ baseURL: '...' })` for different authentication states.

**Concept:** API Response Assertions
After an API call, assert: `expect(response.ok()).toBeTruthy()` (2xx status), `expect(response.status()).toBe(201)`, `const body = await response.json(); expect(body.id).toBeDefined()`. The `response.json()` method parses the JSON body.

**Concept:** GitHub Actions Playwright Workflow
A standard GitHub Actions workflow for Playwright: checkout repo → setup Node → install deps (`npm ci`) → install browsers (`npx playwright install --with-deps`) → run tests (`npx playwright test`) → upload test artifacts (HTML report, traces) using `actions/upload-artifact`.

**Concept:** Allure Test Lifecycle Hooks
Allure captures test lifecycle data automatically. Augment it with: `allure.parameter('environment', 'staging')` for parameterized data, `allure.attachment('response.json', body, 'application/json')` for attaching API responses, and `allure.link('https://jira.com/PROJ-123', 'Jira Ticket')` for traceability.

**Concept:** Test Sharding
Playwright supports sharding to split tests across multiple CI machines: `npx playwright test --shard=1/4` runs the first quarter of tests. Combine all shard reports with `npx playwright merge-reports`. Dramatically reduces total CI time for large suites.

**Concept:** HTML Reporter
`reporter: 'html'` generates a self-contained HTML report in the `playwright-report/` folder. Open with `npx playwright show-report`. It shows passed/failed/skipped counts, per-test timelines, error screenshots, traces, and video recordings.

**Concept:** Multiple Reporters
You can configure multiple reporters simultaneously: `reporter: [['html'], ['allure-playwright'], ['junit', { outputFile: 'results.xml' }]]`. This generates an HTML report, Allure data, and a JUnit XML file (required by many CI systems like Jenkins).

**Concept:** Environment-Specific Config
Use `process.env.NODE_ENV` or custom env vars to switch config between environments: `baseURL: process.env.BASE_URL ?? 'http://localhost:3000'`. Store environment-specific values in `.env.staging`, `.env.prod` files and load them with `dotenv`.

**Concept:** Retry with CI Detection
Best practice: `retries: process.env.CI ? 2 : 0`. In local dev, retries mask real failures. In CI, retries filter transient network issues. This pattern ensures fast feedback locally while protecting CI reliability.

**Concept:** Contract Testing
Contract testing verifies that an API response matches a predefined schema (the "contract"). In Playwright, fetch an API, then validate the response structure with a type guard or JSON Schema library (like `ajv`). Catches breaking API changes before UI tests run.

**Term:** response.ok()
Returns `true` if the HTTP status code is in the 200-299 range. More semantic than `response.status() >= 200`. Use `expect(response.ok()).toBeTruthy()` as a first-pass assertion on any API call.

**Term:** response.headers()
Returns all HTTP response headers as a `Record<string, string>`. Use to assert content-type: `expect(response.headers()['content-type']).toContain('application/json')`. Essential for API contract testing.

**Term:** test.use({ storageState })
Override the storage state for a specific `test.describe` block: `test.use({ storageState: 'admin-auth.json' })`. This lets different describe blocks run with different authenticated users in the same test file.

**Term:** Allure Step Nesting
`AllureHelpers.step()` calls can be nested. An outer step 'Checkout Flow' contains inner steps 'Enter shipping', 'Enter payment', 'Confirm order'. This creates a tree of steps in the Allure report, making test intent immediately readable to stakeholders.

**Term:** junit reporter
The JUnit XML reporter (`['junit', { outputFile: 'results.xml' }]`) outputs test results in a format understood by Jenkins, Azure DevOps, and other CI systems. It enables test result trending graphs and failure notifications in the CI dashboard.

**Concept:** Playwright Test Timeout Hierarchy
Timeout levels from most specific to least: `test.setTimeout()` (per test) → `expect.configure({ timeout })` (per assertion) → `use: { actionTimeout }` (per action) → `use: { navigationTimeout }` (per navigation) → `timeout` (global default in config). More specific settings override less specific ones.

**Concept:** Flaky Test Detection
Run with `--repeat-each=5` to run every test 5 times and identify flaky tests. Combine with `--reporter=html` to see pass/fail distribution across repetitions. Flaky tests should be tagged `@flaky` and investigated, not simply retried indefinitely.

**Concept:** API Authentication Strategies
For authenticated API tests in Playwright: (1) Set bearer token in headers: `request.get(url, { headers: { Authorization: 'Bearer ' + token } })`. (2) Use `storageState` for session cookies. (3) Create a pre-authenticated `APIRequestContext` in `globalSetup`.

**Concept:** Allure Severity Levels
Allure severity: `blocker` (prevents release), `critical` (core functionality), `normal` (standard features), `minor` (nice-to-have), `trivial` (cosmetic). Use these to triage failures — a failed `blocker` test should halt the pipeline immediately.

---

## 📝 Quizzes

### What fixture do you use for Playwright API testing (without a browser)?
- [ ] `page`
- [ ] `browser`
- [x] `request`
- [ ] `apiClient`

### What does `response.ok()` return?
- [ ] The response body
- [ ] True if the response has no errors
- [x] True if the HTTP status code is in the 200-299 range
- [ ] True if all assertions on the response passed

### What is test sharding used for?
- [ ] Running one test in multiple browsers simultaneously
- [x] Splitting a test suite across multiple CI machines to reduce total run time
- [ ] Dividing a single test into multiple steps
- [ ] Running tests in a randomised order

### What does `retries: process.env.CI ? 2 : 0` do?
- [ ] Always retries failed tests 2 times
- [ ] Disables retries in CI to catch failures faster
- [x] Enables retries only in CI to filter transient failures, keeping local runs fast
- [ ] Sets retries based on the number of CI machines

### How do you set a different authenticated user for a specific describe block?
- [ ] `test.describe({ auth: 'admin' }, () => {})`
- [x] `test.use({ storageState: 'admin-auth.json' })` inside the describe block
- [ ] `test.beforeEach(async ({ page }) => page.authenticate('admin'))`
- [ ] Pass the user as a parameter to `test.describe()`

### Which command merges reports from multiple Playwright shards?
- [ ] `npx playwright combine-reports`
- [ ] `npx playwright report --merge`
- [x] `npx playwright merge-reports`
- [ ] `npx playwright test --merge-output`

### What does `response.headers()` return?
- [ ] An array of header names
- [ ] Only the content-type header
- [x] All HTTP response headers as a `Record<string, string>`
- [ ] The request headers, not response headers

### Which Allure severity should a test have if its failure should halt the release pipeline?
- [ ] `critical`
- [x] `blocker`
- [ ] `normal`
- [ ] `major`

### How do you run each test 5 times to detect flaky tests?
- [ ] `npx playwright test --flaky-check=5`
- [ ] `npx playwright test --workers=5`
- [x] `npx playwright test --repeat-each=5`
- [ ] `npx playwright test --retries=5`

### What does `test.use({ storageState })` override?
- [ ] The browser type for that describe block
- [ ] The base URL for that describe block
- [x] The storage state (cookies/localStorage) for tests in that describe block
- [ ] The reporter for that describe block

### In GitHub Actions, what is the correct command to install Playwright browsers?
- [ ] `npx playwright install`
- [x] `npx playwright install --with-deps`
- [ ] `npm install @playwright/browsers`
- [ ] `npx playwright setup`

### What is the purpose of `allure.attachment()`?
- [ ] Creates a link to an external resource in the report
- [x] Embeds a file or string (like a JSON response body) directly into the Allure report
- [ ] Attaches a screenshot to the test step
- [ ] Tags the test with a category

---

## 🏋️ Coding Exercises

### [Exercise] Basic API GET Request and Assertion
- **Difficulty:** Basic
- **Description:** Use the Playwright `request` fixture to make a GET call to a public API and validate the response status code and a field in the JSON body.

```typescript
import { test, expect } from '@playwright/test';

test('GET /users/1 returns valid user', async ({ request }) => {
  // 1. Make a GET request to 'https://jsonplaceholder.typicode.com/users/1'
  // YOUR CODE HERE

  // 2. Assert the response status is 200
  // YOUR CODE HERE

  // 3. Assert response.ok() is truthy
  // YOUR CODE HERE

  // 4. Parse the JSON body and assert body.id === 1
  // YOUR CODE HERE

  // 5. Assert body.email contains '@' character
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

test('GET /users/1 returns valid user', async ({ request }) => {
  const response = await request.get('https://jsonplaceholder.typicode.com/users/1');

  expect(response.status()).toBe(200);
  expect(response.ok()).toBeTruthy();

  const body = await response.json();
  expect(body.id).toBe(1);
  expect(body.email).toContain('@');
});
```

---

### [Exercise] API POST Request - Create a Resource
- **Difficulty:** Basic
- **Description:** Make a POST request with a JSON body to create a new resource. Assert the response returns a 201 Created status and the response body contains the created resource's ID.

```typescript
import { test, expect } from '@playwright/test';

test('POST /posts creates a new post', async ({ request }) => {
  const newPost = {
    title: 'Playwright API Testing',
    body: 'This post was created by a Playwright test.',
    userId: 1,
  };

  // 1. Make a POST to 'https://jsonplaceholder.typicode.com/posts'
  //    with JSON body using: request.post(url, { data: newPost })
  // YOUR CODE HERE

  // 2. Assert status is 201
  // YOUR CODE HERE

  // 3. Parse body and assert body.title matches newPost.title
  // YOUR CODE HERE

  // 4. Assert body.id is defined (a new id was assigned)
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

test('POST /posts creates a new post', async ({ request }) => {
  const newPost = {
    title: 'Playwright API Testing',
    body: 'This post was created by a Playwright test.',
    userId: 1,
  };

  const response = await request.post('https://jsonplaceholder.typicode.com/posts', {
    data: newPost,
  });

  expect(response.status()).toBe(201);

  const body = await response.json();
  expect(body.title).toBe(newPost.title);
  expect(body.id).toBeDefined();
});
```

---

### [Exercise] Assert Response Headers
- **Difficulty:** Basic
- **Description:** Make an API call and validate the response headers — specifically the content-type to confirm the server is returning JSON, not HTML or plain text.

```typescript
import { test, expect } from '@playwright/test';

test('API response has correct content-type header', async ({ request }) => {
  const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');

  // 1. Get the response headers using response.headers()
  // YOUR CODE HERE

  // 2. Assert the 'content-type' header contains 'application/json'
  // YOUR CODE HERE

  // 3. Assert the response status is 200
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

test('API response has correct content-type header', async ({ request }) => {
  const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');

  const headers = response.headers();
  expect(headers['content-type']).toContain('application/json');
  expect(response.status()).toBe(200);
});
```

---

### [Exercise] Full CRUD API Test Suite
- **Difficulty:** Intermediate
- **Description:** Write a complete CRUD test suite that creates a resource, reads it back, updates it, and deletes it. Use `test.describe` to group all operations and share the resource ID via a closure variable.

```typescript
import { test, expect } from '@playwright/test';

const BASE = 'https://jsonplaceholder.typicode.com';

test.describe('Posts CRUD API', () => {
  let postId: number;

  // 1. Write a test 'CREATE - POST /posts' that:
  //    - Creates a post and stores the returned id in postId
  // YOUR CODE HERE

  // 2. Write a test 'READ - GET /posts/:id' that:
  //    - GETs the post using postId (use test.skip if postId is undefined)
  // YOUR CODE HERE

  // 3. Write a test 'UPDATE - PUT /posts/:id' that:
  //    - PUTs an updated title using postId
  //    - Asserts the response title changed
  // YOUR CODE HERE

  // 4. Write a test 'DELETE - DELETE /posts/:id' that:
  //    - DELETEs the post using postId
  //    - Asserts status is 200
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

const BASE = 'https://jsonplaceholder.typicode.com';

test.describe('Posts CRUD API', () => {
  let postId: number;

  test('CREATE - POST /posts', async ({ request }) => {
    const res = await request.post(`${BASE}/posts`, {
      data: { title: 'CRUD Test Post', body: 'Content', userId: 1 },
    });
    expect(res.status()).toBe(201);
    const body = await res.json();
    postId = body.id;
    expect(postId).toBeDefined();
  });

  test('READ - GET /posts/:id', async ({ request }) => {
    test.skip(!postId, 'Skipped: CREATE test did not run');
    const res = await request.get(`${BASE}/posts/${postId}`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.id).toBe(postId);
  });

  test('UPDATE - PUT /posts/:id', async ({ request }) => {
    test.skip(!postId, 'Skipped: CREATE test did not run');
    const res = await request.put(`${BASE}/posts/${postId}`, {
      data: { title: 'Updated Title', body: 'Updated', userId: 1, id: postId },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.title).toBe('Updated Title');
  });

  test('DELETE - DELETE /posts/:id', async ({ request }) => {
    test.skip(!postId, 'Skipped: CREATE test did not run');
    const res = await request.delete(`${BASE}/posts/${postId}`);
    expect(res.status()).toBe(200);
  });
});
```

---

### [Exercise] API Test with Bearer Token Authentication
- **Difficulty:** Intermediate
- **Description:** Create an `APIRequestContext` with a pre-set Authorization header using a bearer token. Use it to make authenticated requests. This pattern replaces per-request header setting.

```typescript
import { test, expect, request as playwrightRequest } from '@playwright/test';

test('authenticated API request with bearer token', async () => {
  // 1. Create a new APIRequestContext with:
  //    - baseURL: 'https://gorest.co.in'
  //    - extraHTTPHeaders: { Authorization: 'Bearer YOUR_TOKEN_HERE' }
  //    Use: const apiContext = await playwrightRequest.newContext({ ... })
  // YOUR CODE HERE

  // 2. Make a GET to '/public/v2/users'
  // YOUR CODE HERE

  // 3. Assert the response status is 200
  // YOUR CODE HERE

  // 4. Dispose the context after use
  //    await apiContext.dispose()
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect, request as playwrightRequest } from '@playwright/test';

test('authenticated API request with bearer token', async () => {
  const apiContext = await playwrightRequest.newContext({
    baseURL: 'https://gorest.co.in',
    extraHTTPHeaders: {
      Authorization: `Bearer ${process.env.GOREST_TOKEN ?? 'demo-token'}`,
    },
  });

  const response = await apiContext.get('/public/v2/users');
  expect(response.status()).toBe(200);

  await apiContext.dispose();
});
```

---

### [Exercise] Write a GitHub Actions Playwright Workflow
- **Difficulty:** Intermediate
- **Description:** Write the complete content of a `.github/workflows/playwright.yml` file that runs Playwright tests on push to main, uploads HTML reports as artifacts, and posts test results summary.

```typescript
// This is a YAML exercise. Write the GitHub Actions workflow config.
// The expected YAML should contain:

// 1. name: Playwright Tests
// 2. Trigger: on push to 'main' and pull_request to 'main'
// 3. jobs.test with runs-on: ubuntu-latest
// 4. Steps:
//    a. actions/checkout@v4
//    b. actions/setup-node@v4 with node-version: '20'
//    c. npm ci
//    d. npx playwright install --with-deps
//    e. npx playwright test
//    f. actions/upload-artifact@v4 to upload playwright-report/ on failure

// Write the full YAML below:
// YOUR CODE HERE
```

### Solution
```typescript
// name: Playwright Tests
//
// on:
//   push:
//     branches: [main]
//   pull_request:
//     branches: [main]
//
// jobs:
//   test:
//     runs-on: ubuntu-latest
//     steps:
//       - uses: actions/checkout@v4
//
//       - uses: actions/setup-node@v4
//         with:
//           node-version: '20'
//
//       - name: Install dependencies
//         run: npm ci
//
//       - name: Install Playwright browsers
//         run: npx playwright install --with-deps
//
//       - name: Run Playwright tests
//         run: npx playwright test
//
//       - name: Upload HTML report
//         uses: actions/upload-artifact@v4
//         if: failure()
//         with:
//           name: playwright-report
//           path: playwright-report/
//           retention-days: 30
```

---

### [Exercise] Allure-Decorated API Test
- **Difficulty:** Intermediate
- **Description:** Write an API test fully decorated with Allure metadata — Epic, Feature, Story, Severity, and attach the raw JSON response body as an Allure attachment for traceability.

```typescript
import { test, expect } from '@playwright/test';
import { AllureHelpers, AutomationExerciseTestData } from '@utils/allure-helpers';

test('GET /users returns paginated list @regression', async ({ request }) => {
  // 1. Add Allure metadata:
  //    AllureHelpers.addEpic('API Contract Tests')
  //    AllureHelpers.addFeature('User Management')
  //    AllureHelpers.addStory('List Users')
  //    AllureHelpers.addSeverity('normal')
  //    AllureHelpers.addTestId('API-TC-001')
  // YOUR CODE HERE

  // 2. Wrap the API call in an AllureHelpers.step('Fetch user list', ...)
  //    Make GET request to 'https://jsonplaceholder.typicode.com/users'
  //    Assert status is 200
  //    Assert body is an array with 10 items
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';
import { AllureHelpers } from '@utils/allure-helpers';

test('GET /users returns paginated list @regression', async ({ request }) => {
  AllureHelpers.addEpic('API Contract Tests');
  AllureHelpers.addFeature('User Management');
  AllureHelpers.addStory('List Users');
  AllureHelpers.addSeverity('normal');
  AllureHelpers.addTestId('API-TC-001');

  await AllureHelpers.step('Fetch user list and validate', async () => {
    const response = await request.get('https://jsonplaceholder.typicode.com/users');
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body).toHaveLength(10);
  });
});
```

---

### [Exercise] Shard-Ready Parallel API Test Suite
- **Difficulty:** Advanced
- **Description:** Write a data-driven API test suite structured so it can be safely run in parallel (shard-compatible). Each test is fully independent — no shared state between tests.

```typescript
import { test, expect } from '@playwright/test';

const userIds = [1, 2, 3, 4, 5];

// 1. Use test.describe.parallel() so all user tests run in parallel
// 2. Loop over userIds
// 3. For each userId, create a fully independent test that:
//    - Makes a GET to `https://jsonplaceholder.typicode.com/users/${userId}`
//    - Asserts status 200
//    - Asserts body.id === userId
//    - Asserts body.email contains '@'
// YOUR CODE HERE
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

const userIds = [1, 2, 3, 4, 5];

test.describe.parallel('User API - All Users', () => {
  for (const userId of userIds) {
    test(`GET /users/${userId} returns correct user`, async ({ request }) => {
      const response = await request.get(
        `https://jsonplaceholder.typicode.com/users/${userId}`
      );

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.id).toBe(userId);
      expect(body.email).toContain('@');
    });
  }
});
```

---

### [Exercise] Contract Test with Schema Validation
- **Difficulty:** Advanced
- **Description:** Implement a contract test that validates an API response against a strict expected schema. Define an interface as the "contract" and use a type guard to validate every field — failing the test with a detailed message if the contract is broken.

```typescript
import { test, expect } from '@playwright/test';

interface PostContract {
  userId: number;
  id: number;
  title: string;
  body: string;
}

function assertMatchesContract(data: unknown, contractName: string): asserts data is PostContract {
  // 1. Check data is a non-null object
  // 2. Check userId, id are numbers
  // 3. Check title, body are non-empty strings
  // 4. If any check fails, throw Error with a descriptive message including contractName
  // YOUR CODE HERE
}

test('GET /posts/1 matches PostContract', async ({ request }) => {
  const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');
  expect(response.status()).toBe(200);

  const body: unknown = await response.json();

  // 5. Use assertMatchesContract to validate the body
  // YOUR CODE HERE

  // 6. After validation, assert specific field values
  //    e.g., body.userId should be 1
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

interface PostContract {
  userId: number;
  id: number;
  title: string;
  body: string;
}

function assertMatchesContract(data: unknown, contractName: string): asserts data is PostContract {
  if (typeof data !== 'object' || data === null) {
    throw new Error(`${contractName}: Expected an object, got ${typeof data}`);
  }
  const d = data as Record<string, unknown>;
  if (typeof d.userId !== 'number') throw new Error(`${contractName}: 'userId' must be a number`);
  if (typeof d.id !== 'number')     throw new Error(`${contractName}: 'id' must be a number`);
  if (typeof d.title !== 'string' || !d.title) throw new Error(`${contractName}: 'title' must be a non-empty string`);
  if (typeof d.body !== 'string' || !d.body)   throw new Error(`${contractName}: 'body' must be a non-empty string`);
}

test('GET /posts/1 matches PostContract', async ({ request }) => {
  const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');
  expect(response.status()).toBe(200);

  const body: unknown = await response.json();

  assertMatchesContract(body, 'PostContract');

  expect(body.userId).toBe(1);
  expect(body.id).toBe(1);
});
```

---

## 🧠 More Flashcards

**Concept:** request.patch()
`await request.patch(url, { data: partialPayload })` sends an HTTP PATCH request to partially update a resource. Unlike PUT (full replacement), PATCH only modifies the specified fields. Assert both `status 200` and that only the patched fields changed.

**Concept:** Response Body as Text
`await response.text()` returns the raw response body as a string. Use instead of `.json()` when the API returns non-JSON content (XML, plain text, HTML). Always check `Content-Type` header first to decide which parser to use.

**Concept:** API Test Fixtures
Create a custom `apiRequest` fixture that provides a pre-configured `APIRequestContext` with `baseURL` and auth headers pre-set. This eliminates boilerplate `newContext()` calls in every API test file.

**Concept:** Polling with expect.poll()
`await expect.poll(async () => await someAsyncCheck(), { timeout: 10000 }).toBe(true)` re-evaluates the function until it returns the expected value or times out. Use for testing eventual consistency — e.g., a background job that eventually completes.

**Term:** response.body()
Returns the response body as a `Buffer`. Use for binary responses (images, PDFs, downloads) where `.json()` or `.text()` would fail. Check `content-type` first, then `Buffer.from(await response.body()).toString()` for text inspection.

**Term:** request.fetch()
`await request.fetch(url, { method, data, headers })` is the low-level fetch method underlying all other request methods. Use when you need complete control over the request — custom methods (PATCH, HEAD, OPTIONS) or non-standard configurations.

**Concept:** Playwright API + UI Hybrid Test
A hybrid test uses the `request` fixture to create data via API (fast and reliable), then uses `page` to verify the UI displays it correctly. This is faster than a pure UI flow while still providing end-to-end confidence.

**Concept:** GitHub Actions Matrix Strategy
Use `strategy: matrix: { browser: [chromium, firefox, webkit] }` in GitHub Actions to run the same Playwright tests in multiple browsers in parallel. Each matrix job is independent and uploads its own report artifact.

---

## 📝 More Quizzes

### What is the difference between `request.put()` and `request.patch()`?
- [ ] They are identical — use either
- [x] `put()` fully replaces a resource; `patch()` partially updates only specified fields
- [ ] `patch()` is for binary data; `put()` is for JSON
- [ ] `put()` requires authentication; `patch()` does not

### What does `response.text()` return?
- [ ] The response as a parsed JSON object
- [x] The raw response body as a string
- [ ] Only the first line of the response
- [ ] The response headers as a text block

### What is `expect.poll()` used for?
- [ ] Pausing a test for a fixed duration
- [ ] Running an assertion exactly once
- [x] Re-evaluating an async function until it returns the expected value (eventual consistency)
- [ ] Polling the test queue for pending tests

### What does `response.body()` return?
- [ ] The response as a JSON object
- [ ] A readable stream
- [x] The response body as a Buffer (binary data)
- [ ] A string of the response body

### What is the benefit of a hybrid API + UI test?
- [ ] It runs in two browsers simultaneously
- [x] API creates test data quickly and reliably; UI verifies display — combining speed with confidence
- [ ] It tests both REST and GraphQL in one test
- [ ] It requires no browser setup

### How do you run Playwright tests in multiple browsers in GitHub Actions?
- [ ] Use `npx playwright test --all-browsers` in one job
- [x] Use `strategy: matrix: { browser: [...] }` to create parallel jobs per browser
- [ ] Install all browsers in one job and run sequentially
- [ ] Use `projects` in playwright.config.ts — GitHub Actions handles browsers automatically

### What is an API Test Fixture used for?
- [ ] Mocking API responses in UI tests
- [x] Providing a pre-configured APIRequestContext with base URL and auth headers to avoid boilerplate
- [ ] Replacing page fixtures for API-only tests
- [ ] Caching API responses between test runs

### What does `request.fetch()` do that `request.get()` doesn't?
- [ ] It is faster
- [ ] It supports authentication
- [x] It gives complete control over the HTTP method and all request options (including HEAD, OPTIONS)
- [ ] It parses the JSON body automatically

---

## 🏋️ More Coding Exercises

### [Exercise] PATCH Request — Partial Update
- **Difficulty:** Basic
- **Description:** Send a PATCH request to partially update a resource. Assert only the patched field changed while the other fields remain intact.

```typescript
import { test, expect } from '@playwright/test';

test('PATCH /posts/1 partially updates title', async ({ request }) => {
  // 1. Send a PATCH to 'https://jsonplaceholder.typicode.com/posts/1'
  //    with data: { title: 'Patched Title' }
  // YOUR CODE HERE

  // 2. Assert status is 200
  // YOUR CODE HERE

  // 3. Parse body and assert body.title is 'Patched Title'
  // YOUR CODE HERE

  // 4. Assert body.id is still 1 (unchanged)
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

test('PATCH /posts/1 partially updates title', async ({ request }) => {
  const response = await request.patch('https://jsonplaceholder.typicode.com/posts/1', {
    data: { title: 'Patched Title' },
  });

  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body.title).toBe('Patched Title');
  expect(body.id).toBe(1);
});
```

---

### [Exercise] Hybrid API + UI Test
- **Difficulty:** Intermediate
- **Description:** Use the `request` fixture to verify an API endpoint directly, then use `page` to navigate to the UI and verify the same data is displayed. This hybrid approach gives both speed and full-stack confidence.

```typescript
import { test, expect } from '@playwright/test';

test('API and UI show consistent post data', async ({ request, page }) => {
  // 1. Use request to GET post 1 from jsonplaceholder
  // YOUR CODE HERE

  // 2. Assert status is 200 and extract the title from the JSON body
  // YOUR CODE HERE

  // 3. Navigate to 'https://jsonplaceholder.typicode.com/posts'
  //    (this page shows raw JSON in the browser)
  // YOUR CODE HERE

  // 4. Assert that the raw page content contains the title you extracted from the API
  //    Use: expect(page.locator('body')).toContainText(apiTitle)
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

test('API and UI show consistent post data', async ({ request, page }) => {
  const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');
  expect(response.status()).toBe(200);
  const post = await response.json();
  const apiTitle = post.title as string;

  await page.goto('https://jsonplaceholder.typicode.com/posts/1');
  await expect(page.locator('body')).toContainText(apiTitle);
});
```

---

### [Exercise] Create a Reusable API Fixture
- **Difficulty:** Intermediate
- **Description:** Build a custom `apiClient` fixture that provides a pre-configured `APIRequestContext` with `baseURL` set. Use it to make clean, boilerplate-free API calls across multiple tests.

```typescript
import { test as base, expect, APIRequestContext } from '@playwright/test';

// 1. Extend base test with an apiClient fixture
//    - type: { apiClient: APIRequestContext }
//    - Inside, create an APIRequestContext with baseURL 'https://jsonplaceholder.typicode.com'
//    - yield with use(apiClient)
//    - dispose the context after use
// YOUR CODE HERE

const test = /* YOUR EXTENDED TEST HERE */;

test('GET /posts using reusable apiClient fixture', async ({ apiClient }) => {
  // 2. Use apiClient.get('/posts') to fetch all posts
  // YOUR CODE HERE

  // 3. Assert status is 200 and body is an array
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test as base, expect, APIRequestContext, request as playwrightRequest } from '@playwright/test';

const test = base.extend<{ apiClient: APIRequestContext }>({
  apiClient: async ({}, use) => {
    const apiClient = await playwrightRequest.newContext({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
    await use(apiClient);
    await apiClient.dispose();
  },
});

test('GET /posts using reusable apiClient fixture', async ({ apiClient }) => {
  const response = await apiClient.get('/posts');
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(Array.isArray(body)).toBe(true);
});
```

---

### [Exercise] Use expect.poll() for Eventual Consistency
- **Difficulty:** Advanced
- **Description:** Use `expect.poll()` to repeatedly check an API endpoint until a resource transitions to an expected state. This simulates testing async background jobs.

```typescript
import { test, expect } from '@playwright/test';

test('expect.poll() waits for eventual state change', async ({ request }) => {
  let callCount = 0;

  // Simulate an API that returns 'processing' twice then 'done'
  // (In a real test, replace this with an actual API call)
  const checkStatus = async (): Promise<string> => {
    callCount++;
    if (callCount < 3) return 'processing';
    return 'done';
  };

  // 1. Use expect.poll() to call checkStatus until it returns 'done'
  //    Set a timeout of 5000ms and interval of 100ms
  // YOUR CODE HERE

  // 2. Assert callCount is 3 (it polled 3 times)
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

test('expect.poll() waits for eventual state change', async ({ request }) => {
  let callCount = 0;

  const checkStatus = async (): Promise<string> => {
    callCount++;
    if (callCount < 3) return 'processing';
    return 'done';
  };

  await expect.poll(checkStatus, {
    timeout: 5000,
    intervals: [100],
  }).toBe('done');

  expect(callCount).toBe(3);
});
```
```

---

## 🧠 Flashcards — Batch 3

**Concept:** API-First Test Strategy
Write API-layer tests first to validate business logic independently of the UI. UI tests then act as a thin layer that confirms the API output is correctly displayed. This layered approach gives faster feedback — API tests run in milliseconds; UI tests in seconds.

**Concept:** response.url()
`response.url()` returns the final URL after all redirects. Use when testing redirecting APIs (301/302) to assert the final destination is correct, not just the initial request URL.

**Concept:** request.put() vs request.patch()
`PUT` replaces a resource entirely — omitted fields revert to defaults/null. `PATCH` partially updates — only the fields you send change. Always verify the difference: after a PUT, assert all fields; after a PATCH, assert only the changed field and verify others are untouched.

**Concept:** Parallel API Tests with Independent Data
Each parallel API test must be fully self-contained — create its own data, test it, and delete it in teardown. Never share IDs or state between parallel tests. Use `test.afterEach` to clean up, even on test failure.

**Concept:** Response Time Assertions
After an API call, check performance: `const start = Date.now(); await request.get(url); const elapsed = Date.now() - start; expect(elapsed).toBeLessThan(2000)`. This catches performance regressions before they reach production.

**Term:** request.storageState()
`await request.storageState({ path: 'api-auth.json' })` saves the current API context's cookies and localStorage. Load it later with `playwrightRequest.newContext({ storageState: 'api-auth.json' })` to reuse an API session across tests.

**Term:** response.statusText()
Returns the HTTP status message string: `'OK'`, `'Created'`, `'Not Found'`. Less commonly asserted than `status()` but useful when debugging or asserting specific error messages from non-standard API implementations.

**Term:** APIResponse.dispose()
`await response.dispose()` explicitly frees the memory held by a large response body. Playwright auto-disposes responses when a request context is disposed, but calling it manually is good practice for large file downloads in long-running tests.

**Concept:** GraphQL API Testing
Playwright can test GraphQL APIs via POST requests: `request.post('/graphql', { data: { query: '{ users { id name } }' } })`. Assert the response `data` key contains the expected shape. No special GraphQL library needed.

**Concept:** WebSocket Testing
`page.on('websocket', ws => ...)` listens for WebSocket connections. `ws.on('framesent', ...)` and `ws.on('framereceived', ...)` let you capture messages. Assert the correct messages are exchanged in real-time features.

---

## 📝 Quizzes — Batch 3

### What is an API-First test strategy?
- [ ] Building the API before the UI in development
- [x] Writing API-layer tests to validate logic, with UI tests as a thin display-verification layer
- [ ] Skipping UI tests and testing only the API
- [ ] Using API calls inside UI tests instead of form interactions

### What does `response.url()` return?
- [ ] The URL that was originally requested
- [x] The final URL after all redirects have been followed
- [ ] The base URL of the API context
- [ ] The URL of the last page navigation

### What is the key difference between testing PUT vs PATCH?
- [ ] They are tested identically
- [x] After PUT assert all fields; after PATCH only assert the changed field and verify others are unchanged
- [ ] PUT requires authentication; PATCH does not
- [ ] PATCH can only update one field; PUT can update many

### What should every parallel API test do to avoid state conflicts?
- [ ] Use shared test data created in globalSetup
- [ ] Run in a single worker with a lock
- [x] Create its own data, test it, and clean it up in afterEach — fully self-contained
- [ ] Use a fixed set of IDs reserved for parallel tests

### How do you test API response performance in Playwright?
- [ ] Use a special `performanceTest()` API
- [x] Record `Date.now()` before and after the request, then `expect(elapsed).toBeLessThan(threshold)`
- [ ] Use `response.timing()` method
- [ ] Enable `performanceMode: true` in playwright.config.ts

### What does `response.statusText()` return?
- [ ] The full response body as a string
- [x] The HTTP status message like 'OK', 'Created', or 'Not Found'
- [ ] A human-readable description of the error
- [ ] The custom error message from the API body

### How do you test a GraphQL API with Playwright?
- [ ] Install @playwright/graphql package
- [x] Use `request.post('/graphql', { data: { query: '...' } })` and assert the `data` key in the response
- [ ] Use the `graphql` fixture provided by Playwright
- [ ] Convert GraphQL to REST first, then test normally

### What does `page.on('websocket', ws => ...)` allow?
- [ ] Sending WebSocket messages from the test
- [x] Listening to WebSocket connections opened by the page and capturing frames sent/received
- [ ] Mocking WebSocket connections with fake data
- [ ] Only closing WebSocket connections

---

## 🏋️ Coding Exercises — Batch 3

### [Exercise] Assert API Response Time
- **Difficulty:** Basic
- **Description:** Measure and assert that an API endpoint responds within an acceptable time threshold. This is a simple performance regression check.

```typescript
import { test, expect } from '@playwright/test';

test('API responds within 2 seconds', async ({ request }) => {
  // 1. Record start time using Date.now()
  // YOUR CODE HERE

  // 2. Make a GET to 'https://jsonplaceholder.typicode.com/posts'
  // YOUR CODE HERE

  // 3. Record end time and calculate elapsed
  // YOUR CODE HERE

  // 4. Assert response status is 200
  // YOUR CODE HERE

  // 5. Assert elapsed < 2000ms
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

test('API responds within 2 seconds', async ({ request }) => {
  const start = Date.now();
  const response = await request.get('https://jsonplaceholder.typicode.com/posts');
  const elapsed = Date.now() - start;

  expect(response.status()).toBe(200);
  expect(elapsed).toBeLessThan(2000);
});
```

---

### [Exercise] GET with Final URL After Redirect
- **Difficulty:** Basic
- **Description:** Make a request that may follow redirects and assert the final URL is what you expect, using `response.url()`.

```typescript
import { test, expect } from '@playwright/test';

test('response URL reflects final destination after redirects', async ({ request }) => {
  // 1. Make a GET request to 'https://jsonplaceholder.typicode.com/posts/1'
  // YOUR CODE HERE

  // 2. Assert the response status is 200
  // YOUR CODE HERE

  // 3. Assert response.url() is the expected final URL
  //    (no redirects for this endpoint, but the pattern shows the usage)
  // YOUR CODE HERE

  // 4. Assert response.statusText() is 'OK'
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

test('response URL reflects final destination after redirects', async ({ request }) => {
  const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');

  expect(response.status()).toBe(200);
  expect(response.url()).toContain('/posts/1');
  expect(response.statusText()).toBe('OK');
});
```

---

### [Exercise] GraphQL API Test
- **Difficulty:** Intermediate
- **Description:** Test a GraphQL endpoint using a POST request with a `query` field. Validate the shape of the `data` object in the response.

```typescript
import { test, expect } from '@playwright/test';

test('GraphQL query returns expected data shape', async ({ request }) => {
  // Using a public GraphQL API: https://countries.trevorblades.com/
  const query = `{
    country(code: "VN") {
      name
      capital
      currency
    }
  }`;

  // 1. POST to 'https://countries.trevorblades.com/' with data: { query }
  // YOUR CODE HERE

  // 2. Assert status is 200
  // YOUR CODE HERE

  // 3. Parse body and assert body.data.country.name is 'Vietnam'
  // YOUR CODE HERE

  // 4. Assert body.data.country.capital is 'Hanoi'
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

test('GraphQL query returns expected data shape', async ({ request }) => {
  const query = `{
    country(code: "VN") {
      name
      capital
      currency
    }
  }`;

  const response = await request.post('https://countries.trevorblades.com/', {
    data: { query },
  });

  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body.data.country.name).toBe('Vietnam');
  expect(body.data.country.capital).toBe('Hanoi');
});
```

---

### [Exercise] Parallel Self-Contained API Tests with Cleanup
- **Difficulty:** Advanced
- **Description:** Write a parallel describe block where each test creates unique data, asserts it, then deletes it in `afterEach`. Demonstrates fully independent parallel API tests with proper teardown.

```typescript
import { test, expect } from '@playwright/test';

const BASE = 'https://jsonplaceholder.typicode.com';

test.describe('Parallel self-contained API tests', () => {
  test.describe.configure({ mode: 'parallel' });

  // Each test stores its own created resource ID
  // afterEach attempts cleanup regardless of test result

  // 1. Test 'Create and verify post A':
  //    - POST a post with title 'Post A'
  //    - Assert status 201 and body.title is 'Post A'
  //    - Store the id (note: JSONPlaceholder returns id=101 for all creates)
  // YOUR CODE HERE

  // 2. Test 'Create and verify post B':
  //    - POST a post with title 'Post B'
  //    - Assert status 201 and body.title is 'Post B'
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

const BASE = 'https://jsonplaceholder.typicode.com';

test.describe('Parallel self-contained API tests', () => {
  test.describe.configure({ mode: 'parallel' });

  test('Create and verify post A', async ({ request }) => {
    const res = await request.post(`${BASE}/posts`, {
      data: { title: 'Post A', body: 'Body A', userId: 1 },
    });
    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body.title).toBe('Post A');
    // Cleanup: DELETE (JSONPlaceholder simulates it)
    const del = await request.delete(`${BASE}/posts/${body.id}`);
    expect(del.status()).toBe(200);
  });

  test('Create and verify post B', async ({ request }) => {
    const res = await request.post(`${BASE}/posts`, {
      data: { title: 'Post B', body: 'Body B', userId: 2 },
    });
    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body.title).toBe('Post B');
    const del = await request.delete(`${BASE}/posts/${body.id}`);
    expect(del.status()).toBe(200);
  });
});
```

---

## ðŸ§  Flashcards â€” Batch 4

**Concept:** API Schema Validation with Zod
`import { z } from 'zod'` â€” define a schema: `const UserSchema = z.object({ id: z.number(), name: z.string() })`. Then `UserSchema.parse(await response.json())` validates AND types the response. Throws a detailed `ZodError` on mismatch. Eliminates manual field-by-field type checks.

**Concept:** Soft Assertions in API Tests
`expect.soft(response.status()).toBe(200)` marks a failed assertion as non-fatal. The test continues running and collects ALL failures before reporting. Use when you want to validate multiple API response fields and see all failures at once, not just the first one.

**Concept:** API Authentication â€” Bearer Token
Most modern APIs use Bearer tokens: `request.get(url, { headers: { Authorization: `Bearer ${token}` } })`. Store the token in an environment variable (`process.env.API_TOKEN`). Never hardcode tokens in test files â€” they'll be committed to git.

**Concept:** API Test Data Builders
Create fluent builder functions: `buildPost({ title: 'Custom', userId: 42 })` returns a base post object merged with overrides. Use `Partial<T>` in the builder's parameter so callers only provide the fields they care about â€” defaults fill the rest.

**Concept:** Retry on Flaky API
Some endpoints are eventually consistent. Use `expect.poll()` with a real API call: `await expect.poll(() => request.get(url).then(r => r.json()).then(b => b.status)).toBe('ready')`. This polls until the field equals the expected value within a timeout.

**Term:** response.headers()
`await response.headers()` returns all response headers as `Record<string, string>`. Assert caching headers: `expect(headers['cache-control']).toContain('max-age')`. Assert content type: `expect(headers['content-type']).toContain('application/json')`.

**Term:** request.get() extraInfo
`request.get(url, { failOnStatusCode: false })` prevents Playwright from throwing on non-2xx responses. Use when deliberately testing 4xx/5xx scenarios â€” without this option, a 404 would throw and terminate your test before you can assert the error.

**Concept:** API Contract Testing
Define the expected API contract as a TypeScript interface. After every API call: 1) Parse the body, 2) Cast to the interface, 3) Assert each required field exists and has the correct type. Catches breaking API changes before they affect the UI.

---

## ðŸ“ Quizzes â€” Batch 4

### What does `expect.soft()` do differently from `expect()`?
- [ ] It retries the assertion until it passes
- [x] It marks the assertion as non-fatal â€” the test continues and all failures are reported together
- [ ] It logs the failure without failing the test at all
- [ ] It reduces the assertion timeout to 1 second

### What does `{ failOnStatusCode: false }` do in `request.get(url, { failOnStatusCode: false })`?
- [ ] It ignores all network errors
- [x] Prevents Playwright from throwing an error on non-2xx HTTP status codes
- [ ] Makes the request retry on failure
- [ ] Disables SSL certificate validation

### Where should API tokens used in tests be stored?
- [ ] Hardcoded in the test file
- [ ] In a `tokens.json` committed to the repo
- [x] In environment variables (e.g., `process.env.API_TOKEN`)
- [ ] In the Playwright config's `use` section as plain text

### What does `response.headers()` return?
- [ ] Only the Content-Type header as a string
- [x] All response headers as a `Record<string, string>` object
- [ ] The request headers that were sent
- [ ] HTTP/2 pseudo-headers only

### What is API Contract Testing?
- [ ] Testing that the API is running within SLA response times
- [x] Asserting that the API response matches the agreed interface â€” right fields, right types, right structure
- [ ] Verifying that the API has a valid SSL certificate
- [ ] Testing the API using a contract testing framework like Pact only

### What is the purpose of an API Test Data Builder?
- [ ] Creating random test data for load testing
- [x] A fluent function that returns a base object merged with caller-provided overrides, using Partial<T>
- [ ] Building API request URLs dynamically
- [ ] Seeding a database before tests run

### What is Zod used for in API testing?
- [ ] Mocking API responses with fake data
- [x] Runtime schema validation and type-safe parsing of API response bodies
- [ ] Generating TypeScript types from OpenAPI specs
- [ ] Converting JSON to TypeScript interfaces

### How do you test a 404 response without the test crashing?
- [ ] Wrap the request in try/catch
- [ ] Use `expect(response.status()).not.toBe(404)` first
- [x] Pass `{ failOnStatusCode: false }` to the request method
- [ ] Set `ignoreHTTPSErrors: true` in playwright.config.ts

---

## ðŸ‹ï¸ Coding Exercises â€” Batch 4

### [Exercise] Test 404 Response Without Crash
- **Difficulty:** Basic
- **Description:** Use `failOnStatusCode: false` to deliberately test a 404 response. Assert the status, body error message, and that the response is not OK.

```typescript
import { test, expect } from '@playwright/test';

test('handles 404 Not Found gracefully', async ({ request }) => {
  // 1. GET a non-existent resource (e.g., /posts/99999)
  //    with { failOnStatusCode: false }
  // YOUR CODE HERE

  // 2. Assert status is 404
  // YOUR CODE HERE

  // 3. Assert response.ok() is false
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

test('handles 404 Not Found gracefully', async ({ request }) => {
  const response = await request.get(
    'https://jsonplaceholder.typicode.com/posts/99999',
    { failOnStatusCode: false }
  );

  expect(response.status()).toBe(404);
  expect(response.ok()).toBe(false);
});
```

---

### [Exercise] Assert Response Headers
- **Difficulty:** Basic
- **Description:** Assert that an API response includes the correct `Content-Type` header and a non-empty `date` header. Response headers are critical for caching and security validation.

```typescript
import { test, expect } from '@playwright/test';

test('API response has correct Content-Type header', async ({ request }) => {
  const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');

  // 1. Get all headers using response.headers()
  // YOUR CODE HERE

  // 2. Assert Content-Type contains 'application/json'
  // YOUR CODE HERE

  // 3. Assert 'date' header exists (is not undefined)
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

test('API response has correct Content-Type header', async ({ request }) => {
  const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');

  const headers = response.headers();
  expect(headers['content-type']).toContain('application/json');
  expect(headers['date']).toBeDefined();
});
```

---

### [Exercise] Soft Assertions for Complete API Validation
- **Difficulty:** Intermediate
- **Description:** Use `expect.soft()` to validate multiple fields of an API response at once. All failures are collected and reported together â€” you see all issues, not just the first one.

```typescript
import { test, expect } from '@playwright/test';

test('validate all post fields with soft assertions', async ({ request }) => {
  const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');
  const body = await response.json();

  // Use expect.soft() for each field so ALL failures are reported
  // 1. Soft assert: status is 200
  // YOUR CODE HERE

  // 2. Soft assert: body.id is 1
  // YOUR CODE HERE

  // 3. Soft assert: body.userId is a number > 0
  // YOUR CODE HERE

  // 4. Soft assert: body.title is a non-empty string
  // YOUR CODE HERE

  // 5. Soft assert: body.body is a non-empty string
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

test('validate all post fields with soft assertions', async ({ request }) => {
  const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');
  const body = await response.json();

  expect.soft(response.status()).toBe(200);
  expect.soft(body.id).toBe(1);
  expect.soft(body.userId).toBeGreaterThan(0);
  expect.soft(typeof body.title).toBe('string');
  expect.soft(body.title.length).toBeGreaterThan(0);
  expect.soft(typeof body.body).toBe('string');
  expect.soft(body.body.length).toBeGreaterThan(0);
});
```

---

### [Exercise] API Test Data Builder Pattern
- **Difficulty:** Intermediate
- **Description:** Implement a `buildPost()` factory function with sensible defaults and `Partial<T>` overrides. Use it to create test data for POST requests with minimal boilerplate.

```typescript
import { test, expect } from '@playwright/test';

interface Post {
  title: string;
  body: string;
  userId: number;
}

// 1. Implement buildPost(overrides?: Partial<Post>): Post
//    Defaults: { title: 'Default Title', body: 'Default body', userId: 1 }
//    Merge with overrides using spread
// YOUR CODE HERE

test('builder creates posts with overrides', async ({ request }) => {
  // 2. Build a custom post overriding only the title
  //    const customPost = buildPost({ title: 'My Custom Post' })
  // YOUR CODE HERE

  // 3. POST the custom post to /posts
  // YOUR CODE HERE

  // 4. Assert status 201 and response title matches
  // YOUR CODE HERE

  // 5. Assert userId defaults to 1 (not overridden)
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

interface Post {
  title: string;
  body: string;
  userId: number;
}

function buildPost(overrides: Partial<Post> = {}): Post {
  return {
    title: 'Default Title',
    body: 'Default body text.',
    userId: 1,
    ...overrides,
  };
}

test('builder creates posts with overrides', async ({ request }) => {
  const customPost = buildPost({ title: 'My Custom Post' });

  const response = await request.post('https://jsonplaceholder.typicode.com/posts', {
    data: customPost,
  });

  expect(response.status()).toBe(201);
  const body = await response.json();
  expect(body.title).toBe('My Custom Post');
  expect(body.userId).toBe(1);
});
```

---

### [Exercise] Full API Contract Validation
- **Difficulty:** Advanced
- **Description:** Define a TypeScript interface for the expected API contract. After fetching, validate every required field exists with the correct type. This catches breaking API changes automatically.

```typescript
import { test, expect } from '@playwright/test';

interface PostContract {
  userId: number;
  id: number;
  title: string;
  body: string;
}

function validatePostContract(data: unknown): data is PostContract {
  if (typeof data !== 'object' || data === null) return false;
  const d = data as Record<string, unknown>;
  return (
    typeof d.userId === 'number' &&
    typeof d.id    === 'number' &&
    typeof d.title === 'string' && d.title.length > 0 &&
    typeof d.body  === 'string' && d.body.length  > 0
  );
}

test('GET /posts/1 matches PostContract', async ({ request }) => {
  // 1. GET /posts/1
  // YOUR CODE HERE

  // 2. Parse body
  // YOUR CODE HERE

  // 3. Call validatePostContract(body) and assert it returns true
  // YOUR CODE HERE

  // 4. After validation, access typed fields safely
  //    Assert (body as PostContract).id === 1
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

interface PostContract {
  userId: number;
  id: number;
  title: string;
  body: string;
}

function validatePostContract(data: unknown): data is PostContract {
  if (typeof data !== 'object' || data === null) return false;
  const d = data as Record<string, unknown>;
  return (
    typeof d.userId === 'number' &&
    typeof d.id    === 'number' &&
    typeof d.title === 'string' && d.title.length > 0 &&
    typeof d.body  === 'string' && d.body.length  > 0
  );
}

test('GET /posts/1 matches PostContract', async ({ request }) => {
  const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');
  const body = await response.json();

  expect(validatePostContract(body)).toBe(true);
  expect((body as PostContract).id).toBe(1);
  expect((body as PostContract).userId).toBeGreaterThan(0);
});
```
