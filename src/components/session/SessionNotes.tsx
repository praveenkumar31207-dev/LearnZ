'use client';

import React from 'react';
import { BookOpen, FileText, Code2 } from 'lucide-react';
import { Topic } from '@/types';

interface SessionNotesProps {
  topic?: Topic;
  notes: string;
  onNotesChange: (val: string) => void;
}

export const SessionNotes: React.FC<SessionNotesProps> = ({
  topic,
  notes,
  onNotesChange,
}) => {
  return (
    <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex items-center gap-2 text-slate-900 dark:text-white">
        <FileText className="w-4 h-4 text-indigo-500" />
        <h3 className="text-xs font-bold uppercase tracking-wider">
          Scratchpad & Active Notes
        </h3>
      </div>

      {/* Key Formulas or Definitions (if available for topic) */}
      {(topic?.keyFormulas?.length || topic?.keyDefinitions?.length) ? (
        <div className="p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 flex items-center gap-1">
            <Code2 className="w-3.5 h-3.5" /> Key Formulas & Syntax Reference
          </span>
          <div className="space-y-1">
            {topic.keyFormulas?.map((f, i) => (
              <div
                key={i}
                className="text-xs font-mono bg-white dark:bg-slate-900 px-2 py-1 rounded-lg border border-indigo-200/50 dark:border-indigo-800/50 text-indigo-900 dark:text-indigo-200"
              >
                {f}
              </div>
            ))}
            {topic.keyDefinitions?.map((d, i) => (
              <div key={i} className="text-xs text-slate-700 dark:text-slate-300">
                • {d}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Scratchpad Textarea */}
      <textarea
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        placeholder="Type rough notes, unsolved questions, key insights, or exam reminders..."
        className="w-full h-36 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 resize-none font-sans leading-relaxed"
      />
    </div>
  );
};
