import puppeteer from 'puppeteer-core';
import { SELECTORS } from './src/xtm/selectors.js';
import { wait } from './src/utils/browser.js';
import fs from 'fs';

async function main() {
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

  // Step 1: Jump to 1 and collect
  console.log('Jumping to segment 1...');
  await page.click('#transUnitActivator');
  for (let j = 0; j < 5; j++) {
    await page.keyboard.press('Backspace');
  }
  await page.keyboard.type('1');
  await page.keyboard.press('Enter');
  await wait(2500);

  for (let step = 0; step < 20; step++) {
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
          const isIncomplete = statusCell && (
            !!statusCell.querySelector('[class*="incomplete"]') ||
            statusCell.innerText.trim() === 'I' ||
            !statusCell.querySelector('[class*="complete"]')
          );
          found[id] = {
            id,
            sourceText: sourceCell.innerText.trim(),
            sourceHTML: sourceCell.innerHTML,
            targetText: targetCell ? targetCell.innerText.trim() : '',
            isIncomplete
          };
        }
      });

      const scrollContainer = document.querySelector(sel.scrollContainer);
      if (scrollContainer) {
        scrollContainer.scrollTop += 400;
      }

      return found;
    }, SELECTORS);

    Object.assign(allSegments, batch);
    await wait(400);
  }

  // Step 2: Jump to 128 and collect
  console.log('Jumping to segment 128...');
  await page.click('#transUnitActivator');
  for (let j = 0; j < 5; j++) {
    await page.keyboard.press('Backspace');
  }
  await page.keyboard.type('128');
  await page.keyboard.press('Enter');
  await wait(2500);

  for (let step = 0; step < 20; step++) {
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
          const isIncomplete = statusCell && (
            !!statusCell.querySelector('[class*="incomplete"]') ||
            statusCell.innerText.trim() === 'I' ||
            !statusCell.querySelector('[class*="complete"]')
          );
          found[id] = {
            id,
            sourceText: sourceCell.innerText.trim(),
            sourceHTML: sourceCell.innerHTML,
            targetText: targetCell ? targetCell.innerText.trim() : '',
            isIncomplete
          };
        }
      });

      const scrollContainer = document.querySelector(sel.scrollContainer);
      if (scrollContainer) {
        scrollContainer.scrollTop += 400;
      }

      return found;
    }, SELECTORS);

    Object.assign(allSegments, batch);
    await wait(400);
  }

  // Filter 1 to 128
  const result = {};
  for (let i = 1; i <= 128; i++) {
    const key = i.toString();
    if (allSegments[key]) {
      result[key] = allSegments[key];
    }
  }

  fs.mkdirSync('data', { recursive: true });
  fs.writeFileSync('data/source_segments.json', JSON.stringify(result, null, 2), 'utf8');

  const keys = Object.keys(result).map(Number).sort((a, b) => a - b);
  console.log(`Successfully extracted ${keys.length} segments (range ${keys[0]} to ${keys[keys.length - 1]}) to data/source_segments.json`);

  await browser.disconnect();
}

main();
