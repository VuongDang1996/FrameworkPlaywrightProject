# 01 — Playwright Framework Overview

## What Is This Project?

This is a **production-grade End-to-End (E2E) test automation framework** targeting the
[Automation Exercise](https://automationexercise.com) website. It is built on:

| Technology | Role |
|---|---|
| **Playwright** | Browser automation (Chrome, Firefox, Safari) |
| **TypeScript** | Type safety, IDE support, early error detection |
| **Page Object Model (POM)** | Clean separation between tests and UI interactions |
| **Custom Fixtures** | Dependency injection for page objects |
| **Allure** | Beautiful test reports with step trace, screenshots, history |
| **GitHub Actions** | CI/CD, multi-browser, automatic report publishing |
| **Cucumber (optional)** | BDD-style feature file tests |

The framework contains **26 implemented test cases** covering authentication, product search,
shopping cart, checkout, subscriptions, and UI/UX features.

---

## Big Picture — How a Test Runs

```
┌─────────────────────────────────────────────────────────────────────┐
│  Spec File (test scenario)                                          │
│    └── imports custom `test` from fixtures file                     │
│           └── fixtures inject pre-built page object instances       │
│                  └── page objects use BasePage + Playwright `page`  │
│                         └── Playwright drives the real browser      │
│                                └── Allure captures every step       │
└─────────────────────────────────────────────────────────────────────┘
```

**Step-by-step execution flow:**

1. `npm test` triggers Playwright via `playwright.config.ts`
2. Global setup (`global-setup.ts`) runs once before all tests
3. For each test: the fixture creates fresh page object instances
4. The test method calls business-level methods on those objects
5. Playwright executes browser actions (click, fill, navigate)
6. `expect(...)` assertions verify outcomes
7. On failure: screenshot + video + trace are saved automatically
8. After all tests: Allure collects results from `allure-results/`
9. `npm run report:allure` opens the HTML report in the browser

---

## Full Folder Structure Explained

```
FrameworkPlaywrightProject/
│
├── tests/                          ← ALL test code lives here
│   ├── pages/                      ← Page Object classes
│   │   ├── base/
│   │   │   └── BasePage.ts         ← Abstract base: shared waiters, helpers
│   │   ├── components/
│   │   │   ├── NavigationComponent.ts
│   │   │   └── FooterComponent.ts
│   │   ├── auth/
│   │   │   ├── AutomationExerciseLoginPage.ts
│   │   │   └── AutomationExerciseSignupPage.ts
│   │   ├── AutomationExerciseHomePage.ts
│   │   ├── AutomationExerciseProductsPage.ts
│   │   ├── AutomationExerciseCartPage.ts
│   │   ├── AutomationExerciseContactUsPage.ts
│   │   └── AutomationExerciseProductDetailPage.ts
│   │
│   ├── fixtures/
│   │   └── automation-exercise-fixtures.ts   ← Injects page objects into tests
│   │
│   ├── specs/                      ← Test cases
│   │   └── automation-exercise/
│   │       └── individual-tests/   ← 26 test cases (tc01 → tc26)
│   │
│   ├── data/
│   │   └── automation-exercise-data.ts       ← Interfaces + test constants
│   │
│   ├── utils/
│   │   └── allure-helpers.ts                 ← Allure metadata helpers
│   │
│   └── interfaces/                           ← Shared TypeScript types
│
├── playwright.config.ts             ← Main Playwright config (browsers, reporters, timeouts)
├── global-setup.ts                  ← Runs ONCE before all tests
├── global-teardown.ts               ← Runs ONCE after all tests
├── allure-results/                  ← Raw JSON created after each test run
├── allure-report/                   ← Generated HTML report
├── .github/workflows/               ← CI/CD pipelines
├── features/                        ← Cucumber .feature files (BDD mode)
├── tsconfig.json                    ← TypeScript paths and compiler options
└── package.json                     ← Scripts and dependencies
```

---

## Why This Structure Makes Maintenance Easy

**Scenario: A button's CSS class changes.**

Without POM → you search 26 spec files to update the selector.  
With POM → you update **one locator** in the page object class. All tests using it are fixed.

**Scenario: You want a new test.**

1. Identify which pages it touches.
2. Add any missing methods to those page classes.
3. Write the spec using existing fixtures — no browser plumbing needed.

---

## Technology Stack Versions (from package.json)

| Package | Version |
|---|---|
| `@playwright/test` | ^1.40.0 |
| `typescript` | ^5.0.0 |
| `allure-playwright` | ^3.3.3 |
| `@cucumber/cucumber` | ^12.1.0 |
| `dotenv` | ^16.0.0 |

---

## Recommended Learning Path

| Step | File |
|---|---|
| 1 | This file — understand what the project is |
| 2 | [09-TypeScript-Basics-for-Testers.md](09-TypeScript-Basics-for-Testers.md) — TypeScript concepts used in every test |
| 3 | [02-POM-and-Architecture.md](02-POM-and-Architecture.md) — understand the code layers |
| 4 | [10-Line-by-Line-Test-Walkthrough.md](10-Line-by-Line-Test-Walkthrough.md) — read TC02 explained line by line |
| 5 | [03-Write-Your-First-Test.md](03-Write-Your-First-Test.md) — write and run your own test |
| 6 | [05-Locators-and-Selectors.md](05-Locators-and-Selectors.md) — learn robust selectors |
| 7 | [06-Fixtures-and-Test-Data.md](06-Fixtures-and-Test-Data.md) — fixtures and real data constants |
| 8 | [07-Allure-Reporting.md](07-Allure-Reporting.md) — generate and read reports |
| 9 | [08-Debugging-and-Troubleshooting.md](08-Debugging-and-Troubleshooting.md) — fix failures |
| 10 | [04-Commands-and-Cheat-Sheet.md](04-Commands-and-Cheat-Sheet.md) — quick reference |
| 11 | [11-All-26-Test-Cases-Map.md](11-All-26-Test-Cases-Map.md) — explore all 26 test cases |

---

## The Golden Rule

> **Selectors and browser interactions belong in page objects.  
> Business logic and assertions belong in spec files.**

Never write `page.locator(...)` directly inside a test spec.

