import fs from 'fs';

const data = JSON.parse(fs.readFileSync('data/source_segments.json', 'utf8'));

console.log(`Loaded ${Object.keys(data).length} segments.`);
for (let i = 1; i <= 128; i++) {
  const seg = data[i.toString()];
  if (!seg) {
    console.log(`[${i}] MISSING`);
    continue;
  }
  console.log(`=== SEGMENT ${i} ===`);
  console.log(`HTML: ${seg.sourceHTML}`);
  console.log(`Source: ${seg.sourceText}`);
  console.log(`Existing Target: ${seg.targetText}`);
}
