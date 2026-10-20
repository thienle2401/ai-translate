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

    let maxSeen = 0;
    let stuckCount = 0;

    for (let i = 0; i < 50; i++) {
      const currentMax = await page.evaluate((sel) => {
        const transUnits = Array.from(document.querySelectorAll(sel.row));
        const ids = transUnits.map(u => {
          const idCell = u.querySelector(sel.idCell);
          return idCell ? parseInt(idCell.innerText.trim(), 10) : null;
        }).filter(Number.isInteger);

        const scrollContainer = document.querySelector(sel.scrollContainer);
        if (scrollContainer) {
          scrollContainer.scrollTop += 2000;
        }

        return ids.length > 0 ? Math.max(...ids) : 0;
      }, SELECTORS);

      console.log(`Scroll step ${i}: max ID seen = ${currentMax}`);

      if (currentMax > maxSeen) {
        maxSeen = currentMax;
        stuckCount = 0;
      } else {
        stuckCount++;
        if (stuckCount >= 5) {
          console.log(`Reached end of document at max ID: ${maxSeen}`);
          break;
        }
      }
      await wait(1000);
    }

    console.log(`\nFinal max segment ID in document: ${maxSeen}`);

    // Scroll back to top
    await page.evaluate((sel) => {
      const scrollContainer = document.querySelector(sel.scrollContainer);
      if (scrollContainer) scrollContainer.scrollTop = 0;
    }, SELECTORS);

    await browser.disconnect();
  } catch (err) {
    console.error('Error:', err.message);
  }
}

main();
