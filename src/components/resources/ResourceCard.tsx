'use client';

import React from 'react';
import Link from 'next/link';
import { LearningResource } from '@/types';
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
} from 'lucide-react';
import { formatMinutes } from '@/lib/utils';

export const ResourceCard: React.FC<{ resource: LearningResource }> = ({
  resource,
}) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'video':
        return Video;
      case 'documentation':
        return FileCode;
      case 'practice':
        return Compass;
      default:
        return BookOpen;
    }
  };

  const Icon = getIcon(resource.resourceType);

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between space-y-4 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              <Icon className="w-4 h-4" />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {resource.resourceType}
            </span>
          </div>

          <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{resource.qualityScore || 4.9}</span>
          </div>
        </div>

        {/* Title */}
        <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
          {resource.title}
        </h4>

        {/* Platform & Duration */}
        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-2">
          {resource.sourcePlatform && (
            <span className="font-medium text-indigo-600 dark:text-indigo-400">
              {resource.sourcePlatform}
            </span>
          )}
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatMinutes(resource.estimatedMins)}
          </span>
          <span>•</span>
          <span className="font-semibold">{resource.difficultyLevel}</span>
        </div>

        {/* AI Recommendation Reasoning */}
        <div className="mt-4 p-3 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 text-xs text-slate-700 dark:text-slate-300 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-teal-500" /> Why this is recommended:
          </span>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
            {resource.recommendedReason}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <a
          href={resource.url || 'https://google.com'}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-sm shadow-indigo-600/30 transition-colors"
        >
          <span>Open Resource</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        <Link
          href={`/tutors?topic=${encodeURIComponent(resource.topicTitle || 'this topic')}`}
          className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
          title="Ask AI Tutor about this"
        >
          <Bot className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
