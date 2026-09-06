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
  BookOpen,
  GraduationCap,
  ShieldCheck,
} from 'lucide-react';
import { formatMinutes } from '@/lib/utils';

export const WhatToStudyCard: React.FC = () => {
  const { whatShouldIStudyNow, profile } = useAppStore();
  const recommendation = whatShouldIStudyNow();

  const task = recommendation.task;
  const topic = recommendation.topic;
  const subject = recommendation.subject;
  const skill = recommendation.skill;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-950 via-slate-900 to-slate-950 text-white p-6 sm:p-8 shadow-xl shadow-blue-950/20 border border-blue-800/40">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-72 h-72 rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-10 w-60 h-60 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />

      <div className="relative z-10">
        {/* Header Tag */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold uppercase tracking-wider backdrop-blur">
            <Sparkles className="w-3.5 h-3.5 text-blue-300 animate-spin" />
            AI Personalized Learning Path Recommendation
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
            {recommendation.priorityTag} Priority Gap
          </span>
        </div>

        {/* Question Title & Focus Topic */}
        <div className="space-y-1 mb-5">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Recommended Capacity Building Module
          </h2>
          <p className="text-sm text-blue-200/80">
            Intelligently derived from your current competency gaps, job role in{' '}
            <span className="font-semibold text-white">{profile.department}</span>, and iGOT Karmayogi curriculum:
          </p>
        </div>

        {/* Focus Item Box */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4" />
                {skill?.domainName || subject?.name || 'Technical Competencies'}
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-white mt-0.5">
                {task?.title || skill?.title || 'Data Visualization & Interactive Dashboarding'}
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/30 border border-white/10 text-xs font-semibold text-slate-200">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>{formatMinutes(recommendation.recommendedDurationMins || 60)}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/30 border border-white/10 text-xs font-semibold text-slate-200">
                <BookOpen className="w-4 h-4 text-blue-400" />
                <span>iGOT Karmayogi</span>
              </div>
            </div>
          </div>

          {/* AI Reasoning Points */}
          <div className="mt-4 pt-3.5 border-t border-white/10 space-y-1.5">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
              Why this training module now?
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {recommendation.reason.map((r, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-blue-100/90">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">{r}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={task ? `/session/${task.id}` : `/resources`}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Start Learning (iGOT Module)</span>
          </Link>

          <Link
            href="/schedule"
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs border border-white/10 transition-colors"
          >
            <span>View Full AI Learning Path</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <Link
            href="/quizzes"
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 font-medium text-xs border border-emerald-400/30 transition-colors"
          >
            <span>Take Diagnostic Assessment</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
