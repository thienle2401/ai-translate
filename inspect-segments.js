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

    const segments = await page.evaluate((sel) => {
      const transUnits = Array.from(document.querySelectorAll(sel.row));
      return transUnits.map(u => {
        const idCell = u.querySelector(sel.idCell);
        const sourceCell = u.querySelector(sel.sourceCell);
        const targetCell = u.querySelector(sel.targetCell);
        const statusCell = u.querySelector(sel.statusCell);

        const isIncomplete = statusCell && !!statusCell.querySelector('[class*="incomplete"]');
        const statusText = statusCell ? statusCell.innerText.trim() : '';

        return {
          id: idCell ? idCell.innerText.trim() : '',
          sourceText: sourceCell ? sourceCell.innerText.trim() : '',
          targetText: targetCell ? targetCell.innerText.trim() : '',
          statusText,
          isIncomplete
        };
      });
    }, SELECTORS);

    console.log(`Total visible segments: ${segments.length}`);
    const incomplete = segments.filter(s => s.isIncomplete || !s.targetText || s.statusText === 'I');
    console.log(`Incomplete / Unfinished segments count in visible view: ${incomplete.length}`);
    console.log('Sample visible segments:');
    segments.slice(0, 10).forEach(s => {
      console.log(`Segment ${s.id} [${s.isIncomplete ? 'INCOMPLETE' : 'COMPLETE'}]:`);
      console.log(`  Source: ${s.sourceText}`);
      console.log(`  Target: ${s.targetText}`);
    });

    await browser.disconnect();
  } catch (err) {
    console.error('Error:', err.message);
  }
}

main();
