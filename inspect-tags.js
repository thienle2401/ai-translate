import fs from 'fs';

const data = JSON.parse(fs.readFileSync('data/extracted_all_76.json', 'utf8'));

data.forEach(s => {
  if (s.sourceHTML.includes('<img') || s.sourceHTML.includes('inline-image')) {
    console.log(`=== Segment ${s.id} ===`);
    console.log(`SRC Text: ${s.sourceText}`);
    console.log(`SRC HTML: ${s.sourceHTML}`);
    console.log(`TGT Text: ${s.targetText}`);
    console.log(`TGT HTML: ${s.targetHTML}`);
    console.log('');
  }
});
