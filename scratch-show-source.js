import fs from 'fs';

const data = JSON.parse(fs.readFileSync('data/source_segments.json', 'utf8'));
console.log(`Total extracted segments: ${Object.keys(data).length}`);
for (const [id, seg] of Object.entries(data)) {
  console.log(`[${id}] Source: "${seg.sourceText}" | HTML: "${seg.sourceHTML}"`);
}
