import puppeteer from 'puppeteer-core';

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

    const allFrames = page.frames();
    console.log(`Found ${allFrames.length} frames in the page:`);
    for (let i = 0; i < allFrames.length; i++) {
      const frame = allFrames[i];
      const name = frame.name();
      const url = frame.url();
      
      let transUnitsCount = 0;
      try {
        transUnitsCount = await frame.evaluate(() => {
          return document.querySelectorAll('[class*="TransUnit-module_transUnit"]').length;
        });
      } catch (e) {
        // May fail due to cross-origin or frame not ready
      }

      console.log(`Frame ${i}: Name="${name}" | URL=${url} | .trans-unit count=${transUnitsCount}`);
      
      if (transUnitsCount > 0) {
        const range = await frame.evaluate(() => {
          const idCells = Array.from(document.querySelectorAll('[class*="IdCell-module_idCell"]'));
          const ids = idCells.map(cell => parseInt(cell.innerText.trim(), 10)).filter(Number.isInteger);
          return {
            minVisible: ids.length > 0 ? Math.min(...ids) : null,
            maxVisible: ids.length > 0 ? Math.max(...ids) : null,
            totalVisible: ids.length
          };
        });
        console.log(`  -> Segment range in this frame: Min=${range.minVisible}, Max=${range.maxVisible}, Count=${range.totalVisible}`);
      }
    }

    await browser.disconnect();
  } catch (err) {
    console.error('Error:', err.message);
  }
}

main();
