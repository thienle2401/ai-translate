import fs from 'fs';

const data = JSON.parse(fs.readFileSync('data/source_segments.json', 'utf8'));

for (let id = 1; id <= 100; id++) {
  const seg = data[id.toString()] || {};
  console.log(`${id}: ${seg.sourceText}`);
}
