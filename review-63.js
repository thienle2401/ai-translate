import fs from 'fs';

const data = JSON.parse(fs.readFileSync('data/extracted_all_63.json', 'utf8'));

let out = '';
data.forEach(s => {
  out += `[Segment ${s.id}] Status: ${s.statusText}\n`;
  out += `  SRC: ${s.sourceText}\n`;
  out += `  TGT: ${s.targetText}\n`;
  out += `  HTML: ${s.sourceHTML}\n\n`;
});

fs.writeFileSync('data/review_summary_63.txt', out, 'utf8');
console.log(`Saved summary of ${data.length} segments to data/review_summary_63.txt`);
