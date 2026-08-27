'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import {
  Target,
  Calendar,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Flame,
  ArrowRight,
} from 'lucide-react';
import { calculateDaysRemaining, formatRelativeDays } from '@/lib/utils';
import confetti from 'canvas-confetti';

export default function ExamsPage() {
  const { academicEvents, subjects, allTopics, regenerateSchedule, addNotification } =
    useAppStore();

  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);

  const handleActivateEmergencyPlan = () => {
    regenerateSchedule();
    addNotification({
      title: 'Exam Emergency War-Room Plan Active 🎯',
      message:
        'AI concentrated upcoming timetable slots on critical-weight exam topics and scheduled daily mock drills.',
      notificationType: 'exam_warning',
    });

    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    setEmergencyModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <Target className="w-7 h-7 text-rose-600 dark:text-rose-400" />
            Exam Preparation War-Room
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Readiness risk prediction, syllabus coverage meters, and high-yield crunch restructuring.
          </p>
        </div>

        <button
          onClick={() => setEmergencyModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-600/30 transition-all hover:scale-105"
        >
          <Flame className="w-4 h-4" />
          <span>Emergency Cram & Restructure</span>
        </button>
      </div>

      {/* Exam Countdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {academicEvents.map((evt) => {
          const daysLeft = calculateDaysRemaining(evt.eventDate);
          const subj = subjects.find((s) => s.id === evt.subjectId);

          const subjTopics = allTopics.filter((t) =>
            subj?.units?.some((u) => u.chapters?.some((c) => c.topics?.some((tp) => tp.id === t.id)))
          );

          const completedSubjTopics = subjTopics.filter((t) => t.isCompleted);
          const coveragePercent =
            subjTopics.length > 0
              ? Math.round((completedSubjTopics.length / subjTopics.length) * 100)
              : 0;

          const isUrgent = daysLeft <= 7;
          const status =
            coveragePercent >= 80
              ? 'Ahead of Schedule 🚀'
              : coveragePercent >= 50
              ? 'On Track 🎯'
              : 'At Risk / Behind Schedule ⚠️';

          return (
            <div
              key={evt.id}
              className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between space-y-5"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: evt.subjectColor || '#6366f1' }}
                  >
                    {evt.subjectName}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                      isUrgent
                        ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                        : 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                    }`}
                  >
                    {formatRelativeDays(evt.eventDate)}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {evt.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Weightage: {evt.weightagePercentage}% of final course grade
                </p>

                {/* Coverage Progress Bar */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-600 dark:text-slate-400">
                      Syllabus Coverage:
                    </span>
                    <span className="text-slate-900 dark:text-white">{coveragePercent}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-teal-400 transition-all duration-500"
                      style={{ width: `${coveragePercent}%` }}
                    />
                  </div>
                </div>

                {/* Risk Status */}
                <div className="mt-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                    AI Readiness Prediction
                  </span>
                  <span
                    className={`font-bold ${
                      coveragePercent >= 80
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : coveragePercent >= 50
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {status}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <span>{daysLeft} Days Remaining</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  {subjTopics.length - completedSubjTopics.length} Topics Left
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Emergency Cram Modal */}
      {emergencyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Activate Exam Mode Restructuring
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                The AI will dynamically prioritize High and Critical weightage chapters, compressing lower-priority study blocks into focused rapid-fire recall drills.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/50 space-y-1.5 text-xs text-rose-900 dark:text-rose-200">
              <p>✓ Shifts 80% daily study time to exams occurring in &lt;14 days.</p>
              <p>✓ Inserts high-yield quiz drills at the end of each session.</p>
              <p>✓ Protects 15-minute rest breaks to avoid cognitive burnout.</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setEmergencyModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleActivateEmergencyPlan}
                className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-600/30"
              >
                Activate Restructure
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
