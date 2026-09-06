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
} from 'lucide-react';
import { LearningResource, CheatsheetItem, IGOTCourse } from '@/types';

export default function ResourcesPage() {
  const {
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

  const [activeTab, setActiveTab] = useState<'igot' | 'nssta' | 'cheatsheets' | 'all'>('igot');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDomain, setFilterDomain] = useState<string>('all');
  const [activeCheatsheet, setActiveCheatsheet] = useState<CheatsheetItem | null>(null);

  // Filter iGOT Courses
  const filteredIgot = igotCourses.filter((c) => {
    const matchesSearch =
      c.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.targetedSkill.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.provider.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDomain = filterDomain === 'all' || c.competencyDomain === filterDomain;
    const matchesTab =
      activeTab === 'igot'
        ? true
        : activeTab === 'nssta'
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
            onClick={() => setActiveTab('igot')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'igot'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Recommended iGOT Courses
          </button>
          <button
            onClick={() => setActiveTab('nssta')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
              activeTab === 'nssta'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>NSSTA TPAC Programmes</span>
          </button>
          <button
            onClick={() => setActiveTab('cheatsheets')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
              activeTab === 'cheatsheets'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Formulas & Manuals</span>
          </button>
        </div>
      </div>

      {/* Sourced through iGOT Ecosystem Banner */}
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
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 shadow-xs"
          />
        </div>

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
      </div>

      {/* Course Cards Grid */}
      {activeTab !== 'cheatsheets' && (
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
                  {/* Badge & Provider */}
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

                  {/* Progress bar if enrolled */}
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

                {/* Enrol / Continue Button */}
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

      {/* Cheatsheets Tab */}
      {activeTab === 'cheatsheets' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cheatsheets.map((cs) => (
            <div
              key={cs.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-blue-300 space-y-3 cursor-pointer"
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
