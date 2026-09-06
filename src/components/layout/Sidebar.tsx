'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import {
  LayoutDashboard,
  Award,
  AlertCircle,
  Compass,
  BookOpen,
  GraduationCap,
  HelpCircle,
  TrendingUp,
  Bot,
  User,
  UploadCloud,
  FileCheck2,
  Users,
  BarChart3,
  Flame,
  Sparkles,
  X,
  Globe,
  ShieldCheck,
  Building2,
  Database,
  Cpu,
} from 'lucide-react';

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onMobileClose }) => {
  const pathname = usePathname();
  const { activeRole, profile } = useAppStore();

  // Role-specific navigation menus
  const learnerNavItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Competencies', href: '/subjects', icon: Award },
    { name: 'Skill Gaps & AI Analysis', href: '/subjects?tab=gaps', icon: AlertCircle },
    { name: 'AI Learning Path', href: '/schedule', icon: Compass },
    { name: 'iGOT Karmayogi Courses', href: '/resources', icon: BookOpen },
    { name: 'NSSTA Training Programmes', href: '/resources?tab=nssta', icon: GraduationCap },
    { name: 'AI Assessments & MCQs', href: '/quizzes', icon: HelpCircle },
    { name: 'Competency Progress', href: '/analytics', icon: TrendingUp },
    { name: 'AI Statistical Assistant', href: '/tutors', icon: Bot },
    { name: 'Official Profile', href: '/settings', icon: User },
  ];

  const trainerNavItems = [
    { name: 'Trainer Control Studio', href: '/trainer', icon: LayoutDashboard },
    { name: 'Learner Dashboard View', href: '/dashboard', icon: BarChart3 },
    { name: 'Upload Learning Materials', href: '/trainer', icon: UploadCloud },
    { name: 'AI MCQ Generator', href: '/trainer', icon: Cpu },
    { name: 'Question Quality Review', href: '/trainer', icon: FileCheck2 },
    { name: 'Competency Assessments', href: '/quizzes', icon: HelpCircle },
    { name: 'Statistical Syllabus Mapping', href: '/subjects', icon: Award },
  ];

  const adminNavItems = [
    { name: 'Cadre Governance Admin', href: '/admin', icon: LayoutDashboard },
    { name: 'Cadre Overview Dashboard', href: '/dashboard', icon: Building2 },
    { name: 'Workforce Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Department Skill-Gap Heatmap', href: '/analytics?tab=heatmap', icon: Building2 },
    { name: 'Future Skill Predictions', href: '/analytics?tab=predictions', icon: Sparkles },
    { name: 'Official Competency Mapping', href: '/subjects', icon: Award },
    { name: 'System & iGOT Sync Engine', href: '/admin', icon: Database },
  ];

  const currentNavItems =
    activeRole === 'trainer'
      ? trainerNavItems
      : activeRole === 'admin'
      ? adminNavItems
      : learnerNavItems;

  const content = (
    <aside className="w-64 h-full flex flex-col justify-between bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 transition-colors">
      <div className="space-y-4">
        {/* Mobile Header with close button */}
        <div className="flex items-center justify-between lg:hidden pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-700 text-white flex items-center justify-center font-bold text-xs">
              <Building2 className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm text-slate-900 dark:text-white">Skill Intelligence</span>
          </div>
          <button
            onClick={onMobileClose}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active Role Badge */}
        <div className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Navigation Mode:
          </span>
          <div className="flex items-center justify-between mt-0.5">
            <span className="text-xs font-extrabold text-blue-700 dark:text-blue-400 flex items-center gap-1.5">
              {activeRole === 'learner' && '👤 Official / Learner'}
              {activeRole === 'trainer' && '🎓 NSSTA Trainer'}
              {activeRole === 'admin' && '🏛️ Cadre Administrator'}
            </span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-semibold uppercase">
              {activeRole}
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {currentNavItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/dashboard'
                ? pathname === '/dashboard' || pathname === '/'
                : pathname === item.href.split('?')[0];

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onMobileClose}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-700 text-white shadow-sm shadow-blue-700/25'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-400'}`} />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}

          <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800/80 mt-2">
            <Link
              href="/"
              onClick={onMobileClose}
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <Globe className="w-4 h-4 text-blue-600" />
              <span>National Portal Home</span>
            </Link>
          </div>
        </nav>
      </div>

      {/* Footer Info: Government Enterprise Accreditation Box */}
      <div className="space-y-2.5 pt-3 border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/50 dark:from-blue-950/40 dark:to-slate-900 border border-blue-100 dark:border-blue-900/60 text-slate-700 dark:text-slate-300">
          <div className="flex items-center gap-1.5 text-blue-800 dark:text-blue-300 font-bold text-xs mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            iGOT Karmayogi Ready
          </div>
          <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-relaxed">
            Personalized competency loops mapped to NSSTA TPAC & Mission Karmayogi standards.
          </p>
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-400 px-1 font-medium">
          <span>MoSPI Official System</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-bold">● Live Sync</span>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      <div className="hidden lg:block h-[calc(100vh-4rem)] sticky top-16 shrink-0">
        {content}
      </div>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs lg:hidden animate-in fade-in"
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
