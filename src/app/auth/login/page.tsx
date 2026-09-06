'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { UserRole } from '@/types';
import {
  ShieldCheck,
  Lock,
  Building2,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Award,
  Globe,
  Users,
  GraduationCap,
} from 'lucide-react';
import { ThemeToggle } from '@/components/layout/ThemeToggle';

export default function LoginPage() {
  const router = useRouter();
  const { signInWithIgot, loginAsDemoUser } = useAuth();

  const [identifier, setIdentifier] = useState('KB-MOSPI-8921');
  const [password, setPassword] = useState('••••••••••••');
  const [selectedRole, setSelectedRole] = useState<UserRole>('learner');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [authMethod, setAuthMethod] = useState<'parichay' | 'karmayogi_id'>('karmayogi_id');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier) {
      setErrorMsg('Please enter your Karmayogi ID or Government Email.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    const res = await signInWithIgot(identifier, password, selectedRole);
    setLoading(false);

    if (res.error) {
      setErrorMsg(res.error);
    } else {
      if (selectedRole === 'trainer') {
        router.push('/trainer');
      } else if (selectedRole === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    }
  };

  const handleQuickLogin = (role: UserRole) => {
    loginAsDemoUser(role);
    if (role === 'trainer') router.push('/trainer');
    else if (role === 'admin') router.push('/admin');
    else router.push('/dashboard');
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 transition-colors">
      {/* Top Bar with Emblem & Theme Selector */}
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-700 dark:bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-blue-700/20">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                iGOT Karmayogi Bharat Single Sign-On
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                MoSPI Affiliated
              </span>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              National Statistical Systems Training & Competency Framework
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </div>

      {/* Main Login Box */}
      <div className="w-full max-w-xl mx-auto my-6 space-y-6">
        {/* Tricolor Official Accent */}
        <div className="h-1.5 w-full rounded-full bg-gradient-to-r from-orange-500 via-white to-emerald-600 shadow-xs" />

        {/* 1-Click Role Quick Access Profiles */}
        <div className="rounded-3xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/60 p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-800 dark:text-blue-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-600" /> Instant Role-Based Access (Pre-Configured iGOT Accounts)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Learner Card */}
            <button
              onClick={() => handleQuickLogin('learner')}
              className="p-3 rounded-2xl bg-white dark:bg-slate-900 hover:bg-blue-50/80 dark:hover:bg-slate-800 text-left border border-slate-200 dark:border-slate-800 hover:border-blue-400 transition-all group shadow-2xs"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="p-1 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                  <Users className="w-3.5 h-3.5" />
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                  Learner
                </span>
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                Rajesh Kumar, ISS
              </div>
              <div className="text-[10px] text-slate-500 truncate">
                Senior Statistical Officer (SSO)
              </div>
            </button>

            {/* Trainer Card */}
            <button
              onClick={() => handleQuickLogin('trainer')}
              className="p-3 rounded-2xl bg-white dark:bg-slate-900 hover:bg-indigo-50/80 dark:hover:bg-slate-800 text-left border border-slate-200 dark:border-slate-800 hover:border-indigo-400 transition-all group shadow-2xs"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="p-1 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  <GraduationCap className="w-3.5 h-3.5" />
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  Trainer
                </span>
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                Dr. Sunita Sharma
              </div>
              <div className="text-[10px] text-slate-500 truncate">
                Director & Faculty (NSSTA)
              </div>
            </button>

            {/* Admin Card */}
            <button
              onClick={() => handleQuickLogin('admin')}
              className="p-3 rounded-2xl bg-white dark:bg-slate-900 hover:bg-emerald-50/80 dark:hover:bg-slate-800 text-left border border-slate-200 dark:border-slate-800 hover:border-emerald-400 transition-all group shadow-2xs"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="p-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  <Building2 className="w-3.5 h-3.5" />
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  Admin
                </span>
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                P. Venkatachalam, ISS
              </div>
              <div className="text-[10px] text-slate-500 truncate">
                ADG (Human Resources & Cadre)
              </div>
            </button>
          </div>
        </div>

        {/* Form Card */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex border-b border-slate-200 dark:border-slate-800 pb-3">
            <button
              type="button"
              onClick={() => setAuthMethod('karmayogi_id')}
              className={`flex-1 text-center py-2 text-xs font-bold border-b-2 -mb-3 transition-colors ${
                authMethod === 'karmayogi_id'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              iGOT Karmayogi ID / e-Pramaan
            </button>
            <button
              type="button"
              onClick={() => setAuthMethod('parichay')}
              className={`flex-1 text-center py-2 text-xs font-bold border-b-2 -mb-3 transition-colors ${
                authMethod === 'parichay'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Jan Parichay Gov SSO
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Switcher */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Target Role & Authorization Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['learner', 'trainer', 'admin'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setSelectedRole(r)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border capitalize transition-all ${
                      selectedRole === r
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850'
                    }`}
                  >
                    {r === 'learner' && 'Learner (Officer)'}
                    {r === 'trainer' && 'Trainer (Faculty)'}
                    {r === 'admin' && 'Admin (Cadre Lead)'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {authMethod === 'karmayogi_id'
                  ? 'Karmayogi ID (KB-XXXX) or Government Email'
                  : 'Jan Parichay Username / Gov.in ID'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. KB-MOSPI-8921 or officer@mospi.gov.in"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
                <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Password or Digital OTP
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password / OTP"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                Secured via Local Storage Encryption
              </span>
              <a
                href="https://igotkarmayogi.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Official iGOT Portal ↗
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
            >
              {loading ? (
                <span>Authenticating with iGOT Karmayogi...</span>
              ) : (
                <>
                  <span>Sign In as {selectedRole.toUpperCase()}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Official Footer */}
      <div className="text-center text-[11px] text-slate-400 dark:text-slate-500 max-w-2xl mx-auto space-y-1">
        <p>
          Affiliated with iGOT Karmayogi Bharat Platform • National Statistical Systems Training Academy (NSSTA)
        </p>
        <p>
          All session keys and credentials are autonomously saved into browser LocalStorage for offline and secure continuity.
        </p>
      </div>
    </div>
  );
}
