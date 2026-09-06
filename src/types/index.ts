// ==============================================================================
// AI-Enabled Skill Intelligence & Learning Platform
// Personalized Competency Development for India's Official Statistical System
// Full TypeScript Types & Domain Interfaces
// ==============================================================================

export type UserRole = 'learner' | 'trainer' | 'admin';

export type EducationLevel = 
  | 'High School' 
  | 'Undergraduate' 
  | 'Postgraduate' 
  | 'Competitive Exam Prep' 
  | 'Self-Taught / Professional';

export type PreferredStudyTime = 'morning' | 'afternoon' | 'evening' | 'night';

export type DrillMode = 'standard' | 'rapid_fire' | 'weak_target' | 'custom';

export type CompetencyDomainType = 
  | 'Statistical Competencies'
  | 'Technical Competencies'
  | 'Digital Governance'
  | 'Behavioural & Managerial Competencies';

export type GapSeverity = 'critical' | 'improvement_needed' | 'strong';

export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard' | 'Mixed';
export type ImportanceLevel = 'Low' | 'Medium' | 'High' | 'Critical';
export type KnowledgeLevel = 'Low' | 'Medium' | 'High';
export type PriorityTag = 'Critical' | 'High' | 'Medium' | 'Low';
export type TaskType = 'study' | 'revision' | 'practice' | 'quiz' | 'break' | 'training_module' | 'igot_course';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'skipped' | 'rescheduled';
export type UnderstandingRating = 'didnt_understand' | 'partially_understood' | 'understood' | 'fully_understood';

// Official Competency Profile
export interface CompetencyScoreItem {
  id: string;
  name: string;
  domain: CompetencyDomainType;
  currentScore: number; // 0 - 100
  requiredScore: number; // 0 - 100
  lastAssessed?: string;
  description: string;
  aiExplanation?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  designation: string; // e.g. "Senior Statistical Officer (SSO)"
  department: string; // e.g. "National Accounts Division, MoSPI"
  cadre: string; // e.g. "Indian Statistical Service (ISS) / Subordinate Statistical Service (SSS)"
  currentAssignment: string; // e.g. "Periodic Labour Force Survey (PLFS) Tabulation"
  jobRole: string; // e.g. "Macroeconomic Aggregate Compiler & Data Analyst"
  educationalQualification: string; // e.g. "M.Sc. in Statistics / Mathematical Economics"
  workExperience: string; // e.g. "7 Years in Survey Methodologies & CPI Operations"
  previousTraining: string[]; // e.g. ["NSSTA Induction Course", "UNSIAP System of National Accounts"]
  completedCourses: string[];
  currentCompetencyLevels: Record<string, number>; // competency name -> score %
  overallCompetencyScore: number; // e.g. 72%
  dailyMaxStudyHours: number;
  streakDays: number;
  totalXp: number;
  learningHoursLogged: number;
  onboardingCompleted: boolean;
  createdAt?: string;

  // Backward compatibility fields for legacy UI components
  educationLevel?: EducationLevel;
  courseDegree?: string;
  currentSemester?: string;
  targetGpaGrade?: string;
  preferredStudyTime?: string;
  pomodoroFocusMins: number;
  pomodoroBreakMins: number;
  longBreakMins: number;
  stabilityThresholdMins: number;
}

export interface TimeSlot {
  start: string; // "10:00"
  end: string;   // "18:00"
}

export interface UserAvailability {
  id?: string;
  userId: string;
  dayType: 'weekday' | 'weekend' | 'holiday';
  wakeTime: string;
  sleepTime: string;
  institutionHours?: string;
  travelHours?: string;
  mealHours?: string;
  coachingHours?: string;
  personalActivityHours?: string;
  availableStudySlots: TimeSlot[];
}

// Competency Structure (mapped to Subject & Topic architecture)
export interface CompetencyDomain {
  id: string;
  userId?: string;
  name: CompetencyDomainType;
  code: string;
  color: string;
  icon: string;
  averageScore: number;
  requiredBenchmark: number;
  skills: CompetencySkill[];
  units?: Unit[]; // backward compat
}

export interface CompetencySkill {
  id: string;
  domainId: string;
  domainName: CompetencyDomainType;
  title: string;
  currentLevel: number; // 0 - 100
  requiredLevel: number; // e.g. 80
  gapSeverity: GapSeverity;
  gapPercentage: number; // required - current
  aiRationale: string;
  priority: PriorityTag;
  recommendedActions: string[];
  keyManualsAndStandards: string[];
  relatedIgotCourseIds: string[];
}

export interface Subject {
  id: string;
  userId: string;
  name: string;
  code?: string;
  color: string;
  icon: string;
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
  masteryPercentage: number;
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

// iGOT Karmayogi & NSSTA Learning Repository Models
export interface IGOTCourse {
  id: string;
  courseName: string;
  provider: 'iGOT Karmayogi' | 'NSSTA TPAC' | 'UNSIAP' | 'ISI Kolkata' | 'MoSPI Academy';
  competencyDomain: CompetencyDomainType;
  targetedSkill: string;
  durationHours: number;
  difficulty: 'Foundational' | 'Intermediate' | 'Advanced';
  description: string;
  enrolmentUrl?: string;
  completionStatus: 'Not Started' | 'Enrolled' | 'In Progress' | 'Completed';
  progressPercentage: number;
  isNsstaRecommended?: boolean;
  tpacAccredited?: boolean;
  rating: number; // 4.8
  enrolledOfficialsCount: number;
  priority: PriorityTag;
  reasonRecommended: string;
  syllabusModules: string[];
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
  startTime: string;
  endTime: string;
  plannedDurationMins: number;
  actualDurationMins?: number;
  status: TaskStatus;
  isLocked: boolean;
  priorityTag: PriorityTag;
  rescheduleReason?: string;
  completedAt?: string;
  igotCourseId?: string;
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
  savedOrDelayedMins: number;
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
  easeFactor: number;
  intervalDays: number;
  nextReviewDate: string;
  status: 'due' | 'completed' | 'overdue';
  lastRating?: number;
  updatedAt: string;
}

// AI Question & Assessment Engine Models
export interface AIQualityCheck {
  sourceSupported: boolean;
  singleCorrectAnswer: boolean;
  unambiguousOptions: boolean;
  noDuplicateQuestions: boolean;
  appropriateDifficulty: boolean;
  relevantToTopic: boolean;
  score: number; // 0 - 100
  notes: string[];
}

export interface ReferenceWebsite {
  title: string;
  url: string;
  source: string; // e.g. "MoSPI Official Portal", "World Bank Data", "RBI DBIE"
  description?: string;
}

export interface ReferenceVideo {
  title: string;
  url: string;
  channel: string;
  duration?: string;
  thumbnail?: string;
}

export interface QuizQuestion {
  id: string;
  quizId?: string;
  questionText: string;
  questionType: 'mcq' | 'conceptual' | 'code' | 'true_false';
  options: string[];
  correctAnswer: string;
  explanation: string;
  topic: string;
  difficulty: DifficultyLevel;
  competencyDomain?: CompetencyDomainType;
  sourceDocRef?: string;
  qualityCheck?: AIQualityCheck;
  status?: 'approved' | 'pending' | 'rejected';
  referenceWebsites?: ReferenceWebsite[];
  referenceVideos?: ReferenceVideo[];
}

export interface Quiz {
  id: string;
  userId: string;
  topicId?: string;
  subjectId?: string;
  title: string;
  difficulty: DifficultyLevel;
  questions: QuizQuestion[];
  competencyDomain?: CompetencyDomainType;
  sourceMaterialName?: string;
  createdAt: string;
  referenceWebsites?: ReferenceWebsite[];
  referenceVideos?: ReferenceVideo[];
}

// AI Learning Path Models
export interface LearningPathMilestone {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  estimatedHours: number;
  status: 'completed' | 'in_progress' | 'locked';
  competencyDomain: CompetencyDomainType;
  keySkills: string[];
  recommendedIgotCourse?: string;
  referenceVideos: ReferenceVideo[];
  referenceWebsites: ReferenceWebsite[];
  checkpointQuizTitle?: string;
}

export interface AiLearningPath {
  id: string;
  title: string;
  targetCompetency: string;
  domain: CompetencyDomainType;
  totalEstimatedHours: number;
  difficulty: 'Foundational' | 'Intermediate' | 'Advanced';
  aiRationale: string;
  milestones: LearningPathMilestone[];
  progressPercentage: number;
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
  answers: Record<string, string>;
  weakAreasIdentified: string[];
  domainScores?: Record<string, number>;
  competencyGain?: number;
  completedAt: string;
}

export interface UploadedLearningMaterial {
  id: string;
  fileName: string;
  fileType: 'pdf' | 'docx' | 'pptx' | 'txt' | 'manual';
  fileSizeMb: number;
  uploadedBy: string;
  uploadDate: string;
  title: string;
  targetDomain: CompetencyDomainType;
  extractedConcepts: string[];
  totalQuestionsGenerated: number;
  status: 'ready' | 'processing' | 'indexed';
  summary: string;
  documentSnippet?: string;
}

// Statistical Learning Assistant
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
  domainFocus?: CompetencyDomainType;
}

export interface AIChatMessage {
  id: string;
  tutorId: string;
  userId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  topicContext?: string;
  citedDocument?: string;
  createdAt: string;
}

export interface LearningResource {
  id: string;
  topicId: string;
  topicTitle?: string;
  subjectName?: string;
  title: string;
  resourceType: 'video' | 'documentation' | 'article' | 'practice' | 'course' | 'ai_explanation' | 'cheatsheet' | 'past_paper';
  url?: string;
  difficultyLevel: DifficultyLevel;
  estimatedMins: number;
  recommendedReason: string;
  qualityScore: number;
  sourcePlatform?: string;
  cheatsheetData?: CheatsheetItem;
}

export interface CheatsheetItem {
  id: string;
  title: string;
  subjectName: string;
  subjectColor: string;
  category: string;
  summary: string;
  keyFormulas?: { label: string; formula: string; explanation?: string }[];
  syntaxSnippets?: { title: string; language: string; code: string; note?: string }[];
  rulesOfThumb?: string[];
  lastUpdated?: string;
}

export interface DrillResult {
  id: string;
  drillTitle: string;
  subjectName: string;
  drillMode: string;
  score: number;
  totalQuestions: number;
  accuracyPercentage: number;
  avgSecondsPerQuestion: number;
  maxStreak: number;
  xpEarned: number;
  completedAt: string;
  weakTopicsIdentified: string[];
}

// Workforce & Predictive Analytics for Administrators
export interface DepartmentWorkforceMetric {
  departmentId: string;
  departmentName: string; // e.g. "National Accounts Division (NAD)"
  ministry: string; // e.g. "MoSPI"
  totalOfficials: number;
  averageCompetency: number; // %
  trainingCompletionRate: number; // %
  criticalGapCount: number;
  domainScores: {
    statistical: number;
    technical: number;
    digitalGovernance: number;
    behavioural: number;
  };
  priorityGaps: string[];
}

export interface EmergingSkillPrediction {
  id: string;
  skillName: string;
  growthCategory: 'Critical Demand' | 'High Impact' | 'Emerging Architecture';
  urgencyLevel: 'Immediate (0-6 mo)' | 'Strategic (6-18 mo)' | 'Vision 2030';
  projectedAdoptionRate: number; // e.g. +78%
  primaryDrivers: string[];
  recommendedPrograms: string[];
  applicableCadres: string[];
}

export interface AcademicEvent {
  id: string;
  userId: string;
  subjectId: string;
  subjectName: string;
  subjectColor: string;
  title: string;
  eventType: 'final_exam' | 'midterm' | 'quiz' | 'assignment' | 'practical' | 'project';
  eventDate: string;
  weightagePercentage: number;
  syllabusCoverageNeeded: number;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  notificationType: 'schedule_update' | 'session_reminder' | 'streak_alert' | 'exam_warning' | 'achievement' | 'competency_gap' | 'course_recommended';
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
  minutesDifference: number;
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

// Backward compatibility types for arena/leaderboard
export type BattleTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Grandmaster';
export interface BattleChallenger {
  id: string;
  name: string;
  handle: string;
  avatarEmoji: string;
  title: string;
  university: string;
  eloRating: number;
  tier: BattleTier;
  winRate: number;
  totalBattles: number;
  wins: number;
  losses: number;
  streak: number;
  favoriteSubject: string;
  isOnline: boolean;
  isBot?: boolean;
}
export interface BattleQuestion {
  id: string;
  subject: string;
  questionText: string;
  codeSnippet?: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: DifficultyLevel;
  points: number;
  timeLimitSec: number;
}
export interface LeaderboardEntry {
  id: string;
  rank: number;
  fullName: string;
  handle: string;
  avatarEmoji: string;
  university: string;
  eloRating: number;
  tier: BattleTier;
  winRate: number;
  wins: number;
  losses: number;
  streak: number;
  totalXp: number;
  subjectBadges: string[];
  isCurrentUser?: boolean;
}
export interface StudentBattleProfile {
  id: string;
  fullName: string;
  handle: string;
  avatarEmoji: string;
  title: string;
  university: string;
  eloRating: number;
  tier: BattleTier;
  totalBattles: number;
  wins: number;
  losses: number;
  winRate: number;
  currentStreak: number;
  bestStreak: number;
  totalXp: number;
  radarStats: {
    subject: string;
    score: number;
  }[];
  showcaseBadges: {
    id: string;
    title: string;
    icon: string;
    rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
    description: string;
  }[];
  recentMatches: {
    id: string;
    opponentName: string;
    opponentAvatar: string;
    opponentTier: BattleTier;
    userScore: number;
    opponentScore: number;
    result: 'Victory' | 'Defeat' | 'Draw';
    eloChange: number;
    subject: string;
    date: string;
  }[];
}
