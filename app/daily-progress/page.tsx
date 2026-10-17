"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/cn";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { loadHabits, saveHabits, loadProgressRecords, saveProgressRecords } from "@/lib/persistence";
import type { Habit, DailyProgress, HabitCompletionState } from "@/lib/types";

const TODAY = new Date().toISOString().split("T")[0];

export default function DailyProgressPage() {
  const [habits, setHabits] = useState<Habit[]>(loadHabits());
  const [progressRecords, setProgressRecords] = useState<DailyProgress[]>(loadProgressRecords());

  // Form state: keys are habit IDs, values have state, value, and notes
  const [form, setForm] = useState<Record<string, { state: HabitCompletionState; value: number; notes: string }>>({});

  useEffect(() => {
    // Persist habits to localStorage on changes
    saveHabits(habits);
  }, [habits]);

  useEffect(() => {
    // Persist progress records to localStorage on changes
    saveProgressRecords(progressRecords);
  }, [progressRecords]);

  // Initialize form with all habits set to incomplete with value 0
  useEffect(() => {
    const initialized: Record<string, { state: HabitCompletionState; value: number; notes: string }> = {};
    habits.forEach((habit) => {
      initialized[habit.id] = {
        state: "incomplete" as const,
        value: 0,
        notes: "",
      };
    });
    setForm(initialized);
  }, [habits]);

  const handleSave = () => {
    const newRecords: DailyProgress[] = habits.map((habit) => ({
      id: `${habit.id}-${TODAY}`,
      habitId: habit.id,
      state: form[habit.id]?.state ?? "incomplete" as HabitCompletionState,
      value: form[habit.id]?.value ?? 0,
      recordedAt: TODAY,
      notes: form[habit.id]?.notes ?? "",
    }));

    // Replace today's records for these habits, keep other days
    setProgressRecords(
      (prevRecords) => {
        const existingToday = prevRecords.filter((pr) => pr.recordedAt !== TODAY);
        const merged = [...existingToday, ...newRecords];
        // Deduplicate: if multiple records for same habit+day, keep the latest
        const deduped: DailyProgress[] = [];
        const seen = new Set<string>();
        for (const record of merged) {
          const key = `${record.habitId}-${record.recordedAt}`;
          if (!seen.has(key)) {
            seen.add(key);
            deduped.push(record);
          }
        }
        return deduped;
      }
    );
  };

  return (
    <main className="p-4 sm:p-6">
      <h1 className="text-2xl font-medium mb-4">Daily Progress</h1>

      <Card>
        <CardHeader>
          <CardTitle>Record Progress for {TODAY}</CardTitle>
        </CardHeader>
        <CardContent>
          {habits.map((habit) => (
            <div key={habit.id} className="space-y-3 pt-3 border-t">
              <div className="flex items-center justify-between">
                <span className="text-body font-medium">{habit.name}</span>
                <span className="text-xs text-muted-foreground">{habit.category}</span>
              </div>

              {habit.habitType === "boolean" && (
                <div className="flex items-center gap-2">
                  <Label>
                    <input
                      type="radio"
                      name={`progress-${habit.id}`}
                      value="incomplete"
                      checked={form[habit.id]?.state === "incomplete"}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          [habit.id]: {
                            state: "incomplete" as const,
                            value: form[habit.id]?.value ?? 0,
                            notes: form[habit.id]?.notes ?? "",
                          },
                        })
                      }
                    />{" "}
                    Incomplete
                  </Label>
                  <Label>
                    <input
                      type="radio"
                      name={`progress-${habit.id}`}
                      value="partial"
                      checked={form[habit.id]?.state === "partial"}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          [habit.id]: {
                            state: "partial" as const,
                            value: form[habit.id]?.value ?? 0,
                            notes: form[habit.id]?.notes ?? "",
                          },
                        })
                      }
                    />{" "}
                    Partial
                  </Label>
                  <Label>
                    <input
                      type="radio"
                      name={`progress-${habit.id}`}
                      value="completed"
                      checked={form[habit.id]?.state === "completed"}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          [habit.id]: {
                            state: "completed" as const,
                            value: form[habit.id]?.value ?? 0,
                            notes: form[habit.id]?.notes ?? "",
                          },
                        })
                      }
                    />{" "}
                    Completed
                  </Label>
                </div>
              )}

              {habit.habitType === "numeric" && (
                <div className="mt-2">
                  <Label htmlFor={`numeric-${habit.id}`}>
                    Value
                  </Label>
                  <Input
                    id={`numeric-${habit.id}`}
                    type="number"
                    min={0}
                    value={form[habit.id]?.value ?? 0}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        [habit.id]: {
                          state: form[habit.id]?.state ?? "incomplete" as HabitCompletionState,
                          value: Number(e.target.value),
                          notes: form[habit.id]?.notes ?? "",
                        },
                      })
                    }
                    className="w-20"
                    placeholder="e.g. 2.5"
                  />
                  <Label className="text-xs text-muted-foreground ml-2">
                    {habit.schedule.unit}
                  </Label>
                </div>
              )}

              {habit.habitType === "counter" && (
                <div className="mt-2">
                  <Label htmlFor={`counter-${habit.id}`}>
                    Count
                  </Label>
                  <Input
                    id={`counter-${habit.id}`}
                    type="number"
                    min={0}
                    value={form[habit.id]?.value ?? 0}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        [habit.id]: {
                          state: form[habit.id]?.state ?? "incomplete" as HabitCompletionState,
                          value: Number(e.target.value),
                          notes: form[habit.id]?.notes ?? "",
                        },
                      })
                    }
                    className="w-20"
                  />
                </div>
              )}

              {habit.habitType === "duration" && (
                <div className="mt-2">
                  <Label htmlFor={`duration-${habit.id}`}>
                    Minutes
                  </Label>
                  <Input
                    id={`duration-${habit.id}`}
                    type="number"
                    min={0}
                    value={form[habit.id]?.value ?? 0}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        [habit.id]: {
                          state: form[habit.id]?.state ?? "incomplete" as HabitCompletionState,
                          value: Number(e.target.value),
                          notes: form[habit.id]?.notes ?? "",
                        },
                      })
                    }
                    className="w-20"
                    placeholder="e.g. 30"
                  />
                  <Label className="text-xs text-muted-foreground ml-2">
                    min
                  </Label>
                </div>
              )}

              <p className="text-xs text-muted-foreground mt-2">
                Notes:{" "}{" "}
                <Input
                  disabled
                  value={form[habit.id]?.notes ?? ""}
                  className="w-full rounded-control border border-border bg-surface p-1 text-muted-foreground text-xs"
                />
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="mt-6">
        <Button
          onClick={handleSave}
          className="w-full"
          disabled={habits.every(
            (h) => form[h.id]?.state === "incomplete" && form[h.id]?.value === 0
          )}
        >
          Save Progress
        </Button>
      </div>
    </main>
  );
}