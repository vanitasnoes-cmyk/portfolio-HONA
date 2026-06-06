import fs from 'fs';
import path from 'path';
import { XMLParser } from 'fast-xml-parser';
import JSZip from 'jszip';

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  removeNSPrefix: true,
  isArray: (name) => ['p', 'r', 't', 'blip'].includes(name),
});

function collectText(node) {
  if (node == null) return '';
  if (typeof node === 'string') return node;
  if (Array.isArray(node)) return node.map(collectText).join('');
  if (typeof node === 'object') {
    if (node.t != null) return collectText(node.t);
    let s = '';
    for (const [k, v] of Object.entries(node)) {
      if (k.startsWith('@_')) continue;
      s += collectText(v);
    }
    return s;
  }
  return '';
}

async function dumpDocx(fileName) {
  const docxPath = path.resolve(fileName);
  if (!fs.existsSync(docxPath)) {
    return `File not found: ${fileName}\n`;
  }
  const buf = fs.readFileSync(docxPath);
  const zip = await JSZip.loadAsync(buf);
  const docXml = await zip.file('word/document.xml').async('string');
  const doc = parser.parse(docXml);
  const body = doc?.document?.body ?? doc?.body;
  const paragraphs = body?.p ?? [];

  let result = `\n=== ${fileName} ===\n`;
  for (let i = 0; i < paragraphs.length; i++) {
    const text = collectText(paragraphs[i]).replace(/\s+/g, ' ').trim();
    if (text) {
      result += `P${i}: ${text}\n`;
    }
  }
  return result;
}

async function main() {
  let output = '';
  const files = [
    'Bài 1 Hoàn.docx',
    'Bài 2 Hoàn.docx',
    'Bài 3 Hoàn.docx',
    'Bài 4 Hoàn.docx',
    'bài 5 hoàn.docx',
    'Bài 6 Hoàn.docx'
  ];
  for (const f of files) {
    output += await dumpDocx(f);
  }
  fs.writeFileSync('scripts/all-docx-text.txt', output, 'utf8');
  console.log('Done writing scripts/all-docx-text.txt');
}

main().catch(console.error);
