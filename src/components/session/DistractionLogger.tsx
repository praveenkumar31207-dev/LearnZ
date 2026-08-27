'use client';

import React from 'react';
import { ShieldAlert, Plus, Zap } from 'lucide-react';

interface DistractionLoggerProps {
  distractionCount: number;
  onAddDistraction: () => void;
  focusScore: number;
}

export const DistractionLogger: React.FC<DistractionLoggerProps> = ({
  distractionCount,
  onAddDistraction,
  focusScore,
}) => {
  return (
    <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-900 dark:text-white">
          <ShieldAlert className="w-4 h-4 text-amber-500" />
          <h3 className="text-xs font-bold uppercase tracking-wider">
            Focus & Distraction Monitor
          </h3>
        </div>
        <span
          className={`text-xs font-bold px-2 py-0.5 rounded-full ${
            focusScore >= 85
              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
              : focusScore >= 70
              ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
              : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
          }`}
        >
          {focusScore}% Focus Score
        </span>
      </div>

      <p className="text-[11px] text-slate-500 dark:text-slate-400">
        Record brief moments of mind-wandering or notification interruptions to train your attention span.
      </p>

      <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Distractions Logged:
          </span>
          <span className="ml-2 font-bold text-slate-900 dark:text-white">
            {distractionCount}
          </span>
        </div>

        <button
          onClick={onAddDistraction}
          type="button"
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 hover:bg-amber-100 border border-amber-200 dark:border-amber-800 text-xs font-semibold transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Log Distraction</span>
        </button>
      </div>
    </div>
  );
};
