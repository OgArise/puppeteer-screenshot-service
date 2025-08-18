// test-playwright.js
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setContent('<h1>Hello</h1>');
  await page.screenshot({ path: 'test-standalone.png' });
  await browser.close();
  console.log('✅ Screenshot saved as test-standalone.png');
})();