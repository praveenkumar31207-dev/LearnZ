'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { MonthGrid } from './MonthGrid';
import { WeekTimeline } from './WeekTimeline';
import { CalendarExportModal } from './CalendarExportModal';
import {
  CalendarDays,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  Plus,
  Sparkles,
  Download,
  Filter,
  CheckCircle2,
  Lock,
  Unlock,
  Trash2,
  Play,
  Zap,
  Coffee,
  Target,
  Flame,
} from 'lucide-react';
import { formatTime, formatMinutes, formatDate } from '@/lib/utils';
import { PriorityTag, TaskType } from '@/types';

export const CalendarView: React.FC = () => {
  const {
    scheduleTasks,
    academicEvents,
    subjects,
    toggleTaskLock,
    updateTask,
    deleteTask,
    addTask,
    regenerateSchedule,
    lastReschedulePlan,
    undoReschedule,
    profile,
  } = useAppStore();

  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day' | 'agenda'>('month');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
  const [showExportModal, setShowExportModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalInitialDate, setModalInitialDate] = useState<string>('');

  // Add Task Form State
  const [newTitle, setNewTitle] = useState('');
  const [newSubjectId, setNewSubjectId] = useState(subjects[0]?.id || '');
  const [newTaskType, setNewTaskType] = useState<TaskType>('study');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newStartTime, setNewStartTime] = useState('18:00');
  const [newDuration, setNewDuration] = useState(60);
  const [newPriority, setNewPriority] = useState<PriorityTag>('High');

  // Navigation handlers
  const handlePrev = () => {
    const nextD = new Date(currentDate);
    if (viewMode === 'month') {
      nextD.setMonth(nextD.getMonth() - 1);
    } else if (viewMode === 'week') {
      nextD.setDate(nextD.getDate() - 7);
    } else {
      nextD.setDate(nextD.getDate() - 1);
    }
    setCurrentDate(nextD);
    setSelectedDate(nextD);
  };

  const handleNext = () => {
    const nextD = new Date(currentDate);
    if (viewMode === 'month') {
      nextD.setMonth(nextD.getMonth() + 1);
    } else if (viewMode === 'week') {
      nextD.setDate(nextD.getDate() + 7);
    } else {
      nextD.setDate(nextD.getDate() + 1);
    }
    setCurrentDate(nextD);
    setSelectedDate(nextD);
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const handleOpenAddModal = (dateStr?: string) => {
    if (dateStr) {
      setNewDate(dateStr);
    } else {
      setNewDate(selectedDate.toISOString().split('T')[0]);
    }
    setShowAddModal(true);
  };

  const handleCreateTask = () => {
    if (!newTitle.trim()) return;

    const startIso = `${newDate}T${newStartTime}:00`;
    const [h, m] = newStartTime.split(':').map(Number);
    const endMinutes = h * 60 + m + newDuration;
    const endH = Math.floor(endMinutes / 60);
    const endM = endMinutes % 60;
    const endIso = `${newDate}T${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}:00`;

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

  // Filter tasks by subject if chosen
  const filteredTasks = scheduleTasks.filter((t) => {
    if (selectedSubjectId === 'all') return true;
    return t.subjectId === selectedSubjectId;
  });

  const totalStudyMinutes = filteredTasks
    .filter((t) => t.taskType !== 'break')
    .reduce((acc, curr) => acc + curr.plannedDurationMins, 0);

  const completedCount = filteredTasks.filter((t) => t.status === 'completed').length;

  return (
    <div className="space-y-6">
      {/* Top Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <CalendarDays className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            Study Timetable & Routine Calendar
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Visual month, week, and day time-blocking synchronized with exam dates and AI adaptations.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowExportModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850 shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-indigo-500" />
            <span>Sync to Calendar (.ics)</span>
          </button>

          <button
            onClick={() => handleOpenAddModal()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850 shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-500" />
            <span>Add Study Slot</span>
          </button>

          <button
            onClick={() => regenerateSchedule()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-sm shadow-indigo-600/30 transition-all hover:scale-105"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Recalculate Timetable</span>
          </button>
        </div>
      </div>

      {/* Schedule Metrics Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
            Scheduled Study Time
          </span>
          <span className="text-lg font-black text-slate-900 dark:text-white mt-0.5 block">
            {formatMinutes(totalStudyMinutes)}
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
            Sessions Completed
          </span>
          <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-0.5 block">
            {completedCount} / {filteredTasks.length}
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
            Active Study Streak
          </span>
          <span className="text-lg font-black text-amber-500 mt-0.5 block flex items-center gap-1">
            <Flame className="w-4 h-4 fill-amber-500" /> {profile.streakDays} Days
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
            Upcoming Exams
          </span>
          <span className="text-lg font-black text-rose-600 dark:text-rose-400 mt-0.5 block flex items-center gap-1">
            <Target className="w-4 h-4" /> {academicEvents.length} Exams
          </span>
        </div>
      </div>

      {/* Date Navigation & View Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        {/* Left: Previous / Today / Next Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 p-0.5">
            <button
              onClick={handlePrev}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors"
              title="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleToday}
              className="px-3 py-1 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 transition-colors"
            >
              Today
            </button>
            <button
              onClick={handleNext}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors"
              title="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <span className="text-sm font-extrabold text-slate-900 dark:text-white px-2">
            {currentDate.toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric',
            })}
          </span>
        </div>

        {/* Right: View Mode Selector */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80">
          {[
            { id: 'month', label: 'Month View 📅' },
            { id: 'week', label: 'Week Grid 🗓️' },
            { id: 'day', label: 'Day Timeline ⏰' },
            { id: 'agenda', label: 'Agenda List 📋' },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setViewMode(mode.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === mode.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Subject Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1 shrink-0">
          <Filter className="w-3.5 h-3.5" /> Filter Subject:
        </span>
        <button
          onClick={() => setSelectedSubjectId('all')}
          className={`px-3 py-1 rounded-xl text-xs font-bold shrink-0 transition-all ${
            selectedSubjectId === 'all'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
          }`}
        >
          All Subjects ({scheduleTasks.length})
        </button>

        {subjects.map((subj) => {
          const isSelected = selectedSubjectId === subj.id;
          const count = scheduleTasks.filter((t) => t.subjectId === subj.id).length;

          return (
            <button
              key={subj.id}
              onClick={() => setSelectedSubjectId(subj.id)}
              className={`px-3 py-1 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1.5 transition-all ${
                isSelected
                  ? 'text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
              }`}
              style={{
                backgroundColor: isSelected ? subj.color || '#6366f1' : undefined,
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: isSelected ? '#ffffff' : subj.color || '#6366f1' }}
              />
              <span>{subj.name}</span>
              <span className="opacity-75 text-[10px]">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Reschedule Alert Banner */}
      {lastReschedulePlan && (
        <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm animate-in fade-in">
          <div className="flex items-start gap-2.5">
            <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold">AI Timetable Recalibrated</h4>
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

      {/* Main Views Container */}
      {viewMode === 'month' && (
        <MonthGrid
          currentDate={currentDate}
          selectedDate={selectedDate}
          onSelectDate={(d) => {
            setSelectedDate(d);
            setCurrentDate(d);
          }}
          tasks={filteredTasks}
          events={academicEvents}
          onOpenAddTaskModal={handleOpenAddModal}
        />
      )}

      {viewMode === 'week' && (
        <WeekTimeline
          selectedDate={selectedDate}
          tasks={filteredTasks}
          events={academicEvents}
          onSelectDate={(d) => {
            setSelectedDate(d);
            setCurrentDate(d);
          }}
          onOpenAddTaskModal={handleOpenAddModal}
        />
      )}

      {(viewMode === 'day' || viewMode === 'agenda') && (
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {viewMode === 'day'
                  ? `Timeline for ${selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}`
                  : 'All Scheduled Agenda Tasks'}
              </h3>
              <p className="text-xs text-slate-500">
                {viewMode === 'day' ? 'Manage your daily study slots' : 'Complete upcoming study sequence'}
              </p>
            </div>

            <button
              onClick={() => handleOpenAddModal()}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 border border-indigo-200 dark:border-indigo-800 text-xs font-bold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Block</span>
            </button>
          </div>

          <div className="space-y-3">
            {filteredTasks.length === 0 ? (
              <div className="p-12 text-center text-slate-400">No scheduled tasks match your filter.</div>
            ) : (
              filteredTasks.map((task) => {
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
                          <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200">{task.title}</h4>
                          <span className="text-[11px] text-amber-700 dark:text-amber-400">
                            {formatTime(task.startTime)} – {formatTime(task.endTime)} ({task.plannedDurationMins}m)
                          </span>
                        </div>
                      </div>
                      <button onClick={() => deleteTask(task.id)} className="p-1.5 rounded-lg text-amber-400 hover:text-amber-700">
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
                            <span className="text-sm font-bold text-slate-900 dark:text-white">{task.title}</span>

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
                          </div>

                          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {formatDate(task.startTime)} • {formatTime(task.startTime)} – {formatTime(task.endTime)}
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
              })
            )}
          </div>
        </div>
      )}

      {/* Add Custom Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Schedule Study Session / Break Slot
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
                  placeholder="e.g. Java Concurrency Locks & Thread Pools"
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

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Scheduled Date
                </label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
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
                Save Schedule Block
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export to Calendar Modal */}
      {showExportModal && (
        <CalendarExportModal
          tasks={filteredTasks}
          events={academicEvents}
          onClose={() => setShowExportModal(false)}
        />
      )}
    </div>
  );
};
