import fs from 'fs';
import path from 'path';

const file = path.resolve('src/App.tsx');
let content = fs.readFileSync(file, 'utf8');

// 1. Insert search state near other state definitions
const targetState = 'const [menuOpen, setMenuOpen] = useState(false);';
const stateIndex = content.indexOf(targetState);

if (stateIndex === -1) {
  console.error('Error: menuOpen state not found!');
  process.exit(1);
}

const searchState = `const [showSearchBox, setShowSearchBox] = useState(false);
  const [searchText, setSearchText] = useState('');
  `;

content = content.substring(0, stateIndex) + searchState + content.substring(stateIndex);

// 2. Replace the top dual nav links
const oldTopNavLinks = `<div className="flex gap-6 font-semibold">
          <a href="#gioi-thieu" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Lời mở đầu</a>
          <a href="#gioi-thieu" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Giới thiệu</a>
          <a href="#du-an" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Nội dung</a>
          <a href="#tong-ket" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Tổng kết</a>
          <a href="#tong-ket" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Cảm nghĩ</a>
        </div>`;

const newTopNavLinks = `<div className="flex gap-6 font-semibold">
          <a href="#gioi-thieu" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Lời mở đầu</a>
          <a href="#du-an" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Nội dung</a>
          <a href="#tong-ket" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Tổng kết & suy ngẫm</a>
        </div>`;

if (content.indexOf(oldTopNavLinks) === -1) {
  console.error('Error: Old top nav links not found!');
  process.exit(1);
}
content = content.replace(oldTopNavLinks, newTopNavLinks);

// 3. Fix the main menu categories from "Bài ${idx + 1}" to "Bài {idx + 1}"
const oldLessonButton = `            <button
              key={proj.id}
              onClick={() => navigateToLesson(idx)}
              className={\`text-xs uppercase font-extrabold tracking-wide hover:text-emerald-600 transition-all cursor-pointer \${
                viewMode === 'dashboard' && activeTab === idx ? 'text-emerald-600 border-b-2 border-emerald-500 pb-1' : 'text-slate-600 dark:text-slate-300'
              }\`}
            >
              Bài \${idx + 1}
            </button>`;

const newLessonButton = `            <button
              key={proj.id}
              onClick={() => navigateToLesson(idx)}
              className={\`text-xs uppercase font-extrabold tracking-wide hover:text-emerald-600 transition-all cursor-pointer \${
                viewMode === 'dashboard' && activeTab === idx ? 'text-emerald-600 border-b-2 border-emerald-500 pb-1' : 'text-slate-600 dark:text-slate-300'
              }\`}
            >
              Bài {idx + 1}
            </button>`;

if (content.indexOf(oldLessonButton) === -1) {
  console.error('Error: Old lesson button not found!');
  process.exit(1);
}
content = content.replace(oldLessonButton, newLessonButton);

// 4. In the Utilities section: Remove Language switcher, insert Search box and Search button
const oldUtilities = `        {/* Utilities right */}
        <div className="flex items-center gap-4">
          {/* Language switcher */}
          <div className="flex items-center gap-1 text-[11px] font-extrabold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1.5 rounded-lg">
            <span className="text-emerald-600">EN</span>
            <span className="text-slate-400">|</span>
            <span className="opacity-60 cursor-pointer hover:opacity-100">VI</span>
          </div>

          {/* Search Icon button */}
          <button 
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-emerald-600 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
            aria-label="Search"
            title="Tìm kiếm"
          >
            <Search className="w-4 h-4" />
          </button>`;

const newUtilities = `        {/* Utilities right */}
        <div className="flex items-center gap-4">
          {/* Expandable Search box */}
          {showSearchBox && (
            <input
              type="text"
              placeholder="Tìm kiếm trang..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (searchText.trim()) {
                    window.find(searchText);
                  }
                }
              }}
              className="text-xs px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-500 w-32 sm:w-40"
              autoFocus
            />
          )}

          {/* Search Icon button (Ctrl+F behavior) */}
          <button 
            onClick={() => {
              setShowSearchBox(!showSearchBox);
              if (showSearchBox && searchText.trim()) {
                window.find(searchText);
              }
            }}
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-emerald-600 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
            aria-label="Search"
            title="Tìm kiếm (Ctrl+F)"
          >
            <Search className="w-4 h-4" />
          </button>`;

if (content.indexOf(oldUtilities) === -1) {
  console.error('Error: Old utilities section not found!');
  process.exit(1);
}
content = content.replace(oldUtilities, newUtilities);

fs.writeFileSync(file, content, 'utf8');
console.log('✅ App.tsx updated successfully: Top nav links fixed, EN translation deleted, Ctrl+F search implemented, Lesson names fixed!');
