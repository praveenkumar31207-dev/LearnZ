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
} from 'lucide-react';

export const WeakTopicsAlert: React.FC = () => {
  const { weakTopics } = useAppStore();

  if (weakTopics.length === 0) return null;

  return (
    <div className="rounded-3xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300">
          <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400" />
          <h3 className="font-bold text-sm sm:text-base">
            Weak Topic Diagnostic Radar
          </h3>
        </div>
        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
          {weakTopics.length} Priority Alerts
        </span>
      </div>

      <p className="text-xs text-rose-900/70 dark:text-rose-300/70 mb-4">
        The AI detected low mastery or difficulty ratings on these topics. Targeted practice is recommended:
      </p>

      <div className="space-y-2.5">
        {weakTopics.slice(0, 3).map(({ topic, weakReason }) => (
          <div
            key={topic.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-rose-100 dark:border-rose-900/40 shadow-xs"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  {topic.title}
                </h4>
                <span className="text-[10px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950 px-1.5 py-0.5 rounded">
                  {topic.masteryPercentage}% Mastery
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 pl-4">
                {weakReason}
              </p>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center pl-4 sm:pl-0">
              <Link
                href={`/quizzes?topicId=${topic.id}`}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 text-xs font-semibold border border-indigo-200 dark:border-indigo-800 transition-colors"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Drill Quiz</span>
              </Link>
              <Link
                href={`/tutors?topic=${encodeURIComponent(topic.title)}`}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Ask Tutor</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
