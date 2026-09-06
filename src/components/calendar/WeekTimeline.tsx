'use client';

import React from 'react';
import Link from 'next/link';
import { ScheduleTask, AcademicEvent } from '@/types';
import { Clock, Play, CheckCircle2, Lock, Plus, Coffee, Target } from 'lucide-react';
import { formatTime, formatMinutes } from '@/lib/utils';

interface WeekTimelineProps {
  selectedDate: Date;
  tasks: ScheduleTask[];
  events: AcademicEvent[];
  onSelectDate: (date: Date) => void;
  onOpenAddTaskModal: (dateStr?: string) => void;
}

export const WeekTimeline: React.FC<WeekTimelineProps> = ({
  selectedDate,
  tasks,
  events,
  onSelectDate,
  onOpenAddTaskModal,
}) => {
  // Get start of the week (Monday)
  const current = new Date(selectedDate);
  const day = current.getDay();
  // distance to Monday (0=Sun -> diff -6, 1=Mon -> diff 0, 2=Tue -> diff 1...)
  const diff = current.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(current.setDate(diff));

  const weekDays: { date: Date; dateStr: string; dayName: string; dayNum: number }[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    weekDays.push({
      date: d,
      dateStr: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNum: d.getDate(),
    });
  }

  const hours = [
    '07:00',
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
    '20:00',
    '21:00',
    '22:00',
    '23:00',
  ];

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-sm overflow-x-auto no-scrollbar animate-in fade-in">
      <div className="min-w-[760px] space-y-4">
        {/* Week Day Header */}
        <div className="grid grid-cols-8 gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="text-xs font-bold text-slate-400 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
          {weekDays.map((wd) => {
            const isToday = wd.dateStr === todayStr;
            const isSelected = wd.dateStr === selectedDate.toISOString().split('T')[0];
            const dayExams = events.filter((e) => e.eventDate.startsWith(wd.dateStr));

            return (
              <div
                key={wd.dateStr}
                onClick={() => onSelectDate(wd.date)}
                className={`p-2 rounded-2xl text-center cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                    : isToday
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span className="text-[10px] font-extrabold uppercase block">{wd.dayName}</span>
                <span className="text-sm font-black block mt-0.5">{wd.dayNum}</span>

                {dayExams.length > 0 && (
                  <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded-full inline-flex items-center gap-0.5 mt-1 ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                  }`}>
                    🎯 Exam
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Hourly Matrix */}
        <div className="space-y-2">
          {hours.map((hourStr) => {
            const [hourNum] = hourStr.split(':').map(Number);

            return (
              <div key={hourStr} className="grid grid-cols-8 gap-2 items-stretch min-h-[52px]">
                {/* Hour Label */}
                <div className="text-[11px] font-semibold text-slate-400 flex items-center justify-center border-r border-slate-100 dark:border-slate-800 pr-2">
                  {hourStr}
                </div>

                {/* Day Columns */}
                {weekDays.map((wd) => {
                  // Find tasks falling in this hour
                  const matchingTasks = tasks.filter((t) => {
                    if (!t.startTime.startsWith(wd.dateStr)) return false;
                    const taskStartHour = new Date(t.startTime).getHours();
                    return taskStartHour === hourNum;
                  });

                  return (
                    <div
                      key={wd.dateStr}
                      className="rounded-xl border border-slate-100 dark:border-slate-850 p-1 bg-slate-50/40 dark:bg-slate-900/40 hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition-colors flex flex-col justify-center relative group"
                    >
                      {matchingTasks.length === 0 ? (
                        <button
                          onClick={() => onOpenAddTaskModal(wd.dateStr)}
                          className="w-full h-full opacity-0 group-hover:opacity-100 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-opacity"
                          title={`Add study block at ${hourStr}`}
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        matchingTasks.map((t) => {
                          const isBreak = t.taskType === 'break';
                          const isCompleted = t.status === 'completed';

                          if (isBreak) {
                            return (
                              <div
                                key={t.id}
                                className="p-1 rounded-lg bg-amber-100/70 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 text-[10px] font-semibold flex items-center gap-1 border border-amber-200 dark:border-amber-900"
                              >
                                <Coffee className="w-2.5 h-2.5 shrink-0 text-amber-600" />
                                <span className="truncate">{t.title}</span>
                              </div>
                            );
                          }

                          return (
                            <div
                              key={t.id}
                              className={`p-1.5 rounded-xl text-white text-[10px] font-bold shadow-xs flex flex-col justify-between overflow-hidden ${
                                isCompleted ? 'opacity-60 line-through' : ''
                              }`}
                              style={{ backgroundColor: t.subjectColor || '#6366f1' }}
                            >
                              <div className="flex items-center justify-between gap-1">
                                <span className="truncate">{t.title}</span>
                                {t.isLocked && <Lock className="w-2.5 h-2.5 shrink-0 opacity-80" />}
                              </div>
                              <div className="flex items-center justify-between text-[9px] opacity-90 mt-0.5">
                                <span>{formatTime(t.startTime)}</span>
                                {!isCompleted && (
                                  <Link
                                    href={`/session/${t.id}`}
                                    className="p-0.5 bg-white/25 hover:bg-white/40 rounded transition-colors"
                                  >
                                    <Play className="w-2.5 h-2.5 fill-white" />
                                  </Link>
                                )}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
