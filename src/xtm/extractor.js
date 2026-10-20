import { wait } from '../utils/browser.js';
import { SELECTORS } from './selectors.js';

/**
 * Extracts source text segments from XTM Workbench virtual grid.
 * @param {import('puppeteer-core').Page} page - Active Puppeteer page.
 * @param {number} startId - The lower bound segment ID to start keeping track of.
 * @param {number} endId - The upper bound segment ID to extract.
 * @returns {Promise<Object>} Extracted segments mapping ID to source/target data.
 */
export async function extractSegments(page, startId, endId) {
  console.log(`Starting extraction for IDs ${startId} to ${endId}...`);
  const extracted = {};
  let lastMaxId = 0;
  let stuckCount = 0;

  for (let step = 0; step < 100; step++) {
    const data = await page.evaluate((sel) => {
      const transUnits = Array.from(document.querySelectorAll(sel.row));
      const found = {};

      transUnits.forEach(u => {
        const idCell = u.querySelector(sel.idCell);
        const idStr = idCell ? idCell.innerText.trim() : '';
        const sourceCell = u.querySelector(sel.sourceCell);
        const targetCell = u.querySelector(sel.targetCell);
        if (idStr && sourceCell) {
          found[idStr] = {
            id: idStr,
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

      return { found };
    }, SELECTORS);

    // Merge found segments
    Object.assign(extracted, data.found);

    const ids = Object.keys(extracted).map(Number).filter(id => id >= startId);
    const maxId = ids.length > 0 ? Math.max(...ids) : 0;
    const count = Object.keys(extracted).filter(k => {
      const num = parseInt(k, 10);
      return num >= startId && num <= endId;
    }).length;

    console.log(`Step ${step}: Found ${Object.keys(data.found).length} visible. Extracted in range [${startId}, ${endId}]: ${count}. Current max ID: ${maxId}`);

    if (maxId >= endId && count >= (endId - startId + 1) * 0.9) { // 90% coverage to allow skipped non-text or headers
      console.log(`Target range coverage reached!`);
      break;
    }

    if (maxId === lastMaxId) {
      stuckCount++;
      if (stuckCount >= 3) {
        console.log('Stuck or reached end of current loaded block. Clicking the last visible segment to trigger loading more...');
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
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
        stuckCount = 0;
      }
    } else {
      stuckCount = 0;
      lastMaxId = maxId;
    }

    await wait(800);
  }

  // Filter dictionary to requested range
  const result = {};
  for (let id = startId; id <= endId; id++) {
    const key = id.toString();
    if (extracted[key]) {
      result[key] = extracted[key];
    }
  }

  return result;
}
