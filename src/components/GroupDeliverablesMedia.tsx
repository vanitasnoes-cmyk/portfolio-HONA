import { ExternalLink } from 'lucide-react';
import {
  GROUP_VIDEO_EMBED_URL,
  GROUP_VIDEO_TITLE,
  GROUP_VIDEO_YOUTUBE_URL,
} from '../data/group-deliverables';

interface GroupDeliverablesMediaProps {
  /** compact: chỉ embed + link; full: thêm mô tả dài */
  variant?: 'compact' | 'full';
  lang?: 'vi' | 'en';
}

export function GroupDeliverablesMedia({ variant = 'full', lang = 'vi' }: GroupDeliverablesMediaProps) {
  return (
    <div className="space-y-4">
      <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 shadow-inner">
        <iframe
          src={GROUP_VIDEO_EMBED_URL}
          title={GROUP_VIDEO_TITLE}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <a
          href={GROUP_VIDEO_YOUTUBE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-rose-50 dark:bg-rose-950/20 text-rose-900 dark:text-rose-300 border border-rose-100 dark:border-rose-900/40 text-[11px] font-bold hover:bg-rose-100 dark:hover:bg-rose-950/40 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5 shrink-0" aria-hidden />
          {lang === 'en' ? 'Open on YouTube' : 'Mở trên YouTube'}
        </a>
      </div>

      {variant === 'full' && (
        <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold leading-relaxed text-justify">
          {lang === 'en' ? (
            <>Complete presentation video of group <strong className="text-slate-900 dark:text-slate-200">VNU1001_E252023</strong>.</>
          ) : (
            <>Video thuyết trình hoàn thiện của nhóm <strong className="text-slate-900 dark:text-slate-200">VNU1001_E252023</strong>.</>
          )}
        </p>
      )}
    </div>
  );
}
