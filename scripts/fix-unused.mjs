import fs from 'fs';
import path from 'path';

const file = path.resolve('src/App.tsx');
let content = fs.readFileSync(file, 'utf8');

// 1. Replace the lucide-react imports block to add Sparkles, remove FileText, BookOpen
const oldLucide = "import { Menu, X, GraduationCap, CheckSquare, Mail, Layers, FileText, CheckCircle2, ChevronRight, BookOpen, AlertTriangle, Eye, FileDown, LayoutGrid, Columns, Play, Pause, Printer, ListTree, Moon, Sun, Search, ArrowRight } from 'lucide-react';";
const newLucide = "import { Menu, X, GraduationCap, CheckSquare, Mail, Layers, CheckCircle2, ChevronRight, AlertTriangle, Eye, FileDown, LayoutGrid, Columns, Play, Pause, Printer, ListTree, Moon, Sun, Search, ArrowRight, Sparkles } from 'lucide-react';";

content = content.replace(oldLucide, newLucide);

// 2. Remove unused Badge import from line 13
content = content.replace("import { Badge } from './components/ui/badge';", "// import { Badge } from './components/ui/badge';");

// 3. Remove 'idx' from galleryFiles.map
content = content.replace("galleryFiles.map((file, idx) =>", "galleryFiles.map((file) =>");

fs.writeFileSync(file, content, 'utf8');
console.log('✅ Unused imports and Sparkles issues resolved!');
