'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  UserProfile,
  UserAvailability,
  UserRole,
  CompetencyDomain,
  CompetencySkill,
  IGOTCourse,
  UploadedLearningMaterial,
  DepartmentWorkforceMetric,
  EmergingSkillPrediction,
  Subject,
  Topic,
  ScheduleTask,
  StudySession,
  SpacedRevision,
  AITutor,
  LearningResource,
  Quiz,
  QuizAttempt,
  QuizQuestion,
  AcademicEvent,
  Achievement,
  NotificationItem,
  RescheduleAdjustmentPlan,
  UnderstandingRating,
  PriorityTag,
  CheatsheetItem,
  DrillResult,
  BattleChallenger,
  BattleQuestion,
  LeaderboardEntry,
  StudentBattleProfile,
} from '@/types';
import {
  initialProfile,
  demoTrainerProfile,
  demoAdminProfile,
  initialAvailability,
  initialCompetencyDomains,
  initialIGOTCourses,
  initialUploadedMaterials,
  initialDepartmentMetrics,
  initialEmergingSkills,
  initialSubjects,
  initialScheduleTasks,
  initialSpacedRevisions,
  initialAITutors,
  initialLearningResources,
  initialQuizzes,
  initialAcademicEvents,
  initialAchievements,
  initialNotifications,
  initialCheatsheets,
  initialBattleQuestions,
  initialChallengers,
  initialLeaderboard,
  initialStudentBattleProfile,
} from './mockData';
import { generateStudySchedule, calculateTopicPriority } from './schedulerEngine';
import { calculateDynamicReschedule, applyReschedulePlan } from './rescheduleEngine';
import { calculateSM2Revision, identifyWeakTopics } from './spacedRevisionEngine';
import { supabase, isSupabaseConfigured } from './supabaseClient';

interface AppContextType {
  // Official Profile & Role Switcher
  profile: UserProfile;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  availability: UserAvailability;
  updateAvailability: (updates: Partial<UserAvailability>) => void;

  // Competency Domains & Gap Analysis
  competencyDomains: CompetencyDomain[];
  allCompetencySkills: CompetencySkill[];
  updateSkillLevel: (skillId: string, newLevel: number) => void;
  criticalGaps: CompetencySkill[];
  moderateGaps: CompetencySkill[];
  strengths: CompetencySkill[];

  // iGOT Karmayogi Repository & Learning Path
  igotCourses: IGOTCourse[];
  enrolInCourse: (courseId: string) => void;
  updateCourseProgress: (courseId: string, progress: number) => void;
  completeCourse: (courseId: string) => void;

  // AI Assessment & MCQ Generator (Trainer & Learner)
  uploadedMaterials: UploadedLearningMaterial[];
  addUploadedMaterial: (material: Omit<UploadedLearningMaterial, 'id' | 'uploadDate'>) => void;
  generateMCQsFromMaterial: (
    materialId: string,
    numQuestions: number,
    topic: string,
    difficulty: 'Easy' | 'Medium' | 'Hard' | 'Mixed'
  ) => QuizQuestion[];
  quizzes: Quiz[];
  addQuiz: (quiz: Omit<Quiz, 'id' | 'userId'>) => void;
  updateQuestionInQuiz: (quizId: string, questionId: string, updates: Partial<QuizQuestion>) => void;
  approveQuestionInQuiz: (quizId: string, questionId: string) => void;
  quizAttempts: QuizAttempt[];
  submitQuizAttempt: (attempt: Omit<QuizAttempt, 'id' | 'userId' | 'completedAt'>) => void;

  // Administrator Workforce Metrics & Predictions
  departmentMetrics: DepartmentWorkforceMetric[];
  emergingSkills: EmergingSkillPrediction[];

  // Legacy Subjects & Routine tasks for timetable compatibility
  subjects: Subject[];
  addSubject: (subject: Omit<Subject, 'id' | 'userId'>) => Subject;
  updateSubject: (id: string, updates: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;
  allTopics: Topic[];
  addTopicToSubject: (subjectId: string, unitIndex: number, chapterIndex: number, topic: Partial<Topic>) => void;
  updateTopic: (topicId: string, updates: Partial<Topic>) => void;
  deleteTopic: (topicId: string) => void;
  bulkAddParsedHierarchy: (subjectId: string, units: any[]) => void;

  // Adaptive Learning Path Schedule
  scheduleTasks: ScheduleTask[];
  updateTask: (taskId: string, updates: Partial<ScheduleTask>) => void;
  toggleTaskLock: (taskId: string) => void;
  addTask: (task: Omit<ScheduleTask, 'id' | 'userId'>) => void;
  deleteTask: (taskId: string) => void;
  regenerateSchedule: (targetDate?: Date) => ScheduleTask[];

  lastReschedulePlan: RescheduleAdjustmentPlan | null;
  previousTaskState: ScheduleTask[] | null;
  applyReschedule: (plan: RescheduleAdjustmentPlan) => void;
  undoReschedule: () => void;
  dismissRescheduleNotification: () => void;

  studySessions: StudySession[];
  completeStudySession: (
    taskId: string,
    actualMins: number,
    rating: UnderstandingRating,
    focusScore: number,
    distractionCount: number,
    notes?: string
  ) => RescheduleAdjustmentPlan | null;

  spacedRevisions: SpacedRevision[];
  recordRevisionRating: (topicId: string, rating: UnderstandingRating) => void;
  weakTopics: { topic: Topic; weakReason: string; riskScore: number }[];

  // AI Statistical Learning Assistant
  aiTutors: AITutor[];
  addCustomTutor: (tutor: Omit<AITutor, 'id' | 'userId'>) => void;

  // Learning Resources & Bookmarks
  learningResources: LearningResource[];
  addResource: (resource: Omit<LearningResource, 'id'>) => void;
  bookmarkedResourceIds: string[];
  toggleBookmarkResource: (id: string) => void;
  cheatsheets: CheatsheetItem[];

  drillResults: DrillResult[];
  recordDrillResult: (result: DrillResult) => void;

  battleQuestions: BattleQuestion[];
  challengers: BattleChallenger[];
  leaderboard: LeaderboardEntry[];
  studentBattleProfile: StudentBattleProfile;
  recordBattleVictory: (won: boolean, eloDelta: number, xpDelta: number, matchInfo: any) => void;

  academicEvents: AcademicEvent[];
  addAcademicEvent: (event: Omit<AcademicEvent, 'id' | 'userId'>) => void;
  deleteAcademicEvent: (id: string) => void;

  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  addNotification: (notif: Omit<NotificationItem, 'id' | 'userId' | 'createdAt' | 'isRead'>) => void;

  achievements: Achievement[];
  whatShouldIStudyNow: () => {
    task?: ScheduleTask;
    topic?: Topic;
    subject?: Subject;
    skill?: CompetencySkill;
    reason: string[];
    priorityTag: PriorityTag;
    recommendedDurationMins: number;
  };

  resetToDefault: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'skill_intelligence_platform_v2';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [activeRole, setActiveRoleState] = useState<UserRole>('learner');
  const [availability, setAvailability] = useState<UserAvailability>(initialAvailability);
  const [competencyDomains, setCompetencyDomains] = useState<CompetencyDomain[]>(initialCompetencyDomains);
  const [igotCourses, setIgotCourses] = useState<IGOTCourse[]>(initialIGOTCourses);
  const [uploadedMaterials, setUploadedMaterials] = useState<UploadedLearningMaterial[]>(initialUploadedMaterials);
  const [departmentMetrics] = useState<DepartmentWorkforceMetric[]>(initialDepartmentMetrics);
  const [emergingSkills] = useState<EmergingSkillPrediction[]>(initialEmergingSkills);

  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);
  const [scheduleTasks, setScheduleTasks] = useState<ScheduleTask[]>(initialScheduleTasks);
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [spacedRevisions, setSpacedRevisions] = useState<SpacedRevision[]>(initialSpacedRevisions);
  const [aiTutors, setAiTutors] = useState<AITutor[]>(initialAITutors);
  const [learningResources, setLearningResources] = useState<LearningResource[]>(initialLearningResources);
  const [bookmarkedResourceIds, setBookmarkedResourceIds] = useState<string[]>(['res-official-1', 'res-official-2']);
  const [cheatsheets] = useState<CheatsheetItem[]>(initialCheatsheets);
  const [quizzes, setQuizzes] = useState<Quiz[]>(initialQuizzes);
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);
  const [drillResults, setDrillResults] = useState<DrillResult[]>([]);
  const [battleQuestions] = useState<BattleQuestion[]>(initialBattleQuestions);
  const [challengers] = useState<BattleChallenger[]>(initialChallengers);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(initialLeaderboard);
  const [studentBattleProfile, setStudentBattleProfile] = useState<StudentBattleProfile>(initialStudentBattleProfile);
  const [academicEvents, setAcademicEvents] = useState<AcademicEvent[]>(initialAcademicEvents);
  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  const [lastReschedulePlan, setLastReschedulePlan] = useState<RescheduleAdjustmentPlan | null>(null);
  const [previousTaskState, setPreviousTaskState] = useState<ScheduleTask[] | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.profile) setProfile(parsed.profile);
        if (parsed.activeRole) setActiveRoleState(parsed.activeRole);
        if (parsed.availability) setAvailability(parsed.availability);
        if (parsed.competencyDomains) setCompetencyDomains(parsed.competencyDomains);
        if (parsed.igotCourses) setIgotCourses(parsed.igotCourses);
        if (parsed.uploadedMaterials) setUploadedMaterials(parsed.uploadedMaterials);
        if (parsed.subjects) setSubjects(parsed.subjects);
        if (parsed.scheduleTasks) setScheduleTasks(parsed.scheduleTasks);
        if (parsed.studySessions) setStudySessions(parsed.studySessions);
        if (parsed.spacedRevisions) setSpacedRevisions(parsed.spacedRevisions);
        if (parsed.aiTutors) setAiTutors(parsed.aiTutors);
        if (parsed.learningResources) setLearningResources(parsed.learningResources);
        if (parsed.bookmarkedResourceIds) setBookmarkedResourceIds(parsed.bookmarkedResourceIds);
        if (parsed.quizzes) setQuizzes(parsed.quizzes);
        if (parsed.quizAttempts) setQuizAttempts(parsed.quizAttempts);
        if (parsed.drillResults) setDrillResults(parsed.drillResults);
        if (parsed.academicEvents) setAcademicEvents(parsed.academicEvents);
        if (parsed.achievements) setAchievements(parsed.achievements);
        if (parsed.notifications) setNotifications(parsed.notifications);
      }
    } catch (e) {
      console.warn('Failed to parse saved state, using defaults', e);
    }
  }, []);

  // Sync to localStorage and Supabase
  const saveState = (updatedState: Record<string, any>) => {
    try {
      const current = {
        profile,
        activeRole,
        availability,
        competencyDomains,
        igotCourses,
        uploadedMaterials,
        subjects,
        scheduleTasks,
        studySessions,
        spacedRevisions,
        aiTutors,
        learningResources,
        quizzes,
        quizAttempts,
        academicEvents,
        achievements,
        notifications,
        ...updatedState,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(current));

      // Asynchronous non-blocking Supabase sync
      if (isSupabaseConfigured && typeof window !== 'undefined') {
        if (updatedState.profile) {
          Promise.resolve(
            supabase.from('profiles').upsert(
              {
                email: updatedState.profile.email,
                full_name: updatedState.profile.fullName,
                role: updatedState.profile.role,
                designation: updatedState.profile.designation,
                department: updatedState.profile.department,
                cadre: updatedState.profile.cadre,
                current_assignment: updatedState.profile.currentAssignment,
                overall_competency_score: updatedState.profile.overallCompetencyScore,
                updated_at: new Date().toISOString(),
              },
              { onConflict: 'email' }
            )
          )
            .then(() => {})
            .catch(() => {});
        }
      }
    } catch (e) {
      console.warn('Failed to sync to storage', e);
    }
  };

  // Role switching
  const setActiveRole = (role: UserRole) => {
    setActiveRoleState(role);
    if (role === 'trainer') {
      setProfile(demoTrainerProfile);
    } else if (role === 'admin') {
      setProfile(demoAdminProfile);
    } else {
      setProfile(initialProfile);
    }
    saveState({ activeRole: role });
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...updates };
      saveState({ profile: next });
      return next;
    });
  };

  const updateAvailability = (updates: Partial<UserAvailability>) => {
    setAvailability((prev) => {
      const next = { ...prev, ...updates };
      saveState({ availability: next });
      return next;
    });
  };

  // Flatten all skills
  const allCompetencySkills = useMemo(() => {
    const list: CompetencySkill[] = [];
    competencyDomains.forEach((d) => {
      d.skills.forEach((s) => list.push(s));
    });
    return list;
  }, [competencyDomains]);

  // Skill categorization by gap severity
  const criticalGaps = useMemo(() => {
    return allCompetencySkills.filter((s) => s.currentLevel < 50 || s.gapSeverity === 'critical');
  }, [allCompetencySkills]);

  const moderateGaps = useMemo(() => {
    return allCompetencySkills.filter(
      (s) => s.currentLevel >= 50 && s.currentLevel < 75 && s.gapSeverity !== 'critical'
    );
  }, [allCompetencySkills]);

  const strengths = useMemo(() => {
    return allCompetencySkills.filter((s) => s.currentLevel >= 75);
  }, [allCompetencySkills]);

  // Update a competency skill score and re-evaluate overall competency
  const updateSkillLevel = (skillId: string, newLevel: number) => {
    const clamped = Math.min(100, Math.max(10, Math.round(newLevel)));
    setCompetencyDomains((prev) => {
      const updatedDomains = prev.map((d) => {
        const updatedSkills = d.skills.map((s) => {
          if (s.id !== skillId) return s;
          const gap = s.requiredLevel - clamped;
          return {
            ...s,
            currentLevel: clamped,
            gapPercentage: gap,
            gapSeverity: (clamped >= s.requiredLevel ? 'strong' : clamped < 50 ? 'critical' : 'improvement_needed') as any,
          };
        });
        const avg = Math.round(
          updatedSkills.reduce((acc, curr) => acc + curr.currentLevel, 0) / (updatedSkills.length || 1)
        );
        return { ...d, skills: updatedSkills, averageScore: avg };
      });

      // Recalculate overall score
      const totalAll = updatedDomains.reduce((acc, curr) => acc + curr.averageScore, 0);
      const newOverall = Math.round(totalAll / updatedDomains.length);

      updateProfile({
        overallCompetencyScore: newOverall,
      });

      saveState({ competencyDomains: updatedDomains });
      return updatedDomains;
    });
  };

  // iGOT Course Actions
  const enrolInCourse = (courseId: string) => {
    setIgotCourses((prev) => {
      const updated = prev.map((c) =>
        c.id === courseId
          ? {
              ...c,
              completionStatus: 'In Progress' as const,
              progressPercentage: c.progressPercentage === 0 ? 10 : c.progressPercentage,
            }
          : c
      );
      saveState({ igotCourses: updated });
      return updated;
    });

    addNotification({
      title: 'Enrolled in iGOT Karmayogi Course',
      message: `You have successfully enrolled in the capacity building module. Course added to your learning path.`,
      notificationType: 'course_recommended',
    });
  };

  const updateCourseProgress = (courseId: string, progress: number) => {
    const clamped = Math.min(100, Math.max(0, progress));
    setIgotCourses((prev) => {
      const updated = prev.map((c) =>
        c.id === courseId
          ? {
              ...c,
              progressPercentage: clamped,
              completionStatus: clamped === 100 ? ('Completed' as const) : ('In Progress' as const),
            }
          : c
      );
      saveState({ igotCourses: updated });
      return updated;
    });

    if (clamped === 100) {
      completeCourse(courseId);
    }
  };

  const completeCourse = (courseId: string) => {
    const course = igotCourses.find((c) => c.id === courseId);
    if (!course) return;

    // Boost targeted competency
    const matchingSkill = allCompetencySkills.find((s) => s.title.includes(course.targetedSkill) || course.targetedSkill.includes(s.title));
    if (matchingSkill) {
      updateSkillLevel(matchingSkill.id, matchingSkill.currentLevel + 22);
    }

    updateProfile({
      totalXp: profile.totalXp + 350,
      learningHoursLogged: profile.learningHoursLogged + course.durationHours,
    });

    addNotification({
      title: '🎉 Course Completed: ' + course.courseName,
      message: `Certified on iGOT Karmayogi ecosystem! Competency in "${course.targetedSkill}" has been upgraded.`,
      notificationType: 'achievement',
    });
  };

  // Uploaded Materials & AI MCQ Generation
  const addUploadedMaterial = (materialData: Omit<UploadedLearningMaterial, 'id' | 'uploadDate'>) => {
    const newMat: UploadedLearningMaterial = {
      ...materialData,
      id: `mat-${Date.now()}`,
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'ready',
    };
    setUploadedMaterials((prev) => {
      const updated = [newMat, ...prev];
      saveState({ uploadedMaterials: updated });
      return updated;
    });
  };

  const generateMCQsFromMaterial = (
    materialId: string,
    numQuestions: number,
    topic: string,
    difficulty: 'Easy' | 'Medium' | 'Hard' | 'Mixed'
  ): QuizQuestion[] => {
    const material = uploadedMaterials.find((m) => m.id === materialId);
    const sourceTitle = material ? material.title : 'Official Statistics Manual';

    const samplePool: QuizQuestion[] = [
      {
        id: `gen-q-${Date.now()}-1`,
        questionText: `Under the provisions of ${sourceTitle}, what is the prescribed verification standard for validating unit-level respondent data?`,
        questionType: 'mcq',
        options: [
          'Dual independent CAPI audit with GPS boundary correlation',
          'Automatic discarding of non-responding households without replacement',
          'Relying solely on aggregate telephone confirmations',
          'Single-point verification with no supervisory re-check',
        ],
        correctAnswer: 'Dual independent CAPI audit with GPS boundary correlation',
        explanation: 'MoSPI field audit guidelines mandate supervisory paradata inspection, including automated GPS boundary correlation and randomized re-interviews.',
        topic: topic || 'Survey Quality & Validation',
        difficulty: difficulty === 'Mixed' ? 'Medium' : difficulty,
        competencyDomain: material?.targetDomain || 'Statistical Competencies',
        sourceDocRef: `${sourceTitle} (Section 4.1)`,
        qualityCheck: {
          sourceSupported: true,
          singleCorrectAnswer: true,
          unambiguousOptions: true,
          noDuplicateQuestions: true,
          appropriateDifficulty: true,
          relevantToTopic: true,
          score: 100,
          notes: ['Directly grounded in uploaded operational guidelines.'],
        },
        status: 'approved',
      },
      {
        id: `gen-q-${Date.now()}-2`,
        questionText: `Which computational tool is recommended for automating outlier detection in large-scale macroeconomic datasets?`,
        questionType: 'mcq',
        options: [
          'Manual visual inspection of printed ledger sheets',
          'Interquartile Range (IQR) & Isolation Forest algorithms in Python/R',
          'Truncating the lowest and highest 20% of all observations blindly',
          'Replacing all flagged anomalies with zero',
        ],
        correctAnswer: 'Interquartile Range (IQR) & Isolation Forest algorithms in Python/R',
        explanation: 'Modern statistical protocols utilize statistical bounds (IQR) combined with machine learning anomaly detection to isolate genuine outliers while preserving valid economic variance.',
        topic: topic || 'Data Cleaning & Validation',
        difficulty: difficulty === 'Mixed' ? 'Hard' : difficulty,
        competencyDomain: 'Technical Competencies',
        sourceDocRef: `${sourceTitle} (Technical Annex)`,
        qualityCheck: {
          sourceSupported: true,
          singleCorrectAnswer: true,
          unambiguousOptions: true,
          noDuplicateQuestions: true,
          appropriateDifficulty: true,
          relevantToTopic: true,
          score: 98,
          notes: ['Meets technical competency quality parameters.'],
        },
        status: 'approved',
      },
      {
        id: `gen-q-${Date.now()}-3`,
        questionText: `How does the 2008 System of National Accounts (SNA) classify government research and development (R&D) expenditures?`,
        questionType: 'mcq',
        options: [
          'As intermediate consumption expenses',
          'As Gross Fixed Capital Formation (GFCF / Intellectual Property Products)',
          'As direct export subsidies',
          'As current consumption transfers excluded from capital accounts',
        ],
        correctAnswer: 'As Gross Fixed Capital Formation (GFCF / Intellectual Property Products)',
        explanation: 'SNA 2008 introduced the recognition of R&D expenditures as capital formation (intangible fixed assets / intellectual property) rather than intermediate consumption.',
        topic: topic || 'National Accounts Compilation',
        difficulty: difficulty === 'Mixed' ? 'Medium' : difficulty,
        competencyDomain: 'Statistical Competencies',
        sourceDocRef: 'National Accounts Source Manual',
        qualityCheck: {
          sourceSupported: true,
          singleCorrectAnswer: true,
          unambiguousOptions: true,
          noDuplicateQuestions: true,
          appropriateDifficulty: true,
          relevantToTopic: true,
          score: 100,
          notes: ['Standard national accounting benchmark.'],
        },
        status: 'approved',
      },
      {
        id: `gen-q-${Date.now()}-4`,
        questionText: `Under the Digital Personal Data Protection (DPDP) Act 2023, what is the primary prerequisite before releasing synthetic statistical datasets?`,
        questionType: 'mcq',
        options: [
          'Ensuring re-identification risk is suppressed below statistical disclosure control thresholds',
          'Publishing respondent names with masked telephone digits',
          'Selling data exclusively to private corporations',
          'Removing only the first three letters of geographic identifiers',
        ],
        correctAnswer: 'Ensuring re-identification risk is suppressed below statistical disclosure control thresholds',
        explanation: 'Statistical Disclosure Control (SDC) ensures that respondent re-identification is mathematically impossible via k-anonymity or differential privacy before public dissemination.',
        topic: topic || 'Digital Governance & Data Privacy',
        difficulty: difficulty === 'Mixed' ? 'Easy' : difficulty,
        competencyDomain: 'Digital Governance',
        sourceDocRef: 'DPDP Act Guidelines for Public Fiduciaries',
        qualityCheck: {
          sourceSupported: true,
          singleCorrectAnswer: true,
          unambiguousOptions: true,
          noDuplicateQuestions: true,
          appropriateDifficulty: true,
          relevantToTopic: true,
          score: 100,
          notes: ['Essential privacy compliance standard.'],
        },
        status: 'approved',
      },
    ];

    const requested = samplePool.slice(0, Math.min(numQuestions, samplePool.length));

    // Update material generated count
    if (material) {
      setUploadedMaterials((prev) =>
        prev.map((m) =>
          m.id === materialId
            ? { ...m, totalQuestionsGenerated: m.totalQuestionsGenerated + requested.length }
            : m
        )
      );
    }

    return requested;
  };

  // Flattened allTopics helper
  const allTopics: Topic[] = useMemo(() => {
    const list: Topic[] = [];
    subjects.forEach((subj) => {
      subj.units?.forEach((u) => {
        u.chapters?.forEach((c) => {
          c.topics?.forEach((t) => {
            list.push(t);
          });
        });
      });
    });
    return list;
  }, [subjects]);

  const weakTopics = useMemo(() => {
    return identifyWeakTopics(allTopics, spacedRevisions);
  }, [allTopics, spacedRevisions]);

  // Subjects & Topics CRUD
  const addSubject = (subjectData: Omit<Subject, 'id' | 'userId'>) => {
    const newSubject: Subject = {
      ...subjectData,
      id: `subj-${Date.now()}`,
      userId: profile.id,
      units: subjectData.units || [
        {
          id: `unit-${Date.now()}-1`,
          subjectId: `subj-${Date.now()}`,
          unitNumber: 1,
          title: 'Unit 1: Overview',
          chapters: [],
        },
      ],
    };
    setSubjects((prev) => {
      const next = [...prev, newSubject];
      saveState({ subjects: next });
      return next;
    });
    return newSubject;
  };

  const updateSubject = (id: string, updates: Partial<Subject>) => {
    setSubjects((prev) => {
      const next = prev.map((s) => (s.id === id ? { ...s, ...updates } : s));
      saveState({ subjects: next });
      return next;
    });
  };

  const deleteSubject = (id: string) => {
    setSubjects((prev) => {
      const next = prev.filter((s) => s.id !== id);
      saveState({ subjects: next });
      return next;
    });
  };

  const addTopicToSubject = (
    subjectId: string,
    unitIndex: number,
    chapterIndex: number,
    topicData: Partial<Topic>
  ) => {
    const newTopic: Topic = {
      id: `top-${Date.now()}`,
      chapterId: '',
      title: topicData.title || 'New Competency Module',
      difficulty: topicData.difficulty || 'Medium',
      importance: topicData.importance || 'High',
      knowledgeLevel: topicData.knowledgeLevel || 'Medium',
      estimatedMins: topicData.estimatedMins || 60,
      actualMinsSpent: 0,
      masteryPercentage: 0,
      isCompleted: false,
      prerequisiteIds: topicData.prerequisiteIds || [],
      keyFormulas: topicData.keyFormulas || [],
      keyDefinitions: topicData.keyDefinitions || [],
    };

    setSubjects((prev) => {
      const next = prev.map((s) => {
        if (s.id !== subjectId) return s;
        const newUnits = [...(s.units || [])];
        if (!newUnits[unitIndex]) return s;
        const newChapters = [...(newUnits[unitIndex].chapters || [])];
        if (!newChapters[chapterIndex]) return s;
        newTopic.chapterId = newChapters[chapterIndex].id;
        newChapters[chapterIndex] = {
          ...newChapters[chapterIndex],
          topics: [...(newChapters[chapterIndex].topics || []), newTopic],
        };
        newUnits[unitIndex] = { ...newUnits[unitIndex], chapters: newChapters };
        return { ...s, units: newUnits };
      });
      saveState({ subjects: next });
      return next;
    });
  };

  const updateTopic = (topicId: string, updates: Partial<Topic>) => {
    setSubjects((prev) => {
      const next = prev.map((s) => ({
        ...s,
        units: s.units?.map((u) => ({
          ...u,
          chapters: u.chapters?.map((c) => ({
            ...c,
            topics: c.topics?.map((t) => (t.id === topicId ? { ...t, ...updates } : t)),
          })),
        })),
      }));
      saveState({ subjects: next });
      return next;
    });
  };

  const deleteTopic = (topicId: string) => {
    setSubjects((prev) => {
      const next = prev.map((s) => ({
        ...s,
        units: s.units?.map((u) => ({
          ...u,
          chapters: u.chapters?.map((c) => ({
            ...c,
            topics: c.topics?.filter((t) => t.id !== topicId),
          })),
        })),
      }));
      saveState({ subjects: next });
      return next;
    });
  };

  const bulkAddParsedHierarchy = (subjectId: string, units: any[]) => {
    setSubjects((prev) => {
      const next = prev.map((s) => {
        if (s.id !== subjectId) return s;
        return {
          ...s,
          units: units.map((u, uIdx) => ({
            id: `unit-${Date.now()}-${uIdx}`,
            subjectId,
            unitNumber: u.unitNumber || uIdx + 1,
            title: u.title,
            description: u.description || '',
            chapters: (u.chapters || []).map((c: any, cIdx: number) => ({
              id: `chap-${Date.now()}-${uIdx}-${cIdx}`,
              unitId: `unit-${Date.now()}-${uIdx}`,
              chapterNumber: c.chapterNumber || cIdx + 1,
              title: c.title,
              estimatedBaseHours: c.estimatedBaseHours || 2.0,
              topics: (c.topics || []).map((t: any, tIdx: number) => ({
                id: `top-${Date.now()}-${uIdx}-${cIdx}-${tIdx}`,
                chapterId: `chap-${Date.now()}-${uIdx}-${cIdx}`,
                title: t.title,
                difficulty: t.difficulty || 'Medium',
                importance: t.importance || 'High',
                knowledgeLevel: t.knowledgeLevel || 'Medium',
                estimatedMins: t.estimatedMins || 60,
                actualMinsSpent: 0,
                masteryPercentage: 0,
                isCompleted: false,
                keyDefinitions: t.keyDefinitions || [],
                keyFormulas: t.keyFormulas || [],
              })),
            })),
          })),
        };
      });
      saveState({ subjects: next });
      return next;
    });
  };

  // Schedule Management
  const updateTask = (taskId: string, updates: Partial<ScheduleTask>) => {
    setScheduleTasks((prev) => {
      const next = prev.map((t) => (t.id === taskId ? { ...t, ...updates } : t));
      saveState({ scheduleTasks: next });
      return next;
    });
  };

  const toggleTaskLock = (taskId: string) => {
    setScheduleTasks((prev) => {
      const next = prev.map((t) => (t.id === taskId ? { ...t, isLocked: !t.isLocked } : t));
      saveState({ scheduleTasks: next });
      return next;
    });
  };

  const addTask = (taskData: Omit<ScheduleTask, 'id' | 'userId'>) => {
    const newTask: ScheduleTask = {
      ...taskData,
      id: `task-${Date.now()}`,
      userId: profile.id,
    };
    setScheduleTasks((prev) => {
      const next = [...prev, newTask];
      saveState({ scheduleTasks: next });
      return next;
    });
  };

  const deleteTask = (taskId: string) => {
    setScheduleTasks((prev) => {
      const next = prev.filter((t) => t.id !== taskId);
      saveState({ scheduleTasks: next });
      return next;
    });
  };

  const regenerateSchedule = (targetDate: Date = new Date()) => {
    const newTasks = generateStudySchedule(
      profile.id,
      subjects,
      allTopics,
      availability,
      targetDate,
      profile.pomodoroFocusMins,
      profile.pomodoroBreakMins
    );

    const lockedTasks = scheduleTasks.filter((t) => t.isLocked);
    const combined = [...newTasks, ...lockedTasks].sort(
      (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );

    setPreviousTaskState(scheduleTasks);
    setScheduleTasks(combined);
    saveState({ scheduleTasks: combined });

    addNotification({
      title: 'AI Learning Path Realigned ⚡',
      message: `AI re-prioritized capacity building tasks to address critical gaps in Data Visualization and AI/ML.`,
      notificationType: 'schedule_update',
    });

    return combined;
  };

  // Dynamic Rescheduling
  const applyReschedule = (plan: RescheduleAdjustmentPlan) => {
    setPreviousTaskState(scheduleTasks);
    const updated = applyReschedulePlan(scheduleTasks, plan);
    setScheduleTasks(updated);
    setLastReschedulePlan(plan);
    saveState({ scheduleTasks: updated });

    addNotification({
      title: 'Timetable Dynamically Adjusted',
      message: plan.explanation,
      notificationType: 'schedule_update',
    });
  };

  const undoReschedule = () => {
    if (previousTaskState) {
      setScheduleTasks(previousTaskState);
      setLastReschedulePlan(null);
      setPreviousTaskState(null);
      saveState({ scheduleTasks: previousTaskState });
    }
  };

  const dismissRescheduleNotification = () => {
    setLastReschedulePlan(null);
  };

  const completeStudySession = (
    taskId: string,
    actualMins: number,
    rating: UnderstandingRating,
    focusScore: number,
    distractionCount: number,
    notes?: string
  ): RescheduleAdjustmentPlan | null => {
    const task = scheduleTasks.find((t) => t.id === taskId);
    if (!task) return null;

    const plannedMins = task.plannedDurationMins;
    const diff = plannedMins - actualMins;

    updateTask(taskId, {
      status: 'completed',
      actualDurationMins: actualMins,
      completedAt: new Date().toISOString(),
    });

    // Close the adaptive learning loop: Update topic & competency
    if (task.topicId) {
      const masteryBump =
        rating === 'fully_understood'
          ? 35
          : rating === 'understood'
          ? 25
          : rating === 'partially_understood'
          ? 10
          : 0;

      const topic = allTopics.find((t) => t.id === task.topicId);
      const currentMastery = topic?.masteryPercentage || 0;
      const newMastery = Math.min(100, Math.max(20, currentMastery + masteryBump));

      updateTopic(task.topicId, {
        isCompleted: true,
        actualMinsSpent: (topic?.actualMinsSpent || 0) + actualMins,
        masteryPercentage: newMastery,
        lastStudiedAt: new Date().toISOString(),
      });

      // Update SM-2 Spaced Repetition Queue
      const prevRev = spacedRevisions.find((r) => r.topicId === task.topicId);
      const newRev = calculateSM2Revision(
        task.topicId,
        task.title,
        task.subjectName || 'Competency Subject',
        task.subjectColor || '#3b82f6',
        profile.id,
        rating,
        prevRev
      );

      setSpacedRevisions((prev) => {
        const filtered = prev.filter((r) => r.topicId !== task.topicId);
        const next = [...filtered, newRev];
        saveState({ spacedRevisions: next });
        return next;
      });

      // Also boost the matching Competency Skill
      const matchingSkill = allCompetencySkills.find(
        (s) => task.title.toLowerCase().includes(s.title.toLowerCase().slice(0, 8))
      );
      if (matchingSkill) {
        updateSkillLevel(matchingSkill.id, matchingSkill.currentLevel + 5);
      }
    }

    // Save Session Log
    const newSession: StudySession = {
      id: `sess-${Date.now()}`,
      userId: profile.id,
      taskId,
      topicId: task.topicId,
      subjectId: task.subjectId,
      topicTitle: task.title,
      subjectName: task.subjectName || 'Capacity Building',
      startTime: task.startTime,
      endTime: new Date().toISOString(),
      plannedMins,
      actualMins,
      savedOrDelayedMins: diff,
      distractionCount,
      focusScore,
      understandingRating: rating,
      notes,
      createdAt: new Date().toISOString(),
    };

    setStudySessions((prev) => {
      const next = [newSession, ...prev];
      saveState({ studySessions: next });
      return next;
    });

    const earnedXp = Math.round(actualMins * 1.5 + focusScore * 0.5);
    updateProfile({
      totalXp: profile.totalXp + earnedXp,
      learningHoursLogged: +(profile.learningHoursLogged + actualMins / 60).toFixed(1),
    });

    const plan = calculateDynamicReschedule(
      scheduleTasks,
      taskId,
      actualMins,
      profile.stabilityThresholdMins
    );

    if (plan && plan.affectedTasks.length > 0) {
      applyReschedule(plan);
    }

    return plan;
  };

  const recordRevisionRating = (topicId: string, rating: UnderstandingRating) => {
    const prevRev = spacedRevisions.find((r) => r.topicId === topicId);
    const topic = allTopics.find((t) => t.id === topicId);

    const newRev = calculateSM2Revision(
      topicId,
      topic?.title || prevRev?.topicTitle || 'Topic',
      prevRev?.subjectName || 'Official Statistics',
      prevRev?.subjectColor || '#3b82f6',
      profile.id,
      rating,
      prevRev
    );

    setSpacedRevisions((prev) => {
      const filtered = prev.filter((r) => r.topicId !== topicId);
      const next = [...filtered, newRev];
      saveState({ spacedRevisions: next });
      return next;
    });

    if (topic) {
      const bump = rating === 'fully_understood' ? 20 : rating === 'understood' ? 15 : -10;
      updateTopic(topicId, {
        masteryPercentage: Math.min(100, Math.max(10, topic.masteryPercentage + bump)),
      });
    }
  };

  const addCustomTutor = (tutorData: Omit<AITutor, 'id' | 'userId'>) => {
    const newTutor: AITutor = {
      ...tutorData,
      id: `tutor-${Date.now()}`,
      userId: profile.id,
    };
    setAiTutors((prev) => {
      const next = [...prev, newTutor];
      saveState({ aiTutors: next });
      return next;
    });
  };

  const addResource = (resourceData: Omit<LearningResource, 'id'>) => {
    const newRes: LearningResource = {
      ...resourceData,
      id: `res-${Date.now()}`,
    };
    setLearningResources((prev) => {
      const next = [...prev, newRes];
      saveState({ learningResources: next });
      return next;
    });
  };

  const toggleBookmarkResource = (id: string) => {
    setBookmarkedResourceIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      saveState({ bookmarkedResourceIds: next });
      return next;
    });
  };

  // Quizzes & Attempts with Adaptive Competency Loop
  const addQuiz = (quizData: Omit<Quiz, 'id' | 'userId'>) => {
    const newQuiz: Quiz = {
      ...quizData,
      id: `quiz-${Date.now()}`,
      userId: profile.id,
    };
    setQuizzes((prev) => {
      const next = [...prev, newQuiz];
      saveState({ quizzes: next });
      return next;
    });
  };

  const updateQuestionInQuiz = (quizId: string, questionId: string, updates: Partial<QuizQuestion>) => {
    setQuizzes((prev) => {
      const next = prev.map((q) => {
        if (q.id !== quizId) return q;
        return {
          ...q,
          questions: q.questions.map((ques) => (ques.id === questionId ? { ...ques, ...updates } : ques)),
        };
      });
      saveState({ quizzes: next });
      return next;
    });
  };

  const approveQuestionInQuiz = (quizId: string, questionId: string) => {
    updateQuestionInQuiz(quizId, questionId, { status: 'approved' });
  };

  const submitQuizAttempt = (attemptData: Omit<QuizAttempt, 'id' | 'userId' | 'completedAt'>) => {
    const newAttempt: QuizAttempt = {
      ...attemptData,
      id: `attempt-${Date.now()}`,
      userId: profile.id,
      completedAt: new Date().toISOString(),
    };
    setQuizAttempts((prev) => {
      const next = [newAttempt, ...prev];
      saveState({ quizAttempts: next });
      return next;
    });

    // Award XP
    const scoreBonus = Math.round(newAttempt.accuracyPercentage * 1.2);
    updateProfile({
      totalXp: profile.totalXp + scoreBonus,
    });

    // Adaptive Competency update based on quiz performance
    // If high score (>70%), increase competency in domain; if low, generate gap alert
    const targetDomain = newAttempt.quizTitle.includes('Labour') || newAttempt.quizTitle.includes('PLFS')
      ? 'Statistical Competencies'
      : newAttempt.quizTitle.includes('Visualization')
      ? 'Technical Competencies'
      : 'Statistical Competencies';

    const domainObj = competencyDomains.find((d) => d.name === targetDomain);
    if (domainObj && domainObj.skills.length > 0) {
      const skillToBump = domainObj.skills[0];
      const delta = newAttempt.accuracyPercentage >= 75 ? 8 : -4;
      updateSkillLevel(skillToBump.id, skillToBump.currentLevel + delta);
    }

    addNotification({
      title: 'Assessment Evaluated: ' + newAttempt.accuracyPercentage + '% Score',
      message:
        newAttempt.accuracyPercentage >= 75
          ? `Excellent performance! Your competency rating in ${targetDomain} has been updated.`
          : `Improvement needed in ${newAttempt.weakAreasIdentified.join(', ') || targetDomain}. Additional iGOT learning path recommended.`,
      notificationType: 'achievement',
    });
  };

  const recordDrillResult = (result: DrillResult) => {
    setDrillResults((prev) => {
      const next = [result, ...prev];
      saveState({ drillResults: next });
      return next;
    });
    updateProfile({
      totalXp: profile.totalXp + result.xpEarned,
    });
  };

  const recordBattleVictory = (won: boolean, eloDelta: number, xpDelta: number, matchInfo: any) => {
    setStudentBattleProfile((prev) => {
      const nextWins = won ? prev.wins + 1 : prev.wins;
      const nextLosses = !won ? prev.losses + 1 : prev.losses;
      const nextBattles = prev.totalBattles + 1;
      const nextWinRate = Math.round((nextWins / nextBattles) * 100);
      const nextStreak = won ? prev.currentStreak + 1 : 0;
      const nextBestStreak = Math.max(prev.bestStreak, nextStreak);
      const nextElo = Math.max(1000, prev.eloRating + eloDelta);
      const nextTier = (nextElo >= 2200 ? 'Grandmaster' : nextElo >= 2000 ? 'Diamond' : nextElo >= 1800 ? 'Platinum' : nextElo >= 1600 ? 'Gold' : nextElo >= 1400 ? 'Silver' : 'Bronze') as any;

      const newMatchRecord = {
        id: `match-${Date.now()}`,
        opponentName: matchInfo.opponentName || 'Statistical Officer',
        opponentAvatar: matchInfo.opponentAvatar || '🏛️',
        opponentTier: matchInfo.opponentTier || 'Diamond',
        userScore: matchInfo.userScore || 0,
        opponentScore: matchInfo.opponentScore || 0,
        result: (won ? 'Victory' : 'Defeat') as 'Victory' | 'Defeat',
        eloChange: eloDelta,
        subject: matchInfo.subject || 'National Accounts & Survey Design',
        date: 'Just now',
      };

      const nextProfile: StudentBattleProfile = {
        ...prev,
        wins: nextWins,
        losses: nextLosses,
        totalBattles: nextBattles,
        winRate: nextWinRate,
        currentStreak: nextStreak,
        bestStreak: nextBestStreak,
        eloRating: nextElo,
        tier: nextTier,
        totalXp: prev.totalXp + xpDelta,
        recentMatches: [newMatchRecord, ...prev.recentMatches.slice(0, 9)],
      };

      saveState({ studentBattleProfile: nextProfile });
      return nextProfile;
    });

    setLeaderboard((prev) => {
      const updated: LeaderboardEntry[] = prev.map((entry) => {
        if (entry.isCurrentUser) {
          const nextWins = won ? entry.wins + 1 : entry.wins;
          const nextLosses = !won ? entry.losses + 1 : entry.losses;
          const nextElo = Math.max(1000, entry.eloRating + eloDelta);
          const nextTier = (nextElo >= 2200 ? 'Grandmaster' : nextElo >= 2000 ? 'Diamond' : nextElo >= 1800 ? 'Platinum' : nextElo >= 1600 ? 'Gold' : nextElo >= 1400 ? 'Silver' : 'Bronze') as any;
          return {
            ...entry,
            wins: nextWins,
            losses: nextLosses,
            winRate: Math.round((nextWins / (nextWins + nextLosses || 1)) * 100),
            eloRating: nextElo,
            tier: nextTier,
            totalXp: entry.totalXp + xpDelta,
          };
        }
        return entry;
      });
      saveState({ leaderboard: updated });
      return updated;
    });
  };

  const addAcademicEvent = (eventData: Omit<AcademicEvent, 'id' | 'userId'>) => {
    const newEvent: AcademicEvent = {
      ...eventData,
      id: `event-${Date.now()}`,
      userId: profile.id,
    };
    setAcademicEvents((prev) => {
      const next = [...prev, newEvent];
      saveState({ academicEvents: next });
      return next;
    });
  };

  const deleteAcademicEvent = (id: string) => {
    setAcademicEvents((prev) => {
      const next = prev.filter((e) => e.id !== id);
      saveState({ academicEvents: next });
      return next;
    });
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => {
      const next = prev.map((n) => (n.id === id ? { ...n, isRead: true } : n));
      saveState({ notifications: next });
      return next;
    });
  };

  const addNotification = (notifData: Omit<NotificationItem, 'id' | 'userId' | 'createdAt' | 'isRead'>) => {
    const newNotif: NotificationItem = {
      ...notifData,
      id: `notif-${Date.now()}`,
      userId: profile.id,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => {
      const next = [newNotif, ...prev];
      saveState({ notifications: next });
      return next;
    });
  };

  // AI Recommendation Logic: Prioritizes Critical Competency Gaps & iGOT Trainings
  const whatShouldIStudyNow = () => {
    const pendingTask = scheduleTasks.find((t) => t.status === 'pending');
    const topCriticalGap = criticalGaps[0];

    if (pendingTask) {
      const topic = allTopics.find((t) => t.id === pendingTask.topicId);
      const subject = subjects.find((s) => s.id === pendingTask.subjectId);
      const reasons: string[] = [];

      if (topCriticalGap) {
        reasons.push(`Addresses Critical Competency Gap: ${topCriticalGap.title} (${topCriticalGap.currentLevel}%)`);
      }
      reasons.push(`Prioritized for Cadre Capacity Building in ${profile.department}`);
      reasons.push(`Sourced from iGOT Karmayogi / NSSTA Curriculum`);
      reasons.push(`Fits your morning focus window before office hours`);

      return {
        task: pendingTask,
        topic,
        subject,
        skill: topCriticalGap,
        reason: reasons,
        priorityTag: pendingTask.priorityTag,
        recommendedDurationMins: pendingTask.plannedDurationMins,
      };
    }

    if (topCriticalGap) {
      return {
        skill: topCriticalGap,
        reason: [
          `Critical Skill Gap detected in ${topCriticalGap.domainName}`,
          `Current level (${topCriticalGap.currentLevel}%) is below Cadre benchmark (${topCriticalGap.requiredLevel}%)`,
          'AI recommends enrolling in iGOT Karmayogi module',
        ],
        priorityTag: 'Critical' as PriorityTag,
        recommendedDurationMins: 45,
      };
    }

    return {
      reason: ['All competency targets met! Review recent survey manuals or take an adaptive quiz.'],
      priorityTag: 'Low' as PriorityTag,
      recommendedDurationMins: 30,
    };
  };

  const resetToDefault = () => {
    setProfile(initialProfile);
    setActiveRoleState('learner');
    setAvailability(initialAvailability);
    setCompetencyDomains(initialCompetencyDomains);
    setIgotCourses(initialIGOTCourses);
    setUploadedMaterials(initialUploadedMaterials);
    setSubjects(initialSubjects);
    setScheduleTasks(initialScheduleTasks);
    setStudySessions([]);
    setSpacedRevisions(initialSpacedRevisions);
    setAiTutors(initialAITutors);
    setLearningResources(initialLearningResources);
    setBookmarkedResourceIds(['res-official-1', 'res-official-2']);
    setQuizzes(initialQuizzes);
    setQuizAttempts([]);
    setDrillResults([]);
    setLeaderboard(initialLeaderboard);
    setStudentBattleProfile(initialStudentBattleProfile);
    setAcademicEvents(initialAcademicEvents);
    setAchievements(initialAchievements);
    setNotifications(initialNotifications);
    setLastReschedulePlan(null);
    setPreviousTaskState(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  return (
    <AppContext.Provider
      value={{
        profile,
        activeRole,
        setActiveRole,
        updateProfile,
        availability,
        updateAvailability,
        competencyDomains,
        allCompetencySkills,
        updateSkillLevel,
        criticalGaps,
        moderateGaps,
        strengths,
        igotCourses,
        enrolInCourse,
        updateCourseProgress,
        completeCourse,
        uploadedMaterials,
        addUploadedMaterial,
        generateMCQsFromMaterial,
        quizzes,
        addQuiz,
        updateQuestionInQuiz,
        approveQuestionInQuiz,
        quizAttempts,
        submitQuizAttempt,
        departmentMetrics,
        emergingSkills,
        subjects,
        addSubject,
        updateSubject,
        deleteSubject,
        allTopics,
        addTopicToSubject,
        updateTopic,
        deleteTopic,
        bulkAddParsedHierarchy,
        scheduleTasks,
        updateTask,
        toggleTaskLock,
        addTask,
        deleteTask,
        regenerateSchedule,
        lastReschedulePlan,
        previousTaskState,
        applyReschedule,
        undoReschedule,
        dismissRescheduleNotification,
        studySessions,
        completeStudySession,
        spacedRevisions,
        recordRevisionRating,
        weakTopics,
        aiTutors,
        addCustomTutor,
        learningResources,
        addResource,
        bookmarkedResourceIds,
        toggleBookmarkResource,
        cheatsheets,
        drillResults,
        recordDrillResult,
        battleQuestions,
        challengers,
        leaderboard,
        studentBattleProfile,
        recordBattleVictory,
        academicEvents,
        addAcademicEvent,
        deleteAcademicEvent,
        notifications,
        markNotificationRead,
        addNotification,
        achievements,
        whatShouldIStudyNow,
        resetToDefault,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppStore = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppStore must be used within an AppProvider');
  }
  return context;
};
