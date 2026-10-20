import puppeteer from 'puppeteer-core';
import { SELECTORS } from './src/xtm/selectors.js';
import { wait } from './src/utils/browser.js';
import fs from 'fs';

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

    console.log('Jumping to segment 1...');
    await page.click('#transUnitActivator');
    for (let j = 0; j < 5; j++) {
      await page.keyboard.press('Backspace');
    }
    await page.keyboard.type('1');
    await page.keyboard.press('Enter');
    await wait(2500);

    const allSegments = {};

    for (let step = 0; step < 50; step++) {
      const batch = await page.evaluate((sel) => {
        const transUnits = Array.from(document.querySelectorAll(sel.row));
        const found = {};
        transUnits.forEach(u => {
          const idCell = u.querySelector(sel.idCell);
          const sourceCell = u.querySelector(sel.sourceCell);
          const targetCell = u.querySelector(sel.targetCell);
          const id = idCell ? idCell.innerText.trim() : '';

          if (id && sourceCell) {
            found[id] = {
              id,
              sourceText: sourceCell.innerText.trim(),
              sourceHTML: sourceCell.innerHTML,
              targetText: targetCell ? targetCell.innerText.trim() : ''
            };
          }
        });

        const scrollContainer = document.querySelector(sel.scrollContainer);
        if (scrollContainer) {
          scrollContainer.scrollTop += 350;
        }

        return found;
      }, SELECTORS);

      Object.assign(allSegments, batch);
      const keys = Object.keys(allSegments).map(Number);
      console.log(`Step ${step}: Collected ${keys.length} segments. Range: [${Math.min(...keys)}, ${Math.max(...keys)}]`);
      if (keys.length >= 134) break;
      await wait(600);
    }

    fs.writeFileSync('data/source_segments.json', JSON.stringify(allSegments, null, 2), 'utf8');
    console.log(`Successfully extracted ${Object.keys(allSegments).length} segments to data/source_segments.json`);

    await browser.disconnect();
  } catch (err) {
    console.error('Error:', err.message);
  }
}

main();
