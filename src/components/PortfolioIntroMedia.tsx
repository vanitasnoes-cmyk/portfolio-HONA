import {
  LayoutList,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  GraduationCap,
  BookOpen,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { GroupDeliverablesMedia } from './GroupDeliverablesMedia';
import { TOTAL_RUBRIC_ITEMS, VNU_RUBRIC_SECTIONS } from '../data/vnu-rubric';
import { TRANSLATED_STRINGS } from '../data/translations';

const PROFILE = {
  name: 'Bùi Cao Hoàn',
  program: 'Sinh viên Dược',
  school: 'Trường ĐH Y Dược — ĐHQG Hà Nội',
  course: 'Học phần VNU1001 · Năng lực số',
  studentId: '22100241',
  phone: '' as string,
  email: '22100241@vnu.edu.vn',
  location: 'VNU-UMP, Cầu Giấy, Hà Nội',
  github: '' as string,
} as const;

export function ProfileCard({ lang = 'vi' }: { lang?: 'vi' | 'en' }) {
  const mailHref = `https://mail.google.com/mail/?view=cm&fs=1&to=${PROFILE.email}`;
  const t = TRANSLATED_STRINGS[lang];

  const profileProgram = lang === 'en' ? 'Pharmacy Student' : PROFILE.program;
  const profileSchool = lang === 'en' ? 'University of Medicine and Pharmacy, VNU' : PROFILE.school;
  const profileCourse = lang === 'en' ? 'Course VNU1001 · Digital Competence' : PROFILE.course;
  const profileLocation = lang === 'en' ? 'VNU-UMP, Cau Giay, Hanoi' : PROFILE.location;

  const stats = lang === 'en' ? [
    { value: '6', label: 'Exercises' },
    { value: String(VNU_RUBRIC_SECTIONS.length), label: 'Rubric Sections' },
    { value: String(TOTAL_RUBRIC_ITEMS), label: 'Criteria' },
  ] : [
    { value: '6', label: 'Bài tập' },
    { value: String(VNU_RUBRIC_SECTIONS.length), label: 'Mục Rubric' },
    { value: String(TOTAL_RUBRIC_ITEMS), label: 'Tiêu chí' },
  ];

  return (
    <aside className="sm:col-span-4 flex flex-col gap-0 p-0 glass-panel dark:bg-slate-900/85 rounded-3xl border border-indigo-100/40 dark:border-indigo-900/30 overflow-hidden shadow-md">
      <div className="bg-gradient-to-br from-indigo-600 via-indigo-600 to-teal-600 px-5 py-4 text-white text-center space-y-1">
        <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest bg-white/15 px-2.5 py-1 rounded-full">
          <Sparkles className="w-3 h-3" aria-hidden />
          Portfolio VNU1001
        </span>
        <p className="text-[11px] font-semibold text-indigo-100/95 leading-snug">{profileCourse}</p>
      </div>

      <div className="flex flex-col items-center px-5 pt-5 pb-4 gap-3 border-b border-indigo-50/80 dark:border-slate-800/80">
        <img
          src="/images/portrait.jpg"
          alt={`${PROFILE.name} — ${profileProgram}, VNU-UMP`}
          className="w-28 h-28 rounded-2xl object-cover object-top shadow-md ring-4 ring-indigo-50 dark:ring-slate-800"
          width={112}
          height={112}
        />
        <div className="text-center space-y-0.5 w-full">
          <h2 className="text-base font-black text-indigo-950 dark:text-indigo-200 font-sans uppercase tracking-tight">
            {t.studentName || PROFILE.name}
          </h2>
          <p className="text-[11px] font-bold text-indigo-700 dark:text-indigo-400 flex items-center justify-center gap-1">
            <GraduationCap className="w-3.5 h-3.5 shrink-0" aria-hidden />
            {profileProgram}
          </p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold leading-snug">{profileSchool}</p>
        </div>
        <img
          src="/images/vnu-ump-logo.png"
          alt="Logo VNU-UMP"
          className="h-14 w-auto object-contain opacity-95 dark:brightness-95"
          width={100}
          height={56}
        />
      </div>

      <div className="px-5 py-3 grid grid-cols-3 gap-2 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="text-center py-2 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-100/80 dark:border-slate-700/50 shadow-xs"
          >
            <span className="block text-lg font-black text-indigo-700 dark:text-indigo-300 leading-none">{stat.value}</span>
            <span className="text-[8px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">{stat.label}</span>
          </div>
        ))}
      </div>

      <ul className="px-5 py-3 space-y-2.5 border-b border-slate-100 dark:border-slate-800/80 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
        <li className="flex items-start gap-2">
          <span className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center shrink-0">
            <BookOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" aria-hidden />
          </span>
          <span>
            {lang === 'en' ? 'Student ID' : 'MSSV'}: <strong className="text-slate-800 dark:text-slate-200">{PROFILE.studentId}</strong>
          </span>
        </li>
        {PROFILE.phone && (
          <li className="flex items-start gap-2">
            <span className="w-7 h-7 rounded-lg bg-teal-50 dark:bg-teal-950/50 flex items-center justify-center shrink-0">
              <Phone className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" aria-hidden />
            </span>
            <a href={`tel:${PROFILE.phone.replace(/\s/g, '')}`} className="hover:text-indigo-700 dark:hover:text-indigo-400 transition-colors">
              {PROFILE.phone}
            </a>
          </li>
        )}
        <li className="flex items-start gap-2">
          <span className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center shrink-0">
            <Mail className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" aria-hidden />
          </span>
          <a
            href={mailHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-700 dark:text-indigo-400 font-bold hover:underline break-all"
          >
            {PROFILE.email}
          </a>
        </li>
        <li className="flex items-start gap-2">
          <span className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
            <MapPin className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" aria-hidden />
          </span>
          <span className="leading-snug">{profileLocation}</span>
        </li>
        {PROFILE.github && (
          <li className="flex items-start gap-2">
            <span className="w-7 h-7 rounded-lg bg-slate-900 dark:bg-slate-800 flex items-center justify-center shrink-0">
              <ExternalLink className="w-3.5 h-3.5 text-white dark:text-slate-300" aria-hidden />
            </span>
            <a
              href={PROFILE.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-800 dark:text-slate-300 hover:text-indigo-700 dark:hover:text-indigo-400 transition-colors break-all"
            >
              {PROFILE.github.replace('https://', '')}
            </a>
          </li>
        )}
      </ul>

      <div className="p-4 mt-auto flex flex-col gap-2 bg-gradient-to-b from-white to-indigo-50/30 dark:from-slate-900/90 dark:to-indigo-950/20">
        <a
          href="#du-an"
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-teal-500 text-white text-xs font-black shadow-md hover:shadow-lg transition-shadow"
        >
          {lang === 'en' ? 'Explore 6 Exercises' : 'Khám phá 6 bài tập'}
          <ArrowRight className="w-4 h-4" aria-hidden />
        </a>
        <a
          href={mailHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-indigo-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-indigo-800 dark:text-indigo-300 text-xs font-bold hover:bg-indigo-50 dark:hover:bg-slate-700 transition-colors"
        >
          <Mail className="w-4 h-4" aria-hidden />
          {lang === 'en' ? 'Send VNU Gmail' : 'Gửi VNU Gmail'}
        </a>
      </div>
    </aside>
  );
}

export function PortfolioIntroMedia({ lang = 'vi' }: { lang?: 'vi' | 'en' }) {
  const t = TRANSLATED_STRINGS[lang];

  const PORTFOLIO_MINI_LINKS = lang === 'en' ? [
    { href: '#gioi-thieu', label: 'Introduction' },
    { href: '#du-an', label: '6 practical exercises' },
    { href: '#tong-ket', label: 'Summary & reflection' },
  ] : [
    { href: '#gioi-thieu', label: 'Lời mở đầu' },
    { href: '#du-an', label: '6 bài tập thực hành' },
    { href: '#tong-ket', label: 'Tổng kết & suy ngẫm' },
  ];

  const LESSON_JUMP = lang === 'en' ? [
    'File management',
    'Pharmaceutical search',
    'Effective prompt',
    'Group project collaboration',
    'Generative AI & Infographic',
    'Medical AI ethics',
  ] : [
    'Quản trị tệp tin',
    'Tìm kiếm dược học',
    'Prompt hiệu quả',
    'Hợp tác dự án nhóm',
    'AI tạo sinh & Infographic',
    'Đạo đức AI y khoa',
  ];

  return (
    <div className="space-y-6 relative z-10">
      <div className="space-y-4">
        <nav
          className="rounded-2xl border border-teal-100/60 dark:border-teal-950/40 bg-teal-50/30 dark:bg-teal-950/15 p-4"
          aria-label={lang === 'en' ? 'Portfolio table of contents' : 'Mục lục portfolio'}
        >
          <span className="text-[10px] font-black text-teal-900 dark:text-teal-300 uppercase tracking-widest flex items-center gap-1.5 mb-2">
            <LayoutList className="w-3.5 h-3.5" aria-hidden />
            {t.tocTitle}
          </span>
          <ul className="flex flex-wrap gap-2 text-xs font-bold">
            {PORTFOLIO_MINI_LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="inline-block px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800/80 border border-teal-100 dark:border-teal-900/40 text-teal-900 dark:text-teal-200 hover:bg-teal-50 dark:hover:bg-teal-950/30 transition-colors"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold mt-3 mb-1.5">{t.jumpToLesson}</p>
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-[10px] font-bold">
            {LESSON_JUMP.map((label, i) => (
              <li key={i}>
                <a
                  href={`#bai-${i + 1}?view=dashboard`}
                  className="block px-2 py-1 rounded-md bg-white/80 dark:bg-slate-800/80 text-indigo-800 dark:text-indigo-300 border border-indigo-50 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-500/50 transition-colors"
                >
                  {lang === 'en' ? 'Exercise' : 'Bài'} {i + 1}: {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 overflow-hidden shadow-xs p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-slate-300">
              {t.groupVideoTitle}
            </span>
            <a
              href="#bai-4?view=dashboard"
              className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              {lang === 'en' ? 'View Lesson 4 process →' : 'Xem quy trình Bài 4 →'}
            </a>
          </div>
          <GroupDeliverablesMedia variant="full" />
        </div>
      </div>
    </div>
  );
}
