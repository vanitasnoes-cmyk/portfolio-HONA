import { ListOrdered } from 'lucide-react';
import { stepTitleFromText } from '../utils/portfolioUrl';

interface LessonMiniTocProps {
  lessonNumber: number;
  steps: { text: string }[];
  onJumpToStep: (stepIndex: number) => void;
  lang?: 'vi' | 'en';
}

export function LessonMiniToc({ lessonNumber, steps, onJumpToStep, lang = 'vi' }: LessonMiniTocProps) {
  if (steps.length === 0) return null;

  const titleText = lang === 'en' 
    ? `Mini-ToC — ${steps.length}-step process` 
    : `Mini-ToC — Quy trình ${steps.length} bước`;

  const rubricText = lang === 'en' 
    ? 'Rubric §1 · Navigation' 
    : 'Rubric §1 · Điều hướng';

  return (
    <nav
      className="rounded-2xl border border-indigo-100/60 dark:border-indigo-950/50 bg-indigo-50/40 dark:bg-indigo-950/15 p-4 space-y-3 print:break-inside-avoid"
      aria-label={lang === 'en' ? `Lesson ${lessonNumber} table of contents` : `Mục lục bài ${lessonNumber}`}
    >
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span className="text-[10px] font-black text-indigo-900 dark:text-indigo-300 uppercase tracking-widest font-sans flex items-center gap-1.5">
          <ListOrdered className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" aria-hidden />
          {titleText}
        </span>
        <span className="text-[9px] font-bold text-indigo-600/80 dark:text-indigo-400 uppercase tracking-wide">
          {rubricText}
        </span>
      </div>
      <ol className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
        {steps.map((step, idx) => (
          <li key={idx}>
            <button
              type="button"
              onClick={() => onJumpToStep(idx)}
              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-white/80 dark:hover:bg-slate-850 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors cursor-pointer border border-transparent hover:border-indigo-100/80 dark:hover:border-indigo-900/50"
            >
              <span className="text-indigo-600 dark:text-indigo-400 font-black mr-1">{idx + 1}.</span>
              {stepTitleFromText(step.text)}
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}
