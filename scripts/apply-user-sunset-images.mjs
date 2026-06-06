import fs from 'fs';
import path from 'path';

const baseDir = '.';
const destDir = 'public/images';

// Mappings of user's 1.jpg -> 9.jpg files to destinations
const replacements = [
  // General Backgrounds (using 5.jpg because it is the only horizontal landscape image)
  { src: '5.jpg', dest: 'bg_nature.png' },     // bg_nature (horizontal landscape)
  { src: '5.jpg', dest: 'banner_bg.png' },     // banner_bg (horizontal landscape)

  // Avatar / Portrait
  { src: '9.jpg', dest: 'portrait.png' },      // avatar!

  // Lesson 1 (OS & Files)
  { src: '1.jpg', dest: 'cover_bt1.png' },
  { src: '1.jpg', dest: 'bt1_1.png' },
  { src: '1.jpg', dest: 'bt1_2.png' },

  // Lesson 2 (Medical Search)
  { src: '2.jpg', dest: 'cover_bt2.png' },
  { src: '2.jpg', dest: 'bt2_1.png' },
  { src: '2.jpg', dest: 'bt2_2.png' },

  // Lesson 3 (Prompt Optimization)
  { src: '3.jpg', dest: 'cover_bt3.png' },
  { src: '3.jpg', dest: 'bt3_1.png' },
  { src: '3.jpg', dest: 'bt3_2.png' },

  // Lesson 4 (Cloud Collaboration)
  { src: '4.jpg', dest: 'cover_bt4.png' },
  { src: '4.jpg', dest: 'bt4_1.png' },
  { src: '4.jpg', dest: 'bt4_2.png' },

  // Lesson 5 (AI Content Creation)
  { src: '5.jpg', dest: 'cover_bt5.png' },
  { src: '5.jpg', dest: 'bt5_1.png' },
  { src: '5.jpg', dest: 'bt5_2.png' },

  // Lesson 6 (Ethics & Safety)
  { src: '6.jpg', dest: 'cover_bt6.png' },
  { src: '6.jpg', dest: 'bt6_1.png' },
  { src: '6.jpg', dest: 'bt6_2.png' }
];

console.log('Starting custom user images application (with horizontal backgrounds)...');

replacements.forEach(({ src, dest }) => {
  const srcPath = path.join(baseDir, src);
  const destPath = path.join(destDir, dest);

  if (fs.existsSync(srcPath)) {
    try {
      fs.copyFileSync(srcPath, destPath);
      console.log(`Successfully copied ${src} -> ${destDir}/${dest}`);
    } catch (err) {
      console.error(`Error copying ${src} -> ${destDir}/${dest}:`, err.message);
    }
  } else {
    console.warn(`Source image does not exist: ${srcPath}`);
  }
});

console.log('User images application complete!');
