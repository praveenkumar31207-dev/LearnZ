'use client';

import React, { useState } from 'react';
import { SpacedRevision, UnderstandingRating, Topic } from '@/types';
import { useAppStore } from '@/lib/store';
import {
  RotateCcw,
  Sparkles,
  CheckCircle,
  Clock,
  Award,
  Layers,
  HelpCircle,
} from 'lucide-react';

interface FlashRevisionCardProps {
  revision: SpacedRevision;
  topic?: Topic;
  onRated: () => void;
}

export const FlashRevisionCard: React.FC<FlashRevisionCardProps> = ({
  revision,
  topic,
  onRated,
}) => {
  const { recordRevisionRating } = useAppStore();
  const [isFlipped, setIsFlipped] = useState(false);

  const handleRating = (rating: UnderstandingRating) => {
    recordRevisionRating(revision.topicId, rating);
    onRated();
  };

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: revision.subjectColor || '#6366f1' }}
          />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {revision.subjectName}
          </span>
        </div>

        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
          SM-2 Repetition #{revision.repetitionNumber}
        </span>
      </div>

      {/* Card Content / Flash Flip */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="min-h-[180px] p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-50/30 dark:from-slate-850 dark:to-indigo-950/20 border border-slate-200 dark:border-slate-800 flex flex-col justify-between cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-700 transition-all shadow-inner"
      >
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            {!isFlipped ? '🧠 ACTIVE RECALL PROMPT' : '💡 CONCEPT & FORMULA SUMMARY'}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-1">
            {revision.topicTitle}
          </h3>

          {isFlipped && (
            <div className="mt-3 space-y-2 text-xs text-slate-700 dark:text-slate-300 animate-in fade-in">
              {topic?.keyFormulas?.map((f, i) => (
                <div
                  key={i}
                  className="font-mono bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-indigo-700 dark:text-indigo-300 text-[11px]"
                >
                  {f}
                </div>
              ))}
              {topic?.keyDefinitions?.map((d, i) => (
                <div key={i} className="text-[11px] text-slate-600 dark:text-slate-400">
                  • {d}
                </div>
              ))}
              {(!topic?.keyFormulas?.length && !topic?.keyDefinitions?.length) && (
                <p className="text-[11px] text-slate-500">
                  Recall the key mechanisms, definitions, and code syntax for this topic.
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-slate-200/60 dark:border-slate-800">
          <span>Click card to {!isFlipped ? 'reveal answer' : 'hide answer'}</span>
          <RotateCcw className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* SM-2 Recall Rating Buttons */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block text-center">
          Rate your recall accuracy:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            onClick={() => handleRating('didnt_understand')}
            className="p-2 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs font-bold hover:scale-[1.02] transition-transform"
          >
            Forgot (Day 1)
          </button>
          <button
            onClick={() => handleRating('partially_understood')}
            className="p-2 rounded-xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-xs font-bold hover:scale-[1.02] transition-transform"
          >
            Hard (Day 2)
          </button>
          <button
            onClick={() => handleRating('understood')}
            className="p-2 rounded-xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-xs font-bold hover:scale-[1.02] transition-transform"
          >
            Good (Day 5)
          </button>
          <button
            onClick={() => handleRating('fully_understood')}
            className="p-2 rounded-xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold hover:scale-[1.02] transition-transform"
          >
            Easy (Day 10+)
          </button>
        </div>
      </div>
    </div>
  );
};
