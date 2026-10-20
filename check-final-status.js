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

  await page.evaluate((sel) => {
    const scrollContainer = document.querySelector(sel.scrollContainer);
    if (scrollContainer) scrollContainer.scrollTop = 0;
  }, SELECTORS);
  await new Promise(r => setTimeout(r, 1000));

  const statusSummary = {};
  for (let i = 0; i < 40; i++) {
    const batch = await page.evaluate((sel) => {
      const transUnits = Array.from(document.querySelectorAll(sel.row));
      const res = {};
      transUnits.forEach(u => {
        const idCell = u.querySelector(sel.idCell);
        const id = idCell ? idCell.innerText.trim() : '';
        const statusCell = u.querySelector(sel.statusCell);
        const targetCell = u.querySelector(sel.targetCell);
        if (id) {
          const hasCheckmark = statusCell && !!statusCell.querySelector('.fa-check, [class*="completed"]');
          res[id] = {
            id,
            targetText: targetCell ? targetCell.innerText.trim() : '',
            hasCheckmark,
            statusText: statusCell ? statusCell.innerText.trim() : ''
          };
        }
      });
      const scrollContainer = document.querySelector(sel.scrollContainer);
      if (scrollContainer) scrollContainer.scrollTop += 350;
      return res;
    }, SELECTORS);

    Object.assign(statusSummary, batch);
    if (Object.keys(statusSummary).length >= 76) break;
    await new Promise(r => setTimeout(r, 400));
  }

  const ids = Object.keys(statusSummary).map(Number).sort((a, b) => a - b);
  const completedCount = Object.values(statusSummary).filter(s => s.hasCheckmark).length;

  console.log(`\n=== VERIFICATION RESULTS FOR ALL 76 SEGMENTS ===`);
  console.log(`Total segments checked: ${ids.length}`);
  console.log(`Completed (Checkmark present) segments: ${completedCount} / 76`);

  await browser.disconnect();
}

main();
