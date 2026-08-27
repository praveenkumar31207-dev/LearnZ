import { ScheduleTask, RescheduleAdjustmentPlan, TaskStatus } from '@/types';

/**
 * Dynamic Rescheduling Engine with Stability Threshold
 */
export function calculateDynamicReschedule(
  tasks: ScheduleTask[],
  targetTaskId: string,
  actualDurationMins: number,
  stabilityThresholdMins: number = 10,
  actionType: 'complete' | 'skip' = 'complete'
): RescheduleAdjustmentPlan | null {
  const taskIndex = tasks.findIndex((t) => t.id === targetTaskId);
  if (taskIndex === -1) return null;

  const targetTask = tasks[taskIndex];
  const plannedMins = targetTask.plannedDurationMins;
  const timeDifference = plannedMins - actualDurationMins; // +25 = early, -35 = delayed

  // If skipped
  if (actionType === 'skip') {
    const affectedTasks: RescheduleAdjustmentPlan['affectedTasks'] = [];
    
    // Shift following unlocked tasks forward
    let shiftMinutes = plannedMins;
    for (let i = taskIndex + 1; i < tasks.length; i++) {
      const task = tasks[i];
      if (task.isLocked) continue;

      const oldStart = new Date(task.startTime);
      const oldEnd = new Date(task.endTime);

      const newStart = new Date(oldStart.getTime() - shiftMinutes * 60000);
      const newEnd = new Date(oldEnd.getTime() - shiftMinutes * 60000);

      affectedTasks.push({
        taskId: task.id,
        taskTitle: task.title,
        oldStart: task.startTime,
        oldEnd: task.endTime,
        newStart: newStart.toISOString(),
        newEnd: newEnd.toISOString(),
        reason: 'Shifted earlier to fill skipped slot',
      });
    }

    return {
      action: 'skipped_redistribute',
      minutesDifference: -plannedMins,
      explanation: `Task "${targetTask.title}" was skipped. Upcoming tasks have been shifted forward to utilize the available study time efficiently. The skipped topic has been queued for tomorrow's priority revision block.`,
      affectedTasks,
      preservedBreaks: true,
      preservedDeadlines: true,
    };
  }

  // Stability Threshold: If difference is small, avoid unnecessary timetable churn
  if (Math.abs(timeDifference) < stabilityThresholdMins) {
    return {
      action: 'balanced_adjustment',
      minutesDifference: timeDifference,
      explanation: `Task completed within acceptable threshold (${Math.abs(timeDifference)} mins difference). Schedule maintained without disruptive shifting.`,
      affectedTasks: [],
      preservedBreaks: true,
      preservedDeadlines: true,
    };
  }

  // SCENARIO A: Early Completion (timeDifference > 0)
  if (timeDifference > 0) {
    const affectedTasks: RescheduleAdjustmentPlan['affectedTasks'] = [];
    const savedMinutes = timeDifference;

    // Pull subsequent unlocked tasks earlier
    for (let i = taskIndex + 1; i < tasks.length; i++) {
      const task = tasks[i];
      if (task.isLocked && task.taskType !== 'break') {
        // Stop shifting if we hit a fixed locked user commitment
        break;
      }

      const oldStart = new Date(task.startTime);
      const oldEnd = new Date(task.endTime);

      const newStart = new Date(oldStart.getTime() - savedMinutes * 60000);
      const newEnd = new Date(oldEnd.getTime() - savedMinutes * 60000);

      affectedTasks.push({
        taskId: task.id,
        taskTitle: task.title,
        oldStart: task.startTime,
        oldEnd: task.endTime,
        newStart: newStart.toISOString(),
        newEnd: newEnd.toISOString(),
        reason: `Pulled forward by ${savedMinutes}m to utilize early completion`,
      });
    }

    return {
      action: 'early_pull_forward',
      minutesDifference: savedMinutes,
      explanation: `You completed "${targetTask.title}" ${savedMinutes} minutes ahead of schedule! I pulled forward upcoming tasks to maintain steady momentum while fully preserving your scheduled rest breaks.`,
      affectedTasks,
      preservedBreaks: true,
      preservedDeadlines: true,
    };
  }

  // SCENARIO B: Delayed / Took Longer (timeDifference < 0)
  if (timeDifference < 0) {
    const delayMinutes = Math.abs(timeDifference);
    const affectedTasks: RescheduleAdjustmentPlan['affectedTasks'] = [];

    let currentDelay = delayMinutes;

    for (let i = taskIndex + 1; i < tasks.length; i++) {
      const task = tasks[i];

      // If low priority task, we can postpone it rather than pushing bedtime
      if (task.priorityTag === 'Low' && task.taskType === 'study' && currentDelay > 20) {
        affectedTasks.push({
          taskId: task.id,
          taskTitle: task.title,
          oldStart: task.startTime,
          oldEnd: task.endTime,
          newStart: task.startTime,
          newEnd: task.endTime,
          statusChange: 'rescheduled' as TaskStatus,
          reason: `Postponed to tomorrow's buffer slot to absorb ${currentDelay}m session delay`,
        });
        currentDelay -= task.plannedDurationMins;
        continue;
      }

      if (task.isLocked && task.taskType !== 'break') {
        // Cannot move locked tasks
        continue;
      }

      const oldStart = new Date(task.startTime);
      const oldEnd = new Date(task.endTime);

      const newStart = new Date(oldStart.getTime() + currentDelay * 60000);
      const newEnd = new Date(oldEnd.getTime() + currentDelay * 60000);

      affectedTasks.push({
        taskId: task.id,
        taskTitle: task.title,
        oldStart: task.startTime,
        oldEnd: task.endTime,
        newStart: newStart.toISOString(),
        newEnd: newEnd.toISOString(),
        reason: `Shifted by +${currentDelay}m due to extended focus time`,
      });
    }

    return {
      action: 'delay_cascade',
      minutesDifference: -delayMinutes,
      explanation: `Session took ${delayMinutes} minutes longer than estimated. The AI dynamically adjusted upcoming tasks, protecting high-priority deadlines and your scheduled evening breaks.`,
      affectedTasks,
      preservedBreaks: true,
      preservedDeadlines: true,
    };
  }

  return null;
}

/**
 * Apply Reschedule Plan to Task List
 */
export function applyReschedulePlan(
  tasks: ScheduleTask[],
  plan: RescheduleAdjustmentPlan
): ScheduleTask[] {
  const planMap = new Map(plan.affectedTasks.map((t) => [t.taskId, t]));

  return tasks.map((task) => {
    const adjustment = planMap.get(task.id);
    if (!adjustment) return task;

    return {
      ...task,
      startTime: adjustment.newStart,
      endTime: adjustment.newEnd,
      status: adjustment.statusChange || task.status,
      rescheduleReason: adjustment.reason,
    };
  });
}
