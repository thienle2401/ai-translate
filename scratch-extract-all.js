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

    // 1. Scroll up to segment 1
    console.log('Scrolling up to segment 1...');
    let currentMin = 999;
    let scrollUpRetries = 0;
    while (currentMin > 1 && scrollUpRetries < 50) {
      const minId = await page.evaluate((sel) => {
        const transUnits = Array.from(document.querySelectorAll(sel.row));
        const ids = transUnits.map(u => {
          const idCell = u.querySelector(sel.idCell);
          return idCell ? parseInt(idCell.innerText.trim(), 10) : null;
        }).filter(Number.isInteger);
        
        const scrollContainer = document.querySelector(sel.scrollContainer);
        if (scrollContainer) scrollContainer.scrollTop = 0;
        
        return ids.length > 0 ? Math.min(...ids) : null;
      }, SELECTORS);

      if (minId !== null) {
        currentMin = minId;
        console.log(`Current min ID loaded: ${currentMin}`);
        if (currentMin === 1) break;
      }

      // Click first row to load more elements above
      const clickCoords = await page.evaluate((sel) => {
        const transUnits = Array.from(document.querySelectorAll(sel.row));
        if (transUnits.length > 0) {
          const rect = transUnits[0].getBoundingClientRect();
          return { x: rect.left + 50, y: rect.top + 10 };
        }
        return null;
      }, SELECTORS);

      if (clickCoords) {
        await page.mouse.click(clickCoords.x, clickCoords.y);
        await wait(1500);
      }
      scrollUpRetries++;
    }

    // 2. Scroll down and extract all up to 411
    console.log('Starting extraction from segment 1 to 411...');
    const allSegments = {};
    let lastMax = 0;
    let stuckCount = 0;

    for (let i = 0; i < 150; i++) {
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
        if (scrollContainer) scrollContainer.scrollTop += 350;

        return res;
      }, SELECTORS);

      Object.assign(allSegments, batch);

      const ids = Object.keys(allSegments).map(Number);
      const maxId = Math.max(...ids);
      const minId = Math.min(...ids);
      console.log(`Step ${i}: Total collected: ${ids.length}, Range: ${minId} to ${maxId}`);

      if (maxId >= 411 && ids.length >= 411 * 0.9) {
        console.log('Reached target ID 411 and collected sufficient coverage.');
        break;
      }

      if (maxId === lastMax) {
        stuckCount++;
        if (stuckCount >= 3) {
          // click last visible to trigger loading more
          const clickCoords = await page.evaluate((sel) => {
            const transUnits = Array.from(document.querySelectorAll(sel.row));
            if (transUnits.length > 0) {
              const lastUnit = transUnits[transUnits.length - 1];
              const rect = lastUnit.getBoundingClientRect();
              return { x: rect.left + 50, y: rect.top + 10 };
            }
            return null;
          }, SELECTORS);

          if (clickCoords) {
            await page.mouse.click(clickCoords.x, clickCoords.y);
            await wait(2000);
          }
          stuckCount = 0;
        }
      } else {
        stuckCount = 0;
        lastMax = maxId;
      }
      await wait(800);
    }

    fs.writeFileSync('data/source_segments.json', JSON.stringify(allSegments, null, 2), 'utf8');
    console.log(`\n=== DONE: Collected ${Object.keys(allSegments).length} segments. Saved to data/source_segments.json ===`);

    await browser.disconnect();
  } catch (err) {
    console.error('Error:', err.message);
  }
}

main();
