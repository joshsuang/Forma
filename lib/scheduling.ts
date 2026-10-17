/**
 * Forma — Scheduling Engine (Module 3.2)
 * 
 * Calculates which habits are expected on each date based on their schedule type.
 * Supports: every-day, selected-weekdays, weekly-target, monthly-target, custom-interval.
 */

import type { 
  Habit, 
  HabitType, 
  HabitCompletionState, 
  HabitSchedule, 
  HabitScheduleConfig, 
  DailyProgress 
} from "@/lib/types";

/** Get the JavaScript Date.getDay() index (0=Sunday, 6=Saturday) */
export function getJsDayIndex(date: Date): number {
  return date.getDay();
}

/** Get the day name (monday, tuesday, etc.) from a Date */
export function getDayName(date: Date): "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday" {
  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  return days[date.getDay()] as "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
}

/** Check if a habit is expected on a specific date */
export function isHabitExpectedOnDate(
  habit: Habit,
  date: Date | string
): boolean {
  const targetDate = typeof date === "string" ? new Date(date) : date;
  const schedule = habit.schedule;
  
  if (!schedule) return false;
  
  switch (schedule.schedule) {
    case "every-day":
      return true;
    
    case "selected-weekdays": {
      const dayName = getDayName(targetDate);
      return (schedule.selectedWeekdays ?? []).includes(dayName);
    }
    
    case "weekly-target":
      // weekly-target means expected every day, target is N per week
      return true;
    
    case "monthly-target":
      // Expected every day of the month, target is N per month
      return true;
    
    case "custom-interval": {
      if (!schedule.selectedWeekdays) return false;
      const dayName = getDayName(targetDate);
      return schedule.selectedWeekdays.includes(dayName);
    }
    
    default:
      return false;
  }
}

/** Get the day of year (1-366) */
export function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.floor((diff / oneDay) + (start.getTimezoneOffset() - date.getTimezoneOffset()) / (24 * 60 * 60 * 1000));
}

/** Get all dates when a habit is expected, within a date range */
export function getExpectedDates(
  habit: Habit,
  startDate: Date,
  endDate: Date
): string[] {
  const dates: string[] = [];
  const current = new Date(startDate);
  
  while (current <= endDate) {
    if (isHabitExpectedOnDate(habit, current)) {
      dates.push(formatDate(current));
    }
    current.setDate(current.getDate() + 1);
  }
  
  return dates;
}

/** Format a Date to ISO date string (YYYY-MM-DD) */
export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

/** Calculate the completion rate for a set of habits on a specific date */
export function calculateCompletionRate(
  habits: Habit[],
  date: Date | string
): { expected: number; completed: number; rate: number } {
  const targetDate = typeof date === "string" ? new Date(date) : date;
  
  let expected = 0;
  let completed = 0;
  
  for (const habit of habits) {
    if (isHabitExpectedOnDate(habit, targetDate)) {
      expected++;
      const progress = habit.progress;
      if (progress.state === "completed" || progress.state === "partial") {
        completed++;
      }
    }
  }
  
  const rate = expected > 0 ? Math.round((completed / expected) * 100) : 0;
  
  return { expected, completed, rate };
}

/** Calculate current and longest streaks for a habit */
export function calculateHabitStreak(
  habit: Habit,
  progressRecords: DailyProgress[]
): { current: number; longest: number } {
  const schedule = habit.schedule;
  if (!schedule) return { current: 0, longest: 0 };
  
  // Get all progress records for this habit, sorted by date descending
  const habitRecords = progressRecords
    .filter((pr) => pr.habitId === habit.id)
    .sort((a, b) => b.recordedAt.localeCompare(a.recordedAt));
  
  if (habitRecords.length === 0) return { current: 0, longest: 0 };
  
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  
  // Process records in chronological order for streak calculation
  const sortedRecords = [...habitRecords].sort((a, b) => a.recordedAt.localeCompare(b.recordedAt));
  
  let previousDate: string | null = null;
  let streakRunning = false;
  
  for (const record of sortedRecords) {
    const recordDate = record.recordedAt;
    
    if (previousDate === null) {
      // First record - start streak if completed/partial
      if (record.state === "completed" || record.state === "partial") {
        streakRunning = true;
        tempStreak = 1;
      } else if (record.state === "skipped") {
        // Skipped doesn't break streak but doesn't count either
        streakRunning = false;
        tempStreak = 0;
      }
    } else {
      // Check if this is the next day after the previous record
      const prev = new Date(previousDate!);
      const curr = new Date(recordDate);
      const diffDays = differenceInDays(curr, prev);
      
      if (diffDays === 1) {
        // Consecutive day - extend streak if completed/partial
        if (record.state === "completed" || record.state === "partial") {
          tempStreak++;
          if (streakRunning) {
            currentStreak = tempStreak;
          }
        } else if (record.state === "skipped") {
          // A skipped day resets the streak counter but doesn't "break" it
          tempStreak = streakRunning ? tempStreak : 0;
          streakRunning = false;
        } else {
          // Incomplete breaks the streak
          streakRunning = false;
          tempStreak = 0;
        }
      } else if (diffDays > 1) {
        // Gap - reset current streak
        if (streakRunning) {
          longestStreak = Math.max(longestStreak, tempStreak);
        }
        streakRunning = record.state === "completed" || record.state === "partial";
        tempStreak = streakRunning ? 1 : 0;
      }
      // diffDays === 0: same day, ignore (keep current streak state)
    }
    
    previousDate = recordDate;
  }
  
  // Final longest streak check
  if (streakRunning) {
    longestStreak = Math.max(longestStreak, tempStreak);
  }
  
  return { current: currentStreak, longest: longestStreak };
}

/** Calculate difference in days between two dates */
export function differenceInDays(
  later: Date,
  earlier: Date
): number {
  const msDiff = later.getTime() - earlier.getTime();
  return Math.floor(msDiff / (24 * 60 * 60 * 1000));
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