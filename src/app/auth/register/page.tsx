'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import {
  Sparkles,
  Lock,
  Mail,
  User,
  BookOpen,
  ArrowRight,
  AlertCircle,
  GraduationCap,
} from 'lucide-react';
import { EducationLevel } from '@/types';

export default function RegisterPage() {
  const router = useRouter();
  const { signUp } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [educationLevel, setEducationLevel] = useState<EducationLevel>('Undergraduate');
  const [courseDegree, setCourseDegree] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    const res = await signUp(email, password, fullName, educationLevel, courseDegree);
    setLoading(false);

    if (res.error) {
      setErrorMsg(res.error);
    } else {
      router.push('/onboarding');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-teal-400 text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/20">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Create Student Profile
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Join CogniStudy for personalized, real-time adaptive study scheduling.
          </p>
        </div>

        {/* Register Form Box */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-3.5">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Jordan Smith"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-950 border-2 border-slate-300 dark:border-slate-700 text-sm font-medium text-slate-950 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/25 shadow-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@university.edu"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-950 border-2 border-slate-300 dark:border-slate-700 text-sm font-medium text-slate-950 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/25 shadow-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-950 border-2 border-slate-300 dark:border-slate-700 text-sm font-medium text-slate-950 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/25 shadow-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Education Level
                </label>
                <select
                  value={educationLevel}
                  onChange={(e) => setEducationLevel(e.target.value as EducationLevel)}
                  className="w-full px-3.5 py-3 rounded-2xl bg-white dark:bg-slate-950 border-2 border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-medium text-slate-950 dark:text-white shadow-xs"
                >
                  <option value="High School">High School</option>
                  <option value="Undergraduate">Undergraduate</option>
                  <option value="Postgraduate">Postgraduate</option>
                  <option value="Competitive Exam Prep">Competitive Prep</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Degree / Major
                </label>
                <input
                  type="text"
                  value={courseDegree}
                  onChange={(e) => setCourseDegree(e.target.value)}
                  placeholder="e.g. B.Tech CS"
                  className="w-full px-3.5 py-3 rounded-2xl bg-white dark:bg-slate-950 border-2 border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-medium text-slate-950 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/25 shadow-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all hover:scale-[1.01] mt-2"
            >
              <span>{loading ? 'Creating Profile...' : 'Create Account & Setup Schedule'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
            Already have an account?{' '}
            <Link
              href="/auth/login"
              className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
