import {
  Briefcase,
  FolderKanban,
  Home,
  Mail,
  Menu,
  Newspaper,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { navItems, profile } from "../data/profile";
import AvatarFrame from "./AvatarFrame";
import ThemeToggle from "./ThemeToggle";
import GlassCard from "./ui/GlassCard";
import {
  FacebookMark,
  FigmaMark,
  GithubMark,
  InstagramMark,
} from "./icons/BrandIcons";

const navIcons = {
  home: Home,
  about: User,
  projects: FolderKanban,
  skills: Sparkles,
  experience: Briefcase,
  blog: Newspaper,
  contact: Mail,
};

const connect = [
  { id: "facebook", href: "#", Mark: FacebookMark },
  { id: "github", href: "#", Mark: GithubMark },
  { id: "figma", href: "#", Mark: FigmaMark },
  { id: "instagram", href: "#", Mark: InstagramMark },
];

export default function Sidebar({
  active = "home",
  onNavigate,
  drawer = false,
  onClose,
}) {
  return (
    <GlassCard
      as="aside"
      className={[
        "flex min-h-0 w-sidebar shrink-0 flex-col overflow-hidden px-space-4 py-space-5",
        drawer
          ? "fixed inset-y-0 left-0 z-50 h-screen rounded-none shadow-card"
          : "sticky top-space-6 my-space-6 ml-space-6 h-[calc(100vh-3rem)] max-h-[calc(100vh-3rem)] self-start rounded-xl",
      ].join(" ")}
    >
      <div className="mb-space-5 flex shrink-0 items-center gap-space-3">
        <span className="flex h-space-10 w-space-10 items-center justify-center rounded-md bg-accent-gradient font-display text-body-lg text-text-fixed-light">
          {profile.initials}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-body font-medium text-text-primary">
            {profile.displayName}
          </p>
          <p className="truncate text-caption text-text-secondary">
            {profile.role}
          </p>
        </div>
        {drawer ? (
          <button
            type="button"
            onClick={onClose}
            className="text-text-secondary"
            aria-label="Close menu"
          >
            <X className="h-space-5 w-space-5" />
          </button>
        ) : (
          <Menu className="h-space-5 w-space-5 text-text-secondary" />
        )}
      </div>

      <div className="mb-space-5 flex shrink-0 justify-center pb-space-2">
        <AvatarFrame size="desktop" showBadge />
      </div>

      <nav className="min-h-0 flex-1 space-y-space-1 overflow-y-auto pr-space-1 scrollbar-none">
        {navItems.map((item) => {
          const Icon = navIcons[item.id];
          const isActive = active === item.id;
          return (
            <a
              key={item.id}
              href={item.href}
              onClick={() => onNavigate?.(item.id)}
              className={[
                "flex items-center gap-space-3 rounded-lg px-space-4 py-space-3 text-body",
                isActive
                  ? "bg-nav-active-fill text-text-primary"
                  : "text-text-secondary hover:bg-surface-secondary",
              ].join(" ")}
            >
              <Icon
                className={[
                  "h-space-5 w-space-5",
                  isActive ? "text-accent-primary" : "",
                ].join(" ")}
                strokeWidth={1.75}
              />
              {item.label}
            </a>
          );
        })}
      </nav>

      <div className="mt-space-4 shrink-0 border-t border-border-hairline pt-space-4">
        <p className="mb-space-2 text-caption text-text-secondary">Theme</p>
        <div className="mb-space-4">
          <ThemeToggle compact />
        </div>
        <p className="mb-space-2 text-caption text-text-secondary">
          Let&apos;s Connect
        </p>
        <div className="mb-space-4 flex gap-space-2">
          {connect.map(({ id, href, Mark }) => (
            <a
              key={id}
              href={href}
              className="flex h-space-10 w-space-10 items-center justify-center rounded-md border border-border-hairline bg-surface-secondary text-text-primary transition-colors hover:bg-surface-pill"
            >
              <Mark className="h-space-5 w-space-5" />
            </a>
          ))}
        </div>
        <p className="text-micro text-text-tertiary">
          © {new Date().getFullYear()} {profile.displayName}
        </p>
      </div>
    </GlassCard>
  );
}
