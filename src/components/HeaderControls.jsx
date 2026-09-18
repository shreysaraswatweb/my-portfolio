import ActionSearchBar from "./ui/action-search-bar";
import MoodSunToggle from "./MoodSunToggle";
import ThemeDropdown from "./ThemeDropdown";

/**
 * HeaderControls:
 * Unified capsule grouping the Search bar, Mood/Sun theme toggle, and Theme dropdown.
 * Reduced border-radius from rounded-full to rounded-lg for a sharper, design-matched look.
 */
export default function HeaderControls({ className = "" }) {
  return (
    <div
      className={`inline-flex max-w-full items-center gap-1 rounded-lg border border-border-hairline bg-surface-pill/80 p-1 backdrop-blur-md shadow-card ${className}`}
    >
      {/* 1. Action Search Bar (Kokonut UI) */}
      <ActionSearchBar />

      {/* 2. Hairline Separator Divider */}
      <div
        className="h-4 w-[1px] bg-border-hairline shrink-0"
        aria-hidden="true"
      />

      {/* 3. Mood + Sun Single Toggle */}
      <MoodSunToggle />

      {/* 4. Theme Dropdown */}
      <ThemeDropdown />
    </div>
  );
}
