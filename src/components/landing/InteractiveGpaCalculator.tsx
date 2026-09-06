'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Calculator,
  TrendingUp,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Award,
  Zap,
} from 'lucide-react';

export const InteractiveGpaCalculator: React.FC = () => {
  const [currentGpa, setCurrentGpa] = useState<number>(3.0);
  const [targetGpa, setTargetGpa] = useState<number>(3.8);
  const [weeklyHours, setWeeklyHours] = useState<number>(20);
  const [weeksUntilExam, setWeeksUntilExam] = useState<number>(8);

  // Calculations
  const hoursSavedPerWeek = Math.round(weeklyHours * 0.28 * 10) / 10;
  const totalSemesterHoursSaved = Math.round(hoursSavedPerWeek * weeksUntilExam);
  const retentionBoostPercent = Math.min(46, Math.round(18 + (targetGpa - currentGpa) * 16));
  const successProbability = Math.min(
    98.5,
    Math.max(65, Math.round((82 + (weeklyHours >= 15 ? 10 : 4) - (targetGpa - currentGpa) * 5) * 10) / 10)
  );

  return (
    <section id="calculator" className="py-24 relative bg-slate-900/40 border-y border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-bold uppercase tracking-wider">
            <Calculator className="w-3.5 h-3.5" />
            ROI & Efficiency Forecaster
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Calculate Your Time Savings & GPA Potential
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            See how eliminating disorganized cramming, redundant re-reading, and missed revision windows translates into higher academic performance with fewer wasted hours.
          </p>
        </div>

        {/* Calculator Grid */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Inputs (6 cols) */}
          <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-slate-950/90 border border-slate-800 shadow-2xl space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 pb-3 border-b border-slate-800 flex items-center gap-2">
              <Zap className="w-4 h-4 text-teal-400" />
              Your Academic Profile Inputs
            </h3>

            {/* Current GPA Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-semibold">Current GPA / Grade Baseline:</span>
                <span className="font-mono font-bold text-white text-sm">{currentGpa.toFixed(1)} / 4.0</span>
              </div>
              <input
                type="range"
                min="2.0"
                max="4.0"
                step="0.1"
                value={currentGpa}
                onChange={(e) => setCurrentGpa(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
              />
            </div>

            {/* Target GPA Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-semibold">Target Goal / Dream GPA:</span>
                <span className="font-mono font-bold text-teal-400 text-sm">{targetGpa.toFixed(1)} / 4.0</span>
              </div>
              <input
                type="range"
                min={currentGpa}
                max="4.0"
                step="0.1"
                value={targetGpa}
                onChange={(e) => setTargetGpa(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
              />
            </div>

            {/* Current Study Hours Per Week */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-semibold">Current Weekly Study Time:</span>
                <span className="font-mono font-bold text-indigo-400 text-sm">{weeklyHours} Hours / Week</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                step="1"
                value={weeklyHours}
                onChange={(e) => setWeeklyHours(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-400"
              />
            </div>

            {/* Weeks until Exams */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-semibold">Weeks Remaining In Semester:</span>
                <span className="font-mono font-bold text-amber-400 text-sm">{weeksUntilExam} Weeks</span>
              </div>
              <input
                type="range"
                min="2"
                max="20"
                step="1"
                value={weeksUntilExam}
                onChange={(e) => setWeeksUntilExam(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>
          </div>

          {/* Right Calculated Results (6 cols) */}
          <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/40 border border-indigo-500/30 shadow-2xl flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Cognitive Optimization Impact
                </span>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-teal-500/15 text-teal-300 border border-teal-500/30">
                  AI Projected
                </span>
              </div>

              {/* High-Impact Metric Cards */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <div className="text-[11px] text-slate-400 font-semibold">
                    Time Saved Weekly
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-teal-400 mt-1 font-mono">
                    ~{hoursSavedPerWeek} hrs
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Eliminated re-cramming and aimless scheduling
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <div className="text-[11px] text-slate-400 font-semibold">
                    Total Semester Saved
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-indigo-400 mt-1 font-mono">
                    {totalSemesterHoursSaved} Hours
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Equivalent to {Math.round(totalSemesterHoursSaved / 8)} full rest days!
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <div className="text-[11px] text-slate-400 font-semibold">
                    Memory Retention Lift
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-purple-400 mt-1 font-mono">
                    +{retentionBoostPercent}%
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Powered by active spaced retrieval
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <div className="text-[11px] text-slate-400 font-semibold">
                    Target GPA Confidence
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1 font-mono">
                    {successProbability}%
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    High-yield exam topic coverage
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Launch Bar */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <Link
                href="/onboarding"
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-teal-500 via-indigo-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-white text-xs font-extrabold shadow-lg shadow-teal-500/20 transition-all hover:scale-[1.01]"
              >
                <span>Generate My Custom Schedule to Hit {targetGpa.toFixed(1)} GPA</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="text-center text-[10px] text-slate-500">
                CogniStudy is 100% free with no paywalls or subscription traps.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
