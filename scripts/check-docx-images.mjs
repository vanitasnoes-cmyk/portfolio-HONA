import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

const files = [
  'Bài 1 Hoàn.docx',
  'Bài 2 Hoàn.docx',
  'Bài 3 Hoàn.docx',
  'Bài 4 Hoàn.docx',
  'bài 5 hoàn.docx',
  'Bài 6 Hoàn.docx'
];

async function main() {
  for (const file of files) {
    const filePath = path.resolve(file);
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️ ${file} does not exist!`);
      continue;
    }
    const buf = fs.readFileSync(filePath);
    const zip = await JSZip.loadAsync(buf);
    const mediaFiles = Object.keys(zip.files).filter(f => f.startsWith('word/media/'));
    console.log(`📄 ${file}: found ${mediaFiles.length} media files`);
    if (mediaFiles.length > 0) {
      console.log('   Files:', mediaFiles);
    }
  }
}

main().catch(console.error);
