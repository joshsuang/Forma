"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/cn";
import { ThemeToggle } from "@/components/theme-toggle";
import { type ReactNode } from "react";

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", href: "/" },
  { key: "habits", label: "Habits", href: "/habits" },
  { key: "statistics", label: "Statistics", href: "/statistics" },
  { key: "settings", label: "Settings", href: "/settings" },
];

const SMALL_BREAKPOINT = 640; // tailwind sm

export interface SidebarProps {
  /** Whether the sidebar is expanded. Controlled by parent for persistense. */
  expanded?: boolean;
  /** Called when the user toggles expansion */
  onToggle?: (expanded: boolean) => void;
  /** Currently active section for active state */
  activeKey?: string;
  children?: ReactNode;
}

export function Sidebar({
  expanded = true,
  onToggle,
  activeKey,
  children,
}: SidebarProps) {
  // Initialize from saved preference; fall back to explicit prop default
  const stored = typeof window !== "undefined" ? localStorage.getItem("forma-sidebar-expanded") : null;
  const [isExpanded, setIsExpanded] = useState(
    stored !== null ? stored === "true" : (expanded !== false)
  );

  // Persist preference in localStorage on every change
  useEffect(() => {
    try {
      window.localStorage.setItem("forma-sidebar-expanded", String(isExpanded));
    } catch {
      // Storage may be unavailable
    }
  }, [isExpanded]);

  const handleToggle = useCallback(() => {
    setIsExpanded((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem("forma-sidebar-expanded", String(next));
      } catch {
        // Storage may be unavailable
      }
      onToggle?.(next);
      return next;
    });
  }, [onToggle]);

  const isSmallScreen = typeof window !== "undefined" && window.innerWidth < SMALL_BREAKPOINT;

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 bottom-0 w-64 transition-transform duration-300 ease-out sm:static sm:w-auto sm:flex sm:flex-row sm:items-start",
        isExpanded || !isSmallScreen
          ? "transform translate-x-0"
          : "transform translate-x-full",
        "bg-surface border-r border-border shadow-card",
        "z-20",
        "aria-hidden:!when-not-expanded",
      )}
      aria-label="Main navigation sidebar"
    >
      {/* Collapse toggle button (shown on mobile + when collapsed on desktop) */}
      <button
        onClick={handleToggle}
        className={cn(
          "sm:hidden flex items-center justify-center rounded-control p-2 hover:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
          "aria-label",
          isExpanded ? "Collapse sidebar" : "Expand sidebar",
        )}
        aria-controls="sidebar"
        aria-expanded={isExpanded}
      >
        {isExpanded ? (
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="shrink-0"
          >
            <path d="M15 7l-5 5 5 5" />
          </svg>
        ) : (
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="shrink-0"
          >
            <path d="M12 19l-5-5 5-5" />
          </svg>
        )}
        <span className="sr-only">{isExpanded ? "Collapse sidebar" : "Expand sidebar"}</span>
      </button>

      {/* Expanded sidebar content */}
      <div className="flex flex-col h-full p-4 pt-2">
        <h2 className="text-section-title font-medium mb-3">
          Navigation
        </h2>

        <nav className="flex-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <div
              key={item.key}
              className={cn(
                "flex items-center gap-3 rounded-control px-2 py-2 mb-1 transition-colors duration-150",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                activeKey === item.key
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:text-primary",
                )
              }
              role="button"
              tabIndex={activeKey === item.key ? 0 : -1}
              onClick={() => window.location.href = item.href}
              aria-current={activeKey === item.key ? "page" : void 0}
            >
              <span className="w-2 h-2 rounded-full" />
              <span className="text-label font-medium">{item.label}</span>
            </div>
          ))}
        </nav>

        {/* Theme toggle at bottom of sidebar */}
        <div className="mt-auto pt-4 border-t border-border">
          <ThemeToggle className="w-full" />
        </div>
      </div>
    </aside>
  );
}