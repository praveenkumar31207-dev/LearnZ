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
} from 'lucide-react';

export default function DashboardPage() {
  const { profile } = useAppStore();

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            Welcome back, {profile.fullName.split(' ')[0]} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {profile.courseDegree} • {profile.currentSemester} • Target:{' '}
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
              {profile.targetGpaGrade}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-xs"
          >
            <span>Update Routine / Goals</span>
          </Link>
          <Link
            href="/schedule"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-sm shadow-indigo-600/30 transition-colors"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Full Calendar</span>
          </Link>
        </div>
      </div>

      {/* 1. Hero Recommendation Card: "What Should I Study Now?" */}
      <WhatToStudyCard />

      {/* 2. Top Metric Stat Badges */}
      <ProgressOverview />

      {/* 3. Main Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Today's Timeline (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <TodayTimeline />
        </div>

        {/* Right Column: Weak Topics, Deadlines & Quick Hub (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <WeakTopicsAlert />
          <UpcomingDeadlines />

          {/* Quick AI Hub Cards */}
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/tutors"
              className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 shadow-sm transition-all group"
            >
              <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Bot className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                AI Tutors
              </h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                Socratic doubt solving & code mentors
              </p>
            </Link>

            <Link
              href="/resources"
              className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 shadow-sm transition-all group"
            >
              <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Compass className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                Resource Box
              </h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                "Where Should I Learn This?" curation
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
