import fs from 'fs';
import path from 'path';

const file = path.resolve('src/App.tsx');
let content = fs.readFileSync(file, 'utf8');

// We want to insert the opening tag for container B right after </header>
// Let's find '</header>' after the new main menu
const headerClose = '</header>';
const headerCloseIndex = content.indexOf(headerClose);

if (headerCloseIndex === -1) {
  console.error('Error: </header> not found in App.tsx!');
  process.exit(1);
}

const insertPos = headerCloseIndex + headerClose.length;

// Let's insert: \n      <div className="flex-1 min-w-0 flex flex-col relative z-10">
const insertedText = '\n      <div className="flex-1 min-w-0 flex flex-col relative z-10">';

const newContent = content.substring(0, insertPos) + insertedText + content.substring(insertPos);
fs.writeFileSync(file, newContent, 'utf8');
console.log('✅ Container B opening tag inserted successfully!');
