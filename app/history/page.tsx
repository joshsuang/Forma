"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/cn";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { loadHabits, saveHabits, loadProgressRecords, saveProgressRecords } from "@/lib/persistence";
import type { Habit, DailyProgress, HabitCompletionState } from "@/lib/types";

const TODAY = new Date().toISOString().split("T")[0];

export default function HistoryPage() {
  const [habits, setHabits] = useState<Habit[]>(loadHabits());
  const [progressRecords, setProgressRecords] = useState<DailyProgress[]>(loadProgressRecords());
  const [selectedDate, setSelectedDate] = useState<string>(TODAY);
  const [form, setForm] = useState<Record<string, { state: HabitCompletionState; value: number; notes: string }>>({});

  useEffect(() => {
    saveHabits(habits);
  }, [habits]);

  useEffect(() => {
    saveProgressRecords(progressRecords);
  }, [progressRecords]);

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setForm({});
  };

  const dateRecords = progressRecords.filter(
    (pr) => pr.recordedAt === selectedDate
  );

  const availableDates = progressRecords
    .filter((pr) => pr.recordedAt !== TODAY)
    .map((pr) => pr.recordedAt)
    .reverse()
    .sort()
    .slice(0, 30);

  const handleSave = () => {
    const newRecords: DailyProgress[] = habits.map((habit) => ({
      id: `${habit.id}-${selectedDate}`,
      habitId: habit.id,
      state: form[habit.id]?.state ?? "incomplete" as HabitCompletionState,
      value: form[habit.id]?.value ?? 0,
      recordedAt: selectedDate,
      notes: form[habit.id]?.notes ?? "",
    }));

    setProgressRecords(
      (prevRecords) => {
        const existingOtherDays = prevRecords.filter(
          (pr) => pr.recordedAt !== selectedDate
        );
        const merged = [...existingOtherDays, ...newRecords];
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
      <h1 className="text-2xl font-medium mb-4">Historical Tracking</h1>

      <div className="rounded-card border border-bg bg-card text-card-foreground p-4 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <label className="select select-sm select-bordered">
            <select
              onChange={(e) => handleDateChange(e.target.value)}
              defaultValue={TODAY}
              className="select-normal"
            >
              <option value={TODAY}>Today</option>
              {availableDates.map((date) => (
                <option key={date} value={date}>{date}</option>
              ))}
            </select>
          </label>
          <span className="text-sm text-muted-foreground">
            Select date to view historical records
          </span>
        </div>
      </div>

      {selectedDate !== TODAY && progressRecords.some((pr) => pr.recordedAt === selectedDate) && (
        <div className="rounded-card border bg-card p-4 mb-4">
          <p className="text-sm text-muted-foreground">
            Records for {selectedDate}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {dateRecords.map((record) => {
              const habit = habits.find((h) => h.id === record.habitId);
              if (!habit) return null;
              return (
                <div key={record.id} className="p-3 rounded-card border bg-card">
                  <p className="text-body text-xs uppercase tracking-wider">{habit.name}</p>
                  <p className="text-xs text-muted-foreground">{habit.category}</p>
                  {habit.habitType === "boolean" && (
                    <div className="mt-2 flex items-center gap-2">
                      <span
                        className={cn(
                          "h-3 w-3 rounded-full",
                          record.state === "completed" ? "bg-success" : "bg-surface-subtle"
                        )}
                      />
                      <span className="text-xs text-primary">
                        {record.state === "completed" ? "Completed" : record.state}
                      </span>
                    </div>
                  )}
                  {habit.habitType === "numeric" && (
                    <div className="mt-2">
                      <p className="text-xs text-muted-foreground">
                        {record.value}/{habit.schedule.target} {habit.schedule.unit}
                      </p>
                    </div>
                  )}
                  {habit.habitType === "counter" && (
                    <div className="mt-2">
                      <p className="text-xs text-muted-foreground">
                        {record.value}/{habit.schedule.target} {habit.schedule.unit}
                      </p>
                    </div>
                  )}
                  {habit.habitType === "duration" && (
                    <div className="mt-2">
                      <p className="text-xs text-muted-foreground">
                        {Math.round(record.value)}/{habit.schedule.target} {habit.schedule.unit}
                      </p>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    Notes:{" "}{" "}
                    <Input
                      disabled
                      value={record.notes ?? ""}
                      className="w-full rounded-control border bg-surface p-1 text-xs text-muted-foreground"
                    />
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {selectedDate === TODAY || dateRecords.length > 0 ? (
        <div className="mt-4">
          <Button
            onClick={handleSave}
            className="w-full"
            disabled={
              Object.values(form).every(
                (f) => f.state === "incomplete" && f.value === 0
              )
            }
          >
            Save Progress for {selectedDate}
          </Button>
        </div>
      ) : (
        <div className="mt-4">
          <Button className="w-full" disabled>
            Save Progress for {selectedDate}
          </Button>
        </div>
      )}
    </main>
  );
}