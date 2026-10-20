import fs from 'fs';

const data = JSON.parse(fs.readFileSync('data/source_segments.json', 'utf8'));

const list = [];
for (let i = 1; i <= 128; i++) {
  const seg = data[i.toString()];
  list.push({
    id: i,
    sourceText: seg ? seg.sourceText : '',
    sourceHTML: seg ? seg.sourceHTML : '',
    existingTarget: seg ? seg.targetText : ''
  });
}

fs.writeFileSync('data/all_128_inspection.json', JSON.stringify(list, null, 2), 'utf8');
console.log('Saved data/all_128_inspection.json');
