import type { ReactNode } from 'react';
import { GroupDeliverablesMedia } from './GroupDeliverablesMedia';

/** Nội dung bổ sung đối chiếu checklist VNU1001 — gắn với từng nhiệm vụ */

function SupplementShell({
  title,
  rubricRef,
  children,
}: {
  title: string;
  rubricRef: string;
  children: ReactNode;
}) {
  return (
    <div className="mt-4 pt-4 border-t border-dashed border-indigo-200/60 dark:border-indigo-800/40 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h6 className="text-[10px] font-black text-teal-800 dark:text-teal-400 uppercase tracking-widest font-sans">{title}</h6>
        <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">{rubricRef}</span>
      </div>
      {children}
    </div>
  );
}

function Task1Supplements({ lang = 'vi' }: { lang?: 'vi' | 'en' }) {
  if (lang === 'en') {
    return (
      <>
        <SupplementShell title="Rationale for Directory Structure in Pharmacy" rubricRef="§2 · Deep Evidence">
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed text-justify font-semibold">
            With hundreds of Pharmacology slides, PDF guidelines, and practical reports each semester, a hierarchical structure of{' '}
            <code className="text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/50 px-1 rounded text-[10px]">Chuong[No]_Topic</code> helps avoid
            dosage errors from opening the wrong file, reduces lookup time before exams and clinical rotations, and aligns
            with the VNU1001 standard submission convention <code className="text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/50 px-1 rounded text-[10px]">BT*_Chuong*_BuiCaoHoan</code>.
          </p>
        </SupplementShell>
        <SupplementShell title="Extended Naming Convention (Version & Date)" rubricRef="§2 · Naming Rules">
          <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 font-semibold list-disc pl-4">
            <li>
              <strong className="text-slate-800 dark:text-slate-100">VNU Coursework Submission:</strong>{' '}
              <code className="font-mono text-[10px] text-indigo-600 dark:text-indigo-300">BT[No]_Chuong[No]_BuiCaoHoan</code>
            </li>
            <li>
              <strong className="text-slate-800 dark:text-slate-100">Clinical / Research Documents:</strong>{' '}
              <code className="font-mono text-[10px] text-indigo-600 dark:text-indigo-300">
                YYYY-MM-DD_VNU1001_[Type]_[Content]_v[Version]
              </code>
              <span className="text-slate-500 dark:text-slate-400"> — example: </span>
              <code className="font-mono text-[10px] dark:text-slate-300">2026-03-15_VNU1001_Regimen_AS_v2.pdf</code>
            </li>
            <li>
              <strong className="text-slate-800 dark:text-slate-100">Cloud Shared Files:</strong>{' '}
              <code className="font-mono text-[10px] dark:text-slate-300">Video_Script_v1.pdf</code>,{' '}
              <code className="font-mono text-[10px] dark:text-slate-300">Slide_Lipid_AI_v3.pptx</code>
            </li>
          </ul>
        </SupplementShell>
      </>
    );
  }

  return (
    <>
      <SupplementShell title="Lý do cấu trúc thư mục cho ngành Dược" rubricRef="§2 · Minh chứng sâu">
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed text-justify font-semibold">
          Với hàng trăm slide Dược lý, phác đồ PDF và báo cáo thực hành mỗi học kỳ, phân cấp{' '}
          <code className="text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/50 px-1 rounded text-[10px]">Chuong[Số]_Chủ đề</code> giúp tránh
          nhầm lẫn liều lượng khi mở nhầm file, rút ngắn thời gian tra cứu trước thi và thực tập lâm sàng, đồng thời
          đồng bộ với quy ước nộp bài <code className="text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/50 px-1 rounded text-[10px]">BT*_Chuong*_BuiCaoHoan</code>{' '}
          của học phần VNU1001.
        </p>
      </SupplementShell>
      <SupplementShell title="Quy tắc đặt tên mở rộng (phiên bản & ngày)" rubricRef="§2 · Quy tắc đặt tên">
        <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 font-semibold list-disc pl-4">
          <li>
            <strong className="text-slate-800 dark:text-slate-100">Báo cáo nộp VNU:</strong>{' '}
            <code className="font-mono text-[10px] text-indigo-600 dark:text-indigo-300">BT[Số]_Chuong[Số]_BuiCaoHoan</code>
          </li>
          <li>
            <strong className="text-slate-800 dark:text-slate-100">Tài liệu lâm sàng / nghiên cứu:</strong>{' '}
            <code className="font-mono text-[10px] text-indigo-600 dark:text-indigo-300">
              YYYY-MM-DD_VNU1001_[Loai]_[NoiDung]_v[So]
            </code>
            <span className="text-slate-500 dark:text-slate-400"> — ví dụ: </span>
            <code className="font-mono text-[10px] dark:text-slate-300">2026-03-15_VNU1001_PhacDo_AS_v2.pdf</code>
          </li>
          <li>
            <strong className="text-slate-800 dark:text-slate-100">Nhóm đám mây:</strong>{' '}
            <code className="font-mono text-[10px] dark:text-slate-300">KichBan_Video_V1.pdf</code>,{' '}
            <code className="font-mono text-[10px] dark:text-slate-300">Slide_Lipid_AI_v3.pptx</code>
          </li>
        </ul>
      </SupplementShell>
    </>
  );
}

function Task2Supplements({ lang = 'vi' }: { lang?: 'vi' | 'en' }) {
  if (lang === 'en') {
    return (
      <>
        <SupplementShell title="Academic Sources: PubMed & VNU-LIC" rubricRef="§3 · Reputable Sources">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <div className="p-3 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50">
              <span className="font-black text-indigo-900 dark:text-indigo-300 block mb-1">PubMed / PMC</span>
              MeSH Query: <em>Artificial Intelligence</em> + <em>Diagnosis</em> — filtering Q1 papers, full-text PDF.
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50">
              <span className="font-black text-indigo-900 dark:text-indigo-300 block mb-1">VNU-LIC</span>
              Search via VNU Library: journals Nature Medicine, The Lancet with institutional licenses — legally avoiding paywalls.
            </div>
          </div>
        </SupplementShell>
        <SupplementShell title="Search Operators (≥4)" rubricRef="§3 · Advanced Operators">
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60">
            <table className="w-full text-left text-[11px] font-sans">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-700/60 text-slate-700 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-slate-700">
                  <th className="p-2.5">Operator</th>
                  <th className="p-2.5">Application Example</th>
                  <th className="p-2.5">Objective</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50 text-slate-600 dark:text-slate-300 font-semibold">
                <tr>
                  <td className="p-2.5 font-mono text-indigo-700 dark:text-indigo-400">&quot;…&quot;</td>
                  <td className="p-2.5">&quot;medical imaging&quot;</td>
                  <td className="p-2.5">Exact phrase matching</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-mono text-indigo-700 dark:text-indigo-400">AND / OR</td>
                  <td className="p-2.5">(AI OR &quot;machine learning&quot;) AND diagnosis</td>
                  <td className="p-2.5">Boolean logic</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-mono text-indigo-700 dark:text-indigo-400">site:</td>
                  <td className="p-2.5">site:who.int digital health</td>
                  <td className="p-2.5">Limit to official health orgs</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-mono text-indigo-700 dark:text-indigo-400">filetype:pdf</td>
                  <td className="p-2.5">filetype:pdf EULAR ankylosing spondylitis</td>
                  <td className="p-2.5">Only PDF documents</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-mono text-indigo-700 dark:text-indigo-400">- (minus)</td>
                  <td className="p-2.5">AI diagnosis -veterinary</td>
                  <td className="p-2.5">Filter noise / irrelevant data</td>
                </tr>
              </tbody>
            </table>
          </div>
        </SupplementShell>
        <SupplementShell title="CRAAP Appraisal — 1 Pharmaceutical Paper" rubricRef="§3 · CRAAP">
          <div className="overflow-x-auto rounded-xl border border-emerald-100 dark:border-emerald-900/40 bg-emerald-50/30 dark:bg-emerald-950/20">
            <table className="w-full text-left text-[11px] font-sans">
              <thead>
                <tr className="bg-emerald-100/50 dark:bg-emerald-900/30 text-emerald-950 dark:text-emerald-300 font-bold">
                  <th className="p-2.5">Criteria</th>
                  <th className="p-2.5">Nature Medicine — Esteva et al. (2017)</th>
                </tr>
              </thead>
              <tbody className="text-slate-700 dark:text-slate-300 font-semibold divide-y divide-emerald-100/50 dark:divide-emerald-900/30">
                <tr><td className="p-2.5 font-bold">Currency</td><td className="p-2.5">Remains highly referenceable; guidelines updated 2022-2024 applied in clinic.</td></tr>
                <tr><td className="p-2.5 font-bold">Relevance</td><td className="p-2.5">Direct: AI in skin imaging — linked to digital clinical pharmacy.</td></tr>
                <tr><td className="p-2.5 font-bold">Authority</td><td className="p-2.5">Springer Nature, peer-reviewed, &gt;10,000 citations.</td></tr>
                <tr><td className="p-2.5 font-bold">Accuracy</td><td className="p-2.5">CNN method quantified; cross-checked with WHO Digital Health.</td></tr>
                <tr><td className="p-2.5 font-bold">Purpose</td><td className="p-2.5">Scientific objective, no commercial bias.</td></tr>
              </tbody>
            </table>
          </div>
        </SupplementShell>
      </>
    );
  }

  return (
    <>
      <SupplementShell title="Nguồn học thuật: PubMed & VNU-LIC" rubricRef="§3 · Nguồn uy tín">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold text-slate-600 dark:text-slate-300">
          <div className="p-3 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50">
            <span className="font-black text-indigo-900 dark:text-indigo-300 block mb-1">PubMed / PMC</span>
            Truy vấn MeSH: <em>Artificial Intelligence</em> + <em>Diagnosis</em> — lọc bài Q1, full-text PDF.
          </div>
          <div className="p-3 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50">
            <span className="font-black text-indigo-900 dark:text-indigo-300 block mb-1">VNU-LIC</span>
            Tra cứu qua thư viện ĐHQG: tạp chí Nature Medicine, The Lancet có license tổ chức — tránh paywall trái phép.
          </div>
        </div>
      </SupplementShell>
      <SupplementShell title="Toán tử tìm kiếm (≥4)" rubricRef="§3 · Toán tử nâng cao">
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60">
          <table className="w-full text-left text-[11px] font-sans">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-700/60 text-slate-700 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-slate-700">
                <th className="p-2.5">Toán tử</th>
                <th className="p-2.5">Ví dụ áp dụng</th>
                <th className="p-2.5">Mục đích</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50 text-slate-600 dark:text-slate-300 font-semibold">
              <tr>
                <td className="p-2.5 font-mono text-indigo-700 dark:text-indigo-400">&quot;…&quot;</td>
                <td className="p-2.5">&quot;medical imaging&quot;</td>
                <td className="p-2.5">Cụm từ chính xác</td>
              </tr>
              <tr>
                <td className="p-2.5 font-mono text-indigo-700 dark:text-indigo-400">AND / OR</td>
                <td className="p-2.5">(AI OR &quot;machine learning&quot;) AND diagnosis</td>
                <td className="p-2.5">Boolean logic</td>
              </tr>
              <tr>
                <td className="p-2.5 font-mono text-indigo-700 dark:text-indigo-400">site:</td>
                <td className="p-2.5">site:who.int digital health</td>
                <td className="p-2.5">Giới hạn tổ chức y tế</td>
              </tr>
              <tr>
                <td className="p-2.5 font-mono text-indigo-700 dark:text-indigo-400">filetype:pdf</td>
                <td className="p-2.5">filetype:pdf EULAR ankylosing spondylitis</td>
                <td className="p-2.5">Chỉ tài liệu PDF</td>
              </tr>
              <tr>
                <td className="p-2.5 font-mono text-indigo-700 dark:text-indigo-400">- (trừ)</td>
                <td className="p-2.5">AI diagnosis -veterinary</td>
                <td className="p-2.5">Loại nhiễu / tin giả</td>
              </tr>
            </tbody>
          </table>
        </div>
      </SupplementShell>
      <SupplementShell title="Phân tích CRAAP — 1 bài Dược khoa" rubricRef="§3 · CRAAP">
        <div className="overflow-x-auto rounded-xl border border-emerald-100 dark:border-emerald-900/40 bg-emerald-50/30 dark:bg-emerald-950/20">
          <table className="w-full text-left text-[11px] font-sans">
            <thead>
              <tr className="bg-emerald-100/50 dark:bg-emerald-900/30 text-emerald-950 dark:text-emerald-300 font-bold">
                <th className="p-2.5">Tiêu chí</th>
                <th className="p-2.5">Nature Medicine — Esteva et al. (2017)</th>
              </tr>
            </thead>
            <tbody className="text-slate-700 dark:text-slate-300 font-semibold divide-y divide-emerald-100/50 dark:divide-emerald-900/30">
              <tr><td className="p-2.5 font-bold">Currency</td><td className="p-2.5">Còn giá trị tham chiếu; bổ sung guideline 2022–2024 khi áp dụng lâm sàng.</td></tr>
              <tr><td className="p-2.5 font-bold">Relevance</td><td className="p-2.5">Trực tiếp: AI chẩn đoán hình ảnh da — liên quan dược lâm sàng số.</td></tr>
              <tr><td className="p-2.5 font-bold">Authority</td><td className="p-2.5">Springer Nature, peer-review, &gt;10.000 trích dẫn.</td></tr>
              <tr><td className="p-2.5 font-bold">Accuracy</td><td className="p-2.5">Phương pháp CNN có số liệu; đối chiếu với WHO Digital Health.</td></tr>
              <tr><td className="p-2.5 font-bold">Purpose</td><td className="p-2.5">Mục đích khoa học, không quảng cáo thương mại.</td></tr>
            </tbody>
          </table>
        </div>
      </SupplementShell>
    </>
  );
}

function Task3Supplements({ lang = 'vi' }: { lang?: 'vi' | 'en' }) {
  if (lang === 'en') {
    return (
      <>
        <SupplementShell title="Chain-of-Thought — Clinical Pharmacy Case Study" rubricRef="§4 · Clinical CoT">
          <div className="bg-white dark:bg-slate-800/60 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <p className="italic text-indigo-900/90 dark:text-indigo-300 border-l-2 border-indigo-400 pl-3">
              Prompt: &quot;Female patient 38yo, AS, taking NSAIDs. Perform step-by-step reasoning (CoT): (1) evaluate disease activity, (2) biological indication per EULAR 2022, (3) safety during pregnancy — citing sources.&quot;
            </p>
            <p className="text-justify leading-relaxed">
              AI lists response by step; Pharmacy students <strong className="text-slate-800 dark:text-slate-100">must cross-check</strong> with Decision 361/QD-BYT and National Drug Formulary before noting down conclusions — Human-in-the-loop evidence (Lesson 6).
            </p>
          </div>
        </SupplementShell>
        <SupplementShell title="ChatGPT vs Perplexity Comparison (Medical Tasks)" rubricRef="§4 · Mechanism comparison">
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60">
            <table className="w-full text-left text-[11px] font-sans">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-700/60 font-bold text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700">
                  <th className="p-2.5">Criteria</th>
                  <th className="p-2.5">ChatGPT</th>
                  <th className="p-2.5">Perplexity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50 text-slate-600 dark:text-slate-300 font-semibold">
                <tr><td className="p-2.5">Citations</td><td className="p-2.5">Unstable; frequently missing PMIDs</td><td className="p-2.5">Embeds source links, supports search CoT</td></tr>
                <tr><td className="p-2.5">Hallucination</td><td className="p-2.5">High if prompts are vague</td><td className="p-2.5">Lower due to built-in cross-verification</td></tr>
                <tr><td className="p-2.5">Best Fit</td><td className="p-2.5">Curriculum drafting, CLEAR/CRAC (Lesson 3)</td><td className="p-2.5">Regimens, clinical guidelines (Lesson 6)</td></tr>
              </tbody>
            </table>
          </div>
        </SupplementShell>
      </>
    );
  }

  return (
    <>
      <SupplementShell title="Chain-of-Thought — Ca lâm sàng Dược" rubricRef="§4 · CoT lâm sàng">
        <div className="bg-white dark:bg-slate-800/60 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
          <p className="italic text-indigo-900/90 dark:text-indigo-300 border-l-2 border-indigo-400 pl-3">
            Prompt: &quot;Bệnh nhân nữ 38 tuổi, AS, đang dùng NSAID. Hãy suy luận từng bước (CoT): (1) đánh giá hoạt
            động bệnh, (2) chỉ định sinh học theo EULAR 2022, (3) an toàn mang thai — trích dẫn nguồn.&quot;
          </p>
          <p className="text-justify leading-relaxed">
            AI liệt kê theo bước; sinh viên Dược <strong className="text-slate-800 dark:text-slate-100">bắt buộc đối chiếu</strong> QĐ
            361/BYT và Dược thư trước khi ghi nhận kết luận — minh chứng Human-in-the-loop (Bài 6).
          </p>
        </div>
      </SupplementShell>
      <SupplementShell title="So sánh ChatGPT vs Perplexity (y khoa)" rubricRef="§4 · So sánh cơ chế">
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60">
          <table className="w-full text-left text-[11px] font-sans">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-700/60 font-bold text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700">
                <th className="p-2.5">Tiêu chí</th>
                <th className="p-2.5">ChatGPT</th>
                <th className="p-2.5">Perplexity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50 text-slate-600 dark:text-slate-300 font-semibold">
              <tr><td className="p-2.5">Trích dẫn</td><td className="p-2.5">Không ổn định; dễ thiếu PMID</td><td className="p-2.5">Gắn link nguồn, hỗ trợ CoT tra cứu</td></tr>
              <tr><td className="p-2.5">Ảo giác</td><td className="p-2.5">Cao nếu prompt mơ hồ</td><td className="p-2.5">Thấp hơn khi có bước đối soát</td></tr>
              <tr><td className="p-2.5">Tác vụ phù hợp</td><td className="p-2.5">Soạn giáo trình, CLEAR/CRAC (Bài 3)</td><td className="p-2.5">Phác đồ, guideline (Bài 6)</td></tr>
            </tbody>
          </table>
        </div>
      </SupplementShell>
    </>
  );
}

function Task4Supplements({ lang = 'vi' }: { lang?: 'vi' | 'en' }) {
  if (lang === 'en') {
    return (
      <>
        <SupplementShell title="Netiquette & Team Conflict Resolution" rubricRef="§5 · Digital Culture">
          <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2 font-semibold list-disc pl-4 leading-relaxed">
            <li>
              <strong className="text-slate-800 dark:text-slate-100">Netiquette:</strong> Reply to comments within 24h; clearly @mention members; turn on cameras during Zoom pharmacology discussions; do not edit directly when Suggesting Mode is active.
            </li>
            <li>
              <strong className="text-slate-800 dark:text-slate-100">Content Conflict:</strong> When two clinical opinions differ on Google Docs — team leader holds a short vote on Jira, consults Version History, and finalizes per Ministry of Health guidelines / Q1 papers.
            </li>
            <li>
              <strong className="text-slate-800 dark:text-slate-100">Evidence:</strong> Steps 7-8 screenshots (Suggesting, Version History) in the detailed Lesson 4 flow.
            </li>
          </ul>
        </SupplementShell>
        <SupplementShell title="Video — Final Deliverable" rubricRef="§1 · Multimedia">
          <GroupDeliverablesMedia variant="compact" />
        </SupplementShell>
      </>
    );
  }

  return (
    <>
      <SupplementShell title="Netiquette & xử lý xung đột nhóm" rubricRef="§5 · Văn hóa số">
        <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2 font-semibold list-disc pl-4 leading-relaxed">
          <li>
            <strong className="text-slate-800 dark:text-slate-100">Netiquette:</strong> Trả lời comment trong 24h; ghi rõ @tên thành viên;
            họp Zoom bật camera khi thảo luận phác đồ; không chỉnh sửa trực tiếp khi đang dùng Suggesting Mode.
          </li>
          <li>
            <strong className="text-slate-800 dark:text-slate-100">Xung đột nội dung:</strong> Khi hai ý kiến lâm sàng khác nhau trên Google
            Docs — trưởng nhóm tổ chức vote ngắn trên Trello, lưu Version History và chốt theo guideline Bộ Y tế /
            tài liệu Q1.
          </li>
          <li>
            <strong className="text-slate-800 dark:text-slate-100">Minh chứng:</strong> Ảnh bước 7–8 (Suggesting, Version History) trong quy
            trình chi tiết Bài 4.
          </li>
        </ul>
      </SupplementShell>
      <SupplementShell title="Video — sản phẩm hoàn thiện" rubricRef="§1 · Đa phương tiện">
        <GroupDeliverablesMedia variant="compact" />
      </SupplementShell>
    </>
  );
}

function Task5Supplements({ lang = 'vi' }: { lang?: 'vi' | 'en' }) {
  const steps = lang === 'en' ? [
    { n: 1, label: 'Ideation & Target Audience', kpi: 'Effective Prompt topic + Students/Job seekers' },
    { n: 2, label: 'ChatGPT Content Generation', kpi: 'Basic prompt -> improved bullets <=15 words/bullet' },
    { n: 3, label: 'DALL·E Image Creation', kpi: 'Split-screen comparing clear vs. vague prompt' },
    { n: 4, label: 'Canva AI Formatting', kpi: 'Green-white layout, illustrative icons, synchronized color scheme' },
    { n: 5, label: 'Editing & Integration', kpi: 'Personal contribution >50%, customized content' },
    { n: 6, label: 'Finalization & Publication', kpi: 'High-quality PNG infographic, ethics report' },
  ] : [
    { n: 1, label: 'Lên ý tưởng & đối tượng', kpi: 'Chủ đề Prompt hiệu quả + SV/người tìm việc' },
    { n: 2, label: 'ChatGPT tạo nội dung', kpi: 'Prompt cơ bản → cải tiến bullet ≤15 từ/ý' },
    { n: 3, label: 'DALL·E tạo hình ảnh', kpi: 'Split-screen so sánh prompt rõ vs mơ hồ' },
    { n: 4, label: 'Canva AI thiết kế', kpi: 'Layout xanh-trắng, icon minh họa, bảng màu đồng bộ' },
    { n: 5, label: 'Chỉnh sửa & tích hợp', kpi: 'Đóng góp cá nhân >50%, cá nhân hóa nội dung' },
    { n: 6, label: 'Hoàn thiện & xuất bản', kpi: 'Infographic PNG chất lượng cao, báo cáo đạo đức' },
  ];

  return (
    <SupplementShell title={lang === 'en' ? "6-Step Creative Process & KPIs" : "Quy trình sáng tạo 6 bước & KPI"} rubricRef="§6 · Quy trình 6 bước">
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60">
        <table className="w-full text-left text-[11px] font-sans">
          <thead>
            <tr className="bg-indigo-50 dark:bg-indigo-950/50 text-indigo-950 dark:text-indigo-300 font-bold border-b border-indigo-100 dark:border-indigo-900/40">
              <th className="p-2.5 w-8">#</th>
              <th className="p-2.5">{lang === 'en' ? 'Step' : 'Bước'}</th>
              <th className="p-2.5">{lang === 'en' ? 'KPI / Evidence' : 'KPI / Minh chứng'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50 text-slate-600 dark:text-slate-300 font-semibold">
            {steps.map((s) => (
              <tr key={s.n}>
                <td className="p-2.5 font-black text-indigo-600 dark:text-indigo-400">{s.n}</td>
                <td className="p-2.5">{s.label}</td>
                <td className="p-2.5">{s.kpi}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[10px] text-slate-500 dark:text-slate-400 italic font-semibold">
        {lang === 'en' 
          ? "AI assists content/image creation; student customizes wording, filters appropriate visuals, and guarantees ethical use (steps 5-6 in the detailed process)."
          : "AI hỗ trợ tạo nội dung/ảnh; sinh viên chỉnh sửa cá nhân hóa, chọn lọc hình ảnh phù hợp và đảm bảo đạo đức sử dụng (bước 5–6 trong quy trình chi tiết)."}
      </p>
    </SupplementShell>
  );
}

function Task6Supplements({ lang = 'vi' }: { lang?: 'vi' | 'en' }) {
  if (lang === 'en') {
    return (
      <>
        <SupplementShell title="Human-in-the-Loop & Medical AI Reliability" rubricRef="§7 · Ethical Solutions">
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed text-justify font-semibold">
            AI auditing workflow: cross-checking Claude 3.5 Sonnet results with the original paper text, refining medical terminology, standardizing Vancouver citations. Work distribution:{' '}
            <strong className="text-slate-800 dark:text-slate-100">60% AI</strong> (scanning, structures, draft translation) and{' '}
            <strong className="text-slate-800 dark:text-slate-100">40% Human</strong> (verifying data, refining terms, critical thinking).
            Conclusion: AI reliability in medicine is Moderate-High (60-70%).
          </p>
        </SupplementShell>
        <SupplementShell title="Support vs. Academic Fraud" rubricRef="§7 · Critical Thinking">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold">
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 text-emerald-950 dark:text-emerald-300">
              <span className="font-black block mb-1 uppercase text-[10px] tracking-wide">Support ✓</span>
              Brainstorming ideas; correcting grammar/spelling; suggesting report outline; creating infographic after data is verified by the student.
            </div>
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40 text-rose-950 dark:text-rose-300">
              <span className="font-black block mb-1 uppercase text-[10px] tracking-wide">Fraud ✗</span>
              Copy-pasting AI output verbatim without verification; solving exam sheets; automating discussion sections; hiding AI usage; submitting AI outputs without personal input.
            </div>
          </div>
        </SupplementShell>
      </>
    );
  }

  return (
    <>
      <SupplementShell title="Human-in-the-Loop & Độ tin cậy AI y khoa" rubricRef="§7 · Giải pháp đạo đức">
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed text-justify font-semibold">
          Quy trình kiểm duyệt AI: đối soát kết quả Claude 3.5 Sonnet với văn bản gốc bài báo, hiệu đính thuật ngữ y khoa,
          chuẩn hóa trích dẫn Vancouver. Phân bổ công việc:{' '}
          <strong className="text-slate-800 dark:text-slate-100">60% AI</strong> (đọc quét, khung cấu trúc, dịch thuật thô) và{' '}
          <strong className="text-slate-800 dark:text-slate-100">40% con người</strong> (kiểm chuẩn số liệu, hiệu đính thuật ngữ, tư duy phản biện).
          Kết luận: tin cậy AI trong y khoa chỉ ở mức Trung bình – Khá (60–70%).
        </p>
      </SupplementShell>
      <SupplementShell title="Hỗ trợ vs Gian lận học thuật" rubricRef="§7 · Tư duy phản biện">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold">
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 text-emerald-950 dark:text-emerald-300">
            <span className="font-black block mb-1 uppercase text-[10px] tracking-wide">Hỗ trợ ✓</span>
            Brainstorming ý tưởng; sửa lỗi chính tả; gợi ý khung mục lục báo cáo; kiểm tra chính tả;
            tạo infographic sau khi đã có số liệu do sinh viên xác minh.
          </div>
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40 text-rose-950 dark:text-rose-300">
            <span className="font-black block mb-1 uppercase text-[10px] tracking-wide">Gian lận ✗</span>
            Sao chép nguyên văn bài AI không đối chiếu; giải hộ đề thi; tự động hóa phần bàn luận nghiên cứu;
            che giấu việc sử dụng AI; nộp sản phẩm AI mà không có đóng góp cá nhân.
          </div>
        </div>
      </SupplementShell>
    </>
  );
}

export function LessonRubricSupplements({ tabIndex, lang = 'vi' }: { tabIndex: number; lang?: 'vi' | 'en' }) {
  switch (tabIndex) {
    case 0:
      return <Task1Supplements lang={lang} />;
    case 1:
      return <Task2Supplements lang={lang} />;
    case 2:
      return <Task3Supplements lang={lang} />;
    case 3:
      return <Task4Supplements lang={lang} />;
    case 4:
      return <Task5Supplements lang={lang} />;
    case 5:
      return <Task6Supplements lang={lang} />;
    default:
      return null;
  }
}

export function SummaryRubricSupplement({ lang = 'vi' }: { lang?: 'vi' | 'en' }) {
  if (lang === 'en') {
    return (
      <div className="mt-8 space-y-4 relative z-10">
        <div className="glass-panel rounded-2xl p-6 border border-indigo-100/40 dark:border-indigo-900/30 space-y-3">
          <h4 className="text-xs font-black text-indigo-900 dark:text-indigo-300 uppercase tracking-widest font-sans">
            Rubric Alignment §8 — Depth & Competence Development
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed text-justify font-medium">
            I transitioned from a <strong className="text-slate-800 dark:text-slate-100">passive AI user</strong> (copy-pasting answers)
            to a <strong className="text-slate-800 dark:text-slate-100">strategic supervisor</strong>: designing advanced prompts (CLEAR/CRAC, Few-shot, CoT),
            using Claude 3.5 Sonnet to analyze scientific papers under the IMRAD layout, and constantly verifying through the Human-in-the-Loop workflow
            and original literature before drawing conclusions.
          </p>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed text-justify font-medium">
            <strong className="text-slate-800 dark:text-slate-100">Personal Code of 7 AI Ethical Principles:</strong> Transparency,
            Verification, Privacy, Fairness, Originality, Accountability, and Continuous Learning — the compass guiding academic integrity
            in all pharmaceutical learning and research tasks.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-4 relative z-10">
      <div className="glass-panel rounded-2xl p-6 border border-indigo-100/40 dark:border-indigo-900/30 space-y-3">
        <h4 className="text-xs font-black text-indigo-900 dark:text-indigo-300 uppercase tracking-widest font-sans">
          Đối chiếu Rubric §8 — Chiều sâu &amp; phát triển năng lực
        </h4>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed text-justify font-medium">
          Tôi chuyển từ <strong className="text-slate-800 dark:text-slate-100">người dùng AI thụ động</strong> (copy-paste câu trả lời)
          sang <strong className="text-slate-800 dark:text-slate-100">người giám sát chiến lược</strong>: thiết kế các prompt nâng cao (CLEAR/CRAC, Few-shot, CoT),
          sử dụng Claude 3.5 Sonnet phân tích bài báo khoa học cấu trúc IMRAD, luôn kiểm chứng thực chứng qua quy trình Human-in-the-Loop
          và đối chiếu y văn gốc trước khi ghi nhận kết luận.
        </p>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed text-justify font-medium">
          <strong className="text-slate-800 dark:text-slate-100">Bộ 7 Nguyên tắc Đạo đức AI cá nhân:</strong> Minh bạch (Transparency),
          Xác thực (Verification), Bảo mật (Privacy), Công bằng (Fairness), Sáng tạo (Originality),
          Trách nhiệm (Accountability), Học hỏi liên tục (Continuous Learning) — kim chỉ nam giúp duy trì liêm chính học thuật
          trong mọi tác vụ học tập và nghiên cứu dược học.
        </p>
      </div>
    </div>
  );
}
