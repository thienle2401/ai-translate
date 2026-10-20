import puppeteer from 'puppeteer-core';
import { SELECTORS } from './src/xtm/selectors.js';
import { wait } from './src/utils/browser.js';

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

    // Scroll to top
    await page.evaluate((sel) => {
      const scrollContainer = document.querySelector(sel.scrollContainer);
      if (scrollContainer) scrollContainer.scrollTop = 0;
    }, SELECTORS);
    await wait(1000);

    let allExtracted = {};
    let lastMax = 0;
    let stuckCount = 0;

    for (let step = 0; step < 100; step++) {
      const batch = await page.evaluate((sel) => {
        const transUnits = Array.from(document.querySelectorAll(sel.row));
        const found = {};
        transUnits.forEach(u => {
          const idCell = u.querySelector(sel.idCell);
          const sourceCell = u.querySelector(sel.sourceCell);
          const targetCell = u.querySelector(sel.targetCell);
          const statusCell = u.querySelector(sel.statusCell);
          const id = idCell ? idCell.innerText.trim() : '';

          if (id) {
            found[id] = {
              id,
              sourceText: sourceCell ? sourceCell.innerText.trim() : '',
              sourceHTML: sourceCell ? sourceCell.innerHTML : '',
              targetText: targetCell ? targetCell.innerText.trim() : '',
              isComplete: statusCell && !!statusCell.querySelector('[class*="complete"]')
            };
          }
        });

        const scrollContainer = document.querySelector(sel.scrollContainer);
        if (scrollContainer) {
          scrollContainer.scrollTop += 600;
        }

        return found;
      }, SELECTORS);

      Object.assign(allExtracted, batch);

      const ids = Object.keys(allExtracted).map(Number);
      const maxId = ids.length > 0 ? Math.max(...ids) : 0;
      console.log(`Step ${step}: Total collected=${ids.length}, max ID=${maxId}`);

      if (maxId === lastMax) {
        stuckCount++;
        if (stuckCount >= 5) {
          console.log(`Reached absolute end of document at segment ID ${maxId}`);
          break;
        }
      } else {
        stuckCount = 0;
        lastMax = maxId;
      }

      await wait(800);
    }

    console.log(`\n=== Total segments extracted across whole document: ${Object.keys(allExtracted).length} ===`);
    const ids = Object.keys(allExtracted).map(Number).sort((a, b) => a - b);
    console.log(`Min ID: ${ids[0]}, Max ID: ${ids[ids.length - 1]}`);

    // Check which segments are > 100
    const remaining = ids.filter(i => i > 100);
    console.log(`Segments > 100 count: ${remaining.length}`);
    remaining.forEach(i => {
      console.log(`[${i}] Source: "${allExtracted[i].sourceText}" | Target: "${allExtracted[i].targetText}" | Complete: ${allExtracted[i].isComplete}`);
    });

    await browser.disconnect();
  } catch (err) {
    console.error('Error:', err.message);
  }
}

main();
