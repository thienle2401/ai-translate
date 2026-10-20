import fs from 'fs';
import { connectBrowser } from './utils/browser.js';
import { injectTranslations } from './xtm/injector.js';

async function main() {
  const args = process.argv.slice(2);
  let dictPath = 'data/translations.json';
  let metadataPath = 'data/source_segments.json';
  let port = 9222;
  let force = false;

  // Simple CLI argument parsing
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--dict' && args[i + 1]) {
      dictPath = args[i + 1];
    }
    if (args[i] === '--metadata' && args[i + 1]) {
      metadataPath = args[i + 1];
    }
    if (args[i] === '--port' && args[i + 1]) {
      port = parseInt(args[i + 1], 10);
    }
    if (args[i] === '--force') {
      force = true;
    }
  }

  try {
    if (!fs.existsSync(dictPath)) {
      throw new Error(`Translations file not found at: ${dictPath}`);
    }
    if (!fs.existsSync(metadataPath)) {
      throw new Error(`Source metadata file not found at: ${metadataPath}`);
    }

    const translations = JSON.parse(fs.readFileSync(dictPath, 'utf8'));
    const sourceMetadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));

    console.log(`Connecting to Chrome on port ${port}...`);
    const { browser, page } = await connectBrowser('workbench', port);

    await injectTranslations(page, translations, sourceMetadata, { force });

    console.log('Successfully completed batch injection.');
    browser.disconnect();
  } catch (error) {
    console.error('Injection failed:', error);
    process.exit(1);
  }
}

main();
