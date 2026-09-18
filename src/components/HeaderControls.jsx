import DigitalClock from "./DigitalClock";
import ActionSearchBar from "./ui/action-search-bar";
import MoodSunToggle from "./MoodSunToggle";
import ThemeDropdown from "./ThemeDropdown";

/**
 * HeaderControls:
 * Unified capsule grouping Search, Mood/Sun theme toggle, and Theme dropdown.
 * On mobile (< md), it integrates the Digital Clock directly inside the capsule in the center!
 */
export default function HeaderControls({ className = "" }) {
  return (
    <div
      className={`inline-flex max-w-full items-center gap-1 rounded-lg border border-border-hairline bg-surface-pill/80 p-1 backdrop-blur-md shadow-card ${className}`}
    >
      {/* 1. Integrated Digital Clock on all mobile & responsive tablet viewports (< 1024px) */}
      <div className="flex desktop:hidden lg:hidden items-center pl-1.5 pr-0.5">
        <DigitalClock embedded />
      </div>

      {/* Hairline Separator Divider (visible on mobile/tablet between Clock and Search) */}
      <div
        className="flex desktop:hidden lg:hidden h-4 w-[1px] bg-border-hairline shrink-0 mx-0.5"
        aria-hidden="true"
      />

      {/* 2. Action Search Bar (Kokonut UI) */}
      <ActionSearchBar />

      {/* 3. Hairline Separator Divider */}
      <div
        className="h-4 w-[1px] bg-border-hairline shrink-0"
        aria-hidden="true"
      />

      {/* 4. Mood + Sun Single Toggle */}
      <MoodSunToggle />

      {/* 5. Theme Dropdown */}
      <ThemeDropdown />
    </div>
  );
}
