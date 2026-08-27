'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { ResourceCard } from '@/components/resources/ResourceCard';
import {
  Compass,
  Search,
  Video,
  FileCode,
  BookOpen,
  Sparkles,
  Plus,
} from 'lucide-react';

export default function ResourcesPage() {
  const { learningResources, allTopics, addResource } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Resource Form
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<any>('video');
  const [newUrl, setNewUrl] = useState('');
  const [newTopicId, setNewTopicId] = useState(allTopics[0]?.id || '');
  const [newReason, setNewReason] = useState('');

  const filteredResources = learningResources.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.topicTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.recommendedReason.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === 'all' || r.resourceType === filterType;
    return matchesSearch && matchesType;
  });

  const handleCreateResource = () => {
    if (!newTitle.trim()) return;
    const topic = allTopics.find((t) => t.id === newTopicId);

    addResource({
      title: newTitle,
      resourceType: newType,
      url: newUrl || 'https://google.com',
      topicId: newTopicId,
      topicTitle: topic?.title,
      difficultyLevel: topic?.difficulty || 'Medium',
      estimatedMins: 30,
      recommendedReason: newReason || 'High-yield conceptual reference matching your syllabus.',
      qualityScore: 4.8,
      sourcePlatform: newType === 'video' ? 'YouTube' : 'Documentation',
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
            <Compass className="w-7 h-7 text-teal-600 dark:text-teal-400" />
            "Where Should I Learn This?" Resource Box
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Curated high-yield video courses, documentation, and practice sandboxes with AI recommendation reasons.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-md shadow-teal-600/30 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Resource</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search topic, concept, or platform..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 shadow-xs"
          />
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: 'all', label: 'All Resources' },
            { id: 'video', label: 'Videos 🎥' },
            { id: 'documentation', label: 'Docs 📖' },
            { id: 'practice', label: 'Practice 💻' },
            { id: 'article', label: 'Articles 📝' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterType === f.id
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Resource Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((res) => (
          <ResourceCard key={res.id} resource={res} />
        ))}
      </div>

      {/* Add Custom Resource Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Add Learning Resource
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Resource Title
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. FreeCodeCamp Deep-Dive Video"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Resource Type
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="video">Video</option>
                    <option value="documentation">Documentation</option>
                    <option value="practice">Practice / Sandbox</option>
                    <option value="article">Article / Notes</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Target Topic
                  </label>
                  <select
                    value={newTopicId}
                    onChange={(e) => setNewTopicId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  >
                    {allTopics.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  URL Link
                </label>
                <input
                  type="url"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Why this resource helps:
                </label>
                <textarea
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  placeholder="Explain why this resource clarifies difficult concepts..."
                  className="w-full h-20 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white resize-none"
                />
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
                onClick={handleCreateResource}
                className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-sm"
              >
                Save Resource
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
