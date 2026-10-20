import { wait } from '../utils/browser.js';
import { SELECTORS } from './selectors.js';

/**
 * Automates injecting and saving translations into XTM Workbench.
 * @param {import('puppeteer-core').Page} page - Active Puppeteer page.
 * @param {Object} translations - Dictionary mapping segment ID to translated text.
 * @param {Object} sourceMetadata - Dictionary containing original extracted segment HTML & text structure.
 * @param {Object} [options] - Additional options such as force re-injection.
 */
export async function injectTranslations(page, translations, sourceMetadata, options = {}) {
  console.log(`Starting translation injection for ${Object.keys(translations).length} segments...`);

  const ids = Object.keys(translations).map(Number).sort((a, b) => a - b);

  for (const id of ids) {
    const idStr = id.toString();
    const translation = translations[idStr];
    const sourceInfo = sourceMetadata[idStr];

    if (!translation) continue;

    console.log(`\n--- Injecting Segment ${id} ---`);

    let targetNode = null;
    let retries = 0;

    // Bring element into DOM (if it's not rendered due to virtual rendering)
    while (retries < 10) {
      targetNode = await page.evaluate((segId, sel) => {
        const transUnits = Array.from(document.querySelectorAll(sel.row));
        const unit = transUnits.find(u => {
          const idCell = u.querySelector(sel.idCell);
          return idCell && idCell.innerText.trim() === segId;
        });

        if (unit) {
          const statusCell = unit.querySelector(sel.statusCell);
          const isIncomplete = statusCell && !!statusCell.querySelector('.transUnitStatus-module_incomplete_GlOtz, [class*="incomplete"]');
          
          return {
            found: true,
            isIncomplete
          };
        }

        const loadedIds = transUnits.map(u => {
          const idCell = u.querySelector(sel.idCell);
          return idCell ? parseInt(idCell.innerText.trim(), 10) : 0;
        }).filter(Boolean);

        return {
          found: false,
          minLoaded: loadedIds.length > 0 ? Math.min(...loadedIds) : 0,
          maxLoaded: loadedIds.length > 0 ? Math.max(...loadedIds) : 0
        };
      }, idStr, SELECTORS);

      if (targetNode.found) {
        break;
      }

      // If not found in DOM, jump using transUnitActivator if it is outside loaded range
      if (id > targetNode.maxLoaded || id < targetNode.minLoaded) {
        console.log(`ID ${id} is outside loaded range [${targetNode.minLoaded}, ${targetNode.maxLoaded}]. Jumping programmatically...`);
        await page.click('#transUnitActivator');
        for (let j = 0; j < 5; j++) {
          await page.keyboard.press('Backspace');
        }
        await page.keyboard.type(idStr);
        await page.keyboard.press('Enter');
        await wait(3000);
      } else {
        console.log(`ID ${id} is within loaded range but missing in DOM. Scrolling...`);
        await page.evaluate((sel) => {
          const scrollContainer = document.querySelector(sel.scrollContainer);
          if (scrollContainer) scrollContainer.scrollTop += 200;
        }, SELECTORS);
        await wait(1000);
      }
      retries++;
    }

    if (!targetNode || !targetNode.found) {
      console.error(`Failed to find segment ${id} in DOM. Skipping.`);
      continue;
    }

    if (!targetNode.isIncomplete && !options.force) {
      console.log(`Segment ${id} is already completed. Skipping (use force option to overwrite).`);
      continue;
    }

    // Now that the segment is found in DOM, scroll it into center of viewport once, wait, and get coordinates
    console.log(`Scrolling segment ${id} into center of viewport...`);
    await page.evaluate((segId, sel) => {
      const transUnits = Array.from(document.querySelectorAll(sel.row));
      const unit = transUnits.find(u => u.querySelector(sel.idCell).innerText.trim() === segId);
      if (unit) {
        unit.scrollIntoView({ block: 'center' });
      }
    }, idStr, SELECTORS);

    await wait(600);

    // Get final coordinates after scrolling finishes
    const finalCoords = await page.evaluate((segId, sel) => {
      const transUnits = Array.from(document.querySelectorAll(sel.row));
      const unit = transUnits.find(u => u.querySelector(sel.idCell).innerText.trim() === segId);
      if (unit) {
        const rect = unit.getBoundingClientRect();
        return {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        };
      }
      return null;
    }, idStr, SELECTORS);

    if (!finalCoords) {
      console.error(`Failed to locate coordinates for segment ${id}. Skipping.`);
      continue;
    }

    console.log(`Clicking target cell at (${finalCoords.x}, ${finalCoords.y})...`);
    await page.mouse.click(finalCoords.x, finalCoords.y);
    await wait(800);

    const hasTags = sourceInfo && (sourceInfo.sourceHTML.includes('<img') || sourceInfo.sourceHTML.includes('inline-image'));

    if (hasTags) {
      console.log(`Preserving inline formatting tags (Alt + Insert)...`);
      // Clear input
      await page.evaluate((segId, sel) => {
        const transUnits = Array.from(document.querySelectorAll(sel.row));
        const unit = transUnits.find(u => u.querySelector(sel.idCell).innerText.trim() === segId);
        if (unit) {
          const input = unit.querySelector(sel.targetCell);
          if (input) input.innerHTML = '';
        }
      }, idStr, SELECTORS);
      await wait(400);

      // Copy source tags
      await page.keyboard.down('Alt');
      await page.keyboard.press('Insert');
      await page.keyboard.up('Alt');
      await wait(1200);

      // Replace text node content
      const sourceText = sourceInfo.sourceText;
      const isQA = sourceText.startsWith('Assessor:') || sourceText.startsWith('Response:') || /^Question \d+:/.test(sourceText);

      await page.evaluate((segId, text, qaMode, sel) => {
        const transUnits = Array.from(document.querySelectorAll(sel.row));
        const unit = transUnits.find(u => u.querySelector(sel.idCell).innerText.trim() === segId);
        if (unit) {
          const input = unit.querySelector(sel.targetCell);
          if (input) {
            const spans = Array.from(input.querySelectorAll('span.text-node'));
            if (Array.isArray(text)) {
              for (let idx = 0; idx < Math.min(spans.length, text.length); idx++) {
                spans[idx].innerText = text[idx];
              }
            } else if (spans.length >= 1) {
              if (qaMode) {
                const colonIndex = text.indexOf(':');
                if (colonIndex !== -1 && spans.length >= 2) {
                  spans[0].innerText = text.substring(0, colonIndex);
                  spans[1].innerText = text.substring(colonIndex);
                } else {
                  spans[0].innerText = text;
                }
              } else {
                spans[0].innerText = text;
              }
            }
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
          }
        }
      }, idStr, translation, isQA, SELECTORS);
      await wait(600);

    } else {
      console.log(`Setting text directly...`);
      await page.evaluate((segId, text, sel) => {
        const transUnits = Array.from(document.querySelectorAll(sel.row));
        const unit = transUnits.find(u => u.querySelector(sel.idCell).innerText.trim() === segId);
        if (unit) {
          const input = unit.querySelector(sel.targetCell);
          if (input) {
            input.focus();
            input.innerText = text;
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
          }
        }
      }, idStr, translation, SELECTORS);
      await wait(500);
    }

    // Trigger dirty state
    console.log('Marking editor dirty...');
    await page.keyboard.press('Space');
    await wait(300);
    await page.keyboard.press('Backspace');
    await wait(800);

    // Save and complete
    console.log('Saving segment (Alt + ;)...');
    await page.keyboard.down('Alt');
    await page.keyboard.press(';');
    await page.keyboard.up('Alt');
    await wait(1500);
  }
  console.log('Injection complete.');
}
