/**
 * Forma — Local Persistence (Module 2.3)
 * Handles persisting habit and progress data to localStorage.
 * All functions are pure and gracefully handle storage unavailability.
 */

import { DEFAULT_HABIT_CONFIGS, type Habit, type DailyProgress, type HabitType, type HabitScheduleConfig, type HabitCompletionState } from "./types";

// Storage key constants
const HABITS_STORAGE_KEY = "forma-habits";
const PROGRESS_STORAGE_KEY = "forma-progress";

/**
 * Load habits from localStorage.
 * Returns default habits if storage unavailable.
 */
export function loadHabits(): Habit[] {
  try {
    if (typeof window === "undefined") {
      return DEFAULT_HABIT_CONFIGS;
    }
    const stored = window.localStorage.getItem(HABITS_STORAGE_KEY);
    if (!stored) {
      return DEFAULT_HABIT_CONFIGS;
    }
    const parsed = JSON.parse(stored) as Habit[];
    return parsed;
  } catch (error) {
    console.error("Failed to load habits from localStorage", error);
    return DEFAULT_HABIT_CONFIGS;
  }
}

/**
 * Save habits to localStorage.
 * Returns true if save succeeded, false if storage unavailable.
 */
export function saveHabits(habits: Habit[]): boolean {
  try {
    if (typeof window === "undefined") {
      return false;
    }
    window.localStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(habits));
    return true;
  } catch (error) {
    console.error("Failed to save habits to localStorage", error);
    return false;
  }
}

/**
 * Load progress records from localStorage.
 * Returns empty array if storage unavailable or empty.
 */
export function loadProgressRecords(): DailyProgress[] {
  try {
    if (typeof window === "undefined") {
      return [];
    }
    const stored = window.localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!stored) {
      return [];
    }
    const parsed = JSON.parse(stored) as DailyProgress[];
    return parsed;
  } catch (error) {
    console.error("Failed to load progress records from localStorage", error);
    return [];
  }
}

/**
 * Save progress records to localStorage.
 * Returns true if save succeeded.
 */
export function saveProgressRecords(records: DailyProgress[]): boolean {
  try {
    if (typeof window === "undefined") {
      return false;
    }
    window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(records));
    return true;
  } catch (error) {
    console.error("Failed to save progress records to localStorage", error);
    return false;
  }
}