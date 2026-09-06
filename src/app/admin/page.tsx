'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/authContext';
import { useAppStore } from '@/lib/store';
import {
  ShieldAlert,
  Building2,
  Users,
  Database,
  BarChart3,
  Sparkles,
  CheckCircle2,
  Lock,
  RefreshCw,
  Sliders,
  ExternalLink,
  Award,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { profile, activeRole, setActiveRole } = useAuth();
  const { subjects, quizzes } = useAppStore();

  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced'>('idle');
  const [allowAiTutor, setAllowAiTutor] = useState(true);
  const [enforceStrictProctoring, setEnforceStrictProctoring] = useState(false);
  const [requireIgotVerification, setRequireIgotVerification] = useState(true);

  const handleTriggerIgotSync = () => {
    setSyncStatus('syncing');
    setTimeout(() => {
      setSyncStatus('synced');
      setTimeout(() => setSyncStatus('idle'), 3000);
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Admin Hero Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl space-y-3 border border-blue-900/40">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
            System Administration & Cadre Governance Module
          </span>
          <span className="text-xs text-slate-400">
            Higher Administrative Grade (HAG) Control Level
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
          Welcome, {profile.fullName}
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
          National cadre overview: configure iGOT Bharat synchronization, manage platform security policies, and monitor cross-department competency benchmarks.
        </p>
      </div>

      {/* Cadre Top Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400">Active Officers Enrolled</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            2,480
          </div>
          <p className="text-[10px] text-emerald-600 font-semibold mt-1">↑ 12% across ISS/SSS cadres</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400">iGOT Accreditations Completed</span>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">
            1,842
          </div>
          <p className="text-[10px] text-slate-400 mt-1">TPAC verified certificates</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400">System Competency Health</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            78.6%
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Target baseline: 75.0%</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400">Published Assessments</span>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
            {quizzes.length}
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Official question pools</p>
        </div>
      </div>

      {/* iGOT Sync Engine & System Governance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card: iGOT Integration */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-600" />
                iGOT Karmayogi Bharat Direct Sync
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Sync national competency standards, officer course credits, and TPAC badges.
              </p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
              API Live
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Connected Endpoint:</span>
              <span className="font-mono text-slate-700 dark:text-slate-300">api.igotkarmayogi.gov.in/v2/competency</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Last Successful Sync:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">Today at 09:30 AM IST</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Synced Records:</span>
              <span className="font-semibold text-blue-600">2,480 Profiles & 45 Accredited Courses</span>
            </div>
          </div>

          <button
            onClick={handleTriggerIgotSync}
            disabled={syncStatus === 'syncing'}
            className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
            <span>
              {syncStatus === 'syncing'
                ? 'Pulling iGOT Karmayogi Catalog...'
                : syncStatus === 'synced'
                ? '✓ Successfully Synced with iGOT Bharat!'
                : 'Trigger Manual iGOT Sync'}
            </span>
          </button>
        </div>

        {/* Card: Administrative Policy Toggles */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-indigo-600" />
              Cadre Policy & Security Controls
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Control access levels, proctoring enforcement, and AI assistance privileges.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 cursor-pointer">
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Enable AI Statistical Assistant for Learners
                </div>
                <div className="text-[10px] text-slate-500">
                  Allows officers to consult the interactive AI statistical chatbot
                </div>
              </div>
              <input
                type="checkbox"
                checked={allowAiTutor}
                onChange={(e) => setAllowAiTutor(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 cursor-pointer">
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Require iGOT Karmayogi SSO Verification
                </div>
                <div className="text-[10px] text-slate-500">
                  Enforces government domain email or KB-XXXX credentials
                </div>
              </div>
              <input
                type="checkbox"
                checked={requireIgotVerification}
                onChange={(e) => setRequireIgotVerification(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 cursor-pointer">
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Enforce Assessment Tab-Switch Detection
                </div>
                <div className="text-[10px] text-slate-500">
                  Monitors browser focus during official competency diagnostic tests
                </div>
              </div>
              <input
                type="checkbox"
                checked={enforceStrictProctoring}
                onChange={(e) => setEnforceStrictProctoring(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
