'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { LeaderboardEntry, BattleTier } from '@/types';
import { Trophy, Crown, Flame, Search, Medal, Star, Sparkles, Filter, Shield } from 'lucide-react';

export const LeaderboardTable: React.FC = () => {
  const { leaderboard } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('global');

  const filteredEntries = leaderboard.filter((entry) => {
    const matchesSearch =
      entry.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.handle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.university.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <span className="w-7 h-7 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xs shadow-md shadow-amber-400/30">
          🥇 1
        </span>
      );
    }
    if (rank === 2) {
      return (
        <span className="w-7 h-7 rounded-xl bg-slate-300 text-slate-900 flex items-center justify-center font-black text-xs shadow-md shadow-slate-300/30">
          🥈 2
        </span>
      );
    }
    if (rank === 3) {
      return (
        <span className="w-7 h-7 rounded-xl bg-amber-700 text-white flex items-center justify-center font-black text-xs shadow-md shadow-amber-700/30">
          🥉 3
        </span>
      );
    }
    return (
      <span className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center font-bold text-xs">
        #{rank}
      </span>
    );
  };

  const getTierColor = (tier: BattleTier) => {
    switch (tier) {
      case 'Grandmaster':
        return 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800';
      case 'Diamond':
        return 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800';
      case 'Platinum':
        return 'bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800';
      case 'Gold':
        return 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Controls & Category Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search students by name, handle, or college..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 shadow-xs"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: 'global', label: '🏆 Global All-Time' },
            { id: 'season', label: '⚡ Weekly War Season' },
            { id: 'java', label: '☕ Java Masters' },
            { id: 'calc', label: '📐 Calculus Titans' },
          ].map((c) => (
            <button
              key={c.id}
              onClick={() => setFilterCategory(c.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                filterCategory === c.id
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard Table Container */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs">
            {/* Header */}
            <thead className="bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="py-4 px-4 sm:px-6">Rank</th>
                <th className="py-4 px-4">Student</th>
                <th className="py-4 px-4">Elo Tier & Rating</th>
                <th className="py-4 px-4">Win Rate & Record</th>
                <th className="py-4 px-4">Streak</th>
                <th className="py-4 px-4">Total XP</th>
                <th className="py-4 px-4 hidden md:table-cell">Mastery Badges</th>
              </tr>
            </thead>

            {/* Rows */}
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredEntries.map((entry) => {
                const isMe = entry.isCurrentUser;

                return (
                  <tr
                    key={entry.id}
                    className={`transition-colors ${
                      isMe
                        ? 'bg-indigo-50/70 dark:bg-indigo-950/40 font-semibold'
                        : 'hover:bg-slate-50/70 dark:hover:bg-slate-850/50'
                    }`}
                  >
                    {/* Rank */}
                    <td className="py-4 px-4 sm:px-6">{getRankBadge(entry.rank)}</td>

                    {/* Student Info */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xl shrink-0 border border-indigo-200 dark:border-indigo-800">
                          {entry.avatarEmoji}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm">
                              {entry.fullName}
                            </span>
                            {isMe && (
                              <span className="text-[9px] font-black px-1.5 py-0.2 rounded-md bg-indigo-600 text-white uppercase tracking-wider">
                                YOU
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                            @{entry.handle} • {entry.university}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Elo Tier */}
                    <td className="py-4 px-4">
                      <div className="space-y-0.5">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider ${getTierColor(
                            entry.tier
                          )}`}
                        >
                          {entry.tier}
                        </span>
                        <span className="text-xs font-black text-slate-900 dark:text-white block">
                          {entry.eloRating} ELO
                        </span>
                      </div>
                    </td>

                    {/* Win Rate */}
                    <td className="py-4 px-4">
                      <div className="space-y-0.5">
                        <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 block">
                          {entry.winRate}%
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {entry.wins}W - {entry.losses}L
                        </span>
                      </div>
                    </td>

                    {/* Streak */}
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-500">
                        <Flame className="w-3.5 h-3.5 fill-amber-500" />
                        {entry.streak}
                      </span>
                    </td>

                    {/* XP */}
                    <td className="py-4 px-4 font-black text-slate-900 dark:text-white">
                      {entry.totalXp.toLocaleString()} XP
                    </td>

                    {/* Badges */}
                    <td className="py-4 px-4 hidden md:table-cell">
                      <div className="flex items-center gap-1 flex-wrap">
                        {entry.subjectBadges.map((badge, bIdx) => (
                          <span
                            key={bIdx}
                            className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-semibold"
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
