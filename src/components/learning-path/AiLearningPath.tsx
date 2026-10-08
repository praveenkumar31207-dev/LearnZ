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

// Pre-packaged curated semester exam learning paths
const DEFAULT_LEARNING_PATHS: AiLearningPath[] = [
  {
    id: 'path-os-concurrency',
    title: 'Operating Systems & Concurrency Semester Exam Sprint',
    targetCompetency: 'Process Scheduling, Deadlocks, Paging & Virtual Memory',
    domain: 'Operating Systems & Systems',
    totalEstimatedHours: 24,
    difficulty: 'Intermediate',
    aiRationale:
      'Engineered to bridge critical semester exam gaps in Process Synchronization, Banker\'s Algorithm, and Virtual Memory Paging with step-by-step derivations and university PYQ solutions.',
    progressPercentage: 40,
    createdAt: new Date().toISOString(),
    milestones: [
      {
        id: 'm-1',
        stepNumber: 1,
        title: 'Foundations of CPU Scheduling & Process States',
        description:
          'Master FCFS, SJF, Round Robin with time quanta, Gantt chart construction, and turnaround/waiting time derivations.',
        estimatedHours: 4,
        status: 'completed',
        competencyDomain: 'Operating Systems & Systems',
        keySkills: ['Process Scheduling', 'Context Switching', 'Gantt Charts'],
        recommendedCourse: 'NPTEL: Operating Systems Fundamentals',
        referenceVideos: [
          {
            title: 'CPU Scheduling Algorithms (FCFS, SJF, RR) Masterclass',
            url: 'https://www.youtube.com/results?search_query=cpu+scheduling+gate+smashers',
            channel: 'Gate Smashers',
            duration: '22 mins',
          },
        ],
        referenceWebsites: [
          {
            title: 'GeeksforGeeks CPU Scheduling Practice',
            url: 'https://www.geeksforgeeks.org/cpu-scheduling-in-operating-systems/',
            source: 'GeeksforGeeks Academic',
            description: 'Solved numericals and Gantt chart derivations for semester exams.',
          },
          {
            title: 'NPTEL IIT Kharagpur OS Lecture Notes',
            url: 'https://nptel.ac.in',
            source: 'NPTEL / SWAYAM',
            description: 'Official university curriculum notes on process management.',
          },
        ],
        checkpointQuizTitle: 'CPU Scheduling & Gantt Chart Diagnostic',
      },
      {
        id: 'm-2',
        stepNumber: 2,
        title: 'Deadlock Avoidance & Banker\'s Algorithm',
        description:
          'Learn the mathematical derivation of Allocation, Max, and Need matrices, Safety algorithm execution, and Resource Request validation.',
        estimatedHours: 6,
        status: 'in_progress',
        competencyDomain: 'Operating Systems & Systems',
        keySkills: ['Banker Algorithm', 'Resource Allocation Graph', 'Safety State Derivation'],
        recommendedCourse: 'NPTEL: Concurrency & Synchronization',
        referenceVideos: [
          {
            title: 'Banker’s Algorithm Numerical Solved Step-by-Step',
            url: 'https://www.youtube.com/results?search_query=bankers+algorithm+solved',
            channel: 'Knowledge Gate',
            duration: '18 mins',
          },
        ],
        referenceWebsites: [
          {
            title: 'Gate Overflow Operating Systems PYQ Vault',
            url: 'https://gateoverflow.in',
            source: 'GATE Overflow',
            description: 'Validated previous year university and competitive exam questions.',
          },
        ],
        checkpointQuizTitle: 'Deadlock Detection & Banker Algorithm Quiz',
      },
      {
        id: 'm-3',
        stepNumber: 3,
        title: 'Virtual Memory Paging, TLB & Page Replacement',
        description:
          'Master Effective Memory Access Time (EMAT) calculations, Two-Level Paging, and Page Fault derivations using FIFO, LRU, and Optimal algorithms.',
        estimatedHours: 8,
        status: 'locked',
        competencyDomain: 'Operating Systems & Systems',
        keySkills: ['Two-Level Paging', 'TLB Access Time Numericals', 'Page Replacement'],
        recommendedCourse: 'NPTEL: Memory Management Mastery',
        referenceVideos: [
          {
            title: 'Page Replacement Algorithms (FIFO, LRU, Optimal)',
            url: 'https://www.youtube.com/results?search_query=page+replacement+algorithms',
            channel: 'Gate Smashers',
            duration: '25 mins',
          },
        ],
        referenceWebsites: [
          {
            title: 'GeeksforGeeks Virtual Memory & Paging',
            url: 'https://www.geeksforgeeks.org/virtual-memory-in-operating-system/',
            source: 'GFG University Vault',
            description: 'Formula sheets for Effective Memory Access Time (EMAT) calculations.',
          },
        ],
      },
      {
        id: 'm-4',
        stepNumber: 4,
        title: 'File Systems, Inodes & Disk Scheduling (SCAN/C-SCAN)',
        description:
          'Calculate Unix Inode direct/indirect block address capacities, and solve disk arm head movement numericals.',
        estimatedHours: 6,
        status: 'locked',
        competencyDomain: 'Operating Systems & Systems',
        keySkills: ['Disk Scheduling Algorithms', 'Unix Inode Calculation', 'University PYQ Drill'],
        referenceVideos: [
          {
            title: 'Disk Scheduling Algorithms (SSTF, SCAN, LOOK)',
            url: 'https://www.youtube.com/results?search_query=disk+scheduling+gate+smashers',
            channel: 'Gate Smashers',
            duration: '20 mins',
          },
        ],
        referenceWebsites: [
          {
            title: 'University Previous Year Question Paper Repository',
            url: 'https://nptel.ac.in',
            source: 'University Exam Vault',
            description: 'Curated 10-marker derivations and solved answer keys.',
          },
        ],
      },
    ],
  },
  {
    id: 'path-dbms-normalization',
    title: 'Database Management Systems (DBMS) Semester Mastery',
    targetCompetency: 'Normalization (1NF-BCNF), ACID Properties, Transactions & Indexing',
    domain: 'Database & Cloud Architecture',
    totalEstimatedHours: 20,
    difficulty: 'Advanced',
    aiRationale:
      'Tailored for B.Tech CS semester students to master functional dependencies, canonical covers, serializability graphs, and B+ Tree indexing.',
    progressPercentage: 15,
    createdAt: new Date().toISOString(),
    milestones: [
      {
        id: 'dbms-m-1',
        stepNumber: 1,
        title: 'Relational Schema Design & Functional Dependency Inference',
        description: 'Compute attribute closure, identify candidate keys systematically, and determine minimal canonical covers.',
        estimatedHours: 5,
        status: 'in_progress',
        competencyDomain: 'Database & Cloud Architecture',
        keySkills: ['Closure of Attribute Set', 'Candidate Key Finder', 'Canonical Cover'],
        referenceVideos: [
          {
            title: 'How to Find Candidate Keys and Attribute Closure',
            url: 'https://www.youtube.com/results?search_query=candidate+key+closure+gate+smashers',
            channel: 'Gate Smashers',
            duration: '18 mins',
          },
        ],
        referenceWebsites: [
          {
            title: 'GeeksforGeeks Functional Dependency Practice',
            url: 'https://www.geeksforgeeks.org/functional-dependency-and-attribute-closure/',
            source: 'GeeksforGeeks Academic',
            description: 'Canonical cover algorithms and candidate key proofs.',
          },
        ],
        checkpointQuizTitle: 'Diagnostic Assessment: Attribute Closure & Candidate Keys',
      },
      {
        id: 'dbms-m-2',
        stepNumber: 2,
        title: 'Database Normalization (1NF, 2NF, 3NF, BCNF) & Decomposition',
        description: 'Prove Lossless Join Decomposition and Dependency Preservation across relational schemas.',
        estimatedHours: 8,
        status: 'locked',
        competencyDomain: 'Database & Cloud Architecture',
        keySkills: ['Lossless Join Decomposition', 'Dependency Preserving', 'BCNF vs 3NF'],
        referenceVideos: [
          {
            title: 'Database Normalization 1NF, 2NF, 3NF, BCNF with Solved Examples',
            url: 'https://www.youtube.com/results?search_query=database+normalization+gate+smashers',
            channel: 'Gate Smashers',
            duration: '28 mins',
          },
        ],
        referenceWebsites: [
          {
            title: 'NPTEL Database Design & Normalization',
            url: 'https://nptel.ac.in',
            source: 'NPTEL / IIT Madras',
            description: 'Formal proofs for dependency preservation and 3NF synthesis.',
          },
        ],
      },
      {
        id: 'dbms-m-3',
        stepNumber: 3,
        title: 'Transaction Management & Conflict Serializability',
        description: 'Construct precedence graphs, identify cycle conditions, and prove schedules satisfy Two-Phase Locking (2PL).',
        estimatedHours: 7,
        status: 'locked',
        competencyDomain: 'Database & Cloud Architecture',
        keySkills: ['Conflict Serializability', 'Precedence Graph', 'Two-Phase Locking (2PL)'],
        referenceVideos: [
          {
            title: 'Conflict Serializability & Precedence Graph Method',
            url: 'https://www.youtube.com/results?search_query=conflict+serializability+precedence+graph',
            channel: 'Knowledge Gate',
            duration: '21 mins',
          },
        ],
        referenceWebsites: [
          {
            title: 'MIT OCW Database Systems Principles',
            url: 'https://ocw.mit.edu',
            source: 'MIT OpenCourseWare',
            description: 'Concurrency control and write-ahead logging (ARIES) study materials.',
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
        aiRationale: `AI synthesized customized path incorporating NPTEL/SWAYAM university modules, official syllabus guidelines, and curated YouTube masterclasses for ${customGoal}.`,
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
            recommendedCourse: `NPTEL: Foundational ${customGoal}`,
            referenceVideos: [
              {
                title: `${customGoal} - University Exam Masterclass`,
                url: 'https://www.youtube.com/results?search_query=' + encodeURIComponent(customGoal),
                channel: 'NPTEL Online Courses',
                duration: '20 mins',
              },
            ],
            referenceWebsites: [
              {
                title: 'University Syllabus & Exam Blueprint Portal',
                url: 'https://nptel.ac.in',
                source: 'NPTEL / SWAYAM',
                description: 'University lecture series and semester exam study materials.',
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
                title: `Hands-on Tutorial: University Exam ${customGoal}`,
                url: 'https://www.youtube.com/results?search_query=' + encodeURIComponent(customGoal + ' tutorial'),
                channel: 'Gate Smashers & College Waala',
                duration: '35 mins',
              },
            ],
            referenceWebsites: [
              {
                title: 'University Exam Prep Module Repository',
                url: 'https://nptel.ac.in',
                source: 'NPTEL / SWAYAM',
                description: 'Accredited university exam preparation module.',
              },
            ],
          },
          {
            id: `m-c3-${Date.now()}`,
            stepNumber: 3,
            title: `Competency Checkpoint & Semester Exam Assessment`,
            description: `Practice previous year question papers and complete validated MCQ evaluation.`,
            estimatedHours: 8,
            status: 'locked',
            competencyDomain: selectedDomain,
            keySkills: ['PYQ Practice', 'Exam Quality Assurance'],
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
                title: 'GeeksforGeeks University Previous Year Question Bank',
                url: 'https://www.geeksforgeeks.org',
                source: 'GeeksforGeeks Academic',
                description: 'Semester exam PYQs and solved derivation sets.',
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
              Dynamically maps your diagnostic test scores, NPTEL university modules, and curated YouTube video lectures into an actionable semester exam milestone plan.
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

                    {/* Resources: Course + YouTube + Web Links */}
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2.5">
                      {(milestone.recommendedCourse || milestone.recommendedIgotCourse) && (
                        <div className="flex items-center justify-between p-2.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 text-xs">
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                            <div>
                              <span className="font-bold text-slate-900 dark:text-white">
                                NPTEL / Exam Module:
                              </span>{' '}
                              <span className="text-slate-700 dark:text-slate-300">
                                {milestone.recommendedCourse || milestone.recommendedIgotCourse}
                              </span>
                            </div>
                          </div>
                          <a
                            href="https://nptel.ac.in"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5 shrink-0"
                          >
                            <span>Open on NPTEL</span>
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
