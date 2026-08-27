// ==============================================================================
// CogniStudy - Full TypeScript Types & Interfaces
// ==============================================================================

export type EducationLevel = 
  | 'High School' 
  | 'Undergraduate' 
  | 'Postgraduate' 
  | 'Competitive Exam Prep' 
  | 'Self-Taught / Professional';

export type PreferredStudyTime = 'morning' | 'afternoon' | 'evening' | 'night';

export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';
export type ImportanceLevel = 'Low' | 'Medium' | 'High' | 'Critical';
export type KnowledgeLevel = 'Low' | 'Medium' | 'High';
export type PriorityTag = 'Critical' | 'High' | 'Medium' | 'Low';
export type TaskType = 'study' | 'revision' | 'practice' | 'quiz' | 'break';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'skipped' | 'rescheduled';
export type UnderstandingRating = 'didnt_understand' | 'partially_understood' | 'understood' | 'fully_understood';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  educationLevel: EducationLevel;
  courseDegree: string;
  currentSemester: string;
  targetGpaGrade: string;
  dailyMaxStudyHours: number;
  preferredStudyTime: PreferredStudyTime;
  pomodoroFocusMins: number;
  pomodoroBreakMins: number;
  longBreakMins: number;
  stabilityThresholdMins: number; // e.g. 15 mins
  streakDays: number;
  totalXp: number;
  onboardingCompleted: boolean;
  createdAt?: string;
}

export interface TimeSlot {
  start: string; // "18:00"
  end: string;   // "22:00"
}

export interface UserAvailability {
  id?: string;
  userId: string;
  dayType: 'weekday' | 'weekend' | 'holiday';
  wakeTime: string; // "07:00"
  sleepTime: string; // "23:00"
  institutionHours?: string; // "09:00-16:00"
  travelHours?: string; // "08:15-09:00"
  mealHours?: string; // "08:00-08:30, 13:00-14:00, 20:00-20:45"
  coachingHours?: string;
  personalActivityHours?: string;
  availableStudySlots: TimeSlot[];
}

export interface Subject {
  id: string;
  userId: string;
  name: string;
  code?: string;
  color: string; // "#6366f1"
  icon: string;  // Lucide icon name
  targetMarks: number;
  creditWeight: number;
  examDate?: string;
  units?: Unit[];
}

export interface Unit {
  id: string;
  subjectId: string;
  unitNumber: number;
  title: string;
  description?: string;
  chapters?: Chapter[];
}

export interface Chapter {
  id: string;
  unitId: string;
  chapterNumber: number;
  title: string;
  estimatedBaseHours: number;
  topics?: Topic[];
}

export interface Topic {
  id: string;
  chapterId: string;
  title: string;
  difficulty: DifficultyLevel;
  importance: ImportanceLevel;
  knowledgeLevel: KnowledgeLevel;
  estimatedMins: number;
  actualMinsSpent: number;
  masteryPercentage: number; // 0-100
  isCompleted: boolean;
  completedAt?: string;
  lastStudiedAt?: string;
  subtopics?: Subtopic[];
  prerequisiteIds?: string[];
  keyFormulas?: string[];
  keyDefinitions?: string[];
}

export interface Subtopic {
  id: string;
  topicId: string;
  title: string;
  isCompleted: boolean;
}

export interface StudyMaterial {
  id: string;
  userId: string;
  subjectId?: string;
  topicId?: string;
  fileName: string;
  fileType: 'pdf' | 'docx' | 'pptx' | 'txt' | 'note' | 'link';
  fileUrl?: string;
  fileSizeKb?: number;
  aiSummary?: string;
  extractedKeyPoints?: string[];
  formulas?: string[];
  createdAt: string;
}

export interface ScheduleTask {
  id: string;
  scheduleId?: string;
  userId: string;
  topicId?: string;
  subjectId?: string;
  title: string;
  subjectName?: string;
  subjectColor?: string;
  taskType: TaskType;
  startTime: string; // ISO string or "18:00"
  endTime: string;   // ISO string or "19:00"
  plannedDurationMins: number;
  actualDurationMins?: number;
  status: TaskStatus;
  isLocked: boolean; // Locked tasks are never auto-moved by AI
  priorityTag: PriorityTag;
  rescheduleReason?: string;
  completedAt?: string;
}

export interface Schedule {
  id: string;
  userId: string;
  title: string;
  planType: 'daily' | 'weekly' | 'monthly' | 'exam_prep' | 'revision';
  startDate: string;
  endDate: string;
  isActive: boolean;
  tasks: ScheduleTask[];
  generatedAt: string;
}

export interface StudySession {
  id: string;
  userId: string;
  taskId?: string;
  topicId?: string;
  subjectId?: string;
  topicTitle: string;
  subjectName: string;
  startTime: string;
  endTime: string;
  plannedMins: number;
  actualMins: number;
  savedOrDelayedMins: number; // Positive = finished early, negative = delayed
  distractionCount: number;
  focusScore: number;
  understandingRating?: UnderstandingRating;
  notes?: string;
  createdAt: string;
}

export interface SpacedRevision {
  id: string;
  userId: string;
  topicId: string;
  topicTitle: string;
  subjectName: string;
  subjectColor: string;
  repetitionNumber: number;
  easeFactor: number; // 1.3 - 2.8 (default 2.5)
  intervalDays: number;
  nextReviewDate: string; // YYYY-MM-DD
  status: 'due' | 'completed' | 'overdue';
  lastRating?: number; // 1-4
  updatedAt: string;
}

export interface QuizQuestion {
  id: string;
  quizId?: string;
  questionText: string;
  questionType: 'mcq' | 'conceptual' | 'code' | 'true_false';
  options?: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: DifficultyLevel;
}

export interface Quiz {
  id: string;
  userId: string;
  topicId?: string;
  subjectId?: string;
  title: string;
  difficulty: DifficultyLevel;
  questions: QuizQuestion[];
  createdAt: string;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  quizTitle: string;
  score: number;
  totalPossible: number;
  accuracyPercentage: number;
  answers: Record<string, string>; // questionId -> selected answer
  weakAreasIdentified: string[];
  completedAt: string;
}

export interface AITutor {
  id: string;
  userId: string;
  name: string;
  avatarEmoji: string;
  subjectId?: string;
  subjectName?: string;
  personality: string;
  systemPrompt: string;
  isDefault: boolean;
}

export interface AIChatMessage {
  id: string;
  tutorId: string;
  userId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  topicContext?: string;
  createdAt: string;
}

export interface LearningResource {
  id: string;
  topicId: string;
  topicTitle?: string;
  subjectName?: string;
  title: string;
  resourceType: 'video' | 'documentation' | 'article' | 'practice' | 'course' | 'ai_explanation';
  url?: string;
  difficultyLevel: DifficultyLevel;
  estimatedMins: number;
  recommendedReason: string;
  qualityScore: number; // 1.0 - 5.0
  sourcePlatform?: string; // YouTube, MDN, GeeksforGeeks, LeetCode, Coursera
}

export interface AcademicEvent {
  id: string;
  userId: string;
  subjectId: string;
  subjectName: string;
  subjectColor: string;
  title: string;
  eventType: 'final_exam' | 'midterm' | 'quiz' | 'assignment' | 'practical' | 'project';
  eventDate: string; // ISO date
  weightagePercentage: number;
  syllabusCoverageNeeded: number;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  notificationType: 'schedule_update' | 'session_reminder' | 'streak_alert' | 'exam_warning' | 'achievement';
  actionLink?: string;
  isRead: boolean;
  createdAt: string;
}

export interface Achievement {
  id: string;
  badgeId: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
}

export interface RescheduleAdjustmentPlan {
  action: 'early_pull_forward' | 'delay_cascade' | 'skipped_redistribute' | 'balanced_adjustment';
  minutesDifference: number; // +25 or -35
  explanation: string;
  affectedTasks: {
    taskId: string;
    taskTitle: string;
    oldStart: string;
    oldEnd: string;
    newStart: string;
    newEnd: string;
    statusChange?: TaskStatus;
    reason: string;
  }[];
  preservedBreaks: boolean;
  preservedDeadlines: boolean;
}
