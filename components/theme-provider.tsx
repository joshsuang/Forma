"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import type { ReactNode } from "react";
import {
  isThemePreference,
  THEME_STORAGE_KEY,
  type ThemePreference,
} from "@/lib/theme";

interface ThemeContextValue {
  /** The user's saved preference: "light", "dark", or "system". */
  theme: ThemePreference;
  setTheme: (theme: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/** Fired in this tab after a theme change; "storage" covers other tabs. */
const THEME_CHANGE_EVENT = "forma-theme-change";

/** In-memory mirror used when localStorage is unavailable (e.g. private mode). */
let memoryPreference: ThemePreference | null = null;

function subscribe(callback: () => void): () => void {
  const onStorage = () => {
    // A change from another tab wins over the in-memory value.
    memoryPreference = null;
    callback();
  };
  window.addEventListener(THEME_CHANGE_EVENT, callback);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(THEME_CHANGE_EVENT, callback);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot(): ThemePreference {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (isThemePreference(stored)) return stored;
  } catch {
    // Storage can be unavailable; fall through to the in-memory value.
  }
  return memoryPreference ?? "system";
}

function getServerSnapshot(): ThemePreference {
  return "system";
}

function applyTheme(preference: ThemePreference): void {
  const resolved =
    preference === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : preference;
  document.documentElement.dataset.theme = resolved;
}

export function ThemeProvider({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Keep the applied theme in sync with the preference and with system
  // changes while the preference is "system".
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => applyTheme(theme);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [theme]);

  const setTheme = useCallback((next: ThemePreference) => {
    memoryPreference = next;
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Storage may be unavailable; the in-memory value keeps the theme
      // working for the current session.
    }
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  }, []);

  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
