import fs from 'fs';
import path from 'path';

const file = path.resolve('src/App.tsx');
let content = fs.readFileSync(file, 'utf8');

// Find start and end indexes
const startTerm = '{/* 1. Desktop Persistent Left Sidebar Navigation */}';
const endTerm = '</header>';

const startIndex = content.indexOf(startTerm);
const endIndex = content.indexOf(endTerm) + endTerm.length;

if (startIndex === -1 || endIndex === -1) {
  console.error('Error: Navigation terms not found!', { startIndex, endIndex });
  process.exit(1);
}

// Let's also find the outer return wrapper "flex min-h-screen" to change it to "flex flex-col min-h-screen"
const wrapperTerm = '<div className="flex min-h-screen gradient-bg-elegant';
content = content.replace(wrapperTerm, '<div className="flex flex-col min-h-screen gradient-bg-elegant');

const replacement = `{/* 1. Top Dual Navigation Bar (Light Green) */}
      <div className="w-full bg-[#ecfdf5] dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs py-2 px-6 flex justify-between items-center z-50 border-b border-emerald-100 dark:border-emerald-900/30">
        <div className="flex gap-6 font-semibold">
          <a href="#gioi-thieu" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Lời mở đầu</a>
          <a href="#gioi-thieu" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Giới thiệu</a>
          <a href="#du-an" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Nội dung</a>
          <a href="#tong-ket" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Tổng kết</a>
          <a href="#tong-ket" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Cảm nghĩ</a>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-bold hidden sm:inline">Trường Đại học Y Dược, ĐHQGHN</span>
          <span className="font-bold">MSSV: 22100241</span>
        </div>
      </div>

      {/* 2. Main Menu (Nền trắng) */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800/80 px-6 py-3.5 flex items-center justify-between shadow-sm">
        {/* Logo Brand left */}
        <div className="flex items-center gap-3">
          <img 
            src="/images/vnu-ump-logo.png" 
            alt="Logo UMP" 
            className="h-10 w-auto object-contain"
          />
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />
          <span className="text-emerald-950 dark:text-emerald-200 text-sm font-extrabold tracking-tight hidden sm:block font-sans">
            PORTFOLIO SỐ
          </span>
        </div>

        {/* Main categories center (Desktop) */}
        <nav className="hidden lg:flex items-center gap-6 font-sans">
          <a 
            href="#gioi-thieu" 
            onClick={() => handleMainNavClick('gioi-thieu')}
            className={\`text-xs uppercase font-extrabold tracking-wide hover:text-emerald-600 transition-all \${
              currentSection === 'gioi-thieu' ? 'text-emerald-600 border-b-2 border-emerald-500 pb-1' : 'text-slate-600 dark:text-slate-300'
            }\`}
          >
            Lời mở đầu
          </a>
          {portfolioProjects.map((proj, idx) => (
            <button
              key={proj.id}
              onClick={() => navigateToLesson(idx)}
              className={\`text-xs uppercase font-extrabold tracking-wide hover:text-emerald-600 transition-all cursor-pointer \${
                viewMode === 'dashboard' && activeTab === idx ? 'text-emerald-600 border-b-2 border-emerald-500 pb-1' : 'text-slate-600 dark:text-slate-300'
              }\`}
            >
              Bài \${idx + 1}
            </button>
          ))}
        </nav>

        {/* Utilities right */}
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
          </button>

          {/* Dark mode toggle */}
          <button
            onClick={() => setDarkMode((v) => !v)}
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-yellow-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            aria-label={darkMode ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
            title={darkMode ? 'Giao diện sáng' : 'Giao diện tối'}
          >
            {darkMode ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
          </button>

          {/* Mobile Hamburger menu toggle */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
          </button>
        </div>
      </header>`;

// Splice the replacement
const newContent = content.substring(0, startIndex) + replacement + content.substring(endIndex);

fs.writeFileSync(file, newContent, 'utf8');
console.log('✅ Navigation restructured successfully in App.tsx');
