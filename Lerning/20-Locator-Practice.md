# 🎯 Locator Coding Practice

Master the art of identifying elements using Playwright's modern locator strategies. Effective locators are the foundation of stable, non-flaky automation.

## 🔑 Key Principles
1. **Prefer User-Facing Attributes**: Use `getByRole`, `getByText`, and `getByLabel` over CSS or XPath.
2. **Resilience**: Avoid locators that depend on long, brittle DOM paths.
3. **Uniqueness**: Ensure your locator identifies exactly one element (unless you intend otherwise).

---

## 🧠 Flashcards
**Concept:** getByRole
The most recommended Playwright locator. It finds elements by their ARIA role (button, heading, link, etc.) and optional name/state.

**Concept:** getByText
Locates an element by its exact text or a partial match/regex. Great for finding specific labels or headings.

**Concept:** page.locator()
The generic entry point for CSS and XPath selectors. Use this when user-facing locators aren't enough.

---

## 🏋️ Coding Exercises

### [Exercise] Basic Locator Assertion
**Difficulty:** Basic
**Description:** Write a test snippet that locates a button with the text "Submit" and clicks it.

```javascript
import { test, expect } from '@playwright/test';

test('click submit button', async ({ page }) => {
  await page.goto('https://example.com');
  // Write your locator and click here
  
});
```

### [Solution]
```javascript
await page.getByRole('button', { name: 'Submit' }).click();
```

---

## 🎯 Locator Practice

### [Locator Exercise] Target the Login Button
**Difficulty:** Basic
**Description:** Locate the blue "Login" button using `getByRole`.

**Target HTML:**
```html
<div class="auth-form">
  <button class="btn btn-primary">Login</button>
  <button class="btn btn-link">Forgot Password?</button>
</div>
```

**Expected Locators:**
- `page.getByRole('button', { name: 'Login' })`
- `page.getByRole("button", { name: "Login" })`
- `page.locator('button.btn-primary')`

### [Locator Exercise] Find by Text
**Difficulty:** Basic
**Description:** Use `getByText` to find the welcome message.

**Target HTML:**
```html
<section id="hero">
  <h1>Welcome to the Lab</h1>
  <p>Start your journey into automation.</p>
</section>
```

**Expected Locators:**
- `page.getByText('Welcome to the Lab')`
- `page.getByText("Welcome to the Lab")`
- `page.locator('h1')`

### [Locator Exercise] Use getByPlaceholder
**Difficulty:** Basic
**Description:** Locate the email input field by its placeholder text.

**Target HTML:**
```html
<div class="field">
  <input type="email" placeholder="name@example.com" id="email-123">
</div>
```

**Expected Locators:**
- `page.getByPlaceholder('name@example.com')`
- `page.getByPlaceholder("name@example.com")`

### [Locator Exercise] Handle Multiple Inputs
**Difficulty:** Intermediate
**Description:** Use `getByLabel` to locate the password field.

**Target HTML:**
```form
<form>
  <label for="user">Username</label>
  <input type="text" id="user">
  
  <label for="pass">Password</label>
  <input type="password" id="pass">
</form>
```

**Expected Locators:**
- `page.getByLabel('Password')`
- `page.getByLabel("Password")`
- `page.locator('#pass')`

### [Locator Exercise] Locate by Title
**Difficulty:** Intermediate
**Description:** Locate the delete icon which has a tooltip title "Delete item".

**Target HTML:**
```html
<div class="actions">
  <span title="Edit item" class="icon">✏️</span>
  <span title="Delete item" class="icon">🗑️</span>
</div>
```

**Expected Locators:**
- `page.getByTitle('Delete item')`
- `page.getByTitle("Delete item")`

### [Locator Exercise] Modern Test IDs
**Difficulty:** Intermediate
**Description:** Locate the element using the recommended `data-testid` attribute.

**Target HTML:**
```html
<div class="complex-widget">
  <button data-testid="submit-order-btn">Submit Order</button>
</div>
```

**Expected Locators:**
- `page.getByTestId('submit-order-btn')`
- `page.getByTestId("submit-order-btn")`

### [Locator Exercise] Selecting First Element
**Difficulty:** Intermediate
**Description:** Locate the first button in a list of similar buttons.

**Target HTML:**
```html
<div class="list">
  <button>Item 1</button>
  <button>Item 2</button>
  <button>Item 3</button>
</div>
```

**Expected Locators:**
- `page.getByRole('button').first()`
- `page.locator('button').first()`

### [Locator Exercise] Selecting by Index
**Difficulty:** Intermediate
**Description:** Locate the second (nth=1) button in the list.

**Target HTML:**
```html
<nav>
  <a href="/home">Home</a>
  <a href="/docs">Docs</a>
  <a href="/help">Help</a>
</nav>
```

**Expected Locators:**
- `page.getByRole('link').nth(1)`
- `page.locator('a').nth(1)`

### [Locator Exercise] Radio Button State
**Difficulty:** Intermediate
**Description:** Locate the radio button for "Dark Mode" specifically when it is checked.

**Target HTML:**
```html
<div class="settings">
  <label><input type="radio" name="theme" value="light"> Light Mode</label>
  <label><input type="radio" name="theme" value="dark" checked> Dark Mode</label>
</div>
```

**Expected Locators:**
- `page.getByRole('radio', { name: 'Dark Mode', checked: true })`
- `page.getByLabel('Dark Mode')`

### [Locator Exercise] Checkbox by Label
**Difficulty:** Intermediate
**Description:** Locate the "I agree to the terms" checkbox.

**Target HTML:**
```html
<div class="consent">
  <input type="checkbox" id="terms-checkbox">
  <label for="terms-checkbox">I agree to the terms</label>
</div>
```

**Expected Locators:**
- `page.getByLabel('I agree to the terms')`
- `page.getByRole('checkbox', { name: 'I agree to the terms' })`

### [Locator Exercise] Heading Levels
**Difficulty:** Basic
**Description:** Locate the level 2 heading "Settings Overview".

**Target HTML:**
```html
<main>
  <h1>Settings</h1>
  <section>
    <h2>Settings Overview</h2>
    <p>Manage your account preferences.</p>
  </section>
</main>
```

**Expected Locators:**
- `page.getByRole('heading', { name: 'Settings Overview', level: 2 })`
- `page.getByText('Settings Overview')`

### [Locator Exercise] Nested Filtering
**Difficulty:** Advanced
**Description:** Locate the "Save" button specifically within the "Account Settings" card.

**Target HTML:**
```html
<div class="card" id="profile">
  <h2>Profile</h2>
  <button>Save</button>
</div>
<div class="card" id="settings">
  <h2>Account Settings</h2>
  <button>Save</button>
</div>
```

**Expected Locators:**
- `page.locator('.card').filter({ hasText: 'Account Settings' }).getByRole('button')`
- `page.locator(".card").filter({ hasText: "Account Settings" }).getByRole("button")`

### [Locator Exercise] Filter by Child Element
**Difficulty:** Advanced
**Description:** Find the row that contains a specific status badge and click its options button.

**Target HTML:**
```html
<table>
  <tr>
    <td>User A</td>
    <td><span class="status">Active</span></td>
    <td><button class="opt">...</button></td>
  </tr>
  <tr>
    <td>User B</td>
    <td><span class="status">Pending</span></td>
    <td><button class="opt">...</button></td>
  </tr>
</table>
```

**Expected Locators:**
- `page.getByRole('row').filter({ has: page.locator('span.status', { hasText: 'Pending' }) }).getByRole('button')`
- `page.locator('tr').filter({ has: page.locator('span', { hasText: 'Pending' }) }).locator('button')`

### [Locator Exercise] Attribute Selectors
**Difficulty:** Advanced
**Description:** Locate an element based on a custom data-state attribute.

**Target HTML:**
```html
<div class="tab-list">
  <div class="tab" data-state="inactive">General</div>
  <div class="tab" data-state="active">Security</div>
  <div class="tab" data-state="inactive">Billing</div>
</div>
```

**Expected Locators:**
- `page.locator('[data-state="active"]')`
- `page.locator("[data-state='active']")`
- `page.getByText('Security')`

### [Locator Exercise] SVG Locators
**Difficulty:** Advanced
**Description:** Locate the "Close" button which contains an SVG icon with a specific title.

**Target HTML:**
```html
<button class="close-btn">
  <svg title="Close Modal" width="20" height="20">
    <circle cx="10" cy="10" r="5" />
  </svg>
</button>
```

**Expected Locators:**
- `page.getByTitle('Close Modal')`
- `page.locator('button').filter({ has: page.locator('svg[title="Close Modal"]') })`

### [Locator Exercise] Selecting by Column Header
**Difficulty:** Advanced
**Description:** Find the "Edit" link in the same row as the text "Alice".

**Target HTML:**
```html
<table>
  <thead><tr><th>Name</th><th>Action</th></tr></thead>
  <tbody>
    <tr><td>Alice</td><td><a href="/edit/1">Edit</a></td></tr>
    <tr><td>Bob</td><td><a href="/edit/2">Edit</a></td></tr>
  </tbody>
</table>
```

**Expected Locators:**
- `page.getByRole('row', { name: 'Alice' }).getByRole('link', { name: 'Edit' })`
- `page.locator('tr:has-text("Alice")').getByText('Edit')`

### [Locator Exercise] Hidden Elements (Visibility)
**Difficulty:** Advanced
**Description:** Locate the button that is currently visible (not hidden).

**Target HTML:**
```html
<div class="container">
  <button style="display: none;">Hidden Button</button>
  <button>Visible Button</button>
</div>
```

**Expected Locators:**
- `page.getByRole('button', { name: 'Visible Button' })`
- `page.locator('button:visible')`

### [Locator Exercise] Dropdown (Select)
**Difficulty:** Intermediate
**Description:** Locate the country dropdown menu.

**Target HTML:**
```html
<div class="form-group">
  <label for="country-select">Country</label>
  <select id="country-select">
    <option value="usa">USA</option>
    <option value="uk">UK</option>
    <option value="ca">Canada</option>
  </select>
</div>
```

**Expected Locators:**
- `page.getByLabel('Country')`
- `page.getByRole('combobox', { name: 'Country' })`

### [Locator Exercise] Accessible Alerts
**Difficulty:** Intermediate
**Description:** Locate the success message alert box.

**Target HTML:**
```html
<div role="alert" class="alert-success">
  Order has been placed successfully!
</div>
```

**Expected Locators:**
- `page.getByRole('alert')`
- `page.getByText('Order has been placed successfully!')`

### [Locator Exercise] Disambiguating Multiple Matches
**Difficulty:** Advanced
**Description:** Locate the "Buy" button specifically in the second product item.

**Target HTML:**
```html
<div class="products">
  <div class="product"><h3>Laptop</h3><button>Buy</button></div>
  <div class="product"><h3>Phone</h3><button>Buy</button></div>
  <div class="product"><h3>Watch</h3><button>Buy</button></div>
</div>
```

**Expected Locators:**
- `page.locator('.product').nth(1).getByRole('button')`
- `page.getByRole('button', { name: 'Buy' }).nth(1)`

### [Locator Exercise] Text Regex Matching
**Difficulty:** Advanced
**Description:** Locate the price text using a regular expression to match the dollar amount.

**Target HTML:**
```html
<div class="price-tag">
  Current Price: $149.99 (Limited Time)
</div>
```

**Expected Locators:**
- `page.getByText(/\$\d+\.\d+/)`
- `page.getByText('$149.99', { exact: false })`

### [Locator Exercise] Aria-DescribedBy
**Difficulty:** Advanced
**Description:** Locate the input field that is described by the help text "Enter your full legal name".

**Target HTML:**
```html
<div>
  <label for="name-input">Full Name</label>
  <input id="name-input" aria-describedby="help-text">
  <p id="help-text">Enter your full legal name</p>
</div>
```

**Expected Locators:**
- `page.getByLabel('Full Name')`
- `page.locator('#name-input')`

### [Locator Exercise] Readonly State
**Difficulty:** Intermediate
**Description:** Locate the API Key input which is marked as read-only.

**Target HTML:**
```html
<div class="api-field">
  <label for="api-key">API Key</label>
  <input type="text" id="api-key" value="sk_test_12345" readonly>
</div>
```

**Expected Locators:**
- `page.getByLabel('API Key')`
- `page.locator('#api-key[readonly]')`

### [Locator Exercise] Aria-Pressed (Toggle Button)
**Difficulty:** Intermediate
**Description:** Locate the "Mute" button specifically when it is in the "pressed" (muted) state.

**Target HTML:**
```html
<button aria-pressed="true" class="toggle-btn">Mute</button>
<button aria-pressed="false" class="toggle-btn">Unmute</button>
```

**Expected Locators:**
- `page.getByRole('button', { name: 'Mute', pressed: true })`
- `page.getByRole("button", { name: "Mute", pressed: true })`

### [Locator Exercise] Aria-Expanded (Dropdown/Menu)
**Difficulty:** Intermediate
**Description:** Locate the "User Profile" menu button when it is expanded.

**Target HTML:**
```html
<button aria-expanded="true" aria-haspopup="true">User Profile</button>
```

**Expected Locators:**
- `page.getByRole('button', { name: 'User Profile', expanded: true })`
- `page.getByRole("button", { name: "User Profile", expanded: true })`

### [Locator Exercise] Aria-Current (Navigation)
**Difficulty:** Intermediate
**Description:** Locate the "Docs" link when it is the current page.

**Target HTML:**
```html
<nav>
  <a href="/home">Home</a>
  <a href="/docs" aria-current="page">Docs</a>
  <a href="/blog">Blog</a>
</nav>
```

**Expected Locators:**
- `page.getByRole('link', { name: 'Docs' })`
- `page.locator('a[aria-current="page"]')`

### [Locator Exercise] Aria-Selected (Tabs)
**Difficulty:** Intermediate
**Description:** Locate the "Security" tab when it is selected.

**Target HTML:**
```html
<div role="tablist">
  <button role="tab" aria-selected="false">General</button>
  <button role="tab" aria-selected="true">Security</button>
</div>
```

**Expected Locators:**
- `page.getByRole('tab', { name: 'Security', selected: true })`
- `page.getByRole("tab", { name: "Security", selected: true })`

### [Locator Exercise] Aria-Busy (Loading State)
**Difficulty:** Advanced
**Description:** Locate the data container while it is in a "busy" (loading) state.

**Target HTML:**
```html
<div aria-busy="true" role="status">
  Loading records...
</div>
```

**Expected Locators:**
- `page.getByRole('status')`
- `page.locator('[aria-busy="true"]')`

### [Locator Exercise] Exact Name Match
**Difficulty:** Intermediate
**Description:** Locate the button with exact text "Save", ignoring the button "Save Changes".

**Target HTML:**
```html
<div class="actions">
  <button>Save Changes</button>
  <button>Save</button>
</div>
```

**Expected Locators:**
- `page.getByRole('button', { name: 'Save', exact: true })`
- `page.getByRole("button", { name: "Save", exact: true })`

### [Locator Exercise] Role and Level (Headings)
**Difficulty:** Basic
**Description:** Locate the Level 3 heading with the text "Recent Activity".

**Target HTML:**
```html
<div>
  <h1>Dashboard</h1>
  <h2>Overview</h2>
  <h3>Recent Activity</h3>
</div>
```

**Expected Locators:**
- `page.getByRole('heading', { name: 'Recent Activity', level: 3 })`
- `page.getByRole("heading", { name: "Recent Activity", level: 3 })`

### [Locator Exercise] Complex Table Filtering
**Difficulty:** Advanced
**Description:** Locate the checkbox in the row where the "Status" is "Error".

**Target HTML:**
```html
<table>
  <tr>
    <td><input type="checkbox"></td>
    <td>Job 101</td>
    <td><span class="status success">Success</span></td>
  </tr>
  <tr>
    <td><input type="checkbox"></td>
    <td>Job 102</td>
    <td><span class="status error">Error</span></td>
  </tr>
</table>
```

**Expected Locators:**
- `page.getByRole('row').filter({ has: page.locator('.status.error') }).getByRole('checkbox')`
- `page.locator('tr').filter({ has: page.locator('.error') }).locator('input[type="checkbox"]')`

### [Locator Exercise] Data-State Selectors
**Difficulty:** Advanced
**Description:** Locate the tab panel specifically when it has a "visible" data-state.

**Target HTML:**
```html
<div class="tabs">
  <div role="tabpanel" data-state="hidden">Content A</div>
  <div role="tabpanel" data-state="visible">Content B</div>
</div>
```

**Expected Locators:**
- `page.locator('[data-state="visible"]')`
- `page.getByRole('tabpanel').filter({ has: page.locator('[data-state="visible"]') })`

### [Locator Exercise] Aria-Invalid (Form Validation)
**Difficulty:** Intermediate
**Description:** Locate the input field that is currently marked as invalid.

**Target HTML:**
```html
<div class="form-field">
  <label for="email">Email</label>
  <input type="email" id="email" aria-invalid="true" value="invalid-email">
  <span class="error">Please enter a valid email address.</span>
</div>
```

**Expected Locators:**
- `page.getByLabel('Email')`
- `page.locator('input[aria-invalid="true"]')`

### [Locator Exercise] Aria-Required
**Difficulty:** Basic
**Description:** Locate the mandatory "Username" field.

**Target HTML:**
```html
<label for="user">Username *</label>
<input id="user" aria-required="true">
```

**Expected Locators:**
- `page.getByLabel('Username *')`
- `page.locator('[aria-required="true"]')`

### [Locator Exercise] Listbox and Options
**Difficulty:** Intermediate
**Description:** Locate the "Red" option in the color picker listbox.

**Target HTML:**
```html
<div role="listbox" aria-label="Pick a color">
  <div role="option">Blue</div>
  <div role="option">Red</div>
  <div role="option">Green</div>
</div>
```

**Expected Locators:**
- `page.getByRole('option', { name: 'Red' })`
- `page.getByRole("option", { name: "Red" })`

### [Locator Exercise] Multiselect State
**Difficulty:** Advanced
**Description:** Locate the multiselectable listbox.

**Target HTML:**
```html
<div role="listbox" aria-multiselectable="true">
  <div role="option" aria-selected="true">Option 1</div>
  <div role="option" aria-selected="false">Option 2</div>
</div>
```

**Expected Locators:**
- `page.getByRole('listbox', { name: '' }).filter({ has: page.locator('[aria-multiselectable="true"]') })`
- `page.locator('[aria-multiselectable="true"]')`

### [Locator Exercise] Dialog and Modals
**Difficulty:** Intermediate
**Description:** Locate the "Confirm Delete" dialog.

**Target HTML:**
```html
<div role="dialog" aria-labelledby="dialog-title">
  <h2 id="dialog-title">Confirm Delete</h2>
  <p>Are you sure?</p>
  <button>Delete</button>
</div>
```

**Expected Locators:**
- `page.getByRole('dialog', { name: 'Confirm Delete' })`
- `page.getByRole("dialog", { name: "Confirm Delete" })`

### [Locator Exercise] Tooltip Role
**Difficulty:** Basic
**Description:** Locate the help tooltip.

**Target HTML:**
```html
<div role="tooltip">Password must be at least 8 characters.</div>
```

**Expected Locators:**
- `page.getByRole('tooltip')`
- `page.getByText('Password must be at least 8 characters.')`

### [Locator Exercise] Tree and TreeItem
**Difficulty:** Advanced
**Description:** Locate the "Folder B" tree item.

**Target HTML:**
```html
<div role="tree">
  <div role="treeitem" aria-expanded="false">Folder A</div>
  <div role="treeitem" aria-expanded="true">
    Folder B
    <div role="group">
      <div role="treeitem">File 1</div>
    </div>
  </div>
</div>
```

**Expected Locators:**
- `page.getByRole('treeitem', { name: 'Folder B' })`
- `page.getByRole("treeitem", { name: "Folder B" })`

### [Locator Exercise] Grid and GridCell
**Difficulty:** Advanced
**Description:** Locate the grid cell with text "Data 2".

**Target HTML:**
```html
<div role="grid">
  <div role="row">
    <div role="gridcell">Data 1</div>
    <div role="gridcell">Data 2</div>
  </div>
</div>
```

**Expected Locators:**
- `page.getByRole('gridcell', { name: 'Data 2' })`
- `page.getByRole("gridcell", { name: "Data 2" })`

### [Locator Exercise] Sibling Selectors
**Difficulty:** Advanced
**Description:** Locate the input field that follows the "First Name" label.

**Target HTML:**
```html
<label>First Name</label>
<input type="text">
```

**Expected Locators:**
- `page.locator('label:has-text("First Name") + input')`
- `page.getByLabel('First Name')`

### [Locator Exercise] Partial Attribute Match
**Difficulty:** Advanced
**Description:** Locate the element where the ID starts with "user_".

**Target HTML:**
```html
<div id="user_88293" class="profile-card">
  User Profile Content
</div>
```

**Expected Locators:**
- `page.locator('[id^="user_"]')`
- `page.locator('div[id^="user_"]')`

### [Locator Exercise] Chained Locators
**Difficulty:** Advanced
**Description:** Locate the "Delete" button inside the row that contains "User 123".

**Target HTML:**
```html
<table>
  <tr>
    <td>User 123</td>
    <td><button>Delete</button></td>
  </tr>
  <tr>
    <td>User 456</td>
    <td><button>Delete</button></td>
  </tr>
</table>
```

**Expected Locators:**
- `page.getByRole('row').filter({ hasText: 'User 123' }).getByRole('button')`
- `page.getByRole("row").filter({ hasText: "User 123" }).getByRole("button")`
- `page.locator('tr:has-text("User 123")').locator('button')`
