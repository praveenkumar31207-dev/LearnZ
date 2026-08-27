'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import {
  UploadCloud,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileCode,
  ArrowRight,
} from 'lucide-react';

interface MaterialUploaderProps {
  subjectId: string;
  subjectName: string;
  onSuccess?: () => void;
}

export const MaterialUploader: React.FC<MaterialUploaderProps> = ({
  subjectId,
  subjectName,
  onSuccess,
}) => {
  const { bulkAddParsedHierarchy, addNotification } = useAppStore();
  const [rawText, setRawText] = useState('');
  const [fileName, setFileName] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [extractedUnits, setExtractedUnits] = useState<any[] | null>(null);

  const sampleSyllabus = `Unit 1: Advanced Java & Concurrency
Chapter 1: Thread Fundamentals
- Thread Lifecycle & States
- Synchronization and Locks
- Deadlocks and Race Conditions
- Thread Pools & ExecutorService

Unit 2: Java Virtual Machine & Memory
Chapter 2: JVM Architecture
- ClassLoader Subsystem
- JVM Memory Model (Heap, Stack, Metaspace)
- Garbage Collection Algorithms (G1, ZGC)
- Bytecode Execution & JIT Compilation`;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setRawText(text || sampleSyllabus);
    };
    reader.readAsText(file);
  };

  const handleAnalyze = async () => {
    const content = rawText.trim() || sampleSyllabus;
    setIsAnalyzing(true);

    try {
      const res = await fetch('/api/ai/syllabus-extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawText: content,
          subjectName,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setExtractedUnits(data.units || []);
      }
    } catch (err) {
      console.warn('Analysis error', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApply = () => {
    if (!extractedUnits || extractedUnits.length === 0) return;
    bulkAddParsedHierarchy(subjectId, extractedUnits);

    addNotification({
      title: 'Syllabus Hierarchy Created 📚',
      message: `AI structured ${extractedUnits.length} units and associated topics for ${subjectName}.`,
      notificationType: 'schedule_update',
    });

    if (onSuccess) onSuccess();
  };

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              AI Syllabus & Material Ingestion
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Upload PDF, DOCX, notes, or syllabus text to auto-generate a structured learning hierarchy.
            </p>
          </div>
        </div>
      </div>

      {!extractedUnits ? (
        <div className="space-y-4">
          {/* File Dropzone */}
          <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 rounded-2xl p-6 text-center transition-colors">
            <input
              type="file"
              accept=".txt,.pdf,.docx,.doc,.pptx,.md"
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <UploadCloud className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              {fileName ? `Selected: ${fileName}` : 'Drop course syllabus, notes, or chapter outline here'}
            </p>
            <p className="text-[10px] text-slate-400 mt-1">
              Supports PDF, DOCX, PPTX, TXT, or Markdown
            </p>
          </div>

          {/* Paste Syllabus Content */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Or Paste Syllabus / Notes Text Directly:
              </label>
              <button
                type="button"
                onClick={() => setRawText(sampleSyllabus)}
                className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Insert Sample Syllabus
              </button>
            </div>
            <textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Paste units, chapters, and bulleted topics here..."
              className="w-full h-32 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 resize-none"
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all hover:scale-[1.01]"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isAnalyzing ? 'Analyzing & Structuring Syllabus...' : 'Analyze with AI Curriculum Engine'}</span>
          </button>
        </div>
      ) : (
        /* Preview extracted hierarchy */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Successfully Extracted {extractedUnits.length} Units!
            </span>
            <button
              onClick={() => setExtractedUnits(null)}
              className="text-xs text-slate-500 hover:underline"
            >
              Re-upload
            </button>
          </div>

          <div className="max-h-64 overflow-y-auto space-y-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 divide-y divide-slate-200 dark:divide-slate-800">
            {extractedUnits.map((unit, idx) => (
              <div key={idx} className="pt-2 first:pt-0 space-y-1.5">
                <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  {unit.title}
                </h4>
                {(unit.chapters || []).map((chap: any, cIdx: number) => (
                  <div key={cIdx} className="pl-3 space-y-1">
                    <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                      📂 {chap.title}
                    </p>
                    <div className="pl-4 space-y-0.5">
                      {(chap.topics || []).map((tp: any, tIdx: number) => (
                        <div
                          key={tIdx}
                          className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-between"
                        >
                          <span>• {tp.title}</span>
                          <span className="font-semibold text-indigo-500">
                            {tp.estimatedMins}m | {tp.difficulty}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <button
            onClick={handleApply}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition-all hover:scale-[1.01]"
          >
            <span>Apply Hierarchy to {subjectName}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
