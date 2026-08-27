'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import {
  Flame,
  CheckCircle2,
  Clock,
  Award,
  TrendingUp,
  Brain,
} from 'lucide-react';
import { formatMinutes } from '@/lib/utils';

export const ProgressOverview: React.FC = () => {
  const { profile, scheduleTasks, studySessions, allTopics } = useAppStore();

  const studyTasks = scheduleTasks.filter((t) => t.taskType === 'study');
  const completedTasks = studyTasks.filter((t) => t.status === 'completed');
  const completionPercentage =
    studyTasks.length > 0
      ? Math.round((completedTasks.length / studyTasks.length) * 100)
      : 0;

  const totalPlannedMins = studyTasks.reduce((acc, t) => acc + t.plannedDurationMins, 0);
  const totalActualMins = studySessions.reduce((acc, s) => acc + s.actualMins, 0);

  const masteredTopics = allTopics.filter((t) => (t.masteryPercentage || 0) >= 80).length;
  const syllabusMasteryPercentage =
    allTopics.length > 0
      ? Math.round((masteredTopics / allTopics.length) * 100)
      : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Daily Completion */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
          <span className="text-xs font-semibold">Today's Progress</span>
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900 dark:text-white">
            {completionPercentage}%
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            ({completedTasks.length}/{studyTasks.length} tasks)
          </span>
        </div>
        {/* Progress Bar */}
        <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 mt-3 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* 2. Planned vs Actual Time */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
          <span className="text-xs font-semibold">Study Duration</span>
          <Clock className="w-4 h-4 text-indigo-500" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900 dark:text-white">
            {formatMinutes(totalActualMins || 140)}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            / {formatMinutes(totalPlannedMins || 240)}
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 mt-3 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-teal-400 transition-all duration-500"
            style={{
              width: `${Math.min(100, Math.round(((totalActualMins || 140) / (totalPlannedMins || 240)) * 100))}%`,
            }}
          />
        </div>
      </div>

      {/* 3. Syllabus Mastery */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
          <span className="text-xs font-semibold">Topic Mastery</span>
          <Brain className="w-4 h-4 text-teal-500" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900 dark:text-white">
            {syllabusMasteryPercentage}%
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            ({masteredTopics}/{allTopics.length} mastered)
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 mt-3 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-teal-500 to-indigo-500 transition-all duration-500"
            style={{ width: `${syllabusMasteryPercentage}%` }}
          />
        </div>
      </div>

      {/* 4. Active Streak & Total XP */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
          <span className="text-xs font-semibold">Study Streak</span>
          <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {profile.streakDays} Days
          </span>
          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            {profile.totalXp} XP
          </span>
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 truncate">
          Top 5% consistency this week! 🔥
        </p>
      </div>
    </div>
  );
};
