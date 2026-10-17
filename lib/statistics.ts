/**
 * Forma — Statistics Module (Module 3.5)
 * 
 * Real calculations replacing placeholder statistics with data-driven values.
 * Daily/weekly/monthly completion rates, per-habit consistency, best/lowest performers,
 * total completions, milestones, and progress graphs.
 */

import type { 
  Habit, 
  HabitCompletionState, 
  DailyProgress 
} from "@/lib/types";
import { 
  isHabitExpectedOnDate,
  calculateCompletionRate,
  calculateAllStreaks,
  formatDate as scheduleFormatDate,
  getDayOfYear,
  getJsDayIndex
} from "./scheduling";

/** Daily completion percentage across all expected habits */
export function getDailyCompletionPercentage(
  habits: Habit[],
  date: Date | string
): number {
  const { expected, completed } = calculateCompletionRate(habits, date);
  return expected > 0 ? Math.round((completed / expected) * 100) : 0;
}

/** Weekly completion rate (completions this week / expected this week) */
export function getWeeklyCompletionRate(
  habits: Habit[],
  progressRecords: DailyProgress[],
  referenceDate?: Date | string
): number {
  const date = referenceDate ? new Date(referenceDate) : new Date();
  
  // Get the week number using the getDayOfYear helper from scheduling
  const dayOfYear = getDayOfYear(date);
  const weekNum = Math.floor(dayOfYear / 7); // 0-indexed week
  
  // Determine week start (Sunday) and end (Saturday)
  const jsDayIndex = getJsDayIndex(date);
  const dayOffset = jsDayIndex === 0 ? -6 : 1 - jsDayIndex; // days to subtract to reach Sunday
  const weekStart = new Date(date);
  weekStart.setDate(date.getDate() + dayOffset);
  
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6); // Saturday
  
  // Get ISO date strings for week boundaries
  const weekStartStr = scheduleFormatDate(weekStart);
  const weekEndStr = scheduleFormatDate(weekEnd);
  
  // Filter records for this week
  const weekRecords = progressRecords.filter((pr) => {
    const recordDate = pr.recordedAt;
    return recordDate >= weekStartStr && recordDate <= weekEndStr;
  });
  
  // Count expected and completed for this week
  let expected = 0;
  let completed = 0;
  
  // For each habit, check which days in the week are expected and if completed
  for (const habit of habits) {
    // Get all progress records for this habit in this week
    const habitWeekRecords = weekRecords.filter(
      (pr) => pr.habitId === habit.id
    );
    
    // Check each day of the week (0=Sunday to 6=Saturday)
    for (let d = 0; d < 7; d++) {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + d);
      const dayStr = scheduleFormatDate(day);
      
      if (isHabitExpectedOnDate(habit, day)) {
        expected++;
        // Check if there's a completed or partial record for this habit on this day
        if (habitWeekRecords.some((pr) => pr.recordedAt === dayStr && 
          (pr.state === "completed" || pr.state === "partial"))) {
          completed++;
        }
      }
    }
  }
  
  return expected > 0 ? Math.round((completed / expected) * 100) : 0;
}

/** Monthly completion rate */
export function getMonthlyCompletionRate(
  habits: Habit[],
  progressRecords: DailyProgress[],
  referenceDate?: Date | string
): number {
  const date = referenceDate ? new Date(referenceDate) : new Date();
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-indexed
  
  const monthStart = new Date(year, month, 1);
  const monthEnd = new Date(year, month + 1, 0); // last day of month
  
  const monthStartStr = scheduleFormatDate(monthStart);
  const monthEndStr = scheduleFormatDate(monthEnd);
  
  let expected = 0;
  let completed = 0;
  
  for (const record of progressRecords) {
    const recordDate = new Date(record.recordedAt);
    if (recordDate >= monthStart && recordDate <= monthEnd) {
      // Find the habit
      const habit = habits.find((h) => h.id === record.habitId);
      if (!habit) continue;
      
      if (isHabitExpectedOnDate(habit, recordDate)) {
        expected++;
        if (record.state === "completed" || record.state === "partial") {
          completed++;
        }
      }
    }
  }
  
  return expected > 0 ? Math.round((completed / expected) * 100) : 0;
}

/** Per-habit consistency (percentage of expected days completed) */
export function getHabitConsistency(
  habit: Habit,
  progressRecords: DailyProgress[]
): { habitName: string; expected: number; completed: number; consistency: number } {
  // Get all records for this habit
  const habitRecords = progressRecords.filter(
    (pr) => pr.habitId === habit.id
  );
  
  // Get date range
  if (habitRecords.length === 0) {
    return { habitName: habit.name, expected: 0, completed: 0, consistency: 0 };
  }
  
  const sortedRecords = [...habitRecords].sort((a, b) => 
    a.recordedAt.localeCompare(b.recordedAt)
  );
  
  const firstDate = new Date(sortedRecords[0].recordedAt);
  const lastDate = new Date(sortedRecords[sortedRecords.length - 1].recordedAt);
  
  // Count expected days in range
  let expected = 0;
  let completed = 0;
  
  let currentDate = new Date(firstDate);
  while (currentDate <= lastDate) {
    if (isHabitExpectedOnDate(habit, currentDate)) {
      expected++;
      const record = habitRecords.find((pr) => pr.recordedAt === currentDate.toISOString().split("T")[0]);
      if (record && (record.state === "completed" || record.state === "partial")) {
        completed++;
      }
    }
    currentDate = new Date(currentDate);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  const consistency = expected > 0 ? Math.round((completed / expected) * 100) : 0;
  
  return { habitName: habit.name, expected, completed, consistency };
}

/** Best performing habits (by completion rate) */
export function getBestPerformingHabits(
  habits: Habit[],
  progressRecords: DailyProgress[],
  limit = 5
): Array<{ habit: Habit; consistency: number }> {
  const consistencies = habits.map((habit) => {
    const { consistency } = getHabitConsistency(habit, progressRecords);
    return { habit, consistency };
  });
  
  // Sort by consistency descending
  consistencies.sort((a, b) => b.consistency - a.consistency);
  
  return consistencies.slice(0, limit);
}

/** Lowest performing habits */
export function getLowestPerformingHabits(
  habits: Habit[],
  progressRecords: DailyProgress[],
  limit = 5
): Array<{ habit: Habit; consistency: number }> {
  const consistencies = habits.map((habit) => {
    const { consistency } = getHabitConsistency(habit, progressRecords);
    return { habit, consistency };
  });
  
  // Sort by consistency ascending
  consistencies.sort((a, b) => a.consistency - b.consistency);
  
  return consistencies.slice(0, limit);
}

/** Total completions across all habits and all time */
export function getTotalCompletions(
  habits: Habit[],
  progressRecords: DailyProgress[]
): number {
  let total = 0;
  
  for (const record of progressRecords) {
    if (record.state === "completed" || record.state === "partial") {
      total++;
    }
  }
  
  return total;
}

/** Milestones reached (e.g., 100 total completions, 50-day streak, etc.) */
export function getMilestones(
  habits: Habit[],
  progressRecords: DailyProgress[]
) {
  const totalCompletions = getTotalCompletions(habits, progressRecords);
  const allStreaks = calculateAllStreaks(habits, progressRecords);
  
  // Find longest streak across all habits
  let longestStreak = 0;
  for (const streak of Object.values(allStreaks)) {
    longestStreak = Math.max(longestStreak, streak.longest);
  }
  
  const milestones: Array<{ label: string; value: number | string }> = [];
  
  if (totalCompletions >= 100) {
    milestones.push({ label: "100+ completions", value: totalCompletions });
  }
  if (totalCompletions >= 50) {
    milestones.push({ label: "50+ completions", value: totalCompletions });
  }
  if (totalCompletions >= 25) {
    milestones.push({ label: "25+ completions", value: totalCompletions });
  }
  if (longestStreak >= 30) {
    milestones.push({ label: `${longestStreak}+ day streak`, value: longestStreak });
  }
  if (longestStreak >= 7) {
    milestones.push({ label: "7+ day streak", value: longestStreak });
  }
  if (longestStreak >= 3) {
    milestones.push({ label: "3+ day streak", value: longestStreak });
  }
  
  return milestones;
}

/** Progress graph data - daily completions over a date range */
export function getProgressGraphData(
  habits: Habit[],
  progressRecords: DailyProgress[],
  startDate: Date,
  endDate: Date
): Array<{ date: string; completions: number; expected: number }> {
  const data = [];
  
  const startStr = startDate.toISOString().split("T")[0];
  const endStr = endDate.toISOString().split("T")[0];
  
  // Generate all dates in range
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split("T")[0];
    
    // Count completions on this date
    let completions = 0;
    let expected = 0;
    
    for (const habit of habits) {
      if (isHabitExpectedOnDate(habit, currentDate)) {
        expected++;
        const record = progressRecords.find(
          (pr) => pr.habitId === habit.id && pr.recordedAt === dateStr
        );
        if (record && (record.state === "completed" || record.state === "partial")) {
          completions++;
        }
      }
    }
    
    data.push({ date: dateStr, completions, expected });
    currentDate = new Date(currentDate);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return data;
}