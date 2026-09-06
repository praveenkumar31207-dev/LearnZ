'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CalendarDays,
  Clock,
  BookOpen,
  HelpCircle,
  BarChart3,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Zap,
  Flame,
  Bot,
  Layers,
  Target,
  Play,
  RotateCcw,
} from 'lucide-react';

export const ProductTourTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'schedule' | 'timer' | 'syllabus' | 'quizzes' | 'analytics'>('schedule');

  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Product Walkthrough
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Every Tool You Need In One Cohesive Workspace
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Click through each module to explore how CogniStudy seamlessly unifies scheduling, focus execution, retention tracking, and exam analytics.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <div className="flex p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl">
            <button
              onClick={() => setActiveTab('schedule')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'schedule'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <CalendarDays className="w-4 h-4" />
              <span>Adaptive Timetable</span>
            </button>

            <button
              onClick={() => setActiveTab('timer')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'timer'
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Smart Focus Timer</span>
            </button>

            <button
              onClick={() => setActiveTab('syllabus')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'syllabus'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Syllabus Hierarchy</span>
            </button>

            <button
              onClick={() => setActiveTab('quizzes')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'quizzes'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Diagnostic Quizzes</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'analytics'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Learning Velocity</span>
            </button>
          </div>
        </div>

        {/* Tab Content Display Container */}
        <div className="max-w-5xl mx-auto">
          <div className="p-1 rounded-3xl bg-gradient-to-b from-indigo-500/20 via-slate-800/40 to-teal-500/10 border border-slate-800 shadow-2xl backdrop-blur-2xl">
            <div className="bg-slate-950/90 rounded-[22px] p-6 sm:p-10 border border-slate-800/80 min-h-[440px] flex flex-col justify-between">
              {/* Tab 1: Adaptive Timetable */}
              {activeTab === 'schedule' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                        Dynamic Calendar View
                      </span>
                      <h3 className="text-xl font-bold text-white">
                        AI-Regulated Weekly Study Grid
                      </h3>
                    </div>
                    <Link
                      href="/schedule"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600/20 text-indigo-300 text-xs font-bold hover:bg-indigo-600/30 transition-colors"
                    >
                      <span>Open Full Schedule</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-800/60 space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-indigo-300 font-mono">
                        <span>09:00 - 10:30 AM</span>
                        <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-[9px] font-bold">
                          Core Session
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white">Data Structures & Algo</h4>
                      <p className="text-xs text-slate-400">Binary Heaps & Priority Queues</p>
                      <div className="pt-2 flex items-center justify-between text-[11px]">
                        <span className="text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Completed (+45 XP)
                        </span>
                        <span className="text-slate-500">90 mins</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-teal-950/30 border border-teal-800/60 space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-teal-300 font-mono">
                        <span>02:00 - 03:30 PM</span>
                        <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-[9px] font-bold">
                          Spaced Rep
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white">Operating Systems</h4>
                      <p className="text-xs text-slate-400">Virtual Memory Page Replacement</p>
                      <div className="pt-2 flex items-center justify-between text-[11px]">
                        <span className="text-amber-400 font-semibold flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> Starting in 25m
                        </span>
                        <span className="text-slate-500">90 mins</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                        <span>06:00 - 07:00 PM</span>
                        <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[9px] font-bold">
                          Buffer Zone
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white">Dynamic Catchup Slot</h4>
                      <p className="text-xs text-slate-400">Reserved for spontaneous doubts & AI quiz</p>
                      <div className="pt-2 flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Adaptive Flex</span>
                        <span className="text-slate-500">60 mins</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Smart Focus Timer */}
              {activeTab === 'timer' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">
                        Focus Execution Module
                      </span>
                      <h3 className="text-xl font-bold text-white">
                        Pomodoro & Continuous Flow Timer
                      </h3>
                    </div>
                    <Link
                      href="/dashboard"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-teal-600/20 text-teal-300 text-xs font-bold hover:bg-teal-600/30 transition-colors"
                    >
                      <span>Launch Focus Session</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    <div className="md:col-span-5 text-center p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3">
                      <div className="text-4xl sm:text-5xl font-mono font-black text-teal-400 tracking-wider">
                        24:18
                      </div>
                      <span className="text-xs text-slate-400 block">
                        Focus Interval • 1 of 4 Pomodoros
                      </span>
                      <div className="flex justify-center gap-2 pt-2">
                        <span className="px-3 py-1 rounded-xl bg-teal-500/20 text-teal-300 text-xs font-bold">
                          Focus Score: 98%
                        </span>
                      </div>
                    </div>

                    <div className="md:col-span-7 space-y-3 text-xs text-slate-300">
                      <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start gap-2.5">
                        <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-white">Continuous Flow Mode:</strong> When in deep focus, the timer allows seamless extension without disruptive alarms breaking your momentum.
                        </div>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start gap-2.5">
                        <RotateCcw className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-white">Auto Reschedule on Pause:</strong> Taking an extended break? The timer logs remaining duration and automatically offers a clean catch-up adjustment.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Syllabus Hierarchy */}
              {activeTab === 'syllabus' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                        Curriculum Architecture
                      </span>
                      <h3 className="text-xl font-bold text-white">
                        Granular Syllabus Progress & Weightages
                      </h3>
                    </div>
                    <Link
                      href="/subjects"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-600/20 text-amber-300 text-xs font-bold hover:bg-amber-600/30 transition-colors"
                    >
                      <span>Manage Subjects</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center">
                          CS
                        </span>
                        <div>
                          <h4 className="text-sm font-bold text-white">Data Structures & Algorithms</h4>
                          <span className="text-[11px] text-slate-400">5 of 6 Chapters Completed (83%)</span>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold">
                        High Mastery (4.8/5)
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 font-bold flex items-center justify-center">
                          OS
                        </span>
                        <div>
                          <h4 className="text-sm font-bold text-white">Operating Systems Architecture</h4>
                          <span className="text-[11px] text-slate-400">3 of 5 Chapters Completed (60%)</span>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 font-bold">
                        Moderate (3.4/5)
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: Diagnostic Quizzes */}
              {activeTab === 'quizzes' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                        Active Retrieval Engine
                      </span>
                      <h3 className="text-xl font-bold text-white">
                        AI-Generated Diagnostic Question Bank
                      </h3>
                    </div>
                    <Link
                      href="/quizzes"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-600/20 text-purple-300 text-xs font-bold hover:bg-purple-600/30 transition-colors"
                    >
                      <span>Take Practice Quiz</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                    <span className="text-[11px] font-mono text-purple-400">
                      Sample Generated Active Recall Item:
                    </span>
                    <h4 className="text-sm font-bold text-white">
                      Which scheduling algorithm minimizes average waiting time in a non-preemptive OS environment?
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400">
                        A) First-Come, First-Served (FCFS)
                      </div>
                      <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500 text-emerald-300 font-bold">
                        B) Shortest Job Next (SJN / SJF) ✅
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400">
                        C) Priority Scheduling with Aging
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400">
                        D) Round Robin (RR) with 10ms Quantum
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 5: Velocity & Analytics */}
              {activeTab === 'analytics' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">
                        Diagnostics & Performance
                      </span>
                      <h3 className="text-xl font-bold text-white">
                        Velocity & Weak Topic Heatmap
                      </h3>
                    </div>
                    <Link
                      href="/analytics"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-600/20 text-rose-300 text-xs font-bold hover:bg-rose-600/30 transition-colors"
                    >
                      <span>Open Analytics Dashboard</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">
                        Weekly Focus Hours
                      </div>
                      <div className="text-2xl font-black text-indigo-400 mt-1 font-mono">
                        28.5 hrs
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">
                        Streak Record
                      </div>
                      <div className="text-2xl font-black text-orange-400 mt-1 font-mono">
                        14 Days 🔥
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">
                        Syllabus Covered
                      </div>
                      <div className="text-2xl font-black text-teal-400 mt-1 font-mono">
                        74.2%
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">
                        Exam Readiness
                      </div>
                      <div className="text-2xl font-black text-emerald-400 mt-1 font-mono">
                        96.8%
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Card Summary */}
              <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-orange-400" />
                  Gamified with XP, level-ups, streaks, and milestone badges.
                </span>
                <Link
                  href="/dashboard"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all"
                >
                  <span>Enter Live Student Dashboard</span>
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
