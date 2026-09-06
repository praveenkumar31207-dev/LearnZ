'use client';

import React from 'react';
import Link from 'next/link';
import { ScheduleTask, AcademicEvent } from '@/types';
import {
  Clock,
  Play,
  CheckCircle2,
  Lock,
  Plus,
  Target,
  Sparkles,
  Coffee,
  ChevronRight,
} from 'lucide-react';
import { formatTime, formatMinutes } from '@/lib/utils';

interface MonthGridProps {
  currentDate: Date;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  tasks: ScheduleTask[];
  events: AcademicEvent[];
  onOpenAddTaskModal: (dateStr?: string) => void;
}

export const MonthGrid: React.FC<MonthGridProps> = ({
  currentDate,
  selectedDate,
  onSelectDate,
  tasks,
  events,
  onOpenAddTaskModal,
}) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // First day of month (0 = Sun, 1 = Mon, ..., 6 = Sat)
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  // Days array for the 7x5 or 7x6 grid
  const days: { date: Date; isCurrentMonth: boolean; dateString: string }[] = [];

  // Previous month padding
  for (let i = firstDay - 1; i >= 0; i--) {
    const d = new Date(year, month - 1, daysInPrevMonth - i);
    days.push({
      date: d,
      isCurrentMonth: false,
      dateString: d.toISOString().split('T')[0],
    });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(year, month, i);
    days.push({
      date: d,
      isCurrentMonth: true,
      dateString: d.toISOString().split('T')[0],
    });
  }

  // Next month trailing days to complete grid (42 cells max)
  const remainingCells = 42 - days.length;
  for (let i = 1; i <= remainingCells; i++) {
    const d = new Date(year, month + 1, i);
    days.push({
      date: d,
      isCurrentMonth: false,
      dateString: d.toISOString().split('T')[0],
    });
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const selectedDateStr = selectedDate.toISOString().split('T')[0];

  // Filter tasks & events for selected day
  const selectedDayTasks = tasks.filter((t) => {
    const tDate = t.startTime.split('T')[0];
    return tDate === selectedDateStr;
  });

  const selectedDayEvents = events.filter((e) => {
    const eDate = e.eventDate.split('T')[0];
    return eDate === selectedDateStr;
  });

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in">
      {/* Calendar Grid (8 cols) */}
      <div className="lg:col-span-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-sm space-y-4">
        {/* Day Header Row */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {dayNames.map((d, i) => (
            <div
              key={d}
              className={`py-2 text-xs font-extrabold uppercase tracking-wider ${
                i === 0 || i === 6
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Days Matrix */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {days.slice(0, days.length > 35 ? 42 : 35).map((cell, idx) => {
            const isToday = cell.dateString === todayStr;
            const isSelected = cell.dateString === selectedDateStr;

            // Find tasks and exams on this date
            const dayTasks = tasks.filter((t) => t.startTime.startsWith(cell.dateString));
            const dayExams = events.filter((e) => e.eventDate.startsWith(cell.dateString));
            const studyCount = dayTasks.filter((t) => t.taskType !== 'break').length;

            return (
              <div
                key={idx}
                onClick={() => onSelectDate(cell.date)}
                className={`min-h-[70px] sm:min-h-[85px] p-2 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-indigo-600 dark:border-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20 shadow-sm'
                    : isToday
                    ? 'border-indigo-300 dark:border-indigo-700 bg-indigo-50/20 dark:bg-indigo-950/10 hover:bg-slate-50 dark:hover:bg-slate-850'
                    : cell.isCurrentMonth
                    ? 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/90 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/70 dark:hover:bg-slate-850'
                    : 'border-transparent bg-slate-50/40 dark:bg-slate-900/30 text-slate-400 dark:text-slate-600 opacity-40 hover:opacity-75'
                }`}
              >
                {/* Date number and badges */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${
                      isToday
                        ? 'bg-indigo-600 text-white font-extrabold shadow-xs shadow-indigo-600/30'
                        : isSelected
                        ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-extrabold'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {cell.date.getDate()}
                  </span>

                  {dayExams.length > 0 && (
                    <span
                      title={`Exam on this date: ${dayExams[0].title}`}
                      className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"
                    />
                  )}
                </div>

                {/* Day Mini-Bars / Indicators */}
                <div className="space-y-1 mt-1">
                  {dayExams.length > 0 && (
                    <div className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 truncate">
                      🎯 {dayExams[0].subjectName.split(' ')[0]}
                    </div>
                  )}

                  {studyCount > 0 && (
                    <div className="flex items-center gap-1 flex-wrap">
                      {dayTasks.slice(0, 3).map((t, tIdx) => (
                        <span
                          key={tIdx}
                          className="w-1.5 h-1.5 rounded-full"
                          style={{
                            backgroundColor:
                              t.taskType === 'break' ? '#f59e0b' : t.subjectColor || '#6366f1',
                          }}
                        />
                      ))}
                      {studyCount > 0 && (
                        <span className="text-[9px] text-slate-500 font-medium hidden sm:inline">
                          {studyCount} {studyCount === 1 ? 'task' : 'tasks'}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Day Agenda Drawer (4 cols) */}
      <div className="lg:col-span-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm flex flex-col justify-between space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                {selectedDateStr === todayStr ? 'Today’s Agenda' : 'Selected Date'}
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {selectedDate.toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </h3>
            </div>

            <button
              onClick={() => onOpenAddTaskModal(selectedDateStr)}
              className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 border border-indigo-200 dark:border-indigo-800 text-xs font-bold flex items-center gap-1 transition-colors"
              title="Add task to this date"
            >
              <Plus className="w-4 h-4" />
              <span>Add Block</span>
            </button>
          </div>

          {/* Exams on Selected Day */}
          {selectedDayEvents.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1">
                <Target className="w-3.5 h-3.5" /> Exam Milestone
              </span>
              {selectedDayEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200 space-y-1"
                >
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span>{evt.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-rose-200/80 dark:bg-rose-900">
                      {evt.weightagePercentage}% weight
                    </span>
                  </div>
                  <p className="text-[11px] text-rose-700 dark:text-rose-300">
                    Subject: {evt.subjectName}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Tasks on Selected Day */}
          <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Study Schedule ({selectedDayTasks.length} slots)
            </span>

            {selectedDayTasks.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-850/50 border border-dashed border-slate-200 dark:border-slate-800 space-y-2">
                <Clock className="w-8 h-8 text-slate-400 mx-auto opacity-70" />
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  No sessions scheduled on this date.
                </p>
                <button
                  onClick={() => onOpenAddTaskModal(selectedDateStr)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Schedule a study session</span>
                </button>
              </div>
            ) : (
              selectedDayTasks.map((task) => {
                const isBreak = task.taskType === 'break';
                const isCompleted = task.status === 'completed';

                if (isBreak) {
                  return (
                    <div
                      key={task.id}
                      className="p-3 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-dashed border-amber-200 dark:border-amber-900/60 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-semibold">
                        <Coffee className="w-3.5 h-3.5 text-amber-600" />
                        <span>{task.title}</span>
                      </div>
                      <span className="text-[10px] text-amber-700/80 dark:text-amber-400">
                        {formatTime(task.startTime)} ({task.plannedDurationMins}m)
                      </span>
                    </div>
                  );
                }

                return (
                  <div
                    key={task.id}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      isCompleted
                        ? 'bg-slate-50 dark:bg-slate-850/40 border-slate-200 dark:border-slate-800 opacity-70'
                        : 'bg-slate-50/80 dark:bg-slate-850 border-slate-200 dark:border-slate-800 hover:border-indigo-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5">
                        <div
                          className="w-1.5 self-stretch rounded-full shrink-0"
                          style={{ backgroundColor: task.subjectColor || '#6366f1' }}
                        />
                        <div>
                          <h5 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                            {task.title}
                          </h5>
                          <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                            <span>
                              {formatTime(task.startTime)} – {formatTime(task.endTime)}
                            </span>
                            <span>•</span>
                            <span>{formatMinutes(task.plannedDurationMins)}</span>
                          </div>
                        </div>
                      </div>

                      {isCompleted ? (
                        <span className="text-emerald-600 dark:text-emerald-400 shrink-0">
                          <CheckCircle2 className="w-4 h-4" />
                        </span>
                      ) : (
                        <Link
                          href={`/session/${task.id}`}
                          className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shrink-0 shadow-xs transition-transform hover:scale-105"
                          title="Start study session"
                        >
                          <Play className="w-3 h-3 fill-white" />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Selected Day Stats Footer */}
        <div className="p-3 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 flex justify-between items-center text-xs">
          <span className="text-slate-600 dark:text-slate-400">Total Planned Study:</span>
          <span className="font-bold text-indigo-700 dark:text-indigo-300">
            {formatMinutes(
              selectedDayTasks
                .filter((t) => t.taskType !== 'break')
                .reduce((acc, curr) => acc + curr.plannedDurationMins, 0)
            )}
          </span>
        </div>
      </div>
    </div>
  );
};
