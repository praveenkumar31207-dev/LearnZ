'use client';

import React from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import {
  Calendar,
  AlertCircle,
  Clock,
  Target,
  ArrowRight,
} from 'lucide-react';
import { formatRelativeDays, calculateDaysRemaining } from '@/lib/utils';

export const UpcomingDeadlines: React.FC = () => {
  const { academicEvents } = useAppStore();

  const sortedEvents = [...academicEvents].sort(
    (a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
  );

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-4">
        <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
          <Target className="w-4 h-4 text-indigo-500" />
          Academic Deadlines & Exams
        </h3>
        <Link
          href="/exams"
          className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1"
        >
          <span>War-Room</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="space-y-3">
        {sortedEvents.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-500 dark:text-slate-400">
            No upcoming exams or assessments.
          </div>
        ) : (
          sortedEvents.map((evt) => {
            const daysLeft = calculateDaysRemaining(evt.eventDate);
            const isUrgent = daysLeft <= 7;

            return (
              <div
                key={evt.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-2.5 h-10 rounded-full shrink-0"
                    style={{ backgroundColor: evt.subjectColor || '#6366f1' }}
                  />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {evt.subjectName}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {evt.title}
                    </h4>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                      isUrgent
                        ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                        : 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                    }`}
                  >
                    {formatRelativeDays(evt.eventDate)}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {evt.weightagePercentage}% Final Weight
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
