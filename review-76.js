import fs from 'fs';

const data = JSON.parse(fs.readFileSync('data/extracted_all_76.json', 'utf8'));

console.log(`Total segments: ${data.length}\n`);

data.forEach(s => {
  console.log(`--- [Segment ${s.id}] (Status: ${s.statusText}) ---`);
  console.log(`Source: "${s.sourceText}"`);
  console.log(`Target: "${s.targetText}"`);
  if (!s.targetText) {
    console.log(`>>> EMPTY TARGET! <<<`);
  }
});
