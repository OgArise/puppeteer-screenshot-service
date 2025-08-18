// pages/api/render-png.js
const puppeteer = require('puppeteer-core');
const chromium = require('chrome-aws-lambda');

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const { html } = req.body;
  if (!html) {
    return res.status(400).json({ error: 'Missing HTML in request body.' });
  }

  let browser;
  try {
    browser = await puppeteer.launch({
      executablePath: await chromium.executablePath,
      args: chromium.args,
      headless: chromium.headless,
      defaultViewport: { width: 600, height: 800 }
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const screenshot = await page.screenshot({
      type: 'png',
      clip: { x: 0, y: 0, width: 600, height: 800 }
    });

    await browser.close();

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 's-maxage=31536000');
    res.send(screenshot);
  } catch (error) {
    console.error('Puppeteer error:', error);
    if (browser) await browser.close().catch(() => {});
    res.status(500).json({ error: 'Failed to generate screenshot.' });
  }
}