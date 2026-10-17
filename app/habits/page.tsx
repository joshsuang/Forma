"use client";
import { DEFAULT_CATEGORIES, DEFAULT_HABIT_CONFIGS, type Habit, type HabitType, type HabitSchedule, type HabitScheduleConfig } from "@/lib/types";
import { cn } from "@/lib/cn";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useState, useCallback, useEffect } from "react";
import { loadHabits, saveHabits, loadProgressRecords, saveProgressRecords } from "@/lib/persistence";

const SMALL_BREAKPOINT = 640;

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>(DEFAULT_HABIT_CONFIGS);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  // Use plain mutable types - no readonly/as const to avoid TS conflicts
  const [form, setForm] = useState<any>({
    name: "",
    description: "",
    category: "Health",
    type: "boolean" as HabitType,
    target: 1,
    unit: "sessions",
    schedule: "every-day",
    selectedWeekdays: [],
    weeklyTarget: 1,
    monthlyTarget: 1,
  });

  // Load from persistence repository on mount
  useEffect(() => {
    const loaded = loadHabits();
    setHabits(loaded);
  }, []);

  // Save to persistence repository on habit changes
  useEffect(() => {
    const saved = saveHabits(habits);
    // Optionally notify if save failed (e.g. storage full / private mode)
    if (!saved) {
      // In a full app, show a transient error banner; here we just log
      // eslint-disable-next-line no-console
      console.warn("Could not save habits to localStorage");
    }
  }, [habits]);

  const handleSave = useCallback((habit: Habit, prev: Habit[]) => {
    const index = habits.findIndex((h) => h.id === habit.id);
    if (index >= 0) {
      setHabits(prev.map((h) => (h.id === habit.id ? habit : h)));
    } else {
      setHabits([...prev, habit]);
    }
  }, [habits]);

  const openEdit = useCallback((habit: Habit) => {
    setEditingHabit(habit);
    setForm({
      name: habit.name,
      description: habit.description ?? "",
      category: habit.category,
      type: habit.habitType,
      target: habit.schedule.target,
      unit: habit.schedule.unit,
      schedule: habit.schedule.schedule,
      selectedWeekdays: habit.schedule.selectedWeekdays ?? [],
      weeklyTarget: habit.schedule.weeklyTarget ?? 1,
      monthlyTarget: habit.schedule.monthlyTarget ?? 1,
    });
  }, []);

  const closeEdit = useCallback(() => {
    setEditingHabit(null);
    setForm({
      name: "" as string,
      description: "" as string,
      category: "Health" as const,
      type: "boolean" as HabitType,
      target: 1,
      unit: "sessions",
      schedule: "every-day",
      selectedWeekdays: [] as const,
      weeklyTarget: 1,
      monthlyTarget: 1,
    });
  }, []);

  const onTypeChange = useCallback((type: HabitType) => {
    setForm((prev: any) => Object.assign({}, prev, { type }));
    // Adjust target/unit defaults per type
    const defaults: Record<HabitType, { target: number; unit: string }> = {
      boolean: { target: 1, unit: "completion" },
      numeric: { target: 2, unit: "liters" },
      duration: { target: 60, unit: "minutes" },
      counter: { target: 21, unit: "sessions" },
    };
    setForm((prev: any) => Object.assign({}, prev, { target: defaults[type].target, unit: defaults[type].unit }));
  }, []);

  const handleSubmit = useCallback(() => {
    if (!form.name.trim()) return;

    const newHabit: Habit = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      name: form.name as string,
      description: form.description as string,
      category: form.category as string,
      habitType: form.type,
      schedule: {
        habitType: form.type,
        target: form.target as number,
        unit: form.unit as string,
        schedule: form.schedule as HabitSchedule,
        selectedWeekdays: form.selectedWeekdays as ("monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday")[],
        weeklyTarget: form.weeklyTarget as number,
        monthlyTarget: form.monthlyTarget as number,
      },
      progress: {
        id: `${Date.now()}-progress`,
        habitId: `${Date.now()}-id`,
        state: "incomplete",
        value: 0 as number,
        recordedAt: new Date().toISOString().split("T")[0],
      },
      creationDate: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };
    setHabits((prev: Habit[]) => [...prev, newHabit]);
    setEditingHabit(null);
    setForm({
      name: "" as string,
      description: "" as string,
      category: "Health" as const,
      type: "boolean" as HabitType,
      target: 1,
      unit: "sessions",
      schedule: "every-day",
      selectedWeekdays: [] as const,
      weeklyTarget: 1,
      monthlyTarget: 1,
    });
  }, []);

  return (
    <main className="p-4 sm:p-6">
      <h1 className="text-2xl font-medium mb-4">Habits</h1>

      {/* Creation form */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Habit</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div>
              <Label htmlFor="habit-name">Name</Label>
              <Input
                id="habit-name"
                value={form.name}
                onChange={(e) =>
                  setForm((prev: any) => ({ ...prev, name: e.target.value }))
                }
                required
                placeholder="e.g. Read, Meditate, Drink water"
              />
            </div>

            <div>
              <Label htmlFor="habit-type">Type</Label>
              <select
                id="habit-type"
                value={form.type}
                onChange={(e) => onTypeChange(e.target.value as HabitType)}
                className={cn("rounded-control border border-border bg-surface text-body focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-range")}
              >
                <option value="boolean">Boolean (yes/no)</option>
                <option value="numeric">Numerical (quantity)</option>
                <option value="duration">Duration (time)</option>
                <option value="counter">Counter (occurrences)</option>
              </select>
            </div>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">

            <div>
              <Label htmlFor="habit-category">Category</Label>
              <select
                id="habit-category"
                value={form.category}
                onChange={(e) => setForm((prev: any) => ({ ...prev, category: e.target.value }))}
                className={cn("rounded-control border border-border bg-surface text-body focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-range")}
              >
                <option value="Health">Health</option>
                <option value="Fitness">Fitness</option>
                <option value="School">School</option>
                <option value="Productivity">Productivity</option>
                <option value="Personal">Personal</option>
                {DEFAULT_CATEGORIES.map((cat) => {
                  if (cat !== "Health" && cat !== "Fitness" && cat !== "School" && cat !== "Productivity" && cat !== "Personal") {
                    return <option key={cat} value={cat}>{cat}</option>;
                  }
                  return null;
                })}
              </select>
            </div>

            <div>
              <Label htmlFor="habit-target">Target</Label>
              <Input
                id="habit-target"
                type="number"
                min="1"
                value={form.target}
                onChange={(e) =>
                  setForm((prev: any) => ({ ...prev, target: Number(e.target.value) }))
                }
                className={cn("rounded-control border border-border bg-surface text-body focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-range")}
              />
            </div>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">

            <div>
              <Label htmlFor="habit-unit">Unit</Label>
              <Input
                id="habit-unit"
                value={form.unit}
                onChange={(e) =>
                  setForm((prev: any) => ({ ...prev, unit: e.target.value }))
                }
                className={cn("rounded-control border border-border bg-surface text-body focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-range")}
                placeholder="e.g. book, liters, minutes, reps"
              />
            </div>

            <div>
              <Label htmlFor="habit-schedule">Schedule</Label>
              <select
                id="habit-schedule"
                value={form.schedule}
                onChange={(e) =>
                  setForm((prev: any) => ({ ...prev, schedule: e.target.value }))
                }
                className={cn("rounded-control border border-border bg-surface text-body focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-range")}
              >
                <option value="every-day">Every day</option>
                <option value="selected-weekdays">Selected weekdays</option>
                <option value="weekly-target">Weekly target</option>
                <option value="monthly-target">Monthly target</option>
                <option value="custom-interval">Custom interval</option>
              </select>
            </div>

            {form.schedule === "selected-weekdays" && (
              <div>
                <Label>Weekdays</Label>
                <select
                  multiple
                  size={5}
                  value={form.selectedWeekdays}
                  onChange={(e) =>
                    setForm((prev: any) => ({
                      ...prev,
                      selectedWeekdays: Array.from(e.target.selectedOptions).map(
                        (o) => o.value
                      ),
                    }))
                  }
                  className={cn("rounded-control border border-border bg-surface text-body w-full focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-range")}
                >
                  <option value="monday">Monday</option>
                  <option value="tuesday">Tuesday</option>
                  <option value="wednesday">Wednesday</option>
                  <option value="thursday">Thursday</option>
                  <option value="friday">Friday</option>
                  <option value="saturday">Saturday</option>
                  <option value="sunday">Sunday</option>
                </select>
              </div>
            )}

            {form.schedule === "weekly-target" && (
              <div>
                <Label>Weekly target</Label>
                <Input
                  type="number"
                  min="1"
                  value={form.weeklyTarget}
                  onChange={(e) =>
                    setForm((prev: any) => ({ ...prev, weeklyTarget: Number(e.target.value) }))
                  }
                  className={cn("rounded-control border border-border bg-surface text-body focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-range")}
                />
              </div>
            )}

            {form.schedule === "monthly-target" && (
              <div>
                <Label>Monthly target</Label>
                <Input
                  type="number"
                  min="1"
                  value={form.monthlyTarget}
                  onChange={(e) =>
                    setForm((prev: any) => ({ ...prev, monthlyTarget: Number(e.target.value) }))
                  }
                  className={cn("rounded-control border border-border bg-surface text-body focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-range")}
                />
              </div>
            )}

          </div>

          <div className="mt-6">
            <Button onClick={handleSubmit} className="w-full">
              {editingHabit ? "Update Habit" : "Create Habit"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Existing habits list */}
      <Card mt-6>
        <CardHeader>
          <CardTitle>Your Habits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">

            {habits.map((habit) => (
              <div key={habit.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-body font-medium">{habit.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {habit.category}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEdit(habit)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setHabits((prev: Habit[]) => prev.filter((h: Habit) => h.id !== habit.id))}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}

            {habits.length === 0 && (
              <p className="text-muted-foreground text-sm">
                No habits yet. Create one above.
              </p>
            )}

          </div>
        </CardContent>
      </Card>

      {/* Edit form overlay */}
      {editingHabit && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
        >
          <Card className="max-w-md w-full p-6">
            <CardHeader>
              <CardTitle>Edit Habit</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Editing: {editingHabit.name}
              </p>
              <Button
                variant="secondary"
                onClick={closeEdit}
                className="w-full mb-2"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  const updated = {
                    ...editingHabit,
                    name: form.name,
                    description: form.description,
                    category: form.category,
                    habitType: form.type,
                    schedule: {
                      ...editingHabit.schedule,
                      target: form.target,
                      unit: form.unit,
                      schedule: form.schedule,
                      selectedWeekdays: form.selectedWeekdays,
                      weeklyTarget: form.weeklyTarget,
                      monthlyTarget: form.monthlyTarget,
                    },
                    lastUpdated: new Date().toISOString(),
                  };
                  setHabits((prev: any) =>
                    prev.map((h: Habit) => (h.id === editingHabit.id ? updated : h)),
                  );
                  closeEdit();
                }}
              >
                Save
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  );
}