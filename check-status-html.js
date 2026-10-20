import puppeteer from 'puppeteer-core';
import { SELECTORS } from './src/xtm/selectors.js';

async function main() {
  const browser = await puppeteer.connect({
    browserURL: 'http://localhost:9222',
    defaultViewport: null
  });

  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('workbench'));
  if (!page) {
    console.error('XTM Workbench page not found!');
    await browser.disconnect();
    return;
  }

  const result = await page.evaluate((sel) => {
    const unit = document.querySelector(sel.row);
    if (!unit) return null;
    const statusCell = unit.querySelector(sel.statusCell);
    return {
      statusHTML: statusCell ? statusCell.innerHTML : '',
      statusText: statusCell ? statusCell.innerText : '',
      classList: statusCell ? Array.from(statusCell.classList) : []
    };
  }, SELECTORS);

  console.log('Status Cell Breakdown for Segment 1:', JSON.stringify(result, null, 2));

  await browser.disconnect();
}

main();
