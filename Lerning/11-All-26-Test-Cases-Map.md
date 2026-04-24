# 11 — All 26 Test Cases Map

Quick reference for every test in the suite. Use this to:
- Find which file to look at for a specific scenario
- Understand which page objects each test uses
- Choose which tests to run during development (`@smoke` = fast, `@regression` = full)

---

## How to Run Subsets

```bash
# Run only smoke tests (TC01, TC02, TC04, TC07, TC08)
npx playwright test --grep @smoke

# Run only regression tests
npx playwright test --grep @regression

# Run a single test by TC number
npx playwright test tests/specs/automation-exercise/individual-tests/tc06-contact-us-form.spec.ts

# Run all tests
npm test
```

---

## Group 1 — Authentication (TC01–TC05)

These tests cover everything related to user accounts: registration, login, logout, and edge cases.

| TC | Test Name | Tag | What It Verifies | Page Objects |
|---|---|---|---|---|
| TC01 | Register User | `@smoke` | Full registration flow — fill all fields, verify "Account Created" message | homePage, loginPage, signupPage |
| TC02 | Login User with Correct Email and Password | `@smoke` | Login with valid credentials, verify "Logged in as" nav item, then logout | homePage, loginPage |
| TC03 | Login User with Incorrect Email and Password | `@regression` | Login with wrong credentials, verify error message appears | homePage, loginPage |
| TC04 | Logout User | `@smoke` | Login then click logout, verify redirect back to login page | homePage, loginPage |
| TC05 | Register User with Existing Email | `@regression` | Attempt registration with already-registered email, verify error message | homePage, loginPage |

**Key insight:** TC01 creates a new account (needs unique email). TC02/TC03/TC04 use `TEST_USERS.VALID_USER` constants. TC05 uses `TEST_USERS.EXISTING_USER`.

---

## Group 2 — Navigation & Static Pages (TC06–TC07)

| TC | Test Name | Tag | What It Verifies | Page Objects |
|---|---|---|---|---|
| TC06 | Contact Us Form | `@regression` | Fill and submit contact form, verify success message | homePage, contactPage |
| TC07 | Verify Test Cases Page | `@smoke` | Click "Test Cases" link in nav, verify the page loads with test case content | homePage |

**Key insight:** TC07 checks that navigation links route to the correct pages. It verifies URL contains `/test_cases`.

---

## Group 3 — Products & Search (TC08–TC09, TC18–TC19, TC21)

| TC | Test Name | Tag | What It Verifies | Page Objects |
|---|---|---|---|---|
| TC08 | Verify All Products and Product Detail Page | `@smoke` | Products page loads, click first product, verify detail page shows name/price/category | homePage, productsPage, productDetailPage |
| TC09 | Search Product | `@regression` | Enter search term, verify results appear and all results match the search term | homePage, productsPage |
| TC18 | View Category Products | `@regression` | Click Women/Men/Kids category in sidebar, verify products filtered by category | homePage |
| TC19 | View & Cart Brand Products | `@regression` | Click a brand in sidebar, verify brand products page loads and shows correct brand | homePage, productsPage |
| TC21 | Add Review on Product | `@regression` | Navigate to product detail, submit a review with name/email/text, verify success | homePage, productsPage, productDetailPage |

**Key insight:** TC09 uses `SEARCH_TERMS.SHIRT` constant. TC18 uses `CATEGORIES.WOMEN.DRESS`. TC19 uses `BRANDS.POLO`.

---

## Group 4 — Shopping Cart (TC11–TC13, TC17, TC22)

| TC | Test Name | Tag | What It Verifies | Page Objects |
|---|---|---|---|---|
| TC11 | Verify Subscription in Cart Page | `@regression` | Navigate to cart, scroll to footer, subscribe with email, verify success alert | homePage, productsPage, cartPage |
| TC12 | Add Products in Cart | `@regression` | Hover product → Add to Cart, do it for 2 products, verify both appear in cart | homePage, productsPage, cartPage |
| TC13 | Verify Product Quantity in Cart | `@regression` | Set quantity to 4 on product detail page, add to cart, verify quantity = 4 in cart | homePage, productsPage, productDetailPage, cartPage |
| TC17 | Remove Products From Cart | `@regression` | Add product to cart, then delete it using X button, verify cart is empty | homePage, productsPage, cartPage |
| TC22 | Add to Cart from Recommended Items | `@regression` | Scroll to recommended items section on home page, add item to cart, verify cart | homePage, cartPage |

**Key insight:** TC12 uses hover-then-add pattern. TC13 tests quantity input on product detail page. TC17 tests the delete (X) button in cart rows.

---

## Group 5 — Checkout & Orders (TC14–TC16, TC23–TC24)

These tests cover the full purchase journey from adding a product to receiving an order confirmation.

| TC | Test Name | Tag | What It Verifies | Page Objects |
|---|---|---|---|---|
| TC14 | Place Order: Register While Checkout | `@regression` | Add product → Cart → Checkout → prompted to register → complete registration → pay | homePage, loginPage, signupPage, productsPage, cartPage, checkoutPage, paymentPage |
| TC15 | Place Order: Register Before Checkout | `@regression` | Register first → add product → checkout → confirm address → pay | homePage, loginPage, signupPage, productsPage, cartPage, checkoutPage, paymentPage |
| TC16 | Place Order: Login Before Checkout | `@regression` | Login first → add product → checkout → confirm address → pay | homePage, loginPage, productsPage, cartPage, checkoutPage, paymentPage |
| TC23 | Verify Address Details in Checkout Page | `@regression` | Register, then checkout and verify delivery + billing address match registration data | homePage, loginPage, signupPage, productsPage, cartPage, checkoutPage |
| TC24 | Download Invoice After Purchase Order | `@regression` | Complete order, click "Download Invoice", verify PDF link/file is present | homePage, loginPage, productsPage, cartPage, checkoutPage, paymentPage |

**Key insight:** TC14 tests the "register at checkout" path. TC15 and TC16 are variations where the user registers/logs in before adding to cart. TC23 is specifically about verifying that delivery address matches the registration form data. TC24 tests the invoice download button that appears on the order confirmation page.

---

## Group 6 — Subscriptions (TC10–TC11)

| TC | Test Name | Tag | What It Verifies | Page Objects |
|---|---|---|---|---|
| TC10 | Verify Subscription in Home Page | `@regression` | Scroll to footer on home page, subscribe with email, verify "You have been successfully subscribed!" | homePage |
| TC11 | Verify Subscription in Cart Page | `@regression` | Navigate to cart page, scroll to footer, subscribe with email, verify success | homePage, productsPage, cartPage |

**Key insight:** The subscription widget is in the footer and appears on both the home page (TC10) and cart page (TC11). Both verify the same success message but from different pages.

---

## Group 7 — UI & Scroll Behavior (TC25–TC26)

| TC | Test Name | Tag | What It Verifies | Page Objects |
|---|---|---|---|---|
| TC25 | Verify Scroll Up Using Arrow Button | `@regression` | Scroll to bottom of home page, click the scroll-up arrow button, verify page scrolls to top | homePage |
| TC26 | Verify Scroll Up Without Arrow Button | `@regression` | Scroll to bottom of home page, use keyboard scroll up, verify "Full-Fledged practice" banner is visible at top | homePage |

**Key insight:** TC25 tests the fixed arrow button. TC26 tests scroll behavior without using the button (scrolls up with JavaScript/keyboard). Both verify the top banner is visible after scrolling up.

---

## Group 8 — Cross-Feature Flows (TC20)

| TC | Test Name | Tag | What It Verifies | Page Objects |
|---|---|---|---|---|
| TC20 | Search Products and Verify Cart After Login | `@regression` | Search products, add to cart, login, verify same products still in cart after login | homePage, loginPage, productsPage, cartPage |

**Key insight:** TC20 tests that the cart persists across a login. Products added before login should still be in the cart after logging in.

---

## Complete Alphabetical Quick-Find Table

| TC | File | Tag | Feature |
|---|---|---|---|
| TC01 | tc01-register-user | `@smoke` | Authentication |
| TC02 | tc02-login-user-correct | `@smoke` | Authentication |
| TC03 | tc03-login-user-incorrect | `@regression` | Authentication |
| TC04 | tc04-logout-user | `@smoke` | Authentication |
| TC05 | tc05-register-existing-email | `@regression` | Authentication |
| TC06 | tc06-contact-us-form | `@regression` | Contact Us |
| TC07 | tc07-verify-test-cases-page | `@smoke` | Navigation |
| TC08 | tc08-verify-products-and-detail | `@smoke` | Product Catalog |
| TC09 | tc09-search-product | `@regression` | Product Catalog |
| TC10 | tc10-verify-subscription-home | `@regression` | Newsletter |
| TC11 | tc11-verify-subscription-cart | `@regression` | Newsletter |
| TC12 | tc12-add-products-cart | `@regression` | Shopping Cart |
| TC13 | tc13-verify-product-quantity-cart | `@regression` | Shopping Cart |
| TC14 | tc14-place-order-register-while-checkout | `@regression` | Checkout |
| TC15 | tc15-place-order-register-before-checkout | `@regression` | Checkout |
| TC16 | tc16-place-order-login-before-checkout | `@regression` | Checkout |
| TC17 | tc17-remove-products-cart | `@regression` | Shopping Cart |
| TC18 | tc18-view-category-products | `@regression` | Product Catalog |
| TC19 | tc19-view-cart-brand-products | `@regression` | Product Catalog |
| TC20 | tc20-search-products-verify-cart-after-login | `@regression` | Shopping Cart |
| TC21 | tc21-add-review-product | `@regression` | Product Catalog |
| TC22 | tc22-add-cart-recommended-items | `@regression` | Shopping Cart |
| TC23 | tc23-verify-address-details-checkout | `@regression` | Checkout |
| TC24 | tc24-download-invoice-after-purchase | `@regression` | Checkout |
| TC25 | tc25-verify-scroll-up-arrow-button | `@regression` | Navigation |
| TC26 | tc26-verify-scroll-up-without-arrow-button | `@regression` | Navigation |

---

## Coverage Summary

| Category | Count | Smoke | Regression |
|---|---|---|---|
| Authentication | 5 | 3 | 2 |
| Navigation / UI | 3 | 1 | 2 |
| Product Catalog | 5 | 2 | 3 |
| Shopping Cart | 5 | 0 | 5 |
| Checkout / Orders | 5 | 0 | 5 |
| Newsletter / Subscriptions | 2 | 0 | 2 |
| Cross-Feature | 1 | 0 | 1 |
| **Total** | **26** | **6** | **20** |

> **Smoke tests** (6) give you a fast confidence check — they cover registration, login, logout, navigation, and products. Run them before committing changes.
>
> **Regression tests** (20) cover edge cases, forms, checkout flows, UI behavior. Run the full suite in CI.
