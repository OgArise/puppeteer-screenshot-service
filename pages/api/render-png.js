// pages/api/render-png.js
import puppeteer from 'puppeteer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const { html } = req.body;

  if (!html) {
    return res.status(400).json({ error: 'Missing HTML in request body.' });
  }

  let browser;
  try {
    // Launch Puppeteer with Vercel-compatible args
    browser = await puppeteer.launch({
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--headless=new'
      ],
      timeout: 10000
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    // Take screenshot
    const screenshot = await page.screenshot({
      type: 'png',
      fullPage: false,
      clip: { x: 0, y: 0, width: 600, height: 800 }
    });

    await browser.close();

    // Return PNG
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 's-maxage=31536000, stale-while-revalidate');
    res.send(screenshot);
  } catch (error) {
    console.error('Puppeteer error:', error);
    if (browser) await browser.close().catch(console.error);
    res.status(500).json({ error: 'Failed to generate screenshot.', details: error.message });
  }
}