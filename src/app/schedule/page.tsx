'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import {
  CalendarDays,
  Clock,
  Sparkles,
  Lock,
  Unlock,
  Play,
  Plus,
  Coffee,
  CheckCircle2,
  Trash2,
  Zap,
  Calendar,
  Layers,
} from 'lucide-react';
import { formatTime, formatMinutes, formatDate } from '@/lib/utils';
import { ScheduleTask, PriorityTag, TaskType } from '@/types';

export default function SchedulePage() {
  const {
    scheduleTasks,
    toggleTaskLock,
    updateTask,
    deleteTask,
    addTask,
    regenerateSchedule,
    lastReschedulePlan,
    undoReschedule,
    subjects,
  } = useAppStore();

  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');
  const [showAddModal, setShowAddModal] = useState(false);

  // Add Task Form State
  const [newTitle, setNewTitle] = useState('');
  const [newSubjectId, setNewSubjectId] = useState(subjects[0]?.id || '');
  const [newTaskType, setNewTaskType] = useState<TaskType>('study');
  const [newStartTime, setNewStartTime] = useState('18:00');
  const [newDuration, setNewDuration] = useState(60);
  const [newPriority, setNewPriority] = useState<PriorityTag>('High');

  const handleCreateTask = () => {
    if (!newTitle.trim()) return;

    const todayStr = new Date().toISOString().split('T')[0];
    const startIso = `${todayStr}T${newStartTime}:00`;
    const [h, m] = newStartTime.split(':').map(Number);
    const endMinutes = h * 60 + m + newDuration;
    const endH = Math.floor(endMinutes / 60);
    const endM = endMinutes % 60;
    const endIso = `${todayStr}T${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}:00`;

    const selectedSubj = subjects.find((s) => s.id === newSubjectId);

    addTask({
      title: newTitle,
      subjectId: newSubjectId,
      subjectName: selectedSubj?.name || 'General',
      subjectColor: selectedSubj?.color || '#6366f1',
      taskType: newTaskType,
      startTime: startIso,
      endTime: endIso,
      plannedDurationMins: newDuration,
      status: 'pending',
      isLocked: true,
      priorityTag: newPriority,
    });

    setNewTitle('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <CalendarDays className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            Adaptive Study Plan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Dynamic timetable optimized by exam urgency, prerequisites, and daily energy routines.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Custom Block</span>
          </button>

          <button
            onClick={() => regenerateSchedule()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-sm shadow-indigo-600/30 transition-all hover:scale-105"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Recalculate Schedule</span>
          </button>
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div className="flex items-center justify-between gap-4">
        <div className="inline-flex p-1 rounded-2xl bg-slate-200/70 dark:bg-slate-900 border border-slate-300/60 dark:border-slate-800">
          <button
            onClick={() => setViewMode('day')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'day'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Daily Plan
          </button>
          <button
            onClick={() => setViewMode('week')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'week'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Weekly Overview
          </button>
          <button
            onClick={() => setViewMode('month')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'month'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Monthly Countdown
          </button>
        </div>

        <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Today: <span className="font-bold text-slate-900 dark:text-white">{formatDate(new Date().toISOString())}</span>
        </div>
      </div>

      {/* Dynamic Reschedule Alert Banner */}
      {lastReschedulePlan && (
        <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm animate-in fade-in">
          <div className="flex items-start gap-2.5">
            <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold">
                AI Timetable Recalibrated
              </h4>
              <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80 mt-0.5 leading-relaxed">
                {lastReschedulePlan.explanation}
              </p>
            </div>
          </div>
          <button
            onClick={undoReschedule}
            className="self-start sm:self-center px-3 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-900 hover:bg-amber-200 text-amber-900 dark:text-amber-100 text-xs font-bold transition-colors"
          >
            Undo Adjustment
          </button>
        </div>
      )}

      {/* Schedule Task List */}
      <div className="space-y-3">
        {scheduleTasks.map((task) => {
          const isBreak = task.taskType === 'break';
          const isCompleted = task.status === 'completed';

          if (isBreak) {
            return (
              <div
                key={task.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-50/40 dark:bg-amber-950/20 border border-dashed border-amber-200 dark:border-amber-800/60"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
                    <Coffee className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200">
                      {task.title}
                    </h4>
                    <span className="text-[11px] text-amber-700 dark:text-amber-400">
                      {formatTime(task.startTime)} – {formatTime(task.endTime)} ({task.plannedDurationMins}m)
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="p-1.5 rounded-lg text-amber-400 hover:text-amber-700"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          }

          return (
            <div
              key={task.id}
              className={`p-4 sm:p-5 rounded-3xl border transition-all ${
                isCompleted
                  ? 'bg-slate-50 dark:bg-slate-850/40 border-slate-200 dark:border-slate-800 opacity-70'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div
                    className="w-2 self-stretch rounded-full shrink-0"
                    style={{ backgroundColor: task.subjectColor || '#6366f1' }}
                  />

                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {task.title}
                      </span>

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

                      {task.isLocked && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                          <Lock className="w-3 h-3" /> Locked
                        </span>
                      )}

                      {task.rescheduleReason && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60 px-2 py-0.5 rounded-md">
                          <Zap className="w-2.5 h-2.5" /> {task.rescheduleReason}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {formatTime(task.startTime)} – {formatTime(task.endTime)}
                      </span>
                      <span>•</span>
                      <span>{formatMinutes(task.plannedDurationMins)}</span>
                      <span>•</span>
                      <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                        {task.taskType.toUpperCase()}
                      </span>
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
                        : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 border-slate-200 dark:border-slate-800'
                    }`}
                    title={task.isLocked ? 'Locked: AI scheduler will not move' : 'Lock session in place'}
                  >
                    {task.isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 border border-slate-200 dark:border-slate-800 transition-colors"
                    title="Remove task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {isCompleted ? (
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                      <CheckCircle2 className="w-4 h-4" /> Done
                    </span>
                  ) : (
                    <Link
                      href={`/session/${task.id}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all hover:scale-105"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Start Session</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Custom Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Add Custom Study Session / Break
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Session Title
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Physics Thermodynamics Practice"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Subject
                  </label>
                  <select
                    value={newSubjectId}
                    onChange={(e) => setNewSubjectId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Task Type
                  </label>
                  <select
                    value={newTaskType}
                    onChange={(e) => setNewTaskType(e.target.value as TaskType)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="study">Study</option>
                    <option value="revision">Revision</option>
                    <option value="practice">Practice</option>
                    <option value="quiz">Quiz</option>
                    <option value="break">Break</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    value={newDuration}
                    onChange={(e) => setNewDuration(Number(e.target.value))}
                    min={10}
                    max={240}
                    step={5}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTask}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-sm"
              >
                Save Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
