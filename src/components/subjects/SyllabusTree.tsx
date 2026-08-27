'use client';

import React, { useState } from 'react';
import {
  Subject,
  Unit,
  Chapter,
  Topic,
  DifficultyLevel,
  ImportanceLevel,
} from '@/types';
import { useAppStore } from '@/lib/store';
import {
  ChevronDown,
  ChevronRight,
  Folder,
  FileText,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  TrendingUp,
  ShieldAlert,
  Edit2,
} from 'lucide-react';
import { formatMinutes } from '@/lib/utils';

export const SyllabusTree: React.FC<{ subject: Subject }> = ({ subject }) => {
  const { updateTopic, deleteTopic, addTopicToSubject } = useAppStore();
  const [expandedUnits, setExpandedUnits] = useState<Record<string, boolean>>({
    [subject.units?.[0]?.id || '']: true,
  });
  const [showAddTopicModal, setShowAddTopicModal] = useState<{
    unitIdx: number;
    chapIdx: number;
  } | null>(null);

  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicDiff, setNewTopicDiff] = useState<DifficultyLevel>('Medium');
  const [newTopicImp, setNewTopicImp] = useState<ImportanceLevel>('High');
  const [newTopicMins, setNewTopicMins] = useState(60);

  const toggleUnit = (unitId: string) => {
    setExpandedUnits((prev) => ({ ...prev, [unitId]: !prev[unitId] }));
  };

  const handleAddTopic = () => {
    if (!showAddTopicModal || !newTopicTitle.trim()) return;
    addTopicToSubject(subject.id, showAddTopicModal.unitIdx, showAddTopicModal.chapIdx, {
      title: newTopicTitle,
      difficulty: newTopicDiff,
      importance: newTopicImp,
      estimatedMins: newTopicMins,
    });
    setNewTopicTitle('');
    setShowAddTopicModal(null);
  };

  return (
    <div className="space-y-4">
      {(subject.units || []).map((unit, uIdx) => {
        const isUnitExpanded = expandedUnits[unit.id] ?? true;

        return (
          <div
            key={unit.id}
            className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
          >
            {/* Unit Header */}
            <div
              onClick={() => toggleUnit(unit.id)}
              className="flex items-center justify-between p-4 sm:p-5 bg-slate-50/75 dark:bg-slate-850/50 cursor-pointer hover:bg-slate-100/60 transition-colors"
            >
              <div className="flex items-center gap-3">
                {isUnitExpanded ? (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                )}
                <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center justify-center">
                  U{unit.unitNumber}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {unit.title}
                  </h3>
                  {unit.description && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {unit.description}
                    </p>
                  )}
                </div>
              </div>

              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {(unit.chapters || []).reduce((acc, c) => acc + (c.topics?.length || 0), 0)} Topics
              </span>
            </div>

            {/* Chapters & Topics */}
            {isUnitExpanded && (
              <div className="p-4 sm:p-5 space-y-4 divide-y divide-slate-100 dark:divide-slate-800/60">
                {(unit.chapters || []).map((chapter, cIdx) => (
                  <div key={chapter.id} className="pt-4 first:pt-0 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Folder className="w-4 h-4 text-indigo-500" />
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {chapter.title}
                        </h4>
                      </div>

                      <button
                        onClick={() => setShowAddTopicModal({ unitIdx: uIdx, chapIdx: cIdx })}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Topic</span>
                      </button>
                    </div>

                    {/* Topic Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {(chapter.topics || []).map((topic) => (
                        <div
                          key={topic.id}
                          className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 group"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 mb-1">
                              <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                                {topic.title}
                              </h5>
                              {topic.isCompleted && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              )}
                            </div>

                            <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 flex-wrap">
                              <span
                                className={`px-1.5 py-0.5 rounded font-semibold ${
                                  topic.difficulty === 'Hard'
                                    ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                                    : topic.difficulty === 'Medium'
                                    ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                                    : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                                }`}
                              >
                                {topic.difficulty}
                              </span>
                              <span>•</span>
                              <span>{formatMinutes(topic.estimatedMins)}</span>
                              <span>•</span>
                              <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                                {topic.masteryPercentage}% Mastery
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() => deleteTopic(topic.id)}
                            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition-opacity"
                            title="Delete topic"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Add Topic Modal */}
      {showAddTopicModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Add New Topic to Syllabus
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Topic Title
                </label>
                <input
                  type="text"
                  value={newTopicTitle}
                  onChange={(e) => setNewTopicTitle(e.target.value)}
                  placeholder="e.g. Dynamic Method Dispatch & Interfaces"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Difficulty
                  </label>
                  <select
                    value={newTopicDiff}
                    onChange={(e) => setNewTopicDiff(e.target.value as DifficultyLevel)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Importance
                  </label>
                  <select
                    value={newTopicImp}
                    onChange={(e) => setNewTopicImp(e.target.value as ImportanceLevel)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Estimated Study Time (Minutes)
                </label>
                <input
                  type="number"
                  value={newTopicMins}
                  onChange={(e) => setNewTopicMins(Number(e.target.value))}
                  min={15}
                  max={240}
                  step={5}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setShowAddTopicModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTopic}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-sm"
              >
                Add Topic
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
