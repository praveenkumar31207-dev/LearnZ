'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { useAuth } from '@/lib/authContext';
import {
  Bell,
  Sparkles,
  Award,
  User,
  LogOut,
  LogIn,
  Settings,
  ChevronDown,
  Globe,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Building2,
  Lock,
  GraduationCap,
} from 'lucide-react';
import { UserRole } from '@/types';
import { ThemeToggle } from '@/components/layout/ThemeToggle';

export const Navbar: React.FC<{ onMobileMenuToggle?: () => void }> = ({
  onMobileMenuToggle,
}) => {
  const router = useRouter();
  const {
    profile,
    activeRole,
    setActiveRole,
    notifications,
    markNotificationRead,
    lastReschedulePlan,
    undoReschedule,
    dismissRescheduleNotification,
  } = useAppStore();

  const { signOut } = useAuth();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showRoleSelector, setShowRoleSelector] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleRoleSwitch = (role: UserRole) => {
    setActiveRole(role);
    setShowRoleSelector(false);
    setShowUserDropdown(false);
  };

  const handleSignOut = async () => {
    await signOut();
    setShowUserDropdown(false);
    router.push('/auth/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs transition-colors">
      {/* Top subtle tricolor accent stripe for Indian Official System */}
      <div className="h-1 w-full bg-gradient-to-r from-orange-500 via-white to-emerald-600" />

      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Branding & Subtitle */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMobileMenuToggle}
            className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle navigation menu"
          >
            <span className="sr-only">Open menu</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            {/* Government Emblem / Professional Badge Icon */}
            <div className="w-10 h-10 rounded-xl bg-blue-700 dark:bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-700/20 group-hover:scale-105 transition-transform shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base leading-tight tracking-tight text-slate-900 dark:text-white">
                  AI-Enabled Skill Intelligence & Learning Platform
                </span>
                <span className="hidden xl:inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  MoSPI • iGOT
                </span>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate max-w-sm sm:max-w-md">
                Personalized Competency Development for India’s Official Statistical System
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Dynamic Reschedule Banner */}
        {lastReschedulePlan && (
          <div className="hidden 2xl:flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 text-amber-900 dark:text-amber-200 text-xs shadow-xs">
            <Zap className="w-3.5 h-3.5 text-amber-600" />
            <span className="font-medium truncate max-w-xs">Adaptive Learning Path Realigned</span>
            <button onClick={undoReschedule} className="underline font-semibold hover:text-amber-700 ml-1">
              Undo
            </button>
            <button onClick={dismissRescheduleNotification} className="ml-1 text-amber-500">
              ×
            </button>
          </div>
        )}

        {/* Right: Security Status, Role Switcher, Badges, Profile Menu */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Government Security Indicator */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Secure Government-Ready Platform</span>
          </div>

          {/* Unified Theme Toggle (Light, Dark, Custom) */}
          <ThemeToggle />

          {/* Role Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setShowRoleSelector(!showRoleSelector)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 text-xs font-bold transition-colors"
            >
              <span>Role:</span>
              <span className="capitalize">{activeRole}</span>
              <ChevronDown className="w-3 h-3 text-blue-500" />
            </button>

            {showRoleSelector && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1 block">
                  Switch Active Role:
                </span>
                <button
                  onClick={() => handleRoleSwitch('learner')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between ${
                    activeRole === 'learner'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5" />
                    <span>Official / Learner</span>
                  </span>
                  {activeRole === 'learner' && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                </button>
                <button
                  onClick={() => handleRoleSwitch('trainer')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between ${
                    activeRole === 'trainer'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>NSSTA Trainer / Faculty</span>
                  </span>
                  {activeRole === 'trainer' && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                </button>
                <button
                  onClick={() => handleRoleSwitch('admin')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between ${
                    activeRole === 'admin'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Cadre Administrator</span>
                  </span>
                  {activeRole === 'admin' && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                </button>
              </div>
            )}
          </div>

          {/* Competency Score Quick Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-300 text-xs font-bold">
            <Award className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>{profile.overallCompetencyScore}% Competency</span>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowRoleSelector(false);
                setShowUserDropdown(false);
              }}
              className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-3 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                      Competency & Training Alerts
                    </span>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-rose-100 text-rose-700">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => notifications.forEach((n) => markNotificationRead(n.id))}
                    className="text-xs text-blue-600 hover:underline font-semibold"
                  >
                    Mark all read
                  </button>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                  {notifications.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-400">No alerts found.</div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => markNotificationRead(notif.id)}
                        className={`p-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer ${
                          !notif.isRead ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                        }`}
                      >
                        <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{notif.title}</p>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                          {notif.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowUserDropdown(!showUserDropdown);
                setShowNotifications(false);
                setShowRoleSelector(false);
              }}
              className="flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-blue-700 text-white font-bold text-xs flex items-center justify-center">
                {profile.fullName.charAt(0)}
              </div>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 hidden md:inline truncate max-w-[120px]">
                {profile.fullName.split(' ')[0]}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 space-y-3">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="w-10 h-10 rounded-xl bg-blue-700 text-white font-extrabold text-sm flex items-center justify-center shrink-0">
                    {profile.fullName.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {profile.fullName}
                    </h4>
                    <p className="text-[10px] text-slate-500 truncate">{profile.designation}</p>
                    <p className="text-[9px] text-blue-700 dark:text-blue-400 font-medium truncate">
                      {profile.department}
                    </p>
                  </div>
                </div>

                {/* Switch Active Role */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Active Persona:
                  </span>
                  <div className="grid grid-cols-3 gap-1">
                    <button
                      onClick={() => handleRoleSwitch('learner')}
                      className={`p-1.5 rounded-lg text-center text-[10px] font-bold ${
                        activeRole === 'learner' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      Official
                    </button>
                    <button
                      onClick={() => handleRoleSwitch('trainer')}
                      className={`p-1.5 rounded-lg text-center text-[10px] font-bold ${
                        activeRole === 'trainer' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      Trainer
                    </button>
                    <button
                      onClick={() => handleRoleSwitch('admin')}
                      className={`p-1.5 rounded-lg text-center text-[10px] font-bold ${
                        activeRole === 'admin' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      Admin
                    </button>
                  </div>
                </div>

                <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <Link
                    href="/settings"
                    onClick={() => setShowUserDropdown(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    <span>Cadre Profile & iGOT Sync</span>
                  </Link>

                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950 font-semibold text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
