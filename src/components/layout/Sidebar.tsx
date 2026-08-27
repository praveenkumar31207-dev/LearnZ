'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarDays,
  BookOpen,
  RotateCcw,
  Bot,
  Compass,
  HelpCircle,
  Flame,
  BarChart3,
  Settings,
  Sparkles,
  X,
  Target,
} from 'lucide-react';

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Study Plan', href: '/schedule', icon: CalendarDays },
  { name: 'My Subjects', href: '/subjects', icon: BookOpen },
  { name: 'Spaced Revisions', href: '/revisions', icon: RotateCcw },
  { name: 'AI Tutors', href: '/tutors', icon: Bot },
  { name: 'Resource Box', href: '/resources', icon: Compass },
  { name: 'Quizzes & Drills', href: '/quizzes', icon: HelpCircle },
  { name: 'Exam War-Room', href: '/exams', icon: Target },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Settings & Supabase', href: '/settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onMobileClose }) => {
  const pathname = usePathname();

  const content = (
    <aside className="w-64 h-full flex flex-col justify-between bg-slate-50/75 dark:bg-slate-900/75 border-r border-slate-200 dark:border-slate-800 p-4 transition-colors">
      <div className="space-y-6">
        {/* Mobile Header with close button */}
        <div className="flex items-center justify-between lg:hidden pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <span className="font-bold text-slate-900 dark:text-white">CogniStudy</span>
          </div>
          <button
            onClick={onMobileClose}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onMobileClose}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Info & PWA Install Box */}
      <div className="space-y-2">
        <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 text-slate-700 dark:text-slate-300">
          <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-semibold text-xs mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            Continuous Adaptive AI
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
            The timetable automatically recalibrates when you finish early or take longer.
          </p>
        </div>

        <button
          onClick={() => {
            const event = new CustomEvent('trigger-pwa-install');
            window.dispatchEvent(event);
            alert('📱 Install CogniStudy:\n\n• On Chrome/Android/Desktop: Look for the Install icon (⬇️) in your browser address bar\n• On iPhone/iPad (Safari): Tap the Share button & choose "Add to Home Screen"');
          }}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold transition-all shadow-xs"
        >
          <span>📱 Install Web App</span>
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <div className="hidden lg:block h-[calc(100vh-4rem)] sticky top-16 shrink-0">
        {content}
      </div>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm lg:hidden animate-in fade-in"
          onClick={onMobileClose}
        >
          <div
            className="fixed inset-y-0 left-0 w-72 bg-white dark:bg-slate-900 shadow-2xl z-50 animate-in slide-in-from-left duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {content}
          </div>
        </div>
      )}
    </>
  );
};
