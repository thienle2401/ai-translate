import puppeteer from 'puppeteer-core';
import fs from 'fs';
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

  // Scroll to top first
  await page.evaluate((sel) => {
    const scrollContainer = document.querySelector(sel.scrollContainer);
    if (scrollContainer) scrollContainer.scrollTop = 0;
  }, SELECTORS);
  await new Promise(r => setTimeout(r, 1000));

  const allSegments = {};
  let lastMax = 0;

  for (let i = 0; i < 50; i++) {
    const batch = await page.evaluate((sel) => {
      const transUnits = Array.from(document.querySelectorAll(sel.row));
      const res = {};
      transUnits.forEach(u => {
        const idCell = u.querySelector(sel.idCell);
        const id = idCell ? idCell.innerText.trim() : '';
        const sourceCell = u.querySelector(sel.sourceCell);
        const targetCell = u.querySelector(sel.targetCell);
        const statusCell = u.querySelector(sel.statusCell);

        if (id) {
          res[id] = {
            id: parseInt(id, 10),
            sourceText: sourceCell ? sourceCell.innerText.trim() : '',
            sourceHTML: sourceCell ? sourceCell.innerHTML : '',
            targetText: targetCell ? targetCell.innerText.trim() : '',
            targetHTML: targetCell ? targetCell.innerHTML : '',
            statusText: statusCell ? statusCell.innerText.trim() : ''
          };
        }
      });

      const scrollContainer = document.querySelector(sel.scrollContainer);
      if (scrollContainer) scrollContainer.scrollTop += 350;

      return res;
    }, SELECTORS);

    Object.assign(allSegments, batch);

    const ids = Object.keys(allSegments).map(Number);
    const maxId = Math.max(...ids);
    console.log(`Step ${i}: Collected ${ids.length} segments so far. Max ID: ${maxId}`);

    if (maxId >= 76 && ids.length >= 76) {
      break;
    }
    if (maxId === lastMax && i > 15) {
      break;
    }
    lastMax = maxId;
    await new Promise(r => setTimeout(r, 600));
  }

  // Save to file
  const sorted = Object.values(allSegments).sort((a, b) => a.id - b.id);
  fs.writeFileSync('data/extracted_all_76.json', JSON.stringify(sorted, null, 2), 'utf8');
  console.log(`Saved ${sorted.length} segments to data/extracted_all_76.json`);

  await browser.disconnect();
}

main();
