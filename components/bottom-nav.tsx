"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import { type ReactNode } from "react";

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", href: "/" },
  { key: "habits", label: "Habits", href: "/habits" },
  { key: "statistics", label: "Statistics", href: "/statistics" },
  { key: "settings", label: "Settings", href: "/settings" },
];

const SMALL_BREAKPOINT = 640; // tailwind sm

export interface BottomNavProps {
  /** Currently active section */
  activeKey?: string;
  /** Called when user changes selection */
  onSelect?: (key: string) => void;
  children?: ReactNode;
}

export function BottomNav({
  activeKey = "/",
  onSelect,
  children,
}: BottomNavProps) {
  const [isSmall, setIsSmall] = useState(typeof window !== "undefined");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handler = () => setIsSmall(window.innerWidth < SMALL_BREAKPOINT);
    handler();
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const handleSelect = (key: string) => {
    window.location.assign(key);
    onSelect?.(key);
  };

  if (!isSmall) return children ?? null;

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 bg-surface border-t border-border shadow-card px-4 py-2.5 z-30",
        "flex items-center justify-around",
        "rounded-t-2xl",
        "aria-label:Main navigation",
      )}
    >
      {NAV_ITEMS.map((item) => {
        const isActive = item.href === activeKey;
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => handleSelect(item.href)}
            className={cn(
              "flex flex-col items-center gap-1 rounded-control px-2 py-1.5 text-label transition-colors duration-150",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              isActive
                ? "text-primary bg-surface-subtle"
                : "text-muted-foreground hover:text-primary",
              "data-[state=focus]:bg-surface-subtle",
              "data-[state=hover]:bg-surface-subtle",
            )}
            aria-current={isActive ? "page" : void 0}
            title={item.label}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="shrink-0"
            >
              <path d="M3 3h12v12H3V3zm6 6v6h4v-6H9z" />
            </svg>
            <span className="sr-only">{item.label}</span>
            <p className="text-caption text-center">{item.label}</p>
          </button>
        );
      })}
    </nav>
  );
}