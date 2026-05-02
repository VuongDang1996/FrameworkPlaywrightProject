# Module 17: Mobile Emulation & Touch Events

Testing how your web application behaves on mobile devices is critical. Playwright provides built-in device profiles to emulate mobile viewports, user agents, pixel ratios, and touch capabilities. You can simulate mobile-specific hardware features like geolocation, changing orientation, and touch gestures.

---

## 🧠 Flashcards

**Concept:** Playwright `devices` dictionary
Playwright exports a `devices` object containing predefined profiles for popular mobile devices (e.g., `'iPhone 13'`, `'Pixel 5'`). These profiles include the correct `userAgent`, `viewport`, `deviceScaleFactor`, `isMobile`, and `hasTouch` settings.

**Concept:** Emulating a Device in configuration
In `playwright.config.ts`, you can configure a project to use a device profile: `use: { ...devices['iPhone 13'] }`. This ensures all tests in that project run in the emulated iPhone environment.

**Concept:** Emulating a Device in a single test
To emulate a device for a specific test context, you can create a new context with the device settings: `const context = await browser.newContext({ ...devices['Pixel 5'] });`

**Concept:** locator.tap()
`await locator.tap()` performs a touch gesture (tap) on the element. It is the mobile equivalent of `click()`. Playwright ensures the element is visible and receives pointer events before tapping.

**Concept:** Granting Permissions
Mobile apps often require permissions like location or camera. Use `await context.grantPermissions(['geolocation'], { origin: 'https://example.com' })` to automatically grant these permissions during tests without showing browser prompts.

**Concept:** Emulating Geolocation
To test location-based features, you can set the exact coordinates of the emulated device: `await context.setGeolocation({ latitude: 48.8584, longitude: 2.2945 })`.

**Concept:** Offline Mode Emulation
Test how your mobile PWA handles lost connections by simulating an offline state: `await context.setOffline(true)`.

**Concept:** Dark Mode / Color Scheme Emulation
Mobile users often use dark mode. You can emulate this system preference either in config `use: { colorScheme: 'dark' }` or mid-test via `await page.emulateMedia({ colorScheme: 'dark' })`.

---

## 📝 Quizzes

### How do you configure a Playwright project to emulate an iPhone 13?
- [ ] `use: { browserName: 'ios' }`
- [x] `use: { ...devices['iPhone 13'] }`
- [ ] `use: { mobile: true, device: 'iPhone 13' }`
- [ ] `use: { viewport: 'iPhone 13' }`

### Which method is used to simulate a user tapping on a touchscreen?
- [ ] `locator.touch()`
- [ ] `locator.press()`
- [x] `locator.tap()`
- [ ] `locator.click({ isTouch: true })`

### How do you automatically allow geolocation prompts in a test?
- [x] `await context.grantPermissions(['geolocation'])`
- [ ] `page.acceptDialogs('geolocation')`
- [ ] `use: { geolocation: 'allow' }`
- [ ] `page.on('permission', p => p.accept())`

### How do you simulate a device going offline?
- [ ] `page.route('**', route => route.abort())`
- [ ] `await browser.disconnect()`
- [x] `await context.setOffline(true)`
- [ ] `await page.emulateNetwork({ type: 'offline' })`

### What is the `devices` object exported by `@playwright/test`?
- [ ] A function to connect to real physical devices in the cloud
- [ ] A dictionary of available screen resolutions only
- [x] A dictionary of predefined profiles containing user agent, viewport, scale factor, and touch settings for popular devices
- [ ] A plugin to run Appium tests

---

## 🏋️ Coding Exercises

### [Exercise] Emulate a Mobile Device in a Test
- **Difficulty:** Basic
- **Description:** Create a new browser context that emulates an iPhone 13, navigate to a site, and assert that the viewport width is typical for a mobile device.

```typescript
import { test, expect, devices } from '@playwright/test';

test('Emulate iPhone 13', async ({ browser }) => {
  // 1. Create a new context using the 'iPhone 13' device profile
  //    const iPhone = devices['iPhone 13'];
  //    const context = await browser.newContext({ ...iPhone });
  // YOUR CODE HERE

  // 2. Create a new page from this context
  // YOUR CODE HERE

  // 3. Navigate to 'https://playwright.dev'
  // YOUR CODE HERE

  // 4. Assert that the viewport width is less than 500 (iPhone 13 is 390px wide)
  //    const width = page.viewportSize()?.width;
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect, devices } from '@playwright/test';

test('Emulate iPhone 13', async ({ browser }) => {
  const iPhone = devices['iPhone 13'];
  const context = await browser.newContext({ ...iPhone });
  const page = await context.newPage();

  await page.goto('https://playwright.dev');

  const width = page.viewportSize()?.width;
  expect(width).toBeLessThan(500);
});
```

---

### [Exercise] Geolocation and Permissions
- **Difficulty:** Intermediate
- **Description:** Grant geolocation permissions and set a specific latitude and longitude. Navigate to a maps or location testing site and verify the location is mocked.

```typescript
import { test, expect } from '@playwright/test';

test('Mock Geolocation to Paris', async ({ context, page }) => {
  // Paris coordinates: Latitude: 48.8584, Longitude: 2.2945

  // 1. Grant 'geolocation' permissions to the context
  // YOUR CODE HERE

  // 2. Set the geolocation of the context to the Paris coordinates
  // YOUR CODE HERE

  // 3. Navigate to a site that reads geolocation
  await page.goto('https://the-internet.herokuapp.com/geolocation');

  // 4. Click the 'Where am I?' button
  // YOUR CODE HERE

  // 5. Assert that the resulting latitude text contains '48.8584'
  //    Hint: wait for the element '#lat-value' to have the text
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

test('Mock Geolocation to Paris', async ({ context, page }) => {
  await context.grantPermissions(['geolocation']);
  await context.setGeolocation({ latitude: 48.8584, longitude: 2.2945 });

  await page.goto('https://the-internet.herokuapp.com/geolocation');
  await page.getByRole('button', { name: 'Where am I?' }).click();

  await expect(page.locator('#lat-value')).toHaveText('48.8584');
  await expect(page.locator('#long-value')).toHaveText('2.2945');
});
```

---

### [Exercise] Offline Mode Handling
- **Difficulty:** Intermediate
- **Description:** Test how an application behaves when the network drops by simulating offline mode mid-test.

```typescript
import { test, expect } from '@playwright/test';

test('Handle offline mode', async ({ page, context }) => {
  await page.goto('https://playwright.dev');
  
  // Assert page is initially loaded by checking title
  await expect(page).toHaveTitle(/Playwright/);

  // 1. Simulate device going offline
  // YOUR CODE HERE

  // 2. Try to navigate to a different page and catch the expected navigation error
  //    let error = null;
  //    try { await page.goto('https://github.com'); } catch (e) { error = e; }
  // YOUR CODE HERE

  // 3. Assert that an error was caught (since we are offline)
  // YOUR CODE HERE
});
```

### Solution
```typescript
import { test, expect } from '@playwright/test';

test('Handle offline mode', async ({ page, context }) => {
  await page.goto('https://playwright.dev');
  await expect(page).toHaveTitle(/Playwright/);

  await context.setOffline(true);

  let error = null;
  try {
    await page.goto('https://github.com');
  } catch (e) {
    error = e;
  }

  expect(error).not.toBeNull();
  expect(error.message).toContain('net::ERR_INTERNET_DISCONNECTED');
});
```
