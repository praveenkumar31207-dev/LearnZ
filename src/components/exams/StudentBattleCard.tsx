'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import {
  Trophy,
  Crown,
  Flame,
  Swords,
  Shield,
  Zap,
  Share2,
  Check,
  Sparkles,
  Award,
  TrendingUp,
} from 'lucide-react';

export const StudentBattleCard: React.FC = () => {
  const { studentBattleProfile } = useAppStore();
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(
      `Check out my Exam War stats on CogniStudy: ${studentBattleProfile.fullName} (${studentBattleProfile.eloRating} Elo • ${studentBattleProfile.tier} Tier • ${studentBattleProfile.winRate}% Win-Rate)!`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in max-w-4xl mx-auto">
      {/* 1. Main Student Showcase Card */}
      <div className="rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 text-white border-2 border-indigo-700/60 p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-indigo-500/15 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-amber-500/15 blur-3xl" />

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 p-0.5 shadow-xl shadow-indigo-500/30 shrink-0">
              <div className="w-full h-full rounded-[22px] bg-slate-950 flex items-center justify-center text-4xl">
                {studentBattleProfile.avatarEmoji}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  {studentBattleProfile.fullName}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500 text-slate-950 shadow-xs">
                  {studentBattleProfile.tier}
                </span>
              </div>
              <p className="text-xs text-indigo-300 font-semibold">
                @{studentBattleProfile.handle} • {studentBattleProfile.university}
              </p>
              <p className="text-[11px] text-slate-400">
                Title: <span className="text-amber-300 font-semibold">{studentBattleProfile.title}</span>
              </p>
            </div>
          </div>

          <button
            onClick={handleShare}
            className="self-start sm:self-center inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-bold text-white transition-all shadow-xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Card Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Performance Card</span>
              </>
            )}
          </button>
        </div>

        {/* 4 Stat Badges Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Elo Rating</span>
            <span className="text-2xl font-black text-amber-400 mt-0.5 block">
              {studentBattleProfile.eloRating}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Win Rate</span>
            <span className="text-2xl font-black text-emerald-400 mt-0.5 block">
              {studentBattleProfile.winRate}%
            </span>
            <span className="text-[9px] text-slate-400">
              {studentBattleProfile.wins}W - {studentBattleProfile.losses}L
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Active Streak</span>
            <span className="text-2xl font-black text-rose-400 mt-0.5 block flex items-center justify-center gap-1">
              <Flame className="w-5 h-5 fill-rose-500" /> {studentBattleProfile.currentStreak}
            </span>
            <span className="text-[9px] text-slate-400">Best: {studentBattleProfile.bestStreak} Wins</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Total Battle XP</span>
            <span className="text-2xl font-black text-indigo-400 mt-0.5 block">
              {studentBattleProfile.totalXp.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Subject Mastery Radar Meters */}
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3 relative z-10">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" /> Subject Combat Mastery Breakdown
          </span>

          <div className="space-y-2.5">
            {studentBattleProfile.radarStats.map((stat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">{stat.subject}</span>
                  <span className="font-bold text-white">{stat.score}% Mastery</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-teal-400 to-amber-400 transition-all duration-500"
                    style={{ width: `${stat.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Showcase Badges & Trophies */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <h4 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-500" />
          Showcase Trophies & Milestones
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {studentBattleProfile.showcaseBadges.map((badge) => (
            <div
              key={badge.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3"
            >
              <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center text-xl shrink-0 border border-amber-200 dark:border-amber-900">
                {badge.icon}
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h5 className="text-xs font-extrabold text-slate-900 dark:text-white">
                    {badge.title}
                  </h5>
                  <span
                    className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded ${
                      badge.rarity === 'Legendary'
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                        : badge.rarity === 'Epic'
                        ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                        : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                    }`}
                  >
                    {badge.rarity}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  {badge.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Recent Match History */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <h4 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Swords className="w-4 h-4 text-indigo-600" />
          Recent 1v1 Battle History
        </h4>

        <div className="space-y-2.5">
          {studentBattleProfile.recentMatches.map((m) => (
            <div
              key={m.id}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-lg shrink-0">
                  {m.opponentAvatar}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900 dark:text-white">
                      vs {m.opponentName}
                    </span>
                    <span className="text-[10px] text-slate-400">({m.opponentTier})</span>
                  </div>
                  <span className="text-[10px] text-slate-500">
                    {m.subject} • {m.date}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-right">
                <span className="font-extrabold text-slate-900 dark:text-white">
                  {m.userScore} - {m.opponentScore} PTS
                </span>
                <span
                  className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider ${
                    m.result === 'Victory'
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                      : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                  }`}
                >
                  {m.result} ({m.eloChange > 0 ? `+${m.eloChange}` : m.eloChange})
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
