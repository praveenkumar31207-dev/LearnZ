'use client';

import React, { useState } from 'react';
import { UnderstandingRating, RescheduleAdjustmentPlan } from '@/types';
import {
  Sparkles,
  Frown,
  Meh,
  Smile,
  CheckCircle,
  Zap,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ComprehensionModalProps {
  isOpen: boolean;
  topicTitle: string;
  plannedMins: number;
  actualMins: number;
  onConfirm: (rating: UnderstandingRating) => void;
  reschedulePlan?: RescheduleAdjustmentPlan | null;
}

export const ComprehensionModal: React.FC<ComprehensionModalProps> = ({
  isOpen,
  topicTitle,
  plannedMins,
  actualMins,
  onConfirm,
  reschedulePlan,
}) => {
  const [selectedRating, setSelectedRating] = useState<UnderstandingRating>('understood');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const diffMins = plannedMins - actualMins;

  const ratings: {
    id: UnderstandingRating;
    label: string;
    description: string;
    icon: any;
    color: string;
  }[] = [
    {
      id: 'didnt_understand',
      label: "Didn't Understand",
      description: 'Need complete re-explanation. Schedules Day 1 spaced recall.',
      icon: Frown,
      color: 'border-rose-300 text-rose-600 bg-rose-50 dark:bg-rose-950/40',
    },
    {
      id: 'partially_understood',
      label: 'Partially Understood',
      description: 'Grasped core basics but confused on advanced edge cases.',
      icon: Meh,
      color: 'border-amber-300 text-amber-600 bg-amber-50 dark:bg-amber-950/40',
    },
    {
      id: 'understood',
      label: 'Understood',
      description: 'Solid conceptual grip. Ready for standard spaced review.',
      icon: Smile,
      color: 'border-indigo-300 text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40',
    },
    {
      id: 'fully_understood',
      label: 'Fully Mastered',
      description: 'Flawless recall! Can solve exam problems with ease.',
      icon: CheckCircle,
      color: 'border-emerald-300 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40',
    },
  ];

  const handleSubmit = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
    setSubmitted(true);
    onConfirm(selectedRating);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-teal-400 text-white flex items-center justify-center mx-auto shadow-md">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Session Completed! 🎉
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {topicTitle} ({actualMins} mins studied)
          </p>
        </div>

        {/* Time Difference Badge */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between">
          <span className="text-slate-600 dark:text-slate-300">
            Planned vs Actual:
          </span>
          <span
            className={`font-bold px-2.5 py-1 rounded-lg ${
              diffMins > 0
                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                : diffMins < 0
                ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            {diffMins > 0
              ? `⚡ ${diffMins} min saved (Finished Early)`
              : diffMins < 0
              ? `⏳ ${Math.abs(diffMins)} min delay`
              : `🎯 Exactly on time`}
          </span>
        </div>

        {/* 4-Level Understanding Question */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
            How well did you understand this topic?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {ratings.map((r) => {
              const Icon = r.icon;
              const isSelected = selectedRating === r.id;

              return (
                <button
                  key={r.id}
                  onClick={() => setSelectedRating(r.id)}
                  type="button"
                  className={`flex flex-col text-left p-3.5 rounded-2xl border-2 transition-all ${
                    isSelected
                      ? `${r.color} shadow-sm ring-2 ring-indigo-500/20`
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="w-4 h-4" />
                    <span className="text-xs font-bold">{r.label}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                    {r.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Confirm Button */}
        <button
          onClick={handleSubmit}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md shadow-indigo-600/30 transition-all hover:scale-[1.01]"
        >
          <span>Confirm & Update Spaced Learning Schedule</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
