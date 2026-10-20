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

    const info = await page.evaluate(() => {
      // Find all iframes
      const iframes = Array.from(document.querySelectorAll('iframe')).map(iframe => ({
        src: iframe.src,
        id: iframe.id,
        className: iframe.className
      }));

      // Find interesting classes
      const bodyClasses = document.body ? document.body.className : '';
      const bodyText = document.body ? document.body.innerText.substring(0, 500) : '';
      const allDivClasses = Array.from(document.querySelectorAll('div'))
        .map(div => div.className)
        .filter(Boolean)
        .slice(0, 50);

      return {
        iframes,
        bodyClasses,
        bodyText,
        allDivClasses: [...new Set(allDivClasses)]
      };
    });

    console.log('DOM Inspection:');
    console.log('Iframes:', JSON.stringify(info.iframes, null, 2));
    console.log('Body classes:', info.bodyClasses);
    console.log('Body Text (first 500 chars):', info.bodyText);
    console.log('Sample Div Classes:', info.allDivClasses);

    await browser.disconnect();
  } catch (err) {
    console.error('Error:', err.message);
  }
}

main();
