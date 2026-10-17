/**
 * Forma — Habit Data Model (Module 2.1)
 *
 * Defines the core types and data structures for habit tracking.
 * All types are explicit, validated, and designed for use with
 * local storage, IndexedDB, or Supabase cloud persistence.
 */

import type { ReactNode } from "react";

/**
 * Habit types supported by Forma.
 *
 * - Boolean: yes-or-no habit (e.g., Read, Meditate)
 * - Numerical: measurable quantity (e.g., Drink 20 pages)
 * - Duration: time spent on an activity (e.g., Study 60min)
 * - Counter: number of occurrences (e.g., Complete 5 questions)
 */
export type HabitType = "boolean" | "numeric" | "duration" | "counter";

/**
 * Completion states for a habit entry.
 *
 * - Incomplete: habit not yet completed for this cycle
 * - Partial: partial progress recorded (e.g., 15min of 60min target)
 * - Completed: habit fully completed for this cycle
 * - Skipped: habit was intentionally skipped; does not count as completion
 *
 * Important: `Skipped` is distinct from `Incomplete` and must not
 * count as successful completion for streak/calculation purposes.
 */
export type HabitCompletionState = "incomplete" | "partial" | "completed" | "skipped";

/**
 * Schedule types for habit recurrence.
 *
 * - Every day: habit expected daily
 * - Selected weekdays: habit on specific days of the week (e.g., Mon, Wed, Fri)
 * - Weekly target: complete the habit N times per week
 * - Monthly target: complete the habit N times per month
 * - Custom intervals: practical custom scheduling (e.g., every 2 days)
 *
 * Unscheduled days do not break a streak; a scheduled day that is
 * not completed breaks the streak according to defined rules.
 */
export type HabitSchedule =
  | "every-day"
  | "selected-weekdays"
  | "weekly-target"
  | "monthly-target"
  | "custom-interval";

/** Default habit categories, as specified in FORMA_SPEC.md §10. */
export const DEFAULT_CATEGORIES = [
  "Health",
  "Fitness",
  "School",
  "Productivity",
  "Personal",
] as const;

/** Type-safe category union. */
export type Category = (typeof DEFAULT_CATEGORIES)[number];

/** Allows custom categories beyond the defaults. */
export type CustomCategory = string;

/** A habit category, either from defaults or user-defined. */
export type HabitCategory = Category | CustomCategory;

/**
 * Daily progress record for a single habit on a single day.
 *
 * - `id`: unique identifier (ISO string date + habit id combination)
 * - `habitId`: links to the habit configuration
 * - `state`: completion state (incomplete/partial/completed/skipped)
 * - `value`: recorded progress (numeric value, duration minutes, counter count)
 * - `recordedAt`: when the progress was recorded (ISO timestamp)
 * - `notes`: optional free-form notes
 */
export interface DailyProgress {
  id: string;
  habitId: string;
  state: HabitCompletionState;
  value: number; // minutes for duration, count for counter, 0/1 for numeric/boolean
  recordedAt: string; // ISO 8601 date string
  notes?: string;
}

/**
 * Configuration for a habit schedule.
 *
 * - `habitType`: the kind of habit (boolean/numeric/duration/counter)
 * - `target`: the goal value (depends on type: e.g., 1 book, 2L, 60min, 30 reps)
 * - `unit`: human-readable label (e.g., "book", "liters", "minutes", "reps")
 * - `schedule`: how often the habit is expected (every-day/selected-weekdays/weekly-target/monthly-target/custom-interval)
 * - `selectedWeekdays`: which days of the week when schedule is "selected-weekdays"
 * - `weeklyTarget`: number of completions expected per week (for weekly-target schedule)
 * - `monthlyTarget`: number of completions expected per month (for monthly-target schedule)
 *
 * Naming note: `habitType` distinguishes the habit kind from `schedule`
 * which describes recurrence frequency.
 */
export interface HabitScheduleConfig {
  habitType: HabitType;
  target: number;
  unit: string;
  schedule: HabitSchedule;
  selectedWeekdays?: ("monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday")[];
  weeklyTarget?: number;
  monthlyTarget?: number;
}

/**
 * Core habit configuration.
 *
 * - `id`: unique UUID-like identifier
 * - `name`: display name of the habit
 * - `description`: optional description
 * - `category`: habit category (default or custom)
 * - `schedule`: how often the habit is expected
 * - `progress`: current daily progress record (most recent)
 * - `creationDate`: when the habit was created
 * - `lastUpdated`: when the habit was last modified
 *
 * Key design decisions (per FORMA_SPEC.md and DEVELOPMENT_ROADMAP.md):
 * - Historical records (DailyProgress) are separate from habit configuration
 * - IDs are ISO date strings for daily progress (links to a specific day)
 * - Completion states are explicit; `Skipped` does not count as completed
 * - Scheduling respects each habit's schedule; unscheduled days do not break streaks
 */
export interface Habit {
  id: string;
  name: string;
  description?: string;
  category: HabitCategory;
  habitType: HabitType;
  schedule: HabitScheduleConfig;
  progress: DailyProgress;
  creationDate: string; // ISO 8601
  lastUpdated: string; // ISO 8601
}

/**
 * Parsed weekday names for human-readable display.
 */
export const WEEKDAY_NAMES: Record<
  "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday",
  string
> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

/** Validate that a HabitScheduleConfig has required fields for its schedule type. */
export function isValidScheduleConfig(
  config: HabitScheduleConfig,
): boolean {
  if (config.schedule === "selected-weekdays" && !config.selectedWeekdays?.length) {
    return false;
  }
  if (config.schedule === "weekly-target" && config.weeklyTarget == null) {
    return false;
  }
  if (config.schedule === "monthly-target" && config.monthlyTarget == null) {
    return false;
  }
  return true;
}

/** Example default habit configurations for demo purposes. */
export const DEFAULT_HABIT_CONFIGS: Habit[] = [
  {
    id: "1",
    name: "Read",
    category: "Productivity",
    habitType: "boolean",
    schedule: {
      habitType: "boolean",
      target: 1,
      unit: "book",
      schedule: "every-day",
    },
    progress: {
      id: `${Date.now()}-1`,
      habitId: "1",
      state: "completed",
      value: 1,
      recordedAt: new Date().toISOString().split("T")[0],
    },
    creationDate: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Meditate",
    category: "Health",
    habitType: "boolean",
    schedule: {
      habitType: "boolean",
      target: 1,
      unit: "session",
      schedule: "every-day",
    },
    progress: {
      id: `${Date.now()}-2`,
      habitId: "2",
      state: "completed",
      value: 1,
      recordedAt: new Date().toISOString().split("T")[0],
    },
    creationDate: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Drink water",
    category: "Health",
    habitType: "numeric",
    schedule: {
      habitType: "numeric",
      target: 2,
      unit: "liters",
      schedule: "every-day",
    },
    progress: {
      id: `${Date.now()}-3`,
      habitId: "3",
      state: "partial",
      value: 1,
      recordedAt: new Date().toISOString().split("T")[0],
    },
    creationDate: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Push-ups",
    category: "Fitness",
    habitType: "counter",
    schedule: {
      habitType: "counter",
      target: 30,
      unit: "reps",
      schedule: "every-day",
    },
    progress: {
      id: `${Date.now()}-4`,
      habitId: "4",
      state: "incomplete",
      value: 12,
      recordedAt: new Date().toISOString().split("T")[0],
    },
    creationDate: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "5",
    name: "Study",
    category: "School",
    habitType: "duration",
    schedule: {
      habitType: "duration",
      target: 60,
      unit: "minutes",
      schedule: "every-day",
    },
    progress: {
      id: `${Date.now()}-5`,
      habitId: "5",
      state: "incomplete",
      value: 45,
      recordedAt: new Date().toISOString().split("T")[0],
    },
    creationDate: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "6",
    name: "Practice guitar",
    category: "Personal",
    habitType: "counter",
    schedule: {
      habitType: "counter",
      target: 21,
      unit: "sessions",
      schedule: "every-day",
    },
    progress: {
      id: `${Date.now()}-6`,
      habitId: "6",
      state: "incomplete",
      value: 18,
      recordedAt: new Date().toISOString().split("T")[0],
    },
    creationDate: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
  },
];