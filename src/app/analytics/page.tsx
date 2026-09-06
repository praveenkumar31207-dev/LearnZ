'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import {
  BarChart3,
  Award,
  TrendingUp,
  Clock,
  CheckCircle2,
  Brain,
  Zap,
  Building2,
  Sparkles,
  Users,
  ShieldCheck,
  BookOpen,
  ArrowUpRight,
} from 'lucide-react';
import { formatMinutes } from '@/lib/utils';

export const AnalyticsPage: React.FC = () => {
  const {
    profile,
    competencyDomains,
    allCompetencySkills,
    criticalGaps,
    igotCourses,
    departmentMetrics,
    emergingSkills,
    achievements,
    activeRole,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'individual' | 'workforce' | 'predictive'>('individual');

  const completedCourses = igotCourses.filter((c) => c.completionStatus === 'Completed').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
              Intelligence & Workforce Evaluation
            </span>
            <span className="text-xs text-slate-400">MoSPI Capacity Building Wing</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white mt-1 flex items-center gap-2.5">
            <BarChart3 className="w-7 h-7 text-blue-700 dark:text-blue-400" />
            Competency Analytics & Workforce Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Measure individual capacity growth, department skill-gap heatmaps, and predictive emerging skill requirements.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 self-start sm:self-center">
          <button
            onClick={() => setActiveTab('individual')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'individual'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            My Competency Progress
          </button>
          <button
            onClick={() => setActiveTab('workforce')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
              activeTab === 'workforce'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Workforce Analytics</span>
          </button>
          <button
            onClick={() => setActiveTab('predictive')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
              activeTab === 'predictive'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Future Skill Requirements</span>
          </button>
        </div>
      </div>

      {/* 1. INDIVIDUAL LEARNER PROGRESS TAB */}
      {activeTab === 'individual' && (
        <div className="space-y-6">
          {/* Progression Before vs After Training Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-900 text-white border border-blue-800/60 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-300 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Verified Competency Improvement
              </span>
              <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                +24% Overall Gain
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white/10 border border-white/10">
                <span className="text-[11px] text-slate-300">Baseline Before Training:</span>
                <div className="text-2xl font-black text-slate-300 mt-0.5">48%</div>
                <p className="text-[10px] text-slate-400 mt-1">Initial Cadre Diagnostic Score</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/10 border border-white/10">
                <span className="text-[11px] text-emerald-300">Current Evaluated Competency:</span>
                <div className="text-2xl font-black text-white mt-0.5">{profile.overallCompetencyScore}%</div>
                <p className="text-[10px] text-emerald-300 mt-1">Post iGOT & NSSTA Modules</p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-400/30">
                <span className="text-[11px] text-emerald-200">Net Competency Gain:</span>
                <div className="text-2xl font-black text-emerald-300 mt-0.5">+24 Percentage Points</div>
                <p className="text-[10px] text-emerald-200/80 mt-1">Accelerated learning velocity</p>
              </div>
            </div>
          </div>

          {/* Top 4 Metric Highlights */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 block mb-1">Learning Hours Logged</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {profile.learningHoursLogged} Hours
              </div>
              <span className="text-[11px] text-emerald-600 font-semibold">
                Across 4 iGOT / NSSTA modules
              </span>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 block mb-1">Courses Completed</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {completedCourses} / {igotCourses.length}
              </div>
              <span className="text-[11px] text-blue-600 font-semibold">
                Karmayogi Verified Certs
              </span>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 block mb-1">Continuous Streak</span>
              <div className="text-2xl font-black text-orange-600 flex items-center gap-1.5">
                <span>🔥 {profile.streakDays} Days</span>
              </div>
              <span className="text-[11px] text-slate-500">{profile.totalXp} XP Accumulated</span>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 block mb-1">Critical Skill Gaps Left</span>
              <div className="text-2xl font-black text-rose-600">
                {criticalGaps.length} Gaps
              </div>
              <span className="text-[11px] text-slate-500">Down from 5 at baseline</span>
            </div>
          </div>

          {/* Domain Breakdown Mastery Bars */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Brain className="w-4 h-4 text-blue-600" />
              Domain-Wise Official Competency Distribution
            </h3>

            <div className="space-y-4">
              {competencyDomains.map((dom) => (
                <div key={dom.id} className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: dom.color }} />
                      <span>{dom.name}</span>
                    </div>
                    <span className="font-black" style={{ color: dom.color }}>
                      {dom.averageScore}% (Target: {dom.requiredBenchmark}%)
                    </span>
                  </div>

                  <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${dom.averageScore}%`, backgroundColor: dom.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. WORKFORCE ANALYTICS (ADMINISTRATOR DASHBOARD) */}
      {activeTab === 'workforce' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  Workforce Competency Overview across MoSPI & State Directorates
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Comparative skill heatmap and training completion rates across divisions
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                2,945 Active Officials Monitored
              </span>
            </div>

            {/* Department Comparison Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-400 uppercase">
                    <th className="py-3 px-3">Division / Directorate</th>
                    <th className="py-3 px-3">Cadre Size</th>
                    <th className="py-3 px-3">Average Competency</th>
                    <th className="py-3 px-3">iGOT Completion</th>
                    <th className="py-3 px-3">Statistical</th>
                    <th className="py-3 px-3">Technical</th>
                    <th className="py-3 px-3">Top Skill Gaps</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {departmentMetrics.map((dept) => (
                    <tr key={dept.departmentId} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-3.5 px-3 font-bold text-slate-900 dark:text-white">
                        {dept.departmentName}
                        <span className="text-[10px] text-slate-400 block font-normal">{dept.ministry}</span>
                      </td>
                      <td className="py-3.5 px-3 font-medium text-slate-600 dark:text-slate-300">
                        {dept.totalOfficials}
                      </td>
                      <td className="py-3.5 px-3">
                        <span className={`font-black ${dept.averageCompetency >= 75 ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {dept.averageCompetency}%
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-semibold text-blue-700 dark:text-blue-400">
                        {dept.trainingCompletionRate}%
                      </td>
                      <td className="py-3.5 px-3 font-medium">{dept.domainScores.statistical}%</td>
                      <td className="py-3.5 px-3 font-medium text-rose-600">{dept.domainScores.technical}%</td>
                      <td className="py-3.5 px-3 text-[11px] text-slate-500">
                        {dept.priorityGaps.join(' • ')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. PREDICTIVE ANALYTICS: FUTURE SKILL REQUIREMENTS */}
      {activeTab === 'predictive' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                AI Predictive Analytics: Future Skill Requirements for Official Statistics
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              The platform's predictive engine forecasts emerging technological requirements based on national statistical priorities, technology shifts, and civil service capacity mandates:
            </p>

            <div className="space-y-4 pt-2">
              {emergingSkills.map((skill) => (
                <div
                  key={skill.id}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 flex items-center justify-center font-black text-xs">
                        AI
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">{skill.skillName}</h4>
                        <span className="text-[10px] text-slate-400 font-semibold">{skill.urgencyLevel}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                        {skill.growthCategory}
                      </span>
                      <span className="text-xs font-black text-emerald-600">
                        +{skill.projectedAdoptionRate}% Projected Need
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-slate-500 block mb-1">Primary Institutional Drivers:</span>
                    <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-300 space-y-0.5">
                      {skill.primaryDrivers.map((driver, i) => (
                        <li key={i}>{driver}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="text-slate-500">
                      <strong>Target Cadres:</strong> {skill.applicableCadres.join(', ')}
                    </span>
                    <span className="text-blue-700 dark:text-blue-400 font-bold">
                      Recommended: {skill.recommendedPrograms[0]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsPage;
