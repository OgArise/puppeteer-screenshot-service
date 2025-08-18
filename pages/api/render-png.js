// pages/api/render-png.js
import { chromium } from 'playwright';

export default async function handler(req, res) {
  console.log('📥 Request received:', req.method);

  if (req.method !== 'POST') {
    console.log('❌ Method not allowed');
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const { html } = req.body;
  if (!html) {
    console.log('❌ Missing HTML in request body');
    return res.status(400).json({ error: 'Missing HTML in request body.' });
  }

  console.log('✅ HTML received, launching Chromium...');

  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    console.log('✅ Browser launched');

    const page = await browser.newPage();
    console.log('✅ Page created');

    await page.setContent(html, { waitUntil: 'networkidle' });
    console.log('✅ Content set');

    const screenshot = await page.screenshot({
      type: 'png',
      fullPage: false,
      clip: { x: 0, y: 0, width: 600, height: 800 }
    });
    console.log('✅ Screenshot taken');

    await browser.close();
    console.log('✅ Browser closed');

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 's-maxage=31536000');
    res.send(screenshot);
  } catch (error) {
    console.error('🔥 Playwright error:', error.message);
    console.error('Full error:', error);
    if (browser) {
      await browser.close().catch(err => console.error('Failed to close browser:', err));
    }
    res.status(500).json({ 
      error: 'Failed to generate screenshot',
      details: error.message 
    });
  }
}