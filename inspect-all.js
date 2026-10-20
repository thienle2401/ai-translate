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

    const allSegments = {};
    let lastMax = 0;

    for (let i = 0; i < 30; i++) {
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
            const isIncomplete = statusCell && (
              !!statusCell.querySelector('[class*="incomplete"]') ||
              statusCell.innerText.trim() === 'I' ||
              !statusCell.querySelector('[class*="complete"]')
            );

            res[id] = {
              id,
              sourceText: sourceCell ? sourceCell.innerText.trim() : '',
              sourceHTML: sourceCell ? sourceCell.innerHTML : '',
              targetText: targetCell ? targetCell.innerText.trim() : '',
              isIncomplete
            };
          }
        });

        const scrollContainer = document.querySelector(sel.scrollContainer);
        if (scrollContainer) scrollContainer.scrollTop += 400;

        return res;
      }, SELECTORS);

      Object.assign(allSegments, batch);

      const ids = Object.keys(allSegments).map(Number);
      const maxId = Math.max(...ids);
      console.log(`Step ${i}: Total collected so far: ${ids.length}, Max ID: ${maxId}`);

      if (maxId === lastMax && i > 5) {
        break;
      }
      lastMax = maxId;
      await new Promise(r => setTimeout(r, 600));
    }

    console.log(`\n=== TOTAL SEGMENTS COLLECTED: ${Object.keys(allSegments).length} ===`);
    const ids = Object.keys(allSegments).map(Number).sort((a, b) => a - b);
    console.log(`Segment Range: ${ids[0]} to ${ids[ids.length - 1]}`);

    const untranslated = Object.values(allSegments).filter(s => {
      // Untranslated or incomplete
      return !s.targetText || s.targetText.trim() === '' || s.targetText === s.sourceText || s.isIncomplete;
    });

    console.log(`\nFound ${untranslated.length} segments that need review / translation.`);
    untranslated.forEach(s => {
      console.log(`[ID ${s.id}] Incomplete=${s.isIncomplete} | Source: "${s.sourceText}" | Target: "${s.targetText}"`);
    });

    await browser.disconnect();
  } catch (err) {
    console.error('Error:', err.message);
  }
}

main();
