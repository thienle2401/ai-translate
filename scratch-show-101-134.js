import fs from 'fs';

const data = JSON.parse(fs.readFileSync('data/source_segments.json', 'utf8'));

for (let i = 101; i <= 134; i++) {
  const seg = data[i.toString()] || {};
  console.log(`${i}: "${seg.sourceText}" | HTML: "${seg.sourceHTML}"`);
}
