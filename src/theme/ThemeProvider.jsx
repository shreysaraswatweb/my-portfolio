import { createContext, useContext, useEffect, useMemo, useState } from "react";

export const THEME_STORAGE_KEY = "shrey-portfolio-theme";
export const THEME_OPTIONS = ["light", "dark", "system"];

function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function resolveTheme(preference) {
  if (preference === "light" || preference === "dark") return preference;
  if (typeof window === "undefined") return "dark";
  return getSystemTheme();
}

export function applyResolvedTheme(preference) {
  const resolved = resolveTheme(preference);
  const root = document.documentElement;
  root.dataset.theme = resolved;
  root.style.colorScheme = resolved;
}

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [preference, setPreferenceState] = useState(() => {
    if (typeof window === "undefined") return "system";
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return THEME_OPTIONS.includes(stored) ? stored : "system";
  });

  useEffect(() => {
    applyResolvedTheme(preference);
    window.localStorage.setItem(THEME_STORAGE_KEY, preference);

    if (preference !== "system") return undefined;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyResolvedTheme("system");
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [preference]);

  const value = useMemo(
    () => ({
      preference,
      resolved: resolveTheme(preference),
      setPreference: (next) => {
        if (!THEME_OPTIONS.includes(next)) return;
        setPreferenceState(next);
      },
    }),
    [preference],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
