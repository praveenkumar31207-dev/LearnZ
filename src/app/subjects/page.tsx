'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { SyllabusTree } from '@/components/subjects/SyllabusTree';
import { MaterialUploader } from '@/components/subjects/MaterialUploader';
import {
  Award,
  Plus,
  AlertCircle,
  Calendar,
  Sparkles,
  Layers,
  UploadCloud,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  TrendingUp,
  Cpu,
  BarChart2,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { formatRelativeDays } from '@/lib/utils';
import { CompetencyDomainType } from '@/types';

export default function SubjectsPage() {
  const {
    competencyDomains,
    allCompetencySkills,
    criticalGaps,
    moderateGaps,
    strengths,
    updateSkillLevel,
    subjects,
    profile,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'domains' | 'gap_analysis' | 'syllabus' | 'upload'>('domains');
  const [selectedDomain, setSelectedDomain] = useState<CompetencyDomainType>('Statistical Competencies');

  const currentDomainObj = competencyDomains.find((d) => d.name === selectedDomain) || competencyDomains[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
              National Statistical Framework
            </span>
            <span className="text-xs text-slate-400">Target Benchmark: 80%+</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white mt-1 flex items-center gap-2.5">
            <Award className="w-7 h-7 text-blue-700 dark:text-blue-400" />
            Statistical Competency Profile & Gap Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Granular evaluation across 4 official domains: Statistical, Technical, Digital Governance & Behavioural
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 self-start sm:self-center">
          <button
            onClick={() => setActiveTab('domains')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'domains'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            4 Domains
          </button>
          <button
            onClick={() => setActiveTab('gap_analysis')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
              activeTab === 'gap_analysis'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-rose-600'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>AI Gap Analysis</span>
          </button>
          <button
            onClick={() => setActiveTab('syllabus')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'syllabus'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Curriculum Hierarchy
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
              activeTab === 'upload'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Ingest Manual</span>
          </button>
        </div>
      </div>

      {/* 1. DOMAINS TAB */}
      {activeTab === 'domains' && (
        <div className="space-y-6">
          {/* Domain Selector Pills */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {competencyDomains.map((dom) => {
              const isSelected = dom.name === selectedDomain;
              return (
                <button
                  key={dom.id}
                  onClick={() => setSelectedDomain(dom.name)}
                  className={`p-4 rounded-2xl text-left border transition-all ${
                    isSelected
                      ? 'bg-white dark:bg-slate-900 shadow-md ring-2 ring-blue-600 dark:ring-blue-400'
                      : 'bg-slate-50 dark:bg-slate-850 hover:bg-white text-slate-600 dark:text-slate-300'
                  }`}
                  style={{
                    borderColor: isSelected ? dom.color : 'transparent',
                  }}
                >
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="text-[10px] uppercase text-slate-400">{dom.code}</span>
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-black"
                      style={{ backgroundColor: `${dom.color}20`, color: dom.color }}
                    >
                      {dom.averageScore}%
                    </span>
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight">
                    {dom.name}
                  </h3>
                  <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 mt-2 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${dom.averageScore}%`, backgroundColor: dom.color }}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Domain Deep-Dive */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Domain Details & Competencies
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {currentDomainObj.name}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Official benchmark required: {currentDomainObj.requiredBenchmark}% • Cadre Average: {currentDomainObj.averageScore}%
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  {currentDomainObj.skills.length} Competency Metrics
                </span>
              </div>
            </div>

            {/* Skills List in Domain */}
            <div className="space-y-4">
              {currentDomainObj.skills.map((skill) => (
                <div
                  key={skill.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${
                            skill.gapSeverity === 'critical'
                              ? 'bg-rose-500'
                              : skill.gapSeverity === 'improvement_needed'
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                        />
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                          {skill.title}
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 pl-4">
                        Standards: {skill.keyManualsAndStandards.join(' • ')}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <div className="text-right">
                        <span className="text-sm font-black text-slate-900 dark:text-white">
                          {skill.currentLevel}%
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          / {skill.requiredLevel}% Target
                        </span>
                      </div>

                      {/* Interactive Re-assessment slider / test trigger */}
                      <button
                        onClick={() => updateSkillLevel(skill.id, skill.currentLevel + 5)}
                        className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-xs transition-colors"
                      >
                        +5% Practice
                      </button>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        skill.currentLevel < 50
                          ? 'bg-rose-500'
                          : skill.currentLevel < 75
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${skill.currentLevel}%` }}
                    />
                  </div>

                  {/* AI Rationale */}
                  <div className="text-[11px] text-slate-600 dark:text-slate-300 pl-4 border-l-2 border-slate-300 dark:border-slate-600">
                    <span className="font-bold text-blue-700 dark:text-blue-400">AI Analysis: </span>
                    {skill.aiRationale}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. GAP ANALYSIS TAB */}
      {activeTab === 'gap_analysis' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                AI Automated Competency Gap Analysis: Current vs Required
              </h2>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              The AI engine compares your evaluated skill levels against the benchmark required for your cadre (
              <span className="font-semibold text-slate-800 dark:text-slate-200">{profile.cadre}</span> in{' '}
              <span className="font-semibold text-slate-800 dark:text-slate-200">{profile.department}</span>
              ), categorizing competencies into 🔴 Critical Gaps, 🟠 Moderate Gaps, and 🟢 Strengths:
            </p>

            {/* Gap Summary Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60">
                <span className="text-[10px] font-bold text-rose-700 dark:text-rose-300 uppercase">
                  🔴 Critical Gaps (&lt;50%)
                </span>
                <div className="text-2xl font-black text-rose-600 mt-1">{criticalGaps.length} Skills</div>
                <p className="text-[10px] text-slate-500 mt-1">Immediate intervention required on iGOT</p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60">
                <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 uppercase">
                  🟠 Improvement Needed (50-74%)
                </span>
                <div className="text-2xl font-black text-amber-600 mt-1">{moderateGaps.length} Skills</div>
                <p className="text-[10px] text-slate-500 mt-1">Structured upskilling in progress</p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60">
                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase">
                  🟢 Strong Competencies (≥75%)
                </span>
                <div className="text-2xl font-black text-emerald-600 mt-1">{strengths.length} Skills</div>
                <p className="text-[10px] text-slate-500 mt-1">Exceeds official benchmark</p>
              </div>
            </div>

            {/* Detailed Critical Gaps with AI Rationale */}
            <div className="pt-4 space-y-3">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                Priority Action Plan for Critical Gaps:
              </h3>
              {criticalGaps.map((gap) => (
                <div
                  key={gap.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-rose-200 dark:border-rose-900/50 space-y-2"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{gap.title}</h4>
                      <span className="text-[10px] font-bold text-rose-700 bg-rose-100 dark:bg-rose-950 px-2 py-0.5 rounded">
                        Current: {gap.currentLevel}% (Gap: -{gap.gapPercentage}%)
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400">{gap.domainName}</span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    <strong>Root Cause Diagnosis: </strong>
                    {gap.aiRationale}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-blue-700 dark:text-blue-400 font-semibold">
                    <span>Recommended Training Action:</span>
                    {gap.recommendedActions.map((act, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950 border border-blue-200">
                        {act}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. SYLLABUS HIERARCHY TAB */}
      {activeTab === 'syllabus' && subjects[0] && (
        <div className="space-y-6">
          <SyllabusTree subject={subjects[0]} />
        </div>
      )}

      {/* 4. UPLOAD MANUAL TAB */}
      {activeTab === 'upload' && subjects[0] && (
        <div className="space-y-6">
          <MaterialUploader
            subjectId={subjects[0].id}
            subjectName={subjects[0].name}
            onSuccess={() => setActiveTab('domains')}
          />
        </div>
      )}
    </div>
  );
}
