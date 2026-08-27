'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  UserProfile,
  UserAvailability,
  Subject,
  Topic,
  ScheduleTask,
  StudySession,
  SpacedRevision,
  AITutor,
  LearningResource,
  Quiz,
  QuizAttempt,
  AcademicEvent,
  Achievement,
  NotificationItem,
  RescheduleAdjustmentPlan,
  UnderstandingRating,
  PriorityTag,
} from '@/types';
import {
  initialProfile,
  initialAvailability,
  initialSubjects,
  initialScheduleTasks,
  initialSpacedRevisions,
  initialAITutors,
  initialLearningResources,
  initialQuizzes,
  initialAcademicEvents,
  initialAchievements,
  initialNotifications,
} from './mockData';
import { generateStudySchedule, calculateTopicPriority } from './schedulerEngine';
import { calculateDynamicReschedule, applyReschedulePlan } from './rescheduleEngine';
import { calculateSM2Revision, identifyWeakTopics } from './spacedRevisionEngine';

interface AppContextType {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;

  availability: UserAvailability;
  updateAvailability: (updates: Partial<UserAvailability>) => void;

  subjects: Subject[];
  addSubject: (subject: Omit<Subject, 'id' | 'userId'>) => Subject;
  updateSubject: (id: string, updates: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;

  allTopics: Topic[];
  addTopicToSubject: (subjectId: string, unitIndex: number, chapterIndex: number, topic: Partial<Topic>) => void;
  updateTopic: (topicId: string, updates: Partial<Topic>) => void;
  deleteTopic: (topicId: string) => void;
  bulkAddParsedHierarchy: (subjectId: string, units: any[]) => void;

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

  aiTutors: AITutor[];
  addCustomTutor: (tutor: Omit<AITutor, 'id' | 'userId'>) => void;

  learningResources: LearningResource[];
  addResource: (resource: Omit<LearningResource, 'id'>) => void;

  quizzes: Quiz[];
  addQuiz: (quiz: Omit<Quiz, 'id' | 'userId'>) => void;
  quizAttempts: QuizAttempt[];
  submitQuizAttempt: (attempt: Omit<QuizAttempt, 'id' | 'userId' | 'completedAt'>) => void;

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
    reason: string[];
    priorityTag: PriorityTag;
    recommendedDurationMins: number;
  };

  resetToDefault: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'cognistudy_state_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [availability, setAvailability] = useState<UserAvailability>(initialAvailability);
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);
  const [scheduleTasks, setScheduleTasks] = useState<ScheduleTask[]>(initialScheduleTasks);
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [spacedRevisions, setSpacedRevisions] = useState<SpacedRevision[]>(initialSpacedRevisions);
  const [aiTutors, setAiTutors] = useState<AITutor[]>(initialAITutors);
  const [learningResources, setLearningResources] = useState<LearningResource[]>(initialLearningResources);
  const [quizzes, setQuizzes] = useState<Quiz[]>(initialQuizzes);
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);
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
        if (parsed.availability) setAvailability(parsed.availability);
        if (parsed.subjects) setSubjects(parsed.subjects);
        if (parsed.scheduleTasks) setScheduleTasks(parsed.scheduleTasks);
        if (parsed.studySessions) setStudySessions(parsed.studySessions);
        if (parsed.spacedRevisions) setSpacedRevisions(parsed.spacedRevisions);
        if (parsed.aiTutors) setAiTutors(parsed.aiTutors);
        if (parsed.learningResources) setLearningResources(parsed.learningResources);
        if (parsed.quizzes) setQuizzes(parsed.quizzes);
        if (parsed.quizAttempts) setQuizAttempts(parsed.quizAttempts);
        if (parsed.academicEvents) setAcademicEvents(parsed.academicEvents);
        if (parsed.achievements) setAchievements(parsed.achievements);
        if (parsed.notifications) setNotifications(parsed.notifications);
      }
    } catch (e) {
      console.warn('Failed to parse saved state, using defaults', e);
    }
  }, []);

  // Sync to localStorage
  const saveState = (updatedState: Record<string, any>) => {
    try {
      const current = {
        profile,
        availability,
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
    } catch (e) {
      console.warn('Failed to sync to local storage', e);
    }
  };

  // Profile actions
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

  // Weak topics calculation
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
          chapters: [
            {
              id: `chap-${Date.now()}-1`,
              unitId: `unit-${Date.now()}-1`,
              chapterNumber: 1,
              title: 'Chapter 1: Foundations',
              estimatedBaseHours: 2.0,
              topics: [],
            },
          ],
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
      title: topicData.title || 'New Topic',
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

    // Keep locked tasks
    const lockedTasks = scheduleTasks.filter((t) => t.isLocked);
    const combined = [...newTasks, ...lockedTasks].sort(
      (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );

    setPreviousTaskState(scheduleTasks);
    setScheduleTasks(combined);
    saveState({ scheduleTasks: combined });

    addNotification({
      title: 'Schedule Regenerated ⚡',
      message: `AI reorganized ${newTasks.length} study tasks based on updated priority and upcoming exams.`,
      notificationType: 'schedule_update',
    });

    return combined;
  };

  // Dynamic Rescheduling & Session Completion
  const applyReschedule = (plan: RescheduleAdjustmentPlan) => {
    setPreviousTaskState(scheduleTasks);
    const updated = applyReschedulePlan(scheduleTasks, plan);
    setScheduleTasks(updated);
    setLastReschedulePlan(plan);
    saveState({ scheduleTasks: updated });

    addNotification({
      title: 'Schedule Dynamically Adjusted',
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

    // 1. Mark task completed
    updateTask(taskId, {
      status: 'completed',
      actualDurationMins: actualMins,
      completedAt: new Date().toISOString(),
    });

    // 2. Mark topic completed/studied & update mastery
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

      // 3. Update SM-2 Spaced Repetition Queue
      const prevRev = spacedRevisions.find((r) => r.topicId === task.topicId);
      const newRev = calculateSM2Revision(
        task.topicId,
        task.title,
        task.subjectName || 'Subject',
        task.subjectColor || '#6366f1',
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
    }

    // 4. Save Session Log
    const newSession: StudySession = {
      id: `sess-${Date.now()}`,
      userId: profile.id,
      taskId,
      topicId: task.topicId,
      subjectId: task.subjectId,
      topicTitle: task.title,
      subjectName: task.subjectName || 'General',
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

    // 5. XP & Streak increment
    const earnedXp = Math.round(actualMins * 1.5 + focusScore * 0.5);
    updateProfile({
      totalXp: profile.totalXp + earnedXp,
    });

    // 6. Dynamic Reschedule Calculation
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
      prevRev?.subjectName || 'Subject',
      prevRev?.subjectColor || '#6366f1',
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

  // AI Tutors
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

  // Learning Resources
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

  // Quizzes & Attempts
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
    updateProfile({
      totalXp: profile.totalXp + Math.round(newAttempt.accuracyPercentage * 0.8),
    });
  };

  // Academic Deadlines
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

  // Notifications
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

  // "What Should I Study Now?" Recommendation
  const whatShouldIStudyNow = () => {
    // Check if there is an active pending task for today
    const pendingTask = scheduleTasks.find(
      (t) => t.status === 'pending' && t.taskType === 'study'
    );

    if (pendingTask) {
      const topic = allTopics.find((t) => t.id === pendingTask.topicId);
      const subject = subjects.find((s) => s.id === pendingTask.subjectId);
      const reasons: string[] = [];

      if (subject?.examDate) {
        reasons.push(`Exam scheduled in ${subject.name}`);
      }
      if (topic?.importance === 'Critical' || topic?.importance === 'High') {
        reasons.push(`High syllabus weightage & importance`);
      }
      if (topic && topic.masteryPercentage < 60) {
        reasons.push(`Current confidence is low (${topic.masteryPercentage}% mastery)`);
      }
      reasons.push(`Fits your current available study block`);

      return {
        task: pendingTask,
        topic,
        subject,
        reason: reasons,
        priorityTag: pendingTask.priorityTag,
        recommendedDurationMins: pendingTask.plannedDurationMins,
      };
    }

    // Fallback: Pick highest priority uncompleted topic
    const uncompleted = allTopics.filter((t) => !t.isCompleted);
    if (uncompleted.length > 0) {
      const first = uncompleted[0];
      let subj = subjects.find((s) =>
        s.units?.some((u) => u.chapters?.some((c) => c.topics?.some((t) => t.id === first.id)))
      );
      const { tag } = calculateTopicPriority(first, subj);
      return {
        topic: first,
        subject: subj,
        reason: ['Highest priority uncompleted topic in syllabus', 'Optimal time to make progress'],
        priorityTag: tag,
        recommendedDurationMins: first.estimatedMins || 50,
      };
    }

    return {
      reason: ['All scheduled topics mastered! Ready for revision or mock exams.'],
      priorityTag: 'Low' as PriorityTag,
      recommendedDurationMins: 30,
    };
  };

  const resetToDefault = () => {
    setProfile(initialProfile);
    setAvailability(initialAvailability);
    setSubjects(initialSubjects);
    setScheduleTasks(initialScheduleTasks);
    setStudySessions([]);
    setSpacedRevisions(initialSpacedRevisions);
    setAiTutors(initialAITutors);
    setLearningResources(initialLearningResources);
    setQuizzes(initialQuizzes);
    setQuizAttempts([]);
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
        updateProfile,
        availability,
        updateAvailability,
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
        quizzes,
        addQuiz,
        quizAttempts,
        submitQuizAttempt,
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
