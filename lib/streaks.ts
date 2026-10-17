/**
 * Forma — Streak Engine (Module 3.3)
 * 
 * Calculates current and longest streaks for habits, respecting each habit's schedule.
 * Unscheduled days do not break streaks; scheduled incomplete days break them.
 * Skipped days do not break streaks but also don't count as completions.
 */

import type { 
  Habit, 
  HabitSchedule, 
  HabitScheduleConfig, 
  HabitCompletionState, 
  DailyProgress 
} from "@/lib/types";
import { 
  differenceInDays, 
  isHabitExpectedOnDate 
} from "./scheduling";

/** Calculate current and longest streak for a single habit */
export function calculateHabitStreak(
  habit: Habit,
  progressRecords: DailyProgress[]
): { current: number; longest: number } {
  const schedule = habit.schedule;
  if (!schedule) return { current: 0, longest: 0 };
  
  // Get all progress records for this habit, sorted by date ascending
  const habitRecords = progressRecords
    .filter((pr) => pr.habitId === habit.id)
    .sort((a, b) => a.recordedAt.localeCompare(b.recordedAt));
  
  if (habitRecords.length === 0) return { current: 0, longest: 0 };
  
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  
  // Track the last date we saw a completion
  let lastCompletionDate: Date | null = null;
  let streakBroken = false;
  
  for (const record of habitRecords) {
    const recordDate = new Date(record.recordedAt);
    const state = record.state;
    const isScheduled = isHabitExpectedOnDate(habit, record.recordedAt);
    
    if (state === "completed" || state === "partial") {
      // A completion - extend or start a streak
      if (!lastCompletionDate) {
        // First completion ever - start streak
        tempStreak = 1;
        streakBroken = false;
      } else {
        // Check the gap from the last completion
        const diff = differenceInDays(recordDate, lastCompletionDate);
        
        if (diff === 1) {
          // Consecutive day - extend streak
          tempStreak++;
        } else if (diff > 1) {
          // Gap - record longest so far, start new streak
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1; // start new streak from this completion
        } else if (diff === 0) {
          // Same day - don't double-count, keep current tempStreak
          // (do nothing, tempStreak stays the same)
        }
      }
      lastCompletionDate = recordDate;
      currentStreak = tempStreak; // currentStreak tracks the running streak
    } 
    else if (state === "skipped") {
      // Skipped day - does not break streak per roadmap rules, 
      // but also doesn't extend it. Just continue without changing streak.
      // We do NOT reset tempStreak or streakBroken here.
    } 
    else {
      // state === "incomplete" - this breaks the streak if the habit was scheduled on this day
      if (isScheduled) {
        // Incomplete on a scheduled day breaks the streak
        longestStreak = Math.max(longestStreak, tempStreak);
        streakBroken = true;
        tempStreak = 0;
        lastCompletionDate = null; // reset since streak is broken
      }
      // If unscheduled, incomplete doesn't affect streak at all
    }
  }
  
  // Final longest streak update  
  longestStreak = Math.max(longestStreak, tempStreak);
  
  return { current: tempStreak, longest: longestStreak };
}

/** Calculate streaks for all habits */
export function calculateAllStreaks(
  habits: Habit[],
  progressRecords: DailyProgress[]
): Record<string, { current: number; longest: number }> {
  const result: Record<string, { current: number; longest: number }> = {};
  
  for (const habit of habits) {
    result[habit.id] = calculateHabitStreak(habit, progressRecords);
  }
  
  return result;
}
