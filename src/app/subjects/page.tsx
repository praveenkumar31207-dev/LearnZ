'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { SyllabusTree } from '@/components/subjects/SyllabusTree';
import { MaterialUploader } from '@/components/subjects/MaterialUploader';
import {
  BookOpen,
  Plus,
  Trash2,
  Calendar,
  Award,
  Sparkles,
  Layers,
  UploadCloud,
  ArrowRight,
} from 'lucide-react';
import { formatRelativeDays } from '@/lib/utils';
import { Subject } from '@/types';

export default function SubjectsPage() {
  const { subjects, addSubject, deleteSubject } = useAppStore();
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id || '');
  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'syllabus' | 'upload'>('syllabus');

  // New Subject Form
  const [newName, setNewName] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newColor, setNewColor] = useState('#6366f1');
  const [newExamDate, setNewExamDate] = useState('');
  const [newTargetMarks, setNewTargetMarks] = useState(90);

  const activeSubject = subjects.find((s) => s.id === selectedSubjectId) || subjects[0];

  const handleCreateSubject = () => {
    if (!newName.trim()) return;
    const created = addSubject({
      name: newName,
      code: newCode,
      color: newColor,
      icon: 'BookOpen',
      targetMarks: newTargetMarks,
      creditWeight: 4.0,
      examDate: newExamDate || undefined,
    });
    setSelectedSubjectId(created.id);
    setNewName('');
    setNewCode('');
    setShowAddSubjectModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <BookOpen className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            Subjects & Syllabus Architecture
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Organize modules into a 5-level learning hierarchy and parse materials with AI.
          </p>
        </div>

        <button
          onClick={() => setShowAddSubjectModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Subject</span>
        </button>
      </div>

      {/* Subject Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {subjects.map((subj) => {
          const isSelected = subj.id === activeSubject?.id;
          return (
            <button
              key={subj.id}
              onClick={() => setSelectedSubjectId(subj.id)}
              className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                isSelected
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm border-2'
                  : 'bg-slate-200/60 dark:bg-slate-850 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
              style={{
                borderColor: isSelected ? subj.color || '#6366f1' : 'transparent',
              }}
            >
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: subj.color || '#6366f1' }}
              />
              <span>{subj.name}</span>
            </button>
          );
        })}
      </div>

      {activeSubject && (
        <div className="space-y-6">
          {/* Active Subject Meta Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div
                className="w-14 h-14 rounded-2xl text-white flex items-center justify-center font-extrabold text-xl shadow-md shrink-0"
                style={{ backgroundColor: activeSubject.color || '#6366f1' }}
              >
                {activeSubject.code?.substring(0, 2) || activeSubject.name.substring(0, 2)}
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {activeSubject.code || 'Academic Course'}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  {activeSubject.name}
                </h2>
                <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-2 flex-wrap">
                  {activeSubject.examDate && (
                    <span className="flex items-center gap-1.5 font-semibold text-rose-600 dark:text-rose-400">
                      <Calendar className="w-3.5 h-3.5" />
                      Exam: {formatRelativeDays(activeSubject.examDate)}
                    </span>
                  )}
                  <span>•</span>
                  <span>Target: {activeSubject.targetMarks}%</span>
                  <span>•</span>
                  <span>Credit Weight: {activeSubject.creditWeight}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab('syllabus')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                  activeTab === 'syllabus'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                Syllabus Hierarchy
              </button>
              <button
                onClick={() => setActiveTab('upload')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                  activeTab === 'upload'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                AI Material Ingestion
              </button>
            </div>
          </div>

          {/* Active Tab Content */}
          {activeTab === 'syllabus' ? (
            <SyllabusTree subject={activeSubject} />
          ) : (
            <MaterialUploader
              subjectId={activeSubject.id}
              subjectName={activeSubject.name}
              onSuccess={() => setActiveTab('syllabus')}
            />
          )}
        </div>
      )}

      {/* Add Subject Modal */}
      {showAddSubjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Add New Academic Subject
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Subject Name
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Physics — Electromagnetism"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Course Code
                  </label>
                  <input
                    type="text"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    placeholder="e.g. PHY-201"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Color Accent
                  </label>
                  <input
                    type="color"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    className="w-full h-9 rounded-xl cursor-pointer bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Exam Date
                  </label>
                  <input
                    type="date"
                    value={newExamDate}
                    onChange={(e) => setNewExamDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Target Marks %
                  </label>
                  <input
                    type="number"
                    value={newTargetMarks}
                    onChange={(e) => setNewTargetMarks(Number(e.target.value))}
                    min={50}
                    max={100}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setShowAddSubjectModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateSubject}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-sm"
              >
                Create Subject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
