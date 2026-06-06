import fs from 'fs';
import path from 'path';

const file = path.resolve('src/App.tsx');
let content = fs.readFileSync(file, 'utf8');

// Replace standard window.find with typed bypass
content = content.replace(/window\.find\(/g, '(window as any).find(');

fs.writeFileSync(file, content, 'utf8');
console.log('✅ Patched TypeScript window.find to (window as any).find successfully!');
