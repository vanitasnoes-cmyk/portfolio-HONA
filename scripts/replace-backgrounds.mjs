import fs from 'fs';
import path from 'path';

const baseDir = 'public/images';

// Mappings of extracted screenshots to replace background/cover files
const replacements = [
  // General Backgrounds
  { src: 'steps/bt5/03.png', dest: 'bg_nature.png' },     // Nature-themed AI generated background
  { src: 'steps/bt5/03.png', dest: 'banner_bg.png' },     // Nature-themed AI banner

  // Lesson 1 (OS & Files)
  { src: 'steps/bt1/05a.jpg', dest: 'cover_bt1.png' },
  { src: 'steps/bt1/05a.jpg', dest: 'bt1_1.png' },
  { src: 'steps/bt1/07a.jpg', dest: 'bt1_2.png' },

  // Lesson 2 (Medical Search - Fallback to Scholar search from BT3)
  { src: 'steps/bt3/02.png', dest: 'cover_bt2.png' },
  { src: 'steps/bt3/02.png', dest: 'bt2_1.png' },
  { src: 'steps/bt3/02.png', dest: 'bt2_2.png' },

  // Lesson 3 (Prompt Optimization)
  { src: 'steps/bt3/02.png', dest: 'cover_bt3.png' },
  { src: 'steps/bt3/02.png', dest: 'bt3_1.png' },
  { src: 'steps/bt3/05.png', dest: 'bt3_2.png' },

  // Lesson 4 (Cloud Collaboration)
  { src: 'steps/bt4/02.jpg', dest: 'cover_bt4.png' },
  { src: 'steps/bt4/02.jpg', dest: 'bt4_1.png' },
  { src: 'steps/bt4/05.jpg', dest: 'bt4_2.png' },

  // Lesson 5 (AI Content Creation)
  { src: 'steps/bt5/03.png', dest: 'cover_bt5.png' },
  { src: 'steps/bt5/03.png', dest: 'bt5_1.png' },
  { src: 'steps/bt5/05.png', dest: 'bt5_2.png' },

  // Lesson 6 (Ethics & Safety)
  { src: 'steps/bt6/09.png', dest: 'cover_bt6.png' },
  { src: 'steps/bt6/09.png', dest: 'bt6_1.png' },
  { src: 'steps/bt6/09.png', dest: 'bt6_2.png' }
];

console.log('Starting background and cover images replacement...');

replacements.forEach(({ src, dest }) => {
  const srcPath = path.join(baseDir, src);
  const destPath = path.join(baseDir, dest);

  if (fs.existsSync(srcPath)) {
    try {
      fs.copyFileSync(srcPath, destPath);
      console.log(`Successfully copied ${src} -> ${dest}`);
    } catch (err) {
      console.error(`Error copying ${src} -> ${dest}:`, err.message);
    }
  } else {
    console.warn(`Source image does not exist: ${srcPath}`);
  }
});

console.log('Background and cover images replacement complete!');
