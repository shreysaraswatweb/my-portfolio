import { useState, useRef, useEffect } from "react";
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
import SmoothOverflow from "./SmoothOverflow";
import {
  FacebookMark,
  FigmaMark,
  GithubMark,
  InstagramMark,
} from "./icons/BrandIcons";
import Tooltip from "./ui/Tooltip";

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
  { id: "facebook", label: "Facebook", href: "#", Mark: FacebookMark },
  { id: "github", label: "GitHub", href: "#", Mark: GithubMark },
  { id: "figma", label: "Figma", href: "#", Mark: FigmaMark },
  { id: "instagram", label: "Instagram", href: "#", Mark: InstagramMark },
];

export default function Sidebar({
  active = "home",
  onNavigate,
  drawer = false,
  onClose,
}) {
  const scrollerRef = useRef(null);
  const [scrollState, setScrollState] = useState({
    canScrollUp: false,
    canScrollDown: false,
  });

  useEffect(() => {
    let cleanup = () => { };
    let frame = 0;

    const bind = () => {
      const el =
        scrollerRef.current?.wrapper instanceof HTMLElement
          ? scrollerRef.current.wrapper
          : scrollerRef.current instanceof HTMLElement
            ? scrollerRef.current
            : null;

      if (!el) {
        frame = requestAnimationFrame(bind);
        return;
      }

      const updateScroll = () => {
        const { scrollTop, scrollHeight, clientHeight } = el;
        const maxScroll = scrollHeight - clientHeight;
        const hasOverflow = maxScroll > 4;

        setScrollState({
          canScrollUp: hasOverflow && scrollTop > 4,
          canScrollDown: hasOverflow && scrollTop < maxScroll - 4,
        });
      };

      updateScroll();

      el.addEventListener("scroll", updateScroll, { passive: true });
      const lenis = scrollerRef.current?.lenis;
      if (lenis && typeof lenis.on === "function") {
        lenis.on("scroll", updateScroll);
      }

      const resizeObserver = new ResizeObserver(updateScroll);
      resizeObserver.observe(el);
      if (el.firstElementChild instanceof HTMLElement) {
        resizeObserver.observe(el.firstElementChild);
      }

      cleanup = () => {
        el.removeEventListener("scroll", updateScroll);
        if (lenis && typeof lenis.off === "function") {
          lenis.off("scroll", updateScroll);
        }
        resizeObserver.disconnect();
      };
    };

    bind();

    return () => {
      cancelAnimationFrame(frame);
      cleanup();
    };
  }, []);

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
            className="flex min-h-[44px] min-w-[44px] items-center justify-center -mr-2 text-text-secondary"
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

      <div className="relative min-h-0 flex-1 overflow-hidden rounded-md">
        {/* Top Faded Blur — appears only on scrolling side when scrolled down */}
        <div
          className={[
            "pointer-events-none absolute inset-x-0 top-0 z-20 h-12 rounded-md",
            "transition-opacity duration-500 ease-in-out",
            scrollState.canScrollUp ? "opacity-100" : "opacity-0",
          ].join(" ")}
          style={{
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            maskImage:
              "linear-gradient(to bottom, black 0%, rgba(0,0,0,0.5) 60%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 0%, rgba(0,0,0,0.5) 60%, transparent 100%)",
            background:
              "linear-gradient(to bottom, var(--color-surface-card) 25%, transparent 100%)",
            willChange: "opacity",
          }}
          aria-hidden="true"
        />

        <SmoothOverflow
          ref={scrollerRef}
          axis="y"
          className="h-full overflow-y-auto scrollbar-none"
        >
          <nav className="space-y-space-1 py-space-1">
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
                      : "hover-nav text-text-secondary",
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
        </SmoothOverflow>

        {/* Bottom Faded Blur — appears only on scrolling side when content can scroll down */}
        <div
          className={[
            "pointer-events-none absolute inset-x-0 bottom-0 z-20 h-12 rounded-md",
            "transition-opacity duration-500 ease-in-out",
            scrollState.canScrollDown ? "opacity-100" : "opacity-0",
          ].join(" ")}
          style={{
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            maskImage:
              "linear-gradient(to top, black 0%, rgba(0,0,0,0.5) 60%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to top, black 0%, rgba(0,0,0,0.5) 60%, transparent 100%)",
            background:
              "linear-gradient(to top, var(--color-surface-card) 25%, transparent 100%)",
            willChange: "opacity",
          }}
          aria-hidden="true"
        />
      </div>

      <footer className="mt-space-4 shrink-0 border-t border-border-hairline pt-space-4">
        <p className="mb-space-2 text-caption text-text-secondary">Theme</p>
        <div className="mb-space-4">
          <ThemeToggle compact />
        </div>
        <p className="mb-space-2 text-caption text-text-secondary">
          Let&apos;s Connect
        </p>
        <div className="mb-space-4 flex gap-space-2">
          {connect.map(({ id, label, href, Mark }) => (
            <Tooltip key={id} content={label} side="top">
              <a
                href={href}
                aria-label={label}
                className="hover-icon flex h-space-10 w-space-10 items-center justify-center rounded-md border border-border-hairline bg-surface-secondary text-text-primary"
              >
                <Mark className="h-space-5 w-space-5" />
              </a>
            </Tooltip>
          ))}
        </div>
        <p className="text-micro text-text-tertiary">
          © {new Date().getFullYear()} {profile.displayName} — {profile.role}
        </p>
      </footer>
    </GlassCard>
  );
}
