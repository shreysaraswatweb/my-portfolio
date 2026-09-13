import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "../theme/ThemeProvider";
import { AnimatedThemeToggler } from "../registry/magicui/animated-theme-toggler";

const options = [
  { id: "light", label: "Light", Icon: Sun },
  { id: "dark", label: "Dark", Icon: Moon },
  { id: "system", label: "System", Icon: Monitor },
];

export default function ThemeToggle({ compact = false, single = false }) {
  const { preference, setPreferenceWithTransition, setPreference } = useTheme();

  if (single) {
    return <AnimatedThemeToggler />;
  }

  const handleSelect = (e, id) => {
    if (setPreferenceWithTransition) {
      setPreferenceWithTransition(id, e.currentTarget);
    } else {
      setPreference(id);
    }
  };

  return (
    <div
      role="radiogroup"
      aria-label="Color theme"
      className={[
        "inline-flex rounded-full bg-surface-pill p-space-1",
        compact ? "w-full justify-between" : "",
      ].join(" ")}
    >
      {options.map(({ id, label, Icon }) => {
        const selected = preference === id;
        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={label}
            title={label}
            onClick={(e) => handleSelect(e, id)}
            className={[
              "inline-flex items-center justify-center gap-space-2 rounded-full px-space-3 py-space-2 text-caption transition-all duration-200 cursor-pointer",
              compact ? "flex-1" : "",
              selected
                ? "bg-surface-elevated text-text-primary shadow-card scale-[1.02]"
                : "hover-chip text-text-secondary hover:text-text-primary",
            ].join(" ")}
          >
            <Icon className="h-space-4 w-space-4" strokeWidth={1.75} />
            {compact ? null : <span>{label}</span>}
          </button>
        );
      })}
    </div>
  );
}

export { AnimatedThemeToggler };

