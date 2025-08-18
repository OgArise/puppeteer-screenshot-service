// pages/api/render-png.js
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

chromium.setHeadlessMode = true;
chromium.setGraphicsMode = false;

export const config = {
  api: { bodyParser: { sizeLimit: '1mb' } }
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST' });

  const { html, width = 1280, height = 720, deviceScaleFactor = 1 } = req.body || {};
  if (!html) return res.status(400).json({ error: 'Missing HTML in request body.' });

  let browser;
  try {
    const executablePath = await chromium.executablePath(); // 🔥 force serverless chrome path

    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath,
      headless: chromium.headless,
      defaultViewport: {
        width: Number(width),
        height: Number(height),
        deviceScaleFactor: Number(deviceScaleFactor)
      }
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: ['domcontentloaded', 'networkidle0'] });

    const png = await page.screenshot({ type: 'png' });

    await browser.close();

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).end(png);
  } catch (err) {
    if (browser) try { await browser.close(); } catch {}
    console.error('Render error:', err);
    res.status(500).json({ error: 'Render failed', details: String(err?.message || err) });
  }
}
