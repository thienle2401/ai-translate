import puppeteer from 'puppeteer-core';
import { wait } from './src/utils/browser.js';
import path from 'path';

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

  // 1. Jump to segment 1 & capture
  console.log('Jumping to segment 1 for screenshot...');
  await page.click('#transUnitActivator');
  for (let j = 0; j < 5; j++) {
    await page.keyboard.press('Backspace');
  }
  await page.keyboard.type('1');
  await page.keyboard.press('Enter');
  await wait(2500);

  await page.screenshot({ path: 'data/screenshot_start.png', fullPage: false });
  console.log('Saved data/screenshot_start.png');

  // 2. Jump to segment 128 & capture
  console.log('Jumping to segment 128 for screenshot...');
  await page.click('#transUnitActivator');
  for (let j = 0; j < 5; j++) {
    await page.keyboard.press('Backspace');
  }
  await page.keyboard.type('128');
  await page.keyboard.press('Enter');
  await wait(2500);

  await page.screenshot({ path: 'data/screenshot_end.png', fullPage: false });
  console.log('Saved data/screenshot_end.png');

  await browser.disconnect();
}

main();
