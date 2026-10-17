/**
 * Forma — Notifications Module (Module 5.4)
 * 
 * Add optional reminders.
 * Request permissions appropriately.
 * Support reminder settings.
 * Respect browser and iOS limitations.
 * Uses native Browser Notification API — no new dependencies.
 */

/** Permission status for browser notifications */
export type NotificationPermission = "granted" | "denied" | "default";

/** Request notification permission from the user */
export async function requestNotificationPermission(): 
  Promise<NotificationPermission> {
  // Check if Notification API is supported
  if (!("Notification" in window)) {
    return "denied" as NotificationPermission;
  }
  
  // Check current permission status
  const currentPermission = Notification.permission;
  
  if (currentPermission === "granted") {
    return "granted";
  }
  
  if (currentPermission === "denied") {
    return "denied";
  }
  
  // Request permission
  // Note: Must show a user gesture (click) first for autopermission
  // In practice, this would be called from a user action handler
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (e) {
    console.error("Notification permission request failed:", e);
    return "default" as NotificationPermission;
  }
}

/** Check if notification permission is granted */
export function isNotificationPermissionGranted(): boolean {
  return Notification.permission === "granted";
}

/** Check if notification permission has been denied */
export function isNotificationPermissionDenied(): boolean {
  return Notification.permission === "denied";
}

/** Schedule a reminder notification for a habit on a specific date */
export interface ReminderSchedule {
  /** The habit ID to remind about */
  habitId: string;
  /** When to show the reminder (ISO date string) */
  date: string;
  /** Habit name for the notification message */
  habitName: string;
  /** Optional notes to include */
  notes?: string;
}

/** Show a reminder notification */
export function showReminderNotification(
  reminder: ReminderSchedule
): boolean {
  if (!("Notification" in window)) {
    console.log("Notification API not supported");
    return false;
  }
  
  if (Notification.permission !== "granted") {
    console.log("Notification permission not granted");
    return false;
  }
  
  // Create notification content
  const title = `Habit Reminder: ${reminder.habitName}`;
  const body = reminder.notes 
    ? `${reminder.notes}\nProgress for ${reminder.date}`
    : `Record progress for ${reminder.habitName} on ${reminder.date}`;
  
  try {
    const notificationOptions: Omit<NotificationOptions, "renotify"> = {
      body,
      tag: `forma-reminder-${reminder.habitId}`,
    };
    
    const notification = new Notification(title, notificationOptions);
    
    // Auto-close after 10 seconds
    setTimeout(() => {
      notification.close();
    }, 10000);
    
    return true;
  } catch (e) {
    console.error("Failed to show notification:", e);
    return false;
  }
}

/** 
 * Check browser notification limitations.
 * iOS Safari has specific requirements for notifications.
 */
export function checkNotificationLimitations(): {
  supported: boolean;
  isiOS: boolean;
  requiresUserGesture: boolean;
  maxNotificationRate: "per-day" | "per-hour" | "unlimited";
} {
  const isiOS = 
    /iPad|iPhone|iPod/.test(navigator.userAgent) && 
    /AppleWebKit/.test(navigator.userAgent);
  
  return {
    supported: "Notification" in window,
    isiOS: isiOS,
    requiresUserGesture: true, // Notifications require user interaction to auto-permit
    maxNotificationRate: isiOS ? "per-day" : "unlimited",
  };
}

/** 
 * Get the notification permission status as a human-readable string */
export function getPermissionStatus(): string {
  switch (Notification.permission) {
    case "granted":
      return "Notifications enabled";
    case "denied":
      return "Notifications disabled (user blocked)";
    default:
      return "Notifications pending (ask user)";
  }
}