import {
  Topic,
  Subject,
  UserAvailability,
  ScheduleTask,
  PriorityTag,
  DifficultyLevel,
  KnowledgeLevel,
  ImportanceLevel,
} from '@/types';
import { calculateDaysRemaining } from './utils';

/**
 * 1. Intelligent Study-Time Estimation
 * Estimated Time = Base Mins * Difficulty Multiplier * Knowledge Gap Multiplier * Importance Multiplier * User Historical Pace
 */
export function estimateTopicStudyTime(
  difficulty: DifficultyLevel,
  knowledgeLevel: KnowledgeLevel,
  importance: ImportanceLevel,
  baseMins: number = 60,
  userPaceMultiplier: number = 1.0
): number {
  // Difficulty multiplier
  const diffMap: Record<DifficultyLevel, number> = {
    Easy: 0.8,
    Medium: 1.0,
    Hard: 1.4,
    Mixed: 1.0,
  };

  // Knowledge gap multiplier (Lower knowledge = more time needed)
  const knowMap: Record<KnowledgeLevel, number> = {
    High: 0.75,
    Medium: 1.0,
    Low: 1.35,
  };

  // Importance multiplier (Higher importance warrants deeper study)
  const impMap: Record<ImportanceLevel, number> = {
    Low: 0.9,
    Medium: 1.0,
    High: 1.15,
    Critical: 1.3,
  };

  const calculated =
    baseMins *
    (diffMap[difficulty] || 1.0) *
    (knowMap[knowledgeLevel] || 1.0) *
    (impMap[importance] || 1.0) *
    userPaceMultiplier;

  // Round to nearest 5 minutes
  return Math.max(15, Math.round(calculated / 5) * 5);
}

/**
 * 2. Smart Priority Scoring Algorithm
 * Priority Score = Urgency (Exam proximity) + Exam Weight + Difficulty + Knowledge Gap
 */
export function calculateTopicPriority(
  topic: Topic,
  subject?: Subject
): { score: number; tag: PriorityTag } {
  let score = 0;

  // 1. Deadline Urgency
  if (subject?.examDate) {
    const days = calculateDaysRemaining(subject.examDate);
    if (days <= 3) score += 50;
    else if (days <= 7) score += 35;
    else if (days <= 14) score += 20;
    else if (days <= 30) score += 10;
  }

  // 2. Academic Weight & Importance
  if (topic.importance === 'Critical') score += 30;
  else if (topic.importance === 'High') score += 20;
  else if (topic.importance === 'Medium') score += 10;
  else score += 5;

  // 3. Knowledge Gap (Low knowledge = higher priority to study)
  if (topic.knowledgeLevel === 'Low') score += 25;
  else if (topic.knowledgeLevel === 'Medium') score += 15;
  else score += 5;

  // 4. Topic Difficulty
  if (topic.difficulty === 'Hard') score += 15;
  else if (topic.difficulty === 'Medium') score += 10;
  else score += 5;

  // 5. Mastery score penalty (already mastered = lower urgency)
  score -= Math.round((topic.masteryPercentage || 0) * 0.2);

  // Classify Priority Tag
  let tag: PriorityTag = 'Medium';
  if (score >= 80) tag = 'Critical';
  else if (score >= 55) tag = 'High';
  else if (score >= 30) tag = 'Medium';
  else tag = 'Low';

  return { score, tag };
}

/**
 * 3. Prerequisite-Aware Topological Sort
 * Orders topics so all prerequisite fundamentals come before dependent topics.
 */
export function sortTopicsByPrerequisites(topics: Topic[]): Topic[] {
  const topicMap = new Map<string, Topic>();
  topics.forEach((t) => topicMap.set(t.id, t));

  const visited = new Set<string>();
  const temp = new Set<string>();
  const sorted: Topic[] = [];

  function visit(topicId: string) {
    if (temp.has(topicId)) return; // Prevent cyclic dependency hang
    if (!visited.has(topicId)) {
      temp.add(topicId);
      const topic = topicMap.get(topicId);
      if (topic && topic.prerequisiteIds) {
        for (const prereqId of topic.prerequisiteIds) {
          if (topicMap.has(prereqId)) {
            visit(prereqId);
          }
        }
      }
      temp.delete(topicId);
      visited.add(topicId);
      if (topic) {
        sorted.push(topic);
      }
    }
  }

  for (const topic of topics) {
    if (!visited.has(topic.id)) {
      visit(topic.id);
    }
  }

  return sorted;
}

/**
 * 4. AI Schedule Generator
 * Generates structured study sessions and balanced breaks matching user availability.
 */
export function generateStudySchedule(
  userId: string,
  subjects: Subject[],
  allTopics: Topic[],
  availability: UserAvailability,
  targetDate: Date = new Date(),
  pomodoroFocusMins: number = 50,
  pomodoroBreakMins: number = 10
): ScheduleTask[] {
  const tasks: ScheduleTask[] = [];

  // Filter uncompleted or revision-needed topics
  const pendingTopics = allTopics.filter((t) => !t.isCompleted);

  // Group topics with subject details
  const subjectMap = new Map<string, Subject>();
  subjects.forEach((s) => subjectMap.set(s.id, s));

  // Find chapter -> subject link (via topic)
  const prioritizedTopics = sortTopicsByPrerequisites(pendingTopics).map((topic) => {
    // Find subject for this topic
    let subject: Subject | undefined;
    for (const s of subjects) {
      const hasTopic = s.units?.some((u) =>
        u.chapters?.some((c) => c.topics?.some((tp) => tp.id === topic.id))
      );
      if (hasTopic) {
        subject = s;
        break;
      }
    }
    const { score, tag } = calculateTopicPriority(topic, subject);
    return { topic, subject, score, tag };
  });

  // Sort primarily by priority score
  prioritizedTopics.sort((a, b) => b.score - a.score);

  // Available slots for the day
  const slots = availability.availableStudySlots.length > 0
    ? availability.availableStudySlots
    : [{ start: '18:00', end: '22:00' }];

  let topicIndex = 0;
  const dateStr = targetDate.toISOString().split('T')[0];

  for (const slot of slots) {
    const [startH, startM] = slot.start.split(':').map(Number);
    const [endH, endM] = slot.end.split(':').map(Number);

    let currentMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    while (currentMinutes < endMinutes && topicIndex < prioritizedTopics.length) {
      const item = prioritizedTopics[topicIndex];
      const remainingSlotMins = endMinutes - currentMinutes;

      if (remainingSlotMins < 20) {
        // Less than 20 mins remaining in this slot, break or end
        break;
      }

      // Determine task duration (either topic's estimated duration or chunked by focus block)
      const topicEstimated = item.topic.estimatedMins || 60;
      const sessionDuration = Math.min(
        topicEstimated,
        pomodoroFocusMins,
        remainingSlotMins
      );

      const taskStartH = Math.floor(currentMinutes / 60);
      const taskStartM = currentMinutes % 60;
      const taskEndMinutes = currentMinutes + sessionDuration;
      const taskEndH = Math.floor(taskEndMinutes / 60);
      const taskEndM = taskEndMinutes % 60;

      const startTimeStr = `${dateStr}T${taskStartH.toString().padStart(2, '0')}:${taskStartM.toString().padStart(2, '0')}:00`;
      const endTimeStr = `${dateStr}T${taskEndH.toString().padStart(2, '0')}:${taskEndM.toString().padStart(2, '0')}:00`;

      tasks.push({
        id: `task-${Date.now()}-${topicIndex}-${Math.random().toString(36).substr(2, 4)}`,
        userId,
        topicId: item.topic.id,
        subjectId: item.subject?.id,
        title: `${item.subject?.name ? item.subject.name + ' — ' : ''}${item.topic.title}`,
        subjectName: item.subject?.name || 'General',
        subjectColor: item.subject?.color || '#6366f1',
        taskType: 'study',
        startTime: startTimeStr,
        endTime: endTimeStr,
        plannedDurationMins: sessionDuration,
        status: 'pending',
        isLocked: false,
        priorityTag: item.tag,
      });

      currentMinutes += sessionDuration;

      // Add break if there's enough time remaining in slot
      if (currentMinutes + pomodoroBreakMins < endMinutes) {
        const breakEndMinutes = currentMinutes + pomodoroBreakMins;
        const breakStartH = Math.floor(currentMinutes / 60);
        const breakStartM = currentMinutes % 60;
        const breakEndH = Math.floor(breakEndMinutes / 60);
        const breakEndM = breakEndMinutes % 60;

        tasks.push({
          id: `break-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          userId,
          title: 'Quick Recharge Break ☕',
          taskType: 'break',
          startTime: `${dateStr}T${breakStartH.toString().padStart(2, '0')}:${breakStartM.toString().padStart(2, '0')}:00`,
          endTime: `${dateStr}T${breakEndH.toString().padStart(2, '0')}:${breakEndM.toString().padStart(2, '0')}:00`,
          plannedDurationMins: pomodoroBreakMins,
          status: 'pending',
          isLocked: true,
          priorityTag: 'Low',
        });

        currentMinutes += pomodoroBreakMins;
      }

      topicIndex++;
    }
  }

  return tasks;
}
