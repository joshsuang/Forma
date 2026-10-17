/**
 * Forma — Cloud Data Architecture (Phase 4, Module 4.1)
 * 
 * Data model review and migration planning from localStorage to cloud.
 * Uses native IndexedDB browser API where cloud integration is not yet available.
 * No new dependencies added — all APIs are browser-native.
 */

import type { 
  Habit, 
  HabitType, 
  HabitCompletionState, 
  Category, 
  CustomCategory, 
  HabitCategory, 
  DailyProgress, 
  HabitSchedule, 
  HabitScheduleConfig 
} from "@/lib/types";

/** 
 * Map localStorage habit to cloud-native format.
 * This prepares the data model for Supabase/Postgres migration without 
 * requiring the Supabase SDK.
 */
export interface CloudHabitMapping {
  id: string;          // UUID
  name: string;
  description?: string;
  category: string;    // Category | CustomCategory
  habitType: HabitType;
  schedule: {
    type: "every-day" | "selected-weekdays" | "weekly-target" | "monthly-target" | "custom-interval";
    selectedWeekdays?: string[];
    weeklyTarget?: number;
    monthlyTarget?: number;
    target: number;
    unit: string;
  };
  progress: {
    state: HabitCompletionState;
    value: number;
    notes?: string;
    recordedAt: string; // ISO date
  }[];
  creationDate: string; // ISO 8601
  lastUpdated: string; // ISO 8601
}

/** 
 * Map cloud habit back to localStorage format.
 * Enables reverse migration from cloud to local.
 */
export interface LocalHabitMapping {
  id: string;
  name: string;
  description?: string;
  category: HabitCategory;
  habitType: HabitType;
  schedule: HabitScheduleConfig;
  progress: DailyProgress;
  creationDate: string;
  lastUpdated: string;
}

/** 
 * Migration status tracking.
 * Used during the local-to-cloud data transfer process.
 */
export type MigrationStatus = 
  | "not-started"
  | "in-progress" 
  | "completed"
  | "failed"
  | "rolled-back";

/** 
 * Migration result for a single habit.
 * Tracks success/failure and any data loss or transformations applied.
 */
export interface MigrationResult {
  habitId: string;
  status: MigrationStatus;
  localRecord: Habit;
  cloudRecord?: any; // what was sent/would be sent to cloud
  error?: string; // migration error details
  transformed: boolean; // whether the record was transformed during migration
}

/** 
 * Cloud storage backend options.
 * Defines which cloud service can be used for persistence.
 * Currently supports: none (localStorage only), supabase (planned).
 */
export type CloudBackend = "none" | "supabase";

/** 
 * Check if cloud persistence is available.
 * In this implementation, cloud is not configured — returns false.
 * When Supabase is integrated, this would check for available credentials.
 */
export function isCloudPersistenceAvailable(): boolean {
  // Cloud persistence not configured in this implementation
  // Would return true when Supabase credentials are set in env vars
  return false;
}

/** 
 * Migrate habits from localStorage to cloud.
 * Currently a no-op since cloud is not configured.
 * In a full implementation, this would:
 * 1. Read all habits from localStorage
 * 2. Transform to cloud format
 * 3. Insert via Supabase REST API
 * 4. Track results and handle failures
 */
export async function migrateHabitsToCloud(
  habits: Habit[],
  progressRecords: DailyProgress[]
): Promise<MigrationResult[]> {
  if (!isCloudPersistenceAvailable()) {
    // Return migration results indicating cloud not available
    return habits.map((habit): MigrationResult => ({
      habitId: habit.id,
      status: "not-started",
      localRecord: habit,
      transformed: false,
      error: "Cloud persistence not configured. Set up Supabase to enable cloud migration."
    }));
  }
  
  // If cloud were available, this would:
  // 1. Transform each habit to CloudHabitMapping format
  // 2. Upload via Supabase
  // 3. Return results
  
  return [];
}

/** 
 * Migrate progress records from localStorage to cloud.
 * Currently a no-op since cloud is not configured.
 */
export async function migrateProgressRecordsToCloud(
  progressRecords: DailyProgress[],
  habitIds: string[]
): Promise<MigrationResult[]> {
  if (!isCloudPersistenceAvailable()) {
    return progressRecords.map((record): MigrationResult => ({
      habitId: record.habitId,
      status: "not-started",
      localRecord: record as unknown as Habit, // cast for type compatibility
      transformed: false,
      error: "Cloud persistence not configured. Set up Supabase to enable cloud migration."
    }));
  }
  
  return [];
}

/** 
 * Fetch habits from cloud.
 * Currently returns empty array since cloud is not configured.
 * When Supabase is integrated, this would query the habits table.
 */
export async function fetchHabitsFromCloud(): Promise<Habit[]> {
  if (!isCloudPersistenceAvailable()) {
    return [];
  }
  
  // Would query Supabase: select * from habits
  return [];
}

/** 
 * Fetch progress records from cloud.
 * Currently returns empty array since cloud is not configured.
 * When Supabase is integrated, this would query the daily_progress table.
 */
export async function fetchProgressRecordsFromCloud(): Promise<DailyProgress[]> {
  if (!isCloudPersistenceAvailable()) {
    return [];
  }
  
  // Would query Supabase: select * from daily_progress
  return [];
}

/** 
 * Save a habit to cloud.
 * Currently a no-op. When Supabase is integrated, would insert/update the habit.
 */
export async function saveHabitToCloud(habit: Habit): Promise<{ success: boolean; error?: string }> {
  if (!isCloudPersistenceAvailable()) {
    return { success: false, error: "Cloud persistence not configured" };
  }
  
  // Would insert via Supabase
  return { success: false, error: "Not implemented" };
}

/** 
 * Save progress record to cloud.
 * Currently a no-op. When Supabase is integrated, would insert the record.
 */
export async function saveProgressRecordToCloud(
  record: DailyProgress
): Promise<{ success: boolean; error?: string }> {
  if (!isCloudPersistenceAvailable()) {
    return { success: false, error: "Cloud persistence not configured" };
  }
  
  // Would insert via Supabase
  return { success: false, error: "Not implemented" };
}

/** 
 * Delete a habit and its progress from cloud.
 * Currently a no-op.
 */
export async function deleteHabitFromCloud(habitId: string): Promise<{ success: boolean; error?: string }> {
  if (!isCloudPersistenceAvailable()) {
    return { success: false, error: "Cloud persistence not configured" };
  }
  
  // Would delete via Supabase
  return { success: false, error: "Not implemented" };
}

/** 
 * Execute a local-only backup of all data to a JSON string.
 * Can be used for manual export or restoration from a previous backup file.
 */
export function backupLocalData(habits: Habit[], progressRecords: DailyProgress[]): string {
  const backup = {
    exportedAt: new Date().toISOString(),
    habits,
    progressRecords,
    version: "1.0.0"
  };
  
  return JSON.stringify(backup, null, 2);
}

/** 
 * Restore data from a backup JSON string.
 * Returns parsed backup or null if invalid.
 */
export function restoreFromBackup(backupJson: string): 
  | { habits: Habit[]; progressRecords: DailyProgress[]; exportedAt: string; version: string }
  | null {
  try {
    const backup = JSON.parse(backupJson) as {
      habits: Habit[];
      progressRecords: DailyProgress[];
      exportedAt: string;
      version: string;
    };
    
    // Validate required fields
    if (!backup.habits || !backup.progressRecords) {
      return null;
    }
    
    return backup;
  } catch (e) {
    return null;
  }
}

/** 
 * Check IndexedDB availability (browser-native, no dependency).
 * Used as a potential intermediate step before cloud migration.
 * IndexedDB provides more storage capacity than localStorage.
 */
export function checkIndexedDBAvailability(): { 
  available: boolean; 
  name?: string; 
  version?: number 
} {
  // IndexedDB is available in all modern browsers
  // But we can't easily open a database without user interaction in this context
  if (typeof window !== "undefined" && window.indexedDB) {
    return { available: true, name: "Forma IndexedDB", version: 1 };
  }
  return { available: false };
}

/** 
 * Simple IndexedDB wrapper for Forma data.
 * Uses the native browser IndexedDB API without external dependencies.
 * Stores habits and progress records with version tracking.
 */
export class IndexedDBStorage {
  private db: IDBDatabase | null = null;
  private dbName = "forma-cloud";
  private dbVersion = 1;
  
  constructor() {
    // Attempt to open the database on construction
    this.open();
  }
  
  private open(): void {
    if (typeof window === "undefined") return;
    
    const request = window.indexedDB.open(this.dbName, this.dbVersion);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Create object stores if they don't exist
      if (!db.objectStoreNames.contains("habits")) {
        const habitsStore = db.createObjectStore("habits", { keyPath: "id" });
        habitsStore.createIndex("by-category", "category", { unique: false });
        habitsStore.createIndex("by-habitType", "habitType", { unique: false });
      }
      
      if (!db.objectStoreNames.contains("progress")) {
        const progressStore = db.createObjectStore("progress", { keyPath: "id" });
        progressStore.createIndex("by-habitId", "habitId", { unique: false });
        progressStore.createIndex("by-recordedAt", "recordedAt", { unique: false });
      }
    };
    
    request.onsuccess = (event) => {
      this.db = (event.target as IDBOpenDBRequest).result;
    };
    
    request.onerror = (event) => {
      console.error("IndexedDB error:", (event.target as IDBRequest).error);
      this.db = null;
    };
  }
  
  /** Get all habits from IndexedDB */
  getHabits(): Promise<Habit[]> {
    if (!this.db) return Promise.resolve([]);
    
    const transaction = this.db!.transaction(["habits"], "readonly");
    const store = transaction.objectStore("habits");
    const getAllRequest = store.getAll();
    
    return new Promise((resolve) => {
      getAllRequest.onsuccess = () => {
        resolve(getAllRequest.result as Habit[]);
      };
    });
  }
  
  /** Save a habit to IndexedDB */
  saveHabit(habit: Habit): Promise<boolean> {
    if (!this.db) return Promise.resolve(false);
    
    return new Promise((resolve) => {
      const transaction = this.db!.transaction(["habits"], "readwrite");
      const store = transaction.objectStore("habits");
      const request = store.put(habit);
      
      request.onsuccess = () => resolve(true);
      request.onerror = () => resolve(false);
    });
  }
  
  /** Get all progress records from IndexedDB */
  getProgressRecords(): Promise<DailyProgress[]> {
    if (!this.db) return Promise.resolve([]);
    
    return new Promise((resolve) => {
      const transaction = this.db!.transaction(["progress"], "readonly");
      const store = transaction.objectStore("progress");
      const getAllRequest = store.getAll();
      
      getAllRequest.onsuccess = () => {
        resolve(getAllRequest.result as DailyProgress[]);
      };
    });
  }
  
  /** Save a progress record to IndexedDB */
  saveProgressRecord(record: DailyProgress): Promise<boolean> {
    if (!this.db) return Promise.resolve(false);
    
    return new Promise((resolve) => {
      const transaction = this.db!.transaction(["progress"], "readwrite");
      const store = transaction.objectStore("progress");
      const request = store.put(record);
      
      request.onsuccess = () => resolve(true);
      request.onerror = () => resolve(false);
    });
  }
  
  /** Close the database connection */
  close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}