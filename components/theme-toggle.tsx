"use client";

import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/cn";
import { THEME_OPTIONS } from "@/lib/theme";

/** Segmented control for switching between light, system, and dark themes. */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <div
      role="group"
      aria-label="Theme preference"
      className={cn(
        "inline-flex items-center gap-1 rounded-control border border-border bg-surface-subtle p-1",
        className,
      )}
    >
      {THEME_OPTIONS.map((option) => {
        const active = theme === option.value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => setTheme(option.value)}
            className={cn(
              "h-7 rounded-[calc(var(--radius-control)-0.25rem)] px-3 text-label transition-colors duration-150",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              active
                ? "bg-surface text-foreground shadow-card"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
