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
} from 'lucide-react';
import { ThemeToggle } from '@/components/layout/ThemeToggle';

export default function LoginPage() {
  const router = useRouter();
  const { signInWithIgot, signInWithGoogle } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
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
                LearnZ Platform Authentication
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Secure SSO
              </span>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Student Track (DSA & Coding) & iGOT Karmayogi Competency Framework
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </div>

      {/* Main Login Box */}
      <div className="w-full max-w-md mx-auto my-6 space-y-6">
        {/* Tricolor Official Accent */}
        <div className="h-1.5 w-full rounded-full bg-gradient-to-r from-orange-500 via-white to-emerald-600 shadow-xs" />

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
                  <span>Sign In as {selectedRole.toUpperCase()} (iGOT Karmayogi)</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
              <span className="flex-shrink mx-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">or sign in with</span>
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
            </div>

            <button
              type="button"
              disabled={loading}
              onClick={async () => {
                setLoading(true);
                setErrorMsg('');
                const res = await signInWithGoogle();
                setLoading(false);
                if (res.error) {
                  setErrorMsg(res.error);
                } else {
                  router.push('/dashboard');
                }
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 font-semibold text-xs border border-slate-200 dark:border-slate-700 shadow-xs transition-all flex items-center justify-center gap-2.5 hover:scale-[1.01]"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.36 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.16 0 9.98 0 12c0 2.02.45 3.84 1.24 5.42l4.04-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Continue with Google</span>
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
