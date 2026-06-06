/**
 * Prepare all asset files for Bùi Cao Hoàn's portfolio.
 * - Extracts page previews from CorelDRAW (.cdr) files (which are ZIP archives)
 * - Copies avatar, background, and gallery images
 * - Copies and renames PDF deliverables
 */
import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

const root = path.resolve('.');

// ── 1. Avatar ──────────────────────────────────────────────────────────
async function copyAvatar() {
  const src = path.join(root, 'avt đẹp trai múp rụp.jpg');
  const dest = path.join(root, 'public/images/portrait.jpg');
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log('✅ Avatar copied → portrait.jpg');
  } else {
    console.warn('⚠️  Avatar source not found:', src);
  }
}

// ── 2. Background from CDR ─────────────────────────────────────────────
async function extractBackground() {
  const cdrPath = path.join(root, 'background.cdr');
  if (!fs.existsSync(cdrPath)) {
    console.warn('⚠️  background.cdr not found');
    return;
  }
  const buf = fs.readFileSync(cdrPath);
  const zip = await JSZip.loadAsync(buf);
  const preview = zip.file('previews/page1.png');
  if (preview) {
    const data = await preview.async('nodebuffer');
    fs.writeFileSync(path.join(root, 'public/images/bg_nature.png'), data);
    fs.writeFileSync(path.join(root, 'public/images/banner_bg.png'), data);
    console.log('✅ Background extracted from background.cdr → bg_nature.png, banner_bg.png');
  } else {
    console.warn('⚠️  No preview found in background.cdr');
  }
}

// ── 3. Gallery Files 1-7 ───────────────────────────────────────────────
async function prepareGallery() {
  const galleryDir = path.join(root, 'public/gallery');
  fs.mkdirSync(galleryDir, { recursive: true });

  const files = [
    { name: '1', src: '1.cdr', type: 'cdr' },
    { name: '2', src: '2.cdr', type: 'cdr' },
    { name: '3', src: '3.cdr', type: 'cdr' },
    { name: '4', src: '4.cdr', type: 'cdr' },
    { name: '5', src: '5.jpg', type: 'jpg' },
    { name: '6', src: '6.cdr', type: 'cdr' },
  ];

  for (const file of files) {
    const srcPath = path.join(root, file.src);
    if (!fs.existsSync(srcPath)) {
      console.warn(`⚠️  Gallery source not found: ${file.src}`);
      continue;
    }

    if (file.type === 'cdr') {
      // Extract preview from CDR (zip archive)
      const buf = fs.readFileSync(srcPath);
      const zip = await JSZip.loadAsync(buf);
      const preview = zip.file('previews/page1.png');
      if (preview) {
        const data = await preview.async('nodebuffer');
        fs.writeFileSync(path.join(galleryDir, `${file.name}_preview.png`), data);
        console.log(`✅ Gallery CDR preview: ${file.src} → ${file.name}_preview.png`);
      }
      // Also copy the original CDR for download
      fs.copyFileSync(srcPath, path.join(galleryDir, file.src));
    } else {
      // Copy JPG directly
      fs.copyFileSync(srcPath, path.join(galleryDir, `${file.name}.jpg`));
      console.log(`✅ Gallery JPG copied: ${file.src} → ${file.name}.jpg`);
    }
  }
}

// ── 4. PDF Deliverables ────────────────────────────────────────────────
function copyPDFs() {
  const pdfMappings = [
    { src: 'Bài 1 Hoàn.pdf', dest: 'BT1_Chuong1_BuiCaoHoan.pdf' },
    { src: 'Bài 2 Hoàn.pdf', dest: 'BT2_Chuong2_BuiCaoHoan.pdf' },
    { src: 'Bài 3 Hoàn.pdf', dest: 'BT2_Chuong3_BuiCaoHoan.pdf' },
    { src: 'Bài 4 Hoàn.pdf', dest: 'BT3_Chuong4_BuiCaoHoan.pdf' },
    { src: 'bài 5 hoàn.pdf', dest: 'BT2_Chuong5_BuiCaoHoan.pdf' },
    { src: 'Bài 6 Hoàn.pdf', dest: 'BT4_Chuong6_BuiCaoHoan.pdf' },
  ];

  for (const { src, dest } of pdfMappings) {
    const srcPath = path.join(root, src);
    const destPath = path.join(root, 'public/files', dest);
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`✅ PDF: ${src} → files/${dest}`);
    } else {
      console.warn(`⚠️  PDF source not found: ${src}`);
    }
  }
}

// ── 5. Cover images from gallery previews ──────────────────────────────
async function updateCoverImages() {
  const galleryDir = path.join(root, 'public/gallery');
  const imgDir = path.join(root, 'public/images');

  const coverMappings = [
    { gallery: '1_preview.png', covers: ['cover_bt1.png', 'bt1_1.png', 'bt1_2.png'] },
    { gallery: '2_preview.png', covers: ['cover_bt2.png', 'bt2_1.png', 'bt2_2.png'] },
    { gallery: '3_preview.png', covers: ['cover_bt3.png', 'bt3_1.png', 'bt3_2.png'] },
    { gallery: '4_preview.png', covers: ['cover_bt4.png', 'bt4_1.png', 'bt4_2.png'] },
    { gallery: '5.jpg',         covers: ['cover_bt5.png', 'bt5_1.png', 'bt5_2.png'] },
    { gallery: '6_preview.png', covers: ['cover_bt6.png', 'bt6_1.png', 'bt6_2.png'] },
  ];

  for (const { gallery, covers } of coverMappings) {
    const srcPath = path.join(galleryDir, gallery);
    if (!fs.existsSync(srcPath)) {
      console.warn(`⚠️  Cover source not found: gallery/${gallery}`);
      continue;
    }
    for (const cover of covers) {
      fs.copyFileSync(srcPath, path.join(imgDir, cover));
    }
    console.log(`✅ Cover images from ${gallery} → ${covers.join(', ')}`);
  }
}

// ── Run all ────────────────────────────────────────────────────────────
async function main() {
  console.log('🚀 Preparing Bùi Cao Hoàn portfolio assets...\n');
  await copyAvatar();
  await extractBackground();
  await prepareGallery();
  copyPDFs();
  await updateCoverImages();
  console.log('\n✅ All assets prepared successfully!');
}

main().catch((err) => {
  console.error('❌ Error:', err);
  process.exit(1);
});
