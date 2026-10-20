import puppeteer from 'puppeteer-core';
import { SELECTORS } from './src/xtm/selectors.js';
import { wait } from './src/utils/browser.js';

async function main() {
  const browser = await puppeteer.connect({
    browserURL: 'http://localhost:9222',
    defaultViewport: null
  });

  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('workbench'));

  console.log('Testing jump to segment 128...');
  await page.click('#transUnitActivator');
  for (let j = 0; j < 5; j++) {
    await page.keyboard.press('Backspace');
  }
  await page.keyboard.type('128');
  await page.keyboard.press('Enter');
  await wait(2500);

  const range = await page.evaluate((sel) => {
    const transUnits = Array.from(document.querySelectorAll(sel.row));
    const ids = transUnits.map(u => {
      const idCell = u.querySelector(sel.idCell);
      return idCell ? parseInt(idCell.innerText.trim(), 10) : null;
    }).filter(Number.isInteger);
    return {
      count: ids.length,
      min: ids.length > 0 ? Math.min(...ids) : null,
      max: ids.length > 0 ? Math.max(...ids) : null,
      ids
    };
  }, SELECTORS);

  console.log('After jumping to 128:', range);
  await browser.disconnect();
}

main();
