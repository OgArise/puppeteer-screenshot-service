// pages/api/render-png.js
import { chromium } from 'playwright';

export default async function handler(req, res) {
  // ✅ Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // ✅ Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // ✅ Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  // ✅ Parse body
  const { html } = req.body;
  if (!html) {
    return res.status(400).json({ error: 'Missing HTML in request body.' });
  }

  let browser;
  try {
    browser = await chromium.launch();
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle' });

    const screenshot = await page.screenshot({
      type: 'png',
      fullPage: false,
      clip: { x: 0, y: 0, width: 600, height: 800 }
    });

    await browser.close();

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 's-maxage=31536000');
    res.send(screenshot);
  } catch (error) {
    console.error('Playwright error:', error);
    if (browser) await browser.close().catch(() => {});
    res.status(500).json({ error: 'Failed to generate screenshot.' });
  }
}