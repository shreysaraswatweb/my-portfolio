import { Menu } from "lucide-react";
import { profile } from "../data/profile";

export default function TopBar({ onMenu }) {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border-hairline bg-sidebar/90 px-space-4 py-space-3 backdrop-blur-glass">
      <div className="flex items-center gap-space-3">
        <span className="flex h-space-10 w-space-10 items-center justify-center rounded-md bg-accent-gradient font-display text-body-lg text-text-fixed-light">
          {profile.initials}
        </span>
        <div>
          <p className="text-body font-medium text-text-primary">
            {profile.displayName}
          </p>
          <p className="text-caption text-text-secondary">{profile.role}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onMenu}
        className="text-text-primary"
        aria-label="Open navigation"
      >
        <Menu className="h-space-6 w-space-6" strokeWidth={1.75} />
      </button>
    </header>
  );
}
