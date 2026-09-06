'use client';

import React from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { WhatToStudyCard } from '@/components/dashboard/WhatToStudyCard';
import { TodayTimeline } from '@/components/dashboard/TodayTimeline';
import { ProgressOverview } from '@/components/dashboard/ProgressOverview';
import { WeakTopicsAlert } from '@/components/dashboard/WeakTopicsAlert';
import { UpcomingDeadlines } from '@/components/dashboard/UpcomingDeadlines';
import {
  Sparkles,
  Bot,
  Compass,
  HelpCircle,
  Calendar,
  Layers,
  ArrowRight,
  Zap,
  Target,
  UploadCloud,
  Cpu,
  BarChart3,
  Award,
  BookOpen,
  Building2,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  GraduationCap,
} from 'lucide-react';

export default function DashboardPage() {
  const { profile, activeRole, competencyDomains, criticalGaps, igotCourses, departmentMetrics, emergingSkills } = useAppStore();

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Official Header & Cadre Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              {profile.cadre}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              ID: {profile.id} • Posting: {profile.department}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white mt-1 flex items-center gap-2">
            Welcome back, {profile.fullName} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5 font-medium">
            Assignment: <span className="font-bold text-slate-800 dark:text-slate-200">{profile.currentAssignment}</span> • Role:{' '}
            <span className="font-semibold text-blue-700 dark:text-blue-400">{profile.jobRole}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/subjects?tab=gaps"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>AI Gap Analysis</span>
          </Link>
          <Link
            href="/schedule"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold shadow-sm shadow-blue-700/30 transition-colors"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>AI Learning Path</span>
          </Link>
        </div>
      </div>

      {/* 2. Top Metric Competency Scorecard */}
      <ProgressOverview />

      {/* 3. Hero Recommendation Card: "AI Personalized Learning Path Recommendation" */}
      <WhatToStudyCard />

      {/* 4. The 4 Competency Domains Grid Visualization */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600" />
              The Four Official Competency Domains
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Continuous skill benchmarking for India's Official Statistical Personnel
            </p>
          </div>
          <Link
            href="/subjects"
            className="text-xs font-bold text-blue-700 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>Explore Full Framework</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {competencyDomains.map((dom) => (
            <div
              key={dom.id}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {dom.code}
                </span>
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-extrabold"
                  style={{ backgroundColor: `${dom.color}20`, color: dom.color }}
                >
                  {dom.averageScore}%
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {dom.name}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Benchmark Target: {dom.requiredBenchmark}%
                </p>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${dom.averageScore}%`,
                    backgroundColor: dom.color,
                  }}
                />
              </div>

              {/* Skill highlights snippet */}
              <div className="text-[10px] text-slate-600 dark:text-slate-400 pt-1 space-y-1">
                {dom.skills.slice(0, 2).map((s) => (
                  <div key={s.id} className="flex items-center justify-between">
                    <span className="truncate max-w-[120px]">{s.title.split(' ')[0]} {s.title.split(' ')[1]}</span>
                    <span className={`font-bold ${s.currentLevel < 50 ? 'text-rose-600' : 'text-slate-700 dark:text-slate-300'}`}>
                      {s.currentLevel}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Main Two-Column Operational Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Today's Timeline & iGOT Actions (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <TodayTimeline />

          {/* Sourced through iGOT Karmayogi Quick Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-50/70 to-indigo-50/40 dark:from-slate-900 dark:to-slate-850 border border-blue-200 dark:border-blue-900/60 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-700 text-white flex items-center justify-center font-bold text-xs">
                  🇮🇳
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    iGOT Karmayogi Learning Repository
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Sourced directly from Mission Karmayogi & NSSTA TPAC
                  </p>
                </div>
              </div>
              <Link
                href="/resources"
                className="text-xs font-bold text-blue-700 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>View All ({igotCourses.length})</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {igotCourses.slice(0, 2).map((course) => (
                <div
                  key={course.id}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                        {course.provider}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400">
                        {course.durationHours}h Duration
                      </span>
                    </div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2">
                      {course.courseName}
                    </h5>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                      {course.completionStatus} ({course.progressPercentage}%)
                    </span>
                    <Link
                      href="/resources"
                      className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Access Course →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: AI Gap Radar, Milestones & Quick Tool Hub (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <WeakTopicsAlert />
          <UpcomingDeadlines />

          {/* Quick AI & Official Hub Cards */}
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/resources"
              className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 shadow-xs transition-all group"
            >
              <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <BookOpen className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                iGOT & NSSTA Repo
              </h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                Accredited capacity courses & manuals
              </p>
            </Link>

            <Link
              href="/quizzes"
              className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-700 shadow-xs transition-all group"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Cpu className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                AI Assessment Engine
              </h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                Generate MCQs from uploaded manuals
              </p>
            </Link>

            <Link
              href="/analytics"
              className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 shadow-xs transition-all group"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                Competency Progress
              </h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                Before vs after training metrics
              </p>
            </Link>

            <Link
              href="/tutors"
              className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 shadow-xs transition-all group"
            >
              <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Bot className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                Statistical Assistant
              </h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                Sankhyiki AI doubt resolver
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
