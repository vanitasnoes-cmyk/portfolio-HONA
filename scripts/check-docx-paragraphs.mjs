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

function findBlipEmbeds(node, out = []) {
  if (node == null) return out;
  if (typeof node !== 'object') return out;
  if (Array.isArray(node)) {
    for (const item of node) findBlipEmbeds(item, out);
    return out;
  }
  if (node.blip) {
    for (const blip of node.blip) {
      const id = blip['@_embed'] ?? blip['@_r:embed'];
      if (id) out.push(id);
    }
  }
  for (const [k, v] of Object.entries(node)) {
    if (k.startsWith('@_')) continue;
    findBlipEmbeds(v, out);
  }
  return out;
}

async function main() {
  const docxPath = path.resolve('Bài 6 Hoàn.docx');
  const buf = fs.readFileSync(docxPath);
  const zip = await JSZip.loadAsync(buf);
  const docXml = await zip.file('word/document.xml').async('string');
  const doc = parser.parse(docXml);
  const body = doc?.document?.body ?? doc?.body;
  const paragraphs = body?.p ?? [];

  console.log('--- Bài 4 Hoàn.docx Paragraphs with images ---');
  for (let i = 0; i < paragraphs.length; i++) {
    const p = paragraphs[i];
    const text = collectText(p).replace(/\s+/g, ' ').trim();
    const embeds = findBlipEmbeds(p);
    if (text || embeds.length > 0) {
      console.log(`P${i}: [${text}] -> ${embeds.length} images`);
    }
  }
}

main().catch(console.error);
