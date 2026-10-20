import puppeteer from 'puppeteer-core';

/**
 * Connects to the local Chrome instance running with remote debugging enabled.
 * Finds and returns the page matching the given URL pattern.
 * @param {string} urlPattern - Substring to match page URL.
 * @param {number} port - Chrome remote debugging port.
 * @returns {Promise<import('puppeteer-core').Page>} Puppeteer page object.
 */
export async function connectBrowser(urlPattern, port = 9222) {
  const browser = await puppeteer.connect({
    browserURL: `http://localhost:${port}`,
    defaultViewport: null
  });

  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes(urlPattern));

  if (!page) {
    browser.disconnect();
    throw new Error(`Active tab with URL matching "${urlPattern}" was not found.`);
  }

  return { browser, page };
}

/**
 * Clicks at exact coordinates on the page.
 * @param {import('puppeteer-core').Page} page 
 * @param {number} x 
 * @param {number} y 
 */
export async function clickCoords(page, x, y) {
  await page.mouse.click(x, y);
}

/**
 * Helper to delay execution.
 * @param {number} ms 
 */
export function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
