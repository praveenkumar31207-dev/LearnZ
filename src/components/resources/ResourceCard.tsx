'use client';

import React from 'react';
import Link from 'next/link';
import { LearningResource } from '@/types';
import { useAppStore } from '@/lib/store';
import {
  Video,
  FileCode,
  BookOpen,
  Compass,
  Sparkles,
  ExternalLink,
  Bot,
  Star,
  Clock,
  Bookmark,
  FileText,
  Zap,
  Play,
} from 'lucide-react';
import { formatMinutes } from '@/lib/utils';

interface ResourceCardProps {
  resource: LearningResource;
  onOpenCheatsheet?: (resource: LearningResource) => void;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({
  resource,
  onOpenCheatsheet,
}) => {
  const { bookmarkedResourceIds, toggleBookmarkResource } = useAppStore();
  const isBookmarked = bookmarkedResourceIds.includes(resource.id);

  const getIcon = (type: string) => {
    switch (type) {
      case 'video':
        return Video;
      case 'documentation':
        return FileCode;
      case 'practice':
        return Compass;
      case 'cheatsheet':
        return Zap;
      case 'past_paper':
        return FileText;
      default:
        return BookOpen;
    }
  };

  const Icon = getIcon(resource.resourceType);
  const isCheatsheet = resource.resourceType === 'cheatsheet' || Boolean(resource.cheatsheetData);

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm flex flex-col justify-between space-y-4 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all hover:shadow-md">
      <div>
        {/* Top Badges & Bookmark */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span
              className={`p-1.5 rounded-xl border ${
                isCheatsheet
                  ? 'bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                  : 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800'
              }`}
            >
              <Icon className="w-4 h-4" />
            </span>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {resource.resourceType === 'cheatsheet'
                ? 'Cheatsheet & Formulas'
                : resource.resourceType === 'past_paper'
                ? 'Solved Exam Paper'
                : resource.resourceType}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1 text-amber-500 text-xs font-bold mr-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{resource.qualityScore || 4.9}</span>
            </div>

            <button
              onClick={() => toggleBookmarkResource(resource.id)}
              className={`p-1.5 rounded-xl transition-colors ${
                isBookmarked
                  ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
              title={isBookmarked ? 'Remove from Saved' : 'Save to Favorites'}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Title */}
        <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
          {resource.title}
        </h4>

        {/* Subject, Platform & Duration */}
        <div className="flex items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400 mt-2 flex-wrap">
          {resource.subjectName && (
            <span className="font-bold text-slate-700 dark:text-slate-300">
              {resource.subjectName}
            </span>
          )}
          <span>•</span>
          {resource.sourcePlatform && (
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
              {resource.sourcePlatform}
            </span>
          )}
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatMinutes(resource.estimatedMins)}
          </span>
          <span>•</span>
          <span
            className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
              resource.difficultyLevel === 'Hard'
                ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                : resource.difficultyLevel === 'Easy'
                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            {resource.difficultyLevel}
          </span>
        </div>

        {/* AI Recommendation Reasoning */}
        <div className="mt-3.5 p-3 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100/80 dark:border-indigo-900/50 text-xs text-slate-700 dark:text-slate-300 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-teal-500" /> High-Yield Reason:
          </span>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
            {resource.recommendedReason}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        {isCheatsheet ? (
          <button
            onClick={() => onOpenCheatsheet && onOpenCheatsheet(resource)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-white font-bold text-xs shadow-sm shadow-amber-500/30 transition-all hover:scale-[1.02]"
          >
            <Zap className="w-3.5 h-3.5 fill-white" />
            <span>Open Cheatsheet</span>
          </button>
        ) : (
          <a
            href={resource.url || 'https://google.com'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-sm shadow-indigo-600/30 transition-colors"
          >
            <span>Open Resource</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}

        <Link
          href={`/schedule`}
          className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
          title="Plan study session in schedule"
        >
          <Play className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
        </Link>

        <Link
          href={`/tutors?topic=${encodeURIComponent(resource.topicTitle || resource.title)}`}
          className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
          title="Ask AI Tutor about this"
        >
          <Bot className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
