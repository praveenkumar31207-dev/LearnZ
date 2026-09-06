'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Smartphone,
  ShieldCheck,
  Globe,
  Zap,
  BookOpen,
  Calendar,
  RotateCcw,
  Bot,
  Target,
} from 'lucide-react';

export const LandingFooter: React.FC = () => {
  const handleTriggerPwa = () => {
    const event = new CustomEvent('trigger-pwa-install');
    window.dispatchEvent(event);
    alert(
      '📱 Install CogniStudy as a Web App:\n\n• On Desktop / Chrome / Edge: Click the Install icon in your address bar (⬇️)\n• On iPhone / iPad (Safari): Tap the Share button & tap "Add to Home Screen"'
    );
  };

  return (
    <footer className="relative bg-slate-950 border-t border-slate-800 text-slate-400 text-xs">
      {/* Call to Action Banner Above Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -translate-y-12">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-indigo-900/80 via-slate-900 to-teal-950/80 border border-indigo-500/30 shadow-2xl backdrop-blur-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Ready to Upgrade Your Academic Performance?
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
              Start in 10 seconds. CogniStudy generates your initial adaptive timetable with zero friction.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <Link
              href="/onboarding"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-teal-500 hover:from-indigo-500 hover:to-teal-400 text-white font-extrabold text-xs shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch Onboarding Wizard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={handleTriggerPwa}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs transition-colors"
            >
              <Smartphone className="w-4 h-4 text-teal-400" />
              <span>Install PWA</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-16 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Brand Col (4 cols) */}
          <div className="md:col-span-4 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-teal-400 p-[1.5px] shadow-md shadow-indigo-500/25">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-indigo-400">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
              <span className="font-extrabold text-lg text-white">
                CogniStudy
              </span>
            </Link>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Continuous adaptive AI study management system uniting cognitive science (Ebbinghaus spaced intervals) with real-time timetable recalibration.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Systems Normal • Version 2.0 Live</span>
            </div>
          </div>

          {/* Core Modules (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Academic Modules
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/dashboard" className="text-slate-400 hover:text-white transition-colors">
                  Student Dashboard
                </Link>
              </li>
              <li>
                <Link href="/schedule" className="text-slate-400 hover:text-white transition-colors">
                  Adaptive Calendar & Timetable
                </Link>
              </li>
              <li>
                <Link href="/subjects" className="text-slate-400 hover:text-white transition-colors">
                  Syllabus & Weightage Trees
                </Link>
              </li>
              <li>
                <Link href="/revisions" className="text-slate-400 hover:text-white transition-colors">
                  Spaced Repetition Review Hub
                </Link>
              </li>
              <li>
                <Link href="/tutors" className="text-slate-400 hover:text-white transition-colors">
                  24/7 Socratic AI Tutors
                </Link>
              </li>
            </ul>
          </div>

          {/* War-Room & Tools (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Exam & Focus Tools
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/exams" className="text-slate-400 hover:text-white transition-colors">
                  Exam War-Room Countdown
                </Link>
              </li>
              <li>
                <Link href="/quizzes" className="text-slate-400 hover:text-white transition-colors">
                  Diagnostic Recall Quizzes
                </Link>
              </li>
              <li>
                <Link href="/resources" className="text-slate-400 hover:text-white transition-colors">
                  Smart Resource Recommendation Box
                </Link>
              </li>
              <li>
                <Link href="/analytics" className="text-slate-400 hover:text-white transition-colors">
                  Learning Velocity Analytics
                </Link>
              </li>
              <li>
                <Link href="/settings" className="text-slate-400 hover:text-white transition-colors">
                  Settings & Supabase Sync
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Setup & Documentation (2 cols) */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Account & Setup
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/onboarding" className="text-slate-400 hover:text-white transition-colors">
                  Onboarding Wizard
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="text-slate-400 hover:text-white transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className="text-slate-400 hover:text-white transition-colors">
                  Create Account
                </Link>
              </li>
              <li>
                <button
                  onClick={handleTriggerPwa}
                  className="text-left text-teal-400 hover:text-teal-300 font-semibold"
                >
                  📱 Install Web App
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} CogniStudy Inc. Built for ambitious students worldwide.</p>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-slate-300">
              Privacy Policy
            </Link>
            <Link href="/" className="hover:text-slate-300">
              Terms of Service
            </Link>
            <Link href="/dashboard" className="text-indigo-400 hover:text-indigo-300 font-semibold">
              App Portal →
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
