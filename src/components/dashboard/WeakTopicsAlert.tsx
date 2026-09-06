'use client';

import React from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import {
  AlertTriangle,
  HelpCircle,
  Bot,
  ArrowRight,
  ShieldAlert,
  BookOpen,
  GraduationCap,
} from 'lucide-react';

export const WeakTopicsAlert: React.FC = () => {
  const { criticalGaps, igotCourses } = useAppStore();

  if (criticalGaps.length === 0) return null;

  return (
    <div className="rounded-3xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 p-6 shadow-xs">
      <div className="flex items-center justify-between gap-4 mb-3">
        <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300">
          <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400" />
          <h3 className="font-extrabold text-sm sm:text-base">
            AI Competency Gap Radar (Priority Training Required)
          </h3>
        </div>
        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
          {criticalGaps.length} Critical Gaps
        </span>
      </div>

      <p className="text-xs text-rose-900/80 dark:text-rose-300/80 mb-4 leading-relaxed">
        The AI has benchmarked your current competency against requirements for your posting in the{' '}
        <strong>Official Statistical System</strong>. Immediate capacity building is recommended:
      </p>

      <div className="space-y-3">
        {criticalGaps.map((skill) => {
          const matchingCourse = igotCourses.find(
            (c) => c.targetedSkill.includes(skill.title) || skill.title.includes(c.targetedSkill)
          );

          return (
            <div
              key={skill.id}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-rose-200/80 dark:border-rose-900/40 shadow-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {skill.title}
                  </h4>
                  <span className="text-[10px] font-bold text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-950 px-2 py-0.5 rounded-md">
                    🔴 Critical Gap: {skill.currentLevel}% (Benchmark: {skill.requiredLevel}%)
                  </span>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <Link
                    href={`/resources`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950 hover:bg-blue-100 text-blue-700 dark:text-blue-300 text-xs font-semibold border border-blue-200 dark:border-blue-800 transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Enrol iGOT Module</span>
                  </Link>
                  <Link
                    href={`/quizzes`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Diagnostic Test</span>
                  </Link>
                </div>
              </div>

              {/* AI Explanation of WHY it is considered a gap */}
              <div className="mt-2 text-[11px] text-slate-600 dark:text-slate-400 pl-4 border-l-2 border-rose-300 dark:border-rose-800">
                <span className="font-bold text-rose-700 dark:text-rose-400">AI Diagnostic: </span>
                {skill.aiRationale}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
