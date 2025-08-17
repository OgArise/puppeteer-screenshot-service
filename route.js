// pages/api/route.js
import puppeteer from 'puppeteer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const { html } = req.body;
  if (!html) {
    return res.status(400).json({ error: 'Missinging HTML in request body.'});
  }

  let browser;
  try {
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--headless=new'],
      timeout: 10000,
    });

    const page = await browser.newPage();
    awaitpage.setContent(html, { waitUntil: 'networkidle0'});

    const screenshot = awaitpage.screenshot({
      type: 'png',
      fullPage: false,
      clip: { x: 0, y: 0, width: 600, height: 800 },
    });

    awaitbrowser.close();

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 's-maxage=31536000');
    res.send(screenshot);
  } catch (error) {
    if (browser) awaitbrowser.close().catch(() => {});
    console.error('Puppeteer error:', error);
    res.status(500).json({ error: 'Failed to generate screenshot.'});
  }
}