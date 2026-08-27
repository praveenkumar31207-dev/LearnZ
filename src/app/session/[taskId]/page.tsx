'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { StudyTimer } from '@/components/session/StudyTimer';
import { DistractionLogger } from '@/components/session/DistractionLogger';
import { SessionNotes } from '@/components/session/SessionNotes';
import { ContextualTutor } from '@/components/session/ContextualTutor';
import { ComprehensionModal } from '@/components/session/ComprehensionModal';
import { UnderstandingRating, RescheduleAdjustmentPlan } from '@/types';
import {
  ArrowLeft,
  BookOpen,
  Clock,
  TrendingUp,
  Sparkles,
  Zap,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import { formatMinutes } from '@/lib/utils';

export default function StudySessionPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params.taskId as string;

  const { scheduleTasks, allTopics, subjects, completeStudySession } = useAppStore();

  const task = scheduleTasks.find((t) => t.id === taskId) || scheduleTasks[0];
  const topic = allTopics.find((t) => t.id === task?.topicId);
  const subject = subjects.find((s) => s.id === task?.subjectId);

  const [distractionCount, setDistractionCount] = useState(0);
  const [notes, setNotes] = useState('');
  const [actualDuration, setActualDuration] = useState(task?.plannedDurationMins || 50);
  const [showComprehensionModal, setShowComprehensionModal] = useState(false);
  const [rescheduleResult, setRescheduleResult] = useState<RescheduleAdjustmentPlan | null>(null);

  const focusScore = Math.max(40, 100 - distractionCount * 12);

  const handleFinishTimer = (elapsedMins: number) => {
    setActualDuration(elapsedMins);
    setShowComprehensionModal(true);
  };

  const handleConfirmComprehension = (rating: UnderstandingRating) => {
    const plan = completeStudySession(
      task?.id || taskId,
      actualDuration,
      rating,
      focusScore,
      distractionCount,
      notes
    );
    setRescheduleResult(plan);

    // Redirect to schedule or dashboard after 1.5s
    setTimeout(() => {
      router.push('/schedule');
    }, 1200);
  };

  if (!task) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-xl font-bold">Study Task Not Found</h2>
        <Link
          href="/schedule"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Schedule</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Breadcrumb & Task Header */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/schedule"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Timetable</span>
        </Link>

        <div className="flex items-center gap-2">
          <span
            className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-xs"
            style={{ backgroundColor: task.subjectColor || '#6366f1' }}
          >
            {task.subjectName || subject?.name || 'Study Module'}
          </span>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {task.priorityTag} Priority
          </span>
        </div>
      </div>

      {/* Hero Task Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Live Active Focus Mode
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            {task.title}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Planned Duration: {formatMinutes(task.plannedDurationMins)} • Difficulty: {topic?.difficulty || 'Medium'} • Current Mastery: {topic?.masteryPercentage || 0}%
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
            <Sparkles className="w-4 h-4 text-teal-400" />
            <span>AI Real-Time Rescheduling Active</span>
          </div>
        </div>
      </div>

      {/* Core Grid: Timer & Monitor (Left) + Notes & AI Tutor (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Timer & Distraction Monitor (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <StudyTimer
            initialMinutes={task.plannedDurationMins}
            onFinish={handleFinishTimer}
          />
          <DistractionLogger
            distractionCount={distractionCount}
            onAddDistraction={() => setDistractionCount((prev) => prev + 1)}
            focusScore={focusScore}
          />
        </div>

        {/* Right Column: Scratchpad & Live Tutor (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <SessionNotes
            topic={topic}
            notes={notes}
            onNotesChange={setNotes}
          />
          <ContextualTutor
            topicTitle={topic?.title || task.title}
            subjectName={task.subjectName}
          />
        </div>
      </div>

      {/* Post-Session Comprehension Modal */}
      <ComprehensionModal
        isOpen={showComprehensionModal}
        topicTitle={task.title}
        plannedMins={task.plannedDurationMins}
        actualMins={actualDuration}
        onConfirm={handleConfirmComprehension}
        reschedulePlan={rescheduleResult}
      />
    </div>
  );
}
