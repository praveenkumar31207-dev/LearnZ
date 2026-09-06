'use client';

import React from 'react';
import {
  Check,
  X,
  Sparkles,
  Zap,
  RotateCcw,
  Bot,
  Layers,
  Target,
  Smartphone,
  ShieldCheck,
} from 'lucide-react';

const COMPARISON_ROWS = [
  {
    feature: 'Continuous Dynamic Rescheduling (Auto-Fix on Missed Sessions)',
    cogniStudy: true,
    staticCalendars: false,
    notionSpreadsheets: false,
    ankiFlashcards: false,
  },
  {
    feature: 'Spaced Repetition Intervals (1d, 3d, 7d, 14d, 30d Ebbinghaus Curve)',
    cogniStudy: true,
    staticCalendars: false,
    notionSpreadsheets: false,
    ankiFlashcards: true,
  },
  {
    feature: 'Socratic AI Mentors (First-Principles Reasoning & Code Guidance)',
    cogniStudy: true,
    staticCalendars: false,
    notionSpreadsheets: false,
    ankiFlashcards: false,
  },
  {
    feature: 'Hierarchical Syllabus Breakdown & Exam Weightage % Tracking',
    cogniStudy: true,
    staticCalendars: false,
    notionSpreadsheets: 'Manual',
    ankiFlashcards: false,
  },
  {
    feature: 'Exam War-Room & High-Yield Priority Countdown Strategy',
    cogniStudy: true,
    staticCalendars: false,
    notionSpreadsheets: false,
    ankiFlashcards: false,
  },
  {
    feature: 'Integrated Pomodoro & Continuous Flow Study Timer',
    cogniStudy: true,
    staticCalendars: false,
    notionSpreadsheets: false,
    ankiFlashcards: false,
  },
  {
    feature: 'Offline Support & Installable Native-Feel PWA',
    cogniStudy: true,
    staticCalendars: true,
    notionSpreadsheets: false,
    ankiFlashcards: true,
  },
  {
    feature: 'Zero Subscription Paywalls (100% Free Open Architecture)',
    cogniStudy: true,
    staticCalendars: true,
    notionSpreadsheets: 'Freemium',
    ankiFlashcards: 'Freemium',
  },
];

export const ComparisonSection: React.FC = () => {
  return (
    <section id="compare" className="py-24 relative bg-slate-900/40 border-y border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" />
            Competitive Breakdown
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Why CogniStudy Outperforms Traditional Tools
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Stop stitching together 5 separate disjointed tools. See how CogniStudy creates an unbroken cognitive feedback loop that replaces static planners and fragmented flashcards.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="max-w-5xl mx-auto overflow-x-auto rounded-3xl border border-slate-800 bg-slate-950/90 shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/70">
                <th className="p-4 sm:p-5 text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Academic Capability
                </th>
                <th className="p-4 sm:p-5 text-xs font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-teal-300 uppercase tracking-wider bg-indigo-950/40 border-x border-indigo-500/30">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-teal-400" />
                    <span>CogniStudy AI</span>
                  </div>
                </th>
                <th className="p-4 sm:p-5 text-xs font-bold text-slate-400 uppercase tracking-wider hidden sm:table-cell">
                  Google / Apple Cal
                </th>
                <th className="p-4 sm:p-5 text-xs font-bold text-slate-400 uppercase tracking-wider hidden md:table-cell">
                  Notion / Sheets
                </th>
                <th className="p-4 sm:p-5 text-xs font-bold text-slate-400 uppercase tracking-wider hidden lg:table-cell">
                  Anki / Flashcards
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {COMPARISON_ROWS.map((row, idx) => (
                <tr
                  key={idx}
                  className={`hover:bg-slate-900/40 transition-colors ${
                    idx % 2 === 0 ? 'bg-slate-950/30' : 'bg-transparent'
                  }`}
                >
                  <td className="p-4 sm:p-5 font-semibold text-slate-200">
                    {row.feature}
                  </td>

                  {/* CogniStudy Column */}
                  <td className="p-4 sm:p-5 font-bold text-emerald-400 bg-indigo-950/20 border-x border-indigo-500/20">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-slate-100 font-bold">Autonomous</span>
                    </div>
                  </td>

                  {/* Google Calendar */}
                  <td className="p-4 sm:p-5 text-slate-400 hidden sm:table-cell">
                    {row.staticCalendars === true ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <X className="w-4 h-4 text-slate-600" />
                    )}
                  </td>

                  {/* Notion */}
                  <td className="p-4 sm:p-5 text-slate-400 hidden md:table-cell">
                    {typeof row.notionSpreadsheets === 'string' ? (
                      <span className="text-[11px] font-medium text-amber-400">
                        {row.notionSpreadsheets}
                      </span>
                    ) : row.notionSpreadsheets === true ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <X className="w-4 h-4 text-slate-600" />
                    )}
                  </td>

                  {/* Anki */}
                  <td className="p-4 sm:p-5 text-slate-400 hidden lg:table-cell">
                    {typeof row.ankiFlashcards === 'string' ? (
                      <span className="text-[11px] font-medium text-amber-400">
                        {row.ankiFlashcards}
                      </span>
                    ) : row.ankiFlashcards === true ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <X className="w-4 h-4 text-slate-600" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
