'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import {
  BarChart3,
  Flame,
  Award,
  TrendingUp,
  Clock,
  CheckCircle2,
  Brain,
  Zap,
} from 'lucide-react';
import { formatMinutes } from '@/lib/utils';

export const AnalyticsPage: React.FC = () => {
  const { profile, studySessions, subjects, allTopics, achievements } = useAppStore();

  const totalStudiedMins = studySessions.reduce((acc, s) => acc + s.actualMins, 0) || 140;
  const avgFocusScore =
    studySessions.length > 0
      ? Math.round(
          studySessions.reduce((acc, s) => acc + s.focusScore, 0) / studySessions.length
        )
      : 88;

  const totalDistractions = studySessions.reduce((acc, s) => acc + s.distractionCount, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
          <BarChart3 className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
          Productivity & Learning Analytics
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Deep behavioral insights, focus metrics, topic mastery curves, and milestone achievements.
        </p>
      </div>

      {/* Top Highlights */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 block mb-1">
            Total Focus Time
          </span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {formatMinutes(totalStudiedMins)}
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
            +18% vs last week
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 block mb-1">
            Average Focus Score
          </span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {avgFocusScore}%
          </div>
          <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
            High attention retention
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 block mb-1">
            Study Streak
          </span>
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 flex items-center gap-1.5">
            <Flame className="w-5 h-5 fill-orange-500 text-orange-500" />
            <span>{profile.streakDays} Days</span>
          </div>
          <span className="text-[11px] text-slate-500">
            {profile.totalXp} XP Accumulated
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 block mb-1">
            Topics Mastered
          </span>
          <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">
            {allTopics.filter((t) => t.masteryPercentage >= 80).length} / {allTopics.length}
          </div>
          <span className="text-[11px] text-slate-500">
            Across {subjects.length} Subjects
          </span>
        </div>
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Subject Mastery Bars (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Brain className="w-4 h-4 text-indigo-500" />
              Subject-Wise Topic Mastery & Retention
            </h3>

            <div className="space-y-4">
              {subjects.map((subj) => {
                const subjTopics = allTopics.filter((t) =>
                  subj.units?.some((u) =>
                    u.chapters?.some((c) => c.topics?.some((tp) => tp.id === t.id))
                  )
                );

                const avgMastery =
                  subjTopics.length > 0
                    ? Math.round(
                        subjTopics.reduce((acc, t) => acc + (t.masteryPercentage || 0), 0) /
                          subjTopics.length
                      )
                    : 0;

                return (
                  <div key={subj.id} className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
                        <div
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: subj.color || '#6366f1' }}
                        />
                        <span>{subj.name}</span>
                      </div>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">
                        {avgMastery}% Mastery
                      </span>
                    </div>

                    <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${avgMastery}%`,
                          backgroundColor: subj.color || '#6366f1',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Gamification Badges (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              Achievements & Badges
            </h3>

            <div className="space-y-3">
              {achievements.map((ach) => (
                <div
                  key={ach.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-center gap-3.5"
                >
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-xl shrink-0">
                    {ach.icon}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {ach.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug mt-0.5">
                      {ach.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
