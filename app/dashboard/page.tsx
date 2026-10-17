"use client";

import { useState, useEffect } from "react";
import { Shell } from "@/app/shell";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/cn";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loadHabits, saveHabits, loadProgressRecords, saveProgressRecords } from "@/lib/persistence";
import type { Habit } from "@/lib/types";

const DEFAULT_HABIT_CONFIGS: Habit[] = [
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
      selectedWeekdays: [],
      weeklyTarget: 1,
      monthlyTarget: 1,
    },
    progress: {
      id: "1-progress",
      habitId: "1-id",
      state: "incomplete",
      value: 0,
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
      selectedWeekdays: [],
      weeklyTarget: 1,
      monthlyTarget: 1,
    },
    progress: {
      id: "2-progress",
      habitId: "2-id",
      state: "incomplete",
      value: 0,
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
      selectedWeekdays: [],
      weeklyTarget: 1,
      monthlyTarget: 1,
    },
    progress: {
      id: "3-progress",
      habitId: "3-id",
      state: "incomplete",
      value: 0,
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
      selectedWeekdays: [],
      weeklyTarget: 1,
      monthlyTarget: 1,
    },
    progress: {
      id: "4-progress",
      habitId: "4-id",
      state: "incomplete",
      value: 0,
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
      selectedWeekdays: [],
      weeklyTarget: 1,
      monthlyTarget: 1,
    },
    progress: {
      id: "5-progress",
      habitId: "5-id",
      state: "incomplete",
      value: 0,
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
      selectedWeekdays: [],
      weeklyTarget: 1,
      monthlyTarget: 1,
    },
    progress: {
      id: "6-progress",
      habitId: "6-id",
      state: "incomplete",
      value: 0,
      recordedAt: new Date().toISOString().split("T")[0],
    },
    creationDate: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
  },
];

const HEATMAP_INTENSITIES = Array.from({ length: 365 }, (_, i) => i % 2 === 0 ? "full" : "partial");
const HEATMAP_DATA = Array.from({ length: 365 }, (_, i) => ({
  date: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
  completed: i % 3 !== 0,
}));

// MinimalDashboard receives habits as prop
function MinimalDashboard({ habits }: { habits: Habit[] }) {
  const completed = habits.filter((h) => h.progress.state === "completed").length;
  const total = habits.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <section className="space-y-6">
      <Card className="p-4">
        <CardHeader>
          <CardTitle>Todays progress</CardTitle>
        </CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-stat">{completed} of {total} habits</p>
            <p className="text-caption text-muted-foreground">
              Completed today
            </p>
          </div>
          <div>
            <p className="text-3xl font-medium text-success">{percentage}%</p>
            <p className="text-caption text-muted-foreground">
              completion
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {habits.map((habit) => (
          <Card key={habit.id} className="p-4">
            <CardHeader>
              <CardTitle className="text-sm">{habit.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-body text-muted-foreground">{habit.category}</p>
              {habit.habitType === "boolean" && (
                <div className="mt-2 flex items-center gap-2">
                  <span
                    className={cn("h-4 w-4 rounded-full", habit.progress.state === "completed" ? "bg-success" : "bg-surface-subtle")}
                  />
                  <span className="text-body text-primary">
                    {habit.progress.state === "completed" ? "Completed" : "Incomplete"}
                  </span>
                </div>
              )}
              {habit.habitType === "numeric" && (
                <div className="mt-2">
                  <p className="text-xs text-muted-foreground">
                    {habit.progress.value}/{habit.schedule.target} {habit.schedule.unit}
                  </p>
                  <p className="text-xs">
                    Progress{" ".repeat(Math.round((habit.progress.value / habit.schedule.target) * 10))}{"▇".repeat(
                      Math.round((habit.progress.value / habit.schedule.target) * 10)
                    )}
                  </p>
                </div>
              )}
              {habit.habitType === "counter" && (
                <div className="mt-2">
                  <p className="text-xs text-muted-foreground">
                    {habit.progress.value}/{habit.schedule.target} {habit.schedule.unit}
                  </p>
                </div>
              )}
              {habit.habitType === "duration" && (
                <div className="mt-2">
                  <p className="text-xs text-muted-foreground">
                    {Math.round(habit.progress.value)}/{habit.schedule.target} {habit.schedule.unit}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

// StatisticsDashboard receives habits as prop
function StatisticsDashboard({ habits }: { habits: Habit[] }) {
  const completed = habits.filter((h) => h.progress.state === "completed").length;
  const total = habits.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const avgStreak = total > 0 ? Math.round(habits.reduce((sum, h) => sum + (h.schedule.weeklyTarget || 0), 0) / total) : 0;

  return (
    <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Completion</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-2">
          <p className="text-3xl font-medium text-stat">{percentage}%</p>
          <p className="text-caption text-muted-foreground">of habits completed</p>
          <div className="w-24 h-0.5 bg-surface-subtle rounded-full overflow-hidden">
            <div className="h-full bg-success rounded-full" style={{ width: `${percentage}%` }} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current streak</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-medium">{avgStreak}</p>
          <p className="text-caption text-muted-foreground">average per habit</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total habits</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-medium">{total}</p>
          <p className="text-caption text-muted-foreground">active habits</p>
        </CardContent>
      </Card>

      <Card className="mt-6 grid grid-cols-7 gap-1">
        <CardHeader>
          <CardTitle>Heatmap</CardTitle>
        </CardHeader>
        <CardContent>
          {HEATMAP_INTENSITIES.slice(0, 30).reverse().map((intensity, i) => {
            const colorClass = intensity === "full" ? "bg-success" : "bg-success-subtle";
            return (
              <div
                key={i}
                className={`w-2 h-2 rounded-sm ${colorClass} ${intensity === "full" ? "opacity-100" : "opacity-50"}`}
              />
            );
          })}
          <div className="mt-2 text-caption text-muted-foreground">
            {HEATMAP_DATA.slice(0, 30).reverse().length} days
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

export default function DashboardPage() {
  const [habits, setHabits] = useState<Habit[]>(loadHabits());
  const [progressRecords, setProgressRecords] = useState<import("@/lib/types").DailyProgress[]>(loadProgressRecords());
  const [layout, setLayout] = useState<"minimal" | "statistics">("minimal");

  useEffect(() => {
    const saved = saveHabits(habits);
    if (!saved) {
      console.warn("Could not save habits to localStorage");
    }
  }, [habits]);

  useEffect(() => {
    const saved = saveProgressRecords(progressRecords);
    if (!saved) {
      console.warn("Could not save progress records to localStorage");
    }
  }, [progressRecords]);

  return (
    <Shell>
      <ThemeToggle className="sm:hidden" />

      <main className="px-4 py-6">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-medium tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              A calm place to track habits and understand progress.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              className="rounded-control border border-border px-3 py-2 text-body focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              onChange={(e) => setLayout(e.target.value as "minimal" | "statistics")}
            >
              <option value="minimal">Minimal</option>
              <option value="statistics">Statistics</option>
            </select>
            <span className="text-caption text-muted-foreground">
              Layout
            </span>
          </div>
        </header>

        {layout === "minimal" ? <MinimalDashboard habits={habits} /> : <StatisticsDashboard habits={habits} />}

        <footer className="mt-8 pt-6 border-t border-border">
          <p className="text-caption text-muted-foreground">
            Data is demo information for visual reference only.
          </p>
        </footer>
      </main>
    </Shell>
  );
}