'use client';

import React, { useState } from 'react';
import {
  AiLearningPath,
  LearningPathMilestone,
  ReferenceVideo,
  ReferenceWebsite,
  CompetencyDomainType,
} from '@/types';
import {
  Sparkles,
  Compass,
  CheckCircle2,
  Clock,
  Video,
  Globe,
  ExternalLink,
  ChevronRight,
  ArrowRight,
  BookOpen,
  Award,
  RotateCcw,
  Zap,
  Bot,
  Play,
} from 'lucide-react';
import Link from 'next/link';

// Pre-packaged curated official statistical learning paths
const DEFAULT_LEARNING_PATHS: AiLearningPath[] = [
  {
    id: 'path-sampling-plfs',
    title: 'Modern Survey Sampling & Labour Statistics (PLFS)',
    targetCompetency: 'Sampling Design, Multiplier Derivation & CAPI Audits',
    domain: 'Statistical Competencies',
    totalEstimatedHours: 24,
    difficulty: 'Intermediate',
    aiRationale:
      'Engineered to bridge critical gaps identified in NSS rotational panel surveys, probability proportional to size (PPS) sampling, and field non-sampling error reduction.',
    progressPercentage: 40,
    createdAt: new Date().toISOString(),
    milestones: [
      {
        id: 'm-1',
        stepNumber: 1,
        title: 'Foundations of Stratified Probability Sampling',
        description:
          'Master First Stage Unit (FSU) selection, Stratum allocation rules (Neyman vs Proportional), and sampling frame verification.',
        estimatedHours: 4,
        status: 'completed',
        competencyDomain: 'Statistical Competencies',
        keySkills: ['FSU Selection', 'Stratification', 'Sampling Error'],
        recommendedIgotCourse: 'iGOT: Principles of Official Sample Surveys',
        referenceVideos: [
          {
            title: 'Stratified Sampling & Cluster Sampling in Depth',
            url: 'https://www.youtube.com/watch?v=pTuj57uXWiI',
            channel: 'Khan Academy Statistics',
            duration: '14 mins',
          },
          {
            title: 'Probability Proportional to Size (PPS) Demystified',
            url: 'https://www.youtube.com/watch?v=qTa_3B52bV4',
            channel: 'Statistics Simplified',
            duration: '22 mins',
          },
        ],
        referenceWebsites: [
          {
            title: 'MoSPI National Sample Survey Standards Manual',
            url: 'https://www.mospi.gov.in',
            source: 'MoSPI Portal',
            description: 'Official methodology handbook for large-scale multi-stage household surveys.',
          },
          {
            title: 'United Nations Statistics Division - Household Survey Guidelines',
            url: 'https://unstats.un.org/unsd/demographic/sources/surveys/',
            source: 'UN Statistics Division',
            description: 'International standards for designing representative national surveys.',
          },
        ],
        checkpointQuizTitle: 'Sampling Design & Multiplier Quiz',
      },
      {
        id: 'm-2',
        stepNumber: 2,
        title: 'PLFS Urban Rotational Panel & Estimating Multipliers',
        description:
          'Learn the mathematical derivation of sample weights, pooled multipliers, and quarterly transition matrices across 4 visits.',
        estimatedHours: 6,
        status: 'in_progress',
        competencyDomain: 'Statistical Competencies',
        keySkills: ['Current Weekly Status', 'Worker Population Ratio', 'Rotational Panel'],
        recommendedIgotCourse: 'NSSTA: Periodic Labour Force Survey Operations',
        referenceVideos: [
          {
            title: 'Measuring Employment: Usual Status vs Current Weekly Status',
            url: 'https://www.youtube.com/watch?v=uK481p2k2a8',
            channel: 'Centre for Monitoring Indian Economy',
            duration: '19 mins',
          },
          {
            title: 'Panel Data Analysis & Household Transition Matrices',
            url: 'https://www.youtube.com/watch?v=cM59C_yO0Z8',
            channel: 'Econometrics Academy',
            duration: '25 mins',
          },
        ],
        referenceWebsites: [
          {
            title: 'Periodic Labour Force Survey (PLFS) Quarterly Bulletin',
            url: 'https://www.mospi.gov.in/web/mospi/plfs',
            source: 'MoSPI PLFS Portal',
            description: 'Official quarterly reports, definitions of LFPR, WPR, and UR.',
          },
          {
            title: 'ILOSTAT: International Labour Organization Standards',
            url: 'https://ilostat.ilo.org',
            source: 'ILO World Portal',
            description: 'Global benchmark definitions for informal and formal work classifications.',
          },
        ],
        checkpointQuizTitle: 'Labour Statistics & PLFS Measurement Standards',
      },
      {
        id: 'm-3',
        stepNumber: 3,
        title: 'Digital CAPI Data Auditing & Paradata Quality Control',
        description:
          'Automate consistency checks, outlier detection in wage schedules, and GPS/paradata timestamp validation using Python/R.',
        estimatedHours: 8,
        status: 'locked',
        competencyDomain: 'Technical Competencies',
        keySkills: ['Computer Assisted Personal Interview (CAPI)', 'Paradata', 'Data Validation'],
        recommendedIgotCourse: 'iGOT: Data Quality Frameworks in Public Administration',
        referenceVideos: [
          {
            title: 'Data Quality Audits & Paradata in Survey Research',
            url: 'https://www.youtube.com/watch?v=J9xV8nI3k3g',
            channel: 'Survey Methodology Insights',
            duration: '30 mins',
          },
        ],
        referenceWebsites: [
          {
            title: 'World Bank Living Standards Measurement Study (LSMS)',
            url: 'https://www.worldbank.org/en/programs/lsms',
            source: 'World Bank LSMS',
            description: 'CAPI best practices and automated quality control pipelines.',
          },
        ],
      },
      {
        id: 'm-4',
        stepNumber: 4,
        title: 'Macro-Aggregation & Dissemination under NDSAP',
        description:
          'Prepare microdata anonymization, synthetic data generation, and API publishing to Open Government Data (data.gov.in).',
        estimatedHours: 6,
        status: 'locked',
        competencyDomain: 'Digital Governance',
        keySkills: ['Open Data (NDSAP)', 'Microdata Anonymization', 'API Dissemination'],
        referenceVideos: [
          {
            title: 'Statistical Disclosure Control & Differential Privacy',
            url: 'https://www.youtube.com/watch?v=gI0wM3ZSXf8',
            channel: 'Data Governance Institute',
            duration: '21 mins',
          },
        ],
        referenceWebsites: [
          {
            title: 'National Data Sharing and Accessibility Policy (data.gov.in)',
            url: 'https://data.gov.in',
            source: 'Open Government Data India',
            description: 'Guidelines on metadata standards and open statistical API publishing.',
          },
        ],
      },
    ],
  },
  {
    id: 'path-sna-gdp',
    title: 'National Income Accounting & 2008 System of National Accounts (SNA)',
    targetCompetency: 'GVA at Basic Prices, Supply-Use Tables & Deflators',
    domain: 'Statistical Competencies',
    totalEstimatedHours: 20,
    difficulty: 'Advanced',
    aiRationale:
      'Tailored for officers working in the National Accounts Division compiling Quarterly and Annual Estimates of GDP and Sectoral GVA.',
    progressPercentage: 15,
    createdAt: new Date().toISOString(),
    milestones: [
      {
        id: 'sna-m-1',
        stepNumber: 1,
        title: 'Principles of 2008 SNA & Production Boundary',
        description: 'Understand Gross Value Added at Basic Prices vs Producer Prices and taxes/subsidies on products.',
        estimatedHours: 5,
        status: 'in_progress',
        competencyDomain: 'Statistical Competencies',
        keySkills: ['Production Boundary', 'GVA Basic Prices', 'Taxes on Products'],
        referenceVideos: [
          {
            title: 'System of National Accounts: How GDP is Calculated',
            url: 'https://www.youtube.com/watch?v=mjJmo5mLUc4',
            channel: 'Economics Explained',
            duration: '18 mins',
          },
        ],
        referenceWebsites: [
          {
            title: 'MoSPI Sources and Methods of National Accounts Statistics',
            url: 'https://www.mospi.gov.in',
            source: 'MoSPI NAD',
            description: 'Comprehensive Indian national accounting framework and base year revisions.',
          },
          {
            title: 'UN Statistical Commission - System of National Accounts (SNA 2008)',
            url: 'https://unstats.un.org/unsd/nationalaccount/sna.asp',
            source: 'United Nations',
            description: 'Global standard recommendations for national economic accounting.',
          },
        ],
        checkpointQuizTitle: 'Diagnostic Assessment: National Accounts & GVA Compilation',
      },
      {
        id: 'sna-m-2',
        stepNumber: 2,
        title: 'Supply and Use Tables (SUT) & Input-Output Multipliers',
        description: 'Balancing commodity flows between domestic output, imports, intermediate consumption, and final demand.',
        estimatedHours: 8,
        status: 'locked',
        competencyDomain: 'Statistical Competencies',
        keySkills: ['SUT Balancing', 'Input-Output Matrix', 'Commodity Flows'],
        referenceVideos: [
          {
            title: 'Understanding Supply and Use Tables (SUT)',
            url: 'https://www.youtube.com/watch?v=9XgqO_kF7wY',
            channel: 'Macroeconomic Analysis Hub',
            duration: '27 mins',
          },
        ],
        referenceWebsites: [
          {
            title: 'Reserve Bank of India: Database on Indian Economy (DBIE)',
            url: 'https://dbie.rbi.org.in',
            source: 'RBI DBIE',
            description: 'Time series macroeconomic accounts and financial balances.',
          },
        ],
      },
      {
        id: 'sna-m-3',
        stepNumber: 3,
        title: 'Double Deflation Technique & Volume Measures',
        description: 'Deploying Separate Deflators for Gross Output and Intermediate Consumption using WPI & CPI indexes.',
        estimatedHours: 7,
        status: 'locked',
        competencyDomain: 'Statistical Competencies',
        keySkills: ['Double Deflation', 'WPI/CPI Deflators', 'Real vs Nominal GDP'],
        referenceVideos: [
          {
            title: 'Double Deflation in Value Added Estimation',
            url: 'https://www.youtube.com/watch?v=3n5Kz0q4MVs',
            channel: 'Applied Econometrics',
            duration: '22 mins',
          },
        ],
        referenceWebsites: [
          {
            title: 'IMF Statistics Department - National Accounts Deflator Manual',
            url: 'https://www.imf.org/en/Data',
            source: 'IMF Portal',
            description: 'International guidelines for real price indexation and double deflation.',
          },
        ],
      },
    ],
  },
];

export const AiLearningPathView: React.FC = () => {
  const [paths, setPaths] = useState<AiLearningPath[]>(DEFAULT_LEARNING_PATHS);
  const [selectedPathId, setSelectedPathId] = useState<string>(DEFAULT_LEARNING_PATHS[0].id);
  const [isGenerating, setIsGenerating] = useState(false);
  const [customGoal, setCustomGoal] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<CompetencyDomainType>('Technical Competencies');

  const currentPath = paths.find((p) => p.id === selectedPathId) || paths[0];

  const handleGenerateCustomPath = () => {
    if (!customGoal.trim()) return;

    setIsGenerating(true);
    setTimeout(() => {
      const newPath: AiLearningPath = {
        id: `path-custom-${Date.now()}`,
        title: `AI Path: ${customGoal}`,
        targetCompetency: customGoal,
        domain: selectedDomain,
        totalEstimatedHours: 18,
        difficulty: 'Intermediate',
        aiRationale: `AI synthesized customized path incorporating iGOT Karmayogi modules, official NSSTA guidelines, and curated YouTube masterclasses for ${customGoal}.`,
        progressPercentage: 0,
        createdAt: new Date().toISOString(),
        milestones: [
          {
            id: `m-c1-${Date.now()}`,
            stepNumber: 1,
            title: `Core Fundamentals of ${customGoal}`,
            description: `Establish theoretical models, official classification frameworks, and foundational concepts.`,
            estimatedHours: 4,
            status: 'in_progress',
            competencyDomain: selectedDomain,
            keySkills: ['Conceptual Foundations', 'Regulatory Standards'],
            recommendedIgotCourse: `iGOT: Foundational ${customGoal}`,
            referenceVideos: [
              {
                title: `${customGoal} - Masterclass for Civil Servants`,
                url: 'https://www.youtube.com/results?search_query=' + encodeURIComponent(customGoal),
                channel: 'Karmayogi Bharat Learning Series',
                duration: '20 mins',
              },
            ],
            referenceWebsites: [
              {
                title: 'Official National Documentation & Statistical Manual',
                url: 'https://www.mospi.gov.in',
                source: 'MoSPI Portal',
                description: 'Guidelines and circulars for official implementation.',
              },
            ],
          },
          {
            id: `m-c2-${Date.now()}`,
            stepNumber: 2,
            title: `Applied Analytical Workflows & Methodologies`,
            description: `Hands-on case studies, empirical data processing, and validation protocols.`,
            estimatedHours: 6,
            status: 'locked',
            competencyDomain: selectedDomain,
            keySkills: ['Data Modeling', 'Field Implementation'],
            referenceVideos: [
              {
                title: `Hands-on Tutorial: Practical ${customGoal}`,
                url: 'https://www.youtube.com/results?search_query=' + encodeURIComponent(customGoal + ' tutorial'),
                channel: 'Statistics & Governance Hub',
                duration: '35 mins',
              },
            ],
            referenceWebsites: [
              {
                title: 'iGOT Karmayogi Course Repository',
                url: 'https://igotkarmayogi.gov.in',
                source: 'iGOT Bharat',
                description: 'Accredited government training module.',
              },
            ],
          },
          {
            id: `m-c3-${Date.now()}`,
            stepNumber: 3,
            title: `Competency Checkpoint & Cadre Assessment`,
            description: `Synthesize outputs into official reports and complete validated MCQ evaluation.`,
            estimatedHours: 8,
            status: 'locked',
            competencyDomain: selectedDomain,
            keySkills: ['Cadre Reporting', 'Quality Assurance'],
            referenceVideos: [
              {
                title: `Assessment Review & Common Pitfalls`,
                url: 'https://www.youtube.com/results?search_query=' + encodeURIComponent(customGoal + ' review'),
                channel: 'Official Academy Channel',
                duration: '15 mins',
              },
            ],
            referenceWebsites: [
              {
                title: 'Reserve Bank of India & MoSPI Data Repositories',
                url: 'https://dbie.rbi.org.in',
                source: 'RBI DBIE',
                description: 'Benchmarking datasets.',
              },
            ],
          },
        ],
      };

      setPaths([newPath, ...paths]);
      setSelectedPathId(newPath.id);
      setIsGenerating(false);
      setCustomGoal('');
    }, 1000);
  };

  const handleToggleMilestone = (milestoneId: string) => {
    setPaths((prev) =>
      prev.map((p) => {
        if (p.id !== currentPath.id) return p;
        const updatedMilestones = p.milestones.map((m) => {
          if (m.id === milestoneId) {
            const nextStatus = m.status === 'completed' ? 'in_progress' : 'completed';
            return { ...m, status: nextStatus as any };
          }
          return m;
        });

        const completedCount = updatedMilestones.filter((m) => m.status === 'completed').length;
        const newPct = Math.round((completedCount / updatedMilestones.length) * 100);

        return {
          ...p,
          milestones: updatedMilestones,
          progressPercentage: newPct,
        };
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-emerald-700 p-6 sm:p-8 text-white shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-white/20 text-white backdrop-blur-xs inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              AI Competency Roadmap Engine
            </span>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              Personalized AI Learning Paths
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
              Dynamically maps your diagnostic test scores, iGOT Karmayogi modules, and curated YouTube video lectures into an actionable milestone plan.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/quizzes"
              className="px-4 py-2.5 rounded-xl bg-white text-blue-900 font-bold text-xs shadow hover:bg-blue-50 transition-all flex items-center gap-2 shrink-0"
            >
              <Award className="w-4 h-4 text-blue-600" />
              <span>Take Diagnostic Test</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Path Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {paths.map((path) => (
          <button
            key={path.id}
            onClick={() => setSelectedPathId(path.id)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border flex items-center gap-2 ${
              selectedPathId === path.id
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>{path.title}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-black/20 text-white">
              {path.progressPercentage}%
            </span>
          </button>
        ))}
      </div>

      {/* AI Path Generator Input */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="text-xs font-bold text-slate-900 dark:text-white">
            Generate a Custom AI Learning Path for Any Competency
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <input
            type="text"
            value={customGoal}
            onChange={(e) => setCustomGoal(e.target.value)}
            placeholder="e.g. Python for Official Statistics, Time Series Forecasting, Consumer Price Index (CPI)..."
            className="flex-1 px-4 py-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value as any)}
            className="px-3 py-2.5 rounded-xl border text-xs font-medium focus:ring-2 focus:ring-blue-500"
          >
            <option value="Statistical Competencies">Statistical Competencies</option>
            <option value="Technical Competencies">Technical Competencies</option>
            <option value="Digital Governance">Digital Governance</option>
            <option value="Behavioural & Managerial Competencies">Behavioural & Managerial</option>
          </select>

          <button
            onClick={handleGenerateCustomPath}
            disabled={isGenerating || !customGoal.trim()}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            {isGenerating ? (
              <span>Generating AI Roadmap...</span>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                <span>Build with AI</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Current Learning Path Overview Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                {currentPath.domain}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {currentPath.difficulty} Level
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1.5">
              {currentPath.title}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Target: <span className="font-semibold text-slate-800 dark:text-slate-200">{currentPath.targetCompetency}</span>
            </p>
          </div>

          {/* Progress Circle & Hours */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs text-slate-500 dark:text-slate-400">Total Duration</div>
              <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1 justify-end">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>{currentPath.totalEstimatedHours} Hours</span>
              </div>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 flex flex-col items-center justify-center">
              <span className="text-sm font-black text-blue-600 dark:text-blue-400">
                {currentPath.progressPercentage}%
              </span>
              <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400">Done</span>
            </div>
          </div>
        </div>

        {/* AI Rationale Box */}
        <div className="p-3.5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/60 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <span className="font-bold text-slate-900 dark:text-white">AI Diagnostic Insight:</span>{' '}
            {currentPath.aiRationale}
          </p>
        </div>

        {/* Milestones Flow */}
        <div className="space-y-4 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Step-by-Step Learning Milestones ({currentPath.milestones.length} Stages)
          </h3>

          <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 pl-6 space-y-6">
            {currentPath.milestones.map((milestone) => {
              const isCompleted = milestone.status === 'completed';
              const isInProgress = milestone.status === 'in_progress';

              return (
                <div key={milestone.id} className="relative group">
                  {/* Circle Indicator on vertical line */}
                  <button
                    onClick={() => handleToggleMilestone(milestone.id)}
                    className={`absolute -left-[35px] top-1.5 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                      isCompleted
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                        : isInProgress
                        ? 'bg-blue-600 border-blue-600 text-white animate-pulse'
                        : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-400'
                    }`}
                    title="Click to toggle milestone completion status"
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <span className="text-[10px] font-bold">{milestone.stepNumber}</span>
                    )}
                  </button>

                  {/* Milestone Card */}
                  <div
                    className={`p-5 rounded-2xl border transition-all ${
                      isCompleted
                        ? 'bg-emerald-50/30 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-900/50'
                        : isInProgress
                        ? 'bg-white dark:bg-slate-850 border-blue-300 dark:border-blue-700 shadow-sm'
                        : 'bg-slate-50/70 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 opacity-80'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                          Milestone {milestone.stepNumber}
                        </span>
                        <span className="text-[10px] text-slate-400">•</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {milestone.estimatedHours} hrs
                        </span>
                      </div>

                      <button
                        onClick={() => handleToggleMilestone(milestone.id)}
                        className={`text-[11px] font-bold px-3 py-1 rounded-xl transition-all self-start sm:self-auto ${
                          isCompleted
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-blue-50'
                        }`}
                      >
                        {isCompleted ? 'Completed' : 'Mark as Done'}
                      </button>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                      {milestone.title}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                      {milestone.description}
                    </p>

                    {/* Key skills pills */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                      {milestone.keySkills.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                        >
                          #{skill}
                        </span>
                      ))}
                    </div>

                    {/* Resources: iGOT Course + YouTube + Web Links */}
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2.5">
                      {milestone.recommendedIgotCourse && (
                        <div className="flex items-center justify-between p-2.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 text-xs">
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                            <div>
                              <span className="font-bold text-slate-900 dark:text-white">
                                iGOT Karmayogi Module:
                              </span>{' '}
                              <span className="text-slate-700 dark:text-slate-300">
                                {milestone.recommendedIgotCourse}
                              </span>
                            </div>
                          </div>
                          <a
                            href="https://igotkarmayogi.gov.in"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5 shrink-0"
                          >
                            <span>Open on iGOT</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}

                      {/* YouTube Video Lectures */}
                      {milestone.referenceVideos.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1">
                            <Video className="w-3 h-3" /> Video Masterclass:
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {milestone.referenceVideos.map((vid, vIdx) => (
                              <a
                                key={vIdx}
                                href={vid.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-rose-400 text-xs flex items-center justify-between group"
                              >
                                <div className="truncate pr-2">
                                  <div className="font-semibold text-slate-900 dark:text-white group-hover:text-rose-600 truncate text-[11px]">
                                    {vid.title}
                                  </div>
                                  <div className="text-[10px] text-slate-400">
                                    {vid.channel} {vid.duration && `• ${vid.duration}`}
                                  </div>
                                </div>
                                <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-rose-500 shrink-0" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Reference Websites */}
                      {milestone.referenceWebsites.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <Globe className="w-3 h-3" /> Reference Portals & Docs:
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {milestone.referenceWebsites.map((web, wIdx) => (
                              <a
                                key={wIdx}
                                href={web.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 text-xs flex items-center justify-between group"
                              >
                                <div className="truncate pr-2">
                                  <div className="font-semibold text-slate-900 dark:text-white group-hover:text-emerald-600 truncate text-[11px]">
                                    {web.title}
                                  </div>
                                  <div className="text-[10px] text-slate-400">{web.source}</div>
                                </div>
                                <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-emerald-500 shrink-0" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Checkpoint Quiz CTA if exists */}
                      {milestone.checkpointQuizTitle && (
                        <div className="pt-1 flex justify-end">
                          <Link
                            href="/quizzes"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700"
                          >
                            <span>Take Checkpoint Test</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
