import fs from 'fs';
import path from 'path';
import { connectBrowser } from './utils/browser.js';
import { extractSegments } from './xtm/extractor.js';

async function main() {
  const args = process.argv.slice(2);
  let startId = 261;
  let endId = 667;
  let outputPath = 'data/source_segments.json';
  let port = 9222;

  // Simple CLI argument parsing
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--start' && args[i + 1]) {
      startId = parseInt(args[i + 1], 10);
    }
    if (args[i] === '--end' && args[i + 1]) {
      endId = parseInt(args[i + 1], 10);
    }
    if (args[i] === '--output' && args[i + 1]) {
      outputPath = args[i + 1];
    }
    if (args[i] === '--port' && args[i + 1]) {
      port = parseInt(args[i + 1], 10);
    }
  }

  try {
    console.log(`Connecting to Chrome on port ${port}...`);
    const { browser, page } = await connectBrowser('workbench', port);

    const segments = await extractSegments(page, startId, endId);

    // Ensure output directory exists
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(outputPath, JSON.stringify(segments, null, 2), 'utf8');
    console.log(`Successfully extracted ${Object.keys(segments).length} segments. Saved to: ${outputPath}`);

    browser.disconnect();
  } catch (error) {
    console.error('Extraction failed:', error);
    process.exit(1);
  }
}

main();
