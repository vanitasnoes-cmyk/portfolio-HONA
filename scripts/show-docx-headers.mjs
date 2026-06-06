import fs from 'fs';
import path from 'path';
import mammoth from 'mammoth';

const docxFiles = [
  'BT1_Chương 1_22100193_NGUYEN THI PHUONG ANH.docx',
  'BT2_Chương 2_22100193_NGUYEN THI PHUONG ANH.docx',
  'BT2_Chương 3_22100193_NGUYEN THI PHUONG ANH.docx',
  'BT3_Chương 4_22100193_NGUYEN THI PHUONG ANH.docx',
  'BT2_Chương 5_22100193_NGUYEN THI PHUONG ANH.docx',
  'BT4_Chương 6_22100193_NGUYEN THI PHUONG ANH.docx'
];

async function run() {
  for (const filename of docxFiles) {
    if (!fs.existsSync(filename)) continue;
    try {
      const result = await mammoth.extractRawText({ path: filename });
      console.log(`\n=========================================`);
      console.log(`File: ${filename}`);
      console.log(`=========================================`);
      console.log(result.value.substring(0, 1000).trim());
    } catch (err) {
      console.error(err);
    }
  }
}

run();
