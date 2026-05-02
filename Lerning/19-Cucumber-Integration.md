# Module 19: Cucumber BDD Integration

Behavior-Driven Development (BDD) allows you to write tests in plain English using Gherkin syntax (`Given`, `When`, `Then`). While Playwright has its own powerful test runner, many enterprise teams prefer integrating Playwright with `@cucumber/cucumber` so business stakeholders can read the test scenarios.

---

## 🧠 Flashcards

**Concept:** Gherkin Syntax
The language used by Cucumber. It uses structured keywords: `Feature` (the high-level functionality), `Scenario` (a specific test case), and steps: `Given` (setup), `When` (action), `Then` (verification/assertion).

**Concept:** Step Definitions
The TypeScript/JavaScript code that implements the Gherkin steps. Cucumber matches the plain text from the `.feature` file to the regex or string pattern in your `Given()`, `When()`, or `Then()` functions.

**Concept:** The Custom World (`this`)
In Cucumber, context is passed between steps using the `this` context (called the "World"). In Playwright integration, you typically create a `CustomWorld` class that initializes and holds the Playwright `browser`, `context`, and `page` objects so all steps can access them.

**Concept:** Cucumber Hooks
`BeforeAll`, `Before`, `After`, and `AfterAll` are used for setup and teardown. You usually launch the `browser` in `BeforeAll`, and create a new `page` for each scenario in the `Before` hook.

**Concept:** Cucumber Data Tables
A way to pass tabular data from a `.feature` file into a step definition. Accessed in code via a `DataTable` object. You can convert it to an array of objects using `dataTable.hashes()`.

**Concept:** Playwright Assertions in Cucumber
You can still use Playwright's auto-retrying assertions inside Cucumber steps! Just import `expect` directly from `@playwright/test`: `import { expect } from '@playwright/test';` and use it inside your `Then` steps.

**Term:** `cucumber.js` Configuration
The configuration file where you define where your `.feature` files live, where your step definitions are, and what reporters to use (e.g., HTML, JSON) when running the `cucumber-js` CLI.

**Concept:** Tags
In Gherkin, you can tag scenarios (e.g., `@smoke`, `@regression`). When running cucumber, you can filter executions using tags: `npx cucumber-js --tags "@smoke"`.

---

## 📝 Quizzes

### Which package is required to integrate Cucumber with Playwright in TypeScript?
- [ ] `@playwright/cucumber`
- [ ] `playwright-bdd`
- [x] `@cucumber/cucumber`
- [ ] `cucumber-ts`

### How is state (like the Playwright `page` object) shared between `Given`, `When`, and `Then` steps?
- [ ] By passing it as an argument to every step
- [ ] Using global variables
- [x] Using Cucumber's "World" object, accessed via `this` inside step definitions
- [ ] Using Playwright's built-in fixtures

### Where is the best place to launch the Playwright `browser` when using Cucumber?
- [ ] Inside the `Given` step
- [x] Inside a `BeforeAll` hook
- [ ] Inside a `Before` hook (runs before every scenario)
- [ ] Inside the `cucumber.js` config file

### How do you use Playwright's `expect` assertions inside a Cucumber test?
- [x] Import `expect` from `@playwright/test` and use it normally inside a `Then` step
- [ ] You cannot use Playwright assertions; you must use Chai or standard Node `assert`
- [ ] Use `this.expect()` from the Custom World
- [ ] Import `assert` from `@cucumber/cucumber`

### What does `dataTable.hashes()` do in a step definition?
- [ ] Hashes the table data for secure logging
- [ ] Returns an array of arrays representing rows and columns
- [x] Converts a Gherkin data table with headers into an array of JavaScript objects
- [ ] Validates the table against a database

---

## 🏋️ Coding Exercises

### [Exercise] Cucumber Custom World Setup
- **Difficulty:** Intermediate
- **Description:** Implement a Cucumber `CustomWorld` class that holds Playwright objects, and set up the `Before` hook to initialize a new page before a scenario runs.

```typescript
import { setWorldConstructor, World, Before, After } from '@cucumber/cucumber';
import { chromium, Browser, BrowserContext, Page } from 'playwright';

// 1. Define the CustomWorld class extending World
export class CustomWorld extends World {
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;
}

// 2. Register the CustomWorld using setWorldConstructor()
// YOUR CODE HERE

let browser: Browser;

Before(async function (this: CustomWorld) {
  // Assume browser is launched in BeforeAll.
  browser = browser || await chromium.launch();
  
  // 3. Create a new context and assign it to this.context
  // YOUR CODE HERE

  // 4. Create a new page and assign it to this.page
  // YOUR CODE HERE
});

After(async function (this: CustomWorld) {
  // 5. Close the page and context
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { setWorldConstructor, World, Before, After } from '@cucumber/cucumber';
import { chromium, Browser, BrowserContext, Page } from 'playwright';

export class CustomWorld extends World {
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;
}

setWorldConstructor(CustomWorld);

let browser: Browser;

Before(async function (this: CustomWorld) {
  browser = browser || await chromium.launch();
  this.context = await browser.newContext();
  this.page = await this.context.newPage();
});

After(async function (this: CustomWorld) {
  await this.page?.close();
  await this.context?.close();
});
```

---

### [Exercise] Step Definitions with Playwright
- **Difficulty:** Basic
- **Description:** Write the step definitions for a simple login scenario. Use the `this.page` object from the Custom World and Playwright's `expect` for assertions.

```gherkin
# login.feature
Feature: User Login
  Scenario: Successful login
    Given the user is on the login page
    When the user logs in with "practice" and "SuperSecretPassword!"
    Then they should be redirected to the secure area
```

```typescript
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from './world'; // From previous exercise

Given('the user is on the login page', async function (this: CustomWorld) {
  // 1. Navigate to 'https://practice.expandtesting.com/login'
  // YOUR CODE HERE
});

When('the user logs in with {string} and {string}', async function (this: CustomWorld, username, password) {
  // 2. Fill the username and password, then click Login
  // YOUR CODE HERE
});

Then('they should be redirected to the secure area', async function (this: CustomWorld) {
  // 3. Assert the URL contains '/secure' using Playwright's expect
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from './world';

Given('the user is on the login page', async function (this: CustomWorld) {
  await this.page!.goto('https://practice.expandtesting.com/login');
});

When('the user logs in with {string} and {string}', async function (this: CustomWorld, username, password) {
  await this.page!.getByLabel('Username').fill(username);
  await this.page!.getByLabel('Password').fill(password);
  await this.page!.getByRole('button', { name: 'Login' }).click();
});

Then('they should be redirected to the secure area', async function (this: CustomWorld) {
  await expect(this.page!).toHaveURL(/\/secure/);
});
```

---

### [Exercise] Using Cucumber Data Tables
- **Difficulty:** Intermediate
- **Description:** Implement a step definition that uses a Gherkin Data Table to fill out a multi-field form dynamically. Use `dataTable.hashes()` to parse it.

```gherkin
# form.feature
When the user fills the registration form with:
  | Field    | Value            |
  | Username | testuser         |
  | Email    | test@example.com |
  | Password | password123      |
```

```typescript
import { When, DataTable } from '@cucumber/cucumber';
import { CustomWorld } from './world';

When('the user fills the registration form with:', async function (this: CustomWorld, dataTable: DataTable) {
  // 1. Convert the dataTable to an array of objects using hashes()
  //    e.g. [{ Field: 'Username', Value: 'testuser' }, ...]
  // YOUR CODE HERE

  // 2. Loop over the rows and fill the corresponding fields.
  //    Assume the labels on the page match the 'Field' column exactly.
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { When, DataTable } from '@cucumber/cucumber';
import { CustomWorld } from './world';

When('the user fills the registration form with:', async function (this: CustomWorld, dataTable: DataTable) {
  const rows = dataTable.hashes();

  for (const row of rows) {
    const fieldName = row.Field;
    const value = row.Value;
    
    // Fill the input matching the Field label with the Value
    await this.page!.getByLabel(fieldName).fill(value);
  }
});
```

---

## 🧠 Flashcards — Part 2

**Concept:** `AfterStep` Hook
A Cucumber hook that runs after every single step in a scenario. It is the perfect place to capture screenshots or DOM snapshots, especially if the step failed.

**Concept:** Scenario Outlines (Examples)
A Gherkin feature that allows you to run the same scenario multiple times with different data. You use `<variableName>` in the steps, and define an `Examples:` table at the bottom.

**Concept:** Page Object Model in Cucumber
Instead of putting locators directly in step definitions, instantiate your Page Objects inside the `CustomWorld` or the `Before` hook. This keeps step definitions clean: `await this.loginPage.login(user, pass)`.

**Concept:** API Context in Custom World
Playwright's `APIRequestContext` can also be stored in the Custom World (`this.request`). Initialize it in `BeforeAll` or `Before` using `request.newContext()`. This allows you to write Gherkin steps for API endpoints.

---

## 📝 Quizzes — Part 2

### What is the primary use case for the `AfterStep` hook in UI testing?
- [ ] Closing the browser
- [x] Checking if the step failed and capturing a screenshot or trace
- [ ] Resetting the database
- [ ] Logging the user out

### How do you pass variables from an `Examples` table into a Gherkin step?
- [ ] Using `${variable}` syntax
- [x] Using `<variable>` syntax
- [ ] Using `[variable]` syntax
- [ ] Using `{{variable}}` syntax

### Where is the best place to instantiate a Page Object Model (POM) in a Cucumber test?
- [ ] Inside every individual step definition
- [x] Inside the `CustomWorld` or initialized in the `Before` hook so all steps can access it
- [ ] Inside the `cucumber.js` config
- [ ] Passed as a parameter in the `.feature` file

### Can you use Playwright's API testing features inside Cucumber?
- [ ] No, Cucumber only works with the DOM
- [ ] Yes, but you have to use Axios instead
- [x] Yes, by initializing `request.newContext()` and storing it in the Custom World
- [ ] Yes, but only in the `BeforeAll` hook

---

## 🏋️ Coding Exercises — Part 2

### [Exercise] Take Screenshot on Step Failure
- **Difficulty:** Intermediate
- **Description:** Implement an `AfterStep` hook that checks if the current step failed. If it did, use Playwright to take a screenshot and attach it to the Cucumber report.

```typescript
import { AfterStep, Status } from '@cucumber/cucumber';
import { CustomWorld } from './world';

// 1. Define AfterStep hook with parameters ({ result, pickleStep })
AfterStep(async function (this: CustomWorld, { result }) {
  // 2. Check if the step status is FAILED
  //    result.status === Status.FAILED
  // YOUR CODE HERE

  // 3. Take a screenshot using this.page.screenshot()
  //    (Return it as a buffer)
  // YOUR CODE HERE

  // 4. Attach the screenshot buffer to the Cucumber report
  //    this.attach(imageBuffer, 'image/png');
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { AfterStep, Status } from '@cucumber/cucumber';
import { CustomWorld } from './world';

AfterStep(async function (this: CustomWorld, { result }) {
  if (result.status === Status.FAILED) {
    if (this.page) {
      const imageBuffer = await this.page.screenshot({ fullPage: true });
      this.attach(imageBuffer, 'image/png');
    }
  }
});
```

---

### [Exercise] Page Object Model Integration
- **Difficulty:** Advanced
- **Description:** Update the `CustomWorld` and `Before` hook to instantiate a `LoginPage` POM so that step definitions can use it directly without dealing with raw locators.

```typescript
import { Before } from '@cucumber/cucumber';
import { CustomWorld } from './world';
// Assume LoginPage is imported from your POM files
import { LoginPage } from './pages/LoginPage';

// 1. Extend CustomWorld to include loginPage
//    (In world.ts)
// export class CustomWorld extends World {
//   ...
//   loginPage?: LoginPage;
// }

Before(async function (this: CustomWorld) {
  // (Assume this.page is already created)
  
  // 2. Instantiate the LoginPage and assign it to this.loginPage
  // YOUR CODE HERE
});

// 3. Write a step using the POM
// When('the user logs in with {string} and {string}', ...)
// YOUR CODE HERE
```

### Solution
```typescript
import { Before, When } from '@cucumber/cucumber';
import { CustomWorld } from './world';
import { LoginPage } from './pages/LoginPage';

Before(async function (this: CustomWorld) {
  // Assuming browser context and page are initialized
  this.loginPage = new LoginPage(this.page!);
});

When('the user logs in with {string} and {string}', async function (this: CustomWorld, user, pass) {
  await this.loginPage!.login(user, pass);
});
```

---

### [Exercise] API Testing with Cucumber
- **Difficulty:** Intermediate
- **Description:** Set up Playwright's `APIRequestContext` in the `Before` hook and write a step definition that makes a POST request to an API endpoint.

```typescript
import { Before, When } from '@cucumber/cucumber';
import { request, APIRequestContext } from 'playwright';
import { CustomWorld } from './world';

// 1. In world.ts, add `apiRequest?: APIRequestContext;` to CustomWorld

Before(async function (this: CustomWorld) {
  // 2. Initialize the API context
  //    this.apiRequest = await request.newContext({ baseURL: 'https://api.example.com' });
  // YOUR CODE HERE
});

When('I send a POST request to {string} with body:', async function (this: CustomWorld, endpoint, docString) {
  // 3. Parse the docString as JSON
  // YOUR CODE HERE

  // 4. Send the POST request using this.apiRequest
  // YOUR CODE HERE

  // 5. Store the response in the world object (e.g., this.apiResponse) for the Then step
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { Before, When } from '@cucumber/cucumber';
import { request } from 'playwright';
import { CustomWorld } from './world';

Before(async function (this: CustomWorld) {
  this.apiRequest = await request.newContext({ 
    baseURL: 'https://jsonplaceholder.typicode.com' 
  });
});

When('I send a POST request to {string} with body:', async function (this: CustomWorld, endpoint, docString) {
  const bodyData = JSON.parse(docString);
  
  this.apiResponse = await this.apiRequest!.post(endpoint, {
    data: bodyData
  });
});
```

---

## 🧠 Flashcards — Part 3

**Concept:** Playwright Tracing in Cucumber
Playwright's Trace Viewer is invaluable for debugging. In Cucumber, you start tracing in the `Before` hook: `await this.context.tracing.start({ screenshots: true, snapshots: true })`.

**Concept:** Saving Traces on Failure
In the Cucumber `After` hook, check `result?.status === Status.FAILED`. If it failed, stop and save the trace: `await this.context.tracing.stop({ path: 'trace.zip' })`. This prevents filling your CI storage with traces from passing tests.

**Concept:** Passing State Between Steps
Use the `CustomWorld` (`this`) to share dynamic data between steps. For example, in step 1: `this.orderId = await getOrderId()`. In step 2: `expect(page).toHaveText(`Order ${this.orderId}`)`. This keeps steps loosely coupled but data-connected.

**Concept:** Custom Parameter Types
Cucumber allows you to define custom parameter types to automatically cast string parameters. `defineParameterType({ name: 'color', regexp: /red|blue|green/, transformer: s => new Color(s) })`. This reduces boilerplate inside step definitions.

**Concept:** Cucumber Built-in Types
Cucumber automatically parses `{int}` as a number, `{float}` as a float, and `{string}` as a string enclosed in quotes. Use these instead of raw regular expressions `(\d+)` for cleaner step definitions.

---

## 📝 Quizzes — Part 3

### How do you enable Playwright's Trace Viewer in a Cucumber project?
- [ ] By setting `use: { trace: 'on-first-retry' }` in `cucumber.js`
- [x] By calling `await this.context.tracing.start()` in the `Before` hook and `.stop()` in the `After` hook
- [ ] By passing `--trace` to the `cucumber-js` CLI
- [ ] Tracing is not supported when using Cucumber

### Why is it recommended to check `result.status` in the `After` hook when saving traces?
- [ ] Because traces can only be saved if a test fails
- [x] To only save the trace file (`trace.zip`) if the scenario failed, saving disk space and CI execution time
- [ ] To automatically retry the scenario
- [ ] Because passing tests do not generate trace data

### How should you pass dynamic data (like an extracted Order ID) from a `When` step to a `Then` step?
- [ ] By exporting a global variable from the step definition file
- [ ] By writing it to a temporary JSON file
- [x] By storing it as a property on the Custom World object (e.g., `this.orderId = ...`)
- [ ] By passing it as an argument to the next step directly

### What does `{int}` do in a Cucumber step definition pattern like `When I add {int} items`?
- [ ] It creates a TypeScript interface for the parameter
- [x] It automatically matches integers in the feature file and casts the parameter to a JavaScript `number`
- [ ] It acts as a wildcard for any character
- [ ] It throws an error if the number is greater than 10

---

## 🏋️ Coding Exercises — Part 3

### [Exercise] Start and Stop Tracing on Failure
- **Difficulty:** Advanced
- **Description:** Implement a `Before` hook to start Playwright tracing, and an `After` hook that checks if the scenario failed. If it failed, stop tracing and save the file using the scenario name.

```typescript
import { Before, After, Status } from '@cucumber/cucumber';
import { CustomWorld } from './world';

Before(async function (this: CustomWorld, scenario) {
  // Assume context is already initialized
  // 1. Start tracing with screenshots and snapshots enabled
  // YOUR CODE HERE
});

After(async function (this: CustomWorld, scenario) {
  // 2. Check if the scenario failed
  //    scenario.result?.status === Status.FAILED
  // YOUR CODE HERE

  // 3. If it failed, save the trace to a zip file named after the scenario
  //    const traceName = `trace-${scenario.pickle.name}.zip`;
  //    await this.context?.tracing.stop({ path: traceName });
  // YOUR CODE HERE

  // 4. If it passed, just stop tracing without a path to discard it
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { Before, After, Status } from '@cucumber/cucumber';
import { CustomWorld } from './world';

Before(async function (this: CustomWorld, scenario) {
  await this.context?.tracing.start({ 
    screenshots: true, 
    snapshots: true 
  });
});

After(async function (this: CustomWorld, scenario) {
  if (scenario.result?.status === Status.FAILED) {
    const traceName = `trace-${scenario.pickle.name.replace(/\s+/g, '-')}.zip`;
    await this.context?.tracing.stop({ path: traceName });
    // Optional: attach trace to report
    // this.attach(`Trace saved to ${traceName}`, 'text/plain');
  } else {
    // Discard the trace
    await this.context?.tracing.stop();
  }
});
```

---

### [Exercise] Passing State Between Steps
- **Difficulty:** Intermediate
- **Description:** Write two step definitions. The first step extracts an order ID from the page and saves it to the World context. The second step asserts that the exact order ID appears on the confirmation screen.

```typescript
import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from './world';

// Assume world.ts has: export class CustomWorld extends World { orderId?: string; }

When('the user submits the order', async function (this: CustomWorld) {
  await this.page!.getByRole('button', { name: 'Submit' }).click();

  // 1. Extract the text of the element with ID '#order-number'
  // YOUR CODE HERE

  // 2. Save it to this.orderId
  // YOUR CODE HERE
});

Then('the confirmation screen should display the correct order ID', async function (this: CustomWorld) {
  // 3. Assert that this.orderId is defined
  // YOUR CODE HERE

  // 4. Assert that the confirmation message contains the saved order ID
  //    await expect(this.page!.locator('.confirmation')).toContainText(this.orderId!)
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from './world';

When('the user submits the order', async function (this: CustomWorld) {
  await this.page!.getByRole('button', { name: 'Submit' }).click();

  const orderText = await this.page!.locator('#order-number').textContent();
  
  if (!orderText) throw new Error('Order number not found on page');
  this.orderId = orderText.trim();
});

Then('the confirmation screen should display the correct order ID', async function (this: CustomWorld) {
  expect(this.orderId).toBeDefined();

  const confirmationMsg = this.page!.locator('.confirmation');
  await expect(confirmationMsg).toContainText(this.orderId!);
});
```

---

### [Exercise] Using Built-in Parameter Types
- **Difficulty:** Basic
- **Description:** Use the `{int}` and `{string}` parameter types to dynamically match values from a Gherkin step, avoiding raw regular expressions and automatic string-to-number conversion logic.

```gherkin
# cart.feature
When the user adds 3 "Laptop" items to the cart
```

```typescript
import { When } from '@cucumber/cucumber';
import { CustomWorld } from './world';

// 1. Define the step using {int} for the quantity and {string} for the product name
// When('the user adds {int} {string} items to the cart', ...)
// YOUR CODE HERE
  
  // 2. Assert the types of the parameters received
  //    qty should be 'number', product should be 'string'
  // YOUR CODE HERE

  // 3. Loop `qty` times and click the Add button for that `product`
  // YOUR CODE HERE
// });
```

### Solution
```typescript
import { When } from '@cucumber/cucumber';
import { CustomWorld } from './world';
import { expect } from '@playwright/test';

When('the user adds {int} {string} items to the cart', async function (this: CustomWorld, qty: number, product: string) {
  // Parameters are automatically cast!
  expect(typeof qty).toBe('number');
  expect(typeof product).toBe('string');

  const addToCartBtn = this.page!.locator('.product', { hasText: product })
                                 .getByRole('button', { name: 'Add to Cart' });

  for (let i = 0; i < qty; i++) {
    await addToCartBtn.click();
    // Wait for cart to update before clicking again
    await this.page!.waitForLoadState('networkidle');
  }
});
```
