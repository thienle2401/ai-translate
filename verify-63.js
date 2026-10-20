import puppeteer from 'puppeteer-core';
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

  const screenshot1Path = path.join(artifactDir, 'verification_63_page1.png');
  await page.screenshot({ path: screenshot1Path, fullPage: false });
  console.log(`Saved screenshot 1: ${screenshot1Path}`);

  // 2. Scroll to segment 63 & screenshot Page 2
  await page.evaluate((sel) => {
    const scrollContainer = document.querySelector(sel.scrollContainer);
    if (scrollContainer) scrollContainer.scrollTop = scrollContainer.scrollHeight;
  }, SELECTORS);
  await new Promise(r => setTimeout(r, 1500));

  const screenshot2Path = path.join(artifactDir, 'verification_63_page2.png');
  await page.screenshot({ path: screenshot2Path, fullPage: false });
  console.log(`Saved screenshot 2: ${screenshot2Path}`);

  await browser.disconnect();
}

main();
