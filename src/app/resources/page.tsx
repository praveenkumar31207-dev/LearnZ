'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { ResourceCard } from '@/components/resources/ResourceCard';
import { CheatsheetViewerModal } from '@/components/resources/CheatsheetViewerModal';
import {
  Compass,
  Search,
  BookOpen,
  GraduationCap,
  Sparkles,
  Plus,
  Zap,
  Bookmark,
  FileText,
  Filter,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Building2,
  Award,
  Play,
  Code2,
  Terminal,
  BrainCircuit,
  Video,
  Globe,
  Star,
  TrendingUp,
  Target,
  Flame,
  BarChart3,
  Bot,
  Layers,
  ArrowRight,
  Clock,
  Trophy,
} from 'lucide-react';
import { LearningResource, CheatsheetItem, IGOTCourse } from '@/types';

// ─── Learner Track: Curated DSA & Coding Platform Data ─────────────────────
interface CodingPlatform {
  id: string;
  name: string;
  description: string;
  url: string;
  category: 'DSA Practice' | 'Interview Prep' | 'Full-Stack' | 'Roadmap' | 'Video Course' | 'Interactive';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  isFree: boolean;
  rating: number;
  highlights: string[];
  icon: string;
  color: string;
  tag?: string;
}

const codingPlatforms: CodingPlatform[] = [
  {
    id: 'cp-neetcode',
    name: 'NeetCode 150',
    description: 'The best-curated list of 150 LeetCode problems with visual video explanations organized by algorithmic patterns. Essential for FAANG interviews.',
    url: 'https://neetcode.io/roadmap',
    category: 'DSA Practice',
    difficulty: 'All Levels',
    isFree: true,
    rating: 4.99,
    highlights: ['150 curated problems', 'Visual roadmap', 'Python & C++ solutions', 'Pattern-based learning'],
    icon: '⚡',
    color: '#6366f1',
    tag: 'Most Recommended',
  },
  {
    id: 'cp-leetcode',
    name: 'LeetCode',
    description: 'Industry-standard platform with 3000+ problems, company-specific question sets, and weekly contests for competitive coding practice.',
    url: 'https://leetcode.com/problemset/',
    category: 'DSA Practice',
    difficulty: 'All Levels',
    isFree: true,
    rating: 4.95,
    highlights: ['3000+ problems', 'Company filters', 'Weekly contests', 'Discussion forums'],
    icon: '🔥',
    color: '#f97316',
    tag: 'Industry Standard',
  },
  {
    id: 'cp-striver',
    name: "Striver's A-Z DSA Sheet",
    description: '455 problems structured in a 3-month roadmap covering Arrays, Linked Lists, Graphs, DP, and Trees — trusted by millions of students in India.',
    url: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/',
    category: 'DSA Practice',
    difficulty: 'Beginner',
    isFree: true,
    rating: 4.97,
    highlights: ['455 handpicked problems', '3-month roadmap', 'Video explanations', 'C++ & Java focus'],
    icon: '📋',
    color: '#10b981',
    tag: '#1 in India',
  },
  {
    id: 'cp-mit-algo',
    name: 'MIT 6.006 Algorithms',
    description: 'World-class lecture series by Prof. Erik Demaine covering sorting, graph algorithms, dynamic programming, and computational complexity theory.',
    url: 'https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/',
    category: 'Video Course',
    difficulty: 'Advanced',
    isFree: true,
    rating: 4.99,
    highlights: ['Free MIT course', 'Prof. Erik Demaine', 'Rigorous theory', 'Problem sets included'],
    icon: '🎓',
    color: '#8b5cf6',
    tag: 'University Level',
  },
  {
    id: 'cp-codeforces',
    name: 'Codeforces',
    description: 'Competitive programming platform with Div 1–3 rated contests, problem archives, and educational rounds for sharpening speed and accuracy.',
    url: 'https://codeforces.com',
    category: 'DSA Practice',
    difficulty: 'Advanced',
    isFree: true,
    rating: 4.92,
    highlights: ['Rated contests', 'Problem archives', 'Virtual contests', 'Educational rounds'],
    icon: '⚔️',
    color: '#ef4444',
    tag: 'Competitive',
  },
  {
    id: 'cp-cs50',
    name: 'Harvard CS50x',
    description: 'Harvard\'s iconic intro to computer science: C, Python, SQL, Flask, and web development. The perfect foundation for aspiring developers.',
    url: 'https://cs50.harvard.edu/x/',
    category: 'Video Course',
    difficulty: 'Beginner',
    isFree: true,
    rating: 4.98,
    highlights: ['Harvard quality', 'Free certificate', 'C & Python', 'Project-based'],
    icon: '🏛️',
    color: '#0ea5e9',
    tag: 'Beginner Friendly',
  },
  {
    id: 'cp-roadmapsh',
    name: 'roadmap.sh',
    description: 'Interactive developer roadmaps for Frontend, Backend, Full-Stack, DSA, DevOps, and more. Community-driven with step-by-step resource links.',
    url: 'https://roadmap.sh/computer-science',
    category: 'Roadmap',
    difficulty: 'All Levels',
    isFree: true,
    rating: 4.93,
    highlights: ['Visual roadmaps', 'Community content', 'Multiple tracks', 'Free forever'],
    icon: '🗺️',
    color: '#f59e0b',
  },
  {
    id: 'cp-fcc',
    name: 'freeCodeCamp',
    description: '3000+ hours of free curriculum covering Responsive Web Design, JavaScript Algorithms, React, Python, and Data Analysis with certifications.',
    url: 'https://www.freecodecamp.org',
    category: 'Interactive',
    difficulty: 'Beginner',
    isFree: true,
    rating: 4.9,
    highlights: ['3000+ hours content', 'Free certifications', 'JavaScript & Python', 'Project portfolio'],
    icon: '🔥',
    color: '#22c55e',
  },
  {
    id: 'cp-totalts',
    name: 'Total TypeScript',
    description: 'Definitive interactive TypeScript learning by Matt Pocock. Covers type narrowing, generic patterns, utility types, and React type patterns.',
    url: 'https://www.totaltypescript.com',
    category: 'Interactive',
    difficulty: 'Intermediate',
    isFree: true,
    rating: 4.94,
    highlights: ['Interactive exercises', 'Advanced generics', 'Free workshops', 'Matt Pocock\'s work'],
    icon: '💙',
    color: '#3b82f6',
  },
  {
    id: 'cp-system-design',
    name: 'System Design Primer',
    description: 'GitHub\'s most-starred system design guide. Covers distributed systems, CAP theorem, load balancing, caching, and FAANG-level design interviews.',
    url: 'https://github.com/donnemartin/system-design-primer',
    category: 'Interview Prep',
    difficulty: 'Advanced',
    isFree: true,
    rating: 4.96,
    highlights: ['200k+ GitHub stars', 'FAANG-level depth', 'Anki flashcards', 'Scalability patterns'],
    icon: '⚙️',
    color: '#6b7280',
    tag: 'System Design',
  },
  {
    id: 'cp-codewars',
    name: 'Codewars',
    description: 'Gamified kata-based coding challenges in 50+ languages. Earn ranks (kyu to dan) while solving bite-sized algorithmic challenges daily.',
    url: 'https://www.codewars.com',
    category: 'DSA Practice',
    difficulty: 'All Levels',
    isFree: true,
    rating: 4.8,
    highlights: ['50+ languages', 'Kata system', 'Community solutions', 'Daily challenges'],
    icon: '⚔️',
    color: '#b45309',
  },
  {
    id: 'cp-excalidraw',
    name: 'Excalidraw + AlgoViz',
    description: 'Visualize BST rotations, graph traversals, DP tables, and sorting algorithms with interactive animations on VisuAlgo and Algorithm Visualizer.',
    url: 'https://visualgo.net/en',
    category: 'Interactive',
    difficulty: 'All Levels',
    isFree: true,
    rating: 4.88,
    highlights: ['Visual animations', 'Step-by-step trace', 'Graph algorithms', 'Free forever'],
    icon: '🎨',
    color: '#ec4899',
    tag: 'Visual Learning',
  },
];

const categoryColors: Record<string, string> = {
  'DSA Practice': 'bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
  'Interview Prep': 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800',
  'Full-Stack': 'bg-violet-100 dark:bg-violet-950 text-violet-800 dark:text-violet-300 border-violet-200 dark:border-violet-800',
  'Roadmap': 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  'Video Course': 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  'Interactive': 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
};

export default function ResourcesPage() {
  const {
    userTrack,
    igotCourses,
    enrolInCourse,
    updateCourseProgress,
    learningResources,
    allTopics,
    subjects,
    addResource,
    bookmarkedResourceIds,
    cheatsheets,
  } = useAppStore();

  const isLearnerTrack = userTrack === 'learner';

  const [activeTab, setActiveTab] = useState<'platforms' | 'dsa' | 'fullstack' | 'cheatsheets'>(
    isLearnerTrack ? 'platforms' : 'igot' as any
  );
  const [karmayogiTab, setKarmayogiTab] = useState<'igot' | 'nssta' | 'cheatsheets'>('igot');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [activeCheatsheet, setActiveCheatsheet] = useState<CheatsheetItem | null>(null);
  const [filterDomain, setFilterDomain] = useState<string>('all');

  // Filter coding platforms for learner track
  const filteredPlatforms = codingPlatforms.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = filterCategory === 'all' || p.category === filterCategory;
    if (activeTab === 'dsa') return matchesSearch && matchesCat && ['DSA Practice', 'Interview Prep'].includes(p.category);
    if (activeTab === 'fullstack') return matchesSearch && matchesCat && ['Full-Stack', 'Interactive', 'Video Course', 'Roadmap'].includes(p.category);
    return matchesSearch && matchesCat;
  });

  // Filter iGOT courses for karmayogi track
  const filteredIgot = igotCourses.filter((c) => {
    const matchesSearch =
      c.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.targetedSkill.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDomain = filterDomain === 'all' || c.competencyDomain === filterDomain;
    const matchesTab =
      karmayogiTab === 'igot'
        ? true
        : karmayogiTab === 'nssta'
        ? c.isNsstaRecommended || c.provider.includes('NSSTA')
        : true;
    return matchesSearch && matchesDomain && matchesTab;
  });

  const handleOpenCheatsheet = (res: LearningResource) => {
    if (res.cheatsheetData) {
      setActiveCheatsheet(res.cheatsheetData);
    } else {
      setActiveCheatsheet(cheatsheets[0]);
    }
  };

  // ── LEARNER TRACK RENDER ────────────────────────────────────────────────────
  if (isLearnerTrack) {
    return (
      <div className="space-y-7 animate-in fade-in duration-300">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1">
                <Code2 className="w-3 h-3" />
                Curated for Coding & DSA Mastery
              </span>
              <span className="text-xs text-slate-400">All resources are 100% free</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white mt-1 flex items-center gap-2.5">
              <BookOpen className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
              Coding, DSA & Interview Resource Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              AI-curated platforms, roadmaps, and practice tools for software engineering mastery
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 self-start sm:self-center">
            <button
              onClick={() => setActiveTab('platforms')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'platforms'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              All Platforms
            </button>
            <button
              onClick={() => setActiveTab('dsa')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                activeTab === 'dsa'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>DSA & Interviews</span>
            </button>
            <button
              onClick={() => setActiveTab('fullstack')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                activeTab === 'fullstack'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Dev & Full-Stack</span>
            </button>
            <button
              onClick={() => setActiveTab('cheatsheets')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                activeTab === 'cheatsheets'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Cheatsheets</span>
            </button>
          </div>
        </div>

        {/* Hero Learning Path Banner */}
        {(activeTab === 'platforms' || activeTab === 'dsa') && (
          <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900 via-violet-950 to-slate-900 text-white shadow-lg space-y-4 border border-indigo-800/60">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center text-2xl shrink-0">
                  ⚡
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-white">
                    Recommended Learning Path: Software Engineering & DSA
                  </h3>
                  <p className="text-xs text-indigo-200/80">
                    Follow this AI-recommended sequence for FAANG interview readiness in 3–6 months
                  </p>
                </div>
              </div>
              <a
                href="https://roadmap.sh/computer-science"
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all"
              >
                <Globe className="w-3.5 h-3.5" />
                View Full Roadmap
              </a>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { step: '01', label: 'CS Fundamentals', desc: 'CS50 Harvard', color: 'from-blue-500/20 to-blue-600/10' },
                { step: '02', label: 'DSA Patterns', desc: 'Striver A-Z → NeetCode 150', color: 'from-emerald-500/20 to-emerald-600/10' },
                { step: '03', label: 'Mock Interviews', desc: 'LeetCode + Codeforces', color: 'from-amber-500/20 to-amber-600/10' },
                { step: '04', label: 'System Design', desc: 'System Design Primer', color: 'from-rose-500/20 to-rose-600/10' },
              ].map((s) => (
                <div key={s.step} className={`p-3 rounded-2xl bg-gradient-to-br ${s.color} border border-white/10`}>
                  <span className="text-[10px] font-black text-white/50 block">PHASE {s.step}</span>
                  <span className="text-xs font-bold text-white block mt-0.5">{s.label}</span>
                  <span className="text-[10px] text-white/60">{s.desc}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search & Filter Bar */}
        {activeTab !== 'cheatsheets' && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search platform, language, or topic..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-xs"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 shrink-0">Category:</span>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 shadow-xs"
              >
                <option value="all">All Types</option>
                <option value="DSA Practice">DSA Practice</option>
                <option value="Interview Prep">Interview Prep</option>
                <option value="Video Course">Video Course</option>
                <option value="Roadmap">Roadmap</option>
                <option value="Interactive">Interactive</option>
              </select>
            </div>
          </div>
        )}

        {/* Platform Cards Grid */}
        {activeTab !== 'cheatsheets' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPlatforms.length === 0 ? (
              <div className="col-span-full p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <Code2 className="w-10 h-10 text-slate-400 mx-auto opacity-70" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">No matching resources</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">Try clearing your search or changing the category filter.</p>
              </div>
            ) : (
              filteredPlatforms.map((platform) => (
                <div
                  key={platform.id}
                  className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0 shadow-sm"
                          style={{ backgroundColor: `${platform.color}20`, border: `1.5px solid ${platform.color}40` }}
                        >
                          {platform.icon}
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors">
                            {platform.name}
                          </h3>
                          {platform.tag && (
                            <span
                              className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full"
                              style={{ backgroundColor: `${platform.color}20`, color: platform.color }}
                            >
                              {platform.tag}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${categoryColors[platform.category]}`}>
                          {platform.category}
                        </span>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-amber-600">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          {platform.rating}
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                      {platform.description}
                    </p>

                    {/* Highlights */}
                    <div className="flex flex-wrap gap-1.5">
                      {platform.highlights.map((h, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                        >
                          {h}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                      <span className="flex items-center gap-1 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                        {platform.isFree ? '100% Free' : 'Freemium'}
                      </span>
                      <span className="font-semibold">{platform.difficulty}</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <a
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-2xl text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5 hover:opacity-90 hover:scale-[1.01]"
                    style={{ backgroundColor: platform.color }}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open {platform.name} →</span>
                  </a>
                </div>
              ))
            )}
          </div>
        )}

        {/* Cheatsheets Tab */}
        {activeTab === 'cheatsheets' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* DSA Cheatsheet Cards */}
              {[
                {
                  id: 'dsa-big-o',
                  title: 'Big-O Complexity Cheatsheet',
                  category: 'DSA Theory',
                  summary: 'Time & space complexities for all major algorithms: sorting, searching, graph traversal, and DP.',
                  formulas: 4,
                  url: 'https://www.bigocheatsheet.com',
                  color: '#6366f1',
                },
                {
                  id: 'dsa-patterns',
                  title: 'Algorithmic Pattern Recognition Guide',
                  category: 'Problem Solving',
                  summary: '14 core patterns: Two Pointer, Sliding Window, BFS/DFS, Monotonic Stack, Union-Find, Segment Tree.',
                  formulas: 14,
                  url: 'https://neetcode.io/roadmap',
                  color: '#10b981',
                },
                {
                  id: 'ds-cheat',
                  title: 'Data Structures Quick Reference',
                  category: 'DSA Theory',
                  summary: 'Array, Linked List, Stack, Queue, Heap, Trie, Graph — operations, use cases, and implementation snippets.',
                  formulas: 8,
                  url: 'https://visualgo.net',
                  color: '#f59e0b',
                },
                {
                  id: 'git-cheat',
                  title: 'Git & GitHub Workflow Cheatsheet',
                  category: 'DevOps',
                  summary: 'Essential commands for branching, rebasing, merge conflict resolution, and GitHub Actions CI/CD.',
                  formulas: 5,
                  url: 'https://education.github.com/git-cheat-sheet-education.pdf',
                  color: '#8b5cf6',
                },
                {
                  id: 'react-cheat',
                  title: 'React & Next.js Hooks Reference',
                  category: 'Full-Stack',
                  summary: 'useState, useEffect, useRef, useCallback, useMemo, useContext — with practical examples and anti-patterns.',
                  formulas: 7,
                  url: 'https://react.dev',
                  color: '#0ea5e9',
                },
                {
                  id: 'ts-cheat',
                  title: 'TypeScript Type Gymnastics Reference',
                  category: 'Full-Stack',
                  summary: 'Generics, conditional types, mapped types, template literal types, utility types and real-world patterns.',
                  formulas: 6,
                  url: 'https://www.totaltypescript.com',
                  color: '#3b82f6',
                },
              ].map((cs) => (
                <a
                  key={cs.id}
                  href={cs.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md space-y-3 cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-slate-400">{cs.category}</span>
                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                      <ExternalLink className="w-3 h-3" /> Open Sheet
                    </span>
                  </div>
                  <h3
                    className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors"
                  >
                    {cs.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2">{cs.summary}</p>
                  <div
                    className="text-[11px] font-semibold pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1"
                    style={{ color: cs.color }}
                  >
                    <Zap className="w-3 h-3" />
                    {cs.formulas} Key Concepts
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Cheatsheet Viewer Modal for stats cheatsheets */}
        {activeCheatsheet && (
          <CheatsheetViewerModal
            cheatsheet={activeCheatsheet}
            onClose={() => setActiveCheatsheet(null)}
          />
        )}
      </div>
    );
  }

  // ── KARMAYOGI TRACK RENDER ──────────────────────────────────────────────────
  return (
    <div className="space-y-7 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-700 dark:text-blue-400" />
              Integrated with iGOT Karmayogi Ecosystem
            </span>
            <span className="text-xs text-slate-400">NSSTA TPAC Accredited</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white mt-1 flex items-center gap-2.5">
            <BookOpen className="w-7 h-7 text-blue-700 dark:text-blue-400" />
            iGOT Karmayogi Learning Repository
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            AI-recommended training programmes, Mission Karmayogi accredited modules, and NSSTA operational guidelines
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 self-start sm:self-center">
          <button
            onClick={() => setKarmayogiTab('igot')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              karmayogiTab === 'igot'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Recommended iGOT Courses
          </button>
          <button
            onClick={() => setKarmayogiTab('nssta')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
              karmayogiTab === 'nssta'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>NSSTA TPAC Programmes</span>
          </button>
          <button
            onClick={() => setKarmayogiTab('cheatsheets')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
              karmayogiTab === 'cheatsheets'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Formulas & Manuals</span>
          </button>
        </div>
      </div>

      {/* iGOT Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white shadow-lg space-y-3 border border-blue-800/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white text-blue-900 flex items-center justify-center font-black text-xl shadow-md shrink-0">
              🇮🇳
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-white">
                Mission Karmayogi • National Programme for Civil Services Capacity Building
              </h3>
              <p className="text-xs text-blue-200/80">
                All training modules below are mapped to the Competency Dictionary for Indian Statistical Personnel.
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 shrink-0">
            ✓ Architecture-Ready Live API Layer
          </span>
        </div>
      </div>

      {/* Search & Domain Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search iGOT course, targeted competency, or provider..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-xs"
          />
        </div>

        {karmayogiTab !== 'cheatsheets' && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 shrink-0">
              Competency Domain:
            </span>
            <select
              value={filterDomain}
              onChange={(e) => setFilterDomain(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 shadow-xs"
            >
              <option value="all">All 4 Domains</option>
              <option value="Statistical Competencies">Statistical Competencies</option>
              <option value="Technical Competencies">Technical Competencies</option>
              <option value="Digital Governance">Digital Governance</option>
              <option value="Behavioural & Managerial Competencies">Behavioural & Managerial</option>
            </select>
          </div>
        )}
      </div>

      {/* iGOT Course Cards Grid */}
      {karmayogiTab !== 'cheatsheets' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIgot.length === 0 ? (
            <div className="col-span-full p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <BookOpen className="w-10 h-10 text-slate-400 mx-auto opacity-70" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">No matching courses</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try switching domains or resetting your search filter.
              </p>
            </div>
          ) : (
            filteredIgot.map((course) => (
              <div
                key={course.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                      {course.provider}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        course.priority === 'Critical'
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {course.priority} Priority
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Targeted: {course.targetedSkill}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1 leading-snug">
                      {course.courseName}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                    {course.description}
                  </p>

                  <div className="text-[11px] p-2.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 text-blue-900 dark:text-blue-200 border border-blue-100 dark:border-blue-900/50">
                    <span className="font-bold">AI Reason: </span>
                    {course.reasonRecommended}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-500 pt-1 font-medium">
                    <span>⏱ {course.durationHours} Hours</span>
                    <span>•</span>
                    <span>📈 {course.difficulty}</span>
                    <span>•</span>
                    <span>⭐ {course.rating} / 5.0</span>
                  </div>

                  {course.completionStatus !== 'Not Started' && (
                    <div className="space-y-1 pt-1">
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span className="text-emerald-600 dark:text-emerald-400">
                          {course.completionStatus}
                        </span>
                        <span className="text-slate-500">{course.progressPercentage}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                          style={{ width: `${course.progressPercentage}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  {course.completionStatus === 'Not Started' ? (
                    <button
                      onClick={() => enrolInCourse(course.id)}
                      className="w-full py-2.5 rounded-2xl bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold shadow-sm shadow-blue-700/25 transition-all flex items-center justify-center gap-1.5"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Enrol via iGOT Karmayogi</span>
                    </button>
                  ) : course.completionStatus === 'In Progress' ? (
                    <div className="w-full flex items-center gap-2">
                      <button
                        onClick={() => updateCourseProgress(course.id, course.progressPercentage + 25)}
                        className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all"
                      >
                        +25% Progress
                      </button>
                      <button
                        onClick={() => updateCourseProgress(course.id, 100)}
                        className="px-3 py-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold border border-blue-200"
                      >
                        Certify 🎓
                      </button>
                    </div>
                  ) : (
                    <div className="w-full py-2 px-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Completed & Certified
                      </span>
                      <span className="text-[10px] underline">View Certificate</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Cheatsheets Tab for Karmayogi */}
      {karmayogiTab === 'cheatsheets' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cheatsheets.map((cs) => (
            <div
              key={cs.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-blue-300 space-y-3 cursor-pointer transition-all"
              onClick={() => setActiveCheatsheet(cs)}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-slate-400">{cs.category}</span>
                <span className="text-[10px] font-bold text-blue-600 underline">Open Sheet ⚡</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">{cs.title}</h3>
              <p className="text-xs text-slate-500 line-clamp-2">{cs.summary}</p>
              <div className="text-[11px] text-blue-700 dark:text-blue-400 font-semibold pt-2 border-t border-slate-100 dark:border-slate-800">
                {cs.keyFormulas?.length || 3} Core Formulas Included
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cheatsheet Viewer Modal */}
      {activeCheatsheet && (
        <CheatsheetViewerModal
          cheatsheet={activeCheatsheet}
          onClose={() => setActiveCheatsheet(null)}
        />
      )}
    </div>
  );
}
