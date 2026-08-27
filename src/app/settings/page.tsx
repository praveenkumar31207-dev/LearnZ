'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { isSupabaseConfigured } from '@/lib/supabaseClient';
import {
  Settings,
  Database,
  Sliders,
  Clock,
  User,
  Download,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Code,
  Copy,
  ExternalLink,
} from 'lucide-react';

export default function SettingsPage() {
  const {
    profile,
    updateProfile,
    availability,
    updateAvailability,
    resetToDefault,
    subjects,
    scheduleTasks,
    studySessions,
  } = useAppStore();

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [showSqlModal, setShowSqlModal] = useState(false);

  // Settings State
  const [fullName, setFullName] = useState(profile.fullName);
  const [educationLevel, setEducationLevel] = useState(profile.educationLevel);
  const [courseDegree, setCourseDegree] = useState(profile.courseDegree);
  const [targetGpaGrade, setTargetGpaGrade] = useState(profile.targetGpaGrade);
  const [dailyMaxStudyHours, setDailyMaxStudyHours] = useState(profile.dailyMaxStudyHours);
  const [stabilityThreshold, setStabilityThreshold] = useState(profile.stabilityThresholdMins || 10);
  const [pomodoroFocus, setPomodoroFocus] = useState(profile.pomodoroFocusMins || 50);
  const [pomodoroBreak, setPomodoroBreak] = useState(profile.pomodoroBreakMins || 10);

  const handleSaveSettings = () => {
    updateProfile({
      fullName,
      educationLevel,
      courseDegree,
      targetGpaGrade,
      dailyMaxStudyHours,
      stabilityThresholdMins: stabilityThreshold,
      pomodoroFocusMins: pomodoroFocus,
      pomodoroBreakMins: pomodoroBreak,
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleExportData = () => {
    const data = {
      profile,
      availability,
      subjects,
      scheduleTasks,
      studySessions,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cognistudy_export_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <Settings className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            System Settings & Architecture
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Configure dynamic rescheduling sensitivity, pomodoro blocks, and Supabase database connection.
          </p>
        </div>

        {savedSuccess && (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Saved Successfully</span>
          </span>
        )}
      </div>

      {/* 1. Supabase Backend Integration Card */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Supabase PostgreSQL Backend Status
            </h3>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              isSupabaseConfigured
                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                : 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
            }`}
          >
            {isSupabaseConfigured ? '🟢 Live Supabase Connected' : '⚡ Local Resilient State Active'}
          </span>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          CogniStudy includes an enterprise PostgreSQL schema with 18+ relational tables and Row Level Security (RLS) policies. You can connect your free Supabase instance anytime or use local offline storage.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={() => setShowSqlModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold transition-colors"
          >
            <Code className="w-4 h-4" />
            <span>View SQL Schema & Manual Setup Guide</span>
          </button>

          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
          >
            <span>Supabase Dashboard</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* 2. Rescheduling & Engine Configuration */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Dynamic Scheduling & Stability Thresholds
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Stability Threshold (Minutes)
            </label>
            <select
              value={stabilityThreshold}
              onChange={(e) => setStabilityThreshold(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
            >
              <option value={5}>5 mins (Highly Reactive)</option>
              <option value={10}>10 mins (Balanced - Recommended)</option>
              <option value={15}>15 mins (Stable)</option>
              <option value={20}>20 mins (High Stability)</option>
            </select>
            <p className="text-[10px] text-slate-400 mt-1">
              Differences below this threshold avoid timetable shifting.
            </p>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Focus Session Block
            </label>
            <select
              value={pomodoroFocus}
              onChange={(e) => setPomodoroFocus(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
            >
              <option value={25}>25 mins (Classic Pomodoro)</option>
              <option value={45}>45 mins (Standard Lecture)</option>
              <option value={50}>50 mins (Deep Focus - Recommended)</option>
              <option value={90}>90 mins (Ultra Marathon Block)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Recharge Break Duration
            </label>
            <select
              value={pomodoroBreak}
              onChange={(e) => setPomodoroBreak(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
            >
              <option value={5}>5 mins</option>
              <option value={10}>10 mins (Recommended)</option>
              <option value={15}>15 mins</option>
              <option value={20}>20 mins</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Student Profile & Goals */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Student Profile Information
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Course / Degree
            </label>
            <input
              type="text"
              value={courseDegree}
              onChange={(e) => setCourseDegree(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Target Grade / GPA Goal
            </label>
            <input
              type="text"
              value={targetGpaGrade}
              onChange={(e) => setTargetGpaGrade(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Daily Max Study Hours
            </label>
            <input
              type="number"
              value={dailyMaxStudyHours}
              onChange={(e) => setDailyMaxStudyHours(Number(e.target.value))}
              min={1}
              max={16}
              step={0.5}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div className="flex justify-end pt-3">
          <button
            onClick={handleSaveSettings}
            className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all hover:scale-105"
          >
            Save All Preferences
          </button>
        </div>
      </div>

      {/* 4. Data Management & Reset */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          Data Backup & Reset
        </h3>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportData}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Study Data (JSON)</span>
          </button>

          <button
            onClick={() => {
              if (confirm('Reset state to initial sample curriculum?')) {
                resetToDefault();
              }
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 hover:bg-rose-100 border border-rose-200 dark:border-rose-800 text-xs font-semibold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Curriculum State</span>
          </button>
        </div>
      </div>

      {/* Manual Supabase SQL Setup Modal */}
      {showSqlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl space-y-5 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Supabase Manual Setup Walkthrough
                </h3>
              </div>
              <button
                onClick={() => setShowSqlModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                Close ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed pr-2">
              <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 space-y-2">
                <span className="font-bold text-indigo-700 dark:text-indigo-300 block">
                  Quick Supabase Setup Steps:
                </span>
                <p>1. Open your Supabase Dashboard and click <strong>SQL Editor</strong>.</p>
                <p>2. Paste the SQL script from <code>supabase/schema.sql</code> into the editor.</p>
                <p>3. Click <strong>Run</strong> to create all 18+ tables, indexes, and Row Level Security (RLS) policies.</p>
                <p>4. Copy your Project URL and Anon Public Key from <strong>Project Settings → API</strong> into <code>.env.local</code>.</p>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-slate-900 dark:text-white block">
                  Required Environment Variables (.env.local):
                </span>
                <pre className="p-3.5 rounded-xl bg-slate-950 text-slate-200 font-mono text-[11px] overflow-x-auto">
{`NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
GEMINI_API_KEY=your-gemini-api-key (Optional)`}
                </pre>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setShowSqlModal(false)}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
