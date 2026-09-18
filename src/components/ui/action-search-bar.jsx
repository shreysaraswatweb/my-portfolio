import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useLenis } from "lenis/react";
import {
  Briefcase,
  Command,
  CornerDownLeft,
  FolderKanban,
  Home,
  Mail,
  Moon,
  Newspaper,
  Search,
  Sparkles,
  Sun,
  User,
  X,
} from "lucide-react";
import { useTheme } from "../../theme/ThemeProvider";

/* Viscous damping for frame-rate independent inertial physics */
const damp = (current, target, lambda, dt) => {
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
};

/* Calm, elegant spring container animation */
const ANIMATION_VARIANTS = {
  container: {
    hidden: { opacity: 0, scale: 0.96, y: -10 },
    show: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 320,
        damping: 28,
        mass: 0.8,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.96,
      y: -10,
      transition: {
        duration: 0.15,
        ease: "easeInOut",
      },
    },
  },
  item: {
    hidden: { opacity: 0, y: 4 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.18,
        ease: "easeOut",
      },
    },
    exit: { opacity: 0, transition: { duration: 0.08 } },
  },
};

/* Backdrop animation */
const backdropVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.2, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15, ease: "easeIn" },
  },
};

export default function ActionSearchBar({ className = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const listRef = useRef(null);
  const targetScrollYRef = useRef(0);
  const wheelRafRef = useRef(null);
  const itemRefs = useRef([]);

  const listboxId = useId();
  const { preference, toggleThemeWithTransition } = useTheme();
  const lenis = useLenis();

  const actions = useMemo(
    () => [
      {
        id: "home",
        targetId: "home",
        label: "Home / Overview",
        description: "Jump to portfolio hero",
        icon: <Home className="h-4 w-4 text-accent-primary" />,
        section: "Navigation",
        keywords: ["home", "hero", "overview", "top", "intro", "main", "welcome"],
      },
      {
        id: "about",
        targetId: "about",
        label: "About Me",
        description: "Background, profile & credentials",
        icon: <User className="h-4 w-4 text-blue-400" />,
        section: "Navigation",
        keywords: ["about", "me", "bio", "background", "profile", "education", "experience", "shrey"],
      },
      {
        id: "projects",
        targetId: "projects",
        label: "Featured Projects",
        description: "Client work & case studies",
        icon: <FolderKanban className="h-4 w-4 text-amber-400" />,
        section: "Navigation",
        keywords: ["projects", "work", "case studies", "portfolio", "code", "apps", "client", "showcase"],
      },
      {
        id: "skills",
        targetId: "skills",
        label: "Skills & Tech Stack",
        description: "Frontend tools & proficiency",
        icon: <Sparkles className="h-4 w-4 text-purple-400" />,
        section: "Navigation",
        keywords: ["skills", "tech", "stack", "frontend", "react", "angular", "tools", "javascript", "typescript", "tailwind"],
      },
      {
        id: "experience",
        targetId: "experience",
        label: "Work Experience",
        description: "Roles, history & achievements",
        icon: <Briefcase className="h-4 w-4 text-emerald-400" />,
        section: "Navigation",
        keywords: ["experience", "job", "career", "history", "timeline", "resume", "roles", "company", "minda"],
      },
      {
        id: "certifications",
        targetId: "blog",
        label: "Certifications & Articles",
        description: "Licensing, achievements & more work",
        icon: <Newspaper className="h-4 w-4 text-cyan-400" />,
        section: "Navigation",
        keywords: ["cert", "certification", "credentials", "articles", "blog", "license", "badges", "education"],
      },
      {
        id: "contact",
        targetId: "contact",
        label: "Let's Connect",
        description: "Get in touch & contact links",
        icon: <Mail className="h-4 w-4 text-rose-400" />,
        section: "Navigation",
        keywords: ["contact", "email", "reach", "hire", "message", "social", "connect", "github", "linkedin", "talk"],
      },
      {
        id: "toggle-theme",
        label: preference === "dark" ? "Switch to Light Theme" : "Switch to Dark Theme",
        description: "Toggle color appearance",
        icon:
          preference === "dark" ? (
            <Sun className="h-4 w-4 text-amber-400" />
          ) : (
            <Moon className="h-4 w-4 text-indigo-400" />
          ),
        section: "Preferences",
        keywords: ["theme", "dark", "light", "mode", "toggle", "sun", "moon", "appearance", "color"],
        onSelect: () => {
          toggleThemeWithTransition?.();
        },
      },
    ],
    [preference, toggleThemeWithTransition],
  );

  const filteredActions = useMemo(() => {
    if (!query.trim()) return actions;
    const q = query.toLowerCase().trim();
    return actions.filter(
      (action) =>
        action.label.toLowerCase().includes(q) ||
        action.description.toLowerCase().includes(q) ||
        action.section.toLowerCase().includes(q) ||
        action.keywords?.some((k) => k.toLowerCase().includes(q)),
    );
  }, [actions, query]);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    setQuery("");
    setActiveIndex(0);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    setActiveIndex(0);
  }, []);

  // Lock background scroll when modal is open
  useEffect(() => {
    if (!isOpen) return;

    // 1. Pause Lenis if running
    lenis?.stop();

    // 2. Lock document body and html scrolling with scrollbar compensation
    const originalBodyOverflow = document.body.style.overflow;
    const originalDocOverflow = document.documentElement.style.overflow;
    const originalBodyPadding = document.body.style.paddingRight;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalDocOverflow;
      document.body.style.paddingRight = originalBodyPadding;
      lenis?.start();
    };
  }, [isOpen, lenis]);

  // Inertial physics smooth scroll on the modal listbox
  useEffect(() => {
    if (!isOpen) return;
    const container = listRef.current;
    if (!container) return;

    targetScrollYRef.current = container.scrollTop;

    const handleWheel = (e) => {
      // Prevent wheel from propagating to background page
      e.stopPropagation();

      const maxScroll = container.scrollHeight - container.clientHeight;
      if (maxScroll <= 0) {
        e.preventDefault();
        return;
      }

      e.preventDefault();

      // Responsive natural scroll multiplier (1.35x gives fast, satisfying scroll)
      targetScrollYRef.current = Math.max(
        0,
        Math.min(maxScroll, targetScrollYRef.current + e.deltaY * 1.35),
      );

      // Start or continue viscous damping loop
      if (!wheelRafRef.current) {
        let lastTime = performance.now();

        const tick = (now) => {
          const dt = Math.min(32, now - lastTime) / 1000;
          lastTime = now;

          const current = container.scrollTop;
          const target = targetScrollYRef.current;
          // lambda=20: responsive, fluid glide without sluggishness or lag
          const next = damp(current, target, 20, dt);

          if (Math.abs(target - next) > 0.5) {
            container.scrollTop = next;
            wheelRafRef.current = requestAnimationFrame(tick);
          } else {
            container.scrollTop = target;
            wheelRafRef.current = null;
          }
        };

        wheelRafRef.current = requestAnimationFrame(tick);
      }
    };

    // Keep target in sync if user drags native scrollbar
    const handleNativeScroll = () => {
      if (!wheelRafRef.current) {
        targetScrollYRef.current = container.scrollTop;
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("scroll", handleNativeScroll, { passive: true });

    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("scroll", handleNativeScroll);
      if (wheelRafRef.current) {
        cancelAnimationFrame(wheelRafRef.current);
        wheelRafRef.current = null;
      }
    };
  }, [isOpen]);

  // Keep keyboard-selected item smoothly visible
  useEffect(() => {
    if (itemRefs.current[activeIndex]) {
      itemRefs.current[activeIndex].scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
      setTimeout(() => {
        if (listRef.current) {
          targetScrollYRef.current = listRef.current.scrollTop;
        }
      }, 100);
    }
  }, [activeIndex]);

  // Select action and redirect with smooth inertia
  const handleSelect = useCallback(
    (action) => {
      if (!action) return;

      // 1. Immediately unlock native scrolling and Lenis
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      lenis?.start();

      // 2. Close modal
      setIsOpen(false);
      setQuery("");
      setActiveIndex(0);

      // 3. Smoothly redirect to that section
      if (action.targetId) {
        requestAnimationFrame(() => {
          setTimeout(() => {
            const el = document.getElementById(action.targetId);
            if (el) {
              if (lenis && typeof lenis.scrollTo === "function") {
                lenis.scrollTo(el, {
                  offset: -24,
                  duration: 1.15,
                  easing: (t) => (t === 1 ? 1 : 1.001 * (1 - 2 ** (-10 * t))),
                });
              } else {
                el.scrollIntoView({ behavior: "smooth", block: "start" });
              }

              try {
                window.history.pushState(null, "", `#${action.targetId}`);
              } catch {
                // ignore
              }
            }
          }, 40);
        });
      } else if (typeof action.onSelect === "function") {
        action.onSelect();
      }
    },
    [lenis],
  );

  // Global Keyboard Shortcut: ⌘K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        if (!isOpen) {
          setTimeout(() => inputRef.current?.focus(), 50);
        }
      } else if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  // Click outside listener
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside, { passive: true });
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen, handleClose]);

  const handleInputKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!filteredActions.length) return;
      setActiveIndex((prev) =>
        prev < filteredActions.length - 1 ? prev + 1 : 0,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!filteredActions.length) return;
      setActiveIndex((prev) =>
        prev > 0 ? prev - 1 : filteredActions.length - 1,
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      const current = filteredActions[activeIndex] || filteredActions[0];
      if (current) {
        handleSelect(current);
      }
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Compact Trigger Button */}
      <button
        type="button"
        onClick={handleOpen}
        aria-label="Open command palette (⌘K)"
        className="group flex h-7 items-center gap-1.5 rounded-md px-2 text-caption text-text-secondary transition-colors duration-200 hover:text-text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent-primary"
      >
        <Search className="h-3.5 w-3.5 transition-colors duration-200 group-hover:text-accent-primary" />
        <span className="hidden sm:inline font-normal text-text-secondary/80">
          Quick command
        </span>
        <kbd className="inline-flex h-4.5 select-none items-center gap-0.5 rounded border border-border-hairline bg-surface-secondary px-1 font-mono text-[10px] font-medium text-text-tertiary">
          <span className="text-[9px]">⌘</span>K
        </kbd>
      </button>

      {/* Modal / Action Palette — portaled to body */}
      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <div
              className="fixed inset-0 z-[9999] flex items-start justify-center p-space-4 pt-16 sm:pt-24"
              data-lenis-prevent="true"
              data-lenis-prevent-vertical="true"
            >
              {/* Backdrop */}
              <motion.div
                variants={backdropVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                onClick={handleClose}
                onWheel={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onTouchMove={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm"
                aria-hidden="true"
              />

              {/* Dropdown Container */}
              <motion.div
                ref={dropdownRef}
                role="dialog"
                aria-modal="true"
                aria-label="Command Palette"
                variants={ANIMATION_VARIANTS.container}
                initial="hidden"
                animate="show"
                exit="exit"
                className="relative z-10 w-full max-w-lg overflow-hidden rounded-lg border border-border-glass bg-surface-elevated/95 p-0 shadow-card backdrop-blur-glass"
              >
                {/* Search Input Bar */}
                <div className="flex items-center border-b border-border-hairline px-space-4 py-space-3">
                  <Search className="mr-space-3 h-4 w-4 shrink-0 text-text-secondary" />
                  <input
                    ref={inputRef}
                    type="text"
                    role="combobox"
                    aria-expanded="true"
                    aria-controls={listboxId}
                    aria-autocomplete="list"
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setActiveIndex(0);
                    }}
                    onKeyDown={handleInputKeyDown}
                    placeholder="Type a command or search..."
                    className="w-full bg-transparent font-ui text-body text-text-primary placeholder:text-text-tertiary focus:outline-none"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => {
                        setQuery("");
                        setActiveIndex(0);
                        inputRef.current?.focus();
                      }}
                      className="p-1 text-text-tertiary hover:text-text-primary"
                      aria-label="Clear search"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleClose}
                    className="ml-space-2 rounded border border-border-hairline bg-surface-secondary px-1.5 py-0.5 text-micro text-text-tertiary hover:text-text-primary"
                  >
                    ESC
                  </button>
                </div>

                {/* Action List with responsive inertial physics smooth scroll */}
                <ul
                  ref={listRef}
                  id={listboxId}
                  role="listbox"
                  style={{
                    overscrollBehavior: "contain",
                    WebkitOverflowScrolling: "touch",
                  }}
                  className="max-h-80 overflow-y-auto p-space-3 space-y-1 scrollbar-none"
                >
                  {filteredActions.length === 0 ? (
                    <li className="px-space-4 py-space-6 text-center text-caption text-text-tertiary">
                      No matching actions found for &ldquo;{query}&rdquo;.
                      <p className="mt-1 text-micro text-text-secondary">
                        Try searching for &ldquo;projects&rdquo;, &ldquo;skills&rdquo;, &ldquo;experience&rdquo;, &ldquo;about&rdquo;, or &ldquo;contact&rdquo;.
                      </p>
                    </li>
                  ) : (
                    filteredActions.map((action, idx) => {
                      const isSelected = activeIndex === idx;
                      return (
                        <motion.li
                          key={action.id}
                          ref={(el) => (itemRefs.current[idx] = el)}
                          role="option"
                          aria-selected={isSelected}
                          variants={ANIMATION_VARIANTS.item}
                          onMouseEnter={() => setActiveIndex(idx)}
                          onClick={() => handleSelect(action)}
                          whileHover={{
                            x: 2,
                            transition: { duration: 0.2, ease: "easeOut" },
                          }}
                          whileTap={{
                            scale: 0.985,
                            transition: { duration: 0.1, ease: "easeOut" },
                          }}
                          className={`relative flex cursor-pointer select-none items-center justify-between rounded-md px-space-4 py-space-3 transition-colors duration-200 ${
                            isSelected
                              ? "text-text-primary"
                              : "text-text-secondary hover:text-text-primary"
                          }`}
                        >
                          {/* Calm, silky spring floating pill highlight */}
                          {isSelected && (
                            <motion.div
                              layoutId="searchActiveItemHighlight"
                              className="absolute inset-0 rounded-md bg-surface-pill border border-border-hairline/80 shadow-sm -z-10"
                              transition={{
                                type: "spring",
                                stiffness: 220,
                                damping: 28,
                                mass: 0.8,
                              }}
                            />
                          )}

                          <div className="flex items-center gap-space-4">
                            <motion.span
                              animate={{ scale: isSelected ? 1.05 : 1 }}
                              transition={{ duration: 0.22, ease: "easeOut" }}
                              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-surface-secondary"
                            >
                              {action.icon}
                            </motion.span>
                            <div>
                              <p className="text-body font-medium leading-tight text-text-primary">
                                {action.label}
                              </p>
                              <p className="mt-1.5 text-micro text-text-secondary">
                                {action.description}
                              </p>
                            </div>
                          </div>

                          <AnimatePresence>
                            {isSelected && (
                              <motion.div
                                initial={{ opacity: 0, x: -4 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 4 }}
                                transition={{
                                  duration: 0.18,
                                  ease: "easeOut",
                                }}
                                className="flex items-center gap-1.5 text-micro text-text-tertiary"
                              >
                                <span>Select</span>
                                <CornerDownLeft className="h-3 w-3" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.li>
                      );
                    })
                  )}
                </ul>

                {/* Footer hint */}
                <div className="flex items-center justify-between border-t border-border-hairline bg-surface-secondary/40 px-space-4 py-space-2 text-micro text-text-tertiary">
                  <span className="flex items-center gap-1">
                    <Command className="h-3 w-3" /> Navigation & actions
                  </span>
                  <span>Use ↑↓ to navigate, ↵ to select</span>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </div>
  );
}
