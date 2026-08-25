import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "../theme/ThemeProvider";

const options = [
  { id: "light", label: "Light", Icon: Sun },
  { id: "dark", label: "Dark", Icon: Moon },
  { id: "system", label: "System", Icon: Monitor },
];

export default function ThemeToggle({ compact = false }) {
  const { preference, setPreference } = useTheme();

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
            onClick={() => setPreference(id)}
            className={[
              "inline-flex items-center justify-center gap-space-2 rounded-full px-space-3 py-space-2 text-caption transition-colors",
              compact ? "flex-1" : "",
              selected
                ? "bg-surface-elevated text-text-primary shadow-card"
                : "text-text-secondary hover:text-text-primary",
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
