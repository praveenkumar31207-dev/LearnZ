'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Zap,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Play,
  Bot,
  BrainCircuit,
  Clock,
  ShieldCheck,
  GraduationCap,
  CalendarDays,
  Target,
  BookOpen,
  Award,
  Building2,
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  const [simState, setSimState] = useState<'normal' | 'gap_detected' | 'igot_enrolled' | 'reassessed'>('normal');

  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden bg-slate-950">
      {/* Background Official Blue & Saffron Ambient Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[500px] bg-gradient-to-tr from-blue-700/20 via-indigo-600/15 to-emerald-600/15 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-10 right-10 w-96 h-96 bg-blue-700/10 blur-[100px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-emerald-600/10 blur-[100px] rounded-full pointer-events-none -z-10" />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Hero Header */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-950/70 border border-indigo-500/30 text-indigo-300 text-xs font-semibold shadow-inner shadow-indigo-500/20 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>Semester Exam AI • University Engineering & CS Curriculum</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.08] drop-shadow-sm">
            AI-Enabled Skill Intelligence &{' '}
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-teal-300">
                Learning Platform
              </span>
              <svg
                className="absolute -bottom-2 left-0 w-full h-3 text-blue-400/50"
                viewBox="0 0 100 20"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,15 Q50,0 100,15"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          {/* Subtitle */}
          <h2 className="text-lg sm:text-2xl text-blue-200/90 font-bold max-w-3xl mx-auto">
            Timetable-Aligned Exam Prep for B.Tech & University Engineering Semester Students
          </h2>

          <p className="text-sm sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
            Transitioning from passive study to AI-driven semester exam intelligence. Dynamically diagnoses topic gaps across OS, DBMS, Networks and Algorithms, recommends targeted <strong>NPTEL university modules</strong> and generates <strong>University PYQ-style assessments</strong> from your uploaded syllabus PDFs.
          </p>

          {/* Core Philosophy Banner */}
          <div className="p-3.5 rounded-2xl bg-blue-950/40 border border-blue-800/60 max-w-2xl mx-auto text-xs font-semibold text-blue-200 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Core Architecture:</strong> Profile → Assess → Identify Gap → Recommend → Learn → Assess → Update Competency
            </span>
          </div>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-sm font-extrabold text-white bg-blue-700 hover:bg-blue-600 shadow-xl shadow-blue-700/35 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Building2 className="w-4 h-4" />
              <span>Launch Official Platform</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/quizzes"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl text-sm font-bold text-slate-200 bg-slate-900/80 hover:bg-slate-800/90 border border-slate-700 hover:border-slate-600 shadow-md transition-all"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Try AI MCQ Generator</span>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>NPTEL & University Syllabus Synced</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>PYQ Question Bank Integrated</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Timetable-Driven Study Slots</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>AI ExamMentor Coach Active</span>
            </div>
          </div>
        </div>

        {/* Interactive Live Competency Loop Demonstration Card */}
        <div className="mt-14 max-w-5xl mx-auto">
          <div className="p-1 rounded-3xl bg-gradient-to-b from-blue-500/30 via-slate-800/50 to-emerald-500/20 shadow-2xl shadow-blue-950/80 backdrop-blur-2xl">
            <div className="bg-slate-950/90 rounded-[22px] p-5 sm:p-8 border border-slate-800/80">
              {/* Controller Topbar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
                      Interactive Live Demonstration Workflow
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400">
                    Experience the complete end-to-end AI-powered semester exam workflow for college engineering students:
                  </p>
                </div>

                {/* Scenario Toggle Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setSimState('normal')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      simState === 'normal'
                        ? 'bg-blue-700 text-white ring-1 ring-blue-400'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    1. Student Profile (72%)
                  </button>
                  <button
                    onClick={() => setSimState('gap_detected')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      simState === 'gap_detected'
                        ? 'bg-rose-600 text-white ring-1 ring-rose-400'
                        : 'bg-slate-900 text-slate-400 hover:text-rose-300 border border-slate-800'
                    }`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-300" />
                    <span>2. AI Gap Detected</span>
                  </button>
                  <button
                    onClick={() => setSimState('igot_enrolled')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      simState === 'igot_enrolled'
                        ? 'bg-blue-600 text-white ring-1 ring-blue-400'
                        : 'bg-slate-900 text-slate-400 hover:text-blue-300 border border-slate-800'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                    <span>3. Exam Module Enrolled</span>
                  </button>
                  <button
                    onClick={() => setSimState('reassessed')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      simState === 'reassessed'
                        ? 'bg-emerald-600 text-white ring-1 ring-emerald-400'
                        : 'bg-slate-900 text-slate-400 hover:text-emerald-300 border border-slate-800'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                    <span>4. Loop Closed (+24%)</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Output Banner */}
              <div className="mt-6">
                {simState === 'normal' && (
                  <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-900/60 flex items-center justify-between text-xs text-blue-200">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
                      <span>
                        <strong>Aarav Sharma (B.Tech CSE, 6th Sem):</strong> Baseline evaluated across 4 core subjects (OS 78%, DBMS 52%, Networks 68%, DSA 74%). Overall Exam Readiness: 72%.
                      </span>
                    </div>
                    <span className="font-bold text-emerald-400 hidden sm:inline">Active Student Profile</span>
                  </div>
                )}

                {simState === 'gap_detected' && (
                  <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-900/60 flex items-center justify-between text-xs text-rose-200 animate-in fade-in">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>
                        <strong>🔴 Critical Gaps Detected:</strong> Virtual Memory Paging (42% vs 80%) and SQL Normalization (48% vs 78%). High-probability 10-marker exam topics need focused revision.
                      </span>
                    </div>
                    <span className="font-bold text-rose-300 hidden sm:inline">-32% Gap</span>
                  </div>
                )}

                {simState === 'igot_enrolled' && (
                  <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-900/60 flex items-center justify-between text-xs text-blue-200 animate-in fade-in">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-blue-400 shrink-0" />
                      <span>
                        <strong>Personalized Study Assigned:</strong> Enrolled in <em>"OS: Virtual Memory & Scheduling University Sprint (NPTEL)"</em> + <em>"DBMS: BCNF & SQL Mastery Module (University Vault)"</em>.
                      </span>
                    </div>
                    <span className="font-bold text-blue-300 hidden sm:inline">In Progress (45%)</span>
                  </div>
                )}

                {simState === 'reassessed' && (
                  <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-900/60 flex items-center justify-between text-xs text-emerald-200 animate-in fade-in">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>
                        <strong>Exam Score Updated!</strong> Passed AI-generated MCQ assessment on OS Paging & DBMS Normalization. Exam readiness upgraded to <strong>76% (+28 percentage points improvement)</strong>.
                      </span>
                    </div>
                    <span className="font-bold text-emerald-300 hidden sm:inline">+350 XP Verified</span>
                  </div>
                )}
              </div>

              {/* Visual 3-Stage Progress Grid */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Stage 1 • Diagnostic</span>
                  <h4 className="text-sm font-bold text-white mt-1">University Syllabus Baseline</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    AI diagnoses across 30+ core CS exam topics using university question patterns and PYQ frequency data.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Stage 2 • NPTEL Exam Ecosystem</span>
                  <h4 className="text-sm font-bold text-white mt-1">Timetable-Aligned Module Recommendation</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Direct integration with NPTEL/SWAYAM lecture repositories and university exam vault PYQs.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Stage 3 • AI MCQs & Reassessment</span>
                  <h4 className="text-sm font-bold text-white mt-1">Validated Exam Assessment Engine</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Faculty upload syllabus PDFs; AI extracts concepts, generates PYQ-style MCQs, and updates exam readiness score.
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <BrainCircuit className="w-4 h-4 text-indigo-400" />
                  Aligned with Smart India Hackathon (SIH) university semester exam intelligence prototype.
                </span>
                <Link
                  href="/dashboard"
                  className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 transition-colors"
                >
                  <span>Enter Student Exam Dashboard</span>
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
