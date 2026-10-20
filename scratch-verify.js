import puppeteer from 'puppeteer-core';
import { SELECTORS } from './src/xtm/selectors.js';
import { wait } from './src/utils/browser.js';

async function main() {
  const artifactDir = '/Users/thien/.gemini/antigravity-ide/brain/52654c4e-8434-4652-83cb-5b388ab17533';

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
    await wait(1500);

    // Screenshot top segments
    await page.screenshot({ path: `${artifactDir}/top_segments.png` });
    console.log('Saved top_segments.png');

    // Check completion status of top segments
    const topStatus = await page.evaluate((sel) => {
      const rows = Array.from(document.querySelectorAll(sel.row));
      return rows.map(r => {
        const idCell = r.querySelector(sel.idCell);
        const targetCell = r.querySelector(sel.targetCell);
        const statusCell = r.querySelector(sel.statusCell);
        const isComplete = statusCell && !!statusCell.querySelector('[class*="complete"]');
        return {
          id: idCell ? idCell.innerText.trim() : '',
          targetText: targetCell ? targetCell.innerText.trim() : '',
          isComplete
        };
      }).slice(0, 15);
    }, SELECTORS);

    console.log('Top segments sample status:', JSON.stringify(topStatus, null, 2));

    // Scroll to bottom
    await page.evaluate((sel) => {
      const scrollContainer = document.querySelector(sel.scrollContainer);
      if (scrollContainer) scrollContainer.scrollTop = 20000;
    }, SELECTORS);
    await wait(1500);

    // Screenshot bottom segments
    await page.screenshot({ path: `${artifactDir}/bottom_segments.png` });
    console.log('Saved bottom_segments.png');

    const bottomStatus = await page.evaluate((sel) => {
      const rows = Array.from(document.querySelectorAll(sel.row));
      return rows.map(r => {
        const idCell = r.querySelector(sel.idCell);
        const targetCell = r.querySelector(sel.targetCell);
        const statusCell = r.querySelector(sel.statusCell);
        const isComplete = statusCell && !!statusCell.querySelector('[class*="complete"]');
        return {
          id: idCell ? idCell.innerText.trim() : '',
          targetText: targetCell ? targetCell.innerText.trim() : '',
          isComplete
        };
      }).slice(-15);
    }, SELECTORS);

    console.log('Bottom segments sample status:', JSON.stringify(bottomStatus, null, 2));

    await browser.disconnect();
  } catch (err) {
    console.error('Error:', err.message);
  }
}

main();
