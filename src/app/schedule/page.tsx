'use client';

import React, { useState } from 'react';
import { CalendarView } from '@/components/calendar/CalendarView';
import { AiLearningPathView } from '@/components/learning-path/AiLearningPath';
import { Compass, Calendar as CalendarIcon, Sparkles } from 'lucide-react';

export default function SchedulePage() {
  const [activeTab, setActiveTab] = useState<'learning_path' | 'schedule'>('learning_path');

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Switcher Navigation */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('learning_path')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'learning_path'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>AI Competency Learning Path</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/20 text-white">AI Ready</span>
          </button>

          <button
            onClick={() => setActiveTab('schedule')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'schedule'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <CalendarIcon className="w-4 h-4" />
            <span>Adaptive Study Schedule</span>
          </button>
        </div>
      </div>

      {/* Render Active View */}
      {activeTab === 'learning_path' ? <AiLearningPathView /> : <CalendarView />}
    </div>
  );
}
