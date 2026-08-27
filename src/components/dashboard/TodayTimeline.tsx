'use client';

import React from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import {
  Clock,
  Lock,
  Unlock,
  Play,
  CheckCircle2,
  Coffee,
  RotateCcw,
  Sparkles,
  Zap,
  MoreVertical,
} from 'lucide-react';
import { formatTime, formatMinutes } from '@/lib/utils';

export const TodayTimeline: React.FC = () => {
  const { scheduleTasks, toggleTaskLock, regenerateSchedule } = useAppStore();

  const todayTasks = scheduleTasks;

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Today's Adaptive Schedule
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Intelligently scheduled according to your priority graph and routine.
          </p>
        </div>

        <button
          onClick={() => regenerateSchedule()}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Recalculate</span>
        </button>
      </div>

      <div className="space-y-3">
        {todayTasks.length === 0 ? (
          <div className="py-12 text-center text-sm text-slate-500 dark:text-slate-400">
            No study sessions scheduled for today. Click Recalculate to generate!
          </div>
        ) : (
          todayTasks.map((task, idx) => {
            const isBreak = task.taskType === 'break';
            const isCompleted = task.status === 'completed';

            if (isBreak) {
              return (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-dashed border-amber-200 dark:border-amber-800/50 text-amber-900 dark:text-amber-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
                      <Coffee className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold">{task.title}</h4>
                      <div className="flex items-center gap-2 text-[11px] text-amber-700 dark:text-amber-400">
                        <Clock className="w-3 h-3" />
                        <span>
                          {formatTime(task.startTime)} – {formatTime(task.endTime)} ({task.plannedDurationMins}m)
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300">
                    Rest Block
                  </span>
                </div>
              );
            }

            return (
              <div
                key={task.id}
                className={`relative group p-4 rounded-2xl border transition-all ${
                  isCompleted
                    ? 'bg-slate-50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 opacity-75'
                    : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md shadow-sm'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    {/* Left Subject Color Accent Bar */}
                    <div
                      className="w-1.5 self-stretch rounded-full shrink-0"
                      style={{ backgroundColor: task.subjectColor || '#6366f1' }}
                    />

                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                          {task.title}
                        </span>

                        {/* Priority Badge */}
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                            task.priorityTag === 'Critical'
                              ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                              : task.priorityTag === 'High'
                              ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          {task.priorityTag}
                        </span>

                        {/* Lock Indicator */}
                        {task.isLocked && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-md">
                            <Lock className="w-2.5 h-2.5" /> Locked
                          </span>
                        )}

                        {/* Reschedule Reason */}
                        {task.rescheduleReason && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60 px-2 py-0.5 rounded-md">
                            <Zap className="w-2.5 h-2.5" /> {task.rescheduleReason}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {formatTime(task.startTime)} – {formatTime(task.endTime)}
                        </span>
                        <span>•</span>
                        <span>{formatMinutes(task.plannedDurationMins)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => toggleTaskLock(task.id)}
                      className={`p-2 rounded-xl border text-xs transition-colors ${
                        task.isLocked
                          ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800'
                          : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 border-transparent hover:border-slate-200 dark:hover:border-slate-800'
                      }`}
                      title={task.isLocked ? 'Locked: AI scheduler will not auto-move this task' : 'Lock task in place'}
                    >
                      {task.isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                    </button>

                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                        <CheckCircle2 className="w-4 h-4" /> Done
                      </span>
                    ) : (
                      <Link
                        href={`/session/${task.id}`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-sm shadow-indigo-600/30 transition-colors"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>Start</span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
