'use client';

import React from 'react';
import Link from 'next/link';
import { Check, Sparkles, Zap, ArrowRight, ShieldCheck, Heart } from 'lucide-react';

export const PricingTiersSection: React.FC = () => {
  return (
    <section id="pricing" className="py-24 relative bg-slate-900/40 border-y border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            100% Student-First Pricing
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            World-Class Academic AI For Every Student
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            No expensive monthly subscriptions, no gated study schedules, no paywalls before final exams. Get started immediately with full access.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Tier 1: Free Community Access */}
          <div className="p-8 rounded-3xl bg-slate-950/90 border border-slate-800 shadow-xl flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Standard Student
                </span>
                <h3 className="text-2xl font-bold text-white mt-1">Free Forever</h3>
                <p className="text-xs text-slate-400 mt-2">
                  Complete adaptive scheduling & spaced repetition with private offline local storage.
                </p>
              </div>

              <div className="flex items-baseline gap-1 text-white">
                <span className="text-4xl font-black font-mono">$0</span>
                <span className="text-xs text-slate-400">/ forever</span>
              </div>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Real-Time Autonomous Dynamic Rescheduler</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Spaced Repetition Decay Tracker (1d/3d/7d/14d/30d)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Syllabus Chapter Tree & Weightage % Maps</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Pomodoro & Flow Focus Session Timer</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Offline PWA Mobile & Tablet Support</span>
                </div>
              </div>
            </div>

            <Link
              href="/dashboard"
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-slate-900 hover:bg-slate-850 text-white text-xs font-bold border border-slate-700 transition-colors"
            >
              <span>Start Free (No Signup Needed)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Tier 2: Cloud Sync & AI Supercharged */}
          <div className="relative p-8 rounded-3xl bg-gradient-to-b from-indigo-950/60 via-slate-950 to-slate-950 border-2 border-indigo-500/50 shadow-2xl shadow-indigo-950/60 flex flex-col justify-between space-y-8">
            <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-teal-400 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-md">
              Most Popular
            </div>

            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  Full AI Academic Suite
                </span>
                <h3 className="text-2xl font-bold text-white mt-1">Supercharged Scholar</h3>
                <p className="text-xs text-slate-400 mt-2">
                  Cloud synchronization across all your devices, 24/7 Socratic AI mentors, and Exam War-Room.
                </p>
              </div>

              <div className="flex items-baseline gap-1 text-white">
                <span className="text-4xl font-black font-mono">$0</span>
                <span className="text-xs text-slate-400">/ Open Access tier</span>
              </div>

              <div className="space-y-3 text-xs text-slate-200">
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-teal-400 shrink-0" />
                  <span className="font-semibold text-white">Everything in Free Forever</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Unlimited 24/7 Socratic AI Tutors (CS, Med, Law, Math)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Supabase Multi-Device Cloud Synchronization</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Exam War-Room High-Yield Burn-Down Engine</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>AI-Generated Diagnostic Active Recall Quizzes</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Curated "Where Should I Learn This?" Resource Box</span>
                </div>
              </div>
            </div>

            <Link
              href="/onboarding"
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-teal-500 hover:from-indigo-500 hover:to-teal-400 text-white text-xs font-extrabold shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.01]"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch Full Suite Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
