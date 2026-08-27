'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { FlashRevisionCard } from '@/components/revisions/FlashRevisionCard';
import {
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Clock,
  Award,
  Layers,
  Brain,
  Calendar,
} from 'lucide-react';
import { formatRelativeDays } from '@/lib/utils';
import { SpacedRevision } from '@/types';

export default function RevisionsPage() {
  const { spacedRevisions, allTopics } = useAppStore();
  const [activeRevision, setActiveRevision] = useState<SpacedRevision | null>(
    spacedRevisions[0] || null
  );

  const activeTopic = allTopics.find((t) => t.id === activeRevision?.topicId);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <RotateCcw className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            Spaced Repetition & Revision Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            SuperMemo SM-2 algorithm queues topics at mathematically optimal intervals to prevent forgetting.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
            {spacedRevisions.length} Topics in Active SM-2 Queue
          </span>
        </div>
      </div>

      {/* Grid: Flash Card (Left 7 cols) + Queue List (Right 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Active Recall Flash Card */}
        <div className="lg:col-span-7 space-y-6">
          {activeRevision ? (
            <FlashRevisionCard
              revision={activeRevision}
              topic={activeTopic}
              onRated={() => {
                const next = spacedRevisions.find((r) => r.id !== activeRevision.id);
                setActiveRevision(next || null);
              }}
            />
          ) : (
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-12 text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                All Spaced Revisions Completed! 🎉
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Your brain has consolidated all reviewed material. New review cards will appear as future intervals elapse.
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Due Queue List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Brain className="w-4 h-4 text-teal-500" />
              Active Spaced Revision Queue
            </h3>

            <div className="space-y-2.5 max-h-[460px] overflow-y-auto">
              {spacedRevisions.map((rev) => {
                const isSelected = rev.id === activeRevision?.id;

                return (
                  <div
                    key={rev.id}
                    onClick={() => setActiveRevision(rev)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-700 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: rev.subjectColor || '#6366f1' }}
                        />
                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[180px]">
                          {rev.topicTitle}
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900 px-2 py-0.5 rounded-md border border-indigo-100 dark:border-indigo-900">
                        {rev.intervalDays}d Interval
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 pl-4">
                      <span>{rev.subjectName}</span>
                      <span>Repetition #{rev.repetitionNumber}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
