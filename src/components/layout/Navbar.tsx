'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import {
  Bell,
  Sparkles,
  Flame,
  Zap,
  Menu,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ChevronRight,
  BookOpen,
  Award,
} from 'lucide-react';

export const Navbar: React.FC<{ onMobileMenuToggle?: () => void }> = ({
  onMobileMenuToggle,
}) => {
  const { profile, notifications, markNotificationRead, lastReschedulePlan, undoReschedule, dismissRescheduleNotification } =
    useAppStore();
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-900/60 transition-colors">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Mobile Menu Toggle & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMobileMenuToggle}
            className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-none tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                CogniStudy
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  AI Adaptive
                </span>
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Academic Management System
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Dynamic Reschedule Banner Pill (if recently triggered) */}
        {lastReschedulePlan && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 text-amber-900 dark:text-amber-200 text-xs shadow-sm animate-pulse">
            <Zap className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span className="font-medium truncate max-w-xs">
              AI Dynamically Optimized Timetable
            </span>
            <button
              onClick={undoReschedule}
              className="underline font-semibold hover:text-amber-700 dark:hover:text-amber-100 ml-1"
            >
              Undo
            </button>
            <button
              onClick={dismissRescheduleNotification}
              className="ml-1 text-amber-500 hover:text-amber-800 dark:hover:text-amber-300"
              aria-label="Dismiss alert"
            >
              ×
            </button>
          </div>
        )}

        {/* Right: Gamification Badges & Notification Dropdown */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Study Streak Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-950/50 border border-orange-200 dark:border-orange-800/60 text-orange-700 dark:text-orange-300 text-xs font-semibold">
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
            <span>{profile.streakDays} Day Streak</span>
          </div>

          {/* XP Gauge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
            <Award className="w-4 h-4 text-indigo-500" />
            <span>{profile.totalXp} XP</span>
          </div>

          {/* Notifications Trigger */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white dark:ring-slate-900" />
              )}
            </button>

            {/* Notification Drawer Popover */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-3 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-slate-900 dark:text-white">
                      Notifications & Alerts
                    </span>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      notifications.forEach((n) => markNotificationRead(n.id));
                    }}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                  >
                    Mark all read
                  </button>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-500 dark:text-slate-400">
                      No notifications yet.
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => markNotificationRead(notif.id)}
                        className={`p-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors ${
                          !notif.isRead ? 'bg-indigo-50/40 dark:bg-indigo-950/20' : ''
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <div className="mt-0.5">
                            {notif.notificationType === 'schedule_update' ? (
                              <Zap className="w-4 h-4 text-amber-500" />
                            ) : notif.notificationType === 'exam_warning' ? (
                              <AlertTriangle className="w-4 h-4 text-rose-500" />
                            ) : (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                              {notif.title}
                            </p>
                            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                              {notif.message}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar Link */}
          <Link
            href="/settings"
            className="flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-800"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-teal-400 text-white font-bold text-xs flex items-center justify-center">
              {profile.fullName.charAt(0)}
            </div>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 hidden md:inline">
              {profile.fullName}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
};
