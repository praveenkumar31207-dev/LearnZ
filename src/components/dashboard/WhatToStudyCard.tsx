'use client';

import React from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import {
  Sparkles,
  Play,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { formatMinutes } from '@/lib/utils';

export const WhatToStudyCard: React.FC = () => {
  const { whatShouldIStudyNow } = useAppStore();
  const recommendation = whatShouldIStudyNow();

  const task = recommendation.task;
  const topic = recommendation.topic;
  const subject = recommendation.subject;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white p-6 sm:p-8 shadow-xl shadow-indigo-950/20 border border-indigo-800/40">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-72 h-72 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-10 w-60 h-60 rounded-full bg-teal-500/10 blur-2xl pointer-events-none" />

      <div className="relative z-10">
        {/* Header Tag */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-semibold uppercase tracking-wider backdrop-blur">
            <Sparkles className="w-3.5 h-3.5 text-teal-300 animate-spin" />
            AI Real-Time Recommendation
          </div>

          {/* Priority Pill */}
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              recommendation.priorityTag === 'Critical'
                ? 'bg-rose-500/30 text-rose-300 border border-rose-500/50'
                : recommendation.priorityTag === 'High'
                ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50'
                : 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50'
            }`}
          >
            {recommendation.priorityTag} Priority
          </span>
        </div>

        {/* Question Title & Focus Topic */}
        <div className="space-y-1 mb-5">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            What Should I Study Now?
          </h2>
          <p className="text-sm text-indigo-200/80">
            Based on your upcoming deadlines, difficulty curves, and available study hours:
          </p>
        </div>

        {/* Focus Item Box */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-semibold text-teal-300 uppercase tracking-wider">
                {subject?.name || 'Recommended Target'}
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-white mt-0.5">
                {topic?.title || task?.title || 'Next High-Yield Module'}
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/30 border border-white/10 text-xs font-semibold text-slate-200">
                <Clock className="w-4 h-4 text-teal-400" />
                <span>{formatMinutes(recommendation.recommendedDurationMins)}</span>
              </div>
              {topic && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/30 border border-white/10 text-xs font-semibold text-slate-200">
                  <TrendingUp className="w-4 h-4 text-indigo-400" />
                  <span>{topic.difficulty}</span>
                </div>
              )}
            </div>
          </div>

          {/* AI Reasoning Points */}
          <div className="mt-4 pt-3.5 border-t border-white/10 space-y-1.5">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
              Why this topic now?
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {recommendation.reason.map((r, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-indigo-100/90">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span className="truncate">{r}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={task ? `/session/${task.id}` : `/session/task-1`}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-sm shadow-lg shadow-teal-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>Start Study Session</span>
          </Link>

          <Link
            href="/schedule"
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs border border-white/10 transition-colors"
          >
            <span>View Full Schedule</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
