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

    console.log('Jumping to segment 130 to inspect the rest...');
    await page.click('#transUnitActivator');
    for (let j = 0; j < 5; j++) {
      await page.keyboard.press('Backspace');
    }
    await page.keyboard.type('130');
    await page.keyboard.press('Enter');
    await wait(2500);

    const allExtracted = {};

    for (let step = 0; step < 30; step++) {
      const batch = await page.evaluate((sel) => {
        const transUnits = Array.from(document.querySelectorAll(sel.row));
        const found = {};
        transUnits.forEach(u => {
          const idCell = u.querySelector(sel.idCell);
          const sourceCell = u.querySelector(sel.sourceCell);
          const targetCell = u.querySelector(sel.targetCell);
          const statusCell = u.querySelector(sel.statusCell);
          const id = idCell ? idCell.innerText.trim() : '';

          if (id && sourceCell) {
            found[id] = {
              id,
              sourceText: sourceCell.innerText.trim(),
              sourceHTML: sourceCell.innerHTML,
              targetText: targetCell ? targetCell.innerText.trim() : '',
              isComplete: statusCell && !!statusCell.querySelector('[class*="complete"]')
            };
          }
        });

        const scrollContainer = document.querySelector(sel.scrollContainer);
        if (scrollContainer) {
          scrollContainer.scrollTop += 350;
        }

        return found;
      }, SELECTORS);

      Object.assign(allExtracted, batch);
      const keys = Object.keys(allExtracted).map(Number).sort((a, b) => a - b);
      console.log(`Step ${step}: Range seen = [${keys[0]}, ${keys[keys.length - 1]}], Total seen = ${keys.length}`);
      await wait(600);
    }

    const ids = Object.keys(allExtracted).map(Number).sort((a, b) => a - b);
    const maxId = ids[ids.length - 1];
    console.log(`\nAbsolute max segment ID found: ${maxId}`);

    // Filter segments >= 135
    const rest = {};
    for (const [id, data] of Object.entries(allExtracted)) {
      if (parseInt(id, 10) >= 135) {
        rest[id] = data;
        console.log(`[${id}] Source: "${data.sourceText}" | HTML: "${data.sourceHTML}" | Target: "${data.targetText}" | Complete: ${data.isComplete}`);
      }
    }

    fs.writeFileSync('data/rest_segments.json', JSON.stringify(rest, null, 2), 'utf8');
    console.log(`Saved ${Object.keys(rest).length} remaining segments to data/rest_segments.json`);

    await browser.disconnect();
  } catch (err) {
    console.error('Error:', err.message);
  }
}

main();
