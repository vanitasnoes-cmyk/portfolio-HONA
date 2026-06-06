import { useState, useEffect, useCallback, useRef } from 'react';
import { Menu, X, GraduationCap, CheckSquare, Mail, Layers, CheckCircle2, ChevronRight, AlertTriangle, Eye, FileDown, LayoutGrid, Columns, Play, Pause, Printer, ListTree, Moon, Sun, Search, ArrowRight, Sparkles } from 'lucide-react';
import stepEvidenceByProject from './data/step-evidence.json';
import { ProcessStepAccordion, getDefaultExpandedSteps } from './components/ProcessStepAccordion';
import {
  TRANSLATED_STRINGS,
  NAV_LINKS_LOCALIZED,
  GALLERY_FILES_LOCALIZED,
  PORTFOLIO_PROJECTS_LOCALIZED,
  LESSON_STEPS_LOCALIZED
} from './data/translations';
import { RubricChecklist } from './components/RubricChecklist';
import { RubricProgressMap } from './components/RubricProgressMap';
import { QuickNavDrawer } from './components/QuickNavDrawer';
import { PortfolioIntroMedia } from './components/PortfolioIntroMedia';
import { LessonMiniToc } from './components/LessonMiniToc';
import { LessonRubricSupplements, SummaryRubricSupplement } from './components/RubricSupplements';
import { GroupDeliverablesMedia } from './components/GroupDeliverablesMedia';
// import { Badge } from './components/ui/badge';
import { Button } from './components/ui/button';
import { Card, CardContent, CardFooter, CardTitle } from './components/ui/card';
import { cn } from './lib/utils';
import { GROUP_VIDEO_YOUTUBE_URL } from './data/group-deliverables';
import {
  parsePortfolioUrl,
  applyPortfolioUrl,
  getFullPortfolioUrl,
  PORTFOLIO_LESSON_HASH_RE,
  type PortfolioView,
} from './utils/portfolioUrl';

function App() {
  const [lang, setLang] = useState<'vi' | 'en'>('vi');
  const [showSearchBox, setShowSearchBox] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [currentSection, setCurrentSection] = useState('gioi-thieu');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<PortfolioView>('gallery');
  const [quickNavOpen, setQuickNavOpen] = useState(false);
  const [urlSynced, setUrlSynced] = useState(false);
  const [deepLinkStep, setDeepLinkStep] = useState<number | null>(null);
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set());
  const [linkCopied, setLinkCopied] = useState(false);
  /** Chỉ ghi #bai-N lên URL sau khi người dùng chọn bài (tránh nhảy section lúc mở trang) */
  const [urlLessonIndex, setUrlLessonIndex] = useState<number | null>(null);
  const scrollToLessonOnLoadRef = useRef(
    PORTFOLIO_LESSON_HASH_RE.test(window.location.hash),
  );

  // Dark mode — persisted in localStorage, class toggled on <html>
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Keyboard listener for Escape key to close lightbox modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedImage(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const [autoScrollActive, setAutoScrollActive] = useState(false);
  const [autoScrollSpeed, setAutoScrollSpeed] = useState(1); // 1 = 1x, 2 = 1.5x, 3 = 2x

  const resetDetailPaneScroll = () => {
    const pane = document.getElementById('dashboard-detail-pane');
    if (pane) pane.scrollTop = 0;
  };

  const scrollToDashboardSection = () => {
    const el = document.getElementById('dashboard-view-container') || document.getElementById('du-an');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Always stop auto-scroll when switching lessons or view mode (never auto-start on entry)
  useEffect(() => {
    setAutoScrollActive(false);
    resetDetailPaneScroll();
  }, [activeTab, viewMode]);

  // Auto-scroll runs only while autoScrollActive is true (toggled via the Play button)
  useEffect(() => {
    if (!autoScrollActive) return;
    
    const container = document.getElementById('dashboard-detail-pane');
    if (!container) return;
    
    let lastTime = performance.now();
    let scrollAccumulator = container.scrollTop;
    
    // Track the expected scroll position to detect external user scroll interventions
    let expectedScrollTop = container.scrollTop;
    let animationFrameId: number;
    
    const scrollStep = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;
      
      // Check if user scrolled externally (e.g. dragged scrollbar, mouse wheel, trackpad, arrow keys)
      // If actual scroll position differs from what our script set by more than 2 pixels, user is scrolling!
      if (Math.abs(container.scrollTop - expectedScrollTop) > 2) {
        setAutoScrollActive(false);
        return;
      }
      
      // Speed multiplier (e.g. 1x, 1.25x, 1.5x, 2x, 3x)
      const speedMultiplier = autoScrollSpeed * 0.025;
      scrollAccumulator += delta * speedMultiplier;
      
      const targetScroll = Math.floor(scrollAccumulator);
      container.scrollTop = targetScroll;
      expectedScrollTop = container.scrollTop;
      
      // If we reach the bottom, turn off autoscroll
      if (container.scrollTop + container.clientHeight >= container.scrollHeight - 3) {
        setAutoScrollActive(false);
        return;
      }
      
      animationFrameId = requestAnimationFrame(scrollStep);
    };
    
    // Pause when user scrolls manually (ignore clicks on the autoscroll control panel)
    const handleUserInteraction = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest('[data-autoscroll-controls]')) return;
      setAutoScrollActive(false);
    };
    
    container.addEventListener('wheel', handleUserInteraction, { passive: true });
    container.addEventListener('touchmove', handleUserInteraction, { passive: true });
    container.addEventListener('mousedown', handleUserInteraction, { passive: true });
    
    animationFrameId = requestAnimationFrame(scrollStep);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('wheel', handleUserInteraction);
      container.removeEventListener('touchmove', handleUserInteraction);
      container.removeEventListener('mousedown', handleUserInteraction);
    };
  }, [autoScrollActive, autoScrollSpeed]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  // Track scrolling to set active menu highlight
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['gioi-thieu', 'du-an', 'tong-ket'];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setCurrentSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = NAV_LINKS_LOCALIZED[lang];
  const galleryFiles = GALLERY_FILES_LOCALIZED[lang];
  const portfolioProjects = PORTFOLIO_PROJECTS_LOCALIZED[lang];
  const activeLessonSteps = LESSON_STEPS_LOCALIZED[lang];

  const navigateToLesson = useCallback(
    (index: number, stepIndex: number | null = null) => {
      setActiveTab(index);
      setUrlLessonIndex(index);
      setViewMode('dashboard');
      setDeepLinkStep(stepIndex);
      setQuickNavOpen(false);
      setMenuOpen(false);
      setTimeout(() => scrollToDashboardSection(), 80);
    },
    [],
  );

  const handleSidebarProjectClick = (index: number) => {
    navigateToLesson(index);
  };

  useEffect(() => {
    const parsed = parsePortfolioUrl();
    if (parsed.lessonIndex != null) {
      setActiveTab(parsed.lessonIndex);
      setUrlLessonIndex(parsed.lessonIndex);
    }
    setViewMode(parsed.view);
    if (parsed.stepIndex != null) {
      setDeepLinkStep(parsed.stepIndex);
      setViewMode('dashboard');
    }
    setUrlSynced(true);
  }, []);

  useEffect(() => {
    const onPop = () => {
      const parsed = parsePortfolioUrl();
      if (parsed.lessonIndex != null) {
        setActiveTab(parsed.lessonIndex);
        setUrlLessonIndex(parsed.lessonIndex);
      } else {
        setUrlLessonIndex(null);
      }
      setViewMode(parsed.view);
      setDeepLinkStep(parsed.stepIndex);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => {
    if (!urlSynced) return;
    applyPortfolioUrl({
      lessonIndex: urlLessonIndex,
      view: viewMode,
      stepIndex: deepLinkStep,
    });
  }, [urlLessonIndex, viewMode, deepLinkStep, urlSynced]);

  useEffect(() => {
    if (!urlSynced || !scrollToLessonOnLoadRef.current) return;
    scrollToLessonOnLoadRef.current = false;
    if (urlLessonIndex != null && viewMode === 'dashboard') {
      setTimeout(() => scrollToDashboardSection(), 250);
    }
  }, [urlSynced, urlLessonIndex, viewMode]);

  useEffect(() => {
    const projectId = portfolioProjects[activeTab]?.id as keyof typeof stepEvidenceByProject;
    const stepImages = stepEvidenceByProject[projectId] ?? [];
    setExpandedSteps(getDefaultExpandedSteps(stepImages, deepLinkStep));
  }, [activeTab, deepLinkStep]);

  useEffect(() => {
    if (!urlSynced || deepLinkStep == null || viewMode !== 'dashboard') return;
    const t = window.setTimeout(() => {
      document.getElementById(`step-${deepLinkStep + 1}`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 450);
    return () => clearTimeout(t);
  }, [deepLinkStep, activeTab, viewMode, urlSynced]);

  const copyLessonLink = async () => {
    try {
      await navigator.clipboard.writeText(
        getFullPortfolioUrl(activeTab, viewMode, deepLinkStep),
      );
      setLinkCopied(true);
      window.setTimeout(() => setLinkCopied(false), 2500);
    } catch {
      /* clipboard blocked */
    }
  };

  const handleMainNavClick = (sectionId: string) => {
    setMenuOpen(false);
    if (sectionId === 'gioi-thieu' || sectionId === 'tong-ket' || sectionId === 'du-an') {
      setUrlLessonIndex(null);
      setDeepLinkStep(null);
    }
  };

  const jumpToStep = (stepIndex: number) => {
    setUrlLessonIndex((prev) => prev ?? activeTab);
    setDeepLinkStep(stepIndex);
    setExpandedSteps((prev) => new Set([...prev, stepIndex]));
    setQuickNavOpen(false);
    window.setTimeout(() => {
      document.getElementById(`step-${stepIndex + 1}`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 150);
  };

  const toggleProcessStep = (stepIndex: number) => {
    setExpandedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(stepIndex)) next.delete(stepIndex);
      else next.add(stepIndex);
      return next;
    });
  };

  const getBadgeStyleClass = (skillIndex: number) => {
    const classes = ['badge-indigo', 'badge-teal', 'badge-violet', 'badge-amber', 'badge-rose', 'badge-emerald'];
    return `skill-badge ${classes[skillIndex % classes.length]}`;
  };

  const renderDetailedProcess = (tabIndex: number) => {
    const projectId = portfolioProjects[tabIndex].id as keyof typeof stepEvidenceByProject;
    const stepImages = stepEvidenceByProject[projectId] ?? [];
    const steps = activeLessonSteps[tabIndex] ?? [];

    return (
      <div className="space-y-3 bg-slate-50/70 p-5 border border-slate-100 rounded-2xl print:bg-white print:border-slate-300">
        <p className="text-[10px] text-slate-500 font-semibold italic print:text-slate-700">
          {TRANSLATED_STRINGS[lang].accordionHint}
        </p>
        <ProcessStepAccordion
          lessonNumber={tabIndex + 1}
          steps={steps}
          stepImages={stepImages}
          expandedSteps={expandedSteps}
          onToggleStep={toggleProcessStep}
          onExpandStep={(idx) =>
            setExpandedSteps((prev) => new Set([...prev, idx]))
          }
          onImageClick={setSelectedImage}
          lang={lang}
        />
      </div>
    );
  };

  const renderRubricPresentation = (tabIndex: number) => {
    if (lang === 'en') {
      switch (tabIndex) {
        case 0:
          return (
            <div className="space-y-4 bg-slate-50/70 p-5 border border-slate-100 rounded-2xl">
              <h6 className="text-xs font-black text-indigo-900 uppercase tracking-widest font-sans border-b border-indigo-100/50 pb-2 flex items-center gap-1.5">
                📁 Directory Structure Diagram & File Naming Rules
              </h6>
              
              {/* Tree View */}
              <div className="bg-slate-900 text-slate-100 font-mono text-[11px] sm:text-xs p-4 rounded-xl shadow-inner leading-relaxed overflow-x-auto">
                <div className="text-teal-400">📁 ThucHanh_BuiCaoHoan/ &lt;-- Academic Root Directory</div>
                <div className="pl-4 border-l border-slate-700 ml-2 mt-1">
                  <div className="text-yellow-400">📁 Chuong1_OS_Files/</div>
                  <div className="pl-6 border-l border-slate-700 ml-2 text-slate-300">
                    📄 GhiChuQuanTrong.txt <span className="text-slate-500 font-semibold italic">(Establish File Lifecycle)</span>
                  </div>
                  
                  <div className="text-yellow-400 mt-1">📁 Chuong2_AcademicSearch/</div>
                  <div className="pl-6 border-l border-slate-700 ml-2 text-slate-300">
                    📄 BT2_Chuong2_BuiCaoHoan.pdf <span className="text-slate-500 font-semibold italic">(Appraisal of 11 Medical Literature Sources)</span>
                  </div>
                  
                  <div className="text-yellow-400 mt-1">📁 Chuong3_PromptAI/</div>
                  <div className="pl-6 border-l border-slate-700 ml-2 text-slate-300">
                    📄 BT2_Chuong3_BuiCaoHoan.pdf <span className="text-slate-500 font-semibold italic">(Comparison of 3 Prompt Levels)</span>
                  </div>
                  
                  <div className="text-yellow-400 mt-1">📁 Chuong4_CloudCollaboration/</div>
                  <div className="pl-6 border-l border-slate-700 ml-2 text-slate-300">
                    📄 BT3_Chuong4_BuiCaoHoan.pdf <span className="text-slate-500 font-semibold italic">(Kanban Trello & Drive Workspace)</span>
                  </div>
                  
                  <div className="text-yellow-400 mt-1">📁 Chuong5_ContentCreation/</div>
                  <div className="pl-6 border-l border-slate-700 ml-2 text-slate-300">
                    📄 BT2_Chuong5_BuiCaoHoan.pdf <span className="text-slate-500 font-semibold italic">(Green Life Blog & Canva Infographic)</span>
                  </div>
                  
                  <div className="text-yellow-400 mt-1">📁 Chuong6_AIEthics/</div>
                  <div className="pl-6 border-l border-slate-700 ml-2 text-slate-300">
                    📄 BT4_Chuong6_BuiCaoHoan.pdf <span className="text-slate-500 font-semibold italic">(AS Clinical Case Analysis & Mendeley)</span>
                  </div>
                </div>
              </div>

              {/* Naming Rules */}
              <div className="space-y-2 pt-2">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block font-sans">
                  Standardized File Naming Rules:
                </span>
                <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4 font-semibold leading-relaxed">
                  <li><strong className="text-slate-800">Rule 1 (No accents):</strong> Root and subfolders are written continuously or with underscores, avoiding Vietnamese accents and special characters to ensure absolute system compatibility.</li>
                  <li><strong className="text-slate-800">Rule 2 (Consistency):</strong> File naming follows the exact structure: <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-600 font-mono text-[10px]">BT[No]_Chuong[No]_[FullName]</code>.</li>
                  <li><strong className="text-slate-800">Rule 3 (Hierarchy):</strong> Classify resources clearly under each training chapter of VNU-UMP to simplify management, search, and retrieval.</li>
                </ul>
              </div>
            </div>
          );
        case 1:
          return (
            <div className="space-y-4 bg-slate-50/70 p-5 border border-slate-100 rounded-2xl">
              <h6 className="text-xs font-black text-indigo-900 uppercase tracking-widest font-sans border-b border-indigo-100/50 pb-2">
                🔍 Academic Search Operators & Medical Source Appraisal Table
              </h6>
              
              {/* Boolean Query Box */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block font-sans">
                  Professional Boolean Query Expression:
                </span>
                <div className="bg-indigo-50 border border-indigo-100 text-indigo-950 font-mono text-[10px] sm:text-xs p-3 rounded-lg leading-relaxed select-all">
                  ("Vitamin D" OR "25(OH)D3") AND ("HPLC" OR "LC-MS/MS") AND "plasma"
                </div>
              </div>

              {/* Scholarly Evaluation Table */}
              <div className="space-y-2 pt-2">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block font-sans">
                  Scholarly Appraisal Table (Extracting 5 representative sources out of 12):
                </span>
                <div className="overflow-x-auto rounded-xl border border-slate-200/50 bg-white">
                  <table className="w-full text-left border-collapse text-xs font-sans">
                    <thead>
                      <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200/60">
                        <th className="p-3">Literature / Source</th>
                        <th className="p-3">Publisher / Reputation</th>
                        <th className="p-3">Strengths</th>
                        <th className="p-3">Limitations</th>
                        <th className="p-3 text-center">Credibility</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600 font-semibold">
                      <tr>
                        <td className="p-3 font-bold text-slate-900">FDA Guidance (2018)</td>
                        <td className="p-3">US FDA / Official Guideline</td>
                        <td className="p-3">International standard for bioanalysis</td>
                        <td className="p-3">No raw experimental data</td>
                        <td className="p-3 text-center text-indigo-600">10/10</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-slate-900">Brown et al., 2021</td>
                        <td className="p-3">Analytical Chemistry / Q1 Journal</td>
                        <td className="p-3">High sensitivity LC-MS/MS techniques</td>
                        <td className="p-3">Complex instrument setup</td>
                        <td className="p-3 text-center text-indigo-600">9.5/10</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-slate-900">Smith et al., 2020</td>
                        <td className="p-3">Journal of Chromatography B / Q1 Journal</td>
                        <td className="p-3">Clear HPLC method for plasma Vitamin D</td>
                        <td className="p-3">Small clinical sample size</td>
                        <td className="p-3 text-center text-indigo-600">9/10</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-slate-900">WHO Guidance (2020)</td>
                        <td className="p-3">World Health Organization / Official</td>
                        <td className="p-3">High authority, general standards</td>
                        <td className="p-3">Too general, lacks implementation details</td>
                        <td className="p-3 text-center text-indigo-600">9/10</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-slate-900">Jones et al., 2019</td>
                        <td className="p-3">Clinical Chemistry / Q1 Journal</td>
                        <td className="p-3">Direct comparison of HPLC and LC-MS/MS</td>
                        <td className="p-3">Lacks extensive clinical patient data</td>
                        <td className="p-3 text-center text-indigo-600">8.5/10</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <span className="text-[10px] text-slate-400 italic block leading-relaxed mt-1">
                  * All 12 literature sources are strictly appraised based on 5 criteria: Author Reputation, Publisher Status, Research Methodology, Citation Frequency, and Currency.
                </span>
              </div>
            </div>
          );
        case 2:
          return (
            <div className="space-y-4 bg-slate-50/70 p-5 border border-slate-100 rounded-2xl">
              <h6 className="text-xs font-black text-indigo-900 uppercase tracking-widest font-sans border-b border-indigo-100/50 pb-2">
                💡 Prompt Engineering Comparison & AI Response Output
              </h6>
              
              <div className="space-y-4">
                {/* Task 1 */}
                <div className="bg-white p-4 rounded-xl border border-slate-100 space-y-2.5 shadow-xs">
                  <span className="text-xs font-black text-slate-800 uppercase tracking-wide block font-sans border-l-3 border-indigo-500 pl-2">
                    Task 1: Summarizing COVID-19 mRNA Vaccine Mechanism
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-rose-50/50 rounded-lg border border-rose-100/30">
                      <span className="font-bold text-rose-800 block mb-1">Initial Prompt (Unimproved):</span>
                      <p className="text-slate-600 italic">"Summarize the paper on COVID-19 mRNA vaccine mechanism."</p>
                    </div>
                    <div className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-100/30">
                      <span className="font-bold text-emerald-800 block mb-1">Improved Prompt (CLEAR/CRAC):</span>
                      <p className="text-slate-700 font-semibold italic">"Acting as an immunology lecturer, summarize the mRNA vaccine paper structured as: Background, Mechanism (mRNA → protein → immune response), Advantages/Limitations, and Significance. Require conciseness, scientific terms, no external info."</p>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs">
                    <span className="font-bold text-slate-800 block mb-1">Superior Outcome from AI:</span>
                    <p className="text-slate-600 text-justify leading-relaxed">AI generates a structured summary under 250 words, precisely separating background, biomedical mechanism, and scientific significance with high academic rigor.</p>
                  </div>
                </div>

                {/* Task 2 */}
                <div className="bg-white p-4 rounded-xl border border-slate-100 space-y-2.5 shadow-xs">
                  <span className="text-xs font-black text-slate-800 uppercase tracking-wide block font-sans border-l-3 border-indigo-500 pl-2">
                    Task 2: Explaining Lipid Nanoparticles (LNP)
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-rose-50/50 rounded-lg border border-rose-100/30">
                      <span className="font-bold text-rose-800 block mb-1">Initial Prompt (Unimproved):</span>
                      <p className="text-slate-600 italic">"Explain what a Lipid Nanoparticle is."</p>
                    </div>
                    <div className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-100/30">
                      <span className="font-bold text-emerald-800 block mb-1">Improved Prompt (Chain-of-Thought):</span>
                      <p className="text-slate-700 font-semibold italic">"Acting as a pharmaceutical nanotechnology lecturer, explain Lipid Nanoparticles in sequence: Definition, Composition of components, Step-by-step mechanism, Comparison with traditional drug delivery, and Real-world applications."</p>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs">
                    <span className="font-bold text-slate-800 block mb-1">Superior Outcome from AI:</span>
                    <p className="text-slate-600 text-justify leading-relaxed">AI details the LNP structure and component lipids, systematically tracking the cellular uptake and mRNA release process in a logical, step-by-step manner.</p>
                  </div>
                </div>

                {/* Task 3 */}
                <div className="bg-white p-4 rounded-xl border border-slate-100 space-y-2.5 shadow-xs">
                  <span className="text-xs font-black text-slate-800 uppercase tracking-wide block font-sans border-l-3 border-indigo-500 pl-2">
                    Task 3: Generating HPLC Revision Questions
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-rose-50/50 rounded-lg border border-rose-100/30">
                      <span className="font-bold text-rose-800 block mb-1">Initial Prompt (Unimproved):</span>
                      <p className="text-slate-600 italic">"Create revision questions on HPLC."</p>
                    </div>
                    <div className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-100/30">
                      <span className="font-bold text-emerald-800 block mb-1">Improved Prompt (Few-shot):</span>
                      <p className="text-slate-700 font-semibold italic">"Acting as a pharmaceutical analysis lecturer, create HPLC questions stratified by Bloom's taxonomy: Remembering, Understanding, Applying, and Analyzing. Include answers and explanations. Link to a practical example (e.g., paracetamol - aspirin separation)."</p>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs">
                    <span className="font-bold text-slate-800 block mb-1">Superior Outcome from AI:</span>
                    <p className="text-slate-600 text-justify leading-relaxed">AI designs a structured exam set that ranges from fundamental recognition questions to complex analytical case solving, matching real-world exam standards.</p>
                  </div>
                </div>
              </div>
            </div>
          );
        case 3:
          return (
            <div className="space-y-4 bg-slate-50/70 p-5 border border-slate-100 rounded-2xl">
              <h6 className="text-xs font-black text-indigo-900 uppercase tracking-widest font-sans border-b border-indigo-100/50 pb-2">
                🤝 Cloud Collaboration Workspace & Group Task Allocation
              </h6>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Trello */}
                <div className="bg-white p-4 rounded-xl border border-slate-100 space-y-2 shadow-xs hover-lift">
                  <span className="text-xs font-black text-indigo-950 uppercase tracking-wide block font-sans border-b border-slate-50 pb-1.5 flex items-center gap-1">
                    📋 Kanban Trello
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed text-justify font-semibold">
                    Set up a workspace for 5 members (Team Leader: Bui Cao Hoan). Applied a color-coded label system (Blue: In Progress, Red: High Priority, Green: Done) along with detailed checklists and strict due dates to control the project lifecycle.
                  </p>
                </div>

                {/* Zoom */}
                <div className="bg-white p-4 rounded-xl border border-slate-100 space-y-2 shadow-xs hover-lift">
                  <span className="text-xs font-black text-indigo-950 uppercase tracking-wide block font-sans border-b border-slate-50 pb-1.5 flex items-center gap-1">
                    💬 Zoom Meetings
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed text-justify font-semibold">
                    Organized 90-minute high-quality group project discussion sessions. Used live screen sharing to review medical slides, activated breakout rooms to pair members for content drafting, and automatically recorded minutes via Google Meet.
                  </p>
                </div>

                {/* Google Docs */}
                <div className="bg-white p-4 rounded-xl border border-slate-100 space-y-2 shadow-xs hover-lift">
                  <span className="text-xs font-black text-indigo-950 uppercase tracking-wide block font-sans border-b border-slate-50 pb-1.5 flex items-center gap-1">
                    📝 Google Docs
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed text-justify font-semibold">
                    Co-authored the Hypertension clinical case presentation script. Activated Suggesting Mode for clinical cross-editing, commented inline to resolve discrepancies, and tracked revisions via Version History to prevent scientific data loss.
                  </p>
                </div>

                {/* Google Drive */}
                <div className="bg-white p-4 rounded-xl border border-slate-100 space-y-2 shadow-xs hover-lift">
                  <span className="text-xs font-black text-indigo-950 uppercase tracking-wide block font-sans border-b border-slate-50 pb-1.5 flex items-center gap-1">
                    ☁️ Google Drive
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed text-justify font-semibold">
                    Established a hierarchical, scientifically organized storage space under a consistent naming convention. Configured granular access control for members and enforced Two-Factor Authentication (2FA) to secure critical research files.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-2">
                <a
                  href={GROUP_VIDEO_YOUTUBE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-rose-50 text-rose-900 border border-rose-100 text-[11px] font-bold hover:bg-rose-100 transition-colors"
                >
                  ▶ Watch project video on YouTube
                </a>
              </div>
            </div>
          );
        case 4:
          return (
            <div className="space-y-4 bg-slate-50/70 p-5 border border-slate-100 rounded-2xl">
              <h6 className="text-xs font-black text-indigo-900 uppercase tracking-widest font-sans border-b border-indigo-100/50 pb-2">
                🌱 Generative AI Creative Content & Canva Infographic Design
              </h6>
              
              <div className="space-y-4">
                {/* Topic Intro */}
                <div className="bg-white p-4 rounded-xl border border-slate-100 space-y-2 shadow-xs">
                  <span className="text-[10px] uppercase font-black text-indigo-600 tracking-wider font-sans">
                    Infographic Topic
                  </span>
                  <h5 className="text-slate-900 text-sm font-black font-sans leading-snug">
                    Effective Prompt Writing for Building Job & Internship Portfolios
                  </h5>
                  <p className="text-slate-600 text-xs leading-relaxed text-justify font-semibold">
                    Aim: Master generative AI tools (ChatGPT, DALL·E, and Canva AI) to co-create a professional infographic demonstrating effective prompt engineering for portfolio building.
                  </p>
                </div>

                {/* Prompt Comparison */}
                <div className="bg-white p-4 rounded-xl border border-slate-100 space-y-2.5 shadow-xs">
                  <span className="text-xs font-black text-slate-800 uppercase tracking-wide block font-sans border-l-3 border-indigo-500 pl-2">
                    Prompt Engineering Evolution
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-150">
                      <span className="font-bold text-slate-800 block mb-1">ChatGPT Text Prompts:</span>
                      <p className="text-slate-600 italic">Initial: "Write infographic content about effective prompt writing for job and internship portfolio..."</p>
                      <p className="text-slate-700 font-bold italic mt-1.5">Improved: "Summarize the prompt writing content into main points, bullet format, each point under 15 words."</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-150">
                      <span className="font-bold text-slate-800 block mb-1">DALL·E Image Prompts:</span>
                      <p className="text-slate-600 italic">Initial: "Flat illustration showing clear vs unclear prompt, modern style, minimal, blue tone..."</p>
                      <p className="text-slate-700 font-bold italic mt-1.5">Improved: "Split-screen illustration comparing vague prompt vs clear prompt, labeled, modern infographic style."</p>
                    </div>
                  </div>
                </div>

                {/* AI Tool Matrix Table */}
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block font-sans">
                    AI Tool Evaluation Matrix:
                  </span>
                  <div className="overflow-x-auto rounded-xl border border-slate-200/50 bg-white">
                    <table className="w-full text-left border-collapse text-xs font-sans">
                      <thead>
                        <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200/60">
                          <th className="p-3">AI Tool</th>
                          <th className="p-3">Main Function</th>
                          <th className="p-3">Strengths</th>
                          <th className="p-3">Limitations</th>
                          <th className="p-3 text-center">Effectiveness</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-600 font-semibold">
                        <tr>
                          <td className="p-3 font-bold text-slate-900">ChatGPT</td>
                          <td className="p-3">Content generation</td>
                          <td className="p-3">Fast, logical structure</td>
                          <td className="p-3">Sometimes wordy, needs refining</td>
                          <td className="p-3 text-center text-teal-600">High</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-bold text-slate-900">DALL·E</td>
                          <td className="p-3">Image generation</td>
                          <td className="p-3">Creative, highly visual</td>
                          <td className="p-3">Can deviate from exact prompt</td>
                          <td className="p-3 text-center text-teal-600">Medium-High</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-bold text-slate-900">Canva AI</td>
                          <td className="p-3">Infographic layout</td>
                          <td className="p-3">Easy to customize & design</td>
                          <td className="p-3">Depends heavily on input quality</td>
                          <td className="p-3 text-center text-teal-600">High</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Design Guidelines */}
                <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100/30 space-y-2">
                  <span className="text-xs font-black text-indigo-900 uppercase tracking-wide block font-sans">
                    📐 Applied Infographic Design Principles:
                  </span>
                  <ul className="text-xs text-slate-700 space-y-1.5 list-disc pl-4 font-semibold leading-relaxed">
                    <li><strong className="text-slate-900">Color Scheme:</strong> Used a clean blue-white color palette to convey professionalism and optimize contrast.</li>
                    <li><strong className="text-slate-900">Visual Weight & Hierarchy:</strong> Balanced 3-part layout (Concept &rarr; Rules &rarr; Portfolio application) utilizing bullet points under 15 words to facilitate rapid scanning.</li>
                    <li><strong className="text-slate-900">Human-AI Collaboration:</strong> Leveraged AI for initial ideas, text summarizing, and background graphics while human editor maintained &gt;50% contribution through structural customization and content personalization.</li>
                  </ul>
                </div>
              </div>
            </div>
          );
        case 5:
          return (
            <div className="space-y-4 bg-slate-50/70 p-5 border border-slate-100 rounded-2xl">
              <h6 className="text-xs font-black text-indigo-900 uppercase tracking-widest font-sans border-b border-indigo-100/50 pb-2">
                ⚖️ Personal "7 Gold Principles" of AI Ethics for Future Digital Pharmacists
              </h6>
              
              {/* 7 Gold Principles Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { num: "1", title: "TRANSPARENCY", en: "Transparency", desc: "Always declare the level of AI assistance in all submitted exercises, essays, or research reports to ensure academic honesty." },
                  { num: "2", title: "VERIFICATION", en: "Verification", desc: "Never trust AI blindly. Every clinical dose, drug mechanism, or diagnostic study must be cross-checked against official databases (PubMed, UpToDate)." },
                  { num: "3", title: "PRIVACY", en: "Privacy", desc: "Strictly protect patient confidentiality. Never upload identifying details or sensitive clinical medical records to public AI models." },
                  { num: "4", title: "FAIRNESS", en: "Fairness", desc: "Never use AI to gain unfair advantages in exams, or to falsify or manipulate scientific data in academic research." },
                  { num: "5", title: "ORIGINALITY", en: "Originality", desc: "AI serves only as a helper. The core arguments, analytical logic, and final conclusions must represent your own cognitive effort." },
                  { num: "6", title: "ACCOUNTABILITY", en: "Accountability", desc: "Bear sole responsibility before the university, lecturers, and law for the accuracy and legality of all submitted papers." },
                  { num: "7", title: "CONTINUOUS LEARNING", en: "Continuous Learning", desc: "Actively update knowledge on digital ethics, national laws, and VNU regulations to adjust AI adoption behaviors accordingly." }
                ].map((rule) => (
                  <div key={rule.num} className="bg-white p-4 rounded-xl border border-slate-100 space-y-1.5 shadow-xs hover-lift">
                    <div className="flex items-center gap-2">
                      <span className="w-5.5 h-5.5 rounded-lg bg-gradient-to-tr from-indigo-600 to-teal-500 flex items-center justify-center text-white text-[10px] font-black shrink-0">
                        {rule.num}
                      </span>
                      <span className="text-slate-900 text-xs font-black font-sans leading-tight">
                        {rule.title}
                      </span>
                    </div>
                    <span className="text-[9px] uppercase font-extrabold text-teal-600 tracking-wider block font-sans">
                      {rule.en}
                    </span>
                    <p className="text-[11px] text-slate-500 leading-relaxed text-justify font-semibold">
                      {rule.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* Case Study alert */}
              <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl space-y-1 mt-2">
                <span className="text-[10px] uppercase font-black text-amber-800 tracking-wider block font-sans">
                  ⚠️ Academic Audit of Lung Cancer CT Scan AI Report:
                </span>
                <p className="text-xs text-amber-950 font-semibold leading-relaxed text-justify">
                  Applied standard research analysis on Claude 3.5 Sonnet IMRAD outputs for lung cancer CT scan early diagnosis. Detected and corrected a critical AI hallucination (inversion of False Positive and False Negative rate percentage values) and highlighted racial data bias, ensuring strict scientific accuracy.
                </p>
              </div>
            </div>
          );
        default:
          return null;
      }
    }

    switch (tabIndex) {
      case 0:
        return (
          <div className="space-y-4 bg-slate-50/70 p-5 border border-slate-100 rounded-2xl">
            <h6 className="text-xs font-black text-indigo-900 uppercase tracking-widest font-sans border-b border-indigo-100/50 pb-2 flex items-center gap-1.5">
              📁 Sơ đồ Cấu trúc Thư mục và Quy tắc Đặt tên Tệp
            </h6>
            
            {/* Tree View */}
            <div className="bg-slate-900 text-slate-100 font-mono text-[11px] sm:text-xs p-4 rounded-xl shadow-inner leading-relaxed overflow-x-auto">
              <div className="text-teal-400">📁 ThucHanh_BuiCaoHoan/ &lt;-- Thư mục gốc học thuật</div>
              <div className="pl-4 border-l border-slate-700 ml-2 mt-1">
                <div className="text-yellow-400">📁 Chuong1_OS_Files/</div>
                <div className="pl-6 border-l border-slate-700 ml-2 text-slate-300">
                  📄 GhiChuQuanTrong.txt <span className="text-slate-500 font-semibold italic">(Thiết lập vòng đời tệp tin)</span>
                </div>
                
                <div className="text-yellow-400 mt-1">📁 Chuong2_AcademicSearch/</div>
                <div className="pl-6 border-l border-slate-700 ml-2 text-slate-300">
                  📄 BT2_Chuong2_BuiCaoHoan.pdf <span className="text-slate-500 font-semibold italic">(Thẩm định 11 tài liệu y khoa)</span>
                </div>
                
                <div className="text-yellow-400 mt-1">📁 Chuong3_PromptAI/</div>
                <div className="pl-6 border-l border-slate-700 ml-2 text-slate-300">
                  📄 BT2_Chuong3_BuiCaoHoan.pdf <span className="text-slate-500 font-semibold italic">(So sánh 3 cấp độ Prompt)</span>
                </div>
                
                <div className="text-yellow-400 mt-1">📁 Chuong4_CloudCollaboration/</div>
                <div className="pl-6 border-l border-slate-700 ml-2 text-slate-300">
                  📄 BT3_Chuong4_BuiCaoHoan.pdf <span className="text-slate-500 font-semibold italic">(Không gian Kanban Trello & Drive)</span>
                </div>
                
                <div className="text-yellow-400 mt-1">📁 Chuong5_ContentCreation/</div>
                <div className="pl-6 border-l border-slate-700 ml-2 text-slate-300">
                  📄 BT2_Chuong5_BuiCaoHoan.pdf <span className="text-slate-500 font-semibold italic">(Bài Blog Sống Xanh & Canva Infographic)</span>
                </div>
                
                <div className="text-yellow-400 mt-1">📁 Chuong6_AIEthics/</div>
                <div className="pl-6 border-l border-slate-700 ml-2 text-slate-300">
                  📄 BT4_Chuong6_BuiCaoHoan.pdf <span className="text-slate-500 font-semibold italic">(Bản phân tích ca lâm sàng AS & Mendeley)</span>
                </div>
              </div>
            </div>

            {/* Naming Rules */}
            <div className="space-y-2 pt-2">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block font-sans">
                Quy tắc đặt tên tệp tin chuẩn hóa:
              </span>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4 font-semibold leading-relaxed">
                <li><strong className="text-slate-800">Quy tắc 1 (Không dấu):</strong> Thư mục gốc và thư mục con viết liền hoặc dùng dấu gạch dưới, không sử dụng dấu tiếng Việt và ký tự đặc biệt để đảm bảo tính tương thích hệ thống tuyệt đối.</li>
                <li><strong className="text-slate-800">Quy tắc 2 (Nhất quán):</strong> Định dạng tên tệp tin sản phẩm luôn tuân thủ cấu trúc: <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-600 font-mono text-[10px]">BT[Số]_Chuong[Số]_[HọTên]</code>.</li>
                <li><strong className="text-slate-800">Quy tắc 3 (Phân cấp):</strong> Phân chia tài nguyên rõ ràng theo từng chương đào tạo của VNU-UMP để dễ dàng quản trị, tìm kiếm và truy xuất.</li>
              </ul>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-4 bg-slate-50/70 p-5 border border-slate-100 rounded-2xl">
            <h6 className="text-xs font-black text-indigo-900 uppercase tracking-widest font-sans border-b border-indigo-100/50 pb-2">
              🔍 Toán tử Tìm kiếm Học thuật & Bảng Thẩm định Nguồn Y khoa
            </h6>
            
            {/* Boolean Query Box */}
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block font-sans">
                Biểu thức Boolean truy vấn chuyên nghiệp (Boolean Query):
              </span>
              <div className="bg-indigo-50 border border-indigo-100 text-indigo-950 font-mono text-[10px] sm:text-xs p-3 rounded-lg leading-relaxed select-all">
                ("Vitamin D" OR "25(OH)D3") AND ("HPLC" OR "LC-MS/MS") AND "plasma"
              </div>
            </div>

            {/* Scholarly Evaluation Table */}
            <div className="space-y-2 pt-2">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block font-sans">
                Bảng thẩm định học thuật (Trích xuất 5 nguồn tiêu biểu trong số 12 nguồn):
              </span>
              <div className="overflow-x-auto rounded-xl border border-slate-200/50 bg-white">
                <table className="w-full text-left border-collapse text-xs font-sans">
                  <thead>
                    <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200/60">
                      <th className="p-3">Tài liệu / Nguồn</th>
                      <th className="p-3">Nhà xuất bản / Uy tín</th>
                      <th className="p-3">Ưu điểm</th>
                      <th className="p-3">Hạn chế</th>
                      <th className="p-3 text-center">Điểm tin cậy</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600 font-semibold">
                    <tr>
                      <td className="p-3 font-bold text-slate-900">Hướng dẫn FDA (2018)</td>
                      <td className="p-3">US FDA / Hướng dẫn chính thức</td>
                      <td className="p-3">Chuẩn mực quốc tế về thẩm định sinh học</td>
                      <td className="p-3">Không có dữ liệu thực nghiệm</td>
                      <td className="p-3 text-center text-indigo-600">10/10</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-900">Brown et al., 2021</td>
                      <td className="p-3">Analytical Chemistry / Tạp chí Q1</td>
                      <td className="p-3">Kỹ thuật LC-MS/MS độ nhạy cực cao</td>
                      <td className="p-3">Thiết bị phức tạp, vận hành tốn kém</td>
                      <td className="p-3 text-center text-indigo-600">9.5/10</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-900">Smith et al., 2020</td>
                      <td className="p-3">Journal of Chromatography B / Tạp chí Q1</td>
                      <td className="p-3">Phương pháp HPLC định lượng Vitamin D rõ ràng</td>
                      <td className="p-3">Cỡ mẫu lâm sàng nhỏ</td>
                      <td className="p-3 text-center text-indigo-600">9/10</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-900">Hướng dẫn WHO (2020)</td>
                      <td className="p-3">Tổ chức Y tế Thế giới / Chính thức</td>
                      <td className="p-3">Uy tín cao, định hướng tổng quan tốt</td>
                      <td className="p-3">Tổng quan chung, ít chi tiết kỹ thuật</td>
                      <td className="p-3 text-center text-indigo-600">9/10</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-900">Jones et al., 2019</td>
                      <td className="p-3">Clinical Chemistry / Tạp chí Q1</td>
                      <td className="p-3">So sánh trực tiếp giữa HPLC và LC-MS/MS</td>
                      <td className="p-3">Thiếu dữ liệu bệnh nhân thực tế sâu rộng</td>
                      <td className="p-3 text-center text-indigo-600">8.5/10</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <span className="text-[10px] text-slate-400 italic block leading-relaxed mt-1">
                * Toàn bộ 12 nguồn tài liệu được thẩm định nghiêm ngặt qua 5 tiêu chí: Uy tín tác giả, vị thế Nhà xuất bản khoa học, Phương pháp nghiên cứu thực nghiệm, Tần suất trích dẫn khoa học và Tính cập nhật.
              </span>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4 bg-slate-50/70 p-5 border border-slate-100 rounded-2xl">
            <h6 className="text-xs font-black text-indigo-900 uppercase tracking-widest font-sans border-b border-indigo-100/50 pb-2">
              💡 Bảng So sánh Kỹ nghệ Prompt & Kết quả Phản hồi từ AI
            </h6>
            
            <div className="space-y-4">
              {/* Task 1 */}
              <div className="bg-white p-4 rounded-xl border border-slate-100 space-y-2.5 shadow-xs">
                <span className="text-xs font-black text-slate-800 uppercase tracking-wide block font-sans border-l-3 border-indigo-500 pl-2">
                  Tác vụ 1: Tóm tắt cơ chế vaccine mRNA phòng COVID-19
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-rose-50/50 rounded-lg border border-rose-100/30">
                    <span className="font-bold text-rose-800 block mb-1">Prompt Ban đầu (Chưa cải tiến):</span>
                    <p className="text-slate-600 italic">"Hãy tóm tắt bài báo về cơ chế vaccine mRNA trong COVID-19."</p>
                  </div>
                  <div className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-100/30">
                    <span className="font-bold text-emerald-800 block mb-1">Prompt Cải tiến (CLEAR/CRAC):</span>
                    <p className="text-slate-700 font-semibold italic">"Bạn là giảng viên miễn dịch học. Hãy tóm tắt bài báo về vaccine mRNA theo cấu trúc: Bối cảnh, Cơ chế (mRNA → protein → đáp ứng miễn dịch), Ưu điểm và hạn chế, Ý nghĩa. Yêu cầu: Súc tích, chính xác, sử dụng thuật ngữ chuyên ngành."</p>
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs">
                  <span className="font-bold text-slate-800 block mb-1">Kết quả vượt trội từ AI:</span>
                  <p className="text-slate-600 text-justify leading-relaxed">AI xuất ra văn bản tóm tắt có chiều sâu học thuật cao dưới 250 từ, phân tách rõ ràng bối cảnh dịch bệnh, cơ chế biểu hiện kháng nguyên y sinh, ưu nhược điểm của công nghệ mRNA và ý nghĩa thực tế.</p>
                </div>
              </div>

              {/* Task 2 */}
              <div className="bg-white p-4 rounded-xl border border-slate-100 space-y-2.5 shadow-xs">
                <span className="text-xs font-black text-slate-800 uppercase tracking-wide block font-sans border-l-3 border-indigo-500 pl-2">
                  Tác vụ 2: Giải thích hệ dẫn truyền thuốc Lipid Nanoparticle (LNP)
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-rose-50/50 rounded-lg border border-rose-100/30">
                    <span className="font-bold text-rose-800 block mb-1">Prompt Ban đầu (Chưa cải tiến):</span>
                    <p className="text-slate-600 italic">"Giải thích Lipid Nanoparticle là gì."</p>
                  </div>
                  <div className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-100/30">
                    <span className="font-bold text-emerald-800 block mb-1">Prompt Cải tiến (Chain-of-Thought):</span>
                    <p className="text-slate-700 font-semibold italic">"Bạn là giảng viên công nghệ nano dược phẩm. Hãy giải thích Lipid Nanoparticle theo trình tự: Định nghĩa, Cấu trúc từng thành phần, Cơ chế hoạt động từng bước, So sánh với hệ truyền thuốc truyền thống, Ứng dụng thực tế."</p>
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs">
                  <span className="font-bold text-slate-800 block mb-1">Kết quả vượt trội từ AI:</span>
                  <p className="text-slate-600 text-justify leading-relaxed">AI trình bày chi tiết cấu trúc LNP (phân lớp lipid ion hóa, cholesterol, PEG-lipid) và cơ chế bọc bảo vệ phân tử mRNA kém bền vững. Phương pháp Chain-of-Thought giúp người học hiểu rõ từng bước xâm nhập tế bào qua nội bào và phóng thích thuốc.</p>
                </div>
              </div>

              {/* Task 3 */}
              <div className="bg-white p-4 rounded-xl border border-slate-100 space-y-2.5 shadow-xs">
                <span className="text-xs font-black text-slate-800 uppercase tracking-wide block font-sans border-l-3 border-indigo-500 pl-2">
                  Tác vụ 3: Tạo câu hỏi ôn tập Sắc ký lỏng hiệu năng cao (HPLC)
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-rose-50/50 rounded-lg border border-rose-100/30">
                    <span className="font-bold text-rose-800 block mb-1">Prompt Ban đầu (Chưa cải tiến):</span>
                    <p className="text-slate-600 italic">"Tạo câu hỏi ôn tập về HPLC."</p>
                  </div>
                  <div className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-100/30">
                    <span className="font-bold text-emerald-800 block mb-1">Prompt Cải tiến (Few-shot Prompting):</span>
                    <p className="text-slate-700 font-semibold italic">"Bạn là giảng viên phân tích dược phẩm. Hãy tạo bộ câu hỏi về HPLC gồm 4 phần: Nhận biết, Hiểu, Vận dụng, Vận dụng cao. Yêu cầu: Có đáp án và giải thích, gắn với thực tế tách paracetamol – aspirin, đảm bảo độ khó tăng dần."</p>
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs">
                  <span className="font-bold text-slate-800 block mb-1">Kết quả vượt trội từ AI:</span>
                  <p className="text-slate-600 text-justify leading-relaxed">AI thiết lập thành công đề thi phân hóa năng lực người học rõ rệt theo các cấp độ nhận thức của Bloom. Các câu hỏi vận dụng gắn liền với thực hành kiểm nghiệm dược phẩm thực tế tại VNU-UMP.</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4 bg-slate-50/70 p-5 border border-slate-100 rounded-2xl">
            <h6 className="text-xs font-black text-indigo-900 uppercase tracking-widest font-sans border-b border-indigo-100/50 pb-2">
              🤝 Không gian Cộng tác Đám mây & Phân công Công việc Nhóm
            </h6>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Trello */}
              <div className="bg-white p-4 rounded-xl border border-slate-100 space-y-2 shadow-xs hover-lift">
                <span className="text-xs font-black text-indigo-950 uppercase tracking-wide block font-sans border-b border-slate-50 pb-1.5 flex items-center gap-1">
                  📋 Kanban Trello
                </span>
                <p className="text-xs text-slate-600 leading-relaxed text-justify font-semibold">
                  Thiết lập bảng làm việc cho 5 thành viên (Trưởng nhóm: Bùi Cao Hoàn). Sử dụng hệ thống nhãn dán phân loại màu sắc (Xanh: Đang tiến hành, Đỏ: Cần hoàn thành gấp, Xanh lá: Đã xong) kèm theo danh sách kiểm tra (checklists) và thời hạn hoàn thành (due-dates) nghiêm ngặt để kiểm soát vòng đời dự án.
                </p>
              </div>

              {/* Zoom */}
              <div className="bg-white p-4 rounded-xl border border-slate-100 space-y-2 shadow-xs hover-lift">
                <span className="text-xs font-black text-indigo-950 uppercase tracking-wide block font-sans border-b border-slate-50 pb-1.5 flex items-center gap-1">
                  💬 Zoom Meetings
                </span>
                <p className="text-xs text-slate-600 leading-relaxed text-justify font-semibold">
                  Tổ chức các cuộc họp thảo luận dự án nhóm chất lượng cao 90 phút. Sử dụng chức năng chia sẻ màn hình trực tiếp để duyệt slide thuyết trình y khoa, kích hoạt các phòng thảo luận nhóm phụ (Breakout Rooms) để phân chia cặp viết nội dung, và lưu biên bản họp tự động thông qua AI Companion.
                </p>
              </div>

              {/* Google Docs */}
              <div className="bg-white p-4 rounded-xl border border-slate-100 space-y-2 shadow-xs hover-lift">
                <span className="text-xs font-black text-indigo-950 uppercase tracking-wide block font-sans border-b border-slate-50 pb-1.5 flex items-center gap-1">
                  📝 Google Docs
                </span>
                <p className="text-xs text-slate-600 leading-relaxed text-justify font-semibold">
                  Đồng soạn thảo trực tiếp kịch bản thuyết trình phân tích ca lâm sàng Tăng huyết áp số 1. Kích hoạt tính năng đóng góp ý kiến (Suggesting Mode) để chỉnh sửa chéo nội dung lâm sàng, bình luận góp ý (Comments) tại từng dòng và theo dõi chặt chẽ lịch sử phiên bản (Version History) để tránh mất mát dữ liệu nghiên cứu.
                </p>
              </div>

              {/* Google Drive */}
              <div className="bg-white p-4 rounded-xl border border-slate-100 space-y-2 shadow-xs hover-lift">
                <span className="text-xs font-black text-indigo-950 uppercase tracking-wide block font-sans border-b border-slate-50 pb-1.5 flex items-center gap-1">
                  ☁️ Google Drive
                </span>
                <p className="text-xs text-slate-600 leading-relaxed text-justify font-semibold">
                  Khởi tạo không gian lưu trữ phân cấp khoa học cho dự án theo quy chuẩn đặt tên nhất quán. Thiết lập phân quyền truy cập thông minh cho các thành viên và kích hoạt xác thực hai yếu tố (2FA) bảo mật tuyệt đối để bảo vệ các tài liệu nghiên cứu y khoa quan trọng của nhóm.
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-2">
              <a
                href={GROUP_VIDEO_YOUTUBE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-rose-50 text-rose-900 border border-rose-100 text-[11px] font-bold hover:bg-rose-100 transition-colors"
              >
                ▶ Xem video sản phẩm trên YouTube
              </a>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4 bg-slate-50/70 p-5 border border-slate-100 rounded-2xl">
            <h6 className="text-xs font-black text-indigo-900 uppercase tracking-widest font-sans border-b border-indigo-100/50 pb-2">
              🌱 Sản phẩm Sáng tạo Truyền thông & Thiết kế Infographic Canva
            </h6>
            
            <div className="space-y-4">
              {/* Topic Intro */}
              <div className="bg-white p-4 rounded-xl border border-slate-100 space-y-2 shadow-xs">
                <span className="text-[10px] uppercase font-black text-indigo-600 tracking-wider font-sans">
                  Đề tài Infographic
                </span>
                <h5 className="text-slate-900 text-sm font-black font-sans leading-snug">
                  Cách viết prompt hiệu quả để xây dựng portfolio xin việc & thực tập
                </h5>
                <p className="text-slate-600 text-xs leading-relaxed text-justify font-semibold">
                  Mục tiêu: Thành thạo phối hợp sử dụng các công cụ AI tạo sinh (ChatGPT, DALL·E, và Canva AI) để tạo ra sản phẩm infographic chuyên nghiệp hướng dẫn viết prompt tối ưu cho portfolio sinh viên.
                </p>
              </div>

              {/* Prompt Comparison */}
              <div className="bg-white p-4 rounded-xl border border-slate-100 space-y-2.5 shadow-xs">
                <span className="text-xs font-black text-slate-800 uppercase tracking-wide block font-sans border-l-3 border-indigo-500 pl-2">
                  Quá trình thử nghiệm và cải tiến Prompt
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-150">
                    <span className="font-bold text-slate-800 block mb-1">ChatGPT (Tạo văn bản):</span>
                    <p className="text-slate-600 italic">Prompt ban đầu: "Viết nội dung infographic về cách viết prompt hiệu quả để xây dựng portfolio xin việc và thực tập, ngắn gọn, dễ hiểu..."</p>
                    <p className="text-slate-700 font-bold italic mt-1.5">Prompt cải tiến: "Tóm tắt nội dung về cách viết prompt thành các ý chính, dạng bullet, mỗi ý dưới 15 từ."</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-150">
                    <span className="font-bold text-slate-800 block mb-1">DALL·E (Tạo hình ảnh):</span>
                    <p className="text-slate-600 italic">Prompt ban đầu: "Flat illustration showing clear vs unclear prompt, modern style, minimal, blue tone..."</p>
                    <p className="text-slate-700 font-bold italic mt-1.5">Prompt cải tiến: "Split-screen illustration comparing vague prompt vs clear prompt, labeled, modern infographic style."</p>
                  </div>
                </div>
              </div>

              {/* AI Tool Matrix Table */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block font-sans">
                  Bảng so sánh kết quả giữa các công cụ AI:
                </span>
                <div className="overflow-x-auto rounded-xl border border-slate-200/50 bg-white">
                  <table className="w-full text-left border-collapse text-xs font-sans">
                    <thead>
                      <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200/60">
                        <th className="p-3">Công cụ AI</th>
                        <th className="p-3">Chức năng chính</th>
                        <th className="p-3">Ưu điểm</th>
                        <th className="p-3">Hạn chế</th>
                        <th className="p-3 text-center">Hiệu quả</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600 font-semibold">
                      <tr>
                        <td className="p-3 font-bold text-slate-900">ChatGPT</td>
                        <td className="p-3">Tạo nội dung văn bản</td>
                        <td className="p-3">Nhanh chóng, cấu trúc logic</td>
                        <td className="p-3">Dài dòng, cần chỉnh sửa thủ công</td>
                        <td className="p-3 text-center text-teal-600">Cao</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-slate-900">DALL·E</td>
                        <td className="p-3">Tạo hình ảnh minh họa</td>
                        <td className="p-3">Sáng tạo, trực quan sinh động</td>
                        <td className="p-3">Có thể lệch ý so với prompt ban đầu</td>
                        <td className="p-3 text-center text-teal-600">Trung bình–cao</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-slate-900">Canva AI</td>
                        <td className="p-3">Thiết kế bố cục</td>
                        <td className="p-3">Dễ sử dụng, giao diện kéo thả</td>
                        <td className="p-3">Nội dung và bố cục phụ thuộc input</td>
                        <td className="p-3 text-center text-teal-600">Cao</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Design Guidelines */}
              <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100/30 space-y-2">
                <span className="text-xs font-black text-indigo-900 uppercase tracking-wide block font-sans">
                  📐 Tiêu chuẩn Thiết kế Canva Infographic đã ứng dụng:
                </span>
                <ul className="text-xs text-slate-700 space-y-1.5 list-disc pl-4 font-semibold leading-relaxed">
                  <li><strong className="text-slate-900">Màu sắc (Color Palette):</strong> Sử dụng bảng màu xanh - trắng làm chủ đạo để thể hiện sự chuyên nghiệp, sạch sẽ và tối ưu hóa độ tương phản đọc.</li>
                  <li><strong className="text-slate-900">Trọng lượng thị giác (Visual Weight):</strong> Bố cục 3 phần cân đối (Khái niệm &rarr; Nguyên tắc &rarr; Ứng dụng portfolio), sử dụng danh sách dạng bullet dưới 15 từ giúp quét thông tin nhanh chóng.</li>
                  <li><strong className="text-slate-900">Vai trò của Con người (Human-in-the-loop):</strong> Kết hợp AI để phác thảo ý tưởng thô và sinh ảnh, con người trực tiếp hiệu đính câu chữ, căn chỉnh bố cục để đóng góp cá nhân sáng tạo &gt;50%.</li>
                </ul>
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-4 bg-slate-50/70 p-5 border border-slate-100 rounded-2xl">
            <h6 className="text-xs font-black text-indigo-900 uppercase tracking-widest font-sans border-b border-indigo-100/50 pb-2">
              ⚖️ Bộ nguyên tắc Đạo đức AI "7 Chữ Vàng" cho Dược sĩ Số tương lai
            </h6>
            
            {/* 7 Gold Principles Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { num: "1", title: "MINH BẠCH", en: "Transparency", desc: "Luôn chủ động khai báo trung thực và chi tiết mức độ can thiệp của bất kỳ công cụ AI nào trong mọi sản phẩm học tập hoặc báo cáo nghiên cứu." },
                { num: "2", title: "XÁC THỰC", en: "Verification", desc: "Không bao giờ tin tưởng tuyệt đối vào AI. Mọi dữ liệu liên quan đến cơ chế bệnh học, liều lượng thuốc bắt buộc phải đối soát chéo với PubMed, Cochrane." },
                { num: "3", title: "BẢO MẬT", en: "Privacy", desc: "Bảo vệ nghiêm ngặt quyền riêng tư của bệnh nhân. Tuyệt đối không tải thông tin cá nhân, hồ sơ bệnh án nhạy cảm lên các mô hình AI công cộng." },
                { num: "4", title: "CÔNG BẰNG", en: "Fairness", desc: "Không sử dụng AI để tạo ra lợi thế cạnh tranh không trung thực trong học tập, thi cử hoặc cố tình bóp méo, làm giả dữ liệu nghiên cứu khoa học." },
                { num: "5", title: "SÁNG TẠO", en: "Originality", desc: "Chỉ sử dụng AI như công cụ hỗ trợ gợi ý ý tưởng và cấu trúc thô. Nội dung cốt lõi, lập luận chuyên môn phải là sản phẩm chất xám của cá nhân." },
                { num: "6", title: "TRÁCH NHIỆM", en: "Accountability", desc: "Bản thân sinh viên chịu trách nhiệm cao nhất trước pháp luật, nhà trường và giảng viên về tính chính xác, tính hợp pháp của mọi thông tin do mình ký tên." },
                { num: "7", title: "HỌC HỎI LIÊN TỤC", en: "Continuous Learning", desc: "Chủ động cập nhật kiến thức mới về đạo đức công nghệ, các quy định pháp lý quốc gia và quy chế của ĐHQGHN liên quan đến trí tuệ nhân tạo." }
              ].map((rule) => (
                <div key={rule.num} className="bg-white p-4 rounded-xl border border-slate-100 space-y-1.5 shadow-xs hover-lift">
                  <div className="flex items-center gap-2">
                    <span className="w-5.5 h-5.5 rounded-lg bg-gradient-to-tr from-indigo-600 to-teal-500 flex items-center justify-center text-white text-[10px] font-black shrink-0">
                      {rule.num}
                    </span>
                    <span className="text-slate-900 text-xs font-black font-sans leading-tight">
                      {rule.title}
                    </span>
                  </div>
                  <span className="text-[9px] uppercase font-extrabold text-teal-600 tracking-wider block font-sans">
                    {rule.en}
                  </span>
                  <p className="text-[11px] text-slate-500 leading-relaxed text-justify font-semibold">
                    {rule.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Case Study alert */}
            <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl space-y-1 mt-2">
              <span className="text-[10px] uppercase font-black text-amber-800 tracking-wider block font-sans">
                ⚠️ Đối soát Ca lâm sàng & Thẩm định Báo cáo CT Scan Phổi bằng AI:
              </span>
              <p className="text-xs text-amber-950 font-semibold leading-relaxed text-justify">
                Đã ứng dụng kỹ thuật Prompt nâng cao trên Claude 3.5 Sonnet để tóm tắt bài báo chẩn đoán sớm ung thư phổi qua CT Scan liều thấp theo chuẩn IMRAD. Tiến hành đối soát chéo và phát hiện thành công lỗi ảo tưởng nghiêm trọng của AI (đảo ngược giá trị giữa tỷ lệ Dương tính giả và Âm tính giả trong phần bàn luận) cùng tính thiên vị chủng tộc của dữ liệu huấn luyện, bảo đảm tính xác thực khoa học tuyệt đối.
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen gradient-bg-elegant text-[#1f2937] relative overflow-hidden">
      {/* Fixed Background Image - Elegant, Lightweight & High Performance */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <img 
          src="/images/bg_nature.png" 
          alt="Positano Amalfi Coast Background" 
          className="w-full h-full object-cover opacity-20 dark:opacity-10 filter saturate-75"
        />
        {/* Soft color overlay to harmonize with the Indigo/Teal theme */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/40 via-white/80 to-teal-50/40 dark:from-slate-900/80 dark:via-slate-900/95 dark:to-slate-900/80" />
      </div>
      {/* 1. Top Dual Navigation Bar (Light Green) */}
      <div className="w-full bg-[#ecfdf5] dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs py-2 px-6 flex justify-between items-center z-50 border-b border-emerald-100 dark:border-emerald-900/30">
        <div className="flex gap-6 font-semibold">
          <a href="#gioi-thieu" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">{TRANSLATED_STRINGS[lang].intro}</a>
          <a href="#du-an" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">{TRANSLATED_STRINGS[lang].practicalExercises}</a>
          <a href="#tong-ket" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">{TRANSLATED_STRINGS[lang].summaryReflection}</a>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-bold hidden sm:inline">{TRANSLATED_STRINGS[lang].vnuUmp}</span>
          <span className="font-bold">{TRANSLATED_STRINGS[lang].studentIdLabel}</span>
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
            {TRANSLATED_STRINGS[lang].portfolioBrand}
          </span>
        </div>

        {/* Main categories center (Desktop) */}
        <nav className="hidden lg:flex items-center gap-6 font-sans">
          <a 
            href="#gioi-thieu" 
            onClick={() => handleMainNavClick('gioi-thieu')}
            className={`text-xs uppercase font-extrabold tracking-wide hover:text-emerald-600 transition-all ${
              currentSection === 'gioi-thieu' ? 'text-emerald-600 border-b-2 border-emerald-500 pb-1' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            {TRANSLATED_STRINGS[lang].intro}
          </a>
          {portfolioProjects.map((proj, idx) => (
            <button
              key={proj.id}
              onClick={() => navigateToLesson(idx)}
              className={`text-xs uppercase font-extrabold tracking-wide hover:text-emerald-600 transition-all cursor-pointer ${
                viewMode === 'dashboard' && activeTab === idx ? 'text-emerald-600 border-b-2 border-emerald-500 pb-1' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              {lang === 'en' ? `Lesson ${idx + 1}` : `Bài ${idx + 1}`}
            </button>
          ))}
        </nav>

        {/* Utilities right */}
        <div className="flex items-center gap-4">
          {/* Expandable Search box */}
          {showSearchBox && (
            <input
              type="text"
              placeholder={TRANSLATED_STRINGS[lang].searchPlaceholder}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (searchText.trim()) {
                    (window as any).find(searchText);
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
                (window as any).find(searchText);
              }
            }}
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-emerald-600 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
            aria-label="Search"
            title={TRANSLATED_STRINGS[lang].searchTooltip}
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Segmented VN | EN Language Toggle */}
          <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden h-8 bg-white dark:bg-slate-900 shadow-2xs">
            <button
              onClick={() => setLang('vi')}
              className={cn(
                "px-2.5 text-[10px] font-black h-full transition-all cursor-pointer flex items-center justify-center tracking-wider",
                lang === 'vi' 
                  ? "bg-emerald-600 text-white" 
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-850"
              )}
            >
              VN
            </button>
            <div className="w-[1px] h-4 bg-slate-200 dark:bg-slate-700" />
            <button
              onClick={() => setLang('en')}
              className={cn(
                "px-2.5 text-[10px] font-black h-full transition-all cursor-pointer flex items-center justify-center tracking-wider",
                lang === 'en' 
                  ? "bg-emerald-600 text-white" 
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-850"
              )}
            >
              EN
            </button>
          </div>

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
      </header>
      <div className="flex-1 min-w-0 flex flex-col relative z-10">

        {/* Mobile menu drawer overlay */}
        {menuOpen && (
          <div
            className="xl:hidden fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setMenuOpen(false)}
          />
        )}

        {/* Mobile menu drawer */}
        <div
          className={`xl:hidden fixed top-0 right-0 bottom-0 z-50 w-[80%] max-w-xs bg-white dark:bg-slate-900 shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            menuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full pt-16 px-6 pb-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-teal-500 flex items-center justify-center text-white font-extrabold text-xs shadow-md">
                  DS
                </span>
                <span className="text-indigo-900 dark:text-indigo-200 font-extrabold text-sm">PORTFOLIO</span>
              </div>
              <button 
                onClick={() => setMenuOpen(false)} 
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-300"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>
            
            <nav className="mt-6 flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => handleMainNavClick(link.id)}
                  className={`text-sm font-bold text-slate-700 dark:text-slate-200 py-3 border-b border-slate-50 dark:border-slate-700/50 flex items-center gap-2 ${
                    currentSection === link.id ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500/40' : ''
                  }`}
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-3 mt-2 border-t border-slate-100">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 block mb-2 px-1">
                  {TRANSLATED_STRINGS[lang].sixExercises}
                </span>
                {portfolioProjects.map((proj, idx) => (
                  <button
                    key={proj.id}
                    type="button"
                    onClick={() => navigateToLesson(idx)}
                    className={`w-full text-left text-xs font-bold py-2.5 px-2 rounded-lg mb-1 cursor-pointer ${
                      activeTab === idx ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    #bai-{idx + 1} · {proj.label.split(':')[0]}
                  </button>
                ))}
              </div>
            </nav>

            <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 space-y-2 bg-indigo-50/10 dark:bg-slate-800/30 p-4 rounded-xl">
              <p className="font-extrabold text-indigo-900 dark:text-indigo-300 text-xs uppercase tracking-wide">Bùi Cao Hoàn</p>
              <p className="font-semibold text-slate-600 dark:text-slate-300">{TRANSLATED_STRINGS[lang].vnuUmp}</p>
              <p className="text-indigo-600 dark:text-indigo-400 font-bold truncate">Gmail: 22100241@vnu.edu.vn</p>
            </div>
          </div>
        </div>

        {/* 3. Header Banner (Gedeon Richter Inspired Professional Banner) */}
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
                <Sparkles className="w-3.5 h-3.5" /> {TRANSLATED_STRINGS[lang].digitalCompetence}
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
                  {TRANSLATED_STRINGS[lang].majorLabel}
                </p>
                <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm md:text-base leading-relaxed font-semibold">
                  {TRANSLATED_STRINGS[lang].heroDesc}
                </p>
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <a
                  href="#du-an"
                  className="gradient-button text-white text-xs sm:text-sm font-bold px-6 py-3 rounded-xl transition-all shadow-md active:scale-95 inline-flex items-center gap-2"
                >
                  {TRANSLATED_STRINGS[lang].viewProjectsBtn} <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=22100241@vnu.edu.vn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="outline-button text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm font-bold px-6 py-3 rounded-xl transition-all shadow-xs inline-flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" /> {TRANSLATED_STRINGS[lang].contactGmailBtn}
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
                    alt={lang === 'en' ? "Bui Cao Hoan — Pharmacy Student" : "Bùi Cao Hoàn — Sinh viên Dược"}
                    className="w-full h-auto aspect-square object-cover rounded-2xl shadow-inner object-top filter brightness-102"
                  />
                  <div className="pt-3 text-center">
                    <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block font-sans">
                      {TRANSLATED_STRINGS[lang].avatarRole}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 block mt-0.5">
                      VNU-UMP 2026
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Page: Lời mở đầu (Giới thiệu) - Elegant colorful background */}
        <section id="gioi-thieu" className="py-16 sm:py-20 px-6 sm:px-10 md:px-16 max-w-5xl mx-auto w-full relative">
          <div className="text-center mb-12">
            <h3 className="academic-section-title uppercase">
              {TRANSLATED_STRINGS[lang].intro}
            </h3>
          </div>

          <PortfolioIntroMedia lang={lang} />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch relative z-10 mt-8">
            {/* Left side text intro */}
            <div className="md:col-span-7 space-y-5 flex flex-col justify-between">
              <div className="glass-panel dark:bg-slate-900/75 p-6 sm:p-8 rounded-3xl border border-indigo-100/30 dark:border-indigo-900/30 shadow-md space-y-4">
                <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed text-justify font-medium">
                  {TRANSLATED_STRINGS[lang].introPara1}
                </p>
                <p className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed text-justify font-medium pt-3 border-t border-slate-100 dark:border-slate-800/40">
                  <strong className="dark:text-white font-bold block mb-1">{TRANSLATED_STRINGS[lang].introGreeting}</strong>
                  {TRANSLATED_STRINGS[lang].introPara2}
                </p>
              </div>
              
              <div className="p-5 bg-gradient-to-r from-indigo-50/80 to-teal-50/80 dark:from-indigo-950/50 dark:to-teal-950/50 border border-indigo-100/50 dark:border-indigo-800/30 rounded-2xl space-y-2 shadow-xs">
                <span className="text-xs font-black text-indigo-900 dark:text-indigo-300 uppercase tracking-widest block font-sans">
                  {TRANSLATED_STRINGS[lang].portfolioGoalTitle}
                </span>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                  {TRANSLATED_STRINGS[lang].portfolioGoalDesc}
                </p>
              </div>
            </div>

            {/* Right side academic cards grid */}
            <div className="md:col-span-5 flex flex-col gap-4">
              {/* Profile Card 1 */}
              <div className="glass-panel hover-lift rounded-2xl p-5 border border-indigo-100/20 dark:border-indigo-950/30 dark:bg-slate-900/75 shadow-sm flex flex-col justify-between">
                <div className="flex items-center gap-3 text-indigo-900 dark:text-indigo-300 font-extrabold text-sm mb-2 font-sans">
                  <span className="w-8 h-8 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center shrink-0 shadow-inner">
                    <GraduationCap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </span>
                  {TRANSLATED_STRINGS[lang].selfMajorTitle}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  {TRANSLATED_STRINGS[lang].selfMajorDesc}
                </p>
              </div>

              {/* Profile Card 2 */}
              <div className="glass-panel hover-lift rounded-2xl p-5 border border-indigo-100/20 dark:border-indigo-950/30 dark:bg-slate-900/75 shadow-sm flex flex-col justify-between">
                <div className="flex items-center gap-3 text-indigo-900 dark:text-indigo-300 font-extrabold text-sm mb-2 font-sans">
                  <span className="w-8 h-8 rounded-xl bg-teal-500/10 dark:teal-500/20 flex items-center justify-center shrink-0 shadow-inner">
                    <Layers className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  </span>
                  {TRANSLATED_STRINGS[lang].fieldsOfInterestTitle}
                </div>
                <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium whitespace-pre-line">
                  {TRANSLATED_STRINGS[lang].fieldsOfInterestDesc}
                </div>
              </div>

              {/* Profile Card 3 */}
              <div className="glass-panel hover-lift rounded-2xl p-5 border border-indigo-100/20 dark:border-indigo-950/30 dark:bg-slate-900/75 shadow-sm flex flex-col justify-between">
                <div className="flex items-center gap-3 text-indigo-900 dark:text-indigo-300 font-extrabold text-sm mb-2 font-sans">
                  <span className="w-8 h-8 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center shrink-0 shadow-inner">
                    <CheckSquare className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </span>
                  {TRANSLATED_STRINGS[lang].coreSkillsTitle}
                </div>
                <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium whitespace-pre-line">
                  {TRANSLATED_STRINGS[lang].coreSkillsDesc}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 relative z-10">
            <RubricChecklist variant="portfolio" lang={lang} />
          </div>
        </section>

        {/* 5. Page: Bài tập thực hành (Dự án) - Transparent backdrop to show glowing orbs */}
        <section id="du-an" className="py-16 sm:py-20 px-4 sm:px-8 md:px-12 bg-transparent relative z-10">
          <div className="max-w-5xl mx-auto w-full">
            <div className="text-center mb-12">
              <h3 className="academic-section-title uppercase">
                {TRANSLATED_STRINGS[lang].practicalExercises}
              </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mt-3 font-semibold font-sans">
            {TRANSLATED_STRINGS[lang].practicalDesc}
          </p>
            </div>

            <div className="mb-8">
              <RubricProgressMap onGoToLesson={(idx) => navigateToLesson(idx)} lang={lang} />
            </div>

            {/* View Mode Switcher */}
            <div className="flex justify-center mb-8">
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-1.5 rounded-xl border border-slate-200/80 dark:border-slate-800 inline-flex items-center gap-1.5 shadow-xs">
                <button
                  onClick={() => {
                    setViewMode('gallery');
                    setDeepLinkStep(null);
                  }}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-colors cursor-pointer',
                    viewMode === 'gallery'
                      ? 'bg-indigo-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-indigo-700 hover:bg-slate-100/70 dark:text-slate-300 dark:hover:bg-slate-800',
                  )}
                >
                  <LayoutGrid className="w-4 h-4" />
                  {TRANSLATED_STRINGS[lang].galleryTitle}
                </button>
                <button
                  onClick={() => {
                    setViewMode('dashboard');
                    setTimeout(() => scrollToDashboardSection(), 100);
                  }}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-colors cursor-pointer',
                    viewMode === 'dashboard'
                      ? 'bg-indigo-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-indigo-700 hover:bg-slate-100/70 dark:text-slate-300 dark:hover:bg-slate-800',
                  )}
                >
                  <Columns className="w-4 h-4" />
                  {TRANSLATED_STRINGS[lang].dashboardTitle}
                </button>
              </div>
            </div>

            {viewMode === 'gallery' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {galleryFiles.map((file) => (
                  <Card
                    key={file.id}
                    className="hover-lift overflow-hidden flex flex-col justify-between h-full rounded-2xl border-slate-200/80 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-300"
                  >
                    <div>
                      {/* Preview Image with Hover zoom & detailed navigation */}
                      <div 
                        onClick={() => {
                          const idx = galleryFiles.indexOf(file);
                          if (idx !== -1) navigateToLesson(idx);
                        }}
                        className="h-44 w-full overflow-hidden bg-slate-100 relative group border-b border-emerald-50/20 cursor-pointer"
                      >
                        <img
                          src={file.previewUrl}
                          alt={file.title}
                          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="inline-flex items-center rounded-md border border-emerald-200/30 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wide text-emerald-800 shadow-xs">
                            {file.badge}
                          </span>
                        </div>
                        <div className="absolute inset-0 bg-emerald-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white text-xs font-bold bg-emerald-800/95 px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-md">
                            <Eye className="w-3.5 h-3.5" /> {TRANSLATED_STRINGS[lang].viewDetails}
                          </span>
                        </div>
                      </div>

                      {/* Card Content */}
                      <CardContent className="pt-5 space-y-2 px-5">
                        <CardTitle className="text-slate-900 dark:text-slate-100 text-sm font-black tracking-tight leading-tight">
                          {file.title}
                        </CardTitle>
                        
                        <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed text-justify font-semibold">
                          {file.description}
                        </p>
                      </CardContent>
                    </div>

                    {/* Card Actions */}
                    <CardFooter className="px-5 pb-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3 bg-slate-50/30 dark:bg-slate-900/10">
                      <Button
                        onClick={() => {
                          const idx = galleryFiles.indexOf(file);
                          if (idx !== -1) navigateToLesson(idx);
                        }}
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="px-2 text-xs text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 hover:bg-emerald-50/50"
                      >
                        <Eye className="w-3.5 h-3.5" /> {TRANSLATED_STRINGS[lang].viewDetails}
                      </Button>
                      
                      <a
                        href={file.fileUrl}
                        download={file.fileName}
                        className="text-[10px] uppercase font-black text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors flex items-center gap-1.5 font-sans"
                      >
                        <FileDown className="w-3.5 h-3.5" /> {TRANSLATED_STRINGS[lang].downloadOriginal}
                      </a>
                    </CardFooter>
                  </Card>
                ))}
              </div>) : (
              <div id="dashboard-view-container" className="scroll-mt-24 glass-panel rounded-3xl border border-indigo-100/30 shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[580px]">
                {/* Left Selector Sidebar */}
                <div className="w-full md:w-[260px] bg-slate-50/50 border-r border-indigo-100/20 flex flex-col shrink-0">
                  <div className="p-5 border-b border-indigo-100/20 bg-indigo-50/20">
                    <span className="text-xs font-black text-indigo-950 uppercase tracking-widest block font-sans">
                      {TRANSLATED_STRINGS[lang].lessonList}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-col p-3 gap-2">
                    {portfolioProjects.map((proj, idx) => (
                      <button
                        key={proj.id}
                        onClick={() => handleSidebarProjectClick(idx)}
                        className={cn('text-left w-full md:shrink flex items-center gap-3 px-3 py-3 rounded-lg text-xs font-bold transition-colors active:scale-[0.98]',
                          activeTab === idx
                            ? 'bg-indigo-700 text-white shadow-xs'
                            : 'text-slate-600 hover:text-indigo-700 hover:bg-white bg-white/40'
                        )}
                      >
                        <span className={`w-5.5 h-5.5 rounded-lg flex items-center justify-center text-[10px] font-extrabold shrink-0 ${
                          activeTab === idx ? 'bg-white text-indigo-700' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {idx + 1}
                        </span>
                        <span className="truncate font-sans">{proj.label.split(':')[0]}</span>
                        <ChevronRight className={`w-4 h-4 ml-auto hidden md:block ${
                          activeTab === idx ? 'opacity-100' : 'opacity-30'
                        }`} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Right Detail Pane - Max height and scrollable for clean dashboard styling */}
                <div 
                  id="dashboard-detail-pane"
                  className="flex-1 p-6 sm:p-8 md:p-10 flex flex-col justify-between bg-white relative md:max-h-[720px] overflow-y-auto custom-scrollbar"
                >
                  <div key={activeTab} id="lesson-print-area" className="space-y-6 animate-focus-zoom print:animate-none">
                    {/* Title of exercise & Autoscroll Controller */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-4 border-b border-slate-100">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[9px] uppercase font-black text-indigo-500 bg-indigo-50 px-2.5 py-1 rounded-full tracking-widest font-sans border border-indigo-100/50">
                            Bài Tập Số {activeTab + 1}
                          </span>
                          <span className="text-[9px] uppercase font-black text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full tracking-widest font-sans border border-teal-100/50">
                            Giáo Trình VNU-UMP
                          </span>
                          <span className="no-print text-[9px] font-mono text-slate-500 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200/80">
                            #bai-{activeTab + 1}
                            {deepLinkStep != null ? `-step-${deepLinkStep + 1}` : ''}
                          </span>
                        </div>
                        <h4 className="text-slate-900 text-xl sm:text-2xl font-black font-sans leading-tight">
                          {portfolioProjects[activeTab].fullName}
                        </h4>
                      </div>
                      
                      {/* Autoscroll Toggle & Speed Control Panel */}
                      <div
                        data-autoscroll-controls
                        className="shrink-0 flex flex-col gap-1.5 bg-slate-50 border border-slate-200/60 p-2 rounded-2xl shadow-2xs self-start sm:self-auto w-full sm:w-[220px]"
                      >
                        {/* Row 1: Play/Pause Button and Current Speed Display */}
                        <div className="flex items-center justify-between gap-2">
                          <button
                            onClick={() => setAutoScrollActive((active) => !active)}
                            className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer active:scale-95 flex-1 ${
                              autoScrollActive
                                ? 'bg-red-500 text-white shadow-xs animate-pulse'
                                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80'
                            }`}
                            title={autoScrollActive ? "Tạm dừng cuộn tự động" : "Bật cuộn tự động bài tập"}
                          >
                            {autoScrollActive ? (
                              <>
                                <Pause className="w-3 h-3 fill-current" />
                                Dừng cuộn
                              </>
                            ) : (
                              <>
                                <Play className="w-3 h-3 fill-current" />
                                Cuộn tự động
                              </>
                            )}
                          </button>
                          <span className="text-[10px] font-extrabold text-indigo-700 bg-indigo-50 border border-indigo-100/50 px-2.5 py-1.5 rounded-xl tracking-wider select-none shrink-0 min-w-[50px] text-center">
                            {autoScrollSpeed.toFixed(2)}x
                          </span>
                        </div>

                        {/* Row 2: Speed Controls - Slider with +/- */}
                        <div className="flex items-center gap-1.5 pt-1 border-t border-slate-200/40">
                          <button 
                            onClick={() => setAutoScrollSpeed(prev => Math.max(1, prev - 0.25))}
                            className="w-5 h-5 rounded-lg bg-white border border-slate-200/80 hover:bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-600 transition-all cursor-pointer active:scale-90"
                            title="Giảm tốc độ"
                          >
                            -
                          </button>
                          <input 
                            type="range"
                            min="1"
                            max="3"
                            step="0.25"
                            value={autoScrollSpeed}
                            onChange={(e) => setAutoScrollSpeed(parseFloat(e.target.value))}
                            className="flex-1 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                            style={{
                              background: `linear-gradient(to right, #4f46e5 0%, #4f46e5 ${((autoScrollSpeed - 1) / 2) * 100}%, #cbd5e1 ${((autoScrollSpeed - 1) / 2) * 100}%, #cbd5e1 100%)`
                            }}
                          />
                          <button 
                            onClick={() => setAutoScrollSpeed(prev => Math.min(3, prev + 0.25))}
                            className="w-5 h-5 rounded-lg bg-white border border-slate-200/80 hover:bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-600 transition-all cursor-pointer active:scale-90"
                            title="Tăng tốc độ"
                          >
                            +
                          </button>
                        </div>

                        {/* Row 3: Quick Speed Pills */}
                        <div className="flex justify-between items-center gap-1">
                          {[1, 1.25, 1.5, 2, 3].map((val) => (
                            <button
                              key={val}
                              onClick={() => setAutoScrollSpeed(val)}
                              className={`px-1 rounded-md py-0.5 text-[8px] font-black transition-all cursor-pointer flex-1 text-center ${
                                autoScrollSpeed === val
                                  ? 'bg-indigo-600 text-white shadow-xs'
                                  : 'bg-white hover:bg-slate-100 text-slate-500 border border-slate-200/50'
                              }`}
                            >
                              {val === 1 ? '1.0' : val === 2 ? '2.0' : val === 3 ? '3.0' : val}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <RubricChecklist
                      variant="lesson"
                      lessonIndex={activeTab}
                      lessonLabel={portfolioProjects[activeTab].label}
                      lang={lang}
                    />

                    <LessonMiniToc
                      lessonNumber={activeTab + 1}
                      steps={activeLessonSteps[activeTab] ?? []}
                      onJumpToStep={jumpToStep}
                      lang={lang}
                    />

                    {/* Core skills badges */}
                    {portfolioProjects[activeTab].skills && (
                      <div className="flex flex-wrap gap-2 pt-1 border-b border-slate-100 pb-4">
                        {portfolioProjects[activeTab].skills.map((skill, skillIdx) => (
                          <span key={skillIdx} className={getBadgeStyleClass(skillIdx)}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Objective (Mục tiêu) */}
                    <div className="space-y-2">
                      <h5 className="text-indigo-900 text-xs sm:text-sm font-extrabold uppercase tracking-wider flex items-center gap-2 font-sans">
                        <span className="w-1.5 h-3 bg-gradient-to-t from-indigo-600 to-teal-500 rounded-full inline-block" />
                        {TRANSLATED_STRINGS[lang].exerciseObjective}
                      </h5>
                      <p className="text-slate-700 text-xs sm:text-sm leading-relaxed text-justify font-medium">
                        {portfolioProjects[activeTab].objective}
                      </p>
                    </div>

                    {/* Detailed Summary (Tóm tắt quá trình thực hiện chuyên sâu) */}
                    {portfolioProjects[activeTab].detailedSummary && (
                      <div className="space-y-2 bg-gradient-to-r from-indigo-50/70 to-indigo-50/10 p-5 border-l-4 border-indigo-600 rounded-r-2xl shadow-xs">
                        <h5 className="text-indigo-900 text-xs sm:text-sm font-extrabold uppercase tracking-widest font-sans">
                          {TRANSLATED_STRINGS[lang].processSummary}
                        </h5>
                        <p className="text-slate-700 text-xs sm:text-sm leading-relaxed text-justify italic font-semibold">
                          "{portfolioProjects[activeTab].detailedSummary}"
                        </p>
                      </div>
                    )}

                    {/* Implementation Process (Quy trình thực hiện) */}
                    <div className="space-y-2">
                      <h5 className="text-indigo-900 text-xs sm:text-sm font-extrabold uppercase tracking-wider flex items-center gap-2 font-sans">
                        <span className="w-1.5 h-3 bg-gradient-to-t from-indigo-600 to-teal-500 rounded-full inline-block" />
                        {TRANSLATED_STRINGS[lang].detailedProcess}
                      </h5>
                      {renderDetailedProcess(activeTab)}
                    </div>

                    {/* Rubric Presentation Section */}
                    <div className="space-y-2 pt-1">
                      <h5 className="text-indigo-900 text-xs sm:text-sm font-extrabold uppercase tracking-wider flex items-center gap-2 font-sans">
                        <span className="w-1.5 h-3 bg-gradient-to-t from-indigo-600 to-teal-500 rounded-full inline-block" />
                        {TRANSLATED_STRINGS[lang].rubricPresentation}
                      </h5>
                      {renderRubricPresentation(activeTab)}
                      <LessonRubricSupplements tabIndex={activeTab} lang={lang} />
                    </div>

                    {/* Product Output Details */}
                    <div className="space-y-2 pt-1">
                      <h5 className="text-indigo-900 text-xs sm:text-sm font-extrabold uppercase tracking-wider flex items-center gap-2 font-sans">
                        <span className="w-1.5 h-3 bg-gradient-to-t from-indigo-600 to-teal-500 rounded-full inline-block" />
                        {TRANSLATED_STRINGS[lang].scientificOutput}
                      </h5>
                      <div className="flex items-start gap-3 text-xs sm:text-sm text-emerald-800 bg-emerald-50/80 p-4 rounded-xl border border-emerald-100/50 shadow-xs">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <div className="font-semibold">
                          <span className="font-black text-emerald-950">{TRANSLATED_STRINGS[lang].archived}</span> {portfolioProjects[activeTab].product}
                        </div>
                      </div>
                      {activeTab === 3 && (
                        <div className="mt-3">
                          <GroupDeliverablesMedia variant="full" lang={lang} />
                        </div>
                      )}
                    </div>


                  </div>

                  {/* Previous & Next Assignment navigation buttons for enhanced mobile UX (starting from Bài 2) */}
                  <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between gap-4 w-full flex-wrap sm:flex-nowrap">
                    {activeTab > 0 ? (
                      <button
                        onClick={() => navigateToLesson(activeTab - 1)}
                        className="flex items-center gap-2 px-4 py-3.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition-all border border-indigo-100/50 shadow-xs cursor-pointer active:scale-95 text-left max-w-full sm:max-w-[48%] w-full sm:w-auto"
                      >
                        <ChevronRight className="w-4.5 h-4.5 rotate-180 shrink-0 text-indigo-500 animate-pulse" />
                        <div className="truncate">
                          <span className="text-[9px] uppercase block tracking-widest text-indigo-400 font-black">{TRANSLATED_STRINGS[lang].previousLesson}</span>
                          {lang === 'en' ? 'Lesson' : 'Bài'} {activeTab}: {portfolioProjects[activeTab - 1].label.split(':')[1]?.trim() || portfolioProjects[activeTab - 1].label}
                        </div>
                      </button>
                    ) : (
                      <div className="hidden sm:block" /> /* Empty spacer for layout */
                    )}

                    {activeTab < 5 && (
                      <button
                        onClick={() => navigateToLesson(activeTab + 1)}
                        className="flex items-center gap-2 px-4 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-teal-500 text-white font-bold text-xs transition-all hover:shadow-md hover:shadow-indigo-200/50 cursor-pointer active:scale-95 text-left max-w-full sm:max-w-[48%] w-full sm:w-auto ml-auto"
                      >
                        <div className="truncate flex-1">
                          <span className="text-[9px] uppercase block tracking-widest text-teal-200 font-black">{TRANSLATED_STRINGS[lang].nextLesson}</span>
                          {lang === 'en' ? 'Lesson' : 'Bài'} {activeTab + 2}: {portfolioProjects[activeTab + 1].label.split(':')[1]?.trim() || portfolioProjects[activeTab + 1].label}
                        </div>
                        <ChevronRight className="w-4.5 h-4.5 shrink-0 text-white/90 animate-pulse" />
                      </button>
                    )}
                  </div>

                  {/* Call-to-action details */}
                  <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between flex-wrap gap-5 w-full">
                    <span className="text-[11px] text-slate-400 font-bold md:max-w-[40%] leading-relaxed">
                      {TRANSLATED_STRINGS[lang].footerMeta}
                    </span>
                    
                    <div className="no-print flex items-center gap-3 flex-wrap sm:flex-nowrap">
                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="outline-button text-slate-800 text-xs sm:text-sm font-bold px-5 py-3.5 rounded-xl shadow-xs transition-all inline-flex items-center gap-2 cursor-pointer"
                      >
                        <Printer className="w-4.5 h-4.5 text-indigo-600 shrink-0" />
                        {TRANSLATED_STRINGS[lang].printPdf}
                      </button>

                      {portfolioProjects[activeTab].fileUrl && (
                        <a
                          href={portfolioProjects[activeTab].fileUrl}
                          download={portfolioProjects[activeTab].fileName}
                          className="gradient-button text-white text-xs sm:text-sm font-bold px-6 py-3.5 rounded-xl transition-all inline-flex items-center gap-2 active:scale-95 cursor-pointer shadow-md"
                        >
                          <FileDown className="w-4.5 h-4.5 shrink-0" /> {TRANSLATED_STRINGS[lang].downloadReport} (.{portfolioProjects[activeTab].fileType})
                        </a>
                      )}

                      <button
                        onClick={() =>
                          window.open(
                            `https://mail.google.com/mail/?view=cm&fs=1&to=22100241@vnu.edu.vn&su=${lang === 'en' ? 'Discussion about' : 'Trao đổi về'}: ${portfolioProjects[activeTab].label}`,
                            '_blank'
                          )
                        }
                        className="outline-button text-indigo-700 text-xs sm:text-sm font-bold px-5 py-3.5 rounded-xl shadow-xs transition-all inline-flex items-center gap-2 cursor-pointer"
                      >
                        <Mail className="w-4.5 h-4.5 text-indigo-500 shrink-0" /> {TRANSLATED_STRINGS[lang].contactGmailBtn}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 6. Page: Tổng kết & Suy ngẫm - Elegant white layout with neon badges */}
        <section id="tong-ket" className="py-16 sm:py-20 px-6 sm:px-10 md:px-16 max-w-5xl mx-auto w-full relative z-10">
          <div className="text-center mb-12">
            <h3 className="academic-section-title uppercase">
              {TRANSLATED_STRINGS[lang].summaryTitle}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto mt-3 font-semibold font-sans">
              {TRANSLATED_STRINGS[lang].conclusionSub}
            </p>
          </div>

          <div className="mb-8 relative z-10">
            <RubricChecklist variant="summary" lang={lang} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            {/* Column 1: Gains */}
            <div className="glass-panel hover-lift rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700/50 space-y-4 flex flex-col justify-start">
              <div className="flex items-center gap-3 text-indigo-900 dark:text-indigo-200 font-extrabold text-sm border-b border-slate-100 dark:border-slate-700/50 pb-3 font-sans">
                <span className="w-8 h-8 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center shrink-0 shadow-inner">
                  <CheckSquare className="w-5 h-5 text-indigo-600" />
                </span>
                {TRANSLATED_STRINGS[lang].digitalSkillsAcquired}
              </div>
              <p className="text-[13px] sm:text-sm md:text-[14.5px] text-slate-600 dark:text-slate-300 leading-loose text-justify font-semibold">
                {TRANSLATED_STRINGS[lang].bottomGains}
              </p>
            </div>

            {/* Column 2: Self growth */}
            <div className="glass-panel hover-lift rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700/50 space-y-4 flex flex-col justify-start">
              <div className="flex items-center gap-3 text-indigo-900 dark:text-indigo-200 font-extrabold text-sm border-b border-slate-100 dark:border-slate-700/50 pb-3 font-sans">
                <span className="w-8 h-8 rounded-xl bg-teal-500/10 dark:teal-500/20 flex items-center justify-center shrink-0 shadow-inner">
                  <Layers className="w-5 h-5 text-teal-600" />
                </span>
                {TRANSLATED_STRINGS[lang].selfGrowth}
              </div>
              <p className="text-[13px] sm:text-sm md:text-[14.5px] text-slate-600 dark:text-slate-300 leading-loose text-justify font-semibold">
                {TRANSLATED_STRINGS[lang].bottomSelfGrowth}
              </p>
            </div>

            {/* Column 3: Challenges & Resolution */}
            <div className="glass-panel hover-lift rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700/50 space-y-4 flex flex-col justify-start">
              <div className="flex items-center gap-3 text-indigo-900 dark:text-indigo-200 font-extrabold text-sm border-b border-slate-100 dark:border-slate-700/50 pb-3 font-sans">
                <span className="w-8 h-8 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center shrink-0 shadow-inner">
                  <AlertTriangle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </span>
                {TRANSLATED_STRINGS[lang].ethicsChallenge}
              </div>
              <p className="text-[13px] sm:text-sm md:text-[14.5px] text-slate-600 dark:text-slate-300 leading-loose text-justify font-semibold">
                {TRANSLATED_STRINGS[lang].bottomEthics}
              </p>
            </div>
          </div>

          <SummaryRubricSupplement lang={lang} />

          {/* Action row at bottom of conclusion */}
          <div className="mt-12 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-950 p-8 rounded-3xl shadow-xl text-center space-y-4 relative overflow-hidden">
            {/* Background absolute glowing blob */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-teal-400/20 rounded-full blur-2xl animate-pulse" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl animate-pulse" />

            <span className="text-teal-400 text-xs font-black uppercase tracking-widest block font-sans">
              {TRANSLATED_STRINGS[lang].footerTitle}
            </span>
            <p className="text-indigo-100 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed font-semibold">
              {TRANSLATED_STRINGS[lang].footerDesc}
            </p>
            <div className="pt-3 flex justify-center gap-4 flex-wrap sm:flex-nowrap relative z-10">
              <a
                href="#du-an"
                className="gradient-button text-white text-xs font-bold px-6 py-3 rounded-full transition-all shadow-md active:scale-95"
              >
                {TRANSLATED_STRINGS[lang].exploreLessons}
              </a>
              <a
                href="#gioi-thieu"
                className="text-white hover:text-indigo-200 text-xs font-bold py-3 px-6 rounded-full transition-all border border-indigo-700/50 bg-indigo-900/40 backdrop-blur-xs"
              >
                {TRANSLATED_STRINGS[lang].backToTop}
              </a>
            </div>
          </div>
        </section>

        {/* 7. Academic Footer */}
        <footer className="bg-slate-950 border-t border-slate-900 py-12 px-6 text-center text-slate-400 relative z-10">
          <div className="max-w-5xl mx-auto space-y-4">
            <p className="text-sm font-black uppercase tracking-widest text-indigo-400 font-sans">
              {TRANSLATED_STRINGS[lang].footerName}
            </p>
            <p className="text-xs text-slate-400 font-semibold max-w-xl mx-auto font-sans">
              {TRANSLATED_STRINGS[lang].footerSchool}
            </p>
            <p className="text-xs text-slate-500 max-w-2xl mx-auto font-medium">
              VNU Gmail: <a href="https://mail.google.com/mail/?view=cm&fs=1&to=22100241@vnu.edu.vn" target="_blank" rel="noopener noreferrer" className="text-indigo-400 font-bold hover:underline">22100241@vnu.edu.vn</a> &nbsp;|&nbsp; {lang === 'en' ? 'Study Location' : 'Địa chỉ học tập'}: {TRANSLATED_STRINGS[lang].studentLocation}
            </p>
            <div className="pt-6 text-[10px] text-slate-600 border-t border-slate-900/60 max-w-xs mx-auto font-bold font-sans">
              {TRANSLATED_STRINGS[lang].footerCopyright}
            </div>
          </div>
        </footer>

        {/* 8. Fullscreen Lightbox Modal */}
        <button
          type="button"
          onClick={() => setQuickNavOpen(true)}
          className="quick-nav-fab no-print fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-teal-600 text-white text-xs font-black uppercase tracking-wide shadow-lg shadow-indigo-300/40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          aria-label={TRANSLATED_STRINGS[lang].openQuickNav}
        >
          <ListTree className="w-4 h-4" />
          <span className="hidden sm:inline">{TRANSLATED_STRINGS[lang].navigation}</span>
        </button>

        {linkCopied && (
          <div
            className="no-print fixed bottom-24 right-6 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-lg"
            role="status"
          >
            {TRANSLATED_STRINGS[lang].linkCopied}
          </div>
        )}

        <QuickNavDrawer
          open={quickNavOpen}
          onClose={() => setQuickNavOpen(false)}
          navLinks={navLinks}
          currentSection={currentSection}
          portfolioProjects={portfolioProjects}
          activeTab={activeTab}
          viewMode={viewMode}
          stepTexts={(activeLessonSteps[activeTab] ?? []).map((s) => s.text)}
          onSelectSection={(href) => {
            setMenuOpen(false);
            setQuickNavOpen(false);
            const sectionId = href.replace('#', '');
            handleMainNavClick(sectionId);
            window.location.hash = '';
            document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
          }}
          onSelectLesson={(idx) => navigateToLesson(idx)}
          onSelectView={(view) => {
            setViewMode(view);
            setDeepLinkStep(null);
            if (view === 'dashboard') setTimeout(() => scrollToDashboardSection(), 80);
          }}
          onJumpToStep={jumpToStep}
          onCopyLessonLink={copyLessonLink}
          lang={lang}
        />

        {selectedImage && (
          <div 
            className="fixed inset-0 z-50 bg-slate-950/98 backdrop-blur-md flex items-center justify-center p-4 transition-all duration-300"
            onClick={() => setSelectedImage(null)}
            role="dialog"
            aria-modal="true"
            aria-label="Xem ảnh minh chứng phóng to"
          >
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-xl p-2.5 transition-colors focus:outline-none z-55 cursor-pointer"
              aria-label="Close lightbox"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div 
              className="relative max-w-4xl w-full max-h-[85vh] flex flex-col items-center gap-4 animate-in fade-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={selectedImage} 
                alt="Evidence Fullscreen View" 
                className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl border border-white/10"
              />
              {(() => {
                const currentProj = portfolioProjects[activeTab];
                const imgIndex = currentProj.images ? currentProj.images.indexOf(selectedImage) : -1;
                const desc = (imgIndex !== -1 && currentProj.imageDescriptions) ? currentProj.imageDescriptions[imgIndex] : '';
                return desc ? (
                  <div className="bg-slate-900/80 text-white/95 text-xs sm:text-sm py-2.5 px-5 rounded-xl max-w-2xl text-center backdrop-blur-md shadow-md border border-white/5 font-semibold leading-relaxed">
                    {desc}
                  </div>
                ) : null;
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
