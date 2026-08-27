import { SpacedRevision, UnderstandingRating, Topic } from '@/types';

/**
 * SuperMemo SM-2 Spaced Repetition Algorithm
 */
export function calculateSM2Revision(
  topicId: string,
  topicTitle: string,
  subjectName: string,
  subjectColor: string,
  userId: string,
  rating: UnderstandingRating,
  previousRevision?: SpacedRevision
): SpacedRevision {
  // Convert rating to SM-2 quality (0 to 5 scale)
  const qualityMap: Record<UnderstandingRating, number> = {
    didnt_understand: 1,
    partially_understood: 2,
    understood: 4,
    fully_understood: 5,
  };

  const q = qualityMap[rating] || 3;
  let easeFactor = previousRevision?.easeFactor || 2.5;
  let repetitionNumber = previousRevision?.repetitionNumber || 0;
  let intervalDays = 1;

  // If rating is unsatisfactory (quality < 3), reset repetition count to start
  if (q < 3) {
    repetitionNumber = 1;
    intervalDays = 1;
  } else {
    repetitionNumber += 1;
    if (repetitionNumber === 1) {
      intervalDays = 1;
    } else if (repetitionNumber === 2) {
      intervalDays = 3;
    } else {
      intervalDays = Math.round((previousRevision?.intervalDays || 3) * easeFactor);
    }
  }

  // Calculate new Ease Factor: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  easeFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  // Bound Ease Factor between 1.3 and 2.8
  easeFactor = Math.max(1.3, Math.min(2.8, Number(easeFactor.toFixed(2))));

  // Calculate next review date
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + intervalDays);
  const nextReviewDateStr = nextDate.toISOString().split('T')[0];

  return {
    id: previousRevision?.id || `rev-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    userId,
    topicId,
    topicTitle,
    subjectName,
    subjectColor,
    repetitionNumber,
    easeFactor,
    intervalDays,
    nextReviewDate: nextReviewDateStr,
    status: 'due',
    lastRating: q,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Diagnostic Weak Topic Identifier
 */
export function identifyWeakTopics(
  topics: Topic[],
  revisions: SpacedRevision[]
): { topic: Topic; weakReason: string; riskScore: number }[] {
  const weakList: { topic: Topic; weakReason: string; riskScore: number }[] = [];

  for (const topic of topics) {
    let isWeak = false;
    let reason = '';
    let riskScore = 0;

    const revision = revisions.find((r) => r.topicId === topic.id);

    if (topic.masteryPercentage > 0 && topic.masteryPercentage < 65) {
      isWeak = true;
      reason = `Mastery is low (${topic.masteryPercentage}%). Requires immediate conceptual drill.`;
      riskScore = 80 - topic.masteryPercentage;
    } else if (revision && revision.lastRating && revision.lastRating < 3) {
      isWeak = true;
      reason = 'Rated as difficult or partially understood in recent study session.';
      riskScore = 75;
    } else if (topic.difficulty === 'Hard' && topic.knowledgeLevel === 'Low') {
      isWeak = true;
      reason = 'High difficulty with low prior knowledge gap.';
      riskScore = 70;
    }

    if (isWeak) {
      weakList.push({ topic, weakReason: reason, riskScore });
    }
  }

  // Sort by risk descending
  return weakList.sort((a, b) => b.riskScore - a.riskScore);
}
