/**
 * Forma — Dashboard Customization Module (Module 5.1)
 * 
 * Show and hide dashboard sections.
 * Reorder supported sections.
 * Persist preferences.
 * Keep defaults useful.
 * All storage uses localStorage — no new dependencies.
 */

// Storage key for dashboard layout preferences
const DASHBOARD_LAYOUT_KEY = "forma-dashboard-layout";

/** Section keys for dashboard customization */
export type DashboardSection = 
  | "statistics"
  | "heatmap" 
  | "streaks"
  | "daily-progress"
  | "habits";

/** Layout preference for dashboard */
export interface DashboardLayout {
  /** Order of sections (from left to right) */
  order: DashboardSection[];
}

/** Get the stored dashboard layout preference */
export function getDashboardLayout(): DashboardLayout {
  try {
    const stored = typeof window !== "undefined" 
      ? localStorage.getItem(DASHBOARD_LAYOUT_KEY) 
      : null;
    
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Storage unavailable or invalid JSON
  }
  
  // Default layout: statistics, heatmap, streaks, daily-progress, habits
  return {
    order: ["statistics", "heatmap", "streaks", "daily-progress", "habits"]
  };
}

/** Store a dashboard layout preference */
export function setDashboardLayout(layout: DashboardLayout): void {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(DASHBOARD_LAYOUT_KEY, JSON.stringify(layout));
    }
  } catch {
    // Storage unavailable - silently fail
  }
}

/** Toggle a section's visibility by adding/removing from order */
export function toggleSectionVisibility(section: DashboardSection): void {
  const layout = getDashboardLayout();
  const newOrder = layout.order.includes(section)
    ? layout.order.filter((s) => s !== section)
    : [...layout.order, section];
  setDashboardLayout({ order: newOrder });
}

/** Hide a dashboard section */
export function hideSection(section: DashboardSection): void {
  const layout = getDashboardLayout();
  const newOrder = layout.order.filter((s) => s !== section);
  setDashboardLayout({ order: newOrder });
}

/** Show a dashboard section */
export function showSection(section: DashboardSection): void {
  const layout = getDashboardLayout();
  if (!layout.order.includes(section)) {
    setDashboardLayout({ order: [...layout.order, section] });
  }
}

/** Reorder dashboard sections */
export function reorderSections(newOrder: DashboardSection[]): void {
  const layout = getDashboardLayout();
  // Filter to only sections that are valid DashboardSection values
  layout.order = newOrder.filter((section) => 
    section === "statistics" || 
    section === "heatmap" || 
    section === "streaks" || 
    section === "daily-progress" || 
    section === "habits"
  );
  setDashboardLayout(layout);
}

/** Get the current order of visible sections (all in order = visible) */
export function getVisibleSections(): DashboardSection[] {
  return getDashboardLayout().order;
}

/** Get default dashboard layout */
export function getDefaultDashboardLayout(): DashboardLayout {
  return {
    order: ["statistics", "heatmap", "streaks", "daily-progress", "habits"]
  };
}