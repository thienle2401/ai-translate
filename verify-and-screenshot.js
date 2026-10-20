import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { SELECTORS } from './src/xtm/selectors.js';

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

  const artifactDir = '/Users/thien/.gemini/antigravity-ide/brain/b28e9754-124c-48bb-8e58-d371212a6fef';

  // 1. Scroll to top & screenshot Page 1
  await page.evaluate((sel) => {
    const scrollContainer = document.querySelector(sel.scrollContainer);
    if (scrollContainer) scrollContainer.scrollTop = 0;
  }, SELECTORS);
  await new Promise(r => setTimeout(r, 1500));

  const screenshot1Path = path.join(artifactDir, 'verification_page1.png');
  await page.screenshot({ path: screenshot1Path, fullPage: false });
  console.log(`Saved screenshot 1: ${screenshot1Path}`);

  // 2. Scroll to segment 76 & screenshot Page 2
  await page.evaluate((sel) => {
    const scrollContainer = document.querySelector(sel.scrollContainer);
    if (scrollContainer) scrollContainer.scrollTop = scrollContainer.scrollHeight;
  }, SELECTORS);
  await new Promise(r => setTimeout(r, 1500));

  const screenshot2Path = path.join(artifactDir, 'verification_page2.png');
  await page.screenshot({ path: screenshot2Path, fullPage: false });
  console.log(`Saved screenshot 2: ${screenshot2Path}`);

  // 3. Verify total completion status across all 76 segments
  await page.evaluate((sel) => {
    const scrollContainer = document.querySelector(sel.scrollContainer);
    if (scrollContainer) scrollContainer.scrollTop = 0;
  }, SELECTORS);
  await new Promise(r => setTimeout(r, 1000));

  const finalCheck = {};
  for (let i = 0; i < 40; i++) {
    const batch = await page.evaluate((sel) => {
      const transUnits = Array.from(document.querySelectorAll(sel.row));
      const res = {};
      transUnits.forEach(u => {
        const idCell = u.querySelector(sel.idCell);
        const id = idCell ? idCell.innerText.trim() : '';
        const statusCell = u.querySelector(sel.statusCell);
        const targetCell = u.querySelector(sel.targetCell);
        if (id) {
          const isIncomplete = statusCell && !!statusCell.querySelector('[class*="incomplete"]');
          res[id] = {
            id,
            targetText: targetCell ? targetCell.innerText.trim() : '',
            isIncomplete,
            statusText: statusCell ? statusCell.innerText.trim() : ''
          };
        }
      });
      const scrollContainer = document.querySelector(sel.scrollContainer);
      if (scrollContainer) scrollContainer.scrollTop += 350;
      return res;
    }, SELECTORS);

    Object.assign(finalCheck, batch);
    if (Object.keys(finalCheck).length >= 76) break;
    await new Promise(r => setTimeout(r, 400));
  }

  const ids = Object.keys(finalCheck).map(Number).sort((a, b) => a - b);
  const incompleteCount = Object.values(finalCheck).filter(s => s.isIncomplete).length;

  console.log(`\nFinal Verification Results:`);
  console.log(`Total collected: ${ids.length}`);
  console.log(`Incomplete segments count: ${incompleteCount}`);

  await browser.disconnect();
}

main();
