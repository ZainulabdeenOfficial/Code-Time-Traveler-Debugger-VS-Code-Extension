// Screenshot module for Code Time Travel Debugger (JS/Web)
// Requires: npm install puppeteer
const puppeteer = require('puppeteer');
const fetch = require('node-fetch');

async function captureAndSendScreenshot(sessionId, step, url, snapshotData) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  const screenshot = await page.screenshot({ encoding: 'base64' });
  await browser.close();

  // Attach screenshot to snapshot data
  const data = {
    ...snapshotData,
    screenshot,
    session_id: sessionId,
    step,
  };

  // Send to backend
  await fetch('http://localhost:5000/snapshot', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

module.exports = { captureAndSendScreenshot }; 