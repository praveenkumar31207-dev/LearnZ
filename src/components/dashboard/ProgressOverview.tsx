'use client';

import React from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import {
  Award,
  AlertCircle,
  TrendingUp,
  Clock,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Building2,
  Target,
} from 'lucide-react';

export const ProgressOverview: React.FC = () => {
  const { profile, competencyDomains, criticalGaps, igotCourses } = useAppStore();

  const completedCourses = igotCourses.filter((c) => c.completionStatus === 'Completed').length;
  const inProgressCourses = igotCourses.filter((c) => c.completionStatus === 'In Progress').length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Overall Competency Score */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-blue-300 dark:hover:border-blue-700 transition-all">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
          <span className="text-xs font-bold uppercase tracking-wider">Overall Competency</span>
          <Award className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-slate-900 dark:text-white">
            {profile.overallCompetencyScore}%
          </span>
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            Target: 85%
          </span>
        </div>
        {/* Progress Bar */}
        <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 mt-3 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-500 transition-all duration-500"
            style={{ width: `${profile.overallCompetencyScore}%` }}
          />
        </div>
        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 truncate">
          Evaluated across 33 official statistical competencies
        </p>
      </div>

      {/* 2. Critical Skill Gaps */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-rose-300 dark:hover:border-rose-700 transition-all">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
          <span className="text-xs font-bold uppercase tracking-wider">Critical Skill Gaps</span>
          <AlertCircle className="w-4 h-4 text-rose-500" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-rose-600 dark:text-rose-400">
            {criticalGaps.length}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Gaps (Data Viz, AI/ML)
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 mt-3 overflow-hidden">
          <div
            className="h-full rounded-full bg-rose-500 transition-all duration-500"
            style={{ width: `${Math.min(100, criticalGaps.length * 30)}%` }}
          />
        </div>
        <Link
          href="/subjects?tab=gaps"
          className="text-[10px] font-bold text-rose-600 dark:text-rose-400 mt-2 inline-flex items-center gap-1 hover:underline"
        >
          <span>View AI Gap Analysis</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* 3. iGOT Karmayogi Training Modules */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-700 transition-all">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
          <span className="text-xs font-bold uppercase tracking-wider">iGOT Courses</span>
          <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-slate-900 dark:text-white">
            {completedCourses}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Completed ({inProgressCourses} in progress)
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 mt-3 overflow-hidden">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${(completedCourses / (igotCourses.length || 1)) * 100}%` }}
          />
        </div>
        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 truncate">
          Mission Karmayogi Verified Certificates
        </p>
      </div>

      {/* 4. Verified Capacity Hours & XP */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-700 transition-all">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
          <span className="text-xs font-bold uppercase tracking-wider">Learning Hours</span>
          <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-indigo-700 dark:text-indigo-300">
            {profile.learningHoursLogged}h
          </span>
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
            {profile.totalXp} XP
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 mt-3 overflow-hidden">
          <div
            className="h-full rounded-full bg-indigo-600 transition-all duration-500"
            style={{ width: `${Math.min(100, (profile.learningHoursLogged / 50) * 100)}%` }}
          />
        </div>
        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 truncate">
          Target: 50h continuous capacity development
        </p>
      </div>
    </div>
  );
};
