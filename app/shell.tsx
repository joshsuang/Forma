"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/cn";
import { Sidebar } from "@/components/sidebar";
import { BottomNav } from "@/components/bottom-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { type ReactNode } from "react";

const SMALL_BREAKPOINT = 640; // tailwind sm

export interface ShellProps {
  children: ReactNode;
}

export function Shell({ children }: ShellProps) {
  // Initialize expanded from saved preference
  const storedExpanded = typeof window !== "undefined" ? localStorage.getItem("forma-sidebar-expanded") : null;
  const [expanded, setExpanded] = useState(storedExpanded !== null ? storedExpanded === "true" : true);
  const [theme, setTheme] = useState<string>("light");

  useEffect(() => {
    // Persist sidebar preference on every change
    try {
      window.localStorage.setItem("forma-sidebar-expanded", String(expanded));
    } catch {
      // Storage may be unavailable
    }
  }, [expanded]);

  useEffect(() => {
    // Sync theme from localStorage when available
    const html = document.documentElement;
    const storedTheme = localStorage.getItem("forma-theme");
    if (storedTheme) {
      html.dataset.theme = storedTheme;
    }
    // Observe system preference changes
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => {
      const theme = localStorage.getItem("forma-theme") || (mq.matches ? "dark" : "light");
      html.dataset.theme = theme;
    };
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const handleSidebarToggle = useCallback(
    (prev: boolean) => {
      try {
        window.localStorage.setItem("forma-sidebar-expanded", String(!prev));
      } catch {
        // Storage may be unavailable
      }
      return !prev;
    },
    []
  );

  const isSmallScreen = typeof window !== "undefined" && window.innerWidth < SMALL_BREAKPOINT;

  return (
    <div className="relative min-h-dvh">
      {/* Desktop sidebar (hidden on mobile, shown on larger screens) */}
      <Sidebar
        expanded={expanded}
        onToggle={handleSidebarToggle}
        activeKey={typeof window !== "undefined" ? window.location.pathname : "/"}
      />

      {/* Main content area */}
      <main
        className={cn(
          "ml-64 sm:ml-0 transition-transform duration-300 ease-out",
          isSmallScreen || !expanded ? "ml-0" : "",
          "min-h-dvh px-4 py-6",
        )}
        aria-label="Main content"
      >
        {children}
      </main>

      {/* Mobile bottom navigation (shown only on small screens) */}
      <BottomNav
        activeKey={typeof window !== "undefined" ? window.location.pathname : "/"}
        onSelect={(key) => {
          // When selecting from bottom nav, collapse sidebar if open
          setExpanded(false);
          window.location.assign(key);
        }}
      >
        {/* Theme toggle is inside the sidebar on desktop, shown here on mobile too */}
        <ThemeToggle className="hidden sm:block" />
      </BottomNav>
    </div>
  );
}