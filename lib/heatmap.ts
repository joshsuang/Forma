/**
 * Forma — Heatmap Module (Module 3.4)
 * 
 * Renders a contribution heatmap showing habit completion intensity over time.
 * Each square represents a day, colored by completion state.
 * Supports both light and dark themes.
 */

import type { 
  Habit, 
  HabitCompletionState, 
  DailyProgress 
} from "@/lib/types";
import { 
  isHabitExpectedOnDate,
  formatDate as scheduleFormatDate
} from "./scheduling";

/** Color intensity for heatmap squares by completion state */
export type HeatmapColor = 
  | "bg-surface-subtle"       // empty/incomplete
  | "bg-surface"              // partial
  | "bg-success"              // completed
  | "bg-primary-subtle";      // unscheduled

/** Get the heatmap color class for a given habit state and whether it's scheduled */
export function getHeatmapColorClass(
  state: HabitCompletionState,
  isScheduled: boolean
): HeatmapColor {
  if (!isScheduled) {
    return "bg-surface-subtle"; // muted for unscheduled days
  }
  switch (state) {
    case "completed":
      return "bg-success";
    case "partial":
      return "bg-surface";
    case "incomplete":
      return "bg-surface-subtle";
    case "skipped":
      return "bg-surface-subtle"; // muted for skipped
    default:
      return "bg-surface-subtle";
  }
}

/** Get the tooltip text for a heatmap square */
export function getHeatmapTooltip(
  state: HabitCompletionState,
  isScheduled: boolean,
  habitName?: string
): string {
  if (!isScheduled) {
    return "Unscheduled";
  }
  switch (state) {
    case "completed":
      return habitName ? `${habitName}: Completed` : "Completed";
    case "partial":
      return habitName ? `${habitName}: Partial` : "Partial progress";
    case "incomplete":
      return habitName ? `${habitName}: Incomplete` : "Incomplete";
    case "skipped":
      return habitName ? `${habitName}: Skipped` : "Skipped";
    default:
      return habitName ? `${habitName}: Unknown` : "Unknown";
  }
}

/** Calculate the completion intensity for a specific date across all habits */
export function calculateDateIntensity(
  habits: Habit[],
  date: Date | string
): { 
  expected: number; 
  completed: number; 
  partial: number; 
  incomplete: number; 
  skipped: number; 
  rate: number 
} {
  const targetDate = typeof date === "string" ? new Date(date) : date;
  
  let expected = 0;
  let completed = 0;
  let partial = 0;
  let incomplete = 0;
  let skipped = 0;
  
  for (const habit of habits) {
    if (isHabitExpectedOnDate(habit, targetDate)) {
      expected++;
      const progress = habit.progress;
      switch (progress.state) {
        case "completed":
          completed++;
          break;
        case "partial":
          partial++;
          break;
        case "incomplete":
          incomplete++;
          break;
        case "skipped":
          skipped++;
          break;
      }
    }
  }
  
  const rate = expected > 0 ? Math.round((completed / expected) * 100) : 0;
  
  return { expected, completed, partial, incomplete, skipped, rate };
}

/** Get all dates that have habit records, within a date range */
export function getDatesWithRecords(
  habits: Habit[],
  progressRecords: DailyProgress[],
  startDate: Date,
  endDate: Date
): string[] {
  const dates = new Set<string>();
  
  // Collect all dates from progress records
  for (const record of progressRecords) {
    if (record.recordedAt >= startDate.toISOString().split("T")[0] && 
        record.recordedAt <= endDate.toISOString().split("T")[0]) {
      dates.add(record.recordedAt);
    }
  }
  
  // Also include dates where habits are expected but have no records yet
  // (for future tracking)
  // Note: We only include dates that are in the progress records for now
  
  return Array.from(dates).sort();
}

/** Get the intensity rate (percentage) for a specific date */
export function getDateRate(
  habits: Habit[],
  progressRecords: DailyProgress[],
  date: Date | string
): number {
  const targetDate = typeof date === "string" ? new Date(date) : date;
  
  const relevantRecords = progressRecords.filter(
    (pr) => pr.recordedAt === scheduleFormatDate(targetDate)
  );
  
  if (relevantRecords.length === 0) return 0;
  
  let completed = 0;
  for (const record of relevantRecords) {
    if (record.state === "completed" || record.state === "partial") {
      completed++;
    }
  }
  
  return Math.round((completed / relevantRecords.length) * 100);
}

/** Format a date for heatmap key */
export function heatmapKeyDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

/** Parse a heatmap key date string back to a Date */
export function parseHeatmapKey(key: string): Date {
  return new Date(key);
}