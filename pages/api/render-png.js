// pages/api/render-png.js
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

chromium.setHeadlessMode = true;   // always headless on serverless
chromium.setGraphicsMode = false;  // safer on Vercel

export const config = { api: { bodyParser: { sizeLimit: '1mb' } } };

// Small helper to keep things from hanging forever
const withTimeout = (p, ms, msg = 'Timeout') =>
  Promise.race([p, new Promise((_, r) => setTimeout(() => r(new Error(msg)), ms))]);

export default async function handler(req, res) {
  // CORS (optional)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST' });

  const {
    // input sources
    html,
    url,

    // viewport & render
    width = 1280,
    height = 720,
    deviceScaleFactor = 1,
    fullPage = false,
    transparent = false,

    // optional waits
    waitForSelector,

    // output
    format = 'png',           // 'png' | 'jpeg'
    quality = 80              // used only for jpeg (0–100)
  } = req.body || {};

  if (!html && !url) {
    return res.status(400).json({ error: 'Provide either "html" or "url".' });
  }
  if (format !== 'png' && format !== 'jpeg') {
    return res.status(400).json({ error: 'format must be "png" or "jpeg"' });
  }
  if (url && !/^https?:\/\//i.test(url)) {
    return res.status(400).json({ error: 'URL must start with http:// or https://' });
  }

  let browser;
  let page;
  try {
    const executablePath = await chromium.executablePath();
    if (!executablePath) throw new Error('chromium.executablePath() returned null');

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

    page = await browser.newPage();

    // Helpful debug hooks (comment out in prod if too chatty)
    page.on('console', (m) => console.log('[page]', m.type(), m.text()));
    page.on('pageerror', (e) => console.error('[pageerror]', e));

    if (url) {
      await withTimeout(
        page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'], timeout: 30000 }),
        30000,
        'Navigation timeout'
      );
    } else {
      await withTimeout(
        page.setContent(html, { waitUntil: ['domcontentloaded', 'networkidle0'], timeout: 30000 }),
        30000,
        'SetContent timeout'
      );
    }

    if (waitForSelector) {
      await withTimeout(
        page.waitForSelector(waitForSelector, { timeout: 10000 }),
        10000,
        `waitForSelector timeout: ${waitForSelector}`
      );
    }

    const shotOpts = {
      type: format,
      fullPage: Boolean(fullPage),
      omitBackground: Boolean(transparent)
    };
    if (format === 'jpeg') shotOpts.quality = Math.max(0, Math.min(100, Number(quality)));

    const image = await withTimeout(
      page.screenshot(shotOpts),
      20000,
      'Screenshot timeout'
    );

    res.setHeader('Content-Type', format === 'jpeg' ? 'image/jpeg' : 'image/png');
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Content-Disposition', `inline; filename=render.${format === 'jpeg' ? 'jpg' : 'png'}`);
    return res.status(200).end(image);
  } catch (err) {
    console.error('Render failed:', err);
    return res.status(500).json({ error: 'Render failed', details: String(err?.message || err) });
  } finally {
    try { if (page) await page.close(); } catch {}
    try { if (browser) await browser.close(); } catch {}
  }
}
