import fs from 'fs';
import path from 'path';

const file = path.resolve('src/App.tsx');
let content = fs.readFileSync(file, 'utf8');

const startTerm = '{/* 3. Header Banner (Aristotle Banner with Static Background inside) */}';
const startIndex = content.indexOf(startTerm);

if (startIndex === -1) {
  console.error('Error: Banner start term not found!');
  process.exit(1);
}

// Find the closing </section> tag for the banner
const restOfContent = content.substring(startIndex);
const endSectionTerm = '</section>';
const relativeEndIndex = restOfContent.indexOf(endSectionTerm);

if (relativeEndIndex === -1) {
  console.error('Error: Banner section end tag not found!');
  process.exit(1);
}

const endIndex = startIndex + relativeEndIndex + endSectionTerm.length;

const replacement = `{/* 3. Header Banner (Gedeon Richter Inspired Professional Banner) */}
        <section className="relative w-full py-16 md:py-24 bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800/40 border-b border-emerald-100/50 dark:border-slate-850 grid-bg-pattern overflow-hidden">
          {/* Subtle floating background elements */}
          <div className="absolute inset-0 pointer-events-none z-0">
            <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-100/30 rounded-full blur-3xl dark:bg-emerald-950/10" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-50/30 rounded-full blur-3xl dark:bg-amber-950/5" />
          </div>

          <div className="relative z-10 max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left Column: Information Text */}
            <div className="md:col-span-7 space-y-5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/60 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 text-[10px] font-black uppercase tracking-wider font-sans border border-emerald-200/40">
                <Sparkles className="w-3.5 h-3.5" /> Năng lực số y dược chuẩn hóa
              </span>
              
              <div className="space-y-2">
                <h1 className="text-emerald-950 dark:text-emerald-100 text-[36px] sm:text-[46px] md:text-[54px] font-black leading-none uppercase tracking-tight font-sans">
                  Bùi Cao Hoàn
                </h1>
                
                {/* Amber/Gold Accent Line */}
                <div className="h-1.5 w-24 bg-amber-500 rounded-full my-4 shadow-sm" />
              </div>

              <div className="space-y-3">
                <p className="text-emerald-800 dark:text-emerald-400 font-extrabold text-sm sm:text-base tracking-wide font-sans">
                  Sinh viên Dược • MSSV: 22100241
                </p>
                <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm md:text-base leading-relaxed font-semibold">
                  Khoa Dược — Trường Đại học Y Dược, Đại học Quốc gia Hà Nội (VNU-UMP). Định hướng nghiên cứu ứng dụng tin dược học, thuật toán sàng lọc hoạt chất y học & chuyển đổi số y tế.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <a
                  href="#du-an"
                  className="gradient-button text-white text-xs sm:text-sm font-bold px-6 py-3 rounded-xl transition-all shadow-md active:scale-95 inline-flex items-center gap-2"
                >
                  Xem 6 bài tập lớn <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=22100241@vnu.edu.vn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="outline-button text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm font-bold px-6 py-3 rounded-xl transition-all shadow-xs inline-flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" /> Liên hệ VNU Gmail
                </a>
              </div>
            </div>

            {/* Right Column: Avatar portrait frame */}
            <div className="md:col-span-5 flex justify-center">
              <div className="relative group">
                {/* Decorative glowing background layer */}
                <div className="absolute -inset-1.5 bg-gradient-to-tr from-emerald-500 to-amber-500 rounded-3xl blur-md opacity-30 group-hover:opacity-50 transition duration-500" />
                
                <div className="relative bg-white dark:bg-slate-900 p-3 rounded-3xl border border-slate-200/50 dark:border-slate-800 shadow-xl max-w-[280px]">
                  <img
                    src="/images/portrait.jpg"
                    alt="Bùi Cao Hoàn — Sinh viên Dược"
                    className="w-full h-auto aspect-square object-cover rounded-2xl shadow-inner object-top filter brightness-102"
                  />
                  <div className="pt-3 text-center">
                    <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block font-sans">
                      Dược sĩ số tương lai
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 block mt-0.5">
                      VNU-UMP 2026
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>`;

const newContent = content.substring(0, startIndex) + replacement + content.substring(endIndex);
fs.writeFileSync(file, newContent, 'utf8');
console.log('✅ Hero Banner restructured successfully in App.tsx');
