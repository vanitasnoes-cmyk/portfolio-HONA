import { X, GraduationCap, FileText, BookOpen, ListTree, Link2, LayoutGrid, Columns } from 'lucide-react';
import { stepTitleFromText } from '../utils/portfolioUrl';
import type { PortfolioView } from '../utils/portfolioUrl';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

interface NavLink {
  href: string;
  label: string;
  id: string;
}

interface ProjectItem {
  id: string;
  label: string;
}

interface QuickNavDrawerProps {
  open: boolean;
  onClose: () => void;
  navLinks: NavLink[];
  currentSection: string;
  portfolioProjects: ProjectItem[];
  activeTab: number;
  viewMode: PortfolioView;
  stepTexts: string[];
  onSelectSection: (href: string) => void;
  onSelectLesson: (index: number) => void;
  onSelectView: (view: PortfolioView) => void;
  onJumpToStep: (stepIndex: number) => void;
  onCopyLessonLink: () => void;
  lang?: 'vi' | 'en';
}

export function QuickNavDrawer({
  open,
  onClose,
  navLinks,
  currentSection,
  portfolioProjects,
  activeTab,
  viewMode,
  stepTexts,
  onSelectSection,
  onSelectLesson,
  onSelectView,
  onJumpToStep,
  onCopyLessonLink,
  lang = 'vi',
}: QuickNavDrawerProps) {
  if (!open) return null;

  const sectionIcon = (id: string) => {
    if (id === 'gioi-thieu') return <GraduationCap className="w-4 h-4 text-indigo-500" />;
    if (id === 'du-an') return <FileText className="w-4 h-4 text-indigo-500" />;
    return <BookOpen className="w-4 h-4 text-indigo-500" />;
  };

  const headerLabel = lang === 'en' ? 'Quick Navigation' : 'Điều hướng nhanh';
  const closeLabel = lang === 'en' ? 'Close menu' : 'Đóng menu';
  const viewModeLabel = lang === 'en' ? 'View Mode' : 'Chế độ xem';
  const sectionLabel = lang === 'en' ? 'Page Sections' : 'Mục trang';
  const exercisesLabel = lang === 'en' ? '6 Exercises (deep link)' : '6 bài tập (deep link)';
  const copyLinkLabel = lang === 'en' ? `Copy Lesson ${activeTab + 1} Link` : `Sao chép link Bài ${activeTab + 1}`;
  const processLabel = lang === 'en' ? `Process — Lesson ${activeTab + 1}` : `Quy trình — Bài ${activeTab + 1}`;

  return (
    <>
      <div
        className="fixed inset-0 z-[60] bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <aside
        className="fixed top-0 right-0 bottom-0 z-[70] w-[min(100%,22rem)] bg-white dark:bg-slate-900 shadow-2xl flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-label={lang === 'en' ? "Quick portfolio navigation" : "Điều hướng nhanh portfolio"}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <ListTree className="w-5 h-5 text-indigo-600" />
            <span className="font-extrabold text-indigo-950 dark:text-indigo-300 text-sm">{headerLabel}</span>
          </div>
          <Button
            type="button"
            onClick={onClose}
            variant="secondary"
            size="icon"
            className="rounded-xl text-slate-600 dark:text-slate-300"
            aria-label={closeLabel}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
          <section>
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 block mb-2">
              {viewModeLabel}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onSelectView('gallery')}
                className={cn('flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-[10px] font-bold cursor-pointer transition-colors',
                  viewMode === 'gallery'
                    ? 'bg-indigo-700 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                )}
              >
                <LayoutGrid className="w-3.5 h-3.5" /> {lang === 'en' ? 'Gallery' : 'Gallery'}
              </button>
              <button
                type="button"
                onClick={() => onSelectView('dashboard')}
                className={cn('flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-[10px] font-bold cursor-pointer transition-colors',
                  viewMode === 'dashboard'
                    ? 'bg-indigo-700 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                )}
              >
                <Columns className="w-3.5 h-3.5" /> Dashboard
              </button>
            </div>
          </section>

          <section>
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 block mb-2">
              {sectionLabel}
            </span>
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => onSelectSection(link.href)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-left cursor-pointer ${
                    currentSection === link.id
                      ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {sectionIcon(link.id)}
                  {link.label}
                </button>
              ))}
            </nav>
          </section>

          <section>
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 block mb-2">
              {exercisesLabel}
            </span>
            <div className="flex flex-col gap-1">
              {portfolioProjects.map((proj, idx) => (
                <button
                  key={proj.id}
                  type="button"
                  onClick={() => onSelectLesson(idx)}
                  className={cn('text-left px-3 py-2.5 rounded-lg text-xs font-bold transition-colors cursor-pointer',
                    activeTab === idx
                      ? 'bg-indigo-700 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40'
                  )}
                >
                  <span className="opacity-80 text-[10px] block">#bai-{idx + 1}</span>
                  {proj.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={onCopyLessonLink}
              className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-wide bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer border border-slate-200 dark:border-slate-700"
            >
              <Link2 className="w-3.5 h-3.5" />
              {copyLinkLabel}
            </button>
          </section>

          {viewMode === 'dashboard' && stepTexts.length > 0 && (
            <section>
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 block mb-2">
                {processLabel}
              </span>
              <div className="flex flex-col gap-0.5 max-h-56 overflow-y-auto custom-scrollbar pr-1">
                {stepTexts.map((text, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onJumpToStep(idx)}
                    className="flex items-start gap-2 text-left px-2.5 py-2 rounded-lg text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-teal-950/40 hover:text-teal-800 dark:hover:text-teal-300 cursor-pointer transition-colors w-full"
                    title={stepTitleFromText(text, 200)}
                  >
                    <span className="text-indigo-500 font-black shrink-0 w-5 text-right leading-tight mt-px">{idx + 1}.</span>
                    <span className="leading-snug break-words min-w-0">{stepTitleFromText(text)}</span>
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>
      </aside>
    </>
  );
}
