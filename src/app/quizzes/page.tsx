'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { ActiveQuiz } from '@/components/quizzes/ActiveQuiz';
import {
  HelpCircle,
  Sparkles,
  Award,
  Clock,
  RotateCcw,
  CheckCircle2,
  Plus,
  Play,
} from 'lucide-react';
import { Quiz, DifficultyLevel } from '@/types';

export default function QuizzesPage() {
  const { quizzes, allTopics, subjects, addQuiz, quizAttempts } = useAppStore();

  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(quizzes[0] || null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Generator State
  const [topicId, setTopicId] = useState(allTopics[0]?.id || '');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Medium');

  const handleGenerateQuiz = async () => {
    const topic = allTopics.find((t) => t.id === topicId);
    if (!topic) return;

    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicTitle: topic.title,
          difficulty,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const newQuiz: Quiz = {
          id: `quiz-${Date.now()}`,
          userId: 'user-demo-1',
          topicId: topic.id,
          title: `${topic.title} AI Diagnostic Drill`,
          difficulty,
          questions: data.questions || [],
          createdAt: new Date().toISOString(),
        };

        addQuiz(newQuiz);
        setSelectedQuiz(newQuiz);
        setShowCreateModal(false);
      }
    } catch (err) {
      console.warn('Quiz gen error', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <HelpCircle className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            AI-Generated Quizzes & Drills
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Test retention with adaptive conceptual questions, MCQs, and coding challenges.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all hover:scale-105"
        >
          <Sparkles className="w-4 h-4" />
          <span>Generate AI Quiz</span>
        </button>
      </div>

      {/* Grid: Active Quiz Screen (Left 7 cols) + Quiz List & Attempts (Right 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Active Quiz */}
        <div className="lg:col-span-7 space-y-6">
          {selectedQuiz ? (
            <ActiveQuiz quiz={selectedQuiz} />
          ) : (
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-12 text-center space-y-4">
              <Sparkles className="w-12 h-12 text-indigo-500 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                No Quiz Selected
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Select a quiz from the library on the right or generate a new diagnostic test with AI.
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Quiz Library & Past Attempts */}
        <div className="lg:col-span-5 space-y-6">
          {/* Library */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Quiz Library
            </h3>

            <div className="space-y-2.5 max-h-[280px] overflow-y-auto">
              {quizzes.map((q) => {
                const isSelected = q.id === selectedQuiz?.id;

                return (
                  <div
                    key={q.id}
                    onClick={() => setSelectedQuiz(q)}
                    className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between gap-3 transition-all ${
                      isSelected
                        ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-700 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {q.title}
                      </h4>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">
                        {q.questions?.length || 0} Questions • Difficulty: {q.difficulty}
                      </span>
                    </div>

                    <span className="p-1.5 rounded-xl bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-slate-800">
                      <Play className="w-3.5 h-3.5 fill-indigo-600 dark:fill-indigo-400" />
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Past Attempts */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              Recent Quiz Scores
            </h3>

            <div className="space-y-2.5 max-h-[220px] overflow-y-auto">
              {quizAttempts.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">
                  No quiz submissions yet.
                </p>
              ) : (
                quizAttempts.map((att) => (
                  <div
                    key={att.id}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[200px]">
                        {att.quizTitle}
                      </h5>
                      <span className="text-[10px] text-slate-500">
                        {att.score}/{att.totalPossible} correct
                      </span>
                    </div>

                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-xl ${
                        att.accuracyPercentage >= 75
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                          : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                      }`}
                    >
                      {att.accuracyPercentage}%
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Generate AI Quiz Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-400" />
              Generate AI Diagnostic Drill
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Select Topic
                </label>
                <select
                  value={topicId}
                  onChange={(e) => setTopicId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                >
                  {allTopics.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Target Difficulty
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                >
                  <option value="Easy">Easy (Conceptual Fundamentals)</option>
                  <option value="Medium">Medium (Standard Exam Problems)</option>
                  <option value="Hard">Hard (Edge Cases & Tricky Traps)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateQuiz}
                disabled={isGenerating}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold shadow-sm"
              >
                {isGenerating ? 'Generating with AI...' : 'Create Quiz'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
