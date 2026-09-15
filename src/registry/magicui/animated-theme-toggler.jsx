import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { flushSync } from "react-dom";

import { cn } from "@/lib/utils";
import { getThemeTransitionClipPaths } from "@/lib/theme-transition";
import { ThemeContext } from "@/theme/ThemeProvider";
import Tooltip from "@/components/ui/Tooltip";

/**
 * AnimatedThemeToggler - Magic UI
 * Smooth theme toggle button using View Transitions API and animated clip-path masks.
 */
export function AnimatedThemeToggler({
  className,
  duration = 400,
  variant = "circle",
  fromCenter = false,
  theme,
  onThemeChange,
  ...props
}) {
  const themeCtx = useContext(ThemeContext);
  const isControlled = theme !== undefined;
  const [internalIsDark, setInternalIsDark] = useState(() => {
    if (typeof document === "undefined") return false;
    return (
      document.documentElement.classList.contains("dark") ||
      document.documentElement.dataset.theme === "dark"
    );
  });

  const isDark = isControlled
    ? theme === "dark"
    : themeCtx
      ? themeCtx.resolved === "dark"
      : internalIsDark;

  const buttonRef = useRef(null);
  const isTransitioningRef = useRef(false);
  const activeAnimRef = useRef(null);

  const cancelAnim = useCallback(() => {
    try {
      activeAnimRef.current?.cancel();
    } catch {
      // ignore
    }
    activeAnimRef.current = null;
  }, []);

  useEffect(() => {
    return () => {
      cancelAnim();
      const root = document.documentElement;
      if (root.dataset.magicuiThemeVt !== "active") return;
      delete root.dataset.magicuiThemeVt;
      root.style.removeProperty("--magicui-theme-toggle-vt-duration");
      root.style.removeProperty("--magicui-theme-vt-clip-from");
    };
  }, [cancelAnim]);

  useEffect(() => {
    if (isControlled) return;

    const updateTheme = () => {
      const root = document.documentElement;
      const darkActive =
        root.classList.contains("dark") || root.dataset.theme === "dark";
      setInternalIsDark(darkActive);
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });

    return () => observer.disconnect();
  }, [isControlled]);

  const toggleTheme = useCallback(
    (e) => {
      props.onClick?.(e);
      if (e?.defaultPrevented) return;

      const button = buttonRef.current;
      if (
        !button ||
        isTransitioningRef.current ||
        document.documentElement.dataset.magicuiThemeVt === "active"
      ) {
        return;
      }

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let x;
      let y;
      if (fromCenter) {
        x = viewportWidth / 2;
        y = viewportHeight / 2;
      } else {
        const { top, left, width, height } = button.getBoundingClientRect();
        x = left + width / 2;
        y = top + height / 2;
      }

      const maxRadius = Math.hypot(
        Math.max(x, viewportWidth - x),
        Math.max(y, viewportHeight - y),
      );

      const nextTheme = !isDark ? "dark" : "light";

      const applyTheme = () => {
        const root = document.documentElement;
        root.dataset.theme = nextTheme;
        root.style.colorScheme = nextTheme;
        root.classList.toggle("dark", nextTheme === "dark");

        if (isControlled) {
          onThemeChange?.(nextTheme);
        } else if (themeCtx?.setPreference) {
          themeCtx.setPreference(nextTheme);
        } else {
          setInternalIsDark(nextTheme === "dark");
          try {
            window.localStorage.setItem("shrey-portfolio-theme", nextTheme);
            window.localStorage.setItem("theme", nextTheme);
          } catch {
            // ignore storage quota issues
          }
        }
      };

      if (
        typeof document.startViewTransition !== "function" ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        applyTheme();
        return;
      }

      const clipPath = getThemeTransitionClipPaths(
        variant,
        x,
        y,
        maxRadius,
        viewportWidth,
        viewportHeight,
      );

      const root = document.documentElement;
      root.dataset.magicuiThemeVt = "active";
      root.style.setProperty(
        "--magicui-theme-toggle-vt-duration",
        `${duration}ms`,
      );
      root.style.setProperty("--magicui-theme-vt-clip-from", clipPath[0]);

      const cleanup = () => {
        isTransitioningRef.current = false;
        delete root.dataset.magicuiThemeVt;
        root.style.removeProperty("--magicui-theme-toggle-vt-duration");
        root.style.removeProperty("--magicui-theme-vt-clip-from");
        cancelAnim();
      };

      isTransitioningRef.current = true;
      let transition;
      try {
        transition = document.startViewTransition(() => {
          flushSync(applyTheme);
        });
      } catch {
        cleanup();
        applyTheme();
        return;
      }

      if (typeof transition?.finished?.finally === "function") {
        transition.finished.finally(cleanup).catch(() => { });
      } else {
        cleanup();
      }

      const ready = transition?.ready;
      if (ready && typeof ready.then === "function") {
        ready
          .then(() => {
            const anim = root.animate(
              {
                clipPath,
              },
              {
                duration,
                easing: variant === "star" ? "linear" : "ease-in-out",
                fill: "forwards",
                pseudoElement: "::view-transition-new(root)",
              },
            );
            activeAnimRef.current = anim;
          })
          .catch(() => { });
      }
    },
    [
      isDark,
      isControlled,
      variant,
      fromCenter,
      duration,
      onThemeChange,
      themeCtx,
      cancelAnim,
      props,
    ],
  );

  const tooltipLabel = isDark ? "Switch to light theme" : "Switch to dark theme";

  return (
    <Tooltip content={tooltipLabel} side="bottom">
      <button
        type="button"
        ref={buttonRef}
        onClick={toggleTheme}
        aria-label={tooltipLabel}
        className={cn(
          "group relative inline-flex h-space-9 w-space-9 items-center justify-center rounded-full border border-border-hairline bg-surface-pill/80 text-text-primary backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-surface-elevated hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-primary/50",
          className,
        )}
        {...props}
      >
        <div className="relative flex items-center justify-center">
          <Sun
            className={cn(
              "h-space-4 w-space-4 transition-all duration-300",
              isDark
                ? "rotate-0 scale-100 opacity-100 text-amber-400"
                : "-rotate-90 scale-0 opacity-0 absolute",
            )}
            strokeWidth={2}
          />
          <Moon
            className={cn(
              "h-space-4 w-space-4 transition-all duration-300",
              isDark
                ? "rotate-90 scale-0 opacity-0 absolute"
                : "rotate-0 scale-100 opacity-100 text-indigo-400",
            )}
            strokeWidth={2}
          />
        </div>
        <span className="sr-only">Toggle theme</span>
      </button>
    </Tooltip>
  );
}

export function AnimatedThemeTogglerDemo() {
  return (
    <div className="flex justify-center p-6">
      <AnimatedThemeToggler />
    </div>
  );
}

export default AnimatedThemeToggler;
