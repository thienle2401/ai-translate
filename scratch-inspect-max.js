import puppeteer from 'puppeteer-core';
import { SELECTORS } from './src/xtm/selectors.js';

async function main() {
  try {
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

    console.log('Checking segment range...');
    const result = await page.evaluate((sel) => {
      const transUnits = Array.from(document.querySelectorAll(sel.row));
      const ids = transUnits.map(u => {
        const idCell = u.querySelector(sel.idCell);
        return idCell ? parseInt(idCell.innerText.trim(), 10) : null;
      }).filter(Number.isInteger);

      return {
        visibleCount: transUnits.length,
        minVisible: ids.length > 0 ? Math.min(...ids) : null,
        maxVisible: ids.length > 0 ? Math.max(...ids) : null
      };
    }, SELECTORS);

    console.log('Result:', JSON.stringify(result, null, 2));

    await browser.disconnect();
  } catch (err) {
    console.error('Error:', err.message);
  }
}

main();
