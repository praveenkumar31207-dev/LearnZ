'use client';

import React, { useState } from 'react';
import { CheatsheetItem } from '@/types';
import { X, Copy, Check, Sparkles, BookOpen, Download, Terminal, Lightbulb } from 'lucide-react';

interface CheatsheetViewerModalProps {
  cheatsheet: CheatsheetItem;
  onClose: () => void;
}

export const CheatsheetViewerModal: React.FC<CheatsheetViewerModalProps> = ({
  cheatsheet,
  onClose,
}) => {
  const [copiedCodeIdx, setCopiedCodeIdx] = useState<number | null>(null);

  const handleCopyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIdx(idx);
    setTimeout(() => setCopiedCodeIdx(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-2xl max-h-[90vh] rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4 bg-slate-50/50 dark:bg-slate-850/50">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white uppercase tracking-wider"
                style={{ backgroundColor: cheatsheet.subjectColor || '#6366f1' }}
              >
                {cheatsheet.subjectName}
              </span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {cheatsheet.category}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
              {cheatsheet.title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 dark:text-slate-200">
          {/* Summary */}
          <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 text-xs text-indigo-950 dark:text-indigo-200 leading-relaxed flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
            <p>{cheatsheet.summary}</p>
          </div>

          {/* Key Formulas / Rules */}
          {cheatsheet.keyFormulas && cheatsheet.keyFormulas.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                Key Formulas & Mathematical Definitions
              </h4>

              <div className="grid grid-cols-1 gap-2.5">
                {cheatsheet.keyFormulas.map((f, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-1"
                  >
                    <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      {f.label}
                    </div>
                    <div className="font-mono text-xs sm:text-sm font-black text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-750">
                      {f.formula}
                    </div>
                    {f.explanation && (
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 pt-0.5">
                        {f.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Syntax Code Snippets */}
          {cheatsheet.syntaxSnippets && cheatsheet.syntaxSnippets.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-teal-500" />
                Syntax Reference & Implementation Patterns
              </h4>

              <div className="space-y-3">
                {cheatsheet.syntaxSnippets.map((snip, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl bg-slate-900 text-slate-100 border border-slate-800 overflow-hidden text-xs"
                  >
                    <div className="px-4 py-2 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
                      <span className="font-bold text-slate-300">{snip.title}</span>
                      <button
                        onClick={() => handleCopyCode(snip.code, idx)}
                        className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-white transition-colors"
                      >
                        {copiedCodeIdx === idx ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400 font-bold">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="p-4 font-mono text-xs overflow-x-auto text-emerald-400 bg-slate-950">
                      <code>{snip.code}</code>
                    </pre>
                    {snip.note && (
                      <div className="px-4 py-2 bg-slate-900/90 text-[11px] text-slate-400 border-t border-slate-800/60">
                        💡 {snip.note}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rules of Thumb */}
          {cheatsheet.rulesOfThumb && cheatsheet.rulesOfThumb.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                Exam Tips & Rules of Thumb
              </h4>
              <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/50 space-y-1.5 text-xs text-amber-950 dark:text-amber-200">
                {cheatsheet.rulesOfThumb.map((r, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>{r}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Last verified: {cheatsheet.lastUpdated || 'August 2026'}
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors"
          >
            Close Cheatsheet
          </button>
        </div>
      </div>
    </div>
  );
};
