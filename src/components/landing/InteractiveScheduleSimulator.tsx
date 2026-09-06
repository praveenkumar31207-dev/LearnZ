'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Zap,
  Calendar,
  Clock,
  Sparkles,
  ArrowRight,
  BookOpen,
  RotateCcw,
  CheckCircle2,
  Sliders,
  Award,
  Layers,
  GraduationCap,
} from 'lucide-react';

interface MajorPreset {
  id: string;
  name: string;
  degree: string;
  emoji: string;
  subjects: { name: string; tag: string; color: string; hours: number }[];
  examDateDays: number;
}

const PRESETS: MajorPreset[] = [
  {
    id: 'cs',
    name: 'Computer Science',
    degree: 'B.Tech / B.S. in CS',
    emoji: '💻',
    subjects: [
      { name: 'Algorithms & Data Structures', tag: 'High-Yield', color: 'indigo', hours: 8 },
      { name: 'Operating Systems & Concurrency', tag: 'Core Theory', color: 'teal', hours: 6 },
      { name: 'Database Management Systems', tag: 'Practical', color: 'amber', hours: 5 },
      { name: 'System Design & Distributed Systems', tag: 'Advanced', color: 'purple', hours: 4 },
    ],
    examDateDays: 24,
  },
  {
    id: 'med',
    name: 'Pre-Med & Biology',
    degree: 'MBBS / MD / Biology',
    emoji: '🩺',
    subjects: [
      { name: 'Human Anatomy & Neuroanatomy', tag: 'High-Yield', color: 'rose', hours: 9 },
      { name: 'Medical Biochemistry & Genetics', tag: 'Spaced Rep', color: 'indigo', hours: 7 },
      { name: 'Pharmacology & Toxicology', tag: 'Core Theory', color: 'teal', hours: 6 },
      { name: 'Clinical Pathology & Diagnostics', tag: 'Case Studies', color: 'amber', hours: 5 },
    ],
    examDateDays: 18,
  },
  {
    id: 'eng',
    name: 'Engineering & Physics',
    degree: 'B.E. Mechanical / Electrical',
    emoji: '📐',
    subjects: [
      { name: 'Applied Thermodynamics & Heat Transfer', tag: 'Problem Heavy', color: 'amber', hours: 8 },
      { name: 'Control Systems & Signal Processing', tag: 'High-Yield', color: 'indigo', hours: 7 },
      { name: 'Engineering Mathematics & Calculus', tag: 'Daily Drill', color: 'teal', hours: 6 },
      { name: 'Fluid Mechanics & Aerodynamics', tag: 'Core Theory', color: 'cyan', hours: 4 },
    ],
    examDateDays: 30,
  },
  {
    id: 'law',
    name: 'Law & Jurisprudence',
    degree: 'LL.B. / J.D. Bar Prep',
    emoji: '⚖️',
    subjects: [
      { name: 'Constitutional Law & Precedents', tag: 'Case Analysis', color: 'purple', hours: 9 },
      { name: 'Torts & Contractual Obligations', tag: 'High-Yield', color: 'indigo', hours: 7 },
      { name: 'Criminal Procedure & Evidence', tag: 'Core Theory', color: 'rose', hours: 6 },
      { name: 'Corporate & Intellectual Property', tag: 'Application', color: 'teal', hours: 5 },
    ],
    examDateDays: 21,
  },
  {
    id: 'biz',
    name: 'Finance & MBA',
    degree: 'BBA / MBA / CFA Candidate',
    emoji: '📊',
    subjects: [
      { name: 'Corporate Valuation & Modeling', tag: 'High-Yield', color: 'teal', hours: 8 },
      { name: 'Financial Accounting & Reporting', tag: 'Problem Heavy', color: 'indigo', hours: 6 },
      { name: 'Macroeconomics & Global Markets', tag: 'Core Theory', color: 'amber', hours: 5 },
      { name: 'Portfolio Management & Derivatives', tag: 'Quantitative', color: 'purple', hours: 5 },
    ],
    examDateDays: 28,
  },
];

export const InteractiveScheduleSimulator: React.FC = () => {
  const [selectedMajor, setSelectedMajor] = useState<MajorPreset>(PRESETS[0]);
  const [dailyHours, setDailyHours] = useState<number>(4);
  const [focusWindow, setFocusWindow] = useState<'morning' | 'afternoon' | 'night'>('morning');

  const totalWeeklyCapacity = dailyHours * 7;
  const activeRecallPercentage = Math.min(96, Math.round(75 + dailyHours * 3.2));
  const retentionScore = Math.min(99, Math.round(82 + (dailyHours >= 4 ? 12 : dailyHours * 2.5)));
  const daysSavedAhead = Math.round((dailyHours * 4.2));

  return (
    <section id="simulator" className="py-24 relative bg-slate-900/50 border-y border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" />
            Live AI Timetable Architect
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            See Your Custom AI Schedule In Action
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Customize your academic discipline and daily study capacity. CogniStudy instantly calculates a non-linear timetable with automated buffer catch-up zones and spaced repetition triggers.
          </p>
        </div>

        {/* Interactive Controls & Live Preview Container */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Configuration Panel (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 sm:p-7 rounded-3xl bg-slate-950/90 border border-slate-800 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-indigo-400" />
                  1. Select Discipline / Major
                </span>
                <span className="text-xs text-indigo-400 font-medium">5 Presets</span>
              </div>

              {/* Major Selector Buttons */}
              <div className="grid grid-cols-1 gap-2.5">
                {PRESETS.map((p) => {
                  const isSelected = p.id === selectedMajor.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setSelectedMajor(p)}
                      className={`p-3 rounded-2xl text-left flex items-center justify-between transition-all ${
                        isSelected
                          ? 'bg-gradient-to-r from-indigo-600/30 to-teal-500/20 border-2 border-indigo-500 text-white shadow-md'
                          : 'bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{p.emoji}</span>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-white leading-tight">
                            {p.name}
                          </h4>
                          <p className="text-[11px] text-slate-400">{p.degree}</p>
                        </div>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Daily Hours Slider */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-teal-400" />
                    2. Daily Study Budget
                  </span>
                  <span className="font-bold text-teal-400 text-sm px-2.5 py-0.5 rounded-lg bg-teal-500/10 border border-teal-500/30">
                    {dailyHours} Hours / Day ({dailyHours * 7}h / week)
                  </span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="8"
                  step="0.5"
                  value={dailyHours}
                  onChange={(e) => setDailyHours(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>2h (Light)</span>
                  <span>4h (Balanced)</span>
                  <span>6h (Intensive)</span>
                  <span>8h (War-Room)</span>
                </div>
              </div>

              {/* Peak Focus Preference */}
              <div className="space-y-2 pt-4 border-t border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  3. Optimal Chronotype Window
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setFocusWindow('morning')}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold transition-colors ${
                      focusWindow === 'morning'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-900 text-slate-400 border border-slate-800'
                    }`}
                  >
                    🌅 Morning
                  </button>
                  <button
                    onClick={() => setFocusWindow('afternoon')}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold transition-colors ${
                      focusWindow === 'afternoon'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-900 text-slate-400 border border-slate-800'
                    }`}
                  >
                    ☀️ Afternoon
                  </button>
                  <button
                    onClick={() => setFocusWindow('night')}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold transition-colors ${
                      focusWindow === 'night'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-900 text-slate-400 border border-slate-800'
                    }`}
                  >
                    🌙 Night Owl
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Live Timetable Breakdown (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 sm:p-7 rounded-3xl bg-slate-950/90 border border-slate-800 shadow-2xl space-y-6">
              {/* Output Title & KPIs */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{selectedMajor.emoji}</span>
                    <h3 className="text-base font-bold text-white">
                      AI 7-Day Master Timetable
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Targeting {selectedMajor.name} with {selectedMajor.examDateDays}-day exam countdown buffer
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">
                      Retention Forecast
                    </div>
                    <div className="text-sm font-extrabold text-teal-400">
                      {retentionScore}%
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">
                      Velocity Lead
                    </div>
                    <div className="text-sm font-extrabold text-indigo-400">
                      +{daysSavedAhead} Days
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic Curriculum Weightage Allocation */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Algorithmic Workload Distribution:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedMajor.subjects.map((sub, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-indigo-400" />
                          <h5 className="text-xs font-bold text-white truncate">
                            {sub.name}
                          </h5>
                        </div>
                        <span className="text-[10px] text-indigo-300/80 font-medium">
                          {sub.tag}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-slate-300 shrink-0 font-mono px-2 py-0.5 rounded-md bg-slate-800">
                        {Math.round((sub.hours / 24) * totalWeeklyCapacity)} hrs/wk
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Day-by-Day Adaptive Flow Matrix */}
              <div className="space-y-2.5 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Dynamic Schedule Structure (Mon – Sun):
                </span>
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-2xl bg-indigo-950/30 border border-indigo-900/60 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-indigo-400 w-16">
                        Mon / Wed
                      </span>
                      <span className="text-slate-200">
                        Deep Concept Focus: {selectedMajor.subjects[0].name}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300">
                      Primary Core
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-teal-950/30 border border-teal-900/60 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-teal-400 w-16">
                        Tue / Thu
                      </span>
                      <span className="text-slate-200">
                        Analytical & Problem Drills: {selectedMajor.subjects[1].name}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/20 text-teal-300">
                      Applied Drill
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-amber-950/30 border border-amber-900/60 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-amber-400 w-16">
                        Friday
                      </span>
                      <span className="text-slate-200">
                        Spaced Repetition Review (Day 3 & Day 7 Intervals)
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300">
                      Ebbinghaus Trigger
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-purple-400 w-16">
                        Sat / Sun
                      </span>
                      <span className="text-slate-200">
                        Adaptive Buffer Slot & AI Diagnostic Quiz
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300">
                      Zero Backlog Buffer
                    </span>
                  </div>
                </div>
              </div>

              {/* Call to Action Bar */}
              <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-slate-400">
                  Ready to deploy this exact schedule with automatic daily adjustments?
                </div>
                <Link
                  href="/onboarding"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-teal-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 hover:scale-[1.02] transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Import Into My Account</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
