/**
 * Forma — Categories and Organization Module (Module 5.2)
 * 
 * Manage custom categories.
 * Filter habits.
 * Group habits.
 * Support manual ordering.
 * All storage uses localStorage — no new dependencies.
 */

import type { Habit } from "@/lib/types";

/** Default categories as specified in the roadmap */
export const DEFAULT_CATEGORIES = [
  "Health",
  "Fitness",
  "School",
  "Productivity",
  "Personal",
] as const;

/** Category type - string literal union from defaults */
export type Category = 
  | "Health" 
  | "Fitness" 
  | "School" 
  | "Productivity" 
  | "Personal";

/** Allow custom categories beyond the defaults */
export type CustomCategory = string;

/** Habit category: either from defaults or user-defined */
export type HabitCategory = Category | CustomCategory;

/** Get all default categories */
export function getDefaultCategories(): Category[] {
  return [...DEFAULT_CATEGORIES];
}

/** Get all categories including custom ones from storage */
export function getAllCategoriesIncludingDefault(): (Category | CustomCategory)[] {
  try {
    if (typeof window === "undefined") return [...DEFAULT_CATEGORIES];
    
    const stored = localStorage.getItem("forma-custom-categories");
    if (stored) {
      const custom: string[] = JSON.parse(stored);
      return [...DEFAULT_CATEGORIES, ...custom];
    }
  } catch {
    // Storage unavailable or invalid - return defaults
  }
  
  return [...DEFAULT_CATEGORIES];
}

/** Save a custom category to localStorage */
export function saveCustomCategory(category: CustomCategory): void {
  // Avoid duplicates and reserved default names
  try {
    if (typeof window !== "undefined") {
      const custom = JSON.parse(localStorage.getItem("forma-custom-categories") || "[]");
      const categoryIsDefault = DEFAULT_CATEGORIES.some((c) => c === category);
      if (!custom.includes(category) && !categoryIsDefault) {
        custom.push(category);
        localStorage.setItem("forma-custom-categories", JSON.stringify(custom));
      }
    }
  } catch {
    // Storage unavailable
  }
}

/** Remove a custom category */
export function removeCustomCategory(category: CustomCategory): void {
  try {
    if (typeof window !== "undefined") {
      const custom = JSON.parse(localStorage.getItem("forma-custom-categories") || "[]")
        .filter((c: string) => c !== category);
      localStorage.setItem("forma-custom-categories", JSON.stringify(custom));
    }
  } catch {
    // Storage unavailable
  }
}

/** Get all available categories (defaults + custom) as strings */
export function getAllCategoryStrings(): string[] {
  try {
    if (typeof window === "undefined") return [...DEFAULT_CATEGORIES];
    
    const stored = localStorage.getItem("forma-custom-categories");
    if (stored) {
      const custom: string[] = JSON.parse(stored);
      return [...new Set([...DEFAULT_CATEGORIES, ...custom])];
    }
  } catch {
    // Storage unavailable or invalid
  }
  
  return [...DEFAULT_CATEGORIES];
}

/** Filter habits by category - uses string category from Habit */
export function filterHabitsByCategory(
  habits: Habit[],
  category: string
): Habit[] {
  return habits.filter((habit) => habit.category === category);
}

/** Get habits grouped by category */
export function groupHabitsByCategory(
  habits: Habit[]
): Record<string, Habit[]> {
  const groups: Record<string, Habit[]> = {};
  
  for (const habit of habits) {
    const cat = habit.category;
    if (!groups[cat]) {
      groups[cat] = [];
    }
    groups[cat].push(habit);
  }
  
  return groups;
}

/** Reorder habits within a category */
export function reorderHabitsInCategory(
  habits: Habit[],
  category: string,
  newOrder: string[]
): Habit[] {
  const categoryHabits = habits.filter((h) => h.category === category);
  const otherHabits = habits.filter((h) => h.category !== category);
  
  // Create a map from id to position
  const positionMap = new Map<string, number>();
  newOrder.forEach((id, index) => positionMap.set(id, index));
  
  // Sort category habits by the new order
  const sortedCategoryHabits = categoryHabits.sort(
    (a, b) => (positionMap.get(a.id) ?? Infinity) - (positionMap.get(b.id) ?? Infinity)
  );
  
  // Return: sorted category habits followed by other habits
  return [...sortedCategoryHabits, ...otherHabits];
}

/** Check if a category name is a default category */
export function isDefaultCategory(category: string): boolean {
  return DEFAULT_CATEGORIES.some((c) => c === category);
}

/** Check if a category name is a custom category */
export function isCustomCategory(category: string): boolean {
  return !DEFAULT_CATEGORIES.some((c) => c === category) && category.trim().length > 0;
}