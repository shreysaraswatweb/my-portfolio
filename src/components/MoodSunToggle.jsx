import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../theme/ThemeProvider";
import Tooltip from "./ui/Tooltip";

/**
 * MoodSunToggle:
 * A single icon button that morphs between Sun (light) and Moon (dark).
 * Uses AnimatePresence for a smooth crossfade + rotation transition.
 */
export default function MoodSunToggle({ className = "" }) {
  const { resolved, toggleThemeWithTransition, setPreferenceWithTransition } =
    useTheme();

  const isDark = resolved === "dark";

  const handleToggle = (e) => {
    if (toggleThemeWithTransition) {
      toggleThemeWithTransition(e);
    } else if (setPreferenceWithTransition) {
      setPreferenceWithTransition(isDark ? "light" : "dark", e);
    }
  };

  const tooltipLabel = isDark
    ? "Switch to light theme"
    : "Switch to dark theme";

  return (
    <Tooltip content={tooltipLabel} side="bottom">
      <button
        type="button"
        role="switch"
        aria-checked={isDark}
        aria-label={tooltipLabel}
        onClick={handleToggle}
        className={`group relative flex h-7 w-7 items-center justify-center rounded-md text-text-secondary transition-colors duration-200 hover:bg-surface-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent-primary cursor-pointer select-none ${className}`}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.span
              key="moon"
              className="flex items-center justify-center"
              initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 22,
                mass: 0.8,
              }}
            >
              <Moon
                className="h-4 w-4 text-amber-400"
                strokeWidth={1.8}
              />
            </motion.span>
          ) : (
            <motion.span
              key="sun"
              className="flex items-center justify-center"
              initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 22,
                mass: 0.8,
              }}
            >
              <Sun
                className="h-4 w-4 text-amber-500"
                strokeWidth={1.8}
              />
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </Tooltip>
  );
}
